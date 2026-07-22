'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyDispositions, dummyLettersIn } from '@/data/letters';
import { dummyEmployees } from '@/data/employees';

function DisposisiContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const belum = dummyDispositions.filter((d) => d.status === 'belum').length;
  const proses = dummyDispositions.filter((d) => d.status === 'proses').length;
  const selesai = dummyDispositions.filter((d) => d.status === 'selesai').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Disposisi</h1>
          <p className="text-gray-500 mt-1">Alur instruksi & tindak lanjut surat</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard title="Belum Diproses" value={belum} icon="⚠️" color="yellow" />
          <StatCard title="Dalam Proses" value={proses} icon="🔄" color="blue" />
          <StatCard title="Selesai" value={selesai} icon="✅" color="green" />
        </div>

        <Card title="Daftar Disposisi">
          <div className="space-y-3">
            {dummyDispositions.map((d) => {
              const letter = dummyLettersIn.find((l) => l.id === d.letterId);
              const dari = dummyEmployees.find((e) => e.id === d.dari);
              const ke = dummyEmployees.find((e) => e.id === d.ke);
              return (
                <div key={d.id} className="p-4 bg-gray-50 rounded-lg flex items-start justify-between group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400">{letter?.noAgenda}</span>
                      <span className="text-sm text-gray-500">dari</span>
                      <span className="text-sm font-medium text-gray-700">{dari?.nama}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-sm font-medium text-gray-700">{ke?.nama}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{d.instruksi}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>Tenggat: {d.tenggat}</span>
                      {d.catatan && <span>Catatan: {d.catatan}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant(d.status) as 'success' | 'warning' | 'danger' | 'info' | 'default'}>{d.status}</Badge>
                    {d.status !== 'selesai' && (
                      <button className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-all">
                        Update
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default function DisposisiPage() {
  return <DisposisiContent />;
}
