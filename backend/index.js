require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
      "https://b12-m11-session.web.app",
    ],
    credentials: true,
    optionSuccessStatus: 200,
  })
);
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
        let cursor = loanCollection.find();
        if (limit > 0) cursor = cursor.limit(limit);
        const result = await cursor.toArray();
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
    app.put("/loans/:id", async (req, res) => {
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
    app.delete("/loans/:id", async (req, res) => {
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
    app.post("/apply-loans", async (req, res) => {
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

    //get loan application
    app.get("/apply-loans", async (req, res) => {
      const result = await loanApplicationCollection.find().toArray();
      res.send(result);
    });

    //view loan details
    app.get("/apply-loans/:id", async (req, res) => {
      const id = req.params.id;
      const loan = await loanApplicationCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(loan);
    });

    //approved loan
    app.patch("/apply-loans/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      try {
        const loan = await loanApplicationCollection.findOne(query);
        if (!loan) {
          return res.status(404).send({ message: "Loan not found" });
        }

        const approvedLoan = {
          ...loan,
          status: "Approved",
          approvedAt: new Date().toISOString(),
        };

        await approveLoanCollection.insertOne(approvedLoan);

        await loanApplicationCollection.deleteOne(query);

        await usersCollection.updateOne(
          { email: loan.userEmail },
          {
            $inc: { totalPending: -1, totalApproved: 1 },
          }
        );

        res.send({
          success: true,
          message: "Loan approved and moved successfully",
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred", error });
      }
    });

    //delete loan
    app.delete("/apply-loans/:id", async (req, res) => {
      const id = req.params.id;
      const deleted = await loanApplicationCollection.deleteOne({
        _id: new ObjectId(id),
      });

      if (loan) {
        await usersCollection.updateOne(
          { email: loan.userEmail },
          { $inc: { totalPending: -1 } }
        );
      }

      res.send(deleted);
    });

    //get all approved loan
    app.get("/approved-loans", async (req, res) => {
      const result = await approveLoanCollection.find().toArray();
      res.send(result);
    });

    //delete approved loan
    app.delete("/approved-loans/:id", async (req, res) => {
      const id = req.params.id;
      const deleted = await approveLoanCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(deleted);
    });

    //view approved loan details
    app.get("/approved-loans/:id", async (req, res) => {
      const id = req.params.id;
      const loan = await approveLoanCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(loan);
    });

    //save and update user
    app.post("/user", async (req, res) => {
      const userData = req.body;

      const query = {
        email: userData.email,
      };

      const alreadyExists = await usersCollection.findOne(query);
      console.log("User already exists---> ", !!alreadyExists);

      if (alreadyExists) {
        console.log("Updating user info---> ");
        const result = await usersCollection.updateOne(query, {
          $set: { last_loggedIn: new Date().toISOString() },
        });
        return res.send(result);
      }
      const newUser = {
        ...userData,
        created_at: new Date().toISOString(),
        last_loggedIn: new Date().toISOString(),
        role: "borrower",

        // 🎯 Initial stats
        totalApplied: 0,
        totalPending: 0,
        totalApproved: 0,
      };

      console.log("saving new user info---> ");
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
