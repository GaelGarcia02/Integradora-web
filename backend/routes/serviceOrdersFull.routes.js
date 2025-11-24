import { Router } from "express";
import { signServiceOrder,addUsedProducts,cancelServiceOrder,startServiceOrder,getFullServiceOrders, updateServiceOrderTime,  completeServiceOrder, } from "../controllers/serviceOrdersFull.controller.js";

const router = Router();

// router.get("/full", getFullServiceOrders);
// router.put("/:id/time", updateServiceOrderTime);
// router.put("/service-orders/:id/complete", completeServiceOrder); 

// Obtener todas las órdenes con info completa
router.get("/service-orders-full", getFullServiceOrders);
router.put("/service-orders/:id", updateServiceOrderTime);
router.put("/service-orders/:id/start", startServiceOrder);
router.put("/service-orders/:id/complete", completeServiceOrder);
router.put("/service-orders/:id/cancel", cancelServiceOrder);
router.post("/service-orders/:id/products", addUsedProducts);
router.put("/service-orders/:id/sign", signServiceOrder);

export default router;
