'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyStudents } from '@/data/students';
import { dummyPelanggaranSiswa, dummyApresiasiSiswa, dummyJenisPelanggaran, dummyJenisApresiasi, dummyTindakLanjut } from '@/data/bk';

function LaporanBKContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedSiswa, setSelectedSiswa] = useState('');
  const [tab, setTab] = useState<'semua' | 'pelanggaran' | 'apresiasi'>('semua');
  // Using dummyTindakLanjut for lookup — already imported above

  if (!user) { router.push('/'); return null; }

  const kelasList = useMemo(() => {
    const set = new Set(dummyStudents.map((s) => s.kelas));
    return Array.from(set).sort();
  }, []);

  const siswaByKelas = useMemo(() => {
    return dummyStudents.filter((s) => !selectedKelas || s.kelas === selectedKelas);
  }, [selectedKelas]);

  // Compute all records
  const records = useMemo(() => {
    const pelanggaranRecords = dummyPelanggaranSiswa
      .filter((p) => {
        if (selectedSiswa && p.siswaId !== selectedSiswa) return false;
        if (selectedKelas) {
          const s = dummyStudents.find((st) => st.id === p.siswaId);
          if (!s || s.kelas !== selectedKelas) return false;
        }
        return true;
      })
      .map((p) => {
        const student = dummyStudents.find((s) => s.id === p.siswaId);
        const jp = dummyJenisPelanggaran.find((j) => j.id === p.jenisPelanggaranId);
        const tl = dummyTindakLanjut.find((t) => t.id === p.tindakLanjutId);
        return {
          id: p.id,
          tanggal: p.tanggal,
          siswaId: p.siswaId,
          namaSiswa: student?.namaLengkap || '-',
          kelas: student?.kelas || '-',
          jurusan: student?.jurusan || '-',
          jenis: jp?.nama || '-',
          skor: -(jp?.skor || 0),
          tindakLanjut: tl?.nama || '-',
          deskripsi: p.deskripsi,
          tipe: 'Pelanggaran' as const,
        };
      });

    const apresiasiRecords = dummyApresiasiSiswa
      .filter((a) => {
        if (selectedSiswa && a.siswaId !== selectedSiswa) return false;
        if (selectedKelas) {
          const s = dummyStudents.find((st) => st.id === a.siswaId);
          if (!s || s.kelas !== selectedKelas) return false;
        }
        return true;
      })
      .map((a) => {
        const student = dummyStudents.find((s) => s.id === a.siswaId);
        const ja = dummyJenisApresiasi.find((j) => j.id === a.jenisApresiasiId);
        const tl = dummyTindakLanjut.find((t) => t.id === a.tindakLanjutId);
        return {
          id: a.id,
          tanggal: a.tanggal,
          siswaId: a.siswaId,
          namaSiswa: student?.namaLengkap || '-',
          kelas: student?.kelas || '-',
          jurusan: student?.jurusan || '-',
          jenis: ja?.nama || '-',
          skor: ja?.skor || 0,
          tindakLanjut: tl?.nama || '-',
          deskripsi: a.deskripsi,
          tipe: 'Apresiasi' as const,
        };
      });

    const all = [...pelanggaranRecords, ...apresiasiRecords].sort(
      (a, b) => b.tanggal.localeCompare(a.tanggal)
    );

    return tab === 'pelanggaran' ? pelanggaranRecords : tab === 'apresiasi' ? apresiasiRecords : all;
  }, [selectedKelas, selectedSiswa, tab]);

  // Summary
  const summary = useMemo(() => {
    const totalPelanggaran = records.filter((r) => r.tipe === 'Pelanggaran').reduce((s, r) => s + Math.abs(r.skor), 0);
    const totalApresiasi = records.filter((r) => r.tipe === 'Apresiasi').reduce((s, r) => s + r.skor, 0);
    const jmlPelanggaran = records.filter((r) => r.tipe === 'Pelanggaran').length;
    const jmlApresiasi = records.filter((r) => r.tipe === 'Apresiasi').length;
    return { totalPelanggaran, totalApresiasi, jmlPelanggaran, jmlApresiasi, netSkor: totalApresiasi - totalPelanggaran };
  }, [records]);

  // Per student summary
  const perStudentSummary = useMemo(() => {
    const map: Record<string, { namaSiswa: string; kelas: string; jurusan: string; pelanggaran: number; apresiasi: number; jmlP: number; jmlA: number }> = {};
    records.forEach((r) => {
      if (!map[r.siswaId]) {
        map[r.siswaId] = { namaSiswa: r.namaSiswa, kelas: r.kelas, jurusan: r.jurusan, pelanggaran: 0, apresiasi: 0, jmlP: 0, jmlA: 0 };
      }
      if (r.tipe === 'Pelanggaran') {
        map[r.siswaId].pelanggaran += Math.abs(r.skor);
        map[r.siswaId].jmlP += 1;
      } else {
        map[r.siswaId].apresiasi += r.skor;
        map[r.siswaId].jmlA += 1;
      }
    });
    return Object.entries(map).map(([id, data]) => ({ siswaId: id, ...data }));
  }, [records]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Perilaku Siswa</h1>
          <p className="text-gray-500 mt-1">Laporan pelanggaran dan apresiasi per siswa per kelas</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">Total Pelanggaran</p>
            <p className="text-xl font-bold text-red-600 mt-1">{summary.jmlPelanggaran}</p>
            <p className="text-xs text-red-500">Skor: -{summary.totalPelanggaran}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">Total Apresiasi</p>
            <p className="text-xl font-bold text-green-600 mt-1">{summary.jmlApresiasi}</p>
            <p className="text-xs text-green-500">Skor: +{summary.totalApresiasi}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">Skor Bersih</p>
            <p className={`text-xl font-bold mt-1 ${summary.netSkor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summary.netSkor >= 0 ? '+' : ''}{summary.netSkor}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">Total Catatan</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{records.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">Siswa Tercatat</p>
            <p className="text-xl font-bold text-blue-600 mt-1">{perStudentSummary.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedKelas}
            onChange={(e) => { setSelectedKelas(e.target.value); setSelectedSiswa(''); }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Semua Kelas</option>
            {kelasList.map((k) => (
              <option key={k} value={k}>Kelas {k}</option>
            ))}
          </select>
          <select
            value={selectedSiswa}
            onChange={(e) => setSelectedSiswa(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none flex-1"
          >
            <option value="">Semua Siswa</option>
            {siswaByKelas.map((s) => (
              <option key={s.id} value={s.id}>{s.namaLengkap} ({s.kelas} {s.jurusan})</option>
            ))}
          </select>
        </div>

        {/* Per Student Summary Table */}
        <Card title="Ringkasan per Siswa">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 w-10">#</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Nama Siswa</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Kelas</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-600">Pelanggaran</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-600">Apresiasi</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-600">Skor Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {perStudentSummary.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Tidak ada data</td>
                  </tr>
                ) : (
                  perStudentSummary.map((row, idx) => (
                    <tr key={row.siswaId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-2 font-medium text-gray-800">{row.namaSiswa}</td>
                      <td className="px-4 py-2 text-gray-600">{row.kelas} {row.jurusan}</td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-red-600 text-xs">-{row.pelanggaran} ({row.jmlP}x)</span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-green-600 text-xs">+{row.apresiasi} ({row.jmlA}x)</span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Badge variant={row.apresiasi - row.pelanggaran >= 0 ? 'success' : 'danger'}>
                          {row.apresiasi - row.pelanggaran >= 0 ? '+' : ''}{row.apresiasi - row.pelanggaran}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detail Records */}
        <Card title="Detail Catatan">
          {/* Tab */}
          <div className="flex gap-2 border-b border-gray-200 mb-4">
            {[
              { key: 'semua', label: 'Semua', count: records.length },
              { key: 'pelanggaran', label: 'Pelanggaran', count: records.filter((r) => r.tipe === 'Pelanggaran').length },
              { key: 'apresiasi', label: 'Apresiasi', count: records.filter((r) => r.tipe === 'Apresiasi').length },
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

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 w-10">#</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Tanggal</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Siswa</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Kelas</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Tipe</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Jenis</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-600">Skor</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Tindak Lanjut</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Deskripsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400">Tidak ada data</td>
                  </tr>
                ) : (
                  records.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{r.tanggal}</td>
                      <td className="px-4 py-2 font-medium text-gray-800">{r.namaSiswa}</td>
                      <td className="px-4 py-2 text-gray-600">{r.kelas} {r.jurusan}</td>
                      <td className="px-4 py-2">
                        <Badge variant={r.tipe === 'Pelanggaran' ? 'danger' : 'success'}>{r.tipe}</Badge>
                      </td>
                      <td className="px-4 py-2 text-gray-600 text-xs max-w-44 truncate">{r.jenis}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`font-bold ${r.skor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {r.skor >= 0 ? '+' : ''}{r.skor}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600 text-xs">{r.tindakLanjut}</td>
                      <td className="px-4 py-2 text-gray-500 text-xs max-w-36 truncate">{r.deskripsi || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default function LaporanBKPage() {
  return <LaporanBKContent />;
}
