import jwt from 'jsonwebtoken';
import { query } from '../db.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        error: 'Unauthorized. Authentication token required.'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'swiftorbits_super_secure_jwt_secret_key_2026';

    const decoded = jwt.verify(token, secret);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid authentication token.'
      });
    }

    // Check customer users table first
    const userRes = await query(
      'SELECT id, email, name, role, email_verified FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userRes.rows.length > 0) {
      req.user = userRes.rows[0];
      return next();
    }

    // Check admin users table
    const adminRes = await query(
      'SELECT id, email, name, role FROM admin_users WHERE id = $1',
      [decoded.id]
    );

    if (adminRes.rows.length > 0) {
      req.user = adminRes.rows[0];
      req.admin = adminRes.rows[0];
      return next();
    }

    return res.status(401).json({
      ok: false,
      error: 'User not found or access revoked.'
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        error: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      ok: false,
      error: 'Authentication failed: ' + err.message
    });
  }
}

export async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        error: 'Unauthorized. Admin bearer token required.'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'swiftorbits_super_secure_jwt_secret_key_2026';

    const decoded = jwt.verify(token, secret);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid authentication token.'
      });
    }

    const result = await query(
      'SELECT id, email, name, role FROM admin_users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        ok: false,
        error: 'Admin user not found or access revoked.'
      });
    }

    req.admin = result.rows[0];
    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        error: 'Admin session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      ok: false,
      error: 'Authentication failed: ' + err.message
    });
  }
}

export default {
  requireAuth,
  requireAdmin
};
