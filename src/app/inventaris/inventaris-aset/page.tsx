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
import { dummyAssets, dummyAssetCategories } from '@/data/inventory';
import { Asset, AssetStatus, AssetCondition } from '@/types';

const statusVariantMap: Record<AssetStatus, 'success' | 'warning' | 'info' | 'danger'> = {
  'Tersedia': 'success',
  'Dipinjam': 'warning',
  'Dalam Perbaikan': 'info',
  'Dihapuskan': 'danger',
};

const kondisiVariantMap: Record<AssetCondition, 'success' | 'warning' | 'danger'> = {
  'Baik': 'success',
  'Rusak Ringan': 'warning',
  'Rusak Berat': 'danger',
};

function InventarisAsetContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const [assets, setAssets] = useState<Asset[]>(dummyAssets);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Asset | null>(null);
  const [form, setForm] = useState({
    nama: '', label: '', kategoriId: '', tanggalBeli: '', status: 'Tersedia' as AssetStatus,
    tag: '', jumlah: 1, kondisi: 'Baik' as AssetCondition, lokasi: '', deskripsi: '',
  });

  const totalAset = assets.reduce((s, a) => s + a.jumlah, 0);
  const tersedia = assets.filter((a) => a.status === 'Tersedia').length;
  const dipinjam = assets.filter((a) => a.status === 'Dipinjam').length;
  const perbaikan = assets.filter((a) => a.status === 'Dalam Perbaikan').length;

  const openAdd = () => {
    setSelected(null);
    setForm({ nama: '', label: '', kategoriId: '', tanggalBeli: '', status: 'Tersedia', tag: '', jumlah: 1, kondisi: 'Baik', lokasi: '', deskripsi: '' });
    setIsModalOpen(true);
  };

  const openEdit = (a: Asset) => {
    setSelected(a);
    setForm({ nama: a.nama, label: a.label, kategoriId: a.kategoriId, tanggalBeli: a.tanggalBeli, status: a.status, tag: a.tag, jumlah: a.jumlah, kondisi: a.kondisi, lokasi: a.lokasi, deskripsi: a.deskripsi });
    setIsModalOpen(true);
  };

  const openDetail = (a: Asset) => {
    setSelected(a);
    setIsDetailOpen(true);
  };

  const openDelete = (a: Asset) => {
    setSelected(a);
    setIsDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const kat = dummyAssetCategories.find((c) => c.id === form.kategoriId);
    if (selected) {
      setAssets((prev) =>
        prev.map((a) =>
          a.id === selected.id
            ? { ...a, ...form, kategoriNama: kat?.nama || a.kategoriNama, updatedAt: new Date().toISOString().slice(0, 10) }
            : a
        )
      );
    } else {
      const newAsset: Asset = {
        id: `ast${Date.now()}`,
        kodeAset: `${kat?.kode || 'ASET'}-${String(assets.length + 1).padStart(3, '0')}`,
        ...form,
        kategoriNama: kat?.nama || '',
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      setAssets((prev) => [newAsset, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selected) setAssets((prev) => prev.filter((a) => a.id !== selected.id));
    setIsDeleteOpen(false);
  };

  const columns = [
    { key: 'kodeAset', header: 'Kode Aset', render: (a: Asset) => <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{a.kodeAset}</span> },
    { key: 'nama', header: 'Nama Aset', render: (a: Asset) => <span className="font-medium text-gray-800">{a.nama}</span> },
    { key: 'kategoriNama', header: 'Kategori' },
    {
      key: 'tanggalBeli', header: 'Tgl Beli',
      render: (a: Asset) => <span className="text-gray-500 text-sm">{a.tanggalBeli}</span>,
    },
    {
      key: 'status', header: 'Status',
      render: (a: Asset) => <Badge variant={statusVariantMap[a.status]}>{a.status}</Badge>,
    },
    { key: 'jumlah', header: 'Jumlah', render: (a: Asset) => <span className="font-semibold">{a.jumlah}</span> },
    {
      key: 'kondisi', header: 'Kondisi',
      render: (a: Asset) => <Badge variant={kondisiVariantMap[a.kondisi]}>{a.kondisi}</Badge>,
    },
    { key: 'lokasi', header: 'Lokasi' },
  ];

  const filtered = search
    ? assets.filter((a) =>
        [a.kodeAset, a.nama, a.label, a.kategoriNama, a.tag, a.lokasi].some((v) =>
          v.toLowerCase().includes(search.toLowerCase())
        )
      )
    : assets;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Inventaris Aset</h1>
            <p className="text-gray-500 mt-1">Manajemen aset & inventaris sekolah</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">🏷️ Cetak Label</button>
            <button onClick={openAdd} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">+ Tambah Aset</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatCard title="Total Aset" value={assets.length} icon="📦" color="blue" />
          <StatCard title="Total Unit" value={totalAset} icon="📊" color="green" />
          <StatCard title="Tersedia" value={tersedia} icon="✅" color="green" />
          <StatCard title="Dipinjam" value={dipinjam} icon="🤝" color="yellow" />
          <StatCard title="Perbaikan" value={perbaikan} icon="🔧" color="red" />
        </div>

        <Card title="Daftar Aset Sekolah">
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari aset..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(a) => a.id}
            searchPlaceholder=""
            actions={(a) => (
              <div className="flex gap-1 justify-end">
                <button onClick={() => openDetail(a)} className="px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors">Detail</button>
                <button onClick={() => openEdit(a)} className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors">Edit</button>
                <button onClick={() => openDelete(a)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors">Hapus</button>
              </div>
            )}
            emptyMessage="Belum ada aset terdaftar"
          />
        </Card>

        {/* Modal Add/Edit */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selected ? 'Edit Aset' : 'Tambah Aset Baru'} size="lg">
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nama" name="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama aset" required />
              <FormField label="Label" name="label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label singkat" required />
              <FormField label="Tanggal Dibeli" name="tanggalBeli" type="date" value={form.tanggalBeli} onChange={(e) => setForm({ ...form, tanggalBeli: e.target.value })} required />
              <FormField
                label="Kategori" name="kategoriId" type="select" value={form.kategoriId}
                onChange={(e) => setForm({ ...form, kategoriId: e.target.value })}
                options={dummyAssetCategories.map((c) => ({ value: c.id, label: c.nama }))}
                placeholder="Pilih Kategori" required
              />
              <FormField
                label="Status" name="status" type="select" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as AssetStatus })}
                options={[
                  { value: 'Tersedia', label: 'Tersedia' },
                  { value: 'Dipinjam', label: 'Dipinjam' },
                  { value: 'Dalam Perbaikan', label: 'Dalam Perbaikan' },
                  { value: 'Dihapuskan', label: 'Dihapuskan' },
                ]}
                required
              />
              <FormField label="Tag" name="tag" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="Tag pencarian" />
              <FormField label="Jumlah" name="jumlah" type="number" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: Number(e.target.value) })} required />
              <FormField
                label="Kondisi" name="kondisi" type="select" value={form.kondisi}
                onChange={(e) => setForm({ ...form, kondisi: e.target.value as AssetCondition })}
                options={[
                  { value: 'Baik', label: 'Baik' },
                  { value: 'Rusak Ringan', label: 'Rusak Ringan' },
                  { value: 'Rusak Berat', label: 'Rusak Berat' },
                ]}
                required
              />
              <FormField label="Lokasi" name="lokasi" value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} placeholder="Lokasi aset" />
            </div>
            <FormField label="Deskripsi" name="deskripsi" type="textarea" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} placeholder="Deskripsi tambahan" rows={2} />

            {/* Foto Aset */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto Aset</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">Drop files here or click to select</p>
                <p className="text-xs text-gray-400 mt-1">Accepted files: .jpeg, .png, .jpg</p>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-600 mb-1">Preview Foto</p>
                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <span className="text-gray-400 text-sm">No image selected.</span>
                </div>
              </div>
            </div>

            <FormActions onCancel={() => setIsModalOpen(false)} submitLabel={selected ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        {/* Modal Detail */}
        <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Detail Aset" size="lg">
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Kode Aset</p>
                  <p className="font-mono font-semibold text-gray-800">{selected.kodeAset}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nama Aset</p>
                  <p className="font-semibold text-gray-800">{selected.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Label</p>
                  <p className="text-gray-700">{selected.label}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kategori</p>
                  <p className="text-gray-700">{selected.kategoriNama}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal Beli</p>
                  <p className="text-gray-700">{selected.tanggalBeli}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge variant={statusVariantMap[selected.status]}>{selected.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tag</p>
                  <p className="text-gray-700">{selected.tag || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Jumlah</p>
                  <p className="font-semibold text-gray-800">{selected.jumlah}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kondisi</p>
                  <Badge variant={kondisiVariantMap[selected.kondisi]}>{selected.kondisi}</Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lokasi</p>
                  <p className="text-gray-700">{selected.lokasi || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Deskripsi</p>
                <p className="text-gray-700">{selected.deskripsi || '-'}</p>
              </div>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>Dibuat: {selected.createdAt}</span>
                <span>Diupdate: {selected.updatedAt}</span>
              </div>
            </div>
          )}
        </Modal>

        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Hapus Aset"
          message={`Yakin ingin menghapus aset "${selected?.nama}"? Data tidak dapat dikembalikan.`}
          confirmLabel="Hapus"
          variant="danger"
        />
      </div>
    </MainLayout>
  );
}

export default function InventarisAsetPage() {
  return <InventarisAsetContent />;
}
