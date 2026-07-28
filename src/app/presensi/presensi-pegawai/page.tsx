'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';
import { dummyAttendanceEmployees, dummyEmployeeSchedules } from '@/data/attendance';
import { dummyEmployees } from '@/data/employees';
import { AttendanceEmployee, AttendanceStatus, EmployeeSchedule, Hari, Employee } from '@/types';

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

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((w) => w[0] === w[0]?.toUpperCase() || w.length > 2)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || name.charAt(0).toUpperCase();
}

// ==================== MAIN COMPONENT ====================
function PresensiPegawaiContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'harian' | 'jadwal' | 'laporan'>('harian');

  if (!user) { router.push('/'); return null; }

  const employees = useMemo(() => dummyEmployees, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header + Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Presensi Pegawai</h1>
            <p className="text-gray-500 mt-1">Kelola presensi harian, jadwal, dan laporan kehadiran pegawai</p>
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
        {activeTab === 'harian' && <PresensiHarianTab employees={employees} />}
        {activeTab === 'jadwal' && <JadwalPegawaiTab employees={employees} />}
        {activeTab === 'laporan' && <LaporanPegawaiTab employees={employees} />}
      </div>
    </MainLayout>
  );
}

// ==================== TAB: PRESENSI HARIAN ====================
function PresensiHarianTab({ employees }: { employees: Employee[] }) {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(today));
  const [isLibur, setIsLibur] = useState(false);
  const [attendances, setAttendances] = useState<AttendanceEmployee[]>(dummyAttendanceEmployees);
  const [editingMasuk, setEditingMasuk] = useState<string | null>(null);
  const [editingPulang, setEditingPulang] = useState<string | null>(null);

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
  const dateStr = formatDate(selectedDate);
  const dayName = getDayName(selectedDate);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  const isSameDay = (a: Date, b: Date) => formatDate(a) === formatDate(b);

  // Build employee attendance rows
  const employeeRows = useMemo(() => {
    return employees.map((emp) => {
      const att = attendances.find((a) => a.pegawaiId === emp.id && a.tanggal === dateStr);
      const schedule = dummyEmployeeSchedules.find((s) => s.pegawaiId === emp.id && s.hari === dayName);
      const isLiburHari = schedule?.isLibur || isLibur;
      return {
        employee: emp,
        attendance: att || null,
        schedule: schedule || null,
        isLibur: isLiburHari,
      };
    });
  }, [employees, attendances, dateStr, dayName, isLibur]);

  const stats = useMemo(() => {
    const filtered = employeeRows.filter((r) => !r.isLibur);
    return {
      total: filtered.length,
      hadir: filtered.filter((r) => r.attendance?.status === 'hadir').length,
      izin: filtered.filter((r) => r.attendance?.status === 'izin').length,
      sakit: filtered.filter((r) => r.attendance?.status === 'sakit').length,
      alpha: filtered.filter((r) => r.attendance?.status === 'alpha').length,
      belum: filtered.filter((r) => !r.attendance).length,
    };
  }, [employeeRows]);

  const setJamMasuk = (pegawaiId: string, time: string) => {
    setAttendances((prev) => {
      const existing = prev.find((a) => a.pegawaiId === pegawaiId && a.tanggal === dateStr);
      if (existing) {
        return prev.map((a) => (a.id === existing.id ? { ...a, jamMasuk: time, status: time ? 'hadir' as const : a.status } : a));
      }
      return [...prev, {
        id: `ae-new-${Date.now()}`,
        pegawaiId,
        tanggal: dateStr,
        jamMasuk: time,
        jamPulang: '',
        status: 'hadir',
      }];
    });
    setEditingMasuk(null);
  };

  const setJamPulang = (pegawaiId: string, time: string) => {
    setAttendances((prev) => {
      const existing = prev.find((a) => a.pegawaiId === pegawaiId && a.tanggal === dateStr);
      if (existing) {
        return prev.map((a) => (a.id === existing.id ? { ...a, jamPulang: time } : a));
      }
      return [...prev, {
        id: `ae-new-${Date.now()}`,
        pegawaiId,
        tanggal: dateStr,
        jamMasuk: '',
        jamPulang: time,
        status: 'hadir',
      }];
    });
    setEditingPulang(null);
  };

  const toggleStatus = (pegawaiId: string, currentStatus: AttendanceStatus) => {
    const order: AttendanceStatus[] = ['hadir', 'izin', 'sakit', 'alpha'];
    const next = order[(order.indexOf(currentStatus) + 1) % order.length];
    setAttendances((prev) => {
      const existing = prev.find((a) => a.pegawaiId === pegawaiId && a.tanggal === dateStr);
      if (existing) {
        return prev.map((a) => (a.id === existing.id ? { ...a, status: next } : a));
      }
      return [...prev, {
        id: `ae-new-${Date.now()}`,
        pegawaiId,
        tanggal: dateStr,
        jamMasuk: '',
        jamPulang: '',
        status: next,
      }];
    });
  };

  return (
    <div className="space-y-5">
      {/* Horizontal Date Selector */}
      <Card padding={false} className="overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Presensi Harian Pegawai</h3>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-sm text-gray-500">Tetapkan Libur</span>
            <button
              onClick={() => setIsLibur(!isLibur)}
              className={`relative w-10 h-5 rounded-full transition-colors ${isLibur ? 'bg-red-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isLibur ? 'left-5' : 'left-0.5'}`} />
            </button>
          </label>
        </div>
        <div className="relative px-2 py-3">
          <button onClick={scrollLeft} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white shadow hover:bg-green-600 transition-colors">
            ‹
          </button>
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto px-6" style={{ scrollbarWidth: 'none' }}>
            {weekDates.map((date) => {
              const active = isSameDay(date, selectedDate);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <button
                  key={formatDate(date)}
                  onClick={() => setSelectedDate(new Date(date))}
                  className={`shrink-0 w-25 py-3 px-2 rounded-xl text-center transition-all ${
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

      {/* Current date + stats */}
      <div>
        <p className="text-lg font-semibold text-gray-700">{formatDateDisplay(selectedDate)}</p>
        <p className="text-sm text-gray-500">{stats.total} pegawai aktif</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard title="Total" value={stats.total} color="blue" />
        <StatCard title="Hadir" value={stats.hadir} color="green" />
        <StatCard title="Izin" value={stats.izin} color="blue" />
        <StatCard title="Sakit" value={stats.sakit} color="yellow" />
        <StatCard title="Alpha" value={stats.alpha} color="red" />
      </div>

      {/* Employee List */}
      <Card title="Daftar Presensi Pegawai" padding={false}>
        <div className="divide-y divide-gray-100">
          {employeeRows.map((row) => (
            <div key={row.employee.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors">
              {/* Avatar + Name + Unit */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {getInitials(row.employee.nama)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">{row.employee.nama}</p>
                  <p className="text-xs text-gray-400 truncate">{row.employee.jabatan}</p>
                </div>
              </div>

              {/* Shift info */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-400">SHIFT</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${
                  row.isLibur
                    ? 'bg-red-50 text-red-600'
                    : row.schedule?.jamMasuk
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-gray-50 text-gray-400'
                }`}>
                  {row.isLibur
                    ? 'Libur'
                    : row.schedule?.jamMasuk
                    ? `${row.schedule.jamMasuk} - ${row.schedule.jamPulang}`
                    : 'Belum diatur'}
                </span>
              </div>

              {/* MASUK */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-400 w-14">MASUK</span>
                {editingMasuk === row.employee.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="time"
                      defaultValue={row.attendance?.jamMasuk || row.schedule?.jamMasuk || '07:00'}
                      className="w-28 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      onBlur={(e) => setJamMasuk(row.employee.id, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setJamMasuk(row.employee.id, (e.target as HTMLInputElement).value); }}
                      autoFocus
                    />
                    <button onClick={() => setEditingMasuk(null)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                ) : row.attendance?.jamMasuk ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                    {row.attendance.jamMasuk} Hadir
                    <button onClick={() => setEditingMasuk(row.employee.id)} className="text-gray-400 hover:text-gray-600 ml-1">✎</button>
                  </span>
                ) : (
                  <button
                    onClick={() => setEditingMasuk(row.employee.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-400 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                    disabled={row.isLibur}
                  >
                    Belum Presensi ✎
                  </button>
                )}
              </div>

              {/* PULANG */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-400 w-14">PULANG</span>
                {editingPulang === row.employee.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="time"
                      defaultValue={row.attendance?.jamPulang || row.schedule?.jamPulang || '15:00'}
                      className="w-28 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      onBlur={(e) => setJamPulang(row.employee.id, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setJamPulang(row.employee.id, (e.target as HTMLInputElement).value); }}
                      autoFocus
                    />
                    <button onClick={() => setEditingPulang(null)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                ) : row.attendance?.jamPulang ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                    {row.attendance.jamPulang} Pulang
                    <button onClick={() => setEditingPulang(row.employee.id)} className="text-gray-400 hover:text-gray-600 ml-1">✎</button>
                  </span>
                ) : (
                  <button
                    onClick={() => setEditingPulang(row.employee.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-400 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                    disabled={row.isLibur || !row.attendance?.jamMasuk}
                  >
                    Belum Presensi ✎
                  </button>
                )}
              </div>

              {/* Status toggle */}
              <div className="flex items-center gap-2 shrink-0">
                {row.attendance ? (
                  <button
                    onClick={() => toggleStatus(row.employee.id, row.attendance!.status)}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    title="Ubah status"
                  >
                    <Badge variant={statusVariant(row.attendance.status) as 'success' | 'warning' | 'danger' | 'info' | 'default'}>
                      {row.attendance.status}
                    </Badge>
                  </button>
                ) : row.isLibur ? (
                  <Badge variant="default">Libur</Badge>
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                )}
              </div>
            </div>
          ))}
          {employeeRows.length === 0 && (
            <div className="px-5 py-10 text-center text-gray-400">Tidak ada data pegawai</div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ==================== TAB: JADWAL PRESENSI PEGAWAI ====================
function JadwalPegawaiTab({ employees }: { employees: Employee[] }) {
  const [selectedHari, setSelectedHari] = useState<Hari>('senin');
  const [schedules, setSchedules] = useState<EmployeeSchedule[]>(dummyEmployeeSchedules);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPegawaiId, setEditingPegawaiId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ jamMasuk: string; jamPulang: string; toleransiTerlambat: number }>({
    jamMasuk: '07:00', jamPulang: '15:00', toleransiTerlambat: 15,
  });

  const pegawaiRows = useMemo(() => {
    return employees.map((emp, idx) => {
      const schedule = schedules.find((s) => s.pegawaiId === emp.id && s.hari === selectedHari);
      return {
        no: idx + 1,
        employee: emp,
        schedule: schedule || null,
        hasSchedule: !!schedule && !schedule.isLibur && schedule.jamMasuk !== '',
      };
    });
  }, [employees, schedules, selectedHari]);

  const openAdd = (pegawaiId: string) => {
    setEditingPegawaiId(pegawaiId);
    const existing = schedules.find((s) => s.pegawaiId === pegawaiId && s.hari === selectedHari);
    if (existing && !existing.isLibur) {
      setFormData({ jamMasuk: existing.jamMasuk, jamPulang: existing.jamPulang, toleransiTerlambat: existing.toleransiTerlambat });
    } else {
      setFormData({ jamMasuk: '07:00', jamPulang: '15:00', toleransiTerlambat: 15 });
    }
    setModalOpen(true);
  };

  const saveSchedule = () => {
    if (!editingPegawaiId) return;
    setSchedules((prev) => {
      const existingIdx = prev.findIndex((s) => s.pegawaiId === editingPegawaiId && s.hari === selectedHari);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...formData, isLibur: false };
        return updated;
      }
      return [
        ...prev,
        {
          id: `es-new-${Date.now()}`,
          pegawaiId: editingPegawaiId,
          hari: selectedHari,
          ...formData,
          isLibur: false,
        },
      ];
    });
    setModalOpen(false);
    setEditingPegawaiId(null);
  };

  const removeSchedule = (pegawaiId: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.pegawaiId === pegawaiId && s.hari === selectedHari
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
              setEditingPegawaiId(null);
              setFormData({ jamMasuk: '07:00', jamPulang: '15:00', toleransiTerlambat: 15 });
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
          >
            ⚙️ Setting Jadwal Presensi
          </button>
        </div>
      </Card>

      {/* Schedule Table */}
      <Card title="Daftar Jadwal Pegawai" subtitle={`Baris per pegawai, jadwal untuk hari ${HARI_LABEL[selectedHari]}.`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 w-12">NO</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">NAMA PEGAWAI</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">JABATAN</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">JAM PRESENSI</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pegawaiRows.map((row) => (
                <tr key={row.employee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center text-gray-500">{row.no}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {getInitials(row.employee.nama)}
                      </div>
                      <span className="font-medium text-gray-800">{row.employee.nama}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.employee.jabatan}</td>
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
                        onClick={() => openAdd(row.employee.id)}
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
                          onClick={() => removeSchedule(row.employee.id)}
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
              {pegawaiRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">Tidak ada data pegawai</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Setting Jadwal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingPegawaiId(null); }} title="Setting Jadwal Presensi Pegawai" size="md">
        <div className="space-y-4">
          {editingPegawaiId ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pegawai</label>
              <input
                type="text"
                value={employees.find((e) => e.id === editingPegawaiId)?.nama || editingPegawaiId}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pegawai</label>
              <select
                value={editingPegawaiId || ''}
                onChange={(e) => setEditingPegawaiId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Pilih Pegawai</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.nama} — {emp.jabatan}</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Toleransi Keterlambatan (menit)</label>
            <input
              type="number"
              value={formData.toleransiTerlambat}
              onChange={(e) => setFormData((f) => ({ ...f, toleransiTerlambat: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              min={0} max={120}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => { setModalOpen(false); setEditingPegawaiId(null); }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={saveSchedule}
              disabled={!editingPegawaiId || !formData.jamMasuk || !formData.jamPulang}
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

// ==================== TAB: LAPORAN PRESENSI PEGAWAI ====================
function LaporanPegawaiTab({ employees }: { employees: Employee[] }) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [attendances] = useState<AttendanceEmployee[]>(dummyAttendanceEmployees);

  const report = useMemo(() => {
    const totalHari = daysInMonth(selectedYear, selectedMonth + 1);
    const totalPossible = employees.length * totalHari;

    const monthAtts = attendances.filter((a) => {
      const [y, m] = a.tanggal.split('-').map(Number);
      return y === selectedYear && m === selectedMonth + 1;
    });

    const hadir = monthAtts.filter((a) => a.status === 'hadir').length;
    const izin = monthAtts.filter((a) => a.status === 'izin').length;
    const sakit = monthAtts.filter((a) => a.status === 'sakit').length;
    const alpha = monthAtts.filter((a) => a.status === 'alpha').length;

    return {
      totalPegawai: employees.length,
      hadir, izin, sakit, alpha,
      persentaseKehadiran: totalPossible > 0 ? Math.round((hadir / totalPossible) * 100) : 0,
    };
  }, [employees, selectedMonth, selectedYear, attendances]);

  const pegawaiReports = useMemo(() => {
    const totalHari = daysInMonth(selectedYear, selectedMonth + 1);
    return employees.map((emp) => {
      const empAtts = attendances.filter((a) => {
        if (a.pegawaiId !== emp.id) return false;
        const [y, m] = a.tanggal.split('-').map(Number);
        return y === selectedYear && m === selectedMonth + 1;
      });
      const hadir = empAtts.filter((a) => a.status === 'hadir').length;
      const izin = empAtts.filter((a) => a.status === 'izin').length;
      const sakit = empAtts.filter((a) => a.status === 'sakit').length;
      const alpha = empAtts.filter((a) => a.status === 'alpha').length;
      return {
        employee: emp,
        hadir, izin, sakit, alpha,
        persentase: totalHari > 0 ? Math.round((hadir / totalHari) * 100) : 0,
      };
    });
  }, [employees, selectedMonth, selectedYear, attendances]);

  const years = useMemo(() => {
    const cy = now.getFullYear();
    return Array.from({ length: 5 }, (_, i) => cy - 2 + i);
  }, [now]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
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

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Total Pegawai" value={report.totalPegawai} color="blue" />
        <StatCard title="Hadir" value={report.hadir} color="green" />
        <StatCard title="Izin" value={report.izin} color="blue" />
        <StatCard title="Sakit" value={report.sakit} color="yellow" />
        <StatCard title="Alpha" value={report.alpha} color="red" />
        <StatCard title="% Kehadiran" value={`${report.persentaseKehadiran}%`} color="purple" />
      </div>

      {/* Employee Report Table */}
      <Card title={`Laporan Presensi Pegawai - ${BULAN_LABEL[selectedMonth]} ${selectedYear}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Pegawai</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Jabatan</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Hadir</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Izin</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Sakit</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Alpha</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">% Hadir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pegawaiReports.map((r, i) => (
                <tr key={r.employee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{r.employee.nama}</td>
                  <td className="px-4 py-3 text-gray-500">{r.employee.jabatan}</td>
                  <td className="px-4 py-3 text-center"><Badge variant="success">{r.hadir}</Badge></td>
                  <td className="px-4 py-3 text-center"><Badge variant="info">{r.izin}</Badge></td>
                  <td className="px-4 py-3 text-center"><Badge variant="warning">{r.sakit}</Badge></td>
                  <td className="px-4 py-3 text-center"><Badge variant="danger">{r.alpha}</Badge></td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.persentase >= 80 ? 'bg-green-100 text-green-700' : r.persentase >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.persentase}%
                    </span>
                  </td>
                </tr>
              ))}
              {pegawaiReports.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">Tidak ada data pegawai</td>
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
export default function PresensiPegawaiPage() {
  return <PresensiPegawaiContent />;
}
