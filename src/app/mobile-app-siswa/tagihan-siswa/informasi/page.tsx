'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function InformasiContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const monthLabel = searchParams.get('monthLabel') || '-';
  const bulanCount = parseInt(searchParams.get('bulanCount') || '1');
  const total = parseInt(searchParams.get('total') || '0');
  const bankName = searchParams.get('bankName') || 'BANK BCA';
  const vaNumber = searchParams.get('vaNumber') || '70014290606915';
  const siswaId = searchParams.get('siswaId') || 's1';
  const months = searchParams.get('months') || '';

  const [copied, setCopied] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(vaNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSayaSudahBayar = () => {
    setHasPaid(true);
  };

  const handleGantiMetode = () => {
    const params = new URLSearchParams({
      siswaId,
      monthLabel,
      months,
      bulanCount: String(bulanCount),
      total: String(total),
    });
    router.push(`/mobile-app-siswa/tagihan-siswa/konfirmasi?${params.toString()}`);
  };

  const handleKembali = () => {
    router.push('/mobile-app-siswa/tagihan-siswa');
  };

  if (hasPaid) {
    return (
      <div className="flex flex-col min-h-full">
        <div className="bg-teal-500 text-white px-4 pt-6 pb-5 rounded-b-2xl">
          <h1 className="text-lg font-bold">Pembayaran Berhasil</h1>
          <p className="text-teal-100 text-xs mt-0.5">Pembayaran Anda sedang diproses</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Terima Kasih!</h2>
          <p className="text-gray-500 text-sm mb-2">
            Pembayaran untuk {monthLabel} sebesar
          </p>
          <p className="text-xl font-bold text-teal-600 mb-6">
            Rp {total.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Status pembayaran akan diperbarui dalam 1x24 jam
          </p>
          <button
            onClick={handleKembali}
            className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors shadow-sm"
          >
            Kembali ke Tagihan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header - Teal */}
      <div className="bg-teal-500 text-white px-4 pt-6 pb-5 rounded-b-2xl">
        <h1 className="text-lg font-bold">Informasi Pembayaran</h1>
        <p className="text-teal-100 text-xs mt-0.5">Selesaikan pembayaran Anda</p>
      </div>

      <div className="px-4 -mt-3 space-y-3 pb-6">
        {/* Transfer To */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            {bankName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-[10px] text-gray-400">Transfer ke</p>
            <p className="text-lg font-bold text-gray-800">{bankName}</p>
          </div>
        </div>

        {/* Virtual Account Number */}
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wide mb-2">
            Nomor Virtual Account
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-gray-800 tracking-wider">{vaNumber}</p>
            <button
              onClick={handleCopy}
              className={'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ' + (copied ? 'bg-green-500 text-white' : 'bg-teal-500 text-white hover:bg-teal-600')}
            >
              {copied ? 'Tersalin!' : 'Salin'}
            </button>
          </div>
        </div>

        {/* Payment Detail */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Detail Pembayaran</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Bulan yang dibayar:</span>
              <span className="text-gray-700 font-medium">{bulanCount} Bulan</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Bulan:</span>
              <span className="text-gray-700 font-medium">{monthLabel}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between">
              <span className="text-gray-800 font-semibold">Total Pembayaran:</span>
              <span className="text-teal-600 font-bold">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <h3 className="text-sm font-bold text-teal-700 mb-3">Petunjuk Pembayaran</h3>
          <ol className="space-y-2 text-xs text-teal-800">
            <li className="flex gap-2">
              <span className="font-bold text-teal-600 flex-shrink-0">1.</span>
              Buka aplikasi mobile banking atau m-banking Anda
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-teal-600 flex-shrink-0">2.</span>
              Pilih menu Transfer / Pembayaran
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-teal-600 flex-shrink-0">3.</span>
              Pilih Virtual Account
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-teal-600 flex-shrink-0">4.</span>
              Masukkan nomor VA di atas
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-teal-600 flex-shrink-0">5.</span>
              Periksa detail pembayaran
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-teal-600 flex-shrink-0">6.</span>
              Konfirmasi dan selesaikan pembayaran
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-teal-600 flex-shrink-0">7.</span>
              Klik tombol &quot;Saya Sudah Bayar&quot; di bawah
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleSayaSudahBayar}
            className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
          >
            Saya Sudah Bayar
          </button>
          <button
            onClick={handleGantiMetode}
            className="w-full py-3 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Ganti Metode Bayar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InformasiPembayaranPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
      </div>
    }>
      <InformasiContent />
    </Suspense>
  );
}
