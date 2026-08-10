import { KomponenIsmuba, KegiatanIsmuba, PenilaianIsmuba, AbsensiIsmuba } from '@/types';

// ==================== DATA MASTER KOMPONEN ISMUBA ====================

export const dummyKomponenIsmuba: KomponenIsmuba[] = [
  {
    id: 'ki1',
    nama: 'Hafalan Surat',
    deskripsi: 'Kegiatan menghafal surat-surat pendek Al-Quran sesuai target yang ditentukan',
  },
  {
    id: 'ki2',
    nama: 'Kegiatan Tadarus',
    deskripsi: 'Kegiatan membaca Al-Quran bersama-sama yang dilakukan secara rutin',
  },
  {
    id: 'ki3',
    nama: 'Kegiatan Pengajian Kelas',
    deskripsi: 'Pengajian rutin per kelas dengan materi keislaman dan kemuhammadiyahan',
  },
  {
    id: 'ki4',
    nama: 'Keg Boarding',
    deskripsi: 'Kegiatan keagamaan khusus untuk siswa yang tinggal di asrama/boarding school',
  },
];

// ==================== DATA KEGIATAN ISMUBA ====================

export const dummyKegiatanIsmuba: KegiatanIsmuba[] = [
  {
    id: 'kg1',
    tanggal: '2026-08-05',
    namaKegiatan: 'Hafalan Surat An-Naba',
    kelas: 'X',
    komponenId: 'ki1',
    deskripsi: 'Setoran hafalan Surat An-Naba ayat 1-20',
  },
  {
    id: 'kg2',
    tanggal: '2026-08-07',
    namaKegiatan: 'Tadarus Pagi Bersama',
    kelas: 'X',
    komponenId: 'ki2',
    deskripsi: 'Tadarus Al-Quran Juz 30 sebelum jam pelajaran dimulai',
  },
  {
    id: 'kg3',
    tanggal: '2026-08-10',
    namaKegiatan: 'Pengajian Kelas X IPA',
    kelas: 'X',
    komponenId: 'ki3',
    deskripsi: 'Pengajian dengan tema "Adab Menuntut Ilmu" oleh Ustadz Ahmad',
  },
  {
    id: 'kg4',
    tanggal: '2026-08-12',
    namaKegiatan: 'Hafalan Surat Al-Mulk',
    kelas: 'XI',
    komponenId: 'ki1',
    deskripsi: 'Setoran hafalan Surat Al-Mulk ayat 1-15',
  },
  {
    id: 'kg5',
    tanggal: '2026-08-14',
    namaKegiatan: 'Keg Boarding Malam',
    kelas: 'X',
    komponenId: 'ki4',
    deskripsi: 'Sholat malam berjamaah dan kajian kitab di asrama',
  },
  {
    id: 'kg6',
    tanggal: '2026-08-15',
    namaKegiatan: 'Tadarus Jumat Pagi',
    kelas: 'XI',
    komponenId: 'ki2',
    deskripsi: 'Tadarus Surah Al-Kahfi bersama sebelum sholat Jumat',
  },
  {
    id: 'kg7',
    tanggal: '2026-08-18',
    namaKegiatan: 'Pengajian Kelas XI IPS',
    kelas: 'XI',
    komponenId: 'ki3',
    deskripsi: 'Pengajian dengan tema "Akhlak Terpuji dalam Islam"',
  },
  {
    id: 'kg8',
    tanggal: '2026-08-20',
    namaKegiatan: 'Hafalan Surat Ar-Rahman',
    kelas: 'X',
    komponenId: 'ki1',
    deskripsi: 'Setoran hafalan Surat Ar-Rahman ayat 1-25',
  },
];

// ==================== DATA PENILAIAN ISMUBA ====================

export const dummyPenilaianIsmuba: PenilaianIsmuba[] = [
  { id: 'pn1', kegiatanId: 'kg1', siswaId: 's1', nilai: 85, catatan: 'Hafalan lancar, tajwid baik' },
  { id: 'pn2', kegiatanId: 'kg1', siswaId: 's2', nilai: 90, catatan: 'Hafalan sangat lancar, makhraj bagus' },
  { id: 'pn3', kegiatanId: 'kg1', siswaId: 's3', nilai: 75, catatan: 'Cukup lancar, perlu perbaikan tajwid' },
  { id: 'pn4', kegiatanId: 'kg2', siswaId: 's1', nilai: 88, catatan: 'Tartil baik' },
  { id: 'pn5', kegiatanId: 'kg2', siswaId: 's2', nilai: 92, catatan: 'Sangat baik' },
  { id: 'pn6', kegiatanId: 'kg3', siswaId: 's4', nilai: 80, catatan: 'Aktif bertanya' },
  { id: 'pn7', kegiatanId: 'kg3', siswaId: 's5', nilai: 78, catatan: 'Cukup aktif' },
  { id: 'pn8', kegiatanId: 'kg4', siswaId: 's4', nilai: 82, catatan: 'Hafalan baik' },
  { id: 'pn9', kegiatanId: 'kg4', siswaId: 's6', nilai: 88, catatan: 'Hafalan lancar' },
];

// ==================== DATA ABSENSI ISMUBA ====================

export const dummyAbsensiIsmuba: AbsensiIsmuba[] = [
  { id: 'ab1', kegiatanId: 'kg1', siswaId: 's1', kehadiran: 'hadir', keterangan: '' },
  { id: 'ab2', kegiatanId: 'kg1', siswaId: 's2', kehadiran: 'hadir', keterangan: '' },
  { id: 'ab3', kegiatanId: 'kg1', siswaId: 's3', kehadiran: 'hadir', keterangan: '' },
  { id: 'ab4', kegiatanId: 'kg1', siswaId: 's4', kehadiran: 'tidak_hadir', keterangan: 'Sakit' },
  { id: 'ab5', kegiatanId: 'kg2', siswaId: 's1', kehadiran: 'hadir', keterangan: '' },
  { id: 'ab6', kegiatanId: 'kg2', siswaId: 's2', kehadiran: 'hadir', keterangan: '' },
  { id: 'ab7', kegiatanId: 'kg2', siswaId: 's3', kehadiran: 'tidak_hadir', keterangan: 'Izin' },
  { id: 'ab8', kegiatanId: 'kg3', siswaId: 's4', kehadiran: 'hadir', keterangan: '' },
  { id: 'ab9', kegiatanId: 'kg3', siswaId: 's5', kehadiran: 'hadir', keterangan: '' },
  { id: 'ab10', kegiatanId: 'kg3', siswaId: 's6', kehadiran: 'tidak_hadir', keterangan: 'Tanpa keterangan' },
  { id: 'ab11', kegiatanId: 'kg4', siswaId: 's4', kehadiran: 'hadir', keterangan: '' },
  { id: 'ab12', kegiatanId: 'kg4', siswaId: 's6', kehadiran: 'hadir', keterangan: '' },
];
