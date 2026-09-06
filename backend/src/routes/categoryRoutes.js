import express from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getCategories);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createCategory
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteCategory
);

export default router;