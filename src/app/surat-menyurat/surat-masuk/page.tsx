'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyLettersIn } from '@/data/letters';
import { LetterIn } from '@/types';

function SuratMasukContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const belumDisposisi = dummyLettersIn.filter((l) => !l.statusDisposisi).length;

  const columns = [
    { key: 'noAgenda', header: 'No Agenda' },
    { key: 'noSurat', header: 'No Surat' },
    { key: 'tanggalTerima', header: 'Tgl Terima' },
    { key: 'pengirim', header: 'Pengirim' },
    { key: 'perihal', header: 'Perihal', render: (l: LetterIn) => <span className="text-gray-800">{l.perihal}</span> },
    {
      key: 'statusDisposisi', header: 'Disposisi',
      render: (l: LetterIn) => l.statusDisposisi ? <Badge variant="success">Sudah</Badge> : <Badge variant="warning">Belum</Badge>,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Surat Masuk</h1>
            <p className="text-gray-500 mt-1">Arsip surat masuk & disposisi</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2">
            + Input Surat Masuk
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard title="Total Surat Masuk" value={dummyLettersIn.length} icon="📥" color="blue" />
          <StatCard title="Belum Disposisi" value={belumDisposisi} icon="⚠️" color="yellow" />
          <StatCard title="Sudah Disposisi" value={dummyLettersIn.length - belumDisposisi} icon="✅" color="green" />
        </div>

        <Card title="Daftar Surat Masuk">
          <DataTable
            columns={columns}
            data={dummyLettersIn}
            keyExtractor={(l) => l.id}
            searchPlaceholder="Cari perihal, pengirim..."
            searchKeys={['perihal', 'pengirim', 'noSurat']}
            actions={() => (
              <>
                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs" title="Upload scan (coming soon)">📎</button>
                <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg text-xs" title="Disposisi">🔄</button>
              </>
            )}
          />
        </Card>
      </div>
    </MainLayout>
  );
}

export default function SuratMasukPage() {
  return <SuratMasukContent />;
}
