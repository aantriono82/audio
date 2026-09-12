# Pemeriksaan Atiga Amp 0.1.0

Pemeriksaan desktop terbaru dilakukan pada Linux Mint 22.3 x64, 12 September 2026. Pemeriksaan browser sebelumnya dilakukan dengan Chrome di Linux pada 9 September 2026.

## Hasil otomatis

| Pemeriksaan | Hasil |
| --- | --- |
| ESLint dan unit/regresi JavaScript (`npm run check`) | Lulus, 41 tes |
| TypeScript dan Vite production (`npm run build`) | Lulus |
| Rust format dan Clippy dengan warning sebagai error (`npm run desktop:check`) | Lulus |
| Unit test penyimpanan native (`npm run desktop:test`) | Lulus, 6 tes |
| Build Linux `.deb` | Lulus |
| Build Linux `.AppImage` dengan framework media | Lulus |
| Tauri memuat konfigurasi khusus Windows (`--no-bundle`) | Lulus |
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
| `Atiga Amp_0.1.0_amd64.deb` | 3.551.976 byte | `b552ba8c6be4ac4e45377c7bd31f8324e68c3809d6b0dd29a6739b5852724ff2` |

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

Workflow `.github/workflows/desktop.yml` menyiapkan build Windows 2022 untuk NSIS `.exe` dan `.msi`, serta build Ubuntu 22.04 untuk `.deb` dan `.AppImage`. Runner Linux juga menjalankan smoke test AppImage. Binary installer Windows belum dibangun atau dipasang pada mesin Windows dalam pemeriksaan lokal ini; jalankan workflow dan uji instalasi Windows 10/11 sebelum publikasi.

Dialog file OS, drag fisik dari file manager, install/uninstall sistem, upgrade versi lama, seluruh variasi codec, tombol media fisik, dan kualitas audio subjektif tetap memerlukan uji penerimaan manual pada tiap OS sasaran. Daftar langkahnya ada di [docs/DESKTOP.md](docs/DESKTOP.md).
