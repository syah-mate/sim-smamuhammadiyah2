'use client';

import React, { useState } from 'react';
import { Badge, statusVariant } from './Badge';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchKeys?: string[];
  onSearch?: (query: string) => T[];
  pageSize?: number;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  searchPlaceholder = 'Cari...',
  searchKeys,
  onSearch,
  pageSize = 10,
  actions,
  emptyMessage = 'Tidak ada data',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const hasSearch = !!((searchKeys && searchKeys.length > 0) || onSearch);
  const filtered = onSearch
    ? onSearch(search)
    : (searchKeys && searchKeys.length > 0)
    ? data.filter((item) =>
        searchKeys.some((key) => {
          const val = (item as Record<string, unknown>)[key];
          return val && String(val).toLowerCase().includes(search.toLowerCase());
        })
      )
    : data;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      {/* Search */}
      {hasSearch && (
      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 w-10">#</th>
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 text-left font-semibold text-gray-600 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right font-semibold text-gray-600 w-24">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1 + (actions ? 1 : 0)} className="px-4 py-12 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((item, idx) => (
                <tr key={keyExtractor(item)} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * pageSize + idx + 1}</td>
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                      {col.render
                        ? col.render(item)
                        : item[col.key] != null
                        ? String(item[col.key])
                        : '-'}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">{actions(item)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <p className="text-gray-500">
            Menampilkan {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} dari {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              ← Prev
            </button>
            <span className="px-3 py-1.5 text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function StatusCell({ status }: { status: string }) {
  return <Badge variant={statusVariant(status)}>{status}</Badge>;
}
