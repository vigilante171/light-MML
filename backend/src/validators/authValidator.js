import { body } from "express-validator";

export const registerValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must contain 8-100 characters"),

  body("referralCode")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Invalid referral code"),
];

export const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password is required"),
];
