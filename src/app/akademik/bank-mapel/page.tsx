'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { useRouter } from 'next/navigation';
import { dummyMapelGroups, dummyMapel } from '@/data/akademik';
import { MapelGroup, Mapel } from '@/types';

function BankMapelContent() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) { router.push('/'); return null; }

  // Grup Mapel state
  const [mapelGroups, setMapelGroups] = useState<MapelGroup[]>(dummyMapelGroups);
  const [mapelList, setMapelList] = useState<Mapel[]>(dummyMapel);
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('semua');

  // Grup Mapel modal state
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedMapelGroup, setSelectedMapelGroup] = useState<MapelGroup | null>(null);
  const [groupForm, setGroupForm] = useState({ kode: '', nama: '', deskripsi: '' });

  // Mapel modal state
  const [isMapelModalOpen, setIsMapelModalOpen] = useState(false);
  const [isMapelDeleteOpen, setIsMapelDeleteOpen] = useState(false);
  const [selectedMapel, setSelectedMapel] = useState<Mapel | null>(null);
  const [mapelForm, setMapelForm] = useState({
    kode: '', nama: '', groupId: '', deskripsi: '', semester: 'Ganjil' as 'Ganjil' | 'Genap', urutan: 1,
  });

  // ===== Grup Mapel CRUD =====
  const openAddGroup = () => {
    setSelectedMapelGroup(null);
    setGroupForm({ kode: '', nama: '', deskripsi: '' });
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMapelGroup) {
      setMapelGroups(prev => prev.map(g => g.id === selectedMapelGroup.id ? { ...g, ...groupForm } : g));
    } else {
      const newGroup: MapelGroup = { id: `mg${Date.now()}`, ...groupForm, createdAt: new Date().toISOString().slice(0, 10) };
      setMapelGroups(prev => [newGroup, ...prev]);
      setActiveGroup(newGroup.id);
    }
    setIsGroupModalOpen(false);
  };

  // ===== Mapel CRUD =====
  const openAddMapel = (groupId?: string) => {
    setSelectedMapel(null);
    const targetGroup = groupId || (activeGroup !== 'semua' ? activeGroup : '');
    const nextUrutan = mapelList.filter(m => m.groupId === targetGroup).length + 1;
    setMapelForm({
      kode: '', nama: '', groupId: targetGroup,
      deskripsi: '', semester: 'Ganjil', urutan: nextUrutan,
    });
    setIsMapelModalOpen(true);
  };

  const openEditMapel = (m: Mapel) => {
    setSelectedMapel(m);
    setMapelForm({ kode: m.kode, nama: m.nama, groupId: m.groupId, deskripsi: m.deskripsi, semester: m.semester, urutan: m.urutan });
    setIsMapelModalOpen(true);
  };

  const openDeleteMapel = (m: Mapel) => {
    setSelectedMapel(m);
    setIsMapelDeleteOpen(true);
  };

  const handleSaveMapel = (e: React.FormEvent) => {
    e.preventDefault();
    const group = mapelGroups.find(g => g.id === mapelForm.groupId);
    if (selectedMapel) {
      setMapelList(prev => prev.map(m => m.id === selectedMapel.id ? { ...m, ...mapelForm, groupNama: group?.nama || m.groupNama } : m));
    } else {
      const newMapel: Mapel = { id: `mp${Date.now()}`, ...mapelForm, groupNama: group?.nama || '', createdAt: new Date().toISOString().slice(0, 10) };
      setMapelList(prev => [newMapel, ...prev]);
    }
    setIsMapelModalOpen(false);
  };

  const handleDeleteMapel = () => {
    if (selectedMapel) {
      setMapelList(prev => prev.filter(m => m.id !== selectedMapel.id));
    }
    setIsMapelDeleteOpen(false);
  };

  // ===== Pengaturan Mapel — navigate to dedicated page =====
  const openSetting = (m: Mapel) => {
    router.push(`/akademik/bank-mapel/pengaturan/${m.id}`);
  };

  // Filter
  const groupFiltered = activeGroup === 'semua'
    ? mapelList
    : mapelList.filter(m => m.groupId === activeGroup);

  const filtered = search
    ? groupFiltered.filter(m =>
        [m.kode, m.nama, m.groupNama, m.deskripsi].some(v => v.toLowerCase().includes(search.toLowerCase()))
      )
    : groupFiltered;

  // Sort by urutan
  const sorted = [...filtered].sort((a, b) => a.urutan - b.urutan);

  return (
    <MainLayout>
      <div className="space-y-5">
        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Akademik</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-700 font-medium">Mata Pelajaran</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mata Pelajaran</h1>
              <p className="text-gray-500 mt-0.5 text-sm">Kelola data mata pelajaran sekolah</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={openAddGroup} className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Grup Mata Pelajaran
              </button>
              <button onClick={() => openAddMapel()} className="px-4 py-2.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Mata Pelajaran Baru
              </button>
            </div>
          </div>
        </div>

        {/* Group Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveGroup('semua')}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap border-b-2 -mb-px ${
              activeGroup === 'semua'
                ? 'text-green-700 border-green-600 bg-green-50/50'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Semua
          </button>
          {mapelGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap border-b-2 -mb-px ${
                activeGroup === group.id
                  ? 'text-green-700 border-green-600 bg-green-50/50'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {group.nama}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari Mata Pelajaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>

        {/* Card Grid */}
        {sorted.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-sm">Tidak ada mata pelajaran ditemukan</p>
            <button onClick={() => openAddMapel()} className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 inline-block">
              + Tambah Mata Pelajaran Baru
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((mapel) => {
              return (
                <div key={mapel.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                  {/* Card Body */}
                  <div className="p-5 flex-1">
                    <div className="flex items-start gap-3">
                      {/* Graduation Cap Icon */}
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {/* Title & Meta */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-800 leading-snug">{mapel.nama}</h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                          <span>Kode {mapel.kode}</span>
                          <span className="text-gray-300">·</span>
                          <span>Urutan {mapel.urutan}</span>
                        </p>
                        {/* Action Links */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => openEditMapel(mapel)}
                            className="text-xs text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <span className="text-gray-300 text-xs">|</span>
                          <button
                            onClick={() => openDeleteMapel(mapel)}
                            className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Card Footer - Pengaturan */}
                  <button
                    onClick={() => openSetting(mapel)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium border-t border-green-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Pengaturan Mata Pelajaran
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Grup Mapel */}
        <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} title={selectedMapelGroup ? 'Edit Grup Mata Pelajaran' : 'Tambah Grup Mata Pelajaran'} size="md">
          <form onSubmit={handleSaveGroup}>
            <FormField label="Kode Grup" name="kode" value={groupForm.kode} onChange={(e) => setGroupForm({ ...groupForm, kode: e.target.value })} placeholder="UMUM / AGAMA / MULOK" required />
            <FormField label="Nama Grup" name="nama" value={groupForm.nama} onChange={(e) => setGroupForm({ ...groupForm, nama: e.target.value })} placeholder="Nama grup mata pelajaran" required />
            <FormField label="Deskripsi" name="deskripsi" type="textarea" value={groupForm.deskripsi} onChange={(e) => setGroupForm({ ...groupForm, deskripsi: e.target.value })} placeholder="Deskripsi grup (opsional)" rows={3} />
            <FormActions onCancel={() => setIsGroupModalOpen(false)} submitLabel={selectedMapelGroup ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        {/* Modal Mapel */}
        <Modal isOpen={isMapelModalOpen} onClose={() => setIsMapelModalOpen(false)} title={selectedMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'} size="md">
          <form onSubmit={handleSaveMapel}>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Kode" name="kode" value={mapelForm.kode} onChange={(e) => setMapelForm({ ...mapelForm, kode: e.target.value })} placeholder="PAI / BIN / MTK" required />
              <FormField label="Urutan" name="urutan" type="number" value={mapelForm.urutan} onChange={(e) => setMapelForm({ ...mapelForm, urutan: Number(e.target.value) })} required />
              <FormField label="Semester" name="semester" type="select" value={mapelForm.semester} onChange={(e) => setMapelForm({ ...mapelForm, semester: e.target.value as 'Ganjil' | 'Genap' })} options={[{ value: 'Ganjil', label: 'Ganjil' }, { value: 'Genap', label: 'Genap' }]} required />
            </div>
            <FormField label="Nama Mata Pelajaran" name="nama" value={mapelForm.nama} onChange={(e) => setMapelForm({ ...mapelForm, nama: e.target.value })} placeholder="Nama mata pelajaran" required />
            <FormField label="Grup Mata Pelajaran" name="groupId" type="select" value={mapelForm.groupId} onChange={(e) => setMapelForm({ ...mapelForm, groupId: e.target.value })} options={mapelGroups.map(g => ({ value: g.id, label: g.nama }))} placeholder="Pilih Grup Mata Pelajaran" required />
            <FormField label="Deskripsi" name="deskripsi" type="textarea" value={mapelForm.deskripsi} onChange={(e) => setMapelForm({ ...mapelForm, deskripsi: e.target.value })} placeholder="Deskripsi singkat (opsional)" rows={2} />
            <FormActions onCancel={() => setIsMapelModalOpen(false)} submitLabel={selectedMapel ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        <ConfirmDialog isOpen={isMapelDeleteOpen} onClose={() => setIsMapelDeleteOpen(false)} onConfirm={handleDeleteMapel} title="Hapus Mata Pelajaran" message={`Yakin ingin menghapus mata pelajaran "${selectedMapel?.nama}"? Data yang sudah dihapus tidak dapat dikembalikan.`} confirmLabel="Hapus" variant="danger" />
      </div>
    </MainLayout>
  );
}

export default function BankMapelPage() {
  return <BankMapelContent />;
}
