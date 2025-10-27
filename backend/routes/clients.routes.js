import { Router } from "express";
import {
  validateEmail,
  validateRequest,
} from "../validators/validate_email.js";
import {
  getClient,
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/clients.controller.js";

const router = Router();

//* Get all clients
router.get("/clients", getClients);

//* Get one client
router.get("/clients/:id", getClient);

//* Create new client
router.post(
  "/clients",
  [validateEmail("email"), validateEmail("contact_email"), validateRequest],
  createClient
);

//* Update a client
router.put(
  "/clients/:id",
  [validateEmail("email"), validateEmail("contact_email"), validateRequest],
  updateClient
);

//* Delete a client
router.delete("/clients/:id", deleteClient);

export default router;
