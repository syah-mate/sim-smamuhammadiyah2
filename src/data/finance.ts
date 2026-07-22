import { BillingType, Bill, Payment, FinanceLedger } from '@/types';

export const dummyBillingTypes: BillingType[] = [
  { id: 'bt1', nama: 'SPP', nominal: 350000, periode: 'bulanan' },
  { id: 'bt2', nama: 'Uang Gedung', nominal: 5000000, periode: 'tahunan' },
  { id: 'bt3', nama: 'Uang Kegiatan', nominal: 750000, periode: 'semester' },
  { id: 'bt4', nama: 'Uang Seragam', nominal: 1200000, periode: 'sekali' },
];

export const dummyBills: Bill[] = [
  { id: 'b1', siswaId: 's1', jenisTagihanId: 'bt1', periode: '2026-07', nominal: 350000, status: 'lunas' },
  { id: 'b2', siswaId: 's1', jenisTagihanId: 'bt2', periode: '2024/2025', nominal: 5000000, status: 'cicil' },
  { id: 'b3', siswaId: 's2', jenisTagihanId: 'bt1', periode: '2026-07', nominal: 350000, status: 'belum' },
  { id: 'b4', siswaId: 's3', jenisTagihanId: 'bt1', periode: '2026-07', nominal: 350000, status: 'belum' },
  { id: 'b5', siswaId: 's4', jenisTagihanId: 'bt1', periode: '2026-07', nominal: 350000, status: 'lunas' },
  { id: 'b6', siswaId: 's5', jenisTagihanId: 'bt1', periode: '2026-07', nominal: 350000, status: 'belum' },
  { id: 'b7', siswaId: 's7', jenisTagihanId: 'bt1', periode: '2026-07', nominal: 350000, status: 'lunas' },
  { id: 'b8', siswaId: 's8', jenisTagihanId: 'bt1', periode: '2026-07', nominal: 350000, status: 'lunas' },
  { id: 'b9', siswaId: 's4', jenisTagihanId: 'bt3', periode: '2024/2025-2', nominal: 750000, status: 'belum' },
  { id: 'b10', siswaId: 's1', jenisTagihanId: 'bt4', periode: '2024/2025', nominal: 1200000, status: 'lunas' },
];

export const dummyPayments: Payment[] = [
  { id: 'p1', billId: 'b1', tanggalBayar: '2026-07-05', nominalDibayar: 350000, metode: 'transfer', dicatatOleh: 'e3' },
  { id: 'p2', billId: 'b2', tanggalBayar: '2026-07-10', nominalDibayar: 2500000, metode: 'tunai', dicatatOleh: 'e3' },
  { id: 'p3', billId: 'b5', tanggalBayar: '2026-07-03', nominalDibayar: 350000, metode: 'va', dicatatOleh: 'e3' },
  { id: 'p4', billId: 'b7', tanggalBayar: '2026-07-01', nominalDibayar: 350000, metode: 'transfer', dicatatOleh: 'e3' },
  { id: 'p5', billId: 'b8', tanggalBayar: '2026-07-02', nominalDibayar: 350000, metode: 'tunai', dicatatOleh: 'e3' },
  { id: 'p6', billId: 'b10', tanggalBayar: '2026-07-12', nominalDibayar: 1200000, metode: 'transfer', dicatatOleh: 'e3' },
];

export const dummyFinanceLedger: FinanceLedger[] = [
  { id: 'fl1', tanggal: '2026-07-01', keterangan: 'Pembayaran SPP Juli - 5 siswa', jenis: 'pemasukan', nominal: 1750000, kategori: 'SPP' },
  { id: 'fl2', tanggal: '2026-07-05', keterangan: 'Pembelian ATK', jenis: 'pengeluaran', nominal: 450000, kategori: 'ATK' },
  { id: 'fl3', tanggal: '2026-07-10', keterangan: 'Uang Gedung cicilan', jenis: 'pemasukan', nominal: 2500000, kategori: 'Uang Gedung' },
  { id: 'fl4', tanggal: '2026-07-15', keterangan: 'Biaya perbaikan AC', jenis: 'pengeluaran', nominal: 1200000, kategori: 'Pemeliharaan' },
  { id: 'fl5', tanggal: '2026-07-18', keterangan: 'Pembayaran kegiatan semester', jenis: 'pemasukan', nominal: 3750000, kategori: 'Kegiatan' },
  { id: 'fl6', tanggal: '2026-07-20', keterangan: 'Langganan internet', jenis: 'pengeluaran', nominal: 550000, kategori: 'Utilitas' },
];
