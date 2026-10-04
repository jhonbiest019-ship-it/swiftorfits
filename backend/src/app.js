import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { query } from './db.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { renderAdminDashboardHtml } from './views/adminDashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & Logging
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false // Disable restrictive CSP so external images (Unsplash) & inline dashboard scripts work seamlessly
}));

const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow local development ports and matching origin
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    return callback(null, allowedOrigin);
  },
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
const uploadsDir = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

// Serve frontend public directory statically (catalog product images: /elec_phone.png, /stanley_tumbler.jpg, etc.)
const frontendPublicDir = path.resolve(__dirname, '../../public');
if (fs.existsSync(frontendPublicDir)) {
  app.use(express.static(frontendPublicDir));
}

// Serve Visual Merchant ERP Operations Dashboard with preloaded PostgreSQL products & orders
async function handleDashboardView(req, res) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const { rows: products } = await query('SELECT * FROM products WHERE active = true ORDER BY id ASC');
    const { rows: orders } = await query(`
      SELECT o.*,
        (SELECT oi.sku FROM order_items oi WHERE oi.order_id = o.id LIMIT 1) as sku,
        (SELECT oi.product_title FROM order_items oi WHERE oi.order_id = o.id LIMIT 1) as product_title,
        (SELECT COALESCE(SUM(oi.quantity), 1) FROM order_items oi WHERE oi.order_id = o.id) as quantity
      FROM orders o
      ORDER BY o.id DESC
    `);

    res.send(renderAdminDashboardHtml({ products, orders }));
  } catch (err) {
    console.error('Error querying data for dashboard:', err);
    res.send(renderAdminDashboardHtml({ products: [], orders: [] }));
  }
}

app.get('/', handleDashboardView);
app.get('/admin', handleDashboardView);

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// 404 Not Found for API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    ok: false,
    error: `API route '${req.originalUrl}' not found.`
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    ok: false,
    error: err.message || 'An unexpected error occurred on the server.'
  });
});

export default app;
