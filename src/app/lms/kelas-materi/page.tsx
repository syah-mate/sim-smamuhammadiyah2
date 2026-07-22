'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { dummyLMSClasses, dummyLMSMaterials } from '@/data/lms';

function KelasMateriContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const isGuru = user.roles.includes('guru');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">LMS — Kelas & Materi</h1>
            <p className="text-gray-500 mt-1">Kelola kelas online dan materi pembelajaran</p>
          </div>
          {isGuru && (
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">+ Upload Materi</button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard title="Kelas Aktif" value={dummyLMSClasses.length} icon="📚" color="blue" />
          <StatCard title="Materi" value={dummyLMSMaterials.length} icon="📄" color="green" />
          <StatCard title="Siswa Terdaftar" value="90+" icon="👥" color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dummyLMSClasses.map((cls) => (
            <Card key={cls.id} title={`📘 ${cls.namaMapel}`} subtitle={`Kelas ${cls.kelasId} — ${cls.tahunAjaran}`}>
              <div className="space-y-2">
                {dummyLMSMaterials.filter((m) => m.classId === cls.id).map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📎</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{m.judul}</p>
                        <p className="text-xs text-gray-400">{m.tanggalUpload}</p>
                      </div>
                    </div>
                    <button className="text-blue-600 text-sm hover:underline">Lihat →</button>
                  </div>
                ))}
                {dummyLMSMaterials.filter((m) => m.classId === cls.id).length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">Belum ada materi</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default function KelasMateriPage() {
  return <KelasMateriContent />;
}
