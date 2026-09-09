import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(root) || pathname.split('/').some(p => p.startsWith('.'))) {
        res.writeHead(403); res.end('Forbidden'); return;
      }
      const data = await readFile(file);
      res.writeHead(200, { 'Content-Type': `${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8`, 'Cache-Control': 'no-cache' });
      res.end(data);
    } catch { res.writeHead(404); res.end('Not found'); }
  });
}


function listen(server, port) {
  return new Promise((resolve, reject) => {
    const onError = error => { server.off('listening', onListening); reject(error); };
    const onListening = () => { server.off('error', onError); resolve(); };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port, '127.0.0.1');
  });
}

export async function startServer({ port = 5174, retries = 10 } = {}) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('PORT harus berupa bilangan bulat antara 0 dan 65535.');
  }
  const server = createServer();
  for (let attempt = 0; ; attempt++) {
    try {
      await listen(server, port);
      return server;
    } catch (error) {
      if (error.code !== 'EADDRINUSE') throw error;
      if (attempt >= retries || port === 65535) {
        throw new Error(`Port ${port} sedang digunakan. Tutup server lama atau jalankan dengan PORT lain, misalnya PORT=5185 npm run dev.`, { cause: error });
      }
      port++;
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const explicitPort = process.env.PORT !== undefined;
  const port = explicitPort ? Number(process.env.PORT.trim() || NaN) : 5174;
  try {
    const server = await startServer({ port, retries: explicitPort ? 0 : 10 });
    const actualPort = server.address().port;
    if (actualPort !== port && port !== 0) console.log(`Port ${port} sedang digunakan; memakai port ${actualPort}.`);
    console.log(`Atiga Amp → http://localhost:${actualPort}`);
  } catch (error) {
    console.error(`Server gagal dimulai: ${error.message}`);
    process.exitCode = 1;
  }
}
