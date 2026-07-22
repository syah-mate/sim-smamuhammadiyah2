'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dummyLMSSubmissions, dummyLMSAssignments } from '@/data/lms';
import { dummyStudents } from '@/data/students';

const nilaiData = [
  { siswa: 'Andi', nilai: 82 },
  { siswa: 'Bunga', nilai: 90 },
  { siswa: 'Cahyo', nilai: 75 },
  { siswa: 'Dewi', nilai: 88 },
  { siswa: 'Eko', nilai: 70 },
];

function NilaiLMSContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const avgNilai = dummyLMSSubmissions.filter((s) => s.nilai != null).reduce((sum, s) => sum + (s.nilai || 0), 0) / dummyLMSSubmissions.filter((s) => s.nilai != null).length || 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">LMS — Nilai</h1>
          <p className="text-gray-500 mt-1">Rekap nilai tugas & kuis</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard title="Rata-rata Nilai" value={avgNilai.toFixed(1)} icon="💯" color="blue" />
          <StatCard title="Tugas Dinilai" value={dummyLMSSubmissions.filter((s) => s.nilai != null).length} icon="✅" color="green" />
          <StatCard title="Total Submission" value={dummyLMSSubmissions.length} icon="📝" color="purple" />
        </div>

        <Card title="📊 Grafik Nilai Siswa">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nilaiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="siswa" fontSize={12} />
              <YAxis domain={[0, 100]} fontSize={12} />
              <Tooltip />
              <Bar dataKey="nilai" fill="#3b82f6" name="Nilai" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Detail Nilai Per Tugas">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Siswa</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Tugas</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-600">Nilai</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dummyLMSSubmissions.map((sub) => {
                  const student = dummyStudents.find((s) => s.id === sub.siswaId);
                  const assignment = dummyLMSAssignments.find((a) => a.id === sub.assignmentId);
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-800">{student?.namaLengkap || '-'}</td>
                      <td className="px-4 py-2 text-gray-600">{assignment?.judul || '-'}</td>
                      <td className="px-4 py-2 text-center">
                        {sub.nilai != null ? (
                          <span className={`font-bold ${sub.nilai >= 80 ? 'text-green-600' : sub.nilai >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {sub.nilai}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{sub.feedback || '-'}</td>
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

export default function NilaiLMSPage() {
  return <NilaiLMSContent />;
}
