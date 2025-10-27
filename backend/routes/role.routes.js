import { Router } from "express";

import {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
  getRolesUsers,
} from "../controllers/role.controller.js";

const router = Router();

router.get("/roles", getRoles);

router.get("/roles/:id", getRole);

router.post("/roles", createRole);

router.put("/roles/:id", updateRole);

router.delete("/roles/:id", deleteRole);

router.get("/roles-users", getRolesUsers);

export default router;
