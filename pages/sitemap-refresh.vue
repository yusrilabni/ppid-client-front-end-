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

      <!-- Progress -->
      <div v-if="progress.length" class="mb-6 space-y-1 max-h-48 overflow-y-auto bg-gray-50 rounded-xl p-4">
        <p v-for="(log, i) in progress" :key="i" class="text-xs text-gray-600">{{ log }}</p>
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
    </div>
  </div>
</template>

<script setup>
import api from '@/services/api'

const loading = ref(false)
const status = ref(null)
const progress = ref([])
const stats = reactive({ informasi: 0, profil: 0, total: 0 })

const log = (msg) => progress.value.push(`[${new Date().toLocaleTimeString('id-ID')}] ${msg}`)

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
    // 1. Ambil Informasi Publik (semua halaman)
    log('Mengambil data Informasi Publik...')
    let page = 1
    let hasMore = true
    while (hasMore) {
      const res = await api.get('/informasi', { params: { per_page: 100, page } })
      const data = res.data?.data || res.data
      const items = Array.isArray(data) ? data : (data?.data || [])
      if (!items.length) { hasMore = false; break }
      items.forEach(item => {
        if (item.slug) urls.push(`${base}/informasi/detail/${item.slug}`)
      })
      stats.informasi += items.length
      log(`  Halaman ${page}: ${items.length} dokumen`)
      if (items.length < 100) hasMore = false
      page++
    }

    // 2. Ambil Profil Pejabat
    log('Mengambil data Profil Pejabat...')
    const profilRes = await api.get('/pejabat', { params: { per_page: 500 } })
    const profilData = profilRes.data?.data || profilRes.data || []
    const profilItems = Array.isArray(profilData) ? profilData : (profilData?.data || [])
    profilItems.forEach(item => {
      if (item.slug) {
        urls.push(`${base}/profil/${item.slug}`)
        stats.profil++
      }
    })
    log(`  ${stats.profil} profil pejabat ditemukan`)

    stats.total = urls.length
    log(`Total: ${urls.length} URL berhasil dikumpulkan`)

    // 3. Kirim ke server Nuxt untuk disimpan
    log('Mengirim data ke server sitemap...')
    status.value = { type: 'info', message: `Menyimpan ${urls.length} URL ke sitemap...` }
    
    const pushRes = await $fetch('/api/sitemap-push', {
      method: 'POST',
      body: { urls }
    })

    if (pushRes.success) {
      status.value = { type: 'success', message: `✅ ${pushRes.message}` }
      log('Sitemap berhasil diperbarui!')
    } else {
      throw new Error(pushRes.message)
    }

  } catch (err) {
    log(`Error: ${err.message}`)
    status.value = { type: 'error', message: `Gagal: ${err.message}` }
  } finally {
    loading.value = false
  }
}
</script>
