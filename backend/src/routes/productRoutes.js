import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createProduct
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteProduct
);

export default router;