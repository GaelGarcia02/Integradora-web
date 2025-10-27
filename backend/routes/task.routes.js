import { Router } from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = Router();

//* Get all tasks
router.get("/tasks", getTasks);

//* Get a task by ID
router.get("/tasks/:id", getTask);

//* Insert a new task
router.post("/tasks", createTask);

//* Update a task by ID
router.put("/tasks/:id", updateTask);

//* Delete a task by ID
router.delete("/tasks/:id", deleteTask);

export default router;
