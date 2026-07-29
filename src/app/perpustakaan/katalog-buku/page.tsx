'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';
import { dummyLibraryBooks } from '@/data/library';
import { LibraryBook } from '@/types';

const emptyBookForm = {
  kodeBuku: '',
  judul: '',
  penulis: '',
  penerbit: '',
  kategori: '',
  jumlahEksemplar: 1,
  stokTersedia: 1,
  tahunTerbit: new Date().getFullYear(),
};

function KatalogBukuContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [books, setBooks] = useState<LibraryBook[]>(dummyLibraryBooks);
  const [modalTambah, setModalTambah] = useState(false);
  const [form, setForm] = useState(emptyBookForm);

  if (!user) { router.push('/'); return null; }

  const totalBuku = books.reduce((s, b) => s + b.jumlahEksemplar, 0);
  const tersedia = books.reduce((s, b) => s + b.stokTersedia, 0);
  const dipinjam = totalBuku - tersedia;

  const handleTambah = () => {
    const newBook: LibraryBook = {
      id: `lb-${Date.now()}`,
      ...form,
    };
    setBooks((prev) => [...prev, newBook]);
    setForm(emptyBookForm);
    setModalTambah(false);
  };

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
          <button
            onClick={() => setModalTambah(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            + Tambah Buku
          </button>
        </div>

        {/* Modal Tambah Buku */}
        <Modal isOpen={modalTambah} onClose={() => setModalTambah(false)} title="Tambah Buku Baru" size="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode Buku</label>
              <input
                type="text"
                value={form.kodeBuku}
                onChange={(e) => setForm({ ...form, kodeBuku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="BK-009"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <input
                type="text"
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buku Pelajaran / Fiksi / Referensi"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Buku</label>
              <input
                type="text"
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan judul buku"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
              <input
                type="text"
                value={form.penulis}
                onChange={(e) => setForm({ ...form, penulis: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nama penulis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Penerbit</label>
              <input
                type="text"
                value={form.penerbit}
                onChange={(e) => setForm({ ...form, penerbit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nama penerbit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Eksemplar</label>
              <input
                type="number"
                min={1}
                value={form.jumlahEksemplar}
                onChange={(e) => setForm({ ...form, jumlahEksemplar: +e.target.value, stokTersedia: +e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Terbit</label>
              <input
                type="number"
                value={form.tahunTerbit}
                onChange={(e) => setForm({ ...form, tahunTerbit: +e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setModalTambah(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleTambah}
              disabled={!form.judul || !form.kodeBuku}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Simpan
            </button>
          </div>
        </Modal>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <StatCard title="Total Koleksi" value={totalBuku} icon="📚" color="blue" />
          <StatCard title="Tersedia" value={tersedia} icon="✅" color="green" />
          <StatCard title="Dipinjam" value={dipinjam} icon="📖" color="yellow" />
          <StatCard title="Judul Buku" value={books.length} icon="📋" color="purple" />
        </div>

        <Card title="Katalog">
          <DataTable
            columns={columns}
            data={books}
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
