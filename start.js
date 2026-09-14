import fs from 'node:fs';
import { execSync, spawn } from 'node:child_process';
import path from 'node:path';

const distServer = path.resolve(process.cwd(), 'dist', 'server.cjs');

// If the build hasn't been run yet (e.g. Render build command was omitted),
// automatically build before starting.
if (!fs.existsSync(distServer)) {
  console.log('[start.js] dist/server.cjs not found. Running build first...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (e) {
    console.warn('[start.js] npm run build failed, attempting bun run build...');
    execSync('bun run build', { stdio: 'inherit' });
  }
}

// Launch the compiled production server
const child = spawn('node', [distServer], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT', () => child.kill('SIGINT'));
