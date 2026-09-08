import express from "express";

import {
  sendAdminNotification,
} from "../controllers/adminNotificationController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.post(
  "/",
  sendAdminNotification
);

export default router;
