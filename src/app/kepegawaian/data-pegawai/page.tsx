'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable, { StatusCell } from '@/components/ui/DataTable';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { Card, StatCard } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { dummyEmployees } from '@/data/employees';
import { Employee, JenisPegawai, StatusKepegawaian } from '@/types';

function DataPegawaiContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>(dummyEmployees);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nama: '', nip: '', nuptk: '', jenisPegawai: 'guru' as JenisPegawai, statusKepegawaian: 'tetap' as StatusKepegawaian,
    tempatLahir: '', tanggalLahir: '', alamat: '', noHp: '', email: '',
    pendidikanTerakhir: '', jabatan: '', mapelDiampu: '',
  });

  if (!user) { router.push('/'); return null; }

  const resetForm = () => setForm({
    nama: '', nip: '', nuptk: '', jenisPegawai: 'guru' as JenisPegawai, statusKepegawaian: 'tetap' as StatusKepegawaian,
    tempatLahir: '', tanggalLahir: '', alamat: '', noHp: '', email: '',
    pendidikanTerakhir: '', jabatan: '', mapelDiampu: '',
  });

  const handleEdit = (e: Employee) => {
    setEditItem(e);
    setForm({
      nama: e.nama, nip: e.nip, nuptk: e.nuptk, jenisPegawai: e.jenisPegawai,
      statusKepegawaian: e.statusKepegawaian, tempatLahir: e.tempatLahir,
      tanggalLahir: e.tanggalLahir, alamat: e.alamat, noHp: e.noHp, email: e.email,
      pendidikanTerakhir: e.pendidikanTerakhir, jabatan: e.jabatan,
      mapelDiampu: e.mapelDiampu.join(', '),
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, mapelDiampu: form.mapelDiampu.split(',').map((s) => s.trim()).filter(Boolean) };
    if (editItem) {
      setEmployees((prev) => prev.map((emp) => (emp.id === editItem.id ? { ...emp, ...data } : emp)));
    } else {
      const newEmp: Employee = {
        id: `e${Date.now()}`, ...data, riwayatJabatan: [], dokumen: [], waliKelasDari: undefined,
      };
      setEmployees((prev) => [newEmp, ...prev]);
    }
    setShowForm(false); setEditItem(null); resetForm();
  };

  const handleDelete = () => {
    if (deleteId) { setEmployees((prev) => prev.filter((e) => e.id !== deleteId)); setDeleteId(null); }
  };

  const guru = employees.filter((e) => e.jenisPegawai === 'guru').length;
  const tendik = employees.filter((e) => e.jenisPegawai === 'tendik').length;
  const pns = employees.filter((e) => e.statusKepegawaian === 'pns_dpk').length;

  const columns = [
    { key: 'nip', header: 'NIP' },
    { key: 'nuptk', header: 'NUPTK' },
    { key: 'nama', header: 'Nama', render: (e: Employee) => <span className="font-medium text-gray-800">{e.nama}</span> },
    {
      key: 'jenisPegawai', header: 'Jenis',
      render: (e: Employee) => <StatusCell status={e.jenisPegawai === 'guru' ? 'Guru' : e.jenisPegawai === 'kepsek' ? 'Kepsek' : 'Tendik'} />,
    },
    {
      key: 'statusKepegawaian', header: 'Status',
      render: (e: Employee) => <StatusCell status={e.statusKepegawaian === 'tetap' ? 'Tetap' : e.statusKepegawaian === 'pns_dpk' ? 'PNS DPK' : 'Honorer'} />,
    },
    { key: 'jabatan', header: 'Jabatan' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Pegawai</h1>
            <p className="text-gray-500 mt-1">Kelola data guru dan tenaga kependidikan</p>
          </div>
          <button onClick={() => { resetForm(); setEditItem(null); setShowForm(true); }} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            + Tambah Pegawai
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard title="Total Pegawai" value={employees.length} icon="👨‍🏫" color="blue" />
          <StatCard title="Guru" value={guru} icon="📚" color="green" />
          <StatCard title="Tendik" value={tendik} icon="💼" color="purple" />
          <StatCard title="PNS DPK" value={pns} icon="🏛️" color="yellow" />
        </div>

        <Card title="Daftar Pegawai" subtitle={`${employees.length} data`}>
          <DataTable
            columns={columns}
            data={employees}
            keyExtractor={(e) => e.id}
            searchPlaceholder="Cari nama, NIP, NUPTK..."
            searchKeys={['nama', 'nip', 'nuptk']}
            actions={(e) => (
              <>
                <button onClick={() => handleEdit(e)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs">✏️</button>
                <button onClick={() => setDeleteId(e.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs">🗑️</button>
              </>
            )}
          />
        </Card>

        <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }} title={editItem ? 'Edit Pegawai' : 'Tambah Pegawai'} size="lg">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <FormField label="Nama" name="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required />
              <FormField label="NIP" name="nip" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} required />
              <FormField label="NUPTK" name="nuptk" value={form.nuptk} onChange={(e) => setForm({ ...form, nuptk: e.target.value })} />
              <FormField label="Jenis Pegawai" name="jenisPegawai" type="select" value={form.jenisPegawai} onChange={(e) => setForm({ ...form, jenisPegawai: e.target.value as typeof form.jenisPegawai })} options={[{ value: 'guru', label: 'Guru' }, { value: 'tendik', label: 'Tendik' }, { value: 'kepsek', label: 'Kepala Sekolah' }]} required />
              <FormField label="Status Kepegawaian" name="statusKepegawaian" type="select" value={form.statusKepegawaian} onChange={(e) => setForm({ ...form, statusKepegawaian: e.target.value as typeof form.statusKepegawaian })} options={[{ value: 'tetap', label: 'Tetap' }, { value: 'honorer', label: 'Honorer' }, { value: 'pns_dpk', label: 'PNS DPK' }]} required />
              <FormField label="Jabatan" name="jabatan" value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} />
              <FormField label="Tempat Lahir" name="tempatLahir" value={form.tempatLahir} onChange={(e) => setForm({ ...form, tempatLahir: e.target.value })} />
              <FormField label="Tanggal Lahir" name="tanggalLahir" type="date" value={form.tanggalLahir} onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })} />
              <FormField label="Alamat" name="alamat" type="textarea" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} className="sm:col-span-2" />
              <FormField label="No HP" name="noHp" type="tel" value={form.noHp} onChange={(e) => setForm({ ...form, noHp: e.target.value })} />
              <FormField label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <FormField label="Pendidikan Terakhir" name="pendidikanTerakhir" value={form.pendidikanTerakhir} onChange={(e) => setForm({ ...form, pendidikanTerakhir: e.target.value })} />
              <FormField label="Mapel Diampu (pisah koma)" name="mapelDiampu" value={form.mapelDiampu} onChange={(e) => setForm({ ...form, mapelDiampu: e.target.value })} className="sm:col-span-2" />
            </div>
            <FormActions onCancel={() => { setShowForm(false); setEditItem(null); }} submitLabel={editItem ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Hapus Pegawai" message="Yakin ingin menghapus data pegawai ini?" variant="danger" confirmLabel="Hapus" />
      </div>
    </MainLayout>
  );
}

export default function DataPegawaiPage() {
  return <DataPegawaiContent />;
}
