import express from 'express';
import { query } from '../db.js';
import { emitSettingsUpdated } from '../sockets/socketManager.js';

const router = express.Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const { rows } = await query('SELECT key, value FROM site_settings');
    const settings = {
      hero_quad_rotation_seconds: 10,
      hero_quad_rotation_enabled: true
    };

    rows.forEach(r => {
      if (r.key === 'hero_quad_rotation_seconds') {
        const val = parseInt(r.value, 10);
        if (!isNaN(val) && val >= 1) settings.hero_quad_rotation_seconds = val;
      } else if (r.key === 'hero_quad_rotation_enabled') {
        settings.hero_quad_rotation_enabled = r.value !== 'false';
      } else {
        settings[r.key] = r.value;
      }
    });

    res.json({ ok: true, settings });
  } catch (err) {
    console.error('Error fetching settings:', err);
    // Return graceful fallback
    res.json({
      ok: true,
      settings: {
        hero_quad_rotation_seconds: 10,
        hero_quad_rotation_enabled: true
      }
    });
  }
});

// POST /api/settings (or PATCH/PUT)
router.post('/', async (req, res) => {
  try {
    const { hero_quad_rotation_seconds, hero_quad_rotation_enabled } = req.body;
    const updated = {};

    if (hero_quad_rotation_seconds !== undefined) {
      const sec = Math.max(1, Math.min(300, parseInt(hero_quad_rotation_seconds, 10) || 10));
      await query(`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES ('hero_quad_rotation_seconds', $1, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP
      `, [sec.toString()]);
      updated.hero_quad_rotation_seconds = sec;
    }

    if (hero_quad_rotation_enabled !== undefined) {
      const enabled = hero_quad_rotation_enabled !== false && hero_quad_rotation_enabled !== 'false';
      await query(`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES ('hero_quad_rotation_enabled', $1, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP
      `, [enabled.toString()]);
      updated.hero_quad_rotation_enabled = enabled;
    }

    // Read full updated settings
    const { rows } = await query('SELECT key, value FROM site_settings');
    const fullSettings = {
      hero_quad_rotation_seconds: 10,
      hero_quad_rotation_enabled: true
    };
    rows.forEach(r => {
      if (r.key === 'hero_quad_rotation_seconds') {
        const val = parseInt(r.value, 10);
        if (!isNaN(val)) fullSettings.hero_quad_rotation_seconds = val;
      } else if (r.key === 'hero_quad_rotation_enabled') {
        fullSettings.hero_quad_rotation_enabled = r.value !== 'false';
      } else {
        fullSettings[r.key] = r.value;
      }
    });

    // Broadcast realtime update to all connected clients
    emitSettingsUpdated(fullSettings);

    res.json({
      ok: true,
      message: 'Settings updated successfully.',
      settings: fullSettings
    });
  } catch (err) {
    console.error('Error saving settings:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
