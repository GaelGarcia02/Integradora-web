import { pool } from "../db.js";

//* Get all products
export const getProducts = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM products ORDER BY name_ ASC"
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getProductsProvider = async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT p.id_product, p.name_, p.category_id, p.unit, p.description_, p.sale_price, p.model, p.factory_code, p.supplier_id, p.manufacturer_brand, p.initial_stock, p.minimum_stock, s.trade_name AS supplier_name
      FROM products p
      JOIN suppliers s ON p.supplier_id = s.id_supplier
      ORDER BY p.name_ ASC`
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Get a product by ID
export const getProduct = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM products WHERE id_product = ?",
      [req.params.id]
    );

    if (result.length == 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Create a new product
export const createProduct = async (req, res) => {
  try {
    const {
      name_,
      category_id,
      unit,
      description_,
      sale_price,
      model,
      factory_code,
      supplier_id,
      manufacturer_brand,
      initial_stock,
      minimum_stock,
    } = req.body;

    const [result] = await pool.query(
      "INSERT INTO products (name_, category_id, unit, description_, sale_price, model, factory_code, supplier_id, manufacturer_brand, initial_stock, minimum_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name_,
        category_id,
        unit,
        description_,
        sale_price,
        model,
        factory_code,
        supplier_id,
        manufacturer_brand,
        initial_stock,
        minimum_stock,
      ]
    );

    res.json({ id: result.insertId, name_ });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Update a product
export const updateProduct = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE products SET ? WHERE id_product = ?",
      [req.body, req.params.id]
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM products WHERE id_product = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
