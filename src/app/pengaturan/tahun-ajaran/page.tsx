'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';

function TahunAjaranContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const currentTA = '2024/2025';
  const nextTA = '2025/2026';

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tahun Ajaran</h1>
          <p className="text-gray-500 mt-1">Konfigurasi tahun ajaran & semester</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Current TA */}
          <Card title="📅 Tahun Ajaran Aktif">
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-blue-600">{currentTA}</p>
              <p className="text-sm text-gray-500 mt-2">Semester 2 (Genap)</p>
              <Badge variant="success" className="mt-3">Aktif</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Semester 1</p>
                <p className="font-medium text-gray-800">Juli - Desember 2024</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-500">Semester 2 (Aktif)</p>
                <p className="font-medium text-blue-800">Januari - Juni 2025</p>
              </div>
            </div>
          </Card>

          {/* Next TA */}
          <Card title="📅 Tahun Ajaran Berikutnya">
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-gray-400">{nextTA}</p>
              <p className="text-sm text-gray-400 mt-2">Belum dimulai</p>
              <Badge variant="default" className="mt-3">Nonaktif</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Semester 1</p>
                <p className="font-medium text-gray-800">Juli - Desember 2025</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Semester 2</p>
                <p className="font-medium text-gray-800">Januari - Juni 2026</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Settings */}
        <Card title="⚙️ Konfigurasi">
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Kenaikan Kelas Otomatis</p>
                <p className="text-gray-500">Naikkan semua siswa ke kelas berikutnya di akhir tahun ajaran</p>
              </div>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Proses</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Generate Semester Baru</p>
                <p className="text-gray-500">Buat data semester baru untuk tahun ajaran {nextTA}</p>
              </div>
              <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">Generate</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Arsip Tahun Ajaran Lama</p>
                <p className="text-gray-500">Arsipkan data tahun ajaran yang sudah selesai</p>
              </div>
              <button className="px-3 py-1.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-100">Arsipkan</button>
            </div>
          </div>
        </Card>

        {/* Riwayat TA */}
        <Card title="📋 Riwayat Tahun Ajaran">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Tahun Ajaran</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Jumlah Siswa</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { ta: '2024/2025', status: 'aktif', siswa: 320 },
                  { ta: '2023/2024', status: 'arsip', siswa: 305 },
                  { ta: '2022/2023', status: 'arsip', siswa: 298 },
                ].map((ta) => (
                  <tr key={ta.ta} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-800">{ta.ta}</td>
                    <td className="px-4 py-2"><Badge variant={ta.status === 'aktif' ? 'success' : 'default'}>{ta.status}</Badge></td>
                    <td className="px-4 py-2 text-gray-600">{ta.siswa}</td>
                    <td className="px-4 py-2">
                      {ta.status === 'arsip' && <button className="text-blue-600 text-xs hover:underline">Lihat</button>}
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

export default function TahunAjaranPage() {
  return <TahunAjaranContent />;
}
