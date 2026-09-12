import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const packageLock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8'));
const tauriConfig = JSON.parse(await readFile(path.join(root, 'src-tauri/tauri.conf.json'), 'utf8'));
const cargoToml = await readFile(path.join(root, 'src-tauri/Cargo.toml'), 'utf8');

const versions = new Map([
  ['package.json', packageJson.version],
  ['package-lock.json', packageLock.packages?.['']?.version],
  ['src-tauri/tauri.conf.json', tauriConfig.version],
  ['src-tauri/Cargo.toml', cargoToml.match(/^version\s*=\s*"([^"]+)"/m)?.[1]],
]);

const missing = [...versions].filter(([, version]) => !version);
if (missing.length) {
  throw new Error(`Versi tidak ditemukan: ${missing.map(([file]) => file).join(', ')}`);
}

const uniqueVersions = new Set(versions.values());
if (uniqueVersions.size !== 1) {
  throw new Error(`Versi tidak konsisten: ${[...versions].map(([file, version]) => `${file}=${version}`).join(', ')}`);
}

const version = packageJson.version;
const refName = process.env.GITHUB_REF_NAME || '';
if (refName.startsWith('v') && refName.slice(1) !== version) {
  throw new Error(`Tag ${refName} tidak cocok dengan versi aplikasi ${version}`);
}

console.log(`Versi konsisten: ${version}`);
