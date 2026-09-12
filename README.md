# Atiga Amp

Prototipe interaktif pemutar musik lokal dengan antarmuka charcoal–amber, terinspirasi pemutar musik desktop klasik. Tanpa dependensi build; memerlukan Node.js 22.13 atau lebih baru untuk pengembangan dan pengujian.

## Menjalankan

```sh
npm run dev
```

Fondasi desktop menggunakan Vite, React, TypeScript, dan Tauri. `index.html` menjadi dokumen bootstrap dan `src/main.tsx` memasang `App` sebagai entry point utama. Shell player dirender oleh `src/react/App.tsx`, sedangkan satu-satunya engine playback dan library aktif dimuat dari `src/app.js`; ini menjaga seluruh kontrol retro, impor, playlist, EQ, dan penyimpanan memakai sumber state yang sama. Untuk membuka shell desktop Tauri setelah dependensi Rust tersedia, gunakan `npm run tauri dev`. Build produksi web menggunakan `npm run build`, sedangkan installer desktop menggunakan `npm run tauri build`.

Buka URL yang tercetak di terminal (bawaan http://localhost:5174) di browser Linux atau Windows. Jika port bawaan sibuk, server mencoba port berikutnya sampai 5184. Server yang sudah berjalan tidak dihentikan. Server hanya mendengarkan pada loopback perangkat lokal.

Gunakan `PORT=5185 npm run dev` di Linux untuk memilih port tertentu. Jika `PORT` ditentukan dan port tersebut sibuk, server berhenti dengan pesan yang menjelaskan cara mengatasinya. `PORT=0 npm run dev` memilih port kosong dari sistem operasi.

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
- Penyimpanan file impor di IndexedDB; pengaturan dan posisi terakhir di localStorage. Tidak otomatis memutar setelah reload.
- Mode compact, layout responsif, kontrol keyboard, dan Media Session pada browser yang mendukung.
- PWA shell cache agar antarmuka dapat dibuka kembali saat offline; audio impor tetap dibaca dari penyimpanan lokal perangkat.

## Batas versi ini

Ini aplikasi web lokal dan fondasi antarmuka desktop, **belum paket desktop native**. Perlu pengujian Windows tersendiri sebelum distribusi. Dukungan codec mengikuti browser; file yang gagal dibaca dilewati dengan pemberitahuan. Impor membaca tag ID3 dasar jika tersedia, termasuk judul, artis, album, genre, ReplayGain, dan cover APIC. File tanpa tag tetap memakai pola nama `Artis - Judul.ext` dan nama folder sebagai album.

Penyimpanan browser dapat dibersihkan atau dibatasi kuota. Simpan file asli secara terpisah; file tidak diunggah. Google Fonts digunakan untuk font antarmuka dengan fallback sistem saat offline. Tidak ada streaming; dukungan gapless/crossfade, codec, output device, dan notifikasi bergantung pada kemampuan browser. Folder yang dipilih dapat dipindai ulang otomatis jika browser mendukung File System Access API.

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
