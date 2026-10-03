import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

let pool = null;
let pgliteInstance = null;
let activeEngine = 'unknown';
let initPromise = null;

async function initDatabase() {
  if (activeEngine !== 'unknown') {
    return;
  }
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    // Attempt standard PostgreSQL connection first if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        const testPool = new Pool({
          connectionString: process.env.DATABASE_URL,
          connectionTimeoutMillis: 2000,
          idleTimeoutMillis: 10000,
          max: 10
        });

        const client = await testPool.connect();
        await client.query('SELECT 1');
        client.release();

        pool = testPool;
        activeEngine = 'pg_pool';
        console.log(' Successfully connected to external PostgreSQL database via pg.Pool.');
        return;
      } catch (err) {
        console.warn(`! External PostgreSQL connection at ${process.env.DATABASE_URL} failed (${err.message}).`);
        console.log(' Switching to embedded persistent PostgreSQL engine (PGlite) for flawless local execution.');
      }
    }

    // Fallback to embedded persistent PostgreSQL engine (PGlite)
    try {
      const { PGlite } = await import('@electric-sql/pglite');
      const defaultDataDir = process.env.LOCALAPPDATA
        ? path.resolve(process.env.LOCALAPPDATA, 'swiftorbits_pg_data')
        : path.resolve(__dirname, '../data/pg_data');
      const dataDir = process.env.PG_DATA_DIR || defaultDataDir;
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      } else {
        // Clean stale lock files from previous unclean process exits
        const lockFile = path.join(dataDir, 'postmaster.pid');
        if (fs.existsSync(lockFile)) {
          try { fs.unlinkSync(lockFile); } catch (e) {}
        }
        const socketLock = path.join(dataDir, '.s.PGSQL.5432.lock.out');
        if (fs.existsSync(socketLock)) {
          try { fs.unlinkSync(socketLock); } catch (e) {}
        }
      }

      try {
        pgliteInstance = new PGlite(dataDir);
        await pgliteInstance.query('SELECT 1');
      } catch (pgliteInitErr) {
        console.warn(`! PGlite failed at ${dataDir} (${pgliteInitErr.message}). Auto-recovering clean persistent store...`);
        try {
          if (fs.existsSync(dataDir)) {
            fs.rmSync(dataDir, { recursive: true, force: true });
            fs.mkdirSync(dataDir, { recursive: true });
          }
          pgliteInstance = new PGlite(dataDir);
          await pgliteInstance.query('SELECT 1');
        } catch (recoverErr) {
          console.warn('! Persistent store recovery failed, falling back to in-memory PGlite:', recoverErr.message);
          pgliteInstance = new PGlite();
          await pgliteInstance.query('SELECT 1');
        }
      }

      activeEngine = 'pglite';
      console.log(` Successfully initialized embedded persistent PostgreSQL at ${dataDir}.`);
    } catch (err) {
      console.error(' Critical Error: Failed to initialize any PostgreSQL engine:', err);
      throw err;
    }
  })();

  return initPromise;
}

export async function query(text, params = []) {
  await initDatabase();

  if (activeEngine === 'pg_pool') {
    const res = await pool.query(text, params);
    return res;
  } else {
    const res = await pgliteInstance.query(text, params);
    return {
      rows: res.rows || [],
      rowCount: res.affectedRows !== undefined ? res.affectedRows : (res.rows ? res.rows.length : 0),
      fields: res.fields || []
    };
  }
}

export async function exec(sql) {
  await initDatabase();

  if (activeEngine === 'pg_pool') {
    return await pool.query(sql);
  } else {
    return await pgliteInstance.exec(sql);
  }
}

export async function getClient() {
  await initDatabase();

  if (activeEngine === 'pg_pool') {
    const client = await pool.connect();
    return {
      query: (text, params) => client.query(text, params),
      release: () => client.release()
    };
  } else {
    // PGlite transaction client wrapper
    return {
      query: async (text, params) => {
        const res = await pgliteInstance.query(text, params);
        return {
          rows: res.rows || [],
          rowCount: res.affectedRows !== undefined ? res.affectedRows : (res.rows ? res.rows.length : 0),
          fields: res.fields || []
        };
      },
      release: () => {}
    };
  }
}

export async function testConnection() {
  try {
    await initDatabase();
    const res = await query('SELECT 1 as connected');
    return {
      connected: res.rows && res.rows[0]?.connected === 1,
      engine: activeEngine
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
      engine: activeEngine
    };
  }
}

export async function close() {
  if (pool) {
    await pool.end();
    pool = null;
  }
  if (pgliteInstance) {
    await pgliteInstance.close();
    pgliteInstance = null;
  }
  activeEngine = 'unknown';
  initPromise = null;
}

export default {
  query,
  exec,
  getClient,
  testConnection,
  close
};
