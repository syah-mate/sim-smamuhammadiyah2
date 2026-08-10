import { UserRole } from '@/types';

/**
 * Route prefix → roles that can access those routes.
 * Order matters: first match wins. More specific prefixes should come first.
 */
const routeRoleMap: { prefix: string; roles: UserRole[] }[] = [
  // Dashboard — all authenticated users
  { prefix: '/dashboard', roles: [] },

  // Akademik
  { prefix: '/akademik', roles: ['super_admin', 'akademik'] },

  // Kesiswaan
  { prefix: '/kesiswaan', roles: ['super_admin', 'kesiswaan'] },

  // Bimbingan Konseling → kesiswaan
  { prefix: '/bimbingan-konseling', roles: ['super_admin', 'kesiswaan'] },

  // Kepegawaian
  { prefix: '/kepegawaian', roles: ['super_admin', 'kepegawaian'] },

  // Presensi: siswa → kesiswaan, pegawai → kepegawaian
  { prefix: '/presensi/presensi-siswa', roles: ['super_admin', 'kesiswaan'] },
  { prefix: '/presensi/presensi-pegawai', roles: ['super_admin', 'kepegawaian'] },
  // Fallback for any other /presensi/... paths
  { prefix: '/presensi', roles: ['super_admin', 'kesiswaan', 'kepegawaian'] },

  // Keuangan
  { prefix: '/keuangan', roles: ['super_admin', 'keuangan'] },

  // SPMB — admin restricted to spmb & super_admin only
  { prefix: '/spmb/admin', roles: ['super_admin', 'spmb'] },
  // SPMB — pendaftaran & pengisian data: spmb, pendaftar_spmb, super_admin
  { prefix: '/spmb', roles: ['super_admin', 'spmb', 'pendaftar_spmb'] },

  // Surat Menyurat / Disposisi → sekretariat
  { prefix: '/surat-menyurat', roles: ['super_admin', 'sekretariat'] },

  // Inventaris → sarpras
  { prefix: '/inventaris', roles: ['super_admin', 'sarpras'] },

  // Perpustakaan
  { prefix: '/perpustakaan', roles: ['super_admin', 'perpustakaan'] },

  // Pengaturan → super_admin only
  { prefix: '/pengaturan', roles: ['super_admin'] },

  // Ismuba → super_admin & ismuba
  { prefix: '/ismuba', roles: ['super_admin', 'ismuba'] },

  // Mobile App Siswa → super_admin & mobile_siswa
  { prefix: '/mobile-app-siswa', roles: ['super_admin', 'mobile_siswa'] },
];

/**
 * Check whether a user with the given roles can access a path.
 * - If user has `super_admin` role → always allowed (except when explicitly denied).
 * - Uses first-match on route prefix.
 * - An empty roles array means "any authenticated user can access".
 */
export function isPathAllowed(pathname: string, userRoles: UserRole[]): boolean {
  // Super admin can access everything
  if (userRoles.includes('super_admin')) return true;

  // Find the matching route prefix
  const match = routeRoleMap.find((entry) => pathname.startsWith(entry.prefix));
  if (!match) {
    // No mapping defined → allow by default (e.g., /api/, /_next/, static files)
    return true;
  }

  // Empty roles array → any authenticated user
  if (match.roles.length === 0) return true;

  // Check if user has at least one of the required roles
  return userRoles.some((r) => match.roles.includes(r));
}

/**
 * Get the route-role mapping for external use (e.g., debugging).
 */
export function getRouteRoleMap() {
  return routeRoleMap;
}
