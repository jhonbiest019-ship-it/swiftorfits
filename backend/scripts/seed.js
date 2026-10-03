import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { query, close } from '../src/db.js';
import { runMigrations } from './migrate.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runSeed() {
  console.log('--- Starting SwiftOrbits Data Seed & Migration ---');
  await runMigrations();

  // 1. SEED DEFAULT ADMIN USER
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@swiftorbits.us';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await query(`
    INSERT INTO admin_users (email, password_hash, name, role)
    VALUES ($1, $2, 'SwiftOrbits Admin', 'admin')
    ON CONFLICT (email) DO UPDATE
    SET password_hash = EXCLUDED.password_hash,
        updated_at = CURRENT_TIMESTAMP;
  `, [adminEmail, passwordHash]);
  console.log(` Admin user seeded: ${adminEmail} (password: ${adminPassword})`);

  // 2. EXTRACT EXISTING SEED DATA FROM FRONTEND main.js
  const mainJsPath = path.resolve(__dirname, '../../src/main.js');
  if (!fs.existsSync(mainJsPath)) {
    console.warn('! src/main.js not found, skipping frontend data extraction.');
    return;
  }

  const content = fs.readFileSync(mainJsPath, 'utf8');

  const catMatch = content.match(/const CATEGORY_METADATA = (\{[\s\S]*?\n\};)/);
  const prodMatch = content.match(/const SWIFT_SEED_PRODUCTS = (\[[\s\S]*?\n\];)/);
  const ordersMatch = content.match(/const SWIFT_SEED_ORDERS = (\[[\s\S]*?\n\];)/);

  if (!catMatch || !prodMatch) {
    console.error('Failed to locate CATEGORY_METADATA or SWIFT_SEED_PRODUCTS in main.js.');
    return;
  }

  const catData = new Function('return ' + catMatch[1].replace(/;$/, ''))();
  const prodData = new Function('return ' + prodMatch[1].replace(/;$/, ''))();
  const orderData = ordersMatch ? new Function('return ' + ordersMatch[1].replace(/;$/, ''))() : [];

  // 3. SEED CATEGORIES
  console.log(` Migrating ${Object.keys(catData).length} categories into PostgreSQL...`);
  for (const [slug, cat] of Object.entries(catData)) {
    await query(`
      INSERT INTO categories (name, slug, description)
      VALUES ($1, $2, $3)
      ON CONFLICT (slug) DO UPDATE
      SET name = EXCLUDED.name,
          description = EXCLUDED.description,
          updated_at = CURRENT_TIMESTAMP;
    `, [cat.title || slug, slug, cat.desc || '']);
  }
  console.log(' Categories migrated successfully!');

  // 4. SEED PRODUCTS
  console.log(` Migrating ${prodData.length} existing products into PostgreSQL...`);
  let importedCount = 0;
  for (const p of prodData) {
    const imageReplacements = {
      'https://images.unsplash.com/photo-1609592424074-8fa29813c9fb?w=600&auto=format&fit=crop&q=80': '/usb_cable.png',
      'https://images.unsplash.com/photo-1583244685025-ce0db86b6277?w=600&auto=format&fit=crop&q=80': '/elec_earbuds.png',
      'https://images.unsplash.com/photo-1622445262464-84b15079a405?w=600&auto=format&fit=crop&q=80': '/usb_cable.png',
      'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=600&auto=format&fit=crop&q=80': '/smart_tv.png',
      'https://images.unsplash.com/photo-1608248597261-833258657b45?w=600&auto=format&fit=crop&q=80': '/niacinamide_serum.png'
    };
    const prodImg = imageReplacements[p.image] || p.image || '/elec_phone.png';

    const res = await query(`
      INSERT INTO products (
        sku, title, category, regular_price, sale_price, stock_qty,
        is_flash_sale, sold_percent, rating, reviews_count, attributes, image, active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
      ON CONFLICT (sku) DO UPDATE
      SET title = EXCLUDED.title,
          category = EXCLUDED.category,
          regular_price = EXCLUDED.regular_price,
          sale_price = EXCLUDED.sale_price,
          stock_qty = EXCLUDED.stock_qty,
          is_flash_sale = EXCLUDED.is_flash_sale,
          sold_percent = EXCLUDED.sold_percent,
          rating = EXCLUDED.rating,
          reviews_count = EXCLUDED.reviews_count,
          attributes = EXCLUDED.attributes,
          image = EXCLUDED.image,
          updated_at = CURRENT_TIMESTAMP
      RETURNING id;
    `, [
      p.sku,
      p.title,
      p.category,
      p.regular_price,
      p.sale_price || null,
      p.stock_qty || 0,
      !!p.is_flash_sale,
      p.sold_percent || 0,
      p.rating || 4.8,
      p.reviews_count || 0,
      JSON.stringify(p.attributes || {}),
      prodImg
    ]);

    const productId = res.rows[0]?.id;
    if (productId && prodImg) {
      await query(`
        INSERT INTO product_images (product_id, image_url, is_primary)
        VALUES ($1, $2, true)
        ON CONFLICT DO NOTHING;
      `, [productId, prodImg]);
    }
    importedCount++;
  }
  console.log(` Successfully migrated ${importedCount} products into PostgreSQL!`);

  // 5. PURGE MOCK ORDERS - ZERO FAKE DATA
  console.log(' Purging any legacy mock seed orders...');
  await query(`DELETE FROM orders WHERE order_number IN ('SO-US-89104A', 'SO-US-44719B');`);
  console.log(' Database seed & migration completed successfully with 100% Real Order Queue!');
}

if (process.argv[1].endsWith('seed.js')) {
  runSeed()
    .then(async () => {
      await close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Seed execution error:', err);
      await close();
      process.exit(1);
    });
}
