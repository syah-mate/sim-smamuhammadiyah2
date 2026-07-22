'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { Card, StatCard } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { dummyPayments, dummyBills } from '@/data/finance';
import { dummyStudents } from '@/data/students';
import { Payment } from '@/types';

function PembayaranContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState(dummyPayments);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ billId: '', tanggalBayar: '', nominalDibayar: '', metode: 'tunai', buktiBayar: '' });

  if (!user) { router.push('/'); return null; }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment: Payment = {
      id: `p${Date.now()}`,
      billId: form.billId,
      tanggalBayar: form.tanggalBayar,
      nominalDibayar: Number(form.nominalDibayar),
      metode: form.metode as 'tunai' | 'transfer' | 'va',
      dicatatOleh: user.id,
      buktiBayar: form.buktiBayar || undefined,
    };
    setPayments((prev) => [newPayment, ...prev]);
    setShowForm(false);
    setForm({ billId: '', tanggalBayar: '', nominalDibayar: '', metode: 'tunai', buktiBayar: '' });
  };

  const total = payments.reduce((s, p) => s + p.nominalDibayar, 0);

  const columns = [
    {
      key: 'siswa', header: 'Siswa',
      render: (p: Payment) => {
        const bill = dummyBills.find((b) => b.id === p.billId);
        const s = bill ? dummyStudents.find((st) => st.id === bill.siswaId) : null;
        return <span className="font-medium text-gray-800">{s?.namaLengkap || '-'}</span>;
      },
    },
    {
      key: 'nominalDibayar', header: 'Jumlah',
      render: (p: Payment) => <span className="font-semibold text-green-600">Rp {p.nominalDibayar.toLocaleString()}</span>,
    },
    { key: 'tanggalBayar', header: 'Tanggal' },
    {
      key: 'metode', header: 'Metode',
      render: (p: Payment) => <span className="capitalize text-xs px-2 py-0.5 bg-gray-100 rounded">{p.metode}</span>,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pembayaran</h1>
            <p className="text-gray-500 mt-1">Catat & verifikasi pembayaran</p>
          </div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            💰 Input Pembayaran
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard title="Total Pembayaran" value={`Rp ${total.toLocaleString()}`} color="green" />
          <StatCard title="Transaksi" value={payments.length} color="blue" />
          <StatCard title="Hari Ini" value={`Rp ${payments.filter((p) => p.tanggalBayar === '2026-07-22').reduce((s, p) => s + p.nominalDibayar, 0).toLocaleString()}`} color="purple" />
        </div>

        <Card title="Riwayat Pembayaran" subtitle={`${payments.length} transaksi`}>
          <DataTable
            columns={columns}
            data={payments}
            keyExtractor={(p) => p.id}
            searchPlaceholder="Cari pembayaran..."
          />
        </Card>

        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Input Pembayaran" size="md">
          <form onSubmit={handleSubmit}>
            <FormField label="Tagihan" name="billId" type="select" value={form.billId} onChange={(e) => setForm({ ...form, billId: e.target.value })} required
              options={dummyBills.filter((b) => b.status !== 'lunas').map((b) => {
                const s = dummyStudents.find((st) => st.id === b.siswaId);
                return { value: b.id, label: `${s?.namaLengkap || '-'} — Rp ${b.nominal.toLocaleString()} (${b.status})` };
              })} />
            <FormField label="Tanggal Bayar" name="tanggalBayar" type="date" value={form.tanggalBayar} onChange={(e) => setForm({ ...form, tanggalBayar: e.target.value })} required />
            <FormField label="Nominal Dibayar" name="nominalDibayar" type="number" value={form.nominalDibayar} onChange={(e) => setForm({ ...form, nominalDibayar: e.target.value })} required />
            <FormField label="Metode" name="metode" type="select" value={form.metode} onChange={(e) => setForm({ ...form, metode: e.target.value })} options={[{ value: 'tunai', label: 'Tunai' }, { value: 'transfer', label: 'Transfer' }, { value: 'va', label: 'Virtual Account' }]} />
            <FormField label="Bukti Bayar (upload)" name="buktiBayar" type="file" onChange={() => {}} accept="image/*" />
            <FormActions onCancel={() => setShowForm(false)} submitLabel="Simpan Pembayaran" />
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
}

export default function PembayaranPage() {
  return <PembayaranContent />;
}
