# Pemeriksaan Atiga Amp 0.1.6 — perbaikan Linux

Pemeriksaan otomatis terakhir dijalankan pada 13 September 2026 di workspace Linux x64. Pengujian native yang membutuhkan display virtual tidak tersedia pada lingkungan ini karena `Xvfb` dan `WebKitWebDriver` tidak terpasang.

## Hasil otomatis

| Pemeriksaan | Hasil |
| --- | --- |
| ESLint dan unit/regresi JavaScript (`npm run lint`, `npm test`) | Lulus, 44 tes |
| TypeScript dan Vite production (`npm run build`) | Lulus |
| Konsistensi versi (`npm run version:check`) | Lulus; `0.1.6` |
| Rust format dan Clippy dengan warning sebagai error (`npm run desktop:check`) | Lulus |
| Unit test penyimpanan native (`npm run desktop:test`) | Lulus, 6 tes |
| Build Linux `.deb` | Lulus |
| Metadata `.deb` | Lulus; WebKitGTK, GTK, dan lima plugin GStreamer tercantum |
| Smoke test binary Tauri | Belum dijalankan; membutuhkan `Xvfb` dan `WebKitWebDriver` |

Regresi yang diuji oleh UI contract mencakup mode playback Linux tanpa Web Audio, posisi awal selalu nol setelah membuka aplikasi, pemutaran native melalui Blob URL yang diambil dari asset protocol, tidak adanya intersepsi penutupan WebView, dan otorisasi path pada native drag-and-drop.

## Artefak Linux lokal

| Paket | Ukuran | SHA-256 |
| --- | ---: | --- |
| `Atiga Amp_0.1.6_amd64.deb` | 3.555.018 byte | `5ec2252b7b565c16ad17384868b5a706962935836782c5ca2817bf72fda094f0` |

Paket `.deb` membutuhkan `gstreamer1.0-plugins-base`, `gstreamer1.0-plugins-good`, `gstreamer1.0-plugins-bad`, `gstreamer1.0-plugins-ugly`, dan `gstreamer1.0-libav`, selain WebKitGTK dan GTK. Konfigurasi AppImage memakai `bundleMediaFramework`; artefak dan target distro tetap perlu smoke test.

## Batas validasi

Drag fisik dari file manager, pemasangan pada akun bersih, seluruh variasi codec, dan kualitas audio subjektif tetap perlu diuji pada distro Linux sasaran. Jalankan smoke test setelah memasang dependensi CI dengan:

```sh
node scripts/native-smoke.mjs /path/to/atiga-amp
```

Langkah penerimaan lengkap ada di [docs/DESKTOP.md](docs/DESKTOP.md). Workflow `.github/workflows/desktop.yml` sekarang memasang plugin GStreamer `ugly` sebelum membuat paket Linux.
