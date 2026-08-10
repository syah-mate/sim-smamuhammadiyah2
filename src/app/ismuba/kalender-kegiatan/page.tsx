'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';
import { dummyKomponenIsmuba, dummyKegiatanIsmuba, dummyPenilaianIsmuba, dummyAbsensiIsmuba } from '@/data/ismuba';
import { generateId, todayISO } from '@/lib/utils';
import { KegiatanIsmuba } from '@/types';

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function KalenderKegiatanContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [kegiatanList, setKegiatanList] = useState<KegiatanIsmuba[]>(dummyKegiatanIsmuba);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterKomponen, setFilterKomponen] = useState('');
  const [filterKelas, setFilterKelas] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    tanggal: todayISO(),
    namaKegiatan: '',
    kelas: '',
    komponenId: '',
    deskripsi: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Hooks must be before any early return
  const kegiatanByDate = useMemo(() => {
    const map: Record<string, KegiatanIsmuba[]> = {};
    kegiatanList.forEach((k) => {
      if (!map[k.tanggal]) map[k.tanggal] = [];
      map[k.tanggal].push(k);
    });
    return map;
  }, [kegiatanList]);

  const kelasList = useMemo(() => {
    const set = new Set(kegiatanList.map((k) => k.kelas));
    return Array.from(set).sort();
  }, [kegiatanList]);

  if (!user) { router.push('/'); return null; }

  // Calendar helpers
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const getKegiatanOnDate = (day: number): KegiatanIsmuba[] => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return kegiatanByDate[dateStr] || [];
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  // Filtered list
  const filtered = kegiatanList.filter((k) => {
    const matchSearch = k.namaKegiatan.toLowerCase().includes(search.toLowerCase()) ||
      k.deskripsi.toLowerCase().includes(search.toLowerCase());
    const matchKomponen = !filterKomponen || k.komponenId === filterKomponen;
    const matchKelas = !filterKelas || k.kelas === filterKelas;
    const matchDate = !selectedDate || k.tanggal === selectedDate;
    return matchSearch && matchKomponen && matchKelas && matchDate;
  });

  // Form handlers
  const openAdd = (date?: string) => {
    setEditingId(null);
    setForm({
      tanggal: date || todayISO(),
      namaKegiatan: '',
      kelas: '',
      komponenId: dummyKomponenIsmuba[0]?.id || '',
      deskripsi: '',
    });
    setShowModal(true);
  };

  const openEdit = (k: KegiatanIsmuba) => {
    setEditingId(k.id);
    setForm({
      tanggal: k.tanggal,
      namaKegiatan: k.namaKegiatan,
      kelas: k.kelas,
      komponenId: k.komponenId,
      deskripsi: k.deskripsi,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.namaKegiatan.trim() || !form.kelas.trim() || !form.komponenId) return;
    if (editingId) {
      setKegiatanList((prev) =>
        prev.map((k) => (k.id === editingId ? { ...k, ...form } : k))
      );
    } else {
      const newItem: KegiatanIsmuba = {
        id: generateId('kg'),
        ...form,
      };
      setKegiatanList((prev) => [...prev, newItem]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setKegiatanList((prev) => prev.filter((k) => k.id !== id));
    setDeleteConfirm(null);
  };

  const getKomponenNama = (komponenId: string) =>
    dummyKomponenIsmuba.find((k) => k.id === komponenId)?.nama || '-';

  // Count penilaian & absensi for each kegiatan
  const countPenilaian = (kegiatanId: string) =>
    dummyPenilaianIsmuba.filter((p) => p.kegiatanId === kegiatanId).length;
  const countAbsensi = (kegiatanId: string) =>
    dummyAbsensiIsmuba.filter((a) => a.kegiatanId === kegiatanId).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kalender Kegiatan Ismuba</h1>
            <p className="text-gray-500 mt-1">Kelola jadwal kegiatan Ismuba, penilaian, dan absensi siswa</p>
          </div>
          <button
            onClick={() => openAdd()}
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Kegiatan
          </button>
        </div>

        {/* Calendar */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {BULAN[currentMonth]} {currentYear}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {HARI.map((h) => (
              <div key={h} className="text-center text-xs font-semibold text-gray-500 py-2">
                {h}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const kegiatanHarian = getKegiatanOnDate(day);
              const isToday = dateStr === todayISO();
              const isSelected = dateStr === selectedDate;

              return (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDate(isSelected ? null : dateStr);
                  }}
                  className={`aspect-square p-0.5 rounded-lg border text-left transition-colors relative ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : isToday
                      ? 'border-blue-300 bg-blue-50/50'
                      : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-xs font-medium px-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  <div className="space-y-0.5 mt-0.5">
                    {kegiatanHarian.slice(0, 2).map((k) => (
                      <div
                        key={k.id}
                        className="text-[9px] leading-tight px-1 py-0.5 rounded bg-blue-100 text-blue-700 truncate"
                        title={k.namaKegiatan}
                      >
                        {k.namaKegiatan}
                      </div>
                    ))}
                    {kegiatanHarian.length > 2 && (
                      <div className="text-[9px] px-1 text-gray-500">
                        +{kegiatanHarian.length - 2} lagi
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Menampilkan kegiatan tanggal <strong>{selectedDate}</strong>
              </span>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Hapus filter
              </button>
            </div>
          )}
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari kegiatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={filterKomponen}
            onChange={(e) => setFilterKomponen(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">Semua Kategori</option>
            {dummyKomponenIsmuba.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">Semua Kelas</option>
            {kelasList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        {/* Kegiatan Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 w-10">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Tanggal</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Kegiatan</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Kategori</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Kelas</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Nilai</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Absensi</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 w-32">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      Tidak ada kegiatan
                    </td>
                  </tr>
                ) : (
                  filtered.map((k, idx) => (
                    <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {new Date(k.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{k.namaKegiatan}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                          {getKomponenNama(k.komponenId)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{k.kelas}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-medium text-blue-600">
                          {countPenilaian(k.id)} siswa
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-medium text-orange-600">
                          {countAbsensi(k.id)} siswa
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => router.push(`/ismuba/kalender-kegiatan/${k.id}`)}
                            className="px-2.5 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            Nilai & Absen
                          </button>
                          <button
                            onClick={() => openEdit(k)}
                            className="px-2.5 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(k.id)}
                            className="px-2.5 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingId ? 'Edit Kegiatan Ismuba' : 'Tambah Kegiatan Ismuba'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kegiatan</label>
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kegiatan</label>
              <input
                type="text"
                value={form.namaKegiatan}
                onChange={(e) => setForm({ ...form, namaKegiatan: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Contoh: Hafalan Surat An-Naba"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Ismuba</label>
                <select
                  value={form.komponenId}
                  onChange={(e) => setForm({ ...form, komponenId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Pilih Kategori</option>
                  {dummyKomponenIsmuba.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                <input
                  type="text"
                  value={form.kelas}
                  onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Contoh: X"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Deskripsi kegiatan..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={!form.namaKegiatan.trim() || !form.kelas.trim() || !form.komponenId}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Konfirmasi Hapus"
        >
          <p className="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus kegiatan ini? Data penilaian dan absensi terkait juga akan terhapus.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Hapus
            </button>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}

export default function KalenderKegiatanPage() {
  return <KalenderKegiatanContent />;
}
