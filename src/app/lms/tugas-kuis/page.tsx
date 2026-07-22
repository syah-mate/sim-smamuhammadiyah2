'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyLMSAssignments, dummyLMSSubmissions, dummyLMSClasses } from '@/data/lms';
import { dummyStudents } from '@/data/students';

function TugasKuisContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const isGuru = user.roles.includes('guru');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">LMS — Tugas & Kuis</h1>
            <p className="text-gray-500 mt-1">Kelola tugas dan kuis online</p>
          </div>
          {isGuru && (
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">+ Buat Tugas</button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard title="Tugas Aktif" value={dummyLMSAssignments.length} icon="✏️" color="blue" />
          <StatCard title="Sudah Dinilai" value={dummyLMSSubmissions.filter((s) => s.nilai != null).length} icon="✅" color="green" />
          <StatCard title="Belum Dinilai" value={dummyLMSSubmissions.filter((s) => s.nilai == null).length} icon="⚠️" color="yellow" />
        </div>

        {/* Tugas List */}
        <div className="space-y-3">
          {dummyLMSAssignments.map((a) => {
            const cls = dummyLMSClasses.find((c) => c.id === a.classId);
            const submissions = dummyLMSSubmissions.filter((s) => s.assignmentId === a.id);
            return (
              <Card key={a.id} title={`📝 ${a.judul}`} subtitle={`${cls?.namaMapel} — Tenggat: ${a.tenggat}`}>
                <p className="text-sm text-gray-600 mb-3">{a.deskripsi}</p>
                <p className="text-xs text-gray-400 mb-3">Tipe: {a.tipe} | {submissions.length} submission</p>

                {submissions.length > 0 && (
                  <div className="space-y-2">
                    {submissions.map((sub) => {
                      const student = dummyStudents.find((s) => s.id === sub.siswaId);
                      return (
                        <div key={sub.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{student?.namaLengkap || '-'}</p>
                            <p className="text-xs text-gray-400">Submit: {sub.waktuSubmit}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {sub.nilai != null ? (
                              <span className="text-sm font-semibold text-blue-600">Nilai: {sub.nilai}</span>
                            ) : (
                              <Badge variant="warning">Belum dinilai</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

export default function TugasKuisPage() {
  return <TugasKuisContent />;
}
