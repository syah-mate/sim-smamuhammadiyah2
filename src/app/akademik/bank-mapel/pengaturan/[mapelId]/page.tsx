'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { Badge } from '@/components/ui/Badge';
import {
  dummyMapel,
  dummyKelasPengajar, dummyKompetensi, dummyKelasPredikat,
} from '@/data/akademik';
import {
  KelasPengajar, PengajarInfo,
  Kompetensi, IndikatorItem,
  KelasPredikat, PredikatItem,
} from '@/types';

type TabKey = 'pengajar' | 'kompetensi' | 'predikat';

function PengaturanMapelContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const mapelId = params?.mapelId as string;

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  if (!user) return null;

  const mapel = dummyMapel.find(m => m.id === mapelId);
  if (!mapel) {
    return (
      <MainLayout>
        <div className="text-center py-20 text-gray-400">Mata pelajaran tidak ditemukan.</div>
      </MainLayout>
    );
  }

  const [activeTab, setActiveTab] = useState<TabKey>('pengajar');
  const [tahunAjaran, setTahunAjaran] = useState('2026/2027');

  // --- Pengajar state ---
  const [kelasPengajarList, setKelasPengajarList] = useState<KelasPengajar[]>(
    dummyKelasPengajar.filter(kp => kp.mapelId === mapelId)
  );
  const [isPengajarModalOpen, setIsPengajarModalOpen] = useState(false);
  const [selectedKelasPengajar, setSelectedKelasPengajar] = useState<KelasPengajar | null>(null);
  const [pengajarForm, setPengajarForm] = useState<PengajarInfo[]>([
    { id: '', pegawaiId: '', nama: '', email: '', noTelp: '' },
  ]);

  // --- Kompetensi state ---
  const [kompetensiList, setKompetensiList] = useState<Kompetensi[]>(
    dummyKompetensi.filter(k => k.mapelId === mapelId)
  );
  const [isKompetensiModalOpen, setIsKompetensiModalOpen] = useState(false);
  const [isIndikatorModalOpen, setIsIndikatorModalOpen] = useState(false);
  const [isKompetensiDeleteOpen, setIsKompetensiDeleteOpen] = useState(false);
  const [selectedKompetensi, setSelectedKompetensi] = useState<Kompetensi | null>(null);
  const [kompetensiForm, setKompetensiForm] = useState({ kode: '', nama: '', skalaMin: 0, skalaMax: 100 });
  const [indikatorForm, setIndikatorForm] = useState({ kode: '', nama: '' });
  const [selectedKompetensiIndikator, setSelectedKompetensiIndikator] = useState<Kompetensi | null>(null);

  // --- Predikat & KKM state ---
  const [kelasPredikatList, setKelasPredikatList] = useState<KelasPredikat[]>(
    dummyKelasPredikat.filter(kp => kp.mapelId === mapelId)
  );
  const [isKkmModalOpen, setIsKkmModalOpen] = useState(false);
  const [isPredikatModalOpen, setIsPredikatModalOpen] = useState(false);
  const [isPredikatDeleteOpen, setIsPredikatDeleteOpen] = useState(false);
  const [selectedKelasPredikat, setSelectedKelasPredikat] = useState<KelasPredikat | null>(null);
  const [kkmForm, setKkmForm] = useState(75);
  const [selectedPredikatItem, setSelectedPredikatItem] = useState<PredikatItem | null>(null);
  const [predikatForm, setPredikatForm] = useState({ nama: '', deskripsi: '', nilaiMin: 0, nilaiMax: 100, alias: '' });

  // ==================== TAB: PENGAJAR ====================
  const openPengajarModal = (kp: KelasPengajar) => {
    setSelectedKelasPengajar(kp);
    setPengajarForm(kp.pengajar.length > 0 ? [...kp.pengajar] : [{ id: '', pegawaiId: '', nama: '', email: '', noTelp: '' }]);
    setIsPengajarModalOpen(true);
  };

  const addPengajarRow = () => {
    setPengajarForm(prev => [...prev, { id: '', pegawaiId: '', nama: '', email: '', noTelp: '' }]);
  };

  const removePengajarRow = (idx: number) => {
    setPengajarForm(prev => prev.filter((_, i) => i !== idx));
  };

  const updatePengajarRow = (idx: number, field: keyof PengajarInfo, value: string) => {
    setPengajarForm(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const handleSavePengajar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKelasPengajar) return;
    const updated = pengajarForm.map((p, i) => ({
      ...p,
      id: p.id || `pj${Date.now()}${i}`,
    }));
    setKelasPengajarList(prev =>
      prev.map(kp => kp.id === selectedKelasPengajar.id ? { ...kp, pengajar: updated } : kp)
    );
    setIsPengajarModalOpen(false);
  };

  // ==================== TAB: KOMPETENSI ====================
  const openAddKompetensi = () => {
    setSelectedKompetensi(null);
    setKompetensiForm({ kode: '', nama: '', skalaMin: 0, skalaMax: 100 });
    setIsKompetensiModalOpen(true);
  };

  const openEditKompetensi = (k: Kompetensi) => {
    setSelectedKompetensi(k);
    setKompetensiForm({ kode: k.kode, nama: k.nama, skalaMin: k.skalaMin, skalaMax: k.skalaMax });
    setIsKompetensiModalOpen(true);
  };

  const handleSaveKompetensi = (ef: React.FormEvent) => {
    ef.preventDefault();
    if (selectedKompetensi) {
      setKompetensiList(prev => prev.map(k => k.id === selectedKompetensi.id ? { ...k, ...kompetensiForm } : k));
    } else {
      const newK: Kompetensi = {
        id: `komp${Date.now()}`, mapelId: mapelId, mapelNama: mapel.nama,
        ...kompetensiForm, indikator: [], isArchived: false,
        tahunAjaran, createdAt: new Date().toISOString().slice(0, 10),
      };
      setKompetensiList(prev => [...prev, newK]);
    }
    setIsKompetensiModalOpen(false);
  };

  const openDeleteKompetensi = (k: Kompetensi) => {
    setSelectedKompetensi(k);
    setIsKompetensiDeleteOpen(true);
  };

  const handleDeleteKompetensi = () => {
    if (selectedKompetensi) setKompetensiList(prev => prev.filter(k => k.id !== selectedKompetensi.id));
    setIsKompetensiDeleteOpen(false);
  };

  const handleArchiveKompetensi = (k: Kompetensi) => {
    setKompetensiList(prev => prev.map(kk => kk.id === k.id ? { ...kk, isArchived: !kk.isArchived } : kk));
  };

  const handleDuplicateKompetensi = (k: Kompetensi) => {
    const dup: Kompetensi = {
      ...k, id: `komp${Date.now()}`, kode: k.kode + ' (Copy)',
      indikator: k.indikator.map(ind => ({ ...ind, id: `ind${Date.now()}${Math.random()}`, kompetensiId: `komp${Date.now()}` })),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setKompetensiList(prev => [...prev, dup]);
  };

  // Indikator
  const openAddIndikator = (k: Kompetensi) => {
    setSelectedKompetensiIndikator(k);
    setIndikatorForm({ kode: '', nama: '' });
    setIsIndikatorModalOpen(true);
  };

  const handleSaveIndikator = (ef: React.FormEvent) => {
    ef.preventDefault();
    if (!selectedKompetensiIndikator) return;
    const newInd: IndikatorItem = {
      id: `ind${Date.now()}`, kompetensiId: selectedKompetensiIndikator.id,
      ...indikatorForm,
    };
    setKompetensiList(prev =>
      prev.map(k => k.id === selectedKompetensiIndikator.id
        ? { ...k, indikator: [...k.indikator, newInd] }
        : k
      )
    );
    setIsIndikatorModalOpen(false);
  };

  const deleteIndikator = (kompId: string, indId: string) => {
    setKompetensiList(prev =>
      prev.map(k => k.id === kompId
        ? { ...k, indikator: k.indikator.filter(ind => ind.id !== indId) }
        : k
      )
    );
  };

  // ==================== TAB: PREDIKAT & KKM ====================
  const openKkmModal = (kp: KelasPredikat) => {
    setSelectedKelasPredikat(kp);
    setKkmForm(kp.kkm);
    setIsKkmModalOpen(true);
  };

  const handleSaveKkm = (ef: React.FormEvent) => {
    ef.preventDefault();
    if (!selectedKelasPredikat) return;
    setKelasPredikatList(prev =>
      prev.map(kp => kp.id === selectedKelasPredikat.id ? { ...kp, kkm: kkmForm } : kp)
    );
    setIsKkmModalOpen(false);
  };

  const handleCopyPredikat = (source: KelasPredikat) => {
    const predikatCopy = source.predikat.map(p => ({ ...p, id: `pr${Date.now()}${Math.random()}` }));
    setKelasPredikatList(prev =>
      prev.map(kp => kp.id !== source.id ? { ...kp, predikat: [...kp.predikat, ...predikatCopy] } : kp)
    );
  };

  const openAddPredikat = (kp: KelasPredikat) => {
    setSelectedKelasPredikat(kp);
    setSelectedPredikatItem(null);
    setPredikatForm({ nama: '', deskripsi: '', nilaiMin: 0, nilaiMax: 100, alias: '' });
    setIsPredikatModalOpen(true);
  };

  const openEditPredikat = (kp: KelasPredikat, pr: PredikatItem) => {
    setSelectedKelasPredikat(kp);
    setSelectedPredikatItem(pr);
    setPredikatForm({ nama: pr.nama, deskripsi: pr.deskripsi, nilaiMin: pr.nilaiMin, nilaiMax: pr.nilaiMax, alias: pr.alias });
    setIsPredikatModalOpen(true);
  };

  const openDeletePredikat = (kp: KelasPredikat, pr: PredikatItem) => {
    setSelectedKelasPredikat(kp);
    setSelectedPredikatItem(pr);
    setIsPredikatDeleteOpen(true);
  };

  const handleSavePredikat = (ef: React.FormEvent) => {
    ef.preventDefault();
    if (!selectedKelasPredikat) return;
    if (selectedPredikatItem) {
      setKelasPredikatList(prev =>
        prev.map(kp => kp.id === selectedKelasPredikat.id
          ? { ...kp, predikat: kp.predikat.map(p => p.id === selectedPredikatItem.id ? { ...p, ...predikatForm } : p) }
          : kp
        )
      );
    } else {
      const newPr: PredikatItem = {
        id: `pr${Date.now()}`, kelasPredikatId: selectedKelasPredikat.id, ...predikatForm,
      };
      setKelasPredikatList(prev =>
        prev.map(kp => kp.id === selectedKelasPredikat.id
          ? { ...kp, predikat: [...kp.predikat, newPr] }
          : kp
        )
      );
    }
    setIsPredikatModalOpen(false);
  };

  const handleDeletePredikat = () => {
    if (!selectedKelasPredikat || !selectedPredikatItem) return;
    setKelasPredikatList(prev =>
      prev.map(kp => kp.id === selectedKelasPredikat.id
        ? { ...kp, predikat: kp.predikat.filter(p => p.id !== selectedPredikatItem.id) }
        : kp
      )
    );
    setIsPredikatDeleteOpen(false);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'pengajar', label: 'Pengajar' },
    { key: 'kompetensi', label: 'Kompetensi dan Indikator' },
    { key: 'predikat', label: 'Predikat dan KKM' },
  ];

  return (
    <MainLayout>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => router.push('/akademik/bank-mapel')} className="hover:text-blue-600 transition-colors">Akademik</button>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <button onClick={() => router.push('/akademik/bank-mapel')} className="hover:text-blue-600 transition-colors">Mata Pelajaran</button>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-700 font-medium">Pengaturan</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 uppercase">{mapel.nama}</h1>
            <p className="text-gray-500 mt-0.5 text-sm">Pengaturan mata pelajaran {mapel.nama.toLowerCase()}</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={tahunAjaran}
              onChange={(e) => setTahunAjaran(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option>2025/2026</option>
              <option>2026/2027</option>
              <option>2027/2028</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-px">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'text-green-700 border-green-600 bg-green-50/50'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ==================== TAB CONTENT: PENGAJAR ==================== */}
        {activeTab === 'pengajar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                Salin ke Tahun Ajaran Lain
              </button>
            </div>
            <div className="space-y-3">
              {kelasPengajarList.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">Belum ada data kelas untuk mata pelajaran ini.</div>
              )}
              {kelasPengajarList.map(kp => (
                <div key={kp.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-800">{kp.kelasNama}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{kp.labelKelas}</span>
                    </div>
                    <button
                      onClick={() => openPengajarModal(kp)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                        kp.pengajar.length > 0
                          ? 'border border-blue-300 text-blue-700 hover:bg-blue-50'
                          : 'border border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {kp.pengajar.length > 0 ? 'Ubah Pengajar' : 'Set Pengajar'}
                    </button>
                  </div>
                  {kp.pengajar.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Belum ada pengajar ditetapkan</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {kp.pengajar.map(p => (
                        <div key={p.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">{p.nama}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{p.email}</p>
                          <p className="text-xs text-gray-400">{p.noTelp}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT: KOMPETENSI DAN INDIKATOR ==================== */}
        {activeTab === 'kompetensi' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Template Kompetensi</h3>
                <p className="text-xs text-gray-500 mt-0.5">Nama Subject: {mapel.nama.toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 text-xs border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">Arsip Kompetensi</button>
                <button className="px-3 py-2 text-xs border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">Salin ke TA Lain</button>
                <button className="px-3 py-2 text-xs border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">Impor Capaian Pembelajaran</button>
                <button onClick={openAddKompetensi} className="px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">+ Tambah Kompetensi</button>
              </div>
            </div>

            {/* Kompetensi Cards */}
            <div className="space-y-3">
              {kompetensiList.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">Belum ada template kompetensi.</div>
              )}
              {kompetensiList.map(k => (
                <div key={k.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${k.isArchived ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}>
                  {/* Card Header */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800">{k.nama} <span className="text-xs text-gray-500 font-normal">({k.kode})</span></h4>
                          <p className="text-xs text-gray-500 mt-0.5">Kode: {k.kode} · Skala Nilai {k.skalaMin}-{k.skalaMax}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDuplicateKompetensi(k)} className="px-2.5 py-1.5 text-xs border border-purple-300 text-purple-600 rounded-md hover:bg-purple-50 transition-colors">Duplikat Template</button>
                        <button onClick={() => openEditKompetensi(k)} className="px-2.5 py-1.5 text-xs border border-green-300 text-green-600 rounded-md hover:bg-green-50 transition-colors">Edit Template</button>
                        <button onClick={() => handleArchiveKompetensi(k)} className={`px-2.5 py-1.5 text-xs border rounded-md transition-colors ${k.isArchived ? 'border-green-300 text-green-600 hover:bg-green-50' : 'border-red-300 text-red-600 hover:bg-red-50'}`}>
                          {k.isArchived ? 'Aktifkan' : 'Arsipkan Template'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Indicators */}
                  <div className="border-t border-gray-100 px-5 py-3">
                    <p className="text-xs font-semibold text-gray-700 uppercase mb-2">INDIKATOR ({k.indikator.length})</p>
                    {k.indikator.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">Belum ada indikator</p>
                    ) : (
                      <div className="space-y-1.5 mb-3">
                        {k.indikator.map(ind => (
                          <div key={ind.id} className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-gray-500">{ind.kode}</span>
                              <span className="text-sm text-gray-700">{ind.nama}</span>
                            </div>
                            <button onClick={() => deleteIndikator(k.id, ind.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => openAddIndikator(k)} className="w-full py-2.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg border border-green-200 transition-colors">
                      + Tambah Indikator
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT: PREDIKAT DAN KKM ==================== */}
        {activeTab === 'predikat' && (
          <div className="space-y-4">
            {kelasPredikatList.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">Belum ada data kelas.</div>
            )}
            {kelasPredikatList.map(kp => (
              <div key={kp.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* KKM Header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-gray-800">{kp.kelasNama}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{kp.labelKelas}</span>
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-green-700">KKM: {kp.kkm}</span>
                      <button onClick={() => openKkmModal(kp)} className="text-green-600 hover:text-green-800 ml-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button onClick={() => handleCopyPredikat(kp)} className="px-3 py-2 text-xs border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    Salin Predikat
                  </button>
                </div>

                {/* Predikat Table */}
                <div className="p-5">
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs">Nama</th>
                          <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs">Deskripsi</th>
                          <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs">Nilai Maks</th>
                          <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs">Nilai Min</th>
                          <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs">Alias</th>
                          <th className="px-4 py-2.5 text-right font-semibold text-gray-600 text-xs w-16">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {kp.predikat.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-gray-400 text-xs">Belum ada predikat</td>
                          </tr>
                        ) : (
                          kp.predikat.map(pr => (
                            <tr key={pr.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-2.5 font-medium text-gray-800">{pr.nama}</td>
                              <td className="px-4 py-2.5 text-gray-600">{pr.deskripsi}</td>
                              <td className="px-4 py-2.5 text-gray-600">{pr.nilaiMax}</td>
                              <td className="px-4 py-2.5 text-gray-600">{pr.nilaiMin}</td>
                              <td className="px-4 py-2.5 text-gray-500">{pr.alias || '-'}</td>
                              <td className="px-4 py-2.5 text-right">
                                <div className="flex justify-end gap-1">
                                  <button onClick={() => openEditPredikat(kp, pr)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button onClick={() => openDeletePredikat(kp, pr)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={() => openAddPredikat(kp)} className="mt-3 text-xs text-gray-500 hover:text-green-600 transition-colors flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Predikat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== MODALS ==================== */}

        {/* Modal Ubah/Set Pengajar */}
        <Modal isOpen={isPengajarModalOpen} onClose={() => setIsPengajarModalOpen(false)} title={`Pengajar - ${selectedKelasPengajar?.kelasNama || ''}`} size="lg">
          <form onSubmit={handleSavePengajar}>
            <p className="text-sm text-gray-500 mb-4">Atur guru pengajar untuk kelas ini. Anda dapat menambahkan lebih dari satu pengajar.</p>
            {pengajarForm.map((p, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-600">Pengajar {idx + 1}</span>
                  {pengajarForm.length > 1 && (
                    <button type="button" onClick={() => removePengajarRow(idx)} className="text-xs text-red-500 hover:text-red-700">Hapus</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Nama" name={`nama-${idx}`} value={p.nama} onChange={(e) => updatePengajarRow(idx, 'nama', e.target.value)} placeholder="Nama pengajar" required />
                  <FormField label="Email" name={`email-${idx}`} value={p.email} onChange={(e) => updatePengajarRow(idx, 'email', e.target.value)} placeholder="Email" />
                  <FormField label="No. Telepon" name={`telp-${idx}`} value={p.noTelp} onChange={(e) => updatePengajarRow(idx, 'noTelp', e.target.value)} placeholder="No telepon" />
                  <FormField label="ID Pegawai" name={`pegawai-${idx}`} value={p.pegawaiId} onChange={(e) => updatePengajarRow(idx, 'pegawaiId', e.target.value)} placeholder="ID dari data pegawai" />
                </div>
              </div>
            ))}
            <button type="button" onClick={addPengajarRow} className="text-sm text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Pengajar
            </button>
            <FormActions onCancel={() => setIsPengajarModalOpen(false)} submitLabel="Simpan Pengajar" />
          </form>
        </Modal>

        {/* Modal Kompetensi */}
        <Modal isOpen={isKompetensiModalOpen} onClose={() => setIsKompetensiModalOpen(false)} title={selectedKompetensi ? 'Edit Kompetensi' : 'Tambah Kompetensi'} size="md">
          <form onSubmit={handleSaveKompetensi}>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Kode" name="kode" value={kompetensiForm.kode} onChange={(e) => setKompetensiForm({ ...kompetensiForm, kode: e.target.value })} placeholder="TP 1" required />
              <FormField label="Skala Maks" name="skalaMax" type="number" value={kompetensiForm.skalaMax} onChange={(e) => setKompetensiForm({ ...kompetensiForm, skalaMax: Number(e.target.value) })} required />
            </div>
            <FormField label="Nama Kompetensi" name="nama" value={kompetensiForm.nama} onChange={(e) => setKompetensiForm({ ...kompetensiForm, nama: e.target.value })} placeholder="Nama kompetensi" required />
            <FormField label="Skala Min" name="skalaMin" type="number" value={kompetensiForm.skalaMin} onChange={(e) => setKompetensiForm({ ...kompetensiForm, skalaMin: Number(e.target.value) })} required />
            <FormActions onCancel={() => setIsKompetensiModalOpen(false)} submitLabel={selectedKompetensi ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        <ConfirmDialog isOpen={isKompetensiDeleteOpen} onClose={() => setIsKompetensiDeleteOpen(false)} onConfirm={handleDeleteKompetensi} title="Hapus Kompetensi" message={`Yakin ingin menghapus kompetensi "${selectedKompetensi?.nama}"?`} confirmLabel="Hapus" variant="danger" />

        {/* Modal Indikator */}
        <Modal isOpen={isIndikatorModalOpen} onClose={() => setIsIndikatorModalOpen(false)} title="Tambah Indikator" size="md">
          <form onSubmit={handleSaveIndikator}>
            <FormField label="Kode Indikator" name="kode" value={indikatorForm.kode} onChange={(e) => setIndikatorForm({ ...indikatorForm, kode: e.target.value })} placeholder="TP 1.1" required />
            <FormField label="Nama Indikator" name="nama" value={indikatorForm.nama} onChange={(e) => setIndikatorForm({ ...indikatorForm, nama: e.target.value })} placeholder="Nama indikator" required />
            <FormActions onCancel={() => setIsIndikatorModalOpen(false)} submitLabel="Simpan" />
          </form>
        </Modal>

        {/* Modal KKM */}
        <Modal isOpen={isKkmModalOpen} onClose={() => setIsKkmModalOpen(false)} title={`Atur KKM - ${selectedKelasPredikat?.kelasNama || ''}`} size="sm">
          <form onSubmit={handleSaveKkm}>
            <FormField label="Nilai KKM" name="kkm" type="number" value={kkmForm} onChange={(e) => setKkmForm(Number(e.target.value))} placeholder="75" required />
            <FormActions onCancel={() => setIsKkmModalOpen(false)} submitLabel="Simpan" />
          </form>
        </Modal>

        {/* Modal Predikat */}
        <Modal isOpen={isPredikatModalOpen} onClose={() => setIsPredikatModalOpen(false)} title={selectedPredikatItem ? 'Edit Predikat' : 'Tambah Predikat'} size="md">
          <form onSubmit={handleSavePredikat}>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nama" name="nama" value={predikatForm.nama} onChange={(e) => setPredikatForm({ ...predikatForm, nama: e.target.value })} placeholder="A / B / C" required />
              <FormField label="Alias" name="alias" value={predikatForm.alias} onChange={(e) => setPredikatForm({ ...predikatForm, alias: e.target.value })} placeholder="Alias (opsional)" />
              <FormField label="Nilai Maks" name="nilaiMax" type="number" value={predikatForm.nilaiMax} onChange={(e) => setPredikatForm({ ...predikatForm, nilaiMax: Number(e.target.value) })} required />
              <FormField label="Nilai Min" name="nilaiMin" type="number" value={predikatForm.nilaiMin} onChange={(e) => setPredikatForm({ ...predikatForm, nilaiMin: Number(e.target.value) })} required />
            </div>
            <FormField label="Deskripsi" name="deskripsi" value={predikatForm.deskripsi} onChange={(e) => setPredikatForm({ ...predikatForm, deskripsi: e.target.value })} placeholder="Sangat Baik / Baik / Cukup" required />
            <FormActions onCancel={() => setIsPredikatModalOpen(false)} submitLabel={selectedPredikatItem ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        <ConfirmDialog isOpen={isPredikatDeleteOpen} onClose={() => setIsPredikatDeleteOpen(false)} onConfirm={handleDeletePredikat} title="Hapus Predikat" message={`Yakin ingin menghapus predikat "${selectedPredikatItem?.nama}"?`} confirmLabel="Hapus" variant="danger" />
      </div>
    </MainLayout>
  );
}

export default function PengaturanMapelPage() {
  return <PengaturanMapelContent />;
}
