require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const admin = require("firebase-admin");
const port = process.env.PORT || 3000;
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
  "utf-8"
);
const serviceAccount = JSON.parse(decoded);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:3000", // For any local backend testing
      "https://loanlinkph.netlify.app",
      "http://loanlinkph.netlify.app",
    ],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

// app.use(cors());

app.use(express.json());

// jwt middlewares
const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).send({ message: "Unauthorized Access!" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    console.log(decoded);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ message: "Unauthorized Access!", err });
  }
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const db = client.db("loansDB");
    const loanCollection = db.collection("loan_options");
    const loanApplicationCollection = db.collection("loan_applications");
    const approveLoanCollection = db.collection("approved_loan");
    const usersCollection = db.collection("users");

    //role middlewares
    const verifyADMIN = async (req, res, next) => {
      const email = req.tokenEmail;
      const user = await usersCollection.findOne({ email });

      if (user?.role !== "admin")
        return res
          .status(403)
          .send({ message: "Admin only Actions", role: user?.role });

      next();
    };
    const verifyManager = async (req, res, next) => {
      const email = req.tokenEmail;
      const user = await usersCollection.findOne({ email });

      if (user?.role !== "manager")
        return res
          .status(403)
          .send({ message: "Seller only Actions", role: user?.role });

      next();
    };

    // Create a Checkout session
    app.post("/create-checkout-session", async (req, res) => {
      const { loanId, customerEmail } = req.body;

      try {
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: { name: "Loan Application Fee" },
                unit_amount: 10 * 100,
              },
              quantity: 1,
            },
          ],
          customer_email: customerEmail,
          mode: "payment",
          metadata: { loanId },
          // Redirect after payment
          success_url: `${process.env.CLIENT_URL}/dashboard/payment-success?loanId=${loanId}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.CLIENT_URL}/dashboard/payment-cancel?loanId=${loanId}`,
        });

        res.send({ url: session.url });
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Stripe session failed" });
      }
    });

    app.patch("/apply-loans/:id/pay-fee", async (req, res) => {
      const { paymentId } = req.body;
      const loanId = req.params.id;

      if (!paymentId)
        return res.status(400).send({ message: "paymentId required" });

      try {
        const result = await loanApplicationCollection.updateOne(
          { _id: new ObjectId(loanId) },
          {
            $set: {
              applicationStatus: "Paid",
              paymentId,
              paidAt: new Date().toISOString(),
            },
          }
        );

        if (result.matchedCount === 0)
          return res.status(404).send({ message: "Loan not found" });

        res.send({ success: true, message: "Payment recorded" });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to update loan", err });
      }
    });

    //retrieve payment details
    app.get("/payment-details/:sessionId", async (req, res) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          req.params.sessionId
        );

        if (!session.payment_intent) {
          return res.status(400).send({ message: "Payment not completed yet" });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent
        );
        res.send(paymentIntent);
      } catch (error) {
        res.status(400).send({ message: error.message });
      }
    });

    //save loan option in db
    app.post("/loans", async (req, res) => {
      const loanData = {
        ...req.body,
        availability: "available",
      };
      const result = await loanCollection.insertOne(loanData);
      res.send(result);
    });

    //get loan options
    app.get("/loans", async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 0;
        let cursor = loanCollection.find({ availability: "available" });
        if (limit > 0) cursor = cursor.limit(limit);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
      }
    });

    // get all loans (for admin dashboard / all loans page)
    app.get("/loans/all", verifyJWT, verifyADMIN, async (req, res) => {
      try {
        const result = await loanCollection.find().toArray(); // no availability filter
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
      }
    });

    //get single loan
    app.get("/loans/:id", async (req, res) => {
      const id = req.params.id;
      const result = await loanCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // update loan option
    app.put("/loans/:id", verifyJWT, verifyADMIN, async (req, res) => {
      try {
        const id = req.params.id;
        const updateLoanData = req.body;

        const updatedDoc = {
          $set: {
            ...updateLoanData,
          },
        };

        const result = await loanCollection.updateOne(
          { _id: new ObjectId(id) },
          updatedDoc
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Loan not found" });
        }

        res.send({
          message: "Loan updated successfully",
          result,
        });
      } catch (error) {
        console.error("Error updating loan:", error);
        res.status(500).send({ message: "Failed to update loan" });
      }
    });

    //delete loan option
    app.delete("/loans/:id", verifyJWT, verifyADMIN, async (req, res) => {
      const { id } = req.params;

      try {
        const result = await loanCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Loan not found" });
        }
        res.json({ message: "Loan deleted successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete loan" });
      }
    });

    //post loan application
    app.post("/apply-loans", verifyJWT, async (req, res) => {
      try {
        const applyLoanData = {
          ...req.body,
          status: "Pending",
          applicationStatus: "Unpaid",
          date: new Date().toISOString(),
        };

        const result = await loanApplicationCollection.insertOne(applyLoanData);

        await usersCollection.updateOne(
          { email: applyLoanData.userEmail },
          { $inc: { totalApplied: 1, totalPending: 1 } }
        );

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to submit loan application" });
      }
    });

    // Toggle loan availability (show on home switch)
    app.patch(
      "/loans/toggle-availability/:id",
      verifyJWT,
      verifyADMIN,
      async (req, res) => {
        const id = req.params.id;
        const { availability } = req.body;

        if (!["available", "unavailable"].includes(availability)) {
          return res
            .status(400)
            .send({ message: "Invalid availability state" });
        }

        const result = await loanCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { availability } }
        );

        res.send({
          success: true,
          message: `Loan is now ${availability}`,
          result,
        });
      }
    );

    // Get only Pending loans
    app.get("/pending-loans", verifyJWT, verifyManager, async (req, res) => {
      const result = await loanApplicationCollection
        .find({ status: "Pending" })
        .toArray();
      res.send(result);
    });

    //get all loan data for Borrower using email
    app.get("/apply-loans/user/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;

      if (req.tokenEmail !== email) {
        return res.status(403).send({ message: "Forbidden Access!" });
      }

      const result = await loanApplicationCollection
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });

    //view loan details
    app.get("/apply-loans/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const loan = await loanApplicationCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(loan);
    });

    //approved and reject loan
    app.patch(
      "/apply-loans/:id",
      verifyJWT,
      verifyManager,
      async (req, res) => {
        const id = req.params.id;

        const { status } = req.body || {};
        if (!status) {
          return res.status(400).send({ message: "Status is required" });
        }
        const query = { _id: new ObjectId(id) };

        try {
          const loan = await loanApplicationCollection.findOne(query);
          if (!loan) {
            return res.status(404).send({ message: "Loan not found" });
          }

          // Update common field
          const updateFields = {
            status,
          };

          // Handle approved
          if (status === "Approved") {
            updateFields.approvedAt = new Date().toISOString();

            await approveLoanCollection.insertOne({
              ...loan,
              ...updateFields,
            });

            await usersCollection.updateOne(
              { email: loan.userEmail },
              {
                $inc: { totalPending: -1, totalApproved: 1 },
              }
            );

            await loanApplicationCollection.updateOne(query, {
              $set: updateFields,
            });

            return res.send({
              success: true,
              message: "Loan approved successfully",
            });
          }

          // Handle rejected
          if (status === "Rejected") {
            updateFields.rejectedAt = new Date().toISOString();

            await usersCollection.updateOne(
              { email: loan.userEmail },
              {
                $inc: { totalPending: -1, totalRejected: 1 },
              }
            );

            await loanApplicationCollection.updateOne(query, {
              $set: updateFields,
            });

            return res.send({
              success: true,
              message: "Loan rejected successfully",
            });
          }

          res.status(400).send({ message: "Invalid status value" });
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "An error occurred", error });
        }
      }
    );

    // DELETE a loan application
    app.delete("/apply-loans/:id", verifyJWT, async (req, res) => {
      const { id } = req.params;

      try {
        // Find the loan first
        const loan = await loanApplicationCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!loan) {
          return res.status(404).json({ message: "Loan not found" });
        }

        // Delete the loan from the collection
        const result = await loanApplicationCollection.deleteOne({
          _id: new ObjectId(id),
        });

        // Update user's stats if needed
        if (loan.userEmail) {
          await usersCollection.updateOne(
            { email: loan.userEmail },
            { $inc: { totalPending: -1, totalApplied: -1 } }
          );
        }

        res.json({
          success: true,
          message: "Loan cancelled successfully",
          result,
        });
      } catch (error) {
        console.error("Failed to delete loan:", error);
        res
          .status(500)
          .json({ success: false, message: "Failed to cancel loan", error });
      }
    });

    //get all loan applications
    app.get("/apply-loans", verifyJWT, verifyADMIN, async (req, res) => {
      const result = await loanApplicationCollection.find().toArray();
      res.send(result);
    });
    //get all approved loan
    app.get("/approved-loans", verifyJWT, verifyManager, async (req, res) => {
      const result = await approveLoanCollection.find().toArray();
      res.send(result);
    });

    //delete approved loan
    app.delete(
      "/approved-loans/:id",
      verifyJWT,
      verifyManager,
      async (req, res) => {
        const id = req.params.id;
        const deleted = await approveLoanCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(deleted);
      }
    );

    //get admin stats
    app.get("/admin-stats", async (req, res) => {
      const totalLoans = await loanCollection.countDocuments();
      const approvedLoans = await loanCollection.countDocuments({
        status: "approved",
      });
      const rejectedLoans = await loanCollection.countDocuments({
        status: "rejected",
      });
      const totalUsers = await usersCollection.countDocuments();

      res.send({
        totalLoans,
        approvedLoans,
        rejectedLoans,
        totalUsers,
      });
    });

    //get manager stats
    app.get("/manager-stats", async (req, res) => {
      const managerEmail = req.query.email; // from frontend

      const loansAdded = await loanCollection.countDocuments({
        "manager.email": managerEmail,
      });

      const approved = await loanCollection.countDocuments({
        "manager.email": managerEmail,
        status: "approved",
      });

      const pending = await loanCollection.countDocuments({
        "manager.email": managerEmail,
        status: "pending",
      });

      res.send({
        loansAdded,
        approved,
        pending,
      });
    });

    //borrower stats
    app.get("/borrower-stats", async (req, res) => {
      const email = req.query.email;

      const totalApplied = await loanApplicationCollection.countDocuments({
        userEmail: email,
      });

      const approved = await loanApplicationCollection.countDocuments({
        userEmail: email,
        status: "Approved",
      });

      const rejected = await loanApplicationCollection.countDocuments({
        userEmail: email,
        status: "Rejected",
      });

      res.send({
        totalApplied,
        approved,
        rejected,
      });
    });

    //view approved loan details
    app.get(
      "/approved-loans/:id",
      verifyJWT,
      verifyManager,
      async (req, res) => {
        const id = req.params.id;
        const loan = await approveLoanCollection.findOne({
          _id: new ObjectId(id),
        });
        res.send(loan);
      }
    );

    //save and update user
    app.post("/user", async (req, res) => {
      const userData = req.body;
      const lowerEmail = userData.email.toLowerCase();
      userData.email = lowerEmail;
      console.log(userData);

      const query = { email: lowerEmail };
      const alreadyExists = await usersCollection.findOne(query);

      if (alreadyExists) {
        // Update last login + role if provided
        const updateDoc = {
          $set: {
            last_loggedIn: new Date().toISOString(),
            role: userData.role || alreadyExists.role || "borrower",
          },
        };
        const result = await usersCollection.updateOne(query, updateDoc);
        return res.send(result);
      }

      // New user
      const newUser = {
        ...userData,
        role: userData.role || "borrower", // default role
        created_at: new Date().toISOString(),
        last_loggedIn: new Date().toISOString(),
        totalApplied: 0,
        totalPending: 0,
        totalApproved: 0,
      };

      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    //get a users role
    app.get("/user/role", verifyJWT, async (req, res) => {
      console.log(req.tokenEmail);
      const result = await usersCollection.findOne({ email: req.tokenEmail });
      // console.log(result);
      res.send({ role: result?.role });
    });

    //get user info by email
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email });
      res.send(user);
    });

    //get all user info
    app.get("/user", verifyJWT, verifyADMIN, async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.patch("/user/suspend/:id", verifyJWT, verifyADMIN, async (req, res) => {
      const id = req.params.id;
      const { reason, feedback, suspendedAt } = req.body;

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "suspended",
            suspensionReason: reason,
            adminFeedback: feedback,
            suspendedAt,
          },
        }
      );

      res.send(result);
    });

    // update user role
    app.patch("/user/role/:id", verifyJWT, verifyADMIN, async (req, res) => {
      const id = req.params.id;
      const { role } = req.body;

      if (!role) return res.status(400).send({ message: "Role is required" });

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { role } }
      );

      res.send({ success: true, message: "Role updated", result });
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Server..");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
