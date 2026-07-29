'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { FormField, FormActions } from '@/components/ui/FormField';
import { useRouter, useParams } from 'next/navigation';
import {
  dummyRaporConfig,
  dummyRaporKurikulum,
  dummyRaporMapel,
  dummyRaporEkstra,
} from '@/data/akademik';
import type {
  RaporConfig,
  RaporStatus,
  RaporKurikulumData,
  KategoriPenilaian,
  JenisPenilaian,
  TemplateCatatanWali,
  RaporMapelItem,
  RaporEkstraItem,
} from '@/types';

// ─── tab definition ────────────────────────────────────────
type Tab = 'informasi' | 'kurikulum' | 'mapel' | 'ekstrakurikuler';

const tabs: { key: Tab; label: string }[] = [
  { key: 'informasi', label: 'Informasi Rapor' },
  { key: 'kurikulum', label: 'Pengaturan Kurikulum' },
  { key: 'mapel', label: 'Pengaturan Mata Pelajaran' },
  { key: 'ekstrakurikuler', label: 'Pengaturan Ekstrakurikuler' },
];

// ─── helpers ───────────────────────────────────────────────
const statusBadge: Record<RaporStatus, string> = {
  Aktif: 'bg-green-100 text-green-700',
  Draft: 'bg-yellow-100 text-yellow-700',
  Selesai: 'bg-gray-100 text-gray-600',
};

function formatDateInput(d: string) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function parseDateInput(v: string) {
  const parts = v.split('/');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return v;
}

// ─── icons ─────────────────────────────────────────────────
const IconSave = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// ─── main component ────────────────────────────────────────
function KonfigurasiRaporContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const raporId = params.raporId as string;

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  // ─── find rapor ───
  const rapor = dummyRaporConfig.find(r => r.id === raporId);
  useEffect(() => {
    if (!rapor) router.push('/akademik/pengaturan-rapor');
  }, [rapor, router]);

  // ─── active tab ───
  const [tab, setTab] = useState<Tab>('informasi');

  // ─── informasi rapor form ───
  const [info, setInfo] = useState({
    nama: rapor?.nama ?? '',
    tahunAjaran: rapor?.tahunAjaran ?? '',
    semester: rapor?.semester ?? 'Ganjil' as 'Ganjil' | 'Genap',
    tanggalCetak: formatDateInput(rapor?.tanggalCetak ?? ''),
    kkm: rapor?.kkm ?? 75,
    batasInputMulai: formatDateInput(rapor?.batasInputMulai ?? ''),
    batasInputSelesai: formatDateInput(rapor?.batasInputSelesai ?? ''),
    status: rapor?.status ?? 'Aktif' as RaporStatus,
    peringkat: rapor?.fitur.peringkat ?? true,
    absensi: rapor?.fitur.absensi ?? true,
    ekskul: rapor?.fitur.ekskul ?? true,
    catatanKepalaSekolah: '',
  });

  // ─── kurikulum state ───
  const [kurikulum, setKurikulum] = useState<RaporKurikulumData>(dummyRaporKurikulum);

  // ─── mapel state ───
  const [mapelList, setMapelList] = useState<RaporMapelItem[]>(dummyRaporMapel);

  // ─── ekstra state ───
  const [ekstraList, setEkstraList] = useState<RaporEkstraItem[]>(dummyRaporEkstra);

  // ─── toast ───
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  if (!rapor) return null;

  // ─── save handlers ───
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Informasi rapor berhasil disimpan.');
  };

  const handleSaveKurikulum = () => {
    showToast('Pengaturan kurikulum berhasil disimpan.');
  };

  const handleSaveMapel = () => {
    showToast('Pengaturan mata pelajaran berhasil disimpan.');
  };

  const handleSaveEkstra = () => {
    showToast('Pengaturan ekstrakurikuler berhasil disimpan.');
  };

  // ─── kurikulum helpers ───
  const addKategori = (jenis: 'kategoriAkademik' | 'kategoriNonAkademik') => {
    const newItem: KategoriPenilaian = {
      id: `k${Date.now()}`,
      nama: 'Kategori Baru',
      jenisPenilaian: [],
    };
    setKurikulum(prev => ({
      ...prev,
      [jenis]: [...prev[jenis], newItem],
    }));
  };

  const removeKategori = (jenis: 'kategoriAkademik' | 'kategoriNonAkademik', id: string) => {
    setKurikulum(prev => ({
      ...prev,
      [jenis]: prev[jenis].filter(k => k.id !== id),
    }));
  };

  const addJenisPenilaian = (kategoriId: string, jenis: 'kategoriAkademik' | 'kategoriNonAkademik') => {
    setKurikulum(prev => ({
      ...prev,
      [jenis]: prev[jenis].map(k =>
        k.id === kategoriId
          ? { ...k, jenisPenilaian: [...k.jenisPenilaian, { id: `jp${Date.now()}`, nama: 'Jenis Baru', bobot: 0 }] }
          : k
      ),
    }));
  };

  const removeJenisPenilaian = (kategoriId: string, jenis: 'kategoriAkademik' | 'kategoriNonAkademik', jpId: string) => {
    setKurikulum(prev => ({
      ...prev,
      [jenis]: prev[jenis].map(k =>
        k.id === kategoriId
          ? { ...k, jenisPenilaian: k.jenisPenilaian.filter(j => j.id !== jpId) }
          : k
      ),
    }));
  };

  const addTemplate = () => {
    setKurikulum(prev => ({
      ...prev,
      templateCatatan: [...prev.templateCatatan, { id: `tc${Date.now()}`, nama: 'Template Baru', teks: '' }],
    }));
  };

  const removeTemplate = (id: string) => {
    setKurikulum(prev => ({
      ...prev,
      templateCatatan: prev.templateCatatan.filter(t => t.id !== id),
    }));
  };

  // ─── group mapel for display ───
  const mapelGroups = Array.from(new Set(mapelList.map(m => m.groupNama)));

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 px-5 py-3 bg-green-600 text-white text-sm rounded-lg shadow-lg animate-pulse">
            ✅ {toast}
          </div>
        )}

        {/* ── header ── */}
        <div>
          <p className="text-sm text-gray-400">Akademik &gt; Pengaturan Rapor &gt; Konfigurasi</p>
          <h1 className="text-xl font-bold text-gray-800 mt-0.5">{rapor.nama}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {rapor.semester} · {rapor.tahunAjaran}
          </p>
        </div>

        {/* ── tabs ── */}
        <div className="flex border-b border-gray-200 gap-0 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════
            TAB 1 – Informasi Rapor
           ═══════════════════════════════════════════════════ */}
        {tab === 'informasi' && (
          <Card title="Informasi Rapor" subtitle="Atur informasi dasar dan fitur yang ditampilkan pada rapor.">
            <form onSubmit={handleSaveInfo}>
              <FormField
                label="Nama Konfigurasi" name="nama" value={info.nama}
                onChange={(e) => setInfo({ ...info, nama: e.target.value })}
                placeholder="Nama konfigurasi rapor" required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Tahun Ajaran" name="tahunAjaran" value={info.tahunAjaran}
                  onChange={(e) => setInfo({ ...info, tahunAjaran: e.target.value })}
                  placeholder="2026/2027" required
                />
                <FormField
                  label="Semester" name="semester" type="select" value={info.semester}
                  onChange={(e) => setInfo({ ...info, semester: e.target.value as 'Ganjil' | 'Genap' })}
                  options={[{ value: 'Ganjil', label: 'Ganjil' }, { value: 'Genap', label: 'Genap' }]} required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  label="Tanggal Cetak" name="tanggalCetak" value={info.tanggalCetak}
                  onChange={(e) => setInfo({ ...info, tanggalCetak: e.target.value })}
                  placeholder="DD/MM/YYYY" required
                />
                <FormField
                  label="KKM" name="kkm" type="number" value={info.kkm}
                  onChange={(e) => setInfo({ ...info, kkm: +e.target.value })}
                  placeholder="75" required
                />
                <FormField
                  label="Status" name="status" type="select" value={info.status}
                  onChange={(e) => setInfo({ ...info, status: e.target.value as RaporStatus })}
                  options={[
                    { value: 'Aktif', label: 'Aktif' },
                    { value: 'Draft', label: 'Draft' },
                    { value: 'Selesai', label: 'Selesai' },
                  ]} required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Batas Input Mulai" name="batasInputMulai" value={info.batasInputMulai}
                  onChange={(e) => setInfo({ ...info, batasInputMulai: e.target.value })}
                  placeholder="DD/MM/YYYY" required
                />
                <FormField
                  label="Batas Input Akhir" name="batasInputSelesai" value={info.batasInputSelesai}
                  onChange={(e) => setInfo({ ...info, batasInputSelesai: e.target.value })}
                  placeholder="DD/MM/YYYY" required
                />
              </div>

              {/* fitur checkboxes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fitur Rapor</label>
                <div className="flex flex-wrap gap-4">
                  {(['peringkat', 'absensi', 'ekskul'] as const).map(f => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={info[f]}
                        onChange={(e) => setInfo({ ...info, [f]: e.target.checked })}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        {f === 'peringkat' ? 'Tampilkan Peringkat' : f === 'absensi' ? 'Tampilkan Absensi' : 'Tampilkan Ekskul'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <FormField
                label="Catatan Kepala Sekolah" name="catatanKepalaSekolah" type="textarea"
                value={info.catatanKepalaSekolah}
                onChange={(e) => setInfo({ ...info, catatanKepalaSekolah: e.target.value })}
                placeholder="Catatan dari kepala sekolah (opsional)" rows={3}
              />

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <IconSave />
                  Simpan Informasi
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* ═══════════════════════════════════════════════════
            TAB 2 – Pengaturan Kurikulum
           ═══════════════════════════════════════════════════ */}
        {tab === 'kurikulum' && (
          <div className="space-y-5">
            {/* Kategori Akademik */}
            <Card
              title="Kategori Akademik"
              subtitle="Total bobot jenis penilaian per kategori harus 100."
              action={
                <button
                  onClick={() => addKategori('kategoriAkademik')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <IconPlus /> Kategori
                </button>
              }
            >
              {kurikulum.kategoriAkademik.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">Belum ada kategori akademik.</p>
              ) : (
                <div className="space-y-4">
                  {kurikulum.kategoriAkademik.map(k => (
                    <div key={k.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={k.nama}
                          onChange={(e) =>
                            setKurikulum(prev => ({
                              ...prev,
                              kategoriAkademik: prev.kategoriAkademik.map(kk =>
                                kk.id === k.id ? { ...kk, nama: e.target.value } : kk
                              ),
                            }))
                          }
                          className="text-sm font-semibold text-gray-800 border-b border-gray-200 focus:border-green-500 outline-none px-1 py-0.5"
                        />
                        <button
                          onClick={() => removeKategori('kategoriAkademik', k.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <IconTrash />
                        </button>
                      </div>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                            <th className="pb-2 font-medium">Jenis Penilaian</th>
                            <th className="pb-2 font-medium w-24">Bobot (%)</th>
                            <th className="pb-2 font-medium w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {k.jenisPenilaian.map(jp => (
                            <tr key={jp.id} className="border-t border-gray-100">
                              <td className="py-2 pr-2">
                                <input
                                  type="text"
                                  value={jp.nama}
                                  onChange={(e) =>
                                    setKurikulum(prev => ({
                                      ...prev,
                                      kategoriAkademik: prev.kategoriAkademik.map(kk =>
                                        kk.id === k.id
                                          ? {
                                              ...kk,
                                              jenisPenilaian: kk.jenisPenilaian.map(j =>
                                                j.id === jp.id ? { ...j, nama: e.target.value } : j
                                              ),
                                            }
                                          : kk
                                      ),
                                    }))
                                  }
                                  className="w-full text-gray-700 border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                                />
                              </td>
                              <td className="py-2 pr-2">
                                <input
                                  type="number"
                                  value={jp.bobot}
                                  onChange={(e) =>
                                    setKurikulum(prev => ({
                                      ...prev,
                                      kategoriAkademik: prev.kategoriAkademik.map(kk =>
                                        kk.id === k.id
                                          ? {
                                              ...kk,
                                              jenisPenilaian: kk.jenisPenilaian.map(j =>
                                                j.id === jp.id ? { ...j, bobot: +e.target.value } : j
                                              ),
                                            }
                                          : kk
                                      ),
                                    }))
                                  }
                                  className="w-full text-gray-700 border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm text-center"
                                  min="0"
                                  max="100"
                                />
                              </td>
                              <td className="py-2 text-center">
                                <button
                                  onClick={() => removeJenisPenilaian(k.id, 'kategoriAkademik', jp.id)}
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                  <IconTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button
                        onClick={() => addJenisPenilaian(k.id, 'kategoriAkademik')}
                        className="mt-3 text-xs text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1"
                      >
                        <IconPlus /> Tambah Jenis Penilaian
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Kategori Non-Akademik */}
            <Card
              title="Kategori Non-Akademik"
              action={
                <button
                  onClick={() => addKategori('kategoriNonAkademik')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <IconPlus /> Kategori
                </button>
              }
            >
              {kurikulum.kategoriNonAkademik.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">Belum ada kategori non-akademik.</p>
              ) : (
                <div className="space-y-4">
                  {kurikulum.kategoriNonAkademik.map(k => (
                    <div key={k.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={k.nama}
                          onChange={(e) =>
                            setKurikulum(prev => ({
                              ...prev,
                              kategoriNonAkademik: prev.kategoriNonAkademik.map(kk =>
                                kk.id === k.id ? { ...kk, nama: e.target.value } : kk
                              ),
                            }))
                          }
                          className="text-sm font-semibold text-gray-800 border-b border-gray-200 focus:border-green-500 outline-none px-1 py-0.5"
                        />
                        <button
                          onClick={() => removeKategori('kategoriNonAkademik', k.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <IconTrash />
                        </button>
                      </div>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                            <th className="pb-2 font-medium">Jenis Penilaian</th>
                            <th className="pb-2 font-medium w-24">Bobot (%)</th>
                            <th className="pb-2 font-medium w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {k.jenisPenilaian.map(jp => (
                            <tr key={jp.id} className="border-t border-gray-100">
                              <td className="py-2 pr-2">
                                <input
                                  type="text"
                                  value={jp.nama}
                                  onChange={(e) =>
                                    setKurikulum(prev => ({
                                      ...prev,
                                      kategoriNonAkademik: prev.kategoriNonAkademik.map(kk =>
                                        kk.id === k.id
                                          ? {
                                              ...kk,
                                              jenisPenilaian: kk.jenisPenilaian.map(j =>
                                                j.id === jp.id ? { ...j, nama: e.target.value } : j
                                              ),
                                            }
                                          : kk
                                      ),
                                    }))
                                  }
                                  className="w-full text-gray-700 border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                                />
                              </td>
                              <td className="py-2 pr-2">
                                <input
                                  type="number"
                                  value={jp.bobot}
                                  onChange={(e) =>
                                    setKurikulum(prev => ({
                                      ...prev,
                                      kategoriNonAkademik: prev.kategoriNonAkademik.map(kk =>
                                        kk.id === k.id
                                          ? {
                                              ...kk,
                                              jenisPenilaian: kk.jenisPenilaian.map(j =>
                                                j.id === jp.id ? { ...j, bobot: +e.target.value } : j
                                              ),
                                            }
                                          : kk
                                      ),
                                    }))
                                  }
                                  className="w-full text-gray-700 border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm text-center"
                                  min="0"
                                  max="100"
                                />
                              </td>
                              <td className="py-2 text-center">
                                <button
                                  onClick={() => removeJenisPenilaian(k.id, 'kategoriNonAkademik', jp.id)}
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                  <IconTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button
                        onClick={() => addJenisPenilaian(k.id, 'kategoriNonAkademik')}
                        className="mt-3 text-xs text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1"
                      >
                        <IconPlus /> Tambah Jenis Penilaian
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Template Catatan Wali Kelas */}
            <Card
              title="Template Catatan Wali Kelas"
              action={
                <button
                  onClick={addTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <IconPlus /> Template
                </button>
              }
            >
              {kurikulum.templateCatatan.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">Belum ada template catatan.</p>
              ) : (
                <div className="space-y-3">
                  {kurikulum.templateCatatan.map(t => (
                    <div key={t.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={t.nama}
                          onChange={(e) =>
                            setKurikulum(prev => ({
                              ...prev,
                              templateCatatan: prev.templateCatatan.map(tt =>
                                tt.id === t.id ? { ...tt, nama: e.target.value } : tt
                              ),
                            }))
                          }
                          className="text-sm font-semibold text-gray-800 border-b border-gray-200 focus:border-green-500 outline-none px-1 py-0.5"
                          placeholder="Nama template"
                        />
                        <button
                          onClick={() => removeTemplate(t.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <IconTrash />
                        </button>
                      </div>
                      <textarea
                        value={t.teks}
                        onChange={(e) =>
                          setKurikulum(prev => ({
                            ...prev,
                            templateCatatan: prev.templateCatatan.map(tt =>
                              tt.id === t.id ? { ...tt, teks: e.target.value } : tt
                            ),
                          }))
                        }
                        className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                        rows={2}
                        placeholder="Isi template catatan..."
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* save button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveKurikulum}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <IconSave />
                Simpan Kurikulum
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            TAB 3 – Pengaturan Mata Pelajaran
           ═══════════════════════════════════════════════════ */}
        {tab === 'mapel' && (
          <div className="space-y-5">
            {mapelGroups.map(group => (
              <Card key={group} title={group}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                      <th className="pb-3 font-medium w-20">KODE</th>
                      <th className="pb-3 font-medium">MATA PELAJARAN</th>
                      <th className="pb-3 font-medium w-20 text-center">TAMPIL DI RAPOR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mapelList.filter(m => m.groupNama === group).map(m => (
                      <tr key={m.mapelId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3">
                          <span className="text-xs font-mono font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {m.kode}
                          </span>
                        </td>
                        <td className="py-3">
                          <p className="text-gray-800 font-medium">{m.nama}</p>
                        </td>
                        <td className="py-3 text-center">
                          <input
                            type="checkbox"
                            checked={m.tampil}
                            onChange={() =>
                              setMapelList(prev =>
                                prev.map(mm =>
                                  mm.mapelId === m.mapelId ? { ...mm, tampil: !mm.tampil } : mm
                                )
                              )
                            }
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ))}

            <div className="flex justify-end">
              <button
                onClick={handleSaveMapel}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <IconSave />
                Simpan Mata Pelajaran
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            TAB 4 – Pengaturan Ekstrakurikuler
           ═══════════════════════════════════════════════════ */}
        {tab === 'ekstrakurikuler' && (
          <div className="space-y-5">
            <Card title="Daftar Ekstrakurikuler">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    <th className="pb-3 font-medium">NAMA EKSTRAKURIKULER</th>
                    <th className="pb-3 font-medium w-20 text-center">TAMPIL DI RAPOR</th>
                  </tr>
                </thead>
                <tbody>
                  {ekstraList.map(e => (
                    <tr key={e.ekstraId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3">
                        <p className="text-gray-800 font-medium">{e.nama}</p>
                      </td>
                      <td className="py-3 text-center">
                        <input
                          type="checkbox"
                          checked={e.tampil}
                          onChange={() =>
                            setEkstraList(prev =>
                              prev.map(ee =>
                                ee.ekstraId === e.ekstraId ? { ...ee, tampil: !ee.tampil } : ee
                              )
                            )
                          }
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <div className="flex justify-end">
              <button
                onClick={handleSaveEkstra}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <IconSave />
                Simpan Ekstrakurikuler
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function KonfigurasiRaporPage() {
  return <KonfigurasiRaporContent />;
}
