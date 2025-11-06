import { pool } from "../db.js";

//* Obtener todas las categorías
export const getCategories = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM categories ORDER BY name_ ASC"
    );
    res.json(result);
  } catch (error) {
    console.error("❌ Error en getCategories:", error);
    return res.status(500).json({ message: error.message });
  }
};

//* Obtener una categoría por ID
export const getCategory = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM categories WHERE id_category = ?",
      [req.params.id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("❌ Error en getCategory:", error);
    return res.status(500).json({ message: error.message });
  }
};

//* Crear una nueva categoría
export const createCategory = async (req, res) => {
  try {
    const { name_, unit } = req.body;

    if (!name_ || !unit) {
      return res
        .status(400)
        .json({ message: "Los campos name_ y unit son obligatorios" });
    }

    const [result] = await pool.query(
      "INSERT INTO categories (name_, unit) VALUES (?, ?)",
      [name_, unit]
    );

    res.json({
      id_category: result.insertId,
      name_,
      unit,
      message: "✅ Categoría creada correctamente",
    });
  } catch (error) {
    console.error("❌ Error en createCategory:", error);
    return res.status(500).json({ message: error.message });
  }
};

//* Actualizar una categoría
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_, unit } = req.body;

    if (!name_ || !unit) {
      return res
        .status(400)
        .json({ message: "Los campos name_ y unit son obligatorios" });
    }

    const [result] = await pool.query(
      "UPDATE categories SET name_ = ?, unit = ? WHERE id_category = ?",
      [name_, unit, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json({ message: "✅ Categoría actualizada correctamente" });
  } catch (error) {
    console.error("❌ Error en updateCategory:", error);
    return res.status(500).json({ message: error.message });
  }
};

//* Eliminar una categoría
export const deleteCategory = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM categories WHERE id_category = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("❌ Error en deleteCategory:", error);
    return res.status(500).json({ message: error.message });
  }
};