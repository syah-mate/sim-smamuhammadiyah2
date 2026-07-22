'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyReportCards, dummyAcademicScores } from '@/data/erapor';
import { dummyStudents } from '@/data/students';

function ERaporContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedRapor, setSelectedRapor] = useState<string | null>(null);

  if (!user) { router.push('/'); return null; }

  const rapor = selectedRapor ? dummyReportCards.find((r) => r.id === selectedRapor) : null;
  const raporStudent = rapor ? dummyStudents.find((s) => s.id === rapor.siswaId) : null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">e-Rapor</h1>
          <p className="text-gray-500 mt-1">Pengelolaan nilai & cetak rapor siswa</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <StatCard title="Rapor Tersimpan" value={dummyReportCards.length} icon="📝" color="blue" />
          <StatCard title="Rapor Final" value={dummyReportCards.filter((r) => r.status === 'final').length} icon="✅" color="green" />
          <StatCard title="Rapor Draft" value={dummyReportCards.filter((r) => r.status === 'draft').length} icon="📄" color="yellow" />
          <StatCard title="Nilai Tercatat" value={dummyAcademicScores.length} icon="📊" color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rapor List */}
          <Card title="Daftar Rapor">
            <div className="space-y-2">
              {dummyReportCards.map((r) => {
                const student = dummyStudents.find((s) => s.id === r.siswaId);
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRapor(r.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                      selectedRapor === r.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{student?.namaLengkap}</p>
                      <p className="text-xs text-gray-400">{student?.kelas} {student?.jurusan} | Semester {r.semester}</p>
                    </div>
                    <Badge variant={r.status === 'final' ? 'success' : 'warning'}>{r.status}</Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Rapor Detail */}
          {rapor && raporStudent ? (
            <Card title={`📋 Rapor: ${raporStudent.namaLengkap}`} subtitle={`${raporStudent.kelas} ${raporStudent.jurusan} — Semester ${rapor.semester}`}>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Mata Pelajaran</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Harian</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">UTS</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">UAS</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rapor.nilaiMapel.map((nm) => (
                    <tr key={nm.mapelId} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-800">{nm.namaMapel}</td>
                      <td className="px-3 py-2 text-center text-gray-600">{nm.nilaiHarian}</td>
                      <td className="px-3 py-2 text-center text-gray-600">{nm.nilaiUTS}</td>
                      <td className="px-3 py-2 text-center text-gray-600">{nm.nilaiUAS}</td>
                      <td className="px-3 py-2 text-center font-bold text-blue-600">{nm.nilaiAkhir}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2">
                <p className="text-sm"><strong>Nilai Sikap:</strong> {rapor.nilaiSikap}</p>
                <p className="text-sm"><strong>Catatan Wali Kelas:</strong> {rapor.catatanWaliKelas}</p>
                <p className="text-sm"><strong>Status:</strong> <Badge variant={rapor.status === 'final' ? 'success' : 'warning'}>{rapor.status}</Badge></p>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">🖨️ Cetak Rapor</button>
                {rapor.status === 'draft' && <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">✅ Finalkan</button>}
              </div>
            </Card>
          ) : (
            <Card title="📋 Detail Rapor">
              <p className="text-sm text-gray-400 text-center py-12">Pilih rapor dari daftar di samping</p>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function ERaporPage() {
  return <ERaporContent />;
}
