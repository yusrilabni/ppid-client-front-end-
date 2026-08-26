# 📋 Progress Migrasi: Vue 3 SPA → Nuxt 3 SSR
> **Proyek:** PPID Kabupaten Sinjai — Frontend
> **Repository:** https://github.com/yusrilabni/ppid-client-front-end-
> **Deploy:** Vercel → https://ppid.sinjaikab.go.id
> **Backend:** Laravel → https://ppidkab.sinjaikab.go.id/api/v1
> **Folder kerja:** production_deployment/ppid_client/
> **⚠️ WAJIB update file ini** setiap kali ada perubahan signifikan!

---

## 🧭 Arsitektur Sistem

Browser Pengunjung
      ↓
Vercel (host ppid_client = Nuxt 3 SSR)
      ↓ mengambil data via API
Laravel API (ppidkab.sinjaikab.go.id/api/v1)
      ↓
MySQL Database

**Perbedaan SPA vs SSR:**
- SPA (Vue lama): Browser yang render semua halaman. Server hanya kirim HTML kosong + JS.
- SSR (Nuxt baru): Vercel me-render HTML di server Node.js DULU → baru dikirim ke browser. Lebih cepat & SEO-friendly. Tapi ada ATURAN SSR yang wajib dipatuhi.

---

## ✅ Yang Sudah Dikerjakan

### 1. Migrasi Struktural (Commit: b471722)
- 43 halaman dipindah dari App.vue + router/index.js ke File-Based Routing Nuxt
- Setiap halaman kini punya file .vue sendiri di folder pages/
- Vue Router manual → dihapus, Nuxt otomatis baca folder pages/
- main.js → dihapus, diganti oleh sistem Nuxt
- vite.config.js → dihapus, diganti oleh nuxt.config.ts

### 2. Konfigurasi Tailwind CSS v4 (Commit: 5f40ab8, 3f612c4)
- Problem: @nuxtjs/tailwindcss tidak kompatibel dengan Tailwind CSS v4
- Solusi: Diganti dengan @tailwindcss/postcss + PostCSS native
- File assets/css/index.css dibuat berisi @import "tailwindcss"

### 3. Fix Missing Files (Commit: 5f40ab8)
- composables/useGlobalLoader.js → dibuat ulang
- config/breadcrumbs.js → dibuat ulang dengan format { title, url, icon }

### 4. Fix SSR: localStorage is not defined (Commit: a0f312c)
- Problem: Pinia store akses localStorage saat inisialisasi (jalan di server) → crash 500
- Solusi: Tambahkan helper getLocal() + guard typeof window !== 'undefined'
- File: stores/auth.js, stores/accessibility.js, services/api.js

### 5. Fix Plugin vue-query (Commit: a0f312c)
- Problem: plugins/vue-query.client.ts → suffix .client buat plugin HANYA jalan di browser
  Tapi halaman pakai useQuery() di SSR juga → error "queryClient not found"
- Solusi: Rename ke plugins/vue-query.ts (tanpa .client)

### 6. Load Pustaka via CDN (Commit: 6825d6c, 1c21752)
- Problem: FontAwesome, Swiper, dan Lucide tidak muncul di Vercel
- Solusi: Inject CDN ke nuxt.config.ts → app.head.link dan app.head.script
  - FontAwesome 5.15.4 CSS
  - Swiper v11 CSS + JS
  - Lucide JS

### 7. Fix Layout (layouts/default.vue)
- Problem: Tag penutup </router-view> hilang → halaman tidak render
- Solusi: Ditambahkan kembali

---

## ⚠️ RULES WAJIB SSR (HARUS DIPATUHI SETIAP KALI EDIT KODE!)

Node.js server TIDAK punya: window, document, localStorage, navigator, dll.

### ❌ DILARANG di top-level kode:
```
const token = localStorage.getItem('ppid_token')  // ❌ CRASH!
const width = window.innerWidth                    // ❌ CRASH!
```

### ✅ WAJIB dibungkus:

**Cara 1 - Guard typeof window:**
```js
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('ppid_token')
}
```

**Cara 2 - Dalam onMounted:**
```js
onMounted(() => {
  const token = localStorage.getItem('ppid_token') // aman, hanya di browser
})
```

**Cara 3 - process.client:**
```js
if (process.client) {
  // kode browser-only di sini
}
```

---

## 🔄 Alur Kerja Wajib (Sebelum Push!)

1. Edit file .vue / .js / .ts / nuxt.config.ts
2. Cek: ada akses window/localStorage di luar guard? → perbaiki dulu!
3. npm run build   ← WAJIB test build lokal!
4. node .output/server/index.mjs   ← jalankan server lokal
5. Tes: node -e "fetch('http://localhost:3000').then(r=>r.text()).then(console.log)"
   → Pastikan tidak ada { "statusCode": 500 }
6. git add . && git commit -m "..." && git push origin main
7. Tunggu Vercel deploy → cek https://ppid.sinjaikab.go.id
8. Update file progress_migrasi_vue_ke_nuxt.md ini!

---

## 🗂️ Struktur File Penting

| File/Folder                    | Fungsi                                          |
|-------------------------------|------------------------------------------------|
| nuxt.config.ts                | Konfigurasi utama Nuxt (modul, CDN, PostCSS)   |
| app.vue                       | Root app: <NuxtLayout><NuxtPage/>              |
| layouts/default.vue           | Layout: NavBar + slot halaman + Footer          |
| pages/**/*.vue                | Semua halaman (auto-routing)                   |
| components/**/*.vue           | Komponen reusable (auto-import di Nuxt)        |
| stores/*.js                   | Pinia store (auth, accessibility, loading)     |
| services/api.js               | Axios instance + interceptor auth token        |
| composables/useGlobalLoader.js| Loading state global                           |
| config/breadcrumbs.js         | Definisi breadcrumb semua halaman              |
| plugins/vue-query.ts          | Setup TanStack Query (Vue Query)               |
| assets/css/index.css          | Entry CSS: @import "tailwindcss"               |
| public/                       | File statis (favicon, logo, dll)               |

---

## 🚧 Yang Masih Harus Dikerjakan

### ❗ Prioritas Tinggi:
- [ ] Semua halaman sub-menu kosong di Vercel — hanya beranda yang tampil isinya
      Perlu investigasi: SSR useQuery, routing, atau API tidak terpanggil
- [ ] Fix .gitignore → tambahkan .nuxt/ dan .output/ agar tidak ter-commit

### ⚡ Prioritas Sedang:
- [ ] Verifikasi semua 43 halaman di https://ppid.sinjaikab.go.id:
  - [ ] /profil/pejabat-daerah
  - [ ] /profil/tentang-opd
  - [ ] /profil/unit-lokal
  - [ ] /informasi/berkala
  - [ ] /informasi/setiap-saat
  - [ ] /informasi/serta-merta
  - [ ] /informasi/dikecualikan
  - [ ] /standar-layanan
  - [ ] /laporan/permohonan, /laporan/ppid, /laporan/survei
  - [ ] /search, /galeri, /lhkpn, /regulasi
  - [ ] /permohonan-informasi, /statistik, /tracking
  - [ ] /login, /register, /profile

### 💡 Prioritas Rendah:
- [ ] Migrasi Swiper dari CDN ke npm (import dari paket swiper)
- [ ] Migrasi FontAwesome dari CDN ke npm (@fortawesome/vue-fontawesome)
- [ ] Migrasi Lucide dari CDN ke npm (lucide-vue-next)

---

## 🐛 Bug yang Pernah Ditemui & Solusinya

| Bug                             | Penyebab                                          | Solusi                                               |
|---------------------------------|---------------------------------------------------|------------------------------------------------------|
| localStorage is not defined     | Store akses localStorage di server (inisialisasi) | getLocal() + guard typeof window !== 'undefined'     |
| No queryClient found            | Plugin .client.ts tidak jalan di SSR              | Rename vue-query.client.ts → vue-query.ts            |
| Icon FontAwesome hilang         | Library tidak di-load di <head>                   | Tambah CDN di nuxt.config.ts app.head.link           |
| Slider Swiper tidak jalan       | CSS & JS Swiper tidak di-load                     | Tambah CDN Swiper di nuxt.config.ts                  |
| Icon Lucide hilang              | Lucide tidak di-load                              | Tambah CDN Lucide di nuxt.config.ts app.head.script  |
| Build gagal: Tailwind error     | @nuxtjs/tailwindcss tidak kompatibel Tailwind v4  | Ganti ke @tailwindcss/postcss + PostCSS native       |
| Build gagal: useGlobalLoader    | File composable tidak ada                         | Buat composables/useGlobalLoader.js                  |
| Halaman tidak render            | Tag </router-view> hilang di layouts/default.vue  | Tambahkan tag penutup kembali                        |

---

## 📝 Catatan Penting

1. Backend tetap Laravel — Nuxt HANYA frontend. Data dari ppidkab.sinjaikab.go.id/api/v1
2. Vercel auto-deploy — Setiap git push origin main → Vercel otomatis build & deploy
3. Test lokal DULU sebelum push — Selalu npm run build + test server lokal
4. Jangan commit .nuxt/ dan .output/ — Harus masuk .gitignore
5. Jangan jalankan artisan optimize — Sudah ada larangan dari pemilik proyek

---

Terakhir diupdate: 26 Agustus 2026
