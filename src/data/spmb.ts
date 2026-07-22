import { SPMBRegistration, SPMBSettings } from '@/types';

export const dummySPMBSettings: SPMBSettings = {
  tahunAjaran: '2025/2026',
  kuotaReguler: 90,
  kuotaPrestasi: 30,
  kuotaAfirmasi: 15,
  tanggalMulai: '2025-05-01',
  tanggalSelesai: '2025-07-15',
  biayaPendaftaran: 300000,
};

export const dummySPMBRegistrations: SPMBRegistration[] = [
  {
    id: 'spmb1', namaLengkap: 'Zulfikar Akbar', tempatLahir: 'Surabaya', tanggalLahir: '2009-02-14',
    jenisKelamin: 'L', alamat: 'Jl. Semarang No. 100, Surabaya', noHp: '081200001111',
    email: 'zulfikar@gmail.com', jalur: 'reguler',
    dokumen: [{ id: 'd1', jenis: 'kk', namaFile: 'kk_zulfikar.pdf' }, { id: 'd2', jenis: 'akta', namaFile: 'akta_zulfikar.pdf' }],
    status: 'verifikasi', tanggalDaftar: '2025-05-10',
  },
  {
    id: 'spmb2', namaLengkap: 'Aisyah Khadijah', tempatLahir: 'Gresik', tanggalLahir: '2009-06-20',
    jenisKelamin: 'P', alamat: 'Jl. Kalijudan No. 50, Surabaya', noHp: '081200002222',
    email: 'aisyah@gmail.com', jalur: 'prestasi',
    dokumen: [{ id: 'd3', jenis: 'kk', namaFile: 'kk_aisyah.pdf' }, { id: 'd4', jenis: 'rapor', namaFile: 'rapor_aisyah.pdf' }],
    status: 'diterima', nilaiTes: 88, nilaiWawancara: 90, tanggalDaftar: '2025-05-05',
  },
  {
    id: 'spmb3', namaLengkap: 'Bima Sakti', tempatLahir: 'Sidoarjo', tanggalLahir: '2009-11-08',
    jenisKelamin: 'L', alamat: 'Jl. Kenjeran No. 75, Surabaya', noHp: '081200003333',
    email: 'bima@gmail.com', jalur: 'afirmasi',
    dokumen: [{ id: 'd5', jenis: 'kk', namaFile: 'kk_bima.pdf' }, { id: 'd6', jenis: 'akta', namaFile: 'akta_bima.pdf' }],
    status: 'pending', tanggalDaftar: '2025-06-01',
  },
  {
    id: 'spmb4', namaLengkap: 'Cindy Aurelia', tempatLahir: 'Surabaya', tanggalLahir: '2009-04-30',
    jenisKelamin: 'P', alamat: 'Jl. Dharmahusada No. 120, Surabaya', noHp: '081200004444',
    email: 'cindy@gmail.com', jalur: 'reguler',
    dokumen: [{ id: 'd7', jenis: 'ijazah', namaFile: 'ijazah_cindy.pdf' }],
    status: 'diterima', nilaiTes: 92, nilaiWawancara: 85, tanggalDaftar: '2025-05-15',
  },
  {
    id: 'spmb5', namaLengkap: 'Daffa Maulana', tempatLahir: 'Mojokerto', tanggalLahir: '2009-09-17',
    jenisKelamin: 'L', alamat: 'Jl. Manyar No. 33, Surabaya', noHp: '081200005555',
    email: 'daffa@gmail.com', jalur: 'reguler',
    dokumen: [{ id: 'd8', jenis: 'kk', namaFile: 'kk_daffa.pdf' }],
    status: 'ditolak', nilaiTes: 55, nilaiWawancara: 60, tanggalDaftar: '2025-05-20',
  },
  {
    id: 'spmb6', namaLengkap: 'Elvira Sari', tempatLahir: 'Surabaya', tanggalLahir: '2009-01-25',
    jenisKelamin: 'P', alamat: 'Jl. Kertajaya No. 88, Surabaya', noHp: '081200006666',
    email: 'elvira@gmail.com', jalur: 'prestasi',
    dokumen: [{ id: 'd9', jenis: 'rapor', namaFile: 'rapor_elvira.pdf' }],
    status: 'verifikasi', tanggalDaftar: '2025-06-10',
  },
  {
    id: 'spmb7', namaLengkap: 'Farhan Aditya', tempatLahir: 'Lamongan', tanggalLahir: '2009-08-12',
    jenisKelamin: 'L', alamat: 'Jl. Sutorejo No. 40, Surabaya', noHp: '081200007777',
    email: 'farhan@gmail.com', jalur: 'reguler',
    dokumen: [{ id: 'd10', jenis: 'kk', namaFile: 'kk_farhan.pdf' }, { id: 'd11', jenis: 'akta', namaFile: 'akta_farhan.pdf' }],
    status: 'pending', tanggalDaftar: '2025-07-01',
  },
  {
    id: 'spmb8', namaLengkap: 'Ghina Naura', tempatLahir: 'Surabaya', tanggalLahir: '2009-03-05',
    jenisKelamin: 'P', alamat: 'Jl. Mulyosari No. 65, Surabaya', noHp: '081200008888',
    email: 'ghina@gmail.com', jalur: 'afirmasi',
    dokumen: [{ id: 'd12', jenis: 'kk', namaFile: 'kk_ghina.pdf' }],
    status: 'verifikasi', tanggalDaftar: '2025-06-25',
  },
];
