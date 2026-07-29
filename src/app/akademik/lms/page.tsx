'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';
import { dummyMapel } from '@/data/akademik';
import { dummyStudents } from '@/data/students';
import {
  dummyMateri,
  dummyTugas,
  dummyPengumpulan,
  dummyKelasList,
  dummyGuruMapelKelas,
} from '@/data/lms';
import {
  LMSMateri,
  LMSTugas,
  LMSPengumpulanTugas,
  LMSKelasInfo,
  Mapel,
} from '@/types';

// ==================== Helper: format tanggal ====================
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ==================== Badge status kecil ====================
const statusBadge: Record<LMSPengumpulanTugas['status'], { label: string; cls: string }> = {
  belum_mengumpulkan: { label: 'Belum', cls: 'bg-red-100 text-red-700' },
  sudah_mengumpulkan: { label: 'Terkumpul', cls: 'bg-yellow-100 text-yellow-700' },
  dinilai: { label: 'Dinilai', cls: 'bg-green-100 text-green-700' },
};

export default function LMSPage() {
  const { user } = useAuth();
  const router = useRouter();

  // ==================== HOOKS (wajib di atas) ====================
  const [activeTab, setActiveTab] = useState<'materi' | 'tugas'>('materi');

  // --- Filter state ---
  const [selectedMapelId, setSelectedMapelId] = useState<string>('');
  const [selectedKelas, setSelectedKelas] = useState<string>(''); // format "kelas|jurusan"

  // --- Materi state ---
  const [materiList, setMateriList] = useState<LMSMateri[]>(dummyMateri);
  const [isMateriModalOpen, setIsMateriModalOpen] = useState(false);
  const [materiForm, setMateriForm] = useState({ judul: '', deskripsi: '', fileName: '' });

  // --- Tugas state ---
  const [tugasList, setTugasList] = useState<LMSTugas[]>(dummyTugas);
  const [pengumpulanList, setPengumpulanList] = useState<LMSPengumpulanTugas[]>(dummyPengumpulan);
  const [isTugasModalOpen, setIsTugasModalOpen] = useState(false);
  const [tugasForm, setTugasForm] = useState({ judul: '', deskripsi: '', fileName: '', deadline: '' });

  // --- Nilai modal state ---
  const [isNilaiModalOpen, setIsNilaiModalOpen] = useState(false);
  const [selectedTugas, setSelectedTugas] = useState<LMSTugas | null>(null);
  const [editingNilai, setEditingNilai] = useState<{ id: string; nilai: number; catatan: string } | null>(null);

  // --- Auth guard ---
  const isTeacher = user?.roles.includes('guru');

  // ==================== Derived: mapel yang diajar guru ini ====================
  const myMapel: Mapel[] = useMemo(() => {
    if (!user) return [];
    // Untuk guru: filter berdasarkan pemetaan guru-mapel
    if (isTeacher) {
      const mapping = dummyGuruMapelKelas.find(
        (g) => g.empId === user.pegawaiId
      );
      if (!mapping) return [];
      return dummyMapel.filter((m) => mapping.mapelIds.includes(m.id));
    }
    // Admin / lainnya: lihat semua
    return dummyMapel;
  }, [user, isTeacher]);

  // ==================== Derived: kelas yang tersedia untuk mapel terpilih ====================
  const availableKelas: LMSKelasInfo[] = useMemo(() => {
    if (!selectedMapelId || !user) return [];
    if (isTeacher) {
      const mapping = dummyGuruMapelKelas.find(
        (g) => g.empId === user.pegawaiId
      );
      if (!mapping) return [];
      if (!mapping.mapelIds.includes(selectedMapelId)) return [];
      return dummyKelasList.filter((k) =>
        mapping.kelasAjar.some((ka) => ka.kelas === k.kelas && ka.jurusan === k.jurusan)
      );
    }
    // Admin: semua kelas
    return dummyKelasList;
  }, [selectedMapelId, user, isTeacher]);

  // ==================== Derived: daftar materi / tugas terfilter ====================
  const filteredMateri = useMemo(() => {
    if (!selectedMapelId || !selectedKelas) return [];
    const [kelas, jurusan] = selectedKelas.split('|');
    return materiList.filter(
      (m) => m.mapelId === selectedMapelId && m.kelas === kelas && m.jurusan === jurusan
    );
  }, [materiList, selectedMapelId, selectedKelas]);

  const filteredTugas = useMemo(() => {
    if (!selectedMapelId || !selectedKelas) return [];
    const [kelas, jurusan] = selectedKelas.split('|');
    return tugasList.filter(
      (t) => t.mapelId === selectedMapelId && t.kelas === kelas && t.jurusan === jurusan
    );
  }, [tugasList, selectedMapelId, selectedKelas]);

  const selectedMapelNama = useMemo(
    () => dummyMapel.find((m) => m.id === selectedMapelId)?.nama || '',
    [selectedMapelId]
  );

  // Auth guard — redirect jika belum login
  // ==================== Penilaian Tugas — useMemo (WAJIB sebelum auth guard) ====================
  const pengumpulanForSelectedTugas = useMemo(() => {
    if (!selectedTugas) return [];
    return pengumpulanList.filter((p) => p.tugasId === selectedTugas.id);
  }, [pengumpulanList, selectedTugas]);

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  if (!user) return null;

  // ==================== Materi CRUD ====================
  const handleAddMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMapelId || !selectedKelas) return;
    const [kelas, jurusan] = selectedKelas.split('|');
    const newMateri: LMSMateri = {
      id: `mat${Date.now()}`,
      mapelId: selectedMapelId,
      mapelNama: selectedMapelNama,
      kelas,
      jurusan,
      judul: materiForm.judul,
      deskripsi: materiForm.deskripsi,
      fileName: materiForm.fileName || undefined,
      fileUrl: '#',
      uploadedBy: user.pegawaiId || user.id,
      uploadedByName: user.nama,
      tanggalUpload: new Date().toISOString().slice(0, 10),
    };
    setMateriList((prev) => [newMateri, ...prev]);
    setMateriForm({ judul: '', deskripsi: '', fileName: '' });
    setIsMateriModalOpen(false);
  };

  // ==================== Tugas CRUD ====================
  const handleAddTugas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMapelId || !selectedKelas) return;
    const [kelas, jurusan] = selectedKelas.split('|');
    const newTugas: LMSTugas = {
      id: `tgs${Date.now()}`,
      mapelId: selectedMapelId,
      mapelNama: selectedMapelNama,
      kelas,
      jurusan,
      judul: tugasForm.judul,
      deskripsi: tugasForm.deskripsi,
      fileName: tugasForm.fileName || undefined,
      fileUrl: '#',
      deadline: tugasForm.deadline,
      uploadedBy: user.pegawaiId || user.id,
      uploadedByName: user.nama,
      tanggalUpload: new Date().toISOString().slice(0, 10),
    };
    setTugasList((prev) => [newTugas, ...prev]);
    // Auto-generate pengumpulan untuk semua siswa di kelas tersebut
    const siswaDiKelas = dummyStudents.filter(
      (s) => s.kelas === kelas && s.jurusan === jurusan && s.status === 'aktif'
    );
    const newPengumpulan: LMSPengumpulanTugas[] = siswaDiKelas.map((s) => ({
      id: `kump${Date.now()}-${s.id}`,
      tugasId: newTugas.id,
      siswaId: s.id,
      siswaNama: s.namaLengkap,
      siswaNIS: s.nis,
      siswaKelas: `${s.kelas} ${s.jurusan}`,
      status: 'belum_mengumpulkan' as const,
    }));
    setPengumpulanList((prev) => [...newPengumpulan, ...prev]);
    setTugasForm({ judul: '', deskripsi: '', fileName: '', deadline: '' });
    setIsTugasModalOpen(false);
  };

  // ==================== Penilaian Tugas ====================
  const openNilaiModal = (tugas: LMSTugas) => {
    setSelectedTugas(tugas);
    setEditingNilai(null);
    setIsNilaiModalOpen(true);
  };

  const startEditNilai = (p: LMSPengumpulanTugas) => {
    setEditingNilai({
      id: p.id,
      nilai: p.nilai ?? 0,
      catatan: p.catatanGuru ?? '',
    });
  };

  const saveNilai = () => {
    if (!editingNilai) return;
    setPengumpulanList((prev) =>
      prev.map((p) =>
        p.id === editingNilai.id
          ? {
              ...p,
              nilai: editingNilai.nilai,
              catatanGuru: editingNilai.catatan || undefined,
              status: 'dinilai' as const,
              tanggalDinilai: new Date().toISOString().slice(0, 10),
            }
          : p
      )
    );
    setEditingNilai(null);
  };

  // ==================== Render ====================
  const mapelOptions = myMapel;
  const kelasOptions = availableKelas;

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
            <span className="text-gray-700 font-medium">LMS</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Learning Management System</h1>
              <p className="text-gray-500 mt-0.5 text-sm">Kelola materi pembelajaran dan tugas siswa</p>
            </div>
          </div>
        </div>

        {/* Tabs: Materi | Tugas */}
        <div className="flex items-center gap-1 border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('materi'); setSelectedMapelId(''); setSelectedKelas(''); }}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
              activeTab === 'materi'
                ? 'text-blue-700 border-blue-600 bg-blue-50/50'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            📖 Materi
          </button>
          <button
            onClick={() => { setActiveTab('tugas'); setSelectedMapelId(''); setSelectedKelas(''); }}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
              activeTab === 'tugas'
                ? 'text-blue-700 border-blue-600 bg-blue-50/50'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            📝 Tugas
          </button>
        </div>

        {/* Filter bar: Mapel + Kelas */}
        <div className="flex flex-wrap items-end gap-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mata Pelajaran</label>
            <select
              value={selectedMapelId}
              onChange={(e) => { setSelectedMapelId(e.target.value); setSelectedKelas(''); }}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="">-- Pilih Mata Pelajaran --</option>
              {mapelOptions.map((m) => (
                <option key={m.id} value={m.id}>{m.nama}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kelas</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              disabled={!selectedMapelId}
            >
              <option value="">-- Pilih Kelas --</option>
              {kelasOptions.map((k) => (
                <option key={`${k.kelas}|${k.jurusan}`} value={`${k.kelas}|${k.jurusan}`}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol tambah (hanya muncul jika mapel & kelas sudah dipilih) */}
          {selectedMapelId && selectedKelas && (
            <div className="flex items-end">
              {activeTab === 'materi' ? (
                <button
                  onClick={() => {
                    setMateriForm({ judul: '', deskripsi: '', fileName: '' });
                    setIsMateriModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Upload Materi
                </button>
              ) : (
                <button
                  onClick={() => {
                    setTugasForm({ judul: '', deskripsi: '', fileName: '', deadline: '' });
                    setIsTugasModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Upload Tugas Baru
                </button>
              )}
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* TAB: MATERI                                                      */}
        {/* ================================================================ */}
        {activeTab === 'materi' && (
          <>
            {!selectedMapelId || !selectedKelas ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-6xl mb-4">📖</p>
                <p className="text-sm">Silakan pilih Mata Pelajaran dan Kelas terlebih dahulu</p>
              </div>
            ) : filteredMateri.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-6xl mb-4">📭</p>
                <p className="text-sm">Belum ada materi untuk {selectedMapelNama} di kelas ini</p>
                <button
                  onClick={() => {
                    setMateriForm({ judul: '', deskripsi: '', fileName: '' });
                    setIsMateriModalOpen(true);
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 inline-block"
                >
                  + Upload Materi Pertama
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMateri.map((mat) => (
                  <Card key={mat.id} className="hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        📄
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1">{mat.judul}</h3>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{mat.deskripsi}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                          {mat.fileName && (
                            <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              📎 {mat.fileName}
                            </span>
                          )}
                          <span>{fmtDate(mat.tanggalUpload)}</span>
                          <span className="text-gray-300">•</span>
                          <span>{mat.uploadedByName}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* ================================================================ */}
        {/* TAB: TUGAS                                                       */}
        {/* ================================================================ */}
        {activeTab === 'tugas' && (
          <>
            {!selectedMapelId || !selectedKelas ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-6xl mb-4">📝</p>
                <p className="text-sm">Silakan pilih Mata Pelajaran dan Kelas terlebih dahulu</p>
              </div>
            ) : filteredTugas.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-6xl mb-4">📭</p>
                <p className="text-sm">Belum ada tugas untuk {selectedMapelNama} di kelas ini</p>
                <button
                  onClick={() => {
                    setTugasForm({ judul: '', deskripsi: '', fileName: '', deadline: '' });
                    setIsTugasModalOpen(true);
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 inline-block"
                >
                  + Upload Tugas Pertama
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTugas.map((tgs) => {
                  const submissions = pengumpulanList.filter((p) => p.tugasId === tgs.id);
                  const totalSiswa = submissions.length;
                  const sudahKumpul = submissions.filter((p) => p.status !== 'belum_mengumpulkan').length;
                  const sudahDinilai = submissions.filter((p) => p.status === 'dinilai').length;
                  const isOverdue = new Date(tgs.deadline) < new Date();

                  return (
                    <Card key={tgs.id} className="hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                            isOverdue ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            📝
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 text-sm mb-1">{tgs.judul}</h3>
                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{tgs.deskripsi}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                              {tgs.fileName && (
                                <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                  📎 {tgs.fileName}
                                </span>
                              )}
                              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                                isOverdue ? 'bg-red-100 text-red-700 font-semibold' : 'bg-green-100 text-green-700'
                              }`}>
                                ⏰ Deadline: {fmtDate(tgs.deadline)}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span>{tgs.uploadedByName}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {/* Statistik pengumpulan */}
                          {totalSiswa > 0 && (
                            <div className="text-right mr-2">
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-1 text-xs">
                                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                  <span className="text-gray-500">{sudahDinilai} dinilai</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                  <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
                                  <span className="text-gray-500">{sudahKumpul - sudahDinilai} terkumpul</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
                                  <span className="text-gray-500">{totalSiswa - sudahKumpul} belum</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-0.5">{totalSiswa} siswa</p>
                            </div>
                          )}
                          <button
                            onClick={() => openNilaiModal(tgs)}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap"
                          >
                            ✏️ Nilai
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ================================================================ */}
        {/* MODAL: Upload Materi                                             */}
        {/* ================================================================ */}
        <Modal
          isOpen={isMateriModalOpen}
          onClose={() => setIsMateriModalOpen(false)}
          title="Upload Materi Baru"
        >
          <form onSubmit={handleAddMateri} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Materi <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={materiForm.judul}
                onChange={(e) => setMateriForm((prev) => ({ ...prev, judul: e.target.value }))}
                placeholder="Masukkan judul materi"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                value={materiForm.deskripsi}
                onChange={(e) => setMateriForm((prev) => ({ ...prev, deskripsi: e.target.value }))}
                placeholder="Deskripsi singkat materi"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama File (opsional)</label>
              <input
                type="text"
                value={materiForm.fileName}
                onChange={(e) => setMateriForm((prev) => ({ ...prev, fileName: e.target.value }))}
                placeholder="contoh: materi-pertemuan-1.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">*Prototype: isi nama file saja, upload sesungguhnya nanti via API</p>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsMateriModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Simpan Materi
              </button>
            </div>
          </form>
        </Modal>

        {/* ================================================================ */}
        {/* MODAL: Upload Tugas Baru                                         */}
        {/* ================================================================ */}
        <Modal
          isOpen={isTugasModalOpen}
          onClose={() => setIsTugasModalOpen(false)}
          title="Upload Tugas Baru"
        >
          <form onSubmit={handleAddTugas} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Tugas <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={tugasForm.judul}
                onChange={(e) => setTugasForm((prev) => ({ ...prev, judul: e.target.value }))}
                placeholder="Masukkan judul tugas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                value={tugasForm.deskripsi}
                onChange={(e) => setTugasForm((prev) => ({ ...prev, deskripsi: e.target.value }))}
                placeholder="Deskripsi dan instruksi tugas"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={tugasForm.deadline}
                onChange={(e) => setTugasForm((prev) => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama File (opsional)</label>
              <input
                type="text"
                value={tugasForm.fileName}
                onChange={(e) => setTugasForm((prev) => ({ ...prev, fileName: e.target.value }))}
                placeholder="contoh: soal-tugas-1.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">*Prototype: isi nama file saja</p>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsTugasModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Simpan Tugas
              </button>
            </div>
          </form>
        </Modal>

        {/* ================================================================ */}
        {/* MODAL: Penilaian Tugas (daftar siswa + nilai)                     */}
        {/* ================================================================ */}
        <Modal
          isOpen={isNilaiModalOpen}
          onClose={() => { setIsNilaiModalOpen(false); setEditingNilai(null); }}
          title={selectedTugas ? `Nilai: ${selectedTugas.judul}` : 'Penilaian Tugas'}
          size="lg"
        >
          {selectedTugas && (
            <div className="space-y-4">
              {/* Info tugas */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                <p><span className="font-medium text-gray-600">Mapel:</span> {selectedTugas.mapelNama}</p>
                <p><span className="font-medium text-gray-600">Kelas:</span> {selectedTugas.kelas} {selectedTugas.jurusan}</p>
                <p><span className="font-medium text-gray-600">Deadline:</span> {fmtDate(selectedTugas.deadline)}</p>
                <p className="text-gray-600">{selectedTugas.deskripsi}</p>
              </div>

              {/* Daftar siswa & status pengumpulan */}
              {pengumpulanForSelectedTugas.length === 0 ? (
                <p className="text-center py-8 text-gray-400 text-sm">Belum ada data siswa untuk tugas ini.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2.5 px-3 font-semibold text-gray-600 text-xs">NIS</th>
                        <th className="text-left py-2.5 px-3 font-semibold text-gray-600 text-xs">Nama Siswa</th>
                        <th className="text-left py-2.5 px-3 font-semibold text-gray-600 text-xs">Status</th>
                        <th className="text-left py-2.5 px-3 font-semibold text-gray-600 text-xs">File</th>
                        <th className="text-left py-2.5 px-3 font-semibold text-gray-600 text-xs">Nilai</th>
                        <th className="text-left py-2.5 px-3 font-semibold text-gray-600 text-xs">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pengumpulanForSelectedTugas.map((p) => {
                        const isEditing = editingNilai?.id === p.id;
                        const badge = statusBadge[p.status];
                        return (
                          <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2.5 px-3 text-gray-600">{p.siswaNIS}</td>
                            <td className="py-2.5 px-3 font-medium text-gray-800">{p.siswaNama}</td>
                            <td className="py-2.5 px-3">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${badge.cls}`}>
                                {badge.label}
                              </span>
                              {p.tanggalKumpul && (
                                <p className="text-[10px] text-gray-400 mt-0.5">{fmtDate(p.tanggalKumpul)}</p>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              {p.fileName ? (
                                <span className="text-blue-600 text-xs flex items-center gap-1">
                                  📎 {p.fileName}
                                </span>
                              ) : (
                                <span className="text-gray-300 text-xs">—</span>
                              )}
                              {p.catatanSiswa && (
                                <p className="text-[10px] text-gray-400 mt-0.5 italic">&ldquo;{p.catatanSiswa}&rdquo;</p>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              {isEditing ? (
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={editingNilai.nilai}
                                  onChange={(e) => setEditingNilai((prev) => prev ? { ...prev, nilai: Number(e.target.value) } : null)}
                                  className="w-16 px-2 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                              ) : (
                                <span className={`font-semibold ${p.nilai !== undefined ? 'text-gray-800' : 'text-gray-300'}`}>
                                  {p.nilai !== undefined ? p.nilai : '—'}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={saveNilai}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                  >
                                    Simpan
                                  </button>
                                  <button
                                    onClick={() => setEditingNilai(null)}
                                    className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditNilai(p)}
                                  disabled={p.status === 'belum_mengumpulkan'}
                                  className={`px-3 py-1 text-xs rounded ${
                                    p.status === 'belum_mengumpulkan'
                                      ? 'text-gray-300 cursor-not-allowed'
                                      : 'text-blue-600 border border-blue-300 hover:bg-blue-50'
                                  }`}
                                >
                                  {p.status === 'dinilai' ? 'Edit Nilai' : 'Nilai'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Rekap statistik */}
              {pengumpulanForSelectedTugas.length > 0 && (() => {
                const total = pengumpulanForSelectedTugas.length;
                const dinilai = pengumpulanForSelectedTugas.filter((p) => p.status === 'dinilai').length;
                const terkumpul = pengumpulanForSelectedTugas.filter((p) => p.status === 'sudah_mengumpulkan').length;
                const belum = pengumpulanForSelectedTugas.filter((p) => p.status === 'belum_mengumpulkan').length;
                const avgNilai = pengumpulanForSelectedTugas
                  .filter((p) => p.nilai !== undefined)
                  .reduce((sum, p, _, arr) => sum + (p.nilai ?? 0) / arr.length, 0);
                return (
                  <div className="grid grid-cols-4 gap-3 pt-3 border-t border-gray-100">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-green-600 font-medium">Dinilai</p>
                      <p className="text-lg font-bold text-green-700">{dinilai}/{total}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-yellow-600 font-medium">Terkumpul</p>
                      <p className="text-lg font-bold text-yellow-700">{terkumpul}/{total}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-red-600 font-medium">Belum</p>
                      <p className="text-lg font-bold text-red-700">{belum}/{total}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-blue-600 font-medium">Rata-rata Nilai</p>
                      <p className="text-lg font-bold text-blue-700">{avgNilai > 0 ? avgNilai.toFixed(1) : '—'}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}
