'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { dummyFinanceLedger, dummyPayments, dummyBills } from '@/data/finance';

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

function LaporanKeuanganContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const totalPemasukan = dummyFinanceLedger.filter((f) => f.jenis === 'pemasukan').reduce((s, f) => s + f.nominal, 0);
  const totalPengeluaran = dummyFinanceLedger.filter((f) => f.jenis === 'pengeluaran').reduce((s, f) => s + f.nominal, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
          <p className="text-gray-500 mt-1">Rekap pemasukan & pengeluaran sekolah</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <StatCard title="Total Pemasukan" value={`Rp ${totalPemasukan.toLocaleString()}`} color="green" />
          <StatCard title="Total Pengeluaran" value={`Rp ${totalPengeluaran.toLocaleString()}`} color="red" />
          <StatCard title="Saldo" value={`Rp ${(totalPemasukan - totalPengeluaran).toLocaleString()}`} color="blue" />
          <StatCard title="Tunggakan" value={`${dummyBills.filter((b) => b.status !== 'lunas').length} siswa`} color="yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="📈 Cashflow Bulanan (2026)" subtitle="Pemasukan vs Pengeluaran">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(_v: unknown) => [`Rp ${Number(_v).toLocaleString()}`, '']} />
                <Bar dataKey="pemasukan" fill="#10b981" name="Pemasukan" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pengeluaran" fill="#ef4444" name="Pengeluaran" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="🥧 Komposisi Pemasukan" subtitle="Per kategori">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(_entry: unknown) => { const e = _entry as { name: string; percent: number }; return `${e.name} ${(e.percent * 100).toFixed(0)}%`; }}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(_v: unknown) => [`Rp ${Number(_v).toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card title="💳 Ringkasan Transaksi Terbaru">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Tanggal</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Keterangan</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Jenis</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-600">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dummyFinanceLedger.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600">{f.tanggal}</td>
                    <td className="px-4 py-2 text-gray-800">{f.keterangan}</td>
                    <td className="px-4 py-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${f.jenis === 'pemasukan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {f.jenis}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      <span className={f.jenis === 'pemasukan' ? 'text-green-600' : 'text-red-600'}>
                        {f.jenis === 'pemasukan' ? '+' : '-'} Rp {f.nominal.toLocaleString()}
                      </span>
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

export default function LaporanKeuanganPage() {
  return <LaporanKeuanganContent />;
}
