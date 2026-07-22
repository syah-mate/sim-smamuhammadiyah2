import { LibraryBook, LibraryCirculation } from '@/types';

export const dummyLibraryBooks: LibraryBook[] = [
  { id: 'lb1', kodeBuku: 'BK-001', judul: 'Matematika SMA Kelas X', penulis: 'Sartono Wirodikromo', penerbit: 'Erlangga', kategori: 'Buku Pelajaran', jumlahEksemplar: 10, stokTersedia: 7, tahunTerbit: 2023 },
  { id: 'lb2', kodeBuku: 'BK-002', judul: 'Biologi untuk SMA', penulis: 'D.A. Pratiwi', penerbit: 'Erlangga', kategori: 'Buku Pelajaran', jumlahEksemplar: 8, stokTersedia: 5, tahunTerbit: 2022 },
  { id: 'lb3', kodeBuku: 'BK-003', judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', penerbit: 'Bentang Pustaka', kategori: 'Fiksi', jumlahEksemplar: 5, stokTersedia: 3, tahunTerbit: 2005 },
  { id: 'lb4', kodeBuku: 'BK-004', judul: 'Sejarah Indonesia', penulis: 'Ricklefs', penerbit: 'Serambi', kategori: 'Sejarah', jumlahEksemplar: 3, stokTersedia: 2, tahunTerbit: 2018 },
  { id: 'lb5', kodeBuku: 'BK-005', judul: 'Fisika Dasar', penulis: 'Halliday Resnick', penerbit: 'Wiley', kategori: 'Buku Pelajaran', jumlahEksemplar: 6, stokTersedia: 6, tahunTerbit: 2021 },
  { id: 'lb6', kodeBuku: 'BK-006', judul: 'Al-Quran dan Terjemah', penulis: 'Kemenag RI', penerbit: 'Kemenag', kategori: 'Agama', jumlahEksemplar: 20, stokTersedia: 15, tahunTerbit: 2020 },
  { id: 'lb7', kodeBuku: 'BK-007', judul: 'Kamus Bahasa Inggris', penulis: 'John M. Echols', penerbit: 'Gramedia', kategori: 'Referensi', jumlahEksemplar: 4, stokTersedia: 2, tahunTerbit: 2019 },
  { id: 'lb8', kodeBuku: 'BK-008', judul: 'Bumi Manusia', penulis: 'Pramoedya Ananta Toer', penerbit: 'Hasta Mitra', kategori: 'Fiksi', jumlahEksemplar: 3, stokTersedia: 0, tahunTerbit: 1980 },
];

export const dummyLibraryCirculations: LibraryCirculation[] = [
  { id: 'lc1', bookId: 'lb1', peminjamId: 's1', peminjamTipe: 'siswa', tanggalPinjam: '2026-07-10', tenggatKembali: '2026-07-17', status: 'kembali', tanggalKembali: '2026-07-15', denda: 0 },
  { id: 'lc2', bookId: 'lb3', peminjamId: 's4', peminjamTipe: 'siswa', tanggalPinjam: '2026-07-08', tenggatKembali: '2026-07-15', status: 'telat', denda: 2000 },
  { id: 'lc3', bookId: 'lb1', peminjamId: 's7', peminjamTipe: 'siswa', tanggalPinjam: '2026-07-18', tenggatKembali: '2026-07-25', status: 'dipinjam', denda: 0 },
  { id: 'lc4', bookId: 'lb4', peminjamId: 'e4', peminjamTipe: 'pegawai', tanggalPinjam: '2026-07-05', tenggatKembali: '2026-07-12', status: 'kembali', tanggalKembali: '2026-07-11', denda: 0 },
  { id: 'lc5', bookId: 'lb8', peminjamId: 's2', peminjamTipe: 'siswa', tanggalPinjam: '2026-07-20', tenggatKembali: '2026-07-27', status: 'dipinjam', denda: 0 },
  { id: 'lc6', bookId: 'lb7', peminjamId: 's9', peminjamTipe: 'siswa', tanggalPinjam: '2026-07-15', tenggatKembali: '2026-07-22', status: 'telat', denda: 0 },
];
