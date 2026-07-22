import { LetterIn, LetterOut, Disposition } from '@/types';

export const dummyLettersIn: LetterIn[] = [
  {
    id: 'li1', noSurat: '421/123/Disdik/2026', noAgenda: '001/SM/VII/2026',
    tanggalTerima: '2026-07-05', pengirim: 'Dinas Pendidikan Kota Surabaya',
    perihal: 'Undangan Sosialisasi Kurikulum Merdeka', statusDisposisi: true,
  },
  {
    id: 'li2', noSurat: 'B-456/Kemenag/2026', noAgenda: '002/SM/VII/2026',
    tanggalTerima: '2026-07-10', pengirim: 'Kementerian Agama Kota Surabaya',
    perihal: 'Permohonan Data Siswa Penerima PIP', statusDisposisi: true,
  },
  {
    id: 'li3', noSurat: '789/Muh/PCM/2026', noAgenda: '003/SM/VII/2026',
    tanggalTerima: '2026-07-15', pengirim: 'PCM Muhammadiyah Surabaya',
    perihal: 'Jadwal Rapat Koordinasi Kepala Sekolah Muhammadiyah', statusDisposisi: false,
  },
  {
    id: 'li4', noSurat: '101/POL/SK/2026', noAgenda: '004/SM/VII/2026',
    tanggalTerima: '2026-07-18', pengirim: 'Polsek Genteng',
    perihal: 'Permohonan Pembinaan Kenakalan Remaja', statusDisposisi: true,
  },
  {
    id: 'li5', noSurat: '202/RS/Und/2026', noAgenda: '005/SM/VII/2026',
    tanggalTerima: '2026-07-20', pengirim: 'RS Muhammadiyah Surabaya',
    perihal: 'Program Pemeriksaan Kesehatan Gratis Siswa', statusDisposisi: false,
  },
];

export const dummyLettersOut: LetterOut[] = [
  {
    id: 'lo1', noSurat: '001/SMA-M2/VII/2026', tanggal: '2026-07-08',
    tujuan: 'Dinas Pendidikan Kota Surabaya', perihal: 'Laporan Bulanan Sekolah', dibuatOleh: 'e1',
  },
  {
    id: 'lo2', noSurat: '002/SMA-M2/VII/2026', tanggal: '2026-07-12',
    tujuan: 'Kementerian Agama Kota Surabaya', perihal: 'Pengiriman Data Siswa PIP', dibuatOleh: 'e1',
  },
  {
    id: 'lo3', noSurat: '003/SMA-M2/VII/2026', tanggal: '2026-07-16',
    tujuan: 'PCM Muhammadiyah Surabaya', perihal: 'Konfirmasi Kehadiran Rapat Koordinasi', dibuatOleh: 'e2',
  },
];

export const dummyDispositions: Disposition[] = [
  {
    id: 'disp1', letterId: 'li1', dari: 'e2', ke: 'e4',
    instruksi: 'Mohon dihadiri dan sampaikan laporan hasil sosialisasi', tenggat: '2026-07-15',
    status: 'selesai', catatan: 'Sudah hadir, laporan sudah disampaikan',
  },
  {
    id: 'disp2', letterId: 'li2', dari: 'e2', ke: 'e1',
    instruksi: 'Segera siapkan data siswa penerima PIP, kirim sebelum 15 Juli', tenggat: '2026-07-14',
    status: 'proses', catatan: 'Data sedang dikompilasi',
  },
  {
    id: 'disp3', letterId: 'li4', dari: 'e2', ke: 'e5',
    instruksi: 'Koordinasikan program pembinaan dengan Polsek', tenggat: '2026-07-25',
    status: 'belum',
  },
];
