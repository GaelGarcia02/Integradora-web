import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsProvider,
} from "../controllers/products.controller.js";

const router = Router();

// ✅ La ruta /provider debe declararse antes que /:id
router.get("/provider", getProductsProvider);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;