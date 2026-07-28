// ==================== User & Auth ====================
export type UserRole =
  | 'super_admin'
  | 'admin_tu'
  | 'bendahara'
  | 'kepala_sekolah'
  | 'guru'
  | 'wali_kelas'
  | 'guru_bk'
  | 'panitia_spmb'
  | 'admin_sarpras'
  | 'petugas_perpus'
  | 'siswa'
  | 'ortu';

export interface User {
  id: string;
  username: string;
  password: string;
  nama: string;
  email: string;
  roles: UserRole[];
  avatar?: string;
  // opsional link ke data pegawai/siswa
  pegawaiId?: string;
  siswaId?: string;
}

// ==================== Data Siswa ====================
export type StudentStatus = 'aktif' | 'lulus' | 'pindah' | 'keluar' | 'do';

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  alamat: string;
  noHp: string;
  email: string;
  namaAyah: string;
  namaIbu: string;
  namaWali: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  pekerjaanWali: string;
  noHpOrtu: string;
  kelas: string;
  jurusan: 'IPA' | 'IPS' | 'Bahasa';
  tahunAjaran: string;
  status: StudentStatus;
  fotoProfil?: string;
  dokumen: StudentDocument[];
  riwayatKelas: RiwayatKelas[];
}

export interface StudentDocument {
  id: string;
  jenis: 'akta' | 'kk' | 'ijazah' | 'lainnya';
  namaFile: string;
  tanggalUpload: string;
}

export interface RiwayatKelas {
  tahunAjaran: string;
  kelas: string;
  jurusan: string;
  status: 'naik' | 'tinggal';
}

// ==================== Data Pegawai ====================
export type JenisPegawai = 'guru' | 'tendik' | 'kepsek';
export type StatusKepegawaian = 'tetap' | 'honorer' | 'pns_dpk';

export interface Employee {
  id: string;
  nip: string;
  nuptk: string;
  nama: string;
  jenisPegawai: JenisPegawai;
  statusKepegawaian: StatusKepegawaian;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  noHp: string;
  email: string;
  pendidikanTerakhir: string;
  mapelDiampu: string[];
  jabatan: string;
  waliKelasDari?: string;
  riwayatJabatan: RiwayatJabatan[];
  dokumen: PegawaiDocument[];
  fotoProfil?: string;
}

export interface RiwayatJabatan {
  jabatan: string;
  unitKerja: string;
  tahunMulai: string;
  tahunSelesai: string;
}

export interface PegawaiDocument {
  id: string;
  jenis: 'ijazah' | 'sk' | 'sertifikat' | 'lainnya';
  namaFile: string;
  tanggalUpload: string;
}

// ==================== Presensi ====================
export type AttendanceStatus = 'hadir' | 'izin' | 'sakit' | 'alpha';

export interface AttendanceStudent {
  id: string;
  siswaId: string;
  kelasId: string;
  tanggal: string;
  jamKe: number;
  status: AttendanceStatus;
  dicatatOleh: string;
}

export interface AttendanceEmployee {
  id: string;
  pegawaiId: string;
  tanggal: string;
  jamMasuk: string;
  jamPulang: string;
  status: AttendanceStatus;
  lokasiLat?: number;
  lokasiLng?: number;
  fotoSelfie?: string;
}

// ==================== Jadwal Presensi ====================
export type Hari = 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu' | 'minggu';

export interface AttendanceSchedule {
  id: string;
  kelasId: string;
  hari: Hari;
  jamMasuk: string;
  jamPulang: string;
  toleransiTerlambat: number; // menit
  isLibur: boolean;
}

// ==================== Laporan Presensi ====================
export interface AttendanceReportSummary {
  kelasId: string;
  totalSiswa: number;
  hadir: number;
  izin: number;
  sakit: number;
  alpha: number;
  persentaseKehadiran: number;
}

// ==================== Jadwal Presensi Pegawai ====================
export interface EmployeeSchedule {
  id: string;
  pegawaiId: string;
  hari: Hari;
  jamMasuk: string;
  jamPulang: string;
  toleransiTerlambat: number; // menit
  isLibur: boolean;
}

// ==================== Keuangan ====================
export interface BillingType {
  id: string;
  nama: string;
  nominal: number;
  periode: 'bulanan' | 'semester' | 'tahunan' | 'sekali';
}

export type BillStatus = 'lunas' | 'belum' | 'cicil';

export interface Bill {
  id: string;
  siswaId: string;
  jenisTagihanId: string;
  periode: string;
  nominal: number;
  status: BillStatus;
}

export interface Payment {
  id: string;
  billId: string;
  tanggalBayar: string;
  nominalDibayar: number;
  metode: 'tunai' | 'transfer' | 'va';
  buktiBayar?: string;
  dicatatOleh: string;
}

export interface FinanceLedger {
  id: string;
  tanggal: string;
  keterangan: string;
  jenis: 'pemasukan' | 'pengeluaran';
  nominal: number;
  kategori: string;
}

// ==================== BK ====================
export type BKCaseCategory = 'akademik' | 'pribadi' | 'sosial' | 'pelanggaran';

export interface BKCase {
  id: string;
  siswaId: string;
  tanggal: string;
  kategori: BKCaseCategory;
  deskripsi: string;
  guruBKId: string;
}

export interface BKViolation {
  id: string;
  siswaId: string;
  jenisPelanggaran: string;
  poin: number;
  tanggal: string;
  tindakLanjut: string;
}

export interface BKSession {
  id: string;
  siswaId: string;
  tanggal: string;
  ringkasan: string;
  rekomendasi: string;
  statusTindakLanjut: 'belum' | 'proses' | 'selesai';
}

// ==================== SPMB ====================
export type SPMBJenisDaftar = 'reguler' | 'mutasi';
export type SPMBTahunAjaran = '2027/2028' | '2028/2029' | '2029/2030';

export interface SPMBRegistration {
  id: string;
  noPendaftaran: string;
  jenisDaftar: SPMBJenisDaftar;
  tahunAjaran: string;

  // Data formulir awal
  namaLengkapSiswa: string;
  nisn: string;
  namaAyah: string;
  namaIbu: string;
  email: string;
  noTelp: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  alamat: string;
  asalSekolah: string;

  // Akun hasil pendaftaran
  username: string;
  password: string;

  // Biaya formulir & pembayaran
  biayaFormulir: number;
  noVA: string;
  statusBayarFormulir: 'belum_bayar' | 'sudah_bayar';

  // Data lanjutan
  dataSiswa?: SPMBDataSiswa;
  dataOrangTua?: SPMBDataOrangTua;
  dokumen?: SPMBDocument[];
  hasilTes?: SPMBHasilTes;
  statusAkhir: 'menunggu_pembayaran' | 'proses_pengisian' | 'menunggu_tes' | 'menunggu_pengumuman' | 'diterima' | 'ditolak';

  tanggalDaftar: string;
}

export interface SPMBDataSiswa {
  agama: string;
  anakKe: number;
  jumlahSaudara: number;
  golonganDarah?: string;
  hobi?: string;
  citaCita?: string;
  tinggiBadan?: number;
  beratBadan?: number;
  riwayatPenyakit?: string;
}

export interface SPMBDataOrangTua {
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  pendidikanAyah: string;
  pendidikanIbu: string;
  penghasilanOrangTua: string;
  namaWali?: string;
  noTelpWali?: string;
  alamatOrangTua: string;
}

export interface SPMBDocument {
  id: string;
  jenis: 'kk' | 'akta_lahir' | 'ijazah' | 'rapor' | 'foto' | 'pas_foto' | 'lainnya';
  namaFile: string;
  status: 'belum_upload' | 'terupload' | 'diverifikasi' | 'ditolak';
}

export interface SPMBHasilTes {
  status: 'belum_jadwal' | 'terjadwal' | 'selesai';
  tanggalTes?: string;
  linkUjian?: string;
  nilai?: number;
  catatan?: string;
}

export interface SPMBSettings {
  tahunAjaran: string;
  kuotaReguler: number;
  kuotaPrestasi: number;
  kuotaAfirmasi: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  biayaPendaftaran: number;
}

// ==================== Surat Menyurat ====================
export type DispositionStatus = 'belum' | 'proses' | 'selesai';

export interface LetterIn {
  id: string;
  noSurat: string;
  noAgenda: string;
  tanggalTerima: string;
  pengirim: string;
  perihal: string;
  fileScan?: string;
  statusDisposisi: boolean;
}

export interface LetterOut {
  id: string;
  noSurat: string;
  tanggal: string;
  tujuan: string;
  perihal: string;
  file?: string;
  dibuatOleh: string;
}

export interface Disposition {
  id: string;
  letterId: string;
  dari: string;
  ke: string;
  instruksi: string;
  tenggat: string;
  status: DispositionStatus;
  catatan?: string;
}

// ==================== Inventaris ====================
export type ItemCondition = 'baik' | 'rusak';
export type TransactionType = 'masuk' | 'keluar' | 'pinjam' | 'kembali';

export interface InventoryItem {
  id: string;
  kodeBarang: string;
  nama: string;
  kategori: string;
  satuan: string;
  stok: number;
  lokasi: string;
  kondisi: ItemCondition;
  minStok: number;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  jenis: TransactionType;
  jumlah: number;
  tanggal: string;
  peminjam?: string;
  pic: string;
  keterangan: string;
}

// ==================== LMS ====================
export interface LMSClass {
  id: string;
  mapelId: string;
  kelasId: string;
  guruId: string;
  tahunAjaran: string;
  namaMapel: string;
}

export interface LMSMaterial {
  id: string;
  classId: string;
  judul: string;
  fileLink?: string;
  deskripsi: string;
  tanggalUpload: string;
}

export interface LMSAssignment {
  id: string;
  classId: string;
  judul: string;
  deskripsi: string;
  tenggat: string;
  tipe: 'upload' | 'essay' | 'pg';
}

export interface LMSSubmission {
  id: string;
  assignmentId: string;
  siswaId: string;
  jawaban?: string;
  file?: string;
  waktuSubmit: string;
  nilai?: number;
  feedback?: string;
}

// ==================== e-Rapor ====================
export type ScoreType = 'harian' | 'uts' | 'uas' | 'tugas';

export interface AcademicScore {
  id: string;
  siswaId: string;
  mapelId: string;
  semester: string;
  jenisNilai: ScoreType;
  nilai: number;
}

export interface ReportCard {
  id: string;
  siswaId: string;
  semester: string;
  nilaiMapel: NilaiMapel[];
  nilaiSikap: string;
  catatanWaliKelas: string;
  status: 'draft' | 'final';
}

export interface NilaiMapel {
  mapelId: string;
  namaMapel: string;
  nilaiHarian: number;
  nilaiUTS: number;
  nilaiUAS: number;
  nilaiAkhir: number;
}

// ==================== Perpustakaan ====================
export type CirculationStatus = 'dipinjam' | 'kembali' | 'telat';

export interface LibraryBook {
  id: string;
  kodeBuku: string;
  judul: string;
  penulis: string;
  penerbit: string;
  kategori: string;
  jumlahEksemplar: number;
  stokTersedia: number;
  cover?: string;
  tahunTerbit: number;
}

export interface LibraryCirculation {
  id: string;
  bookId: string;
  peminjamId: string;
  peminjamTipe: 'siswa' | 'pegawai';
  tanggalPinjam: string;
  tenggatKembali: string;
  tanggalKembali?: string;
  status: CirculationStatus;
  denda: number;
}

// ==================== Navigasi ====================
export interface NavItem {
  label: string;
  href?: string;
  icon: string;
  children?: NavItem[];
  roles?: UserRole[];
}
