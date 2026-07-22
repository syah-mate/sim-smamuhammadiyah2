'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { useRouter } from 'next/navigation';
import { dummySPMBRegistrations, dummySPMBSettings } from '@/data/spmb';
import { SPMBRegistration } from '@/types';

function SPMBAdminContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState(dummySPMBRegistrations);
  const [showDetail, setShowDetail] = useState<SPMBRegistration | null>(null);

  if (!user) { router.push('/'); return null; }

  const total = registrations.length;
  const diterima = registrations.filter((r) => r.status === 'diterima').length;
  const pending = registrations.filter((r) => r.status === 'pending').length;
  const s = dummySPMBSettings;
  const kuotaTotal = s.kuotaReguler + s.kuotaPrestasi + s.kuotaAfirmasi;

  const updateStatus = (id: string, status: SPMBRegistration['status']) => {
    setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const columns = [
    { key: 'namaLengkap', header: 'Nama', render: (r: SPMBRegistration) => <span className="font-medium text-gray-800">{r.namaLengkap}</span> },
    { key: 'jalur', header: 'Jalur', render: (r: SPMBRegistration) => <span className="capitalize">{r.jalur}</span> },
    { key: 'tanggalDaftar', header: 'Tgl Daftar' },
    { key: 'asalSekolah', header: 'Asal', render: () => '-' },
    {
      key: 'status', header: 'Status',
      render: (r: SPMBRegistration) => <Badge variant={statusVariant(r.status) as 'success' | 'warning' | 'danger' | 'info' | 'default'}>{r.status}</Badge>,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">SPMB — Pendaftaran (Admin)</h1>
            <p className="text-gray-500 mt-1">Verifikasi & seleksi calon siswa baru TA {s.tahunAjaran}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700" title="Pengumuman massal (coming soon)">📢 Umumkan</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50" title="Export Excel (coming soon)">📥 Export</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard title="Total Pendaftar" value={total} color="blue" />
          <StatCard title="Diterima" value={diterima} color="green" />
          <StatCard title="Pending" value={pending} color="yellow" />
          <StatCard title={`Kuota (${kuotaTotal})`} value={`${diterima}/${kuotaTotal}`} color="purple" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-blue-600">Reguler</p>
            <p className="text-xl font-bold text-blue-800">{registrations.filter((r) => r.jalur === 'reguler').length}/{s.kuotaReguler}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-sm text-green-600">Prestasi</p>
            <p className="text-xl font-bold text-green-800">{registrations.filter((r) => r.jalur === 'prestasi').length}/{s.kuotaPrestasi}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <p className="text-sm text-purple-600">Afirmasi</p>
            <p className="text-xl font-bold text-purple-800">{registrations.filter((r) => r.jalur === 'afirmasi').length}/{s.kuotaAfirmasi}</p>
          </div>
        </div>

        <Card title="Daftar Pendaftar" subtitle={`${total} pendaftar`}>
          <DataTable
            columns={columns}
            data={registrations}
            keyExtractor={(r) => r.id}
            searchPlaceholder="Cari nama pendaftar..."
            searchKeys={['namaLengkap']}
            actions={(r) => (
              <div className="flex gap-1">
                <button onClick={() => setShowDetail(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs">👁️</button>
                {r.status === 'pending' && (
                  <button onClick={() => updateStatus(r.id, 'verifikasi')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg text-xs" title="Verifikasi">✅</button>
                )}
                {r.status === 'verifikasi' && (
                  <>
                    <button onClick={() => updateStatus(r.id, 'diterima')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg text-xs" title="Terima">✅</button>
                    <button onClick={() => updateStatus(r.id, 'ditolak')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs" title="Tolak">❌</button>
                  </>
                )}
              </div>
            )}
          />
        </Card>

        <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title="Detail Pendaftar" size="md">
          {showDetail && (
            <div className="space-y-3">
              <p><strong>Nama:</strong> {showDetail.namaLengkap}</p>
              <p><strong>TTL:</strong> {showDetail.tempatLahir}, {showDetail.tanggalLahir}</p>
              <p><strong>Jalur:</strong> <span className="capitalize">{showDetail.jalur}</span></p>
              <p><strong>Status:</strong> <Badge variant={statusVariant(showDetail.status) as 'success' | 'warning' | 'danger'}>{showDetail.status}</Badge></p>
              <p><strong>No HP:</strong> {showDetail.noHp}</p>
              <p><strong>Email:</strong> {showDetail.email}</p>
              <p><strong>Alamat:</strong> {showDetail.alamat}</p>
              <div>
                <strong>Dokumen:</strong>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                  {showDetail.dokumen.map((d) => <li key={d.id}>{d.namaFile} ({d.jenis})</li>)}
                </ul>
              </div>
              {showDetail.nilaiTes && <p><strong>Nilai Tes:</strong> {showDetail.nilaiTes}</p>}
              {showDetail.nilaiWawancara && <p><strong>Nilai Wawancara:</strong> {showDetail.nilaiWawancara}</p>}
              <div className="flex gap-2 pt-4 border-t">
                {showDetail.status === 'verifikasi' && (
                  <>
                    <button onClick={() => { updateStatus(showDetail.id, 'diterima'); setShowDetail(null); }} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg">Terima</button>
                    <button onClick={() => { updateStatus(showDetail.id, 'ditolak'); setShowDetail(null); }} className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg">Tolak</button>
                  </>
                )}
                {showDetail.status === 'diterima' && (
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg" title="Konversi ke siswa aktif (coming soon)">➕ Jadikan Siswa Aktif</button>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}

export default function SPMBAdminPage() {
  return <SPMBAdminContent />;
}
