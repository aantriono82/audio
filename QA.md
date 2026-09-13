# Pemeriksaan Atiga Amp 0.1.6 — perbaikan Linux

Pemeriksaan otomatis terakhir dijalankan pada 13 September 2026 di GitHub Actions pada Ubuntu 22.04 x64. Smoke test native lokal tetap tidak tersedia pada workspace ini karena `Xvfb` dan `WebKitWebDriver` tidak terpasang.

## Hasil otomatis

| Pemeriksaan | Hasil |
| --- | --- |
| ESLint dan unit/regresi JavaScript (`npm run lint`, `npm test`) | Lulus, 45 tes |
| TypeScript dan Vite production (`npm run build`) | Lulus |
| Konsistensi versi (`npm run version:check`) | Lulus; `0.1.6` |
| Rust format dan Clippy dengan warning sebagai error (`npm run desktop:check`) | Lulus |
| Unit test penyimpanan native (`npm run desktop:test`) | Lulus, 6 tes |
| Build Linux `.deb` | Lulus |
| Metadata `.deb` | Lulus; WebKitGTK, GTK, dan lima plugin GStreamer tercantum |
| Smoke test AppImage Tauri | Lulus di GitHub Actions; playback, impor native, restart, dan posisi awal diuji |

Regresi yang diuji oleh UI contract mencakup mode playback Linux tanpa Web Audio, posisi awal selalu nol setelah membuka aplikasi, pemutaran native melalui Blob URL yang diambil dari asset protocol, tidak adanya intersepsi penutupan WebView, dan otorisasi path pada native drag-and-drop.

## Artefak Linux lokal

| Paket | Ukuran | SHA-256 |
| --- | ---: | --- |
| `Atiga Amp_0.1.6_amd64.deb` | 3.555.018 byte | `5ec2252b7b565c16ad17384868b5a706962935836782c5ca2817bf72fda094f0` |

Paket `.deb` membutuhkan `gstreamer1.0-plugins-base`, `gstreamer1.0-plugins-good`, `gstreamer1.0-plugins-bad`, `gstreamer1.0-plugins-ugly`, dan `gstreamer1.0-libav`, selain WebKitGTK dan GTK. Konfigurasi AppImage memakai `bundleMediaFramework`; artefak dan target distro tetap perlu smoke test.

## Artefak v0.1.6 yang dipublikasikan

Release [Atiga Amp v0.1.6](https://github.com/aantriono82/audio/releases/tag/v0.1.6) berhasil dibuat setelah smoke test CI lulus.

| Paket | SHA-256 |
| --- | --- |
| `Atiga Amp_0.1.6_amd64.AppImage` | `b3bcf74427b60193f3900a699d25eeadf6a22270e5f599355710a88688c2c20c` |
| `Atiga Amp_0.1.6_amd64.deb` | `43ad03019a3deaa87007b1d767f8557ad03dc674d1292d1d01decc434cbee0e2` |

## Batas validasi

Drag fisik dari file manager, pemasangan pada akun bersih, seluruh variasi codec, dan kualitas audio subjektif tetap perlu diuji pada distro Linux sasaran. Jalankan smoke test setelah memasang dependensi CI dengan:

```sh
node scripts/native-smoke.mjs /path/to/atiga-amp
```

Langkah penerimaan lengkap ada di [docs/DESKTOP.md](docs/DESKTOP.md). Workflow `.github/workflows/desktop.yml` sekarang memasang plugin GStreamer `ugly` sebelum membuat paket Linux.
