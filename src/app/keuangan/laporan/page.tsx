'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dummyFinanceLedger, dummyBills, dummyCashTransactions } from '@/data/finance';

const cashflowData = [
  { bulan: 'Jan', pemasukan: 12500000, pengeluaran: 3200000 },
  { bulan: 'Feb', pemasukan: 10800000, pengeluaran: 2800000 },
  { bulan: 'Mar', pemasukan: 13200000, pengeluaran: 4100000 },
  { bulan: 'Apr', pemasukan: 11500000, pengeluaran: 3500000 },
  { bulan: 'Mei', pemasukan: 14000000, pengeluaran: 2900000 },
  { bulan: 'Jun', pemasukan: 15800000, pengeluaran: 4500000 },
  { bulan: 'Jul', pemasukan: 9800000, pengeluaran: 3100000 },
];

const pieData = [
  { name: 'SPP', value: 6500000 },
  { name: 'Uang Gedung', value: 2500000 },
  { name: 'Kegiatan', value: 3750000 },
  { name: 'Lainnya', value: 1250000 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function LaporanContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const totalPemasukan = dummyCashTransactions
    .filter((f) => f.jenis === 'penerimaan')
    .reduce((s, f) => s + f.nominal, 0);
  const totalPengeluaran = dummyCashTransactions
    .filter((f) => f.jenis === 'pengeluaran')
    .reduce((s, f) => s + f.nominal, 0);
  const saldo = totalPemasukan - totalPengeluaran;
  const totalTunggakan = dummyBills.filter((b) => b.status !== 'lunas').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Keuangan</span>
            <span>›</span>
            <span className="text-gray-800 font-medium">Laporan</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
          <p className="text-gray-500 mt-1">Rekap pemasukan & pengeluaran sekolah</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <StatCard title="Total Pemasukan" value={formatRupiah(totalPemasukan)} color="green" />
          <StatCard title="Total Pengeluaran" value={formatRupiah(totalPengeluaran)} color="red" />
          <StatCard title="Saldo" value={formatRupiah(saldo)} color="blue" />
          <StatCard title="Tunggakan" value={`${totalTunggakan} siswa`} color="yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="📈 Cashflow Bulanan (2026)" subtitle="Pemasukan vs Pengeluaran">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(_v: unknown) => [formatRupiah(Number(_v)), '']} />
                <Bar dataKey="pemasukan" fill="#10b981" name="Pemasukan" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pengeluaran" fill="#ef4444" name="Pengeluaran" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="🥧 Komposisi Pemasukan" subtitle="Per kategori">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={(_entry: unknown) => {
                    const e = _entry as { name: string; percent: number };
                    return `${e.name} ${(e.percent * 100).toFixed(0)}%`;
                  }}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(_v: unknown) => [formatRupiah(Number(_v)), '']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card title="💳 Ringkasan Transaksi Terbaru">
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                  <th className="px-4 py-3 text-left font-semibold">No. Transaksi</th>
                  <th className="px-4 py-3 text-left font-semibold">Keterangan</th>
                  <th className="px-4 py-3 text-left font-semibold">Jenis</th>
                  <th className="px-4 py-3 text-right font-semibold">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {dummyCashTransactions.slice(0, 10).map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">{t.tanggal}</td>
                    <td className="px-4 py-3">
                      <span className="text-blue-600 font-mono text-xs">{t.noTransaksi}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-800">{t.keterangan}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        t.jenis === 'penerimaan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {t.jenis}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${t.jenis === 'penerimaan' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatRupiah(t.nominal)}
                    </td>
                  </tr>
                ))}
                {dummyCashTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400">Belum ada transaksi</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="📋 Jurnal Umum (Ledger)">
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                  <th className="px-4 py-3 text-left font-semibold">Keterangan</th>
                  <th className="px-4 py-3 text-left font-semibold">Kategori</th>
                  <th className="px-4 py-3 text-left font-semibold">Jenis</th>
                  <th className="px-4 py-3 text-right font-semibold">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {dummyFinanceLedger.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{f.tanggal}</td>
                    <td className="px-4 py-3 text-gray-800">{f.keterangan}</td>
                    <td className="px-4 py-3 text-gray-600">{f.kategori}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        f.jenis === 'pemasukan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {f.jenis}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${f.jenis === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatRupiah(f.nominal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default function LaporanPage() {
  return <LaporanContent />;
}
