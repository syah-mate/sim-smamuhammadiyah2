'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';
import { dummyAttendanceStudents, dummyAttendanceSchedules } from '@/data/attendance';
import { dummyStudents } from '@/data/students';
import { AttendanceStudent, AttendanceStatus, AttendanceSchedule, Hari, AttendanceReportSummary } from '@/types';

// ==================== CONSTANTS ====================
const HARI_LABEL: Record<Hari, string> = {
  senin: 'Senin', selasa: 'Selasa', rabu: 'Rabu', kamis: 'Kamis',
  jumat: 'Jumat', sabtu: 'Sabtu', minggu: 'Minggu',
};

const HARI_ORDER: Hari[] = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

const BULAN_LABEL = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// ==================== HELPERS ====================
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateDisplay(date: Date): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getWeekDates(centerDate: Date): Date[] {
  const day = centerDate.getDay();
  const monday = new Date(centerDate);
  monday.setDate(centerDate.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function getDayName(date: Date): string {
  return HARI_ORDER[date.getDay() === 0 ? 6 : date.getDay() - 1];
}

// ==================== MAIN COMPONENT ====================
function PresensiSiswaContent() {
  const { user } = useAuth();
  const router = useRouter();

  // --- Tab state ---
  const [activeTab, setActiveTab] = useState<'harian' | 'jadwal' | 'laporan'>('harian');

  // --- Auth guard ---
  if (!user) { router.push('/'); return null; }

  const kelasList = useMemo(() => {
    return [...new Set(dummyStudents.filter((s) => s.status === 'aktif').map((s) => `${s.kelas} ${s.jurusan}`))].sort();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header + Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Presensi Siswa</h1>
            <p className="text-gray-500 mt-1">Kelola presensi harian, jadwal, dan laporan kehadiran siswa</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
            {([
              ['harian', '📋', 'Presensi Harian'],
              ['jadwal', '📅', 'Jadwal Presensi'],
              ['laporan', '📊', 'Laporan'],
            ] as const).map(([key, icon, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'harian' && <PresensiHarianTab kelasList={kelasList} />}
        {activeTab === 'jadwal' && <JadwalPresensiTab kelasList={kelasList} />}
        {activeTab === 'laporan' && <LaporanPresensiTab kelasList={kelasList} />}
      </div>
    </MainLayout>
  );
}

// ==================== TAB: PRESENSI HARIAN ====================
function PresensiHarianTab({ kelasList }: { kelasList: string[] }) {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(today));
  const [isLibur, setIsLibur] = useState(false);
  const [expandedKelas, setExpandedKelas] = useState<string | null>(null);
  const [attendances, setAttendances] = useState<AttendanceStudent[]>(dummyAttendanceStudents);

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
  const dateStr = formatDate(selectedDate);
  const dayName = getDayName(selectedDate);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });

  const isSameDay = (a: Date, b: Date) => formatDate(a) === formatDate(b);

  // Build per-class summary
  const kelasSummaries = useMemo(() => {
    const activeStudents = dummyStudents.filter((s) => s.status === 'aktif');
    return kelasList.map((kelasId) => {
      const studentsInClass = activeStudents.filter((s) => `${s.kelas} ${s.jurusan}` === kelasId);
      const studentIds = new Set(studentsInClass.map((s) => s.id));
      const classAttendances = attendances.filter((a) => a.kelasId === kelasId && a.tanggal === dateStr);
      const hadir = classAttendances.filter((a) => a.status === 'hadir').length;
      const izin = classAttendances.filter((a) => a.status === 'izin').length;
      const sakit = classAttendances.filter((a) => a.status === 'sakit').length;
      const alpha = classAttendances.filter((a) => a.status === 'alpha').length;
      const totalSiswa = studentsInClass.length;
      const sudahPresensi = new Set(classAttendances.map((a) => a.siswaId));
      const belumPresensiCount = [...studentIds].filter((id) => !sudahPresensi.has(id)).length;

      // Find schedule for this class & day
      const schedule = dummyAttendanceSchedules.find((s) => s.kelasId === kelasId && s.hari === dayName);

      return {
        kelasId,
        totalSiswa,
        hadir, izin, sakit, alpha,
        belumPresensi: belumPresensiCount,
        schedule,
        isLibur: schedule?.isLibur || isLibur,
      };
    });
  }, [kelasList, attendances, dateStr, dayName, isLibur]);

  const activeKelasCount = kelasSummaries.filter((k) => !k.isLibur).length;

  const toggleStatus = (id: string, currentStatus: AttendanceStatus) => {
    const order: AttendanceStatus[] = ['hadir', 'izin', 'sakit', 'alpha'];
    const next = order[(order.indexOf(currentStatus) + 1) % order.length];
    setAttendances((prev) => prev.map((a) => (a.id === id ? { ...a, status: next } : a)));
  };

  const studentsForExpandedKelas = useMemo(() => {
    if (!expandedKelas) return [];
    const activeStudents = dummyStudents.filter((s) => s.status === 'aktif' && `${s.kelas} ${s.jurusan}` === expandedKelas);
    return activeStudents.map((student) => {
      const att = attendances.find((a) => a.siswaId === student.id && a.kelasId === expandedKelas && a.tanggal === dateStr);
      return { student, attendance: att };
    });
  }, [expandedKelas, attendances, dateStr]);

  return (
    <div className="space-y-5">
      {/* Horizontal Date Selector */}
      <Card padding={false} className="overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Presensi Harian Kelas</h3>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-sm text-gray-500">Tetapkan Jadi Hari Libur</span>
            <button
              onClick={() => setIsLibur(!isLibur)}
              className={`relative w-10 h-5 rounded-full transition-colors ${isLibur ? 'bg-red-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isLibur ? 'left-5' : 'left-0.5'}`} />
            </button>
          </label>
        </div>

        {/* Date cards horizontal scroll */}
        <div className="relative px-2 py-3">
          <button onClick={scrollLeft} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white shadow hover:bg-green-600 transition-colors">
            ‹
          </button>
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide px-6" style={{ scrollbarWidth: 'none' }}>
            {weekDates.map((date) => {
              const active = isSameDay(date, selectedDate);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <button
                  key={formatDate(date)}
                  onClick={() => setSelectedDate(new Date(date))}
                  className={`flex-shrink-0 w-[100px] py-3 px-2 rounded-xl text-center transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : isWeekend
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <p className="text-xs font-medium opacity-80">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][date.getDay()]}
                  </p>
                  <p className="text-lg font-bold mt-0.5">{date.getDate()}</p>
                  <p className="text-[10px] opacity-70">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'][date.getMonth()]}
                    {' '}{date.getFullYear()}
                  </p>
                </button>
              );
            })}
          </div>
          <button onClick={scrollRight} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white shadow hover:bg-green-600 transition-colors">
            ›
          </button>
        </div>
      </Card>

      {/* Current date display */}
      <div>
        <p className="text-lg font-semibold text-gray-700">{formatDateDisplay(selectedDate)}</p>
        <p className="text-sm text-gray-500">Daftar Kelas - {formatDateDisplay(selectedDate)} ({activeKelasCount} kelas aktif)</p>
      </div>

      {/* Class Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {kelasSummaries.map((summary) => (
          <Card key={summary.kelasId} padding={false} className="hover:shadow-md transition-shadow">
            {/* Class header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                  {summary.kelasId.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800">{summary.kelasId}</h4>
                    <Badge variant="success">Siswa Aktif</Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    SISWA &nbsp; Jam Masuk {summary.schedule?.jamMasuk || '-'} Pulang {summary.schedule?.jamPulang || '-'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExpandedKelas(expandedKelas === summary.kelasId ? null : summary.kelasId)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  expandedKelas === summary.kelasId
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {expandedKelas === summary.kelasId ? 'Tutup' : 'Lihat Presensi'}
              </button>
            </div>

            {/* Stats boxes */}
            <div className="px-5 py-3 grid grid-cols-5 gap-2">
              {[
                { label: 'TOTAL SISWA', value: summary.totalSiswa, color: 'bg-gray-50 text-gray-700' },
                { label: 'HADIR', value: summary.hadir, color: 'bg-green-50 text-green-700' },
                { label: 'IZIN', value: summary.izin, color: 'bg-blue-50 text-blue-700' },
                { label: 'SAKIT', value: summary.sakit, color: 'bg-yellow-50 text-yellow-700' },
                { label: 'TIDAK HADIR', value: summary.alpha, color: 'bg-red-50 text-red-700' },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-lg p-2 text-center ${stat.color}`}>
                  <p className="text-[10px] font-medium opacity-70">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Info: belum presensi */}
            {summary.belumPresensi > 0 && (
              <div className="px-5 py-2 bg-blue-50 border-t border-blue-100">
                <p className="text-xs text-blue-600">
                  {summary.belumPresensi} siswa belum melakukan presensi
                </p>
              </div>
            )}

            {/* Expanded: student list */}
            {expandedKelas === summary.kelasId && (
              <div className="border-t border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Siswa</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">NISN</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-600">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {studentsForExpandedKelas.map(({ student, attendance }) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{student.namaLengkap}</td>
                          <td className="px-4 py-3 text-gray-500">{student.nisn}</td>
                          <td className="px-4 py-3 text-center">
                            {attendance ? (
                              <Badge variant={statusVariant(attendance.status) as 'success' | 'warning' | 'danger' | 'info' | 'default'}>
                                {attendance.status}
                              </Badge>
                            ) : (
                              <span className="text-xs text-gray-400">Belum Presensi</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {attendance ? (
                              <button
                                onClick={() => toggleStatus(attendance.id, attendance.status)}
                                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                              >
                                🔄 Ubah
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const newId = `as-new-${Date.now()}-${student.id}`;
                                  setAttendances((prev) => [
                                    ...prev,
                                    {
                                      id: newId,
                                      siswaId: student.id,
                                      kelasId: summary.kelasId,
                                      tanggal: dateStr,
                                      jamKe: 1,
                                      status: 'hadir',
                                      dicatatOleh: user?.id || '',
                                    },
                                  ]);
                                }}
                                className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                              >
                                + Hadir
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {studentsForExpandedKelas.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-gray-400">Tidak ada siswa di kelas ini</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        ))}
        {kelasSummaries.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-400">Tidak ada kelas aktif</div>
        )}
      </div>
    </div>
  );
}

// ==================== TAB: JADWAL PRESENSI PER KELAS ====================
function JadwalPresensiTab({ kelasList }: { kelasList: string[] }) {
  const [selectedHari, setSelectedHari] = useState<Hari>('senin');
  const [schedules, setSchedules] = useState<AttendanceSchedule[]>(dummyAttendanceSchedules);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKelasId, setEditingKelasId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ jamMasuk: string; jamPulang: string; toleransiTerlambat: number }>({
    jamMasuk: '07:00', jamPulang: '14:30', toleransiTerlambat: 15,
  });

  // Get schedule for each class on the selected day
  const kelasRows = useMemo(() => {
    return kelasList.map((kelasId, idx) => {
      const studentsInClass = dummyStudents.filter((s) => s.status === 'aktif' && `${s.kelas} ${s.jurusan}` === kelasId);
      const schedule = schedules.find((s) => s.kelasId === kelasId && s.hari === selectedHari);
      // Determine tingkat from class name
      const kelasMatch = kelasId.match(/^(\w+)/);
      const tingkat = kelasMatch ? kelasMatch[1] : kelasId;
      return {
        no: idx + 1,
        kelasId,
        tingkat,
        jumlahSiswa: studentsInClass.length,
        schedule: schedule || null,
        hasSchedule: !!schedule && !schedule.isLibur && schedule.jamMasuk !== '',
      };
    });
  }, [kelasList, schedules, selectedHari]);

  const openAdd = (kelasId: string) => {
    setEditingKelasId(kelasId);
    const existing = schedules.find((s) => s.kelasId === kelasId && s.hari === selectedHari);
    if (existing && !existing.isLibur) {
      setFormData({ jamMasuk: existing.jamMasuk, jamPulang: existing.jamPulang, toleransiTerlambat: existing.toleransiTerlambat });
    } else {
      setFormData({ jamMasuk: '07:00', jamPulang: '14:30', toleransiTerlambat: 15 });
    }
    setModalOpen(true);
  };

  const saveSchedule = () => {
    if (!editingKelasId) return;
    setSchedules((prev) => {
      const existingIdx = prev.findIndex((s) => s.kelasId === editingKelasId && s.hari === selectedHari);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...formData, isLibur: false };
        return updated;
      }
      return [
        ...prev,
        {
          id: `sc-new-${Date.now()}`,
          kelasId: editingKelasId,
          hari: selectedHari,
          ...formData,
          isLibur: false,
        },
      ];
    });
    setModalOpen(false);
    setEditingKelasId(null);
  };

  const removeSchedule = (kelasId: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.kelasId === kelasId && s.hari === selectedHari
          ? { ...s, jamMasuk: '', jamPulang: '', toleransiTerlambat: 0, isLibur: false }
          : s
      )
    );
  };

  return (
    <div className="space-y-5">
      {/* Day Picker */}
      <Card padding={false}>
        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {HARI_ORDER.map((hari) => (
              <button
                key={hari}
                onClick={() => setSelectedHari(hari)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedHari === hari
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {HARI_LABEL[hari]}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setEditingKelasId(null);
              setFormData({ jamMasuk: '07:00', jamPulang: '14:30', toleransiTerlambat: 15 });
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
          >
            ⚙️ Setting Jadwal Presensi
          </button>
        </div>
      </Card>

      {/* Class Schedule Table */}
      <Card title="Daftar Jadwal Kelas" subtitle={`Baris per kelas, jadwal untuk hari ${HARI_LABEL[selectedHari]}.`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 w-12">NO</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">KELAS</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">TINGKAT</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">JUMLAH SISWA</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">JAM PRESENSI</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {kelasRows.map((row) => (
                <tr key={row.kelasId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center text-gray-500">{row.no}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{row.kelasId}</td>
                  <td className="px-4 py-3">
                    <Badge variant="info">Tingkat {row.tingkat}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.jumlahSiswa} siswa</td>
                  <td className="px-4 py-3">
                    {row.hasSchedule ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                          🕐 {row.schedule!.jamMasuk} - {row.schedule!.jamPulang}
                        </span>
                        {row.schedule!.toleransiTerlambat > 0 && (
                          <span className="text-xs text-gray-400">
                            (toleransi {row.schedule!.toleransiTerlambat}′)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openAdd(row.kelasId)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                          row.hasSchedule
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                        title={row.hasSchedule ? 'Edit jadwal' : 'Tambah jadwal'}
                      >
                        {row.hasSchedule ? '✏️' : '+'}
                      </button>
                      {row.hasSchedule && (
                        <button
                          onClick={() => removeSchedule(row.kelasId)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-sm transition-colors"
                          title="Hapus jadwal"
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {kelasRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    Tidak ada kelas terdaftar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Setting Jadwal Presensi */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingKelasId(null); }} title="Setting Jadwal Presensi" size="md">
        <div className="space-y-4">
          {/* Kelas selector (only for bulk setting from "Setting Jadwal Presensi" button) */}
          {editingKelasId ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
              <input
                type="text"
                value={editingKelasId}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
              <select
                value={editingKelasId || ''}
                onChange={(e) => setEditingKelasId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Pilih Kelas</option>
                {kelasList.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
            <input
              type="text"
              value={HARI_LABEL[selectedHari]}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jam Masuk</label>
              <input
                type="time"
                value={formData.jamMasuk}
                onChange={(e) => setFormData((f) => ({ ...f, jamMasuk: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jam Pulang</label>
              <input
                type="time"
                value={formData.jamPulang}
                onChange={(e) => setFormData((f) => ({ ...f, jamPulang: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Toleransi Keterlambatan (menit)
            </label>
            <input
              type="number"
              value={formData.toleransiTerlambat}
              onChange={(e) => setFormData((f) => ({ ...f, toleransiTerlambat: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              min={0}
              max={120}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => { setModalOpen(false); setEditingKelasId(null); }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={saveSchedule}
              disabled={!editingKelasId || !formData.jamMasuk || !formData.jamPulang}
              className="px-4 py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💾 Simpan Jadwal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ==================== TAB: LAPORAN PRESENSI ====================
function LaporanPresensiTab({ kelasList }: { kelasList: string[] }) {
  const now = new Date();
  const [selectedKelas, setSelectedKelas] = useState<string>(kelasList[0] || '');
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth()); // 0-based
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [attendances] = useState<AttendanceStudent[]>(dummyAttendanceStudents);

  const report = useMemo((): AttendanceReportSummary => {
    const activeStudents = dummyStudents.filter((s) => s.status === 'aktif' && `${s.kelas} ${s.jurusan}` === selectedKelas);
    const studentIds = new Set(activeStudents.map((s) => s.id));

    // Filter attendances for selected class, month, year
    const monthAttendances = attendances.filter((a) => {
      if (a.kelasId !== selectedKelas) return false;
      const [y, m] = a.tanggal.split('-').map(Number);
      return y === selectedYear && m === selectedMonth + 1;
    });

    // Get unique student-attendance (latest status per student per day)
    const dailyMap = new Map<string, AttendanceStatus>();
    monthAttendances.forEach((a) => {
      const key = `${a.siswaId}-${a.tanggal}`;
      // Prioritize: hadir > izin > sakit > alpha
      const existing = dailyMap.get(key);
      if (!existing || (a.status === 'hadir') || (existing === 'alpha' && a.status !== 'alpha')) {
        dailyMap.set(key, a.status);
      }
    });

    const totalHari = daysInMonth(selectedYear, selectedMonth + 1);
    const totalPossible = activeStudents.length * totalHari;

    const hadir = [...dailyMap.values()].filter((s) => s === 'hadir').length;
    const izin = [...dailyMap.values()].filter((s) => s === 'izin').length;
    const sakit = [...dailyMap.values()].filter((s) => s === 'sakit').length;
    const alpha = [...dailyMap.values()].filter((s) => s === 'alpha').length;

    return {
      kelasId: selectedKelas,
      totalSiswa: activeStudents.length,
      hadir,
      izin,
      sakit,
      alpha,
      persentaseKehadiran: totalPossible > 0 ? Math.round((hadir / totalPossible) * 100) : 0,
    };
  }, [selectedKelas, selectedMonth, selectedYear, attendances]);

  // Student-level report
  const studentReports = useMemo(() => {
    const activeStudents = dummyStudents.filter((s) => s.status === 'aktif' && `${s.kelas} ${s.jurusan}` === selectedKelas);
    const totalHari = daysInMonth(selectedYear, selectedMonth + 1);

    return activeStudents.map((student) => {
      const studentAtts = attendances.filter((a) => {
        if (a.siswaId !== student.id) return false;
        const [y, m] = a.tanggal.split('-').map(Number);
        return y === selectedYear && m === selectedMonth + 1;
      });

      const hadir = studentAtts.filter((a) => a.status === 'hadir').length;
      const izin = studentAtts.filter((a) => a.status === 'izin').length;
      const sakit = studentAtts.filter((a) => a.status === 'sakit').length;
      const alpha = studentAtts.filter((a) => a.status === 'alpha').length;

      return {
        student,
        hadir,
        izin,
        sakit,
        alpha,
        persentase: totalHari > 0 ? Math.round((hadir / totalHari) * 100) : 0,
      };
    });
  }, [selectedKelas, selectedMonth, selectedYear, attendances]);

  const years = useMemo(() => {
    const currentYear = now.getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  }, [now]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Kelas</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {kelasList.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Bulan</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {BULAN_LABEL.map((b, i) => <option key={b} value={i}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tahun</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Total Siswa" value={report.totalSiswa} color="blue" />
        <StatCard title="Hadir" value={report.hadir} color="green" />
        <StatCard title="Izin" value={report.izin} color="blue" />
        <StatCard title="Sakit" value={report.sakit} color="yellow" />
        <StatCard title="Alpha" value={report.alpha} color="red" />
        <StatCard title="% Kehadiran" value={`${report.persentaseKehadiran}%`} color="purple" />
      </div>

      {/* Student Report Table */}
      <Card title={`Laporan Presensi ${selectedKelas} - ${BULAN_LABEL[selectedMonth]} ${selectedYear}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Siswa</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">NISN</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Hadir</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Izin</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Sakit</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Alpha</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">% Hadir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {studentReports.map((r, i) => (
                <tr key={r.student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{r.student.namaLengkap}</td>
                  <td className="px-4 py-3 text-gray-500">{r.student.nisn}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="success">{r.hadir}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="info">{r.izin}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="warning">{r.sakit}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="danger">{r.alpha}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.persentase >= 80 ? 'bg-green-100 text-green-700' : r.persentase >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.persentase}%
                    </span>
                  </td>
                </tr>
              ))}
              {studentReports.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                    Tidak ada data presensi untuk kelas ini pada bulan yang dipilih
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ==================== UTILS ====================
function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// ==================== PAGE EXPORT ====================
export default function PresensiSiswaPage() {
  return <PresensiSiswaContent />;
}
