'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyLibraryCirculations, dummyLibraryBooks } from '@/data/library';
import { dummyStudents } from '@/data/students';
import { dummyEmployees } from '@/data/employees';

function SirkulasiContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const dipinjam = dummyLibraryCirculations.filter((c) => c.status === 'dipinjam').length;
  const telat = dummyLibraryCirculations.filter((c) => c.status === 'telat').length;
  const totalDenda = dummyLibraryCirculations.reduce((s, c) => s + c.denda, 0);

  const getPeminjamName = (id: string, tipe: 'siswa' | 'pegawai') => {
    if (tipe === 'siswa') return dummyStudents.find((s) => s.id === id)?.namaLengkap || '-';
    return dummyEmployees.find((e) => e.id === id)?.nama || '-';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sirkulasi</h1>
            <p className="text-gray-500 mt-1">Peminjaman & pengembalian buku</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">📖 Pinjam</button>
            <button className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">↩️ Kembali</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <StatCard title="Sedang Dipinjam" value={dipinjam} icon="📖" color="blue" />
          <StatCard title="Telat" value={telat} icon="⚠️" color="red" />
          <StatCard title="Total Denda" value={`Rp ${totalDenda.toLocaleString()}`} icon="💰" color="yellow" />
          <StatCard title="Total Transaksi" value={dummyLibraryCirculations.length} icon="🔄" color="purple" />
        </div>

        {/* Overdue Alert */}
        {telat > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-800 mb-2">⚠️ Buku Terlambat:</p>
            {dummyLibraryCirculations.filter((c) => c.status === 'telat').map((c) => {
              const book = dummyLibraryBooks.find((b) => b.id === c.bookId);
              return (
                <p key={c.id} className="text-sm text-red-700">• {book?.judul} — {getPeminjamName(c.peminjamId, c.peminjamTipe)} (Denda: Rp {c.denda.toLocaleString()})</p>
              );
            })}
          </div>
        )}

        <Card title="Daftar Sirkulasi">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Buku</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Peminjam</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Tipe</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Tgl Pinjam</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Tenggat</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-600">Denda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dummyLibraryCirculations.map((c) => {
                  const book = dummyLibraryBooks.find((b) => b.id === c.bookId);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-800">{book?.judul || '-'}</td>
                      <td className="px-4 py-2 text-gray-600">{getPeminjamName(c.peminjamId, c.peminjamTipe)}</td>
                      <td className="px-4 py-2 text-gray-500 capitalize text-xs">{c.peminjamTipe}</td>
                      <td className="px-4 py-2 text-gray-600">{c.tanggalPinjam}</td>
                      <td className="px-4 py-2 text-gray-600">{c.tenggatKembali}</td>
                      <td className="px-4 py-2"><Badge variant={statusVariant(c.status) as 'success' | 'warning' | 'danger'}>{c.status}</Badge></td>
                      <td className="px-4 py-2 text-right font-medium text-red-600">Rp {c.denda.toLocaleString()}</td>
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

export default function SirkulasiPage() {
  return <SirkulasiContent />;
}
