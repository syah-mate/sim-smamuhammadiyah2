import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  default: 'bg-gray-100 text-gray-700',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function statusVariant(status: string): BadgeVariant {
  switch (status.toLowerCase()) {
    case 'aktif': case 'lunas': case 'hadir': case 'diterima': case 'selesai': case 'final': case 'baik': case 'kembali':
      return 'success';
    case 'pending': case 'belum': case 'draft': case 'proses': case 'dipinjam': case 'verifikasi':
      return 'warning';
    case 'ditolak': case 'telat': case 'alpha': case 'do': case 'rusak': case 'pindah': case 'keluar':
      return 'danger';
    case 'izin': case 'sakit': case 'cicil':
      return 'info';
    default:
      return 'default';
  }
}
