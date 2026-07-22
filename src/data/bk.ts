import { BKCase, BKViolation, BKSession } from '@/types';

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
