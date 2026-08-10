'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { dummyStudents } from '@/data/students';
import { dummyBillDetails, dummyBills } from '@/data/finance';
import { generateId } from '@/lib/utils';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// Generate per-bulan tagihan entries for the mobile view
function getMonthlyBills(siswaId: string, tahunAjaran: string) {
  const bills = dummyBills.filter((b) => b.siswaId === siswaId && b.tahunAjaran === tahunAjaran);
  const allDetails = bills.flatMap((b) =>
    dummyBillDetails
      .filter((d) => d.billId === b.id)
  );

  if (allDetails.length === 0) {
    // Generate dummy per-month entries
    return MONTHS.map((m, idx) => ({
      id: generateId('tagihan'),
      bulan: idx,
      label: m,
      nominal: 350000 + Math.floor(Math.random() * 200000),
      status: idx < 6 ? 'lunas' as const : 'belum' as const,
    }));
  }

  // Aggregate per month from details
  const monthMap = new Map<number, { label: string; nominal: number; status: string }>();
  allDetails.forEach((d) => {
    const existing = monthMap.get(d.bulan) || { label: d.label, nominal: 0, status: 'belum' };
    existing.nominal += d.nominal;
    if (existing.status !== 'lunas') existing.status = d.status;
    monthMap.set(d.bulan, existing);
  });

  return Array.from(monthMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([bulan, val]) => ({
      id: generateId('tagihan'),
      bulan,
      label: val.label,
      nominal: val.nominal,
      status: val.status,
    }));
}

export default function TagihanSiswaPage() {
  const router = useRouter();
  const [selectedSiswaId, setSelectedSiswaId] = useState('s1');
  const [tahunAjaran, setTahunAjaran] = useState('2025/2026');
  const [selectedMonths, setSelectedMonths] = useState<Set<number>>(new Set([1])); // February selected by default

  const monthlyBills = useMemo(
    () => getMonthlyBills(selectedSiswaId, tahunAjaran),
    [selectedSiswaId, tahunAjaran]
  );

  const totalSemua = useMemo(() => monthlyBills.reduce((s, b) => s + b.nominal, 0), [monthlyBills]);
  const totalBelumLunas = useMemo(
    () => monthlyBills.filter((b) => b.status !== 'lunas').reduce((s, b) => s + b.nominal, 0),
    [monthlyBills]
  );

  const totalDipilih = useMemo(
    () => monthlyBills.filter((b) => selectedMonths.has(b.bulan)).reduce((s, b) => s + b.nominal, 0),
    [monthlyBills, selectedMonths]
  );

  const selectedCount = selectedMonths.size;

  const toggleMonth = (bulan: number) => {
    setSelectedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(bulan)) next.delete(bulan);
      else next.add(bulan);
      return next;
    });
  };

  const handleBayarSekarang = () => {
    if (selectedCount === 0) return;
    const months = Array.from(selectedMonths).sort();
    const monthLabels = months.map((m) => MONTHS[m]).join(', ');
    const params = new URLSearchParams({
      siswaId: selectedSiswaId,
      months: months.join(','),
      monthLabel: monthLabels,
      total: String(totalDipilih),
      bulanCount: String(selectedCount),
    });
    router.push(`/mobile-app-siswa/tagihan-siswa/konfirmasi?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header - Teal */}
      <div className="bg-teal-500 text-white px-4 pt-6 pb-5 rounded-b-2xl">
        <h1 className="text-lg font-bold">Tagihan Siswa</h1>
        <p className="text-teal-100 text-xs mt-0.5">Monitor dan kelola tagihan pembayaran</p>
      </div>

      <div className="px-4 -mt-3 space-y-3 pb-24">
        {/* Student Selector */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
            Pilih Siswa *
          </label>
          <select
            value={selectedSiswaId}
            onChange={(e) => setSelectedSiswaId(e.target.value)}
            className="w-full border border-teal-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {dummyStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.namaLengkap} — {s.kelas} ({s.jurusan}) &bull; NISN: {s.nisn}
              </option>
            ))}
          </select>
        </div>

        {/* Tahun Ajaran */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
            Tahun Ajaran *
          </label>
          <select
            value={tahunAjaran}
            onChange={(e) => setTahunAjaran(e.target.value)}
            className="w-full border border-teal-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="2024/2025">2024/2025</option>
            <option value="2025/2026">2025/2026</option>
            <option value="2026/2027">2026/2027</option>
          </select>
        </div>

        {/* Total Cards */}
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <p className="text-xs text-teal-600 font-medium">Total Tagihan Semua Bulan</p>
          <p className="text-xl font-bold text-teal-700 mt-1">
            Rp {totalSemua.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-xs text-red-600 font-medium">Total Tagihan Belum Lunas Semua Bulan</p>
          <p className="text-xl font-bold text-red-700 mt-1">
            Rp {totalBelumLunas.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Monthly Bill List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800">Daftar Tagihan per Bulan</h3>
          </div>
          {monthlyBills.map((bill) => {
            const isSelected = selectedMonths.has(bill.bulan);
            return (
              <button
                key={bill.id}
                onClick={() => toggleMonth(bill.bulan)}
                disabled={bill.status === 'lunas'}
                className={`w-full flex items-center justify-between px-4 py-3 border-b border-gray-50 transition-colors
                  ${isSelected ? 'bg-teal-50' : 'hover:bg-gray-50'}
                  ${bill.status === 'lunas' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 ${bill.status === 'lunas' ? 'border-gray-300 bg-gray-100' : 'border-gray-300'}`} />
                  )}
                  <span className="text-sm font-medium text-gray-800">{bill.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400">Total</p>
                  <p className="text-sm font-semibold text-gray-700">
                    Rp {bill.nominal.toLocaleString('id-ID')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer — Fixed */}
      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-40">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">{selectedCount} Bulan Dipilih</p>
              <p className="text-base font-bold text-gray-800">
                Rp {totalDipilih.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMonths(new Set())}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batalkan
              </button>
              <button
                onClick={handleBayarSekarang}
                className="px-5 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors shadow-sm"
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
