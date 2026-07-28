import { Disposisi } from '@/types';

// Helper
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ==================== DISPOSISI / SURAT PENUGASAN ====================

export const dummyDisposisi: Disposisi[] = [
  {
    id: 'disp1',
    judul: 'Sosialisasi Kurikulum Merdeka',
    perihal: 'Mohon ditindaklanjuti undangan sosialisasi kurikulum merdeka dari Dinas Pendidikan. Harap hadir dan sampaikan hasil ke seluruh guru.',
    prioritas: 'tinggi',
    tenggatWaktu: '2026-07-14',
    status: 'selesai',
    dibuatOleh: 'e1', // Admin TU
    tanggalDibuat: '2026-07-06',
    riwayat: [
      {
        id: 'rw1a',
        dari: 'e1', // Admin TU
        ke: 'e2',   // Kepala Sekolah
        status: 'disetujui',
        catatan: 'Mohon arahan dan persetujuan Kepala Sekolah',
        tanggalDibuat: '2026-07-06',
        tanggalDiselesaikan: '2026-07-06',
      },
      {
        id: 'rw1b',
        dari: 'e2', // Kepala Sekolah
        ke: 'e4',   // Rudi Hartono (Guru)
        status: 'selesai',
        catatan: 'Setuju, tolong dihadiri dan sampaikan laporan hasil sosialisasi ke seluruh guru',
        tanggalDibuat: '2026-07-06',
        tanggalDiselesaikan: '2026-07-12',
      },
    ],
  },
  {
    id: 'disp2',
    judul: 'Pengumpulan Data Siswa PIP',
    perihal: 'Segera siapkan data siswa penerima PIP sesuai permohonan dari Kementerian Agama. Data harus diverifikasi bendahara sebelum dikirim.',
    prioritas: 'urgent',
    tenggatWaktu: '2026-07-20',
    status: 'proses',
    dibuatOleh: 'e1', // Admin TU
    tanggalDibuat: '2026-07-11',
    riwayat: [
      {
        id: 'rw2a',
        dari: 'e1', // Admin TU
        ke: 'e2',   // Kepala Sekolah
        status: 'disetujui',
        catatan: 'Mohon persetujuan untuk pengumpulan data PIP',
        tanggalDibuat: '2026-07-11',
        tanggalDiselesaikan: '2026-07-11',
      },
      {
        id: 'rw2b',
        dari: 'e2', // Kepala Sekolah
        ke: 'e3',   // Siti (Bendahara)
        status: 'menunggu',
        catatan: 'Disetujui. Mohon diverifikasi dan disiapkan data siswa penerima PIP',
        tanggalDibuat: '2026-07-11',
      },
    ],
  },
  {
    id: 'disp3',
    judul: 'Koordinasi Pembinaan Kenakalan Remaja',
    perihal: 'Tindak lanjuti surat permohonan dari Polsek Genteng terkait pembinaan kenakalan remaja. Koordinasikan dengan Guru BK.',
    prioritas: 'tinggi',
    tenggatWaktu: '2026-07-28',
    status: 'baru',
    dibuatOleh: 'e1', // Admin TU
    tanggalDibuat: '2026-07-19',
    riwayat: [
      {
        id: 'rw3a',
        dari: 'e1', // Admin TU
        ke: 'e2',   // Kepala Sekolah
        status: 'menunggu',
        catatan: 'Mohon arahan Kepala Sekolah untuk tindak lanjut surat dari Polsek',
        tanggalDibuat: '2026-07-19',
      },
    ],
  },
  {
    id: 'disp4',
    judul: 'Program Pemeriksaan Kesehatan Gratis',
    perihal: 'Informasikan program pemeriksaan kesehatan gratis dari RS Muhammadiyah kepada seluruh wali kelas dan siswa.',
    prioritas: 'normal',
    tenggatWaktu: '2026-08-01',
    status: 'proses',
    dibuatOleh: 'e1', // Admin TU
    tanggalDibuat: '2026-07-21',
    riwayat: [
      {
        id: 'rw4a',
        dari: 'e1', // Admin TU
        ke: 'e2',   // Kepala Sekolah
        status: 'disetujui',
        catatan: 'Mohon persetujuan program pemeriksaan kesehatan',
        tanggalDibuat: '2026-07-21',
        tanggalDiselesaikan: '2026-07-22',
      },
      {
        id: 'rw4b',
        dari: 'e2', // Kepala Sekolah
        ke: 'e5',   // Nurul Aini (BK)
        status: 'menunggu',
        catatan: 'Setuju. Tolong koordinasikan dengan wali kelas untuk sosialisasi ke siswa',
        tanggalDibuat: '2026-07-22',
      },
    ],
  },
  {
    id: 'disp5',
    judul: 'Rapat Koordinasi Kepala Sekolah Muhammadiyah',
    perihal: 'Hadiri rapat koordinasi Kepala Sekolah Muhammadiyah se-Surabaya yang diselenggarakan oleh PCM.',
    prioritas: 'normal',
    tenggatWaktu: '2026-08-05',
    status: 'baru',
    dibuatOleh: 'e1', // Admin TU
    tanggalDibuat: '2026-07-25',
    riwayat: [
      {
        id: 'rw5a',
        dari: 'e1', // Admin TU
        ke: 'e2',   // Kepala Sekolah
        status: 'menunggu',
        catatan: 'Mohon konfirmasi kehadiran Kepala Sekolah untuk rapat koordinasi',
        tanggalDibuat: '2026-07-25',
      },
    ],
  },
];
