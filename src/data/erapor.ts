import { AcademicScore, ReportCard } from '@/types';

export const dummyAcademicScores: AcademicScore[] = [
  { id: 'asc1', siswaId: 's1', mapelId: 'mapel1', semester: '2024/2025-2', jenisNilai: 'harian', nilai: 85 },
  { id: 'asc2', siswaId: 's1', mapelId: 'mapel1', semester: '2024/2025-2', jenisNilai: 'uts', nilai: 78 },
  { id: 'asc3', siswaId: 's1', mapelId: 'mapel1', semester: '2024/2025-2', jenisNilai: 'uas', nilai: 82 },
  { id: 'asc4', siswaId: 's1', mapelId: 'mapel1', semester: '2024/2025-2', jenisNilai: 'tugas', nilai: 90 },
  { id: 'asc5', siswaId: 's2', mapelId: 'mapel1', semester: '2024/2025-2', jenisNilai: 'harian', nilai: 92 },
  { id: 'asc6', siswaId: 's2', mapelId: 'mapel1', semester: '2024/2025-2', jenisNilai: 'uts', nilai: 88 },
  { id: 'asc7', siswaId: 's2', mapelId: 'mapel1', semester: '2024/2025-2', jenisNilai: 'uas', nilai: 90 },
  { id: 'asc8', siswaId: 's1', mapelId: 'mapel2', semester: '2024/2025-2', jenisNilai: 'harian', nilai: 80 },
  { id: 'asc9', siswaId: 's1', mapelId: 'mapel2', semester: '2024/2025-2', jenisNilai: 'uts', nilai: 75 },
  { id: 'asc10', siswaId: 's1', mapelId: 'mapel2', semester: '2024/2025-2', jenisNilai: 'uas', nilai: 83 },
];

export const dummyReportCards: ReportCard[] = [
  {
    id: 'rc1', siswaId: 's1', semester: '2024/2025-2',
    nilaiMapel: [
      { mapelId: 'mapel1', namaMapel: 'Matematika', nilaiHarian: 85, nilaiUTS: 78, nilaiUAS: 82, nilaiAkhir: 82 },
      { mapelId: 'mapel2', namaMapel: 'Bahasa Indonesia', nilaiHarian: 80, nilaiUTS: 75, nilaiUAS: 83, nilaiAkhir: 80 },
      { mapelId: 'mapel3', namaMapel: 'Pendidikan Agama Islam', nilaiHarian: 90, nilaiUTS: 88, nilaiUAS: 92, nilaiAkhir: 90 },
    ],
    nilaiSikap: 'B', catatanWaliKelas: 'Tingkatkan kedisiplinan dalam mengumpulkan tugas',
    status: 'draft',
  },
  {
    id: 'rc2', siswaId: 's2', semester: '2024/2025-2',
    nilaiMapel: [
      { mapelId: 'mapel1', namaMapel: 'Matematika', nilaiHarian: 92, nilaiUTS: 88, nilaiUAS: 90, nilaiAkhir: 90 },
      { mapelId: 'mapel2', namaMapel: 'Bahasa Indonesia', nilaiHarian: 88, nilaiUTS: 85, nilaiUAS: 87, nilaiAkhir: 87 },
      { mapelId: 'mapel3', namaMapel: 'Pendidikan Agama Islam', nilaiHarian: 95, nilaiUTS: 92, nilaiUAS: 94, nilaiAkhir: 94 },
    ],
    nilaiSikap: 'A', catatanWaliKelas: 'Pertahankan prestasi, sangat baik',
    status: 'final',
  },
];
