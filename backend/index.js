require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const { ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const admin = require("firebase-admin");

// Import utilities and middleware
const config = require("./config");
const logger = require("./utils/logger");
const database = require("./utils/database");
const ResponseHelper = require("./utils/responseHelper");
const {
  errorHandler,
  notFoundHandler,
  asyncHandler,
} = require("./middleware/errorHandler");
const {
  validateLoanApplication,
  validateLoanCreation,
  validateUserRegistration,
  validateProfileUpdate,
  validateLoanStatusUpdate,
  validatePagination,
  validateObjectId,
} = require("./middleware/validation");
const {
  LOAN_STATUS,
  APPLICATION_STATUS,
  USER_ROLES,
  USER_STATUS,
  LOAN_AVAILABILITY,
  PAGINATION,
} = require("./utils/constants");

// Initialize Firebase Admin
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
  "utf-8"
);
const serviceAccount = JSON.parse(decoded);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.stripe.com"],
      },
    },
  })
);

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
app.use(cors(config.cors));

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});

// JWT verification middleware
const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];

  if (!token) {
    return ResponseHelper.error(res, 401, "Access token required");
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    req.tokenUid = decoded.uid;
    next();
  } catch (err) {
    logger.error("JWT verification failed:", err);
    return ResponseHelper.error(res, 401, "Invalid or expired token");
  }
});

// Role verification middleware
const verifyRole = (requiredRole) =>
  asyncHandler(async (req, res, next) => {
    const db = database.getDb();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email: req.tokenEmail });

    if (!user) {
      return ResponseHelper.error(res, 404, "User not found");
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      return ResponseHelper.error(res, 403, "Account suspended");
    }

    if (user.role !== requiredRole) {
      return ResponseHelper.error(res, 403, `${requiredRole} access required`);
    }

    req.user = user;
    next();
  });

// Initialize database connection and start server
async function initializeApp() {
  try {
    await database.connect();

    const db = database.getDb();
    const collections = {
      loanCollection: db.collection("loan_options"),
      loanApplicationCollection: db.collection("loan_applications"),
      approveLoanCollection: db.collection("approved_loan"),
      usersCollection: db.collection("users"),
    };

    // Health check endpoint
    app.get("/health", (req, res) => {
      ResponseHelper.success(res, 200, "Server is healthy", {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
      });
    });

    // User management endpoints
    app.post(
      "/user",
      validateUserRegistration,
      asyncHandler(async (req, res) => {
        const userData = req.body;
        const lowerEmail = userData.email.toLowerCase();
        userData.email = lowerEmail;

        const existingUser = await collections.usersCollection.findOne({
          email: lowerEmail,
        });

        if (existingUser) {
          // Determine role based on email for demo accounts
          let userRole = userData.role || existingUser.role;

          // Auto-assign roles for demo accounts
          if (lowerEmail === "admin@gmail.com") {
            userRole = USER_ROLES.ADMIN;
          } else if (lowerEmail === "manager@gmail.com") {
            userRole = USER_ROLES.MANAGER;
          } else if (lowerEmail === "rose@gmail.com") {
            userRole = USER_ROLES.BORROWER;
          } else if (!userRole) {
            userRole = USER_ROLES.BORROWER; // Default role
          }

          const updateDoc = {
            $set: {
              last_loggedIn: new Date().toISOString(),
              role: userRole,
            },
          };

          const result = await collections.usersCollection.updateOne(
            { email: lowerEmail },
            updateDoc
          );
          return ResponseHelper.success(
            res,
            200,
            "User login updated successfully",
            { updated: result.modifiedCount > 0, role: userRole }
          );
        }

        // Determine role for new user based on email for demo accounts
        let userRole = userData.role;

        if (lowerEmail === "admin@gmail.com") {
          userRole = USER_ROLES.ADMIN;
        } else if (lowerEmail === "manager@gmail.com") {
          userRole = USER_ROLES.MANAGER;
        } else if (lowerEmail === "rose@gmail.com") {
          userRole = USER_ROLES.BORROWER;
        } else if (!userRole) {
          userRole = USER_ROLES.BORROWER; // Default role
        }

        const newUser = {
          ...userData,
          role: userRole,
          status: USER_STATUS.ACTIVE,
          created_at: new Date().toISOString(),
          last_loggedIn: new Date().toISOString(),
          totalApplied: 0,
          totalPending: 0,
          totalApproved: 0,
          totalRejected: 0,
        };

        const result = await collections.usersCollection.insertOne(newUser);
        ResponseHelper.success(res, 201, "User created successfully", {
          id: result.insertedId,
        });
      })
    );

    app.get(
      "/user/role",
      verifyJWT,
      asyncHandler(async (req, res) => {
        const user = await collections.usersCollection.findOne({
          email: req.tokenEmail,
        });

        if (!user) {
          return ResponseHelper.error(res, 404, "User not found");
        }

        ResponseHelper.success(res, 200, "User role retrieved successfully", {
          role: user.role,
        });
      })
    );

    app.get(
      "/user/:email",
      asyncHandler(async (req, res) => {
        const email = req.params.email;
        const user = await collections.usersCollection.findOne(
          { email },
          {
            projection: {
              _id: 1,
              email: 1,
              name: 1,
              role: 1,
              bio: 1,
              profilePicture: 1,
              created_at: 1,
            },
          }
        );

        if (!user) {
          return ResponseHelper.error(res, 404, "User not found");
        }

        ResponseHelper.success(res, 200, "User retrieved successfully", user);
      })
    );

    app.put(
      "/user/:email",
      verifyJWT,
      validateProfileUpdate,
      asyncHandler(async (req, res) => {
        const email = req.params.email;
        const { displayName, bio, profilePicture } = req.body;

        if (req.tokenEmail !== email) {
          return ResponseHelper.error(res, 403, "Access denied");
        }

        const updateDoc = {
          $set: {
            displayName,
            bio,
            profilePicture,
            updatedAt: new Date().toISOString(),
          },
        };

        const result = await collections.usersCollection.updateOne(
          { email },
          updateDoc,
          { upsert: false }
        );

        if (result.matchedCount === 0) {
          return ResponseHelper.error(res, 404, "User not found");
        }

        ResponseHelper.success(res, 200, "Profile updated successfully");
      })
    );

    // Fix user role endpoint (for users without proper roles)
    app.patch(
      "/user/:email/role",
      verifyJWT,
      asyncHandler(async (req, res) => {
        const email = req.params.email;

        if (req.tokenEmail !== email) {
          return ResponseHelper.error(res, 403, "Access denied");
        }

        // Check if user exists and doesn't have a role
        const user = await collections.usersCollection.findOne({ email });

        if (!user) {
          return ResponseHelper.error(res, 404, "User not found");
        }

        // Determine the correct role based on email for demo accounts
        let correctRole = USER_ROLES.BORROWER; // Default

        const lowerEmail = email.toLowerCase();
        if (lowerEmail === "admin@gmail.com") {
          correctRole = USER_ROLES.ADMIN;
        } else if (lowerEmail === "manager@gmail.com") {
          correctRole = USER_ROLES.MANAGER;
        } else if (lowerEmail === "rose@gmail.com") {
          correctRole = USER_ROLES.BORROWER;
        }

        // If user doesn't have a role or has an invalid role, set the correct one
        if (
          !user.role ||
          !Object.values(USER_ROLES).includes(user.role) ||
          user.role !== correctRole
        ) {
          const updateDoc = {
            $set: {
              role: correctRole,
              updatedAt: new Date().toISOString(),
            },
          };

          await collections.usersCollection.updateOne({ email }, updateDoc);

          ResponseHelper.success(res, 200, "User role updated successfully", {
            role: correctRole,
          });
        } else {
          ResponseHelper.success(res, 200, "User role is already correct", {
            role: user.role,
          });
        }
      })
    );

    // Loan options endpoints
    app.get(
      "/loans",
      asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { availability: LOAN_AVAILABILITY.AVAILABLE };

        const [loans, total] = await Promise.all([
          collections.loanCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray(),
          collections.loanCollection.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limit);

        ResponseHelper.success(res, 200, "Loans retrieved successfully", {
          loans,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        });
      })
    );

    app.post(
      "/loans",
      verifyJWT,
      verifyRole(USER_ROLES.MANAGER),
      validateLoanCreation,
      asyncHandler(async (req, res) => {
        const loanData = {
          ...req.body,
          manager: {
            email: req.tokenEmail,
            name: req.user.name || req.user.displayName,
          },
          availability: LOAN_AVAILABILITY.AVAILABLE,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await collections.loanCollection.insertOne(loanData);

        ResponseHelper.success(res, 201, "Loan created successfully", {
          id: result.insertedId,
        });
      })
    );

    app.get(
      "/loans/:id",
      validateObjectId,
      asyncHandler(async (req, res) => {
        const loan = await collections.loanCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!loan) {
          return ResponseHelper.error(res, 404, "Loan not found");
        }

        ResponseHelper.success(res, 200, "Loan retrieved successfully", loan);
      })
    );

    // Loan applications endpoints
    app.get(
      "/apply-loans/user/:email",
      verifyJWT,
      asyncHandler(async (req, res) => {
        const email = req.params.email;

        if (req.tokenEmail !== email && req.user?.role !== USER_ROLES.ADMIN) {
          return ResponseHelper.error(res, 403, "Access denied");
        }

        const applications = await collections.loanApplicationCollection
          .find({ userEmail: email })
          .sort({ date: -1 })
          .toArray();

        ResponseHelper.success(
          res,
          200,
          "Loan applications retrieved successfully",
          applications
        );
      })
    );

    app.post(
      "/apply-loans",
      verifyJWT,
      validateLoanApplication,
      asyncHandler(async (req, res) => {
        const applicationData = {
          ...req.body,
          userEmail: req.tokenEmail,
          status: LOAN_STATUS.PENDING,
          applicationStatus: APPLICATION_STATUS.PENDING,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        const result = await collections.loanApplicationCollection.insertOne(
          applicationData
        );

        // Update user statistics
        await collections.usersCollection.updateOne(
          { email: req.tokenEmail },
          {
            $inc: {
              totalApplied: 1,
              totalPending: 1,
            },
          }
        );

        ResponseHelper.success(
          res,
          201,
          "Loan application submitted successfully",
          {
            id: result.insertedId,
          }
        );
      })
    );

    app.delete(
      "/apply-loans/:id",
      verifyJWT,
      validateObjectId,
      asyncHandler(async (req, res) => {
        const application = await collections.loanApplicationCollection.findOne(
          {
            _id: new ObjectId(req.params.id),
          }
        );

        if (!application) {
          return ResponseHelper.error(res, 404, "Loan application not found");
        }

        if (
          application.userEmail !== req.tokenEmail &&
          req.user?.role !== USER_ROLES.ADMIN
        ) {
          return ResponseHelper.error(res, 403, "Access denied");
        }

        if (application.status !== LOAN_STATUS.PENDING) {
          return ResponseHelper.error(
            res,
            400,
            "Cannot delete processed application"
          );
        }

        await collections.loanApplicationCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });

        // Update user statistics
        await collections.usersCollection.updateOne(
          { email: application.userEmail },
          {
            $inc: {
              totalApplied: -1,
              totalPending: -1,
            },
          }
        );

        ResponseHelper.success(
          res,
          200,
          "Loan application deleted successfully"
        );
      })
    );

    app.patch(
      "/apply-loans/:id/pay-fee",
      verifyJWT,
      validateObjectId,
      asyncHandler(async (req, res) => {
        const { paymentId } = req.body;

        if (!paymentId) {
          return ResponseHelper.error(res, 400, "Payment ID is required");
        }

        const application = await collections.loanApplicationCollection.findOne(
          {
            _id: new ObjectId(req.params.id),
          }
        );

        if (!application) {
          return ResponseHelper.error(res, 404, "Loan application not found");
        }

        if (application.userEmail !== req.tokenEmail) {
          return ResponseHelper.error(res, 403, "Access denied");
        }

        const result = await collections.loanApplicationCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          {
            $set: {
              paymentId,
              paymentStatus: "paid",
              paidAt: new Date().toISOString(),
            },
          }
        );

        ResponseHelper.success(res, 200, "Payment recorded successfully");
      })
    );

    // Payment details endpoint
    app.get(
      "/payment-details/:sessionId",
      verifyJWT,
      asyncHandler(async (req, res) => {
        try {
          const session = await stripe.checkout.sessions.retrieve(
            req.params.sessionId
          );
          ResponseHelper.success(
            res,
            200,
            "Payment details retrieved successfully",
            session
          );
        } catch (error) {
          logger.error("Stripe session retrieval failed:", error);
          return ResponseHelper.error(res, 404, "Payment session not found");
        }
      })
    );

    // Create Stripe checkout session
    app.post(
      "/create-checkout-session",
      verifyJWT,
      asyncHandler(async (req, res) => {
        try {
          const { loanId, customerEmail } = req.body;

          if (!loanId || !customerEmail) {
            return ResponseHelper.error(
              res,
              400,
              "Loan ID and customer email are required"
            );
          }

          // Verify the loan application exists and belongs to the user
          const loanApplication =
            await collections.loanApplicationCollection.findOne({
              _id: new ObjectId(loanId),
              userEmail: customerEmail,
            });

          if (!loanApplication) {
            return ResponseHelper.error(res, 404, "Loan application not found");
          }

          // Check if payment is already completed
          if (loanApplication.paymentId) {
            return ResponseHelper.error(
              res,
              400,
              "Payment already completed for this loan"
            );
          }

          // Create Stripe checkout session
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: "Loan Application Fee",
                    description: `Processing fee for loan application: ${loanApplication.loanTitle}`,
                  },
                  unit_amount: 1000, // $10.00 in cents
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: `${
              process.env.CLIENT_URL || "http://localhost:5175"
            }/dashboard/my-loans?session_id={CHECKOUT_SESSION_ID}&loanId=${loanId}`,
            cancel_url: `${
              process.env.CLIENT_URL || "http://localhost:5175"
            }/dashboard/my-loans?canceled=true`,
            customer_email: customerEmail,
            metadata: {
              loanId: loanId,
              customerEmail: customerEmail,
              loanTitle: loanApplication.loanTitle,
            },
          });

          ResponseHelper.success(
            res,
            200,
            "Checkout session created successfully",
            {
              url: session.url,
              sessionId: session.id,
            }
          );
        } catch (error) {
          logger.error("Stripe checkout session creation failed:", error);
          return ResponseHelper.error(
            res,
            500,
            "Failed to create payment session"
          );
        }
      })
    );

    // Test data endpoint (for development only)
    app.post(
      "/test/create-sample-data",
      verifyJWT,
      verifyRole(USER_ROLES.MANAGER),
      asyncHandler(async (req, res) => {
        const managerEmail = req.tokenEmail;

        // Create a sample loan product
        const sampleLoan = {
          title: "Personal Loan - Manager Test",
          category: "Personal",
          description: "A test personal loan for manager dashboard testing",
          documents: "National ID, Salary Slip, Bank Statement",
          interest: 12,
          emi: "12 Months",
          limit: 50000,
          image: "https://via.placeholder.com/400x300",
          manager: {
            email: managerEmail,
            name: req.user.name || req.user.displayName || "Manager",
          },
          availability: LOAN_AVAILABILITY.AVAILABLE,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const loanResult = await collections.loanCollection.insertOne(
          sampleLoan
        );
        const loanId = loanResult.insertedId.toString();

        // Create sample loan applications
        const sampleApplications = [
          {
            loanId: loanId,
            loanTitle: sampleLoan.title,
            userEmail: "rose@gmail.com",
            firstName: "Rose",
            lastName: "Johnson",
            loanAmount: 25000,
            status: "Pending",
            applicationStatus: "pending",
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
          {
            loanId: loanId,
            loanTitle: sampleLoan.title,
            userEmail: "john@example.com",
            firstName: "John",
            lastName: "Doe",
            loanAmount: 35000,
            status: "Approved",
            applicationStatus: "approved",
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            approvedAt: new Date().toISOString(),
            reviewedBy: managerEmail,
            reviewedAt: new Date().toISOString(),
          },
          {
            loanId: loanId,
            loanTitle: sampleLoan.title,
            userEmail: "jane@example.com",
            firstName: "Jane",
            lastName: "Smith",
            loanAmount: 15000,
            status: "Rejected",
            applicationStatus: "rejected",
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            reason: "Insufficient income verification",
            reviewedBy: managerEmail,
            reviewedAt: new Date().toISOString(),
          },
        ];

        await collections.loanApplicationCollection.insertMany(
          sampleApplications
        );

        ResponseHelper.success(res, 201, "Sample data created successfully", {
          loanId: loanId,
          applicationsCount: sampleApplications.length,
        });
      })
    );

    // Admin and Manager endpoints for loan management
    app.get(
      "/admin/loans",
      verifyJWT,
      asyncHandler(async (req, res) => {
        // Allow both admin and manager roles
        const user = await collections.usersCollection.findOne({
          email: req.tokenEmail,
        });

        if (!user) {
          return ResponseHelper.error(res, 404, "User not found");
        }

        if (
          user.role !== USER_ROLES.ADMIN &&
          user.role !== USER_ROLES.MANAGER
        ) {
          return ResponseHelper.error(
            res,
            403,
            "Admin or Manager access required"
          );
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [applications, total] = await Promise.all([
          collections.loanApplicationCollection
            .find({})
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .toArray(),
          collections.loanApplicationCollection.countDocuments({}),
        ]);

        const totalPages = Math.ceil(total / limit);

        ResponseHelper.success(
          res,
          200,
          "Loan applications retrieved successfully",
          {
            applications,
            pagination: {
              currentPage: page,
              totalPages,
              totalItems: total,
              itemsPerPage: limit,
              hasNext: page < totalPages,
              hasPrev: page > 1,
            },
          }
        );
      })
    );

    // Manager statistics endpoint
    app.get(
      "/manager-stats",
      verifyJWT,
      verifyRole(USER_ROLES.MANAGER),
      asyncHandler(async (req, res) => {
        const managerEmail = req.query.email || req.tokenEmail;

        // Get loan products created by this manager
        const loanProducts = await collections.loanCollection
          .find({
            "manager.email": managerEmail,
          })
          .toArray();

        // Get applications for loans created by this manager
        const loanIds = loanProducts.map((loan) => loan._id.toString());
        const applications = await collections.loanApplicationCollection
          .find({
            loanId: { $in: loanIds },
          })
          .toArray();

        // Calculate statistics
        const stats = {
          totalLoanProducts: loanProducts.length,
          totalApplications: applications.length,
          pendingApplications: applications.filter(
            (app) => app.status === "Pending" || app.status === "pending"
          ).length,
          approvedApplications: applications.filter(
            (app) => app.status === "Approved" || app.status === "approved"
          ).length,
          rejectedApplications: applications.filter(
            (app) => app.status === "Rejected" || app.status === "rejected"
          ).length,
          totalLoanAmount: loanProducts.reduce(
            (sum, loan) => sum + (parseFloat(loan.amount) || 0),
            0
          ),
          averageInterestRate:
            loanProducts.length > 0
              ? loanProducts.reduce(
                  (sum, loan) => sum + (parseFloat(loan.interestRate) || 0),
                  0
                ) / loanProducts.length
              : 0,
        };

        ResponseHelper.success(
          res,
          200,
          "Manager statistics retrieved successfully",
          stats
        );
      })
    );

    // Manager endpoints for loan applications
    app.get(
      "/manager/loans",
      verifyJWT,
      verifyRole(USER_ROLES.MANAGER),
      asyncHandler(async (req, res) => {
        const managerEmail = req.tokenEmail;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get loan products created by this manager
        const loanProducts = await collections.loanCollection
          .find({
            "manager.email": managerEmail,
          })
          .toArray();

        // Get applications for loans created by this manager
        const loanIds = loanProducts.map((loan) => loan._id.toString());

        const [applications, total] = await Promise.all([
          collections.loanApplicationCollection
            .find({
              loanId: { $in: loanIds },
            })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .toArray(),
          collections.loanApplicationCollection.countDocuments({
            loanId: { $in: loanIds },
          }),
        ]);

        const totalPages = Math.ceil(total / limit);

        ResponseHelper.success(
          res,
          200,
          "Manager loan applications retrieved successfully",
          {
            applications,
            pagination: {
              currentPage: page,
              totalPages,
              totalItems: total,
              itemsPerPage: limit,
              hasNext: page < totalPages,
              hasPrev: page > 1,
            },
          }
        );
      })
    );

    // Manager endpoint to update loan application status
    app.patch(
      "/manager/loans/:id/status",
      verifyJWT,
      verifyRole(USER_ROLES.MANAGER),
      validateObjectId,
      validateLoanStatusUpdate,
      asyncHandler(async (req, res) => {
        const { status, reason } = req.body;
        const managerEmail = req.tokenEmail;

        const application = await collections.loanApplicationCollection.findOne(
          {
            _id: new ObjectId(req.params.id),
          }
        );

        if (!application) {
          return ResponseHelper.error(res, 404, "Loan application not found");
        }

        // Verify that this application is for a loan created by this manager
        const loanProduct = await collections.loanCollection.findOne({
          _id: new ObjectId(application.loanId),
          "manager.email": managerEmail,
        });

        if (!loanProduct) {
          return ResponseHelper.error(
            res,
            403,
            "You can only manage applications for your own loan products"
          );
        }

        const updateDoc = {
          $set: {
            status,
            applicationStatus: status.toLowerCase(),
            updatedAt: new Date().toISOString(),
            reviewedBy: managerEmail,
            reviewedAt: new Date().toISOString(),
          },
        };

        if (reason) {
          updateDoc.$set.reason = reason;
        }

        if (status === LOAN_STATUS.APPROVED) {
          updateDoc.$set.approvedAt = new Date().toISOString();

          // Move to approved loans collection
          const approvedLoan = {
            ...application,
            ...updateDoc.$set,
            originalApplicationId: application._id,
          };

          await collections.approveLoanCollection.insertOne(approvedLoan);
        }

        await collections.loanApplicationCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          updateDoc
        );

        // Update user statistics
        const oldStatus = application.status;
        const userEmail = application.userEmail;

        const statUpdates = {};

        // Decrease old status count
        if (oldStatus === LOAN_STATUS.PENDING) statUpdates.totalPending = -1;
        else if (oldStatus === LOAN_STATUS.APPROVED)
          statUpdates.totalApproved = -1;
        else if (oldStatus === LOAN_STATUS.REJECTED)
          statUpdates.totalRejected = -1;

        // Increase new status count
        if (status === LOAN_STATUS.PENDING)
          statUpdates.totalPending = (statUpdates.totalPending || 0) + 1;
        else if (status === LOAN_STATUS.APPROVED)
          statUpdates.totalApproved = (statUpdates.totalApproved || 0) + 1;
        else if (status === LOAN_STATUS.REJECTED)
          statUpdates.totalRejected = (statUpdates.totalRejected || 0) + 1;

        if (Object.keys(statUpdates).length > 0) {
          await collections.usersCollection.updateOne(
            { email: userEmail },
            { $inc: statUpdates }
          );
        }

        ResponseHelper.success(res, 200, "Loan status updated successfully");
      })
    );

    app.patch(
      "/admin/loans/:id/status",
      verifyJWT,
      asyncHandler(async (req, res) => {
        // Allow both admin and manager roles
        const user = await collections.usersCollection.findOne({
          email: req.tokenEmail,
        });

        if (!user) {
          return ResponseHelper.error(res, 404, "User not found");
        }

        if (
          user.role !== USER_ROLES.ADMIN &&
          user.role !== USER_ROLES.MANAGER
        ) {
          return ResponseHelper.error(
            res,
            403,
            "Admin or Manager access required"
          );
        }

        if (!ObjectId.isValid(req.params.id)) {
          return ResponseHelper.error(res, 400, "Invalid loan application ID");
        }

        const { status, reason } = req.body;

        if (!status || !Object.values(LOAN_STATUS).includes(status)) {
          return ResponseHelper.error(res, 400, "Valid status is required");
        }

        const application = await collections.loanApplicationCollection.findOne(
          {
            _id: new ObjectId(req.params.id),
          }
        );

        if (!application) {
          return ResponseHelper.error(res, 404, "Loan application not found");
        }

        const updateDoc = {
          $set: {
            status,
            applicationStatus: status.toLowerCase(),
            updatedAt: new Date().toISOString(),
            reviewedBy: req.tokenEmail,
            reviewedAt: new Date().toISOString(),
          },
        };

        if (reason) {
          updateDoc.$set.reason = reason;
        }

        if (status === LOAN_STATUS.APPROVED) {
          updateDoc.$set.approvedAt = new Date().toISOString();

          // Move to approved loans collection
          const approvedLoan = {
            ...application,
            ...updateDoc.$set,
            originalApplicationId: application._id,
          };

          await collections.approveLoanCollection.insertOne(approvedLoan);
        }

        await collections.loanApplicationCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          updateDoc
        );

        // Update user statistics
        const oldStatus = application.status;
        const userEmail = application.userEmail;

        const statUpdates = {};

        // Decrease old status count
        if (oldStatus === LOAN_STATUS.PENDING) statUpdates.totalPending = -1;
        else if (oldStatus === LOAN_STATUS.APPROVED)
          statUpdates.totalApproved = -1;
        else if (oldStatus === LOAN_STATUS.REJECTED)
          statUpdates.totalRejected = -1;

        // Increase new status count
        if (status === LOAN_STATUS.PENDING)
          statUpdates.totalPending = (statUpdates.totalPending || 0) + 1;
        else if (status === LOAN_STATUS.APPROVED)
          statUpdates.totalApproved = (statUpdates.totalApproved || 0) + 1;
        else if (status === LOAN_STATUS.REJECTED)
          statUpdates.totalRejected = (statUpdates.totalRejected || 0) + 1;

        if (Object.keys(statUpdates).length > 0) {
          await collections.usersCollection.updateOne(
            { email: userEmail },
            { $inc: statUpdates }
          );
        }

        ResponseHelper.success(res, 200, "Loan status updated successfully");
      })
    );

    // 404 handler
    app.use(notFoundHandler);

    // Global error handler
    app.use(errorHandler);

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received, shutting down gracefully");
      server.close(() => {
        database.close();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to initialize application:", error);
    process.exit(1);
  }
}

// Initialize the application
if (require.main === module) {
  initializeApp();
}

module.exports = app;
