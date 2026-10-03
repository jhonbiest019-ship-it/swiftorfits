import express from 'express';
import { upload } from '../middleware/upload.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No image file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(201).json({
      ok: true,
      message: 'Image uploaded successfully.',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('Image upload error:', err);
    return res.status(500).json({ ok: false, error: 'Image upload failed: ' + err.message });
  }
});

router.post('/multiple', requireAdmin, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ ok: false, error: 'No image files uploaded.' });
    }

    const urls = req.files.map(f => `/uploads/${f.filename}`);
    return res.status(201).json({
      ok: true,
      message: 'Images uploaded successfully.',
      urls
    });
  } catch (err) {
    console.error('Multiple image upload error:', err);
    return res.status(500).json({ ok: false, error: 'Images upload failed: ' + err.message });
  }
});

export default router;
