import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const directory = '.impeccable/phase9';
// The installed @astrojs/node adapter uses config.cacheDir + 'sessions'.
// Astro's default cacheDir in this build is node_modules/.astro (not .astro).
const storageDirectory = 'node_modules/.astro/sessions';

function snapshot(directory: string): { path: string; bytes: number; modified: number }[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return snapshot(path);
    const stat = statSync(path);
    // No stored values or file contents are read.
    return [{ path, bytes: stat.size, modified: stat.mtimeMs }];
  }).sort((a, b) => a.path.localeCompare(b.path));
}

export default function beginProductionEvidence(): () => void {
  mkdirSync(directory, { recursive: true });
  const before = snapshot(storageDirectory);
  assert.deepEqual(before, [], 'No pre-existing server session data expected in this local demo');
  writeFileSync(join(directory, 'storage-before.json'), JSON.stringify(before));
  return verifyProductionEvidence;
}

function verifyProductionEvidence(): void {
  const before = JSON.parse(readFileSync(join(directory, 'storage-before.json'), 'utf8'));
  const after = snapshot(storageDirectory);
  const stdout = readFileSync(join(directory, 'server.stdout.log'), 'utf8');
  const stderr = readFileSync(join(directory, 'server.stderr.log'), 'utf8');
  const dataInLogs = /Марина|student@example|1988|schemaVersion|slotStartIso|createdAtIso|moscow:|UNTRUSTED_DEMO/.test(stdout + stderr);
  writeFileSync(join(directory, 'production-evidence.json'), JSON.stringify({
    storageDirectory, before, after, dataInLogs,
    logBytes: { stdout: Buffer.byteLength(stdout), stderr: Buffer.byteLength(stderr) },
    limitations: ['Local Node runtime only; browser session restoration and hosting infrastructure are not tested.'],
  }, null, 2));
  assert.deepEqual(after, before, 'Production requests must not create or change server session files');
  assert.equal(dataInLogs, false, 'Demo/calculator data must not appear in production server logs');
}
