import express from "express";

import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";

import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getMyNotifications);

router.patch(
  "/read-all",
  markAllAsRead
);

router.patch(
  "/:id/read",
  markAsRead
);

export default router;
