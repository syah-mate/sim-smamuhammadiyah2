'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DataTable, { StatusCell } from '@/components/ui/DataTable';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { FormField, FormActions } from '@/components/ui/FormField';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyStudents } from '@/data/students';
import { Student, StudentStatus } from '@/types';

function DataSiswaContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>(dummyStudents);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    namaLengkap: string; nisn: string; nis: string; tempatLahir: string; tanggalLahir: string;
    jenisKelamin: 'L' | 'P'; alamat: string; noHp: string; email: string;
    namaAyah: string; namaIbu: string; pekerjaanAyah: string; pekerjaanIbu: string;
    noHpOrtu: string; kelas: string; jurusan: 'IPA' | 'IPS' | 'Bahasa'; tahunAjaran: string; status: StudentStatus;
  }>({
    namaLengkap: '', nisn: '', nis: '', tempatLahir: '', tanggalLahir: '',
    jenisKelamin: 'L', alamat: '', noHp: '', email: '',
    namaAyah: '', namaIbu: '', pekerjaanAyah: '', pekerjaanIbu: '',
    noHpOrtu: '', kelas: 'X', jurusan: 'IPA', tahunAjaran: '2024/2025', status: 'aktif',
  });

  if (!user) { router.push('/'); return null; }

  const resetForm = () => setForm({
    namaLengkap: '', nisn: '', nis: '', tempatLahir: '', tanggalLahir: '',
    jenisKelamin: 'L', alamat: '', noHp: '', email: '',
    namaAyah: '', namaIbu: '', pekerjaanAyah: '', pekerjaanIbu: '',
    noHpOrtu: '', kelas: 'X', jurusan: 'IPA', tahunAjaran: '2024/2025', status: 'aktif',
  } as const);

  const handleEdit = (s: Student) => {
    setEditItem(s);
    setForm({
      namaLengkap: s.namaLengkap, nisn: s.nisn, nis: s.nis,
      tempatLahir: s.tempatLahir, tanggalLahir: s.tanggalLahir,
      jenisKelamin: s.jenisKelamin, alamat: s.alamat, noHp: s.noHp, email: s.email,
      namaAyah: s.namaAyah, namaIbu: s.namaIbu,
      pekerjaanAyah: s.pekerjaanAyah, pekerjaanIbu: s.pekerjaanIbu,
      noHpOrtu: s.noHpOrtu, kelas: s.kelas, jurusan: s.jurusan,
      tahunAjaran: s.tahunAjaran, status: s.status,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      setStudents((prev) => prev.map((s) => (s.id === editItem.id ? { ...s, ...form } : s)));
    } else {
      const newStudent: Student = {
        id: `s${Date.now()}`,
        ...form,
        namaWali: '-', pekerjaanWali: '-',
        riwayatKelas: [], dokumen: [],
      };
      setStudents((prev) => [newStudent, ...prev]);
    }
    setShowForm(false); setEditItem(null); resetForm();
  };

  const handleDelete = () => {
    if (deleteId) {
      setStudents((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    }
  };

  const total = students.length;
  const aktif = students.filter((s) => s.status === 'aktif').length;
  const lulus = students.filter((s) => s.status === 'lulus').length;

  const columns = [
    { key: 'nisn', header: 'NISN' },
    { key: 'nis', header: 'NIS' },
    {
      key: 'namaLengkap',
      header: 'Nama Lengkap',
      render: (s: Student) => <span className="font-medium text-gray-800">{s.namaLengkap}</span>,
    },
    {
      key: 'kelasJurusan',
      header: 'Kelas',
      render: (s: Student) => `${s.kelas} ${s.jurusan}`,
    },
    { key: 'jenisKelamin', header: 'JK' },
    {
      key: 'status',
      header: 'Status',
      render: (s: Student) => <StatusCell status={s.status} />,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Siswa</h1>
            <p className="text-gray-500 mt-1">Kelola data siswa aktif, alumni, dan mutasi</p>
          </div>
          <button onClick={() => { resetForm(); setEditItem(null); setShowForm(true); }} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            + Tambah Siswa
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Siswa" value={total} icon="👨‍🎓" color="blue" />
          <StatCard title="Siswa Aktif" value={aktif} icon="✅" color="green" />
          <StatCard title="Lulus" value={lulus} icon="🎓" color="purple" />
        </div>

        <Card title="Daftar Siswa" subtitle={`${total} data`}>
          <DataTable
            columns={columns}
            data={students}
            keyExtractor={(s) => s.id}
            searchPlaceholder="Cari nama, NISN, NIS..."
            searchKeys={['namaLengkap', 'nisn', 'nis']}
            actions={(s) => (
              <>
                <button onClick={() => handleEdit(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs">✏️</button>
                <button onClick={() => setDeleteId(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs">🗑️</button>
              </>
            )}
          />
        </Card>

        {/* Form Modal */}
        <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }} title={editItem ? 'Edit Siswa' : 'Tambah Siswa'} size="lg">
          <form onSubmit={handleSubmit}>
            <h4 className="font-semibold text-sm text-gray-700 mb-3 border-b pb-2">Data Pribadi</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <FormField label="Nama Lengkap" name="namaLengkap" value={form.namaLengkap} onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })} required />
              <FormField label="NISN" name="nisn" value={form.nisn} onChange={(e) => setForm({ ...form, nisn: e.target.value })} required />
              <FormField label="NIS" name="nis" value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} required />
              <FormField label="Jenis Kelamin" name="jenisKelamin" type="select" value={form.jenisKelamin} onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value as 'L' | 'P' })} options={[{ value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' }]} required />
              <FormField label="Tempat Lahir" name="tempatLahir" value={form.tempatLahir} onChange={(e) => setForm({ ...form, tempatLahir: e.target.value })} />
              <FormField label="Tanggal Lahir" name="tanggalLahir" type="date" value={form.tanggalLahir} onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })} />
              <FormField label="Alamat" name="alamat" type="textarea" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} className="sm:col-span-2" />
              <FormField label="No HP" name="noHp" type="tel" value={form.noHp} onChange={(e) => setForm({ ...form, noHp: e.target.value })} />
              <FormField label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <h4 className="font-semibold text-sm text-gray-700 mb-3 border-b pb-2 mt-4">Data Orang Tua</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <FormField label="Nama Ayah" name="namaAyah" value={form.namaAyah} onChange={(e) => setForm({ ...form, namaAyah: e.target.value })} />
              <FormField label="Pekerjaan Ayah" name="pekerjaanAyah" value={form.pekerjaanAyah} onChange={(e) => setForm({ ...form, pekerjaanAyah: e.target.value })} />
              <FormField label="Nama Ibu" name="namaIbu" value={form.namaIbu} onChange={(e) => setForm({ ...form, namaIbu: e.target.value })} />
              <FormField label="Pekerjaan Ibu" name="pekerjaanIbu" value={form.pekerjaanIbu} onChange={(e) => setForm({ ...form, pekerjaanIbu: e.target.value })} />
              <FormField label="No HP Ortu" name="noHpOrtu" type="tel" value={form.noHpOrtu} onChange={(e) => setForm({ ...form, noHpOrtu: e.target.value })} />
            </div>

            <h4 className="font-semibold text-sm text-gray-700 mb-3 border-b pb-2 mt-4">Akademik</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
              <FormField label="Kelas" name="kelas" type="select" value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })} options={['X', 'XI', 'XII'].map((v) => ({ value: v, label: v }))} required />
              <FormField label="Jurusan" name="jurusan" type="select" value={form.jurusan} onChange={(e) => setForm({ ...form, jurusan: e.target.value as 'IPA' | 'IPS' | 'Bahasa' })} options={[{ value: 'IPA', label: 'IPA' }, { value: 'IPS', label: 'IPS' }, { value: 'Bahasa', label: 'Bahasa' }]} required />
              <FormField label="Tahun Ajaran" name="tahunAjaran" value={form.tahunAjaran} onChange={(e) => setForm({ ...form, tahunAjaran: e.target.value })} required />
              <FormField label="Status" name="status" type="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as StudentStatus })} options={[{ value: 'aktif', label: 'Aktif' }, { value: 'lulus', label: 'Lulus' }, { value: 'pindah', label: 'Pindah' }, { value: 'keluar', label: 'Keluar' }, { value: 'do', label: 'DO' }]} />
            </div>
            <FormActions onCancel={() => { setShowForm(false); setEditItem(null); }} submitLabel={editItem ? 'Update' : 'Simpan'} />
          </form>
        </Modal>

        <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Hapus Siswa" message="Yakin ingin menghapus data siswa ini? Data tidak bisa dikembalikan." variant="danger" confirmLabel="Hapus" />
      </div>
    </MainLayout>
  );
}

export default function DataSiswaPage() {
  return <DataSiswaContent />;
}
