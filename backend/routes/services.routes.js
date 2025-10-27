import { Router } from "express";
import {
  getService,
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/services.controller.js";

const router = Router();

//* Get all services
router.get("/services", getServices);

//* Get a service by its ID
router.get("/services/:id", getService);

//* Create a new service
router.post("/services", createService);

//* Update a service by its ID
router.put("/services/:id", updateService);

//* Delete a service by its ID
router.delete("/services/:id", deleteService);

export default router;
