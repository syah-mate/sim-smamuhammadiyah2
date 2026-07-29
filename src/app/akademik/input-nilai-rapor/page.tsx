'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/navigation';
import {
  dummyRaporConfig,
  dummyMapelInputNilai,
  dummyMapelKDCount,
  dummyKelasNilai,
  dummySiswaNilai,
  dummyKompetensiNilai,
  dummyJenisPenilaianNilai,
} from '@/data/akademik';
import {
  RaporConfig, Mapel,
} from '@/types';
import type { KelasNilai, SiswaNilai, KompetensiNilai, IndikatorNilai, JenisPenilaianNilai, NilaiSiswaEntry } from '@/data/akademik';

// ─── helpers ───────────────────────────────────────────────
function formatDate(d: string) {
  if (!d) return '-';
  const [y, m, day] = d.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${day} ${months[+m - 1]} ${y}`;
}

const statusBadge: Record<string, string> = {
  Aktif: 'bg-green-100 text-green-700',
  Draft: 'bg-yellow-100 text-yellow-700',
  Selesai: 'bg-gray-100 text-gray-600',
};

// ─── icons ─────────────────────────────────────────────────
const IconSearch = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconChevronDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

// ─── Step Label Component ──────────────────────────────────
function StepLabel({ num, label, value, isDone, isActive }: {
  num: number; label: string; value: string; isDone: boolean; isActive: boolean;
}) {
  const circleClass = isDone
    ? 'bg-green-500 text-white'
    : isActive
      ? 'bg-blue-600 text-white'
      : 'bg-gray-200 text-gray-500';
  const textClass = isActive ? 'text-blue-700 font-semibold' : isDone ? 'text-green-700' : 'text-gray-500';

  return (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${circleClass}`}>
        {isDone ? <IconCheck /> : num}
      </div>
      <div className="min-w-0">
        <p className={`text-xs ${textClass}`}>{label}</p>
        <p className={`text-sm truncate ${isActive ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function StepConnector({ isDone }: { isDone: boolean }) {
  return (
    <div className={`flex-1 h-0.5 mx-2 shrink-0 ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />
  );
}

// ─── Main Component ────────────────────────────────────────
function InputNilaiRaporContent() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  // ── Step state ──
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRapor, setSelectedRapor] = useState<RaporConfig | null>(null);
  const [selectedMapel, setSelectedMapel] = useState<typeof dummyMapelInputNilai[0] | null>(null);
  const [selectedKelas, setSelectedKelas] = useState<KelasNilai | null>(null);

  // ── Filter state ──
  const [filterTahun, setFilterTahun] = useState('Semua');

  // ── Step 4 state ──
  const [selectedJenisPenilaian, setSelectedJenisPenilaian] = useState<string>('jpn3'); // Nilai Harian
  const [searchSiswa, setSearchSiswa] = useState('');
  const [nilaiEntries, setNilaiEntries] = useState<NilaiSiswaEntry[]>([]);

  // ── Tahun options ──
  const tahunOptions = useMemo(() => {
    const set = new Set(dummyRaporConfig.map(r => r.tahunAjaran));
    return ['Semua', ...Array.from(set).sort()];
  }, []);

  // ── Filtered rapor ──
  const filteredRapor = useMemo(() => {
    if (filterTahun === 'Semua') return dummyRaporConfig;
    return dummyRaporConfig.filter(r => r.tahunAjaran === filterTahun);
  }, [filterTahun]);

  // ── Kompetensi untuk mapel terpilih ──
  const kompetensiList = useMemo(() => {
    if (!selectedMapel) return [];
    return dummyKompetensiNilai.filter(k => k.mapelId === selectedMapel.mapelId);
  }, [selectedMapel]);

  // ── Semua indikator flatten ──
  const allIndikator = useMemo(() => {
    return kompetensiList.flatMap(k => k.indikator.map(i => ({ ...i, kompetensiKode: k.kode, kompetensiNama: k.nama, kompetensiId: k.id })));
  }, [kompetensiList]);

  // ── Siswa untuk kelas terpilih ──
  const siswaKelas = useMemo(() => {
    if (!selectedKelas) return [];
    return dummySiswaNilai.filter(s => s.kelasId === selectedKelas.id);
  }, [selectedKelas]);

  const filteredSiswa = useMemo(() => {
    if (!searchSiswa) return siswaKelas;
    const q = searchSiswa.toLowerCase();
    return siswaKelas.filter(s => s.nama.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q));
  }, [siswaKelas, searchSiswa]);

  const jenisPenilaianActive = useMemo(() => {
    return dummyJenisPenilaianNilai.find(j => j.id === selectedJenisPenilaian) || null;
  }, [selectedJenisPenilaian]);

  // ── handlers ──
  const handleSelectRapor = (r: RaporConfig) => {
    setSelectedRapor(r);
    setSelectedMapel(null);
    setSelectedKelas(null);
    setStep(2);
  };

  const handleSelectMapel = (m: typeof dummyMapelInputNilai[0]) => {
    setSelectedMapel(m);
    setSelectedKelas(null);
    setStep(3);
  };

  const handleSelectKelas = (k: KelasNilai) => {
    setSelectedKelas(k);
    setStep(4);
    // init nilai entries empty
    setNilaiEntries([]);
  };

  const handleBackToRapor = () => { setStep(1); setSelectedMapel(null); setSelectedKelas(null); };
  const handleBackToMapel = () => { setStep(2); setSelectedKelas(null); };

  const handleNilaiChange = (siswaId: string, indikatorId: string, val: string) => {
    const numVal = val === '' ? null : Number(val);
    setNilaiEntries(prev => {
      const idx = prev.findIndex(e => e.siswaId === siswaId && e.indikatorId === indikatorId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], nilai: numVal };
        return next;
      }
      return [...prev, { siswaId, indikatorId, nilai: numVal }];
    });
  };

  const getNilai = (siswaId: string, indikatorId: string): string => {
    const entry = nilaiEntries.find(e => e.siswaId === siswaId && e.indikatorId === indikatorId);
    return entry?.nilai != null ? String(entry.nilai) : '';
  };

  // ── carousel state ──
  const [indikatorScroll, setIndikatorScroll] = useState(0);
  const CAROUSEL_VISIBLE = 4; // show 4 indicator cards at a time

  const canScrollLeft = indikatorScroll > 0;
  const canScrollRight = indikatorScroll + CAROUSEL_VISIBLE < allIndikator.length;

  const scrollLeft = () => setIndikatorScroll(prev => Math.max(0, prev - 1));
  const scrollRight = () => setIndikatorScroll(prev => Math.min(allIndikator.length - CAROUSEL_VISIBLE, prev + 1));

  const visibleIndikator = allIndikator.slice(indikatorScroll, indikatorScroll + CAROUSEL_VISIBLE);

  // Total possible nilai entries (siswa × indikator)
  const totalNilaiPossible = siswaKelas.length * allIndikator.length;
  const totalNilaiTerisi = nilaiEntries.filter(e => e.nilai != null).length;

  const filledIndikator = useMemo(() => {
    const filled = new Set<string>();
    nilaiEntries.forEach(e => {
      if (e.nilai != null) filled.add(e.indikatorId);
    });
    return filled.size;
  }, [nilaiEntries]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* ── header ── */}
        <div>
          <p className="text-sm text-gray-400">Akademik &gt; Input Nilai Rapor</p>
          <h1 className="text-2xl font-bold text-gray-800 mt-0.5">Input Nilai Rapor</h1>
          <p className="text-gray-500 mt-1">Masukkan nilai rapor siswa per mata pelajaran dan kelas.</p>
        </div>

        {/* ── stepper ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-1 flex-wrap">
            <StepLabel
              num={1} label="RAPOR"
              value={selectedRapor ? selectedRapor.nama : 'Belum dipilih'}
              isDone={!!selectedRapor} isActive={step === 1}
            />
            <StepConnector isDone={!!selectedRapor} />
            <StepLabel
              num={2} label="MATA PELAJARAN"
              value={selectedMapel ? `${selectedMapel.kode} – ${selectedMapel.nama}` : 'Belum dipilih'}
              isDone={!!selectedMapel} isActive={step === 2}
            />
            <StepConnector isDone={!!selectedMapel} />
            <StepLabel
              num={3} label="KELAS"
              value={selectedKelas ? selectedKelas.nama : 'Belum dipilih'}
              isDone={!!selectedKelas} isActive={step === 3}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            STEP 1 – Pilih Rapor
            ═══════════════════════════════════════════════════ */}
        {step <= 1 && (
          <div className="space-y-4">
            {/* tahun filter pills */}
            <div className="flex flex-wrap gap-2">
              {tahunOptions.map(t => (
                <button
                  key={t}
                  onClick={() => setFilterTahun(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filterTahun === t
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t === 'Semua' ? 'Semua' : t}
                </button>
              ))}
            </div>

            {/* rapor cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRapor.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleSelectRapor(r)}
                  className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-700">{r.nama}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[r.status] || 'bg-gray-100 text-gray-700'}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {r.tahunAjaran} · Sem. {r.semester} · Batas input: {formatDate(r.batasInputMulai)} — {formatDate(r.batasInputSelesai)}
                  </p>
                </button>
              ))}
              {filteredRapor.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-400">
                  Tidak ada rapor untuk filter ini.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            STEP 2 – Pilih Mata Pelajaran
            ═══════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-4">
            {/* back link */}
            <button onClick={handleBackToRapor} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke pemilihan rapor
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummyMapelInputNilai.map(m => (
                <button
                  key={m.mapelId}
                  onClick={() => handleSelectMapel(m)}
                  className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                      {m.kode}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-green-700">{m.nama}</h3>
                      <p className="text-xs text-gray-400">{m.groupNama}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{dummyMapelKDCount[m.mapelId] || 0} KD</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            STEP 3 – Pilih Kelas
            ═══════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="space-y-4">
            <button onClick={handleBackToMapel} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke pemilihan mata pelajaran
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummyKelasNilai.map(k => (
                <button
                  key={k.id}
                  onClick={() => handleSelectKelas(k)}
                  className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-400 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                      {k.nama}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-purple-700">{k.nama}</h3>
                      <p className="text-sm text-gray-500">{k.jumlahSiswa} siswa</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            STEP 4 – Form Penilaian
            ═══════════════════════════════════════════════════ */}
        {step === 4 && selectedRapor && selectedMapel && selectedKelas && (
          <div className="space-y-4">
            {/* back link */}
            <button onClick={() => { setStep(3); setSelectedKelas(null); }} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke pemilihan kelas
            </button>

            {/* ── INDIKATOR PENILAIAN carousel ── */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Indikator Penilaian</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{allIndikator.length} indikator</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {filledIndikator}/{allIndikator.length} selesai
                </span>
              </div>

              {/* carousel */}
              <div className="relative px-5 py-4">
                {/* left arrow */}
                {canScrollLeft && (
                  <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* indicator cards */}
                <div className="flex gap-3 overflow-hidden">
                  {visibleIndikator.map(ind => {
                    const kompetensi = kompetensiList.find(k => k.id === ind.kompetensiId);
                    return (
                      <div key={ind.id} className="shrink-0 w-55 border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors bg-gray-50">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                            {ind.kode}
                          </span>
                          <span className="text-xs font-medium text-gray-700 truncate">{ind.nama}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2 mb-2">{ind.deskripsi}</p>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-600 border border-green-200">
                          {kompetensi?.nama || 'Pengetahuan'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* right arrow */}
                {canScrollRight && (
                  <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* ── batas input warning ── */}
            {selectedRapor.batasInputSelesai && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Batas input nilai: {formatDate(selectedRapor.batasInputMulai)} — {formatDate(selectedRapor.batasInputSelesai)}
              </div>
            )}

            {/* ── green evaluation bar + search ── */}
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Evaluasi Kompetensi - {selectedKelas.nama} - {selectedMapel.kode} - {selectedMapel.nama}
                </span>
              </div>
              <div className="relative w-full sm:w-72">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><IconSearch /></span>
                <input
                  type="text"
                  placeholder="Cari nama atau NIS siswa..."
                  value={searchSiswa}
                  onChange={(e) => setSearchSiswa(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-green-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </div>

            {/* ── tabel penilaian ── */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase w-12 sticky left-0 z-10 bg-gray-50">
                        NO
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase sticky left-12 z-10 bg-gray-50 min-w-45">
                        NAMA SISWA
                      </th>
                      {allIndikator.map(ind => (
                        <th key={ind.id} className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase min-w-25 bg-gray-50">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-[10px] text-blue-600 font-bold">{ind.kode}</span>
                            <span className="text-[10px] text-gray-400 font-normal">NILAI</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSiswa.length === 0 ? (
                      <tr>
                        <td colSpan={2 + allIndikator.length} className="text-center py-14 text-gray-400">
                          <div className="flex flex-col items-center gap-2">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{searchSiswa ? 'Tidak ada siswa yang cocok.' : 'Tidak ada siswa di kelas ini.'}</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredSiswa.map((s, idx) => (
                        <tr key={s.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="text-center px-3 py-3 text-gray-500 text-xs sticky left-0 bg-white group-hover:bg-blue-50/30 z-5">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 sticky left-12 bg-white group-hover:bg-blue-50/30 z-5">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800 text-sm">{s.nama}</span>
                              <span className="text-xs text-gray-400">{s.nis}</span>
                            </div>
                          </td>
                          {allIndikator.map(ind => (
                            <td key={ind.id} className="px-2 py-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={getNilai(s.id, ind.id)}
                                onChange={(e) => handleNilaiChange(s.id, ind.id, e.target.value)}
                                className="w-full max-w-20 text-center px-2 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-blue-300 placeholder:text-gray-300"
                                placeholder="—"
                              />
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── bottom stats + save ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-gray-600">
                    <span className="font-semibold text-blue-700">{totalNilaiTerisi}</span>
                    <span className="text-gray-400"> / {totalNilaiPossible} nilai indikator terisi</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">
                    Progress keseluruhan: <span className="font-semibold text-green-700">{filledIndikator}/{allIndikator.length} indikator</span>
                  </span>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => { setStep(3); setSelectedKelas(null); }}
                  className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => alert('Nilai berhasil disimpan! (simulasi)')}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  Simpan Nilai
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── when step 4 without selections (shouldn't happen) ── */}
        {step === 4 && (!selectedRapor || !selectedMapel || !selectedKelas) && (
          <div className="text-center py-10 text-gray-400">
            Silakan pilih rapor, mata pelajaran, dan kelas terlebih dahulu.
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function Page() {
  return <InputNilaiRaporContent />;
}
