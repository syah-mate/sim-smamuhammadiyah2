import { LMSClass, LMSMaterial, LMSAssignment, LMSSubmission } from '@/types';

export const dummyLMSClasses: LMSClass[] = [
  { id: 'lms1', mapelId: 'mapel1', kelasId: 'X-IPA', guruId: 'e4', tahunAjaran: '2024/2025', namaMapel: 'Matematika' },
  { id: 'lms2', mapelId: 'mapel2', kelasId: 'XI-IPA', guruId: 'e10', tahunAjaran: '2024/2025', namaMapel: 'Bahasa Indonesia' },
  { id: 'lms3', mapelId: 'mapel3', kelasId: 'XII-IPA', guruId: 'e9', tahunAjaran: '2024/2025', namaMapel: 'Pendidikan Agama Islam' },
];

export const dummyLMSMaterials: LMSMaterial[] = [
  { id: 'lm1', classId: 'lms1', judul: 'Bab 1: Aljabar', deskripsi: 'Materi tentang operasi aljabar dasar', tanggalUpload: '2026-07-10' },
  { id: 'lm2', classId: 'lms1', judul: 'Bab 2: Persamaan Kuadrat', deskripsi: 'Video pembelajaran persamaan kuadrat', tanggalUpload: '2026-07-17' },
  { id: 'lm3', classId: 'lms2', judul: 'Bab 3: Teks Eksposisi', deskripsi: 'Materi dan contoh teks eksposisi', tanggalUpload: '2026-07-12' },
];

export const dummyLMSAssignments: LMSAssignment[] = [
  { id: 'la1', classId: 'lms1', judul: 'Tugas 1: Latihan Aljabar', deskripsi: 'Kerjakan soal latihan halaman 45-47', tenggat: '2026-07-25', tipe: 'upload' },
  { id: 'la2', classId: 'lms2', judul: 'Tugas: Buat Teks Eksposisi', deskripsi: 'Buat teks eksposisi dengan tema lingkungan', tenggat: '2026-07-28', tipe: 'essay' },
  { id: 'la3', classId: 'lms1', judul: 'Kuis: Aljabar Dasar', deskripsi: 'Kuis pilihan ganda 10 soal', tenggat: '2026-07-22', tipe: 'pg' },
];

export const dummyLMSSubmissions: LMSSubmission[] = [
  { id: 'ls1', assignmentId: 'la1', siswaId: 's1', file: 'tugas1_andi.pdf', waktuSubmit: '2026-07-20', nilai: 85, feedback: 'Bagus, perlu lebih rapi' },
  { id: 'ls2', assignmentId: 'la1', siswaId: 's2', jawaban: 'Jawaban tugas...', waktuSubmit: '2026-07-21', nilai: 90, feedback: 'Sangat baik' },
  { id: 'ls3', assignmentId: 'la3', siswaId: 's1', jawaban: 'A,B,C,D,...', waktuSubmit: '2026-07-22', nilai: 80 },
  { id: 'ls4', assignmentId: 'la3', siswaId: 's2', jawaban: 'A,B,C,D,...', waktuSubmit: '2026-07-22', nilai: 100 },
];
