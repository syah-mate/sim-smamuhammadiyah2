'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { useRouter } from 'next/navigation';
import { dummyCashTransactions, dummyAccounts, dummyPaymentMethods } from '@/data/finance';
import { dummyEmployees } from '@/data/employees';
import { dummyStudents } from '@/data/students';
import { CashTransaction } from '@/types';

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function KasirPenerimaanContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'penerimaan' | 'pengeluaran'>('penerimaan');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState<CashTransaction[]>(dummyCashTransactions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    akunId: '',
    metodeBayarId: '',
    keterangan: '',
    nominal: '',
    terkaitSiswaId: '',
  });

  const filtered = transactions.filter(t =>
    t.jenis === activeTab && (
      t.noTransaksi.toLowerCase().includes(search.toLowerCase()) ||
      t.keterangan.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = activeTab === 'penerimaan' ? 'INV' : 'OUT';
    const dateStr = form.tanggal.replace(/-/g, '');
    const seq = String(transactions.length + 1).padStart(4, '0');
    const newTx: CashTransaction = {
      id: `ct${Date.now()}`,
      noTransaksi: `${prefix}${dateStr}${seq}`,
      tanggal: form.tanggal,
      jenis: activeTab,
      akunId: form.akunId,
      petugasId: user?.id || 'e3',
      metodeBayarId: form.metodeBayarId,
      keterangan: form.keterangan,
      nominal: Number(form.nominal),
      terkaitSiswaId: form.terkaitSiswaId || undefined,
    };
    setTransactions(prev => [newTx, ...prev]);
    setShowForm(false);
    setForm({ tanggal: new Date().toISOString().split('T')[0], akunId: '', metodeBayarId: '', keterangan: '', nominal: '', terkaitSiswaId: '' });
  };

  const openCreate = () => {
    setForm({ tanggal: new Date().toISOString().split('T')[0], akunId: '', metodeBayarId: '', keterangan: '', nominal: '', terkaitSiswaId: '' });
    setShowForm(true);
  };

  const akunOptions = dummyAccounts.map(a => ({ value: a.id, label: `${a.kode} - ${a.nama}` }));
  const metodeOptions = dummyPaymentMethods.map(m => ({ value: m.id, label: m.nama }));
  const siswaOptions = dummyStudents.map(s => ({ value: s.id, label: `${s.namaLengkap} (${s.nis})` }));

  const totalNominal = filtered.reduce((sum, t) => sum + t.nominal, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Keuangan</span>
            <span>›</span>
            <span className="text-gray-800 font-medium">Transaksi Kasir</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Transaksi Kasir</h1>
          <p className="text-gray-500 mt-1">Kelola penerimaan dan pengeluaran sekolah</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-0 -mb-px">
            <button
              onClick={() => setActiveTab('penerimaan')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'penerimaan'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Penerimaan
            </button>
            <button
              onClick={() => setActiveTab('pengeluaran')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'pengeluaran'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pengeluaran
            </button>
          </nav>
        </div>

        {/* Card */}
        <Card
          title={`Daftar Transaksi ${activeTab === 'penerimaan' ? 'Penerimaan' : 'Pengeluaran'}`}
          subtitle={`${filtered.length} transaksi · Total: ${formatRupiah(totalNominal)}`}
          action={
            <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5">
              <span>+</span> Tambah
            </button>
          }
        >
          <div className="mb-4">
            <div className="relative max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text" placeholder="Cari Transaksi..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                  <th className="px-4 py-3 text-left font-semibold">No. Transaksi</th>
                  <th className="px-4 py-3 text-left font-semibold">Petugas</th>
                  <th className="px-4 py-3 text-left font-semibold">Mtd. Pembayaran</th>
                  <th className="px-4 py-3 text-left font-semibold">Keterangan</th>
                  <th className="px-4 py-3 text-right font-semibold">Nominal</th>
                  <th className="px-4 py-3 text-center font-semibold w-32">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">Tidak ada transaksi</td>
                  </tr>
                ) : (
                  filtered.map((t) => {
                    const petugas = dummyEmployees.find(e => e.id === t.petugasId);
                    const metode = dummyPaymentMethods.find(m => m.id === t.metodeBayarId);
                    return (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-600">{t.tanggal}</td>
                        <td className="px-4 py-3">
                          <span className="text-blue-600 font-mono text-xs font-medium">{t.noTransaksi}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{petugas?.nama || '-'}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{metode?.nama || '-'}</td>
                        <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{t.keterangan}</td>
                        <td className={`px-4 py-3 text-right font-semibold ${t.jenis === 'penerimaan' ? 'text-green-600' : 'text-red-600'}`}>
                          {formatRupiah(t.nominal)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1.5 text-green-500 hover:bg-green-50 rounded transition-colors" title="Salin">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Cetak">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                              </svg>
                            </button>
                            <button className="p-1.5 text-orange-500 hover:bg-orange-50 rounded transition-colors" title="Edit">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Hapus">
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
        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={`Transaksi ${activeTab === 'penerimaan' ? 'Penerimaan' : 'Pengeluaran'} Baru`} size="md">
          <form onSubmit={handleSubmit}>
            <FormField label="Tanggal" name="tanggal" type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} required />
            <FormField label="Akun" name="akunId" type="select" value={form.akunId} onChange={(e) => setForm({ ...form, akunId: e.target.value })} options={akunOptions} required />
            <FormField label="Metode Pembayaran" name="metodeBayarId" type="select" value={form.metodeBayarId} onChange={(e) => setForm({ ...form, metodeBayarId: e.target.value })} options={metodeOptions} required />
            <FormField label="Terkait Siswa (opsional)" name="terkaitSiswaId" type="select" value={form.terkaitSiswaId} onChange={(e) => setForm({ ...form, terkaitSiswaId: e.target.value })} options={[{ value: '', label: '-- Tidak terkait siswa --' }, ...siswaOptions]} />
            <FormField label="Keterangan" name="keterangan" type="textarea" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} required placeholder="Deskripsi transaksi" />
            <FormField label="Nominal (Rp)" name="nominal" type="number" value={form.nominal} onChange={(e) => setForm({ ...form, nominal: e.target.value })} required placeholder="0" />
            <FormActions onCancel={() => setShowForm(false)} submitLabel="Simpan" />
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
}

export default function KasirPenerimaanPage() {
  return <KasirPenerimaanContent />;
}
