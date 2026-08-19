<template>
  <div class="bg-gray-900 min-h-screen py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        
      <!-- Header / Toolbar -->
      <div class="flex flex-col md:flex-row justify-between items-center bg-gray-800 text-white p-4 rounded-t-lg shadow-lg mb-0 border-b border-gray-700">
          <div class="mb-4 md:mb-0">
              <router-link to="/laporan/ppid" class="inline-flex items-center text-gray-300 hover:text-white transition-colors">
                  <i class="fas fa-arrow-left mr-2"></i>
                  Kembali ke Daftar Laporan
              </router-link>
              <h1 class="text-lg font-semibold mt-1">Preview Laporan PPID</h1>
          </div>
          
          <div class="flex items-center space-x-4">
              <button @click="flipPrev" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                  <i class="fas fa-chevron-left"></i> Prev
              </button>
              <span class="text-sm text-gray-400">
                  Page <span class="text-white font-bold">{{ pageCurrent }}</span> of <span class="text-white font-bold">{{ pageTotal }}</span>
              </span>
              <button @click="flipNext" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                  Next <i class="fas fa-chevron-right"></i>
              </button>
          </div>
      </div>

      <!-- Book Viewing Area -->
      <div class="book-wrapper bg-gray-800 rounded-b-lg shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[600px] lg:min-h-[800px]">
          
          <!-- Loading Indicator -->
          <div v-if="isLoading" class="text-center z-20 absolute">
              <svg class="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-white text-lg font-medium">{{ loadingText }}</p>
              <p v-if="loadingError" class="text-red-400 text-sm mt-2">{{ loadingError }}</p>
          </div>

          <!-- The Book -->
          <div ref="bookContainer" class="z-10" :class="{ 'opacity-0': isLoading }"></div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const encodedId = route.params.id

const bookContainer = ref(null)
const pageCurrent = ref(1)
const pageTotal = ref('--')
const isLoading = ref(true)
const loadingText = ref('Menyiapkan Library...')
const loadingError = ref('')

let pageFlipInstance = null
let updateInterval = null

// Load external scripts sequentially
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve()
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = resolve
    script.onerror = reject
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
    // 1. Load libraries
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js')
    await loadScript('https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.min.js')

    const pdfjsLib = window['pdfjs-dist/build/pdf']
    if (pdfjsLib) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'
    }

    loadingText.value = "Mengunduh Dokumen..."

    // 2. Fetch the file blob via our Vue API wrapper (bypassing direct URL)
    // We construct the backend file URL
    const fileUrl = `${api.defaults.baseURL.replace('/api/v1', '')}/laporan/ppid/file/${encodedId}?t=${new Date().getTime()}`
    
    const response = await fetch(fileUrl)
    if (!response.ok) {
        throw new Error(`Gagal memuat dokumen (HTTP ${response.status})`)
    }
    
    const blob = await response.blob()
    if (blob.size === 0) {
        throw new Error('Dokumen kosong (0 bytes).')
    }
    
    loadingText.value = "Memproses Halaman..."
    const pdfData = await blob.arrayBuffer()

    // 3. Load PDF
    const loadingTask = pdfjsLib.getDocument({ data: pdfData })
    const pdf = await loadingTask.promise
    const numPages = pdf.numPages
    pageTotal.value = numPages

    // 4. Create Divs
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
    pageFlipInstance = new window.St.PageFlip(bookContainer.value, {
        width: 500, // Base width per page
        height: 700, // Base height
        size: 'stretch',
        minWidth: 300,
        maxWidth: 1000,
        minHeight: 400,
        maxHeight: 1200,
        showCover: true,
        maxShadowOpacity: 0.5,
        usePortrait: true // Single page mode on mobile automatic
    })

    pageFlipInstance.loadFromHTML(bookContainer.value.querySelectorAll('.page'))

    isLoading.value = false

    const renderPage = async (pageNum) => {
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
            canvas.dataset.rendered = true
        } catch (err) {
            console.error("Error rendering page " + pageNum, err)
        }
    }

    // Render first few pages
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
    }, 500)

  } catch (error) {
    console.error(error)
    loadingText.value = 'Terjadi Kesalahan'
    loadingError.value = error.message
  }
})

onBeforeUnmount(() => {
  if (updateInterval) clearInterval(updateInterval)
  if (pageFlipInstance) {
    pageFlipInstance.destroy()
  }
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