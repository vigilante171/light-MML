import express from "express";

import {
    createCategory,
    getCategories
} from "../controllers/categoryController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getCategories);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createCategory
);

export default router;