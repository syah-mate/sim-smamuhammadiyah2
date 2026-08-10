'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';
import { dummyKomponenIsmuba } from '@/data/ismuba';
import { generateId } from '@/lib/utils';
import { KomponenIsmuba } from '@/types';

function DataMasterContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [komponenList, setKomponenList] = useState<KomponenIsmuba[]>(dummyKomponenIsmuba);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nama: '', deskripsi: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (!user) { router.push('/'); return null; }

  const filtered = komponenList.filter(
    (k) =>
      k.nama.toLowerCase().includes(search.toLowerCase()) ||
      k.deskripsi.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm({ nama: '', deskripsi: '' });
    setShowModal(true);
  };

  const openEdit = (k: KomponenIsmuba) => {
    setEditingId(k.id);
    setForm({ nama: k.nama, deskripsi: k.deskripsi });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.nama.trim()) return;
    if (editingId) {
      setKomponenList((prev) =>
        prev.map((k) => (k.id === editingId ? { ...k, nama: form.nama, deskripsi: form.deskripsi } : k))
      );
    } else {
      const newItem: KomponenIsmuba = {
        id: generateId('ki'),
        nama: form.nama,
        deskripsi: form.deskripsi,
      };
      setKomponenList((prev) => [...prev, newItem]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setKomponenList((prev) => prev.filter((k) => k.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Master Komponen Ismuba</h1>
            <p className="text-gray-500 mt-1">Kelola daftar komponen kegiatan Ismuba (Al-Islam, Kemuhammadiyahan, dan Bahasa Arab)</p>
          </div>
          <button
            onClick={openAdd}
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Komponen
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {komponenList.map((k) => (
            <Card key={k.id} className="!p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800">{k.nama}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{k.deskripsi}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEdit(k)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(k.id)}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Hapus
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Search & Table */}
        <Card>
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari komponen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 w-10">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Komponen</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Deskripsi</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                      Tidak ada data komponen
                    </td>
                  </tr>
                ) : (
                  filtered.map((k, idx) => (
                    <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{k.nama}</td>
                      <td className="px-4 py-3 text-gray-600">{k.deskripsi}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
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
          title={editingId ? 'Edit Komponen Ismuba' : 'Tambah Komponen Ismuba'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Komponen</label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Contoh: Hafalan Surat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Deskripsi komponen kegiatan Ismuba..."
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
                disabled={!form.nama.trim()}
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
            Apakah Anda yakin ingin menghapus komponen ini? Data yang sudah dihapus tidak dapat dikembalikan.
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

export default function DataMasterPage() {
  return <DataMasterContent />;
}
