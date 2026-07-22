'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { roleLabels } from '@/data/users';
import { UserRole } from '@/types';

export default function Topbar() {
  const { user, logout, switchRole } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
        setShowRoleSwitch(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">SMA Muhammadiyah 2 Surabaya</h2>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
          {user.roles.map((r) => roleLabels[r]).join(', ')}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifikasi */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.nama.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user.nama}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{user.nama}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              {/* Switch Role */}
              <div className="px-4 py-2">
                <button
                  onClick={() => setShowRoleSwitch(!showRoleSwitch)}
                  className="w-full text-left text-sm text-gray-600 hover:text-blue-600 flex items-center justify-between"
                >
                  <span>🔄 Ganti Role Aktif</span>
                  <svg className={`w-4 h-4 transition-transform ${showRoleSwitch ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showRoleSwitch && (
                  <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                    {user.roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => { switchRole(role); setShowRoleSwitch(false); setShowProfile(false); }}
                        className="w-full text-left px-3 py-1.5 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        {roleLabels[role]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-1 mt-1">
                <button
                  onClick={() => { logout(); setShowProfile(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
