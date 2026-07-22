# PRD — Sistem Informasi Manajemen (SIM) Sekolah
## SMA Muhammadiyah 2 Surabaya — Prototype

**Tujuan dokumen:** Jadi acuan development untuk GitHub Copilot / AI coding agent membangun prototype. Referensi desain & flow: prototype sebelumnya untuk Sekolah Insan Kamil (https://insankamil.vercel.app/) — sidebar navigation + content area, per-role dashboard.

**Tech stack:**
- Next.js (App Router) + TypeScript
- Tailwind CSS
- **Tanpa database & backend API** — ini prototype frontend saja. Semua data pakai **dummy/mock data** (hardcoded di file `data/*.ts` atau JSON), disimpan di React state (`useState`) untuk simulasi CRUD (tambah/edit/hapus hanya update state, tidak persist — reset saat reload halaman, ini expected behavior untuk prototype)
- Login/role juga disimulasikan (dummy user list, pilih role dari dropdown atau login form yang cocokkan ke data dummy) — tidak perlu auth beneran
- **Tema warna: biru** sebagai warna utama (primary) — dipakai di sidebar aktif state, tombol utama, header, badge status, chart. Kombinasikan dengan neutral gray untuk background/teks dan warna semantik standar (hijau=sukses/lunas, kuning=pending, merah=alert/telat) untuk status badge

**Status referensi (dari catatan sebelumnya):**
- Modul yang sudah pernah dibangun (versi lama, jadi basis): Data Siswa, Data Pegawai, Keuangan, Presensi Siswa & Pegawai
- Modul baru untuk prototype ini: Bimbingan Konseling, SPMB, e-Rapor, LMS, Surat Menyurat, Stok Inventaris, Perpustakaan

---

## 1. Struktur Navigasi (Sidebar)

Sidebar collapsible di kiri, grouped by kategori. Top bar berisi: nama sekolah, notifikasi, profil user (dropdown: ganti role/logout).

```
[Logo] SIM SMA Muhammadiyah 2 Surabaya
├── 📊 Dashboard
├── 👨‍🎓 Kesiswaan
│   ├── Data Siswa
│   ├── e-Rapor
│   └── Bimbingan Konseling
├── 👨‍🏫 Kepegawaian
│   └── Data Pegawai
├── 🕒 Presensi
│   ├── Presensi Siswa
│   └── Presensi Pegawai
├── 💰 Keuangan
│   ├── SPP & Tagihan
│   ├── Pembayaran
│   └── Laporan Keuangan
├── 📝 SPMB (Penerimaan Siswa Baru)
│   ├── Pendaftaran (Admin)
│   └── Portal Calon Siswa
├── ✉️ Surat Menyurat
│   ├── Surat Masuk
│   ├── Surat Keluar
│   └── Disposisi
├── 📦 Inventaris
│   └── Stok Barang
├── 💻 LMS
│   ├── Kelas & Materi
│   ├── Tugas & Kuis
│   └── Nilai
├── 📚 Perpustakaan
│   ├── Katalog Buku
│   └── Sirkulasi (Pinjam/Kembali)
├── ⚙️ Pengaturan
│   ├── User & Role
│   └── Tahun Ajaran
└── 🚪 Logout
```

Sidebar item yang tampil menyesuaikan role user (RBAC) — lihat matrix role di bagian 13.

---

## 2. Modul: Data Siswa

**Deskripsi:** Master data siswa aktif, alumni, dan calon siswa yang sudah diterima dari SPMB.

**Entitas utama (`students`):**
- NISN, NIS, nama lengkap, tempat/tanggal lahir, jenis kelamin
- Alamat, no HP, email
- Data orang tua/wali (nama ayah, ibu, wali, pekerjaan, no HP)
- Kelas & jurusan saat ini, tahun ajaran
- Status: aktif, lulus, pindah, keluar, DO
- Foto profil, dokumen (akta lahir, KK, ijazah — upload file)
- Riwayat kelas per tahun ajaran (untuk histori kenaikan kelas)

**Fitur utama:**
1. List siswa dengan filter (kelas, jurusan, angkatan, status) + search + pagination
2. Tambah/edit/hapus data siswa (form multi-step: data pribadi, orang tua, dokumen)
3. Import siswa massal via Excel (template + validasi)
4. Detail profil siswa — tab: Biodata, Nilai (link ke e-Rapor), Presensi, Riwayat BK, Riwayat Pembayaran
5. Kenaikan kelas massal (pilih kelas asal → kelas tujuan, per siswa bisa naik/tinggal kelas)
6. Cetak kartu pelajar / buku induk siswa (PDF)
7. Mutasi siswa (pindah masuk/keluar) dengan riwayat surat

**Role akses:** Admin TU (full), Wali Kelas (read + edit terbatas kelasnya), Kepala Sekolah (read only)

---

## 3. Modul: Data Pegawai

**Deskripsi:** Master data guru & staf/tendik.

**Entitas utama (`employees`):**
- NIP/NUPTK, nama, jenis pegawai (guru/tendik/kepsek), status kepegawaian (tetap/honorer/PNS DPK)
- Data pribadi (alamat, no HP, email, pendidikan terakhir)
- Mapel/jabatan yang diampu, wali kelas dari mana
- Riwayat jabatan & unit kerja
- Dokumen (ijazah, SK, sertifikat)
- Foto profil

**Fitur utama:**
1. List pegawai dengan filter (jenis, status, mapel) + search
2. Tambah/edit/hapus data pegawai
3. Import massal via Excel
4. Detail profil pegawai — tab: Biodata, Jadwal Mengajar, Presensi, Penilaian Kinerja
5. Penugasan mengajar (assign guru ke mapel + kelas per tahun ajaran)
6. Cetak SK / kartu pegawai (PDF)
7. Riwayat kenaikan pangkat/jabatan

**Role akses:** Admin TU (full), Kepala Sekolah (read + approve), Guru (read profil sendiri, edit terbatas)

---

## 4. Modul: Presensi Siswa & Pegawai

**Deskripsi:** Absensi harian siswa (per kelas per jam pelajaran) dan pegawai (jam masuk/pulang), termasuk opsi GPS-based check-in seperti di prototype Insan Kamil.

**Entitas utama:**
- `attendance_students`: siswa_id, kelas_id, tanggal, jam_ke, status (hadir/izin/sakit/alpha), dicatat_oleh
- `attendance_employees`: pegawai_id, tanggal, jam_masuk, jam_pulang, status, lokasi (lat/long jika pakai GPS), foto selfie (opsional)

**Fitur utama:**
1. **Presensi Siswa:** guru piket/wali kelas input presensi per kelas per hari (checklist cepat), rekap otomatis per siswa
2. **Presensi Pegawai:** check-in/check-out via web/mobile dengan validasi GPS (radius sekolah) — mirip fitur "Presensi Menggunakan GPS" di Insan Kamil
3. Kalender log presensi (tampilan bulanan, klik tanggal → lihat detail log hari itu)
4. Rekap & laporan presensi (per siswa/pegawai/kelas/bulan), export Excel/PDF
5. Notifikasi otomatis ke orang tua jika siswa alpha (opsional, via WA/email gateway)
6. Pengajuan izin/sakit online (siswa/ortu upload surat, disetujui wali kelas)

**Role akses:** Guru Piket/Wali Kelas (input presensi siswa), Pegawai (self check-in), Admin TU (rekap semua, edit koreksi), Kepala Sekolah (laporan read only)

---

## 5. Modul: Keuangan

**Deskripsi:** Pengelolaan SPP, tagihan lain (uang gedung, seragam, kegiatan), pembayaran, dan laporan keuangan sekolah.

**Entitas utama:**
- `billing_types`: jenis tagihan (SPP, uang gedung, kegiatan, dll), nominal, periode
- `bills`: siswa_id, jenis_tagihan_id, periode (bulan/tahun), nominal, status (lunas/belum/cicil)
- `payments`: bill_id, tanggal bayar, nominal dibayar, metode (tunai/transfer/VA), bukti bayar, dicatat_oleh
- `finance_ledger`: pemasukan & pengeluaran umum sekolah (bukan hanya SPP)

**Fitur utama:**
1. Setup jenis tagihan & nominal per kelas/jurusan/angkatan
2. Generate tagihan bulanan otomatis (batch, per siswa aktif)
3. Input pembayaran manual (kasir) + upload bukti transfer untuk verifikasi
4. Riwayat tagihan & pembayaran per siswa (tunggakan terlihat jelas)
5. Cetak kwitansi/invoice PDF
6. Laporan keuangan: rekap pemasukan per periode, tunggakan per kelas, grafik cashflow
7. Reminder tagihan jatuh tempo (dashboard widget + opsional notifikasi WA)
8. Integrasi Virtual Account/payment gateway (opsional, fase 2)

**Role akses:** Bendahara/Admin Keuangan (full), Kepala Sekolah (laporan read only), Ortu/Siswa (lihat tagihan & riwayat bayar sendiri via portal)

---

## 6. Modul: Bimbingan Konseling (BK)

**Deskripsi:** Pencatatan kasus, konseling, dan pelanggaran siswa oleh guru BK.

**Entitas utama:**
- `bk_cases`: siswa_id, tanggal, kategori (akademik/pribadi/sosial/pelanggaran), deskripsi kasus, guru_bk_id
- `bk_violations`: siswa_id, jenis pelanggaran, poin pelanggaran, tanggal, tindak lanjut
- `bk_sessions`: catatan sesi konseling (tanggal, ringkasan, rekomendasi, status tindak lanjut)

**Fitur utama:**
1. Input kasus/pelanggaran siswa dengan kategori & bobot poin (sistem poin pelanggaran kumulatif)
2. Jadwal & catatan sesi konseling (individual/kelompok)
3. Riwayat BK per siswa (timeline kasus, poin akumulasi, tindak lanjut)
4. Alert otomatis jika poin pelanggaran siswa melewati ambang batas (untuk pemanggilan ortu/SP)
5. Surat panggilan orang tua (generate dari template, terhubung ke modul Surat Menyurat)
6. Laporan rekap BK per kelas/periode untuk kepala sekolah
7. Akses terbatas — data BK bersifat sensitif, hanya guru BK, wali kelas terkait, dan kepsek yang bisa lihat detail

**Role akses:** Guru BK (full), Wali Kelas (read untuk siswa di kelasnya), Kepala Sekolah (read + laporan)

---

## 7. Modul: SPMB (Penerimaan Siswa Baru)

**Deskripsi:** Portal pendaftaran online untuk calon siswa + panel admin untuk seleksi. Mengacu ke struktur Insan Kamil ("SPMB Admin" & "SPMB Calon Siswa" sebagai 2 area terpisah).

**Entitas utama:**
- `spmb_registrations`: data calon siswa, jalur pendaftaran (reguler/prestasi/afirmasi), dokumen upload, status (pending/verifikasi/diterima/ditolak)
- `spmb_settings`: kuota per jalur, jadwal pendaftaran, biaya pendaftaran, tahun ajaran aktif

**Fitur utama — Portal Calon Siswa (public-facing):**
1. Registrasi akun calon siswa (email/no HP + OTP)
2. Form pendaftaran online (biodata, pilihan jalur, upload dokumen: KK, akta, ijazah/rapor)
3. Upload bukti pembayaran biaya pendaftaran
4. Cek status pendaftaran & hasil seleksi (real-time)
5. Cetak kartu peserta / bukti pendaftaran

**Fitur utama — Admin SPMB:**
1. Dashboard rekap pendaftar per jalur & kuota terisi
2. Verifikasi dokumen & pembayaran per pendaftar
3. Proses seleksi (input nilai tes/wawancara, atau ranking otomatis by nilai rapor)
4. Pengumuman kelulusan massal (ubah status → generate notifikasi)
5. Konversi otomatis calon siswa diterima → jadi data siswa aktif (link ke modul Data Siswa)
6. Export data pendaftar (Excel)

**Role akses:** Panitia SPMB (full admin), Calon Siswa/Ortu (portal terbatas ke data sendiri), Kepala Sekolah (laporan read only)

---

## 8. Modul: Surat Menyurat (Disposisi)

**Deskripsi:** Pengelolaan surat masuk/keluar dan alur disposisi internal sekolah.

**Entitas utama:**
- `letters_in`: no surat, tanggal terima, pengirim, perihal, file scan, status disposisi
- `letters_out`: no surat, tanggal, tujuan, perihal, file, dibuat_oleh
- `dispositions`: letter_id, dari (kepsek), ke (staf/guru tujuan), instruksi, tenggat, status (belum ditindaklanjuti/proses/selesai)

**Fitur utama:**
1. Input surat masuk (upload scan, auto nomor agenda)
2. Buat surat keluar (dengan nomor surat otomatis sesuai format sekolah, template surat)
3. Disposisi surat — kepala sekolah pilih tujuan disposisi + instruksi + tenggat waktu
4. Notifikasi ke pihak yang didisposisi (dashboard alert)
5. Tracking status tindak lanjut disposisi (belum/proses/selesai + catatan)
6. Arsip & pencarian surat (by nomor, tanggal, perihal, pengirim)
7. Cetak/download riwayat disposisi per surat

**Role akses:** Admin TU/Sekretaris (input & arsip), Kepala Sekolah (disposisi), Staf/Guru (terima & tindak lanjuti disposisi miliknya)

---

## 9. Modul: Stok Inventaris

**Deskripsi:** Manajemen aset & barang sekolah (ATK, alat lab, sarana kelas, dll).

**Entitas utama:**
- `inventory_items`: kode barang, nama, kategori, satuan, stok saat ini, lokasi/ruang, kondisi (baik/rusak)
- `inventory_transactions`: item_id, jenis (masuk/keluar/pinjam/kembali), jumlah, tanggal, peminjam/tujuan, PIC

**Fitur utama:**
1. Master data barang (kategori: ATK, elektronik, furniture, alat lab, dll)
2. Stok masuk (pembelian/hibah) & stok keluar (pemakaian/kerusakan)
3. Peminjaman barang antar unit/ruang (dengan status dikembalikan/belum)
4. Alert stok menipis (ambang batas minimum per item)
5. Kartu stok per barang (riwayat mutasi)
6. Laporan inventaris per ruang/kategori, export Excel
7. Label/QR code barang (opsional, untuk scan cepat saat opname)

**Role akses:** Admin Sarpras (full), Kepala Sekolah (laporan read only), Guru/Staf (ajukan peminjaman)

---

## 10. Modul: LMS (Learning Management System)

**Deskripsi:** Kelas online — materi, tugas, kuis, dan nilai, terhubung dengan e-Rapor.

**Entitas utama:**
- `lms_classes`: mapel_id, kelas_id, guru_id, tahun ajaran
- `lms_materials`: class_id, judul, file/link, tanggal upload
- `lms_assignments`: class_id, judul tugas, deskripsi, tenggat, tipe (upload file/essay/pilihan ganda)
- `lms_submissions`: assignment_id, siswa_id, jawaban/file, waktu submit, nilai, feedback
- `lms_quizzes`: soal (pilihan ganda/essay), auto-grading untuk pilihan ganda

**Fitur utama:**
1. Guru: buat kelas online per mapel, upload materi (file/video/link)
2. Guru: buat tugas & kuis (dengan tenggat waktu, auto-close setelah deadline)
3. Siswa: akses materi, submit tugas, kerjakan kuis online
4. Auto-grading untuk soal pilihan ganda, manual grading untuk essay/upload
5. Rekap nilai tugas & kuis per siswa per mapel → terhubung ke e-Rapor
6. Forum diskusi sederhana per kelas (opsional)
7. Presensi kehadiran online per sesi (opsional, terhubung ke modul Presensi)

**Role akses:** Guru (full untuk kelas yang diampu), Siswa (akses kelas yang diikuti), Wali Kelas/Kepsek (monitoring read only)

---

## 11. Modul: e-Rapor

**Deskripsi:** Pengelolaan nilai akademik siswa dan cetak rapor sesuai kurikulum (Merdeka/K13, sesuaikan kebutuhan sekolah).

**Entitas utama:**
- `academic_scores`: siswa_id, mapel_id, semester, jenis nilai (harian/UTS/UAS/tugas), nilai
- `report_cards`: siswa_id, semester, nilai akhir per mapel, nilai sikap, catatan wali kelas, status (draft/final)

**Fitur utama:**
1. Input nilai per mapel oleh guru (harian, UTS, UAS) — bisa manual atau tarik otomatis dari LMS
2. Perhitungan nilai akhir otomatis (sesuai bobot yang dikonfigurasi per mapel)
3. Input nilai sikap/karakter & catatan wali kelas
4. Preview & generate rapor per siswa (PDF, format sesuai kurikulum)
5. Approval berjenjang (guru mapel → wali kelas → kepala sekolah) sebelum rapor final
6. Cetak rapor massal per kelas
7. Riwayat rapor siswa per semester (akses siswa/ortu via portal, read only)
8. Ranking kelas otomatis (opsional)

**Role akses:** Guru Mapel (input nilai mapelnya), Wali Kelas (compile rapor kelasnya), Kepala Sekolah (approve final), Siswa/Ortu (lihat rapor sendiri)

---

## 12. Modul: Perpustakaan

**Deskripsi:** Katalog buku dan sirkulasi peminjaman.

**Entitas utama:**
- `library_books`: kode buku, judul, penulis, penerbit, kategori, jumlah eksemplar, stok tersedia
- `library_circulation`: book_id, peminjam (siswa/pegawai), tanggal pinjam, tenggat kembali, tanggal kembali aktual, status (dipinjam/kembali/telat), denda

**Fitur utama:**
1. Master katalog buku (tambah/edit/hapus, kategori, cover)
2. Pencarian katalog (by judul/penulis/kategori)
3. Sirkulasi: peminjaman & pengembalian buku (scan kode buku + kode anggota)
4. Perhitungan denda otomatis untuk keterlambatan
5. Riwayat peminjaman per siswa/pegawai
6. Alert buku overdue (dashboard admin)
7. Laporan buku terpopuler & rekap sirkulasi per periode

**Role akses:** Petugas Perpustakaan (full), Siswa/Pegawai (lihat katalog + riwayat pinjam sendiri via portal)

---

## 13. User & Role Management

**Role standar (RBAC):**

| Role | Akses utama |
|---|---|
| Super Admin | Full akses semua modul + konfigurasi sistem |
| Admin TU | Data Siswa, Data Pegawai, Surat Menyurat, Presensi |
| Bendahara | Keuangan |
| Kepala Sekolah | Read-only + approval (disposisi, e-rapor, SPMB) di semua modul |
| Guru | LMS, e-Rapor (mapel diampu), Presensi (kelas diampu) |
| Wali Kelas | Data Siswa (kelasnya), e-Rapor (compile), Presensi, BK (read) |
| Guru BK | Bimbingan Konseling |
| Panitia SPMB | Modul SPMB |
| Admin Sarpras | Stok Inventaris |
| Petugas Perpustakaan | Perpustakaan |
| Siswa/Ortu (portal) | Read-only: rapor, presensi, tagihan, katalog perpus sendiri |

**Fitur modul ini:**
1. CRUD user + assign role
2. Multi-role per user (contoh: guru yang juga wali kelas)
3. Reset password oleh admin
4. Log aktivitas user (audit trail sederhana — siapa ubah data apa, kapan)

---

## 14. Dashboard (halaman utama setelah login)

Konten dashboard dinamis sesuai role:
- **Kepala Sekolah:** ringkasan siswa aktif, kehadiran hari ini, tunggakan SPP, disposisi pending, kasus BK terbaru
- **Admin TU:** shortcut ke input data, jumlah surat masuk belum diproses
- **Guru:** jadwal mengajar hari ini, tugas yang perlu dinilai, kelas yang diampu
- **Bendahara:** ringkasan pemasukan bulan ini, tunggakan terbesar
- **Siswa/Ortu:** ringkasan nilai terbaru, tagihan aktif, presensi bulan ini

---

## 15. Catatan Implementasi untuk Copilot

- **Frontend-only prototype** — tidak ada database, tidak ada backend API/route handler untuk data. Fokus 100% ke UI/UX supaya bisa didemokan ke sekolah.
- Struktur data tiap modul (bagian "Entitas utama" di atas) dipakai sebagai **TypeScript interface/type**, bukan schema database — taruh di `types/` lalu dummy data-nya di `data/` (misal `data/students.ts` export array `Student[]` dengan minimal 15-20 baris data contoh per modul biar tabel/list kelihatan realistis)
- Simulasi CRUD pakai `useState` di tiap halaman/komponen — submit form cukup update state lokal (tidak perlu persist ke mana-mana, tidak perlu loading state network)
- Simulasi upload file cukup pakai `<input type="file">` yang menampilkan nama file / preview gambar (tidak perlu benar-benar upload kemana-mana)
- Chart/grafik (dashboard, laporan keuangan, dll) pakai data dummy statis, boleh pakai library chart ringan (misal Recharts)
- Fokuskan dulu ke: sidebar navigation + tiap modul list/detail/form (CRUD simulasi) — laporan cetak PDF, export Excel, notifikasi WA, dan payment gateway **tidak perlu diimplementasi**, cukup tombol UI-nya ada (boleh non-fungsional/disabled dengan tooltip "coming soon")
- Reuse komponen antar modul (table dengan search+filter+pagination, form modal, badge status, card statistik dashboard) — bikin komponen generic sekali lalu dipakai ulang di semua modul biar konsisten
- Prioritas urutan build yang disarankan: Sidebar + layout + dummy login/role switcher → Dashboard → Data Siswa & Pegawai (base) → Presensi → Keuangan → SPMB → Surat Menyurat → BK → Inventaris → LMS → e-Rapor → Perpustakaan

---

## 16. Yang Perlu Dikonfirmasi ke Sekolah (sebelum atau selama development)

- Format nomor surat resmi sekolah (untuk modul Surat Menyurat)
- Kurikulum yang dipakai untuk e-Rapor (Merdeka/K13) & format cetak rapor resmi
- Skema poin pelanggaran BK (bobot per jenis pelanggaran)
- Jalur SPMB yang tersedia & kuota masing-masing
- Perlu tidaknya integrasi WA gateway untuk notifikasi (SPP, presensi alpha, disposisi)
