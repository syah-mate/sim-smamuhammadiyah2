'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { generateId } from '@/lib/utils';

const BANKS = [
  { id: 'bca', name: 'BANK BCA', color: 'bg-blue-600' },
  { id: 'mandiri', name: 'BANK MANDIRI', color: 'bg-yellow-600' },
  { id: 'bni', name: 'BANK BNI', color: 'bg-orange-500' },
  { id: 'bri', name: 'BANK BRI', color: 'bg-blue-700' },
  { id: 'bsi', name: 'BANK BSI', color: 'bg-teal-600' },
];

function KonfirmasiContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const monthLabel = searchParams.get('monthLabel') || '-';
  const bulanCount = parseInt(searchParams.get('bulanCount') || '1');
  const total = parseInt(searchParams.get('total') || '0');
  const months = searchParams.get('months') || '';
  const siswaId = searchParams.get('siswaId') || 's1';

  const adminFee = 3500;
  const totalPembayaran = total + adminFee;

  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'bank' | null>(null);
  const [selectedBank, setSelectedBank] = useState('');

  const handleBankSelect = (bankId: string) => {
    setSelectedMethod('bank');
    setSelectedBank(bankId);
  };

  const handleLanjutkan = () => {
    if (!selectedMethod || (selectedMethod === 'bank' && !selectedBank)) return;
    const bankName = selectedMethod === 'qris' ? 'QRIS' : BANKS.find((b) => b.id === selectedBank)?.name || '';
    const vaNumber = selectedMethod === 'qris'
      ? ''
      : `70014${generateId('va').replace(/\D/g, '').slice(0, 11)}`;

    const params = new URLSearchParams({
      monthLabel,
      bulanCount: String(bulanCount),
      total: String(total),
      method: selectedMethod,
      bankName,
      vaNumber,
      siswaId,
      months,
    });
    router.push(`/mobile-app-siswa/tagihan-siswa/informasi?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header - Teal */}
      <div className="bg-teal-500 text-white px-4 pt-6 pb-5 rounded-b-2xl">
        <h1 className="text-lg font-bold">Konfirmasi Pembayaran</h1>
        <p className="text-teal-100 text-xs mt-0.5">Pilih metode pembayaran</p>
      </div>

      {/* Summary */}
      <div className="bg-white mx-4 -mt-3 rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Ringkasan</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Bulan yang dipilih:</span>
            <span className="text-gray-700 font-medium">{bulanCount} Bulan</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Bulan:</span>
            <span className="text-gray-700 font-medium">{monthLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Biaya Admin:</span>
            <span className="text-gray-700 font-medium">Rp {adminFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between">
            <span className="text-gray-800 font-semibold">Total Pembayaran:</span>
            <span className="text-teal-600 font-bold text-lg">
              Rp {totalPembayaran.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-4 mt-4 space-y-3 pb-6">
        {/* QRIS */}
        <button
          onClick={() => setSelectedMethod('qris')}
          className={`w-full bg-white rounded-xl border-2 p-4 flex items-center gap-4 transition-all
            ${selectedMethod === 'qris' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2m4-4v1m-4 3h2m-2-7h2m0 4v1m-4-3h2m0 3h2M7 7h.01M7 11h.01M7 15h.01M7 19h.01M11 7h1v4M11 15h2v-2m-1 2v2" />
            </svg>
          </div>
          <div className="text-left flex-1">
            <h4 className="text-sm font-bold text-gray-800">QRIS</h4>
            <p className="text-xs text-gray-500">Scan QR Code untuk membayar</p>
          </div>
          {selectedMethod === 'qris' && (
            <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Virtual Account Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Virtual Account</h3>
          </div>
          {BANKS.map((bank) => (
            <button
              key={bank.id}
              onClick={() => handleBankSelect(bank.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-50 transition-colors
                ${selectedBank === bank.id ? 'bg-teal-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${bank.color} rounded-lg flex items-center justify-center text-white text-[10px] font-bold`}>
                  {bank.id.toUpperCase().slice(0, 2)}
                </div>
                <span className="text-sm font-medium text-gray-800">{bank.name}</span>
              </div>
              {selectedBank === bank.id && (
                <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleLanjutkan}
          disabled={!selectedMethod || (selectedMethod === 'bank' && !selectedBank)}
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition-colors shadow-sm mt-4
            ${(selectedMethod === 'qris' || (selectedMethod === 'bank' && selectedBank))
              ? 'bg-teal-500 text-white hover:bg-teal-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          Lanjutkan Pembayaran
        </button>
      </div>
    </div>
  );
}

export default function KonfirmasiPembayaranPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
      </div>
    }>
      <KonfirmasiContent />
    </Suspense>
  );
}
