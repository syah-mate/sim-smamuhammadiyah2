'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

export default function MobileAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      {/* Mobile phone frame container */}
      <div className="flex justify-center py-4">
        <div className="w-full max-w-sm bg-gray-100 rounded-[2.5rem] shadow-xl overflow-hidden border-4 border-gray-800">
          {/* Status bar */}
          <div className="bg-gray-800 text-white flex justify-between items-center px-6 py-2 text-[10px] font-medium">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C17.93 4.07 6.07 4.07 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-6-6l2 2c2.76-2.76 7.24-2.76 10 0l2-2C13.14 8.14 6.86 8.14 3 15z"/></svg>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z"/></svg>
            </div>
          </div>
          {/* Content area */}
          <div className="bg-gray-50 min-h-[700px] max-h-[800px] overflow-y-auto">
            {children}
          </div>
          {/* Home indicator */}
          <div className="bg-gray-800 flex justify-center py-1">
            <div className="w-32 h-1 bg-gray-400 rounded-full" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
