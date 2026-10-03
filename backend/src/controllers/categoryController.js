import { query } from '../db.js';

export async function getAllCategories(req, res) {
  try {
    const result = await query('SELECT * FROM categories ORDER BY name ASC');
    return res.json({
      ok: true,
      count: result.rows.length,
      categories: result.rows
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({ ok: false, error: 'Failed to retrieve categories.' });
  }
}

export async function createCategory(req, res) {
  try {
    const { name, slug, description } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ ok: false, error: 'Name and slug are required.' });
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const result = await query(`
      INSERT INTO categories (name, slug, description)
      VALUES ($1, $2, $3)
      ON CONFLICT (slug) DO UPDATE
      SET name = EXCLUDED.name, description = EXCLUDED.description, updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `, [name.trim(), cleanSlug, description || '']);

    return res.status(201).json({
      ok: true,
      category: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating category:', err);
    return res.status(500).json({ ok: false, error: 'Failed to create category.' });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await query(`
      UPDATE categories
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `, [name, description, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Category not found.' });
    }

    return res.json({ ok: true, category: result.rows[0] });
  } catch (err) {
    console.error('Error updating category:', err);
    return res.status(500).json({ ok: false, error: 'Failed to update category.' });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Category not found.' });
    }
    return res.json({ ok: true, message: 'Category deleted successfully.' });
  } catch (err) {
    console.error('Error deleting category:', err);
    return res.status(500).json({ ok: false, error: 'Failed to delete category.' });
  }
}

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
