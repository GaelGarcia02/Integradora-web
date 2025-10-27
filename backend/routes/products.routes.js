import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsProvider
} from "../controllers/products.controller.js";

const router = Router();

//* Get all products
router.get("/products", getProducts);

//* Get a product by ID
router.get("/products/:id", getProduct);

//* Get all products v2 (traer el nombre del proveedor en vez del id del mismo)
router.get("/products-provider", getProductsProvider);

//* Create a new product
router.post("/products", createProduct);

//* Update a product by ID
router.put("/products/:id", updateProduct);

//* Delete a product by ID
router.delete("/products/:id", deleteProduct);

export default router;
