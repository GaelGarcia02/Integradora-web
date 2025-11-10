USE salientglobaltech;

CREATE TABLE roles (
        id_role INTEGER PRIMARY KEY AUTO_INCREMENT,
        name_role VARCHAR(50) NOT NULL
    );

CREATE TABLE personal (
        id_personal INTEGER PRIMARY KEY AUTO_INCREMENT,
        name_ VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        cell_number VARCHAR(10) NOT NULL,
        country VARCHAR(100) NOT NULL,
        state_ VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        phone VARCHAR(10),
        address_ TEXT NOT NULL,
        password_ VARCHAR(200) NOT NULL,
        role_id INTEGER NOT NULL,
        FOREIGN KEY (role_id) REFERENCES roles (id_role)
    );

CREATE TABLE clients (
        id_client INTEGER PRIMARY KEY AUTO_INCREMENT,
        trade_name VARCHAR(255) NOT NULL,
        business_type VARCHAR(255) NOT NULL,
        phone_or_cell VARCHAR(100),
        email VARCHAR(255),
        street VARCHAR(255) NOT NULL,
        number_ VARCHAR(50) NOT NULL,
        neighborhood VARCHAR(255),
        postal_code VARCHAR(20),
        city VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        state_ VARCHAR(100) NOT NULL,
        contact_name VARCHAR(255) NOT NULL,
        contact_area_or_position VARCHAR(100),
        contact_cell_phone VARCHAR(100) NOT NULL,
        contact_email VARCHAR(255)
    );

CREATE TABLE suppliers (
        id_supplier INTEGER PRIMARY KEY AUTO_INCREMENT,
        trade_name VARCHAR(255) NOT NULL,
        business_type VARCHAR(255) NOT NULL,
        cell_number VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        country VARCHAR(100) NOT NULL,
        state_ VARCHAR(100) NOT NULL,
        address_ TEXT,
        city VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20),
        website VARCHAR(255),
        billing_name VARCHAR(255),
        billing_number VARCHAR(100),
        billing_address TEXT,
        contact_name VARCHAR(255) NOT NULL,
        contact_area_or_position VARCHAR(100),
        contact_cell_phone VARCHAR(100) NOT NULL,
        contact_email VARCHAR(255)
    );

CREATE TABLE contacts (
        id_contact INTEGER PRIMARY KEY AUTO_INCREMENT,
        name_ VARCHAR(200) NOT NULL,
        last_name VARCHAR(200) NOT NULL,
        position VARCHAR(200) NOT NULL,
        cell_number VARCHAR(10) NOT NULL,
        phone_number VARCHAR(10),
        email VARCHAR(200),
        street VARCHAR(200),
        number_ VARCHAR(10),
        neighborhood VARCHAR(200),
        country VARCHAR(100),
        state_ VARCHAR(100),
        city VARCHAR(100),
        postal_code VARCHAR(20)
    );

CREATE TABLE categories (
        id_category INTEGER PRIMARY KEY AUTO_INCREMENT,
        name_ VARCHAR(50),
        unit VARCHAR(50) NOT NULL
    );

CREATE TABLE products (
        id_product INTEGER PRIMARY KEY AUTO_INCREMENT,
        name_ VARCHAR(255) NOT NULL,
        category_id INTEGER NOT NULL,
        description_ TEXT NOT NULL,
        sale_price DECIMAL(10, 2) NOT NULL,
        model VARCHAR(100),
        factory_code VARCHAR(100),
        supplier_id INTEGER NOT NULL,
        manufacturer_brand VARCHAR(255),
        initial_stock INTEGER NOT NULL,
        minimum_stock INTEGER NOT NULL,
        product_image VARCHAR(50),
        FOREIGN KEY (category_id) REFERENCES categories (id_category),
        FOREIGN KEY (supplier_id) REFERENCES suppliers (id_supplier)
    );

CREATE TABLE services (
        id_service INTEGER PRIMARY KEY AUTO_INCREMENT,
        name_ VARCHAR(255) NOT NULL,
        category_id INTEGER NOT NULL,
        sale_price DECIMAL(10, 2) NOT NULL,
        description_ TEXT NOT NULL,
        sat_unit VARCHAR(100),
        sat_code VARCHAR(100),
        FOREIGN KEY (category_id) REFERENCES categories (id_category)
    );

CREATE TABLE services_orders (
        id_service_order INTEGER PRIMARY KEY AUTO_INCREMENT,
        client_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        personal_id INTEGER NOT NULL,
        contact_name VARCHAR(100) NOT NULL,
        contact_phone VARCHAR(100) NOT NULL,
        contact_email VARCHAR(100) NOT NULL,
        scheduled_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        activities VARCHAR(4000) NOT NULL,
        recomendations VARCHAR(4000) NOT NULL,
        files VARCHAR(50),
        notes VARCHAR(100),
        state_ VARCHAR(50) NOT NULL,
        products JSON NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients (id_client),
        FOREIGN KEY (service_id) REFERENCES services (id_service),
        FOREIGN KEY (personal_id) REFERENCES personal (id_personal)
    );

CREATE TABLE service_order_products (
    id_order_product INTEGER PRIMARY KEY AUTO_INCREMENT,
    service_order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity_used INTEGER NOT NULL,
    FOREIGN KEY (service_order_id) REFERENCES services_orders(id_service_order) ON DELETE CASCADE, -- Si se borra la orden, se borra este registro
    FOREIGN KEY (product_id) REFERENCES products(id_product) ON DELETE RESTRICT, -- No dejes borrar un producto si está en una orden
    UNIQUE KEY uk_order_product (service_order_id, product_id)   -- Evita duplicados (no puedes agregar el mismo producto dos veces a la misma orden)
);