import { pool } from "../db.js";

//* Get all service orders
export const getServiceOrders = async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT 
          so.*,
          c.trade_name AS client_name,
          s.name_ AS service_name,
          GROUP_CONCAT(CONCAT(p.name_, ' ', p.last_name) SEPARATOR ', ') AS personal_names
       FROM services_orders so
       LEFT JOIN clients c ON so.client_id = c.id_client
       LEFT JOIN services s ON so.service_id = s.id_service
       LEFT JOIN service_order_personal sop ON so.id_service_order = sop.service_order_id
       LEFT JOIN personal p ON sop.personal_id = p.id_personal
       GROUP BY so.id_service_order
       ORDER BY so.scheduled_date DESC`);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Get a service order by ID
export const getServiceOrder = async (req, res) => {
  try {
    const [orderResult] = await pool.query(
      `SELECT 
          so.*,
          c.trade_name AS client_name,
          s.name_ AS service_name
       FROM services_orders so
       JOIN clients c ON so.client_id = c.id_client
       JOIN services s ON so.service_id = s.id_service
       WHERE so.id_service_order = ?`,
      [req.params.id]
    );

    if (orderResult.length === 0) {
      return res.status(404).json({ message: "Service order not found" });
    }

    const [productsResult] = await pool.query(
      `SELECT 
          p.name_ as product_name,
          sop.quantity_used,
          c.unit as product_unit,
          sop.product_id
       FROM service_order_products sop
       JOIN products p ON sop.product_id = p.id_product
       JOIN categories c ON p.category_id = c.id_category
       WHERE sop.service_order_id = ?`,
      [req.params.id]
    );

    const [personalResult] = await pool.query(
      `SELECT 
          p.id_personal,
          CONCAT(p.name_, ' ', p.last_name) AS full_name
       FROM service_order_personal sop
       JOIN personal p ON sop.personal_id = p.id_personal
       WHERE sop.service_order_id = ?`,
      [req.params.id]
    );

    const serviceOrder = {
      ...orderResult[0],
      products: productsResult,
      personal: personalResult, // Array de personal asignado
    };

    res.json(serviceOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Create a new service order
export const createServiceOrder = async (req, res) => {
  const {
    client_id,
    service_id,
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
    state_,
    products,
    personal_ids, // Array de IDs de personal [1, 2]
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO services_orders (client_id, service_id, 
         contact_name, contact_phone, contact_email, scheduled_date, 
         start_time, end_time, price, activities, recomendations, files, state_) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client_id,
        service_id,
        contact_name,
        contact_phone,
        contact_email,
        scheduled_date,
        start_time,
        end_time || null,
        price,
        activities,
        recomendations,
        files || null,
        state_,
      ]
    );

    const newOrderId = orderResult.insertId;

    // Insertar productos
    if (products && products.length > 0) {
      const productValues = products.map((product) => [
        newOrderId,
        product.product_id,
        product.quantity_used,
      ]);
      await connection.query(
        "INSERT INTO service_order_products (service_order_id, product_id, quantity_used) VALUES ?",
        [productValues]
      );
    }

    // Insertar personal
    if (personal_ids && personal_ids.length > 0) {
      const personalValues = personal_ids.map((p_id) => [newOrderId, p_id]);
      await connection.query(
        "INSERT INTO service_order_personal (service_order_id, personal_id) VALUES ?",
        [personalValues]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Pedido de servicio creado exitosamente",
      id: newOrderId,
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({
      message: "Error al crear el pedido de servicio",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

//* Update a service order
export const updateServiceOrder = async (req, res) => {
  const { id } = req.params;
  const { products, personal, personal_ids, ...orderData } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Manejar campo end_time para permitir null
    if (!orderData.end_time || orderData.end_time === "") {
      orderData.end_time = null;
    }

    // Limpiar campos virtuales
    delete orderData.client_name;
    delete orderData.personal_name; // (El del JOIN singular)
    delete orderData.personal_names; // (El del JOIN plural)
    delete orderData.service_name;
    delete orderData.id_service_order;

    await connection.query(
      "UPDATE services_orders SET ? WHERE id_service_order = ?",
      [orderData, id]
    );

    // ----- Actualizar Productos (Borrar e Insertar) -----
    await connection.query(
      "DELETE FROM service_order_products WHERE service_order_id = ?",
      [id]
    );
    if (products && products.length > 0) {
      const productValues = products.map((product) => [
        id,
        product.product_id,
        product.quantity_used,
      ]);
      await connection.query(
        "INSERT INTO service_order_products (service_order_id, product_id, quantity_used) VALUES ?",
        [productValues]
      );
    }

    // ----- Actualizar Personal (Borrar e Insertar) -----
    await connection.query(
      "DELETE FROM service_order_personal WHERE service_order_id = ?",
      [id]
    );
    if (personal_ids && personal_ids.length > 0) {
      const personalValues = personal_ids.map((p_id) => [id, p_id]);
      await connection.query(
        "INSERT INTO service_order_personal (service_order_id, personal_id) VALUES ?",
        [personalValues]
      );
    }

    await connection.commit();

    res.json({
      message: "Orden de servicio actualizada exitosamente",
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
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

//* Confirm a service order
export const confirmServiceOrder = async (req, res) => {
  const { id } = req.params;
  const { products_used } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orderRows] = await connection.query(
      "SELECT state_ FROM services_orders WHERE id_service_order = ?",
      [id]
    );
    if (orderRows[0].state_ !== "Pendiente") {
      throw new Error("Esta orden ya ha sido finalizada o cancelada.");
    }

    if (products_used && products_used.length > 0) {
      await Promise.all(
        products_used.map((prod) => {
          return connection.query(
            "UPDATE products SET stock = stock - ? WHERE id_product = ?",
            [prod.quantity_used, prod.product_id]
          );
        })
      );
    }

    await connection.query(
      "UPDATE services_orders SET state_ = 'Completada' WHERE id_service_order = ?",
      [id]
    );

    await connection.commit();
    res.json({ message: "Orden finalizada y stock actualizado." });
  } catch (error) {
    await connection.rollback();
    console.error("Error al finalizar la orden:", error);
    res
      .status(500)
      .json({ message: "Error al finalizar la orden", error: error.message });
  } finally {
    connection.release();
  }
};
