'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyUsers, roleLabels } from '@/data/users';
import { User, UserRole } from '@/types';

function UserRoleContent() {
  const { user, hasRole } = useAuth();
  const router = useRouter();
  const [users] = useState(dummyUsers);

  if (!user) { router.push('/'); return null; }
  if (!hasRole('super_admin')) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-4xl mb-4">🔒</p>
            <p className="text-gray-500">Hanya Super Admin yang dapat mengakses halaman ini</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const allRoles: UserRole[] = [
    'super_admin', 'admin_tu', 'bendahara', 'kepala_sekolah',
    'guru', 'wali_kelas', 'guru_bk', 'panitia_spmb',
    'admin_sarpras', 'petugas_perpus', 'siswa', 'ortu',
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User & Role</h1>
            <p className="text-gray-500 mt-1">Manajemen pengguna & hak akses</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">+ Tambah User</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User List */}
          <Card title="👤 Daftar User" subtitle={`${users.length} user`}>
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {u.nama.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{u.nama}</p>
                      <p className="text-xs text-gray-400">{u.username} | {u.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                    {u.roles.map((r) => (
                      <span key={r} className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">{roleLabels[r]}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Role Matrix */}
          <Card title="🔑 Matrix Role & Akses" subtitle="Hak akses per role">
            <div className="overflow-x-auto text-xs">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left font-semibold text-gray-600">Role</th>
                    <th className="px-2 py-2 text-center font-semibold text-gray-600">Siswa</th>
                    <th className="px-2 py-2 text-center font-semibold text-gray-600">Pegawai</th>
                    <th className="px-2 py-2 text-center font-semibold text-gray-600">Presensi</th>
                    <th className="px-2 py-2 text-center font-semibold text-gray-600">Keuangan</th>
                    <th className="px-2 py-2 text-center font-semibold text-gray-600">BK</th>
                    <th className="px-2 py-2 text-center font-semibold text-gray-600">SPMB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allRoles.slice(0, 8).map((role) => (
                    <tr key={role} className="hover:bg-gray-50">
                      <td className="px-2 py-2 font-medium text-gray-700">{roleLabels[role]}</td>
                      <td className="px-2 py-2 text-center">{['super_admin', 'admin_tu', 'kepala_sekolah', 'wali_kelas'].includes(role) ? '✅' : '❌'}</td>
                      <td className="px-2 py-2 text-center">{['super_admin', 'admin_tu', 'kepala_sekolah'].includes(role) ? '✅' : role === 'guru' ? '👁️' : '❌'}</td>
                      <td className="px-2 py-2 text-center">{['super_admin', 'admin_tu', 'kepala_sekolah', 'guru', 'wali_kelas'].includes(role) ? '✅' : '❌'}</td>
                      <td className="px-2 py-2 text-center">{['super_admin', 'bendahara', 'kepala_sekolah'].includes(role) ? '✅' : '❌'}</td>
                      <td className="px-2 py-2 text-center">{['super_admin', 'guru_bk', 'kepala_sekolah', 'wali_kelas'].includes(role) ? '✅' : '❌'}</td>
                      <td className="px-2 py-2 text-center">{['super_admin', 'panitia_spmb', 'kepala_sekolah'].includes(role) ? '✅' : '❌'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">✅ Full | 👁️ Read Only | ❌ No Access</p>
          </Card>
        </div>

        {/* Activity Log */}
        <Card title="📋 Log Aktivitas (Audit Trail)">
          <div className="space-y-2 text-sm">
            {[
              { user: 'Admin TU', action: 'Menambah data siswa baru: Kevin Ardiansyah', time: '2026-07-22 10:30' },
              { user: 'Bendahara', action: 'Input pembayaran SPP: Andi Pratama', time: '2026-07-22 09:15' },
              { user: 'Kepala Sekolah', action: 'Approve rapor: Bunga Citra Lestari', time: '2026-07-22 08:00' },
              { user: 'Guru BK', action: 'Input kasus: Eko Prasetyo', time: '2026-07-21 14:20' },
              { user: 'Admin TU', action: 'Edit data pegawai: Rudi Hartono', time: '2026-07-21 11:45' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-700">{log.user}</span>
                  <span className="text-gray-500"> — {log.action}</span>
                </div>
                <span className="text-xs text-gray-400">{log.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default function UserRolePage() {
  return <UserRoleContent />;
}
