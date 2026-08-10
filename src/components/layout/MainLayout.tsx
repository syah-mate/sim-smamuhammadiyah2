'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '@/context/AuthContext';
import { isPathAllowed } from '@/lib/access';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // Show nothing while checking auth / redirecting
  if (!user) {
    return null;
  }

  // Route-level access check
  const allowed = isPathAllowed(pathname, user.roles);

  if (!allowed) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
        >
          <Topbar />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🚫</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h1>
              <p className="text-gray-500 mb-6">
                Anda tidak memiliki izin untuk mengakses halaman ini.
                Silakan hubungi administrator jika Anda merasa ini kesalahan.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Topbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
