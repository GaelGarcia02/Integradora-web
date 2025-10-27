import { Router } from "express";
import { body, validationResult } from "express-validator";
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/suppliers.controller.js";

const router = Router();

// Validation middleware
const validateEmail = (field) => {
  return body(field)
    .optional()
    .isEmail()
    .withMessage(`${field} must be a valid email address`);
};

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//* Get all suppliers
router.get("/suppliers", getSuppliers);

//* Get a supplier by ID
router.get("/suppliers/:id", getSupplier);

//* Insert a new supplier
router.post(
  "/suppliers",
  [validateEmail("email"), validateEmail("contact_email"), validateRequest],
  createSupplier
);

//* Update a supplier by ID
router.put(
  "/suppliers/:id",
  [validateEmail("email"), validateEmail("contact_email"), validateRequest],
  updateSupplier
);

//* Delete a supplier by ID
router.delete("/suppliers/:id", deleteSupplier);

export default router;
