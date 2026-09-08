import express from "express";

import {
  getMyCommissions,
  getMyCommissionSummary,
  getAllPendingCommissions,
  approveCommission,
} from "../controllers/commissionController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.use(authenticate);

// User routes
router.get("/", getMyCommissions);
router.get("/summary", getMyCommissionSummary);

// Admin routes
router.get(
  "/admin/pending",
  authorize("ADMIN"),
  getAllPendingCommissions
);

router.patch(
  "/admin/:id/approve",
  authorize("ADMIN"),
  approveCommission
);

export default router;