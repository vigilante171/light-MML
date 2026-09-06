import express from "express";

import {
    createProduct,
    getProducts,
    getProductById
} from "../controllers/productController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createProduct
);

export default router;