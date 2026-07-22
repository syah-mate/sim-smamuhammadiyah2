'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyAttendanceStudents } from '@/data/attendance';
import { dummyStudents } from '@/data/students';
import { AttendanceStudent, AttendanceStatus } from '@/types';

function PresensiSiswaContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [attendances, setAttendances] = useState<AttendanceStudent[]>(dummyAttendanceStudents);
  const [selectedDate, setSelectedDate] = useState('2026-07-22');
  const [selectedKelas, setSelectedKelas] = useState('');

  if (!user) { router.push('/'); return null; }

  const kelasList = [...new Set(dummyStudents.filter((s) => s.status === 'aktif').map((s) => `${s.kelas} ${s.jurusan}`))];

  const filtered = attendances.filter((a) => {
    if (selectedDate && a.tanggal !== selectedDate) return false;
    if (selectedKelas && a.kelasId !== selectedKelas) return false;
    return true;
  });

  const toggleStatus = (id: string, currentStatus: AttendanceStatus) => {
    const order: AttendanceStatus[] = ['hadir', 'izin', 'sakit', 'alpha'];
    const next = order[(order.indexOf(currentStatus) + 1) % order.length];
    setAttendances((prev) => prev.map((a) => (a.id === id ? { ...a, status: next } : a)));
  };

  const stats = {
    hadir: filtered.filter((a) => a.status === 'hadir').length,
    izin: filtered.filter((a) => a.status === 'izin').length,
    sakit: filtered.filter((a) => a.status === 'sakit').length,
    alpha: filtered.filter((a) => a.status === 'alpha').length,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Presensi Siswa</h1>
          <p className="text-gray-500 mt-1">Rekap kehadiran siswa per kelas & tanggal</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tanggal</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Kelas</label>
            <select value={selectedKelas} onChange={(e) => setSelectedKelas(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Semua Kelas</option>
              {kelasList.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard title="Hadir" value={stats.hadir} color="green" />
          <StatCard title="Izin" value={stats.izin} color="blue" />
          <StatCard title="Sakit" value={stats.sakit} color="yellow" />
          <StatCard title="Alpha" value={stats.alpha} color="red" />
        </div>

        <Card title="Daftar Presensi">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Siswa</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Kelas</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Tanggal</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Jam Ke</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((a) => {
                  const student = dummyStudents.find((s) => s.id === a.siswaId);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{student?.namaLengkap || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{a.kelasId}</td>
                      <td className="px-4 py-3 text-gray-600">{a.tanggal}</td>
                      <td className="px-4 py-3 text-gray-600">{a.jamKe}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(a.status) as 'success' | 'warning' | 'danger' | 'info' | 'default'}>{a.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleStatus(a.id, a.status)} className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                          🔄 Ubah
                        </button>
                      </td>
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

export default function PresensiSiswaPage() {
  return <PresensiSiswaContent />;
}
