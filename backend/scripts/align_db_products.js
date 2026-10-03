import fs from 'fs';
import path from 'path';
import { query, close } from '../src/db.js';

async function alignDb() {
  console.log('--- ALIGNING DATABASE PRODUCTS TO EXACT 150 EXPANDED PRODUCTS ---');
  const mainJsPath = path.resolve('src/main.js');
  const content = fs.readFileSync(mainJsPath, 'utf8');
  const match = content.match(/const SWIFT_SEED_PRODUCTS = (\[[\s\S]*?\n\];)/);
  if (!match) {
    console.error('Could not find SWIFT_SEED_PRODUCTS in src/main.js');
    process.exit(1);
  }
  const prods = new Function('return ' + match[1].replace(/;$/, ''))();
  console.log(`Found ${prods.length} products in main.js.`);

  // 1. Mark all existing inactive
  await query('UPDATE products SET active = false;');

  // 2. Insert or update the 150 products
  let updated = 0;
  for (const p of prods) {
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
          active = true,
          updated_at = CURRENT_TIMESTAMP;
    `, [
      p.sku,
      p.title,
      p.category,
      p.regular_price,
      p.sale_price,
      p.stock_qty,
      p.is_flash_sale,
      p.sold_percent,
      p.rating,
      p.reviews_count,
      JSON.stringify(p.attributes || {}),
      p.image
    ]);
    updated++;
  }

  // 3. Verify counts
  const catRes = await query('SELECT category, count(*) as count FROM products WHERE active = true GROUP BY category ORDER BY category ASC;');
  console.log('Active Category Counts in DB:');
  catRes.rows.forEach(r => console.log(`  - ${r.category}: ${r.count}`));

  const totalRes = await query('SELECT count(*) as total FROM products WHERE active = true;');
  console.log(`Total Active Products in DB: ${totalRes.rows[0].total}`);

  const priceRes = await query('SELECT min(sale_price) as min_p, max(sale_price) as max_p FROM products WHERE active = true;');
  console.log(`Min Price in DB: $${priceRes.rows[0].min_p}`);
  console.log(`Max Price in DB: $${priceRes.rows[0].max_p}`);

  await close();
}

alignDb().catch(e => {
  console.error(e);
  process.exit(1);
});
