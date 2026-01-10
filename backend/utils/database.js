const { MongoClient, ServerApiVersion } = require("mongodb");
const logger = require("./logger");
const config = require("../config");

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      this.client = new MongoClient(config.mongodb, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });

      await this.client.connect();
      this.db = this.client.db("loansDB");

      // Create indexes for better performance
      await this.createIndexes();

      logger.info("Successfully connected to MongoDB");
      return this.db;
    } catch (error) {
      logger.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      const collections = {
        users: this.db.collection("users"),
        loan_options: this.db.collection("loan_options"),
        loan_applications: this.db.collection("loan_applications"),
        approved_loan: this.db.collection("approved_loan"),
      };

      // Users collection indexes
      await collections.users.createIndex({ email: 1 }, { unique: true });
      await collections.users.createIndex({ role: 1 });
      await collections.users.createIndex({ status: 1 });

      // Loan options collection indexes
      await collections.loan_options.createIndex({ availability: 1 });
      await collections.loan_options.createIndex({ "manager.email": 1 });
      await collections.loan_options.createIndex({ createdAt: -1 });

      // Loan applications collection indexes
      await collections.loan_applications.createIndex({ userEmail: 1 });
      await collections.loan_applications.createIndex({ status: 1 });
      await collections.loan_applications.createIndex({ applicationStatus: 1 });
      await collections.loan_applications.createIndex({ loanId: 1 });
      await collections.loan_applications.createIndex({ date: -1 });

      // Approved loans collection indexes
      await collections.approved_loan.createIndex({ userEmail: 1 });
      await collections.approved_loan.createIndex({ approvedAt: -1 });

      logger.info("Database indexes created successfully");
    } catch (error) {
      logger.error("Failed to create database indexes:", error);
      // Don't throw error here as indexes might already exist
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }

  async close() {
    if (this.client) {
      await this.client.close();
      logger.info("Database connection closed");
    }
  }

  /**
   * Get paginated results
   * @param {Object} collection - MongoDB collection
   * @param {Object} query - Query object
   * @param {Object} options - Options object
   * @returns {Object} Paginated results
   */
  async getPaginatedResults(collection, query = {}, options = {}) {
    const {
      page = 1,
      limit = 20,
      sort = { _id: -1 },
      projection = {},
    } = options;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      collection
        .find(query, { projection })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }
}

module.exports = new Database();
