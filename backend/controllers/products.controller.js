import { pool } from "../db.js";

//* Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT 
        p.id_product,
        p.name_,
        p.category_id,
        c.name_ AS category_name,
        c.unit AS unit, -- 👈 ahora viene desde categories
        p.description_,
        p.sale_price,
        p.model,
        p.factory_code,
        p.supplier_id,
        p.manufacturer_brand,
        p.initial_stock,
        p.minimum_stock,
        p.product_image
      FROM products p
      JOIN categories c ON p.category_id = c.id_category
      ORDER BY p.name_ ASC
    `);

    res.json(result);
  } catch (error) {
    console.error("❌ Error en getProducts:", error);
    res.status(500).json({ message: error.message });
  }
};

//* Obtener productos con proveedores
export const getProductsProvider = async (req, res) => {
  try {
    console.log("🔥 Entró a getProductsProvider");
    const [result] = await pool.query(`
      SELECT 
        p.id_product, 
        p.name_, 
        p.category_id,
        c.name_ AS category_name,
        c.unit AS unit,
        p.description_, 
        p.sale_price, 
        p.model, 
        p.factory_code, 
        p.supplier_id, 
        s.trade_name AS supplier_name, 
        p.manufacturer_brand, 
        p.initial_stock, 
        p.minimum_stock, 
        p.product_image
      FROM products p
      JOIN suppliers s ON p.supplier_id = s.id_supplier
      JOIN categories c ON p.category_id = c.id_category
      ORDER BY p.name_ ASC
    `);

    console.log("📦 Resultados:", result.length);
    res.json(result);
  } catch (error) {
    console.error("❌ Error en getProductsProvider:", error);
    return res.status(500).json({ message: error.message });
  }
};

//* Obtener un producto por ID
export const getProduct = async (req, res) => {
  try {
    const [result] = await pool.query(
      `
      SELECT 
        p.*, 
        c.name_ AS category_name,
        c.unit AS unit
      FROM products p
      JOIN categories c ON p.category_id = c.id_category
      WHERE p.id_product = ?
      `,
      [req.params.id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("❌ Error en getProduct:", error);
    return res.status(500).json({ message: error.message });
  }
};

//* Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const {
      name_,
      category_id,
      description_,
      sale_price,
      model,
      factory_code,
      supplier_id,
      manufacturer_brand,
      initial_stock,
      minimum_stock,
      product_image,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO products 
      (name_, category_id, description_, sale_price, model, factory_code, supplier_id, manufacturer_brand, initial_stock, minimum_stock, product_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name_,
        category_id,
        description_,
        sale_price,
        model,
        factory_code,
        supplier_id,
        manufacturer_brand,
        initial_stock,
        minimum_stock,
        product_image || null,
      ]
    );

    res.json({ id: result.insertId, name_ });
  } catch (error) {
    console.error("❌ Error en createProduct:", error);
    return res.status(500).json({ message: error.message });
  }
};

//* Actualizar un producto existente
export const updateProduct = async (req, res) => {
  try {
    console.log("📩 Petición PUT recibida en updateProduct");
    console.log("🟢 Body recibido:", req.body);

    const { id } = req.params;

    // ✅ Campos válidos (ya sin 'unit')
    const allowedFields = [
      "name_",
      "category_id",
      "description_",
      "sale_price",
      "model",
      "factory_code",
      "supplier_id",
      "manufacturer_brand",
      "initial_stock",
      "minimum_stock",
      "product_image",
    ];

    // 🔍 Filtramos solo los campos válidos
    const filteredData = Object.keys(req.body)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    console.log("🧾 Campos que se van a actualizar:", filteredData);

    if (Object.keys(filteredData).length === 0) {
      return res
        .status(400)
        .json({ message: "No se enviaron campos válidos para actualizar." });
    }

    const [result] = await pool.query(
      "UPDATE products SET ? WHERE id_product = ?",
      [filteredData, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    console.log("✅ Producto actualizado correctamente");
    res.json({ message: "✅ Producto actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error en updateProduct:", error);
    res.status(500).json({ message: error.message });
  }
};

//* Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM products WHERE id_product = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("❌ Error en deleteProduct:", error);
    return res.status(500).json({ message: error.message });
  }
};