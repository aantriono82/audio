# Atiga Amp

Pemutar musik lokal untuk Linux dengan antarmuka charcoal–amber, terinspirasi pemutar musik desktop klasik. Installer desktop membundel antarmuka dan font; pengguna tidak memerlukan Node.js, Rust, terminal, atau server pengembangan. Node.js 22.13+ dan Rust hanya diperlukan oleh pengembang.

Target distribusi adalah Linux x64 (`.deb`/`.AppImage`). AppImage merupakan paket portabel, sedangkan `.deb` dipasang melalui pengelola paket. Lihat [panduan desktop](docs/DESKTOP.md) untuk build, lokasi data, dan batas pengujian.

## Menjalankan

```sh
npm run dev
```

Desktop menggunakan Vite, React, TypeScript, dan Tauri 2. `src/main.tsx` memasang shell React, sedangkan engine playback dan library dimuat dari `src/app.js`. Jalankan desktop dengan `npm run desktop:dev`; hasilkan paket Linux dengan `npm run desktop:build`. `npm run build` hanya menghasilkan antarmuka web.

Buka URL Vite yang tercetak di terminal (bawaan http://127.0.0.1:5174) untuk pengembangan browser. Untuk memilih port, gunakan `npm run dev -- --port 5185`. Mode desktop memakai port 5174 secara ketat agar alamat WebView sesuai dengan server. Server legacy dan pengaturan `PORT` hanya berlaku pada `npm run dev:legacy`.

Penyimpanan browser terpisah per origin, termasuk port. Gunakan kembali port sebelumnya untuk mengakses koleksi impor dan pengaturan yang tersimpan pada port tersebut.

## Fitur

- Enam audio demo instrumental asli yang dibangkitkan di perangkat, tanpa unduhan rekaman.
- Impor banyak file, folder, atau drag-and-drop file audio.
- Playback, seek, volume, mute, shuffle, repeat semua / satu lagu.
- Pencarian, favorit, riwayat, playlist khusus, dan antrean eksplisit.
- Menu tiga titik pada lagu untuk menambah ke playlist atau antrean; drag untuk mengurutkan playlist dan antrean ketika pencarian dan pengurutan judul dimatikan.
- Equalizer sepuluh band, preset, serta spectrum dari audio yang sedang diputar.
- Crossfade, preload gapless, ReplayGain dari tag, preamp, balance, output device, tema, CRT/glow, dan panel drag-and-drop.
- Metadata ID3 dasar, embedded cover, pengelompokan artis/album/genre, smart playlist, waveform, notifikasi, dan pemindaian ulang folder.
- Desktop: dialog sistem untuk file/folder, pemindaian ulang folder, serta drag-and-drop file/folder; audio disalin ke direktori data aplikasi dan pengaturan disimpan dalam JSON secara atomik. Browser: IndexedDB dan localStorage. Tidak otomatis memutar setelah dibuka kembali.
- Pada Linux desktop, mode kompatibilitas memutar melalui elemen media native agar stabil di WebKitGTK/GStreamer; pemrosesan EQ/DSP dan visualisasi Web Audio dinonaktifkan pada mode ini.
- Mode compact, layout responsif, kontrol keyboard, dan Media Session pada browser yang mendukung.
- PWA shell cache agar antarmuka dapat dibuka kembali saat offline; audio impor tetap dibaca dari penyimpanan lokal perangkat.

## Batas versi ini

Aplikasi memiliki backend desktop, paket Linux, serta workflow GitHub Release berbasis tag. Status build dan pengujian aktual dicatat di [QA.md](QA.md). Dukungan codec mengikuti WebKitGTK/GStreamer di Linux. File yang gagal dibaca dilewati dengan pemberitahuan. Impor membaca tag ID3 dasar jika tersedia. File tanpa tag memakai pola nama `Artis - Judul.ext` dan nama folder sebagai album.

Audio desktop disalin ke data aplikasi, sehingga membutuhkan ruang tambahan sebesar file impor. Menghapus lagu dari koleksi menghapus salinan tersebut, tanpa menghapus file asal. Data browser tetap memiliki batas kuota; data desktop lama di IndexedDB tetap dibaca jika tersedia. Koleksi browser pada origin lain tidak otomatis berpindah ke desktop. Font disertakan di paket; file musik tidak diunggah. Gapless/crossfade, codec, pemilihan output, dan notifikasi masih mengikuti kemampuan WebView. Pemindaian ulang desktop dijalankan dari Pengaturan; bila folder asal dipindahkan, pilih folder baru.

## Pemeriksaan

Pasang dependensi pengembangan sekali:

```sh
npm ci
```

Jalankan sebelum menyelesaikan setiap perubahan:

```sh
npm run check
```

Perintah tersebut menjalankan ESLint untuk seluruh JavaScript aplikasi, server, konfigurasi, dan test, kemudian semua unit test bawaan Node.js. Warning lint juga menggagalkan pemeriksaan. Konfigurasi mengikuti [flat config ESLint](https://eslint.org/docs/latest/use/configure/configuration-files).

```sh
npm run lint        # Pemeriksaan statis JavaScript
npm run lint:fix    # Perbaikan lint yang dapat diotomatisasi
npm test            # Semua unit test
npm run test:watch  # Ulangi unit test ketika file terkait berubah
```

Tambahkan kasus regresi di `test/*.test.js` untuk perubahan perilaku atau perbaikan bug. Test mengimpor modul produksi `src/library.js`, yang juga digunakan oleh aplikasi. Cakupannya meliputi escaping HTML, format waktu, pemilihan koleksi, pencarian, urutan antrean, dan struktur/sinyal WAV demo. Test server juga memeriksa port sibuk, validasi port, binding loopback, serta penyajian halaman dan modul JavaScript. Interaksi DOM, playback browser, IndexedDB, HTML, dan CSS belum tercakup oleh unit test/lint ini.

Workflow `.github/workflows/check.yml` menjalankan `npm ci` dan `npm run check` pada setiap push dan pull request setelah proyek tersedia di GitHub dengan Actions aktif. Agar merge wajib menunggu hasil lulus, atur job `check` sebagai required status check pada aturan branch repositori. Untuk pemeriksaan lokal saat mengedit, gunakan `npm run test:watch`; jalankan `npm run check` untuk pemeriksaan lengkap.

Uji manual: putar demo, seek, next, pause; impor WAV/MP3 lokal dan reload; buat playlist melalui tombol +; tambah lewat menu ⋯; ubah preset EQ; cari lagu; aktifkan favorit; periksa ukuran desktop dan mobile. `Space` untuk play/pause, `/` untuk pencarian, `Alt + panah` untuk pindah lagu.
