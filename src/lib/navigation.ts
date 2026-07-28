import { UserRole, NavItem } from '@/types';

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  {
    label: 'Kesiswaan', icon: '👨‍🎓', children: [
      { label: 'Data Siswa', href: '/kesiswaan/data-siswa', icon: '📋' },
      { label: 'e-Rapor', href: '/kesiswaan/e-rapor', icon: '📝' },
      { label: 'Bimbingan Konseling', href: '/kesiswaan/bimbingan-konseling', icon: '🫂' },
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
    label: 'Surat Menyurat', icon: '✉️', children: [
      { label: 'Surat Masuk', href: '/surat-menyurat/surat-masuk', icon: '📥' },
      { label: 'Surat Keluar', href: '/surat-menyurat/surat-keluar', icon: '📤' },
      { label: 'Disposisi', href: '/surat-menyurat/disposisi', icon: '🔄' },
    ],
  },
  {
    label: 'Inventaris', icon: '📦', children: [
      { label: 'Stok Barang', href: '/inventaris/stok-barang', icon: '📋' },
    ],
  },
  {
    label: 'LMS', icon: '💻', children: [
      { label: 'Kelas & Materi', href: '/lms/kelas-materi', icon: '📚' },
      { label: 'Tugas & Kuis', href: '/lms/tugas-kuis', icon: '✏️' },
      { label: 'Nilai', href: '/lms/nilai', icon: '💯' },
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
