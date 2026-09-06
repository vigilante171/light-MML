import express from "express";
import { checkout } from "../controllers/orderController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.post("/checkout", checkout);

export default router;