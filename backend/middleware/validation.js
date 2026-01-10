const { body, param, query, validationResult } = require("express-validator");
const {
  VALIDATION_LIMITS,
  LOAN_STATUS,
  USER_ROLES,
} = require("../utils/constants");
const ResponseHelper = require("../utils/responseHelper");

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHelper.validationError(res, errors.array());
  }
  next();
};

/**
 * Loan application validation
 */
const validateLoanApplication = [
  body("firstName")
    .trim()
    .isLength({
      min: VALIDATION_LIMITS.NAME_LENGTH.MIN,
      max: VALIDATION_LIMITS.NAME_LENGTH.MAX,
    })
    .withMessage(
      `First name must be between ${VALIDATION_LIMITS.NAME_LENGTH.MIN} and ${VALIDATION_LIMITS.NAME_LENGTH.MAX} characters`
    )
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .isLength({
      min: VALIDATION_LIMITS.NAME_LENGTH.MIN,
      max: VALIDATION_LIMITS.NAME_LENGTH.MAX,
    })
    .withMessage(
      `Last name must be between ${VALIDATION_LIMITS.NAME_LENGTH.MIN} and ${VALIDATION_LIMITS.NAME_LENGTH.MAX} characters`
    )
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("userEmail")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("contactNumber")
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),

  body("nidOrPassport")
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("NID or Passport must be between 5 and 20 characters"),

  body("loanAmount")
    .isFloat({
      min: VALIDATION_LIMITS.LOAN_AMOUNT.MIN,
      max: VALIDATION_LIMITS.LOAN_AMOUNT.MAX,
    })
    .withMessage(
      `Loan amount must be between $${VALIDATION_LIMITS.LOAN_AMOUNT.MIN.toLocaleString()} and $${VALIDATION_LIMITS.LOAN_AMOUNT.MAX.toLocaleString()}`
    ),

  body("monthlyIncome")
    .isFloat({ min: 100 })
    .withMessage("Monthly income must be at least $100"),

  body("incomeSource")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Income source must be between 2 and 100 characters"),

  body("reasonForLoan")
    .trim()
    .isLength({
      min: VALIDATION_LIMITS.DESCRIPTION_LENGTH.MIN,
      max: VALIDATION_LIMITS.DESCRIPTION_LENGTH.MAX,
    })
    .withMessage(
      `Reason for loan must be between ${VALIDATION_LIMITS.DESCRIPTION_LENGTH.MIN} and ${VALIDATION_LIMITS.DESCRIPTION_LENGTH.MAX} characters`
    ),

  body("address")
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage("Address must be between 10 and 200 characters"),

  handleValidationErrors,
];

/**
 * Loan creation validation
 */
const validateLoanCreation = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Loan title must be between 5 and 100 characters"),

  body("description")
    .trim()
    .isLength({
      min: VALIDATION_LIMITS.DESCRIPTION_LENGTH.MIN,
      max: VALIDATION_LIMITS.DESCRIPTION_LENGTH.MAX,
    })
    .withMessage(
      `Description must be between ${VALIDATION_LIMITS.DESCRIPTION_LENGTH.MIN} and ${VALIDATION_LIMITS.DESCRIPTION_LENGTH.MAX} characters`
    ),

  body("amount")
    .isFloat({
      min: VALIDATION_LIMITS.LOAN_AMOUNT.MIN,
      max: VALIDATION_LIMITS.LOAN_AMOUNT.MAX,
    })
    .withMessage(
      `Amount must be between $${VALIDATION_LIMITS.LOAN_AMOUNT.MIN.toLocaleString()} and $${VALIDATION_LIMITS.LOAN_AMOUNT.MAX.toLocaleString()}`
    ),

  body("interestRate")
    .isFloat({
      min: VALIDATION_LIMITS.INTEREST_RATE.MIN,
      max: VALIDATION_LIMITS.INTEREST_RATE.MAX,
    })
    .withMessage(
      `Interest rate must be between ${VALIDATION_LIMITS.INTEREST_RATE.MIN}% and ${VALIDATION_LIMITS.INTEREST_RATE.MAX}%`
    ),

  body("term")
    .isInt({
      min: VALIDATION_LIMITS.LOAN_TERM.MIN,
      max: VALIDATION_LIMITS.LOAN_TERM.MAX,
    })
    .withMessage(
      `Loan term must be between ${VALIDATION_LIMITS.LOAN_TERM.MIN} and ${VALIDATION_LIMITS.LOAN_TERM.MAX} months`
    ),

  handleValidationErrors,
];

/**
 * User registration validation
 */
const validateUserRegistration = [
  body("name")
    .trim()
    .isLength({
      min: VALIDATION_LIMITS.NAME_LENGTH.MIN,
      max: VALIDATION_LIMITS.NAME_LENGTH.MAX,
    })
    .withMessage(
      `Name must be between ${VALIDATION_LIMITS.NAME_LENGTH.MIN} and ${VALIDATION_LIMITS.NAME_LENGTH.MAX} characters`
    )
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("role")
    .optional()
    .isIn(Object.values(USER_ROLES))
    .withMessage(
      `Role must be one of: ${Object.values(USER_ROLES).join(", ")}`
    ),

  handleValidationErrors,
];

/**
 * Profile update validation
 */
const validateProfileUpdate = [
  body("displayName")
    .optional()
    .trim()
    .isLength({
      min: VALIDATION_LIMITS.NAME_LENGTH.MIN,
      max: VALIDATION_LIMITS.NAME_LENGTH.MAX,
    })
    .withMessage(
      `Display name must be between ${VALIDATION_LIMITS.NAME_LENGTH.MIN} and ${VALIDATION_LIMITS.NAME_LENGTH.MAX} characters`
    ),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("profilePicture")
    .optional()
    .isURL()
    .withMessage("Profile picture must be a valid URL"),

  handleValidationErrors,
];

/**
 * Loan status update validation
 */
const validateLoanStatusUpdate = [
  body("status")
    .isIn(Object.values(LOAN_STATUS))
    .withMessage(
      `Status must be one of: ${Object.values(LOAN_STATUS).join(", ")}`
    ),

  handleValidationErrors,
];

/**
 * Pagination validation
 */
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  handleValidationErrors,
];

/**
 * MongoDB ObjectId validation
 */
const validateObjectId = (paramName = "id") => [
  param(paramName).isMongoId().withMessage("Invalid ID format"),

  handleValidationErrors,
];

module.exports = {
  validateLoanApplication,
  validateLoanCreation,
  validateUserRegistration,
  validateProfileUpdate,
  validateLoanStatusUpdate,
  validatePagination,
  validateObjectId,
  handleValidationErrors,
};
