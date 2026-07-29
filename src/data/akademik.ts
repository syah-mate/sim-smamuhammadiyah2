import {
  MapelGroup, Mapel, MapelSetting,
  EkstraGroup, Ekstra, EkstraPeserta, EkstraSetting,
  RaporAgenda, RaporConfig,
  KelasPengajar, PengajarInfo,
  Kompetensi, IndikatorItem,
  KelasPredikat, PredikatItem,
  EkstraKompetensi, EkstraIndikatorItem,
  EkstraPredikatSetting, EkstraPredikatItem,
  RaporKurikulumData, RaporMapelItem, RaporEkstraItem,
} from '@/types';

// ==================== Grup Mata Pelajaran ====================
export const dummyMapelGroups: MapelGroup[] = [
  { id: 'mg1', kode: 'UMUM', nama: 'Mata Pelajaran Umum', deskripsi: 'Kelompok mata pelajaran umum nasional', createdAt: '2025-07-01' },
  { id: 'mg2', kode: 'AGAMA', nama: 'Pendidikan Agama', deskripsi: 'Kelompok mata pelajaran agama dan akhlak', createdAt: '2025-07-01' },
  { id: 'mg3', kode: 'MULOK', nama: 'Muatan Lokal', deskripsi: 'Kelompok mata pelajaran muatan lokal sekolah', createdAt: '2025-07-01' },
  { id: 'mg4', kode: 'PEMINATAN', nama: 'Peminatan', deskripsi: 'Kelompok mata pelajaran peminatan IPA/IPS', createdAt: '2025-07-01' },
];

// ==================== Mata Pelajaran ====================
export const dummyMapel: Mapel[] = [
  // Umum
  { id: 'mp1', kode: 'BIN', nama: 'Bahasa Indonesia', groupId: 'mg1', groupNama: 'Mata Pelajaran Umum', deskripsi: 'Bahasa Indonesia Wajib', semester: 'Ganjil', urutan: 5, createdAt: '2025-07-01' },
  { id: 'mp2', kode: 'BIG', nama: 'Bahasa Inggris', groupId: 'mg1', groupNama: 'Mata Pelajaran Umum', deskripsi: 'Bahasa Inggris Wajib', semester: 'Ganjil', urutan: 6, createdAt: '2025-07-01' },
  { id: 'mp3', kode: 'MTK', nama: 'Matematika', groupId: 'mg1', groupNama: 'Mata Pelajaran Umum', deskripsi: 'Matematika Wajib', semester: 'Ganjil', urutan: 7, createdAt: '2025-07-01' },
  { id: 'mp4', kode: 'SEJ', nama: 'Sejarah Indonesia', groupId: 'mg1', groupNama: 'Mata Pelajaran Umum', deskripsi: 'Sejarah Indonesia Wajib', semester: 'Ganjil', urutan: 8, createdAt: '2025-07-01' },
  { id: 'mp5', kode: 'PKN', nama: 'PPKn', groupId: 'mg1', groupNama: 'Mata Pelajaran Umum', deskripsi: 'Pendidikan Pancasila dan Kewarganegaraan', semester: 'Ganjil', urutan: 4, createdAt: '2025-07-01' },
  { id: 'mp6', kode: 'PJK', nama: 'PJOK', groupId: 'mg1', groupNama: 'Mata Pelajaran Umum', deskripsi: 'Pendidikan Jasmani, Olahraga, dan Kesehatan', semester: 'Ganjil', urutan: 9, createdAt: '2025-07-01' },
  { id: 'mp7', kode: 'SBD', nama: 'Seni Budaya', groupId: 'mg1', groupNama: 'Mata Pelajaran Umum', deskripsi: 'Seni Budaya dan Keterampilan', semester: 'Ganjil', urutan: 10, createdAt: '2025-07-01' },
  { id: 'mp8', kode: 'PKW', nama: 'Prakarya & Kewirausahaan', groupId: 'mg1', groupNama: 'Mata Pelajaran Umum', deskripsi: 'Prakarya dan Kewirausahaan', semester: 'Genap', urutan: 11, createdAt: '2025-07-01' },
  // Agama
  { id: 'mp9', kode: 'PAI', nama: 'Pendidikan Agama Islam', groupId: 'mg2', groupNama: 'Pendidikan Agama', deskripsi: 'PAI dan Budi Pekerti', semester: 'Ganjil', urutan: 1, createdAt: '2025-07-01' },
  { id: 'mp10', kode: 'SN', nama: 'Sirah Nabawiyah', groupId: 'mg2', groupNama: 'Pendidikan Agama', deskripsi: 'Sirah Nabawiyah dan Tarikh', semester: 'Ganjil', urutan: 3, createdAt: '2025-07-01' },
  { id: 'mp11', kode: 'BPI', nama: 'Bina Pribadi Islam', groupId: 'mg2', groupNama: 'Pendidikan Agama', deskripsi: 'Bina Pribadi Islam', semester: 'Ganjil', urutan: 2, createdAt: '2025-07-01' },
  { id: 'mp12', kode: 'BHS', nama: 'Bahasa Arab', groupId: 'mg2', groupNama: 'Pendidikan Agama', deskripsi: 'Bahasa Arab', semester: 'Genap', urutan: 5, createdAt: '2025-07-01' },
  // Muatan Lokal
  { id: 'mp13', kode: 'TIK', nama: 'Teknologi Informasi', groupId: 'mg3', groupNama: 'Muatan Lokal', deskripsi: 'TIK dan Komputer', semester: 'Ganjil', urutan: 1, createdAt: '2025-07-01' },
  { id: 'mp14', kode: 'BJW', nama: 'Bahasa Jawa', groupId: 'mg3', groupNama: 'Muatan Lokal', deskripsi: 'Bahasa dan Sastra Jawa', semester: 'Ganjil', urutan: 2, createdAt: '2025-07-01' },
  // Peminatan IPA
  { id: 'mp15', kode: 'FIS', nama: 'Fisika', groupId: 'mg4', groupNama: 'Peminatan', deskripsi: 'Fisika Peminatan IPA', semester: 'Ganjil', urutan: 1, createdAt: '2025-07-01' },
  { id: 'mp16', kode: 'KIM', nama: 'Kimia', groupId: 'mg4', groupNama: 'Peminatan', deskripsi: 'Kimia Peminatan IPA', semester: 'Ganjil', urutan: 2, createdAt: '2025-07-01' },
  { id: 'mp17', kode: 'BIO', nama: 'Biologi', groupId: 'mg4', groupNama: 'Peminatan', deskripsi: 'Biologi Peminatan IPA', semester: 'Ganjil', urutan: 3, createdAt: '2025-07-01' },
  // Peminatan IPS
  { id: 'mp18', kode: 'EKO', nama: 'Ekonomi', groupId: 'mg4', groupNama: 'Peminatan', deskripsi: 'Ekonomi Peminatan IPS', semester: 'Ganjil', urutan: 4, createdAt: '2025-07-01' },
  { id: 'mp19', kode: 'GEO', nama: 'Geografi', groupId: 'mg4', groupNama: 'Peminatan', deskripsi: 'Geografi Peminatan IPS', semester: 'Ganjil', urutan: 5, createdAt: '2025-07-01' },
  { id: 'mp20', kode: 'SOS', nama: 'Sosiologi', groupId: 'mg4', groupNama: 'Peminatan', deskripsi: 'Sosiologi Peminatan IPS', semester: 'Ganjil', urutan: 6, createdAt: '2025-07-01' },
];

// ==================== Pengaturan Mata Pelajaran ====================
export const dummyMapelSettings: MapelSetting[] = [
  { id: 'ms1', mapelId: 'mp1', mapelNama: 'Bahasa Indonesia', kkm: 75, bobotUH: 25, bobotTugas: 15, bobotUTS: 25, bobotUAS: 35, guruPengampu: 'Dra. Sri Wahyuni, M.Pd.', guruPengampuId: 'emp1', createdAt: '2025-07-01' },
  { id: 'ms2', mapelId: 'mp2', mapelNama: 'Bahasa Inggris', kkm: 75, bobotUH: 25, bobotTugas: 15, bobotUTS: 25, bobotUAS: 35, guruPengampu: 'Rina Anggraini, S.Pd.', guruPengampuId: 'emp2', createdAt: '2025-07-01' },
  { id: 'ms3', mapelId: 'mp3', mapelNama: 'Matematika', kkm: 75, bobotUH: 20, bobotTugas: 20, bobotUTS: 25, bobotUAS: 35, guruPengampu: 'Drs. Ahmad Fauzi, M.Si.', guruPengampuId: 'emp3', createdAt: '2025-07-01' },
  { id: 'ms4', mapelId: 'mp4', mapelNama: 'Sejarah Indonesia', kkm: 75, bobotUH: 25, bobotTugas: 20, bobotUTS: 25, bobotUAS: 30, guruPengampu: 'Hendra Gunawan, S.Pd.', guruPengampuId: 'emp4', createdAt: '2025-07-01' },
  { id: 'ms5', mapelId: 'mp5', mapelNama: 'PPKn', kkm: 75, bobotUH: 25, bobotTugas: 20, bobotUTS: 25, bobotUAS: 30, guruPengampu: 'Dewi Sartika, S.Pd.', guruPengampuId: 'emp5', createdAt: '2025-07-01' },
  { id: 'ms6', mapelId: 'mp9', mapelNama: 'Pendidikan Agama Islam', kkm: 78, bobotUH: 25, bobotTugas: 15, bobotUTS: 25, bobotUAS: 35, guruPengampu: 'Ust. Muhammad Ridwan, S.Pd.I.', guruPengampuId: 'emp6', createdAt: '2025-07-01' },
  { id: 'ms7', mapelId: 'mp15', mapelNama: 'Fisika', kkm: 76, bobotUH: 20, bobotTugas: 20, bobotUTS: 25, bobotUAS: 35, guruPengampu: 'Ratna Kusuma, S.Pd., M.Pd.', guruPengampuId: 'emp7', createdAt: '2025-07-01' },
  { id: 'ms8', mapelId: 'mp16', mapelNama: 'Kimia', kkm: 76, bobotUH: 20, bobotTugas: 20, bobotUTS: 25, bobotUAS: 35, guruPengampu: 'Drs. Budi Santoso', guruPengampuId: 'emp8', createdAt: '2025-07-01' },
];

// ==================== Grup Ekstrakurikuler ====================
export const dummyEkstraGroups: EkstraGroup[] = [
  { id: 'eg1', kode: 'AKD', nama: 'Akademik & Sains', deskripsi: 'Ekstrakurikuler bidang akademik dan sains', createdAt: '2025-07-01' },
  { id: 'eg2', kode: 'SENI', nama: 'Seni & Budaya', deskripsi: 'Ekstrakurikuler bidang seni dan budaya', createdAt: '2025-07-01' },
  { id: 'eg3', kode: 'OR', nama: 'Olahraga', deskripsi: 'Ekstrakurikuler bidang olahraga dan kesehatan', createdAt: '2025-07-01' },
  { id: 'eg4', kode: 'KPR', nama: 'Kepramukaan', deskripsi: 'Ekstrakurikuler kepramukaan dan kepanduan', createdAt: '2025-07-01' },
  { id: 'eg5', kode: 'AGM', nama: 'Keagamaan', deskripsi: 'Ekstrakurikuler bidang keagamaan', createdAt: '2025-07-01' },
  { id: 'eg6', kode: 'ORG', nama: 'Organisasi', deskripsi: 'Ekstrakurikuler organisasi dan kepemimpinan', createdAt: '2025-07-01' },
];

// ==================== Ekstrakurikuler ====================
export const dummyEkstra: Ekstra[] = [
  // Akademik & Sains
  { id: 'ek1', kode: 'KIR', nama: 'Karya Ilmiah Remaja', groupId: 'eg1', groupNama: 'Akademik & Sains', deskripsi: 'Penelitian dan penulisan karya ilmiah', hari: 'Jumat', jam: '14:00-16:00', lokasi: 'Lab IPA', pembina: 'Ratna Kusuma, S.Pd., M.Pd.', pembinaId: 'emp7', kuota: 30, createdAt: '2025-07-01' },
  { id: 'ek2', kode: 'OLIM', nama: 'Olimpiade Sains', groupId: 'eg1', groupNama: 'Akademik & Sains', deskripsi: 'Pembinaan olimpiade Matematika, Fisika, Kimia, Biologi', hari: 'Sabtu', jam: '08:00-12:00', lokasi: 'Ruang Olimpiade', pembina: 'Drs. Ahmad Fauzi, M.Si.', pembinaId: 'emp3', kuota: 25, createdAt: '2025-07-01' },
  { id: 'ek3', kode: 'DEB', nama: 'Debat Bahasa Inggris', groupId: 'eg1', groupNama: 'Akademik & Sains', deskripsi: 'English Debate Club', hari: 'Kamis', jam: '14:30-16:30', lokasi: 'Ruang Bahasa', pembina: 'Rina Anggraini, S.Pd.', pembinaId: 'emp2', kuota: 20, createdAt: '2025-07-01' },
  // Seni & Budaya
  { id: 'ek4', kode: 'PAD', nama: 'Paduan Suara', groupId: 'eg2', groupNama: 'Seni & Budaya', deskripsi: 'Paduan suara dan vokal grup', hari: 'Rabu', jam: '14:00-16:00', lokasi: 'Aula', pembina: 'Dewi Sartika, S.Pd.', pembinaId: 'emp5', kuota: 40, createdAt: '2025-07-01' },
  { id: 'ek5', kode: 'TARI', nama: 'Tari Tradisional', groupId: 'eg2', groupNama: 'Seni & Budaya', deskripsi: 'Pelestarian tari tradisional nusantara', hari: 'Selasa', jam: '14:00-16:00', lokasi: 'Aula', pembina: 'Sri Wahyuni, S.Sn.', pembinaId: 'emp9', kuota: 30, createdAt: '2025-07-01' },
  { id: 'ek6', kode: 'LUK', nama: 'Lukis & Desain', groupId: 'eg2', groupNama: 'Seni & Budaya', deskripsi: 'Melukis, menggambar, dan desain grafis', hari: 'Kamis', jam: '14:00-16:00', lokasi: 'Ruang Seni', pembina: 'Agus Priyono, S.Sn.', pembinaId: 'emp10', kuota: 25, createdAt: '2025-07-01' },
  // Olahraga
  { id: 'ek7', kode: 'FUT', nama: 'Futsal', groupId: 'eg3', groupNama: 'Olahraga', deskripsi: 'Klub futsal sekolah', hari: 'Senin', jam: '15:00-17:00', lokasi: 'Lapangan Futsal', pembina: 'Rudi Hartono, S.Pd.', pembinaId: 'emp11', kuota: 25, createdAt: '2025-07-01' },
  { id: 'ek8', kode: 'BASK', nama: 'Basket', groupId: 'eg3', groupNama: 'Olahraga', deskripsi: 'Klub bola basket', hari: 'Sabtu', jam: '13:00-14:00', lokasi: 'Lapangan Basket', pembina: 'indra aang', pembinaId: 'emp20', kuota: 20, createdAt: '2025-07-01' },
  { id: 'ek9', kode: 'SILAT', nama: 'Pencak Silat', groupId: 'eg3', groupNama: 'Olahraga', deskripsi: 'Latihan pencak silat Tapak Suci', hari: 'Kamis', jam: '15:00-17:00', lokasi: 'Aula', pembina: 'Fahmi Rahman, S.Pd.', pembinaId: 'emp13', kuota: 35, createdAt: '2025-07-01' },
  // Organisasi
  { id: 'ek10', kode: 'PRAM', nama: 'PRAMUKA', groupId: 'eg6', groupNama: 'Organisasi', deskripsi: 'Gerakan Pramuka Gugus Depan', hari: 'Jumat', jam: '13:00-15:00', lokasi: 'Lapangan', pembina: '', pembinaId: '', kuota: 1000, createdAt: '2025-07-01' },
  { id: 'ek11', kode: 'PMR', nama: 'PMR (Palang Merah Remaja)', groupId: 'eg6', groupNama: 'Organisasi', deskripsi: 'Palang Merah Remaja Unit Sekolah', hari: 'Sabtu', jam: '09:00-12:00', lokasi: 'Ruang UKS', pembina: 'Nurul Hidayah, S.Kep.', pembinaId: 'emp14', kuota: 30, createdAt: '2025-07-01' },
  // Keagamaan
  { id: 'ek12', kode: 'TIL', nama: 'Tilawah & Tahfidz', groupId: 'eg5', groupNama: 'Keagamaan', deskripsi: 'Seni baca Al-Qur\'an dan hafalan', hari: 'Senin', jam: '14:00-16:00', lokasi: 'Masjid Sekolah', pembina: 'Ust. Muhammad Ridwan, S.Pd.I.', pembinaId: 'emp6', kuota: 30, createdAt: '2025-07-01' },
  { id: 'ek13', kode: 'HAD', nama: 'Hadroh & Marawis', groupId: 'eg5', groupNama: 'Keagamaan', deskripsi: 'Kesenian hadroh dan marawis', hari: 'Selasa', jam: '14:00-16:00', lokasi: 'Masjid Sekolah', pembina: 'Ust. Ahmad Syafi\'i, S.Pd.I.', pembinaId: 'emp15', kuota: 25, createdAt: '2025-07-01' },
  // Kepramukaan
  { id: 'ek14', kode: 'SCT', nama: 'Scout Talent', groupId: 'eg4', groupNama: 'Kepramukaan', deskripsi: 'Pengembangan bakat kepramukaan', hari: 'Sabtu', jam: '08:00-11:00', lokasi: 'Lapangan Utama', pembina: 'Hendra Gunawan, S.Pd.', pembinaId: 'emp4', kuota: 50, createdAt: '2025-07-01' },
];

// ==================== Peserta Ekstrakurikuler ====================
export const dummyEkstraPeserta: EkstraPeserta[] = [
  { id: 'ep1', ekstraId: 'ek1', ekstraNama: 'Karya Ilmiah Remaja', siswaId: 'sis1', siswaNama: 'Ahmad Fadillah', nis: '2025001', kelas: 'XII IPA 1', tanggalDaftar: '2025-07-15', status: 'Aktif' },
  { id: 'ep2', ekstraId: 'ek1', ekstraNama: 'Karya Ilmiah Remaja', siswaId: 'sis2', siswaNama: 'Siti Nurhaliza', nis: '2025002', kelas: 'XII IPA 2', tanggalDaftar: '2025-07-15', status: 'Aktif' },
  { id: 'ep3', ekstraId: 'ek7', ekstraNama: 'Futsal', siswaId: 'sis3', siswaNama: 'Rizky Pratama', nis: '2025003', kelas: 'XI IPS 1', tanggalDaftar: '2025-07-20', status: 'Aktif' },
  { id: 'ep4', ekstraId: 'ek10', ekstraNama: 'Pramuka', siswaId: 'sis4', siswaNama: 'Dewi Anggraini', nis: '2025004', kelas: 'X IPA 2', tanggalDaftar: '2025-07-10', status: 'Aktif' },
  { id: 'ep5', ekstraId: 'ek10', ekstraNama: 'Pramuka', siswaId: 'sis5', siswaNama: 'Budi Setiawan', nis: '2025005', kelas: 'XI IPA 1', tanggalDaftar: '2025-07-10', status: 'Aktif' },
  { id: 'ep6', ekstraId: 'ek12', ekstraNama: 'Tilawah & Tahfidz', siswaId: 'sis6', siswaNama: 'Aisyah Putri', nis: '2025006', kelas: 'XII IPA 1', tanggalDaftar: '2025-07-12', status: 'Aktif' },
];

// ==================== Pengaturan Ekstrakurikuler ====================
export const dummyEkstraSettings: EkstraSetting[] = [
  { id: 'es1', ekstraId: 'ek1', ekstraNama: 'Karya Ilmiah Remaja', semester: 'Ganjil', tahunAjaran: '2025/2026', biayaPendaftaran: 50000, biayaBulanan: 25000, statusAktif: true, createdAt: '2025-07-01' },
  { id: 'es2', ekstraId: 'ek7', ekstraNama: 'Futsal', semester: 'Ganjil', tahunAjaran: '2025/2026', biayaPendaftaran: 75000, biayaBulanan: 35000, statusAktif: true, createdAt: '2025-07-01' },
  { id: 'es3', ekstraId: 'ek10', ekstraNama: 'Pramuka', semester: 'Ganjil', tahunAjaran: '2025/2026', biayaPendaftaran: 100000, biayaBulanan: 0, statusAktif: true, createdAt: '2025-07-01' },
  { id: 'es4', ekstraId: 'ek12', ekstraNama: 'Tilawah & Tahfidz', semester: 'Ganjil', tahunAjaran: '2025/2026', biayaPendaftaran: 0, biayaBulanan: 15000, statusAktif: true, createdAt: '2025-07-01' },
  { id: 'es5', ekstraId: 'ek9', ekstraNama: 'Pencak Silat', semester: 'Ganjil', tahunAjaran: '2025/2026', biayaPendaftaran: 100000, biayaBulanan: 30000, statusAktif: true, createdAt: '2025-07-01' },
];

// ==================== Agenda Rapotan ====================
export const dummyRaporAgenda: RaporAgenda[] = [
  { id: 'ra1', namaAgenda: 'UTS Semester Ganjil 2025/2026', semester: 'Ganjil', tahunAjaran: '2025/2026', tanggalMulai: '2025-10-06', tanggalSelesai: '2025-10-14', jenis: 'UTS', status: 'Selesai', keterangan: 'Ulangan Tengah Semester Ganjil untuk kelas X, XI, XII', createdAt: '2025-09-01' },
  { id: 'ra2', namaAgenda: 'Pembagian Rapor Tengah Semester Ganjil', semester: 'Ganjil', tahunAjaran: '2025/2026', tanggalMulai: '2025-10-28', tanggalSelesai: '2025-10-28', jenis: 'Rapor', status: 'Selesai', keterangan: 'Pembagian rapor mid semester ganjil', createdAt: '2025-10-01' },
  { id: 'ra3', namaAgenda: 'UAS Semester Ganjil 2025/2026', semester: 'Ganjil', tahunAjaran: '2025/2026', tanggalMulai: '2025-12-08', tanggalSelesai: '2025-12-17', jenis: 'UAS', status: 'Selesai', keterangan: 'Ulangan Akhir Semester Ganjil', createdAt: '2025-11-01' },
  { id: 'ra4', namaAgenda: 'Pembagian Rapor Semester Ganjil 2025/2026', semester: 'Ganjil', tahunAjaran: '2025/2026', tanggalMulai: '2025-12-22', tanggalSelesai: '2025-12-22', jenis: 'Rapor', status: 'Selesai', keterangan: 'Pembagian rapor akhir semester ganjil & kenaikan kelas', createdAt: '2025-12-01' },
  { id: 'ra5', namaAgenda: 'Remedial Semester Ganjil 2025/2026', semester: 'Ganjil', tahunAjaran: '2025/2026', tanggalMulai: '2026-01-05', tanggalSelesai: '2026-01-09', jenis: 'Remedial', status: 'Selesai', keterangan: 'Remedial untuk siswa yang belum mencapai KKM', createdAt: '2025-12-20' },
  { id: 'ra6', namaAgenda: 'UTS Semester Genap 2025/2026', semester: 'Genap', tahunAjaran: '2025/2026', tanggalMulai: '2026-03-16', tanggalSelesai: '2026-03-24', jenis: 'UTS', status: 'Selesai', keterangan: 'Ulangan Tengah Semester Genap', createdAt: '2026-02-01' },
  { id: 'ra7', namaAgenda: 'Pembagian Rapor Tengah Semester Genap', semester: 'Genap', tahunAjaran: '2025/2026', tanggalMulai: '2026-04-06', tanggalSelesai: '2026-04-06', jenis: 'Rapor', status: 'Selesai', keterangan: 'Pembagian rapor mid semester genap', createdAt: '2026-03-25' },
  { id: 'ra8', namaAgenda: 'UAS Semester Genap 2025/2026', semester: 'Genap', tahunAjaran: '2025/2026', tanggalMulai: '2026-05-25', tanggalSelesai: '2026-06-04', jenis: 'UAS', status: 'Selesai', keterangan: 'Ulangan Akhir Semester Genap', createdAt: '2026-05-01' },
  { id: 'ra9', namaAgenda: 'Pembagian Rapor Akhir Tahun 2025/2026', semester: 'Genap', tahunAjaran: '2025/2026', tanggalMulai: '2026-06-22', tanggalSelesai: '2026-06-22', jenis: 'Rapor', status: 'Berlangsung', keterangan: 'Pembagian rapor kenaikan kelas dan kelulusan', createdAt: '2026-06-01' },
  { id: 'ra10', namaAgenda: 'Remedial Semester Genap 2025/2026', semester: 'Genap', tahunAjaran: '2025/2026', tanggalMulai: '2026-06-25', tanggalSelesai: '2026-06-29', jenis: 'Remedial', status: 'Direncanakan', keterangan: 'Remedial semester genap', createdAt: '2026-06-10' },
  { id: 'ra11', namaAgenda: 'UTS Semester Ganjil 2026/2027', semester: 'Ganjil', tahunAjaran: '2026/2027', tanggalMulai: '2026-10-05', tanggalSelesai: '2026-10-13', jenis: 'UTS', status: 'Direncanakan', keterangan: 'UTS Ganjil tahun ajaran baru', createdAt: '2026-07-15' },
  { id: 'ra12', namaAgenda: 'UAS Semester Ganjil 2026/2027', semester: 'Ganjil', tahunAjaran: '2026/2027', tanggalMulai: '2026-12-07', tanggalSelesai: '2026-12-16', jenis: 'UAS', status: 'Direncanakan', keterangan: 'UAS Ganjil tahun ajaran baru', createdAt: '2026-07-15' },
];

// ==================== Konfigurasi Rapor ====================
export const dummyRaporConfig: RaporConfig[] = [
  {
    id: 'rc1',
    nama: 'Rapor tengah semester ganjil 2026/2027',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    status: 'Aktif',
    tanggalCetak: '2026-07-21',
    batasInputMulai: '2026-07-21',
    batasInputSelesai: '2026-07-21',
    kkm: 75,
    fitur: { peringkat: true, absensi: true, ekskul: true },
    catatan: 'Rapor tengah semester ganjil tahun ajaran 2026/2027',
    createdAt: '2026-07-01',
  },
  {
    id: 'rc2',
    nama: 'PTS',
    semester: 'Ganjil',
    tahunAjaran: '2025/2027',
    status: 'Aktif',
    tanggalCetak: '2026-07-31',
    batasInputMulai: '2026-07-01',
    batasInputSelesai: '2026-07-31',
    kkm: 75,
    fitur: { peringkat: true, absensi: true, ekskul: true },
    catatan: 'Penilaian Tengah Semester',
    createdAt: '2026-06-15',
  },
];

// ==================== Kurikulum Rapor (dummy) ====================
export const dummyRaporKurikulum: RaporKurikulumData = {
  kategoriAkademik: [
    {
      id: 'ka1',
      nama: 'Pengetahuan',
      jenisPenilaian: [
        { id: 'jp1', nama: 'Ulangan Harian', bobot: 25 },
        { id: 'jp2', nama: 'Tugas', bobot: 15 },
        { id: 'jp3', nama: 'UTS', bobot: 25 },
        { id: 'jp4', nama: 'UAS', bobot: 35 },
      ],
    },
  ],
  kategoriNonAkademik: [
    {
      id: 'kn1',
      nama: 'Sikap & Kepribadian',
      jenisPenilaian: [
        { id: 'jpn1', nama: 'Kehadiran', bobot: 40 },
        { id: 'jpn2', nama: 'Kerapihan', bobot: 30 },
        { id: 'jpn3', nama: 'Akhlak', bobot: 30 },
      ],
    },
  ],
  templateCatatan: [
    { id: 'tc1', nama: 'Prestasi Akademik', teks: 'Pertahankan prestasi yang telah diraih dan terus tingkatkan semangat belajar.' },
    { id: 'tc2', nama: 'Perlu Bimbingan', teks: 'Tingkatkan kedisiplinan dalam mengerjakan tugas dan lebih aktif dalam diskusi kelas.' },
  ],
};

// ==================== Mapel untuk Rapor ====================
export const dummyRaporMapel: RaporMapelItem[] = [
  // Umum
  { mapelId: 'mp1', kode: 'BIN', nama: 'Bahasa Indonesia', groupNama: 'Mata Pelajaran Umum', tampil: true },
  { mapelId: 'mp2', kode: 'BIG', nama: 'Bahasa Inggris', groupNama: 'Mata Pelajaran Umum', tampil: true },
  { mapelId: 'mp3', kode: 'MTK', nama: 'Matematika', groupNama: 'Mata Pelajaran Umum', tampil: true },
  { mapelId: 'mp4', kode: 'SEJ', nama: 'Sejarah Indonesia', groupNama: 'Mata Pelajaran Umum', tampil: true },
  { mapelId: 'mp5', kode: 'PKN', nama: 'PPKn', groupNama: 'Mata Pelajaran Umum', tampil: true },
  { mapelId: 'mp6', kode: 'PJK', nama: 'PJOK', groupNama: 'Mata Pelajaran Umum', tampil: true },
  { mapelId: 'mp7', kode: 'SBD', nama: 'Seni Budaya', groupNama: 'Mata Pelajaran Umum', tampil: true },
  { mapelId: 'mp8', kode: 'PKW', nama: 'Prakarya & Kewirausahaan', groupNama: 'Mata Pelajaran Umum', tampil: false },
  // Agama
  { mapelId: 'mp9', kode: 'PAI', nama: 'Pendidikan Agama Islam', groupNama: 'Pendidikan Agama', tampil: true },
  { mapelId: 'mp10', kode: 'SN', nama: 'Sirah Nabawiyah', groupNama: 'Pendidikan Agama', tampil: true },
  { mapelId: 'mp11', kode: 'BPI', nama: 'Bina Pribadi Islam', groupNama: 'Pendidikan Agama', tampil: true },
  { mapelId: 'mp12', kode: 'BHS', nama: 'Bahasa Arab', groupNama: 'Pendidikan Agama', tampil: true },
  // Muatan Lokal
  { mapelId: 'mp13', kode: 'TIK', nama: 'Teknologi Informasi', groupNama: 'Muatan Lokal', tampil: true },
  { mapelId: 'mp14', kode: 'BJW', nama: 'Bahasa Jawa', groupNama: 'Muatan Lokal', tampil: true },
  // Peminatan IPA
  { mapelId: 'mp15', kode: 'FIS', nama: 'Fisika', groupNama: 'Peminatan', tampil: true },
  { mapelId: 'mp16', kode: 'KIM', nama: 'Kimia', groupNama: 'Peminatan', tampil: true },
  { mapelId: 'mp17', kode: 'BIO', nama: 'Biologi', groupNama: 'Peminatan', tampil: true },
  // Peminatan IPS
  { mapelId: 'mp18', kode: 'EKO', nama: 'Ekonomi', groupNama: 'Peminatan', tampil: true },
  { mapelId: 'mp19', kode: 'GEO', nama: 'Geografi', groupNama: 'Peminatan', tampil: true },
  { mapelId: 'mp20', kode: 'SOS', nama: 'Sosiologi', groupNama: 'Peminatan', tampil: true },
];

// ==================== Ekstrakurikuler untuk Rapor ====================
export const dummyRaporEkstra: RaporEkstraItem[] = [
  { ekstraId: 'ek7', nama: 'Futsal', tampil: true },
  { ekstraId: 'ek8', nama: 'Basket', tampil: true },
  { ekstraId: 'ek10', nama: 'PRAMUKA', tampil: true },
  { ekstraId: 'ek1', nama: 'Karya Ilmiah Remaja', tampil: false },
  { ekstraId: 'ek4', nama: 'Paduan Suara', tampil: false },
  { ekstraId: 'ek12', nama: 'Tilawah & Tahfidz', tampil: true },
];

// ==================== Pengaturan Mapel: Pengajar per Kelas ====================

// Helper to generate kelas pengajar for a mapel
function mkKelasPengajar(mapelId: string, kelasList: { id: string; nama: string; label: string; tingkat: string; pengajar: PengajarInfo[] }[]): KelasPengajar[] {
  return kelasList.map((k, i) => ({
    id: `kp_${mapelId}_${k.id}`, mapelId, kelasId: k.id, kelasNama: k.nama, labelKelas: k.label, tingkat: k.tingkat,
    tahunAjaran: '2026/2027', pengajar: k.pengajar,
  }));
}

const guruPool: PengajarInfo[] = [
  { id: 'pj1', pegawaiId: 'emp20', nama: 'indra aang', email: 'indra@gmail.com', noTelp: '0887712398384' },
  { id: 'pj2', pegawaiId: 'emp21', nama: "A'mala Solihati Afiyah", email: 'mala@gmail.com', noTelp: '081805303253' },
  { id: 'pj3', pegawaiId: 'emp22', nama: 'Budi Santoso, S.Pd.', email: 'budi.santoso@gmail.com', noTelp: '081234567890' },
  { id: 'pj4', pegawaiId: 'emp23', nama: 'Dewi Sartika, M.Pd.', email: 'dewi.sartika@gmail.com', noTelp: '082345678901' },
  { id: 'pj5', pegawaiId: 'emp24', nama: 'Hendra Gunawan, S.Pd.', email: 'hendra.g@gmail.com', noTelp: '083456789012' },
  { id: 'pj6', pegawaiId: 'emp25', nama: 'Rina Anggraini, S.Pd.', email: 'rina.ang@gmail.com', noTelp: '084567890123' },
  { id: 'pj7', pegawaiId: 'emp26', nama: 'Ahmad Fauzi, M.Si.', email: 'ahmad.fauzi@gmail.com', noTelp: '085678901234' },
  { id: 'pj8', pegawaiId: 'emp27', nama: 'Sri Wahyuni, M.Pd.', email: 'sri.wahyuni@gmail.com', noTelp: '086789012345' },
  { id: 'pj9', pegawaiId: 'emp28', nama: 'Ratna Kusuma, S.Pd.', email: 'ratna.kusuma@gmail.com', noTelp: '087890123456' },
];

const baseKelas = [
  { id: 'k1a', nama: 'Kelas 1A', label: '1 SMA', tingkat: '10' },
  { id: 'k1b', nama: 'Kelas 1B', label: '1 SMA', tingkat: '10' },
  { id: 'k2a', nama: 'Kelas 2A', label: '2 SMA', tingkat: '11' },
];

export const dummyKelasPengajar: KelasPengajar[] = [
  // mp1 - Bahasa Indonesia
  ...mkKelasPengajar('mp1', [
    { ...baseKelas[0], pengajar: [guruPool[7]] },
    { ...baseKelas[1], pengajar: [guruPool[7]] },
    { ...baseKelas[2], pengajar: [guruPool[3]] },
  ]),
  // mp2 - Bahasa Inggris
  ...mkKelasPengajar('mp2', [
    { ...baseKelas[0], pengajar: [guruPool[5]] },
    { ...baseKelas[1], pengajar: [guruPool[5]] },
    { ...baseKelas[2], pengajar: [guruPool[5]] },
  ]),
  // mp3 - Matematika
  ...mkKelasPengajar('mp3', [
    { ...baseKelas[0], pengajar: [guruPool[0], guruPool[1]] },
    { ...baseKelas[1], pengajar: [] },
    { ...baseKelas[2], pengajar: [guruPool[2]] },
  ]),
  // mp4 - Sejarah Indonesia
  ...mkKelasPengajar('mp4', [
    { ...baseKelas[0], pengajar: [guruPool[4]] },
    { ...baseKelas[1], pengajar: [] },
    { ...baseKelas[2], pengajar: [guruPool[4]] },
  ]),
  // mp5 - PPKn
  ...mkKelasPengajar('mp5', [
    { ...baseKelas[0], pengajar: [guruPool[3]] },
    { ...baseKelas[1], pengajar: [guruPool[3]] },
    { ...baseKelas[2], pengajar: [guruPool[3]] },
  ]),
  // mp6 - PJOK
  ...mkKelasPengajar('mp6', [
    { ...baseKelas[0], pengajar: [guruPool[6]] },
    { ...baseKelas[1], pengajar: [guruPool[6]] },
    { ...baseKelas[2], pengajar: [] },
  ]),
  // mp7 - Seni Budaya
  ...mkKelasPengajar('mp7', [
    { ...baseKelas[0], pengajar: [] },
    { ...baseKelas[1], pengajar: [guruPool[8]] },
    { ...baseKelas[2], pengajar: [guruPool[8]] },
  ]),
  // mp8 - Prakarya & Kewirausahaan
  ...mkKelasPengajar('mp8', [
    { ...baseKelas[0], pengajar: [guruPool[2]] },
    { ...baseKelas[1], pengajar: [] },
    { ...baseKelas[2], pengajar: [guruPool[2]] },
  ]),
  // mp9 - Pendidikan Agama Islam
  ...mkKelasPengajar('mp9', [
    { ...baseKelas[0], pengajar: [guruPool[6], guruPool[0]] },
    { ...baseKelas[1], pengajar: [guruPool[6]] },
    { ...baseKelas[2], pengajar: [guruPool[6]] },
  ]),
  // mp10 - Sirah Nabawiyah
  ...mkKelasPengajar('mp10', [
    { ...baseKelas[0], pengajar: [guruPool[6]] },
    { ...baseKelas[1], pengajar: [] },
    { ...baseKelas[2], pengajar: [guruPool[6]] },
  ]),
  // mp11 - Bina Pribadi Islam
  ...mkKelasPengajar('mp11', [
    { ...baseKelas[0], pengajar: [guruPool[1]] },
    { ...baseKelas[1], pengajar: [guruPool[1]] },
    { ...baseKelas[2], pengajar: [] },
  ]),
  // mp12 - Bahasa Arab
  ...mkKelasPengajar('mp12', [
    { ...baseKelas[0], pengajar: [guruPool[6]] },
    { ...baseKelas[1], pengajar: [] },
    { ...baseKelas[2], pengajar: [guruPool[6]] },
  ]),
  // mp13 - Teknologi Informasi
  ...mkKelasPengajar('mp13', [
    { ...baseKelas[0], pengajar: [guruPool[2]] },
    { ...baseKelas[1], pengajar: [guruPool[2]] },
    { ...baseKelas[2], pengajar: [guruPool[2]] },
  ]),
  // mp14 - Bahasa Jawa
  ...mkKelasPengajar('mp14', [
    { ...baseKelas[0], pengajar: [guruPool[7]] },
    { ...baseKelas[1], pengajar: [] },
    { ...baseKelas[2], pengajar: [guruPool[7]] },
  ]),
  // mp15 - Fisika
  ...mkKelasPengajar('mp15', [
    { ...baseKelas[0], pengajar: [guruPool[8]] },
    { ...baseKelas[1], pengajar: [guruPool[8]] },
    { ...baseKelas[2], pengajar: [guruPool[8]] },
  ]),
  // mp16 - Kimia
  ...mkKelasPengajar('mp16', [
    { ...baseKelas[0], pengajar: [guruPool[2]] },
    { ...baseKelas[1], pengajar: [] },
    { ...baseKelas[2], pengajar: [guruPool[2]] },
  ]),
  // mp17 - Biologi
  ...mkKelasPengajar('mp17', [
    { ...baseKelas[0], pengajar: [guruPool[3]] },
    { ...baseKelas[1], pengajar: [guruPool[3]] },
    { ...baseKelas[2], pengajar: [guruPool[3]] },
  ]),
  // mp18 - Ekonomi
  ...mkKelasPengajar('mp18', [
    { ...baseKelas[0], pengajar: [guruPool[4]] },
    { ...baseKelas[1], pengajar: [] },
    { ...baseKelas[2], pengajar: [guruPool[4]] },
  ]),
  // mp19 - Geografi
  ...mkKelasPengajar('mp19', [
    { ...baseKelas[0], pengajar: [guruPool[5]] },
    { ...baseKelas[1], pengajar: [guruPool[5]] },
    { ...baseKelas[2], pengajar: [] },
  ]),
  // mp20 - Sosiologi
  ...mkKelasPengajar('mp20', [
    { ...baseKelas[0], pengajar: [guruPool[3]] },
    { ...baseKelas[1], pengajar: [] },
    { ...baseKelas[2], pengajar: [guruPool[3]] },
  ]),
];

// ==================== Pengaturan Mapel: Kompetensi & Indikator ====================

interface KompTemplate { mapelId: string; mapelNama: string; items: { kode: string; nama: string; indikator: { kode: string; nama: string }[] }[]; }

function mkKompetensi(t: KompTemplate): Kompetensi[] {
  return t.items.map((item, i) => ({
    id: `komp_${t.mapelId}_${i + 1}`,
    mapelId: t.mapelId, mapelNama: t.mapelNama,
    kode: item.kode, nama: item.nama,
    skalaMin: 0, skalaMax: 100, isArchived: false, tahunAjaran: '2026/2027',
    createdAt: '2026-07-01',
    indikator: item.indikator.map((ind, j) => ({
      id: `ind_${t.mapelId}_${i + 1}_${j + 1}`,
      kompetensiId: `komp_${t.mapelId}_${i + 1}`,
      kode: ind.kode, nama: ind.nama,
    })),
  }));
}

export const dummyKompetensi: Kompetensi[] = [
  // mp1 - Bahasa Indonesia
  ...mkKompetensi({ mapelId: 'mp1', mapelNama: 'BAHASA INDONESIA', items: [
    { kode: 'TP 1', nama: 'Teks Laporan Hasil Observasi', indikator: [{ kode: 'TP 1.1', nama: 'Mengidentifikasi struktur teks laporan' }, { kode: 'TP 1.2', nama: 'Menyusun teks laporan observasi' }] },
    { kode: 'TP 2', nama: 'Teks Eksposisi', indikator: [{ kode: 'TP 2.1', nama: 'Menganalisis argumentasi dalam teks' }] },
    { kode: 'TP 3', nama: 'Puisi', indikator: [{ kode: 'TP 3.1', nama: 'Mengidentifikasi unsur pembangun puisi' }, { kode: 'TP 3.2', nama: 'Menulis puisi bertema' }] },
  ]}),
  // mp2 - Bahasa Inggris
  ...mkKompetensi({ mapelId: 'mp2', mapelNama: 'BAHASA INGGRIS', items: [
    { kode: 'TP 1', nama: 'Descriptive Text', indikator: [{ kode: 'TP 1.1', nama: 'Mengidentifikasi generic structure' }, { kode: 'TP 1.2', nama: 'Menulis descriptive text' }] },
    { kode: 'TP 2', nama: 'Narrative Text', indikator: [{ kode: 'TP 2.1', nama: 'Menganalisis unsur naratif' }] },
  ]}),
  // mp3 - Matematika
  ...mkKompetensi({ mapelId: 'mp3', mapelNama: 'MATEMATIKA', items: [
    { kode: 'TP 1', nama: 'Operasi Al Jabar', indikator: [{ kode: 'TP 1.1', nama: 'Linier 1 variabel' }] },
    { kode: 'TP 2', nama: 'Geometri Dasar', indikator: [{ kode: 'TP 2.1', nama: 'Mengenal bangun datar' }, { kode: 'TP 2.2', nama: 'Menghitung luas dan keliling' }] },
    { kode: 'TP 3', nama: 'Statistika', indikator: [] },
  ]}),
  // mp4 - Sejarah Indonesia
  ...mkKompetensi({ mapelId: 'mp4', mapelNama: 'SEJARAH INDONESIA', items: [
    { kode: 'TP 1', nama: 'Kerajaan Hindu-Buddha', indikator: [{ kode: 'TP 1.1', nama: 'Mengidentifikasi peninggalan kerajaan' }, { kode: 'TP 1.2', nama: 'Menganalisis sistem pemerintahan' }] },
    { kode: 'TP 2', nama: 'Kolonialisme & Imperialisme', indikator: [{ kode: 'TP 2.1', nama: 'Menjelaskan dampak kolonialisme' }] },
    { kode: 'TP 3', nama: 'Proklamasi Kemerdekaan', indikator: [{ kode: 'TP 3.1', nama: 'Kronologi peristiwa proklamasi' }] },
  ]}),
  // mp5 - PPKn
  ...mkKompetensi({ mapelId: 'mp5', mapelNama: 'PPKN', items: [
    { kode: 'TP 1', nama: 'Hak & Kewajiban Warga Negara', indikator: [{ kode: 'TP 1.1', nama: 'Mengidentifikasi hak asasi manusia' }] },
    { kode: 'TP 2', nama: 'Pancasila', indikator: [{ kode: 'TP 2.1', nama: 'Menerapkan nilai Pancasila' }, { kode: 'TP 2.2', nama: 'Menganalisis kasus pelanggaran Pancasila' }] },
  ]}),
  // mp6 - PJOK
  ...mkKompetensi({ mapelId: 'mp6', mapelNama: 'PJOK', items: [
    { kode: 'TP 1', nama: 'Permainan Bola Besar', indikator: [{ kode: 'TP 1.1', nama: 'Teknik dasar sepak bola' }, { kode: 'TP 1.2', nama: 'Teknik dasar bola basket' }] },
    { kode: 'TP 2', nama: 'Kebugaran Jasmani', indikator: [{ kode: 'TP 2.1', nama: 'Latihan kekuatan otot' }] },
  ]}),
  // mp7 - Seni Budaya
  ...mkKompetensi({ mapelId: 'mp7', mapelNama: 'SENI BUDAYA', items: [
    { kode: 'TP 1', nama: 'Seni Rupa Dua Dimensi', indikator: [{ kode: 'TP 1.1', nama: 'Menggambar bentuk dasar' }, { kode: 'TP 1.2', nama: 'Mewarnai dengan teknik gradasi' }] },
    { kode: 'TP 2', nama: 'Seni Musik Tradisional', indikator: [{ kode: 'TP 2.1', nama: 'Mengenal alat musik daerah' }] },
  ]}),
  // mp8 - Prakarya & Kewirausahaan
  ...mkKompetensi({ mapelId: 'mp8', mapelNama: 'PRAKARYA & KEWIRAUSAHAAN', items: [
    { kode: 'TP 1', nama: 'Kerajinan Bahan Lunak', indikator: [{ kode: 'TP 1.1', nama: 'Membuat clay dari tepung' }] },
    { kode: 'TP 2', nama: 'Budidaya Tanaman', indikator: [{ kode: 'TP 2.1', nama: 'Teknik penyemaian benih' }, { kode: 'TP 2.2', nama: 'Perawatan tanaman hias' }] },
    { kode: 'TP 3', nama: 'Dasar Kewirausahaan', indikator: [] },
  ]}),
  // mp9 - Pendidikan Agama Islam
  ...mkKompetensi({ mapelId: 'mp9', mapelNama: 'PENDIDIKAN AGAMA ISLAM', items: [
    { kode: 'TP 1', nama: 'Al-Qur\'an dan Hadits', indikator: [{ kode: 'TP 1.1', nama: 'Membaca Al-Qur\'an dengan tajwid' }, { kode: 'TP 1.2', nama: 'Menghafal surat pendek' }] },
    { kode: 'TP 2', nama: 'Aqidah Akhlak', indikator: [{ kode: 'TP 2.1', nama: 'Memahami sifat wajib Allah' }] },
    { kode: 'TP 3', nama: 'Fiqih Ibadah', indikator: [{ kode: 'TP 3.1', nama: 'Tata cara wudhu dan shalat' }, { kode: 'TP 3.2', nama: 'Praktik shalat berjamaah' }] },
  ]}),
  // mp10 - Sirah Nabawiyah
  ...mkKompetensi({ mapelId: 'mp10', mapelNama: 'SIRAH NABAWIYAH', items: [
    { kode: 'TP 1', nama: 'Periode Mekah', indikator: [{ kode: 'TP 1.1', nama: 'Kelahiran dan masa kecil Nabi' }] },
    { kode: 'TP 2', nama: 'Periode Madinah', indikator: [{ kode: 'TP 2.1', nama: 'Hijrah dan pembentukan negara Madinah' }, { kode: 'TP 2.2', nama: 'Perang Badar dan Uhud' }] },
  ]}),
  // mp11 - Bina Pribadi Islam
  ...mkKompetensi({ mapelId: 'mp11', mapelNama: 'BINA PRIBADI ISLAM', items: [
    { kode: 'TP 1', nama: 'Adab dan Akhlak Islami', indikator: [{ kode: 'TP 1.1', nama: 'Adab terhadap orang tua dan guru' }] },
    { kode: 'TP 2', nama: 'Ibadah Harian', indikator: [{ kode: 'TP 2.1', nama: 'Doa harian dan dzikir' }] },
  ]}),
  // mp12 - Bahasa Arab
  ...mkKompetensi({ mapelId: 'mp12', mapelNama: 'BAHASA ARAB', items: [
    { kode: 'TP 1', nama: 'Hiwar (Percakapan)', indikator: [{ kode: 'TP 1.1', nama: 'Percakapan perkenalan' }] },
    { kode: 'TP 2', nama: 'Qira\'ah (Membaca)', indikator: [{ kode: 'TP 2.1', nama: 'Membaca teks Arab sederhana' }, { kode: 'TP 2.2', nama: 'Menerjemahkan kosakata' }] },
  ]}),
  // mp13 - Teknologi Informasi
  ...mkKompetensi({ mapelId: 'mp13', mapelNama: 'TEKNOLOGI INFORMASI', items: [
    { kode: 'TP 1', nama: 'Pengenalan Komputer', indikator: [{ kode: 'TP 1.1', nama: 'Hardware dan software dasar' }] },
    { kode: 'TP 2', nama: 'Microsoft Office', indikator: [{ kode: 'TP 2.1', nama: 'Membuat dokumen Word' }, { kode: 'TP 2.2', nama: 'Membuat presentasi PowerPoint' }] },
    { kode: 'TP 3', nama: 'Internet dan Jaringan', indikator: [{ kode: 'TP 3.1', nama: 'Dasar-dasar browsing dan email' }] },
  ]}),
  // mp14 - Bahasa Jawa
  ...mkKompetensi({ mapelId: 'mp14', mapelNama: 'BAHASA JAWA', items: [
    { kode: 'TP 1', nama: 'Unggah-Ungguh Basa', indikator: [{ kode: 'TP 1.1', nama: 'Ngoko, krama madya, krama inggil' }] },
    { kode: 'TP 2', nama: 'Aksara Jawa', indikator: [{ kode: 'TP 2.1', nama: 'Membaca dan menulis aksara Jawa' }] },
  ]}),
  // mp15 - Fisika
  ...mkKompetensi({ mapelId: 'mp15', mapelNama: 'FISIKA', items: [
    { kode: 'TP 1', nama: 'Kinematika Gerak Lurus', indikator: [{ kode: 'TP 1.1', nama: 'Menghitung kecepatan dan percepatan' }, { kode: 'TP 1.2', nama: 'Menganalisis grafik GLB dan GLBB' }] },
    { kode: 'TP 2', nama: 'Hukum Newton', indikator: [{ kode: 'TP 2.1', nama: 'Menerapkan hukum I, II, III Newton' }] },
    { kode: 'TP 3', nama: 'Usaha dan Energi', indikator: [{ kode: 'TP 3.1', nama: 'Menghitung usaha dan energi kinetik' }] },
  ]}),
  // mp16 - Kimia
  ...mkKompetensi({ mapelId: 'mp16', mapelNama: 'KIMIA', items: [
    { kode: 'TP 1', nama: 'Struktur Atom', indikator: [{ kode: 'TP 1.1', nama: 'Mengidentifikasi partikel subatom' }, { kode: 'TP 1.2', nama: 'Menulis konfigurasi elektron' }] },
    { kode: 'TP 2', nama: 'Ikatan Kimia', indikator: [{ kode: 'TP 2.1', nama: 'Membedakan ikatan ion dan kovalen' }] },
  ]}),
  // mp17 - Biologi
  ...mkKompetensi({ mapelId: 'mp17', mapelNama: 'BIOLOGI', items: [
    { kode: 'TP 1', nama: 'Sel dan Jaringan', indikator: [{ kode: 'TP 1.1', nama: 'Mengidentifikasi organel sel' }, { kode: 'TP 1.2', nama: 'Membedakan sel hewan dan tumbuhan' }] },
    { kode: 'TP 2', nama: 'Ekosistem', indikator: [{ kode: 'TP 2.1', nama: 'Rantai makanan dan jaring makanan' }] },
  ]}),
  // mp18 - Ekonomi
  ...mkKompetensi({ mapelId: 'mp18', mapelNama: 'EKONOMI', items: [
    { kode: 'TP 1', nama: 'Konsep Dasar Ekonomi', indikator: [{ kode: 'TP 1.1', nama: 'Kelangkaan dan pilihan' }, { kode: 'TP 1.2', nama: 'Biaya peluang' }] },
    { kode: 'TP 2', nama: 'Permintaan dan Penawaran', indikator: [{ kode: 'TP 2.1', nama: 'Kurva permintaan dan penawaran' }] },
  ]}),
  // mp19 - Geografi
  ...mkKompetensi({ mapelId: 'mp19', mapelNama: 'GEOGRAFI', items: [
    { kode: 'TP 1', nama: 'Pengetahuan Dasar Geografi', indikator: [{ kode: 'TP 1.1', nama: 'Konsep dan pendekatan geografi' }] },
    { kode: 'TP 2', nama: 'Litosfer dan Pedosfer', indikator: [{ kode: 'TP 2.1', nama: 'Struktur lapisan bumi' }, { kode: 'TP 2.2', nama: 'Jenis-jenis tanah' }] },
  ]}),
  // mp20 - Sosiologi
  ...mkKompetensi({ mapelId: 'mp20', mapelNama: 'SOSIOLOGI', items: [
    { kode: 'TP 1', nama: 'Interaksi Sosial', indikator: [{ kode: 'TP 1.1', nama: 'Bentuk-bentuk interaksi sosial' }] },
    { kode: 'TP 2', nama: 'Stratifikasi Sosial', indikator: [{ kode: 'TP 2.1', nama: 'Diferensiasi dan stratifikasi' }, { kode: 'TP 2.2', nama: 'Mobilitas sosial' }] },
  ]}),
];

// ==================== Pengaturan Mapel: Predikat dan KKM per Kelas ====================

function mkKelasPredikat(mapelId: string, kkmDefault: number, kelasList: { id: string; nama: string; label: string; tingkat: string; kkm: number; predikat: { nama: string; deskripsi: string; min: number; max: number }[] }[]): KelasPredikat[] {
  return kelasList.map(k => ({
    id: `kpr_${mapelId}_${k.id}`, mapelId, kelasId: k.id, kelasNama: k.nama, labelKelas: k.label, tingkat: k.tingkat,
    tahunAjaran: '2026/2027', kkm: k.kkm,
    predikat: k.predikat.map((p, i) => ({
      id: `pr_${mapelId}_${k.id}_${i + 1}`, kelasPredikatId: `kpr_${mapelId}_${k.id}`,
      nama: p.nama, deskripsi: p.deskripsi, nilaiMin: p.min, nilaiMax: p.max, alias: '',
    })),
  }));
}

const defaultPredikat = [
  { nama: 'A', deskripsi: 'Sangat Baik', min: 90, max: 100 },
  { nama: 'B', deskripsi: 'Baik', min: 75, max: 89 },
  { nama: 'C', deskripsi: 'Cukup', min: 60, max: 74 },
  { nama: 'D', deskripsi: 'Kurang', min: 0, max: 59 },
];

const minimalPredikat = [
  { nama: 'A', deskripsi: 'Sangat Baik', min: 90, max: 100 },
  { nama: 'B', deskripsi: 'Baik', min: 75, max: 89 },
];

const kkmMap: Record<string, number> = {
  mp1: 75, mp2: 75, mp3: 75, mp4: 75, mp5: 75, mp6: 70, mp7: 70, mp8: 70,
  mp9: 78, mp10: 75, mp11: 75, mp12: 72, mp13: 70, mp14: 70,
  mp15: 76, mp16: 76, mp17: 75, mp18: 75, mp19: 75, mp20: 75,
};

export const dummyKelasPredikat: KelasPredikat[] = [
  // mp1 - Bahasa Indonesia
  ...mkKelasPredikat('mp1', 75, [
    { ...baseKelas[0], kkm: 75, predikat: defaultPredikat },
    { ...baseKelas[1], kkm: 75, predikat: minimalPredikat },
    { ...baseKelas[2], kkm: 76, predikat: defaultPredikat },
  ]),
  // mp2 - Bahasa Inggris
  ...mkKelasPredikat('mp2', 75, [
    { ...baseKelas[0], kkm: 75, predikat: defaultPredikat },
    { ...baseKelas[1], kkm: 74, predikat: minimalPredikat },
    { ...baseKelas[2], kkm: 75, predikat: defaultPredikat },
  ]),
  // mp3 - Matematika
  ...mkKelasPredikat('mp3', 75, [
    { ...baseKelas[0], kkm: 75, predikat: minimalPredikat },
    { ...baseKelas[1], kkm: 75, predikat: [{ nama: 'A', deskripsi: 'Sangat Baik', min: 90, max: 100 }] },
    { ...baseKelas[2], kkm: 75, predikat: defaultPredikat },
  ]),
  // mp4 - Sejarah Indonesia
  ...mkKelasPredikat('mp4', 75, [
    { ...baseKelas[0], kkm: 75, predikat: defaultPredikat },
    { ...baseKelas[1], kkm: 73, predikat: [] },
    { ...baseKelas[2], kkm: 75, predikat: minimalPredikat },
  ]),
  // mp5 - PPKn
  ...mkKelasPredikat('mp5', 75, [
    { ...baseKelas[0], kkm: 75, predikat: minimalPredikat },
    { ...baseKelas[1], kkm: 75, predikat: defaultPredikat },
    { ...baseKelas[2], kkm: 76, predikat: defaultPredikat },
  ]),
  // mp6 - PJOK
  ...mkKelasPredikat('mp6', 70, [
    { ...baseKelas[0], kkm: 70, predikat: minimalPredikat },
    { ...baseKelas[1], kkm: 70, predikat: minimalPredikat },
    { ...baseKelas[2], kkm: 72, predikat: defaultPredikat },
  ]),
  // mp7 - Seni Budaya
  ...mkKelasPredikat('mp7', 70, [
    { ...baseKelas[0], kkm: 70, predikat: [] },
    { ...baseKelas[1], kkm: 70, predikat: minimalPredikat },
    { ...baseKelas[2], kkm: 70, predikat: minimalPredikat },
  ]),
  // mp8 - Prakarya
  ...mkKelasPredikat('mp8', 70, [
    { ...baseKelas[0], kkm: 70, predikat: minimalPredikat },
    { ...baseKelas[1], kkm: 70, predikat: minimalPredikat },
    { ...baseKelas[2], kkm: 72, predikat: defaultPredikat },
  ]),
  // mp9 - PAI
  ...mkKelasPredikat('mp9', 78, [
    { ...baseKelas[0], kkm: 78, predikat: defaultPredikat },
    { ...baseKelas[1], kkm: 78, predikat: defaultPredikat },
    { ...baseKelas[2], kkm: 80, predikat: defaultPredikat },
  ]),
  // mp10 - Sirah Nabawiyah
  ...mkKelasPredikat('mp10', 75, [
    { ...baseKelas[0], kkm: 75, predikat: minimalPredikat },
    { ...baseKelas[1], kkm: 75, predikat: minimalPredikat },
    { ...baseKelas[2], kkm: 75, predikat: defaultPredikat },
  ]),
  // mp11 - BPI
  ...mkKelasPredikat('mp11', 75, [
    { ...baseKelas[0], kkm: 75, predikat: defaultPredikat },
    { ...baseKelas[1], kkm: 75, predikat: minimalPredikat },
    { ...baseKelas[2], kkm: 75, predikat: [] },
  ]),
  // mp12 - Bahasa Arab
  ...mkKelasPredikat('mp12', 72, [
    { ...baseKelas[0], kkm: 72, predikat: minimalPredikat },
    { ...baseKelas[1], kkm: 70, predikat: minimalPredikat },
    { ...baseKelas[2], kkm: 72, predikat: defaultPredikat },
  ]),
  // mp13 - TIK
  ...mkKelasPredikat('mp13', 70, [
    { ...baseKelas[0], kkm: 70, predikat: defaultPredikat },
    { ...baseKelas[1], kkm: 70, predikat: minimalPredikat },
    { ...baseKelas[2], kkm: 72, predikat: defaultPredikat },
  ]),
  // mp14 - Bahasa Jawa
  ...mkKelasPredikat('mp14', 70, [
    { ...baseKelas[0], kkm: 70, predikat: minimalPredikat },
    { ...baseKelas[1], kkm: 70, predikat: [] },
    { ...baseKelas[2], kkm: 70, predikat: minimalPredikat },
  ]),
  // mp15 - Fisika
  ...mkKelasPredikat('mp15', 76, [
    { ...baseKelas[0], kkm: 76, predikat: defaultPredikat },
    { ...baseKelas[1], kkm: 75, predikat: minimalPredikat },
    { ...baseKelas[2], kkm: 76, predikat: defaultPredikat },
  ]),
  // mp16 - Kimia
  ...mkKelasPredikat('mp16', 76, [
    { ...baseKelas[0], kkm: 76, predikat: minimalPredikat },
    { ...baseKelas[1], kkm: 75, predikat: defaultPredikat },
    { ...baseKelas[2], kkm: 76, predikat: defaultPredikat },
  ]),
  // mp17 - Biologi
  ...mkKelasPredikat('mp17', 75, [
    { ...baseKelas[0], kkm: 75, predikat: defaultPredikat },
    { ...baseKelas[1], kkm: 75, predikat: minimalPredikat },
    { ...baseKelas[2], kkm: 75, predikat: defaultPredikat },
  ]),
  // mp18 - Ekonomi
  ...mkKelasPredikat('mp18', 75, [
    { ...baseKelas[0], kkm: 75, predikat: minimalPredikat },
    { ...baseKelas[1], kkm: 74, predikat: defaultPredikat },
    { ...baseKelas[2], kkm: 75, predikat: defaultPredikat },
  ]),
  // mp19 - Geografi
  ...mkKelasPredikat('mp19', 75, [
    { ...baseKelas[0], kkm: 75, predikat: defaultPredikat },
    { ...baseKelas[1], kkm: 75, predikat: minimalPredikat },
    { ...baseKelas[2], kkm: 75, predikat: [] },
  ]),
  // mp20 - Sosiologi
  ...mkKelasPredikat('mp20', 75, [
    { ...baseKelas[0], kkm: 75, predikat: minimalPredikat },
    { ...baseKelas[1], kkm: 75, predikat: defaultPredikat },
    { ...baseKelas[2], kkm: 76, predikat: defaultPredikat },
  ]),
];

// ==================== Kompetensi Ekstrakurikuler ====================

interface EkstraKompTemplate {
  ekstraId: string; ekstraNama: string;
  items: { kode: string; nama: string; indikator: { kode: string; nama: string }[] }[];
}

function mkEkstraKompetensi(t: EkstraKompTemplate): EkstraKompetensi[] {
  return t.items.map((item, i) => ({
    id: `ekomp_${t.ekstraId}_${i + 1}`,
    ekstraId: t.ekstraId, ekstraNama: t.ekstraNama,
    kode: item.kode, nama: item.nama,
    skalaMin: 0, skalaMax: 100, isArchived: false, tahunAjaran: '2026/2027',
    createdAt: '2026-07-01',
    indikator: item.indikator.map((ind, j) => ({
      id: `eind_${t.ekstraId}_${i + 1}_${j + 1}`,
      ekstraKompetensiId: `ekomp_${t.ekstraId}_${i + 1}`,
      kode: ind.kode, nama: ind.nama,
    })),
  }));
}

export const dummyEkstraKompetensi: EkstraKompetensi[] = [
  // ek8 - Basket
  ...mkEkstraKompetensi({ ekstraId: 'ek8', ekstraNama: 'Basket', items: [
    { kode: 'TP 1', nama: 'lay up dan scoring', indikator: [{ kode: 'TP 1.1', nama: 'Teknik dasar lay up' }] },
    { kode: 'TP 2', nama: '3 point shoot', indikator: [{ kode: 'TP 2.1', nama: 'Posisi tangan dan kaki' }, { kode: 'TP 2.2', nama: 'Akurasi tembakan' }] },
  ]}),
  // ek7 - Futsal
  ...mkEkstraKompetensi({ ekstraId: 'ek7', ekstraNama: 'Futsal', items: [
    { kode: 'TP 1', nama: 'Dribbling dan kontrol bola', indikator: [{ kode: 'TP 1.1', nama: 'Dribbling zig-zag' }, { kode: 'TP 1.2', nama: 'Kontrol bola dengan kaki' }] },
    { kode: 'TP 2', nama: 'Shooting dan passing', indikator: [{ kode: 'TP 2.1', nama: 'Teknik shooting ke gawang' }] },
  ]}),
  // ek9 - Pencak Silat
  ...mkEkstraKompetensi({ ekstraId: 'ek9', ekstraNama: 'Pencak Silat', items: [
    { kode: 'TP 1', nama: 'Kuda-kuda dan sikap dasar', indikator: [{ kode: 'TP 1.1', nama: 'Kuda-kuda depan, belakang, samping' }] },
    { kode: 'TP 2', nama: 'Tendangan dan pukulan', indikator: [{ kode: 'TP 2.1', nama: 'Tendangan T' }, { kode: 'TP 2.2', nama: 'Pukulan lurus' }] },
    { kode: 'TP 3', nama: 'Jurus dasar Tapak Suci', indikator: [{ kode: 'TP 3.1', nama: 'Jurus 1-3' }] },
  ]}),
  // ek4 - Paduan Suara
  ...mkEkstraKompetensi({ ekstraId: 'ek4', ekstraNama: 'Paduan Suara', items: [
    { kode: 'TP 1', nama: 'Teknik vokal dasar', indikator: [{ kode: 'TP 1.1', nama: 'Pernapasan diafragma' }, { kode: 'TP 1.2', nama: 'Artikulasi dan intonasi' }] },
    { kode: 'TP 2', nama: 'Harmoni dan blending', indikator: [{ kode: 'TP 2.1', nama: 'Menyanyi dalam kelompok' }] },
  ]}),
  // ek12 - Tilawah & Tahfidz
  ...mkEkstraKompetensi({ ekstraId: 'ek12', ekstraNama: 'Tilawah & Tahfidz', items: [
    { kode: 'TP 1', nama: 'Tajwid dasar', indikator: [{ kode: 'TP 1.1', nama: 'Hukum nun mati dan tanwin' }, { kode: 'TP 1.2', nama: 'Hukum mim mati' }] },
    { kode: 'TP 2', nama: 'Hafalan juz 30', indikator: [{ kode: 'TP 2.1', nama: 'Surat An-Naba s.d. Al-Buruj' }] },
  ]}),
];

// ======================================================================
// ==================== INPUT NILAI RAPOR — DUMMY DATA ====================
// ======================================================================

// --- Kelas untuk input nilai ---
export interface KelasNilai {
  id: string;
  nama: string;
  tingkat: string;
  jumlahSiswa: number;
}

export const dummyKelasNilai: KelasNilai[] = [
  { id: 'kls1', nama: 'VII-A', tingkat: '7', jumlahSiswa: 6 },
  { id: 'kls2', nama: 'VII-B', tingkat: '7', jumlahSiswa: 3 },
  { id: 'kls3', nama: 'VIII-A', tingkat: '8', jumlahSiswa: 3 },
  { id: 'kls4', nama: 'VIII-B', tingkat: '8', jumlahSiswa: 2 },
  { id: 'kls5', nama: 'IX-A', tingkat: '9', jumlahSiswa: 5 },
  { id: 'kls6', nama: 'IX-B', tingkat: '9', jumlahSiswa: 4 },
];

// --- Siswa dalam kelas untuk input nilai ---
export interface SiswaNilai {
  id: string;
  nis: string;
  nama: string;
  kelasId: string;
}

export const dummySiswaNilai: SiswaNilai[] = [
  // VII-A (6 siswa)
  { id: 'sn1', nis: '2024001', nama: 'Ahmad Fauzi', kelasId: 'kls1' },
  { id: 'sn2', nis: '2024002', nama: 'Budi Santoso', kelasId: 'kls1' },
  { id: 'sn3', nis: '2024003', nama: 'Citra Dewi', kelasId: 'kls1' },
  { id: 'sn4', nis: '2024004', nama: 'Dini Rahayu', kelasId: 'kls1' },
  { id: 'sn5', nis: '2024005', nama: 'Eko Prasetyo', kelasId: 'kls1' },
  { id: 'sn6', nis: '2024006', nama: 'Fitri Handayani', kelasId: 'kls1' },
  // VII-B (3 siswa)
  { id: 'sn7', nis: '2024007', nama: 'Gilang Ramadhan', kelasId: 'kls2' },
  { id: 'sn8', nis: '2024008', nama: 'Hana Safira', kelasId: 'kls2' },
  { id: 'sn9', nis: '2024009', nama: 'Irfan Maulana', kelasId: 'kls2' },
  // VIII-A (3 siswa)
  { id: 'sn10', nis: '2023001', nama: 'Joko Widodo', kelasId: 'kls3' },
  { id: 'sn11', nis: '2023002', nama: 'Kartika Sari', kelasId: 'kls3' },
  { id: 'sn12', nis: '2023003', nama: 'Lutfi Hakim', kelasId: 'kls3' },
  // VIII-B (2 siswa)
  { id: 'sn13', nis: '2023004', nama: 'Mega Putri', kelasId: 'kls4' },
  { id: 'sn14', nis: '2023005', nama: 'Nanda Pratama', kelasId: 'kls4' },
  // IX-A (5 siswa)
  { id: 'sn15', nis: '2022001', nama: 'Olivia Dewi', kelasId: 'kls5' },
  { id: 'sn16', nis: '2022002', nama: 'Putra Wijaya', kelasId: 'kls5' },
  { id: 'sn17', nis: '2022003', nama: 'Qonita Azzahra', kelasId: 'kls5' },
  { id: 'sn18', nis: '2022004', nama: 'Rizky Febrian', kelasId: 'kls5' },
  { id: 'sn19', nis: '2022005', nama: 'Sinta Dewi', kelasId: 'kls5' },
  // IX-B (4 siswa)
  { id: 'sn20', nis: '2022006', nama: 'Tegar Prasetya', kelasId: 'kls6' },
  { id: 'sn21', nis: '2022007', nama: 'Umar Bakri', kelasId: 'kls6' },
  { id: 'sn22', nis: '2022008', nama: 'Vina Amelia', kelasId: 'kls6' },
  { id: 'sn23', nis: '2022009', nama: 'Wahyu Hidayat', kelasId: 'kls6' },
];

// --- KD count per mapel (dummy) ---
export const dummyMapelKDCount: Record<string, number> = {
  mp1: 8, mp2: 7, mp3: 6, mp4: 5, mp5: 5,
  mp6: 4, mp7: 4, mp8: 3, mp9: 6, mp10: 4,
  mp11: 3, mp12: 5, mp13: 4, mp14: 3, mp15: 6,
  mp16: 5, mp17: 6, mp18: 5, mp19: 4, mp20: 4,
};

// --- Kompetensi & Indikator untuk input nilai (SEMUA mapel) ---
export interface IndikatorNilai {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
}

export interface KompetensiNilai {
  id: string;
  mapelId: string;
  kode: string;
  nama: string;
  indikator: IndikatorNilai[];
}

// Helper to generate kompetensi for a given mapel
function mkKN(mapelId: string, items: { kode: string; nama: string; indikator: { kode: string; deskripsi: string }[] }[]): KompetensiNilai[] {
  let idx = 0;
  return items.map((item, i) => ({
    id: `kn_${mapelId}_${i + 1}`,
    mapelId,
    kode: item.kode,
    nama: item.nama,
    indikator: item.indikator.map(ind => ({
      id: `ind_${mapelId}_${++idx}`,
      kode: ind.kode,
      nama: item.nama,
      deskripsi: ind.deskripsi,
    })),
  }));
}

export const dummyKompetensiNilai: KompetensiNilai[] = [
  // ── mp1: Bahasa Indonesia ──
  ...mkKN('mp1', [
    { kode: '3.1', nama: 'Teks Laporan', indikator: [
      { kode: '3.1.1', deskripsi: 'Mengidentifikasi struktur teks laporan hasil observasi' },
      { kode: '3.1.2', deskripsi: 'Menganalisis isi dan kebahasaan teks laporan hasil observasi' },
      { kode: '3.1.3', deskripsi: 'Menyusun teks laporan hasil observasi secara tepat' },
    ]},
    { kode: '3.2', nama: 'Teks Eksposisi', indikator: [
      { kode: '3.2.1', deskripsi: 'Mengidentifikasi struktur teks eksposisi' },
      { kode: '3.2.2', deskripsi: 'Menganalisis argumen dalam teks eksposisi' },
      { kode: '3.2.3', deskripsi: 'Menyusun teks eksposisi dengan argumen logis' },
    ]},
    { kode: '3.3', nama: 'Teks Anekdot', indikator: [
      { kode: '3.3.1', deskripsi: 'Memahami struktur dan kaidah teks anekdot' },
      { kode: '3.3.2', deskripsi: 'Mengidentifikasi kritik dan humor dalam teks anekdot' },
    ]},
    { kode: '3.4', nama: 'Teks Cerita Sejarah', indikator: [
      { kode: '3.4.1', deskripsi: 'Mengidentifikasi nilai-nilai dalam teks cerita sejarah' },
      { kode: '3.4.2', deskripsi: 'Menganalisis kebahasaan teks cerita sejarah' },
      { kode: '3.4.3', deskripsi: 'Menulis teks cerita sejarah berdasarkan fakta' },
    ]},
    { kode: '3.5', nama: 'Puisi', indikator: [
      { kode: '3.5.1', deskripsi: 'Menganalisis unsur pembangun puisi' },
      { kode: '3.5.2', deskripsi: 'Mengidentifikasi tema dan amanat puisi' },
      { kode: '3.5.3', deskripsi: 'Menulis puisi dengan memperhatikan diksi dan majas' },
    ]},
  ]),
  // ── mp2: Bahasa Inggris ──
  ...mkKN('mp2', [
    { kode: '3.1', nama: 'Descriptive Text', indikator: [
      { kode: '3.1.1', deskripsi: 'Identifying the generic structure of descriptive text' },
      { kode: '3.1.2', deskripsi: 'Analyzing language features of descriptive text' },
      { kode: '3.1.3', deskripsi: 'Writing a descriptive text about a place' },
    ]},
    { kode: '3.2', nama: 'Recount Text', indikator: [
      { kode: '3.2.1', deskripsi: 'Identifying the structure of recount text' },
      { kode: '3.2.2', deskripsi: 'Using past tense correctly in recount text' },
      { kode: '3.2.3', deskripsi: 'Writing a personal recount text' },
    ]},
    { kode: '3.3', nama: 'Narrative Text', indikator: [
      { kode: '3.3.1', deskripsi: 'Identifying orientation, complication, and resolution' },
      { kode: '3.3.2', deskripsi: 'Analyzing moral values in narrative text' },
    ]},
    { kode: '3.4', nama: 'Procedure Text', indikator: [
      { kode: '3.4.1', deskripsi: 'Identifying imperative sentences in procedure text' },
      { kode: '3.4.2', deskripsi: 'Writing a procedure text step by step' },
    ]},
  ]),
  // ── mp3: Matematika ──
  ...mkKN('mp3', [
    { kode: '3.1', nama: 'Operasi Bilangan', indikator: [
      { kode: '3.1.1', deskripsi: 'Menjelaskan konsep bilangan bulat positif dan negatif' },
      { kode: '3.1.2', deskripsi: 'Melakukan operasi penjumlahan dan pengurangan bilangan bulat' },
      { kode: '3.1.3', deskripsi: 'Melakukan operasi perkalian dan pembagian bilangan bulat' },
      { kode: '3.1.4', deskripsi: 'Menyelesaikan masalah kontekstual terkait bilangan bulat' },
    ]},
    { kode: '3.2', nama: 'Pecahan', indikator: [
      { kode: '3.2.1', deskripsi: 'Menjelaskan konsep pecahan dan jenis-jenisnya' },
      { kode: '3.2.2', deskripsi: 'Melakukan operasi hitung pada pecahan' },
      { kode: '3.2.3', deskripsi: 'Mengubah pecahan ke bentuk desimal dan persen' },
    ]},
    { kode: '3.3', nama: 'Aljabar', indikator: [
      { kode: '3.3.1', deskripsi: 'Mengenal bentuk aljabar dan unsur-unsurnya' },
      { kode: '3.3.2', deskripsi: 'Melakukan operasi penjumlahan dan pengurangan bentuk aljabar' },
      { kode: '3.3.3', deskripsi: 'Melakukan operasi perkalian dan pembagian bentuk aljabar' },
    ]},
    { kode: '3.4', nama: 'Persamaan Linear', indikator: [
      { kode: '3.4.1', deskripsi: 'Menjelaskan konsep persamaan linear satu variabel' },
      { kode: '3.4.2', deskripsi: 'Menyelesaikan persamaan linear satu variabel' },
      { kode: '3.4.3', deskripsi: 'Membuat model matematika dari masalah kontekstual' },
      { kode: '3.4.4', deskripsi: 'Menyelesaikan masalah kontekstual terkait persamaan linear' },
    ]},
    { kode: '3.5', nama: 'Perbandingan', indikator: [
      { kode: '3.5.1', deskripsi: 'Menjelaskan konsep perbandingan senilai dan berbalik nilai' },
      { kode: '3.5.2', deskripsi: 'Menyelesaikan masalah perbandingan senilai' },
      { kode: '3.5.3', deskripsi: 'Menyelesaikan masalah perbandingan berbalik nilai' },
    ]},
  ]),
  // ── mp4: Sejarah Indonesia ──
  ...mkKN('mp4', [
    { kode: '3.1', nama: 'Kerajaan Hindu-Buddha', indikator: [
      { kode: '3.1.1', deskripsi: 'Menjelaskan proses masuknya Hindu-Buddha ke Indonesia' },
      { kode: '3.1.2', deskripsi: 'Menganalisis peninggalan kerajaan Hindu-Buddha' },
      { kode: '3.1.3', deskripsi: 'Membandingkan corak kerajaan Hindu dan Buddha' },
    ]},
    { kode: '3.2', nama: 'Kerajaan Islam', indikator: [
      { kode: '3.2.1', deskripsi: 'Menjelaskan proses islamisasi di Nusantara' },
      { kode: '3.2.2', deskripsi: 'Menganalisis peran Wali Songo dalam penyebaran Islam' },
    ]},
    { kode: '3.3', nama: 'Kolonialisme', indikator: [
      { kode: '3.3.1', deskripsi: 'Menjelaskan kebijakan kolonial Belanda di Indonesia' },
      { kode: '3.3.2', deskripsi: 'Menganalisis dampak sistem tanam paksa' },
      { kode: '3.3.3', deskripsi: 'Mengevaluasi perlawanan rakyat terhadap kolonial' },
    ]},
    { kode: '3.4', nama: 'Pergerakan Nasional', indikator: [
      { kode: '3.4.1', deskripsi: 'Menjelaskan latar belakang pergerakan nasional' },
      { kode: '3.4.2', deskripsi: 'Menganalisis peran organisasi pergerakan nasional' },
    ]},
  ]),
  // ── mp5: PPKn ──
  ...mkKN('mp5', [
    { kode: '3.1', nama: 'Hak dan Kewajiban', indikator: [
      { kode: '3.1.1', deskripsi: 'Memahami hak asasi manusia berdasarkan UUD 1945' },
      { kode: '3.1.2', deskripsi: 'Menganalisis keseimbangan hak dan kewajiban warga negara' },
      { kode: '3.1.3', deskripsi: 'Memberi contoh pelaksanaan hak dan kewajiban di sekolah' },
    ]},
    { kode: '3.2', nama: 'Demokrasi', indikator: [
      { kode: '3.2.1', deskripsi: 'Menjelaskan prinsip-prinsip demokrasi Pancasila' },
      { kode: '3.2.2', deskripsi: 'Menganalisis proses pemilu di Indonesia' },
    ]},
    { kode: '3.3', nama: 'Bhinneka Tunggal Ika', indikator: [
      { kode: '3.3.1', deskripsi: 'Memahami makna Bhinneka Tunggal Ika' },
      { kode: '3.3.2', deskripsi: 'Menganalisis tantangan keberagaman di Indonesia' },
      { kode: '3.3.3', deskripsi: 'Menyusun solusi atas konflik keberagaman' },
    ]},
  ]),
  // ── mp6: PJOK ──
  ...mkKN('mp6', [
    { kode: '3.1', nama: 'Kebugaran Jasmani', indikator: [
      { kode: '3.1.1', deskripsi: 'Menjelaskan komponen kebugaran jasmani' },
      { kode: '3.1.2', deskripsi: 'Melakukan tes kebugaran jasmani sederhana' },
    ]},
    { kode: '3.2', nama: 'Atletik', indikator: [
      { kode: '3.2.1', deskripsi: 'Memahami teknik dasar lari jarak pendek' },
      { kode: '3.2.2', deskripsi: 'Mempraktikkan teknik lompat jauh gaya jongkok' },
      { kode: '3.2.3', deskripsi: 'Menganalisis kesalahan umum dalam tolak peluru' },
    ]},
    { kode: '3.3', nama: 'Permainan Bola', indikator: [
      { kode: '3.3.1', deskripsi: 'Memahami peraturan permainan bola voli' },
      { kode: '3.3.2', deskripsi: 'Mempraktikkan teknik passing dalam bola basket' },
    ]},
  ]),
  // ── mp7: Seni Budaya ──
  ...mkKN('mp7', [
    { kode: '3.1', nama: 'Seni Rupa', indikator: [
      { kode: '3.1.1', deskripsi: 'Menjelaskan unsur-unsur seni rupa dua dimensi' },
      { kode: '3.1.2', deskripsi: 'Menganalisis karya seni rupa berdasarkan prinsip estetika' },
      { kode: '3.1.3', deskripsi: 'Membuat karya seni rupa dengan teknik kolase' },
    ]},
    { kode: '3.2', nama: 'Seni Musik', indikator: [
      { kode: '3.2.1', deskripsi: 'Memahami notasi dan tangga nada dalam musik' },
      { kode: '3.2.2', deskripsi: 'Memainkan alat musik sederhana secara ansambel' },
    ]},
    { kode: '3.3', nama: 'Seni Tari', indikator: [
      { kode: '3.3.1', deskripsi: 'Menjelaskan ragam gerak tari tradisional' },
      { kode: '3.3.2', deskripsi: 'Memperagakan gerak dasar tari daerah setempat' },
    ]},
  ]),
  // ── mp8: Prakarya & Kewirausahaan ──
  ...mkKN('mp8', [
    { kode: '3.1', nama: 'Kerajinan Bahan Lunak', indikator: [
      { kode: '3.1.1', deskripsi: 'Mengidentifikasi jenis bahan lunak alam dan buatan' },
      { kode: '3.1.2', deskripsi: 'Merancang produk kerajinan dari bahan lunak' },
    ]},
    { kode: '3.2', nama: 'Pengolahan Pangan', indikator: [
      { kode: '3.2.1', deskripsi: 'Memahami teknik pengolahan pangan sederhana' },
      { kode: '3.2.2', deskripsi: 'Membuat produk olahan pangan dari bahan lokal' },
      { kode: '3.2.3', deskripsi: 'Menyusun rencana pemasaran produk pangan' },
    ]},
  ]),
  // ── mp9: Pendidikan Agama Islam ──
  ...mkKN('mp9', [
    { kode: '3.1', nama: 'Al-Quran dan Hadis', indikator: [
      { kode: '3.1.1', deskripsi: 'Membaca Al-Quran dengan tajwid yang benar' },
      { kode: '3.1.2', deskripsi: 'Menganalisis kandungan QS. Al-Hujurat ayat 10-12' },
      { kode: '3.1.3', deskripsi: 'Menghafal hadis tentang persaudaraan' },
    ]},
    { kode: '3.2', nama: 'Akidah', indikator: [
      { kode: '3.2.1', deskripsi: 'Menjelaskan rukun iman dan penerapannya' },
      { kode: '3.2.2', deskripsi: 'Menganalisis makna Asmaul Husna dalam kehidupan' },
    ]},
    { kode: '3.3', nama: 'Akhlak', indikator: [
      { kode: '3.3.1', deskripsi: 'Memahami adab berpakaian menurut Islam' },
      { kode: '3.3.2', deskripsi: 'Menerapkan sikap jujur dan amanah dalam keseharian' },
      { kode: '3.3.3', deskripsi: 'Menganalisis dampak pergaulan bebas menurut Islam' },
    ]},
    { kode: '3.4', nama: 'Fiqih', indikator: [
      { kode: '3.4.1', deskripsi: 'Menjelaskan ketentuan shalat fardhu' },
      { kode: '3.4.2', deskripsi: 'Memahami tata cara penyelenggaraan jenazah' },
    ]},
  ]),
  // ── mp10: Sirah Nabawiyah ──
  ...mkKN('mp10', [
    { kode: '3.1', nama: 'Periode Mekah', indikator: [
      { kode: '3.1.1', deskripsi: 'Menjelaskan kondisi Arab sebelum Islam' },
      { kode: '3.1.2', deskripsi: 'Menganalisis strategi dakwah Rasulullah di Mekah' },
      { kode: '3.1.3', deskripsi: 'Mendeskripsikan peristiwa Isra Mi\'raj' },
    ]},
    { kode: '3.2', nama: 'Periode Madinah', indikator: [
      { kode: '3.2.1', deskripsi: 'Menjelaskan isi Piagam Madinah' },
      { kode: '3.2.2', deskripsi: 'Menganalisis perang-perang pada masa Rasulullah' },
    ]},
    { kode: '3.3', nama: 'Khulafaur Rasyidin', indikator: [
      { kode: '3.3.1', deskripsi: 'Mendeskripsikan kepemimpinan Abu Bakar Ash-Shiddiq' },
      { kode: '3.3.2', deskripsi: 'Menganalisis perkembangan Islam masa Umar bin Khattab' },
    ]},
  ]),
  // ── mp11: Bina Pribadi Islam ──
  ...mkKN('mp11', [
    { kode: '3.1', nama: 'Karakter Muslim', indikator: [
      { kode: '3.1.1', deskripsi: 'Memahami konsep syahadatain dalam kehidupan' },
      { kode: '3.1.2', deskripsi: 'Menerapkan sikap disiplin dalam ibadah' },
    ]},
    { kode: '3.2', nama: 'Adab Keseharian', indikator: [
      { kode: '3.2.1', deskripsi: 'Memahami adab makan dan minum sesuai sunnah' },
      { kode: '3.2.2', deskripsi: 'Menerapkan adab kepada orang tua dan guru' },
      { kode: '3.2.3', deskripsi: 'Menganalisis adab bermedia sosial dalam Islam' },
    ]},
  ]),
  // ── mp12: Bahasa Arab ──
  ...mkKN('mp12', [
    { kode: '3.1', nama: 'Isim dan Fi\'il', indikator: [
      { kode: '3.1.1', deskripsi: 'Membedakan isim mudzakkar dan muannats' },
      { kode: '3.1.2', deskripsi: 'Memahami konjugasi fi\'il madhi dan mudhari' },
    ]},
    { kode: '3.2', nama: 'Jumlah Mufidah', indikator: [
      { kode: '3.2.1', deskripsi: 'Menyusun jumlah ismiyyah sederhana' },
      { kode: '3.2.2', deskripsi: 'Menyusun jumlah fi\'liyyah sederhana' },
      { kode: '3.2.3', deskripsi: 'Menerjemahkan kalimat Arab ke bahasa Indonesia' },
    ]},
    { kode: '3.3', nama: 'Percakapan Dasar', indikator: [
      { kode: '3.3.1', deskripsi: 'Melakukan hiwar tentang perkenalan diri' },
      { kode: '3.3.2', deskripsi: 'Membaca teks bahasa Arab tanpa harakat' },
    ]},
  ]),
  // ── mp13: Teknologi Informasi ──
  ...mkKN('mp13', [
    { kode: '3.1', nama: 'Dasar Komputer', indikator: [
      { kode: '3.1.1', deskripsi: 'Menjelaskan komponen perangkat keras komputer' },
      { kode: '3.1.2', deskripsi: 'Memahami sistem operasi dan fungsinya' },
    ]},
    { kode: '3.2', nama: 'Pengolah Kata', indikator: [
      { kode: '3.2.1', deskripsi: 'Menggunakan fitur format dokumen di Ms. Word' },
      { kode: '3.2.2', deskripsi: 'Membuat tabel dan grafik dalam dokumen' },
      { kode: '3.2.3', deskripsi: 'Menerapkan mail merge untuk surat massal' },
    ]},
    { kode: '3.3', nama: 'Pengolah Angka', indikator: [
      { kode: '3.3.1', deskripsi: 'Menggunakan rumus dasar Excel (SUM, AVERAGE, IF)' },
      { kode: '3.3.2', deskripsi: 'Membuat grafik dari data spreadsheet' },
    ]},
  ]),
  // ── mp14: Bahasa Jawa ──
  ...mkKN('mp14', [
    { kode: '3.1', nama: 'Unggah-Ungguh', indikator: [
      { kode: '3.1.1', deskripsi: 'Membedakan basa ngoko, krama madya, dan krama inggil' },
      { kode: '3.1.2', deskripsi: 'Menerapkan unggah-ungguh dalam percakapan sehari-hari' },
    ]},
    { kode: '3.2', nama: 'Aksara Jawa', indikator: [
      { kode: '3.2.1', deskripsi: 'Membaca dan menulis aksara Jawa dasar (carakan)' },
      { kode: '3.2.2', deskripsi: 'Menggunakan sandhangan dan pasangan aksara Jawa' },
      { kode: '3.2.3', deskripsi: 'Menulis paragraf menggunakan aksara Jawa' },
    ]},
  ]),
  // ── mp15: Fisika ──
  ...mkKN('mp15', [
    { kode: '3.1', nama: 'Gerak Lurus', indikator: [
      { kode: '3.1.1', deskripsi: 'Menjelaskan konsep GLB dan GLBB' },
      { kode: '3.1.2', deskripsi: 'Menganalisis grafik kecepatan terhadap waktu' },
      { kode: '3.1.3', deskripsi: 'Menyelesaikan soal gerak lurus beraturan' },
    ]},
    { kode: '3.2', nama: 'Hukum Newton', indikator: [
      { kode: '3.2.1', deskripsi: 'Menjelaskan Hukum Newton I, II, dan III' },
      { kode: '3.2.2', deskripsi: 'Menganalisis gaya gesek dalam kehidupan sehari-hari' },
      { kode: '3.2.3', deskripsi: 'Menyelesaikan soal dinamika partikel' },
    ]},
    { kode: '3.3', nama: 'Usaha dan Energi', indikator: [
      { kode: '3.3.1', deskripsi: 'Menjelaskan hubungan usaha dan energi kinetik' },
      { kode: '3.3.2', deskripsi: 'Menerapkan hukum kekekalan energi mekanik' },
    ]},
    { kode: '3.4', nama: 'Suhu dan Kalor', indikator: [
      { kode: '3.4.1', deskripsi: 'Menjelaskan konsep suhu dan pemuaian' },
      { kode: '3.4.2', deskripsi: 'Menganalisis perubahan wujud zat berdasarkan kalor' },
      { kode: '3.4.3', deskripsi: 'Menghitung kalor jenis dan kapasitas kalor' },
    ]},
  ]),
  // ── mp16: Kimia ──
  ...mkKN('mp16', [
    { kode: '3.1', nama: 'Struktur Atom', indikator: [
      { kode: '3.1.1', deskripsi: 'Menjelaskan perkembangan model atom' },
      { kode: '3.1.2', deskripsi: 'Menentukan konfigurasi elektron berdasarkan kulit' },
    ]},
    { kode: '3.2', nama: 'Ikatan Kimia', indikator: [
      { kode: '3.2.1', deskripsi: 'Membedakan ikatan ion dan ikatan kovalen' },
      { kode: '3.2.2', deskripsi: 'Menggambarkan struktur Lewis suatu molekul' },
      { kode: '3.2.3', deskripsi: 'Menjelaskan sifat senyawa berdasarkan ikatannya' },
    ]},
    { kode: '3.3', nama: 'Stoikiometri', indikator: [
      { kode: '3.3.1', deskripsi: 'Menghitung massa molekul relatif' },
      { kode: '3.3.2', deskripsi: 'Menyetarakan persamaan reaksi kimia' },
      { kode: '3.3.3', deskripsi: 'Menghitung jumlah mol suatu zat' },
    ]},
    { kode: '3.4', nama: 'Larutan Elektrolit', indikator: [
      { kode: '3.4.1', deskripsi: 'Membedakan larutan elektrolit dan non-elektrolit' },
      { kode: '3.4.2', deskripsi: 'Menganalisis daya hantar listrik larutan' },
    ]},
  ]),
  // ── mp17: Biologi ──
  ...mkKN('mp17', [
    { kode: '3.1', nama: 'Sel', indikator: [
      { kode: '3.1.1', deskripsi: 'Menjelaskan struktur sel hewan dan tumbuhan' },
      { kode: '3.1.2', deskripsi: 'Membedakan sel prokariotik dan eukariotik' },
      { kode: '3.1.3', deskripsi: 'Menjelaskan fungsi organel sel' },
    ]},
    { kode: '3.2', nama: 'Jaringan Tumbuhan', indikator: [
      { kode: '3.2.1', deskripsi: 'Mengidentifikasi jenis-jenis jaringan tumbuhan' },
      { kode: '3.2.2', deskripsi: 'Menjelaskan fungsi jaringan meristem dan permanen' },
    ]},
    { kode: '3.3', nama: 'Sistem Gerak', indikator: [
      { kode: '3.3.1', deskripsi: 'Menjelaskan struktur tulang dan sendi' },
      { kode: '3.3.2', deskripsi: 'Menganalisis mekanisme kontraksi otot' },
      { kode: '3.3.3', deskripsi: 'Mengidentifikasi kelainan pada sistem gerak' },
    ]},
    { kode: '3.4', nama: 'Ekosistem', indikator: [
      { kode: '3.4.1', deskripsi: 'Menjelaskan komponen biotik dan abiotik' },
      { kode: '3.4.2', deskripsi: 'Menganalisis aliran energi dan rantai makanan' },
      { kode: '3.4.3', deskripsi: 'Mengevaluasi dampak pencemaran lingkungan' },
    ]},
  ]),
  // ── mp18: Ekonomi ──
  ...mkKN('mp18', [
    { kode: '3.1', nama: 'Kebutuhan dan Kelangkaan', indikator: [
      { kode: '3.1.1', deskripsi: 'Membedakan kebutuhan primer, sekunder, dan tersier' },
      { kode: '3.1.2', deskripsi: 'Menganalisis faktor penyebab kelangkaan' },
      { kode: '3.1.3', deskripsi: 'Menentukan skala prioritas kebutuhan' },
    ]},
    { kode: '3.2', nama: 'Sistem Ekonomi', indikator: [
      { kode: '3.2.1', deskripsi: 'Menjelaskan sistem ekonomi pasar dan terpusat' },
      { kode: '3.2.2', deskripsi: 'Menganalisis sistem ekonomi campuran Indonesia' },
    ]},
    { kode: '3.3', nama: 'Pasar dan Harga', indikator: [
      { kode: '3.3.1', deskripsi: 'Menjelaskan hukum permintaan dan penawaran' },
      { kode: '3.3.2', deskripsi: 'Menentukan harga keseimbangan pasar' },
      { kode: '3.3.3', deskripsi: 'Menganalisis pengaruh pajak terhadap harga' },
    ]},
    { kode: '3.4', nama: 'Uang dan Bank', indikator: [
      { kode: '3.4.1', deskripsi: 'Menjelaskan fungsi uang dalam perekonomian' },
      { kode: '3.4.2', deskripsi: 'Membedakan bank umum dan bank sentral' },
    ]},
  ]),
  // ── mp19: Geografi ──
  ...mkKN('mp19', [
    { kode: '3.1', nama: 'Litosfer', indikator: [
      { kode: '3.1.1', deskripsi: 'Menjelaskan struktur lapisan bumi' },
      { kode: '3.1.2', deskripsi: 'Menganalisis jenis dan dampak gempa bumi' },
    ]},
    { kode: '3.2', nama: 'Atmosfer', indikator: [
      { kode: '3.2.1', deskripsi: 'Menjelaskan lapisan atmosfer dan fungsinya' },
      { kode: '3.2.2', deskripsi: 'Menganalisis faktor perubahan iklim global' },
      { kode: '3.2.3', deskripsi: 'Mengklasifikasikan tipe iklim berdasarkan Koppen' },
    ]},
    { kode: '3.3', nama: 'Hidrosfer', indikator: [
      { kode: '3.3.1', deskripsi: 'Menjelaskan siklus hidrologi' },
      { kode: '3.3.2', deskripsi: 'Menganalisis potensi dan masalah air tanah' },
    ]},
    { kode: '3.4', nama: 'Kependudukan', indikator: [
      { kode: '3.4.1', deskripsi: 'Menghitung pertumbuhan penduduk' },
      { kode: '3.4.2', deskripsi: 'Menganalisis piramida penduduk Indonesia' },
    ]},
  ]),
  // ── mp20: Sosiologi ──
  ...mkKN('mp20', [
    { kode: '3.1', nama: 'Interaksi Sosial', indikator: [
      { kode: '3.1.1', deskripsi: 'Menjelaskan bentuk-bentuk interaksi sosial' },
      { kode: '3.1.2', deskripsi: 'Menganalisis faktor pendorong interaksi sosial' },
    ]},
    { kode: '3.2', nama: 'Sosialisasi', indikator: [
      { kode: '3.2.1', deskripsi: 'Menjelaskan tahapan sosialisasi menurut George Mead' },
      { kode: '3.2.2', deskripsi: 'Menganalisis peran keluarga dalam sosialisasi primer' },
      { kode: '3.2.3', deskripsi: 'Mengevaluasi pengaruh media massa dalam sosialisasi' },
    ]},
    { kode: '3.3', nama: 'Struktur Sosial', indikator: [
      { kode: '3.3.1', deskripsi: 'Membedakan diferensiasi dan stratifikasi sosial' },
      { kode: '3.3.2', deskripsi: 'Menganalisis mobilitas sosial di masyarakat' },
    ]},
    { kode: '3.4', nama: 'Perubahan Sosial', indikator: [
      { kode: '3.4.1', deskripsi: 'Menjelaskan faktor penyebab perubahan sosial' },
      { kode: '3.4.2', deskripsi: 'Menganalisis dampak globalisasi terhadap budaya lokal' },
    ]},
  ]),
];

// --- Mapel yang tersedia untuk input nilai (subset dari dummyRaporMapel yang aktif) ---
export const dummyMapelInputNilai = dummyRaporMapel.filter(m => m.tampil);

// --- Jenis penilaian untuk form input nilai ---
export interface JenisPenilaianNilai {
  id: string;
  kategori: 'SIKAP' | 'STANDAR';
  nama: string;
  bobot: number;
}

export const dummyJenisPenilaianNilai: JenisPenilaianNilai[] = [
  { id: 'jpn1', kategori: 'SIKAP', nama: 'Spiritual', bobot: 0 },
  { id: 'jpn2', kategori: 'SIKAP', nama: 'Sosial', bobot: 0 },
  { id: 'jpn3', kategori: 'STANDAR', nama: 'Nilai Harian', bobot: 40 },
  { id: 'jpn4', kategori: 'STANDAR', nama: 'SAS', bobot: 60 },
];

// --- Nilai siswa per indikator (dummy kosong) ---
export interface NilaiSiswaEntry {
  siswaId: string;
  indikatorId: string;
  nilai: number | null;
}

export const dummyNilaiSiswaEntries: NilaiSiswaEntry[] = [];

// ======================================================================

// ==================== Predikat dan KKM Ekstrakurikuler ====================

function mkEkstraPredikat(ekstraId: string, ekstraNama: string, kkm: number, predikatList: { nama: string; deskripsi: string; min: number; max: number; alias: string }[]): EkstraPredikatSetting {
  return {
    id: `eps_${ekstraId}`,
    ekstraId, ekstraNama,
    tahunAjaran: '2026/2027',
    kkm,
    predikat: predikatList.map((p, i) => ({
      id: `epr_${ekstraId}_${i + 1}`,
      ekstraPredikatId: `eps_${ekstraId}`,
      nama: p.nama, deskripsi: p.deskripsi,
      nilaiMin: p.min, nilaiMax: p.max, alias: p.alias,
    })),
  };
}

const ePredikatA = [
  { nama: 'A', deskripsi: 'Sangat Baik', min: 90, max: 100, alias: '' },
  { nama: 'B', deskripsi: 'Baik', min: 75, max: 89, alias: '' },
  { nama: 'C', deskripsi: 'Cukup', min: 60, max: 74, alias: '' },
  { nama: 'D', deskripsi: 'Kurang', min: 0, max: 59, alias: '' },
];

const ePredikatB = [
  { nama: 'A', deskripsi: 'Sangat Baik', min: 90, max: 100, alias: '' },
  { nama: 'B', deskripsi: 'Baik', min: 75, max: 89, alias: '' },
];

export const dummyEkstraPredikat: EkstraPredikatSetting[] = [
  mkEkstraPredikat('ek8', 'Basket', 70, ePredikatA),
  mkEkstraPredikat('ek7', 'Futsal', 70, [
    { nama: 'A', deskripsi: 'Sangat Baik', min: 90, max: 100, alias: '' },
    { nama: 'B', deskripsi: 'Baik', min: 75, max: 89, alias: '' },
    { nama: 'C', deskripsi: 'Cukup', min: 60, max: 74, alias: '' },
  ]),
  mkEkstraPredikat('ek9', 'Pencak Silat', 75, ePredikatB),
  mkEkstraPredikat('ek4', 'Paduan Suara', 70, ePredikatA),
  mkEkstraPredikat('ek12', 'Tilawah & Tahfidz', 78, ePredikatA),
  mkEkstraPredikat('ek1', 'Karya Ilmiah Remaja', 75, ePredikatA),
  mkEkstraPredikat('ek10', 'PRAMUKA', 70, ePredikatB),
];
