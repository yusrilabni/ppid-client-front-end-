<template>
  <div class="bg-gray-900 min-h-screen py-6 md:py-10 flex flex-col">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        
      <!-- Header / Toolbar -->
      <div class="flex flex-col md:flex-row justify-between items-center bg-gray-800 text-white p-4 rounded-t-2xl shadow-xl border-b border-gray-700/80 gap-4">
        <!-- Left: Back link and Title -->
        <div class="w-full md:w-auto flex items-center justify-between md:justify-start gap-4">
          <NuxtLink
            to="/laporan/ppid"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white text-xs font-semibold transition-colors"
          >
            <i class="fas fa-arrow-left"></i>
            <span>Kembali</span>
          </NuxtLink>
          <div class="text-left">
            <h1 class="text-sm md:text-base font-bold text-white tracking-wide truncate max-w-[240px] sm:max-w-md">
              {{ currentLaporan?.title || 'Preview Laporan PPID' }}
            </h1>
            <p v-if="currentLaporan?.tahun" class="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
              Tahun Anggaran {{ currentLaporan.tahun }}
            </p>
          </div>
        </div>
        
        <!-- Center/Right: Page navigation and Actions -->
        <div class="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          <!-- Flip Controls -->
          <div class="inline-flex items-center bg-gray-700/80 rounded-xl p-1 border border-gray-600">
            <button
              @click="flipPrev"
              :disabled="pageCurrent <= 1"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-600 active:scale-95"
              title="Halaman Sebelumnya"
            >
              <i class="fas fa-chevron-left mr-1"></i> Prev
            </button>
            <span class="px-3 text-xs text-gray-300 font-mono">
              <strong class="text-white">{{ pageCurrent }}</strong> / {{ pageTotal }}
            </span>
            <button
              @click="flipNext"
              :disabled="pageCurrent >= pageTotal"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-600 active:scale-95"
              title="Halaman Selanjutnya"
            >
              Next <i class="fas fa-chevron-right ml-1"></i>
            </button>
          </div>

          <!-- Direct Download / Open Action -->
          <a
            v-if="directFileUrl"
            :href="directFileUrl"
            target="_blank"
            download
            class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
            title="Download PDF"
          >
            <i class="fas fa-download text-xs"></i>
            <span class="hidden sm:inline">Unduh PDF</span>
          </a>
        </div>
      </div>

      <!-- Book Viewing Area -->
      <div class="book-wrapper bg-gray-950 rounded-b-2xl shadow-2xl relative overflow-hidden flex-1 flex flex-col items-center justify-center min-h-[600px] lg:min-h-[750px] p-4 sm:p-8 border border-gray-800 border-t-0">
          
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center z-20 absolute p-6 rounded-3xl bg-gray-900/90 backdrop-blur-md border border-gray-800 max-w-sm">
          <svg class="animate-spin h-10 w-10 text-blue-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-white text-sm font-semibold">{{ loadingText }}</p>
          <p class="text-xs text-gray-400 mt-1">Menyiapkan halaman interaktif flipbook...</p>
        </div>

        <!-- Error State -->
        <div v-if="loadingError" class="text-center z-30 absolute p-8 rounded-3xl bg-gray-900/95 border border-red-500/30 max-w-md shadow-2xl">
          <div class="w-14 h-14 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 text-2xl">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h3 class="text-base font-bold text-white mb-1">Gagal Membuka Flipbook</h3>
          <p class="text-xs text-red-300 mb-6 leading-relaxed">{{ loadingError }}</p>
          <div class="flex flex-col sm:flex-row gap-2.5 justify-center">
            <a
              v-if="directFileUrl"
              :href="directFileUrl"
              target="_blank"
              class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center justify-center gap-2"
            >
              <i class="fas fa-external-link-alt"></i>
              Buka PDF Langsung
            </a>
            <NuxtLink
              to="/laporan/ppid"
              class="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold inline-flex items-center justify-center gap-2"
            >
              <i class="fas fa-arrow-left"></i>
              Kembali
            </NuxtLink>
          </div>
        </div>

        <!-- The Book Container -->
        <div ref="bookContainer" class="z-10 transition-opacity duration-500" :class="{ 'opacity-0 pointer-events-none': isLoading || loadingError }"></div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import api, { getStorageUrl } from '@/services/api'

const route = useRoute()
const encodedId = computed(() => route.params.id)

const bookContainer = ref(null)
const pageCurrent = ref(1)
const pageTotal = ref('--')
const isLoading = ref(true)
const loadingText = ref('Menyiapkan Library...')
const loadingError = ref('')

let pageFlipInstance = null
let updateInterval = null

// Fetch list of laporan to find title and file storage URL
const { data: laporanList } = await useAsyncData('preview-laporan-meta', async () => {
  try {
    const res = await api.get('/laporan')
    return Array.isArray(res.data) ? res.data : (res.data?.data || [])
  } catch {
    return []
  }
}, { default: () => [] })

const currentLaporan = computed(() => {
  const list = laporanList.value || []
  return list.find(item => String(item.encoded_id) === String(encodedId.value)) || null
})

const directFileUrl = computed(() => {
  if (currentLaporan.value?.file) {
    return getStorageUrl(currentLaporan.value.file)
  }
  return ''
})

// Load external scripts sequentially
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return resolve()
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve()
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = (e) => reject(new Error(`Gagal memuat library: ${src}`))
    document.head.appendChild(script)
  })
}

const flipPrev = () => {
  if (pageFlipInstance) pageFlipInstance.flipPrev()
}

const flipNext = () => {
  if (pageFlipInstance) pageFlipInstance.flipNext()
}

onMounted(async () => {
  try {
    // 1. Load external PDF.js and PageFlip scripts
    loadingText.value = 'Memuat Library PDF & Flipbook...'
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js')
    await loadScript('https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.min.js')

    const pdfjsLib = window['pdfjs-dist/build/pdf']
    if (!pdfjsLib) {
      throw new Error('PDF.js gagal diinisialisasi')
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'

    loadingText.value = 'Mengunduh Dokumen Laporan...'

    // 2. Download PDF buffer (try API file endpoint first, fallback to direct storage URL)
    let pdfData = null
    const targetUrl = `${api.defaults.baseURL}/laporan/ppid/file/${encodedId.value}?t=${Date.now()}`

    try {
      const response = await fetch(targetUrl)
      if (response.ok) {
        const blob = await response.blob()
        if (blob && blob.size > 0) {
          pdfData = await blob.arrayBuffer()
        }
      }
    } catch (e) {
      console.warn('Gagal memuat via endpoint API, mencoba direct storage URL...', e)
    }

    if (!pdfData && directFileUrl.value) {
      try {
        const response2 = await fetch(directFileUrl.value)
        if (response2.ok) {
          const blob2 = await response2.blob()
          if (blob2 && blob2.size > 0) {
            pdfData = await blob2.arrayBuffer()
          }
        }
      } catch (e2) {
        console.warn('Gagal memuat via direct storage URL:', e2)
      }
    }

    if (!pdfData) {
      throw new Error('Dokumen tidak dapat diunduh atau format file tidak sesuai.')
    }

    loadingText.value = 'Merender Halaman Dokumen...'

    // 3. Load PDF via PDF.js
    const loadingTask = pdfjsLib.getDocument({ data: pdfData })
    const pdf = await loadingTask.promise
    const numPages = pdf.numPages
    pageTotal.value = numPages

    if (!bookContainer.value) {
      throw new Error('Container flipbook tidak ditemukan.')
    }

    // 4. Create Page elements
    bookContainer.value.innerHTML = ''
    for (let i = 1; i <= numPages; i++) {
      const pageDiv = document.createElement('div')
      pageDiv.className = 'page'
      pageDiv.innerHTML = `
        <div class="page-content">
          <canvas id="pdf-canvas-${i}"></canvas>
        </div>
      `
      bookContainer.value.appendChild(pageDiv)
    }

    // 5. Initialize PageFlip
    if (!window.St || !window.St.PageFlip) {
      throw new Error('Library PageFlip gagal dimuat.')
    }

    pageFlipInstance = new window.St.PageFlip(bookContainer.value, {
      width: 500,
      height: 700,
      size: 'stretch',
      minWidth: 280,
      maxWidth: 900,
      minHeight: 400,
      maxHeight: 1200,
      showCover: true,
      maxShadowOpacity: 0.5,
      usePortrait: true
    })

    pageFlipInstance.loadFromHTML(bookContainer.value.querySelectorAll('.page'))
    isLoading.value = false

    const renderPage = async (pageNum) => {
      if (pageNum < 1 || pageNum > numPages) return
      const canvas = document.getElementById(`pdf-canvas-${pageNum}`)
      if (!canvas || canvas.dataset.rendered) return

      try {
        const page = await pdf.getPage(pageNum)
        const scale = 2.0
        const viewport = page.getViewport({ scale: scale })

        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        }

        await page.render(renderContext).promise
        canvas.dataset.rendered = 'true'
      } catch (err) {
        console.error('Error rendering page ' + pageNum, err)
      }
    }

    // Pre-render first 4 pages
    renderPage(1)
    renderPage(2)
    renderPage(3)
    renderPage(4)

    pageFlipInstance.on('flip', (e) => {
      const currentPageIndex = e.data
      const pageNum = currentPageIndex + 1
      renderPage(pageNum)
      renderPage(pageNum + 1)
      renderPage(pageNum + 2)
      renderPage(pageNum + 3)
    })

    updateInterval = setInterval(() => {
      if (pageFlipInstance) {
        pageCurrent.value = pageFlipInstance.getCurrentPageIndex() + 1
      }
    }, 400)

  } catch (error) {
    console.error('Laporan preview error:', error)
    loadingText.value = 'Terjadi Kesalahan'
    loadingError.value = error.message || 'Gagal memuat dokumen flipbook.'
    isLoading.value = false
  }
})

onBeforeUnmount(() => {
  if (updateInterval) clearInterval(updateInterval)
  if (pageFlipInstance) {
    try {
      pageFlipInstance.destroy()
    } catch (e) {
      console.warn('Error destroying pageFlip:', e)
    }
  }
})

useHead({
  title: computed(() => currentLaporan.value?.title ? `${currentLaporan.value.title} - Preview Laporan PPID Sinjai` : 'Preview Laporan PPID - PPID Kabupaten Sinjai'),
  meta: [
    { name: 'description', content: 'Preview flipbook interaktif Laporan Tahunan Pelayanan Informasi Publik PPID Kabupaten Sinjai.' }
  ]
})
</script>

<style>
.stf__wrapper {
  perspective: 4000px;
}

.page {
  background-color: white;
  box-shadow: inset -1px 0 5px rgba(0,0,0,0.05);
}

.page-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}

.page-content canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
