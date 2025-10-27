import { pool } from "../db.js";

//* Get all clients
export const getClients = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM clients ORDER BY trade_name DESC"
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Get one client
export const getClient = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM clients WHERE id_client = ?",
      [req.params.id]
    );

    if (result.length == 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Create new client
export const createClient = async (req, res) => {
  try {
    const {
      trade_name,
      business_type,
      phone_or_cell,
      email,
      street,
      number_,
      neighborhood,
      postal_code,
      city,
      country,
      state_,
      contact_name,
      contact_area_or_position,
      contact_cell_phone,
      contact_email,
    } = req.body;

    const [result] = await pool.query(
      "INSERT INTO clients(trade_name, business_type, phone_or_cell, email, street, number_, neighborhood, postal_code, city, country, state_, contact_name, contact_area_or_position, contact_cell_phone, contact_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        trade_name,
        business_type,
        phone_or_cell,
        email,
        street,
        number_,
        neighborhood,
        postal_code,
        city,
        country,
        state_,
        contact_name,
        contact_area_or_position,
        contact_cell_phone,
        contact_email,
      ]
    );

    res.json({ id: result.insertId, trade_name, business_type, email });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Update client
export const updateClient = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE clients SET ? WHERE id_client = ?",
      [req.body, req.params.id]
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Delete client
export const deleteClient = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM clients WHERE id_client = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
