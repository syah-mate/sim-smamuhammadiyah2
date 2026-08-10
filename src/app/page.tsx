'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

function LoginContent() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Username atau password salah');
    }
  };

  const quickLogins = [
    { label: 'Super Admin', username: 'superadmin', password: 'superadmin123' },
    { label: 'Bag. Akademik', username: 'akademik', password: 'akademik123' },
    { label: 'Bag. Kesiswaan', username: 'kesiswaan', password: 'kesiswaan123' },
    { label: 'Bag. Kepegawaian', username: 'kepegawaian', password: 'kepegawaian123' },
    { label: 'Bag. Keuangan', username: 'keuangan', password: 'keuangan123' },
    { label: 'Bag. Sarpras', username: 'sarpras', password: 'sarpras123' },
    { label: 'Bag. Sekretariat', username: 'sekretariat', password: 'sekretariat123' },
    { label: 'Bag. Perpustakaan', username: 'perpustakaan', password: 'perpustakaan123' },
    { label: 'Bag. SPMB', username: 'spmb', password: 'spmb123' },
    { label: 'Pendaftar SPMB', username: 'pendaftar', password: 'pendaftar123' },
    { label: 'Bag. Ismuba', username: 'ismuba', password: 'ismuba123' },
    { label: 'Mobile Siswa', username: 'mobilesiswa', password: 'mobilesiswa123' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-2xl font-bold text-blue-600">SM</span>
          </div>
          <h1 className="text-2xl font-bold text-white">SIM</h1>
          <p className="text-blue-200 text-sm">Sistem Informasi Manajemen</p>
          <p className="text-white font-medium mt-1">SMA Muhammadiyah 2 Surabaya</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Masukkan username"
                autoComplete="username"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Masukkan password"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Masuk
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              {showHint ? 'Sembunyikan' : 'Tampilkan'} daftar akun demo
            </button>
            {showHint && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {quickLogins.map((ql) => (
                  <button
                    key={ql.username}
                    onClick={() => { setUsername(ql.username); setPassword(ql.password); }}
                    className="text-left px-2.5 py-1.5 bg-gray-50 rounded-lg text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <span className="font-medium block">{ql.label}</span>
                    <span className="text-gray-400">{ql.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-6">
          Prototype — SMA Muhammadiyah 2 Surabaya © 2026
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginContent />;
}
