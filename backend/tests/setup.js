const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");

let mongoServer;
let mongoClient;
let db;

// Setup in-memory MongoDB for testing
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  db = mongoClient.db("test-loansDB");

  // Set environment variables for testing
  process.env.NODE_ENV = "test";
  process.env.MONGODB_URI = mongoUri;
  process.env.JWT_SECRET = "test-jwt-secret";
  process.env.FB_SERVICE_KEY = Buffer.from(
    JSON.stringify({
      type: "service_account",
      project_id: "test-project",
      private_key_id: "test-key-id",
      private_key:
        "-----BEGIN PRIVATE KEY-----\ntest-private-key\n-----END PRIVATE KEY-----\n",
      client_email: "test@test-project.iam.gserviceaccount.com",
      client_id: "test-client-id",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
    })
  ).toString("base64");
});

// Cleanup after all tests
afterAll(async () => {
  if (mongoClient) {
    await mongoClient.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Clean database between tests
beforeEach(async () => {
  if (db) {
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
  }
});

// Mock Firebase Admin
jest.mock("firebase-admin", () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      email: "test@example.com",
      uid: "test-uid",
    }),
  }),
}));

// Mock Stripe
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          url: "https://checkout.stripe.com/test-session",
        }),
        retrieve: jest.fn().mockResolvedValue({
          payment_intent: "pi_test_123",
        }),
      },
    },
    paymentIntents: {
      retrieve: jest.fn().mockResolvedValue({
        id: "pi_test_123",
        status: "succeeded",
      }),
    },
  }));
});

module.exports = {
  getDb: () => db,
  getClient: () => mongoClient,
};
