import express from 'express'
import{
    register , login , logout
} from "../controllers/authController.js"
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";

import { validate } from "../middleware/validate.js";
router.post(
  "/register",
  authLimiter,
  registerValidator,
  validate,
  register
);

router.post(
  "/login",
  authLimiter,
  loginValidator,
  validate,
  login
);
const router = express.Router()

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;