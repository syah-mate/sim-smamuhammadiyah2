'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { Badge } from '@/components/ui/Badge';
import {
  dummyEkstra, dummyEkstraGroups, dummyEkstraSettings,
  dummyEkstraKompetensi, dummyEkstraPredikat,
} from '@/data/akademik';
import {
  EkstraHari,
  EkstraKompetensi, EkstraIndikatorItem,
  EkstraPredikatSetting, EkstraPredikatItem,
} from '@/types';

type TabKey = 'informasi' | 'kompetensi' | 'predikat';

// Pool pembina dari employee + tambahan
interface PembinaOption {
  id: string;
  pegawaiId: string;
  nama: string;
  email: string;
  noTelp: string;
}

const pembinaPool: PembinaOption[] = [
  { id: 'pb1', pegawaiId: 'emp20', nama: 'indra aang', email: 'indra@gmail.com', noTelp: '0887712398384' },
  { id: 'pb2', pegawaiId: 'emp21', nama: "Amalia Solihatil Afiyah", email: 'amalia@gmail.com', noTelp: '081805303253' },
  { id: 'pb3', pegawaiId: 'emp22', nama: 'Abdullah', email: 'abdullah@gmail.com', noTelp: '081111222333' },
  { id: 'pb4', pegawaiId: 'emp23', nama: 'Abdullah Mujadid', email: 'mujadid@gmail.com', noTelp: '081222333444' },
  { id: 'pb5', pegawaiId: 'emp24', nama: 'Abdhushabur Marzuq, S.Pd.I.', email: 'marzuq@gmail.com', noTelp: '081333444555' },
  { id: 'pb6', pegawaiId: 'emp25', nama: 'Achmad Novi Ubaidillah', email: 'novi@gmail.com', noTelp: '081444555666' },
  { id: 'pb7', pegawaiId: 'emp26', nama: 'Ahmad Fauzi, M.Si.', email: 'fauzi@gmail.com', noTelp: '085678901234' },
  { id: 'pb8', pegawaiId: 'emp27', nama: 'Rudi Hartono, S.Pd.', email: 'rudi@gmail.com', noTelp: '084444444444' },
  { id: 'pb9', pegawaiId: 'emp28', nama: 'Dewi Sartika, M.Pd.', email: 'dewi@gmail.com', noTelp: '082345678901' },
  { id: 'pb10', pegawaiId: 'emp29', nama: 'Ratna Kusuma, S.Pd.', email: 'ratna@gmail.com', noTelp: '087890123456' },
  { id: 'pb11', pegawaiId: 'emp30', nama: 'Hendra Gunawan, S.Pd.', email: 'hendra@gmail.com', noTelp: '083456789012' },
  { id: 'pb12', pegawaiId: 'emp31', nama: 'Sri Wahyuni, M.Pd.', email: 'sri@gmail.com', noTelp: '086789012345' },
];

const hariList: EkstraHari[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

function PengaturanEkstraContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const ekstraId = params?.ekstraId as string;

  const ekstra = dummyEkstra.find(e => e.id === ekstraId);

  const [activeTab, setActiveTab] = useState<TabKey>('informasi');
  const [tahunAjaran, setTahunAjaran] = useState('2026/2027');

  // --- Tab 1: Informasi & Pembina ---
  const ekstraSetting = dummyEkstraSettings.find(s => s.ekstraId === ekstraId);
  const [infoForm, setInfoForm] = useState({
    nama: ekstra?.nama ?? '',
    groupId: ekstra?.groupId ?? '',
    statusAktif: ekstraSetting?.statusAktif ?? true,
    lokasi: ekstra?.lokasi ?? '',
    kuota: ekstra?.kuota ?? 0,
    deskripsi: ekstra?.deskripsi ?? '',
    hari: ekstra?.hari ?? 'Senin',
    jamMulai: ekstra?.jam?.split('-')[0] || '',
    jamSelesai: ekstra?.jam?.split('-')[1] || '',
  });
  const [selectedPembina, setSelectedPembina] = useState<string[]>(ekstra?.pembinaId ? [ekstra.pembinaId] : []);
  const [infoSaved, setInfoSaved] = useState(false);

  // --- Tab 2: Kompetensi & Indikator ---
  const [kompetensiList, setKompetensiList] = useState<EkstraKompetensi[]>(
    dummyEkstraKompetensi.filter(k => k.ekstraId === ekstraId)
  );
  const [isKompetensiModalOpen, setIsKompetensiModalOpen] = useState(false);
  const [isIndikatorModalOpen, setIsIndikatorModalOpen] = useState(false);
  const [isKompetensiDeleteOpen, setIsKompetensiDeleteOpen] = useState(false);
  const [selectedKompetensi, setSelectedKompetensi] = useState<EkstraKompetensi | null>(null);
  const [kompetensiForm, setKompetensiForm] = useState({ kode: '', nama: '', skalaMin: 0, skalaMax: 100 });
  const [indikatorForm, setIndikatorForm] = useState({ kode: '', nama: '' });
  const [selectedKompForIndikator, setSelectedKompForIndikator] = useState<EkstraKompetensi | null>(null);

  // --- Tab 3: Predikat & KKM ---
  const existingPredikat = dummyEkstraPredikat.find(p => p.ekstraId === ekstraId);
  const [predikatSetting, setPredikatSetting] = useState<EkstraPredikatSetting>(
    existingPredikat || {
      id: `eps_${ekstraId}`, ekstraId, ekstraNama: ekstra?.nama ?? '',
      tahunAjaran: '2026/2027', kkm: 70, predikat: [],
    }
  );
  const [isKkmModalOpen, setIsKkmModalOpen] = useState(false);
  const [isPredikatModalOpen, setIsPredikatModalOpen] = useState(false);
  const [isPredikatDeleteOpen, setIsPredikatDeleteOpen] = useState(false);
  const [kkmForm, setKkmForm] = useState(predikatSetting.kkm);
  const [selectedPredikatItem, setSelectedPredikatItem] = useState<EkstraPredikatItem | null>(null);
  const [predikatForm, setPredikatForm] = useState({ nama: '', deskripsi: '', nilaiMin: 0, nilaiMax: 100, alias: '' });

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  if (!user) return null;

  if (!ekstra) {
    return (
      <MainLayout>
        <div className="text-center py-20 text-gray-400">Ekstrakurikuler tidak ditemukan.</div>
      </MainLayout>
    );
  }

  const togglePembina = (pegawaiId: string) => {
    setSelectedPembina(prev =>
      prev.includes(pegawaiId) ? prev.filter(id => id !== pegawaiId) : [...prev, pegawaiId]
    );
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would persist to backend
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 2500);
  };

  const openAddKompetensi = () => {
    setSelectedKompetensi(null);
    setKompetensiForm({ kode: '', nama: '', skalaMin: 0, skalaMax: 100 });
    setIsKompetensiModalOpen(true);
  };

  const openEditKompetensi = (k: EkstraKompetensi) => {
    setSelectedKompetensi(k);
    setKompetensiForm({ kode: k.kode, nama: k.nama, skalaMin: k.skalaMin, skalaMax: k.skalaMax });
    setIsKompetensiModalOpen(true);
  };

  const handleSaveKompetensi = (ef: React.FormEvent) => {
    ef.preventDefault();
    if (selectedKompetensi) {
      setKompetensiList(prev => prev.map(k => k.id === selectedKompetensi.id ? { ...k, ...kompetensiForm } : k));
    } else {
      const newK: EkstraKompetensi = {
        id: `ekomp${Date.now()}`, ekstraId, ekstraNama: ekstra.nama,
        ...kompetensiForm, indikator: [], isArchived: false,
        tahunAjaran, createdAt: new Date().toISOString().slice(0, 10),
      };
      setKompetensiList(prev => [...prev, newK]);
    }
    setIsKompetensiModalOpen(false);
  };

  const openDeleteKompetensi = (k: EkstraKompetensi) => {
    setSelectedKompetensi(k);
    setIsKompetensiDeleteOpen(true);
  };

  const handleDeleteKompetensi = () => {
    if (selectedKompetensi) setKompetensiList(prev => prev.filter(k => k.id !== selectedKompetensi.id));
    setIsKompetensiDeleteOpen(false);
  };

  const openAddIndikator = (k: EkstraKompetensi) => {
    setSelectedKompForIndikator(k);
    setIndikatorForm({ kode: '', nama: '' });
    setIsIndikatorModalOpen(true);
  };

  const handleSaveIndikator = (ef: React.FormEvent) => {
    ef.preventDefault();
    if (!selectedKompForIndikator) return;
    const newInd: EkstraIndikatorItem = {
      id: `eind${Date.now()}`,
      ekstraKompetensiId: selectedKompForIndikator.id,
      ...indikatorForm,
    };
    setKompetensiList(prev =>
      prev.map(k => k.id === selectedKompForIndikator.id
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

  const openKkmModal = () => {
    setKkmForm(predikatSetting.kkm);
    setIsKkmModalOpen(true);
  };

  const handleSaveKkm = (ef: React.FormEvent) => {
    ef.preventDefault();
    setPredikatSetting(prev => ({ ...prev, kkm: kkmForm }));
    setIsKkmModalOpen(false);
  };

  const openAddPredikat = () => {
    setSelectedPredikatItem(null);
    setPredikatForm({ nama: '', deskripsi: '', nilaiMin: 0, nilaiMax: 100, alias: '' });
    setIsPredikatModalOpen(true);
  };

  const openEditPredikat = (pr: EkstraPredikatItem) => {
    setSelectedPredikatItem(pr);
    setPredikatForm({ nama: pr.nama, deskripsi: pr.deskripsi, nilaiMin: pr.nilaiMin, nilaiMax: pr.nilaiMax, alias: pr.alias });
    setIsPredikatModalOpen(true);
  };

  const openDeletePredikat = (pr: EkstraPredikatItem) => {
    setSelectedPredikatItem(pr);
    setIsPredikatDeleteOpen(true);
  };

  const handleSavePredikat = (ef: React.FormEvent) => {
    ef.preventDefault();
    if (selectedPredikatItem) {
      setPredikatSetting(prev => ({
        ...prev,
        predikat: prev.predikat.map(p => p.id === selectedPredikatItem.id ? { ...p, ...predikatForm } : p),
      }));
    } else {
      const newPr: EkstraPredikatItem = {
        id: `epr${Date.now()}`,
        ekstraPredikatId: predikatSetting.id,
        ...predikatForm,
      };
      setPredikatSetting(prev => ({
        ...prev,
        predikat: [...prev.predikat, newPr],
      }));
    }
    setIsPredikatModalOpen(false);
  };

  const handleDeletePredikat = () => {
    if (!selectedPredikatItem) return;
    setPredikatSetting(prev => ({
      ...prev,
      predikat: prev.predikat.filter(p => p.id !== selectedPredikatItem.id),
    }));
    setIsPredikatDeleteOpen(false);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'informasi', label: 'Informasi & Pembina' },
    { key: 'kompetensi', label: 'Kompetensi dan Indikator' },
    { key: 'predikat', label: 'Predikat dan KKM' },
  ];

  return (
    <MainLayout>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => router.push('/akademik/bank-ekstrakurikuler')} className="hover:text-green-600 transition-colors">Akademik</button>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <button onClick={() => router.push('/akademik/bank-ekstrakurikuler')} className="hover:text-green-600 transition-colors">Bank Ekstrakurikuler</button>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-700 font-medium">Pengaturan</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{ekstra.nama}</h1>
            <p className="text-gray-500 mt-0.5 text-sm">Pengaturan ekstrakurikuler {ekstra.nama}</p>
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

        {/* ==================== TAB 1: INFORMASI & PEMBINA ==================== */}
        {activeTab === 'informasi' && (
          <div className="space-y-5">
            <form onSubmit={handleSaveInfo}>
              {/* Informasi Dasar */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                <h2 className="text-base font-semibold text-gray-800">Informasi Dasar</h2>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    label="Nama Ekstrakurikuler"
                    name="nama"
                    value={infoForm.nama}
                    onChange={(e) => setInfoForm({ ...infoForm, nama: e.target.value })}
                    required
                  />
                  <FormField
                    label="Kategori"
                    name="groupId"
                    type="select"
                    value={infoForm.groupId}
                    onChange={(e) => setInfoForm({ ...infoForm, groupId: e.target.value })}
                    options={dummyEkstraGroups.map(g => ({ value: g.id, label: g.nama }))}
                    required
                  />
                  <FormField
                    label="Status"
                    name="statusAktif"
                    type="select"
                    value={infoForm.statusAktif ? 'true' : 'false'}
                    onChange={(e) => setInfoForm({ ...infoForm, statusAktif: e.target.value === 'true' })}
                    options={[{ value: 'true', label: 'Aktif' }, { value: 'false', label: 'Nonaktif' }]}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Tempat"
                    name="lokasi"
                    value={infoForm.lokasi}
                    onChange={(e) => setInfoForm({ ...infoForm, lokasi: e.target.value })}
                    placeholder="Masukkan lokasi"
                  />
                  <FormField
                    label="Kuota Maksimal"
                    name="kuota"
                    type="number"
                    value={infoForm.kuota}
                    onChange={(e) => setInfoForm({ ...infoForm, kuota: Number(e.target.value) })}
                    required
                  />
                </div>
                <FormField
                  label="Deskripsi (Opsional)"
                  name="deskripsi"
                  type="textarea"
                  value={infoForm.deskripsi}
                  onChange={(e) => setInfoForm({ ...infoForm, deskripsi: e.target.value })}
                  placeholder="Masukkan deskripsi ekskul"
                  rows={2}
                />
              </div>

              {/* Jadwal Rutin */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 mt-4">
                <h2 className="text-base font-semibold text-gray-800">Jadwal Rutin</h2>
                <div className="flex flex-wrap gap-2">
                  {hariList.filter(h => h !== 'Minggu').map(hari => (
                    <button
                      key={hari}
                      type="button"
                      onClick={() => setInfoForm({ ...infoForm, hari })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        infoForm.hari === hari
                          ? 'bg-green-600 text-white border-green-600 shadow-sm'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-green-300 hover:text-green-600'
                      }`}
                    >
                      {hari}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Jam Mulai"
                    name="jamMulai"
                    type="time"
                    value={infoForm.jamMulai}
                    onChange={(e) => setInfoForm({ ...infoForm, jamMulai: e.target.value })}
                  />
                  <FormField
                    label="Jam Selesai"
                    name="jamSelesai"
                    type="time"
                    value={infoForm.jamSelesai}
                    onChange={(e) => setInfoForm({ ...infoForm, jamSelesai: e.target.value })}
                  />
                </div>
              </div>

              {/* Pembina */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 mt-4">
                <h2 className="text-base font-semibold text-gray-800">Pembina</h2>
                <p className="text-sm text-gray-500">Pilih pembina untuk ekstrakurikuler ini</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {pembinaPool.map(pb => (
                    <label
                      key={pb.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPembina.includes(pb.pegawaiId)
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPembina.includes(pb.pegawaiId)}
                        onChange={() => togglePembina(pb.pegawaiId)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{pb.nama}</p>
                        <p className="text-xs text-gray-500">{pb.email} · {pb.noTelp}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  {infoSaved && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== TAB 2: KOMPETENSI DAN INDIKATOR ==================== */}
        {activeTab === 'kompetensi' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">Kompetensi Ekstrakurikuler</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Kelola kompetensi dan standar penilaian</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                    Salin dari Tahun Lain
                  </button>
                  <button
                    onClick={openAddKompetensi}
                    className="px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Kompetensi
                  </button>
                </div>
              </div>
            </div>

            {/* Kompetensi List */}
            <div className="space-y-3">
              {kompetensiList.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-4xl mb-3">📋</p>
                  <p className="text-sm">Belum ada kompetensi ditambahkan</p>
                  <button onClick={openAddKompetensi} className="mt-3 text-green-600 hover:text-green-700 text-sm font-medium">+ Tambah Kompetensi</button>
                </div>
              ) : (
                kompetensiList.map(k => (
                  <div key={k.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-gray-800">{k.nama}</h4>
                            <span className="text-xs text-gray-400">({k.kode})</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">Kode: {k.kode} · Skala Nilai {k.skalaMin}-{k.skalaMax}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="default">{k.indikator.length} Indikator</Badge>
                            <Badge variant="default">{k.indikator.length} Items</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditKompetensi(k)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openDeleteKompetensi(k)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Indikator */}
                    <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-600">INDIKATOR ({k.indikator.length})</p>
                      </div>
                      {k.indikator.length === 0 ? (
                        <p className="text-xs text-gray-400 italic mb-3">Belum ada indikator</p>
                      ) : (
                        <div className="space-y-1.5 mb-3">
                          {k.indikator.map(ind => (
                            <div key={ind.id} className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-gray-100">
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
                      <button
                        onClick={() => openAddIndikator(k)}
                        className="w-full py-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg border border-green-200 transition-colors"
                      >
                        + Tambah Indikator
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: PREDIKAT DAN KKM ==================== */}
        {activeTab === 'predikat' && (
          <div className="space-y-5">
            <div className="flex items-center justify-end">
              <select
                value={tahunAjaran}
                onChange={(e) => {
                  setTahunAjaran(e.target.value);
                  setPredikatSetting(prev => ({ ...prev, tahunAjaran: e.target.value }));
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option>2025/2026</option>
                <option>2026/2027</option>
                <option>2027/2028</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left: Tahun Ajaran + KKM */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Tahun Ajaran</h3>
                  <p className="text-2xl font-bold text-gray-700">{predikatSetting.tahunAjaran}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-800">KKM</h3>
                    <button onClick={openKkmModal} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit KKM">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{predikatSetting.kkm}</p>
                </div>

                <button className="w-full px-4 py-2.5 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Salin KKM
                </button>
              </div>

              {/* Right: Predikat Table */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Nama</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Alias</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Nilai Min</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Nilai Maks</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Keterangan</th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-600 text-xs w-20">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {predikatSetting.predikat.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">
                              Belum ada predikat yang ditambahkan.
                            </td>
                          </tr>
                        ) : (
                          predikatSetting.predikat.map(pr => (
                            <tr key={pr.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-2.5 font-medium text-gray-800">{pr.nama}</td>
                              <td className="px-4 py-2.5 text-gray-500">{pr.alias || '-'}</td>
                              <td className="px-4 py-2.5 text-gray-600">{pr.nilaiMin}</td>
                              <td className="px-4 py-2.5 text-gray-600">{pr.nilaiMax}</td>
                              <td className="px-4 py-2.5 text-gray-600">{pr.deskripsi}</td>
                              <td className="px-4 py-2.5 text-right">
                                <div className="flex justify-end gap-1">
                                  <button onClick={() => openEditPredikat(pr)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button onClick={() => openDeletePredikat(pr)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                  <div className="px-5 py-3 border-t border-gray-100">
                    <button
                      onClick={openAddPredikat}
                      className="text-sm text-gray-500 hover:text-green-600 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Tambah Predikat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MODALS ==================== */}

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
        <Modal isOpen={isKkmModalOpen} onClose={() => setIsKkmModalOpen(false)} title="Atur KKM" size="sm">
          <form onSubmit={handleSaveKkm}>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800">Atur nilai Kriteria Ketuntasan Minimal (KKM) untuk ekstrakurikuler <strong>{ekstra.nama}</strong>.</p>
            </div>
            <FormField label="Nilai KKM" name="kkm" type="number" value={kkmForm} onChange={(e) => setKkmForm(Number(e.target.value))} placeholder="70" required />
            <FormActions onCancel={() => setIsKkmModalOpen(false)} submitLabel="Simpan" />
          </form>
        </Modal>

        {/* Modal Predikat */}
        <Modal isOpen={isPredikatModalOpen} onClose={() => setIsPredikatModalOpen(false)} title={selectedPredikatItem ? 'Edit Predikat' : 'Tambah Predikat'} size="md">
          <form onSubmit={handleSavePredikat}>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nama" name="nama" value={predikatForm.nama} onChange={(e) => setPredikatForm({ ...predikatForm, nama: e.target.value })} placeholder="A / B / C" required />
              <FormField label="Alias" name="alias" value={predikatForm.alias} onChange={(e) => setPredikatForm({ ...predikatForm, alias: e.target.value })} placeholder="Alias (opsional)" />
              <FormField label="Nilai Min" name="nilaiMin" type="number" value={predikatForm.nilaiMin} onChange={(e) => setPredikatForm({ ...predikatForm, nilaiMin: Number(e.target.value) })} required />
              <FormField label="Nilai Maks" name="nilaiMax" type="number" value={predikatForm.nilaiMax} onChange={(e) => setPredikatForm({ ...predikatForm, nilaiMax: Number(e.target.value) })} required />
            </div>
            <FormField label="Keterangan" name="deskripsi" value={predikatForm.deskripsi} onChange={(e) => setPredikatForm({ ...predikatForm, deskripsi: e.target.value })} placeholder="Sangat Baik / Baik / Cukup" required />
            <FormActions onCancel={() => setIsPredikatModalOpen(false)} submitLabel={selectedPredikatItem ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        <ConfirmDialog isOpen={isPredikatDeleteOpen} onClose={() => setIsPredikatDeleteOpen(false)} onConfirm={handleDeletePredikat} title="Hapus Predikat" message={`Yakin ingin menghapus predikat "${selectedPredikatItem?.nama}"?`} confirmLabel="Hapus" variant="danger" />
      </div>
    </MainLayout>
  );
}

export default function PengaturanEkstraPage() {
  return <PengaturanEkstraContent />;
}
