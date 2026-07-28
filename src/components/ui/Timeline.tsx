'use client';

import React from 'react';

export interface TimelineEntry {
  id: string;
  timestamp: string;
  actor: string;   // nama / identifier
  action: string;  // label aksi
  catatan?: string;
  actionColor?: string; // tailwind bg color class
}

interface TimelineProps {
  entries: TimelineEntry[];
  emptyMessage?: string;
}

const actionIcons: Record<string, string> = {
  dibuat: '📝',
  dibaca: '👁️',
  diproses: '🔄',
  diteruskan: '↗️',
  komentar: '💬',
  disetujui: '✅',
  ditolak: '❌',
  selesai: '🏁',
};

const defaultColors: Record<string, string> = {
  dibuat: 'bg-blue-500',
  dibaca: 'bg-gray-400',
  diproses: 'bg-yellow-500',
  diteruskan: 'bg-purple-500',
  komentar: 'bg-indigo-400',
  disetujui: 'bg-green-500',
  ditolak: 'bg-red-500',
  selesai: 'bg-emerald-500',
};

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export default function Timeline({ entries, emptyMessage = 'Belum ada aktivitas' }: TimelineProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">{emptyMessage}</p>;
  }

  return (
    <div className="relative pl-8 space-y-0">
      {entries.map((entry, idx) => {
        const icon = actionIcons[entry.action] || '•';
        const dotColor = entry.actionColor || defaultColors[entry.action] || 'bg-gray-400';
        const isLast = idx === entries.length - 1;

        return (
          <div key={entry.id} className="relative pb-5">
            {/* Garis vertikal */}
            {!isLast && (
              <div className="absolute left-[-1.35rem] top-6 bottom-0 w-0.5 bg-gray-200" />
            )}
            {/* Dot */}
            <div className={`absolute left-[-1.75rem] top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${dotColor} text-white shadow-sm`}>
              {icon}
            </div>
            {/* Konten */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-800">{entry.actor}</span>
                <span className="text-xs text-gray-400">—</span>
                <span className="text-xs font-medium text-gray-500 uppercase">{entry.action}</span>
              </div>
              {entry.catatan && (
                <p className="text-sm text-gray-600">{entry.catatan}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{formatDateTime(entry.timestamp)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
