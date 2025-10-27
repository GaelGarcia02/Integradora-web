import { pool } from "../db.js";

//* Get all services
export const getServices = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM services ORDER BY name_ ASC"
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Get a service by ID
export const getService = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM services WHERE id_service = ?",
      [req.params.id]
    );

    if (result.length == 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Create a new service
export const createService = async (req, res) => {
  try {
    const { name_, category_id, sale_price, description_, sat_unit, sat_code } =
      req.body;

    const [result] = await pool.query(
      "INSERT INTO services (name_, category_id, sale_price, description_, sat_unit, sat_code) VALUES (?, ?, ?, ?, ?, ?)",
      [name_, category_id, sale_price, description_, sat_unit, sat_code]
    );

    res.json({ id: result.insertId, name_ });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Update a service
export const updateService = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE services SET ? WHERE id_service = ?",
      [req.body, req.params.id]
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Delete a service
export const deleteService = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM services WHERE id_service = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
