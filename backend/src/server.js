import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { testConnection, close, query } from './db.js';
import { initSocket } from './sockets/socketManager.js';
import { runMigrations } from '../scripts/migrate.js';
import { runSeed } from '../scripts/seed.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

const httpServer = http.createServer(app);

// Initialize Socket.IO realtime engine
const io = initSocket(httpServer, FRONTEND_ORIGIN);

async function startServer() {
  try {
    console.log('========================================================');
    console.log('   SwiftOrbits USA Marketplace — Production API Engine  ');
    console.log('========================================================');

    // 1. Ensure database connection and migrations
    const dbTest = await testConnection();
    if (!dbTest.connected) {
      console.warn(' Database connection test returned false:', dbTest.error);
    } else {
      console.log(` PostgreSQL Engine Active: [${dbTest.engine}]`);
    }

    // Run schema migrations to ensure all tables exist
    await runMigrations();

    // Ensure catalog is seeded and mock orders purged
    const prodCountRes = await query('SELECT count(*) as count FROM products');
    if (parseInt(prodCountRes.rows[0]?.count || 0) === 0) {
      console.log(' Product catalog is empty. Running initial PostgreSQL seed...');
      await runSeed();
    } else {
      // Purge any old mock orders
      await query(`DELETE FROM orders WHERE order_number IN ('SO-US-89104A', 'SO-US-44719B');`);
    }

    // 2. Start HTTP Server on 0.0.0.0 (Supports both IPv4 127.0.0.1 and IPv6 localhost)
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(` SwiftOrbits API Server running on: http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
      console.log(` Realtime Socket.IO active at: ws://localhost:${PORT}`);
      console.log(` Health Check endpoint: http://localhost:${PORT}/api/health`);
      console.log('========================================================');
    });

  } catch (err) {
    console.error('Fatal Server Boot Error:', err);
    process.exit(1);
  }
}

// Graceful Shutdown
async function handleShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down SwiftOrbits API gracefully...`);
  httpServer.close(async () => {
    console.log('HTTP and Socket server closed.');
    await close();
    console.log('PostgreSQL database connections released.');
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startServer();
