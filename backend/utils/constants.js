/**
 * Application constants
 */

// Loan statuses
const LOAN_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

// Application statuses
const APPLICATION_STATUS = {
  UNPAID: "Unpaid",
  PAID: "Paid",
  PROCESSING: "Processing",
};

// User roles
const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  BORROWER: "borrower",
};

// User account statuses
const USER_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  PENDING: "pending",
};

// Loan availability
const LOAN_AVAILABILITY = {
  AVAILABLE: "available",
  UNAVAILABLE: "unavailable",
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Validation limits
const VALIDATION_LIMITS = {
  LOAN_AMOUNT: {
    MIN: 1000,
    MAX: 10000000,
  },
  INTEREST_RATE: {
    MIN: 0.1,
    MAX: 50,
  },
  LOAN_TERM: {
    MIN: 1,
    MAX: 360, // months
  },
  NAME_LENGTH: {
    MIN: 2,
    MAX: 50,
  },
  DESCRIPTION_LENGTH: {
    MIN: 10,
    MAX: 1000,
  },
};

module.exports = {
  LOAN_STATUS,
  APPLICATION_STATUS,
  USER_ROLES,
  USER_STATUS,
  LOAN_AVAILABILITY,
  PAGINATION,
  VALIDATION_LIMITS,
};
