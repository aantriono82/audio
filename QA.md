# Pemeriksaan versi 0.1

Diperiksa pada browser Chrome di lingkungan Linux, 9 September 2026.

| Pemeriksaan | Hasil |
| --- | --- |
| Syntax JavaScript (`npm run check`) | Lulus |
| Audio demo: play, waktu berjalan, pause, seek, next | Lulus |
| Favorit dan filter favorit | Lulus |
| Pencarian judul | Lulus |
| Membuat playlist dan menambahkan lagu melalui menu | Lulus |
| Preset EQ Warm dan nilai sepuluh slider | Lulus |
| Menambahkan antrean dan mengonsumsi lagu melalui Next | Lulus |
| Membuka / menutup mode compact dan equalizer | Lulus |
| Impor WAV lokal melalui input file | Lulus, memakai WAV hasil demo sebagai fixture |
| Reload: file impor, playlist, EQ, posisi 9 detik, tanpa autoplay | Lulus |
| Layout desktop tanpa overflow horizontal | Lulus |
| Layout mobile emulasi 390 px tanpa overflow horizontal | Lulus |
| Console error / warning di pemeriksaan desktop | Tidak ditemukan |
| Dialog sambutan, audio demo, dan mode ringkas | Ditambahkan; perlu uji klik ulang setelah reset storage |
| Ekspor / impor cadangan library | Ditambahkan; perlu uji dengan file JSON lintas profil |
| PWA manifest / service worker shell | Ditambahkan; perlu uji install dan reload offline |

Pemeriksaan browser dilakukan secara interaktif dan melalui DOM; hasil pada tabel ini merupakan pemeriksaan manual sebelum penambahan suite regresi otomatis. Uji ini belum membuktikan kompatibilitas Windows, semua codec, kualitas audio secara subjektif, shortcut media fisik, pengurutan dengan drag fisik, atau ketahanan kuota penyimpanan. Screenshot mobile penuh gagal karena koneksi browser terputus; pemeriksaan ukuran 390 px berhasil sebelum koneksi terputus. Browser dapat dibuka kembali dan pemeriksaan desktop dilanjutkan.


## Suite otomatis

Jalankan `npm ci`, lalu `npm run check` untuk lint JavaScript dan unit test. Suite di `test/library.test.js` menguji modul produksi `src/library.js`: escaping metadata, waktu, koleksi/favorit/riwayat/playlist, pencarian, antrean, serta format dan sinyal WAV demo. GitHub Actions menjalankan pemeriksaan yang sama pada push dan pull request.

Suite ini belum menggantikan pemeriksaan browser pada tabel di atas. Saat mengubah playback, DOM, impor, penyimpanan, HTML, CSS, atau server, lakukan juga pemeriksaan manual yang relevan dan catat hasilnya. Kontrak UI di `test/ui-contract.test.js` menjaga entry point penting tetap tersedia; pengujian browser interaktif penuh masih diperlukan sebelum rilis desktop.

## Pemeriksaan tambahan versi terbaru

1. Hapus data situs, buka aplikasi pada lebar 390 px, lalu pastikan dialog sambutan muncul dan mode ringkas menampilkan player di bagian bawah.
2. Pilih “Jelajahi audio demo”, putar lagu, pindah lagu, reload, lalu pastikan lagu dan posisi terakhir dipulihkan tanpa autoplay.
3. Impor beberapa file audio, batalkan di tengah proses, lalu pastikan jumlah lagu dan pesan hasil tetap benar.
4. Buka Pengaturan, ekspor cadangan, hapus data situs, impor kembali JSON, lalu periksa playlist dan pengaturan.
5. Jalankan build production, buka sekali saat online, matikan jaringan, dan reload untuk memastikan shell PWA terbuka.

Regresi server di `test/server.test.js` mencakup port tidak valid, port sibuk dengan fallback, port eksplisit sibuk, serta respons HTTP halaman dan modul JavaScript. Test ini memerlukan izin membuka socket loopback.
