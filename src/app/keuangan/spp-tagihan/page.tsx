'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyBills, dummyBillingTypes } from '@/data/finance';
import { dummyStudents } from '@/data/students';
import { Bill } from '@/types';

function SPPTagihanContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [bills] = useState(dummyBills);

  if (!user) { router.push('/'); return null; }

  const totalLunas = bills.filter((b) => b.status === 'lunas').length;
  const totalBelum = bills.filter((b) => b.status === 'belum').length;
  const totalCicil = bills.filter((b) => b.status === 'cicil').length;
  const totalNominal = bills.reduce((s, b) => s + b.nominal, 0);

  const columns = [
    {
      key: 'siswa', header: 'Siswa',
      render: (b: Bill) => {
        const s = dummyStudents.find((st) => st.id === b.siswaId);
        return <span className="font-medium text-gray-800">{s?.namaLengkap || '-'}</span>;
      },
    },
    {
      key: 'jenis', header: 'Jenis Tagihan',
      render: (b: Bill) => {
        const bt = dummyBillingTypes.find((t) => t.id === b.jenisTagihanId);
        return bt?.nama || '-';
      },
    },
    { key: 'periode', header: 'Periode' },
    {
      key: 'nominal', header: 'Nominal',
      render: (b: Bill) => <span className="font-medium">Rp {b.nominal.toLocaleString()}</span>,
    },
    {
      key: 'status', header: 'Status',
      render: (b: Bill) => <Badge variant={statusVariant(b.status) as 'success' | 'warning' | 'danger' | 'info' | 'default'}>{b.status}</Badge>,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">SPP & Tagihan</h1>
            <p className="text-gray-500 mt-1">Kelola tagihan siswa</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50" title="Generate tagihan bulanan (coming soon)">🔄 Generate</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50" title="Cetak kwitansi (coming soon)">🖨️ Cetak</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard title="Total Tagihan" value={`Rp ${totalNominal.toLocaleString()}`} color="blue" />
          <StatCard title="Lunas" value={totalLunas} color="green" />
          <StatCard title="Belum Bayar" value={totalBelum} color="red" />
          <StatCard title="Cicilan" value={totalCicil} color="yellow" />
        </div>

        <Card title="Daftar Tagihan" subtitle={`${bills.length} tagihan`}>
          <DataTable
            columns={columns}
            data={bills}
            keyExtractor={(b) => b.id}
            searchPlaceholder="Cari siswa..."
            searchKeys={['siswaId']}
          />
        </Card>

        {/* Tagihan types reference */}
        <Card title="Jenis Tagihan">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dummyBillingTypes.map((bt) => (
              <div key={bt.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-800">{bt.nama}</p>
                <p className="text-lg font-bold text-blue-600 mt-1">Rp {bt.nominal.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{bt.periode}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default function SPPTagihanPage() {
  return <SPPTagihanContent />;
}
