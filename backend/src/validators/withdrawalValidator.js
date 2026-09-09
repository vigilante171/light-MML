import { body } from "express-validator";

export const withdrawalValidator = [
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Withdrawal amount must be greater than zero"),

  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required")
    .isLength({ max: 100 })
    .withMessage("Payment method is too long"),

  body("paymentDetails")
    .trim()
    .notEmpty()
    .withMessage("Payment details are required")
    .isLength({ max: 500 })
    .withMessage("Payment details are too long"),
];
