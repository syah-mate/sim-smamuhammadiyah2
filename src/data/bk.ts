import { JenisPelanggaran, JenisApresiasi, TindakLanjut, PelanggaranSiswa, ApresiasiSiswa, BKCase, BKViolation, BKSession } from '@/types';

// ==================== DATA MASTER ====================

export const dummyJenisPelanggaran: JenisPelanggaran[] = [
  { id: 'jp1', nama: 'ketidakdisiplinan (terlambat, membolos)', skor: 10, level: 'Ringan', deskripsi: 'Siswa terlambat datang ke sekolah atau membolos tanpa keterangan' },
  { id: 'jp2', nama: 'pelanggaran kerapian (atribut/seragam)', skor: 10, level: 'Ringan', deskripsi: 'Siswa tidak memakai seragam atau atribut sekolah dengan lengkap dan rapi' },
  { id: 'jp3', nama: 'perilaku tidak sopan', skor: 10, level: 'Ringan', deskripsi: 'Siswa bersikap tidak sopan terhadap guru, staf, atau teman' },
  { id: 'jp4', nama: 'perundungan (bullying)', skor: 20, level: 'Sedang', deskripsi: 'Siswa melakukan tindakan perundungan baik verbal, fisik, maupun cyber' },
  { id: 'jp5', nama: 'perusakan fasilitas', skor: 30, level: 'Berat', deskripsi: 'Siswa dengan sengaja merusak fasilitas atau properti sekolah' },
];

export const dummyJenisApresiasi: JenisApresiasi[] = [
  { id: 'ja1', nama: 'Prestasi (Akademik / Non-Akademik)', skor: 30, level: 'Berat', deskripsi: 'Siswa meraih prestasi di bidang akademik maupun non-akademik' },
  { id: 'ja2', nama: 'Gotong Royong (Tolong menolong)', skor: 15, level: 'Sedang', deskripsi: 'Siswa menunjukkan sikap gotong royong dan tolong menolong' },
  { id: 'ja3', nama: 'Keaktifan Organisasi', skor: 10, level: 'Ringan', deskripsi: 'Siswa aktif dalam organisasi dan kegiatan sekolah' },
  { id: 'ja4', nama: 'Kedisiplinan Teladan', skor: 15, level: 'Sedang', deskripsi: 'Siswa menunjukkan kedisiplinan yang patut dicontoh' },
  { id: 'ja5', nama: 'Kejujuran & Integritas', skor: 20, level: 'Sedang', deskripsi: 'Siswa menunjukkan sikap jujur dan berintegritas tinggi' },
];

export const dummyTindakLanjut: TindakLanjut[] = [
  { id: 'tl1', kategori: 'Pelanggaran', nama: 'Teguran Langsung' },
  { id: 'tl2', kategori: 'Pelanggaran', nama: 'Hubungi Orang Tua' },
  { id: 'tl3', kategori: 'Pelanggaran', nama: 'Skors' },
  { id: 'tl4', kategori: 'Apresiasi', nama: 'Pujian Spesifik' },
  { id: 'tl5', kategori: 'Apresiasi', nama: 'Mengomunikasikan ke Orang Tua' },
  { id: 'tl6', kategori: 'Apresiasi', nama: 'Pemberian Reward Fisik' },
];

// ==================== DATA TRANSAKSI ====================

export const dummyPelanggaranSiswa: PelanggaranSiswa[] = [
  { id: 'ps1', tanggal: '2026-04-13', siswaId: 's5', jenisPelanggaranId: 'jp3', tindakLanjutId: 'tl1', tahunAjaran: '2025/2026', deskripsi: 'tidak sopan saat berkomunikasi dengan guru' },
  { id: 'ps2', tanggal: '2026-04-18', siswaId: 's7', jenisPelanggaranId: 'jp2', tindakLanjutId: 'tl2', tahunAjaran: '2025/2026', deskripsi: 'test lagiii' },
  { id: 'ps3', tanggal: '2026-05-22', siswaId: 's3', jenisPelanggaranId: 'jp2', tindakLanjutId: 'tl1', tahunAjaran: '2025/2026', deskripsi: 'tidak memakai dasi' },
];

export const dummyApresiasiSiswa: ApresiasiSiswa[] = [
  { id: 'as1', tanggal: '2026-04-13', siswaId: 's4', jenisApresiasiId: 'ja1', tindakLanjutId: 'tl5', tahunAjaran: '2025/2026', deskripsi: 'prestasi juara hafalan hadist tingkat provinsi' },
  { id: 'as2', tanggal: '2026-04-18', siswaId: 's3', jenisApresiasiId: 'ja1', tindakLanjutId: 'tl4', tahunAjaran: '2025/2026', deskripsi: 'test brooo' },
  { id: 'as3', tanggal: '2026-05-22', siswaId: 's6', jenisApresiasiId: 'ja2', tindakLanjutId: 'tl4', tahunAjaran: '2025/2026', deskripsi: 'membantu teman yang sakit untuk pulang kerumah' },
];

// ==================== DATA LEGACY (retained for backward compatibility) ====================

export const dummyBKCases: BKCase[] = [
  { id: 'bkc1', siswaId: 's5', tanggal: '2026-07-10', kategori: 'pelanggaran', deskripsi: 'Terlambat datang ke sekolah 3x berturut-turut', guruBKId: 'e5' },
  { id: 'bkc2', siswaId: 's3', tanggal: '2026-07-12', kategori: 'akademik', deskripsi: 'Nilai ulangan harian menurun drastis', guruBKId: 'e5' },
  { id: 'bkc3', siswaId: 's8', tanggal: '2026-07-15', kategori: 'sosial', deskripsi: 'Konflik dengan teman sekelas', guruBKId: 'e5' },
  { id: 'bkc4', siswaId: 's1', tanggal: '2026-07-18', kategori: 'pribadi', deskripsi: 'Sering murung di kelas, diduga masalah keluarga', guruBKId: 'e5' },
  { id: 'bkc5', siswaId: 's5', tanggal: '2026-07-20', kategori: 'pelanggaran', deskripsi: 'Tidak memakai seragam lengkap', guruBKId: 'e5' },
];

export const dummyBKViolations: BKViolation[] = [
  { id: 'bkv1', siswaId: 's5', jenisPelanggaran: 'Terlambat', poin: 5, tanggal: '2026-07-08', tindakLanjut: 'Peringatan lisan' },
  { id: 'bkv2', siswaId: 's5', jenisPelanggaran: 'Terlambat', poin: 5, tanggal: '2026-07-09', tindakLanjut: 'Peringatan lisan' },
  { id: 'bkv3', siswaId: 's5', jenisPelanggaran: 'Terlambat', poin: 5, tanggal: '2026-07-10', tindakLanjut: 'Pemanggilan ortu' },
  { id: 'bkv4', siswaId: 's5', jenisPelanggaran: 'Seragam tidak lengkap', poin: 10, tanggal: '2026-07-20', tindakLanjut: 'Surat peringatan' },
  { id: 'bkv5', siswaId: 's7', jenisPelanggaran: 'Tidak mengerjakan PR', poin: 3, tanggal: '2026-07-14', tindakLanjut: 'Peringatan lisan' },
  { id: 'bkv6', siswaId: 's12', jenisPelanggaran: 'Berkelahi', poin: 30, tanggal: '2026-07-05', tindakLanjut: 'Skorsing 3 hari' },
];

export const dummyBKSessions: BKSession[] = [
  { id: 'bks1', siswaId: 's5', tanggal: '2026-07-11', ringkasan: 'Konseling terkait keterlambatan. Siswa mengaku kesulitan bangun pagi karena orang tua bekerja malam.', rekomendasi: 'Diberikan motivasi dan strategi manajemen waktu. Orang tua akan dihubungi.', statusTindakLanjut: 'proses' },
  { id: 'bks2', siswaId: 's3', tanggal: '2026-07-13', ringkasan: 'Konseling akademik. Siswa kesulitan memahami pelajaran Matematika.', rekomendasi: 'Dirujuk ke program remedial dan tutor sebaya.', statusTindakLanjut: 'selesai' },
  { id: 'bks3', siswaId: 's8', tanggal: '2026-07-16', ringkasan: 'Mediasi konflik dengan teman sekelas. Sudah berdamai.', rekomendasi: 'Monitoring lanjutan oleh wali kelas.', statusTindakLanjut: 'proses' },
  { id: 'bks4', siswaId: 's1', tanggal: '2026-07-19', ringkasan: 'Konseling pribadi. Siswa bercerita orang tua sedang dalam proses perceraian.', rekomendasi: 'Konseling rutin mingguan. Koordinasi dengan wali kelas.', statusTindakLanjut: 'belum' },
];
