import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  {
    label: 'Akademik', icon: '🎓', children: [
      { label: 'Bank Mata Pelajaran', href: '/akademik/bank-mapel', icon: '📚' },
      { label: 'Bank Ekstrakurikuler', href: '/akademik/bank-ekstrakurikuler', icon: '🎯' },
      { label: 'Input Nilai Rapor', href: '/akademik/input-nilai-rapor', icon: '✏️' },
      { label: 'Pengaturan Rapor', href: '/akademik/pengaturan-rapor', icon: '📝' },
    ],
  },
  {
    label: 'Kesiswaan', icon: '👨‍🎓', children: [
      { label: 'Data Siswa', href: '/kesiswaan/data-siswa', icon: '📋' },
    ],
  },
  {
    label: 'Bimbingan Konseling', icon: '🫂', children: [
      { label: 'Skor Siswa', href: '/bimbingan-konseling/skor-siswa', icon: '⭐' },
      { label: 'Jenis Pelanggaran & Apresiasi', href: '/bimbingan-konseling/jenis-pelanggaran-apresiasi', icon: '📑' },
      { label: 'Tindak Lanjut', href: '/bimbingan-konseling/tindak-lanjut', icon: '🔄' },
      { label: 'Pelanggaran Siswa', href: '/bimbingan-konseling/pelanggaran-siswa', icon: '⚠️' },
      { label: 'Apresiasi Siswa', href: '/bimbingan-konseling/apresiasi-siswa', icon: '🌟' },
      { label: 'Laporan', href: '/bimbingan-konseling/laporan', icon: '📊' },
    ],
  },
  {
    label: 'Kepegawaian', icon: '👨‍🏫', children: [
      { label: 'Data Pegawai', href: '/kepegawaian/data-pegawai', icon: '📋' },
    ],
  },
  {
    label: 'Presensi', icon: '🕒', children: [
      { label: 'Presensi Siswa', href: '/presensi/presensi-siswa', icon: '✅' },
      { label: 'Presensi Pegawai', href: '/presensi/presensi-pegawai', icon: '🕐' },
    ],
  },
  {
    label: 'Keuangan', icon: '💰', children: [
      { label: 'Data Umum', href: '/keuangan/data-umum', icon: '📋' },
      { label: 'Tagihan Siswa', href: '/keuangan/tagihan-siswa', icon: '📄' },
      { label: 'Kasir Penerimaan', href: '/keuangan/kasir-penerimaan', icon: '📥' },
      { label: 'Kasir Pengeluaran', href: '/keuangan/kasir-pengeluaran', icon: '📤' },
      { label: 'Laporan', href: '/keuangan/laporan', icon: '📈' },
    ],
  },
  {
    label: 'SPMB', icon: '📝', children: [
      { label: 'Pendaftaran Awal', href: '/spmb/pendaftaran-awal', icon: '📋' },
      { label: 'Pengisian Data SPMB', href: '/spmb/pengisian-data', icon: '✏️' },
    ],
  },
  {
    label: 'Disposisi', icon: '✉️', href: '/surat-menyurat/disposisi',
  },
  {
    label: 'Inventaris', icon: '📦', children: [
      { label: 'Master Kategori Aset', href: '/inventaris/master-kategori', icon: '📑' },
      { label: 'Inventaris Aset', href: '/inventaris/inventaris-aset', icon: '📋' },
      { label: 'Persewaan Aset', href: '/inventaris/persewaan-aset', icon: '🤝' },
      { label: 'Mutasi Aset', href: '/inventaris/mutasi-aset', icon: '🔄' },
      { label: 'Laporan', href: '/inventaris/laporan', icon: '📊' },
    ],
  },
  {
    label: 'Perpustakaan', icon: '📚', children: [
      { label: 'Katalog Buku', href: '/perpustakaan/katalog-buku', icon: '📖' },
      { label: 'Sirkulasi', href: '/perpustakaan/sirkulasi', icon: '🔄' },
    ],
  },
  {
    label: 'Pengaturan', icon: '⚙️', children: [
      { label: 'User & Role', href: '/pengaturan/user-role', icon: '👤' },
      { label: 'Tahun Ajaran', href: '/pengaturan/tahun-ajaran', icon: '📅' },
    ],
  },
];
