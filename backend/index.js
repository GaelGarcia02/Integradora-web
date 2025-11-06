import express from "express";
import { PORT } from "./config.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import indexRoutes from "./routes/index.routes.js";
import usersRoutes from "./routes/users.routes.js";
import clientsRoutes from "./routes/clients.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import suppliersRoutes from "./routes/suppliers.routes.js";
import contactsRoutes from "./routes/contacts.routes.js";
import productsRoutes from "./routes/products.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import servicesOrdersRoutes from "./routes/services_orders.routes.js";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import rolesRoutes from "./routes/role.routes.js";

const app = express();
// 8081 incluir para la conexion con el frontend y la aplicacion movil
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8081"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Add all the routes with "/api" prefix
app.use("/api", indexRoutes);
app.use("/api", usersRoutes);
app.use("/api", clientsRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", suppliersRoutes);
app.use("/api", contactsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api", servicesRoutes);
app.use("/api", servicesOrdersRoutes);
app.use("/api", rolesRoutes);
app.use("/api", taskRoutes);
app.use("/api", authRoutes);

app.listen(PORT);
console.log("Server is running on port", PORT);
