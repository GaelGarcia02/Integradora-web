import { Router } from "express";
import {
  getServiceOrder,
  getServiceOrders,
  createServiceOrder,
  updateServiceOrder,
  deleteServiceOrder,
} from "../controllers/services_orders.controller.js";

const router = Router();

//* Get all service orders
router.get("/service-orders", getServiceOrders);

//* Get a service order by ID
router.get("/service-orders/:id", getServiceOrder);

//* Create a new service order
router.post("/service-orders", createServiceOrder);

//* Update a service order by ID
router.put("/service-orders/:id", updateServiceOrder);

//* Delete a service order by ID
router.delete("/service-orders/:id", deleteServiceOrder);

export default router;
