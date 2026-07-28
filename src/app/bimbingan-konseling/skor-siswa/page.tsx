'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyStudents } from '@/data/students';
import { dummyPelanggaranSiswa, dummyApresiasiSiswa, dummyJenisPelanggaran, dummyJenisApresiasi } from '@/data/bk';
import { SkorSiswa } from '@/types';

function SkorSiswaContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('');

  if (!user) { router.push('/'); return null; }

  // Compute skor for each student
  const skorSiswaMap = useMemo(() => {
    const map: Record<string, SkorSiswa> = {};

    dummyStudents.forEach((s) => {
      const pelanggaranList = dummyPelanggaranSiswa.filter((p) => p.siswaId === s.id);
      const apresiasiList = dummyApresiasiSiswa.filter((a) => a.siswaId === s.id);

      const totalPelanggaran = pelanggaranList.reduce((sum, p) => {
        const jp = dummyJenisPelanggaran.find((j) => j.id === p.jenisPelanggaranId);
        return sum + (jp?.skor || 0);
      }, 0);

      const totalApresiasi = apresiasiList.reduce((sum, a) => {
        const ja = dummyJenisApresiasi.find((j) => j.id === a.jenisApresiasiId);
        return sum + (ja?.skor || 0);
      }, 0);

      map[s.id] = {
        siswaId: s.id,
        totalSkor: totalApresiasi - totalPelanggaran,
        totalPelanggaran,
        totalApresiasi,
        jumlahPelanggaran: pelanggaranList.length,
        jumlahApresiasi: apresiasiList.length,
      };
    });

    return map;
  }, []);

  const kelasList = useMemo(() => {
    const set = new Set(dummyStudents.map((s) => s.kelas));
    return Array.from(set).sort();
  }, []);

  const filteredStudents = dummyStudents.filter((s) => {
    const matchSearch = s.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.toLowerCase().includes(search.toLowerCase()) ||
      s.kelas.toLowerCase().includes(search.toLowerCase());
    const matchKelas = !filterKelas || s.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  const getSkorColor = (skor: number) => {
    if (skor >= 20) return 'text-green-600';
    if (skor >= 0) return 'text-blue-600';
    if (skor >= -20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSkorBadge = (skor: number) => {
    if (skor >= 20) return 'success';
    if (skor >= 0) return 'info';
    if (skor >= -20) return 'warning';
    return 'danger';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Skor Siswa</h1>
          <p className="text-gray-500 mt-1">Daftar skor siswa berdasarkan pelanggaran dan apresiasi</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Siswa</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{dummyStudents.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Pelanggaran</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{dummyPelanggaranSiswa.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Apresiasi</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{dummyApresiasiSiswa.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-sm text-gray-500">Rata-rata Skor</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {(Object.values(skorSiswaMap).reduce((s, v) => s + v.totalSkor, 0) / Math.max(1, dummyStudents.length)).toFixed(1)}
            </p>
          </div>
        </div>

        <Card>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari siswa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Semua Kelas</option>
              {kelasList.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 w-10">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Siswa</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Kelas</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Skor Pelanggaran</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Jml Pelanggaran</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Skor Apresiasi</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Jml Apresiasi</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Skor Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">Tidak ada data</td>
                  </tr>
                ) : (
                  filteredStudents.map((s, idx) => {
                    const skor = skorSiswaMap[s.id];
                    return (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{s.namaLengkap}</td>
                        <td className="px-4 py-3 text-gray-600">{s.kelas} {s.jurusan}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-red-600 font-medium">-{skor?.totalPelanggaran || 0}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">{skor?.jumlahPelanggaran || 0}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-green-600 font-medium">+{skor?.totalApresiasi || 0}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">{skor?.jumlahApresiasi || 0}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={getSkorBadge(skor?.totalSkor || 0)}>
                            <span className={`font-bold ${getSkorColor(skor?.totalSkor || 0)}`}>
                              {skor?.totalSkor || 0}
                            </span>
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 mt-2">0 of {filteredStudents.length} row(s) selected.</p>
        </Card>
      </div>
    </MainLayout>
  );
}

export default function SkorSiswaPage() {
  return <SkorSiswaContent />;
}
