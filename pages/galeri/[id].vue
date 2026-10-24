<template>
  <div class="galeri-detail-page bg-gray-50 min-h-screen">
    <div class="container mx-auto py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <Breadcrumbs :breadcrumbs="breadcrumbData" class="mb-6" />

        <div v-if="pending || clientLoading" class="bg-white rounded-xl shadow-lg p-12 text-center">
          <p class="text-gray-500">Memuat foto...</p>
        </div>

        <div v-else-if="!item" class="bg-white rounded-xl shadow-lg p-12 text-center">
          <i class="fas fa-image text-gray-300 text-6xl mb-4"></i>
          <h1 class="text-lg font-medium text-gray-900 mb-2">Foto Tidak Ditemukan</h1>
          <p class="text-gray-500 mb-6">Foto Galeri yang Anda cari tidak tersedia.</p>
          <NuxtLink to="/galeri" class="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-full shadow-md hover:bg-blue-700 font-semibold text-sm">
            Kembali ke Galeri
          </NuxtLink>
        </div>

        <article v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
          <img v-if="isFoto" :src="imageUrl" :alt="item.title" class="w-full h-auto object-contain bg-gray-100" />
          <div v-else class="w-full bg-gray-100 flex items-center justify-center py-16">
            <a v-if="item.video" :href="item.video" target="_blank" rel="noopener" class="text-blue-600 font-semibold underline">Buka Video</a>
            <i v-else class="fas fa-video text-5xl text-gray-400"></i>
          </div>
          <div class="p-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ item.title }}</h1>
            <p v-if="item.description" class="text-gray-600 mb-4">{{ item.description }}</p>
            <p v-if="item.category" class="mb-4">
              <span class="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{{ item.category }}</span>
            </p>
            <p v-if="item.tanggal_upload" class="text-sm text-gray-500 mb-4">Tanggal upload: {{ item.tanggal_upload }}</p>
            <div v-if="isFoto" class="flex flex-wrap gap-2 mb-4">
              <a :href="imageUrl" target="_blank" rel="noopener" class="inline-flex items-center bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-md hover:bg-emerald-700 font-semibold text-sm">
                Buka Link Foto
              </a>
              <a :href="`${api.defaults.baseURL}/galeri/${item.id}/download`" target="_blank" rel="noopener" class="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-full shadow-md hover:bg-blue-700 font-semibold text-sm">
                Download Asli (JPG)
              </a>
              <NuxtLink to="/galeri" class="inline-flex items-center bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-full shadow-sm hover:bg-gray-50 font-semibold text-sm">
                Kembali ke Galeri
              </NuxtLink>
            </div>
            <p v-if="isFoto" class="text-xs text-gray-500 break-all" style="word-break:break-all;user-select:text;">{{ imageUrl }}</p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import api, { getStorageUrl } from '@/services/api'
import { encodeGaleriId, decodeGaleriHash } from '@/utils/galeriHash'

const route = useRoute()
const rawParam = computed(() => String(route.params.id || ''))
const isNumericParam = computed(() => /^\d+$/.test(rawParam.value))
// Param bisa hash (link baru) atau id numerik mentah (link lama).
// Link lama di-redirect ke hash di bawah, sebelum fetch/render.
const resolvedId = computed(() => {
  if (isNumericParam.value) return Number(rawParam.value)
  return decodeGaleriHash(rawParam.value)
})
const hashParam = computed(() => (resolvedId.value ? encodeGaleriId(resolvedId.value) : null))
if (isNumericParam.value && hashParam.value) {
  await navigateTo(`/galeri/${hashParam.value}`, { replace: true, redirectCode: 301 })
}

// API Galeri tidak punya endpoint per-id (GET /galeri/{id} = 404) dan
// list-nya paginasi (12/halaman), jadi pindai halaman list sampai id ketemu.
const fetchItem = async (id) => {
  for (let page = 1; page <= 10; page++) {
    const res = await api.get('/galeri', { params: { page } })
    const payload = res.data || {}
    const list = payload.data || []
    const found = list.find((x) => String(x.id) === id)
    if (found) return found
    if (!payload.next_page_url) break
  }
  return null
}

// Dijalankan lewat useAsyncData agar ikut SSR dan dibaca crawler.
// CATATAN INFRASTRUKTUR: fetch SSR berjalan dari server Vercel (egress luar
// negeri) yang diblokir firewall backend — terbukti proxy sitemap Vercel 502
// padahal endpoint sitemap backend 200 dari jaringan server. Karena itu,
// bila SSR gagal, halaman mengambil ulang dari browser pengguna (yang
// jaringannya bisa mencapai API backend) lewat onMounted di bawah.
const { data: item, pending } = await useAsyncData(
  () => `galeri-detail-${resolvedId.value ?? 'invalid'}`,
  () => fetchItem(resolvedId.value ? String(resolvedId.value) : '')
)

const clientLoading = ref(false)
onMounted(async () => {
  if (!item.value) {
    clientLoading.value = true
    try {
      item.value = await fetchItem(resolvedId.value ? String(resolvedId.value) : '')
    } catch (e) {
      // Biarkan state "Tidak Ditemukan" tampil; error sudah dicatat di console.
      console.error('Gagal memuat detail Galeri dari browser:', e)
    } finally {
      clientLoading.value = false
    }
  }
})

const isFoto = computed(() => !item.value || item.value.type === 'foto' || !item.value.type)
const imageUrl = computed(() => (item.value ? getStorageUrl(item.value.image) : ''))
const detailUrl = computed(() => (hashParam.value ? `https://ppid.sinjaikab.go.id/galeri/${hashParam.value}` : 'https://ppid.sinjaikab.go.id/galeri'))
const pageTitle = computed(() => (item.value ? `${item.value.title} | PPID Kabupaten Sinjai` : 'Galeri Tidak Ditemukan | PPID Kabupaten Sinjai'))
const pageDescription = computed(() => item.value?.description || item.value?.title || 'Galeri PPID Kabupaten Sinjai')

// Meta per foto: og:image HARUS URL berkas foto itu sendiri, bukan logo.
// useSeoMeta menimpa og:image/twitter:image default dari nuxt.config.
useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: () => item.value?.title || 'Galeri PPID Kabupaten Sinjai',
  ogDescription: pageDescription,
  ogImage: imageUrl,
  ogType: 'article',
  ogUrl: detailUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: () => item.value?.title || 'Galeri PPID Kabupaten Sinjai',
  twitterDescription: pageDescription,
  twitterImage: imageUrl
})

useHead(() => ({ link: [{ rel: 'canonical', href: detailUrl.value }] }))

const breadcrumbData = computed(() => [
  { title: 'Beranda', url: '/', icon: 'fas fa-home' },
  { title: 'Galeri', url: '/galeri', icon: 'fas fa-images' },
  { title: item.value?.title || 'Detail Foto' }
])
</script>
