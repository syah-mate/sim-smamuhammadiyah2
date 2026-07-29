'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { useRouter } from 'next/navigation';
import { dummyDisposisi } from '@/data/letters';
import { generateId, todayISO, addDaysISO } from '@/lib/utils';
import { dummyEmployees } from '@/data/employees';
import { Disposisi, DisposisiPrioritas, DisposisiRiwayat, DisposisiStatusRiwayat, prioritasLabels } from '@/types';

// ==================== HELPERS ====================

function statusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'default' {
  switch (status) {
    case 'selesai': return 'success';
    case 'proses': return 'warning';
    case 'baru': return 'info';
    case 'disetujui': return 'success';
    case 'ditolak': return 'danger';
    case 'menunggu': return 'warning';
    default: return 'default';
  }
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    baru: 'Baru',
    proses: 'Proses',
    selesai: 'Selesai',
    menunggu: 'Menunggu',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
  };
  return map[status] || status;
}

function priorityVariant(p: string): 'success' | 'warning' | 'danger' | 'info' | 'default' {
  switch (p) {
    case 'urgent': return 'danger';
    case 'tinggi': return 'warning';
    case 'normal': return 'info';
    case 'rendah': return 'default';
    default: return 'default';
  }
}

function getLatestPenerima(d: Disposisi): string {
  const last = d.riwayat[d.riwayat.length - 1];
  if (!last) return '-';
  const emp = dummyEmployees.find((e) => e.id === last.ke);
  return emp?.nama || last.ke;
}

function getPembuat(d: Disposisi): string {
  const emp = dummyEmployees.find((e) => e.id === d.dibuatOleh);
  return emp?.nama || d.dibuatOleh;
}

function isOverdue(d: Disposisi): boolean {
  if (d.status === 'selesai') return false;
  return d.tenggatWaktu < new Date().toISOString().split('T')[0];
}

// ==================== KOMPONEN ====================

function DisposisiContent() {
  const { user } = useAuth();
  const router = useRouter();

  // Local state untuk demo (simulasi mutable data)
  const [disposisiList, setDisposisiList] = useState<Disposisi[]>(dummyDisposisi);

  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedDisposisi, setSelectedDisposisi] = useState<Disposisi | null>(null);

  // Create form
  const [formJudul, setFormJudul] = useState('');
  const [formPerihal, setFormPerihal] = useState('');
  const [formTujuan, setFormTujuan] = useState('');
  const [formPrioritas, setFormPrioritas] = useState<DisposisiPrioritas>('normal');
  const [formTenggat, setFormTenggat] = useState('');
  const [formLampiran, setFormLampiran] = useState('');

  // Forward form
  const [forwardKe, setForwardKe] = useState('');
  const [forwardCatatan, setForwardCatatan] = useState('');

  // Update (status) form
  const [updateCatatan, setUpdateCatatan] = useState('');

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  if (!user) return null;

  const currentEmployeeId = user.pegawaiId;
  const isKepsek = user.roles.includes('kepala_sekolah');
  const isAdmin = user.roles.includes('super_admin') || user.roles.includes('admin_tu');

  // Stats
  const totalBaru = disposisiList.filter((d) => d.status === 'baru').length;
  const totalProses = disposisiList.filter((d) => d.status === 'proses').length;
  const totalSelesai = disposisiList.filter((d) => d.status === 'selesai').length;
  const totalOverdue = disposisiList.filter((d) => isOverdue(d)).length;

  // ==================== HANDLERS ====================

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul || !formPerihal || !formTujuan || !currentEmployeeId) return;

    const newDisposisi: Disposisi = {
      id: generateId('disp'),
      judul: formJudul,
      perihal: formPerihal,
      prioritas: formPrioritas,
      tenggatWaktu: formTenggat || addDaysISO(todayISO(), 7),
      lampiran: formLampiran || undefined,
      status: 'baru',
      dibuatOleh: currentEmployeeId,
      tanggalDibuat: new Date().toISOString().split('T')[0],
      riwayat: [
        {
          id: generateId('rw'),
          dari: currentEmployeeId,
          ke: formTujuan,
          status: 'menunggu',
          catatan: formPerihal,
          tanggalDibuat: new Date().toISOString().split('T')[0],
        },
      ],
    };

    setDisposisiList((prev) => [newDisposisi, ...prev]);
    const penerima = dummyEmployees.find((e) => e.id === formTujuan);
    alert(`✅ Disposisi baru berhasil dibuat!\n\nJudul: ${formJudul}\nDitujukan ke: ${penerima?.nama}`);
    setCreateOpen(false);
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setFormJudul('');
    setFormPerihal('');
    setFormTujuan('');
    setFormPrioritas('normal');
    setFormTenggat('');
    setFormLampiran('');
  };

  const openDetail = (d: Disposisi) => {
    setSelectedDisposisi(d);
    setDetailOpen(true);
  };

  // Kepsek: setujui & teruskan
  const handleSetujuiDanTeruskan = () => {
    if (!selectedDisposisi || !forwardKe || !currentEmployeeId) return;
    const penerima = dummyEmployees.find((e) => e.id === forwardKe);

    setDisposisiList((prev) =>
      prev.map((d) => {
        if (d.id !== selectedDisposisi.id) return d;
        const updatedRiwayat = d.riwayat.map((r, i) => {
          // Update riwayat terakhir yang masih menunggu menjadi disetujui
          if (i === d.riwayat.length - 1 && r.status === 'menunggu') {
            return { ...r, status: 'disetujui' as DisposisiStatusRiwayat, tanggalDiselesaikan: new Date().toISOString().split('T')[0] };
          }
          return r;
        });
        // Tambah riwayat baru
        const newRiwayat: DisposisiRiwayat = {
          id: generateId('rw'),
          dari: currentEmployeeId,
          ke: forwardKe,
          status: 'menunggu',
          catatan: forwardCatatan || undefined,
          tanggalDibuat: new Date().toISOString().split('T')[0],
        };
        return {
          ...d,
          status: 'proses' as const,
          riwayat: [...updatedRiwayat, newRiwayat],
        };
      })
    );

    alert(`✅ Disposisi disetujui dan diteruskan ke ${penerima?.nama}`);
    setForwardOpen(false);
    setForwardKe('');
    setForwardCatatan('');
    setDetailOpen(false);
  };

  // Penerima tugas: tandai selesai
  const handleSelesaikan = () => {
    if (!selectedDisposisi || !currentEmployeeId) return;

    setDisposisiList((prev) =>
      prev.map((d) => {
        if (d.id !== selectedDisposisi.id) return d;
        const updatedRiwayat = d.riwayat.map((r, i) => {
          if (i === d.riwayat.length - 1 && r.status === 'menunggu' && r.ke === currentEmployeeId) {
            return { ...r, status: 'selesai' as DisposisiStatusRiwayat, tanggalDiselesaikan: new Date().toISOString().split('T')[0] };
          }
          return r;
        });
        return { ...d, status: 'selesai' as const, riwayat: updatedRiwayat };
      })
    );

    alert('✅ Tugas diselesaikan!');
    setDetailOpen(false);
  };

  // Tolak
  const handleTolak = () => {
    if (!selectedDisposisi || !currentEmployeeId) return;

    setDisposisiList((prev) =>
      prev.map((d) => {
        if (d.id !== selectedDisposisi.id) return d;
        const updatedRiwayat = d.riwayat.map((r, i) => {
          if (i === d.riwayat.length - 1 && r.status === 'menunggu') {
            return { ...r, status: 'ditolak' as DisposisiStatusRiwayat, tanggalDiselesaikan: new Date().toISOString().split('T')[0] };
          }
          return r;
        });
        return { ...d, status: 'selesai' as const, riwayat: updatedRiwayat };
      })
    );

    alert('❌ Disposisi ditolak.');
    setDetailOpen(false);
  };

  // Update status disposisi (oleh orang yang ditujukan)
  const openUpdate = (d: Disposisi) => {
    setSelectedDisposisi(d);
    const lastRiwayat = d.riwayat[d.riwayat.length - 1];
    setFormTujuan(lastRiwayat?.ke || '');
    setFormTenggat(d.tenggatWaktu);
    setUpdateCatatan('');
    setUpdateOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisposisi || !currentEmployeeId) return;

    const tujuanBerubah = formTujuan !== selectedDisposisi.riwayat[selectedDisposisi.riwayat.length - 1]?.ke;
    const penerima = dummyEmployees.find((emp) => emp.id === formTujuan);

    setDisposisiList((prev) =>
      prev.map((d) => {
        if (d.id !== selectedDisposisi.id) return d;

        // Update tenggat dan catatan di riwayat terakhir
        const updatedRiwayat = d.riwayat.map((r, i) => {
          if (i === d.riwayat.length - 1 && r.status === 'menunggu') {
            return {
              ...r,
              catatan: updateCatatan
                ? (r.catatan ? r.catatan + ' | ' + updateCatatan : updateCatatan)
                : r.catatan,
            };
          }
          return r;
        });

        // Jika tujuan berubah, selesaikan riwayat saat ini & buat riwayat baru
        if (tujuanBerubah && formTujuan) {
          const resolvedRiwayat = updatedRiwayat.map((r, i) => {
            if (i === d.riwayat.length - 1) {
              return { ...r, status: 'selesai' as DisposisiStatusRiwayat, tanggalDiselesaikan: new Date().toISOString().split('T')[0] };
            }
            return r;
          });
          const newRiwayat: DisposisiRiwayat = {
            id: generateId('rw'),
            dari: currentEmployeeId,
            ke: formTujuan,
            status: 'menunggu',
            catatan: updateCatatan || undefined,
            tanggalDibuat: new Date().toISOString().split('T')[0],
          };
          return {
            ...d,
            tenggatWaktu: formTenggat,
            status: 'proses' as const,
            riwayat: [...resolvedRiwayat, newRiwayat],
          };
        }

        return {
          ...d,
          tenggatWaktu: formTenggat,
          riwayat: updatedRiwayat,
        };
      })
    );

    const msg = tujuanBerubah
      ? `✅ Status diperbarui & disposisi diteruskan ke ${penerima?.nama || formTujuan}`
      : '✅ Status disposisi berhasil diperbarui!';
    alert(msg);
    setUpdateOpen(false);
  };

  // ==================== RENDER ====================

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Disposisi / Surat Penugasan</h1>
            <p className="text-gray-500 mt-1">Kelola surat penugasan dan disposisi tugas</p>
          </div>
          {(isAdmin || isKepsek) && (
            <button
              onClick={() => { resetCreateForm(); setCreateOpen(true); }}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm"
            >
              <span className="text-lg">+</span> Buat Disposisi Baru
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard title="Total Disposisi" value={disposisiList.length} icon="📋" color="blue" />
          <StatCard title="Baru / Menunggu" value={totalBaru} icon="📨" color="yellow" />
          <StatCard title="Dalam Proses" value={totalProses} icon="🔄" color="purple" />
          <StatCard title="Selesai" value={totalSelesai} icon="✅" color="green" />
        </div>

        {/* Tabel Disposisi */}
        <Card title="Daftar Disposisi">
          {disposisiList.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📭</p>
              <p>Belum ada disposisi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Judul</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Perihal</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Ditujukan Kepada</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Prioritas</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Tenggat</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Riwayat</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {disposisiList.map((d) => {
                    const overdue = isOverdue(d);
                    return (
                      <tr
                        key={d.id}
                        onClick={() => { setSelectedDisposisi(d); setDetailOpen(true); }}
                        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          overdue ? 'bg-red-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">{d.judul}</span>
                            {overdue && <Badge variant="danger">Terlambat</Badge>}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">oleh {getPembuat(d)} • {d.tanggalDibuat}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-600 max-w-50 truncate" title={d.perihal}>
                          {d.perihal}
                        </td>
                        <td className="py-3 px-4 text-gray-700">{getLatestPenerima(d)}</td>
                        <td className="py-3 px-4">
                          <Badge variant={priorityVariant(d.prioritas)}>{prioritasLabels[d.prioritas]}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                            {d.tenggatWaktu}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={statusVariant(d.status)}>{statusLabel(d.status)}</Badge>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {d.riwayat.length} langkah
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); openUpdate(d); }}
                            className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            ✏️ Update Status
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ==================== MODAL BUAT DISPOSISI BARU ==================== */}
        <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Buat Disposisi Baru" size="lg">
          <form onSubmit={handleCreate}>
            <FormField
              label="Judul"
              name="judul"
              value={formJudul}
              onChange={(e) => setFormJudul(e.target.value)}
              placeholder="Judul disposisi / surat penugasan"
              required
            />
            <FormField
              label="Perihal / Deskripsi"
              name="perihal"
              type="textarea"
              value={formPerihal}
              onChange={(e) => setFormPerihal(e.target.value)}
              placeholder="Deskripsi detail tugas atau instruksi..."
              rows={4}
              required
            />
            <FormField
              label="Ditujukan Kepada"
              name="tujuan"
              type="select"
              value={formTujuan}
              onChange={(e) => setFormTujuan(e.target.value)}
              placeholder="Pilih penerima..."
              options={dummyEmployees.map((e) => ({ value: e.id, label: `${e.nama} (${e.jabatan})` }))}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Prioritas"
                name="prioritas"
                type="select"
                value={formPrioritas}
                onChange={(e) => setFormPrioritas(e.target.value as DisposisiPrioritas)}
                options={[
                  { value: 'rendah', label: 'Rendah' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'tinggi', label: 'Tinggi' },
                  { value: 'urgent', label: 'Urgent' },
                ]}
              />
              <FormField
                label="Tenggat Waktu"
                name="tenggat"
                type="date"
                value={formTenggat}
                onChange={(e) => setFormTenggat(e.target.value)}
              />
            </div>
            <FormField
              label="Upload Lampiran"
              name="lampiran"
              type="file"
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                if (input.files?.[0]) {
                  setFormLampiran(input.files[0].name);
                }
              }}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
            />
            {formLampiran && (
              <p className="text-xs text-green-600 -mt-3 mb-4">📎 {formLampiran}</p>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
              <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Buat Disposisi
              </button>
            </div>
          </form>
        </Modal>

        {/* ==================== MODAL DETAIL DISPOSISI ==================== */}
        {selectedDisposisi && (
          <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Detail Disposisi" size="lg">
            <div className="space-y-4">
              {/* Info Utama */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900">{selectedDisposisi.judul}</h3>
                <p className="text-sm text-blue-700 mt-1">{selectedDisposisi.perihal}</p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <Badge variant={priorityVariant(selectedDisposisi.prioritas)}>
                    {prioritasLabels[selectedDisposisi.prioritas]}
                  </Badge>
                  <Badge variant={statusVariant(selectedDisposisi.status)}>
                    {statusLabel(selectedDisposisi.status)}
                  </Badge>
                  <span className="text-xs text-blue-600">⏰ Tenggat: {selectedDisposisi.tenggatWaktu}</span>
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  Dibuat oleh {getPembuat(selectedDisposisi)} • {selectedDisposisi.tanggalDibuat}
                </div>
                {selectedDisposisi.lampiran && (
                  <div className="mt-2 text-xs text-blue-600">📎 Lampiran: {selectedDisposisi.lampiran}</div>
                )}
              </div>

              {/* Riwayat Penerusan */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">📜 Riwayat Penerusan</h4>
                <div className="relative pl-6 space-y-0">
                  {selectedDisposisi.riwayat.map((r, idx) => {
                    const dari = dummyEmployees.find((e) => e.id === r.dari);
                    const ke = dummyEmployees.find((e) => e.id === r.ke);
                    const isLast = idx === selectedDisposisi.riwayat.length - 1;
                    return (
                      <div key={r.id} className="relative pb-4">
                        {!isLast && (
                          <div className="absolute left-[-0.65rem] top-6 bottom-0 w-0.5 bg-gray-200" />
                        )}
                        <div
                          className={`absolute -left-4 top-1 w-3.5 h-3.5 rounded-full border-2 ${
                            r.status === 'selesai' || r.status === 'disetujui'
                              ? 'bg-green-500 border-green-300'
                              : r.status === 'ditolak'
                                ? 'bg-red-500 border-red-300'
                                : 'bg-yellow-500 border-yellow-300'
                          }`}
                        />
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-700">{dari?.nama || r.dari}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium text-gray-700">{ke?.nama || r.ke}</span>
                            <Badge variant={statusVariant(r.status)}>{statusLabel(r.status)}</Badge>
                          </div>
                          {r.catatan && (
                            <p className="text-xs text-gray-500 mt-1">{r.catatan}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            📅 {r.tanggalDibuat}
                            {r.tanggalDiselesaikan && ` → ✅ ${r.tanggalDiselesaikan}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 flex-wrap">
                {/* Kepsek: Setujui & Teruskan (jika riwayat terakhir ditujukan ke kepsek & masih menunggu) */}
                {isKepsek &&
                  selectedDisposisi.riwayat.length > 0 &&
                  selectedDisposisi.riwayat[selectedDisposisi.riwayat.length - 1].ke === currentEmployeeId &&
                  selectedDisposisi.riwayat[selectedDisposisi.riwayat.length - 1].status === 'menunggu' && (
                    <>
                      <button
                        onClick={() => setForwardOpen(true)}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✅ Setujui & Teruskan
                      </button>
                      <button
                        onClick={handleTolak}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ❌ Tolak
                      </button>
                    </>
                  )}

                {/* Penerima tugas: Selesaikan (jika riwayat terakhir ditujukan ke user & masih menunggu) */}
                {selectedDisposisi.riwayat.length > 0 &&
                  selectedDisposisi.riwayat[selectedDisposisi.riwayat.length - 1].ke === currentEmployeeId &&
                  selectedDisposisi.riwayat[selectedDisposisi.riwayat.length - 1].status === 'menunggu' &&
                  !isKepsek && (
                    <button
                      onClick={handleSelesaikan}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🏁 Tandai Selesai
                    </button>
                  )}
              </div>
            </div>
          </Modal>
        )}

        {/* ==================== MODAL FORWARD (SETUJUI & TERUSKAN) ==================== */}
        <Modal isOpen={forwardOpen} onClose={() => setForwardOpen(false)} title="Setujui & Teruskan Disposisi" size="md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSetujuiDanTeruskan();
            }}
          >
            <FormField
              label="Teruskan Kepada"
              name="forwardKe"
              type="select"
              value={forwardKe}
              onChange={(e) => setForwardKe(e.target.value)}
              placeholder="Pilih pegawai yang bertugas..."
              options={dummyEmployees
                .filter((e) => e.id !== currentEmployeeId)
                .map((e) => ({ value: e.id, label: `${e.nama} (${e.jabatan})` }))}
              required
            />
            <FormField
              label="Catatan / Instruksi"
              name="forwardCatatan"
              type="textarea"
              value={forwardCatatan}
              onChange={(e) => setForwardCatatan(e.target.value)}
              placeholder="Instruksi atau catatan untuk penerima..."
              rows={3}
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
              <button type="button" onClick={() => setForwardOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Setujui & Teruskan
              </button>
            </div>
          </form>
        </Modal>

        {/* ==================== MODAL UPDATE STATUS DISPOSISI ==================== */}
        <Modal isOpen={updateOpen} onClose={() => setUpdateOpen(false)} title="Update Status Disposisi" size="md">
          {selectedDisposisi && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
              <p className="font-medium text-blue-800">{selectedDisposisi.judul}</p>
              <p className="text-blue-600 text-xs mt-1">{selectedDisposisi.perihal}</p>
            </div>
          )}
          <form onSubmit={handleUpdate}>
            <FormField
              label="Update Ditujukan Kepada"
              name="tujuan"
              type="select"
              value={formTujuan}
              onChange={(e) => setFormTujuan(e.target.value)}
              placeholder="Pilih penerima selanjutnya..."
              options={dummyEmployees.map((e) => ({ value: e.id, label: `${e.nama} (${e.jabatan})` }))}
              required
            />
            <FormField
              label="Perbarui Tenggat Waktu"
              name="tenggat"
              type="date"
              value={formTenggat}
              onChange={(e) => setFormTenggat(e.target.value)}
            />
            <FormField
              label="Catatan / Pesan"
              name="catatan"
              type="textarea"
              value={updateCatatan}
              onChange={(e) => setUpdateCatatan(e.target.value)}
              placeholder="Tulis catatan progres, kendala, atau pesan..."
              rows={4}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
              <button type="button" onClick={() => setUpdateOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Simpan Update
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
}

export default function DisposisiPage() {
  return <DisposisiContent />;
}
