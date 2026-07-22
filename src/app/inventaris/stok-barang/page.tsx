'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyInventoryItems, dummyInventoryTransactions } from '@/data/inventory';
import { InventoryItem } from '@/types';

function StokBarangContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const totalItems = dummyInventoryItems.length;
  const stokMenipis = dummyInventoryItems.filter((i) => i.stok <= i.minStok).length;
  const totalStok = dummyInventoryItems.reduce((s, i) => s + i.stok, 0);

  const columns = [
    { key: 'kodeBarang', header: 'Kode' },
    { key: 'nama', header: 'Nama Barang', render: (i: InventoryItem) => <span className="font-medium text-gray-800">{i.nama}</span> },
    { key: 'kategori', header: 'Kategori' },
    { key: 'satuan', header: 'Satuan' },
    {
      key: 'stok', header: 'Stok',
      render: (i: InventoryItem) => (
        <span className={`font-semibold ${i.stok <= i.minStok ? 'text-red-600' : 'text-green-600'}`}>
          {i.stok} {i.satuan}
          {i.stok <= i.minStok && <span className="text-xs ml-1">⚠️</span>}
        </span>
      ),
    },
    { key: 'lokasi', header: 'Lokasi' },
    {
      key: 'kondisi', header: 'Kondisi',
      render: (i: InventoryItem) => <Badge variant={i.kondisi === 'baik' ? 'success' : 'danger'}>{i.kondisi}</Badge>,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Stok Inventaris</h1>
            <p className="text-gray-500 mt-1">Manajemen aset & barang sekolah</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50" title="QR Code (coming soon)">🏷️ Label</button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">+ Tambah Barang</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <StatCard title="Total Item" value={totalItems} icon="📦" color="blue" />
          <StatCard title="Total Stok" value={totalStok} icon="📊" color="green" />
          <StatCard title="Stok Menipis" value={stokMenipis} icon="⚠️" color="red" />
          <StatCard title="Transaksi" value={dummyInventoryTransactions.length} icon="🔄" color="purple" />
        </div>

        {/* Alert stok menipis */}
        {stokMenipis > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Stok Menipis — Perlu Restock:</p>
            <div className="space-y-1">
              {dummyInventoryItems.filter((i) => i.stok <= i.minStok).map((i) => (
                <p key={i.id} className="text-sm text-yellow-700">• {i.nama} — Stok: {i.stok} {i.satuan} (min: {i.minStok})</p>
              ))}
            </div>
          </div>
        )}

        <Card title="Master Barang">
          <DataTable
            columns={columns}
            data={dummyInventoryItems}
            keyExtractor={(i) => i.id}
            searchPlaceholder="Cari barang..."
            searchKeys={['nama', 'kodeBarang', 'kategori']}
          />
        </Card>

        <Card title="Riwayat Transaksi">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Tanggal</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Item</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Jenis</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-600">Jumlah</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dummyInventoryTransactions.map((t) => {
                  const item = dummyInventoryItems.find((i) => i.id === t.itemId);
                  return (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-600">{t.tanggal}</td>
                      <td className="px-4 py-2 font-medium text-gray-800">{item?.nama || '-'}</td>
                      <td className="px-4 py-2">
                        <Badge variant={t.jenis === 'masuk' || t.jenis === 'kembali' ? 'success' : t.jenis === 'pinjam' ? 'warning' : 'info'}>
                          {t.jenis}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-center font-medium">{t.jumlah}</td>
                      <td className="px-4 py-2 text-gray-600">{t.keterangan}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default function StokBarangPage() {
  return <StokBarangContent />;
}
