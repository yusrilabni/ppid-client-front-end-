<script setup>
import { ref, onMounted, onUpdated, nextTick, watch } from 'vue'
import api, { getStorageUrl } from '@/services/api'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useAuthStore } from '@/stores/auth'
import { useQuery } from '@tanstack/vue-query'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const authStore = useAuthStore()
const homeData = ref({
  sliders: [],
  latest_informasi: [],
  gallery: [],
  statistics: {}
})

// Contact form state
const contactMethod = ref('email')
const isSending = ref(false)
const formMessage = ref('')
const formMessageType = ref('success') // 'success' or 'error'
const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})
const fieldErrors = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// Automatically re-render icons when DOM updates
onUpdated(() => {
  if (window.lucide) {
    window.lucide.createIcons()
  }
})

const clearFieldError = (field) => {
  fieldErrors.value[field] = ''
}

const submitContactForm = async () => {
  // Clear previous errors and messages
  fieldErrors.value = { name: '', email: '', subject: '', message: '' }
  formMessage.value = ''

  // Basic validation
  let isValid = true
  if (!contactForm.value.name.trim()) {
    fieldErrors.value.name = 'Nama lengkap harus diisi'
    isValid = false
  }
  if (!contactForm.value.email.trim()) {
    fieldErrors.value.email = 'Email harus diisi'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.value.email)) {
    fieldErrors.value.email = 'Format email tidak valid'
    isValid = false
  }
  if (!contactForm.value.subject.trim()) {
    fieldErrors.value.subject = 'Subjek harus diisi'
    isValid = false
  }
  if (!contactForm.value.message.trim()) {
    fieldErrors.value.message = 'Pesan harus diisi'
    isValid = false
  }
  if (!isValid) return

  isSending.value = true

  try {
    const { name, email, subject, message } = contactForm.value

    if (contactMethod.value === 'email') {
      const recipient = 'ppidkabsinjai@gmail.com'
      const mailBody = `Saya ${name}, dengan email ${email}, ingin menyampaikan: ${message}`
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`
      window.open(gmailUrl, '_blank')
      formMessage.value = 'Membuka Gmail... Pesan Anda telah disiapkan.'
      formMessageType.value = 'success'
    } else {
      const waNumber = '6285156878911'
      const waMessage = `*Pesan Baru dari Website PPID*\n\n*Nama:* ${name}\n*Email:* ${email}\n*Subjek:* ${subject}\n\n*Pesan:*\n${message}`
      const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(waMessage)}`
      window.open(waUrl, '_blank')
      formMessage.value = 'Membuka WhatsApp... Pesan Anda telah disiapkan.'
      formMessageType.value = 'success'
    }

    contactForm.value = { name: '', email: '', subject: '', message: '' }
    setTimeout(() => { formMessage.value = '' }, 5000)
  } catch (error) {
    console.error('Error:', error)
    formMessage.value = 'Terjadi kesalahan saat menyiapkan pesan.'
    formMessageType.value = 'error'
  } finally {
    isSending.value = false
  }
}

const rss_items = ref([])

const initSwiper = () => {
  nextTick(() => {
    if (window.lucide) {
      window.lucide.createIcons()
    }
    if (window.Swiper) {
      const isMultiple = homeData.value.sliders?.length > 1;
      new window.Swiper('.hero-slider', {
        loop: isMultiple,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        autoplay: isMultiple ? { 
          delay: 5000, 
          disableOnInteraction: false 
        } : false,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }
      })
      new window.Swiper('.latest-info-carousel', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 20,
        loop: true,
        observer: true,
        observeParents: true,
        breakpoints: {
          640: { slidesPerView: 2, slidesPerGroup: 2 },
          1024: { slidesPerView: 4, slidesPerGroup: 4 }
        },
        navigation: { nextEl: '.latest-info-next', prevEl: '.latest-info-prev' },
        pagination: { el: '.latest-info-pagination', clickable: true }
      })
      new window.Swiper('.news-carousel', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 20,
        loop: true,
        observer: true,
        observeParents: true,
        breakpoints: {
          640: { slidesPerView: 2, slidesPerGroup: 2 },
          1024: { slidesPerView: 4, slidesPerGroup: 4 }
        },
        navigation: { nextEl: '.news-button-next', prevEl: '.news-button-prev' },
        pagination: { el: '.swiper-pagination', clickable: true }
      })
    }
  })
}


const { isLoading: loading, data: queryData, isFetching, isError, refetch } = useQuery({
  queryKey: ['home_data'],
  queryFn: async () => {
    const res = await api.get('/home')
    return res.data.data
  }
})

useGlobalLoader(loading)

const fetchRSS = async () => {
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://humas.sinjaikab.go.id/v1/rss')}`)
    if (res.ok) {
      const json = await res.json()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(json.contents, 'text/xml')
      const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 10)
      
      rss_items.value = items.map(item => {
        const title = item.querySelector('title')?.textContent || ''
        const link = item.querySelector('link')?.textContent || '#'
        const pubDate = item.querySelector('pubDate')?.textContent || ''
        let image = ''
        const enclosure = item.querySelector('enclosure')
        if (enclosure && enclosure.getAttribute('url')) {
          image = enclosure.getAttribute('url')
        } else {
          // Coba cari tag dengan namespace media:content atau media:thumbnail
          const mediaContent = item.getElementsByTagName('media:content')[0] || item.getElementsByTagNameNS('*', 'content')[0]
          if (mediaContent && mediaContent.getAttribute('url')) {
            image = mediaContent.getAttribute('url')
          } else {
            const mediaThumb = item.getElementsByTagName('media:thumbnail')[0] || item.getElementsByTagNameNS('*', 'thumbnail')[0]
            if (mediaThumb && mediaThumb.getAttribute('url')) {
              image = mediaThumb.getAttribute('url')
            }
          }
        }
        
        return {
          title,
          link,
          pubDate,
          image
        }
      })
    }
  } catch (error) {
    console.error('Gagal mengambil RSS Humas Sinjai:', error)
  }
}

watch([queryData, loading], ([newData, newLoading]) => {
  if (newData) {
    homeData.value = newData
  }
  
  if (!newLoading && newData) {
    fetchRSS().then(() => {
      nextTick(() => {
        initSwiper()
      })
    })
  }
}, { immediate: true })

const formatDate = (dateString) => {
  if (!dateString) return 'Terbaru'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date)
  } catch (e) {
    return dateString
  }
}

const getCategoryColor = (category, type) => {
  const map = {
    'Informasi Berkala': { border: 'border-blue-500', text: 'text-blue-50', badge: 'bg-blue-50 text-blue-600', bg50: 'bg-blue-50', text600: 'text-blue-600', border100: 'border-blue-100' },
    'Informasi Setiap Saat': { border: 'border-green-500', text: 'text-green-50', badge: 'bg-green-50 text-green-600', bg50: 'bg-green-50', text600: 'text-green-600', border100: 'border-green-100' },
    'Informasi Serta Merta': { border: 'border-yellow-500', text: 'text-yellow-50', badge: 'bg-yellow-50 text-yellow-600', bg50: 'bg-yellow-50', text600: 'text-yellow-600', border100: 'border-yellow-100' },
    'Informasi Dikecualikan': { border: 'border-red-500', text: 'text-red-50', badge: 'bg-red-50 text-red-600', bg50: 'bg-red-50', text600: 'text-red-600', border100: 'border-red-100' },
  }
  const defaultColors = { border: 'border-gray-500', text: 'text-gray-50', badge: 'bg-gray-50 text-gray-600', bg50: 'bg-gray-50', text600: 'text-gray-600', border100: 'border-gray-100' }
  return (map[category] || defaultColors)[type]
}

const getCardTheme = (category) => {
  const themes = {
    'Informasi Berkala': { border: 'border-blue-500', text50: 'text-blue-50', bg50Hover: 'group-hover/card:bg-blue-50', text600Hover: 'group-hover/card:text-blue-600', btnBgHover: 'hover:bg-blue-50', btnTextHover: 'hover:text-blue-600', bg600Hover: 'hover:bg-blue-600' },
    'Informasi Setiap Saat': { border: 'border-green-500', text50: 'text-green-50', bg50Hover: 'group-hover/card:bg-green-50', text600Hover: 'group-hover/card:text-green-600', btnBgHover: 'hover:bg-green-50', btnTextHover: 'hover:text-green-600', bg600Hover: 'hover:bg-green-600' },
    'Informasi Serta Merta': { border: 'border-yellow-500', text50: 'text-yellow-50', bg50Hover: 'group-hover/card:bg-yellow-50', text600Hover: 'group-hover/card:text-yellow-600', btnBgHover: 'hover:bg-yellow-50', btnTextHover: 'hover:text-yellow-600', bg600Hover: 'hover:bg-yellow-600' },
    'Informasi Dikecualikan': { border: 'border-red-500', text50: 'text-red-50', bg50Hover: 'group-hover/card:bg-red-50', text600Hover: 'group-hover/card:text-red-600', btnBgHover: 'hover:bg-red-50', btnTextHover: 'hover:text-red-600', bg600Hover: 'hover:bg-red-600' }
  }
  return themes[category] || { border: 'border-gray-500', text50: 'text-gray-50', bg50Hover: 'group-hover/card:bg-gray-50', text600Hover: 'group-hover/card:text-gray-600', btnBgHover: 'hover:bg-gray-50', btnTextHover: 'hover:text-gray-600', bg600Hover: 'hover:bg-gray-600' }
}

const getColorStyles = (color, type) => {
  const map = {
    'blue': { bg500: 'bg-blue-500', text600: 'text-blue-600', text500: 'text-blue-500', from500: 'from-blue-500', bgGradient: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    'green': { bg500: 'bg-green-500', text600: 'text-green-600', text500: 'text-green-500', from500: 'from-green-500', bgGradient: 'bg-gradient-to-br from-green-500 to-green-600' },
    'yellow': { bg500: 'bg-yellow-500', text600: 'text-yellow-600', text500: 'text-yellow-500', from500: 'from-yellow-500', bgGradient: 'bg-gradient-to-br from-yellow-400 to-yellow-500' },
    'red': { bg500: 'bg-red-500', text600: 'text-red-600', text500: 'text-red-500', from500: 'from-red-500', bgGradient: 'bg-gradient-to-br from-red-500 to-red-600' },
  }
  return map[color]?.[type] || ''
}

const formatNumber = (num) => {
  return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0'
}

const getUnitName = (info) => {
  if (info.organization_name) return info.organization_name
  if (info.unit) return info.unit.nama
  if (info.user && info.user.opd_name) return info.user.opd_name
  return 'Unit Kerja'
}

const getUploaderName = (info) => {
  return info.user ? info.user.name : 'Administrator'
}

const informasiItems = [
  {
    title: 'Informasi Berkala',
    url: '/informasi/berkala',
    icon: 'calendar',
    color: 'blue',
    points: [
      'Profil badan publik dan unit kerja',
      'Profil pejabat dan tentang OPD',
      'Program dan kegiatan yang diumumkan rutin',
      'Ringkasan laporan kinerja dan keuangan',
      'Informasi layanan publik dan jam pelayanan',
    ]
  },
  {
    title: 'Informasi Setiap Saat',
    url: '/informasi/setiap-saat',
    icon: 'clock',
    color: 'green',
    points: [
      'Dokumen administratif dan arsip resmi',
      'SOP, SK, dan kebijakan internal',
      'Dokumen pendukung pelaksanaan kegiatan',
      'Data dan dokumen yang diberikan jika diminta',
      'Arsip dokumen tahun berjalan dan sebelumnya',
    ]
  },
  {
    title: 'Informasi Serta Merta',
    url: '/informasi/serta-merta',
    icon: 'zap',
    color: 'yellow',
    points: [
      'Informasi bencana alam',
      'Informasi keadaan darurat',
      'Gangguan layanan publik berdampak luas',
      'Ancaman terhadap keselamatan masyarakat',
      'Kebijakan darurat yang harus segera diketahui',
    ]
  },
  {
    title: 'Informasi Dikecualikan',
    url: '/informasi/dikecualikan',
    icon: 'shield-alert',
    color: 'red',
    points: [
      'Informasi yang mengandung data pribadi',
      'Informasi rahasia negara atau jabatan',
      'Dokumen hukum yang masih berjalan',
      'Informasi yang berpotensi merugikan pihak tertentu',
      'Informasi yang ditetapkan melalui uji konsekuensi',
    ]
  }
]
</script>

<template>
  <div class="home-page">
    <!-- Error State -->
    <div v-if="isError" class="w-full min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md w-full">
        <i data-lucide="alert-circle" class="w-16 h-16 text-red-500 mx-auto mb-4"></i>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h3>
        <p class="text-gray-500 mb-6">Terjadi kesalahan saat mengambil data dari server. Silakan coba lagi.</p>
        <button @click="refetch()" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors inline-flex items-center">
          <i data-lucide="refresh-cw" class="w-4 h-4 mr-2"></i>
          Coba Lagi
        </button>
      </div>
    </div>

    <div v-else-if="!loading">
      <div v-if="homeData.sliders && homeData.sliders.length > 0" class="swiper hero-slider relative w-full overflow-hidden">
        <div class="swiper-wrapper">
          <div v-for="slider in homeData.sliders" :key="slider.id" class="swiper-slide relative">
            <router-link :to="slider.link || (slider.informasi ? `/informasi/${slider.informasi.slug}` : '#')" class="block w-full h-full">
              <img :src="getStorageUrl(slider.image) || '/placeholder.jpg'" :alt="slider.title" width="1280" height="720" class="w-full h-auto block" />
              <div v-if="slider.show_title || slider.show_description" class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center overlay-content">
                <div class="text-center text-white max-w-4xl mx-auto px-4">
                  <h2 v-if="slider.show_title" class="text-2xl md:text-5xl font-bold mb-2 md:mb-4">{{ slider.title }}</h2>
                  <p v-if="slider.show_description" class="text-sm md:text-xl font-light opacity-90">{{ slider.description }}</p>
                  <div v-if="slider.link" class="mt-4 md:mt-6">
                    <span class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 md:py-3 md:px-6 rounded-full transition-colors text-sm md:text-base shadow-lg">
                      Selengkapnya <i data-lucide="arrow-right" class="ml-2 h-4 w-4 inline-block align-middle"></i>
                    </span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <button v-if="homeData.sliders.length > 1" aria-label="Slider Sebelumnya" class="swiper-button-prev-custom absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full z-20 border-2 border-white/50 shadow-xl transition-all duration-300 group">
          <i data-lucide="chevron-left" class="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform flex justify-center items-center"></i>
        </button>
        <button v-if="homeData.sliders.length > 1" aria-label="Slider Selanjutnya" class="swiper-button-next-custom absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full z-20 border-2 border-white/50 shadow-xl transition-all duration-300 group">
          <i data-lucide="chevron-right" class="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform flex justify-center items-center"></i>
        </button>
        <div v-if="homeData.sliders.length > 1" class="swiper-pagination !absolute !bottom-4 !left-0 !right-0 !z-30"></div>
      </div>

      <section class="py-10 bg-white">
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-4">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Informasi Terbaru</h2>
            <p class="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">Dokumen dan pengumuman publik terkini dari PPID Kabupaten Sinjai.</p>
          </div>
          <div class="relative group">
            <div class="swiper-pagination latest-info-pagination !relative !top-0 !bottom-auto mb-1 mt-1"></div>
            <div class="swiper-container latest-info-carousel overflow-hidden px-1">
              <div class="swiper-wrapper items-stretch">
                <div v-for="info in homeData.latest_informasi" :key="info.id" class="swiper-slide !h-auto p-2 flex">
                  <div :class="['w-full bg-white rounded-3xl border-l-4 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col group/card p-6 hover:-translate-y-2 relative overflow-hidden', getCardTheme(info.category).border]">
                    <div :class="['absolute -right-6 -top-6 group-hover/card:scale-110 transition-transform duration-700 opacity-50 pointer-events-none', getCardTheme(info.category).text50]">
                      <i data-lucide="file-text" class="w-32 h-32"></i>
                    </div>
                    <div class="mb-5 relative z-10">
                      <div class="flex items-center gap-3 mb-2">
                        <div :class="['w-9 h-9 rounded-xl flex items-center justify-center border', getCategoryColor(info.category, 'bg50'), getCategoryColor(info.category, 'text600'), getCategoryColor(info.category, 'border100')]">
                          <i data-lucide="building-2" class="w-4 h-4"></i>
                        </div>
                        <div class="flex flex-col min-w-0">
                          <span class="text-[11px] font-extrabold text-gray-800 uppercase tracking-tight line-clamp-1" :title="getUnitName(info)">{{ getUnitName(info) }}</span>
                          <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Oleh: {{ getUploaderName(info) }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 :class="['text-gray-900 font-bold text-lg mb-6 line-clamp-2 leading-tight transition-colors relative z-10', getCardTheme(info.category).text600Hover]" :title="info.title">
                      {{ info.title }}
                    </h3>
                    
                    <div class="mt-auto pt-5 border-t border-gray-50 flex items-end justify-between relative z-10">
                      <div class="flex flex-col gap-2">
                        <div class="flex flex-col gap-1">
                          <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center">
                            <i data-lucide="calendar" class="w-3 h-3 mr-1.5 text-blue-500"></i>
                            {{ formatDate(info.tanggal_upload || info.created_at) }}
                          </span>
                          <span class="text-[10px] text-gray-500 font-bold flex items-center">
                            <i data-lucide="file-text" class="w-3 h-3 mr-1.5 text-blue-500"></i>
                            <span class="truncate max-w-[120px]" :title="info.jenis_dokumen || 'Dokumen Publik'">
                              {{ info.jenis_dokumen || 'Dokumen Publik' }}
                            </span>
                          </span>
                        </div>
                        <span :class="['inline-flex items-center w-fit text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border', getCategoryColor(info.category, 'badge'), getCategoryColor(info.category, 'border')]">
                          {{ info.category }}
                        </span>
                      </div>
                      
                      <router-link :to="`/informasi/detail/${info.slug}`" :class="['w-11 h-11 rounded-2xl bg-gray-900 text-white flex items-center justify-center transition-all shadow-lg active:scale-90 group/btn', getCardTheme(info.category).bg600Hover]">
                        <i data-lucide="arrow-up-right" class="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"></i>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button class="latest-info-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-3 z-10 text-gray-700 hover:bg-blue-600 hover:text-white transition-all border border-gray-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
              <i data-lucide="chevron-left" class="h-6 w-6 flex items-center justify-center"></i>
            </button>
            <button class="latest-info-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-3 z-10 text-gray-700 hover:bg-blue-600 hover:text-white transition-all border border-gray-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
              <i data-lucide="chevron-right" class="h-6 w-6 flex items-center justify-center"></i>
            </button>
          </div>
        </div>
      </section>

      <section class="py-3 md:py-6 bg-gray-50">
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-4">
            <h2 class="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Berita Terbaru</h2>
            <p class="text-gray-600 max-w-2xl mx-auto text-xs md:text-base mb-0">Dapatkan informasi terkini seputar kegiatan dan pengumuman dari Humas Sinjai.</p>
          </div>
          <div v-if="rss_items.length > 0" class="relative group px-1">
            <div class="swiper-container news-carousel relative overflow-hidden pt-0">
              <div class="swiper-pagination !relative !top-0 !bottom-auto mt-[1px] mb-6"></div>
              <div class="swiper-wrapper items-stretch">
                <div v-for="(item, idx) in rss_items" :key="idx" class="swiper-slide !h-auto p-1 flex">
                  <div class="w-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 m-1 group/news">
                    <div class="aspect-w-16 aspect-h-9 overflow-hidden relative">
                      <img :src="item.image || 'https://via.placeholder.com/400x225.png?text=No+Image'" :alt="item.title" width="400" height="225" loading="lazy" class="w-full h-48 object-cover transform group-hover/news:scale-105 transition-transform duration-500" />
                      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/news:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div class="p-5 flex flex-col flex-grow">
                      <div class="flex items-center text-xs text-gray-500 mb-3">
                        <i data-lucide="calendar" class="h-3.5 w-3.5 mr-1.5 text-blue-500"></i>
                        {{ formatDate(item.pubDate) }}
                      </div>
                      <h3 class="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug hover:text-blue-600 transition-colors" v-html="item.title"></h3>
                      <p class="text-xs text-gray-600 line-clamp-3 mb-4 flex-grow" v-html="item.description"></p>
                      <div class="mt-auto">
                        <a :href="item.link" target="_blank" class="inline-flex items-center justify-center px-4 py-2.5 border border-blue-100 text-sm font-semibold rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all duration-300 w-full group">
                          Baca Selengkapnya
                          <i data-lucide="external-link" class="ml-2 h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button class="news-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-3 z-10 text-gray-700 hover:bg-blue-600 hover:text-white transition-all border border-gray-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 hidden md:flex">
              <i data-lucide="chevron-left" class="h-6 w-6 flex items-center justify-center"></i>
            </button>
            <button class="news-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-3 z-10 text-gray-700 hover:bg-blue-600 hover:text-white transition-all border border-gray-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 hidden md:flex">
              <i data-lucide="chevron-right" class="h-6 w-6 flex items-center justify-center"></i>
            </button>
          </div>
          <div v-else class="text-center py-12"><p class="text-gray-500">Belum ada berita tersedia</p></div>
        </div>
      </section>

      <section id="informasi" class="py-3 md:py-6 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-1">
            <h2 class="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Akses informasi publik sesuai dengan kategori yang ditetapkan</h2>
            <p class="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">Kami menyediakan berbagai informasi publik yang dapat diakses oleh masyarakat secara transparan dan mudah</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8 px-1">
              <div v-for="(item, idx) in informasiItems" :key="idx" class="h-auto">
                <div class="h-full w-full">
                  <div class="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col group border border-gray-100 overflow-hidden relative">
                    <!-- Subtle glow effect at the top -->
                    <div :class="['absolute top-0 inset-x-0 h-32 bg-gradient-to-b to-transparent opacity-10 group-hover:opacity-20 transition-opacity duration-500', getColorStyles(item.color, 'from500')]"></div>
                    
                    <!-- Decorative floating icon -->
                    <div :class="['absolute -right-8 -top-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none', getColorStyles(item.color, 'text500')]">
                      <i :data-lucide="item.icon" class="w-40 h-40"></i>
                    </div>

                    <div class="p-6 flex-grow flex flex-col relative z-10">
                      <div class="flex items-center mb-6">
                        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-500', getColorStyles(item.color, 'bgGradient')]">
                          <i :data-lucide="item.icon" class="text-white w-6 h-6"></i>
                        </div>
                        <h3 class="text-lg font-extrabold text-gray-800 leading-tight">{{ item.title }}</h3>
                      </div>
                      <ul class="space-y-4 mb-6">
                        <li v-for="(point, pIdx) in item.points" :key="pIdx" class="flex items-start text-[13px] text-gray-600 font-medium group-hover:text-gray-900 transition-colors duration-300">
                          <i data-lucide="check-circle" :class="['mt-0.5 mr-3 flex-shrink-0 w-4 h-4', getColorStyles(item.color, 'text600')]"></i>
                          <span class="leading-relaxed">{{ point }}</span>
                        </li>
                      </ul>
                    </div>
                    <div class="mt-auto p-5 relative z-10 bg-white">
                      <router-link :to="item.url" :class="['w-full py-3 px-4 rounded-xl text-white font-bold text-center flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 text-sm', getColorStyles(item.color, 'bgGradient')]">
                        Akses Informasi
                        <i data-lucide="arrow-right" class="ml-2 w-5 h-5 inline-block group-hover:translate-x-1.5 transition-transform"></i>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <div class="mt-3 md:mt-6 text-center">
            <router-link :to="authStore.isAuthenticated ? '/permohonan/create' : '/login?redirect_to=/permohonan/create'" class="inline-flex items-center justify-center px-6 py-2 md:px-8 md:py-3 border border-transparent text-sm md:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Ajukan Permohonan Informasi
            </router-link>
          </div>
        </div>
      </section>

      <section id="galeri" class="py-3 md:py-6 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-1">
            <h2 class="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Galeri</h2>
            <p class="text-xs md:text-base text-gray-600 max-w-2xl mx-auto">Dokumentasi kegiatan dan momen penting PPID</p>
          </div>
          <div v-if="homeData.gallery && homeData.gallery.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div v-for="item in homeData.gallery" :key="item.id" class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
              <div class="aspect-w-16 aspect-h-12 relative">
                <router-link :to="`/galeri/${item.id}`" class="block">
                  <img :src="getStorageUrl(item.image) || '/placeholder.jpg'" :alt="item.title" width="400" height="225" loading="lazy" class="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div class="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2">
                    <i data-lucide="camera" class="h-3 w-3 md:h-4 md:w-4 text-gray-700 flex justify-center items-center"></i>
                  </div>
                </router-link>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm md:text-base">{{ item.title }}</h3>
                <span v-if="item.category" class="inline-block px-2 py-0.5 text-[10px] md:text-xs bg-blue-100 text-blue-800 rounded-full mb-2">{{ item.category }}</span>
                <p v-if="item.description" class="text-xs md:text-sm text-gray-600 line-clamp-2">{{ item.description }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <i data-lucide="image" class="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4 flex justify-center"></i>
            <p class="text-gray-500">Belum ada galeri tersedia</p>
          </div>
          <div class="text-center mt-6 md:mt-8">
            <router-link to="/galeri" class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-xs md:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Lihat Semua Galeri
            </router-link>
          </div>
        </div>
      </section>

      <section class="py-3 md:py-6 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-1">
            <h2 class="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Statistik PPID</h2>
            <p class="text-xs md:text-base text-gray-600 max-w-2xl mx-auto">Data statistik kinerja pelayanan informasi publik</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <!-- Box 1 -->
            <div class="bg-blue-50 p-5 md:p-6 rounded-lg shadow-md text-center">
              <i data-lucide="info" class="text-blue-600 w-8 h-8 md:w-9 md:h-9 mb-2 md:mb-3 mx-auto flex justify-center items-center"></i>
              <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{{ formatNumber(homeData.statistics?.total_informasi) }}</h3>
              <p class="text-sm md:text-base text-gray-600">Informasi Publik</p>
            </div>
            <!-- Box 2 -->
            <div class="bg-green-50 p-5 md:p-6 rounded-lg shadow-md text-center">
              <i data-lucide="file-text" class="text-green-600 w-8 h-8 md:w-9 md:h-9 mb-2 md:mb-3 mx-auto flex justify-center items-center"></i>
              <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{{ formatNumber(homeData.statistics?.total_permohonan) }}</h3>
              <p class="text-sm md:text-base text-gray-600">Jumlah Permohonan</p>
            </div>
            <!-- Box 3 -->
            <div class="bg-purple-50 p-5 md:p-6 rounded-lg shadow-md text-center">
              <i data-lucide="bar-chart-2" class="text-purple-600 w-8 h-8 md:w-9 md:h-9 mb-2 md:mb-3 mx-auto flex justify-center items-center"></i>
              <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{{ formatNumber(homeData.statistics?.total_survey) }}</h3>
              <p class="text-sm md:text-base text-gray-600">Jumlah Respon Survei</p>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-5 md:p-8">
            <h3 class="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-center">Laporan Kinerja</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-center">
              <div class="p-4 md:p-0 bg-white md:bg-transparent rounded-lg shadow-sm md:shadow-none">
                <div class="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">{{ homeData.statistics.tingkat_kepuasan || 0 }}%</div>
                <p class="text-xs md:text-sm text-gray-600 mb-3">Tingkat Kepuasan Layanan</p>
                
                <!-- Overlapping Avatars for Ratings -->
                <div class="flex items-center justify-center py-2">
                  <div class="flex items-center -space-x-4 overflow-hidden">
                    <template v-if="homeData.ticker && homeData.ticker.length">
                      <div v-for="(rating, idx) in homeData.ticker.slice(0, 3)" :key="idx" class="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden bg-gray-100 flex items-center justify-center" :style="{ zIndex: 30 - (idx * 10) }">
                        <div class="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-bold">
                          {{ rating.nama_pemohon ? rating.nama_pemohon.charAt(0).toUpperCase() : '?' }}
                        </div>
                      </div>
                    </template>
                  </div>
                  <div class="ml-4 text-xs md:text-sm font-bold text-gray-700 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
                    {{ homeData.ticker ? homeData.ticker.length : 0 }} Penilaian
                  </div>
                </div>
              </div>
              <div class="p-4 md:p-0 bg-white md:bg-transparent rounded-lg shadow-sm md:shadow-none">
                <div class="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">{{ homeData.statistics.rata_rata_respon || 0 }} Hari</div>
                <p class="text-xs md:text-sm text-gray-600">Rata-rata Waktu Respon</p>
              </div>
              <div class="p-4 md:p-0 bg-white md:bg-transparent rounded-lg shadow-sm md:shadow-none">
                <div class="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">{{ homeData.statistics.tingkat_penyelesaian || 0 }}%</div>
                <p class="text-xs md:text-sm text-gray-600">Tingkat Penyelesaian Permohonan</p>
              </div>
            </div>

            <div v-if="homeData.ticker && homeData.ticker.length" class="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex items-center">
              <div class="bg-blue-600 text-white px-4 py-3 font-bold text-xs md:text-sm whitespace-nowrap flex items-center gap-2 z-10 shadow-lg shrink-0">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                ULASAN PEMOHON
              </div>
              <div class="flex-1 overflow-hidden relative bg-gray-50/50 py-3">
                <div class="animate-marquee whitespace-nowrap flex items-center gap-12">
                  <div v-for="(rating, idx) in [...homeData.ticker, ...homeData.ticker]" :key="idx" class="inline-flex items-center gap-3 cursor-default group/item hover:bg-white/50 rounded-xl px-2 py-1 transition-all">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-[10px] font-bold border border-yellow-200">
                        {{ rating.nama_pemohon ? rating.nama_pemohon.charAt(0).toUpperCase() : '?' }}
                      </div>
                      <span class="font-bold text-gray-800 text-xs">{{ rating.nama_pemohon || 'Unknown' }}</span>
                    </div>
                    <div class="flex text-yellow-400 text-[10px]">
                      <i data-lucide="star" class="w-3 h-3 fill-current" v-for="n in rating.rating" :key="n"></i>
                    </div>
                    <span class="text-gray-400">|</span>
                    <span class="text-xs text-gray-600 italic">"{{ rating.text && rating.text.length > 50 ? rating.text.substring(0, 50) + '...' : rating.text }}"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Kontak Section -->
      <section id="kontak" class="py-3 md:py-6 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-1">
            <h2 class="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Kontak Kami</h2>
            <p class="text-xs md:text-base text-gray-600 max-w-2xl mx-auto">
              Hubungi kami untuk informasi lebih lanjut atau ajukan permohonan informasi publik
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
            <!-- Contact Info -->
            <div>
              <h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">Informasi Kontak</h3>
              
              <div class="space-y-4 md:space-y-6">
                <!-- Alamat -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-lg bg-blue-100 text-blue-600">
                      <i data-lucide="map-pin" class="h-5 w-5 md:h-6 md:w-6"></i>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-sm md:text-base font-semibold text-gray-900">Alamat</h4>
                    <p class="mt-1 text-sm text-gray-600">Jl. Persatuan Raya No. 101 Kec. Sinjai Utara, Kabupaten Sinjai, Sulawesi Selatan 92611</p>
                  </div>
                </div>

                <!-- Telepon -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-lg bg-blue-100 text-blue-600">
                      <i data-lucide="phone" class="h-5 w-5 md:h-6 md:w-6"></i>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-sm md:text-base font-semibold text-gray-900">Telepon</h4>
                    <p class="mt-1 text-sm text-gray-600">0482-21432</p>
                  </div>
                </div>

                <!-- Email -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-lg bg-blue-100 text-blue-600">
                      <i data-lucide="mail" class="h-5 w-5 md:h-6 md:w-6"></i>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-sm md:text-base font-semibold text-gray-900">Email</h4>
                    <p class="mt-1 text-sm text-gray-600">ppidkabsinjai@gmail.com</p>
                  </div>
                </div>
              </div>

              <!-- Jam Pelayanan -->
              <div class="mt-6 md:mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-sm md:text-base font-semibold text-gray-900 flex items-center">
                    <i data-lucide="clock" class="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600"></i> Jam Pelayanan
                  </h4>
                  <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">GRATIS</span>
                </div>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li class="flex justify-between">
                    <span>Senin - Kamis:</span>
                    <span class="font-medium text-gray-900">08:00 - 16:00 WITA</span>
                  </li>
                  <li class="flex justify-between">
                    <span>Jumat:</span>
                    <span class="font-medium text-gray-900">08:00 - 11:30 WITA</span>
                  </li>
                  <li class="flex justify-between text-red-600">
                    <span>Sabtu - Minggu:</span>
                    <span class="font-medium">Tutup</span>
                  </li>
                </ul>
                <div class="mt-4 pt-4 border-t border-gray-100">
                  <p class="text-xs text-gray-500 italic">*Seluruh layanan informasi publik tidak dipungut biaya apapun.</p>
                </div>
              </div>
            </div>

            <!-- Contact Form -->
            <div>
              <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <!-- Tab Header -->
                <div class="flex border-b border-gray-100 bg-gray-50/50">
                  <button @click="contactMethod = 'email'" :class="contactMethod === 'email' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-100'" class="flex-1 py-4 px-6 text-sm font-bold transition-all flex items-center justify-center gap-2">
                    <i data-lucide="mail" class="w-4 h-4"></i> Kirim via Email
                  </button>
                  <button @click="contactMethod = 'whatsapp'" :class="contactMethod === 'whatsapp' ? 'bg-white border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:bg-gray-100'" class="flex-1 py-4 px-6 text-sm font-bold transition-all flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Kirim via WhatsApp
                  </button>
                </div>

                <div class="p-5 md:p-8">
                  <h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">{{ contactMethod === 'email' ? 'Kirim Pesan Email' : 'Kirim Pesan WhatsApp' }}</h3>
                  <form @submit.prevent="submitContactForm" class="space-y-4 md:space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Nama Lengkap <span class="text-red-500">*</span></label>
                        <input v-model="contactForm.name" @input="clearFieldError('name')" type="text" :class="fieldErrors.name ? 'border-red-500' : 'border-gray-300'" class="w-full px-4 py-2.5 md:py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 text-sm" placeholder="Masukkan nama lengkap" />
                        <p v-if="fieldErrors.name" class="mt-1 text-xs text-red-500">{{ fieldErrors.name }}</p>
                      </div>
                      <div>
                        <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Email <span class="text-red-500">*</span></label>
                        <input v-model="contactForm.email" @input="clearFieldError('email')" type="email" :class="fieldErrors.email ? 'border-red-500' : 'border-gray-300'" class="w-full px-4 py-2.5 md:py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 text-sm" placeholder="email@contoh.com" />
                        <p v-if="fieldErrors.email" class="mt-1 text-xs text-red-500">{{ fieldErrors.email }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Subjek <span class="text-red-500">*</span></label>
                      <input v-model="contactForm.subject" @input="clearFieldError('subject')" type="text" :class="fieldErrors.subject ? 'border-red-500' : 'border-gray-300'" class="w-full px-4 py-2.5 md:py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 text-sm" placeholder="Subjek pesan" />
                      <p v-if="fieldErrors.subject" class="mt-1 text-xs text-red-500">{{ fieldErrors.subject }}</p>
                    </div>
                    <div>
                      <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Pesan <span class="text-red-500">*</span></label>
                      <textarea v-model="contactForm.message" @input="clearFieldError('message')" rows="4" :class="fieldErrors.message ? 'border-red-500' : 'border-gray-300'" class="w-full px-4 py-2.5 md:py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 resize-none text-sm" placeholder="Tulis pesan Anda di sini..."></textarea>
                      <p v-if="fieldErrors.message" class="mt-1 text-xs text-red-500">{{ fieldErrors.message }}</p>
                    </div>

                    <button type="submit" :disabled="isSending" :class="contactMethod === 'email' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'" class="w-full inline-flex items-center justify-center px-6 py-3 md:py-3.5 border border-transparent text-sm md:text-base font-bold rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 shadow-md">
                      <i :data-lucide="contactMethod === 'email' ? 'send' : 'message-circle'" class="w-5 h-5 mr-2"></i>
                      <span v-if="!isSending">{{ contactMethod === 'email' ? 'Kirim Pesan Email' : 'Kirim Pesan WhatsApp' }}</span>
                      <svg v-if="isSending" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </button>
                    <div v-if="formMessage" :class="formMessageType === 'success' ? 'text-green-600' : 'text-red-600'" class="text-center text-sm mt-4">{{ formMessage }}</div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style>
.latest-info-carousel:not(.swiper-initialized) .swiper-wrapper,
.news-carousel:not(.swiper-initialized) .swiper-wrapper {
    display: flex !important;
    gap: 20px !important;
    overflow: hidden !important;
}
.latest-info-carousel:not(.swiper-initialized) .swiper-slide,
.news-carousel:not(.swiper-initialized) .swiper-slide {
    flex: 0 0 100% !important;
}
@media (min-width: 640px) {
    .latest-info-carousel:not(.swiper-initialized) .swiper-slide,
    .news-carousel:not(.swiper-initialized) .swiper-slide { flex: 0 0 calc(50% - 10px) !important; }
}
@media (min-width: 1024px) {
    .latest-info-carousel:not(.swiper-initialized) .swiper-slide,
    .news-carousel:not(.swiper-initialized) .swiper-slide { flex: 0 0 calc(25% - 15px) !important; }
}
.hero-slider {
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
}
.hero-slider .swiper-pagination {
    line-height: 0 !important;
    pointer-events: none;
}
.hero-slider .swiper-pagination-bullet {
    pointer-events: auto;
    background: white !important;
    opacity: 0.5;
    width: 8px;
    height: 8px;
    margin: 0 4px !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.hero-slider .swiper-pagination-bullet-active {
    background: #2563eb !important;
    opacity: 1;
    width: 20px;
    border-radius: 4px;
}
@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.animate-marquee {
    display: inline-flex;
    animation: marquee 60s linear infinite;
    white-space: nowrap;
}
.animate-marquee:hover {
    animation-play-state: paused;
}
</style>
