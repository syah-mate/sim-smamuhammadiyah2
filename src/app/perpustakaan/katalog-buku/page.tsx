'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyLibraryBooks } from '@/data/library';
import { LibraryBook } from '@/types';

function KatalogBukuContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  const totalBuku = dummyLibraryBooks.reduce((s, b) => s + b.jumlahEksemplar, 0);
  const tersedia = dummyLibraryBooks.reduce((s, b) => s + b.stokTersedia, 0);
  const dipinjam = totalBuku - tersedia;

  const columns = [
    { key: 'kodeBuku', header: 'Kode' },
    { key: 'judul', header: 'Judul', render: (b: LibraryBook) => <span className="font-medium text-gray-800">{b.judul}</span> },
    { key: 'penulis', header: 'Penulis' },
    { key: 'penerbit', header: 'Penerbit' },
    { key: 'kategori', header: 'Kategori' },
    { key: 'tahunTerbit', header: 'Tahun' },
    {
      key: 'stokTersedia', header: 'Tersedia',
      render: (b: LibraryBook) => (
        <span className={`font-semibold ${b.stokTersedia === 0 ? 'text-red-600' : 'text-green-600'}`}>
          {b.stokTersedia}/{b.jumlahEksemplar}
        </span>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Katalog Buku</h1>
            <p className="text-gray-500 mt-1">Master data buku perpustakaan</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">+ Tambah Buku</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <StatCard title="Total Koleksi" value={totalBuku} icon="📚" color="blue" />
          <StatCard title="Tersedia" value={tersedia} icon="✅" color="green" />
          <StatCard title="Dipinjam" value={dipinjam} icon="📖" color="yellow" />
          <StatCard title="Judul Buku" value={dummyLibraryBooks.length} icon="📋" color="purple" />
        </div>

        <Card title="Katalog">
          <DataTable
            columns={columns}
            data={dummyLibraryBooks}
            keyExtractor={(b) => b.id}
            searchPlaceholder="Cari judul, penulis, kategori..."
            searchKeys={['judul', 'penulis', 'kategori', 'kodeBuku']}
          />
        </Card>
      </div>
    </MainLayout>
  );
}

export default function KatalogBukuPage() {
  return <KatalogBukuContent />;
}
