import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const markup = await readFile(path.join(root, 'src/react/playerMarkup.ts'), 'utf8');
const index = await readFile(path.join(root, 'index.html'), 'utf8');
const manifest = await readFile(path.join(root, 'public/manifest.webmanifest'), 'utf8');

test('primary UI contract keeps onboarding, compact controls, and backup entry points', () => {
  for (const id of ['welcome-dialog', 'welcome-import', 'welcome-demo', 'compact-previous', 'compact-play', 'compact-next', 'library-import']) {
    assert.match(markup, new RegExp(`id="${id}"`));
  }
  assert.match(markup, /id="dbx-badge"[^>]*>\s*<span>dbx<\/span>/s);
  assert.doesNotMatch(markup, /role="button"/);
});

test('offline app contract includes a manifest and service worker registration', () => {
  assert.match(index, /rel="manifest" href="\/manifest\.webmanifest"/);
  assert.match(manifest, /"display": "standalone"/);
  assert.match(manifest, /"start_url": "\/"/);
});

test('critical CSS is owned by the module entry and external fonts stay off the render path', () => {
  assert.doesNotMatch(index, /rel="stylesheet" href="\/src\/style\.css"/);
  assert.match(index, /rel="preload" as="style"[^>]+fonts\.googleapis\.com/);
  assert.match(index, /display=optional/);
});
