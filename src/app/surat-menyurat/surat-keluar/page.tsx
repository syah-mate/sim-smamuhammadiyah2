'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import { Card, StatCard } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { dummyLettersOut } from '@/data/letters';
import { LetterOut } from '@/types';

function SuratKeluarContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const columns = [
    { key: 'noSurat', header: 'No Surat' },
    { key: 'tanggal', header: 'Tanggal' },
    { key: 'tujuan', header: 'Tujuan' },
    { key: 'perihal', header: 'Perihal', render: (l: LetterOut) => <span className="text-gray-800">{l.perihal}</span> },
    { key: 'dibuatOleh', header: 'Dibuat Oleh' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Surat Keluar</h1>
            <p className="text-gray-500 mt-1">Arsip surat keluar & template</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">📄 Template Surat</button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2">
              + Buat Surat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard title="Total Surat Keluar" value={dummyLettersOut.length} icon="📤" color="blue" />
          <StatCard title="Bulan Ini" value={dummyLettersOut.length} icon="📅" color="green" />
          <StatCard title="Format Otomatis" value="001/SMA-M2/VII/2026" icon="🔢" color="purple" />
        </div>

        <Card title="Daftar Surat Keluar">
          <DataTable
            columns={columns}
            data={dummyLettersOut}
            keyExtractor={(l) => l.id}
            searchPlaceholder="Cari perihal, tujuan..."
            searchKeys={['perihal', 'tujuan', 'noSurat']}
          />
        </Card>
      </div>
    </MainLayout>
  );
}

export default function SuratKeluarPage() {
  return <SuratKeluarContent />;
}
