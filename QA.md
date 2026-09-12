# Pemeriksaan Atiga Amp 0.1.0 — Linux

Pemeriksaan desktop terbaru dilakukan pada Linux Mint 22.3 x64, 12 September 2026. Pemeriksaan browser sebelumnya dilakukan dengan Chrome di Linux pada 9 September 2026.

## Hasil otomatis

| Pemeriksaan | Hasil |
| --- | --- |
| ESLint dan unit/regresi JavaScript (`npm run check`) | Lulus, 41 tes |
| TypeScript dan Vite production (`npm run build`) | Lulus |
| Konsistensi versi dan kecocokan tag (`npm run version:check`) | Lulus; `0.1.0`, tag mismatch ditolak |
| Rust format dan Clippy dengan warning sebagai error (`npm run desktop:check`) | Lulus |
| Unit test penyimpanan native (`npm run desktop:test`) | Lulus, 6 tes |
| Penggabungan aset release dan checksum | Lulus; 2 installer lokal diproses |
| Build Linux `.deb` setelah perubahan CI | Lulus |
| Build Linux `.AppImage` dengan framework media | Lulus |
| Tauri memuat konfigurasi bundling Linux (`--no-bundle`) | Lulus |
| Smoke test binary dari `.deb` | Lulus |
| Smoke test `.AppImage` secara langsung | Lulus |

Smoke test menjalankan Tauri dan WebKitGTK sebenarnya pada display virtual dengan direktori data pengguna terisolasi. Skenario yang lulus:

- pembukaan pertama tanpa resource internet dan tombol Play memilih demo;
- penolakan IPC untuk membaca `/etc/passwd` di luar scope;
- pemindaian folder bersarang bernama Unicode dan pengabaian file non-audio;
- impor native, deteksi duplikat saat pemindaian ulang, dan penyimpanan album dari nama folder;
- pemutaran salinan koleksi setelah folder sumber dipindahkan;
- penulisan favorit ke `settings.json`;
- restart memulihkan koleksi dan favorit tanpa autoplay.

Unit test Rust mencakup salinan audio yang tetap tersedia setelah sumber dihapus, penolakan traversal/overwrite, metadata koleksi rusak, penulisan settings atomik, fingerprint pemindaian yang stabil, dan symlink yang tidak diikuti. Suite JavaScript mencakup antrean penulisan settings, library, UI contract, format audio demo, serta regresi server.

## Artefak Linux lokal

| Paket | Ukuran | SHA-256 |
| --- | ---: | --- |
| `Atiga Amp_0.1.0_amd64.AppImage` | 166.865.400 byte | `6d8021bacc8590c51ee83bb65c928a1a88c3d7f5964045e0d8b117e6a041a3f7` |
| `Atiga Amp_0.1.0_amd64.deb` | 3.551.964 byte | `190a4ab01b792ea88ebeecc1cc3224211c31cbf6d1c77e903d970a10fb02722c` |

Metadata `.deb` telah diperiksa: arsitektur `amd64`, versi `0.1.0`, dan dependensi WebKitGTK, GTK, serta GStreamer tercantum tanpa duplikasi. `SHA256SUMS.txt` dibuat bersama artefak.

## Hasil browser

| Pemeriksaan | Hasil |
| --- | --- |
| Audio demo: play, pause, seek, next, dan waktu berjalan | Lulus |
| Favorit, filter favorit, dan pencarian judul | Lulus |
| Playlist dan menu penambahan lagu | Lulus |
| Preset EQ Warm dan sepuluh slider | Lulus |
| Antrean dan konsumsi melalui Next | Lulus |
| Mode compact dan equalizer | Lulus |
| Impor WAV lokal dan pemulihan setelah reload tanpa autoplay | Lulus |
| Layout desktop dan emulasi mobile 390 px tanpa overflow horizontal | Lulus |
| Resource font lokal dan tidak ada request runtime ke internet | Lulus |

## Batas validasi rilis

Workflow `.github/workflows/desktop.yml` menyiapkan build Ubuntu 22.04 untuk `.deb` dan `.AppImage`. Pada tag `v*`, workflow menggabungkan paket, membuat checksum, dan mempublikasikan GitHub Release. Runner Linux juga menjalankan smoke test AppImage. Build AppImage lokal pada pemeriksaan ini berhenti lama di bundler setelah `.AppDir` dibuat; AppImage yang dicantumkan di atas adalah artefak sebelumnya yang sudah lulus smoke test dan checksum.

Dialog file OS, drag fisik dari file manager, install/uninstall sistem, upgrade versi lama, seluruh variasi codec, tombol media fisik, dan kualitas audio subjektif tetap memerlukan uji penerimaan manual pada distro Linux sasaran. Daftar langkahnya ada di [docs/DESKTOP.md](docs/DESKTOP.md).
