<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-sitemap text-2xl text-blue-600"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Perbarui Sitemap</h1>
        <p class="text-gray-500 mt-2 text-sm">
          Ambil semua data dokumen dari database dan kirim ke sitemap.xml
        </p>
      </div>

      <!-- Status -->
      <div v-if="status" :class="[
        'p-4 rounded-xl mb-6 text-sm font-medium',
        status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
        status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
        'bg-blue-50 text-blue-700 border border-blue-200'
      ]">
        <i :class="[
          'mr-2',
          status.type === 'success' ? 'fas fa-check-circle' :
          status.type === 'error' ? 'fas fa-times-circle' :
          'fas fa-spinner fa-spin'
        ]"></i>
        {{ status.message }}
      </div>

      <!-- Progress Log -->
      <div v-if="progress.length" class="mb-6 space-y-1 max-h-48 overflow-y-auto bg-gray-50 rounded-xl p-4">
        <p v-for="(log, i) in progress" :key="i" class="text-xs text-gray-600 font-mono">{{ log }}</p>
      </div>

      <!-- Stats -->
      <div v-if="stats.total" class="grid grid-cols-3 gap-4 mb-6">
        <div class="text-center p-3 bg-blue-50 rounded-xl">
          <p class="text-2xl font-bold text-blue-600">{{ stats.informasi }}</p>
          <p class="text-xs text-gray-500 mt-1">Informasi</p>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-xl">
          <p class="text-2xl font-bold text-green-600">{{ stats.profil }}</p>
          <p class="text-xs text-gray-500 mt-1">Profil</p>
        </div>
        <div class="text-center p-3 bg-purple-50 rounded-xl">
          <p class="text-2xl font-bold text-purple-600">{{ stats.total }}</p>
          <p class="text-xs text-gray-500 mt-1">Total URL</p>
        </div>
      </div>

      <button
        @click="generateSitemap"
        :disabled="loading"
        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
      >
        <i :class="loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i>
        {{ loading ? 'Sedang memproses...' : 'Buat / Perbarui Sitemap Sekarang' }}
      </button>

      <p class="text-center text-xs text-gray-400 mt-4">
        Setelah selesai, buka
        <a href="/sitemap.xml" target="_blank" class="text-blue-500 underline">/sitemap.xml</a>
        untuk melihat hasilnya.
      </p>

      <!-- Auto-refresh info -->
      <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700 text-center">
        <i class="fas fa-clock mr-1"></i>
        Halaman ini otomatis memperbarui sitemap setiap kali dibuka.
        Tambahkan ke bookmark dan buka sekali sehari/seminggu, atau
        <strong>biarkan terbuka</strong> — auto-refresh tiap 24 jam.
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/services/api'

const loading = ref(false)
const status = ref(null)
const progress = ref([])
const stats = reactive({ informasi: 0, profil: 0, total: 0 })

const log = (msg) => {
  const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  progress.value.push(`[${time}] ${msg}`)
}

const generateSitemap = async () => {
  loading.value = true
  status.value = { type: 'info', message: 'Mengambil data dari database...' }
  progress.value = []
  stats.informasi = 0
  stats.profil = 0
  stats.total = 0

  const urls = []
  const base = 'https://ppid.sinjaikab.go.id'

  try {
    // 1. Ambil Informasi Publik (semua halaman via paginasi)
    log('Mengambil data Informasi Publik...')
    let page = 1
    let hasMore = true
    while (hasMore) {
      const res = await api.get('/informasi', { params: { per_page: 100, page } })
      const payload = res.data?.data || res.data
      const items = Array.isArray(payload) ? payload : (payload?.data || [])
      if (!items.length) { hasMore = false; break }
      items.forEach(item => {
        if (item.slug) urls.push(`${base}/informasi/detail/${item.slug}`)
      })
      stats.informasi += items.length
      log(`  Halaman ${page}: ${items.length} dokumen`)
      if (items.length < 100) hasMore = false
      page++
    }

    // 2. Ambil Profil Pejabat (endpoint: /officials)
    log('Mengambil data Profil Pejabat...')
    try {
      const officialsRes = await api.get('/officials', { params: { per_page: 500 } })
      const officialsPayload = officialsRes.data?.data || officialsRes.data || []
      const officials = Array.isArray(officialsPayload) ? officialsPayload : (officialsPayload?.data || [])
      officials.forEach(item => {
        if (item.slug) {
          urls.push(`${base}/profil/${item.slug}`)
          stats.profil++
        }
      })
      log(`  ${stats.profil} profil pejabat ditemukan`)
    } catch (e) {
      log(`  ⚠️ Profil dilewati: ${e.message}`)
    }

    // 3. Ambil Berita (jika ada)
    log('Mengambil data Berita...')
    try {
      let beritaPage = 1
      let beritaHasMore = true
      let beritaCount = 0
      while (beritaHasMore) {
        const res = await api.get('/berita', { params: { per_page: 100, page: beritaPage } })
        const payload = res.data?.data || res.data
        const items = Array.isArray(payload) ? payload : (payload?.data || [])
        if (!items.length) { beritaHasMore = false; break }
        items.forEach(item => {
          if (item.slug) { urls.push(`${base}/berita/${item.slug}`); beritaCount++ }
        })
        if (items.length < 100) beritaHasMore = false
        beritaPage++
      }
      log(`  ${beritaCount} berita ditemukan`)
    } catch (e) {
      log(`  ⚠️ Berita dilewati: ${e.message}`)
    }

    stats.total = urls.length
    log(`Total: ${urls.length} URL berhasil dikumpulkan`)

    // 4. Kirim ke server Nuxt dalam batch kecil 50 URL
    log('Mengirim data ke server sitemap (batch 50 URL)...')
    status.value = { type: 'info', message: `Mengirim ${urls.length} URL dalam batch...` }

    const CHUNK_SIZE = 50
    for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
      const chunk = urls.slice(i, i + CHUNK_SIZE)
      const isFirst = i === 0
      const pushRes = await $fetch('/api/sitemap-push', {
        method: 'POST',
        body: { urls: chunk, reset: isFirst } // reset hanya di batch pertama
      })
      if (!pushRes.success) throw new Error(pushRes.message)
      log(`  Batch ${Math.floor(i/CHUNK_SIZE)+1}/${Math.ceil(urls.length/CHUNK_SIZE)}: ${pushRes.total} URL tersimpan`)
    }

    status.value = { type: 'success', message: `✅ Sitemap diperbarui! ${urls.length} URL berhasil dikirim` }
    log('✅ Sitemap berhasil diperbarui!')
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('sitemap_last_update', new Date().toISOString())
    }

  } catch (err) {
    log(`❌ Error: ${err.message}`)
    // Jika sudah ada data parsial, tetap submit
    if (urls.length > 0) {
      log(`Tetap mengirim ${urls.length} URL yang sudah berhasil dikumpulkan...`)
      try {
        await $fetch('/api/sitemap-push', { method: 'POST', body: { urls } })
        stats.total = urls.length
        status.value = { type: 'success', message: `✅ Sitemap diperbarui dengan ${urls.length} URL (parsial)` }
        log('✅ Sitemap berhasil diperbarui (parsial)!')
      } catch (e2) {
        status.value = { type: 'error', message: `Gagal: ${e2.message}` }
      }
    } else {
      status.value = { type: 'error', message: `Gagal: ${err.message}` }
    }
  } finally {
    loading.value = false
  }
}

// Auto-run saat halaman dibuka
onMounted(() => {
  // Cek apakah sudah diupdate dalam 24 jam terakhir
  const lastUpdate = localStorage.getItem('sitemap_last_update')
  if (lastUpdate) {
    const diffHours = (Date.now() - new Date(lastUpdate).getTime()) / 3600000
    if (diffHours < 24) {
      status.value = { type: 'success', message: `Sitemap masih fresh (terakhir update ${Math.round(diffHours)} jam lalu). Klik tombol untuk paksa update.` }
      return
    }
  }
  // Auto-generate jika belum update atau sudah > 24 jam
  generateSitemap()
})
</script>
