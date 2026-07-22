import { AttendanceStudent, AttendanceEmployee } from '@/types';

export const dummyAttendanceStudents: AttendanceStudent[] = [
  { id: 'as1', siswaId: 's1', kelasId: 'X-IPA', tanggal: '2026-07-22', jamKe: 1, status: 'hadir', dicatatOleh: 'e4' },
  { id: 'as2', siswaId: 's2', kelasId: 'X-IPA', tanggal: '2026-07-22', jamKe: 1, status: 'hadir', dicatatOleh: 'e4' },
  { id: 'as3', siswaId: 's3', kelasId: 'X-IPS', tanggal: '2026-07-22', jamKe: 1, status: 'sakit', dicatatOleh: 'e10' },
  { id: 'as4', siswaId: 's4', kelasId: 'XI-IPA', tanggal: '2026-07-22', jamKe: 1, status: 'hadir', dicatatOleh: 'e10' },
  { id: 'as5', siswaId: 's5', kelasId: 'XI-IPS', tanggal: '2026-07-22', jamKe: 1, status: 'alpha', dicatatOleh: 'e9' },
  { id: 'as6', siswaId: 's6', kelasId: 'XI-BHS', tanggal: '2026-07-22', jamKe: 1, status: 'hadir', dicatatOleh: 'e4' },
  { id: 'as7', siswaId: 's7', kelasId: 'XII-IPA', tanggal: '2026-07-22', jamKe: 1, status: 'izin', dicatatOleh: 'e9' },
  { id: 'as8', siswaId: 's1', kelasId: 'X-IPA', tanggal: '2026-07-21', jamKe: 1, status: 'hadir', dicatatOleh: 'e4' },
  { id: 'as9', siswaId: 's2', kelasId: 'X-IPA', tanggal: '2026-07-21', jamKe: 1, status: 'izin', dicatatOleh: 'e4' },
  { id: 'as10', siswaId: 's4', kelasId: 'XI-IPA', tanggal: '2026-07-21', jamKe: 1, status: 'hadir', dicatatOleh: 'e10' },
];

export const dummyAttendanceEmployees: AttendanceEmployee[] = [
  { id: 'ae1', pegawaiId: 'e1', tanggal: '2026-07-22', jamMasuk: '06:45', jamPulang: '15:30', status: 'hadir' },
  { id: 'ae2', pegawaiId: 'e2', tanggal: '2026-07-22', jamMasuk: '06:50', jamPulang: '16:00', status: 'hadir' },
  { id: 'ae3', pegawaiId: 'e3', tanggal: '2026-07-22', jamMasuk: '07:00', jamPulang: '15:00', status: 'hadir' },
  { id: 'ae4', pegawaiId: 'e4', tanggal: '2026-07-22', jamMasuk: '06:30', jamPulang: '14:30', status: 'hadir' },
  { id: 'ae5', pegawaiId: 'e5', tanggal: '2026-07-22', jamMasuk: '07:15', jamPulang: '14:00', status: 'hadir' },
  { id: 'ae6', pegawaiId: 'e6', tanggal: '2026-07-22', jamMasuk: '', jamPulang: '', status: 'sakit' },
  { id: 'ae7', pegawaiId: 'e7', tanggal: '2026-07-22', jamMasuk: '08:00', jamPulang: '15:30', status: 'hadir' },
  { id: 'ae8', pegawaiId: 'e8', tanggal: '2026-07-22', jamMasuk: '', jamPulang: '', status: 'alpha' },
  { id: 'ae9', pegawaiId: 'e1', tanggal: '2026-07-21', jamMasuk: '06:50', jamPulang: '15:30', status: 'hadir' },
  { id: 'ae10', pegawaiId: 'e4', tanggal: '2026-07-21', jamMasuk: '06:35', jamPulang: '14:30', status: 'hadir' },
];
