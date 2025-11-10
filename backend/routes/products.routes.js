import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsProvider,
  getAvailableProducts,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/provider", getProductsProvider);

router.get("/available", getAvailableProducts);

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
