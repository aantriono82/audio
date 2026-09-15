# Backlog PRD Atiga Amp

Status: siap dibuat sebagai GitHub Issues; source scope 0.1.8 sudah diimplementasikan, release gate native masih terbuka  
Sumber kebutuhan: [PRD.md](PRD.md)  
Terakhir diperbarui: 14 September 2026

## Status implementasi saat ini

- `AMP-18-01` sampai `AMP-18-07`: implementasi source selesai; validasi otomatis lulus.
- `AMP-18-08`: batas capability diekstrak sebagai tahap refaktor awal; ekstraksi modul berikutnya dapat dilanjutkan bertahap.
- `AMP-18-09`: dokumentasi dan QA diperbarui; native smoke, build paket Linux, dan uji penerimaan manual masih menjadi release gate.
- `AMP-20-01` sampai `AMP-20-03`: belum dimulai karena merupakan perubahan model data rilis 0.2.0.

## Aturan backlog

- `P0` adalah release blocker.
- `P1` harus masuk rilis kecuali ada risiko langsung terhadap stabilitas playback atau data.
- `P2` dapat ditunda tanpa menahan rilis.
- Issue implementasi belum boleh dimulai sebelum ada perintah coding.
- Setiap issue menjaga kompatibilitas data pengguna 0.1.7 kecuali issue migrasi 0.2.0 menyatakan lain.

## Urutan delivery

| Urutan | ID | Milestone | Prioritas | Ringkasan | Dependensi |
| ---: | --- | --- | --- | --- | --- |
| 1 | AMP-18-01 | 0.1.8 | P0 | Kontrak dan regresi stabilitas playback Linux | — |
| 2 | AMP-18-02 | 0.1.8 | P0 | Preferensi melanjutkan posisi tanpa autoplay | AMP-18-01 |
| 3 | AMP-18-03 | 0.1.8 | P0 | Mode Rack dan Koleksi sebagai mode kelas utama | AMP-18-01 |
| 4 | AMP-18-04 | 0.1.8 | P0 | Selaraskan interaksi dengan kemampuan nyata | AMP-18-03 |
| 5 | AMP-18-05 | 0.1.8 | P1 | Jadikan demo hanya bagian onboarding | AMP-18-03 |
| 6 | AMP-18-06 | 0.1.8 | P1 | Lengkapi workflow pengelolaan koleksi 0.1.x | AMP-18-05 |
| 7 | AMP-18-07 | 0.1.8 | P1 | Perbaiki aksesibilitas dan viewport desktop | AMP-18-03, AMP-18-04, AMP-18-06 |
| 8 | AMP-18-08 | 0.1.8 | P2 | Modularisasi engine secara bertahap | AMP-18-01 |
| 9 | AMP-18-09 | 0.1.8 | P0 | Verifikasi dan dokumentasikan rilis 0.1.8 | AMP-18-01 sampai AMP-18-07 |
| 10 | AMP-20-01 | 0.2.0 | P0 | Migrasi ke referensi file asli | AMP-18-09 |
| 11 | AMP-20-02 | 0.2.0 | P0 | Sinkronisasi folder penuh | AMP-20-01 |
| 12 | AMP-20-03 | 0.2.0 | P1 | Cadangan ringan dan penuh | AMP-20-01, AMP-20-02 |
| 13 | AMP-FUTURE-01 | Backlog | P2 | Verifikasi DSP Linux opt-in yang stabil | AMP-18-09 |

---

## AMP-18-01 — Tetapkan kontrak dan regresi stabilitas playback Linux

**GitHub title:** `[0.1.8][P0] Tetapkan kontrak dan regresi stabilitas playback Linux`

### Masalah

Playback Linux memakai WebKitGTK/GStreamer dan telah mengalami regresi posisi awal serta pembacaan file lokal. Stabilitas adalah prioritas tertinggi, tetapi kontrak otomatis saat ini belum mencakup seluruh perpindahan state playback.

### Hasil yang diinginkan

Satu kontrak perilaku yang dapat diuji untuk demo, file impor, startup, seek, pause, stop, next/previous, akhir lagu, antrean, shuffle, dan repeat.

### Cakupan

- Dokumentasikan state transition playback yang didukung.
- Tambahkan regresi yang memverifikasi tidak ada autoplay saat startup.
- Verifikasi setiap pemilihan lagu eksplisit mulai dari nol.
- Verifikasi posisi lagu sebelumnya tidak bocor ke lagu berikutnya.
- Perluas native smoke test untuk rangkaian playback berulang dan restart.
- Uji file MP3, WAV, OGG, dan FLAC pada paket Linux.

### Di luar cakupan

- DSP Linux baru.
- Perubahan model penyimpanan.

### Kriteria penerimaan

- Semua skenario di atas memiliki validasi otomatis atau langkah penerimaan manual yang eksplisit.
- Sepuluh siklus pemilihan/next/pause/seek tidak menghasilkan salah posisi atau playback ganda.
- Restart tidak memutar audio sebelum tindakan pengguna.
- Test unit, UI contract, Rust, build, dan native smoke lulus.

---

## AMP-18-02 — Tambahkan preferensi melanjutkan posisi tanpa autoplay

**GitHub title:** `[0.1.8][P0] Tambahkan preferensi melanjutkan posisi tanpa autoplay`

### Masalah

Aplikasi menyimpan posisi tetapi selalu menyiapkan lagu terakhir dari nol. Pengguna membutuhkan pilihan eksplisit tanpa mengurangi keamanan perilaku startup.

### Hasil yang diinginkan

Preferensi **Lanjutkan posisi terakhir** dengan nilai bawaan mati.

### Cakupan

- Tambahkan preferensi yang tersimpan pada backend browser dan desktop.
- Saat mati, lagu terakhir siap dari `00:00`.
- Saat hidup, lagu terakhir siap dari posisi tersimpan, tetap dalam keadaan pause.
- Pemilihan lagu secara eksplisit selalu mulai dari awal.
- Posisi lagu yang selesai diputar direset ke nol.
- Data lama tanpa field baru menggunakan nilai bawaan mati.

### Kriteria penerimaan

- Kedua nilai preferensi diuji setelah restart.
- Tidak ada autoplay pada kedua nilai.
- Posisi tidak melampaui durasi dan file yang berubah/rusak gagal dengan aman.
- Cadangan ringan mempertahankan preferensi dan posisi yang valid.

---

## AMP-18-03 — Jadikan mode Rack dan Koleksi sebagai mode kelas utama

**GitHub title:** `[0.1.8][P0] Jadikan mode Rack dan Koleksi sebagai mode kelas utama`

### Masalah

Mode ringkas sudah ada, tetapi kontrol untuk membukanya berada di titlebar yang disembunyikan. Rack penuh juga mendorong koleksi dan kontrol penting keluar dari viewport bawaan.

### Hasil yang diinginkan

Pengguna dapat memilih, menemukan, dan berpindah antara mode **Rack** dan **Koleksi** tanpa kehilangan karakter Atiga Amp.

### Cakupan

- Sediakan switch mode yang terlihat pada kedua mode.
- Jelaskan kedua mode dalam onboarding dan minta pilihan awal.
- Simpan dan pulihkan pilihan pengguna.
- Pertahankan pilihan valid milik pengguna lama.
- Pastikan transport selalu terlihat dalam mode Koleksi.
- Pastikan mode switch, bantuan, pengaturan, dan koleksi dapat dicapai pada 1280×800.
- Hilangkan kontradiksi default compact pada viewport sempit dan checkbox onboarding.

### Kriteria penerimaan

- Pengguna baru dapat memilih kedua mode dari onboarding.
- Pengguna dapat berpindah bolak-balik tanpa reload atau kehilangan state playback.
- Pilihan bertahan setelah restart.
- Tidak ada kontrol utama yang hanya dapat dicapai melalui elemen ber-CSS `display: none`.
- Screenshot penerimaan tersedia untuk kedua mode pada 1280×800.

---

## AMP-18-04 — Selaraskan semua interaksi dengan kemampuan nyata

**GitHub title:** `[0.1.8][P0] Selaraskan kontrol rack dengan kemampuan audio nyata`

### Masalah

Sejumlah elemen terlihat dan berperilaku sebagai kontrol, tetapi hanya mengubah dekorasi atau menampilkan toast. Linux memulai pada jalur playback stabil dan membutuhkan aktivasi Web Audio secara eksplisit agar EQ/DSP diterapkan.

### Hasil yang diinginkan

Pengguna dapat percaya bahwa setiap kontrol interaktif menghasilkan efek nyata dan status UI sesuai kemampuan runtime.

### Cakupan

- Inventaris semua tombol, sakelar, knob, dan slider.
- Kaitkan kontrol fungsional ke state/efek yang dapat diverifikasi.
- Pertahankan interaksi visual hanya bila kontrol tersebut secara jelas dinamai sebagai pengaturan tampilan atau simulasi.
- Ubah elemen dekoratif menjadi presentasional dan keluarkan dari urutan fokus.
- Ubah kontrol yang menyiratkan efek audio tetapi hanya mengganti kulit, lampu, atau toast menjadi elemen dekoratif.
- Satukan dialog EQ, pengaturan audio, dan DSP menjadi satu **Pengaturan Audio** bermerek Atiga; tombol rack membuka bagian yang sesuai.
- Pertahankan kontrol EQ/DSP Linux dalam keadaan bypass saat startup, lalu aktifkan jalur Web Audio setelah tindakan pengguna dengan penjelasan yang terlihat.
- Sinkronkan status aktif, `aria-pressed`, lampu, dan state audio.
- Hapus interaksi yang hanya mengeluarkan toast efek palsu.

### Kriteria penerimaan

- Tidak ada kontrol interaktif tanpa perubahan state atau hasil audio yang teruji.
- Kontrol simulasi yang dipertahankan menyebutkan dengan jelas bahwa hasilnya hanya visual.
- Teknologi bantu tidak mengumumkan elemen dekoratif sebagai tombol/slider.
- Status DSP Linux tidak pernah tampak aktif ketika DSP tidak diterapkan.
- Tidak ada dialog pengaturan audio duplikat atau identitas AIMP pada UI produksi.
- Daftar inventaris dan keputusan setiap kontrol tercatat dalam dokumentasi QA.

---

## AMP-18-05 — Jadikan audio demo hanya bagian onboarding

**GitHub title:** `[0.1.8][P1] Jadikan audio demo preview onboarding saja`

### Masalah

Enam demo saat ini selalu bercampur dengan koleksi, hitungan lagu, smart playlist, favorit, antrean, dan histori pengguna.

### Hasil yang diinginkan

Demo membantu evaluasi awal tetapi tidak menjadi isi permanen koleksi.

### Cakupan

- Putar demo di dalam tahap preview onboarding.
- Tombol **Jelajahi audio demo** tidak menyelesaikan onboarding sebelum pengguna memilih selesai.
- Setelah onboarding selesai/dilewati, simpan status dan hilangkan demo secara permanen.
- Bersihkan referensi ID demo dari state lama.
- Pastikan demo tidak kembali melalui restart, upgrade, restore, atau rescan.

### Kriteria penerimaan

- Pengguna baru dapat mendengar demo sebelum menyelesaikan onboarding.
- Setelah selesai, koleksi kosong benar-benar menampilkan nol lagu.
- Restart dan upgrade tidak mengembalikan demo.
- Pembersihan tidak mengubah lagu, playlist, atau favorit non-demo.

---

## AMP-18-06 — Lengkapi workflow pengelolaan koleksi 0.1.x

**GitHub title:** `[0.1.8][P1] Lengkapi workflow pengelolaan koleksi tanpa migrasi storage`

### Masalah

Pengelolaan koleksi masih kehilangan tindakan dasar dan beberapa hasil impor hanya disampaikan melalui toast singkat. 0.1.8 harus memperbaiki usability tanpa mengganti format penyimpanan.

### Cakupan

- Sediakan rename dan delete playlist; penghapusan playlist tidak menghapus lagu.
- Jelaskan konsekuensi penghapusan lagu sebelum konfirmasi.
- Tampilkan ringkasan impor yang dapat dibaca ulang untuk berhasil, duplikat, unsupported, unreadable, unsaved, dan cancelled.
- Pastikan empty state, pencarian, grouping, sort, playlist, dan queue menampilkan hitungan konsisten tanpa demo.
- Pertahankan format data serta salinan audio 0.1.x.

### Kriteria penerimaan

- Lifecycle playlist lengkap diuji: create, rename, add/remove track, reorder, delete.
- Ringkasan impor tidak hilang hanya karena timeout toast.
- Menghapus playlist tidak menghapus audio.
- Menghapus lagu tidak pernah menyentuh file asal.
- Data 0.1.7 dapat dibaca tanpa migrasi manual.

---

## AMP-18-07 — Perbaiki aksesibilitas dan viewport desktop

**GitHub title:** `[0.1.8][P1] Perbaiki aksesibilitas dan usability viewport desktop`

### Masalah

Audit saat ini menemukan tombol tanpa nama, tidak ada landmark utama, sel tabel tanpa header terkait, dan target sentuh terlalu kecil. Pada jendela bawaan 1280×800, aksi tertentu berada di luar viewport awal.

### Cakupan

- Tambahkan landmark utama dan struktur heading yang masuk akal.
- Beri nama semua kontrol fungsional.
- Hubungkan seluruh sel tabel dengan header yang sesuai.
- Pastikan indikator fokus terlihat dan urutan fokus mengikuti alur UI.
- Perbesar area interaksi pada tampilan sempit tanpa merusak bentuk visual rack.
- Pastikan mode switch, playback, koleksi, bantuan, dan pengaturan terlihat pada 1280×800.
- Jalankan audit pada mode Rack dan Koleksi.

### Kriteria penerimaan

- Tidak ada kegagalan Lighthouse untuk `button-name`, `landmark-one-main`, dan `td-has-header`.
- Tidak ada fungsi utama yang hanya dapat dijalankan dengan pointer.
- Navigasi keyboard tidak berhenti pada elemen dekoratif.
- Tidak ada horizontal overflow pada 1280×800 dan viewport sempit yang diuji.

---

## AMP-18-08 — Modularisasi engine secara bertahap

**GitHub title:** `[0.1.8][P2] Modularisasi engine tanpa mengubah perilaku pengguna`

### Masalah

Engine playback, state, persistence, impor, DSP, dan binding DOM berada dalam satu modul besar. Ini memperbesar risiko regresi dan membatasi manfaat React/TypeScript.

### Cakupan

- Catat batas modul tujuan: playback, library, persistence, import, capability, dan UI bindings.
- Ekstrak satu batas pada satu perubahan kecil.
- Pertahankan satu engine playback.
- Tambahkan test kontrak sebelum memindahkan perilaku berisiko.
- Pertahankan format data 0.1.x.

### Di luar cakupan

- Penulisan ulang UI sekaligus.
- Engine React kedua.
- Perubahan visual atau fitur yang tidak diperlukan oleh ekstraksi.

### Kriteria penerimaan

- Setiap tahap dapat direview dan di-revert sendiri.
- Seluruh test dan native smoke tetap lulus setelah setiap tahap.
- Refaktor dapat ditunda tanpa menahan rilis 0.1.8.

---

## AMP-18-09 — Verifikasi dan dokumentasikan rilis 0.1.8

**GitHub title:** `[0.1.8][P0] Selesaikan release gate dan dokumentasi 0.1.8`

### Masalah

Source sudah bernomor 0.1.8, sedangkan catatan QA masih berhenti pada 0.1.7. Klaim fitur browser dan Linux juga belum dibedakan secara tegas.

### Cakupan

- Selaraskan README, dokumentasi desktop, QA, manifest paket, dan nomor versi.
- Nyatakan Linux desktop sebagai produk utama dan browser sebagai demo/pengembangan.
- Bedakan kemampuan playback/DSP per runtime.
- Jalankan seluruh pemeriksaan otomatis dan native smoke.
- Jalankan matriks penerimaan manual `.deb` dan `.AppImage`.
- Catat distro, codec, hasil, checksum, dan batas pengujian.

### Kriteria penerimaan

- AMP-18-01 sampai AMP-18-07 selesai; AMP-18-08 boleh ditunda.
- Semua release gate PRD lulus.
- QA tidak mengklaim pengujian yang belum dijalankan.
- Tag `v0.1.8` baru dibuat setelah commit yang diverifikasi tersedia.

---

## AMP-20-01 — Migrasikan koleksi ke referensi file asli

**GitHub title:** `[0.2.0][P0] Migrasikan koleksi dari salinan terkelola ke referensi file asli`

### Masalah

Impor desktop 0.1.x menggandakan setiap file musik ke direktori data aplikasi. Koleksi besar memakai ruang hampir dua kali lipat dan perilaku ini tidak umum untuk pemutar musik lokal.

### Hasil yang diinginkan

Impor baru mengindeks file asli tanpa menyalin audio serta tetap menjaga privasi, izin path, dan kemampuan upgrade.

### Cakupan

- Rancang schema berversi untuk identitas, path terotorisasi, metadata, dan status ketersediaan.
- Indeks file asli untuk impor baru.
- Baca koleksi 0.1.x tanpa kehilangan playlist, favorit, histori, antrean, dan pengaturan.
- Migrasikan secara non-destruktif.
- Jangan hapus salinan lama otomatis; tawarkan cleanup hanya setelah validasi dan persetujuan pengguna.
- Tandai file asli yang tidak tersedia dan sediakan relink.

### Kriteria penerimaan

- Impor baru tidak membuat salinan audio di data aplikasi.
- Aplikasi tidak pernah menulis atau menghapus file asli.
- Upgrade dengan koleksi 0.1.7/0.1.8 mempertahankan seluruh data pengguna.
- Kegagalan migrasi dapat dilanjutkan atau dibatalkan tanpa kehilangan koleksi lama.

---

## AMP-20-02 — Terapkan sinkronisasi folder penuh

**GitHub title:** `[0.2.0][P0] Terapkan sinkronisasi folder penuh tanpa duplikasi`

### Masalah

Rescan saat ini hanya menambahkan file berdasarkan fingerprint nama, ukuran, dan waktu modifikasi. Perubahan atau rename dapat menciptakan entri baru, sedangkan file yang hilang tetap terlihat.

### Cakupan

- Deteksi added, updated, moved/renamed, missing, duplicate, dan failed.
- Dukung penambahan, penghapusan, dan pemindaian beberapa folder musik yang dipantau.
- Pertahankan identitas lagu bila file dipindahkan atau diganti nama dan dapat dicocokkan dengan aman.
- Tandai file hilang sebelum cleanup eksplisit.
- Pertahankan referensi playlist, favorit, antrean, dan histori.
- Dukung pembatalan scan/import dengan transaksi aman.
- Tampilkan ringkasan hasil permanen sampai ditutup pengguna.

### Kriteria penerimaan

- Rename atau perubahan metadata tidak menghasilkan duplikat yang tidak perlu.
- File hilang tidak diam-diam menghapus susunan playlist.
- Rescan berulang tanpa perubahan menghasilkan nol perubahan.
- Sinkronisasi satu folder tidak menghapus atau mengubah isi folder lain yang dipantau.
- Pembatalan tidak meninggalkan track setengah tersimpan.
- Folder Unicode, bersarang, izin ditolak, symlink, dan file rusak tercakup pengujian.

---

## AMP-20-03 — Sediakan cadangan ringan dan penuh

**GitHub title:** `[0.2.0][P1] Sediakan cadangan ringan dan cadangan penuh termasuk audio`

### Masalah

Ekspor saat ini hanya menyimpan metadata dan bergantung pada file yang sudah tersedia saat pemulihan. Istilah “cadangan” dapat menimbulkan ekspektasi bahwa musik juga aman.

### Cakupan

- Ganti pilihan tunggal menjadi **Cadangan ringan** dan **Cadangan penuh**.
- Cadangan ringan menyertakan pengaturan, metadata, playlist, antrean, histori, dan identitas file.
- Cadangan penuh dapat menyertakan seluruh koleksi atau audio dari lagu yang dipilih pengguna.
- Tampilkan estimasi ukuran, ruang kosong, isi, dan peringatan privasi.
- Validasi versi, manifest, checksum, dan kelengkapan sebelum restore.
- Tawarkan mode restore **Gabungkan** dan **Ganti koleksi**, dengan Gabungkan sebagai bawaan.
- Gunakan staging/transaction agar kegagalan tidak mengubah koleksi aktif.

### Kriteria penerimaan

- Label dan penjelasan membedakan kedua jenis cadangan dengan jelas.
- Cadangan penuh seluruh koleksi dan cadangan penuh untuk lagu terpilih sama-sama dapat dibuat dan divalidasi.
- Cadangan ringan dapat menghubungkan kembali file yang tersedia.
- Cadangan penuh dapat dipulihkan pada profil Linux bersih tanpa file sumber.
- Mode Gabungkan mempertahankan data yang tidak berkonflik; mode Ganti koleksi meminta konfirmasi eksplisit sebelum commit.
- Arsip rusak, ruang tidak cukup, dan pembatalan tidak merusak koleksi aktif.

---

## AMP-FUTURE-01 — Verifikasi DSP Linux opt-in yang stabil

**GitHub title:** `[Backlog][P2] Verifikasi jalur DSP Linux opt-in tanpa mengurangi stabilitas playback`

### Pertanyaan

Apakah EQ, ReplayGain, spectrum, crossfade, dan efek lain tetap stabil setelah pengguna mengaktifkan jalur Web Audio pada paket Linux sasaran?

### Cakupan

- Bandingkan pilihan teknis yang sesuai dengan arsitektur Tauri saat itu.
- Buat prototipe terisolasi dan ukur stabilitas, latensi, penggunaan CPU, dukungan codec, dan packaging.
- Tentukan efek yang layak, tidak layak, atau perlu ditunda berdasarkan hasil paket sasaran.

### Kriteria penerimaan

- Hasil eksperimen dapat direproduksi pada distro sasaran.
- Ada rekomendasi go/no-go per kemampuan DSP.
- Stabilitas playback tetap menjadi syarat mutlak untuk implementasi lanjutan.
