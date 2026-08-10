'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { useRouter, useParams } from 'next/navigation';
import { dummyKomponenIsmuba, dummyKegiatanIsmuba, dummyPenilaianIsmuba, dummyAbsensiIsmuba } from '@/data/ismuba';
import { dummyStudents } from '@/data/students';
import { generateId } from '@/lib/utils';
import { PenilaianIsmuba, AbsensiIsmuba, KehadiranIsmuba } from '@/types';

function KegiatanDetailContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const kegiatanId = params.kegiatanId as string;

  const [penilaianList, setPenilaianList] = useState<PenilaianIsmuba[]>(
    dummyPenilaianIsmuba.filter((p) => p.kegiatanId === kegiatanId)
  );
  const [absensiList, setAbsensiList] = useState<AbsensiIsmuba[]>(
    dummyAbsensiIsmuba.filter((a) => a.kegiatanId === kegiatanId)
  );

  const [activeTab, setActiveTab] = useState<'penilaian' | 'absensi'>('penilaian');
  const [search, setSearch] = useState('');

  // Nilai modal
  const [showNilaiModal, setShowNilaiModal] = useState(false);
  const [editingNilaiId, setEditingNilaiId] = useState<string | null>(null);
  const [nilaiForm, setNilaiForm] = useState({ siswaId: '', nilai: 0, catatan: '' });

  // Absensi modal
  const [showAbsensiModal, setShowAbsensiModal] = useState(false);
  const [editingAbsensiId, setEditingAbsensiId] = useState<string | null>(null);
  const [absensiForm, setAbsensiForm] = useState({
    siswaId: '',
    kehadiran: 'hadir' as KehadiranIsmuba,
    keterangan: '',
  });

  // All hooks must be before any early return
  const kegiatan = dummyKegiatanIsmuba.find((k) => k.id === kegiatanId);

  const siswaByKelas = useMemo(() => {
    const targetKelas = kegiatan?.kelas || '';
    return dummyStudents.filter((s) => s.kelas === targetKelas);
  }, [kegiatan?.kelas]);

  if (!user) { router.push('/'); return null; }

  if (!kegiatan) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Kegiatan Tidak Ditemukan</h2>
            <button
              onClick={() => router.push('/ismuba/kalender-kegiatan')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Kembali ke Kalender Kegiatan
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const komponen = dummyKomponenIsmuba.find((k) => k.id === kegiatan.komponenId);

  const getSiswaNama = (siswaId: string) =>
    dummyStudents.find((s) => s.id === siswaId)?.namaLengkap || siswaId;

  // Penilaian handlers
  const openAddNilai = () => {
    setEditingNilaiId(null);
    setNilaiForm({ siswaId: '', nilai: 0, catatan: '' });
    setShowNilaiModal(true);
  };

  const openEditNilai = (p: PenilaianIsmuba) => {
    setEditingNilaiId(p.id);
    setNilaiForm({ siswaId: p.siswaId, nilai: p.nilai, catatan: p.catatan });
    setShowNilaiModal(true);
  };

  const handleSaveNilai = () => {
    if (!nilaiForm.siswaId) return;
    if (editingNilaiId) {
      setPenilaianList((prev) =>
        prev.map((p) => (p.id === editingNilaiId ? { ...p, ...nilaiForm } : p))
      );
    } else {
      setPenilaianList((prev) => [
        ...prev,
        { id: generateId('pn'), kegiatanId, ...nilaiForm },
      ]);
    }
    setShowNilaiModal(false);
  };

  const handleDeleteNilai = (id: string) => {
    setPenilaianList((prev) => prev.filter((p) => p.id !== id));
  };

  // Absensi handlers
  const openAddAbsensi = () => {
    setEditingAbsensiId(null);
    setAbsensiForm({ siswaId: '', kehadiran: 'hadir', keterangan: '' });
    setShowAbsensiModal(true);
  };

  const openEditAbsensi = (a: AbsensiIsmuba) => {
    setEditingAbsensiId(a.id);
    setAbsensiForm({ siswaId: a.siswaId, kehadiran: a.kehadiran, keterangan: a.keterangan });
    setShowAbsensiModal(true);
  };

  const handleSaveAbsensi = () => {
    if (!absensiForm.siswaId) return;
    if (editingAbsensiId) {
      setAbsensiList((prev) =>
        prev.map((a) => (a.id === editingAbsensiId ? { ...a, ...absensiForm } : a))
      );
    } else {
      setAbsensiList((prev) => [
        ...prev,
        { id: generateId('ab'), kegiatanId, ...absensiForm },
      ]);
    }
    setShowAbsensiModal(false);
  };

  const handleDeleteAbsensi = (id: string) => {
    setAbsensiList((prev) => prev.filter((a) => a.id !== id));
  };

  // Siswa yang sudah dinilai / diabsen
  const siswaSudahDinilai = new Set(penilaianList.map((p) => p.siswaId));
  const siswaSudahDiabsen = new Set(absensiList.map((a) => a.siswaId));

  // Filtered by search
  const filteredPenilaian = penilaianList.filter((p) => {
    const nama = getSiswaNama(p.siswaId).toLowerCase();
    return nama.includes(search.toLowerCase()) || p.catatan.toLowerCase().includes(search.toLowerCase());
  });

  const filteredAbsensi = absensiList.filter((a) => {
    const nama = getSiswaNama(a.siswaId).toLowerCase();
    return nama.includes(search.toLowerCase()) || a.keterangan.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back button & Header */}
        <button
          onClick={() => router.push('/ismuba/kalender-kegiatan')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Kalender Kegiatan
        </button>

        {/* Kegiatan Info Card */}
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{kegiatan.namaKegiatan}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Badge variant="info">{komponen?.nama || '-'}</Badge>
                <span className="text-sm text-gray-500">
                  📅 {new Date(kegiatan.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-sm text-gray-500">🏫 Kelas {kegiatan.kelas}</span>
              </div>
              {kegiatan.deskripsi && (
                <p className="text-gray-600 mt-3 text-sm">{kegiatan.deskripsi}</p>
              )}
            </div>
            <div className="flex gap-3">
              <div className="text-center bg-blue-50 rounded-xl px-4 py-2">
                <p className="text-xs text-blue-600 font-medium">Dinilai</p>
                <p className="text-xl font-bold text-blue-700">{penilaianList.length}</p>
              </div>
              <div className="text-center bg-orange-50 rounded-xl px-4 py-2">
                <p className="text-xs text-orange-600 font-medium">Diabsen</p>
                <p className="text-xl font-bold text-orange-700">{absensiList.length}</p>
              </div>
              <div className="text-center bg-green-50 rounded-xl px-4 py-2">
                <p className="text-xs text-green-600 font-medium">Siswa</p>
                <p className="text-xl font-bold text-green-700">{siswaByKelas.length}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="!p-4 text-center">
            <p className="text-xs text-gray-500">Hadir</p>
            <p className="text-xl font-bold text-green-600 mt-1">
              {absensiList.filter((a) => a.kehadiran === 'hadir').length}
            </p>
          </Card>
          <Card className="!p-4 text-center">
            <p className="text-xs text-gray-500">Tidak Hadir</p>
            <p className="text-xl font-bold text-red-600 mt-1">
              {absensiList.filter((a) => a.kehadiran === 'tidak_hadir').length}
            </p>
          </Card>
          <Card className="!p-4 text-center">
            <p className="text-xs text-gray-500">Rata-rata Nilai</p>
            <p className="text-xl font-bold text-blue-600 mt-1">
              {penilaianList.length > 0
                ? Math.round(penilaianList.reduce((sum, p) => sum + p.nilai, 0) / penilaianList.length)
                : '-'}
            </p>
          </Card>
          <Card className="!p-4 text-center">
            <p className="text-xs text-gray-500">Belum Dinilai</p>
            <p className="text-xl font-bold text-yellow-600 mt-1">
              {siswaByKelas.length - siswaSudahDinilai.size}
            </p>
          </Card>
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('penilaian')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'penilaian'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📝 Penilaian ({penilaianList.length})
            </button>
            <button
              onClick={() => setActiveTab('absensi')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'absensi'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ✅ Absensi ({absensiList.length})
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari siswa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            {activeTab === 'penilaian' ? (
              <button
                onClick={openAddNilai}
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Nilai
              </button>
            ) : (
              <button
                onClick={openAddAbsensi}
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Absensi
              </button>
            )}
          </div>
        </div>

        {/* Penilaian Table */}
        {activeTab === 'penilaian' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 w-10">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">NIS</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Siswa</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">Nilai</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Catatan</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPenilaian.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                        Belum ada data penilaian
                      </td>
                    </tr>
                  ) : (
                    filteredPenilaian.map((p, idx) => {
                      const siswa = dummyStudents.find((s) => s.id === p.siswaId);
                      return (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{siswa?.nis || '-'}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{getSiswaNama(p.siswaId)}</td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                p.nilai >= 80
                                  ? 'bg-green-100 text-green-700'
                                  : p.nilai >= 60
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {p.nilai}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px] truncate">
                            {p.catatan || '-'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditNilai(p)}
                                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteNilai(p.id)}
                                className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Absensi Table */}
        {activeTab === 'absensi' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 w-10">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">NIS</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Siswa</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">Kehadiran</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Keterangan</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAbsensi.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                        Belum ada data absensi
                      </td>
                    </tr>
                  ) : (
                    filteredAbsensi.map((a, idx) => {
                      const siswa = dummyStudents.find((s) => s.id === a.siswaId);
                      return (
                        <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{siswa?.nis || '-'}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{getSiswaNama(a.siswaId)}</td>
                          <td className="px-4 py-3 text-center">
                            {a.kehadiran === 'hadir' ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                ✅ Hadir
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                ❌ Tidak Hadir
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{a.keterangan || '-'}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditAbsensi(a)}
                                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAbsensi(a.id)}
                                className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Nilai Modal */}
        <Modal
          isOpen={showNilaiModal}
          onClose={() => setShowNilaiModal(false)}
          title={editingNilaiId ? 'Edit Penilaian' : 'Tambah Penilaian'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Siswa</label>
              <select
                value={nilaiForm.siswaId}
                onChange={(e) => setNilaiForm({ ...nilaiForm, siswaId: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                disabled={!!editingNilaiId}
              >
                <option value="">Pilih Siswa</option>
                {siswaByKelas
                  .filter((s) => editingNilaiId || !siswaSudahDinilai.has(s.id))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.namaLengkap} ({s.nis})
                    </option>
                  ))}
                {editingNilaiId && (
                  <option value={nilaiForm.siswaId}>{getSiswaNama(nilaiForm.siswaId)}</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nilai <span className="text-gray-400 font-normal">(0-100)</span>
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={nilaiForm.nilai}
                onChange={(e) => setNilaiForm({ ...nilaiForm, nilai: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea
                value={nilaiForm.catatan}
                onChange={(e) => setNilaiForm({ ...nilaiForm, catatan: e.target.value })}
                rows={2}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Catatan penilaian..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowNilaiModal(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNilai}
                disabled={!nilaiForm.siswaId}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </Modal>

        {/* Absensi Modal */}
        <Modal
          isOpen={showAbsensiModal}
          onClose={() => setShowAbsensiModal(false)}
          title={editingAbsensiId ? 'Edit Absensi' : 'Tambah Absensi'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Siswa</label>
              <select
                value={absensiForm.siswaId}
                onChange={(e) => setAbsensiForm({ ...absensiForm, siswaId: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                disabled={!!editingAbsensiId}
              >
                <option value="">Pilih Siswa</option>
                {siswaByKelas
                  .filter((s) => editingAbsensiId || !siswaSudahDiabsen.has(s.id))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.namaLengkap} ({s.nis})
                    </option>
                  ))}
                {editingAbsensiId && (
                  <option value={absensiForm.siswaId}>{getSiswaNama(absensiForm.siswaId)}</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kehadiran</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAbsensiForm({ ...absensiForm, kehadiran: 'hadir' })}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                    absensiForm.kehadiran === 'hadir'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  ✅ Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setAbsensiForm({ ...absensiForm, kehadiran: 'tidak_hadir' })}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                    absensiForm.kehadiran === 'tidak_hadir'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  ❌ Tidak Hadir
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <input
                type="text"
                value={absensiForm.keterangan}
                onChange={(e) => setAbsensiForm({ ...absensiForm, keterangan: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Contoh: Sakit, Izin, Tanpa keterangan"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAbsensiModal(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveAbsensi}
                disabled={!absensiForm.siswaId}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}

export default function KegiatanDetailPage() {
  return <KegiatanDetailContent />;
}
