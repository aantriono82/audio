import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from '../server.mjs';

function close(server) {
  return new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
    server.closeAllConnections();
  });
}

for (const port of [-1, 65536, 1.5, NaN, Infinity]) {
  test(`invalid port ${port} is rejected before listening`, async () => {
    await assert.rejects(startServer({ port }), /PORT harus berupa bilangan bulat/);
  });
}

test('server binds loopback and serves the app and its extracted module', async t => {
  const server = await startServer({ port: 0 });
  t.after(() => close(server));
  assert.equal(server.address().address, '127.0.0.1');
  const base = `http://127.0.0.1:${server.address().port}`;
  const response = await fetch(base);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Atiga Amp/);
  const module = await fetch(`${base}/src/library.js`);
  assert.equal(module.status, 200);
  assert.match(module.headers.get('content-type'), /text\/javascript/);
  assert.match(await module.text(), /export function baseTracks/);
});

test('busy port falls forward without stopping the existing server', async t => {
  const existing = await startServer({ port: 0 });
  t.after(() => close(existing));
  const port = existing.address().port;
  const fallback = await startServer({ port });
  t.after(() => close(fallback));
  assert.ok(fallback.address().port > port);
  assert.ok(fallback.address().port <= port + 10);
  assert.equal((await fetch(`http://127.0.0.1:${port}`)).status, 200);
  assert.equal((await fetch(`http://127.0.0.1:${fallback.address().port}`)).status, 200);
});

test('busy explicit port fails with an actionable message', async t => {
  const existing = await startServer({ port: 0 });
  t.after(() => close(existing));
  await assert.rejects(startServer({ port: existing.address().port, retries: 0 }), /sedang digunakan.*PORT/);
});
