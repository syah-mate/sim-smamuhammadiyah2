import { Account, PaymentMethod, BillingType, Bill, BillDetail, StudentBillSummary, Payment, CashTransaction, FinanceLedger } from '@/types';

// --- Akun ---
export const dummyAccounts: Account[] = [
  { id: 'ak1', kode: '1-1001', nama: 'Kas di Tangan', tipe: 'Kas dan Bank', deskripsi: 'Uang tunai di brankas sekolah', noRekening: '-' },
  { id: 'ak2', kode: '1-1002', nama: 'Bank Syariah Mandiri YPIT', tipe: 'Kas dan Bank', deskripsi: 'Rekening operasional BSM', noRekening: '2200007778' },
  { id: 'ak3', kode: '1-1003', nama: 'Kas Antar Jemput', tipe: 'Kas dan Bank', deskripsi: 'Dana antar jemput siswa', noRekening: '-' },
  { id: 'ak4', kode: '1-1004', nama: 'BTN YPIT', tipe: 'Kas dan Bank', deskripsi: 'Rekening tabungan BTN', noRekening: '7503002626' },
  { id: 'ak5', kode: '1-1005', nama: 'BSM LPIT', tipe: 'Kas dan Bank', deskripsi: 'Rekening BSM LPIT', noRekening: '7111111147' },
  { id: 'ak6', kode: '4-1001', nama: 'Pendapatan SPP', tipe: 'Pendapatan', deskripsi: 'Pendapatan dari SPP', noRekening: '-' },
  { id: 'ak7', kode: '4-1002', nama: 'Pendapatan Uang Makan', tipe: 'Pendapatan', deskripsi: 'Pendapatan uang makan siswa', noRekening: '-' },
  { id: 'ak8', kode: '4-1003', nama: 'Pendapatan Iuran Komite', tipe: 'Pendapatan', deskripsi: 'Pendapatan iuran komite', noRekening: '-' },
  { id: 'ak9', kode: '5-1001', nama: 'Beban Gaji', tipe: 'Beban', deskripsi: 'Beban gaji pegawai', noRekening: '-' },
  { id: 'ak10', kode: '5-1002', nama: 'Beban ATK', tipe: 'Beban', deskripsi: 'Beban alat tulis kantor', noRekening: '-' },
];

// --- Metode Pembayaran ---
export const dummyPaymentMethods: PaymentMethod[] = [
  { id: 'mp1', nama: 'Tunai', jenis: 'Tunai', noRekening: '-', atasNama: '-', isActive: true },
  { id: 'mp2', nama: 'Transfer Bank Syariah Mandiri YPIT', jenis: 'Transfer Bank', noRekening: '2200007778', atasNama: 'YPIT Muhammadiyah', isActive: true },
  { id: 'mp3', nama: 'Payment Gateway (BSI)', jenis: 'Payment Gateway', noRekening: '2200007778', atasNama: 'YPIT Muhammadiyah', isActive: true },
  { id: 'mp4', nama: 'Transfer BTN YPIT', jenis: 'Transfer Bank', noRekening: '7503002626', atasNama: 'YPIT Muhammadiyah', isActive: true },
  { id: 'mp5', nama: 'Virtual Account BSI', jenis: 'Virtual Account', noRekening: '88123123999', atasNama: 'SMA Muhammadiyah 2', isActive: true },
];

// --- Jenis Tagihan ---
export const dummyBillingTypes: BillingType[] = [
  { id: 'bt1', kode: 'SPP-SD', nama: 'SPP SD', nominal: 700000, periode: 'bulanan', akunId: 'ak6', deskripsi: 'SPP Reguler Bulanan', isActive: true },
  { id: 'bt2', kode: 'MAKAN-SD', nama: 'UANG MAKAN SD', nominal: 245000, periode: 'bulanan', akunId: 'ak7', deskripsi: 'Uang Makan Bulanan', isActive: true },
  { id: 'bt3', kode: 'KOMITE-SD', nama: 'IURAN KOMITE SD', nominal: 15000, periode: 'bulanan', akunId: 'ak8', deskripsi: 'Iuran Komite Bulanan', isActive: true },
  { id: 'bt4', kode: 'SPP', nama: 'SPP', nominal: 350000, periode: 'bulanan', akunId: 'ak6', deskripsi: 'SPP SMA', isActive: true },
  { id: 'bt5', kode: 'GEDUNG', nama: 'Uang Gedung', nominal: 5000000, periode: 'tahunan', akunId: 'ak6', deskripsi: 'Uang Gedung Tahunan', isActive: true },
  { id: 'bt6', kode: 'KEGIATAN', nama: 'Uang Kegiatan', nominal: 750000, periode: 'semester', akunId: 'ak6', deskripsi: 'Uang Kegiatan Semester', isActive: true },
  { id: 'bt7', kode: 'SERAGAM', nama: 'Uang Seragam', nominal: 1200000, periode: 'sekali', akunId: 'ak6', deskripsi: 'Uang Seragam Sekolah', isActive: true },
];

// --- Tagihan Siswa ---
export const dummyBills: Bill[] = [
  { id: 'b1', siswaId: 's1', jenisTagihanId: 'bt4', tahunAjaran: '2026/2027', nominal: 4200000, status: 'belum' },
  { id: 'b2', siswaId: 's2', jenisTagihanId: 'bt4', tahunAjaran: '2026/2027', nominal: 4200000, status: 'belum' },
  { id: 'b3', siswaId: 's3', jenisTagihanId: 'bt4', tahunAjaran: '2026/2027', nominal: 4200000, status: 'belum' },
  { id: 'b4', siswaId: 's4', jenisTagihanId: 'bt4', tahunAjaran: '2026/2027', nominal: 4200000, status: 'lunas' },
  { id: 'b5', siswaId: 's5', jenisTagihanId: 'bt4', tahunAjaran: '2026/2027', nominal: 4200000, status: 'cicil' },
  { id: 'b6', siswaId: 's6', jenisTagihanId: 'bt4', tahunAjaran: '2026/2027', nominal: 4200000, status: 'belum' },
  { id: 'b7', siswaId: 's7', jenisTagihanId: 'bt4', tahunAjaran: '2026/2027', nominal: 4200000, status: 'lunas' },
  { id: 'b8', siswaId: 's8', jenisTagihanId: 'bt4', tahunAjaran: '2026/2027', nominal: 4200000, status: 'lunas' },
];

export const dummyBillDetails: BillDetail[] = [
  // S1 bill details
  { id: 'bd1', billId: 'b1', bulan: 1, label: 'Juli', nominal: 350000, status: 'lunas' },
  { id: 'bd2', billId: 'b1', bulan: 2, label: 'Agustus', nominal: 350000, status: 'lunas' },
  { id: 'bd3', billId: 'b1', bulan: 3, label: 'September', nominal: 350000, status: 'lunas' },
  { id: 'bd4', billId: 'b1', bulan: 4, label: 'Oktober', nominal: 350000, status: 'lunas' },
  { id: 'bd5', billId: 'b1', bulan: 5, label: 'November', nominal: 350000, status: 'lunas' },
  { id: 'bd6', billId: 'b1', bulan: 6, label: 'Desember', nominal: 350000, status: 'lunas' },
  { id: 'bd7', billId: 'b1', bulan: 7, label: 'Januari', nominal: 350000, status: 'belum' },
  { id: 'bd8', billId: 'b1', bulan: 8, label: 'Februari', nominal: 350000, status: 'belum' },
  { id: 'bd9', billId: 'b1', bulan: 9, label: 'Maret', nominal: 350000, status: 'belum' },
  { id: 'bd10', billId: 'b1', bulan: 10, label: 'April', nominal: 350000, status: 'belum' },
  { id: 'bd11', billId: 'b1', bulan: 11, label: 'Mei', nominal: 350000, status: 'belum' },
  { id: 'bd12', billId: 'b1', bulan: 12, label: 'Juni', nominal: 350000, status: 'belum' },
];

// Student bill summaries (aggregated)
export function getStudentBillSummaries(): StudentBillSummary[] {
  const siswaIds = [...new Set(dummyBills.map(b => b.siswaId))];
  return siswaIds.map(sid => {
    const bills = dummyBills.filter(b => b.siswaId === sid);
    const totalTagihan = bills.reduce((s, b) => s + b.nominal, 0);
    const totalTerbayar = bills
      .filter(b => b.status === 'lunas')
      .reduce((s, b) => s + b.nominal, 0) +
      bills.filter(b => b.status === 'cicil').reduce((s, b) => s + b.nominal * 0.5, 0);
    return {
      siswaId: sid,
      nis: '',
      namaSiswa: '',
      status: 'Aktif',
      kelas: '',
      totalTagihan,
      totalTerbayar,
      totalBelumTerbayar: totalTagihan - totalTerbayar,
    };
  });
}

export const dummyPayments: Payment[] = [
  { id: 'p1', billId: 'b1', tanggalBayar: '2026-07-03', nominalDibayar: 3737000, metode: 'Payment Gateway (BSI)', metodeId: 'mp3', dicatatOleh: 'e3' },
  { id: 'p2', billId: 'b1', tanggalBayar: '2026-05-29', nominalDibayar: 940000, metode: 'Tunai', metodeId: 'mp1', dicatatOleh: 'e3' },
  { id: 'p3', billId: 'b1', tanggalBayar: '2026-04-10', nominalDibayar: 350000, metode: 'Transfer Bank Syariah Mandiri YPIT', metodeId: 'mp2', dicatatOleh: 'e3' },
  { id: 'p4', billId: 'b1', tanggalBayar: '2026-03-05', nominalDibayar: 350000, metode: 'Tunai', metodeId: 'mp1', dicatatOleh: 'e3' },
  { id: 'p5', billId: 'b1', tanggalBayar: '2026-02-12', nominalDibayar: 350000, metode: 'Payment Gateway (BSI)', metodeId: 'mp3', dicatatOleh: 'e3' },
  { id: 'p6', billId: 'b1', tanggalBayar: '2026-01-08', nominalDibayar: 350000, metode: 'Tunai', metodeId: 'mp1', dicatatOleh: 'e3' },
  { id: 'p7', billId: 'b1', tanggalBayar: '2025-12-03', nominalDibayar: 350000, metode: 'Transfer Bank Syariah Mandiri YPIT', metodeId: 'mp2', dicatatOleh: 'e3' },
  { id: 'p8', billId: 'b1', tanggalBayar: '2025-11-07', nominalDibayar: 350000, metode: 'Payment Gateway (BSI)', metodeId: 'mp3', dicatatOleh: 'e3' },
  { id: 'p9', billId: 'b1', tanggalBayar: '2025-10-04', nominalDibayar: 350000, metode: 'Tunai', metodeId: 'mp1', dicatatOleh: 'e3' },
  { id: 'p10', billId: 'b1', tanggalBayar: '2025-09-02', nominalDibayar: 350000, metode: 'Transfer Bank Syariah Mandiri YPIT', metodeId: 'mp2', dicatatOleh: 'e3' },
  { id: 'p11', billId: 'b1', tanggalBayar: '2025-08-06', nominalDibayar: 350000, metode: 'Tunai', metodeId: 'mp1', dicatatOleh: 'e3' },
  { id: 'p12', billId: 'b1', tanggalBayar: '2025-07-04', nominalDibayar: 350000, metode: 'Payment Gateway (BSI)', metodeId: 'mp3', dicatatOleh: 'e3' },
];

// --- Transaksi Kasir ---
export const dummyCashTransactions: CashTransaction[] = [
  { id: 'ct1', noTransaksi: 'INV2607280033', tanggal: '2026-07-28', jenis: 'penerimaan', akunId: 'ak6', petugasId: 'e3', metodeBayarId: 'mp2', keterangan: 'Infaq Sertifikasi Guru - Ahmad Fauzi', nominal: 350000 },
  { id: 'ct2', noTransaksi: 'INV2607250032', tanggal: '2026-07-25', jenis: 'penerimaan', akunId: 'ak6', petugasId: 'e3', metodeBayarId: 'mp1', keterangan: 'Pembayaran SPP - Andi Pratama', nominal: 500000 },
  { id: 'ct3', noTransaksi: 'INV2607240031', tanggal: '2026-07-24', jenis: 'penerimaan', akunId: 'ak7', petugasId: 'e3', metodeBayarId: 'mp3', keterangan: 'Uang Makan Juli - Kolektif', nominal: 1200000 },
  { id: 'ct4', noTransaksi: 'OUT2607280015', tanggal: '2026-07-28', jenis: 'pengeluaran', akunId: 'ak10', petugasId: 'e3', metodeBayarId: 'mp1', keterangan: 'Pembelian ATK Kantor', nominal: 275000 },
  { id: 'ct5', noTransaksi: 'OUT2607260014', tanggal: '2026-07-26', jenis: 'pengeluaran', akunId: 'ak9', petugasId: 'e3', metodeBayarId: 'mp2', keterangan: 'Biaya Listrik & Air', nominal: 850000 },
  { id: 'ct6', noTransaksi: 'INV2607220030', tanggal: '2026-07-22', jenis: 'penerimaan', akunId: 'ak8', petugasId: 'e3', metodeBayarId: 'mp1', keterangan: 'Iuran Komite - Semester 1', nominal: 1500000 },
  { id: 'ct7', noTransaksi: 'OUT2607200013', tanggal: '2026-07-20', jenis: 'pengeluaran', akunId: 'ak9', petugasId: 'e3', metodeBayarId: 'mp2', keterangan: 'Perbaikan AC Ruang Guru', nominal: 1200000 },
  { id: 'ct8', noTransaksi: 'INV2607180029', tanggal: '2026-07-18', jenis: 'penerimaan', akunId: 'ak6', petugasId: 'e3', metodeBayarId: 'mp2', keterangan: 'Uang Gedung - Cicilan ke-3', nominal: 2500000 },
];

export const dummyFinanceLedger: FinanceLedger[] = [
  { id: 'fl1', tanggal: '2026-07-01', keterangan: 'Pembayaran SPP Juli - 5 siswa', jenis: 'pemasukan', nominal: 1750000, kategori: 'SPP' },
  { id: 'fl2', tanggal: '2026-07-05', keterangan: 'Pembelian ATK', jenis: 'pengeluaran', nominal: 450000, kategori: 'ATK' },
  { id: 'fl3', tanggal: '2026-07-10', keterangan: 'Uang Gedung cicilan', jenis: 'pemasukan', nominal: 2500000, kategori: 'Uang Gedung' },
  { id: 'fl4', tanggal: '2026-07-15', keterangan: 'Biaya perbaikan AC', jenis: 'pengeluaran', nominal: 1200000, kategori: 'Pemeliharaan' },
  { id: 'fl5', tanggal: '2026-07-18', keterangan: 'Pembayaran kegiatan semester', jenis: 'pemasukan', nominal: 3750000, kategori: 'Kegiatan' },
  { id: 'fl6', tanggal: '2026-07-20', keterangan: 'Langganan internet', jenis: 'pengeluaran', nominal: 550000, kategori: 'Utilitas' },
];
