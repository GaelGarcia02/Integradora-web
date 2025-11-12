import { pool } from "../db.js";

export const getServiceOrders = async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT 
          so.*,
          c.trade_name AS client_name,
          CONCAT(p.name_, ' ', p.last_name) AS personal_name,
          s.name_ AS service_name
       FROM services_orders so
       LEFT JOIN clients c ON so.client_id = c.id_client
       LEFT JOIN personal p ON so.personal_id = p.id_personal
       LEFT JOIN services s ON so.service_id = s.id_service
       ORDER BY so.scheduled_date DESC`);

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getServiceOrder = async (req, res) => {
  try {
    const [orderResult] = await pool.query(
      `SELECT 
          so.*,
          c.trade_name AS client_name,
          CONCAT(p.name_, ' ', p.last_name) AS personal_name,
          s.name_ AS service_name
       FROM services_orders so
       JOIN clients c ON so.client_id = c.id_client
       JOIN personal p ON so.personal_id = p.id_personal
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

    const serviceOrder = {
      ...orderResult[0],
      products: productsResult,
    };

    res.json(serviceOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createServiceOrder = async (req, res) => {
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
    state_,
    products,
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO services_orders (client_id, service_id, personal_id, 
         contact_name, contact_phone, contact_email, scheduled_date, 
         start_time, end_time, price, activities, recomendations, files, state_) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
        files || null,
        state_,
      ]
    );

    const newOrderId = orderResult.insertId;

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

export const updateServiceOrder = async (req, res) => {
  const { id } = req.params;
  const { products, ...orderData } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    // Campos que no se actualizan directamente o que no pertencen a la tabla
    delete orderData.client_name;
    delete orderData.personal_name;
    delete orderData.service_name;
    delete orderData.id_service_order;

    await connection.query(
      "UPDATE services_orders SET ? WHERE id_service_order = ?",
      [orderData, id]
    );

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
