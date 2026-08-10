'use client';

import React, { useState, useMemo } from 'react';
import { dummyStudents } from '@/data/students';
import { generateId } from '@/lib/utils';

// --- Types for this page ---
interface PresensiRecord {
  id: string;
  siswaId: string;
  kelasId: string;
  tanggal: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  jamMasuk: string;
  jamPulang: string;
}

// --- Dummy presensi data for February 2026 ---
function getDummyPresensiFeb2026(): PresensiRecord[] {
  const records: PresensiRecord[] = [];
  const siswaList = dummyStudents.slice(0, 1); // Mobile app hanya untuk 1 siswa
  const statuses: PresensiRecord['status'][] = ['hadir', 'hadir', 'hadir', 'izin', 'sakit', 'hadir', 'alpha', 'hadir', 'izin', 'hadir'];

  siswaList.forEach((s, idx) => {
    // Generate random presensi for each day in Feb 2026
    for (let day = 1; day <= 28; day++) {
      const d = day < 10 ? `0${day}` : `${day}`;
      const status = day <= 20 ? statuses[idx % statuses.length] : (Math.random() > 0.7 ? 'izin' : 'hadir');
      records.push({
        id: generateId('presensi'),
        siswaId: s.id,
        kelasId: s.kelas,
        tanggal: `2026-02-${d}`,
        status,
        jamMasuk: status === 'hadir' ? `0${6 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : '',
        jamPulang: status === 'hadir' ? `${12 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : '',
      });
    }
  });
  return records;
}

const dummyPresensi = getDummyPresensiFeb2026();

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function PresensiSiswaPage() {
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(1); // February (0-indexed: 1 = Feb)
  const [selectedDate, setSelectedDate] = useState('2026-02-20');

  const changeMonth = (delta: number) => {
    let newMonth = viewMonth + delta;
    let newYear = viewYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setViewMonth(newMonth);
    setViewYear(newYear);
  };

  // Calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [viewYear, viewMonth]);

  // Records for selected date
  const recordsForDate = useMemo(() => {
    return dummyPresensi.filter((r) => r.tanggal === selectedDate);
  }, [selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hadir': return 'bg-green-500';
      case 'izin': return 'bg-yellow-500';
      case 'sakit': return 'bg-orange-400';
      case 'alpha': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'hadir': return 'Hadir';
      case 'izin': return 'Izin';
      case 'sakit': return 'Sakit';
      case 'alpha': return 'Alpha';
      default: return status;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'hadir': return 'bg-green-50 border-green-200';
      case 'izin': return 'bg-yellow-50 border-yellow-200';
      case 'sakit': return 'bg-orange-50 border-orange-200';
      case 'alpha': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const isSelectedDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return selectedDate === `${viewYear}-${m}-${d}`;
  };

  const handleDateSelect = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    setSelectedDate(`${viewYear}-${m}-${d}`);
  };

  const formatDisplayDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    const d = parseInt(parts[2]);
    const m = parseInt(parts[1]);
    return `${d} ${MONTHS[m - 1]} ${parts[0]}`;
  };

  const getSiswaName = (siswaId: string) => {
    return dummyStudents.find((s) => s.id === siswaId)?.namaLengkap || siswaId;
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header - Purple */}
      <div className="bg-purple-600 text-white px-4 pt-6 pb-5 rounded-b-2xl">
        <h1 className="text-lg font-bold">Presensi Siswa</h1>
        <p className="text-purple-200 text-xs mt-0.5">Pilih tanggal untuk melihat log presensi</p>
      </div>

      {/* Calendar */}
      <div className="bg-white mx-4 -mt-3 rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-base font-bold text-gray-800">
            {MONTHS[viewMonth]} {viewYear}
          </h3>
          <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-semibold text-gray-500">{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-y-1.5">
          {calendarDays.map((day, idx) => (
            <div key={idx} className="flex justify-center">
              {day !== null ? (
                <button
                  onClick={() => handleDateSelect(day)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${isSelectedDate(day)
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-purple-100'
                    }`}
                >
                  {day}
                </button>
              ) : (
                <span className="w-9 h-9" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* GPS Button */}
      <div className="px-4 mt-3">
        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Presensi Menggunakan GPS
        </button>
      </div>

      {/* Recap Header */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-800">
            Rekap Presensi - {formatDisplayDate(selectedDate)}
          </h3>
        </div>
      </div>

      {/* Attendance List */}
      <div className="px-4 mt-2 pb-6 space-y-2">
        {recordsForDate.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-400 text-sm">
            Tidak ada data presensi untuk tanggal ini
          </div>
        ) : (
          recordsForDate.map((record) => (
            <div
              key={record.id}
              className={`rounded-xl border p-4 ${getStatusBg(record.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {getSiswaName(record.siswaId)}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Siswa ID: {record.siswaId} &bull; Kelas ID: {record.kelasId}
                  </p>
                </div>
                <span className={`text-white text-[11px] font-semibold px-2.5 py-1 rounded-full ${getStatusColor(record.status)}`}>
                  {getStatusLabel(record.status)}
                </span>
              </div>
              {record.status === 'hadir' && record.jamMasuk && (
                <div className="flex gap-4 mt-2 text-[11px] text-gray-600">
                  <span>Jam Masuk: {record.jamMasuk}</span>
                  {record.jamPulang && <span>Jam Pulang: {record.jamPulang}</span>}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
