'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyAttendanceEmployees } from '@/data/attendance';
import { dummyEmployees } from '@/data/employees';

function PresensiPegawaiContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [attendances] = useState(dummyAttendanceEmployees);
  const [selectedDate, setSelectedDate] = useState('2026-07-22');

  if (!user) { router.push('/'); return null; }

  const filtered = attendances.filter((a) => !selectedDate || a.tanggal === selectedDate);
  const hadir = filtered.filter((a) => a.status === 'hadir').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Presensi Pegawai</h1>
          <p className="text-gray-500 mt-1">Check-in/out harian guru & staf</p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tanggal</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard title="Hadir" value={hadir} icon="✅" color="green" />
          <StatCard title="Izin" value={filtered.filter((a) => a.status === 'izin').length} icon="📝" color="blue" />
          <StatCard title="Sakit" value={filtered.filter((a) => a.status === 'sakit').length} icon="🏥" color="yellow" />
          <StatCard title="Alpha" value={filtered.filter((a) => a.status === 'alpha').length} icon="❌" color="red" />
        </div>

        {/* GPS Simulation Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">📍</span>
          <div>
            <p className="text-sm font-medium text-blue-800">Simulasi GPS Presensi</p>
            <p className="text-xs text-blue-600">Lokasi: SMA Muhammadiyah 2 Surabaya (-7.2894, 112.7522) — Radius: 100m</p>
          </div>
        </div>

        <Card title="Log Presensi">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Pegawai</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Tanggal</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Jam Masuk</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Jam Pulang</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Lokasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((a) => {
                  const emp = dummyEmployees.find((e) => e.id === a.pegawaiId);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{emp?.nama || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{a.tanggal}</td>
                      <td className="px-4 py-3 text-gray-600">{a.jamMasuk || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{a.jamPulang || '-'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(a.status) as 'success' | 'warning' | 'danger' | 'info' | 'default'}>{a.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">GPS Valid</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default function PresensiPegawaiPage() {
  return <PresensiPegawaiContent />;
}
