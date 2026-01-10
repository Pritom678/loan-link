require("dotenv").config();

const config = {
  development: {
    port: process.env.PORT || 3000,
    mongodb: process.env.MONGODB_URI,
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ],
      credentials: true,
      optionsSuccessStatus: 200,
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    },
    jwt: {
      secret: process.env.JWT_SECRET || "fallback-secret-key",
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    },
    logging: {
      level: process.env.LOG_LEVEL || "info",
    },
  },
  production: {
    port: process.env.PORT || 3000,
    mongodb: process.env.MONGODB_URI,
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || [
        process.env.CLIENT_URL,
      ],
      credentials: true,
      optionsSuccessStatus: 200,
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 50, // Stricter in production
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    },
    logging: {
      level: process.env.LOG_LEVEL || "error",
    },
  },
};

const env = process.env.NODE_ENV || "development";
module.exports = config[env];
