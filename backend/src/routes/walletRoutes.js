import express from "express";

import {
  getMyWallet,
  getMyTransactions,
} from "../controllers/walletController.js";

import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getMyWallet);
router.get("/transactions", getMyTransactions);

export default router;