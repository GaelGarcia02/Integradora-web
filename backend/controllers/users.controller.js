import { pool } from "../db.js";
import bcrypt from "bcryptjs";

//* Get all users
export const getUsers = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM personal ORDER BY name_ DESC"
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//* Get all users v2 (traer el nombre del rol en vez del id del mismo)
export const getUsersRole = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT p.id_personal, p.name_, p.last_name, p.email, p.cell_number, p.country, p.state_, p.city, p.phone, p.address_, p.password_, r.name_role FROM personal p INNER JOIN roles r ON p.role_id = r.id_role"
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//* Get one user
export const getUser = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM personal WHERE id_personal = ?",
      [req.params.id]
    );

    if (result.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Create new user
export const createUser = async (req, res) => {
  try {
    const {
      name_,
      last_name,
      email,
      cell_number,
      country,
      state_,
      city,
      phone,
      address_,
      password_,
      role_id,
    } = req.body;

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10); // Generar un salt
    const hashedPassword = await bcrypt.hash(password_, salt); // Encriptar la contraseña

    const [result] = await pool.query(
      "INSERT INTO personal(name_, last_name, email, cell_number, country, state_, city, phone, address_, password_, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name_,
        last_name,
        email,
        cell_number,
        country,
        state_,
        city,
        phone,
        address_,
        hashedPassword,
        role_id,
      ]
    );

    res.json({ id: result.insertId, name_, last_name, role_id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Update a user
export const updateUser = async (req, res) => {
  try {
    const userData = { ...req.body };

    delete userData.confirmPassword;

    // Si se incluye una nueva contraseña, encriptarla
    if (userData.password_) {
      const salt = await bcrypt.genSalt(10);
      userData.password_ = await bcrypt.hash(userData.password_, salt);
    }

    const [result] = await pool.query(
      "UPDATE personal SET ? WHERE id_personal = ?",
      [userData, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Delete a user
export const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM personal WHERE id_personal = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
