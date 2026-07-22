import { InventoryItem, InventoryTransaction } from '@/types';

export const dummyInventoryItems: InventoryItem[] = [
  { id: 'ii1', kodeBarang: 'ATK-001', nama: 'Kertas HVS A4 70gsm', kategori: 'ATK', satuan: 'rim', stok: 25, lokasi: 'Gudang ATK', kondisi: 'baik', minStok: 10 },
  { id: 'ii2', kodeBarang: 'ATK-002', nama: 'Spidol Whiteboard', kategori: 'ATK', satuan: 'buah', stok: 8, lokasi: 'Gudang ATK', kondisi: 'baik', minStok: 20 },
  { id: 'ii3', kodeBarang: 'ELK-001', nama: 'Proyektor LCD', kategori: 'Elektronik', satuan: 'unit', stok: 5, lokasi: 'Lab Komputer', kondisi: 'baik', minStok: 2 },
  { id: 'ii4', kodeBarang: 'FUR-001', nama: 'Meja Siswa', kategori: 'Furniture', satuan: 'buah', stok: 120, lokasi: 'Ruang Kelas', kondisi: 'baik', minStok: 5 },
  { id: 'ii5', kodeBarang: 'FUR-002', nama: 'Kursi Siswa', kategori: 'Furniture', satuan: 'buah', stok: 118, lokasi: 'Ruang Kelas', kondisi: 'baik', minStok: 5 },
  { id: 'ii6', kodeBarang: 'ELK-002', nama: 'Kabel HDMI 5m', kategori: 'Elektronik', satuan: 'buah', stok: 3, lokasi: 'Lab Komputer', kondisi: 'baik', minStok: 5 },
  { id: 'ii7', kodeBarang: 'ATK-003', nama: 'Tinta Printer Epson', kategori: 'ATK', satuan: 'botol', stok: 4, lokasi: 'Ruang TU', kondisi: 'baik', minStok: 6 },
  { id: 'ii8', kodeBarang: 'LAB-001', nama: 'Mikroskop', kategori: 'Alat Lab', satuan: 'unit', stok: 10, lokasi: 'Lab IPA', kondisi: 'baik', minStok: 3 },
  { id: 'ii9', kodeBarang: 'LAB-002', nama: 'Tabung Reaksi', kategori: 'Alat Lab', satuan: 'buah', stok: 50, lokasi: 'Lab IPA', kondisi: 'baik', minStok: 20 },
  { id: 'ii10', kodeBarang: 'FUR-003', nama: 'Papan Tulis', kategori: 'Furniture', satuan: 'buah', stok: 12, lokasi: 'Ruang Kelas', kondisi: 'rusak', minStok: 2 },
  { id: 'ii11', kodeBarang: 'BRG-001', nama: 'Bola Basket', kategori: 'Olahraga', satuan: 'buah', stok: 6, lokasi: 'Gudang Olahraga', kondisi: 'baik', minStok: 5 },
  { id: 'ii12', kodeBarang: 'BRG-002', nama: 'Cone Latihan', kategori: 'Olahraga', satuan: 'set', stok: 4, lokasi: 'Gudang Olahraga', kondisi: 'baik', minStok: 5 },
];

export const dummyInventoryTransactions: InventoryTransaction[] = [
  { id: 'it1', itemId: 'ii1', jenis: 'masuk', jumlah: 50, tanggal: '2026-07-01', pic: 'e7', keterangan: 'Pembelian semester 2' },
  { id: 'it2', itemId: 'ii1', jenis: 'keluar', jumlah: 5, tanggal: '2026-07-05', pic: 'e7', keterangan: 'Pemakaian ujian' },
  { id: 'it3', itemId: 'ii2', jenis: 'keluar', jumlah: 4, tanggal: '2026-07-08', pic: 'e7', keterangan: 'Distribusi ke kelas' },
  { id: 'it4', itemId: 'ii3', jenis: 'pinjam', jumlah: 1, tanggal: '2026-07-12', peminjam: 'Rudi Hartono, S.Pd.', pic: 'e7', keterangan: 'Peminjaman untuk presentasi' },
  { id: 'it5', itemId: 'ii3', jenis: 'kembali', jumlah: 1, tanggal: '2026-07-14', peminjam: 'Rudi Hartono, S.Pd.', pic: 'e7', keterangan: 'Pengembalian' },
  { id: 'it6', itemId: 'ii7', jenis: 'masuk', jumlah: 10, tanggal: '2026-07-15', pic: 'e7', keterangan: 'Pembelian tinta' },
  { id: 'it7', itemId: 'ii7', jenis: 'keluar', jumlah: 3, tanggal: '2026-07-18', pic: 'e7', keterangan: 'Pemakaian cetak rapor' },
];
