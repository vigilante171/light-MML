import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getCart);

router.post("/", addToCart);

router.patch("/:productId", updateCartItem);

router.delete("/:productId", removeFromCart);

router.delete("/", clearCart);

export default router;