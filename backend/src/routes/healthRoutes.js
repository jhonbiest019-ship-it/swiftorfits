import express from 'express';
import { testConnection } from '../db.js';
import { getIO } from '../sockets/socketManager.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  const socketStatus = !!getIO();

  return res.json({
    ok: dbStatus.connected,
    service: 'swiftorbits-api',
    database: dbStatus.connected,
    realtime: socketStatus,
    engine: dbStatus.engine,
    timestamp: new Date().toISOString()
  });
});

export default router;
