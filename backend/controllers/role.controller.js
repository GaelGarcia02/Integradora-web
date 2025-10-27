import { pool } from "../db.js";

//* Get all roles
export const getRoles = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM roles");

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRolesUsers = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT r.id_role, r.name_role, COUNT(p.id_personal) AS users FROM roles r LEFT JOIN personal p ON r.id_role = p.role_id GROUP BY r.id_role"
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Get a role by ID
export const getRole = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM roles WHERE id_role = ?", [
      req.params.id,
    ]);

    if (result.length == 0) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Create new role
export const createRole = async (req, res) => {
  try {
    const { name_role } = req.body;

    const [result] = await pool.query(
      "INSERT INTO roles(name_role) VALUES (?)",
      [name_role]
    );

    res.json({ id: result.insertId, name_role });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Update role
export const updateRole = async (req, res) => {
  try {
    const result = await pool.query("UPDATE roles SET ? WHERE id_role = ?", [
      req.body,
      req.params.id,
    ]);

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Delete role
export const deleteRole = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM roles WHERE id_role = ?", [
      req.params.id,
    ]);

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
