import express from "express";

import {
  requestWithdrawal,
  getMyWithdrawals,
  getPendingWithdrawals,
  updateWithdrawalStatus,
} from "../controllers/withdrawalController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.use(authenticate);

router.post("/", requestWithdrawal);

router.get("/", getMyWithdrawals);

router.get(
  "/admin/pending",
  authorize("ADMIN"),
  getPendingWithdrawals
);

router.patch(
  "/admin/:id/status",
  authorize("ADMIN"),
  updateWithdrawalStatus
);

export default router;