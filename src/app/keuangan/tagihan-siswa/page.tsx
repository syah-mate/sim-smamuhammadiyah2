'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyBills, dummyBillingTypes, dummyPayments } from '@/data/finance';
import { dummyStudents } from '@/data/students';
import { dummyEmployees } from '@/data/employees';
import { StudentBillSummary } from '@/types';

// --- Konstanta ---
const TAHUN_AJARAN_OPTIONS = ['2026/2027', '2025/2026', '2024/2025'];

const ALL_MONTHS = [
  { num: 1, label: 'Juli' },
  { num: 2, label: 'Agustus' },
  { num: 3, label: 'September' },
  { num: 4, label: 'Oktober' },
  { num: 5, label: 'November' },
  { num: 6, label: 'Desember' },
  { num: 7, label: 'Januari' },
  { num: 8, label: 'Februari' },
  { num: 9, label: 'Maret' },
  { num: 10, label: 'April' },
  { num: 11, label: 'Mei' },
  { num: 12, label: 'Juni' },
];

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function generateNoTransaksi(tanggal: string, index: number): string {
  const d = tanggal.replace(/-/g, '');
  const seq = String(index).padStart(4, '0');
  return `INV${d}${seq}`;
}

// ==================== Daftar Tagihan Siswa ====================

function DaftarTagihanSiswa({ onSelectSiswa }: { onSelectSiswa: (siswaId: string) => void }) {
  const [search, setSearch] = useState('');
  const [tahunAjaran, setTahunAjaran] = useState('2026/2027');

  const summaries: StudentBillSummary[] = useMemo(() => {
    const siswaIds = [...new Set(dummyBills.map(b => b.siswaId))];
    return siswaIds.map(sid => {
      const s = dummyStudents.find(st => st.id === sid);
      const bills = dummyBills.filter(b => b.siswaId === sid && b.tahunAjaran === tahunAjaran);
      const totalTagihan = bills.reduce((sum, b) => sum + b.nominal, 0);
      const totalTerbayar = bills
        .filter(b => b.status === 'lunas')
        .reduce((sum, b) => sum + b.nominal, 0) +
        bills.filter(b => b.status === 'cicil').reduce((sum, b) => sum + Math.round(b.nominal * 0.5), 0);
      return {
        siswaId: sid,
        nis: s?.nis || '-',
        namaSiswa: s?.namaLengkap || '-',
        status: s?.status || 'Aktif',
        kelas: s?.kelas || '-',
        totalTagihan,
        totalTerbayar,
        totalBelumTerbayar: totalTagihan - totalTerbayar,
      };
    });
  }, [tahunAjaran]);

  const filtered = summaries.filter(s =>
    s.namaSiswa.toLowerCase().includes(search.toLowerCase()) ||
    s.nis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card
      title="Daftar Tagihan Siswa"
      action={
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import
          </button>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>Tahun Ajaran:</span>
            <select value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 outline-none">
              {TAHUN_AJARAN_OPTIONS.map(ta => <option key={ta} value={ta}>{ta}</option>)}
            </select>
          </div>
        </div>
      }
    >
      <div className="mb-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" placeholder="Cari Siswa..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-4 py-3 text-left font-semibold">Nama Siswa</th>
              <th className="px-4 py-3 text-left font-semibold">NIS</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Kelas</th>
              <th className="px-4 py-3 text-right font-semibold">Total Tagihan</th>
              <th className="px-4 py-3 text-right font-semibold">Terbayar</th>
              <th className="px-4 py-3 text-right font-semibold">Belum Terbayar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">Tidak ada data</td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.siswaId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onSelectSiswa(s.siswaId)}
                      className="text-green-700 hover:text-green-900 font-medium hover:underline text-left"
                    >
                      {s.namaSiswa}
                    </button>
                    <div className="text-xs text-green-600 mt-0.5">Detail Tagihan</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.nis}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.status.toLowerCase() === 'aktif' ? 'success' : 'default'}>{s.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{s.kelas}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatRupiah(s.totalTagihan)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">{formatRupiah(s.totalTerbayar)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-red-600">{formatRupiah(s.totalBelumTerbayar)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ==================== Detail Tagihan Siswa ====================

function DetailTagihanSiswa({ siswaId, onBack }: { siswaId: string; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'bulanan' | 'insidental'>('bulanan');
  const [tahunAjaran, setTahunAjaran] = useState('2026/2027');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const ROWS_OPTIONS = [5, 10, 15, 20];

  const siswa = dummyStudents.find(s => s.id === siswaId);

  // Payments terkait siswa ini
  const relatedPayments = dummyPayments.filter(p => {
    const bill = dummyBills.find(b => b.id === p.billId);
    return bill && bill.siswaId === siswaId;
  });

  const totalPages = Math.ceil(relatedPayments.length / rowsPerPage);
  const paginatedPayments = relatedPayments.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Hitung total terbayar & belum dari semua pembayaran
  const totalTerbayar = relatedPayments.reduce((sum, p) => sum + p.nominalDibayar, 0);

  // Total tagihan seluruhnya untuk siswa ini
  const allBills = dummyBills.filter(b => b.siswaId === siswaId && b.tahunAjaran === tahunAjaran);
  const totalTagihan = allBills.reduce((sum, b) => sum + b.nominal, 0);

  // Jenis tagihan bulanan untuk tabel
  const monthlyBillingTypes = dummyBillingTypes.filter(bt => bt.periode === 'bulanan' && bt.isActive);
  const incidentalBillingTypes = dummyBillingTypes.filter(bt => bt.periode !== 'bulanan' && bt.isActive);

  // Generate status per bulan per jenis tagihan (mock: 6 bulan pertama lunas, sisanya belum)
  const getMonthStatus = (btId: string, monthNum: number): 'lunas' | 'belum' => {
    // Simulasi: bulan 1-6 lunas, bulan 7+ belum
    // Kecuali SPP SD (bt1) yang semua belum
    if (btId === 'bt1') return monthNum <= 5 ? 'lunas' : 'belum';
    if (btId === 'bt2') return monthNum <= 6 ? 'lunas' : 'belum';
    if (btId === 'bt3') return monthNum <= 7 ? 'lunas' : 'belum';
    return monthNum <= 5 ? 'lunas' : 'belum';
  };

  if (!siswa) {
    return (
      <div>
        <button onClick={onBack} className="text-green-600 hover:underline text-sm mb-4 inline-flex items-center gap-1">
          ← Kembali ke Daftar Tagihan
        </button>
        <p className="text-gray-500">Data siswa tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div>
        <button onClick={onBack} className="text-green-600 hover:text-green-800 text-sm mb-2 inline-flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Tagihan
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Keuangan</span>
          <span className="text-gray-400">›</span>
          <span>Tagihan Siswa</span>
          <span className="text-gray-400">›</span>
          <span className="text-gray-800 font-medium">Detail</span>
        </div>
      </div>

      {/* Student Name Header */}
      <h1 className="text-2xl font-bold text-gray-800">{siswa.namaLengkap}</h1>

      {/* Top Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Student Info Card (4 cols) */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <div className="flex flex-col">
              {/* Avatar + Status */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <Badge variant="success" className="text-sm px-3 py-1">Status: {siswa.status === 'aktif' ? 'Aktif' : siswa.status}</Badge>
                  <p className="text-sm text-gray-600 mt-1.5">Kelas Terakhir: {siswa.kelas}</p>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 font-medium">Total Tagihan Terbayar</p>
                  <p className="text-xl font-bold text-green-700 mt-1">{formatRupiah(totalTerbayar)}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 font-medium">Total Tagihan Belum Terbayar</p>
                  <p className="text-xl font-bold text-red-700 mt-1">{formatRupiah(totalTagihan - totalTerbayar)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT: Riwayat Transaksi (8 cols) */}
        <div className="lg:col-span-8">
          <Card title="Riwayat Transaksi" padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-5 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Tanggal</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">No. Transaksi</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Mtd. Pembayaran</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Petugas</th>
                    <th className="px-5 py-3 text-right font-semibold text-gray-600 text-xs uppercase tracking-wider">Nilai Transaksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-gray-400">Belum ada transaksi</td>
                    </tr>
                  ) : (
                    paginatedPayments.map((p, idx) => {
                      const petugas = dummyEmployees.find(e => e.id === p.dicatatOleh);
                      const globalIdx = (page - 1) * rowsPerPage + idx + 1;
                      return (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3 text-gray-600">{p.tanggalBayar}</td>
                          <td className="px-5 py-3">
                            <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-mono text-xs font-medium">
                              {generateNoTransaksi(p.tanggalBayar, globalIdx + 26)}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-700">{p.metode}</td>
                          <td className="px-5 py-3 text-gray-600">{petugas?.nama || '-'}</td>
                          <td className="px-5 py-3 text-right font-semibold text-gray-800">{formatRupiah(p.nominalDibayar)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {relatedPayments.length > 0 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50/50 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span>Rows per page</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                    className="border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 outline-none"
                  >
                    {ROWS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <span>Page {page} of {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Bottom: Tagihan Bulanan / Insidental */}
      <Card padding={false}>
        {/* Sub-tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex gap-0 -mb-px">
            <button
              onClick={() => setActiveTab('bulanan')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'bulanan'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tagihan Bulanan
            </button>
            <button
              onClick={() => setActiveTab('insidental')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'insidental'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tagihan Insidental
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="relative max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text" placeholder="Cari Data..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span>Tahun Ajaran:</span>
                <select value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 outline-none">
                  {TAHUN_AJARAN_OPTIONS.map(ta => <option key={ta} value={ta}>{ta}</option>)}
                </select>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah
              </button>
            </div>
          </div>

          {activeTab === 'bulanan' ? (
            /* Tabel Tagihan Bulanan */
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="px-4 py-3 text-left font-semibold sticky left-0 bg-green-600 z-10 min-w-[160px]">
                      Jenis Tagihan
                    </th>
                    {ALL_MONTHS.map(m => (
                      <th key={m.num} className="px-3 py-3 text-center font-semibold min-w-[120px]">
                        {m.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {monthlyBillingTypes.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="px-4 py-12 text-center text-gray-400">
                        Tidak ada jenis tagihan bulanan.
                      </td>
                    </tr>
                  ) : (
                    monthlyBillingTypes.map(bt => (
                      <tr key={bt.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-800 sticky left-0 bg-white z-5 border-r border-gray-100">
                          {bt.nama}
                        </td>
                        {ALL_MONTHS.map(m => {
                          const status = getMonthStatus(bt.id, m.num);
                          const isPaid = status === 'lunas';
                          return (
                            <td key={m.num} className="px-3 py-3 text-center">
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                                  isPaid
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-red-50 text-red-600 border border-red-200'
                                }`}
                              >
                                {formatRupiah(bt.nominal)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Tagihan Insidental */
            <div className="space-y-3">
              {incidentalBillingTypes.length === 0 ? (
                <p className="text-center text-gray-400 py-12">Tidak ada jenis tagihan insidental.</p>
              ) : (
                incidentalBillingTypes.map(bt => {
                  const bill = allBills.find(b => b.jenisTagihanId === bt.id);
                  const isPaid = bill?.status === 'lunas';
                  const isCicil = bill?.status === 'cicil';
                  return (
                    <div key={bt.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800">{bt.nama}</p>
                        <p className="text-xs text-gray-500 capitalize">{bt.periode} · {bt.deskripsi}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{formatRupiah(bt.nominal)}</p>
                        <Badge variant={isPaid ? 'success' : isCicil ? 'warning' : 'danger'}>
                          {isPaid ? 'Lunas' : isCicil ? 'Cicil' : 'Belum'}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ==================== Halaman Utama ====================

function TagihanSiswaContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedSiswaId, setSelectedSiswaId] = useState<string | null>(null);

  if (!user) { router.push('/'); return null; }

  if (selectedSiswaId) {
    return (
      <MainLayout>
        <DetailTagihanSiswa
          siswaId={selectedSiswaId}
          onBack={() => setSelectedSiswaId(null)}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Keuangan</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-800 font-medium">Tagihan Siswa</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Tagihan Siswa</h1>
          <p className="text-gray-500 mt-1">Kelola tagihan seluruh siswa</p>
        </div>

        <DaftarTagihanSiswa onSelectSiswa={setSelectedSiswaId} />
      </div>
    </MainLayout>
  );
}

export default function TagihanSiswaPage() {
  return <TagihanSiswaContent />;
}
