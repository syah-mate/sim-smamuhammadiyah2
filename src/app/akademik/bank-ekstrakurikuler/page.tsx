'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyEkstraGroups, dummyEkstra, dummyEkstraPeserta, dummyEkstraSettings } from '@/data/akademik';
import { EkstraGroup, Ekstra, EkstraPeserta, EkstraSetting, PesertaStatus } from '@/types';

function BankEkstrakurikulerContent() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  if (!user) return null;

  const [ekstraGroups] = useState<EkstraGroup[]>(dummyEkstraGroups);
  const [ekstraList, setEkstraList] = useState<Ekstra[]>(dummyEkstra);
  const [pesertaList, setPesertaList] = useState<EkstraPeserta[]>(dummyEkstraPeserta);
  const [ekstraSettings, setEkstraSettings] = useState<EkstraSetting[]>(dummyEkstraSettings);
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  // Ekstra modal
  const [isEkstraModalOpen, setIsEkstraModalOpen] = useState(false);
  const [isEkstraDeleteOpen, setIsEkstraDeleteOpen] = useState(false);
  const [selectedEkstra, setSelectedEkstra] = useState<Ekstra | null>(null);
  const [ekstraForm, setEkstraForm] = useState({
    kode: '', nama: '', groupId: '', deskripsi: '',
    hari: 'Senin' as Ekstra['hari'], jam: '', lokasi: '', pembina: '', pembinaId: '', kuota: 30,
  });

  // Pengaturan modal
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [editSettingId, setEditSettingId] = useState<string | null>(null);
  const [settingForm, setSettingForm] = useState({
    semester: 'Ganjil' as 'Ganjil' | 'Genap', tahunAjaran: '2025/2026',
    biayaPendaftaran: 0, biayaBulanan: 0, statusAktif: true,
  });

  // Peserta modal
  const [isPesertaModalOpen, setIsPesertaModalOpen] = useState(false);
  const [isPesertaDeleteOpen, setIsPesertaDeleteOpen] = useState(false);
  const [selectedPeserta, setSelectedPeserta] = useState<EkstraPeserta | null>(null);
  const [pesertaEditMode, setPesertaEditMode] = useState(false);
  const [pesertaForm, setPesertaForm] = useState({
    siswaId: '', siswaNama: '', nis: '', kelas: '', status: 'Aktif' as PesertaStatus,
  });

  // ===== Ekstra CRUD =====
  const openAddEkstra = () => {
    setSelectedEkstra(null);
    setEkstraForm({ kode: '', nama: '', groupId: '', deskripsi: '', hari: 'Senin', jam: '', lokasi: '', pembina: '', pembinaId: '', kuota: 30 });
    setIsEkstraModalOpen(true);
  };

  const openEditEkstra = (ek: Ekstra) => {
    setSelectedEkstra(ek);
    setEkstraForm({ kode: ek.kode, nama: ek.nama, groupId: ek.groupId, deskripsi: ek.deskripsi, hari: ek.hari, jam: ek.jam, lokasi: ek.lokasi, pembina: ek.pembina, pembinaId: ek.pembinaId, kuota: ek.kuota });
    setIsEkstraModalOpen(true);
  };

  const openDeleteEkstra = (ek: Ekstra) => {
    setSelectedEkstra(ek);
    setIsEkstraDeleteOpen(true);
  };

  const handleSaveEkstra = (e: React.FormEvent) => {
    e.preventDefault();
    const group = ekstraGroups.find(g => g.id === ekstraForm.groupId);
    if (selectedEkstra) {
      setEkstraList(prev => prev.map(ek => ek.id === selectedEkstra.id ? { ...ek, ...ekstraForm, groupNama: group?.nama || ek.groupNama } : ek));
    } else {
      const newEkstra: Ekstra = { id: `ek${Date.now()}`, ...ekstraForm, groupNama: group?.nama || '', createdAt: new Date().toISOString().slice(0, 10) };
      setEkstraList(prev => [newEkstra, ...prev]);
    }
    setIsEkstraModalOpen(false);
  };

  const handleDeleteEkstra = () => {
    if (selectedEkstra) setEkstraList(prev => prev.filter(ek => ek.id !== selectedEkstra.id));
    setIsEkstraDeleteOpen(false);
  };

  // ===== Peserta CRUD =====
  const openAddPeserta = () => {
    setSelectedPeserta(null);
    setPesertaEditMode(true);
    setPesertaForm({ siswaId: '', siswaNama: '', nis: '', kelas: '', status: 'Aktif' });
  };

  const openEditPeserta = (peserta: EkstraPeserta) => {
    setSelectedPeserta(peserta);
    setPesertaEditMode(true);
    setPesertaForm({ siswaId: peserta.siswaId, siswaNama: peserta.siswaNama, nis: peserta.nis, kelas: peserta.kelas, status: peserta.status });
  };

  const openDeletePeserta = (peserta: EkstraPeserta) => {
    setSelectedPeserta(peserta);
    setIsPesertaDeleteOpen(true);
  };

  const handleSavePeserta = (ef: React.FormEvent) => {
    ef.preventDefault();
    if (!selectedEkstra) return;
    if (selectedPeserta) {
      setPesertaList(prev => prev.map(p => p.id === selectedPeserta.id ? { ...p, ...pesertaForm } : p));
    } else {
      const newPeserta: EkstraPeserta = {
        id: `ep${Date.now()}`, ekstraId: selectedEkstra.id, ekstraNama: selectedEkstra.nama,
        ...pesertaForm, tanggalDaftar: new Date().toISOString().slice(0, 10),
      };
      setPesertaList(prev => [...prev, newPeserta]);
    }
    setPesertaEditMode(false);
    setSelectedPeserta(null);
  };

  const handleDeletePeserta = () => {
    if (selectedPeserta) setPesertaList(prev => prev.filter(p => p.id !== selectedPeserta.id));
    setIsPesertaDeleteOpen(false);
    setSelectedPeserta(null);
  };

  // ===== Pengaturan Ekstra =====
  const openSetting = (ekstra: Ekstra) => {
    setSelectedEkstra(ekstra);
    const existingSetting = ekstraSettings.find(s => s.ekstraId === ekstra.id);
    if (existingSetting) {
      setEditSettingId(existingSetting.id);
      setSettingForm({ semester: existingSetting.semester, tahunAjaran: existingSetting.tahunAjaran, biayaPendaftaran: existingSetting.biayaPendaftaran, biayaBulanan: existingSetting.biayaBulanan, statusAktif: existingSetting.statusAktif });
    } else {
      setEditSettingId(null);
      setSettingForm({ semester: 'Ganjil', tahunAjaran: '2025/2026', biayaPendaftaran: 0, biayaBulanan: 0, statusAktif: true });
    }
    setIsSettingModalOpen(true);
  };

  const handleSaveSetting = (ef: React.FormEvent) => {
    ef.preventDefault();
    if (!selectedEkstra) return;
    if (editSettingId) {
      setEkstraSettings(prev => prev.map(s => s.id === editSettingId ? { ...s, ...settingForm, ekstraNama: selectedEkstra.nama } : s));
    } else {
      const newSetting: EkstraSetting = {
        id: `es${Date.now()}`, ekstraId: selectedEkstra.id, ekstraNama: selectedEkstra.nama,
        ...settingForm, createdAt: new Date().toISOString().slice(0, 10),
      };
      setEkstraSettings(prev => [...prev, newSetting]);
    }
    setIsSettingModalOpen(false);
  };

  // Filter
  let filtered = ekstraList;
  if (search) {
    filtered = filtered.filter(ek =>
      [ek.nama, ek.pembina, ek.lokasi, ek.groupNama].some(v => v.toLowerCase().includes(search.toLowerCase()))
    );
  }
  if (filterKategori !== 'Semua') filtered = filtered.filter(ek => ek.groupId === filterKategori);
  if (filterStatus !== 'Semua') {
    const isAktif = filterStatus === 'Aktif';
    filtered = filtered.filter(ek => {
      const setting = ekstraSettings.find(s => s.ekstraId === ek.id);
      return setting ? setting.statusAktif === isAktif : !isAktif;
    });
  }

  const totalEkskul = ekstraList.length;
  const totalAktif = ekstraSettings.filter(s => s.statusAktif).length;
  const totalPeserta = pesertaList.length;

  const getPesertaCount = (ekstraId: string) => pesertaList.filter(p => p.ekstraId === ekstraId).length;
  const getSetting = (ekstraId: string) => ekstraSettings.find(s => s.ekstraId === ekstraId);

  const colorPalette = ['bg-green-600', 'bg-blue-600', 'bg-purple-600', 'bg-yellow-600', 'bg-red-500', 'bg-indigo-600', 'bg-teal-600', 'bg-pink-600', 'bg-orange-600'];
  const colorPaletteLight = ['bg-green-50', 'bg-blue-50', 'bg-purple-50', 'bg-yellow-50', 'bg-red-50', 'bg-indigo-50', 'bg-teal-50', 'bg-pink-50', 'bg-orange-50'];
  const colorPaletteBorder = ['border-green-200', 'border-blue-200', 'border-purple-200', 'border-yellow-200', 'border-red-200', 'border-indigo-200', 'border-teal-200', 'border-pink-200', 'border-orange-200'];

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
            <span className="text-gray-700 font-medium">Bank Ekstrakurikuler</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Bank Ekstrakurikuler</h1>
              <p className="text-gray-500 mt-0.5 text-sm">Kelola daftar kegiatan ekstrakurikuler sekolah.</p>
            </div>
            <button onClick={openAddEkstra} className="px-4 py-2.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Ekstrakurikuler
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <span className="text-2xl">🏆</span>
            <p className="text-3xl font-bold text-gray-800 mt-2">{totalEkskul}</p>
            <p className="text-sm text-gray-500 mt-1">Total Ekskul <span className="text-gray-400 text-xs">(Semua Kategori)</span></p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <span className="text-2xl">📅</span>
            <p className="text-3xl font-bold text-gray-800 mt-2">{totalAktif}</p>
            <p className="text-sm text-gray-500 mt-1">Aktif <span className="text-gray-400 text-xs">(Kegiatan Berjalan)</span></p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <span className="text-2xl">👥</span>
            <p className="text-3xl font-bold text-gray-800 mt-2">{totalPeserta}</p>
            <p className="text-sm text-gray-500 mt-1">Total Peserta <span className="text-gray-400 text-xs">(Siswa Terdaftar)</span></p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" placeholder="Cari nama, pembina, tempat..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          <select
            value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="Semua">Semua Kategori</option>
            {ekstraGroups.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
          </select>
          <select
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>

        {/* Card Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">🎯</p>
            <p className="text-sm">Tidak ada ekstrakurikuler ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((ekstra, idx) => {
              const setting = getSetting(ekstra.id);
              const pesertaCount = getPesertaCount(ekstra.id);
              const isActive = setting?.statusAktif ?? false;
              const ci = idx % colorPalette.length;

              return (
                <div key={ekstra.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  {/* Card Body */}
                  <div className="p-5 flex-1">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-full ${colorPalette[ci]} flex items-center justify-center shrink-0`}>
                        <span className="text-white font-bold text-base">{ekstra.nama.charAt(0)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-gray-800 leading-snug">{ekstra.nama}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="default">{ekstra.groupNama}</Badge>
                          <Badge variant={isActive ? 'success' : 'default'}>{isActive ? 'Aktif' : 'Nonaktif'}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{ekstra.hari} {ekstra.jam}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{ekstra.lokasi || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{ekstra.pembina || '-'}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Kuota Terisi</span>
                          <span className="font-medium text-gray-700">{pesertaCount}/{ekstra.kuota}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${pesertaCount >= ekstra.kuota ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min((pesertaCount / ekstra.kuota) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Card Footer */}
                  <div className="flex border-t border-gray-100">
                    <button
                      onClick={() => { setSelectedEkstra(ekstra); setIsPesertaModalOpen(true); }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors border-r border-gray-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      Peserta
                    </button>
                    <button
                      onClick={() => router.push(`/akademik/bank-ekstrakurikuler/pengaturan/${ekstra.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Pengaturan
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Peserta List */}
        <Modal isOpen={isPesertaModalOpen} onClose={() => setIsPesertaModalOpen(false)} title={`Peserta: ${selectedEkstra?.nama || ''}`} size="xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Peserta: <strong>{getPesertaCount(selectedEkstra?.id || '')}</strong> / Kuota: <strong>{selectedEkstra?.kuota || '-'}</strong></p>
              <button onClick={openAddPeserta} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Tambah Peserta</button>
            </div>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs w-10">#</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs">NIS</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs">Nama Siswa</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs">Kelas</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs">Tgl Daftar</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs">Status</th>
                    <th className="px-4 py-2.5 text-right font-semibold text-gray-600 text-xs w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pesertaList.filter(p => p.ekstraId === selectedEkstra?.id).length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-xs">Belum ada peserta terdaftar</td></tr>
                  ) : (
                    pesertaList.filter(p => p.ekstraId === selectedEkstra?.id).map((p, i) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5 text-gray-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-2.5"><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{p.nis}</span></td>
                        <td className="px-4 py-2.5 font-medium text-gray-800 text-sm">{p.siswaNama}</td>
                        <td className="px-4 py-2.5 text-gray-600 text-sm">{p.kelas}</td>
                        <td className="px-4 py-2.5 text-gray-500 text-sm">{p.tanggalDaftar}</td>
                        <td className="px-4 py-2.5"><Badge variant={p.status === 'Aktif' ? 'success' : p.status === 'Nonaktif' ? 'warning' : 'danger'}>{p.status}</Badge></td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => openEditPeserta(p)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => openDeletePeserta(p)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>

        {/* Modal Add/Edit Peserta */}
        <Modal isOpen={pesertaEditMode} onClose={() => { setPesertaEditMode(false); setSelectedPeserta(null); }} title={selectedPeserta ? 'Edit Peserta' : 'Tambah Peserta'} size="md">
          <form onSubmit={handleSavePeserta}>
            <FormField label="NIS" name="nis" value={pesertaForm.nis} onChange={(e) => setPesertaForm({ ...pesertaForm, nis: e.target.value })} placeholder="Nomor Induk Siswa" required />
            <FormField label="Nama Siswa" name="siswaNama" value={pesertaForm.siswaNama} onChange={(e) => setPesertaForm({ ...pesertaForm, siswaNama: e.target.value })} placeholder="Nama lengkap siswa" required />
            <FormField label="Kelas" name="kelas" value={pesertaForm.kelas} onChange={(e) => setPesertaForm({ ...pesertaForm, kelas: e.target.value })} placeholder="X IPA 1" required />
            <FormField label="Status" name="status" type="select" value={pesertaForm.status} onChange={(e) => setPesertaForm({ ...pesertaForm, status: e.target.value as PesertaStatus })} options={[{ value: 'Aktif', label: 'Aktif' }, { value: 'Nonaktif', label: 'Nonaktif' }, { value: 'Mengundurkan Diri', label: 'Mengundurkan Diri' }]} required />
            <FormField label="ID Siswa (Sistem)" name="siswaId" value={pesertaForm.siswaId} onChange={(e) => setPesertaForm({ ...pesertaForm, siswaId: e.target.value })} placeholder="ID dari data siswa (opsional)" />
            <FormActions onCancel={() => { setPesertaEditMode(false); setSelectedPeserta(null); }} submitLabel={selectedPeserta ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        <ConfirmDialog isOpen={isPesertaDeleteOpen} onClose={() => setIsPesertaDeleteOpen(false)} onConfirm={handleDeletePeserta} title="Hapus Peserta" message={`Yakin ingin menghapus peserta "${selectedPeserta?.siswaNama}" dari ekstrakurikuler ini?`} confirmLabel="Hapus" variant="danger" />

        {/* Modal Ekstra */}
        <Modal isOpen={isEkstraModalOpen} onClose={() => setIsEkstraModalOpen(false)} title={selectedEkstra ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler'} size="lg">
          <form onSubmit={handleSaveEkstra}>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Kode" name="kode" value={ekstraForm.kode} onChange={(e) => setEkstraForm({ ...ekstraForm, kode: e.target.value })} placeholder="BASK / PRAM / FUT" required />
              <FormField label="Hari" name="hari" type="select" value={ekstraForm.hari} onChange={(e) => setEkstraForm({ ...ekstraForm, hari: e.target.value as Ekstra['hari'] })} options={['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'].map(d => ({ value: d, label: d }))} required />
              <FormField label="Jam" name="jam" value={ekstraForm.jam} onChange={(e) => setEkstraForm({ ...ekstraForm, jam: e.target.value })} placeholder="13:00-15:00" required />
            </div>
            <FormField label="Nama Ekstrakurikuler" name="nama" value={ekstraForm.nama} onChange={(e) => setEkstraForm({ ...ekstraForm, nama: e.target.value })} placeholder="Nama ekstrakurikuler" required />
            <FormField label="Kategori" name="groupId" type="select" value={ekstraForm.groupId} onChange={(e) => setEkstraForm({ ...ekstraForm, groupId: e.target.value })} options={ekstraGroups.map(g => ({ value: g.id, label: g.nama }))} placeholder="Pilih Kategori" required />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Lokasi" name="lokasi" value={ekstraForm.lokasi} onChange={(e) => setEkstraForm({ ...ekstraForm, lokasi: e.target.value })} placeholder="Ruang / Lapangan" />
              <FormField label="Kuota Peserta" name="kuota" type="number" value={ekstraForm.kuota} onChange={(e) => setEkstraForm({ ...ekstraForm, kuota: Number(e.target.value) })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nama Pembina" name="pembina" value={ekstraForm.pembina} onChange={(e) => setEkstraForm({ ...ekstraForm, pembina: e.target.value })} placeholder="Nama lengkap pembina" />
              <FormField label="ID Pembina" name="pembinaId" value={ekstraForm.pembinaId} onChange={(e) => setEkstraForm({ ...ekstraForm, pembinaId: e.target.value })} placeholder="ID dari data pegawai" />
            </div>
            <FormField label="Deskripsi" name="deskripsi" type="textarea" value={ekstraForm.deskripsi} onChange={(e) => setEkstraForm({ ...ekstraForm, deskripsi: e.target.value })} placeholder="Deskripsi singkat (opsional)" rows={2} />
            <FormActions onCancel={() => setIsEkstraModalOpen(false)} submitLabel={selectedEkstra ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        <ConfirmDialog isOpen={isEkstraDeleteOpen} onClose={() => setIsEkstraDeleteOpen(false)} onConfirm={handleDeleteEkstra} title="Hapus Ekstrakurikuler" message={`Yakin ingin menghapus ekstrakurikuler "${selectedEkstra?.nama}"?`} confirmLabel="Hapus" variant="danger" />

        {/* Modal Pengaturan Ekstra */}
        <Modal isOpen={isSettingModalOpen} onClose={() => setIsSettingModalOpen(false)} title={`Pengaturan: ${selectedEkstra?.nama || ''}`} size="md">
          <form onSubmit={handleSaveSetting}>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-800 font-medium">ℹ️ Pengaturan Ekstrakurikuler</p>
              <p className="text-xs text-purple-600 mt-1">Atur semester, tahun ajaran, biaya, dan status aktif untuk <strong>{selectedEkstra?.nama}</strong>.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Semester" name="semester" type="select" value={settingForm.semester} onChange={(e) => setSettingForm({ ...settingForm, semester: e.target.value as 'Ganjil' | 'Genap' })} options={[{ value: 'Ganjil', label: 'Ganjil' }, { value: 'Genap', label: 'Genap' }]} required />
              <FormField label="Tahun Ajaran" name="tahunAjaran" value={settingForm.tahunAjaran} onChange={(e) => setSettingForm({ ...settingForm, tahunAjaran: e.target.value })} placeholder="2025/2026" required />
              <FormField label="Status" name="statusAktif" type="select" value={settingForm.statusAktif ? 'true' : 'false'} onChange={(e) => setSettingForm({ ...settingForm, statusAktif: e.target.value === 'true' })} options={[{ value: 'true', label: 'Aktif' }, { value: 'false', label: 'Nonaktif' }]} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Biaya Pendaftaran (Rp)" name="biayaPendaftaran" type="number" value={settingForm.biayaPendaftaran} onChange={(e) => setSettingForm({ ...settingForm, biayaPendaftaran: Number(e.target.value) })} placeholder="0" />
              <FormField label="Biaya Bulanan (Rp)" name="biayaBulanan" type="number" value={settingForm.biayaBulanan} onChange={(e) => setSettingForm({ ...settingForm, biayaBulanan: Number(e.target.value) })} placeholder="0" />
            </div>
            <FormActions onCancel={() => setIsSettingModalOpen(false)} submitLabel={editSettingId ? 'Update Pengaturan' : 'Simpan Pengaturan'} />
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
}

export default function BankEkstrakurikulerPage() {
  return <BankEkstrakurikulerContent />;
}
