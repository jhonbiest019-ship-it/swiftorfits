/**
 * SwiftOrbits Real-Time Auto-Sync Engine
 * Automatically commits & pushes any workspace changes to GitHub
 * triggering automatic continuous deployment on Vercel.
 */
import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

const IGNORED_PATTERNS = [
  /^\.git[\\\/]?/,
  /node_modules/,
  /^dist[\\\/]?/,
  /^backup[\\\/]?/,
  /^\.gemini/,
  /^\.system_generated/,
  /\.log$/,
  /\.zip$/,
  /\.tmp$/,
  /live-sync\.js/
];

let debounceTimer = null;
let isSyncing = false;
let pendingSync = false;

function shouldIgnore(filename) {
  if (!filename) return true;
  const normalized = filename.replace(/\\/g, '/');
  return IGNORED_PATTERNS.some(pattern => pattern.test(normalized));
}

async function performSync() {
  if (isSyncing) {
    pendingSync = true;
    return;
  }

  isSyncing = true;
  try {
    const { stdout: status } = await execAsync('git status --porcelain');
    if (!status.trim()) {
      isSyncing = false;
      return;
    }

    console.log('\n[SwiftOrbits Live Sync] Detected local changes. Syncing with GitHub & Vercel...');
    
    await execAsync('git add -A');
    
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const dateStr = new Date().toISOString().split('T')[0];
    const commitMsg = `Live sync update [${dateStr} ${timeStr}]`;
    
    await execAsync(`git commit -m "${commitMsg}"`);
    console.log(`[SwiftOrbits Live Sync] Committed: "${commitMsg}"`);
    
    console.log('[SwiftOrbits Live Sync] Pushing to GitHub (origin/main)...');
    await execAsync('git push origin main');
    
    console.log('⚡ [SwiftOrbits Live Sync] SUCCESS! GitHub updated & Vercel live deployment triggered!\n');
  } catch (err) {
    // If nothing to commit or transient error, log cleanly
    if (!err.message?.includes('nothing to commit')) {
      console.error('[SwiftOrbits Live Sync] Sync notification:', err.message || err);
    }
  } finally {
    isSyncing = false;
    if (pendingSync) {
      pendingSync = false;
      setTimeout(performSync, 1000);
    }
  }
}

function scheduleSync() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    performSync();
  }, 2500);
}

console.log('===============================================================');
console.log(' 🚀 SwiftOrbits Real-Time Auto-Sync Engine is Active!');
console.log(' Watching for file changes... Any save will auto-push to Vercel.');
console.log('===============================================================');

try {
  fs.watch('.', { recursive: true }, (eventType, filename) => {
    if (shouldIgnore(filename)) return;
    console.log(`[File Modified] ${filename} (${eventType}) -> queuing auto-sync...`);
    scheduleSync();
  });
} catch (e) {
  console.error('[Live Sync Watcher Error]:', e);
}
