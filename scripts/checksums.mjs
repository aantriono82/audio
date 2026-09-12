import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'src-tauri/target/release/bundle');
const entries = await readdir(root, { recursive: true, withFileTypes: true });
const files = entries.filter(entry => entry.isFile() && /\.(exe|msi|deb|AppImage|rpm)$/.test(entry.name));
if (!files.length) throw new Error(`Tidak ada installer di ${root}`);
const lines = [];
for (const entry of files) {
  const file = path.join(entry.parentPath, entry.name);
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  lines.push(`${hash.digest('hex')}  ${path.relative(root, file).split(path.sep).join('/')}`);
}
await writeFile(path.join(root, 'SHA256SUMS.txt'), lines.sort().join('\n') + '\n');
console.log(`SHA256SUMS.txt: ${lines.length} installer`);
