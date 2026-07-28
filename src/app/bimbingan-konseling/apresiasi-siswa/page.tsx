'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyApresiasiSiswa, dummyJenisApresiasi, dummyTindakLanjut } from '@/data/bk';
import { dummyStudents } from '@/data/students';
import { ApresiasiSiswa } from '@/types';

function ApresiasiSiswaContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [data, setData] = useState<ApresiasiSiswa[]>([...dummyApresiasiSiswa]);
  const [formData, setFormData] = useState({
    tanggal: '',
    siswaId: '',
    jenisApresiasiId: '',
    tindakLanjutId: '',
    tahunAjaran: '2025/2026',
    deskripsi: '',
  });

  if (!user) { router.push('/'); return null; }

  const filtered = data.filter((item) => {
    const student = dummyStudents.find((s) => s.id === item.siswaId);
    const ja = dummyJenisApresiasi.find((j) => j.id === item.jenisApresiasiId);
    const tl = dummyTindakLanjut.find((t) => t.id === item.tindakLanjutId);
    const searchStr = `${student?.namaLengkap || ''} ${ja?.nama || ''} ${tl?.nama || ''} ${item.deskripsi} ${item.tanggal}`.toLowerCase();
    return searchStr.includes(search.toLowerCase());
  });

  const openAdd = () => {
    setEditId(null);
    setFormData({
      tanggal: '',
      siswaId: '',
      jenisApresiasiId: '',
      tindakLanjutId: '',
      tahunAjaran: '2025/2026',
      deskripsi: '',
    });
    setShowForm(true);
  };

  const openEdit = (item: ApresiasiSiswa) => {
    setEditId(item.id);
    setFormData({
      tanggal: item.tanggal,
      siswaId: item.siswaId,
      jenisApresiasiId: item.jenisApresiasiId,
      tindakLanjutId: item.tindakLanjutId,
      tahunAjaran: item.tahunAjaran,
      deskripsi: item.deskripsi,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setData((prev) =>
        prev.map((d) => (d.id === editId ? { ...d, ...formData } : d))
      );
    } else {
      setData((prev) => [...prev, { id: `as${Date.now()}`, ...formData }]);
    }
    setShowForm(false);
  };

  const apresiasiTindakLanjut = dummyTindakLanjut.filter((t) => t.kategori === 'Apresiasi');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Apresiasi Siswa ({filtered.length})</h1>
          <p className="text-gray-500 mt-1">Catatan kegiatan siswa yang mendapat apresiasi</p>
        </div>

        <Card>
          {/* Search + Add */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari apresiasi siswa..."
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
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Tanggal</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Siswa</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Jenis Apresiasi</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Tindak Lanjut</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Tahun Ajaran</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Deskripsi</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">Tidak ada data</td>
                  </tr>
                ) : (
                  filtered.map((item, idx) => {
                    const student = dummyStudents.find((s) => s.id === item.siswaId);
                    const ja = dummyJenisApresiasi.find((j) => j.id === item.jenisApresiasiId);
                    const tl = dummyTindakLanjut.find((t) => t.id === item.tindakLanjutId);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.tanggal}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{student?.namaLengkap || '-'}</td>
                        <td className="px-4 py-3">
                          <span className="text-green-600 text-xs">{ja?.nama || '-'}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{tl?.nama || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{item.tahunAjaran}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs max-w-48 truncate">{item.deskripsi || '-'}</td>
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 mt-2">0 of {filtered.length} row(s) selected.</p>
        </Card>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
                <h3 className="text-lg font-semibold text-gray-800">{editId ? 'Edit' : 'Tambah'} Apresiasi Siswa</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Siswa</label>
                  <select
                    value={formData.siswaId}
                    onChange={(e) => setFormData({ ...formData, siswaId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Pilih Siswa</option>
                    {dummyStudents.filter((s) => s.status === 'aktif').map((s) => (
                      <option key={s.id} value={s.id}>{s.namaLengkap} - {s.kelas} {s.jurusan}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Apresiasi</label>
                  <select
                    value={formData.jenisApresiasiId}
                    onChange={(e) => setFormData({ ...formData, jenisApresiasiId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Pilih Jenis Apresiasi</option>
                    {dummyJenisApresiasi.map((ja) => (
                      <option key={ja.id} value={ja.id}>{ja.nama} (Skor: +{ja.skor}, {ja.level})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tindak Lanjut</label>
                  <select
                    value={formData.tindakLanjutId}
                    onChange={(e) => setFormData({ ...formData, tindakLanjutId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Pilih Tindak Lanjut</option>
                    {apresiasiTindakLanjut.map((tl) => (
                      <option key={tl.id} value={tl.id}>{tl.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran</label>
                  <select
                    value={formData.tahunAjaran}
                    onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026</option>
                    <option value="2026/2027">2026/2027</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Deskripsi apresiasi..."
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

export default function ApresiasiSiswaPage() {
  return <ApresiasiSiswaContent />;
}
