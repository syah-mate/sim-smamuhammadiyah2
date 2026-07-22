'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyBKCases, dummyBKViolations, dummyBKSessions } from '@/data/bk';
import { dummyStudents } from '@/data/students';

function BKContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'kasus' | 'pelanggaran' | 'konseling'>('kasus');

  if (!user) { router.push('/'); return null; }

  const totalPoin = (siswaId: string) => dummyBKViolations.filter((v) => v.siswaId === siswaId).reduce((s, v) => s + v.poin, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bimbingan Konseling</h1>
          <p className="text-gray-500 mt-1">Pencatatan kasus, pelanggaran, dan sesi konseling</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard title="Total Kasus" value={dummyBKCases.length} icon="📋" color="blue" />
          <StatCard title="Total Pelanggaran" value={dummyBKViolations.length} icon="⚠️" color="red" />
          <StatCard title="Sesi Konseling" value={dummyBKSessions.length} icon="🫂" color="green" />
        </div>

        {/* Alert for high point students */}
        {dummyStudents.filter((s) => totalPoin(s.id) >= 15).map((s) => (
          <div key={s.id} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-xl">🚨</span>
            <div>
              <p className="text-sm font-semibold text-red-800">{s.namaLengkap}</p>
              <p className="text-xs text-red-600">Poin pelanggaran: {totalPoin(s.id)} (ambang batas 15) — Perlu pemanggilan orang tua</p>
            </div>
          </div>
        ))}

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: 'kasus', label: '📋 Kasus', count: dummyBKCases.length },
            { key: 'pelanggaran', label: '⚠️ Pelanggaran', count: dummyBKViolations.length },
            { key: 'konseling', label: '🫂 Sesi Konseling', count: dummyBKSessions.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Kasus */}
        {tab === 'kasus' && (
          <Card>
            <div className="space-y-3">
              {dummyBKCases.map((c) => {
                const student = dummyStudents.find((s) => s.id === c.siswaId);
                return (
                  <div key={c.id} className="p-4 bg-gray-50 rounded-lg flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{student?.namaLengkap} — {student?.kelas} {student?.jurusan}</p>
                      <p className="text-sm text-gray-600 mt-1">{c.deskripsi}</p>
                      <p className="text-xs text-gray-400 mt-1">{c.tanggal}</p>
                    </div>
                    <Badge variant={c.kategori === 'pelanggaran' ? 'danger' : 'warning'}>{c.kategori}</Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Pelanggaran */}
        {tab === 'pelanggaran' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Siswa</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Jenis</th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-600">Poin</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Tanggal</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dummyBKViolations.map((v) => {
                    const student = dummyStudents.find((s) => s.id === v.siswaId);
                    return (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-800">{student?.namaLengkap}</td>
                        <td className="px-4 py-2 text-gray-600">{v.jenisPelanggaran}</td>
                        <td className="px-4 py-2 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.poin >= 10 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {v.poin} poin
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-600">{v.tanggal}</td>
                        <td className="px-4 py-2 text-gray-600">{v.tindakLanjut}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Sesi Konseling */}
        {tab === 'konseling' && (
          <div className="space-y-3">
            {dummyBKSessions.map((s) => {
              const student = dummyStudents.find((st) => st.id === s.siswaId);
              return (
                <Card key={s.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-800">{student?.namaLengkap}</span>
                        <span className="text-xs text-gray-400">{s.tanggal}</span>
                      </div>
                      <p className="text-sm text-gray-600"><strong>Ringkasan:</strong> {s.ringkasan}</p>
                      <p className="text-sm text-gray-600 mt-1"><strong>Rekomendasi:</strong> {s.rekomendasi}</p>
                      <div className="mt-2">
                        <Badge variant={s.statusTindakLanjut === 'selesai' ? 'success' : s.statusTindakLanjut === 'proses' ? 'warning' : 'default'}>
                          TL: {s.statusTindakLanjut}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function BKPage() {
  return <BKContent />;
}
