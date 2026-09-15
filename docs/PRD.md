# PRD Atiga Amp

Status: disetujui untuk diturunkan menjadi backlog  
Terakhir diperbarui: 14 September 2026  
Rilis terdekat: 0.1.8

## Ringkasan produk

Atiga Amp adalah pemutar musik lokal untuk Linux desktop yang dapat dipasang dan digunakan tanpa Node.js, Rust, terminal, akun, atau koneksi internet. Antarmuka browser dipertahankan sebagai sarana demo dan pengembangan, bukan sebagai produk yang harus memiliki paritas fitur dengan aplikasi desktop.

Atiga Amp memiliki dua pengalaman yang sama penting:

1. **Rack vintage**, yang mempertahankan karakter visual cassette deck dan amplifier.
2. **Pemutar berfokus pada koleksi**, yang mengutamakan pencarian, antrean, playlist, dan kontrol playback sehari-hari.

Kedua pengalaman harus mudah ditemukan, mudah dipindahkan, dan mengingat pilihan pengguna. Estetika vintage tidak boleh membuat fungsi utama sulit dicapai.

## Keputusan produk

| Area | Keputusan |
| --- | --- |
| Platform utama | Linux desktop x64. Browser hanya untuk demo dan pengembangan. |
| Pengalaman | Rack vintage dan pemutar praktis merupakan dua mode kelas utama. |
| Kontrol | Elemen hanya boleh interaktif bila menghasilkan perubahan nyata. Kontrol yang hanya mengubah visual boleh tetap interaktif bila jelas disebut sebagai pengaturan tampilan/simulasi; elemen dekoratif tidak boleh menyamar sebagai kontrol. |
| Pengaturan audio | EQ, DSP, mixing, dan pengaturan audio disatukan dalam satu permukaan **Pengaturan Audio** bermerek Atiga. Tombol pada rack membuka bagian yang sesuai. |
| DSP Linux | Linux memulai playback pada jalur native yang stabil. Tombol DSP/EQ dan knob audio mengaktifkan Web Audio secara eksplisit setelah tindakan pengguna; bila belum diaktifkan, efek tetap bypass dan status UI menunjukkan keadaan tersebut. |
| Model koleksi tujuan | Musik direferensikan dari file asli dan tidak disalin otomatis ke direktori aplikasi. Perubahan ini ditargetkan untuk 0.2.0. |
| Pemindaian folder tujuan | Mendukung beberapa folder musik dengan sinkronisasi penuh: menemukan penambahan, perubahan, penggantian nama, serta file yang hilang. |
| Posisi playback | Menjadi preferensi pengguna; bawaan memulai lagu dari awal dan tidak pernah autoplay setelah aplikasi dibuka. |
| Cadangan | Tersedia cadangan ringan dan cadangan penuh termasuk audio. Cadangan penuh dapat mencakup seluruh koleksi atau lagu yang dipilih dan ditargetkan untuk 0.2.0. |
| Pemulihan cadangan | Pengguna memilih **Gabungkan** atau **Ganti koleksi**; bawaan adalah Gabungkan. |
| Audio demo | Hanya tersedia dalam alur onboarding dan dihapus permanen dari koleksi setelah onboarding selesai. |
| Arsitektur | Refaktor dilakukan bertahap dengan menjaga perilaku dan kompatibilitas data; tidak ada penulisan ulang sekaligus. |
| Strategi rilis | 0.1.8 adalah rilis stabilisasi dan usability. Perubahan model data masuk 0.2.0. |

## Prioritas

Urutan prioritas produk adalah:

1. Stabilitas playback.
2. Pengelolaan koleksi.
3. Kemudahan UI.
4. Estetika vintage.
5. DSP.
6. Mobile/PWA.

Urutan ini menjadi aturan pemutus ketika dua kebutuhan bertentangan. Atiga Amp tidak mengorbankan stabilitas playback atau integritas koleksi untuk efek visual maupun DSP.

## Pengguna dan pekerjaan utama

Pengguna utama menyimpan musik di komputer Linux dan ingin mendengarkannya secara offline. Ia harus dapat:

- memasang aplikasi dari `.deb` atau menjalankan `.AppImage`;
- memilih file atau folder musik tanpa takut file asli dipindahkan atau dihapus;
- menemukan lagu, mengelola playlist dan antrean, lalu memutar musik dengan stabil;
- menutup dan membuka aplikasi tanpa autoplay serta tanpa kehilangan koleksi atau preferensi;
- memilih antara pengalaman rack vintage dan tampilan koleksi yang ringkas;
- memahami dengan jelas fitur audio yang tersedia pada Linux;
- membuat cadangan yang sesuai dengan kebutuhan pemulihannya.

## Sasaran rilis 0.1.8

### Stabilitas playback

- Demo dan file lokal yang didukung dapat diputar, dijeda, dicari posisinya, dihentikan, dan dipindahkan berulang kali tanpa salah lagu, salah posisi, atau playback ganda.
- Membuka ulang aplikasi tidak memulai playback otomatis.
- Preferensi **Lanjutkan posisi terakhir** tersedia. Nilai bawaan adalah mati.
- Saat preferensi mati, lagu terakhir tetap dapat dipilih saat startup tetapi posisi siap-putarnya adalah `00:00`.
- Saat preferensi hidup, lagu terakhir siap dilanjutkan dari posisi tersimpan tanpa autoplay. Memilih lagu secara eksplisit tetap memulai lagu itu dari awal.
- Perpindahan otomatis, repeat, shuffle, dan antrean tidak boleh membawa posisi lagu sebelumnya.
- Linux tetap memulai playback pada jalur yang paling stabil. Fitur Web Audio hanya terlihat aktif setelah pengguna mengaktifkan DSP/EQ atau mengubah knob audio, lalu statusnya disinkronkan dengan graph audio.

### Dua mode kelas utama

- Pengguna dapat berpindah antara **Rack** dan **Koleksi** melalui kontrol yang selalu dapat ditemukan.
- Onboarding menjelaskan kedua mode dan meminta pilihan awal tanpa menetapkan pilihan secara tersembunyi.
- Pilihan mode disimpan dan dipulihkan setelah restart.
- Mode Koleksi menyediakan transport playback yang selalu terlihat.
- Mode Rack mempertahankan identitas visual saat ini, tetapi akses ke koleksi, pengaturan, bantuan, dan perpindahan mode tetap terlihat pada ukuran jendela bawaan 1280×800.
- Pengguna lama mempertahankan preferensi tampilan yang sudah tersimpan apabila nilainya valid.

### Kontrol yang jujur

- Setiap tombol, sakelar, dan knob interaktif harus mengubah playback, audio, koleksi, tampilan, atau pengaturan secara nyata.
- Kontrol simulasi boleh mengubah tampilan meter atau perangkat bila nama dan keterangannya secara tegas menyebut fungsi visual tersebut.
- Kontrol yang menyiratkan efek audio tetapi hanya mengubah kulit, lampu, atau toast harus menjadi dekorasi dan keluar dari urutan fokus.
- Elemen yang murni dekoratif tidak menerima fokus keyboard dan tidak mengumumkan diri sebagai kontrol kepada teknologi bantu.
- Kontrol EQ/DSP Linux tetap terlihat dalam keadaan bypass saat startup dan dapat diaktifkan secara eksplisit. Aplikasi menjelaskan bahwa aktivasi memindahkan sesi ke jalur Web Audio.
- Tidak ada kontrol audio yang hanya menampilkan toast seolah-olah efek telah diterapkan.
- Status aktif/nonaktif pada UI harus sesuai dengan state dan kemampuan audio sebenarnya.
- Dialog EQ, pengaturan audio, dan DSP yang tumpang tindih digabung menjadi satu **Pengaturan Audio** bermerek Atiga; tombol rack membuka bagian yang relevan.

### Onboarding dan demo

- Enam audio demo tersedia sebagai preview di dalam onboarding.
- Menyelesaikan atau melewati onboarding menghapus demo dari koleksi utama dan menyimpan status penyelesaian tersebut.
- Demo tidak muncul kembali setelah restart, upgrade, impor cadangan, atau pemindaian ulang.
- Referensi demo yang pernah tersimpan dalam favorit, antrean, riwayat, atau playlist dibersihkan tanpa memengaruhi lagu pengguna.
- Pilihan **Jelajahi audio demo** mempertahankan pengguna di alur preview sampai ia memilih menyelesaikan onboarding.

### Pengelolaan koleksi pada model penyimpanan 0.1.x

- 0.1.8 tetap membaca dan memutar salinan audio yang telah dikelola aplikasi 0.1.x.
- Impor banyak file dan folder memberi ringkasan yang membedakan berhasil, duplikat, format tidak didukung, gagal dibaca, dan gagal disimpan.
- Playlist dapat dibuat, diubah namanya, dan dihapus tanpa menghapus lagunya.
- Menghapus lagu dari koleksi memberi tahu dengan jelas bahwa pada 0.1.8 hanya salinan yang dikelola aplikasi yang dihapus; file asal tidak diubah.
- Daftar, antrean, pencarian, pengelompokan, pengurutan, serta empty state tetap dapat digunakan dengan keyboard.

### Kemudahan dan aksesibilitas

- Kontrol mode, bantuan, pengaturan, impor, pencarian, dan playback dapat dicapai tanpa bergantung pada elemen tersembunyi.
- Dokumen memiliki landmark utama, nama kontrol yang lengkap, header tabel yang benar, urutan fokus yang masuk akal, dan indikator fokus yang terlihat.
- Target interaktif yang dipakai pada tampilan sempit memenuhi ukuran sentuh minimum yang wajar.
- Gerakan dekoratif menghormati `prefers-reduced-motion`.
- Tampilan 1280×800 tidak menyembunyikan aksi utama di luar viewport awal.
- Mobile/PWA tidak menjadi release gate 0.1.8, tetapi perubahan 0.1.8 tidak boleh menambah regresi horizontal overflow atau membuat fungsi dasar tidak dapat digunakan.

### Refaktor bertahap

- Engine playback, koleksi, persistence, impor, dan binding UI dipisahkan secara bertahap di belakang kontrak perilaku yang diuji.
- React tidak boleh memiliki engine playback kedua.
- Setiap ekstraksi menjaga format data 0.1.x dan lolos tes regresi sebelum ekstraksi berikutnya.
- Refaktor yang membahayakan jadwal atau stabilitas boleh ditunda tanpa menahan 0.1.8.

### Dokumentasi dan rilis

- Dokumentasi menyebut Linux desktop sebagai produk utama dan menjelaskan bahwa browser adalah demo/pengembangan.
- Daftar fitur membedakan fitur aktif di Linux dari fitur yang hanya tersedia pada browser.
- QA dan nomor versi diperbarui untuk 0.1.8 sebelum tag dibuat.
- Rilis hanya dilakukan setelah pemeriksaan otomatis, smoke test AppImage, dan matriks penerimaan manual lulus.

## Bukan sasaran 0.1.8

- Mengganti koleksi dari salinan terkelola menjadi referensi file asli.
- Sinkronisasi folder penuh.
- Cadangan penuh yang mengemas audio.
- Paritas fitur browser/PWA.
- Optimalisasi khusus mobile di luar pencegahan regresi dasar.
- Dukungan Windows, RPM, ARM, akun, cloud sync, streaming, atau telemetri.

## Sasaran rilis 0.2.0

### Referensi file asli dan migrasi

- Impor baru menyimpan referensi terotorisasi ke file asli, metadata, dan identitas file; audio tidak disalin otomatis.
- Atiga Amp tidak pernah mengubah atau menghapus file musik asli.
- Koleksi 0.1.x tetap dapat dibaca selama migrasi.
- Migrasi tidak menghapus salinan terkelola secara otomatis. Pembersihan hanya ditawarkan setelah seluruh referensi tujuan tervalidasi dan pengguna menyetujuinya.
- File yang hilang ditandai tidak tersedia; playlist dan histori tidak langsung kehilangan identitas lagunya.

### Sinkronisasi folder penuh

- Pengguna dapat menambahkan dan mengelola beberapa folder musik yang dipantau.
- Pemindaian mendeteksi file baru, metadata atau isi yang berubah, penggantian nama/pemindahan yang dapat dicocokkan, dan file yang hilang.
- Sinkronisasi tidak membuat duplikat hanya karena nama atau waktu modifikasi berubah.
- File hilang ditandai terlebih dahulu dan dapat dibersihkan melalui tindakan eksplisit.
- Hasil pemindaian merangkum penambahan, pembaruan, pemindahan, file hilang, duplikat, dan kegagalan.
- Pembatalan menghentikan pekerjaan secara aman tanpa meninggalkan transaksi parsial.

### Dua jenis cadangan

- **Cadangan ringan** memuat pengaturan, playlist, antrean, histori, metadata, dan identitas file tanpa audio.
- **Cadangan penuh** memuat data yang sama beserta audio; pengguna dapat memilih seluruh koleksi atau lagu tertentu sehingga cadangan dapat dipulihkan pada komputer lain.
- UI menjelaskan isi, ukuran perkiraan, ruang kosong yang diperlukan, serta dampak privasi sebelum ekspor.
- Pemulihan memvalidasi versi dan integritas arsip sebelum mengubah koleksi aktif.
- Pemulihan menawarkan **Gabungkan** dan **Ganti koleksi**, dengan Gabungkan sebagai pilihan bawaan.
- Kegagalan atau pembatalan pemulihan tidak boleh merusak koleksi yang sudah ada.

## Backlog setelah 0.2.0

- Memperluas verifikasi jalur DSP Linux opt-in pada paket dan distro sasaran.
- Menilai kebutuhan PWA/mobile berdasarkan penggunaan nyata; tidak ada janji paritas sebelumnya.

## Kriteria rilis

0.1.8 dapat dirilis bila:

- semua pemeriksaan lint, unit/regresi, TypeScript, Vite, Rust format, Clippy, dan test Rust lulus;
- smoke test native mencakup startup, impor, restart, seek, pause, next/previous, queue, repeat, shuffle, dan kedua nilai preferensi posisi;
- penerimaan manual lulus untuk `.deb` dan `.AppImage` pada setidaknya Ubuntu 22.04/24.04 atau Linux Mint yang didokumentasikan;
- mode Rack dan Koleksi dapat dipakai pada jendela 1280×800;
- tidak ada kontrol palsu yang masih dapat dioperasikan;
- data pengguna 0.1.7 tetap dapat dibaca;
- `QA.md`, README, versi paket, dan tag rilis konsisten.

Karena aplikasi bersifat lokal dan tidak menggunakan telemetri, keberhasilan dinilai melalui pengujian deterministik, penerimaan manual, laporan bug rilis, dan ketiadaan kehilangan data yang diketahui.

## Risiko utama

| Risiko | Penanganan |
| --- | --- |
| Regresi WebKitGTK/GStreamer | Pertahankan jalur kompatibilitas Linux dan perluas smoke test sebelum refaktor. |
| UI menjanjikan DSP yang tidak aktif | Nonaktifkan/sembunyikan kontrol beserta penjelasan kemampuan. |
| Refaktor monolit memunculkan dua sumber state | Ekstraksi satu batas modul per perubahan dan pertahankan satu engine playback. |
| Migrasi 0.2.0 kehilangan akses file | Migrasi non-destruktif, tandai file hilang, dan jangan hapus salinan lama otomatis. |
| Cadangan penuh sangat besar | Tampilkan estimasi ukuran dan ruang sebelum membuat arsip. |

## Pemetaan delivery

Backlog implementasi dan urutan dependensinya berada di [ISSUES.md](ISSUES.md). Dokumen itu adalah sumber issue siap salin ke GitHub; perubahan ruang lingkup harus memperbarui PRD ini dan issue terkait.
