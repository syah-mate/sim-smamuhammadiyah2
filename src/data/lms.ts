import {
  LMSMateri,
  LMSTugas,
  LMSPengumpulanTugas,
  LMSKelasInfo,
} from '@/types';

// ==================== Daftar Kelas ====================
export const dummyKelasList: LMSKelasInfo[] = [
  { kelas: 'X', jurusan: 'IPA', label: 'X IPA' },
  { kelas: 'X', jurusan: 'IPS', label: 'X IPS' },
  { kelas: 'X', jurusan: 'Bahasa', label: 'X Bahasa' },
  { kelas: 'XI', jurusan: 'IPA', label: 'XI IPA' },
  { kelas: 'XI', jurusan: 'IPS', label: 'XI IPS' },
  { kelas: 'XI', jurusan: 'Bahasa', label: 'XI Bahasa' },
  { kelas: 'XII', jurusan: 'IPA', label: 'XII IPA' },
  { kelas: 'XII', jurusan: 'IPS', label: 'XII IPS' },
  { kelas: 'XII', jurusan: 'Bahasa', label: 'XII Bahasa' },
];

// ==================== Pemetaan Guru → Mapel + Kelas ====================
// empId → { mapelId[], kelas[] }
export interface GuruMapelKelas {
  empId: string;
  empNama: string;
  mapelIds: string[];
  kelasAjar: { kelas: string; jurusan: string }[];
}

export const dummyGuruMapelKelas: GuruMapelKelas[] = [
  // --- UMUM ---
  { empId: 'e10', empNama: 'Rina Anggraini, S.Pd.', mapelIds: ['mp1'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPS' }, { kelas: 'XII', jurusan: 'IPA' }] },
  { empId: 'g2', empNama: 'Dian Permata, S.Pd.', mapelIds: ['mp2'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPS' }, { kelas: 'XII', jurusan: 'IPA' }] },
  { empId: 'e4', empNama: 'Rudi Hartono, S.Pd.', mapelIds: ['mp3'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPS' }, { kelas: 'XII', jurusan: 'IPA' }] },
  { empId: 'g4', empNama: 'Hendra Gunawan, S.Pd.', mapelIds: ['mp4'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPS' }, { kelas: 'XII', jurusan: 'IPA' }] },
  { empId: 'g5', empNama: 'Dewi Sartika, S.Pd.', mapelIds: ['mp5'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPS' }, { kelas: 'XII', jurusan: 'IPA' }] },
  { empId: 'g6', empNama: 'Agus Supriyanto, S.Pd.', mapelIds: ['mp6'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XII', jurusan: 'IPA' }] },
  { empId: 'g7', empNama: 'Sri Wahyuni, S.Sn.', mapelIds: ['mp7'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPS' }] },
  { empId: 'g8', empNama: 'Tuti Hartati, S.Pd.', mapelIds: ['mp8'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPS' }] },
  // --- AGAMA ---
  { empId: 'e9', empNama: 'Drs. Muhammad Ali', mapelIds: ['mp9'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPS' }, { kelas: 'XII', jurusan: 'IPA' }] },
  { empId: 'g10', empNama: 'Ust. Ahmad Syafi\'i, S.Pd.I.', mapelIds: ['mp10'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPS' }] },
  { empId: 'g11', empNama: 'Ust. Muhammad Ridwan, S.Pd.I.', mapelIds: ['mp11'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPS' }] },
  { empId: 'g12', empNama: 'Ust. Fahmi Rahman, S.Pd.I.', mapelIds: ['mp12'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }] },
  // --- MULOK ---
  { empId: 'g13', empNama: 'Dian Prasetya, S.Kom.', mapelIds: ['mp13'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPS' }, { kelas: 'XII', jurusan: 'IPA' }] },
  { empId: 'g14', empNama: 'Slamet Widodo, S.Pd.', mapelIds: ['mp14'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPS' }] },
  // --- PEMINATAN IPA ---
  { empId: 'g15', empNama: 'Ratna Kusuma, S.Pd., M.Pd.', mapelIds: ['mp15'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XII', jurusan: 'IPA' }] },
  { empId: 'g16', empNama: 'Drs. Budi Santoso', mapelIds: ['mp16'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XII', jurusan: 'IPA' }] },
  { empId: 'g17', empNama: 'Nurul Hidayah, S.Pd.', mapelIds: ['mp17'], kelasAjar: [{ kelas: 'X', jurusan: 'IPA' }, { kelas: 'XI', jurusan: 'IPA' }, { kelas: 'XII', jurusan: 'IPA' }] },
  // --- PEMINATAN IPS ---
  { empId: 'g18', empNama: 'Haryanto, S.E., M.M.', mapelIds: ['mp18'], kelasAjar: [{ kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPS' }, { kelas: 'XII', jurusan: 'IPS' }] },
  { empId: 'g19', empNama: 'Sugeng Raharjo, S.Pd.', mapelIds: ['mp19'], kelasAjar: [{ kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPS' }, { kelas: 'XII', jurusan: 'IPS' }] },
  { empId: 'g20', empNama: 'Maya Indriani, S.Pd.', mapelIds: ['mp20'], kelasAjar: [{ kelas: 'X', jurusan: 'IPS' }, { kelas: 'XI', jurusan: 'IPS' }, { kelas: 'XII', jurusan: 'IPS' }] },
];

// ==================== Materi ====================
// Format id: mat{mapel}_{kelas}_{no}
const _mat = (
  id: string, mapelId: string, mapelNama: string,
  kelas: string, jurusan: string,
  judul: string, deskripsi: string, fileName: string | undefined,
  uploadedBy: string, uploadedByName: string, tanggalUpload: string,
): LMSMateri => ({
  id, mapelId, mapelNama, kelas, jurusan, judul, deskripsi, fileName, fileUrl: '#', uploadedBy, uploadedByName, tanggalUpload,
});

export const dummyMateri: LMSMateri[] = [
  // ========== mp1 - Bahasa Indonesia (Rina Anggraini) ==========
  _mat('mat1_1', 'mp1', 'Bahasa Indonesia', 'X', 'IPA', 'Teks Laporan Hasil Observasi - Pert. 1', 'Pengertian, struktur, dan ciri kebahasaan teks laporan hasil observasi.', 'teks-lho-pert1.pdf', 'e10', 'Rina Anggraini, S.Pd.', '2026-07-14'),
  _mat('mat1_2', 'mp1', 'Bahasa Indonesia', 'X', 'IPA', 'Teks Laporan Hasil Observasi - Pert. 2', 'Langkah menyusun teks LHO dan contoh analisis.', 'teks-lho-pert2.pdf', 'e10', 'Rina Anggraini, S.Pd.', '2026-07-21'),
  _mat('mat1_3', 'mp1', 'Bahasa Indonesia', 'XI', 'IPA', 'Teks Prosedur - Materi Lengkap', 'Struktur, kaidah kebahasaan, dan contoh teks prosedur kompleks.', 'teks-prosedur.pdf', 'e10', 'Rina Anggraini, S.Pd.', '2026-07-20'),
  _mat('mat1_4', 'mp1', 'Bahasa Indonesia', 'XI', 'IPS', 'Teks Eksplanasi - Materi Lengkap', 'Pengertian, struktur, dan contoh teks eksplanasi fenomena sosial.', 'teks-eksplanasi.pdf', 'e10', 'Rina Anggraini, S.Pd.', '2026-07-23'),

  // ========== mp2 - Bahasa Inggris (Dian Permata) ==========
  _mat('mat2_1', 'mp2', 'Bahasa Inggris', 'X', 'IPA', 'Descriptive Text - Pert. 1', 'Definition, generic structure, and language features of descriptive text.', 'descriptive-text-1.pdf', 'g2', 'Dian Permata, S.Pd.', '2026-07-15'),
  _mat('mat2_2', 'mp2', 'Bahasa Inggris', 'X', 'IPA', 'Descriptive Text - Pert. 2', 'Writing practice: describing people, places, and things.', 'descriptive-text-2.pdf', 'g2', 'Dian Permata, S.Pd.', '2026-07-22'),
  _mat('mat2_3', 'mp2', 'Bahasa Inggris', 'XI', 'IPA', 'Analytical Exposition Text', 'Structure and sample of analytical exposition — thesis, arguments, reiteration.', 'analytical-exposition.pdf', 'g2', 'Dian Permata, S.Pd.', '2026-07-18'),

  // ========== mp3 - Matematika (Rudi Hartono) ==========
  _mat('mat3_1', 'mp3', 'Matematika', 'X', 'IPA', 'Persamaan Kuadrat - Pert. 1', 'Bentuk umum, akar-akar, dan diskriminan persamaan kuadrat.', 'persamaan-kuadrat-pert1.pdf', 'e4', 'Rudi Hartono, S.Pd.', '2026-07-15'),
  _mat('mat3_2', 'mp3', 'Matematika', 'X', 'IPA', 'Persamaan Kuadrat - Pert. 2', 'Rumus ABC, pemfaktoran, dan latihan soal.', 'persamaan-kuadrat-pert2.pdf', 'e4', 'Rudi Hartono, S.Pd.', '2026-07-22'),
  _mat('mat3_3', 'mp3', 'Matematika', 'XI', 'IPA', 'Limit Fungsi Aljabar', 'Pengertian limit, teorema limit, dan contoh penyelesaian.', 'limit-fungsi-aljabar.pdf', 'e4', 'Rudi Hartono, S.Pd.', '2026-07-18'),
  _mat('mat3_4', 'mp3', 'Matematika', 'XII', 'IPA', 'Integral Tentu - Pert. 1', 'Konsep dasar integral tentu dan teorema fundamental kalkulus.', 'integral-tentu.pdf', 'e4', 'Rudi Hartono, S.Pd.', '2026-07-25'),

  // ========== mp4 - Sejarah Indonesia (Hendra Gunawan) ==========
  _mat('mat4_1', 'mp4', 'Sejarah Indonesia', 'X', 'IPA', 'Kerajaan Hindu-Buddha di Nusantara', 'Masa kejayaan kerajaan Sriwijaya, Majapahit, dan pengaruhnya.', 'kerajaan-hindu-buddha.pptx', 'g4', 'Hendra Gunawan, S.Pd.', '2026-07-12'),
  _mat('mat4_2', 'mp4', 'Sejarah Indonesia', 'XI', 'IPA', 'Pergerakan Nasional Indonesia', 'Latar belakang, tokoh, dan organisasi pergerakan nasional.', 'pergerakan-nasional.pdf', 'g4', 'Hendra Gunawan, S.Pd.', '2026-07-19'),
  _mat('mat4_3', 'mp4', 'Sejarah Indonesia', 'XI', 'IPS', 'Pendudukan Jepang di Indonesia', 'Dampak pendudukan Jepang terhadap sosial, ekonomi, dan politik.', 'pendudukan-jepang.pdf', 'g4', 'Hendra Gunawan, S.Pd.', '2026-07-21'),

  // ========== mp5 - PPKn (Dewi Sartika) ==========
  _mat('mat5_1', 'mp5', 'PPKn', 'X', 'IPA', 'Nilai-nilai Pancasila dalam Kehidupan', 'Penerapan sila-sila Pancasila di lingkungan sekolah dan masyarakat.', 'nilai-pancasila.pptx', 'g5', 'Dewi Sartika, S.Pd.', '2026-07-13'),
  _mat('mat5_2', 'mp5', 'PPKn', 'X', 'IPS', 'Hak dan Kewajiban Warga Negara', 'UUD 1945 pasal tentang hak dan kewajiban warga negara.', 'hak-kewajiban-warga.pdf', 'g5', 'Dewi Sartika, S.Pd.', '2026-07-20'),
  _mat('mat5_3', 'mp5', 'PPKn', 'XI', 'IPA', 'Demokrasi di Indonesia', 'Sejarah, prinsip, dan pelaksanaan demokrasi Pancasila.', 'demokrasi-indonesia.pdf', 'g5', 'Dewi Sartika, S.Pd.', '2026-07-18'),

  // ========== mp6 - PJOK (Agus Supriyanto) ==========
  _mat('mat6_1', 'mp6', 'PJOK', 'X', 'IPA', 'Teknik Dasar Bola Voli', 'Passing atas, passing bawah, servis, dan smash.', 'teknik-bola-voli.pdf', 'g6', 'Agus Supriyanto, S.Pd.', '2026-07-11'),
  _mat('mat6_2', 'mp6', 'PJOK', 'XI', 'IPA', 'Kebugaran Jasmani', 'Komponen kebugaran: kekuatan, daya tahan, kelincahan, dan fleksibilitas.', 'kebugaran-jasmani.pdf', 'g6', 'Agus Supriyanto, S.Pd.', '2026-07-17'),
  _mat('mat6_3', 'mp6', 'PJOK', 'X', 'IPA', 'Atletik: Lari Jarak Pendek', 'Teknik start, fase berlari, dan finish lari 100 meter.', 'atletik-lari.pdf', 'g6', 'Agus Supriyanto, S.Pd.', '2026-07-24'),

  // ========== mp7 - Seni Budaya (Sri Wahyuni) ==========
  _mat('mat7_1', 'mp7', 'Seni Budaya', 'X', 'IPA', 'Apresiasi Seni Rupa Nusantara', 'Jenis, aliran, dan tokoh seni rupa Indonesia.', 'apresiasi-seni-rupa.pptx', 'g7', 'Sri Wahyuni, S.Sn.', '2026-07-14'),
  _mat('mat7_2', 'mp7', 'Seni Budaya', 'X', 'IPS', 'Teknik Menggambar Perspektif', 'Dasar-dasar gambar perspektif satu dan dua titik hilang.', 'teknik-perspektif.pdf', 'g7', 'Sri Wahyuni, S.Sn.', '2026-07-21'),

  // ========== mp8 - Prakarya & KWU (Tuti Hartati) ==========
  _mat('mat8_1', 'mp8', 'Prakarya & Kewirausahaan', 'X', 'IPA', 'Kerajinan Bahan Limbah Lunak', 'Jenis limbah lunak dan teknik pengolahan menjadi kerajinan.', 'kerajinan-limbah-lunak.pdf', 'g8', 'Tuti Hartati, S.Pd.', '2026-07-16'),
  _mat('mat8_2', 'mp8', 'Prakarya & Kewirausahaan', 'XI', 'IPA', 'Business Plan Sederhana', 'Cara menyusun rencana bisnis: analisis SWOT, strategi pemasaran.', 'business-plan.pptx', 'g8', 'Tuti Hartati, S.Pd.', '2026-07-22'),

  // ========== mp9 - PAI (Drs. Muhammad Ali) ==========
  _mat('mat9_1', 'mp9', 'Pendidikan Agama Islam', 'X', 'IPA', 'Iman Kepada Allah SWT', 'Pengertian iman, sifat-sifat Allah, dan implementasi dalam kehidupan.', 'iman-kepada-allah.pptx', 'e9', 'Drs. Muhammad Ali', '2026-07-10'),
  _mat('mat9_2', 'mp9', 'Pendidikan Agama Islam', 'XI', 'IPA', 'Toleransi dalam Islam', 'Ayat-ayat Al-Quran tentang toleransi dan kerukunan umat beragama.', 'toleransi-dalam-islam.pdf', 'e9', 'Drs. Muhammad Ali', '2026-07-12'),
  _mat('mat9_3', 'mp9', 'Pendidikan Agama Islam', 'XII', 'IPA', 'Pernikahan dalam Islam', 'Hukum, rukun, syarat, dan hikmah pernikahan menurut Islam.', 'pernikahan-islam.pdf', 'e9', 'Drs. Muhammad Ali', '2026-07-19'),

  // ========== mp10 - Sirah Nabawiyah (Ust. Ahmad Syafi'i) ==========
  _mat('mat10_1', 'mp10', 'Sirah Nabawiyah', 'X', 'IPA', 'Periode Mekkah: Dakwah Sembunyi-Sembunyi', 'Awal dakwah Rasulullah SAW dan orang-orang pertama yang masuk Islam.', 'periode-mekkah-1.pdf', 'g10', 'Ust. Ahmad Syafi\'i, S.Pd.I.', '2026-07-11'),
  _mat('mat10_2', 'mp10', 'Sirah Nabawiyah', 'XI', 'IPA', 'Perang Badar: Strategi dan Hikmah', 'Latar belakang, jalannya perang, dan pelajaran dari Perang Badar.', 'perang-badar.pdf', 'g10', 'Ust. Ahmad Syafi\'i, S.Pd.I.', '2026-07-18'),

  // ========== mp11 - Bina Pribadi Islam (Ust. Muhammad Ridwan) ==========
  _mat('mat11_1', 'mp11', 'Bina Pribadi Islam', 'X', 'IPA', 'Adab Berbicara dalam Islam', 'Etika komunikasi: qaulan sadida, qaulan ma\'rufa, dan qaulan layyina.', 'adab-berbicara.pdf', 'g11', 'Ust. Muhammad Ridwan, S.Pd.I.', '2026-07-12'),
  _mat('mat11_2', 'mp11', 'Bina Pribadi Islam', 'XI', 'IPA', 'Akhlak Kepada Orang Tua', 'Birrul walidain: dalil, keutamaan, dan implementasi.', 'akhlak-ortu.pdf', 'g11', 'Ust. Muhammad Ridwan, S.Pd.I.', '2026-07-19'),

  // ========== mp12 - Bahasa Arab (Ust. Fahmi Rahman) ==========
  _mat('mat12_1', 'mp12', 'Bahasa Arab', 'X', 'IPA', 'Isim Isyarah (Kata Tunjuk)', 'هذا, هذه, ذلك, تلك — penggunaan dan contoh kalimat.', 'isim-isyarah.pdf', 'g12', 'Ust. Fahmi Rahman, S.Pd.I.', '2026-07-13'),
  _mat('mat12_2', 'mp12', 'Bahasa Arab', 'XI', 'IPA', 'Fi\'il Madhi dan Fi\'il Mudhari\'', 'Konjugasi kata kerja lampau dan sekarang beserta dhomir.', 'fiil-madhi-mudhari.pdf', 'g12', 'Ust. Fahmi Rahman, S.Pd.I.', '2026-07-20'),

  // ========== mp13 - TIK (Dian Prasetya) ==========
  _mat('mat13_1', 'mp13', 'Teknologi Informasi', 'X', 'IPA', 'Pengenalan Microsoft Excel', 'Interface, cell reference, formula dasar (SUM, AVERAGE, IF).', 'pengenalan-excel.pdf', 'g13', 'Dian Prasetya, S.Kom.', '2026-07-15'),
  _mat('mat13_2', 'mp13', 'Teknologi Informasi', 'XI', 'IPA', 'Algoritma dan Flowchart', 'Konsep algoritma, simbol flowchart, dan studi kasus sederhana.', 'algoritma-flowchart.pptx', 'g13', 'Dian Prasetya, S.Kom.', '2026-07-22'),
  _mat('mat13_3', 'mp13', 'Teknologi Informasi', 'X', 'IPS', 'Pengenalan HTML Dasar', 'Struktur HTML, heading, paragraf, link, dan gambar.', 'html-dasar.pdf', 'g13', 'Dian Prasetya, S.Kom.', '2026-07-25'),

  // ========== mp14 - Bahasa Jawa (Slamet Widodo) ==========
  _mat('mat14_1', 'mp14', 'Bahasa Jawa', 'X', 'IPA', 'Unggah-Ungguh Basa', 'Tingkatan bahasa Jawa: ngoko, krama madya, krama inggil.', 'unggah-ungguh.pdf', 'g14', 'Slamet Widodo, S.Pd.', '2026-07-14'),
  _mat('mat14_2', 'mp14', 'Bahasa Jawa', 'X', 'IPS', 'Tembang Macapat: Sinom & Kinanthi', 'Guru gatra, guru wilangan, guru lagu, dan contoh tembang.', 'tembang-macapat.pdf', 'g14', 'Slamet Widodo, S.Pd.', '2026-07-21'),

  // ========== mp15 - Fisika (Ratna Kusuma) ==========
  _mat('mat15_1', 'mp15', 'Fisika', 'X', 'IPA', 'Besaran dan Satuan', 'Besaran pokok, besaran turunan, dan konversi satuan SI.', 'besaran-satuan.pdf', 'g15', 'Ratna Kusuma, S.Pd., M.Pd.', '2026-07-15'),
  _mat('mat15_2', 'mp15', 'Fisika', 'XI', 'IPA', 'Hukum Newton & Penerapannya', 'Hukum Newton I, II, III dan aplikasi pada bidang miring & katrol.', 'hukum-newton.pdf', 'g15', 'Ratna Kusuma, S.Pd., M.Pd.', '2026-07-18'),
  _mat('mat15_3', 'mp15', 'Fisika', 'XII', 'IPA', 'Listrik Statis', 'Hukum Coulomb, medan listrik, dan potensial listrik.', 'listrik-statis.pdf', 'g15', 'Ratna Kusuma, S.Pd., M.Pd.', '2026-07-22'),

  // ========== mp16 - Kimia (Drs. Budi Santoso) ==========
  _mat('mat16_1', 'mp16', 'Kimia', 'X', 'IPA', 'Struktur Atom & Sistem Periodik', 'Partikel penyusun atom, konfigurasi elektron, dan golongan/periode.', 'struktur-atom.pdf', 'g16', 'Drs. Budi Santoso', '2026-07-16'),
  _mat('mat16_2', 'mp16', 'Kimia', 'XI', 'IPA', 'Laju Reaksi', 'Faktor-faktor yang mempengaruhi laju reaksi dan persamaan laju.', 'laju-reaksi.pdf', 'g16', 'Drs. Budi Santoso', '2026-07-19'),
  _mat('mat16_3', 'mp16', 'Kimia', 'XII', 'IPA', 'Senyawa Karbon', 'Gugus fungsi alkana, alkena, alkuna, alkohol, eter, aldehid, keton.', 'senyawa-karbon.pdf', 'g16', 'Drs. Budi Santoso', '2026-07-23'),

  // ========== mp17 - Biologi (Nurul Hidayah) ==========
  _mat('mat17_1', 'mp17', 'Biologi', 'X', 'IPA', 'Keanekaragaman Hayati', 'Tingkat keanekaragaman: gen, jenis, ekosistem. Flora & fauna endemik.', 'keanekaragaman-hayati.pptx', 'g17', 'Nurul Hidayah, S.Pd.', '2026-07-14'),
  _mat('mat17_2', 'mp17', 'Biologi', 'XI', 'IPA', 'Sistem Pencernaan Manusia', 'Organ pencernaan, enzim, dan proses absorbsi nutrisi.', 'sistem-pencernaan.pdf', 'g17', 'Nurul Hidayah, S.Pd.', '2026-07-20'),
  _mat('mat17_3', 'mp17', 'Biologi', 'XII', 'IPA', 'Genetika: Hukum Mendel', 'Persilangan monohibrid, dihibrid, dan penyimpangan semu.', 'genetika-mendel.pdf', 'g17', 'Nurul Hidayah, S.Pd.', '2026-07-24'),

  // ========== mp18 - Ekonomi (Haryanto) ==========
  _mat('mat18_1', 'mp18', 'Ekonomi', 'X', 'IPS', 'Konsep Dasar Ilmu Ekonomi', 'Kelangkaan, pilihan, biaya peluang, dan sistem ekonomi.', 'konsep-ekonomi.pdf', 'g18', 'Haryanto, S.E., M.M.', '2026-07-15'),
  _mat('mat18_2', 'mp18', 'Ekonomi', 'XI', 'IPS', 'Pendapatan Nasional', 'GDP, GNP, NNP, dan metode perhitungan pendapatan nasional.', 'pendapatan-nasional.pdf', 'g18', 'Haryanto, S.E., M.M.', '2026-07-19'),
  _mat('mat18_3', 'mp18', 'Ekonomi', 'XII', 'IPS', 'Akuntansi Perusahaan Jasa', 'Siklus akuntansi: jurnal umum, buku besar, neraca saldo.', 'akuntansi-jasa.pdf', 'g18', 'Haryanto, S.E., M.M.', '2026-07-23'),

  // ========== mp19 - Geografi (Sugeng Raharjo) ==========
  _mat('mat19_1', 'mp19', 'Geografi', 'X', 'IPS', 'Pengetahuan Dasar Geografi', 'Objek material & formal geografi, prinsip dan pendekatan geografi.', 'dasar-geografi.pdf', 'g19', 'Sugeng Raharjo, S.Pd.', '2026-07-13'),
  _mat('mat19_2', 'mp19', 'Geografi', 'XI', 'IPS', 'Mitigasi Bencana Alam', 'Jenis bencana, siklus manajemen bencana, dan kearifan lokal.', 'mitigasi-bencana.pptx', 'g19', 'Sugeng Raharjo, S.Pd.', '2026-07-20'),
  _mat('mat19_3', 'mp19', 'Geografi', 'XII', 'IPS', 'Pola Keruangan Desa & Kota', 'Struktur ruang desa-kota, interaksi, dan teori lokasi.', 'pola-keruangan.pdf', 'g19', 'Sugeng Raharjo, S.Pd.', '2026-07-24'),

  // ========== mp20 - Sosiologi (Maya Indriani) ==========
  _mat('mat20_1', 'mp20', 'Sosiologi', 'X', 'IPS', 'Interaksi Sosial & Nilai-Nilai Sosial', 'Syarat interaksi, faktor pendorong, nilai dan norma dalam masyarakat.', 'interaksi-sosial.pdf', 'g20', 'Maya Indriani, S.Pd.', '2026-07-12'),
  _mat('mat20_2', 'mp20', 'Sosiologi', 'XI', 'IPS', 'Stratifikasi Sosial', 'Dasar stratifikasi, kelas sosial, dan mobilitas sosial.', 'stratifikasi-sosial.pdf', 'g20', 'Maya Indriani, S.Pd.', '2026-07-18'),
  _mat('mat20_3', 'mp20', 'Sosiologi', 'XII', 'IPS', 'Perubahan Sosial & Globalisasi', 'Faktor perubahan, dampak globalisasi, dan ketimpangan sosial.', 'perubahan-sosial.pdf', 'g20', 'Maya Indriani, S.Pd.', '2026-07-22'),
];

// ==================== Tugas ====================
const _tgs = (
  id: string, mapelId: string, mapelNama: string,
  kelas: string, jurusan: string,
  judul: string, deskripsi: string, fileName: string | undefined,
  deadline: string, uploadedBy: string, uploadedByName: string, tanggalUpload: string,
): LMSTugas => ({
  id, mapelId, mapelNama, kelas, jurusan, judul, deskripsi, fileName, fileUrl: '#', deadline, uploadedBy, uploadedByName, tanggalUpload,
});

export const dummyTugas: LMSTugas[] = [
  // ========== mp1 - Bahasa Indonesia ==========
  _tgs('tgs1_1', 'mp1', 'Bahasa Indonesia', 'X', 'IPA', 'Tugas Menulis Teks LHO', 'Observasi lingkungan sekolah dan tulis teks laporan hasil observasi minimal 500 kata.', 'tugas-lho.pdf', '2026-08-05', 'e10', 'Rina Anggraini, S.Pd.', '2026-07-22'),
  _tgs('tgs1_2', 'mp1', 'Bahasa Indonesia', 'XI', 'IPA', 'Tugas Menulis Teks Prosedur', 'Tulis teks prosedur kompleks dengan tema bebas. Perhatikan struktur dan kaidah kebahasaan.', undefined, '2026-08-12', 'e10', 'Rina Anggraini, S.Pd.', '2026-07-25'),

  // ========== mp2 - Bahasa Inggris ==========
  _tgs('tgs2_1', 'mp2', 'Bahasa Inggris', 'X', 'IPA', 'Writing: My Favorite Person', 'Write a descriptive text (min 150 words) about your favorite person.', 'tugas-descriptive.pdf', '2026-08-07', 'g2', 'Dian Permata, S.Pd.', '2026-07-24'),
  _tgs('tgs2_2', 'mp2', 'Bahasa Inggris', 'XI', 'IPA', 'Analytical Exposition Essay', 'Write an analytical exposition on "The Importance of Reading" (min 200 words).', undefined, '2026-08-10', 'g2', 'Dian Permata, S.Pd.', '2026-07-26'),

  // ========== mp3 - Matematika ==========
  _tgs('tgs3_1', 'mp3', 'Matematika', 'X', 'IPA', 'Latihan Soal Persamaan Kuadrat', 'Kerjakan 10 soal persamaan kuadrat dengan metode pemfaktoran dan rumus ABC.', 'soal-persamaan-kuadrat.pdf', '2026-08-05', 'e4', 'Rudi Hartono, S.Pd.', '2026-07-22'),
  _tgs('tgs3_2', 'mp3', 'Matematika', 'XI', 'IPA', 'Tugas Limit Fungsi Aljabar', 'Selesaikan 5 soal limit fungsi aljabar. Gunakan substitusi, pemfaktoran, dan akar sekawan.', 'tugas-limit-aljabar.pdf', '2026-08-10', 'e4', 'Rudi Hartono, S.Pd.', '2026-07-18'),

  // ========== mp4 - Sejarah Indonesia ==========
  _tgs('tgs4_1', 'mp4', 'Sejarah Indonesia', 'X', 'IPA', 'Makalah Kerajaan Nusantara', 'Buat makalah singkat tentang salah satu kerajaan Hindu-Buddha di Nusantara.', undefined, '2026-08-06', 'g4', 'Hendra Gunawan, S.Pd.', '2026-07-23'),
  _tgs('tgs4_2', 'mp4', 'Sejarah Indonesia', 'XI', 'IPA', 'Resume Pergerakan Nasional', 'Buat resume tokoh-tokoh pergerakan nasional dan peran mereka.', undefined, '2026-08-11', 'g4', 'Hendra Gunawan, S.Pd.', '2026-07-25'),

  // ========== mp5 - PPKn ==========
  _tgs('tgs5_1', 'mp5', 'PPKn', 'X', 'IPA', 'Analisis Kasus Pelanggaran HAM', 'Cari 1 kasus pelanggaran HAM di Indonesia dan analisis dari sudut pandang Pancasila.', undefined, '2026-08-08', 'g5', 'Dewi Sartika, S.Pd.', '2026-07-24'),
  _tgs('tgs5_2', 'mp5', 'PPKn', 'XI', 'IPA', 'Esai Demokrasi di Era Digital', 'Tulis esai 500 kata tentang tantangan demokrasi di era media sosial.', undefined, '2026-08-14', 'g5', 'Dewi Sartika, S.Pd.', '2026-07-26'),

  // ========== mp6 - PJOK ==========
  _tgs('tgs6_1', 'mp6', 'PJOK', 'X', 'IPA', 'Video Praktik Senam Lantai', 'Rekam video praktik roll depan dan roll belakang. Upload ke Google Drive.', undefined, '2026-08-10', 'g6', 'Agus Supriyanto, S.Pd.', '2026-07-20'),
  _tgs('tgs6_2', 'mp6', 'PJOK', 'XI', 'IPA', 'Laporan Kebugaran Mingguan', 'Catat aktivitas fisik harian selama 1 minggu dan hitung rata-rata denyut nadi.', 'format-laporan-kebugaran.pdf', '2026-08-15', 'g6', 'Agus Supriyanto, S.Pd.', '2026-07-25'),

  // ========== mp7 - Seni Budaya ==========
  _tgs('tgs7_1', 'mp7', 'Seni Budaya', 'X', 'IPA', 'Sketsa Perspektif Satu Titik Hilang', 'Buat gambar sketsa ruang kelas menggunakan teknik perspektif satu titik hilang.', undefined, '2026-08-07', 'g7', 'Sri Wahyuni, S.Sn.', '2026-07-21'),

  // ========== mp8 - Prakarya & KWU ==========
  _tgs('tgs8_1', 'mp8', 'Prakarya & Kewirausahaan', 'X', 'IPA', 'Kerajinan dari Limbah Plastik', 'Buat 1 produk kerajinan dari limbah plastik. Dokumentasikan prosesnya.', undefined, '2026-08-12', 'g8', 'Tuti Hartati, S.Pd.', '2026-07-22'),

  // ========== mp9 - PAI ==========
  _tgs('tgs9_1', 'mp9', 'Pendidikan Agama Islam', 'X', 'IPA', 'Makalah Iman Kepada Allah', 'Buat makalah singkat (min 3 halaman) tentang implementasi iman dalam kehidupan sehari-hari.', undefined, '2026-08-03', 'e9', 'Drs. Muhammad Ali', '2026-07-15'),
  _tgs('tgs9_2', 'mp9', 'Pendidikan Agama Islam', 'XI', 'IPA', 'Presentasi Kelompok: Toleransi', 'Presentasi kelompok tentang ayat-ayat toleransi. Setiap kelompok 4-5 orang.', undefined, '2026-08-07', 'e9', 'Drs. Muhammad Ali', '2026-07-20'),

  // ========== mp10 - Sirah Nabawiyah ==========
  _tgs('tgs10_1', 'mp10', 'Sirah Nabawiyah', 'X', 'IPA', 'Mind Map Dakwah Periode Mekkah', 'Buat mind map timeline dakwah Rasulullah SAW periode Mekkah.', undefined, '2026-08-09', 'g10', 'Ust. Ahmad Syafi\'i, S.Pd.I.', '2026-07-25'),

  // ========== mp11 - BPI ==========
  _tgs('tgs11_1', 'mp11', 'Bina Pribadi Islam', 'X', 'IPA', 'Jurnal Harian Adab Islami', 'Tulis jurnal harian selama 5 hari tentang penerapan adab Islami di sekolah.', undefined, '2026-08-06', 'g11', 'Ust. Muhammad Ridwan, S.Pd.I.', '2026-07-23'),

  // ========== mp12 - Bahasa Arab ==========
  _tgs('tgs12_1', 'mp12', 'Bahasa Arab', 'X', 'IPA', 'Latihan Isim Isyarah', 'Kerjakan 15 soal melengkapi kalimat dengan isim isyarah yang tepat.', 'latihan-isim-isyarah.pdf', '2026-08-08', 'g12', 'Ust. Fahmi Rahman, S.Pd.I.', '2026-07-24'),

  // ========== mp13 - TIK ==========
  _tgs('tgs13_1', 'mp13', 'Teknologi Informasi', 'X', 'IPA', 'Praktik Excel: Data Nilai Siswa', 'Buat spreadsheet nilai dengan formula SUM, AVERAGE, IF, dan grafik.', 'praktik-excel.pdf', '2026-08-11', 'g13', 'Dian Prasetya, S.Kom.', '2026-07-25'),
  _tgs('tgs13_2', 'mp13', 'Teknologi Informasi', 'XI', 'IPA', 'Flowchart Aplikasi Sederhana', 'Buat flowchart untuk aplikasi peminjaman buku perpustakaan.', undefined, '2026-08-14', 'g13', 'Dian Prasetya, S.Kom.', '2026-07-27'),

  // ========== mp14 - Bahasa Jawa ==========
  _tgs('tgs14_1', 'mp14', 'Bahasa Jawa', 'X', 'IPA', 'Nulis Pacelathon (Percakapan)', 'Tulis percakapan bahasa Jawa krama inggil antara siswa dan guru (min 10 baris).', undefined, '2026-08-07', 'g14', 'Slamet Widodo, S.Pd.', '2026-07-24'),

  // ========== mp15 - Fisika ==========
  _tgs('tgs15_1', 'mp15', 'Fisika', 'XI', 'IPA', 'Soal Hukum Newton', 'Kerjakan 8 soal penerapan Hukum Newton pada benda di bidang miring dan katrol.', 'soal-hukum-newton.pdf', '2026-08-09', 'g15', 'Ratna Kusuma, S.Pd., M.Pd.', '2026-07-24'),
  _tgs('tgs15_2', 'mp15', 'Fisika', 'XII', 'IPA', 'Laporan Praktikum Listrik Statis', 'Lakukan percobaan sederhana listrik statis di rumah dan tulis laporannya.', 'format-laporan-praktikum.pdf', '2026-08-13', 'g15', 'Ratna Kusuma, S.Pd., M.Pd.', '2026-07-26'),

  // ========== mp16 - Kimia ==========
  _tgs('tgs16_1', 'mp16', 'Kimia', 'XI', 'IPA', 'Laporan Praktikum Laju Reaksi', 'Praktikum pengaruh suhu terhadap laju reaksi. Tulis laporan lengkap.', 'format-laporan-kimia.pdf', '2026-08-10', 'g16', 'Drs. Budi Santoso', '2026-07-25'),
  _tgs('tgs16_2', 'mp16', 'Kimia', 'XII', 'IPA', 'Soal Senyawa Karbon', 'Kerjakan 10 soal identifikasi gugus fungsi dan penamaan senyawa karbon.', 'soal-senyawa-karbon.pdf', '2026-08-14', 'g16', 'Drs. Budi Santoso', '2026-07-27'),

  // ========== mp17 - Biologi ==========
  _tgs('tgs17_1', 'mp17', 'Biologi', 'XI', 'IPA', 'Poster Sistem Pencernaan', 'Buat poster edukatif tentang sistem pencernaan manusia (digital/manual).', undefined, '2026-08-08', 'g17', 'Nurul Hidayah, S.Pd.', '2026-07-24'),
  _tgs('tgs17_2', 'mp17', 'Biologi', 'XII', 'IPA', 'Soal Persilangan Genetika', 'Kerjakan 5 soal persilangan monohibrid dan dihibrid lengkap dengan diagram.', 'soal-genetika.pdf', '2026-08-12', 'g17', 'Nurul Hidayah, S.Pd.', '2026-07-26'),

  // ========== mp18 - Ekonomi ==========
  _tgs('tgs18_1', 'mp18', 'Ekonomi', 'XI', 'IPS', 'Analisis Pendapatan Nasional', 'Cari data PDB Indonesia 5 tahun terakhir dan analisis trennya.', undefined, '2026-08-11', 'g18', 'Haryanto, S.E., M.M.', '2026-07-24'),

  // ========== mp19 - Geografi ==========
  _tgs('tgs19_1', 'mp19', 'Geografi', 'XI', 'IPS', 'Peta Rawan Bencana Daerah', 'Buat peta sederhana daerah rawan bencana di kota/kabupaten tempat tinggalmu.', undefined, '2026-08-10', 'g19', 'Sugeng Raharjo, S.Pd.', '2026-07-25'),

  // ========== mp20 - Sosiologi ==========
  _tgs('tgs20_1', 'mp20', 'Sosiologi', 'XI', 'IPS', 'Wawancara Stratifikasi Sosial', 'Wawancarai 2 orang dari latar belakang berbeda. Analisis mobilitas sosialnya.', undefined, '2026-08-09', 'g20', 'Maya Indriani, S.Pd.', '2026-07-24'),
];

// ==================== Pengumpulan Tugas ====================
// Helper: buat pengumpulan untuk siswa tertentu
const _kump = (
  id: string, tugasId: string, siswaId: string, siswaNama: string, siswaNIS: string,
  siswaKelas: string, fileName: string | undefined, catatanSiswa: string | undefined,
  status: LMSPengumpulanTugas['status'], nilai?: number, catatanGuru?: string,
  tanggalKumpul?: string, tanggalDinilai?: string,
): LMSPengumpulanTugas => ({
  id, tugasId, siswaId, siswaNama, siswaNIS, siswaKelas, fileName, fileUrl: '#', catatanSiswa, status, nilai, catatanGuru, tanggalKumpul, tanggalDinilai,
});

export const dummyPengumpulan: LMSPengumpulanTugas[] = [
  // --- tgs1_1 (B.Indo - X IPA: Teks LHO) ---
  _kump('kp001', 'tgs1_1', 's1', 'Andi Pratama', '2425-001', 'X IPA', 'lho-andi.pdf', 'Pak, ini hasil observasi kantin sekolah.', 'dinilai', 82, 'Cukup baik, tambahkan data kuantitatif.', '2026-07-28', '2026-07-29'),
  _kump('kp002', 'tgs1_1', 's2', 'Bunga Citra Lestari', '2425-002', 'X IPA', 'lho-bunga.pdf', 'Sudah selesai Bu.', 'dinilai', 90, 'Sangat baik, struktur lengkap.', '2026-07-27', '2026-07-29'),
  _kump('kp003', 'tgs1_1', 's14', 'Nadia Safitri', '2425-015', 'X IPA', undefined, undefined, 'belum_mengumpulkan'),

  // --- tgs1_2 (B.Indo - XI IPA: Teks Prosedur) ---
  _kump('kp004', 'tgs1_2', 's4', 'Dewi Lestari', '2425-004', 'XI IPA', 'prosedur-dewi.pdf', 'Semoga sesuai Bu.', 'sudah_mengumpulkan', undefined, undefined, '2026-07-27'),
  _kump('kp005', 'tgs1_2', 's12', 'Linda Kusuma', '2425-012', 'XI IPA', undefined, undefined, 'belum_mengumpulkan'),

  // --- tgs2_1 (B.Inggris - X IPA: Descriptive Text) ---
  _kump('kp006', 'tgs2_1', 's1', 'Andi Pratama', '2425-001', 'X IPA', 'descriptive-andi.pdf', 'I wrote about my mother.', 'dinilai', 85, 'Good vocabulary, minor grammar errors.', '2026-07-29', '2026-07-29'),
  _kump('kp007', 'tgs2_1', 's2', 'Bunga Citra Lestari', '2425-002', 'X IPA', 'descriptive-bunga.pdf', 'Here is my work, Miss.', 'dinilai', 94, 'Excellent! Very descriptive.', '2026-07-28', '2026-07-29'),
  _kump('kp008', 'tgs2_1', 's14', 'Nadia Safitri', '2425-015', 'X IPA', 'descriptive-nadia.pdf', undefined, 'sudah_mengumpulkan', undefined, undefined, '2026-07-29'),

  // --- tgs3_1 (Matematika - X IPA: Persamaan Kuadrat) ---
  _kump('kp009', 'tgs3_1', 's1', 'Andi Pratama', '2425-001', 'X IPA', 'jawaban-andi-mtk.pdf', 'Pak, saya sudah kerjakan semua.', 'dinilai', 85, 'Bagus, perhatikan tanda negatif di nomor 7.', '2026-07-28', '2026-07-29'),
  _kump('kp010', 'tgs3_1', 's2', 'Bunga Citra Lestari', '2425-002', 'X IPA', 'jawaban-bunga-mtk.pdf', 'Sudah selesai Pak.', 'dinilai', 92, 'Sangat baik, semua jawaban benar.', '2026-07-27', '2026-07-29'),
  _kump('kp011', 'tgs3_1', 's14', 'Nadia Safitri', '2425-015', 'X IPA', undefined, undefined, 'belum_mengumpulkan'),

  // --- tgs3_2 (Matematika - XI IPA: Limit) ---
  _kump('kp012', 'tgs3_2', 's4', 'Dewi Lestari', '2425-004', 'XI IPA', 'limit-dewi.pdf', 'Nomor 5 agak susah Pak.', 'dinilai', 78, 'Tingkatkan pemahaman limit tak hingga.', '2026-07-25', '2026-07-28'),
  _kump('kp013', 'tgs3_2', 's12', 'Linda Kusuma', '2425-012', 'XI IPA', 'limit-linda.pdf', undefined, 'sudah_mengumpulkan', undefined, undefined, '2026-07-27'),

  // --- tgs4_1 (Sejarah - X IPA: Makalah Kerajaan) ---
  _kump('kp014', 'tgs4_1', 's1', 'Andi Pratama', '2425-001', 'X IPA', 'makalah-majapahit.pdf', 'Saya pilih Majapahit Pak.', 'dinilai', 88, 'Analisis cukup mendalam.', '2026-07-26', '2026-07-28'),
  _kump('kp015', 'tgs4_1', 's2', 'Bunga Citra Lestari', '2425-002', 'X IPA', undefined, undefined, 'belum_mengumpulkan'),

  // --- tgs9_1 (PAI - X IPA: Makalah Iman) ---
  _kump('kp016', 'tgs9_1', 's1', 'Andi Pratama', '2425-001', 'X IPA', 'makalah-iman-andi.pdf', undefined, 'sudah_mengumpulkan', undefined, undefined, '2026-07-28'),
  _kump('kp017', 'tgs9_1', 's2', 'Bunga Citra Lestari', '2425-002', 'X IPA', undefined, undefined, 'belum_mengumpulkan'),

  // --- tgs9_2 (PAI - XI IPA: Presentasi Toleransi) ---
  _kump('kp018', 'tgs9_2', 's4', 'Dewi Lestari', '2425-004', 'XI IPA', 'ppt-toleransi-kel1.pptx', undefined, 'dinilai', 88, 'Presentasi bagus, tambahkan referensi tafsir.', '2026-07-26', '2026-07-27'),

  // --- tgs15_1 (Fisika - XI IPA: Hukum Newton) ---
  _kump('kp019', 'tgs15_1', 's4', 'Dewi Lestari', '2425-004', 'XI IPA', 'newton-dewi.pdf', 'Bu, nomor 6 dan 8 saya ragu.', 'dinilai', 76, 'Cukup, pelajari lagi gaya gesek.', '2026-07-27', '2026-07-28'),
  _kump('kp020', 'tgs15_1', 's12', 'Linda Kusuma', '2425-012', 'XI IPA', undefined, undefined, 'belum_mengumpulkan'),

  // --- tgs16_1 (Kimia - XI IPA: Laju Reaksi) ---
  _kump('kp021', 'tgs16_1', 's4', 'Dewi Lestari', '2425-004', 'XI IPA', 'laju-reaksi-dewi.pdf', undefined, 'sudah_mengumpulkan', undefined, undefined, '2026-07-28'),

  // --- tgs17_1 (Biologi - XI IPA: Poster Pencernaan) ---
  _kump('kp022', 'tgs17_1', 's4', 'Dewi Lestari', '2425-004', 'XI IPA', 'poster-pencernaan.jpg', 'Poster digital Bu.', 'dinilai', 95, 'Kreatif dan informatif!', '2026-07-26', '2026-07-27'),

  // --- tgs18_1 (Ekonomi - XI IPS: Analisis PDB) ---
  _kump('kp023', 'tgs18_1', 's5', 'Eko Prasetyo', '2425-005', 'XI IPS', 'analisis-pdb-eko.pdf', undefined, 'sudah_mengumpulkan', undefined, undefined, '2026-07-28'),

  // --- tgs19_1 (Geografi - XI IPS: Peta Bencana) ---
  _kump('kp024', 'tgs19_1', 's5', 'Eko Prasetyo', '2425-005', 'XI IPS', undefined, undefined, 'belum_mengumpulkan'),

  // --- tgs20_1 (Sosiologi - XI IPS: Wawancara) ---
  _kump('kp025', 'tgs20_1', 's5', 'Eko Prasetyo', '2425-005', 'XI IPS', 'wawancara-sosiologi.pdf', 'Sudah saya wawancarai Pak.', 'dinilai', 83, 'Analisis mobilitas sosial cukup baik.', '2026-07-27', '2026-07-28'),
];
