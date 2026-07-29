'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { useRouter } from 'next/navigation';
import { dummyAssets, dummyAssetCategories, dummyAssetMutations } from '@/data/inventory';
import { AssetMutation, AssetCondition } from '@/types';

const kondisiVariantMap: Record<AssetCondition, 'success' | 'warning' | 'danger'> = {
  'Baik': 'success',
  'Rusak Ringan': 'warning',
  'Rusak Berat': 'danger',
};

function MutasiAsetContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const [mutations, setMutations] = useState<AssetMutation[]>(dummyAssetMutations);
  const [assets, setAssets] = useState(dummyAssets);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    asetId: '', kategoriBaruId: '', kondisiBaru: 'Baik' as AssetCondition,
    pic: '', keterangan: '',
  });

  const totalMutasi = mutations.length;
  const mutasiKategori = mutations.filter((m) => m.kategoriLamaId !== m.kategoriBaruId).length;
  const mutasiKondisi = mutations.filter((m) => m.kondisiLama !== m.kondisiBaru).length;

  const openAdd = () => {
    setForm({ asetId: '', kategoriBaruId: '', kondisiBaru: 'Baik', pic: '', keterangan: '' });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const aset = assets.find((a) => a.id === form.asetId);
    if (!aset) return;
    const katBaru = dummyAssetCategories.find((c) => c.id === form.kategoriBaruId);

    const newMutation: AssetMutation = {
      id: `mut${Date.now()}`,
      noMutasi: `MTS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(mutations.length + 1).padStart(3, '0')}`,
      asetId: aset.id,
      asetNama: aset.nama,
      kategoriLamaId: aset.kategoriId,
      kategoriLamaNama: aset.kategoriNama,
      kategoriBaruId: form.kategoriBaruId || aset.kategoriId,
      kategoriBaruNama: katBaru?.nama || aset.kategoriNama,
      kondisiLama: aset.kondisi,
      kondisiBaru: form.kondisiBaru,
      tanggalMutasi: new Date().toISOString().slice(0, 10),
      pic: form.pic,
      keterangan: form.keterangan,
    };

    setMutations((prev) => [newMutation, ...prev]);

    // Update aset
    setAssets((prev) =>
      prev.map((a) =>
        a.id === aset.id
          ? {
              ...a,
              kategoriId: form.kategoriBaruId || a.kategoriId,
              kategoriNama: katBaru?.nama || a.kategoriNama,
              kondisi: form.kondisiBaru,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : a
      )
    );

    setIsModalOpen(false);
  };

  const columns = [
    { key: 'noMutasi', header: 'No Mutasi', render: (m: AssetMutation) => <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{m.noMutasi}</span> },
    {
      key: 'tanggalMutasi', header: 'Tanggal',
      render: (m: AssetMutation) => <span className="text-sm text-gray-600">{m.tanggalMutasi}</span>,
    },
    {
      key: 'asetNama', header: 'Aset',
      render: (m: AssetMutation) => <span className="font-medium text-gray-800">{m.asetNama}</span>,
    },
    {
      key: 'kategori', header: 'Kategori',
      render: (m: AssetMutation) => (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-gray-500">{m.kategoriLamaNama}</span>
          {m.kategoriLamaId !== m.kategoriBaruId && (
            <>
              <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="font-semibold text-blue-600">{m.kategoriBaruNama}</span>
            </>
          )}
          {m.kategoriLamaId === m.kategoriBaruId && <span className="text-gray-400 ml-1">(tetap)</span>}
        </div>
      ),
    },
    {
      key: 'kondisi', header: 'Kondisi',
      render: (m: AssetMutation) => (
        <div className="flex items-center gap-1 text-xs">
          <Badge variant={kondisiVariantMap[m.kondisiLama]}>{m.kondisiLama}</Badge>
          {m.kondisiLama !== m.kondisiBaru && (
            <>
              <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <Badge variant={kondisiVariantMap[m.kondisiBaru]}>{m.kondisiBaru}</Badge>
            </>
          )}
          {m.kondisiLama === m.kondisiBaru && <span className="text-gray-400 ml-1">(tetap)</span>}
        </div>
      ),
    },
    {
      key: 'pic', header: 'PIC',
      render: (m: AssetMutation) => <span className="text-sm text-gray-600">{m.pic}</span>,
    },
    {
      key: 'keterangan', header: 'Keterangan',
      render: (m: AssetMutation) => <span className="text-sm text-gray-500 max-w-50 truncate block">{m.keterangan || '-'}</span>,
    },
  ];

  const filtered = search
    ? mutations.filter((m) =>
        [m.noMutasi, m.asetNama, m.kategoriLamaNama, m.kategoriBaruNama, m.pic, m.keterangan].some((v) =>
          v.toLowerCase().includes(search.toLowerCase())
        )
      )
    : mutations;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mutasi & Update Status Aset</h1>
            <p className="text-gray-500 mt-1">Pindahkan kategori & perbarui kondisi aset</p>
          </div>
          <button onClick={openAdd} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            + Mutasi Baru
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard title="Total Mutasi" value={totalMutasi} icon="🔄" color="blue" />
          <StatCard title="Mutasi Kategori" value={mutasiKategori} icon="📁" color="purple" />
          <StatCard title="Update Kondisi" value={mutasiKondisi} icon="🔧" color="yellow" />
        </div>

        <Card title="Riwayat Mutasi Aset">
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari mutasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(m) => m.id}
            searchPlaceholder=""
            emptyMessage="Belum ada riwayat mutasi"
          />
        </Card>

        {/* Modal Mutasi Baru */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mutasi Aset Baru" size="lg">
          <form onSubmit={handleSave}>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 font-medium">ℹ️ Mutasi Aset</p>
              <p className="text-xs text-blue-600 mt-1">Pilih aset, lalu tentukan kategori baru dan/atau kondisi baru. Sistem akan mencatat perubahan secara otomatis.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Aset" name="asetId" type="select" value={form.asetId}
                onChange={(e) => {
                  const aset = assets.find((a) => a.id === e.target.value);
                  setForm({ ...form, asetId: e.target.value, kategoriBaruId: aset?.kategoriId || '', kondisiBaru: aset?.kondisi || 'Baik' });
                }}
                options={assets.map((a) => ({ value: a.id, label: `${a.kodeAset} - ${a.nama} (${a.kategoriNama}, ${a.kondisi})` }))}
                placeholder="Pilih Aset" required
              />
              <FormField
                label="Kategori Baru" name="kategoriBaruId" type="select" value={form.kategoriBaruId}
                onChange={(e) => setForm({ ...form, kategoriBaruId: e.target.value })}
                options={dummyAssetCategories.map((c) => ({ value: c.id, label: c.nama }))}
                placeholder="Biarkan jika tidak berubah"
              />
              <FormField
                label="Kondisi Baru" name="kondisiBaru" type="select" value={form.kondisiBaru}
                onChange={(e) => setForm({ ...form, kondisiBaru: e.target.value as AssetCondition })}
                options={[
                  { value: 'Baik', label: 'Baik' },
                  { value: 'Rusak Ringan', label: 'Rusak Ringan' },
                  { value: 'Rusak Berat', label: 'Rusak Berat' },
                ]}
                required
              />
              <FormField label="PIC" name="pic" value={form.pic} onChange={(e) => setForm({ ...form, pic: e.target.value })} placeholder="Nama penanggung jawab" required />
            </div>
            <FormField label="Keterangan" name="keterangan" type="textarea" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} placeholder="Alasan mutasi/perubahan kondisi" rows={3} required />
            <FormActions onCancel={() => setIsModalOpen(false)} submitLabel="Proses Mutasi" />
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
}

export default function MutasiAsetPage() {
  return <MutasiAsetContent />;
}
