<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Aturan Wajib — React Hooks & Purity

- Semua hook (`useState`, `useMemo`, `useEffect`, `useCallback`, dst) WAJIB dideklarasikan
  di paling atas komponen, SEBELUM baris `if`/`return` apa pun (termasuk auth guard
  `if (!user) return null`). Tidak ada pengecualian.
- JANGAN panggil `Date.now()`, `new Date()`, atau `Math.random()` langsung di badan
  komponen atau di default value/inline object saat render. Panggil hanya di dalam
  event handler (onClick, onSubmit, dst), atau lewat helper `generateId()` di `src/lib/utils.ts`.
- Sebelum menganggap sebuah halaman baru selesai, WAJIB jalankan `npm run lint` dan
  `npx tsc --noEmit` — 0 error sebelum lanjut ke halaman berikutnya.
