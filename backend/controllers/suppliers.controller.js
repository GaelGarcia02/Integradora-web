import { pool } from "../db.js";

//* Get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM suppliers ORDER BY trade_name DESC"
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Get one supplier
export const getSupplier = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM suppliers WHERE id_supplier = ?",
      [req.params.id]
    );
    if (result.length == 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Create new supplier
export const createSupplier = async (req, res) => {
  try {
    const {
      trade_name,
      business_type,
      cell_number,
      email,
      country,
      state_,
      address_,
      city,
      postal_code,
      location_,
      website,
      billing_name,
      billing_number,
      billing_address,
      contact_name,
      contact_area_or_position,
      contact_cell_phone,
      contact_email,
    } = req.body;

    const [result] = await pool.query(
      "INSERT INTO suppliers(trade_name, business_type, cell_number, email, country, state_, address_, city, postal_code, location_, website, billing_name, billing_number, billing_address, contact_name, contact_area_or_position, contact_cell_phone, contact_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        trade_name,
        business_type,
        cell_number,
        email,
        country,
        state_,
        address_,
        city,
        postal_code,
        location_,
        website,
        billing_name,
        billing_number,
        billing_address,
        contact_name,
        contact_area_or_position,
        contact_cell_phone,
        contact_email,
      ]
    );

    res.json({ id: result.insertId, trade_name, business_type });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Update a supplier
export const updateSupplier = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE suppliers SET ? WHERE id_supplier = ?",
      [req.body, req.params.id]
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Delete a supplier
export const deleteSupplier = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM suppliers WHERE id_supplier = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
