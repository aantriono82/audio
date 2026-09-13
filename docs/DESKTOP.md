# Distribusi desktop Atiga Amp

Tujuan produk: unduh paket, instal, dan jalankan musik lokal tanpa Node.js, Rust, atau server pengembangan pada komputer pengguna.

## Paket dan platform

| Platform | Paket | Penggunaan |
| --- | --- | --- |
| Ubuntu/Debian/Linux Mint x64 | `.deb` | Instal melalui pengelola paket; dependensi runtime dipenuhi olehnya |
| Linux x64 | `.AppImage` | Paket portabel; beri izin executable lalu jalankan |

Runner Linux memakai Ubuntu 22.04 sebagai baseline build; paket yang dibangun lokal di Mint 22.3/Ubuntu 24.04 dapat membutuhkan glibc yang lebih baru. AppImage bukan jaminan kompatibilitas seluruh distro. RPM, ARM, dan paket Windows belum masuk target distribusi.

AppImage mengaktifkan `bundleMediaFramework` untuk audio sesuai [panduan multimedia Tauri](https://v2.tauri.app/distribute/appimage/). Instalasi `.deb` dapat membutuhkan internet ketika dependensi sistem belum tersedia. AppImage dapat memerlukan FUSE; alternatifnya gunakan `--appimage-extract-and-run` jika didukung paket tersebut.

## Pengembangan dan build

Pasang Node.js 22.13+, Rust stable, dan [prasyarat Tauri untuk OS build](https://v2.tauri.app/start/prerequisites/). Linux membutuhkan GTK/WebKitGTK development libraries, plugin GStreamer, dan `patchelf` untuk AppImage. Bangun paket pada Linux.

```sh
npm ci
npm run version:check
npm run check
npm run build
npm run desktop:check
npm run desktop:test
npm run desktop:build -- --ci
npm run desktop:checksums
```

Hasil berada di `src-tauri/target/release/bundle/`. Konfigurasi `tauri.linux.conf.json` otomatis digabung dengan konfigurasi utama pada Linux. Konfigurasi Windows menonaktifkan bundling Windows. Untuk membuat `.deb` saja saat diagnosis: `npm run desktop:build -- --bundles deb`.

Workflow `.github/workflows/desktop.yml` membangun dan mengunggah paket Linux pada pull request, tag `v*`, atau pemicu manual. Pada tag `v*`, workflow menggabungkan paket, membuat checksum gabungan, dan mempublikasikan GitHub Release.

Untuk rilis, perbarui versi di `package.json`, `package-lock.json`, `src-tauri/Cargo.toml`, dan `src-tauri/tauri.conf.json`, jalankan `npm run version:check`, lalu push tag yang sama, misalnya `v0.1.0`. Tag harus cocok dengan versi aplikasi. Rilis yang dibuat ulang akan memperbarui aset dengan nama yang sama.

## Data pengguna

| OS | Direktori bawaan |
| --- | --- |
| Linux | `${XDG_DATA_HOME:-$HOME/.local/share}/com.atiga.amp` |

- `settings.json`: playlist, favorit, antrean, EQ, tema, volume, posisi terakhir; penulisan berurutan dan penggantian file atomik.
- `library/<UUID>/`: salinan audio, `track.json`, dan cover jika tersedia. Penyalinan diselesaikan dalam direktori sementara sebelum lagu dimasukkan ke koleksi.
- `music-folder.json`: folder terakhir yang dipilih pengguna, untuk pemindaian ulang.

Pembacaan audio dibatasi ke file/folder pilihan pengguna dan salinan dalam data aplikasi. Pemindaian tidak mengikuti symlink agar tidak keluar dari folder atau berputar tanpa henti. Impor membaca satu file per giliran; pembatalan selesai setelah file aktif diproses. Pemindaian direktori berjalan sebelum tahap impor dan belum memiliki pembatalan tersendiri. Pada Linux desktop, elemen audio memutar salinan dari data aplikasi melalui Blob URL yang diambil secara asynchronous dari asset protocol; hanya track aktif yang dipertahankan dan metadata impor tetap dibaca sesuai kebutuhan. Cover tersimpan dilayani melalui asset protocol Tauri.

Penutupan jendela tidak ditahan oleh WebView; pengaturan ditulis berurutan selama sesi dan disimpan berkala. Saat impor berlangsung, pembatalan dapat dilakukan dari UI. Jika pengaturan rusak, aplikasi mempertahankan file tersebut dan melaporkan kegagalan; jangan menganggap perubahan sesi tersimpan sampai file dipulihkan. Metadata koleksi yang rusak dilaporkan dan dilewati tanpa menghapus berkasnya.

Ekspor cadangan di UI berisi metadata dan pengaturan, tanpa audio. Untuk mencadangkan seluruh koleksi desktop, tutup aplikasi dan salin direktori data di atas. Data IndexedDB dari prototipe desktop tetap dibaca di WebView yang sama; untuk koleksi yang berasal dari browser lain, impor kembali file musik lalu pulihkan cadangan metadata.

## Pengujian penerimaan

Sebelum rilis publik, uji pada distro Linux sasaran:

1. Instal pada akun bersih tanpa Node.js/Rust; buka dari Start Menu atau menu aplikasi.
2. Putuskan jaringan, buka aplikasi, dan putar demo serta musik lokal.
3. Pilih beberapa file dan folder bersarang dengan nama Unicode; batalkan dialog; drag file dan folder dari pengelola berkas.
4. Pindai ulang: file baru ditambahkan dan file lama tidak terduplikasi. Uji file rusak, folder hilang, izin ditolak, serta pembatalan impor.
5. Putar MP3/WAV/OGG/FLAC, seek, jeda, dan pindah lagu; di browser uji EQ, sedangkan Linux desktop memakai mode playback kompatibilitas tanpa pemrosesan Web Audio.
6. Simpan favorit, playlist, volume dan posisi; tutup lalu buka kembali tanpa autoplay. Pindahkan file asli dan pastikan salinan impor tetap diputar.
7. Hapus lagu dari koleksi dan pastikan file asli masih ada. Uji upgrade, uninstall, dan install ulang sesuai kebijakan data yang ingin dirilis.

Setelah uji manual selesai, catat hasilnya bersama versi distro, arsitektur, jenis paket, codec yang diuji, serta checksum aset pada release. Publikasikan rilis hanya jika build tag, smoke test Linux, dan uji penerimaan manual semuanya lulus.

Tes integrasi Linux dapat dijalankan dengan `node scripts/native-smoke.mjs /path/to/atiga-amp` setelah tersedia `Xvfb` dan `WebKitWebDriver`. Variabel `XVFB` dan `WEBKIT_DRIVER` dapat menunjuk executable alternatif. Tes memakai data sementara, menguji IPC sebenarnya, pemindaian folder tersimpan, pemutaran, dan restart. Tes ini tidak mengotomatisasi dialog file OS, drag fisik, atau proses instalasi; bagian tersebut tetap memerlukan uji penerimaan. Hasil aktual ada di [QA.md](../QA.md).
