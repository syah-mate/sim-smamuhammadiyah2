'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { StatCard } from '@/components/ui/Card';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { useRouter } from 'next/navigation';
import { dummyRaporConfig } from '@/data/akademik';
import { RaporConfig, RaporStatus } from '@/types';

// ─── helpers ───────────────────────────────────────────────
const statusBadge: Record<RaporStatus, string> = {
  Aktif: 'bg-green-100 text-green-700',
  Draft: 'bg-yellow-100 text-yellow-700',
  Selesai: 'bg-gray-100 text-gray-600',
};

function formatDate(d: string) {
  if (!d) return '-';
  const [y, m, day] = d.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${day} ${months[+m - 1]} ${y}`;
}

// ─── icons (inline SVG) ────────────────────────────────────
const IconSearch = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconGear = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconChevronDown = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── main component ────────────────────────────────────────
function PengaturanRaporContent() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  const [list, setList] = useState<RaporConfig[]>(dummyRaporConfig);
  const [search, setSearch] = useState('');
  const [filterTahun, setFilterTahun] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState<RaporStatus | 'Semua'>('Semua');

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<RaporConfig | null>(null);
  const [form, setForm] = useState({
    nama: '', semester: 'Ganjil' as 'Ganjil' | 'Genap', tahunAjaran: '2026/2027',
    tanggalCetak: '', batasInputMulai: '', batasInputSelesai: '',
    kkm: 75, status: 'Aktif' as RaporStatus,
    peringkat: true, absensi: true, ekskul: true,
    catatan: '',
  });

  // ─── stats ───
  const total = list.length;
  const aktif = list.filter(r => r.status === 'Aktif').length;
  const draft = list.filter(r => r.status === 'Draft').length;
  const selesai = list.filter(r => r.status === 'Selesai').length;

  // ─── tahun ajaran list ───
  const tahunOptions = ['Semua', ...Array.from(new Set(list.map(r => r.tahunAjaran)))];

  // ─── handlers ───
  const openAdd = () => {
    setSelected(null);
    setForm({ nama: '', semester: 'Ganjil', tahunAjaran: '2026/2027', tanggalCetak: '', batasInputMulai: '', batasInputSelesai: '', kkm: 75, status: 'Aktif', peringkat: true, absensi: true, ekskul: true, catatan: '' });
    setIsModalOpen(true);
  };

  const openEdit = (r: RaporConfig) => {
    setSelected(r);
    setForm({ nama: r.nama, semester: r.semester, tahunAjaran: r.tahunAjaran, tanggalCetak: r.tanggalCetak, batasInputMulai: r.batasInputMulai, batasInputSelesai: r.batasInputSelesai, kkm: r.kkm, status: r.status, peringkat: r.fitur.peringkat, absensi: r.fitur.absensi, ekskul: r.fitur.ekskul, catatan: r.catatan });
    setIsModalOpen(true);
  };

  const openDelete = (r: RaporConfig) => {
    setSelected(r);
    setIsDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      setList(prev => prev.map(r => r.id === selected.id ? {
        ...r,
        nama: form.nama, semester: form.semester, tahunAjaran: form.tahunAjaran,
        tanggalCetak: form.tanggalCetak, batasInputMulai: form.batasInputMulai,
        batasInputSelesai: form.batasInputSelesai, kkm: form.kkm, status: form.status,
        fitur: { peringkat: form.peringkat, absensi: form.absensi, ekskul: form.ekskul },
        catatan: form.catatan,
      } : r));
    } else {
      const newItem: RaporConfig = {
        id: `rc${Date.now()}`,
        nama: form.nama, semester: form.semester, tahunAjaran: form.tahunAjaran,
        tanggalCetak: form.tanggalCetak, batasInputMulai: form.batasInputMulai,
        batasInputSelesai: form.batasInputSelesai, kkm: form.kkm, status: form.status,
        fitur: { peringkat: form.peringkat, absensi: form.absensi, ekskul: form.ekskul },
        catatan: form.catatan,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setList(prev => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selected) setList(prev => prev.filter(r => r.id !== selected.id));
    setIsDeleteOpen(false);
  };

  // ─── filter ───
  let filtered = list;
  if (search) {
    filtered = filtered.filter(r =>
      [r.nama, r.tahunAjaran, r.catatan].some(v => v.toLowerCase().includes(search.toLowerCase()))
    );
  }
  if (filterTahun !== 'Semua') filtered = filtered.filter(r => r.tahunAjaran === filterTahun);
  if (filterStatus !== 'Semua') filtered = filtered.filter(r => r.status === filterStatus);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* ── header ── */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Akademik &gt; Pengaturan Rapor</p>
            <h1 className="text-2xl font-bold text-gray-800 mt-0.5">Pengaturan Rapor</h1>
            <p className="text-gray-500 mt-1">Kelola konfigurasi rapor per tahun ajaran dan semester.</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Rapor
          </button>
        </div>

        {/* ── stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard title="Total" value={total} icon="📄" color="blue" />
          <StatCard title="Aktif" value={aktif} icon="📅" color="green" />
          <StatCard title="Draft" value={draft} icon="✏️" color="yellow" />
          <StatCard title="Selesai" value={selesai} icon="⚙️" color="purple" />
        </div>

        {/* ── search & filter bar ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2"><IconSearch /></span>
            <input
              type="text"
              placeholder="Cari nama, tahun ajaran, catatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
            />
          </div>

          {/* tahun ajaran dropdown */}
          <div className="relative">
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              className="appearance-none w-full sm:w-48 pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none cursor-pointer"
            >
              {tahunOptions.map(t => (
                <option key={t} value={t}>{t === 'Semua' ? 'Semua Tahun Ajaran' : t}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><IconChevronDown /></span>
          </div>

          {/* status dropdown */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as RaporStatus | 'Semua')}
              className="appearance-none w-full sm:w-44 pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Draft">Draft</option>
              <option value="Selesai">Selesai</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><IconChevronDown /></span>
          </div>
        </div>

        {/* ── rapor card grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">📋</p>
            <p className="mt-2">Belum ada konfigurasi rapor</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(r => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
                {/* top row: title + status badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-gray-800 text-base leading-snug">{r.nama}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusBadge[r.status]}`}>
                    {r.status}
                  </span>
                </div>

                {/* semester · tahun ajaran */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span className="font-medium text-gray-600">{r.semester}</span>
                  <span className="text-gray-300">·</span>
                  <span>{r.tahunAjaran}</span>
                </div>

                {/* meta info grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Tanggal Cetak</p>
                    <p className="text-gray-700 font-medium">{formatDate(r.tanggalCetak)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">KKM</p>
                    <p className="text-gray-700 font-medium">{r.kkm}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">Batas Input</p>
                    <p className="text-gray-700 font-medium">
                      {formatDate(r.batasInputMulai)} - {formatDate(r.batasInputSelesai)}
                    </p>
                  </div>
                </div>

                {/* fitur tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {r.fitur.peringkat && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                      🏆 Peringkat
                    </span>
                  )}
                  {r.fitur.absensi && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100">
                      📋 Absensi
                    </span>
                  )}
                  {r.fitur.ekskul && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-600 border border-teal-100">
                      🎯 Ekskul
                    </span>
                  )}
                </div>

                {/* footer actions */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-sm">
                    <button onClick={() => openEdit(r)} className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Edit</button>
                    <button onClick={() => openDelete(r)} className="text-red-500 hover:text-red-700 font-medium transition-colors">Hapus</button>
                  </div>
                  <button
                    onClick={() => router.push(`/akademik/pengaturan-rapor/konfigurasi/${r.id}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <IconGear />
                    Konfigurasi Rapor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── modal add/edit ── */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selected ? 'Edit Konfigurasi Rapor' : 'Tambah Konfigurasi Rapor Baru'}
          size="lg"
        >
          <form onSubmit={handleSave}>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800 font-medium">📋 Konfigurasi Rapor</p>
              <p className="text-xs text-green-600 mt-1">Atur nama, semester, tahun ajaran, tanggal cetak, batas input nilai, KKM, dan fitur yang ditampilkan pada rapor.</p>
            </div>

            <FormField label="Nama Rapor" name="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Rapor Tengah Semester Ganjil 2026/2027" required />

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Semester" name="semester" type="select" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value as 'Ganjil' | 'Genap' })} options={[{ value: 'Ganjil', label: 'Ganjil' }, { value: 'Genap', label: 'Genap' }]} required />
              <FormField label="Tahun Ajaran" name="tahunAjaran" value={form.tahunAjaran} onChange={(e) => setForm({ ...form, tahunAjaran: e.target.value })} placeholder="2026/2027" required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="Tanggal Cetak" name="tanggalCetak" type="date" value={form.tanggalCetak} onChange={(e) => setForm({ ...form, tanggalCetak: e.target.value })} required />
              <FormField label="Batas Input Mulai" name="batasInputMulai" type="date" value={form.batasInputMulai} onChange={(e) => setForm({ ...form, batasInputMulai: e.target.value })} required />
              <FormField label="Batas Input Selesai" name="batasInputSelesai" type="date" value={form.batasInputSelesai} onChange={(e) => setForm({ ...form, batasInputSelesai: e.target.value })} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="KKM" name="kkm" type="number" value={form.kkm} onChange={(e) => setForm({ ...form, kkm: +e.target.value })} placeholder="75" required />
              <FormField label="Status" name="status" type="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as RaporStatus })} options={[{ value: 'Aktif', label: '🟢 Aktif' }, { value: 'Draft', label: '📝 Draft' }, { value: 'Selesai', label: '✅ Selesai' }]} required />
            </div>

            {/* fitur toggles */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Fitur Rapor</label>
              <div className="flex flex-wrap gap-3">
                {(['peringkat', 'absensi', 'ekskul'] as const).map(f => (
                  <label key={f} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={form[f]}
                      onChange={(e) => setForm({ ...form, [f]: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{f === 'peringkat' ? '🏆 Peringkat' : f === 'absensi' ? '📋 Absensi' : '🎯 Ekskul'}</span>
                  </label>
                ))}
              </div>
            </div>

            <FormField label="Catatan" name="catatan" type="textarea" value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Catatan tambahan (opsional)" rows={2} />

            <FormActions onCancel={() => setIsModalOpen(false)} submitLabel={selected ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        {/* ── confirm delete ── */}
        <ConfirmDialog
          isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete}
          title="Hapus Konfigurasi Rapor"
          message={`Yakin ingin menghapus konfigurasi "${selected?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmLabel="Hapus" variant="danger"
        />
      </div>
    </MainLayout>
  );
}

export default function PengaturanRaporPage() {
  return <PengaturanRaporContent />;
}
