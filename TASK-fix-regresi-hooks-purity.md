# Task: Fix Regresi Bug — Rules of Hooks & Impure Function During Render

**Konteks:** `npm run lint` sekarang menunjukkan **111 error, 51 warning** — naik drastis dari 0 error sebelumnya. Ini regresi dari 2 kategori bug yang **sama persis pernah diperbaiki minggu lalu**, tapi muncul lagi di file-file baru (Akademik, Inventaris, Perpustakaan, Disposisi) yang dibuat setelah fix sebelumnya. Kemungkinan penyebab: aturan yang sudah disepakati tidak "diingat" saat sesi berikutnya generate halaman baru. Task ini fix regresinya SEKALIGUS bikin aturan ini permanen supaya tidak terulang lagi di halaman berikutnya.

**Prioritas:** tinggi — kedua kategori ini bug fungsional (bisa crash/behavior tidak konsisten saat runtime), bukan cosmetic.

---

## Kategori 1: React Hook dipanggil kondisional (Rules of Hooks)

**Aturan yang wajib diikuti** (sudah pernah diterapkan, sekarang harus ditegakkan ulang di semua file):

```tsx
// ❌ SALAH — hook (useState/useMemo/dst) dipanggil SETELAH early-return guard
const { user } = useAuth();
if (!user) { router.push('/'); return null; }
const [search, setSearch] = useState('');        // ❌ ini jadi dipanggil kondisional

// ✅ BENAR — semua hook di atas, guard paling akhir
const { user } = useAuth();
const [search, setSearch] = useState('');
if (!user) { router.push('/'); return null; }
```

Prinsip: **semua hook** (`useState`, `useMemo`, `useEffect`, `useCallback`, dll) di React/Next.js **wajib dideklarasikan di paling atas komponen, sebelum baris `return` atau `if` apa pun**. Tidak ada pengecualian, termasuk di komponen dalam route dinamis (`[id]/page.tsx`) dan komponen `*Content()` yang dibungkus wrapper.

### File yang wajib diperbaiki (99 error rules-of-hooks):

- [ ] `src/app/akademik/bank-ekstrakurikuler/page.tsx`
- [ ] `src/app/akademik/bank-ekstrakurikuler/pengaturan/[ekstraId]/page.tsx`
- [ ] `src/app/akademik/bank-mapel/page.tsx`
- [ ] `src/app/akademik/bank-mapel/pengaturan/[mapelId]/page.tsx`
- [ ] `src/app/inventaris/inventaris-aset/page.tsx`
- [ ] `src/app/inventaris/laporan/page.tsx`
- [ ] `src/app/inventaris/master-kategori/page.tsx`
- [ ] `src/app/inventaris/mutasi-aset/page.tsx`
- [ ] `src/app/inventaris/persewaan-aset/page.tsx`
- [ ] `src/app/perpustakaan/katalog-buku/page.tsx`
- [ ] `src/app/perpustakaan/sirkulasi/page.tsx`

Untuk tiap file: jalankan `npm run lint` dulu untuk lihat baris persis yang error, lalu pindahkan seluruh deklarasi hook ke atas guard — murni reorder posisi, jangan ubah logic di dalam hook-nya.

---

## Kategori 2: Impure function (`Date.now()` / `new Date()`) dipanggil langsung saat render

React (versi yang dipakai project ini) sekarang menegakkan aturan **komponen harus pure saat render** — memanggil fungsi yang hasilnya berubah tiap kali dipanggil (`Date.now()`, `new Date()`, `Math.random()`) **langsung di badan komponen / di luar event handler** dianggap error, karena bisa menghasilkan ID/nilai yang tidak stabil antar render.

```tsx
// ❌ SALAH — Date.now() dipanggil langsung di badan fungsi/handler yang bisa
// ke-invoke saat render atau menghasilkan nilai beda tiap kali dipanggil ulang
const newK: Kompetensi = {
  id: `komp${Date.now()}`,   // ❌
  ...
};

// ✅ BENAR — generate ID lewat fungsi util yang dipanggil SEKALI saat event
// (misal onClick submit), bukan di alur render, dan idealnya pakai counter/uuid
// yang tidak bergantung waktu sistem sama sekali
function generateId(prefix: string) {
  return `${prefix}${crypto.randomUUID()}`; // atau util ID generator yang sudah ada di project
}
```

### File yang wajib diperbaiki (2 error):

- [ ] `src/app/akademik/bank-mapel/pengaturan/[mapelId]/page.tsx` — baris ~131 (`id: komp${Date.now()}`) dan ~156 (duplicate kompetensi, `Date.now()` dipanggil 3x dalam 1 object literal — bahkan berisiko hasilnya sama karena eksekusi terlalu cepat)
- [ ] `src/app/surat-menyurat/disposisi/page.tsx` — baris ~126 (`tenggatWaktu: ... new Date(Date.now() + 7 * 86400000)...`)

**Solusi yang disarankan:** cek apakah project sudah punya util ID generator (misal di `src/lib/`). Kalau belum, buat satu helper `generateId(prefix: string): string` di `src/lib/utils.ts` yang pakai `crypto.randomUUID()` atau counter, lalu pakai helper itu di semua tempat yang butuh generate ID baru — bukan hanya di 2 file ini, tapi jadi standar untuk semua generator ID ke depannya (SPMB, disposisi, dll yang sudah dibuat sebelumnya juga sebaiknya di-audit pakai pola yang sama).

Untuk kasus tanggal default (`tenggatWaktu` di disposisi), pindahkan perhitungan `new Date(Date.now() + ...)` ke dalam event handler submit (bukan di top-level render/default value), atau hitung sekali via `useMemo`/`useState` init function kalau memang harus konstan selama komponen hidup.

---

## 3. Cegah regresi berulang — update instruksi agent

Supaya aturan ini otomatis terbawa di sesi Copilot berikutnya tanpa perlu diingatkan manual tiap kali, tambahkan section baru di `AGENTS.md` (root project):

```markdown
## Aturan Wajib — React Hooks & Purity

- Semua hook (`useState`, `useMemo`, `useEffect`, `useCallback`, dst) WAJIB dideklarasikan
  di paling atas komponen, SEBELUM baris `if`/`return` apa pun (termasuk auth guard
  `if (!user) return null`). Tidak ada pengecualian.
- JANGAN panggil `Date.now()`, `new Date()`, atau `Math.random()` langsung di badan
  komponen atau di default value/inline object saat render. Panggil hanya di dalam
  event handler (onClick, onSubmit, dst), atau lewat helper `generateId()` di `src/lib/utils.ts`.
- Sebelum menganggap sebuah halaman baru selesai, WAJIB jalankan `npm run lint` dan
  `npx tsc --noEmit` — 0 error sebelum lanjut ke halaman berikutnya.
```

- [ ] Tambahkan section di atas ke `AGENTS.md`

---

## 4. Verifikasi akhir

```bash
npx tsc --noEmit
npm run lint
```

Target: **0 error** di lint (warning `no-unused-vars` boleh dibiarkan, bukan bagian dari task ini). Setelah semua checklist di atas selesai, jalankan lint sekali lagi dan pastikan angka error benar-benar 0, bukan cuma berkurang.
