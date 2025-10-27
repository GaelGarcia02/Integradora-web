import { Router } from "express";
import {
  getContact,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contacts.controller.js";
import {
  validateEmail,
  validateRequest,
} from "../validators/validate_email.js";

const router = Router();

//* Get all contacts
router.get("/contacts", getContacts);

//* Get a contact by ID
router.get("/contacts/:id", getContact);

//* Create a new contact with email validation
router.post(
  "/contacts",
  [validateEmail("email"), validateRequest],
  createContact
);

//* Update a contact by ID with email validation
router.put(
  "/contacts/:id",
  [validateEmail("email"), validateRequest],
  updateContact
);

//* Delete a contact by ID
router.delete("/contacts/:id", deleteContact);

export default router;
