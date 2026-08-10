'use client';

import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import DataTable from '@/components/ui/DataTable';
import {
  SPMBPeriode, SPMBDokumenConfig, SPMBCBTSoal, SPMBRincianBiaya,
  SPMBRegistration, SPMBPeriodeStatus, SPMBJenisGelombang,
  SPMBJenisDokumenConfig, SPMBCBTJenisSoal,
} from '@/types';
import {
  dummySPMBPeriode, dummyDokumenConfig, dummyCBTSoal,
  dummySPMBRegistrations,
} from '@/data/spmb';
import { generateId } from '@/lib/utils';

// ==================== Types & Constants ====================

type MainTab = 'data-umum' | 'pembayaran-formulir' | 'data-siswa' | 'finalisasi';
type DataUmumSubTab = 'periode' | 'dokumen' | 'tagihan' | 'cbt';

const MAIN_TABS: { key: MainTab; label: string; icon: string }[] = [
  { key: 'data-umum', label: 'Data Umum', icon: '📋' },
  { key: 'pembayaran-formulir', label: 'Pembayaran Formulir', icon: '💳' },
  { key: 'data-siswa', label: 'Data Siswa', icon: '👨‍🎓' },
  { key: 'finalisasi', label: 'Finalisasi', icon: '✅' },
];

const DATA_UMUM_SUBTABS: { key: DataUmumSubTab; label: string }[] = [
  { key: 'periode', label: 'Periode / Gelombang' },
  { key: 'dokumen', label: 'Dokumen Pendaftaran' },
  { key: 'tagihan', label: 'Tagihan' },
  { key: 'cbt', label: 'Soal CBT' },
];

const GELOMBANG_OPTIONS: { value: SPMBJenisGelombang; label: string }[] = [
  { value: 'reguler', label: 'Reguler' },
  { value: 'prestasi', label: 'Prestasi' },
  { value: 'afirmasi', label: 'Afirmasi' },
  { value: 'mutasi', label: 'Mutasi' },
];

const DOKUMEN_JENIS_OPTIONS: { value: SPMBJenisDokumenConfig; label: string }[] = [
  { value: 'kk', label: 'Kartu Keluarga' },
  { value: 'akta_lahir', label: 'Akta Kelahiran' },
  { value: 'ijazah', label: 'Ijazah' },
  { value: 'rapor', label: 'Rapor' },
  { value: 'pas_foto', label: 'Pas Foto' },
  { value: 'sertifikat_prestasi', label: 'Sertifikat Prestasi' },
  { value: 'surat_keterangan', label: 'Surat Keterangan' },
  { value: 'lainnya', label: 'Lainnya' },
];

const MAPEL_OPTIONS = ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'IPA', 'IPS', 'PAI'];

const CBT_JENIS_OPTIONS: { value: SPMBCBTJenisSoal; label: string; icon: string }[] = [
  { value: 'pilihan_ganda', label: 'Pilihan Ganda', icon: '🔤' },
  { value: 'pilihan_ganda_kompleks', label: 'PG Kompleks', icon: '☑️' },
  { value: 'essay', label: 'Essay', icon: '📝' },
  { value: 'penjodohan', label: 'Penjodohan', icon: '🔗' },
];

function statusPeriodeVariant(s: SPMBPeriodeStatus): 'success' | 'warning' | 'default' {
  if (s === 'aktif') return 'success';
  if (s === 'ditutup') return 'warning';
  return 'default';
}

function cbtJenisBadge(j: SPMBCBTJenisSoal): string {
  const m: Record<SPMBCBTJenisSoal, string> = {
    pilihan_ganda: 'PG', pilihan_ganda_kompleks: 'PGK', essay: 'Essay', penjodohan: 'Jodoh',
  };
  return m[j] || j;
}

// ==================== Main Component ====================

export default function SPMBAdminPage() {
  const [mainTab, setMainTab] = useState<MainTab>('data-umum');

  // --- Data Umum state ---
  const [umumSubTab, setUmumSubTab] = useState<DataUmumSubTab>('periode');
  const [periodeList, setPeriodeList] = useState<SPMBPeriode[]>(dummySPMBPeriode);
  const [dokumenList, setDokumenList] = useState<SPMBDokumenConfig[]>(dummyDokumenConfig);
  const [cbtList, setCbtList] = useState<SPMBCBTSoal[]>(dummyCBTSoal);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>(dummySPMBPeriode[0]?.id || '');

  // Modal states
  const [modalPeriode, setModalPeriode] = useState(false);
  const [modalDokumen, setModalDokumen] = useState(false);
  const [modalCBT, setModalCBT] = useState(false);
  const [modalRincian, setModalRincian] = useState(false);
  const [modalFinalisasi, setModalFinalisasi] = useState<string | null>(null); // registrationId

  // Edit states
  const [editPeriode, setEditPeriode] = useState<SPMBPeriode | null>(null);
  const [editDokumen, setEditDokumen] = useState<SPMBDokumenConfig | null>(null);
  const [editCBT, setEditCBT] = useState<SPMBCBTSoal | null>(null);
  const [editRincian, setEditRincian] = useState<SPMBRincianBiaya | null>(null);

  // Form states
  const [formPeriode, setFormPeriode] = useState(emptyPeriodeForm());
  const [formDokumen, setFormDokumen] = useState(emptyDokumenForm());
  const [formCBT, setFormCBT] = useState(emptyCBTForm());
  const [formRincian, setFormRincian] = useState(emptyRincianForm());

  // Finalisasi state
  const [finalisasiData, setFinalisasiData] = useState<Record<string, { kelas: string; nis: string }>>({});

  // Data Siswa state
  const [modalDetailSiswa, setModalDetailSiswa] = useState<SPMBRegistration | null>(null);
  const [verifikasiData, setVerifikasiData] = useState<Record<string, boolean>>({});

  // --- Pembayaran Formulir state ---
  const [registrations] = useState<SPMBRegistration[]>(dummySPMBRegistrations);

  // ==================== Derived Data ====================

  const selectedPeriode = useMemo(
    () => periodeList.find((p) => p.id === selectedPeriodeId) || null,
    [periodeList, selectedPeriodeId],
  );

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      if (selectedPeriode) return r.tahunAjaran === selectedPeriode.tahunAjaran;
      return true;
    });
  }, [registrations, selectedPeriode]);

  // ==================== Form Helpers ====================

  function emptyPeriodeForm() {
    return {
      nama: '', tahunAjaran: '2027/2028', jenisGelombang: 'reguler' as SPMBJenisGelombang,
      kuota: 60, tanggalMulai: '', tanggalSelesai: '', status: 'aktif' as SPMBPeriodeStatus,
      biayaFormulir: 400000, biayaDaftarUlang: 0,
      rincianDaftarUlang: [] as SPMBRincianBiaya[],
    };
  }

  function emptyDokumenForm(): SPMBDokumenConfig {
    return {
      id: '', jenis: 'kk', nama: '', wajib: true, deskripsi: '', formatFile: 'pdf', ukuranMaksMB: 2,
    };
  }

  function emptyCBTForm(): SPMBCBTSoal {
    return {
      id: '', jenis: 'pilihan_ganda' as SPMBCBTJenisSoal, mapel: 'Matematika', soal: '',
      pilihanA: '', pilihanB: '', pilihanC: '', pilihanD: '', pilihanE: '',
      kunciJawaban: 'A', bobot: 5,
    };
  }

  function emptyRincianForm(): SPMBRincianBiaya {
    return { id: '', nama: '', nominal: 0, deskripsi: '' };
  }

  // ==================== Periode CRUD ====================

  const openAddPeriode = () => {
    setEditPeriode(null);
    setFormPeriode(emptyPeriodeForm());
    setModalPeriode(true);
  };

  const openEditPeriode = (p: SPMBPeriode) => {
    setEditPeriode(p);
    setFormPeriode({
      nama: p.nama, tahunAjaran: p.tahunAjaran, jenisGelombang: p.jenisGelombang,
      kuota: p.kuota, tanggalMulai: p.tanggalMulai, tanggalSelesai: p.tanggalSelesai,
      status: p.status, biayaFormulir: p.biayaFormulir, biayaDaftarUlang: p.biayaDaftarUlang,
      rincianDaftarUlang: p.rincianDaftarUlang,
    });
    setModalPeriode(true);
  };

  const savePeriode = () => {
    const biayaDU = formPeriode.rincianDaftarUlang.reduce((s, r) => s + r.nominal, 0);
    if (editPeriode) {
      setPeriodeList((prev) =>
        prev.map((p) =>
          p.id === editPeriode.id
            ? { ...p, ...formPeriode, biayaDaftarUlang: biayaDU, dokumenWajib: p.dokumenWajib, soalCBT: p.soalCBT }
            : p,
        ),
      );
    } else {
      const newPeriode: SPMBPeriode = {
        id: generateId('periode'),
        ...formPeriode,
        biayaDaftarUlang: biayaDU,
        dokumenWajib: [],
        soalCBT: [],
      };
      setPeriodeList((prev) => [...prev, newPeriode]);
      if (!selectedPeriodeId) setSelectedPeriodeId(newPeriode.id);
    }
    setModalPeriode(false);
  };

  const deletePeriode = (id: string) => {
    setPeriodeList((prev) => prev.filter((p) => p.id !== id));
    if (selectedPeriodeId === id) {
      setSelectedPeriodeId(periodeList.find((p) => p.id !== id)?.id || '');
    }
  };

  // ==================== Rincian Biaya CRUD ====================

  const openAddRincian = () => {
    setEditRincian(null);
    setFormRincian(emptyRincianForm());
    setModalRincian(true);
  };

  const openEditRincian = (r: SPMBRincianBiaya) => {
    setEditRincian(r);
    setFormRincian({ ...r });
    setModalRincian(true);
  };

  const saveRincian = () => {
    if (editRincian) {
      setPeriodeList((prev) =>
        prev.map((p) =>
          p.id === selectedPeriodeId
            ? {
                ...p,
                rincianDaftarUlang: p.rincianDaftarUlang.map((r) =>
                  r.id === editRincian.id ? { ...formRincian, id: r.id } : r,
                ),
                biayaDaftarUlang: p.rincianDaftarUlang.reduce(
                  (s, r) => s + (r.id === editRincian.id ? formRincian.nominal : r.nominal),
                  0,
                ),
              }
            : p,
        ),
      );
    } else {
      const newR = { ...formRincian, id: generateId('rdu') };
      setPeriodeList((prev) =>
        prev.map((p) =>
          p.id === selectedPeriodeId
            ? { ...p, rincianDaftarUlang: [...p.rincianDaftarUlang, newR], biayaDaftarUlang: p.biayaDaftarUlang + newR.nominal }
            : p,
        ),
      );
    }
    setModalRincian(false);
  };

  const deleteRincian = (id: string) => {
    setPeriodeList((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPeriodeId) return p;
        const item = p.rincianDaftarUlang.find((r) => r.id === id);
        return {
          ...p,
          rincianDaftarUlang: p.rincianDaftarUlang.filter((r) => r.id !== id),
          biayaDaftarUlang: p.biayaDaftarUlang - (item?.nominal || 0),
        };
      }),
    );
  };

  // ==================== Dokumen CRUD ====================

  const openAddDokumen = () => {
    setEditDokumen(null);
    setFormDokumen(emptyDokumenForm());
    setModalDokumen(true);
  };

  const openEditDokumen = (d: SPMBDokumenConfig) => {
    setEditDokumen(d);
    setFormDokumen({ ...d });
    setModalDokumen(true);
  };

  const saveDokumen = () => {
    if (editDokumen) {
      setDokumenList((prev) => prev.map((d) => (d.id === editDokumen.id ? { ...formDokumen, id: d.id } : d)));
    } else {
      setDokumenList((prev) => [...prev, { ...formDokumen, id: generateId('doc') }]);
    }
    setModalDokumen(false);
  };

  const deleteDokumen = (id: string) => {
    setDokumenList((prev) => prev.filter((d) => d.id !== id));
  };

  // ==================== CBT CRUD ====================

  const openAddCBT = () => {
    setEditCBT(null);
    setFormCBT(emptyCBTForm());
    setModalCBT(true);
  };

  const openEditCBT = (s: SPMBCBTSoal) => {
    setEditCBT(s);
    setFormCBT({ ...s });
    setModalCBT(true);
  };

  const saveCBT = () => {
    if (editCBT) {
      setCbtList((prev) => prev.map((s) => (s.id === editCBT.id ? { ...formCBT, id: s.id } : s)));
    } else {
      setCbtList((prev) => [...prev, { ...formCBT, id: generateId('cbt') }]);
    }
    setModalCBT(false);
  };

  const deleteCBT = (id: string) => {
    setCbtList((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCBTJenisChange = (jenis: SPMBCBTJenisSoal) => {
    setFormCBT((s) => {
      const base = { ...s, jenis };
      if (jenis === 'pilihan_ganda') {
        base.pilihanA = base.pilihanA || ''; base.pilihanB = base.pilihanB || '';
        base.pilihanC = base.pilihanC || ''; base.pilihanD = base.pilihanD || '';
        base.pilihanE = base.pilihanE || ''; base.kunciJawaban = base.kunciJawaban || 'A';
      }
      if (jenis === 'pilihan_ganda_kompleks') {
        base.pilihanA = base.pilihanA || ''; base.pilihanB = base.pilihanB || '';
        base.pilihanC = base.pilihanC || ''; base.pilihanD = base.pilihanD || '';
        base.pilihanE = base.pilihanE || ''; base.kunciJawabanArray = base.kunciJawabanArray || [];
      }
      if (jenis === 'essay') {
        base.jawabanEssay = base.jawabanEssay || '';
      }
      if (jenis === 'penjodohan') {
        base.pasanganKiri = base.pasanganKiri || ['', '', ''];
        base.pasanganKanan = base.pasanganKanan || ['', '', ''];
        base.kunciPenjodohan = base.kunciPenjodohan || {};
      }
      return base;
    });
  };

  // ==================== Finalisasi ====================

  const handleFinalisasi = (regId: string, kelas: string, nis: string) => {
    setFinalisasiData((prev) => ({ ...prev, [regId]: { kelas, nis } }));
    setModalFinalisasi(null);
  };

  const handleVerifikasi = (regId: string) => {
    setVerifikasiData((prev) => ({ ...prev, [regId]: true }));
  };

  const registrationsFinal = useMemo(
    () => registrations.filter((r) => r.statusAkhir === 'diterima'),
    [registrations],
  );

  // ==================== Render: Main Tabs ====================

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin SPMB</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola periode pendaftaran, pembayaran, data siswa, dan finalisasi</p>
        </div>

      {/* Main Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMainTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mainTab === tab.key
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {mainTab === 'data-umum' && (
        <TabDataUmum
          subTab={umumSubTab}
          onSubTabChange={setUmumSubTab}
          periodeList={periodeList}
          selectedPeriodeId={selectedPeriodeId}
          onSelectPeriode={setSelectedPeriodeId}
          selectedPeriode={selectedPeriode}
          dokumenList={dokumenList}
          cbtList={cbtList}
          onAddPeriode={openAddPeriode}
          onEditPeriode={openEditPeriode}
          onDeletePeriode={deletePeriode}
          onAddDokumen={openAddDokumen}
          onEditDokumen={openEditDokumen}
          onDeleteDokumen={deleteDokumen}
          onAddCBT={openAddCBT}
          onEditCBT={openEditCBT}
          onDeleteCBT={deleteCBT}
          onAddRincian={openAddRincian}
          onEditRincian={openEditRincian}
          onDeleteRincian={deleteRincian}
        />
      )}

      {mainTab === 'pembayaran-formulir' && (
        <TabPembayaranFormulir
          registrations={filteredRegistrations}
          periodeList={periodeList}
          selectedPeriodeId={selectedPeriodeId}
          onSelectPeriode={setSelectedPeriodeId}
        />
      )}

      {mainTab === 'data-siswa' && (
        <TabDataSiswa
          registrations={filteredRegistrations}
          periodeList={periodeList}
          selectedPeriodeId={selectedPeriodeId}
          onSelectPeriode={setSelectedPeriodeId}
          verifikasiData={verifikasiData}
          onVerifikasi={handleVerifikasi}
          onLihatDetail={setModalDetailSiswa}
        />
      )}

      {mainTab === 'finalisasi' && (
        <TabFinalisasi
          registrations={registrationsFinal}
          finalisasiData={finalisasiData}
          onOpenFinalisasi={setModalFinalisasi}
        />
      )}

      {/* ====== Modals ====== */}

      {/* Modal Periode */}
      <Modal isOpen={modalPeriode} onClose={() => setModalPeriode(false)} title={editPeriode ? 'Edit Periode' : 'Tambah Periode'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Gelombang</label>
              <input
                type="text" value={formPeriode.nama}
                onChange={(e) => setFormPeriode((p) => ({ ...p, nama: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Gelombang 1 - Reguler"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran</label>
              <select
                value={formPeriode.tahunAjaran}
                onChange={(e) => setFormPeriode((p) => ({ ...p, tahunAjaran: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2026/2027">2026/2027</option>
                <option value="2027/2028">2027/2028</option>
                <option value="2028/2029">2028/2029</option>
                <option value="2029/2030">2029/2030</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Gelombang</label>
              <select
                value={formPeriode.jenisGelombang}
                onChange={(e) => setFormPeriode((p) => ({ ...p, jenisGelombang: e.target.value as SPMBJenisGelombang }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {GELOMBANG_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kuota</label>
              <input
                type="number" value={formPeriode.kuota}
                onChange={(e) => setFormPeriode((p) => ({ ...p, kuota: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <input
                type="date" value={formPeriode.tanggalMulai}
                onChange={(e) => setFormPeriode((p) => ({ ...p, tanggalMulai: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
              <input
                type="date" value={formPeriode.tanggalSelesai}
                onChange={(e) => setFormPeriode((p) => ({ ...p, tanggalSelesai: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formPeriode.status}
                onChange={(e) => setFormPeriode((p) => ({ ...p, status: e.target.value as SPMBPeriodeStatus }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="aktif">Aktif</option>
                <option value="ditutup">Ditutup</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biaya Formulir (Rp)</label>
              <input
                type="number" value={formPeriode.biayaFormulir}
                onChange={(e) => setFormPeriode((p) => ({ ...p, biayaFormulir: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end pb-2">
              <p className="text-xs text-gray-400">* Biaya daftar ulang dihitung otomatis dari rincian biaya di tab Tagihan.</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setModalPeriode(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
            <button onClick={savePeriode} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {editPeriode ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Dokumen */}
      <Modal isOpen={modalDokumen} onClose={() => setModalDokumen(false)} title={editDokumen ? 'Edit Dokumen' : 'Tambah Dokumen'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Dokumen</label>
            <select
              value={formDokumen.jenis}
              onChange={(e) => setFormDokumen((d) => ({ ...d, jenis: e.target.value as SPMBJenisDokumenConfig }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {DOKUMEN_JENIS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Dokumen</label>
            <input
              type="text" value={formDokumen.nama}
              onChange={(e) => setFormDokumen((d) => ({ ...d, nama: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <input
              type="text" value={formDokumen.deskripsi}
              onChange={(e) => setFormDokumen((d) => ({ ...d, deskripsi: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format File</label>
              <select
                value={formDokumen.formatFile}
                onChange={(e) => setFormDokumen((d) => ({ ...d, formatFile: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pdf">PDF</option>
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran Maks (MB)</label>
              <input
                type="number" value={formDokumen.ukuranMaksMB}
                onChange={(e) => setFormDokumen((d) => ({ ...d, ukuranMaksMB: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox" checked={formDokumen.wajib}
              onChange={(e) => setFormDokumen((d) => ({ ...d, wajib: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Dokumen Wajib</span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setModalDokumen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
            <button onClick={saveDokumen} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {editDokumen ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal CBT */}
      <ModalCBTForm
        isOpen={modalCBT} onClose={() => setModalCBT(false)}
        editCBT={editCBT} formCBT={formCBT} setFormCBT={setFormCBT}
        onSave={saveCBT} onJenisChange={handleCBTJenisChange}
      />

      {/* Modal Rincian Biaya */}
      <Modal isOpen={modalRincian} onClose={() => setModalRincian(false)} title={editRincian ? 'Edit Rincian Biaya' : 'Tambah Rincian Biaya'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Biaya</label>
            <input type="text" value={formRincian.nama} onChange={(e) => setFormRincian((r) => ({ ...r, nama: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Contoh: Seragam Sekolah" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
            <input type="number" value={formRincian.nominal} onChange={(e) => setFormRincian((r) => ({ ...r, nominal: Number(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <input type="text" value={formRincian.deskripsi} onChange={(e) => setFormRincian((r) => ({ ...r, deskripsi: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Keterangan tambahan" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setModalRincian(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
            <button onClick={saveRincian} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editRincian ? 'Simpan' : 'Tambah'}</button>
          </div>
        </div>
      </Modal>

      {/* Modal Detail Siswa */}
      {modalDetailSiswa && (
        <ModalDetailSiswa
          key={modalDetailSiswa.id}
          isOpen={!!modalDetailSiswa}
          onClose={() => setModalDetailSiswa(null)}
          registration={modalDetailSiswa}
          verified={!!verifikasiData[modalDetailSiswa.id]}
          onVerifikasi={handleVerifikasi}
        />
      )}

      {/* Modal Finalisasi */}
      {modalFinalisasi && (
        <ModalFinalisasi
          key={modalFinalisasi}
          isOpen={!!modalFinalisasi}
          onClose={() => setModalFinalisasi(null)}
          registration={registrations.find((r) => r.id === modalFinalisasi) || null}
          existingData={finalisasiData[modalFinalisasi]}
          onFinalisasi={handleFinalisasi}
        />
      )}
    </div>
    </MainLayout>
  );
}

// ==================== TAB: Data Umum ====================

function TabDataUmum({
  subTab, onSubTabChange, periodeList, selectedPeriodeId, onSelectPeriode, selectedPeriode,
  dokumenList, cbtList,
  onAddPeriode, onEditPeriode, onDeletePeriode,
  onAddDokumen, onEditDokumen, onDeleteDokumen,
  onAddCBT, onEditCBT, onDeleteCBT,
  onAddRincian, onEditRincian, onDeleteRincian,
}: {
  subTab: DataUmumSubTab; onSubTabChange: (t: DataUmumSubTab) => void;
  periodeList: SPMBPeriode[]; selectedPeriodeId: string; onSelectPeriode: (id: string) => void;
  selectedPeriode: SPMBPeriode | null;
  dokumenList: SPMBDokumenConfig[]; cbtList: SPMBCBTSoal[];
  onAddPeriode: () => void; onEditPeriode: (p: SPMBPeriode) => void; onDeletePeriode: (id: string) => void;
  onAddDokumen: () => void; onEditDokumen: (d: SPMBDokumenConfig) => void; onDeleteDokumen: (id: string) => void;
  onAddCBT: () => void; onEditCBT: (s: SPMBCBTSoal) => void; onDeleteCBT: (id: string) => void;
  onAddRincian: () => void; onEditRincian: (r: SPMBRincianBiaya) => void; onDeleteRincian: (id: string) => void;
}) {
  const [confirmDeletePeriode, setConfirmDeletePeriode] = useState<string | null>(null);

  // Stats
  const totalPeriode = periodeList.length;
  const aktifPeriode = periodeList.filter((p) => p.status === 'aktif').length;

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {DATA_UMUM_SUBTABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onSubTabChange(tab.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              subTab === tab.key ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Periode Selector (shown on all sub-tabs) */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Gelombang:</span>
        <select
          value={selectedPeriodeId}
          onChange={(e) => onSelectPeriode(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {periodeList.map((p) => (
            <option key={p.id} value={p.id}>{p.nama}</option>
          ))}
        </select>
      </div>

      {/* Sub Tab Content */}
      {subTab === 'periode' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Total Periode" value={totalPeriode} icon="📋" color="blue" />
            <StatCard title="Periode Aktif" value={aktifPeriode} icon="🟢" color="green" />
            {selectedPeriode && (
              <StatCard
                title="Kuota Tersedia"
                value={`${selectedPeriode.kuota} siswa`}
                icon="👥"
                color="purple"
              />
            )}
          </div>
          <Card title="Daftar Periode / Gelombang" action={
            <button onClick={onAddPeriode} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Tambah</button>
          }>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="py-2 font-medium text-gray-500">Nama</th>
                  <th className="py-2 font-medium text-gray-500">Tahun Ajaran</th>
                  <th className="py-2 font-medium text-gray-500">Jenis</th>
                  <th className="py-2 font-medium text-gray-500">Kuota</th>
                  <th className="py-2 font-medium text-gray-500">Tanggal</th>
                  <th className="py-2 font-medium text-gray-500">Biaya Formulir</th>
                  <th className="py-2 font-medium text-gray-500">Status</th>
                  <th className="py-2 font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {periodeList.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-800">{p.nama}</td>
                    <td className="py-2.5 text-gray-600">{p.tahunAjaran}</td>
                    <td className="py-2.5 text-gray-600 capitalize">{p.jenisGelombang}</td>
                    <td className="py-2.5 text-gray-600">{p.kuota}</td>
                    <td className="py-2.5 text-gray-600 text-xs">{p.tanggalMulai} s/d {p.tanggalSelesai}</td>
                    <td className="py-2.5 text-gray-600">Rp {p.biayaFormulir.toLocaleString('id-ID')}</td>
                    <td className="py-2.5"><Badge variant={statusPeriodeVariant(p.status)}>{p.status}</Badge></td>
                    <td className="py-2.5">
                      <div className="flex gap-2">
                        <button onClick={() => onEditPeriode(p)} className="text-blue-600 hover:text-blue-800 text-xs">Edit</button>
                        <button onClick={() => setConfirmDeletePeriode(p.id)} className="text-red-600 hover:text-red-800 text-xs">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {periodeList.length === 0 && (
                  <tr><td colSpan={8} className="py-8 text-center text-gray-400">Belum ada periode</td></tr>
                )}
              </tbody>
            </table>
          </Card>
          <ConfirmDialog
            isOpen={!!confirmDeletePeriode}
            onClose={() => setConfirmDeletePeriode(null)}
            onConfirm={() => { if (confirmDeletePeriode) onDeletePeriode(confirmDeletePeriode); setConfirmDeletePeriode(null); }}
            title="Hapus Periode"
            message="Apakah Anda yakin ingin menghapus periode ini? Data tidak dapat dikembalikan."
            variant="danger"
          />
        </div>
      )}

      {subTab === 'dokumen' && (
        <Card title="Konfigurasi Dokumen Pendaftaran" subtitle={selectedPeriode ? `Untuk: ${selectedPeriode.nama}` : ''} action={
          <button onClick={onAddDokumen} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Tambah</button>
        }>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="py-2 font-medium text-gray-500">Jenis</th>
                <th className="py-2 font-medium text-gray-500">Nama Dokumen</th>
                <th className="py-2 font-medium text-gray-500">Wajib</th>
                <th className="py-2 font-medium text-gray-500">Format</th>
                <th className="py-2 font-medium text-gray-500">Ukuran Maks</th>
                <th className="py-2 font-medium text-gray-500">Deskripsi</th>
                <th className="py-2 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dokumenList.map((d) => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 text-gray-600">{DOKUMEN_JENIS_OPTIONS.find((o) => o.value === d.jenis)?.label || d.jenis}</td>
                  <td className="py-2.5 font-medium text-gray-800">{d.nama}</td>
                  <td className="py-2.5">{d.wajib ? <Badge variant="info">Wajib</Badge> : <Badge>Opsional</Badge>}</td>
                  <td className="py-2.5 text-gray-600 uppercase">{d.formatFile}</td>
                  <td className="py-2.5 text-gray-600">{d.ukuranMaksMB} MB</td>
                  <td className="py-2.5 text-gray-500 text-xs max-w-[200px] truncate">{d.deskripsi}</td>
                  <td className="py-2.5">
                    <div className="flex gap-2">
                      <button onClick={() => onEditDokumen(d)} className="text-blue-600 hover:text-blue-800 text-xs">Edit</button>
                      <button onClick={() => onDeleteDokumen(d.id)} className="text-red-600 hover:text-red-800 text-xs">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {subTab === 'tagihan' && selectedPeriode && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Biaya Formulir Pendaftaran</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">Rp {selectedPeriode.biayaFormulir.toLocaleString('id-ID')}</p>
                </div>
                <span className="text-3xl">📄</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Biaya yang harus dibayar calon siswa saat mendaftar untuk mendapatkan formulir dan akun pengisian data.
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Biaya Daftar Ulang</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">Rp {selectedPeriode.biayaDaftarUlang.toLocaleString('id-ID')}</p>
                </div>
                <span className="text-3xl">💰</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total biaya yang harus dibayar calon siswa yang dinyatakan diterima untuk daftar ulang.
              </p>
            </div>
          </div>

          <Card title="Rincian Biaya Daftar Ulang" subtitle={`Untuk: ${selectedPeriode.nama}`} action={
            <button onClick={onAddRincian} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Tambah Rincian</button>
          }>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="py-2 font-medium text-gray-500 w-8">#</th>
                  <th className="py-2 font-medium text-gray-500">Nama Biaya</th>
                  <th className="py-2 font-medium text-gray-500">Nominal</th>
                  <th className="py-2 font-medium text-gray-500">Deskripsi</th>
                  <th className="py-2 font-medium text-gray-500 w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {selectedPeriode.rincianDaftarUlang.map((r, idx) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 text-gray-400">{idx + 1}</td>
                    <td className="py-2.5 font-medium text-gray-800">{r.nama}</td>
                    <td className="py-2.5 text-gray-700">Rp {r.nominal.toLocaleString('id-ID')}</td>
                    <td className="py-2.5 text-gray-500 text-xs">{r.deskripsi}</td>
                    <td className="py-2.5">
                      <div className="flex gap-2">
                        <button onClick={() => onEditRincian(r)} className="text-blue-600 hover:text-blue-800 text-xs">Edit</button>
                        <button onClick={() => onDeleteRincian(r.id)} className="text-red-600 hover:text-red-800 text-xs">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {selectedPeriode.rincianDaftarUlang.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">Belum ada rincian biaya daftar ulang</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td colSpan={2} className="py-2.5 text-sm font-bold text-gray-700 text-right pr-4">Total</td>
                  <td className="py-2.5 text-sm font-bold text-gray-800">Rp {selectedPeriode.biayaDaftarUlang.toLocaleString('id-ID')}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </Card>
          <p className="text-xs text-gray-400">* Untuk mengubah biaya formulir, edit periode pada tab Periode / Gelombang.</p>
        </div>
      )}

      {subTab === 'cbt' && (
        <Card title="Bank Soal CBT (Computer Based Test)" subtitle={selectedPeriode ? `Untuk: ${selectedPeriode.nama}` : ''} action={
          <button onClick={onAddCBT} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Tambah Soal</button>
        }>
          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {MAPEL_OPTIONS.map((mapel) => {
              const count = cbtList.filter((s) => s.mapel === mapel).length;
              return (
                <div key={mapel} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <p className="text-xs text-gray-500">{mapel}</p>
                  <p className="text-xl font-bold text-gray-800">{count}</p>
                  <p className="text-[10px] text-gray-400">soal</p>
                </div>
              );
            })}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="py-2 font-medium text-gray-500 w-10">#</th>
                <th className="py-2 font-medium text-gray-500">Jenis</th>
                <th className="py-2 font-medium text-gray-500">Mapel</th>
                <th className="py-2 font-medium text-gray-500">Soal</th>
                <th className="py-2 font-medium text-gray-500">Kunci</th>
                <th className="py-2 font-medium text-gray-500">Bobot</th>
                <th className="py-2 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cbtList.map((s, idx) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="py-2.5"><Badge variant="info">{cbtJenisBadge(s.jenis)}</Badge></td>
                  <td className="py-2.5 text-gray-700 text-xs">{s.mapel}</td>
                  <td className="py-2.5 text-gray-800 max-w-[300px] truncate">{s.soal}</td>
                  <td className="py-2.5 text-xs">
                    {s.jenis === 'pilihan_ganda' && <span className="font-semibold text-green-700">{s.kunciJawaban}</span>}
                    {s.jenis === 'pilihan_ganda_kompleks' && <span className="font-semibold text-green-700">{s.kunciJawabanArray?.join(', ')}</span>}
                    {s.jenis === 'essay' && <span className="text-green-700 text-[10px] max-w-[120px] line-clamp-2 block truncate">{s.jawabanEssay?.slice(0, 60)}{(s.jawabanEssay?.length || 0) > 60 ? '...' : ''}</span>}
                    {s.jenis === 'penjodohan' && <span className="text-green-700">{s.pasanganKiri?.length || 0} pasang</span>}
                  </td>
                  <td className="py-2.5 text-gray-600">{s.bobot}</td>
                  <td className="py-2.5">
                    <div className="flex gap-2">
                      <button onClick={() => onEditCBT(s)} className="text-blue-600 hover:text-blue-800 text-xs">Edit</button>
                      <button onClick={() => onDeleteCBT(s.id)} className="text-red-600 hover:text-red-800 text-xs">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
              {cbtList.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-gray-400">Belum ada soal CBT</td></tr>}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ==================== TAB: Pembayaran Formulir ====================

function TabPembayaranFormulir({
  registrations, periodeList, selectedPeriodeId, onSelectPeriode,
}: {
  registrations: SPMBRegistration[];
  periodeList: SPMBPeriode[];
  selectedPeriodeId: string;
  onSelectPeriode: (id: string) => void;
}) {
  const sudahBayar = registrations.filter((r) => r.statusBayarFormulir === 'sudah_bayar').length;
  const belumBayar = registrations.filter((r) => r.statusBayarFormulir === 'belum_bayar').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Filter Gelombang:</span>
        <select
          value={selectedPeriodeId}
          onChange={(e) => onSelectPeriode(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua</option>
          {periodeList.map((p) => (
            <option key={p.id} value={p.id}>{p.nama}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Pendaftar" value={registrations.length} icon="👥" color="blue" />
        <StatCard title="Sudah Bayar" value={sudahBayar} icon="✅" color="green" />
        <StatCard title="Belum Bayar" value={belumBayar} icon="⏳" color="yellow" />
      </div>

      <Card title="Data Pembayaran Formulir">
        <DataTable
          columns={[
            { key: 'noPendaftaran', header: 'No. Pendaftaran' },
            { key: 'namaLengkapSiswa', header: 'Nama Siswa' },
            { key: 'jenisDaftar', header: 'Jenis', render: (r: SPMBRegistration) => (
              <Badge variant={r.jenisDaftar === 'reguler' ? 'info' : 'warning'}>{r.jenisDaftar}</Badge>
            )},
            { key: 'biayaFormulir', header: 'Biaya Formulir', render: (r: SPMBRegistration) => (
              <span>Rp {r.biayaFormulir.toLocaleString('id-ID')}</span>
            )},
            { key: 'noVA', header: 'No. VA' },
            { key: 'statusBayarFormulir', header: 'Status Bayar', render: (r: SPMBRegistration) => (
              r.statusBayarFormulir === 'sudah_bayar'
                ? <Badge variant="success">Sudah Bayar</Badge>
                : <Badge variant="warning">Belum Bayar</Badge>
            )},
            { key: 'tanggalDaftar', header: 'Tgl Daftar' },
          ]}
          data={registrations}
          keyExtractor={(r) => r.id}
          searchPlaceholder="Cari nama atau no pendaftaran..."
          searchKeys={['namaLengkapSiswa', 'noPendaftaran']}
          emptyMessage="Tidak ada data pembayaran"
        />
      </Card>
    </div>
  );
}

// ==================== TAB: Data Siswa ====================

function TabDataSiswa({
  registrations, periodeList, selectedPeriodeId, onSelectPeriode,
  verifikasiData, onVerifikasi, onLihatDetail,
}: {
  registrations: SPMBRegistration[];
  periodeList: SPMBPeriode[];
  selectedPeriodeId: string;
  onSelectPeriode: (id: string) => void;
  verifikasiData: Record<string, boolean>;
  onVerifikasi: (regId: string) => void;
  onLihatDetail: (r: SPMBRegistration) => void;
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const statusCount = useMemo(() => {
    const counts: Record<string, number> = {};
    registrations.forEach((r) => { counts[r.statusAkhir] = (counts[r.statusAkhir] || 0) + 1; });
    return counts;
  }, [registrations]);

  const statusLabel = (s: string): string => {
    const m: Record<string, string> = {
      menunggu_pembayaran: 'Menunggu Pembayaran Formulir',
      proses_pengisian: 'Pengisian Data & Dokumen',
      menunggu_tes: 'Tes Ujian Masuk',
      menunggu_pengumuman: 'Menunggu Pengumuman',
      diterima: 'Daftar Ulang',
      ditolak: 'Ditolak',
    };
    return m[s] || s;
  };

  const statusBadgeVariant = (s: string): 'warning' | 'info' | 'success' | 'danger' | 'default' => {
    if (s === 'menunggu_pembayaran') return 'warning';
    if (s === 'proses_pengisian') return 'info';
    if (s === 'menunggu_tes' || s === 'menunggu_pengumuman') return 'default';
    if (s === 'diterima') return 'success';
    if (s === 'ditolak') return 'danger';
    return 'default';
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return registrations;
    const q = search.toLowerCase();
    return registrations.filter((r) =>
      r.namaLengkapSiswa.toLowerCase().includes(q) ||
      r.nisn.toLowerCase().includes(q) ||
      r.noPendaftaran.toLowerCase().includes(q) ||
      r.asalSekolah.toLowerCase().includes(q),
    );
  }, [registrations, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Filter Gelombang:</span>
        <select value={selectedPeriodeId} onChange={(e) => onSelectPeriode(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Semua</option>
          {periodeList.map((p) => (<option key={p.id} value={p.id}>{p.nama}</option>))}
        </select>
      </div>

      {/* Pipeline Status */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {['menunggu_pembayaran', 'proses_pengisian', 'menunggu_tes', 'menunggu_pengumuman', 'diterima', 'ditolak'].map((status) => (
          <div key={status} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <p className="text-xs text-gray-500">{statusLabel(status)}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{statusCount[status] || 0}</p>
          </div>
        ))}
      </div>

      <Card title="Data Calon Siswa">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama, NISN, atau no pendaftaran..."
            className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2.5 font-medium text-gray-500 text-xs">No. Pendaftaran</th>
                <th className="py-2.5 font-medium text-gray-500 text-xs">Nama Siswa</th>
                <th className="py-2.5 font-medium text-gray-500 text-xs">NISN</th>
                <th className="py-2.5 font-medium text-gray-500 text-xs">Asal Sekolah</th>
                <th className="py-2.5 font-medium text-gray-500 text-xs">Status</th>
                <th className="py-2.5 font-medium text-gray-500 text-xs">Verifikasi</th>
                <th className="py-2.5 font-medium text-gray-500 text-xs">Tgl Daftar</th>
                <th className="py-2.5 font-medium text-gray-500 text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r) => {
                const verified = !!verifikasiData[r.id];
                return (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 font-mono text-xs text-gray-700">{r.noPendaftaran}</td>
                    <td className="py-2.5 font-medium text-gray-800">{r.namaLengkapSiswa}</td>
                    <td className="py-2.5 text-gray-600">{r.nisn}</td>
                    <td className="py-2.5 text-gray-600 max-w-[140px] truncate">{r.asalSekolah}</td>
                    <td className="py-2.5">
                      <Badge variant={statusBadgeVariant(r.statusAkhir)}>{statusLabel(r.statusAkhir)}</Badge>
                    </td>
                    <td className="py-2.5">
                      {verified ? (
                        <Badge variant="success">✓ Terverifikasi</Badge>
                      ) : (
                        <Badge variant="warning">Belum</Badge>
                      )}
                    </td>
                    <td className="py-2.5 text-gray-500 text-xs">{r.tanggalDaftar}</td>
                    <td className="py-2.5">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onLihatDetail(r)}
                          className="px-2 py-1 text-xs bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                          title="Lihat data lengkap"
                        >
                          👁 Detail
                        </button>
                        {!verified && (
                          <button
                            onClick={() => onVerifikasi(r.id)}
                            className="px-2 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            ✓ Verifikasi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400">Tidak ada data siswa</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
            <p className="text-xs text-gray-500">
              Menampilkan {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} dari {filtered.length} data
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-xs border rounded-md disabled:opacity-40 hover:bg-gray-50">←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)} className={`px-3 py-1 text-xs border rounded-md ${n === page ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`}>{n}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-xs border rounded-md disabled:opacity-40 hover:bg-gray-50">→</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ==================== TAB: Finalisasi ====================

function TabFinalisasi({
  registrations, finalisasiData, onOpenFinalisasi,
}: {
  registrations: SPMBRegistration[];
  finalisasiData: Record<string, { kelas: string; nis: string }>;
  onOpenFinalisasi: (id: string) => void;
}) {
  const sudahFinal = registrations.filter((r) => finalisasiData[r.id]).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Calon Diterima" value={registrations.length} icon="✅" color="green" />
        <StatCard title="Sudah Finalisasi" value={sudahFinal} icon="📋" color="blue" />
        <StatCard title="Belum Finalisasi" value={registrations.length - sudahFinal} icon="⏳" color="yellow" />
      </div>

      <Card title="Finalisasi Calon Siswa" subtitle="Atur kelas dan nomor induk siswa (NIS) untuk calon siswa yang diterima">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="py-2 font-medium text-gray-500">No. Pendaftaran</th>
              <th className="py-2 font-medium text-gray-500">Nama Siswa</th>
              <th className="py-2 font-medium text-gray-500">NISN</th>
              <th className="py-2 font-medium text-gray-500">Nilai Tes</th>
              <th className="py-2 font-medium text-gray-500">Kelas</th>
              <th className="py-2 font-medium text-gray-500">NIS</th>
              <th className="py-2 font-medium text-gray-500">Status</th>
              <th className="py-2 font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => {
              const fd = finalisasiData[r.id];
              return (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 font-medium text-gray-800">{r.noPendaftaran}</td>
                  <td className="py-2.5 text-gray-800">{r.namaLengkapSiswa}</td>
                  <td className="py-2.5 text-gray-600">{r.nisn}</td>
                  <td className="py-2.5 text-gray-600">{r.hasilTes?.nilai ?? '-'}</td>
                  <td className="py-2.5 text-gray-600">{fd?.kelas || '-'}</td>
                  <td className="py-2.5 text-gray-600 font-mono">{fd?.nis || '-'}</td>
                  <td className="py-2.5">
                    {fd ? <Badge variant="success">Final</Badge> : <Badge variant="warning">Belum Final</Badge>}
                  </td>
                  <td className="py-2.5">
                    <button
                      onClick={() => onOpenFinalisasi(r.id)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {fd ? 'Edit' : 'Finalisasi'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {registrations.length === 0 && (
              <tr><td colSpan={8} className="py-8 text-center text-gray-400">Belum ada calon siswa yang diterima</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ==================== Modal CBT Form ====================

function ModalCBTForm({
  isOpen, onClose, editCBT, formCBT, setFormCBT, onSave, onJenisChange,
}: {
  isOpen: boolean; onClose: () => void;
  editCBT: SPMBCBTSoal | null;
  formCBT: SPMBCBTSoal;
  setFormCBT: React.Dispatch<React.SetStateAction<SPMBCBTSoal>>;
  onSave: () => void;
  onJenisChange: (j: SPMBCBTJenisSoal) => void;
}) {
  const updateField = (field: string, value: string | number | string[] | Record<string, string>) => {
    setFormCBT((s) => ({ ...s, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editCBT ? 'Edit Soal CBT' : 'Tambah Soal CBT'} size="xl">
      <div className="space-y-4">
        {/* Jenis Soal + Mapel + Bobot */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Soal</label>
            <select value={formCBT.jenis} onChange={(e) => onJenisChange(e.target.value as SPMBCBTJenisSoal)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {CBT_JENIS_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.icon} {o.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
            <select value={formCBT.mapel} onChange={(e) => updateField('mapel', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {MAPEL_OPTIONS.map((m) => (<option key={m} value={m}>{m}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bobot</label>
            <input type="number" value={formCBT.bobot} onChange={(e) => updateField('bobot', Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>

        {/* Soal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan / Soal</label>
          <textarea value={formCBT.soal} onChange={(e) => updateField('soal', e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        {/* Pilihan Ganda & PG Kompleks */}
        {(formCBT.jenis === 'pilihan_ganda' || formCBT.jenis === 'pilihan_ganda_kompleks') && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-600">Pilihan Jawaban</p>
            {(['A', 'B', 'C', 'D', 'E'] as const).map((opt) => (
              <div key={opt} className="flex items-center gap-3">
                <span className="w-6 text-sm font-bold text-gray-500">{opt}.</span>
                <input type="text" value={(formCBT[`pilihan${opt}` as keyof SPMBCBTSoal] as string) || ''} onChange={(e) => updateField(`pilihan${opt}`, e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={`Pilihan ${opt}`} />
              </div>
            ))}
            {formCBT.jenis === 'pilihan_ganda' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kunci Jawaban</label>
                <select value={formCBT.kunciJawaban || 'A'} onChange={(e) => updateField('kunciJawaban', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {['A', 'B', 'C', 'D', 'E'].map((k) => (<option key={k} value={k}>{k}</option>))}
                </select>
              </div>
            )}
            {formCBT.jenis === 'pilihan_ganda_kompleks' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kunci Jawaban (bisa lebih dari satu)</label>
                <div className="flex gap-4 flex-wrap">
                  {(['A', 'B', 'C', 'D', 'E'] as const).map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={(formCBT.kunciJawabanArray || []).includes(opt)} onChange={(e) => {
                        const arr = formCBT.kunciJawabanArray || [];
                        updateField('kunciJawabanArray', e.target.checked ? [...arr, opt] : arr.filter((x) => x !== opt));
                      }} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-semibold text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Essay */}
        {formCBT.jenis === 'essay' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kunci Jawaban / Rubrik Penilaian</label>
            <textarea value={formCBT.jawabanEssay || ''} onChange={(e) => updateField('jawabanEssay', e.target.value)} rows={5} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Tulis kunci jawaban atau kriteria penilaian..." />
          </div>
        )}

        {/* Penjodohan */}
        {formCBT.jenis === 'penjodohan' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Pasangan Penjodohan (Kiri → Kanan)</label>
              <button type="button" onClick={() => {
                const kiri = [...(formCBT.pasanganKiri || []), ''];
                const kanan = [...(formCBT.pasanganKanan || []), ''];
                setFormCBT((s) => ({ ...s, pasanganKiri: kiri, pasanganKanan: kanan }));
              }} className="text-xs text-blue-600 hover:text-blue-800">+ Tambah Pasangan</button>
            </div>
            <div className="space-y-2">
              {(formCBT.pasanganKiri || []).map((kiri, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                  <input type="text" value={kiri} onChange={(e) => {
                    const arr = [...(formCBT.pasanganKiri || [])]; arr[i] = e.target.value;
                    setFormCBT((s) => ({ ...s, pasanganKiri: arr }));
                  }} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Kiri" />
                  <span className="text-gray-400">→</span>
                  <input type="text" value={(formCBT.pasanganKanan || [])[i] || ''} onChange={(e) => {
                    const arr = [...(formCBT.pasanganKanan || [])]; arr[i] = e.target.value;
                    setFormCBT((s) => ({ ...s, pasanganKanan: arr }));
                  }} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Kanan" />
                  <button type="button" onClick={() => {
                    const kiriArr = [...(formCBT.pasanganKiri || [])]; kiriArr.splice(i, 1);
                    const kananArr = [...(formCBT.pasanganKanan || [])]; kananArr.splice(i, 1);
                    setFormCBT((s) => ({ ...s, pasanganKiri: kiriArr, pasanganKanan: kananArr }));
                  }} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">* Pasangan kiri adalah pertanyaan/istilah, kanan adalah jawaban/pasangan yang benar.</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editCBT ? 'Simpan' : 'Tambah'}</button>
        </div>
      </div>
    </Modal>
  );
}

// ==================== Modal Detail Siswa ====================

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-gray-50">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right max-w-[60%]">{value || '-'}</span>
    </div>
  );
}

function ModalDetailSiswa({
  isOpen, onClose, registration, verified, onVerifikasi,
}: {
  isOpen: boolean; onClose: () => void;
  registration: SPMBRegistration;
  verified: boolean;
  onVerifikasi: (regId: string) => void;
}) {
  if (!registration) return null;

  const statusLabel = (s: string): string => {
    const m: Record<string, string> = {
      menunggu_pembayaran: 'Menunggu Pembayaran Formulir',
      proses_pengisian: 'Pengisian Data & Dokumen',
      menunggu_tes: 'Tes Ujian Masuk',
      menunggu_pengumuman: 'Menunggu Pengumuman',
      diterima: 'Daftar Ulang',
      ditolak: 'Ditolak',
    };
    return m[s] || s;
  };

  const statusBadgeVariant = (s: string): 'warning' | 'info' | 'success' | 'danger' | 'default' => {
    if (s === 'menunggu_pembayaran') return 'warning';
    if (s === 'proses_pengisian') return 'info';
    if (s === 'menunggu_tes' || s === 'menunggu_pengumuman') return 'default';
    if (s === 'diterima') return 'success';
    if (s === 'ditolak') return 'danger';
    return 'default';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detail: ${registration.namaLengkapSiswa}`} size="xl">
      <div className="space-y-6">
        {/* Status & Verifikasi */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Status Pendaftaran:</span>
            <Badge variant={statusBadgeVariant(registration.statusAkhir)}>{statusLabel(registration.statusAkhir)}</Badge>
          </div>
          <div>
            {verified ? (
              <Badge variant="success">✓ Terverifikasi</Badge>
            ) : (
              <button
                onClick={() => onVerifikasi(registration.id)}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Verifikasi Data
              </button>
            )}
          </div>
        </div>

        {/* Data Pendaftaran */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📋</span> Data Pendaftaran
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-0">
            <InfoRow label="No. Pendaftaran" value={registration.noPendaftaran} />
            <InfoRow label="Jenis Daftar" value={registration.jenisDaftar === 'reguler' ? 'Reguler' : 'Mutasi'} />
            <InfoRow label="Tahun Ajaran" value={registration.tahunAjaran} />
            <InfoRow label="Tanggal Daftar" value={registration.tanggalDaftar} />
            <InfoRow label="Asal Sekolah" value={registration.asalSekolah} />
          </div>
        </div>

        {/* Data Pribadi */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>👤</span> Data Pribadi
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-0">
            <InfoRow label="Nama Lengkap" value={registration.namaLengkapSiswa} />
            <InfoRow label="NISN" value={registration.nisn} />
            <InfoRow label="Tempat, Tgl Lahir" value={`${registration.tempatLahir}, ${registration.tanggalLahir}`} />
            <InfoRow label="Jenis Kelamin" value={registration.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
            <InfoRow label="Alamat" value={registration.alamat} />
            <InfoRow label="Email" value={registration.email} />
            <InfoRow label="No. Telepon" value={registration.noTelp} />
          </div>
        </div>

        {/* Data Orang Tua */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>👨‍👩‍👧</span> Data Orang Tua
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-0">
            <InfoRow label="Nama Ayah" value={registration.namaAyah} />
            <InfoRow label="Nama Ibu" value={registration.namaIbu} />
            {registration.dataOrangTua && (
              <>
                <InfoRow label="Pekerjaan Ayah" value={registration.dataOrangTua.pekerjaanAyah} />
                <InfoRow label="Pekerjaan Ibu" value={registration.dataOrangTua.pekerjaanIbu} />
                <InfoRow label="Pendidikan Ayah" value={registration.dataOrangTua.pendidikanAyah} />
                <InfoRow label="Pendidikan Ibu" value={registration.dataOrangTua.pendidikanIbu} />
                <InfoRow label="Penghasilan Ortu" value={registration.dataOrangTua.penghasilanOrangTua} />
                <InfoRow label="Alamat Ortu" value={registration.dataOrangTua.alamatOrangTua} />
                {registration.dataOrangTua.namaWali && <InfoRow label="Nama Wali" value={registration.dataOrangTua.namaWali} />}
                {registration.dataOrangTua.noTelpWali && <InfoRow label="No. Telp Wali" value={registration.dataOrangTua.noTelpWali} />}
              </>
            )}
            {!registration.dataOrangTua && <p className="text-xs text-gray-400 py-2">Belum mengisi data orang tua</p>}
          </div>
        </div>

        {/* Data Tambahan Siswa */}
        {registration.dataSiswa && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>📝</span> Data Tambahan
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-0">
              <InfoRow label="Agama" value={registration.dataSiswa.agama} />
              <InfoRow label="Anak Ke" value={registration.dataSiswa.anakKe} />
              <InfoRow label="Jumlah Saudara" value={registration.dataSiswa.jumlahSaudara} />
              {registration.dataSiswa.golonganDarah && <InfoRow label="Golongan Darah" value={registration.dataSiswa.golonganDarah} />}
              {registration.dataSiswa.hobi && <InfoRow label="Hobi" value={registration.dataSiswa.hobi} />}
              {registration.dataSiswa.citaCita && <InfoRow label="Cita-cita" value={registration.dataSiswa.citaCita} />}
              {registration.dataSiswa.tinggiBadan && <InfoRow label="Tinggi Badan" value={`${registration.dataSiswa.tinggiBadan} cm`} />}
              {registration.dataSiswa.beratBadan && <InfoRow label="Berat Badan" value={`${registration.dataSiswa.beratBadan} kg`} />}
            </div>
          </div>
        )}

        {/* Dokumen */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📄</span> Dokumen Pendukung
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {registration.dokumen && registration.dokumen.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="py-2 font-medium text-gray-500 text-xs">Jenis</th>
                    <th className="py-2 font-medium text-gray-500 text-xs">Nama File</th>
                    <th className="py-2 font-medium text-gray-500 text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {registration.dokumen.map((d) => (
                    <tr key={d.id} className="border-b border-gray-50">
                      <td className="py-2 text-gray-700 capitalize">{d.jenis.replace(/_/g, ' ')}</td>
                      <td className="py-2 text-gray-600">{d.namaFile}</td>
                      <td className="py-2">
                        {d.status === 'diverifikasi' ? <Badge variant="success">Diverifikasi</Badge> :
                         d.status === 'terupload' ? <Badge variant="info">Terupload</Badge> :
                         d.status === 'ditolak' ? <Badge variant="danger">Ditolak</Badge> :
                         <Badge variant="warning">Belum Upload</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xs text-gray-400 py-2">Belum ada dokumen yang diupload</p>
            )}
          </div>
        </div>

        {/* Pembayaran */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>💳</span> Pembayaran
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-0">
            <InfoRow label="Biaya Formulir" value={`Rp ${registration.biayaFormulir.toLocaleString('id-ID')}`} />
            <InfoRow label="No. Virtual Account" value={registration.noVA} />
            <InfoRow label="Status Bayar" value={registration.statusBayarFormulir === 'sudah_bayar' ? 'Sudah Bayar' : 'Belum Bayar'} />
          </div>
        </div>

        {/* Tes */}
        {registration.hasilTes && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>📝</span> Hasil Tes
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-0">
              <InfoRow label="Status Tes" value={registration.hasilTes.status === 'selesai' ? 'Selesai' : registration.hasilTes.status === 'terjadwal' ? 'Terjadwal' : 'Belum Terjadwal'} />
              {registration.hasilTes.tanggalTes && <InfoRow label="Tanggal Tes" value={registration.hasilTes.tanggalTes} />}
              {registration.hasilTes.nilai != null && <InfoRow label="Nilai" value={registration.hasilTes.nilai} />}
              {registration.hasilTes.catatan && <InfoRow label="Catatan" value={registration.hasilTes.catatan} />}
            </div>
          </div>
        )}

        {/* Akun */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>🔐</span> Akun
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-0">
            <InfoRow label="Username" value={registration.username} />
            <InfoRow label="Password" value={registration.password} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ==================== Modal Finalisasi ====================

function ModalFinalisasi({
  isOpen, onClose, registration, existingData, onFinalisasi,
}: {
  isOpen: boolean; onClose: () => void;
  registration: SPMBRegistration | null;
  existingData?: { kelas: string; nis: string };
  onFinalisasi: (regId: string, kelas: string, nis: string) => void;
}) {
  const [kelas, setKelas] = useState(existingData?.kelas || 'X-IPA-1');
  const [nis, setNis] = useState(existingData?.nis || '');

  const handleSubmit = () => {
    if (registration && kelas && nis) {
      onFinalisasi(registration.id, kelas, nis);
    }
  };

  if (!registration) return null;

  const kelasOptions = [
    'X-IPA-1', 'X-IPA-2', 'X-IPA-3',
    'X-IPS-1', 'X-IPS-2',
    'X-Bahasa',
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Finalisasi Calon Siswa" size="md">
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">No. Pendaftaran</span>
            <span className="font-medium text-gray-800">{registration.noPendaftaran}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Nama</span>
            <span className="font-medium text-gray-800">{registration.namaLengkapSiswa}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">NISN</span>
            <span className="font-medium text-gray-800">{registration.nisn}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Nilai Tes</span>
            <span className="font-medium text-gray-800">{registration.hasilTes?.nilai ?? '-'}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kelas</label>
          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {kelasOptions.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Induk Siswa (NIS)</label>
          <input
            type="text"
            value={nis}
            onChange={(e) => setNis(e.target.value)}
            placeholder="Masukkan NIS"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
          <button
            onClick={handleSubmit}
            disabled={!kelas || !nis}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Finalisasi
          </button>
        </div>
      </div>
    </Modal>
  );
}
