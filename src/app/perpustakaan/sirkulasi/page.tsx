'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';
import { dummyLibraryCirculations, dummyLibraryBooks } from '@/data/library';
import { dummyStudents } from '@/data/students';
import { dummyEmployees } from '@/data/employees';
import { LibraryCirculation } from '@/types';

const todayStr = () => new Date().toISOString().split('T')[0];
const addDays = (d: string, n: number) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().split('T')[0];
};

const emptyPinjamForm = {
  bookId: '',
  peminjamTipe: 'siswa' as 'siswa' | 'pegawai',
  peminjamId: '',
  tanggalPinjam: todayStr(),
  tenggatKembali: addDays(todayStr(), 7),
};

const emptyKembaliForm = {
  circulationId: '',
  tanggalKembali: todayStr(),
  denda: 0,
};

function SirkulasiContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [circulations, setCirculations] = useState<LibraryCirculation[]>(dummyLibraryCirculations);
  const [modalPinjam, setModalPinjam] = useState(false);
  const [modalKembali, setModalKembali] = useState(false);
  const [formPinjam, setFormPinjam] = useState(emptyPinjamForm);
  const [formKembali, setFormKembali] = useState(emptyKembaliForm);

  if (!user) { router.push('/'); return null; }

  const dipinjam = circulations.filter((c) => c.status === 'dipinjam').length;
  const telat = circulations.filter((c) => c.status === 'telat').length;
  const totalDenda = circulations.reduce((s, c) => s + c.denda, 0);

  // Buku yang masih tersedia untuk dipinjam
  const availableBooks = dummyLibraryBooks.filter((b) => b.stokTersedia > 0);

  // Sirkulasi aktif (bisa dikembalikan)
  const activeCirculations = circulations.filter((c) => c.status === 'dipinjam' || c.status === 'telat');

  const getPeminjamName = (id: string, tipe: 'siswa' | 'pegawai') => {
    if (tipe === 'siswa') return dummyStudents.find((s) => s.id === id)?.namaLengkap || '-';
    return dummyEmployees.find((e) => e.id === id)?.nama || '-';
  };

  const handlePinjam = () => {
    if (!formPinjam.bookId || !formPinjam.peminjamId) return;
    const newCirculation: LibraryCirculation = {
      id: `lc-${Date.now()}`,
      bookId: formPinjam.bookId,
      peminjamId: formPinjam.peminjamId,
      peminjamTipe: formPinjam.peminjamTipe,
      tanggalPinjam: formPinjam.tanggalPinjam,
      tenggatKembali: formPinjam.tenggatKembali,
      status: 'dipinjam',
      denda: 0,
    };
    setCirculations((prev) => [...prev, newCirculation]);
    setFormPinjam(emptyPinjamForm);
    setModalPinjam(false);
  };

  const handleKembali = () => {
    if (!formKembali.circulationId) return;
    setCirculations((prev) =>
      prev.map((c) =>
        c.id === formKembali.circulationId
          ? {
              ...c,
              status: 'kembali' as const,
              tanggalKembali: formKembali.tanggalKembali,
              denda: c.denda + formKembali.denda,
            }
          : c,
      ),
    );
    setFormKembali(emptyKembaliForm);
    setModalKembali(false);
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
            <button
              onClick={() => setModalPinjam(true)}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              📖 Pinjam
            </button>
            <button
              onClick={() => setModalKembali(true)}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
            >
              ↩️ Kembali
            </button>
          </div>
        </div>

        {/* Modal Pinjam Buku */}
        <Modal isOpen={modalPinjam} onClose={() => setModalPinjam(false)} title="📖 Pinjam Buku" size="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Buku</label>
              <select
                value={formPinjam.bookId}
                onChange={(e) => setFormPinjam({ ...formPinjam, bookId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Pilih Buku --</option>
                {availableBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.kodeBuku} — {b.judul} (Tersedia: {b.stokTersedia})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Peminjam</label>
              <select
                value={formPinjam.peminjamTipe}
                onChange={(e) =>
                  setFormPinjam({
                    ...formPinjam,
                    peminjamTipe: e.target.value as 'siswa' | 'pegawai',
                    peminjamId: '',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="siswa">Siswa</option>
                <option value="pegawai">Pegawai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peminjam</label>
              <select
                value={formPinjam.peminjamId}
                onChange={(e) => setFormPinjam({ ...formPinjam, peminjamId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Pilih Peminjam --</option>
                {formPinjam.peminjamTipe === 'siswa'
                  ? dummyStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nis} — {s.namaLengkap} ({s.kelas})
                      </option>
                    ))
                  : dummyEmployees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nip} — {e.nama}
                      </option>
                    ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pinjam</label>
              <input
                type="date"
                value={formPinjam.tanggalPinjam}
                onChange={(e) =>
                  setFormPinjam({
                    ...formPinjam,
                    tanggalPinjam: e.target.value,
                    tenggatKembali: addDays(e.target.value, 7),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenggat Kembali</label>
              <input
                type="date"
                value={formPinjam.tenggatKembali}
                onChange={(e) => setFormPinjam({ ...formPinjam, tenggatKembali: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setModalPinjam(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handlePinjam}
              disabled={!formPinjam.bookId || !formPinjam.peminjamId}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Simpan
            </button>
          </div>
        </Modal>

        {/* Modal Kembalikan Buku */}
        <Modal isOpen={modalKembali} onClose={() => setModalKembali(false)} title="↩️ Kembalikan Buku" size="lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Sirkulasi Aktif</label>
              <select
                value={formKembali.circulationId}
                onChange={(e) => setFormKembali({ ...formKembali, circulationId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Pilih --</option>
                {activeCirculations.map((c) => {
                  const book = dummyLibraryBooks.find((b) => b.id === c.bookId);
                  return (
                    <option key={c.id} value={c.id}>
                      {book?.judul} — {getPeminjamName(c.peminjamId, c.peminjamTipe)} ({c.status})
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kembali</label>
                <input
                  type="date"
                  value={formKembali.tanggalKembali}
                  onChange={(e) => setFormKembali({ ...formKembali, tanggalKembali: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Denda (Rp)</label>
                <input
                  type="number"
                  min={0}
                  value={formKembali.denda}
                  onChange={(e) => setFormKembali({ ...formKembali, denda: +e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setModalKembali(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleKembali}
              disabled={!formKembali.circulationId}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Kembalikan
            </button>
          </div>
        </Modal>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <StatCard title="Sedang Dipinjam" value={dipinjam} icon="📖" color="blue" />
          <StatCard title="Telat" value={telat} icon="⚠️" color="red" />
          <StatCard title="Total Denda" value={`Rp ${totalDenda.toLocaleString()}`} icon="💰" color="yellow" />
          <StatCard title="Total Transaksi" value={circulations.length} icon="🔄" color="purple" />
        </div>

        {/* Overdue Alert */}
        {telat > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-800 mb-2">⚠️ Buku Terlambat:</p>
            {circulations.filter((c) => c.status === 'telat').map((c) => {
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
                {circulations.map((c) => {
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
