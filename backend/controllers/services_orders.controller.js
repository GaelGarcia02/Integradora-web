import { pool } from "../db.js";

//* Get all service orders
export const getServiceOrders = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM services_orders ORDER BY scheduled_date DESC"
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Get a service order by ID
export const getServiceOrder = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM services_orders WHERE id_service_order = ?",
      [req.params.id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Service order not found" });
    }

    // Convertir 'products' a un objeto si es una cadena
    const serviceOrder = result[0];
    console.log(serviceOrder.products);
    if (serviceOrder.products && typeof serviceOrder.products === "string") {
      try {
        serviceOrder.products = JSON.parse(serviceOrder.products);
      } catch (error) {
        console.error("Error al parsear products:", error);
        serviceOrder.products = []; // O manejar de otra manera si el JSON no es válido
      }
    }

    res.json(serviceOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Create a new service order
export const createServiceOrder = async (req, res) => {
  try {
    const {
      client_id,
      service_id,
      personal_id,
      contact_name,
      contact_phone,
      contact_email,
      scheduled_date,
      start_time,
      end_time,
      price,
      activities,
      recomendations,
      files,
      notes,
      state_,
      products,
    } = req.body;

    console.log("Productos recibidos:", products);

    // Validación de datos (opcional)
    if (
      !client_id ||
      !service_id ||
      !personal_id ||
      !scheduled_date ||
      !start_time ||
      !end_time ||
      !price ||
      !activities ||
      !recomendations ||
      !state_
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Verificar si 'products' debe ser convertido a JSON para la base de datos
    const productsJson = JSON.stringify(products);

    // Inserción en la base de datos
    const [result] = await pool.query(
      "INSERT INTO services_orders (client_id, service_id, personal_id, contact_name, contact_phone, contact_email, scheduled_date, start_time, end_time, price, activities, recomendations, files, notes, state_, products) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        client_id,
        service_id,
        personal_id,
        contact_name || null,
        contact_phone || null,
        contact_email || null,
        scheduled_date,
        start_time,
        end_time,
        price,
        activities,
        recomendations,
        files || null,
        notes || null,
        state_,
        productsJson ? productsJson : null,
      ]
    );

    // Enviar respuesta exitosa
    res.status(201).json({
      message: "Pedido de servicio creado exitosamente",
      id: result.insertId,
    });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ error: "Error al crear el pedido de servicio" });
  }
};

//* Update a service order
export const updateServiceOrder = async (req, res) => {
  try {
    // Copiar el cuerpo de la solicitud para modificarlo
    const dataToUpdate = { ...req.body };

    // Eliminar los campos quantity, product_id y additional_info si están presentes, ya que pertenecen al objeto products
    delete dataToUpdate.quantity;
    delete dataToUpdate.product_id;
    delete dataToUpdate.additional_info;

    // Verificar y convertir 'products' a JSON string si es un objeto
    if (dataToUpdate.products && typeof dataToUpdate.products === "object") {
      dataToUpdate.products = JSON.stringify(dataToUpdate.products);
    } else if (dataToUpdate.products === null) {
      dataToUpdate.products = null; // O mantener como una cadena vacía si es el caso
    }

    // Ejecutar la consulta de actualización
    const [result] = await pool.query(
      "UPDATE services_orders SET ? WHERE id_service_order = ?",
      [dataToUpdate, req.params.id]
    );

    // Enviar una respuesta exitosa
    res.json({
      message: "Orden de servicio actualizada exitosamente",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//* Delete a service order
export const deleteServiceOrder = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM services_orders WHERE id_service_order = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service order not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
