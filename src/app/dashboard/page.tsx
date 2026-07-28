'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { StatCard, Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { dummyStudents } from '@/data/students';
import { dummyEmployees } from '@/data/employees';
import { dummyAttendanceStudents, dummyAttendanceEmployees } from '@/data/attendance';
import { dummyBills } from '@/data/finance';
import { dummyDisposisi } from '@/data/letters';
import { dummyBKCases } from '@/data/bk';

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const today = '2026-07-22';
  const activeStudents = dummyStudents.filter((s) => s.status === 'aktif').length;
  const todayStudentHadir = dummyAttendanceStudents.filter((a) => a.tanggal === today && a.status === 'hadir').length;
  const todayStudentTotal = dummyAttendanceStudents.filter((a) => a.tanggal === today).length;
  const todayEmployeeHadir = dummyAttendanceEmployees.filter((a) => a.tanggal === today && a.status === 'hadir').length;
  const todayEmployeeTotal = dummyAttendanceEmployees.filter((a) => a.tanggal === today).length;
  const unpaidBills = dummyBills.filter((b) => b.status !== 'lunas').length;
  const pendingDispos = dummyDisposisi.filter((d) => d.status !== 'selesai').length;

  const isKepsek = user.roles.includes('kepala_sekolah');
  const isAdmin = user.roles.includes('super_admin') || user.roles.includes('admin_tu');
  const isBendahara = user.roles.includes('bendahara');
  const isGuru = user.roles.includes('guru');
  const isSiswa = user.roles.includes('siswa');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Selamat datang, {user.nama}</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(isKepsek || isAdmin) && (
            <>
              <StatCard title="Siswa Aktif" value={activeStudents} icon="👨‍🎓" color="blue" />
              <StatCard title="Kehadiran Siswa Hari Ini" value={`${todayStudentHadir}/${todayStudentTotal}`} icon="✅" color="green" />
              <StatCard title="Kehadiran Pegawai Hari Ini" value={`${todayEmployeeHadir}/${todayEmployeeTotal}`} icon="🕐" color="purple" />
              <StatCard title="Tunggakan SPP" value={unpaidBills} icon="💰" color="red" />
              <StatCard title="Disposisi Pending" value={pendingDispos} icon="📥" color="yellow" />
              <StatCard title="Pegawai" value={dummyEmployees.length} icon="👨‍🏫" color="blue" />
            </>
          )}
          {isBendahara && (
            <>
              <StatCard title="Pemasukan Bulan Ini" value="Rp 8.000.000" icon="💰" color="green" />
              <StatCard title="Tunggakan" value={unpaidBills} icon="⚠️" color="red" />
              <StatCard title="Siswa Lunas" value={dummyBills.filter((b) => b.status === 'lunas').length} icon="✅" color="blue" />
              <StatCard title="Total Tagihan" value={dummyBills.length} icon="📄" color="purple" />
            </>
          )}
          {isGuru && (
            <>
              <StatCard title="Jadwal Mengajar Hari Ini" value="4 JP" icon="📚" color="blue" />
              <StatCard title="Tugas Perlu Dinilai" value="3" icon="✏️" color="yellow" />
              <StatCard title="Kelas Diampu" value="2" icon="👥" color="green" />
              <StatCard title="Kehadiran Hari Ini" value="Hadir" icon="✅" color="purple" />
            </>
          )}
          {isSiswa && (
            <>
              <StatCard title="Nilai Rata-rata" value="85.5" icon="💯" color="blue" />
              <StatCard title="Presensi Bulan Ini" value="90%" icon="✅" color="green" />
              <StatCard title="Tagihan Aktif" value="Rp 350.000" icon="💰" color="yellow" />
              <StatCard title="Buku Dipinjam" value="1" icon="📖" color="purple" />
            </>
          )}
        </div>

        {/* Detail Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Attendance */}
          {(isKepsek || isAdmin) && (
            <Card title="📋 Presensi Siswa Hari Ini" subtitle={today}>
              <div className="space-y-2">
                {dummyAttendanceStudents
                  .filter((a) => a.tanggal === today)
                  .slice(0, 6)
                  .map((a) => {
                    const student = dummyStudents.find((s) => s.id === a.siswaId);
                    return (
                      <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm text-blue-700 font-medium">
                            {student?.namaLengkap?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">{student?.namaLengkap || '-'}</p>
                            <p className="text-xs text-gray-400">Kelas {student?.kelas} {student?.jurusan}</p>
                          </div>
                        </div>
                        <Badge variant={a.status === 'hadir' ? 'success' : a.status === 'alpha' ? 'danger' : 'info'}>
                          {a.status}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </Card>
          )}

          {/* Recent Cases */}
          {isKepsek && (
            <Card title="🫂 Kasus BK Terbaru" subtitle="Minggu ini">
              <div className="space-y-2">
                {dummyBKCases.slice(0, 5).map((c) => {
                  const student = dummyStudents.find((s) => s.id === c.siswaId);
                  return (
                    <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{student?.namaLengkap || '-'}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[250px]">{c.deskripsi}</p>
                      </div>
                      <Badge variant={c.kategori === 'pelanggaran' ? 'danger' : 'warning'}>{c.kategori}</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Disposisi */}
          {(isKepsek || isAdmin) && (
            <Card title="📥 Disposisi Pending" subtitle="Perlu tindak lanjut">
              <div className="space-y-2">
                {dummyDisposisi.filter((d) => d.status !== 'selesai').slice(0, 5).map((d) => (
                  <div key={d.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{d.judul}</p>
                      <p className="text-xs text-gray-400">Tenggat: {d.tenggatWaktu}</p>
                    </div>
                    <Badge variant={d.status === 'baru' ? 'warning' : 'info'}>{d.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {isBendahara && (
            <Card title="💳 Pembayaran Terbaru" subtitle="Bulan ini">
              <div className="space-y-2">
                {dummyBills.filter((b) => b.status === 'lunas').slice(0, 5).map((b) => {
                  const student = dummyStudents.find((s) => s.id === b.siswaId);
                  return (
                    <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{student?.namaLengkap || '-'}</p>
                        <p className="text-xs text-gray-400">TA: {b.tahunAjaran}</p>
                      </div>
                      <p className="text-sm font-semibold text-green-600">Rp {b.nominal.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
