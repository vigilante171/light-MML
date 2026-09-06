import express from "express";

import {
  getMyReferralCode,
  getMyReferrals,
  getMyReferralStats,
} from "../controllers/referralController.js";

import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/me", getMyReferralCode);

router.get("/me/list", getMyReferrals);

router.get("/me/stats", getMyReferralStats);

export default router;
