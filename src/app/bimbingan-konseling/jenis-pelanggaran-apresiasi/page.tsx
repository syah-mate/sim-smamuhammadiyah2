'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyJenisPelanggaran, dummyJenisApresiasi } from '@/data/bk';
import { JenisPelanggaran, JenisApresiasi, PelanggaranLevel } from '@/types';

function JenisPelanggaranApresiasiContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'pelanggaran' | 'apresiasi'>('pelanggaran');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    skor: 10,
    level: 'Ringan' as PelanggaranLevel,
    deskripsi: '',
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [pelanggaranData, setPelanggaranData] = useState<JenisPelanggaran[]>([...dummyJenisPelanggaran]);
  const [apresiasiData, setApresiasiData] = useState<JenisApresiasi[]>([...dummyJenisApresiasi]);

  if (!user) { router.push('/'); return null; }

  const currentData = tab === 'pelanggaran' ? pelanggaranData : apresiasiData;

  const filtered = currentData.filter((item) =>
    'nama' in item && item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const levelBadge = (level: string) => {
    switch (level) {
      case 'Ringan': return 'info';
      case 'Sedang': return 'warning';
      case 'Berat': return 'danger';
      default: return 'default';
    }
  };

  const openAdd = () => {
    setEditId(null);
    setFormData({ nama: '', skor: 10, level: 'Ringan', deskripsi: '' });
    setShowForm(true);
  };

  const openEdit = (item: JenisPelanggaran | JenisApresiasi) => {
    setEditId(item.id);
    setFormData({
      nama: item.nama,
      skor: item.skor,
      level: item.level,
      deskripsi: item.deskripsi,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (tab === 'pelanggaran') {
      setPelanggaranData((prev) => prev.filter((p) => p.id !== id));
    } else {
      setApresiasiData((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'pelanggaran') {
      if (editId) {
        setPelanggaranData((prev) =>
          prev.map((p) => (p.id === editId ? { ...p, ...formData } : p))
        );
      } else {
        const newItem: JenisPelanggaran = {
          id: `jp${Date.now()}`,
          ...formData,
        };
        setPelanggaranData((prev) => [...prev, newItem]);
      }
    } else {
      if (editId) {
        setApresiasiData((prev) =>
          prev.map((a) => (a.id === editId ? { ...a, ...formData } : a))
        );
      } else {
        const newItem: JenisApresiasi = {
          id: `ja${Date.now()}`,
          ...formData,
        };
        setApresiasiData((prev) => [...prev, newItem]);
      }
    }
    setShowForm(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Jenis {tab === 'pelanggaran' ? 'Pelanggaran' : 'Apresiasi'} ({filtered.length})</h1>
          <p className="text-gray-500 mt-1">Kelola data master jenis {tab === 'pelanggaran' ? 'pelanggaran' : 'apresiasi'} siswa</p>
        </div>

        <Card>
          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 mb-4">
            <button
              onClick={() => { setTab('pelanggaran'); setSearch(''); }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === 'pelanggaran' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Jenis Pelanggaran
            </button>
            <button
              onClick={() => { setTab('apresiasi'); setSearch(''); }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === 'apresiasi' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Jenis Apresiasi
            </button>
          </div>

          {/* Search + Add */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={`Cari Jenis ${tab === 'pelanggaran' ? 'Pelanggaran' : 'Apresiasi'}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button
              onClick={openAdd}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span>+</span> Tambah
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 w-10">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600 w-24">Skor</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600 w-24">Level</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Deskripsi</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">Tidak ada data</td>
                  </tr>
                ) : (
                  filtered.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{item.nama}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold ${tab === 'pelanggaran' ? 'text-red-600' : 'text-green-600'}`}>
                          {tab === 'pelanggaran' ? '-' : '+'}{item.skor}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={levelBadge(item.level)}>{item.level}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.deskripsi || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="px-2.5 py-1.5 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-2.5 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 mt-2">0 of {filtered.length} row(s) selected.</p>
        </Card>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editId ? 'Edit' : 'Tambah'} Jenis {tab === 'pelanggaran' ? 'Pelanggaran' : 'Apresiasi'}
                </h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder={`Nama jenis ${tab === 'pelanggaran' ? 'pelanggaran' : 'apresiasi'}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skor</label>
                    <input
                      type="number"
                      value={formData.skor}
                      onChange={(e) => setFormData({ ...formData, skor: Number(e.target.value) })}
                      required
                      min={1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as PelanggaranLevel })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="Ringan">Ringan</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Berat">Berat</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Deskripsi..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editId ? 'Simpan' : 'Tambah'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function JenisPelanggaranApresiasiPage() {
  return <JenisPelanggaranApresiasiContent />;
}
