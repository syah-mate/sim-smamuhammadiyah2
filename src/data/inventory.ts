import { AssetCategory, Asset, AssetRental, AssetMutation, AssetReportSummary } from '@/types';

// ==================== Master Kategori Aset ====================
export const dummyAssetCategories: AssetCategory[] = [
  { id: 'cat1', kode: 'FUR', nama: 'Furniture', deskripsi: 'Meja, kursi, lemari, dan perabotan lainnya', createdAt: '2025-01-10' },
  { id: 'cat2', kode: 'ELK', nama: 'Elektronik', deskripsi: 'Proyektor, laptop, printer, dan perangkat elektronik', createdAt: '2025-01-10' },
  { id: 'cat3', kode: 'LAB', nama: 'Alat Laboratorium', deskripsi: 'Mikroskop, tabung reaksi, dan peralatan lab', createdAt: '2025-01-10' },
  { id: 'cat4', kode: 'OLR', nama: 'Olahraga', deskripsi: 'Bola, matras, cone, dan peralatan olahraga', createdAt: '2025-01-10' },
  { id: 'cat5', kode: 'ATK', nama: 'ATK & Perlengkapan', deskripsi: 'Kertas, tinta, spidol, dan alat tulis kantor', createdAt: '2025-01-10' },
  { id: 'cat6', kode: 'KND', nama: 'Kendaraan', deskripsi: 'Mobil operasional, motor dinas', createdAt: '2025-06-15' },
  { id: 'cat7', kode: 'BDG', nama: 'Bangunan & Ruang', deskripsi: 'Gedung, ruang kelas, aula', createdAt: '2025-01-10' },
  { id: 'cat8', kode: 'AUD', nama: 'Audio Visual', deskripsi: 'Speaker, microphone, kamera', createdAt: '2025-03-20' },
];

// ==================== Inventaris Aset ====================
export const dummyAssets: Asset[] = [
  { id: 'ast1', kodeAset: 'FUR-001', nama: 'Meja Siswa', label: 'meja-siswa', kategoriId: 'cat1', kategoriNama: 'Furniture', tanggalBeli: '2025-02-15', status: 'Tersedia', tag: 'meja', jumlah: 120, kondisi: 'Baik', lokasi: 'Ruang Kelas', deskripsi: 'Meja belajar siswa kayu jati', createdAt: '2025-02-15', updatedAt: '2026-07-01' },
  { id: 'ast2', kodeAset: 'FUR-002', nama: 'Kursi Siswa', label: 'kursi-siswa', kategoriId: 'cat1', kategoriNama: 'Furniture', tanggalBeli: '2025-02-15', status: 'Tersedia', tag: 'kursi', jumlah: 118, kondisi: 'Baik', lokasi: 'Ruang Kelas', deskripsi: 'Kursi belajar siswa kayu jati', createdAt: '2025-02-15', updatedAt: '2026-07-01' },
  { id: 'ast3', kodeAset: 'FUR-003', nama: 'Papan Tulis', label: 'papan-tulis', kategoriId: 'cat1', kategoriNama: 'Furniture', tanggalBeli: '2025-02-15', status: 'Tersedia', tag: 'papan', jumlah: 12, kondisi: 'Rusak Ringan', lokasi: 'Ruang Kelas', deskripsi: 'Papan tulis whiteboard 120x240cm', createdAt: '2025-02-15', updatedAt: '2026-07-10' },
  { id: 'ast4', kodeAset: 'ELK-001', nama: 'Proyektor LCD', label: 'proyektor-lcd', kategoriId: 'cat2', kategoriNama: 'Elektronik', tanggalBeli: '2025-06-01', status: 'Dipinjam', tag: 'proyektor', jumlah: 5, kondisi: 'Baik', lokasi: 'Lab Komputer', deskripsi: 'Proyektor Epson EB-X41', createdAt: '2025-06-01', updatedAt: '2026-07-20' },
  { id: 'ast5', kodeAset: 'ELK-002', nama: 'Laptop Dell', label: 'laptop-dell', kategoriId: 'cat2', kategoriNama: 'Elektronik', tanggalBeli: '2025-06-01', status: 'Tersedia', tag: 'laptop', jumlah: 10, kondisi: 'Baik', lokasi: 'Lab Komputer', deskripsi: 'Laptop Dell Latitude 3420', createdAt: '2025-06-01', updatedAt: '2026-07-15' },
  { id: 'ast6', kodeAset: 'ELK-003', nama: 'Printer Canon', label: 'printer-canon', kategoriId: 'cat2', kategoriNama: 'Elektronik', tanggalBeli: '2025-04-10', status: 'Dalam Perbaikan', tag: 'printer', jumlah: 3, kondisi: 'Rusak Berat', lokasi: 'Ruang TU', deskripsi: 'Printer Canon MP287', createdAt: '2025-04-10', updatedAt: '2026-07-22' },
  { id: 'ast7', kodeAset: 'LAB-001', nama: 'Mikroskop', label: 'mikroskop', kategoriId: 'cat3', kategoriNama: 'Alat Laboratorium', tanggalBeli: '2025-03-01', status: 'Tersedia', tag: 'lab', jumlah: 10, kondisi: 'Baik', lokasi: 'Lab IPA', deskripsi: 'Mikroskop cahaya monokuler', createdAt: '2025-03-01', updatedAt: '2026-07-01' },
  { id: 'ast8', kodeAset: 'LAB-002', nama: 'Tabung Reaksi', label: 'tabung-reaksi', kategoriId: 'cat3', kategoriNama: 'Alat Laboratorium', tanggalBeli: '2025-03-01', status: 'Tersedia', tag: 'lab', jumlah: 50, kondisi: 'Baik', lokasi: 'Lab IPA', deskripsi: 'Tabung reaksi pyrex 15ml', createdAt: '2025-03-01', updatedAt: '2026-07-01' },
  { id: 'ast9', kodeAset: 'OLR-001', nama: 'Bola Basket', label: 'bola-basket', kategoriId: 'cat4', kategoriNama: 'Olahraga', tanggalBeli: '2025-05-20', status: 'Tersedia', tag: 'olahraga', jumlah: 6, kondisi: 'Baik', lokasi: 'Gudang Olahraga', deskripsi: 'Bola basket Molten GG7', createdAt: '2025-05-20', updatedAt: '2026-07-01' },
  { id: 'ast10', kodeAset: 'OLR-002', nama: 'Cone Latihan', label: 'cone-latihan', kategoriId: 'cat4', kategoriNama: 'Olahraga', tanggalBeli: '2025-05-20', status: 'Tersedia', tag: 'olahraga', jumlah: 4, kondisi: 'Rusak Ringan', lokasi: 'Gudang Olahraga', deskripsi: 'Cone latihan plastik 30cm', createdAt: '2025-05-20', updatedAt: '2026-07-01' },
  { id: 'ast11', kodeAset: 'KND-001', nama: 'Mobil Operasional', label: 'mobil-ops', kategoriId: 'cat6', kategoriNama: 'Kendaraan', tanggalBeli: '2025-01-05', status: 'Tersedia', tag: 'kendaraan', jumlah: 1, kondisi: 'Baik', lokasi: 'Parkir Sekolah', deskripsi: 'Toyota Avanza 2024', createdAt: '2025-01-05', updatedAt: '2026-07-25' },
  { id: 'ast12', kodeAset: 'AUD-001', nama: 'Speaker Portable', label: 'speaker-portable', kategoriId: 'cat8', kategoriNama: 'Audio Visual', tanggalBeli: '2025-07-10', status: 'Dipinjam', tag: 'audio', jumlah: 4, kondisi: 'Baik', lokasi: 'Aula', deskripsi: 'Speaker JBL PartyBox 310', createdAt: '2025-07-10', updatedAt: '2026-07-28' },
];

// ==================== Persewaan Aset ====================
export const dummyAssetRentals: AssetRental[] = [
  { id: 'rnt1', noSewa: 'SEW-20260701-001', asetId: 'ast12', asetNama: 'Speaker Portable', penyewa: 'Karang Taruna RW 05', picPenyewa: 'Bapak Agus Santoso', noTelpPenyewa: '081234567890', tanggalSewa: '2026-07-28', tanggalKembali: '2026-07-30', durasiHari: 2, biayaSewa: 500000, status: 'Aktif', keterangan: 'Penyewaan untuk acara 17-an', createdAt: '2026-07-28' },
  { id: 'rnt2', noSewa: 'SEW-20260720-002', asetId: 'ast4', asetNama: 'Proyektor LCD', penyewa: 'Bimbel Cendekia', picPenyewa: 'Ibu Rina Marlina', noTelpPenyewa: '085678901234', tanggalSewa: '2026-07-20', tanggalKembali: '2026-07-22', durasiHari: 2, biayaSewa: 300000, status: 'Aktif', keterangan: 'Penyewaan untuk try out', createdAt: '2026-07-20' },
  { id: 'rnt3', noSewa: 'SEW-20260710-003', asetId: 'ast9', asetNama: 'Bola Basket', penyewa: 'Club Basket Junior', picPenyewa: 'Bapak Dedi Irawan', noTelpPenyewa: '081345678901', tanggalSewa: '2026-07-10', tanggalKembali: '2026-07-12', durasiHari: 2, biayaSewa: 150000, status: 'Selesai', keterangan: 'Turnamen antar club', createdAt: '2026-07-10' },
  { id: 'rnt4', noSewa: 'SEW-20260705-004', asetId: 'ast5', asetNama: 'Laptop Dell', penyewa: 'Universitas Terbuka', picPenyewa: 'Ibu Siti Nurhaliza', noTelpPenyewa: '087654321098', tanggalSewa: '2026-07-05', tanggalKembali: '2026-07-06', durasiHari: 1, biayaSewa: 750000, status: 'Selesai', keterangan: 'Ujian online semester', createdAt: '2026-07-05' },
  { id: 'rnt5', noSewa: 'SEW-20260725-005', asetId: 'ast12', asetNama: 'Speaker Portable', penyewa: 'Remaja Masjid Al-Hidayah', picPenyewa: 'Bapak Fahmi Rahman', noTelpPenyewa: '082112345678', tanggalSewa: '2026-08-01', tanggalKembali: '2026-08-03', durasiHari: 2, biayaSewa: 500000, status: 'Dibatalkan', keterangan: 'Acara dibatalkan', createdAt: '2026-07-25' },
];

// ==================== Mutasi Aset ====================
export const dummyAssetMutations: AssetMutation[] = [
  { id: 'mut1', noMutasi: 'MTS-20260715-001', asetId: 'ast3', asetNama: 'Papan Tulis', kategoriLamaId: 'cat1', kategoriLamaNama: 'Furniture', kategoriBaruId: 'cat1', kategoriBaruNama: 'Furniture', kondisiLama: 'Baik', kondisiBaru: 'Rusak Ringan', tanggalMutasi: '2026-07-10', pic: 'Bapak Hendra, S.Pd.', keterangan: 'Goresan permanen di permukaan papan' },
  { id: 'mut2', noMutasi: 'MTS-20260722-002', asetId: 'ast6', asetNama: 'Printer Canon', kategoriLamaId: 'cat2', kategoriLamaNama: 'Elektronik', kategoriBaruId: 'cat5', kategoriBaruNama: 'ATK & Perlengkapan', kondisiLama: 'Baik', kondisiBaru: 'Rusak Berat', tanggalMutasi: '2026-07-22', pic: 'Ibu Dewi Anggraini', keterangan: 'Printer rusak total, dipindahkan ke kategori ATK untuk penghapusan' },
  { id: 'mut3', noMutasi: 'MTS-20260701-003', asetId: 'ast10', asetNama: 'Cone Latihan', kategoriLamaId: 'cat4', kategoriLamaNama: 'Olahraga', kategoriBaruId: 'cat4', kategoriBaruNama: 'Olahraga', kondisiLama: 'Baik', kondisiBaru: 'Rusak Ringan', tanggalMutasi: '2026-07-01', pic: 'Bapak Rudi Hartono, S.Pd.', keterangan: 'Beberapa cone retak setelah pemakaian' },
];

// ==================== Laporan Aset ====================
export const dummyAssetReports: AssetReportSummary[] = [
  { kategoriId: 'cat1', kategoriNama: 'Furniture', totalAset: 3, tersedia: 3, dipinjam: 0, perbaikan: 0, dihapuskan: 0, baik: 2, rusakRingan: 1, rusakBerat: 0 },
  { kategoriId: 'cat2', kategoriNama: 'Elektronik', totalAset: 3, tersedia: 1, dipinjam: 1, perbaikan: 1, dihapuskan: 0, baik: 2, rusakRingan: 0, rusakBerat: 1 },
  { kategoriId: 'cat3', kategoriNama: 'Alat Laboratorium', totalAset: 2, tersedia: 2, dipinjam: 0, perbaikan: 0, dihapuskan: 0, baik: 2, rusakRingan: 0, rusakBerat: 0 },
  { kategoriId: 'cat4', kategoriNama: 'Olahraga', totalAset: 2, tersedia: 2, dipinjam: 0, perbaikan: 0, dihapuskan: 0, baik: 1, rusakRingan: 1, rusakBerat: 0 },
  { kategoriId: 'cat6', kategoriNama: 'Kendaraan', totalAset: 1, tersedia: 1, dipinjam: 0, perbaikan: 0, dihapuskan: 0, baik: 1, rusakRingan: 0, rusakBerat: 0 },
  { kategoriId: 'cat8', kategoriNama: 'Audio Visual', totalAset: 1, tersedia: 0, dipinjam: 1, perbaikan: 0, dihapuskan: 0, baik: 1, rusakRingan: 0, rusakBerat: 0 },
];
