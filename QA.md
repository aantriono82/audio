# Pemeriksaan Atiga Amp 0.1.9

Pemeriksaan baseline source, build `.deb`, dan native smoke test v0.1.9 dijalankan pada 14 September 2026 di workspace Linux x64. Workflow final v0.1.9 menjalankan smoke test AppImage dengan WAV; percobaan fixture MP3 sebelumnya berhenti karena runner tidak memiliki `gst-launch-1.0`, sehingga hasil tersebut tidak membuktikan playback MP3.

## Hasil otomatis

| Pemeriksaan | Hasil |
| --- | --- |
| ESLint dan unit/regresi JavaScript (`npm run lint`, `npm test`) | Lulus, 47 tes |
| TypeScript dan Vite production (`npm run build`) | Lulus |
| Konsistensi versi (`npm run version:check`) | Lulus; `0.1.9` |
| Rust format dan Clippy dengan warning sebagai error (`npm run desktop:check`) | Lulus |
| Unit test penyimpanan native (`npm run desktop:test`) | Lulus, 6 tes |
| Native smoke test Linux v0.1.9 | Lulus untuk AppImage + WAV; cakupan MP3 dan paket `.deb` belum dijalankan pada artefak final |

Regresi yang diuji oleh UI contract mencakup mode playback Linux tanpa Web Audio, reset sumber MP3 tanpa seek nol yang terlambat, pilihan resume yang mati secara bawaan tanpa autoplay, pemutaran native melalui Blob URL yang diambil dari asset protocol, mode Rack/Koleksi, onboarding demo, lifecycle playlist, ringkasan impor, tidak adanya intersepsi penutupan WebView, dan otorisasi path pada native drag-and-drop. UI contract bersifat pemeriksaan source; ia tidak memverifikasi sampel audio yang terdengar.

Build paket `.deb` Linux lulus. Smoke test native v0.1.9 hanya meliputi AppImage + WAV. Uji penerimaan visual manual pada 1280×800, MP3 pada kedua paket, dan instalasi akun bersih belum dijalankan.

## Artefak Linux lokal

| Paket | Ukuran | SHA-256 |
| --- | ---: | --- |
| `Atiga Amp_0.1.9_amd64.deb` | 3.562.086 byte | `d6dca76e7c1a4e58d332a5951d3f274df4251d1d664e4ed99d1840da0c356352` |
| `Atiga Amp_0.1.6_amd64.deb` | 3.555.018 byte | `5ec2252b7b565c16ad17384868b5a706962935836782c5ca2817bf72fda094f0` |

Paket `.deb` membutuhkan `gstreamer1.0-plugins-base`, `gstreamer1.0-plugins-good`, `gstreamer1.0-plugins-bad`, `gstreamer1.0-plugins-ugly`, dan `gstreamer1.0-libav`, selain WebKitGTK dan GTK. `gstreamer1.0-tools` dibutuhkan oleh generator fixture smoke, bukan oleh pengguna akhir. Konfigurasi AppImage memakai `bundleMediaFramework`; artefak dan target distro tetap perlu smoke test.

## Artefak v0.1.6 yang dipublikasikan

Release [Atiga Amp v0.1.6](https://github.com/aantriono82/audio/releases/tag/v0.1.6) berhasil dibuat setelah smoke test CI lulus.

| Paket | SHA-256 |
| --- | --- |
| `Atiga Amp_0.1.6_amd64.AppImage` | `b3bcf74427b60193f3900a699d25eeadf6a22270e5f599355710a88688c2c20c` |
| `Atiga Amp_0.1.6_amd64.deb` | `43ad03019a3deaa87007b1d767f8557ad03dc674d1292d1d01decc434cbee0e2` |

## Artefak v0.1.7 yang dipublikasikan

Release [Atiga Amp v0.1.7](https://github.com/aantriono82/audio/releases/tag/v0.1.7) berhasil dibuat setelah smoke test CI memverifikasi pemutaran demo dan lagu impor dimulai dekat detik 0.

| Paket | SHA-256 |
| --- | --- |
| `Atiga Amp_0.1.7_amd64.AppImage` | `acc470418560f47a4c064ee7e51088b83dd6720c997b285f9b78e9372f33ac3c` |
| `Atiga Amp_0.1.7_amd64.deb` | `c7a42743f8bd0be7e8e327d67898111ca7733cb9b4909f6f1f8aa70f5b1d6e51` |

## Batas validasi

Drag fisik dari file manager, pemasangan pada akun bersih, seluruh variasi codec, dan kualitas audio subjektif tetap perlu diuji pada distro Linux sasaran. Setelah perbaikan player, jalankan smoke test MP3 untuk kedua artefak dengan:

```sh
npm run desktop:smoke:deb
npm run desktop:smoke:appimage
```

Langkah penerimaan lengkap ada di [docs/DESKTOP.md](docs/DESKTOP.md). Workflow `.github/workflows/desktop.yml` sekarang memasang `gstreamer1.0-tools`, menjalankan smoke MP3 pada `.deb` dan AppImage, serta mengulang validasi runtime pada Ubuntu 24.04. Artefak release tetap diambil dari Ubuntu 22.04.
