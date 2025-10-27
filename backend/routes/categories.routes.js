import { Router } from "express";
import {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";

const router = Router();

//* Get all users
router.get("/categories", getCategories);

//* Get a user by ID
router.get("/categories/:id", getCategory);

//* Insert a new user
router.post("/categories", createCategory);

//* Update a user by ID
router.put("/categories/:id", updateCategory);

//* Delete a user by ID
router.delete("/categories/:id", deleteCategory);

export default router;
