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
          const updateDoc = {
            $set: {
              last_loggedIn: new Date().toISOString(),
              role: userData.role || existingUser.role || USER_ROLES.BORROWER,
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
            { updated: result.modifiedCount > 0 }
          );
        }

        const newUser = {
          ...userData,
          role: userData.role || USER_ROLES.BORROWER,
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
