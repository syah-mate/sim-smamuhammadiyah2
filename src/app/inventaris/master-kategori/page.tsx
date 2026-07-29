'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { useRouter } from 'next/navigation';
import { dummyAssetCategories } from '@/data/inventory';
import { AssetCategory } from '@/types';

function MasterKategoriContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const [categories, setCategories] = useState<AssetCategory[]>(dummyAssetCategories);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AssetCategory | null>(null);
  const [form, setForm] = useState({ kode: '', nama: '', deskripsi: '' });

  const openAdd = () => {
    setSelected(null);
    setForm({ kode: '', nama: '', deskripsi: '' });
    setIsModalOpen(true);
  };

  const openEdit = (cat: AssetCategory) => {
    setSelected(cat);
    setForm({ kode: cat.kode, nama: cat.nama, deskripsi: cat.deskripsi });
    setIsModalOpen(true);
  };

  const openDelete = (cat: AssetCategory) => {
    setSelected(cat);
    setIsDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      setCategories((prev) =>
        prev.map((c) => (c.id === selected.id ? { ...c, ...form, updatedAt: new Date().toISOString().slice(0, 10) } : c))
      );
    } else {
      const newCat: AssetCategory = {
        id: `cat${Date.now()}`,
        ...form,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setCategories((prev) => [newCat, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selected) {
      setCategories((prev) => prev.filter((c) => c.id !== selected.id));
    }
    setIsDeleteOpen(false);
  };

  const columns = [
    { key: 'kode', header: 'Kode', render: (c: AssetCategory) => <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{c.kode}</span> },
    { key: 'nama', header: 'Nama Kategori', render: (c: AssetCategory) => <span className="font-medium text-gray-800">{c.nama}</span> },
    { key: 'deskripsi', header: 'Deskripsi', render: (c: AssetCategory) => <span className="text-gray-500 text-sm">{c.deskripsi || '-'}</span> },
    {
      key: 'createdAt', header: 'Dibuat',
      render: (c: AssetCategory) => <span className="text-gray-500 text-sm">{c.createdAt}</span>,
    },
  ];

  const filtered = search
    ? categories.filter((c) =>
        [c.kode, c.nama, c.deskripsi].some((v) => v.toLowerCase().includes(search.toLowerCase()))
      )
    : categories;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Master Kategori Aset</h1>
            <p className="text-gray-500 mt-1">Kelola kategori aset sekolah</p>
          </div>
          <button onClick={openAdd} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            + Tambah Kategori
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard title="Total Kategori" value={categories.length} icon="📑" color="blue" />
          <StatCard title="Kategori Aktif" value={categories.length} icon="✅" color="green" />
          <StatCard title="Total Aset" value="12" icon="📦" color="purple" />
        </div>

        <Card title="Daftar Kategori Aset">
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(c) => c.id}
            searchPlaceholder=""
            actions={(c) => (
              <div className="flex gap-1 justify-end">
                <button onClick={() => openEdit(c)} className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors">Edit</button>
                <button onClick={() => openDelete(c)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors">Hapus</button>
              </div>
            )}
            emptyMessage="Belum ada kategori aset"
          />
        </Card>

        {/* Modal Add/Edit */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selected ? 'Edit Kategori Aset' : 'Tambah Kategori Aset'} size="md">
          <form onSubmit={handleSave}>
            <FormField label="Kode" name="kode" value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} placeholder="FUR / ELK / LAB" required />
            <FormField label="Nama Kategori" name="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama kategori" required />
            <FormField label="Deskripsi" name="deskripsi" type="textarea" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} placeholder="Deskripsi kategori (opsional)" rows={3} />
            <FormActions onCancel={() => setIsModalOpen(false)} submitLabel={selected ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Hapus Kategori"
          message={`Yakin ingin menghapus kategori "${selected?.nama}"? Semua aset dalam kategori ini akan terpengaruh.`}
          confirmLabel="Hapus"
          variant="danger"
        />
      </div>
    </MainLayout>
  );
}

export default function MasterKategoriPage() {
  return <MasterKategoriContent />;
}
