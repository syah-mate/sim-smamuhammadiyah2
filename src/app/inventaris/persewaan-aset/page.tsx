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
import { dummyAssets, dummyAssetRentals } from '@/data/inventory';
import { AssetRental, RentalStatus } from '@/types';

const statusVariantMap: Record<RentalStatus, 'success' | 'warning' | 'danger'> = {
  'Aktif': 'warning',
  'Selesai': 'success',
  'Dibatalkan': 'danger',
};

function PersewaanAsetContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [rentals, setRentals] = useState<AssetRental[]>(dummyAssetRentals);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [selected, setSelected] = useState<AssetRental | null>(null);
  const [form, setForm] = useState({
    asetId: '', penyewa: '', picPenyewa: '', noTelpPenyewa: '',
    tanggalSewa: '', tanggalKembali: '', biayaSewa: 0, keterangan: '',
  });

  if (!user) { router.push('/'); return null; }

  const aktif = rentals.filter((r) => r.status === 'Aktif').length;
  const selesai = rentals.filter((r) => r.status === 'Selesai').length;
  const totalPendapatan = rentals.filter((r) => r.status === 'Selesai').reduce((s, r) => s + r.biayaSewa, 0);

  const openAdd = () => {
    setSelected(null);
    setForm({ asetId: '', penyewa: '', picPenyewa: '', noTelpPenyewa: '', tanggalSewa: '', tanggalKembali: '', biayaSewa: 0, keterangan: '' });
    setIsModalOpen(true);
  };

  const openEdit = (r: AssetRental) => {
    setSelected(r);
    setForm({ asetId: r.asetId, penyewa: r.penyewa, picPenyewa: r.picPenyewa, noTelpPenyewa: r.noTelpPenyewa, tanggalSewa: r.tanggalSewa, tanggalKembali: r.tanggalKembali, biayaSewa: r.biayaSewa, keterangan: r.keterangan });
    setIsModalOpen(true);
  };

  const openReturn = (r: AssetRental) => {
    setSelected(r);
    setIsReturnOpen(true);
  };

  const openDelete = (r: AssetRental) => {
    setSelected(r);
    setIsDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const aset = dummyAssets.find((a) => a.id === form.asetId);
    const tglSewa = new Date(form.tanggalSewa);
    const tglKembali = new Date(form.tanggalKembali);
    const durasi = Math.ceil((tglKembali.getTime() - tglSewa.getTime()) / (1000 * 60 * 60 * 24));

    if (selected) {
      setRentals((prev) =>
        prev.map((r) =>
          r.id === selected.id
            ? { ...r, ...form, asetNama: aset?.nama || r.asetNama, durasiHari: durasi }
            : r
        )
      );
    } else {
      const newRental: AssetRental = {
        id: `rnt${Date.now()}`,
        noSewa: `SEW-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(rentals.length + 1).padStart(3, '0')}`,
        ...form,
        asetNama: aset?.nama || '',
        durasiHari: durasi,
        status: 'Aktif',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setRentals((prev) => [newRental, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleReturn = () => {
    if (selected) {
      setRentals((prev) =>
        prev.map((r) => (r.id === selected.id ? { ...r, status: 'Selesai' as RentalStatus } : r))
      );
    }
    setIsReturnOpen(false);
  };

  const handleDelete = () => {
    if (selected) setRentals((prev) => prev.filter((r) => r.id !== selected.id));
    setIsDeleteOpen(false);
  };

  const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const columns = [
    { key: 'noSewa', header: 'No Sewa', render: (r: AssetRental) => <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{r.noSewa}</span> },
    { key: 'tanggalSewa', header: 'Tgl Sewa', render: (r: AssetRental) => <span className="text-sm">{r.tanggalSewa}</span> },
    { key: 'asetNama', header: 'Aset Disewa', render: (r: AssetRental) => <span className="font-medium text-gray-800">{r.asetNama}</span> },
    { key: 'penyewa', header: 'Penyewa', render: (r: AssetRental) => <span className="text-sm">{r.penyewa}</span> },
    { key: 'picPenyewa', header: 'PIC Penyewa', render: (r: AssetRental) => <span className="text-sm text-gray-600">{r.picPenyewa}</span> },
    { key: 'noTelpPenyewa', header: 'No Telp', render: (r: AssetRental) => <span className="text-sm text-gray-600">{r.noTelpPenyewa}</span> },
    { key: 'durasiHari', header: 'Durasi', render: (r: AssetRental) => <span className="text-sm">{r.durasiHari} hari</span> },
    {
      key: 'biayaSewa', header: 'Biaya',
      render: (r: AssetRental) => <span className="font-semibold text-gray-800">{formatRupiah(r.biayaSewa)}</span>,
    },
    {
      key: 'status', header: 'Status',
      render: (r: AssetRental) => <Badge variant={statusVariantMap[r.status]}>{r.status}</Badge>,
    },
  ];

  const filtered = search
    ? rentals.filter((r) =>
        [r.noSewa, r.asetNama, r.penyewa, r.picPenyewa, r.noTelpPenyewa].some((v) =>
          v.toLowerCase().includes(search.toLowerCase())
        )
      )
    : rentals;

  const formatDateInput = (d: string) => d; // already YYYY-MM-DD

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Persewaan Aset</h1>
            <p className="text-gray-500 mt-1">Kelola penyewaan aset sekolah</p>
          </div>
          <button onClick={openAdd} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            + Sewa Baru
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <StatCard title="Total Sewa" value={rentals.length} icon="📋" color="blue" />
          <StatCard title="Aktif" value={aktif} icon="🔄" color="yellow" />
          <StatCard title="Selesai" value={selesai} icon="✅" color="green" />
          <StatCard title="Total Pendapatan" value={formatRupiah(totalPendapatan)} icon="💰" color="purple" />
        </div>

        <Card title="Daftar Persewaan Aset">
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari sewa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(r) => r.id}
            searchPlaceholder=""
            actions={(r) => (
              <div className="flex gap-1 justify-end">
                {r.status === 'Aktif' && (
                  <button onClick={() => openReturn(r)} className="px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors">Kembalikan</button>
                )}
                <button onClick={() => openEdit(r)} className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors">Edit</button>
                <button onClick={() => openDelete(r)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors">Hapus</button>
              </div>
            )}
            emptyMessage="Belum ada data persewaan"
          />
        </Card>

        {/* Modal Add/Edit */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selected ? 'Edit Persewaan' : 'Persewaan Baru'} size="lg">
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Aset yang Disewa" name="asetId" type="select" value={form.asetId}
                onChange={(e) => setForm({ ...form, asetId: e.target.value })}
                options={dummyAssets.map((a) => ({ value: a.id, label: `${a.kodeAset} - ${a.nama}` }))}
                placeholder="Pilih Aset" required
              />
              <FormField label="Penyewa" name="penyewa" value={form.penyewa} onChange={(e) => setForm({ ...form, penyewa: e.target.value })} placeholder="Nama penyewa / instansi" required />
              <FormField label="PIC Penyewa" name="picPenyewa" value={form.picPenyewa} onChange={(e) => setForm({ ...form, picPenyewa: e.target.value })} placeholder="Nama PIC" required />
              <FormField label="No Telp Penyewa" name="noTelpPenyewa" type="tel" value={form.noTelpPenyewa} onChange={(e) => setForm({ ...form, noTelpPenyewa: e.target.value })} placeholder="08xxxxxxxxxx" required />
              <FormField label="Tanggal Sewa" name="tanggalSewa" type="date" value={form.tanggalSewa} onChange={(e) => setForm({ ...form, tanggalSewa: e.target.value })} required />
              <FormField label="Tanggal Kembali" name="tanggalKembali" type="date" value={form.tanggalKembali} onChange={(e) => setForm({ ...form, tanggalKembali: e.target.value })} required />
              <FormField label="Biaya Sewa (Rp)" name="biayaSewa" type="number" value={form.biayaSewa} onChange={(e) => setForm({ ...form, biayaSewa: Number(e.target.value) })} placeholder="0" required />
            </div>
            <FormField label="Keterangan" name="keterangan" type="textarea" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} placeholder="Keterangan tambahan" rows={2} />
            <FormActions onCancel={() => setIsModalOpen(false)} submitLabel={selected ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        <ConfirmDialog
          isOpen={isReturnOpen}
          onClose={() => setIsReturnOpen(false)}
          onConfirm={handleReturn}
          title="Kembalikan Aset"
          message={`Konfirmasi pengembalian aset "${selected?.asetNama}" oleh "${selected?.penyewa}"?`}
          confirmLabel="Konfirmasi Pengembalian"
          variant="primary"
        />

        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Hapus Persewaan"
          message={`Yakin ingin menghapus data sewa "${selected?.noSewa}"?`}
          confirmLabel="Hapus"
          variant="danger"
        />
      </div>
    </MainLayout>
  );
}

export default function PersewaanAsetPage() {
  return <PersewaanAsetContent />;
}
