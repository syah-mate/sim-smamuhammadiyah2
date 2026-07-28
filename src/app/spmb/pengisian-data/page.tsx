'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SPMBRegistration, SPMBDataSiswa, SPMBDataOrangTua, SPMBDocument, SPMBHasilTes } from '@/types';
import { dummySPMBRegistrations } from '@/data/spmb';
import { Badge } from '@/components/ui/Badge';

type Tab = 'pembayaran' | 'data-siswa' | 'data-ortu' | 'dokumen' | 'tes' | 'status' | 'daftar-ulang';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'pembayaran', label: 'Pembayaran', icon: '💳' },
  { key: 'data-siswa', label: 'Data Siswa', icon: '👤' },
  { key: 'data-ortu', label: 'Data Orang Tua', icon: '👨‍👩‍👧' },
  { key: 'dokumen', label: 'Dokumen Pendukung', icon: '📄' },
  { key: 'tes', label: 'Tes Ujian Masuk', icon: '📝' },
  { key: 'status', label: 'Status Akhir', icon: '📊' },
  { key: 'daftar-ulang', label: 'Daftar Ulang', icon: '📋' },
];

export default function PengisianDataPage() {
  const searchParams = useSearchParams();

  // Login state
  const [loggedIn, setLoggedIn] = useState(false);
  const [registration, setRegistration] = useState<SPMBRegistration | null>(null);
  const [username, setUsername] = useState(searchParams.get('username') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('pembayaran');

  // Data editing state
  const [editableReg, setEditableReg] = useState<SPMBRegistration | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = dummySPMBRegistrations.find(
      (r) => r.username === username && r.password === password
    );
    if (found) {
      setRegistration(found);
      setEditableReg({ ...found, dataSiswa: found.dataSiswa ? { ...found.dataSiswa } : undefined, dataOrangTua: found.dataOrangTua ? { ...found.dataOrangTua } : undefined, dokumen: found.dokumen ? [...found.dokumen] : undefined, hasilTes: found.hasilTes ? { ...found.hasilTes } : undefined });
      setLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Username atau password salah');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setRegistration(null);
    setEditableReg(null);
    setPassword('');
    setActiveTab('pembayaran');
  };

  // Update helpers
  const updateDataSiswa = (field: keyof SPMBDataSiswa, value: string | number) => {
    setEditableReg((prev) => prev ? {
      ...prev,
      dataSiswa: { ...(prev.dataSiswa || {} as SPMBDataSiswa), [field]: value },
    } : null);
  };

  const updateDataOrangTua = (field: keyof SPMBDataOrangTua, value: string) => {
    setEditableReg((prev) => prev ? {
      ...prev,
      dataOrangTua: { ...(prev.dataOrangTua || {} as SPMBDataOrangTua), [field]: value },
    } : null);
  };

  const handleUploadDokumen = (docId: string, namaFile: string) => {
    setEditableReg((prev) => {
      if (!prev) return null;
      const dokumen = (prev.dokumen || []).map((d) =>
        d.id === docId ? { ...d, status: 'terupload' as const, namaFile } : d
      );
      return { ...prev, dokumen };
    });
  };

  const handleKonfirmasiBayar = () => {
    setEditableReg((prev) => prev ? { ...prev, statusBayarFormulir: 'sudah_bayar' } : null);
  };

  // ============ RENDER: LOGIN PAGE ============
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
              <span className="text-2xl font-bold text-blue-600">SM</span>
            </div>
            <h1 className="text-xl font-bold text-white">Pengisian Data SPMB</h1>
            <p className="text-blue-200 text-sm mt-1">SMA Muhammadiyah 2 Surabaya</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Login Calon Siswa</h2>
            <p className="text-sm text-gray-500 mb-4">Masukkan username (no. HP) dan password yang diperoleh saat pendaftaran awal</p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Username (No. HP)</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setLoginError(''); }}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Masukkan username"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Masukkan password"
                />
              </div>
              {loginError && <p className="text-sm text-red-600 mb-4">{loginError}</p>}
              <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Masuk
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Akun demo (dummy data):</p>
              <div className="grid grid-cols-2 gap-1.5">
                {dummySPMBRegistrations.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { setUsername(r.username); setPassword(r.password); }}
                    className="text-left px-2 py-1.5 bg-gray-50 rounded text-xs hover:bg-blue-50 transition-colors"
                  >
                    <span className="font-medium block text-gray-700 truncate">{r.namaLengkapSiswa}</span>
                    <span className="text-gray-400">{r.username}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-blue-200 text-xs mt-6">
            Prototype — SMA Muhammadiyah 2 Surabaya © 2026
          </p>
        </div>
      </div>
    );
  }

  // ============ RENDER: DASHBOARD ============
  if (!editableReg || !registration) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">SM</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{editableReg.namaLengkapSiswa}</p>
              <p className="text-xs text-gray-500">{editableReg.noPendaftaran} · {editableReg.jenisDaftar === 'reguler' ? 'Reguler' : 'Mutasi'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
            Keluar
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {activeTab === 'pembayaran' && <PembayaranTab reg={editableReg} onKonfirmasi={handleKonfirmasiBayar} />}
          {activeTab === 'data-siswa' && <DataSiswaTab reg={editableReg} onChange={updateDataSiswa} />}
          {activeTab === 'data-ortu' && <DataOrangTuaTab reg={editableReg} onChange={updateDataOrangTua} />}
          {activeTab === 'dokumen' && <DokumenTab reg={editableReg} onUpload={handleUploadDokumen} />}
          {activeTab === 'tes' && <TesTab reg={editableReg} onChange={(ht) => setEditableReg((prev) => prev ? { ...prev, hasilTes: ht } : null)} />}
          {activeTab === 'status' && <StatusTab reg={editableReg} />}
          {activeTab === 'daftar-ulang' && <DaftarUlangTab reg={editableReg} />}
        </div>
      </div>
    </div>
  );
}

/* ======================= TAB COMPONENTS ======================= */

function PembayaranTab({ reg, onKonfirmasi }: { reg: SPMBRegistration; onKonfirmasi: () => void }) {
  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
  const sudahBayar = reg.statusBayarFormulir === 'sudah_bayar';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Status Pembayaran Formulir</h2>
        <p className="text-sm text-gray-500 mt-1">Biaya formulir pendaftaran SPMB</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500">Status</p>
          <Badge variant={sudahBayar ? 'success' : 'warning'}>{sudahBayar ? 'Sudah Bayar' : 'Belum Bayar'}</Badge>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
          <p className="text-xs text-gray-500">Nominal</p>
          <p className="text-2xl font-bold text-gray-800">Rp {reg.biayaFormulir.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* VA Box */}
      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-green-600 text-lg">🏦</span>
          <div>
            <p className="text-sm font-semibold text-green-800">Virtual Account BSI</p>
            <p className="text-xs text-green-700">Lakukan pembayaran melalui BSI Mobile atau mobile banking lainnya</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-100">
          <div>
            <p className="text-xs text-gray-500">Nomor VA</p>
            <p className="text-lg font-mono font-bold text-gray-800 tracking-wider">{reg.noVA}</p>
          </div>
          <button onClick={() => copyToClipboard(reg.noVA)} className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium">
            Salin
          </button>
        </div>
        <div className="mt-3 text-xs text-green-700 space-y-1">
          <p>📌 <strong>Cara Pembayaran:</strong></p>
          <p>1. Buka BSI Mobile atau mobile banking lainnya</p>
          <p>2. Pilih menu Pembayaran → Virtual Account</p>
          <p>3. Masukkan nomor VA di atas</p>
          <p>4. Konfirmasi pembayaran sesuai nominal</p>
          <p className="mt-2">
            <a href="#" className="text-blue-600 underline">📖 Tutorial pembayaran BSI Mobile</a>
          </p>
          <p className="mt-2 text-green-600">🕐 Jam kerja keuangan: Senin-Jumat, 08:00-15:00 WIB | CP: 0812-xxxx-xxxx</p>
        </div>
      </div>

      {!sudahBayar && (
        <button
          onClick={onKonfirmasi}
          className="w-full py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          ✅ Konfirmasi Sudah Bayar (Simulasi)
        </button>
      )}
      {sudahBayar && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700">
          ℹ️ Pembayaran Anda sedang menunggu verifikasi dari bagian keuangan. Status akan diperbarui setelah verifikasi selesai.
        </div>
      )}
    </div>
  );
}

function DataSiswaTab({ reg, onChange }: { reg: SPMBRegistration; onChange: (field: keyof SPMBDataSiswa, value: string | number) => void }) {
  const ds = reg.dataSiswa || {} as SPMBDataSiswa;
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Data Siswa</h2>
        <p className="text-sm text-gray-500 mt-1">Lengkapi data diri siswa</p>
      </div>

      {/* Data Dasar Readonly */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Data Dasar (dari formulir awal)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div><span className="text-gray-500">Nama:</span> <span className="font-medium">{reg.namaLengkapSiswa}</span></div>
          <div><span className="text-gray-500">NISN:</span> <span className="font-medium">{reg.nisn}</span></div>
          <div><span className="text-gray-500">TTL:</span> <span className="font-medium">{reg.tempatLahir}, {reg.tanggalLahir}</span></div>
          <div><span className="text-gray-500">Jenis Kelamin:</span> <span className="font-medium">{reg.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span></div>
          <div><span className="text-gray-500">Asal Sekolah:</span> <span className="font-medium">{reg.asalSekolah}</span></div>
          <div><span className="text-gray-500">Alamat:</span> <span className="font-medium">{reg.alamat}</span></div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <InlineField label="Agama" name="agama" value={ds.agama || ''} onChange={(e) => onChange('agama', e.target.value)} type="select" options={[
            { value: '', label: 'Pilih...' }, { value: 'Islam', label: 'Islam' }, { value: 'Kristen', label: 'Kristen' }, { value: 'Katolik', label: 'Katolik' }, { value: 'Hindu', label: 'Hindu' }, { value: 'Buddha', label: 'Buddha' }, { value: 'Konghucu', label: 'Konghucu' },
          ]} />
          <InlineField label="Anak Ke-" name="anakKe" type="number" value={ds.anakKe || ''} onChange={(e) => onChange('anakKe', Number(e.target.value))} />
          <InlineField label="Jumlah Saudara" name="jumlahSaudara" type="number" value={ds.jumlahSaudara || ''} onChange={(e) => onChange('jumlahSaudara', Number(e.target.value))} />
          <InlineField label="Golongan Darah" name="golonganDarah" value={ds.golonganDarah || ''} onChange={(e) => onChange('golonganDarah', e.target.value)} type="select" options={[
            { value: '', label: 'Pilih...' }, { value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'AB', label: 'AB' }, { value: 'O', label: 'O' },
          ]} />
          <InlineField label="Hobi" name="hobi" value={ds.hobi || ''} onChange={(e) => onChange('hobi', e.target.value)} />
          <InlineField label="Cita-cita" name="citaCita" value={ds.citaCita || ''} onChange={(e) => onChange('citaCita', e.target.value)} />
          <InlineField label="Tinggi Badan (cm)" name="tinggiBadan" type="number" value={ds.tinggiBadan || ''} onChange={(e) => onChange('tinggiBadan', Number(e.target.value))} />
          <InlineField label="Berat Badan (kg)" name="beratBadan" type="number" value={ds.beratBadan || ''} onChange={(e) => onChange('beratBadan', Number(e.target.value))} />
          <InlineField label="Riwayat Penyakit" name="riwayatPenyakit" className="sm:col-span-2" type="textarea" value={ds.riwayatPenyakit || ''} onChange={(e) => onChange('riwayatPenyakit', e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {saved ? '✅ Tersimpan' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}

function DataOrangTuaTab({ reg, onChange }: { reg: SPMBRegistration; onChange: (field: keyof SPMBDataOrangTua, value: string) => void }) {
  const dot = reg.dataOrangTua || {} as SPMBDataOrangTua;
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Data Orang Tua</h2>
        <p className="text-sm text-gray-500 mt-1">Lengkapi data orang tua / wali</p>
      </div>
      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <InlineField label="Pekerjaan Ayah" name="pekerjaanAyah" value={dot.pekerjaanAyah || ''} onChange={(e) => onChange('pekerjaanAyah', e.target.value)} />
          <InlineField label="Pekerjaan Ibu" name="pekerjaanIbu" value={dot.pekerjaanIbu || ''} onChange={(e) => onChange('pekerjaanIbu', e.target.value)} />
          <InlineField label="Pendidikan Ayah" name="pendidikanAyah" value={dot.pendidikanAyah || ''} onChange={(e) => onChange('pendidikanAyah', e.target.value)} type="select" options={[
            { value: '', label: 'Pilih...' }, { value: 'SD', label: 'SD' }, { value: 'SMP', label: 'SMP' }, { value: 'SMA', label: 'SMA' }, { value: 'D3', label: 'D3' }, { value: 'S1', label: 'S1' }, { value: 'S2', label: 'S2' }, { value: 'S3', label: 'S3' },
          ]} />
          <InlineField label="Pendidikan Ibu" name="pendidikanIbu" value={dot.pendidikanIbu || ''} onChange={(e) => onChange('pendidikanIbu', e.target.value)} type="select" options={[
            { value: '', label: 'Pilih...' }, { value: 'SD', label: 'SD' }, { value: 'SMP', label: 'SMP' }, { value: 'SMA', label: 'SMA' }, { value: 'D3', label: 'D3' }, { value: 'S1', label: 'S1' }, { value: 'S2', label: 'S2' }, { value: 'S3', label: 'S3' },
          ]} />
          <InlineField label="Penghasilan Orang Tua" name="penghasilanOrangTua" value={dot.penghasilanOrangTua || ''} onChange={(e) => onChange('penghasilanOrangTua', e.target.value)} type="select" options={[
            { value: '', label: 'Pilih...' }, { value: '< 3jt', label: '< 3jt' }, { value: '3-5jt', label: '3-5jt' }, { value: '> 5jt', label: '> 5jt' },
          ]} />
          <InlineField label="Nama Wali (Opsional)" name="namaWali" value={dot.namaWali || ''} onChange={(e) => onChange('namaWali', e.target.value)} />
          <InlineField label="No. Telp Wali" name="noTelpWali" type="tel" value={dot.noTelpWali || ''} onChange={(e) => onChange('noTelpWali', e.target.value)} />
          <InlineField label="Alamat Orang Tua" name="alamatOrangTua" className="sm:col-span-2" type="textarea" value={dot.alamatOrangTua || ''} onChange={(e) => onChange('alamatOrangTua', e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {saved ? '✅ Tersimpan' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}

function DokumenTab({ reg, onUpload }: { reg: SPMBRegistration; onUpload: (docId: string, namaFile: string) => void }) {
  const requiredDocs: { id: string; jenis: SPMBDocument['jenis']; label: string }[] = [
    { id: 'doc-kk', jenis: 'kk', label: 'Kartu Keluarga (KK)' },
    { id: 'doc-akta', jenis: 'akta_lahir', label: 'Akta Kelahiran' },
    { id: 'doc-ijazah', jenis: 'ijazah', label: 'Ijazah / Rapor Terakhir' },
    { id: 'doc-foto', jenis: 'pas_foto', label: 'Pas Foto' },
  ];

  const existingDocs = reg.dokumen || [];
  const allUploaded = requiredDocs.every((rd) => {
    const existing = existingDocs.find((d) => d.jenis === rd.jenis);
    return existing && (existing.status === 'terupload' || existing.status === 'diverifikasi');
  });

  const statusBadge = (status: SPMBDocument['status']) => {
    switch (status) {
      case 'belum_upload': return <Badge variant="warning">Belum Upload</Badge>;
      case 'terupload': return <Badge variant="info">Terupload</Badge>;
      case 'diverifikasi': return <Badge variant="success">Diverifikasi</Badge>;
      case 'ditolak': return <Badge variant="danger">Ditolak</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Dokumen Pendukung</h2>
        <p className="text-sm text-gray-500 mt-1">Upload dokumen yang diperlukan untuk verifikasi</p>
      </div>

      <div className="space-y-3">
        {requiredDocs.map((rd) => {
          const existing = existingDocs.find((d) => d.jenis === rd.jenis);
          const status = existing?.status || 'belum_upload';
          const namaFile = existing?.namaFile || '';

          return (
            <div key={rd.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xl">📄</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{rd.label}</p>
                  {namaFile && <p className="text-xs text-gray-500">{namaFile}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {statusBadge(status)}
                <label className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors font-medium">
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onUpload(rd.id, file.name);
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {allUploaded && (
        <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-sm text-green-700">
          ✅ Dokumen lengkap! Menunggu verifikasi dari panitia SPMB.
        </div>
      )}
      {!allUploaded && (
        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-sm text-yellow-700">
          ⚠️ Harap upload semua dokumen yang diperlukan. Dokumen yang belum lengkap akan menghambat proses seleksi.
        </div>
      )}
    </div>
  );
}

function TesTab({ reg, onChange }: { reg: SPMBRegistration; onChange: (ht: SPMBHasilTes) => void }) {
  const ht = reg.hasilTes || { status: 'belum_jadwal' };
  const [showTes, setShowTes] = useState(false);
  const [jawabanPG, setJawabanPG] = useState<Record<number, string>>({});
  const [jawabanEssay, setJawabanEssay] = useState<Record<number, string>>({});

  // 5 Soal Pilihan Ganda — jenjang SMA
  const soalPG = [
    {
      no: 1,
      mapel: 'Matematika',
      soal: 'Diketahui persamaan kuadrat $x^2 - 5x + 6 = 0$. Jumlah akar-akar persamaan tersebut adalah...',
      a: '2', b: '3', c: '5', d: '6', kunci: 'c',
    },
    {
      no: 2,
      mapel: 'IPA (Fisika)',
      soal: 'Sebuah benda bermassa 2 kg didorong dengan gaya 10 N di atas lantai licin. Percepatan yang dialami benda adalah...',
      a: '2 m/s²', b: '5 m/s²', c: '10 m/s²', d: '20 m/s²', kunci: 'b',
    },
    {
      no: 3,
      mapel: 'Bahasa Inggris',
      soal: '"She ___ to school every morning by bicycle." Pilih kata yang tepat untuk melengkapi kalimat tersebut.',
      a: 'go', b: 'goes', c: 'going', d: 'gone', kunci: 'b',
    },
    {
      no: 4,
      mapel: 'Bahasa Indonesia',
      soal: 'Bacalah kutipan berikut: "Pagi itu, mentari menyapa lembut, membelai dedaunan yang basah oleh embun." Majas yang dominan dalam kalimat tersebut adalah...',
      a: 'Hiperbola', b: 'Personifikasi', c: 'Metafora', d: 'Simile', kunci: 'b',
    },
    {
      no: 5,
      mapel: 'Al-Islam / Kemuhammadiyahan',
      soal: 'Organisasi Muhammadiyah didirikan oleh K.H. Ahmad Dahlan pada tahun...',
      a: '1908', b: '1912', c: '1926', d: '1945', kunci: 'b',
    },
  ];

  // 3 Soal Essay — jenjang SMA
  const soalEssay = [
    {
      no: 6,
      mapel: 'Motivasi & Wawasan',
      soal: 'Ceritakan secara singkat alasan Anda memilih SMA Muhammadiyah 2 Surabaya sebagai sekolah tujuan. Apa yang Anda ketahui tentang keunggulan sekolah ini?',
    },
    {
      no: 7,
      mapel: 'Bahasa Indonesia',
      soal: 'Buatlah sebuah paragraf singkat (minimal 5 kalimat) tentang cita-cita Anda di masa depan dan bagaimana pendidikan di SMA dapat membantu mewujudkannya.',
    },
    {
      no: 8,
      mapel: 'Wawasan Kebangsaan & Keislaman',
      soal: 'Menurut pendapat Anda, apa peran pemuda Islam dalam menjaga persatuan dan kesatuan bangsa Indonesia di era digital seperti saat ini? Jelaskan dengan singkat.',
    },
  ];

  const handleMulaiTes = () => {
    setShowTes(true);
    setJawabanPG({});
    setJawabanEssay({});
  };

  const handleSubmitTes = () => {
    // Hitung skor pilihan ganda (bobot 60%)
    let benar = 0;
    soalPG.forEach((s) => {
      if (jawabanPG[s.no] === s.kunci) benar++;
    });
    const skorPG = Math.round((benar / soalPG.length) * 60);

    // Hitung skor essay — minimal menjawab dapat poin (bobot 40%)
    const terjawabEssay = soalEssay.filter((s) => jawabanEssay[s.no] && jawabanEssay[s.no].trim().length > 0).length;
    const skorEssay = Math.round((terjawabEssay / soalEssay.length) * 40);

    const skorTotal = skorPG + skorEssay;
    const catatan =
      skorTotal >= 75 ? 'Lulus — Nilai memuaskan' :
      skorTotal >= 60 ? 'Lulus — Perlu bimbingan' :
      'Perlu remedial / evaluasi lanjutan';

    onChange({
      status: 'selesai',
      tanggalTes: new Date().toISOString().split('T')[0],
      nilai: skorTotal,
      catatan,
    });
    setShowTes(false);
  };

  const statusDisplay = () => {
    switch (ht.status) {
      case 'belum_jadwal':
        return (
          <div className="text-center py-8">
            <span className="text-4xl">📋</span>
            <p className="text-gray-700 font-medium mt-3">Jadwal tes belum tersedia</p>
            <p className="text-sm text-gray-500 mt-1">Jadwal tes akan diumumkan setelah dokumen & pembayaran diverifikasi</p>
          </div>
        );
      case 'terjadwal':
        return (
          <div className="text-center py-8 space-y-4">
            <span className="text-4xl">📅</span>
            <p className="text-gray-700 font-medium">Tes Terjadwal</p>
            <p className="text-sm text-gray-500">Tanggal: {ht.tanggalTes || '-'}</p>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-left max-w-md mx-auto">
              <p className="text-sm font-semibold text-blue-800 mb-2">📝 Informasi Ujian:</p>
              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                <li>5 soal Pilihan Ganda (bobot 60%)</li>
                <li>3 soal Essay (bobot 40%)</li>
                <li>Waktu pengerjaan: 90 menit</li>
                <li>Nilai minimal kelulusan: 60</li>
              </ul>
            </div>
            <button onClick={handleMulaiTes} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Mulai Tes Sekarang
            </button>
          </div>
        );
      case 'selesai':
        return (
          <div className="text-center py-8">
            <span className="text-4xl">✅</span>
            <p className="text-gray-700 font-medium mt-3">Tes Telah Selesai</p>
            <div className="mt-4 inline-block p-6 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-600">Nilai Anda</p>
              <p className="text-3xl font-bold text-blue-800">{ht.nilai}</p>
              {ht.catatan && <p className="text-sm text-blue-600 mt-1">{ht.catatan}</p>}
            </div>
            {ht.tanggalTes && <p className="text-xs text-gray-400 mt-2">Tanggal Tes: {ht.tanggalTes}</p>}
            <button onClick={handleMulaiTes} className="mt-4 px-4 py-2 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors">
              🔄 Uji Coba / Lihat Soal Kembali
            </button>
          </div>
        );
    }
  };

  // Cek apakah semua PG sudah dijawab
  const semuaPGTerjawab = soalPG.every((s) => jawabanPG[s.no]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Tes Ujian Masuk Online</h2>
        <p className="text-sm text-gray-500 mt-1">Informasi jadwal dan pelaksanaan tes masuk</p>
      </div>

      {!showTes ? (
        statusDisplay()
      ) : (
        <div className="space-y-8">
          {/* ===== BAGIAN A: PILIHAN GANDA ===== */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">A</span>
              <div>
                <h3 className="font-semibold text-gray-800">Pilihan Ganda</h3>
                <p className="text-xs text-gray-500">5 soal — Bobot 60% | Pilih satu jawaban yang paling tepat</p>
              </div>
            </div>

            <div className="space-y-4">
              {soalPG.map((s) => (
                <div key={s.no} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{s.mapel}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-3">{s.no}. {s.soal}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['a', 'b', 'c', 'd'] as const).map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer border text-sm transition-colors ${
                          jawabanPG[s.no] === opt
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`soal-pg-${s.no}`}
                          value={opt}
                          checked={jawabanPG[s.no] === opt}
                          onChange={() => setJawabanPG({ ...jawabanPG, [s.no]: opt })}
                          className="sr-only"
                        />
                        <span
                          className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{
                            borderColor: jawabanPG[s.no] === opt ? '#2563eb' : '#d1d5db',
                            backgroundColor: jawabanPG[s.no] === opt ? '#2563eb' : 'transparent',
                            color: jawabanPG[s.no] === opt ? 'white' : '#6b7280',
                          }}
                        >
                          {opt.toUpperCase()}
                        </span>
                        <span className="text-gray-700">{s[opt]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== BAGIAN B: ESSAY ===== */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">B</span>
              <div>
                <h3 className="font-semibold text-gray-800">Essay</h3>
                <p className="text-xs text-gray-500">3 soal — Bobot 40% | Jawablah dengan singkat dan jelas (min. 2-3 kalimat)</p>
              </div>
            </div>

            <div className="space-y-4">
              {soalEssay.map((s) => (
                <div key={s.no} className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded">{s.mapel}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-3">{s.no}. {s.soal}</p>
                  <textarea
                    value={jawabanEssay[s.no] || ''}
                    onChange={(e) => setJawabanEssay({ ...jawabanEssay, [s.no]: e.target.value })}
                    placeholder="Tulis jawaban Anda di sini..."
                    rows={4}
                    className="w-full px-3 py-2.5 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors resize-y bg-white"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {jawabanEssay[s.no] ? jawabanEssay[s.no].length : 0} karakter
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== TOMBOL AKSI ===== */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowTes(false)}
              className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
            >
              Batal
            </button>
            <button
              onClick={handleSubmitTes}
              disabled={!semuaPGTerjawab}
              className={`px-6 py-2.5 text-sm text-white rounded-lg transition-colors font-medium ${
                semuaPGTerjawab
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {semuaPGTerjawab ? 'Kumpulkan Jawaban' : 'Lengkapi Pilihan Ganda Terlebih Dahulu'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusTab({ reg }: { reg: SPMBRegistration }) {
  // 6-step alur pendaftaran
  const steps = [
    { key: 'pendaftaran_awal', label: 'Pendaftaran Form Awal', desc: 'Pengisian formulir pendaftaran online' },
    { key: 'pembayaran', label: 'Pembayaran Formulir', desc: 'Pembayaran biaya formulir via Virtual Account' },
    { key: 'pengisian_data', label: 'Pengisian Data & Dokumen', desc: 'Data siswa, orang tua, & upload dokumen' },
    { key: 'tes_masuk', label: 'Tes Masuk Online', desc: 'Ujian seleksi: pilihan ganda & essay' },
    { key: 'status_akhir', label: 'Status Akhir', desc: 'Pengumuman hasil seleksi' },
    { key: 'daftar_ulang', label: 'Daftar Ulang', desc: 'Pembayaran tagihan & konfirmasi daftar ulang' },
  ];

  // Tentukan progres berdasarkan data registrasi
  const sudahBayar = reg.statusBayarFormulir === 'sudah_bayar';
  const sudahIsiData = !!(reg.dataSiswa || reg.dataOrangTua);
  const sudahUploadDokumen = !!(reg.dokumen && reg.dokumen.length > 0);
  const sudahTes = reg.hasilTes?.status === 'selesai';
  const statusFinal = reg.statusAkhir === 'diterima' || reg.statusAkhir === 'ditolak';
  const isDiterima = reg.statusAkhir === 'diterima';
  const isDitolak = reg.statusAkhir === 'ditolak';

  // Hitung currentIndex berdasarkan capaian
  let currentIndex = 0; // default: pendaftaran awal
  if (sudahBayar) currentIndex = 1;
  if (sudahBayar && (sudahIsiData || sudahUploadDokumen)) currentIndex = 2;
  if (sudahBayar && sudahIsiData && sudahUploadDokumen && sudahTes) currentIndex = 3;
  if (statusFinal) currentIndex = 4;
  if (isDiterima) currentIndex = 5; // daftar ulang hanya untuk yang diterima

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Status Akhir Pendaftaran</h2>
        <p className="text-sm text-gray-500 mt-1">Pantau progres pendaftaran Anda dari awal hingga daftar ulang</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {steps.map((s, i) => {
          const isActive = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const isDiterimaStep = isDiterima && i === 5 && isCurrent;
          const isDitolakStep = isDitolak && i === 4 && isCurrent;

          return (
            <div key={s.key} className="flex gap-4 pb-6 relative">
              {/* Connector */}
              {i < steps.length - 1 && (
                <div className={`absolute left-[19px] top-10 w-0.5 h-full -translate-x-1/2 ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
              {/* Circle */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                isDiterimaStep ? 'bg-green-500 text-white' :
                isDitolakStep ? 'bg-red-500 text-white' :
                isCurrent ? 'bg-blue-600 text-white' :
                isActive ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                {isDiterimaStep ? '🎓' : isDitolakStep ? '✗' : isActive ? (isCurrent ? '●' : '✓') : '○'}
              </div>
              {/* Text */}
              <div className="pt-2">
                <p className={`text-sm font-semibold ${
                  isDiterimaStep ? 'text-green-700' :
                  isDitolakStep ? 'text-red-700' :
                  isCurrent ? 'text-blue-700' :
                  isActive ? 'text-gray-800' : 'text-gray-400'
                }`}>{s.label}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Status Message */}
      {isDiterima && (
        <div className="p-6 bg-green-50 rounded-xl border border-green-200 text-center">
          <span className="text-5xl">🎉</span>
          <h3 className="text-lg font-bold text-green-800 mt-3">Selamat! Anda Diterima!</h3>
          <p className="text-sm text-green-700 mt-1">Anda telah diterima sebagai siswa SMA Muhammadiyah 2 Surabaya.</p>
          <p className="text-sm text-green-600 mt-2">
            Segera lakukan daftar ulang di tab <strong>Daftar Ulang</strong> untuk menyelesaikan proses penerimaan.
          </p>
        </div>
      )}

      {isDitolak && (
        <div className="p-6 bg-red-50 rounded-xl border border-red-200 text-center">
          <span className="text-5xl">😔</span>
          <h3 className="text-lg font-bold text-red-800 mt-3">Mohon Maaf, Belum Diterima</h3>
          <p className="text-sm text-red-700 mt-1">
            Berdasarkan hasil seleksi, Anda belum dapat diterima di SMA Muhammadiyah 2 Surabaya untuk tahun ajaran ini.
          </p>
          <p className="text-sm text-red-600 mt-2">
            Jangan berkecil hati! Anda dapat mencoba mendaftar kembali pada periode berikutnya atau menghubungi panitia untuk informasi lebih lanjut.
          </p>
        </div>
      )}

      {!sudahBayar && (
        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-sm text-yellow-700">
          ⚠️ Segera selesaikan pembayaran formulir agar dapat melanjutkan ke tahap pengisian data.
        </div>
      )}

      {sudahBayar && !sudahTes && !statusFinal && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-700">
          ℹ️ Lengkapi seluruh data diri, dokumen, dan ikuti tes masuk untuk melanjutkan ke tahap seleksi.
        </div>
      )}
    </div>
  );
}

/* ======================= DAFTAR ULANG TAB ======================= */

function DaftarUlangTab({ reg }: { reg: SPMBRegistration }) {
  const isDiterima = reg.statusAkhir === 'diterima';

  const tagihan = [
    { id: 'dana-pengembangan', nama: 'Dana Pengembangan Sekolah', nominal: 10000000, deskripsi: 'Dana pengembangan fasilitas & sarana pendidikan (sekali selama masa pendidikan)' },
    { id: 'spp-awal', nama: 'SPP Bulan Pertama', nominal: 400000, deskripsi: 'Iuran SPP untuk bulan pertama tahun ajaran baru' },
    { id: 'kegiatan', nama: 'Biaya Kegiatan 1 Tahun', nominal: 5000000, deskripsi: 'Mencakup kegiatan ekstrakurikuler, study tour, class meeting, dan program sekolah' },
    { id: 'seragam', nama: 'Paket Seragam Sekolah', nominal: 400000, deskripsi: 'Seragam harian, batik, olahraga, dan atribut sekolah' },
  ];

  const totalTagihan = tagihan.reduce((sum, t) => sum + t.nominal, 0);

  const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Daftar Ulang</h2>
        <p className="text-sm text-gray-500 mt-1">Rincian tagihan dan konfirmasi daftar ulang siswa baru</p>
      </div>

      {!isDiterima && (
        <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
          <span className="text-4xl">🔒</span>
          <h3 className="text-md font-semibold text-yellow-800 mt-3">Daftar Ulang Belum Tersedia</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Menu daftar ulang hanya tersedia setelah Anda dinyatakan <strong>diterima</strong> sebagai siswa.
            Pantau terus status akhir pendaftaran Anda.
          </p>
        </div>
      )}

      {isDiterima && (
        <>
          {/* Info Diterima */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-start gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-sm font-semibold text-green-800">Selamat, {reg.namaLengkapSiswa}!</p>
              <p className="text-xs text-green-700 mt-0.5">
                Anda telah diterima di SMA Muhammadiyah 2 Surabaya. Segera selesaikan daftar ulang dengan membayar tagihan di bawah ini.
              </p>
            </div>
          </div>

          {/* Daftar Tagihan */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">📋 Rincian Tagihan Daftar Ulang</h3>
            <div className="space-y-3">
              {tagihan.map((t) => (
                <div key={t.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">
                      {t.id === 'dana-pengembangan' ? '🏫' : t.id === 'spp-awal' ? '📚' : t.id === 'kegiatan' ? '🎯' : '👔'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{t.nama}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t.deskripsi}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-800 whitespace-nowrap ml-4">{formatRupiah(t.nominal)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="p-4 bg-blue-600 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">Total Tagihan Daftar Ulang</p>
                <p className="text-2xl font-bold mt-0.5">{formatRupiah(totalTagihan)}</p>
              </div>
              <span className="text-3xl">💳</span>
            </div>
          </div>

          {/* VA Pembayaran */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-green-600 text-lg">🏦</span>
              <div>
                <p className="text-sm font-semibold text-green-800">Pembayaran via Virtual Account BSI</p>
                <p className="text-xs text-green-700">Lakukan pembayaran ke nomor VA di bawah ini sebelum batas waktu daftar ulang</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-100">
              <div>
                <p className="text-xs text-gray-500">Nomor VA Daftar Ulang</p>
                <p className="text-lg font-mono font-bold text-gray-800 tracking-wider">{reg.noVA}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(reg.noVA)}
                className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
              >
                Salin
              </button>
            </div>
            <p className="mt-3 text-xs text-green-700">
              ⚠️ Batas waktu daftar ulang: <strong>2 minggu</strong> setelah pengumuman. Keterlambatan dapat menyebabkan kuota dialihkan ke calon siswa cadangan.
            </p>
          </div>

          {/* Catatan */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-700 space-y-1">
            <p>📌 <strong>Catatan Daftar Ulang:</strong></p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Pembayaran dapat dicicil maksimal 2x selama masa daftar ulang</li>
              <li>Simpan bukti pembayaran untuk verifikasi akhir</li>
              <li>Informasi lebih lanjut hubungi panitia: <strong>0812-xxxx-xxxx</strong></li>
            </ul>
          </div>

          {/* Tombol Konfirmasi */}
          <button className="w-full py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">
            ✅ Konfirmasi & Selesaikan Daftar Ulang
          </button>
        </>
      )}
    </div>
  );
}

/* ======================= INLINE FORM FIELD ======================= */

function InlineField({
  label, name, type = 'text', value, onChange, placeholder, options, rows = 3, className = '',
}: {
  label: string; name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea';
  value?: string | number; onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  placeholder?: string; options?: { value: string; label: string }[]; rows?: number; className?: string;
}) {
  const inputId = `inf-${name}`;
  const baseClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors';

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === 'select' ? (
        <select id={inputId} name={name} value={value} onChange={onChange} className={baseClass}>
          {options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={inputId} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className={baseClass} />
      ) : (
        <input id={inputId} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className={baseClass} />
      )}
    </div>
  );
}
