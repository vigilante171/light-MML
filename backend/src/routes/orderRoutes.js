import express from "express";

import {
  checkout,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.use(authenticate);

// User routes
router.post("/checkout", checkout);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);

// Admin routes
router.get(
  "/admin/all",
  authorize("ADMIN"),
  getAllOrders
);

router.patch(
  "/admin/:id/status",
  authorize("ADMIN"),
  updateOrderStatus
);

export default router;