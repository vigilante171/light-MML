import { body } from "express-validator";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 150 })
    .withMessage("Product name cannot exceed 150 characters"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Product slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must contain lowercase letters, numbers and hyphens"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("category")
    .isMongoId()
    .withMessage("A valid category ID is required"),

  body("isCommissionable")
    .optional()
    .isBoolean()
    .withMessage("isCommissionable must be boolean"),

  body("commissionValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("commissionValue must be a non-negative number"),
];

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage("Invalid product name"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("isCommissionable")
    .optional()
    .isBoolean()
    .withMessage("isCommissionable must be boolean"),

  body("commissionValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("commissionValue must be a non-negative number"),
];
