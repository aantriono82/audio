import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import path from 'node:path';

const sourceRoot = path.resolve(process.argv[2] || 'release-input');
const outputRoot = path.resolve(process.argv[3] || 'release-assets');
const installerPattern = /\.(deb|AppImage)$/;

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

const entries = await readdir(sourceRoot, { recursive: true, withFileTypes: true });
const installers = entries
  .filter(entry => entry.isFile() && installerPattern.test(entry.name))
  .sort((left, right) => left.name.localeCompare(right.name));

if (!installers.length) throw new Error(`Tidak ada installer di ${sourceRoot}`);

const usedNames = new Set();
for (const entry of installers) {
  if (usedNames.has(entry.name)) throw new Error(`Nama installer duplikat: ${entry.name}`);
  usedNames.add(entry.name);
  const source = path.join(entry.parentPath, entry.name);
  await copyFile(source, path.join(outputRoot, entry.name));
}

const lines = [];
for (const name of [...usedNames].sort()) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path.join(outputRoot, name))) hash.update(chunk);
  lines.push(`${hash.digest('hex')}  ${name}`);
}
await writeFile(path.join(outputRoot, 'SHA256SUMS.txt'), `${lines.join('\n')}\n`);
console.log(`Artefak release: ${lines.length} installer + SHA256SUMS.txt`);
