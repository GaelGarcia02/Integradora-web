import { pool } from "../db.js";

/* ---------- HELPERS ---------- */
const isValidTime = (t) => /^\d{2}:\d{2}:\d{2}$/.test(t); // "HH:mm:ss"
const ensureArray = (v) => Array.isArray(v) ? v : [];

const sendServerError = (res, err, context = "") => {
  console.error(context, err);
  return res.status(500).json({ message: "Error interno del servidor" });
};

/* ---------- 1) Obtener todas las órdenes con info completa ---------- */
export const getFullServiceOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT 
        so.id_service_order,
        so.scheduled_date,
        so.start_time,
        so.end_time,
        so.state_,
        so.activities,
        s.name_ AS service_name,
        s.description_ AS service_description,
        c.trade_name AS client_name,
        c.email AS client_email,
        c.phone_or_cell AS client_phone,
        c.street AS client_street,
        c.number_ AS client_number,
        c.neighborhood AS client_neighborhood,
        c.city AS client_city,
        c.state_ AS client_state,
        c.country AS client_country,
        p.id_product,
        p.name_ AS product_name,
        p.description_ AS product_description,
        p.sale_price,
        p.model,
        p.manufacturer_brand,
        p.product_image,
        sop.quantity_used
      FROM services_orders AS so
      LEFT JOIN services AS s ON s.id_service = so.service_id
      LEFT JOIN clients AS c ON c.id_client = so.client_id
      LEFT JOIN service_order_products AS sop ON sop.service_order_id = so.id_service_order
      LEFT JOIN products AS p ON p.id_product = sop.product_id
      ORDER BY so.id_service_order DESC
    `);

    return res.json(orders);
  } catch (err) {
    return sendServerError(res, err, "Error en getFullServiceOrders:");
  }
};

/* ---------- 2) Corrección manual de tiempos (solo para correcciones) ---------- */
export const updateServiceOrderTime = async (req, res) => {
  const { id } = req.params;
  const { start_time, end_time } = req.body;

  try {
    const [existing] = await pool.query(
      "SELECT * FROM services_orders WHERE id_service_order = ?",
      [id]
    );

    if (!existing.length) return res.status(404).json({ message: "Orden no encontrada" });

    // Validaciones de formato si vienen
    if (start_time && !isValidTime(start_time)) {
      return res.status(400).json({ message: "start_time debe tener formato HH:mm:ss" });
    }
    if (end_time && !isValidTime(end_time)) {
      return res.status(400).json({ message: "end_time debe tener formato HH:mm:ss" });
    }

    // Determinar nuevo estado (solo cambios por corrección)
    let newState = existing[0].state_;
    if (start_time && !end_time) newState = "en_progreso";
    if (start_time && end_time) newState = "finalizado";
    if (!start_time && end_time) newState = existing[0].state_; // no auto-complete si solo viene end_time sin start

    await pool.query(
      `UPDATE services_orders 
       SET start_time = ?, end_time = ?, state_ = ? 
       WHERE id_service_order = ?`,
      [
        start_time !== undefined ? start_time : existing[0].start_time,
        end_time !== undefined ? end_time : existing[0].end_time,
        newState,
        id,
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM services_orders WHERE id_service_order = ?",
      [id]
    );

    return res.json({ message: "Service order updated successfully", service_order: updated[0] });
  } catch (err) {
    return sendServerError(res, err, "Error updating service order:");
  }
};

/* ---------- 3) Iniciar orden (solo si está Pendiente) ---------- */
export const startServiceOrder = async (req, res) => {
  const { id } = req.params;
  const { start_time } = req.body;

  try {
    const [existing] = await pool.query(
      "SELECT * FROM services_orders WHERE id_service_order = ?",
      [id]
    );
    if (!existing.length) return res.status(404).json({ message: "Orden no encontrada" });

    const current = existing[0];

    // Solo permitir iniciar si está Pendiente
    if (current.state_ !== "pendiente") {
      return res.status(400).json({ message: `No se puede iniciar: estado actual "${current.state_}"` });
    }

    // Validar formato de hora; si no viene, tomar hora actual del servidor en HH:mm:ss
    let st = start_time;
    if (!st) {
      const d = new Date();
      st = d.toTimeString().split(" ")[0];
    }
    if (!isValidTime(st)) {
      return res.status(400).json({ message: "start_time debe tener formato HH:mm:ss" });
    }

    const [result] = await pool.query(
      `UPDATE services_orders 
       SET start_time = ?, state_ = 'en_progreso'
       WHERE id_service_order = ?`,
      [st, id]
    );

    if (result.affectedRows === 0) return res.status(500).json({ message: "No se pudo actualizar la orden" });

    const [updated] = await pool.query("SELECT * FROM services_orders WHERE id_service_order = ?", [id]);
    return res.json({ message: "Orden iniciada correctamente", service_order: updated[0] });
  } catch (err) {
    return sendServerError(res, err, "Error al iniciar orden:");
  }
};

/* ---------- 4) Completar orden (solo si está En_Progreso) + opción: insertar productos usados en la misma transacción ---------- */
export const completeServiceOrder = async (req, res) => {
  const { id } = req.params;
  const { end_time, products } = req.body; 
  // products: optional array [{ product_id, quantity_used }, ...]

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query(
      "SELECT * FROM services_orders WHERE id_service_order = ? FOR UPDATE",
      [id]
    );
    if (!existing.length) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    const current = existing[0];

    // Solo permitir completar si está En_Progreso
    if (current.state_ !== "en_progreso") {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ message: `No se puede completar: estado actual "${current.state_}"` });
    }

    // Validar hora
    let et = end_time;
    if (!et) {
      const d = new Date();
      et = d.toTimeString().split(" ")[0];
    }
    if (!isValidTime(et)) {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ message: "end_time debe tener formato HH:mm:ss" });
    }

    // Si vienen products, validar e insertar
    const productList = ensureArray(products);
    if (productList.length) {
      for (const it of productList) {
        if (!it.product_id || !(Number.isFinite(it.quantity_used) || typeof it.quantity_used === "number")) {
          await conn.rollback();
          conn.release();
          return res.status(400).json({ message: "Cada producto necesita product_id y quantity_used (number)" });
        }
        if (it.quantity_used <= 0) {
          await conn.rollback();
          conn.release();
          return res.status(400).json({ message: "quantity_used debe ser mayor que 0" });
        }
        await conn.query(
          `INSERT INTO service_order_products (service_order_id, product_id, quantity_used)
           VALUES (?, ?, ?)`,
          [id, it.product_id, it.quantity_used]
        );
      }
    }

    // Marcar orden como completada
    await conn.query(
      `UPDATE services_orders 
       SET end_time = ?, state_ = 'finalizado'
       WHERE id_service_order = ?`,
      [et, id]
    );

    await conn.commit();

    const [updated] = await pool.query("SELECT * FROM services_orders WHERE id_service_order = ?", [id]);
    conn.release();
    return res.json({ message: "Orden completada correctamente", service_order: updated[0] });
  } catch (err) {
    await conn.rollback();
    conn.release();
    return sendServerError(res, err, "Error al completar orden:");
  }
};

/* ---------- 5) Cancelar una orden (no permitir cancelar completadas) ---------- */
export const cancelServiceOrder = async (req, res) => {
  const { id } = req.params;
  const { cancel_reason } = req.body;

  try {
    const [existing] = await pool.query(
      "SELECT * FROM services_orders WHERE id_service_order = ?",
      [id]
    );
    if (!existing.length) return res.status(404).json({ message: "Orden no encontrada" });

    const current = existing[0];
    if (current.state_ === "finalizado") {
      return res.status(400).json({ message: "No se puede cancelar una orden completada" });
    }

    await pool.query(
      `UPDATE services_orders 
       SET state_ = 'finalizado', cancel_reason = ?
       WHERE id_service_order = ?`,
      [cancel_reason || null, id]
    );

    const [updated] = await pool.query("SELECT * FROM services_orders WHERE id_service_order = ?", [id]);
    return res.json({ message: "Orden cancelada correctamente", service_order: updated[0] });
  } catch (err) {
    return sendServerError(res, err, "Error al cancelar orden:");
  }
};

/* ---------- 6) Registrar materiales usados (si quieres hacerlo por separado) ---------- */
export const addUsedProducts = async (req, res) => {
  const { id } = req.params;
  const { products } = req.body; // expected array

  try {
    const productList = ensureArray(products);
    if (!productList.length) return res.status(400).json({ message: "products debe ser un array no vacío" });

    const [existing] = await pool.query("SELECT * FROM services_orders WHERE id_service_order = ?", [id]);
    if (!existing.length) return res.status(404).json({ message: "Orden no encontrada" });

    for (const item of productList) {
      if (!item.product_id || !(Number.isFinite(item.quantity_used) || typeof item.quantity_used === "number")) {
        return res.status(400).json({ message: "Cada producto necesita product_id y quantity_used (number)" });
      }
      if (item.quantity_used <= 0) {
        return res.status(400).json({ message: "quantity_used debe ser mayor que 0" });
      }

      await pool.query(
        `INSERT INTO service_order_products (service_order_id, product_id, quantity_used)
         VALUES (?, ?, ?)`,
        [id, item.product_id, item.quantity_used]
      );
    }

    return res.json({ message: "Materiales registrados correctamente", service_order_id: id });
  } catch (err) {
    return sendServerError(res, err, "Error al registrar productos:");
  }
};

/* ---------- 7) Guardar firma (usa columna 'files') ---------- */
export const signServiceOrder = async (req, res) => {
  const { id } = req.params;
  const { files } = req.body; // base64 or file identifier

  if (!files) return res.status(400).json({ message: "Se requiere 'files' (base64 o path)" });

  try {
    const [existing] = await pool.query("SELECT * FROM services_orders WHERE id_service_order = ?", [id]);
    if (!existing.length) return res.status(404).json({ message: "Orden no encontrada" });

    await pool.query(
      `UPDATE services_orders 
       SET files = ?
       WHERE id_service_order = ?`,
      [files, id]
    );

    return res.json({ message: "Firma guardada correctamente", service_order_id: id });
  } catch (err) {
    return sendServerError(res, err, "Error al guardar firma:");
  }
};
