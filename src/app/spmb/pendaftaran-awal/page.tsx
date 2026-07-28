'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SPMBJenisDaftar, SPMBRegistration } from '@/types';
import { generateNoPendaftaran, generatePassword, generateNoVA } from '@/data/spmb';

type Step = 1 | 2 | 3;

type FormErrors = Record<string, string>;

const BIAYA_FORMULIR = 400000;

export default function PendaftaranAwalPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [jenisDaftar, setJenisDaftar] = useState<SPMBJenisDaftar | null>(null);
  const [tahunAjaran, setTahunAjaran] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<SPMBRegistration | null>(null);

  const [form, setForm] = useState({
    namaLengkapSiswa: '',
    nisn: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'L' as 'L' | 'P',
    namaAyah: '',
    namaIbu: '',
    alamat: '',
    email: '',
    noTelp: '',
    asalSekolah: '',
  });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePilihJenis = (jenis: SPMBJenisDaftar) => {
    setJenisDaftar(jenis);
    if (jenis === 'mutasi') {
      setTahunAjaran('2026/2027');
      setStep(2);
    } else {
      setStep(2);
    }
  };

  const validateForm = (): boolean => {
    const errs: FormErrors = {};
    if (!form.namaLengkapSiswa.trim()) errs.namaLengkapSiswa = 'Nama lengkap wajib diisi';
    if (!form.nisn.trim()) errs.nisn = 'NISN wajib diisi';
    else if (!/^\d+$/.test(form.nisn)) errs.nisn = 'NISN harus berupa angka';
    if (!form.tempatLahir.trim()) errs.tempatLahir = 'Tempat lahir wajib diisi';
    if (!form.tanggalLahir) errs.tanggalLahir = 'Tanggal lahir wajib diisi';
    if (!form.namaAyah.trim()) errs.namaAyah = 'Nama ayah wajib diisi';
    if (!form.namaIbu.trim()) errs.namaIbu = 'Nama ibu wajib diisi';
    if (!form.alamat.trim()) errs.alamat = 'Alamat wajib diisi';
    if (!form.email.trim()) errs.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Format email tidak valid';
    if (!form.noTelp.trim()) errs.noTelp = 'No. telepon wajib diisi';
    if (!form.asalSekolah.trim()) errs.asalSekolah = 'Asal sekolah wajib diisi';
    if (jenisDaftar === 'reguler' && !tahunAjaran) errs.tahunAjaran = 'Pilih tahun ajaran';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !jenisDaftar) return;

    const noPendaftaran = generateNoPendaftaran(jenisDaftar);
    const password = generatePassword();
    const noVA = generateNoVA();

    const registration: SPMBRegistration = {
      id: `spmb-${Date.now()}`,
      noPendaftaran,
      jenisDaftar,
      tahunAjaran: jenisDaftar === 'mutasi' ? '2026/2027' : tahunAjaran,
      namaLengkapSiswa: form.namaLengkapSiswa,
      nisn: form.nisn,
      namaAyah: form.namaAyah,
      namaIbu: form.namaIbu,
      email: form.email,
      noTelp: form.noTelp,
      tempatLahir: form.tempatLahir,
      tanggalLahir: form.tanggalLahir,
      jenisKelamin: form.jenisKelamin,
      alamat: form.alamat,
      asalSekolah: form.asalSekolah,
      username: form.noTelp,
      password,
      biayaFormulir: BIAYA_FORMULIR,
      noVA,
      statusBayarFormulir: 'belum_bayar',
      statusAkhir: 'menunggu_pembayaran',
      tanggalDaftar: new Date().toISOString().split('T')[0],
    };

    setResult(registration);
    setStep(3);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const goToPengisian = () => {
    if (result) {
      router.push(`/spmb/pengisian-data?username=${encodeURIComponent(result.username)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col">
      {/* Header */}
      <div className="py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow">
            <span className="text-lg font-bold text-blue-600">SM</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">SMA Muhammadiyah 2 Surabaya</p>
            <p className="text-blue-200 text-xs">SPMB — Pendaftaran Awal</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-blue-200">
            <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-white/20 text-white' : 'bg-white/5 text-blue-300'}`}>1. Pilih Jenis</span>
            <span className="text-blue-300">→</span>
            <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-white/20 text-white' : 'bg-white/5 text-blue-300'}`}>2. Isi Formulir</span>
            <span className="text-blue-300">→</span>
            <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-white/20 text-white' : 'bg-white/5 text-blue-300'}`}>3. Hasil</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-2xl mt-4">

          {/* Step 1: Pilih Jenis Pendaftaran */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h1 className="text-xl font-bold text-gray-800 text-center mb-2">Pilih Jenis Pendaftaran</h1>
              <p className="text-gray-500 text-center text-sm mb-8">Silakan pilih jalur pendaftaran yang sesuai</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card Reguler */}
                <div
                  onClick={() => handlePilihJenis('reguler')}
                  className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all text-center group"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Pendaftaran Reguler</h3>
                  <p className="text-sm text-gray-500 mb-4">Untuk calon siswa baru jalur reguler</p>
                  <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg group-hover:bg-blue-700 transition-colors">
                    Pilih Reguler
                  </span>
                </div>
                {/* Card Mutasi */}
                <div
                  onClick={() => handlePilihJenis('mutasi')}
                  className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all text-center group"
                >
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Pendaftaran Mutasi</h3>
                  <p className="text-sm text-gray-500 mb-4">Untuk siswa pindahan dari sekolah lain</p>
                  <span className="inline-block px-4 py-2 bg-green-600 text-white text-sm rounded-lg group-hover:bg-green-700 transition-colors">
                    Pilih Mutasi
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Form */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h1 className="text-xl font-bold text-gray-800 mb-1">Formulir Pendaftaran</h1>
              <p className="text-gray-500 text-sm mb-6">
                {jenisDaftar === 'reguler' ? 'Pendaftaran Reguler' : 'Pendaftaran Mutasi'}
              </p>

              {/* Tahun Ajaran */}
              {jenisDaftar === 'reguler' && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm font-medium text-blue-800 mb-3">Pilih Tahun Ajaran:</p>
                  <div className="flex gap-3 flex-wrap">
                    {(['2027/2028', '2028/2029', '2029/2030'] as const).map((ta) => (
                      <button
                        key={ta}
                        type="button"
                        onClick={() => { setTahunAjaran(ta); if (errors.tahunAjaran) setErrors((prev) => { const n = { ...prev }; delete n.tahunAjaran; return n; }); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                          tahunAjaran === ta
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-200 text-gray-600 hover:border-blue-300'
                        }`}
                      >
                        TA {ta}
                      </button>
                    ))}
                  </div>
                  {errors.tahunAjaran && <p className="text-red-500 text-xs mt-2">{errors.tahunAjaran}</p>}
                </div>
              )}
              {jenisDaftar === 'mutasi' && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
                  <span className="text-green-600 text-xl">ℹ️</span>
                  <div>
                    <p className="text-sm font-medium text-green-800">Tahun Ajaran: 2026/2027</p>
                    <p className="text-xs text-green-600">Tahun ajaran mutasi otomatis ditentukan</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <FormField label="Nama Lengkap Siswa" name="namaLengkapSiswa" value={form.namaLengkapSiswa} onChange={(e) => updateForm('namaLengkapSiswa', e.target.value)} required error={errors.namaLengkapSiswa} />
                  <FormField label="NISN" name="nisn" type="number" value={form.nisn} onChange={(e) => updateForm('nisn', e.target.value)} required error={errors.nisn} />
                  <FormField label="Tempat Lahir" name="tempatLahir" value={form.tempatLahir} onChange={(e) => updateForm('tempatLahir', e.target.value)} required error={errors.tempatLahir} />
                  <FormField label="Tanggal Lahir" name="tanggalLahir" type="date" value={form.tanggalLahir} onChange={(e) => updateForm('tanggalLahir', e.target.value)} required error={errors.tanggalLahir} />
                  <FormField label="Jenis Kelamin" name="jenisKelamin" type="select" value={form.jenisKelamin} onChange={(e) => updateForm('jenisKelamin', e.target.value)} options={[{ value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' }]} />
                  <FormField label="Nama Ayah" name="namaAyah" value={form.namaAyah} onChange={(e) => updateForm('namaAyah', e.target.value)} required error={errors.namaAyah} />
                  <FormField label="Nama Ibu" name="namaIbu" value={form.namaIbu} onChange={(e) => updateForm('namaIbu', e.target.value)} required error={errors.namaIbu} />
                  <FormField label="Email" name="email" type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} required error={errors.email} />
                  <FormField label="No. Telp / No. HP" name="noTelp" type="tel" value={form.noTelp} onChange={(e) => updateForm('noTelp', e.target.value)} required error={errors.noTelp} placeholder="Ini akan menjadi username login" />
                  <FormField label="Asal Sekolah" name="asalSekolah" value={form.asalSekolah} onChange={(e) => updateForm('asalSekolah', e.target.value)} required error={errors.asalSekolah} />
                  <FormField label="Alamat" name="alamat" className="sm:col-span-2" type="textarea" value={form.alamat} onChange={(e) => updateForm('alamat', e.target.value)} required error={errors.alamat} />
                </div>

                <div className="flex justify-between gap-3 pt-6 mt-6 border-t border-gray-100">
                  <button type="button" onClick={() => { setStep(1); setJenisDaftar(null); setTahunAjaran(''); }} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    ← Kembali
                  </button>
                  <button type="submit" className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Daftar Sekarang
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Hasil */}
          {step === 3 && result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              {/* Success Header */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-800">Pendaftaran Berhasil</h1>
                <p className="text-sm text-gray-500 mt-1">Selamat! Pendaftaran Anda telah berhasil diproses.</p>
              </div>

              {/* Nomor Pendaftaran */}
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 mb-1">Nomor Pendaftaran</p>
                <p className="text-2xl font-bold text-blue-800 tracking-wider">{result.noPendaftaran}</p>
              </div>

              {/* Box Nama Siswa */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500">Siswa</p>
                <p className="text-lg font-semibold text-gray-800">{result.namaLengkapSiswa}</p>
                <p className="text-sm text-gray-500">{result.jenisDaftar === 'reguler' ? 'Reguler' : 'Mutasi'} — TA {result.tahunAjaran}</p>
              </div>

              {/* Box Warning - Simpan Informasi Login */}
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-yellow-600 text-lg mt-0.5">⚠️</span>
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">Simpan informasi login berikut</p>
                    <p className="text-xs text-yellow-700">Password tidak bisa dilihat lagi setelah halaman ini ditutup.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-yellow-100">
                    <div>
                      <p className="text-xs text-gray-500">Username</p>
                      <p className="text-sm font-mono font-semibold text-gray-800">{result.username}</p>
                    </div>
                    <button onClick={() => copyToClipboard(result.username)} className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                      Salin
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-yellow-100">
                    <div>
                      <p className="text-xs text-gray-500">Password</p>
                      <p className="text-sm font-mono font-semibold text-gray-800">{result.password}</p>
                    </div>
                    <button onClick={() => copyToClipboard(result.password)} className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                      Salin
                    </button>
                  </div>
                </div>
              </div>

              {/* Biaya Formulir */}
              <div className="text-center">
                <p className="text-sm text-gray-500">Biaya Formulir</p>
                <p className="text-3xl font-bold text-gray-800">Rp {result.biayaFormulir.toLocaleString('id-ID')}</p>
              </div>

              {/* Box VA */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-green-600 text-lg">🏦</span>
                  <div>
                    <p className="text-sm font-semibold text-green-800">Pembayaran via Virtual Account BSI</p>
                    <p className="text-xs text-green-700">Lakukan pembayaran maksimal 1 pekan setelah pendaftaran</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-100 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Nomor VA BSI</p>
                    <p className="text-lg font-mono font-bold text-gray-800 tracking-wider">{result.noVA}</p>
                  </div>
                  <button onClick={() => copyToClipboard(result.noVA)} className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium">
                    Salin
                  </button>
                </div>
                <div className="text-xs text-green-700 space-y-1">
                  <p>📌 <strong>Cara Pembayaran:</strong></p>
                  <p>1. Buka BSI Mobile atau mobile banking lainnya</p>
                  <p>2. Pilih menu Pembayaran → Virtual Account</p>
                  <p>3. Masukkan nomor VA di atas</p>
                  <p>4. Konfirmasi pembayaran sesuai nominal</p>
                  <p className="mt-2">
                    <a href="#" className="text-blue-600 underline">📖 Tutorial lengkap pembayaran BSI Mobile</a> &nbsp;|&nbsp;
                    <a href="#" className="text-blue-600 underline">Bank lain</a>
                  </p>
                  <p className="mt-2 text-green-600">
                    🕐 Jam kerja keuangan: Senin-Jumat, 08:00-15:00 WIB | CP: 0812-xxxx-xxxx
                  </p>
                </div>
              </div>

              {/* Tombol ke Pengisian Data */}
              <button
                onClick={goToPengisian}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-sm"
              >
                Login ke Pengisian Data SPMB →
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center">
        <p className="text-blue-200 text-xs">Prototype — SMA Muhammadiyah 2 Surabaya © 2026</p>
      </div>
    </div>
  );
}

/* Inline FormField untuk halaman ini (custom dengan error support) */
function FormField({
  label, name, type = 'text', value, onChange, placeholder, required, options, rows = 3, className = '', error,
}: {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  className?: string;
  error?: string;
}) {
  const inputId = `field-${name}`;
  const baseInputClass = `w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'select' ? (
        <select id={inputId} name={name} value={value} onChange={onChange} className={baseInputClass}>
          <option value="">Pilih...</option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={inputId} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className={baseInputClass} />
      ) : (
        <input id={inputId} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className={baseInputClass} />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
