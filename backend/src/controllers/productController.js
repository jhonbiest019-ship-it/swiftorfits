import { query } from '../db.js';
import {
  emitProductCreated,
  emitProductUpdated,
  emitProductDeleted,
  emitStockUpdated
} from '../sockets/socketManager.js';

export async function getAllProducts(req, res) {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      inStock,
      flashSale,
      sortBy = 'featured',
      limit = 500,
      offset = 0
    } = req.query;

    const conditions = ['active = true'];
    const params = [];
    let pIdx = 1;

    if (category && category !== 'all') {
      conditions.push(`category = $${pIdx}`);
      params.push(category.toLowerCase());
      pIdx++;
    }

    if (search && search.trim()) {
      conditions.push(`(title ILIKE $${pIdx} OR sku ILIKE $${pIdx} OR category ILIKE $${pIdx})`);
      params.push(`%${search.trim()}%`);
      pIdx++;
    }

    if (minPrice && !isNaN(minPrice)) {
      conditions.push(`COALESCE(sale_price, regular_price) >= $${pIdx}`);
      params.push(parseFloat(minPrice));
      pIdx++;
    }

    if (maxPrice && !isNaN(maxPrice)) {
      conditions.push(`COALESCE(sale_price, regular_price) <= $${pIdx}`);
      params.push(parseFloat(maxPrice));
      pIdx++;
    }

    if (inStock === 'true' || inStock === true) {
      conditions.push(`stock_qty > 0`);
    }

    if (flashSale === 'true' || flashSale === true) {
      conditions.push(`is_flash_sale = true`);
    }

    let orderBy = 'id ASC';
    if (sortBy === 'price-asc') {
      orderBy = 'COALESCE(sale_price, regular_price) ASC';
    } else if (sortBy === 'price-desc') {
      orderBy = 'COALESCE(sale_price, regular_price) DESC';
    } else if (sortBy === 'rating') {
      orderBy = 'rating DESC, reviews_count DESC';
    } else if (sortBy === 'bestsellers') {
      orderBy = 'sold_percent DESC, rating DESC';
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `
      SELECT id, sku, title, category, regular_price, sale_price, stock_qty,
             is_flash_sale, sold_percent, rating, reviews_count, attributes,
             image, active, created_at, updated_at
      FROM products
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${pIdx} OFFSET $${pIdx + 1};
    `;

    params.push(parseInt(limit) || 200);
    params.push(parseInt(offset) || 0);

    const result = await query(sql, params);

    // Normalize numeric fields and attributes for frontend compatibility
    const products = result.rows.map(p => ({
      ...p,
      regular_price: parseFloat(p.regular_price),
      sale_price: p.sale_price !== null ? parseFloat(p.sale_price) : null,
      rating: parseFloat(p.rating),
      attributes: typeof p.attributes === 'string' ? JSON.parse(p.attributes) : (p.attributes || {})
    }));

    return res.json({
      ok: true,
      count: products.length,
      products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ ok: false, error: 'Failed to retrieve products.' });
  }
}

export async function getProductBySku(req, res) {
  try {
    const { sku } = req.params;
    const result = await query(`
      SELECT * FROM products WHERE sku = $1 AND active = true;
    `, [sku]);

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Product not found.' });
    }

    const p = result.rows[0];
    const imagesRes = await query('SELECT image_url, is_primary FROM product_images WHERE product_id = $1', [p.id]);

    const product = {
      ...p,
      regular_price: parseFloat(p.regular_price),
      sale_price: p.sale_price !== null ? parseFloat(p.sale_price) : null,
      rating: parseFloat(p.rating),
      attributes: typeof p.attributes === 'string' ? JSON.parse(p.attributes) : (p.attributes || {}),
      images: imagesRes.rows
    };

    return res.json({ ok: true, product });
  } catch (err) {
    console.error('Error fetching product by SKU:', err);
    return res.status(500).json({ ok: false, error: 'Failed to retrieve product details.' });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      title,
      sku,
      category,
      regular_price,
      sale_price,
      stock_qty = 50,
      is_flash_sale = false,
      attributes = {},
      image = '/elec_phone.png',
      images = []
    } = req.body;

    if (!title || !sku || !category || regular_price === undefined) {
      return res.status(400).json({
        ok: false,
        error: 'Title, unique SKU, category, and regular price are required.'
      });
    }

    const cleanSku = sku.trim().toUpperCase();

    // Check SKU uniqueness
    const existing = await query('SELECT id FROM products WHERE sku = $1', [cleanSku]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        ok: false,
        error: `SKU '${cleanSku}' already exists in inventory. Each product must have a unique SKU.`
      });
    }

    const attrJson = typeof attributes === 'string' ? attributes : JSON.stringify(attributes);

    const result = await query(`
      INSERT INTO products (
        title, sku, category, regular_price, sale_price, stock_qty,
        is_flash_sale, sold_percent, rating, reviews_count, attributes, image, active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 4.9, 1, $8, $9, true)
      RETURNING *;
    `, [
      title.trim(),
      cleanSku,
      category.trim().toLowerCase(),
      parseFloat(regular_price),
      sale_price ? parseFloat(sale_price) : null,
      parseInt(stock_qty) || 0,
      !!is_flash_sale,
      attrJson,
      image
    ]);

    const newProd = result.rows[0];

    // Insert additional images if provided
    if (Array.isArray(images) && images.length > 0) {
      for (const imgUrl of images) {
        await query(
          'INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, false)',
          [newProd.id, imgUrl]
        );
      }
    } else if (image) {
      await query(
        'INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, true)',
        [newProd.id, image]
      );
    }

    const formattedProd = {
      ...newProd,
      regular_price: parseFloat(newProd.regular_price),
      sale_price: newProd.sale_price !== null ? parseFloat(newProd.sale_price) : null,
      rating: parseFloat(newProd.rating),
      attributes: typeof newProd.attributes === 'string' ? JSON.parse(newProd.attributes) : (newProd.attributes || {})
    };

    // Broadcast Realtime Product Event
    emitProductCreated(formattedProd);

    return res.status(201).json({
      ok: true,
      message: 'Product published to SwiftOrbits USA catalog successfully.',
      product: formattedProd
    });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ ok: false, error: 'Failed to create product: ' + err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      sku,
      category,
      regular_price,
      sale_price,
      stock_qty,
      is_flash_sale,
      rating,
      reviews_count,
      attributes,
      image,
      active
    } = req.body;

    const fields = [];
    const params = [];
    let pIdx = 1;

    if (title !== undefined) { fields.push(`title = $${pIdx++}`); params.push(title.trim()); }
    if (sku !== undefined && sku.trim()) { fields.push(`sku = $${pIdx++}`); params.push(sku.trim().toUpperCase()); }
    if (category !== undefined) { fields.push(`category = $${pIdx++}`); params.push(category.trim().toLowerCase()); }
    if (regular_price !== undefined) { fields.push(`regular_price = $${pIdx++}`); params.push(parseFloat(regular_price)); }
    if (sale_price !== undefined) { fields.push(`sale_price = $${pIdx++}`); params.push(sale_price ? parseFloat(sale_price) : null); }
    if (stock_qty !== undefined) { fields.push(`stock_qty = $${pIdx++}`); params.push(parseInt(stock_qty)); }
    if (is_flash_sale !== undefined) { fields.push(`is_flash_sale = $${pIdx++}`); params.push(!!is_flash_sale); }
    if (rating !== undefined) { fields.push(`rating = $${pIdx++}`); params.push(parseFloat(rating)); }
    if (reviews_count !== undefined) { fields.push(`reviews_count = $${pIdx++}`); params.push(parseInt(reviews_count)); }
    if (attributes !== undefined) {
      fields.push(`attributes = $${pIdx++}`);
      params.push(typeof attributes === 'string' ? attributes : JSON.stringify(attributes));
    }
    if (image !== undefined) { fields.push(`image = $${pIdx++}`); params.push(image); }
    if (active !== undefined) { fields.push(`active = $${pIdx++}`); params.push(!!active); }

    if (fields.length === 0) {
      return res.status(400).json({ ok: false, error: 'No fields provided to update.' });
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(String(id));

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE (id::text = $${pIdx} OR sku = $${pIdx}) RETURNING *;`;
    const result = await query(sql, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Product not found.' });
    }

    const updated = result.rows[0];
    const formatted = {
      ...updated,
      regular_price: parseFloat(updated.regular_price),
      sale_price: updated.sale_price !== null ? parseFloat(updated.sale_price) : null,
      rating: parseFloat(updated.rating),
      attributes: typeof updated.attributes === 'string' ? JSON.parse(updated.attributes) : (updated.attributes || {})
    };

    emitProductUpdated(formatted);

    return res.json({ ok: true, product: formatted, message: 'Product updated successfully.' });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ ok: false, error: 'Failed to update product: ' + err.message });
  }
}

export async function adjustStock(req, res) {
  try {
    const { id } = req.params;
    const { delta, exact } = req.body;

    let result;
    if (exact !== undefined) {
      result = await query(`
        UPDATE products
        SET stock_qty = GREATEST(0, $1), updated_at = CURRENT_TIMESTAMP
        WHERE id::text = $2 OR sku = $2
        RETURNING id, sku, stock_qty, title;
      `, [parseInt(exact), String(id)]);
    } else if (delta !== undefined) {
      result = await query(`
        UPDATE products
        SET stock_qty = GREATEST(0, stock_qty + $1), updated_at = CURRENT_TIMESTAMP
        WHERE id::text = $2 OR sku = $2
        RETURNING id, sku, stock_qty, title;
      `, [parseInt(delta), String(id)]);
    } else {
      return res.status(400).json({ ok: false, error: 'Either delta or exact stock amount is required.' });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Product not found.' });
    }

    const row = result.rows[0];

    // Realtime stock broadcast
    emitStockUpdated({
      id: row.id,
      sku: row.sku,
      stock_qty: row.stock_qty
    });

    return res.json({
      ok: true,
      message: 'Stock updated successfully.',
      product: row
    });
  } catch (err) {
    console.error('Error adjusting stock:', err);
    return res.status(500).json({ ok: false, error: 'Failed to adjust stock.' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const result = await query(`
      UPDATE products SET active = false, updated_at = CURRENT_TIMESTAMP WHERE (id::text = $1 OR sku = $1) RETURNING id, sku, title;
    `, [String(id)]);

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Product not found.' });
    }

    const row = result.rows[0];
    emitProductDeleted(row.id, row.sku);

    return res.json({ ok: true, message: `Product '${row.title}' removed from active catalog.`, product: row });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ ok: false, error: 'Failed to delete product.' });
  }
}

export default {
  getAllProducts,
  getProductBySku,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct
};
