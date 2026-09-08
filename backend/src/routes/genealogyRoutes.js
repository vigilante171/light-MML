import express from "express";

import {
  getMyDirectMembers,
  getMyNetworkTree,
  getMyNetworkSummary,
} from "../controllers/genealogyController.js";

import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/direct", getMyDirectMembers);
router.get("/tree", getMyNetworkTree);
router.get("/summary", getMyNetworkSummary);

export default router;