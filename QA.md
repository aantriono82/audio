# Status QA Atiga Amp v0.1.22

Terakhir diperbarui: 25 Oktober 2026
Target: Linux x64 (`.deb` dan `.AppImage`)

Dokumen ini mengikuti source dan konfigurasi paket yang saat ini berada pada versi `0.1.22`. Hasil pengujian pada versi lama tidak dianggap sebagai bukti untuk artefak `0.1.22`. Status di bawah diperbarui setelah implementasi stabilisasi dan pemeriksaan lokal pada 25 Oktober 2026.

## Status pemeriksaan v0.1.22

| Pemeriksaan | Perintah | Status pada dokumen ini |
| --- | --- | --- |
| Konsistensi versi | `npm run version:check` | Lulus |
| ESLint dan unit/regresi JavaScript | `npm run check` | Lulus, 59 test |
| TypeScript dan Vite production build | `npm run build` | Lulus |
| Rust format dan Clippy | `npm run desktop:check` | Lulus |
| Unit test storage native | `npm run desktop:test` | Lulus, 7 test |
| Build binary dan paket `.deb` | `npm run desktop:build -- --ci` | Lulus |
| Bundling `.AppImage` | `npm run desktop:build -- --ci` | Belum selesai; tool AppImage macet saat bundling |
| Smoke test `.deb` dengan MP3 | `npm run desktop:smoke:deb` | Terblokir: `Xvfb` tidak menyediakan virtual display |
| Smoke test `.AppImage` dengan MP3 | `npm run desktop:smoke:appimage` | Belum dijalankan |
| Checksum artefak | `npm run desktop:checksums` | Belum dijalankan |

Workflow CI menjalankan pemeriksaan tersebut pada Ubuntu 22.04 sebagai runner publik dan mengulang build/runtime validation pada Ubuntu 24.04. Smoke test membutuhkan `Xvfb`, `WebKitWebDriver`, `dpkg-deb`, dan `gstreamer1.0-tools`.

## Cakupan penerimaan

Sebelum mempublikasikan artefak `v0.1.22`, catat hasil aktual untuk:

1. Instalasi `.deb` dan menjalankan `.AppImage` pada akun bersih tanpa Node.js atau Rust.
2. Startup offline, onboarding, enam demo audio, dan tidak adanya autoplay.
3. Impor file, folder bersarang, nama Unicode, drag-and-drop, file rusak, dan pembatalan impor.
4. Playback MP3, WAV, OGG, dan FLAC; seek, pause, next/previous, antrean, repeat, shuffle, dan restart.
5. Mode Rack dan Koleksi pada jendela 1280×800.
6. EQ/DSP yang awalnya bypass pada Linux lalu aktif setelah tindakan pengguna.
7. Playlist, favorit, volume, posisi playback, resume tanpa autoplay, upgrade, dan restart.
8. Penghapusan lagu dari koleksi tanpa menghapus file asli.

Hasil manual perlu menyertakan distro, arsitektur, jenis paket, codec, status, dan checksum artefak yang diuji. Batas codec dan output audio tetap mengikuti WebKitGTK/GStreamer pada distro yang digunakan.

## Data aplikasi yang perlu diperiksa

Pada Linux, data berada di `${XDG_DATA_HOME:-$HOME/.local/share}/com.atiga.amp`:

- `settings.json`: pengaturan, playlist, favorit, antrean, EQ, volume, posisi, dan preferensi resume.
- `library/<UUID>/`: salinan audio terkelola, `track.json`, dan cover jika tersedia.
- `music-folder.json`: folder terakhir untuk pemindaian ulang.
- `debug.log`: lifecycle dan error aplikasi, dengan batas sekitar 4 MB.

## Bukti historis

Pemeriksaan v0.1.9 pada 14 September 2026 mencatat lint/unit test lulus, build `.deb` lulus, Rust check lulus, dan native smoke AppImage dengan WAV lulus. Bukti tersebut tetap berguna sebagai riwayat, tetapi tidak membuktikan source atau artefak v0.1.22.

Artefak v0.1.6 dan v0.1.7 yang pernah dipublikasikan juga merupakan catatan rilis historis. Hash dan hasilnya tidak boleh dipakai untuk memvalidasi rilis `v0.1.22`.

Langkah penerimaan lengkap ada di [docs/DESKTOP.md](docs/DESKTOP.md). Ruang lingkup produk dan kriteria rilis ada di [docs/PRD.md](docs/PRD.md).
