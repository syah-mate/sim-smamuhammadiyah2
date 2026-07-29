'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyAssets, dummyAssetReports, dummyAssetRentals, dummyAssetMutations } from '@/data/inventory';
import { AssetReportSummary, Asset } from '@/types';

function LaporanContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [selectedKategori, setSelectedKategori] = useState('all');
  const [search, setSearch] = useState('');

  const allKategori = useMemo(() => {
    const cats = [...new Set(dummyAssets.map((a) => a.kategoriNama))];
    return cats;
  }, []);

  if (!user) { router.push('/'); return null; }

  const filteredReports = selectedKategori === 'all'
    ? dummyAssetReports
    : dummyAssetReports.filter((r) => r.kategoriId === selectedKategori || r.kategoriNama === selectedKategori);

  const filteredAssets = selectedKategori === 'all'
    ? dummyAssets
    : dummyAssets.filter((a) => a.kategoriNama === selectedKategori);

  const totalAset = filteredReports.reduce((s, r) => s + r.totalAset, 0);
  const totalTersedia = filteredReports.reduce((s, r) => s + r.tersedia, 0);
  const totalDipinjam = filteredReports.reduce((s, r) => s + r.dipinjam, 0);
  const totalBaik = filteredReports.reduce((s, r) => s + r.baik, 0);
  const totalRusak = filteredReports.reduce((s, r) => s + r.rusakRingan + r.rusakBerat, 0);

  const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  const totalPendapatanSewa = dummyAssetRentals
    .filter((r) => r.status === 'Selesai')
    .reduce((s, r) => s + r.biayaSewa, 0);

  const reportColumns = [
    { key: 'kategoriNama', header: 'Kategori', render: (r: AssetReportSummary) => <span className="font-medium text-gray-800">{r.kategoriNama}</span> },
    { key: 'totalAset', header: 'Total', render: (r: AssetReportSummary) => <span className="font-semibold">{r.totalAset}</span> },
    { key: 'tersedia', header: 'Tersedia', render: (r: AssetReportSummary) => <Badge variant="success">{r.tersedia}</Badge> },
    { key: 'dipinjam', header: 'Dipinjam', render: (r: AssetReportSummary) => <Badge variant="warning">{r.dipinjam}</Badge> },
    { key: 'perbaikan', header: 'Perbaikan', render: (r: AssetReportSummary) => <Badge variant="info">{r.perbaikan}</Badge> },
    { key: 'dihapuskan', header: 'Dihapuskan', render: (r: AssetReportSummary) => <Badge variant="danger">{r.dihapuskan}</Badge> },
    { key: 'baik', header: 'Baik', render: (r: AssetReportSummary) => <Badge variant="success">{r.baik}</Badge> },
    {
      key: 'rusak', header: 'Rusak',
      render: (r: AssetReportSummary) => (
        <span className="text-sm">
          {r.rusakRingan > 0 && <Badge variant="warning">{r.rusakRingan} Ringan</Badge>}
          {r.rusakBerat > 0 && <Badge variant="danger" className="ml-1">{r.rusakBerat} Berat</Badge>}
          {r.rusakRingan === 0 && r.rusakBerat === 0 && <span className="text-gray-400">0</span>}
        </span>
      ),
    },
  ];

  // Detail aset per kategori
  const assetDetailColumns = [
    { key: 'kodeAset', header: 'Kode', render: (a: Asset) => <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{a.kodeAset}</span> },
    { key: 'nama', header: 'Nama Aset', render: (a: Asset) => <span className="font-medium text-gray-800">{a.nama}</span> },
    { key: 'status', header: 'Status', render: (a: Asset) => <Badge variant={a.status === 'Tersedia' ? 'success' : a.status === 'Dipinjam' ? 'warning' : a.status === 'Dalam Perbaikan' ? 'info' : 'danger'}>{a.status}</Badge> },
    { key: 'kondisi', header: 'Kondisi', render: (a: Asset) => <Badge variant={a.kondisi === 'Baik' ? 'success' : a.kondisi === 'Rusak Ringan' ? 'warning' : 'danger'}>{a.kondisi}</Badge> },
    { key: 'jumlah', header: 'Jumlah', render: (a: Asset) => <span className="font-semibold">{a.jumlah}</span> },
    { key: 'lokasi', header: 'Lokasi' },
    { key: 'tanggalBeli', header: 'Tgl Beli', render: (a: Asset) => <span className="text-sm text-gray-500">{a.tanggalBeli}</span> },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Laporan Inventaris Aset</h1>
            <p className="text-gray-500 mt-1">Ringkasan dan laporan seluruh aset sekolah</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">🖨️ Cetak Laporan</button>
            <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">📥 Export Excel</button>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatCard title="Total Aset" value={totalAset} icon="📦" color="blue" />
          <StatCard title="Tersedia" value={totalTersedia} icon="✅" color="green" />
          <StatCard title="Dipinjam" value={totalDipinjam} icon="🤝" color="yellow" />
          <StatCard title="Kondisi Baik" value={totalBaik} icon="👍" color="green" />
          <StatCard title="Perlu Perbaikan" value={totalRusak} icon="🔧" color="red" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard title="Total Mutasi" value={dummyAssetMutations.length} icon="🔄" color="purple" />
          <StatCard title="Total Persewaan" value={dummyAssetRentals.length} icon="📋" color="blue" />
          <StatCard title="Pendapatan Sewa" value={formatRupiah(totalPendapatanSewa)} icon="💰" color="green" />
        </div>

        {/* Filter Kategori */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-600">Filter Kategori:</span>
          <button
            onClick={() => setSelectedKategori('all')}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedKategori === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Semua
          </button>
          {allKategori.map((kat) => (
            <button
              key={kat}
              onClick={() => setSelectedKategori(kat)}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedKategori === kat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* Laporan Ringkasan per Kategori */}
        <Card title="Laporan per Kategori">
          <DataTable
            columns={reportColumns}
            data={filteredReports}
            keyExtractor={(r) => r.kategoriId}
            emptyMessage="Tidak ada data laporan"
          />
        </Card>

        {/* Detail Aset */}
        {selectedKategori !== 'all' && (
          <Card title={`Detail Aset — ${selectedKategori}`} subtitle={`Menampilkan ${filteredAssets.length} aset`}>
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
              columns={assetDetailColumns}
              data={search ? filteredAssets.filter((a) => [a.kodeAset, a.nama, a.lokasi].some((v) => v.toLowerCase().includes(search.toLowerCase()))) : filteredAssets}
              keyExtractor={(a) => a.id}
              emptyMessage="Tidak ada aset dalam kategori ini"
            />
          </Card>
        )}

        {/* Ringkasan Persewaan */}
        <Card title="Ringkasan Persewaan">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">No Sewa</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Aset</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Penyewa</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-600">Tanggal</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-600">Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dummyAssetRentals.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-xs">{r.noSewa}</td>
                    <td className="px-4 py-2 font-medium text-gray-800">{r.asetNama}</td>
                    <td className="px-4 py-2">{r.penyewa}</td>
                    <td className="px-4 py-2 text-center text-gray-500">{r.tanggalSewa} → {r.tanggalKembali}</td>
                    <td className="px-4 py-2 text-center">
                      <Badge variant={r.status === 'Aktif' ? 'warning' : r.status === 'Selesai' ? 'success' : 'danger'}>{r.status}</Badge>
                    </td>
                    <td className="px-4 py-2 text-right font-semibold">{formatRupiah(r.biayaSewa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default function LaporanPage() {
  return <LaporanContent />;
}
