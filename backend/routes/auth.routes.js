import { Router } from "express";
import { login, logout } from "../controllers/auth.controller.js";

const router = Router();

//* Login user
router.post("/login", login);

//* Logout user
router.post("/logout", logout);

export default router;
