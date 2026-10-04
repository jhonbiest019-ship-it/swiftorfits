import { exec, close } from '../src/db.js';

export async function runMigrations() {
  console.log('--- Starting PostgreSQL Database Migrations ---');

  const migrationSQL = `
    -- 1. ADMIN USERS TABLE
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. CATEGORIES TABLE
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. PRODUCTS TABLE
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      sku VARCHAR(100) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      regular_price NUMERIC(10, 2) NOT NULL,
      sale_price NUMERIC(10, 2),
      stock_qty INTEGER NOT NULL DEFAULT 0,
      is_flash_sale BOOLEAN DEFAULT FALSE,
      sold_percent INTEGER DEFAULT 0,
      rating NUMERIC(3, 2) DEFAULT 4.80,
      reviews_count INTEGER DEFAULT 0,
      attributes JSONB DEFAULT '{}'::jsonb,
      image TEXT,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. PRODUCT IMAGES TABLE
    CREATE TABLE IF NOT EXISTS product_images (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      is_primary BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 5. ORDERS TABLE
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_number VARCHAR(100) UNIQUE NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(100) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      shipping_address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
      subtotal NUMERIC(10, 2) NOT NULL,
      grand_total NUMERIC(10, 2) NOT NULL,
      payment_method VARCHAR(50) DEFAULT 'credit_card',
      payment_status VARCHAR(50) DEFAULT 'paid',
      order_status VARCHAR(50) DEFAULT 'processing',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 6. ORDER ITEMS TABLE
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      sku VARCHAR(100) NOT NULL,
      product_title VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price NUMERIC(10, 2) NOT NULL,
      line_total NUMERIC(10, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 7. ORDER STATUS HISTORY TABLE
    CREATE TABLE IF NOT EXISTS order_status_history (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      previous_status VARCHAR(50),
      new_status VARCHAR(50) NOT NULL,
      comment TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 8. CUSTOMER USERS TABLE
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'customer',
      email_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 9. EMAIL OTPs & TOKENS TABLE
    CREATE TABLE IF NOT EXISTS otps (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      email VARCHAR(255) NOT NULL,
      otp_hash VARCHAR(255) NOT NULL,
      purpose VARCHAR(50) NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      attempts INTEGER DEFAULT 0,
      used_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 10. SYSTEM & DISPLAY SETTINGS TABLE
    CREATE TABLE IF NOT EXISTS site_settings (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO site_settings (key, value) VALUES ('hero_quad_rotation_seconds', '10') ON CONFLICT (key) DO NOTHING;
    INSERT INTO site_settings (key, value) VALUES ('hero_quad_rotation_enabled', 'true') ON CONFLICT (key) DO NOTHING;

    -- INDEXES FOR MAXIMUM QUERY PERFORMANCE
    CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
    CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_otps_email_purpose ON otps(email, purpose);
    CREATE INDEX IF NOT EXISTS idx_otps_expires_at ON otps(expires_at);
  `;

  await exec(migrationSQL);
  console.log(' PostgreSQL Schema Migrations executed successfully!');
}

// Allow standalone execution
if (process.argv[1].endsWith('migrate.js')) {
  runMigrations()
    .then(async () => {
      await close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Migration failed:', err);
      await close();
      process.exit(1);
    });
}
