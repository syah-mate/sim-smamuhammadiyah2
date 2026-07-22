'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { useRouter } from 'next/navigation';
import { dummySPMBRegistrations, dummySPMBSettings } from '@/data/spmb';

function PortalCalonSiswaContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [foundRegistration, setFoundRegistration] = useState<typeof dummySPMBRegistrations[0] | null>(null);
  const [form, setForm] = useState({
    namaLengkap: '', tempatLahir: '', tanggalLahir: '', jenisKelamin: 'L', alamat: '', noHp: '', email: '', jalur: 'reguler',
  });

  if (!user) { router.push('/'); return null; }

  const handleSearch = () => {
    const found = dummySPMBRegistrations.find((r) => r.noHp === searchId || r.email === searchId);
    setFoundRegistration(found || null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Portal Calon Siswa</h1>
          <p className="text-gray-500 mt-1">Pendaftaran online SPMB TA {dummySPMBSettings.tahunAjaran}</p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-800">Informasi Penerimaan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <p className="text-blue-600">Periode Pendaftaran</p>
              <p className="font-medium text-blue-900">{dummySPMBSettings.tanggalMulai} s.d. {dummySPMBSettings.tanggalSelesai}</p>
            </div>
            <div>
              <p className="text-blue-600">Biaya Pendaftaran</p>
              <p className="font-medium text-blue-900">Rp {dummySPMBSettings.biayaPendaftaran.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-600">Kuota Reguler</p>
              <p className="font-medium text-blue-900">{dummySPMBSettings.kuotaReguler} siswa</p>
            </div>
            <div>
              <p className="text-blue-600">Kuota Prestasi</p>
              <p className="font-medium text-blue-900">{dummySPMBSettings.kuotaPrestasi} siswa</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cek Status */}
          <Card title="🔍 Cek Status Pendaftaran">
            <p className="text-sm text-gray-500 mb-4">Masukkan nomor HP atau email yang digunakan saat mendaftar</p>
            <div className="flex gap-2">
              <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="No HP / Email" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Cari</button>
            </div>
            {foundRegistration && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-800">{foundRegistration.namaLengkap}</p>
                <p className="text-sm text-blue-600">Jalur: {foundRegistration.jalur}</p>
                <div className="mt-2">
                  <Badge variant={statusVariant(foundRegistration.status) as 'success' | 'warning' | 'danger'}>{foundRegistration.status}</Badge>
                </div>
                {foundRegistration.nilaiTes && <p className="text-sm text-blue-600 mt-1">Nilai Tes: {foundRegistration.nilaiTes}</p>}
              </div>
            )}
            {searchId && !foundRegistration && (
              <p className="text-sm text-red-500 mt-3">Data tidak ditemukan</p>
            )}
          </Card>

          {/* Daftar Baru */}
          <Card title="📝 Daftar Baru">
            <p className="text-sm text-gray-500 mb-4">Isi form di bawah untuk mendaftar sebagai calon siswa baru</p>
            <button onClick={() => setShowRegister(true)} className="w-full py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
              Mulai Pendaftaran →
            </button>
          </Card>
        </div>

        {/* Form Register */}
        <Modal isOpen={showRegister} onClose={() => setShowRegister(false)} title="Form Pendaftaran Siswa Baru" size="lg">
          <form onSubmit={(e) => { e.preventDefault(); alert('Pendaftaran berhasil disimulasikan! (Prototype)'); setShowRegister(false); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <FormField label="Nama Lengkap" name="namaLengkap" value={form.namaLengkap} onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })} required />
              <FormField label="Jenis Kelamin" name="jenisKelamin" type="select" value={form.jenisKelamin} onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value })} options={[{ value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' }]} />
              <FormField label="Tempat Lahir" name="tempatLahir" value={form.tempatLahir} onChange={(e) => setForm({ ...form, tempatLahir: e.target.value })} />
              <FormField label="Tanggal Lahir" name="tanggalLahir" type="date" value={form.tanggalLahir} onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })} />
              <FormField label="Alamat" name="alamat" type="textarea" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} className="sm:col-span-2" />
              <FormField label="No HP" name="noHp" type="tel" value={form.noHp} onChange={(e) => setForm({ ...form, noHp: e.target.value })} />
              <FormField label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <FormField label="Jalur" name="jalur" type="select" value={form.jalur} onChange={(e) => setForm({ ...form, jalur: e.target.value })} options={[{ value: 'reguler', label: 'Reguler' }, { value: 'prestasi', label: 'Prestasi' }, { value: 'afirmasi', label: 'Afirmasi' }]} />
            </div>
            <h4 className="font-semibold text-sm text-gray-700 mb-3 mt-4">Upload Dokumen</h4>
            <FormField label="Kartu Keluarga" name="kk" type="file" onChange={() => {}} />
            <FormField label="Akta Kelahiran" name="akta" type="file" onChange={() => {}} />
            <FormField label="Ijazah/Rapor" name="ijazah" type="file" onChange={() => {}} />
            <FormField label="Bukti Pembayaran" name="buktiBayar" type="file" onChange={() => {}} />
            <FormActions onCancel={() => setShowRegister(false)} submitLabel="Daftar Sekarang" />
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
}

export default function PortalCalonSiswaPage() {
  return <PortalCalonSiswaContent />;
}
