const request = require("supertest");
const app = require("../../index");
const { getDb } = require("../setup");

describe("Loans API", () => {
  let db;
  let authToken = "Bearer test-token";

  beforeEach(async () => {
    db = getDb();

    // Create test user
    await db.collection("users").insertOne({
      email: "test@example.com",
      role: "admin",
      status: "active",
    });
  });

  describe("GET /loans", () => {
    beforeEach(async () => {
      // Insert test loans
      await db.collection("loan_options").insertMany([
        {
          title: "Personal Loan",
          description: "A personal loan for various needs",
          amount: 5000,
          interestRate: 5.5,
          term: 12,
          availability: "available",
          createdAt: new Date().toISOString(),
        },
        {
          title: "Business Loan",
          description: "A loan for business expansion",
          amount: 10000,
          interestRate: 7.0,
          term: 24,
          availability: "available",
          createdAt: new Date().toISOString(),
        },
      ]);
    });

    it("should return available loans", async () => {
      const response = await request(app).get("/loans").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
    });

    it("should support pagination", async () => {
      const response = await request(app)
        .get("/loans?page=1&limit=1")
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.total).toBe(2);
    });
  });

  describe("POST /loans", () => {
    const validLoanData = {
      title: "Test Loan",
      description: "A test loan for unit testing",
      amount: 5000,
      interestRate: 5.5,
      term: 12,
    };

    it("should create a new loan with valid data", async () => {
      const response = await request(app)
        .post("/loans")
        .set("Authorization", authToken)
        .send(validLoanData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Loan created successfully");
      expect(response.body.data.id).toBeDefined();
    });

    it("should reject loan creation without authentication", async () => {
      const response = await request(app)
        .post("/loans")
        .send(validLoanData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Access token required");
    });

    it("should validate required fields", async () => {
      const invalidData = { ...validLoanData };
      delete invalidData.title;

      const response = await request(app)
        .post("/loans")
        .set("Authorization", authToken)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it("should validate amount range", async () => {
      const invalidData = { ...validLoanData, amount: 500 }; // Below minimum

      const response = await request(app)
        .post("/loans")
        .set("Authorization", authToken)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /loans/:id", () => {
    let loanId;

    beforeEach(async () => {
      const result = await db.collection("loan_options").insertOne({
        title: "Test Loan",
        description: "A test loan",
        amount: 5000,
        interestRate: 5.5,
        term: 12,
        availability: "available",
      });
      loanId = result.insertedId.toString();
    });

    it("should return loan by ID", async () => {
      const response = await request(app).get(`/loans/${loanId}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Test Loan");
    });

    it("should return 404 for non-existent loan", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app).get(`/loans/${fakeId}`).expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Loan not found");
    });

    it("should return 400 for invalid ID format", async () => {
      const response = await request(app).get("/loans/invalid-id").expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
