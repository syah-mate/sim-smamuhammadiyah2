'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { useRouter } from 'next/navigation';
import { dummyAccounts, dummyPaymentMethods, dummyBillingTypes } from '@/data/finance';
import { Account, PaymentMethod, BillingType } from '@/types';

type TabKey = 'akun' | 'metode-pembayaran' | 'jenis-tagihan';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'akun', label: 'Akun' },
  { key: 'metode-pembayaran', label: 'Metode Pembayaran' },
  { key: 'jenis-tagihan', label: 'Jenis Tagihan Siswa' },
];

// ==================== Sub-komponen ====================

function TabAkun() {
  const [accounts, setAccounts] = useState<Account[]>(dummyAccounts);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ kode: '', nama: '', tipe: 'Kas dan Bank' as Account['tipe'], deskripsi: '', noRekening: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = accounts.filter((a) =>
    a.kode.toLowerCase().includes(search.toLowerCase()) ||
    a.nama.toLowerCase().includes(search.toLowerCase()) ||
    a.tipe.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm({ kode: '', nama: '', tipe: 'Kas dan Bank', deskripsi: '', noRekening: '' });
    setShowForm(true);
  };

  const openEdit = (a: Account) => {
    setEditingId(a.id);
    setForm({ kode: a.kode, nama: a.nama, tipe: a.tipe, deskripsi: a.deskripsi, noRekening: a.noRekening });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAccounts((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
    } else {
      const newAcc: Account = { id: `ak${Date.now()}`, ...form };
      setAccounts((prev) => [newAcc, ...prev]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

  const tipeOptions = [
    { value: 'Kas dan Bank', label: 'Kas dan Bank' },
    { value: 'Piutang', label: 'Piutang' },
    { value: 'Aset Tetap', label: 'Aset Tetap' },
    { value: 'Kewajiban', label: 'Kewajiban' },
    { value: 'Modal', label: 'Modal' },
    { value: 'Pendapatan', label: 'Pendapatan' },
    { value: 'Beban', label: 'Beban' },
  ];

  return (
    <div>
      <Card
        title="Daftar Akun"
        subtitle={`${filtered.length} akun`}
        action={
          <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5">
            <span>+</span> Akun Baru
          </button>
        }
      >
        <div className="mb-4">
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" placeholder="Cari Data..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="px-4 py-3 text-left font-semibold w-10">
                  <input type="checkbox" className="w-4 h-4 rounded accent-white" />
                </th>
                <th className="px-4 py-3 text-left font-semibold">Kode</th>
                <th className="px-4 py-3 text-left font-semibold">Nama</th>
                <th className="px-4 py-3 text-left font-semibold">Tipe</th>
                <th className="px-4 py-3 text-left font-semibold">Deskripsi</th>
                <th className="px-4 py-3 text-left font-semibold">Nomor Rekening</th>
                <th className="px-4 py-3 text-center font-semibold w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">Tidak ada data</td>
                </tr>
              ) : (
                filtered.map((a, idx) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{a.kode}</td>
                    <td className="px-4 py-3 text-gray-700">{a.nama}</td>
                    <td className="px-4 py-3">
                      <Badge variant="info">{a.tipe}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{a.deskripsi}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{a.noRekening}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(a)} className="p-1.5 text-orange-500 hover:bg-orange-50 rounded transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteConfirm(a.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Hapus">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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

      {/* Modal Form */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Akun' : 'Akun Baru'} size="md">
        <form onSubmit={handleSubmit}>
          <FormField label="Kode" name="kode" value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} required placeholder="1-1001" />
          <FormField label="Nama" name="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required placeholder="Nama akun" />
          <FormField label="Tipe" name="tipe" type="select" value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value as Account['tipe'] })} options={tipeOptions} />
          <FormField label="Deskripsi" name="deskripsi" type="textarea" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} placeholder="Deskripsi akun" />
          <FormField label="Nomor Rekening" name="noRekening" value={form.noRekening} onChange={(e) => setForm({ ...form, noRekening: e.target.value })} placeholder="Nomor rekening (opsional)" />
          <FormActions onCancel={() => setShowForm(false)} submitLabel={editingId ? 'Update' : 'Simpan'} />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Konfirmasi Hapus" size="sm">
        <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
          <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus</button>
        </div>
      </Modal>
    </div>
  );
}

function TabMetodePembayaran() {
  const [methods, setMethods] = useState<PaymentMethod[]>(dummyPaymentMethods);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nama: '', jenis: 'Transfer Bank' as PaymentMethod['jenis'], noRekening: '', atasNama: '', isActive: true });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = methods.filter((m) =>
    m.nama.toLowerCase().includes(search.toLowerCase()) ||
    m.jenis.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm({ nama: '', jenis: 'Transfer Bank', noRekening: '', atasNama: '', isActive: true });
    setShowForm(true);
  };

  const openEdit = (m: PaymentMethod) => {
    setEditingId(m.id);
    setForm({ nama: m.nama, jenis: m.jenis, noRekening: m.noRekening, atasNama: m.atasNama, isActive: m.isActive });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setMethods((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...form } : m)));
    } else {
      const newMethod: PaymentMethod = { id: `mp${Date.now()}`, ...form };
      setMethods((prev) => [newMethod, ...prev]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    setDeleteConfirm(null);
  };

  const jenisOptions = [
    { value: 'Tunai', label: 'Tunai' },
    { value: 'Transfer Bank', label: 'Transfer Bank' },
    { value: 'Payment Gateway', label: 'Payment Gateway' },
    { value: 'Virtual Account', label: 'Virtual Account' },
  ];

  return (
    <div>
      <Card
        title="Daftar Metode Pembayaran"
        subtitle={`${filtered.length} metode`}
        action={
          <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5">
            <span>+</span> Metode Baru
          </button>
        }
      >
        <div className="mb-4">
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" placeholder="Cari Data..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="px-4 py-3 text-left font-semibold w-10">
                  <input type="checkbox" className="w-4 h-4 rounded accent-white" />
                </th>
                <th className="px-4 py-3 text-left font-semibold">Nama</th>
                <th className="px-4 py-3 text-left font-semibold">Jenis</th>
                <th className="px-4 py-3 text-left font-semibold">Nomor Rekening</th>
                <th className="px-4 py-3 text-left font-semibold">Atas Nama</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">Tidak ada data</td>
                </tr>
              ) : (
                filtered.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{m.nama}</td>
                    <td className="px-4 py-3">
                      <Badge variant="info">{m.jenis}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{m.noRekening}</td>
                    <td className="px-4 py-3 text-gray-600">{m.atasNama}</td>
                    <td className="px-4 py-3">
                      <Badge variant={m.isActive ? 'success' : 'danger'}>{m.isActive ? 'Aktif' : 'Nonaktif'}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(m)} className="p-1.5 text-orange-500 hover:bg-orange-50 rounded transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteConfirm(m.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Hapus">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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

      {/* Modal Form */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Metode Pembayaran' : 'Metode Pembayaran Baru'} size="md">
        <form onSubmit={handleSubmit}>
          <FormField label="Nama" name="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required placeholder="Nama metode" />
          <FormField label="Jenis" name="jenis" type="select" value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value as PaymentMethod['jenis'] })} options={jenisOptions} />
          <FormField label="Nomor Rekening" name="noRekening" value={form.noRekening} onChange={(e) => setForm({ ...form, noRekening: e.target.value })} placeholder="Nomor rekening" />
          <FormField label="Atas Nama" name="atasNama" value={form.atasNama} onChange={(e) => setForm({ ...form, atasNama: e.target.value })} placeholder="Nama pemilik rekening" />
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded" />
              Aktif
            </label>
          </div>
          <FormActions onCancel={() => setShowForm(false)} submitLabel={editingId ? 'Update' : 'Simpan'} />
        </form>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Konfirmasi Hapus" size="sm">
        <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus metode pembayaran ini?</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
          <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus</button>
        </div>
      </Modal>
    </div>
  );
}

function TabJenisTagihan() {
  const [types, setTypes] = useState<BillingType[]>(dummyBillingTypes);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ kode: '', nama: '', nominal: '', periode: 'bulanan' as BillingType['periode'], akunId: '', deskripsi: '', isActive: true });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = types.filter((t) =>
    t.kode.toLowerCase().includes(search.toLowerCase()) ||
    t.nama.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm({ kode: '', nama: '', nominal: '', periode: 'bulanan', akunId: '', deskripsi: '', isActive: true });
    setShowForm(true);
  };

  const openEdit = (t: BillingType) => {
    setEditingId(t.id);
    setForm({ kode: t.kode, nama: t.nama, nominal: String(t.nominal), periode: t.periode, akunId: t.akunId, deskripsi: t.deskripsi, isActive: t.isActive });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, nominal: Number(form.nominal) };
    if (editingId) {
      setTypes((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...data } : t)));
    } else {
      const newType: BillingType = { id: `bt${Date.now()}`, ...data };
      setTypes((prev) => [newType, ...prev]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setTypes((prev) => prev.filter((t) => t.id !== id));
    setDeleteConfirm(null);
  };

  const periodeOptions = [
    { value: 'bulanan', label: 'Bulanan' },
    { value: 'semester', label: 'Semester' },
    { value: 'tahunan', label: 'Tahunan' },
    { value: 'sekali', label: 'Sekali' },
  ];

  const akunOptions = dummyAccounts.map((a) => ({ value: a.id, label: `${a.kode} - ${a.nama}` }));

  const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  return (
    <div>
      <Card
        title="Daftar Jenis Tagihan Siswa"
        subtitle={`${filtered.length} jenis tagihan`}
        action={
          <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5">
            <span>+</span> Tagihan Baru
          </button>
        }
      >
        <div className="mb-4">
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" placeholder="Cari Data..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="px-4 py-3 text-left font-semibold w-10">
                  <input type="checkbox" className="w-4 h-4 rounded accent-white" />
                </th>
                <th className="px-4 py-3 text-left font-semibold">Kode</th>
                <th className="px-4 py-3 text-left font-semibold">Nama</th>
                <th className="px-4 py-3 text-left font-semibold">Nominal</th>
                <th className="px-4 py-3 text-left font-semibold">Periode</th>
                <th className="px-4 py-3 text-left font-semibold">Akun</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">Tidak ada data</td>
                </tr>
              ) : (
                filtered.map((t, idx) => {
                  const akun = dummyAccounts.find((a) => a.id === t.akunId);
                  return (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input type="checkbox" className="w-4 h-4 rounded" />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{t.kode}</td>
                      <td className="px-4 py-3 text-gray-700">{t.nama}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{formatRupiah(t.nominal)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="info">{t.periode}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{akun?.nama || '-'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={t.isActive ? 'success' : 'danger'}>{t.isActive ? 'Aktif' : 'Nonaktif'}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openEdit(t)} className="p-1.5 text-orange-500 hover:bg-orange-50 rounded transition-colors" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => setDeleteConfirm(t.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Hapus">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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

      {/* Modal Form */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Jenis Tagihan' : 'Jenis Tagihan Baru'} size="md">
        <form onSubmit={handleSubmit}>
          <FormField label="Kode" name="kode" value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} required placeholder="SPP-SD" />
          <FormField label="Nama" name="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required placeholder="Nama tagihan" />
          <FormField label="Nominal (Rp)" name="nominal" type="number" value={form.nominal} onChange={(e) => setForm({ ...form, nominal: e.target.value })} required placeholder="700000" />
          <FormField label="Periode" name="periode" type="select" value={form.periode} onChange={(e) => setForm({ ...form, periode: e.target.value as BillingType['periode'] })} options={periodeOptions} />
          <FormField label="Akun" name="akunId" type="select" value={form.akunId} onChange={(e) => setForm({ ...form, akunId: e.target.value })} options={akunOptions} />
          <FormField label="Deskripsi" name="deskripsi" type="textarea" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} placeholder="Deskripsi" />
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded" />
              Aktif
            </label>
          </div>
          <FormActions onCancel={() => setShowForm(false)} submitLabel={editingId ? 'Update' : 'Simpan'} />
        </form>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Konfirmasi Hapus" size="sm">
        <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus jenis tagihan ini?</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
          <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus</button>
        </div>
      </Modal>
    </div>
  );
}

// ==================== Halaman Utama ====================

function DataUmumContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('akun');

  if (!user) { router.push('/'); return null; }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Keuangan</span>
            <span>›</span>
            <span className="text-gray-800 font-medium">Data Umum</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Data Umum</h1>
          <p className="text-gray-500 mt-1">Kelola data master keuangan</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-0 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'akun' && <TabAkun />}
        {activeTab === 'metode-pembayaran' && <TabMetodePembayaran />}
        {activeTab === 'jenis-tagihan' && <TabJenisTagihan />}
      </div>
    </MainLayout>
  );
}

export default function DataUmumPage() {
  return <DataUmumContent />;
}
