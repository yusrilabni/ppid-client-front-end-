<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <div class="bg-blue-600 text-white pt-8 pb-16">
      <div class="container mx-auto px-4 max-w-4xl">
        <NuxtLink to="/twibbon" class="text-blue-200 hover:text-white transition flex items-center gap-2 mb-6">
          <i class="fas fa-arrow-left"></i> Kembali ke Galeri
        </NuxtLink>
        <h1 class="text-3xl font-bold mb-2">{{ twibbon?.judul || 'Memuat...' }}</h1>
        <p class="text-blue-100">Pasang foto terbaik Anda dan bagikan ke media sosial!</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 max-w-4xl -mt-8">
      <div class="bg-white rounded-2xl shadow-xl p-4 md:p-8 flex flex-col md:flex-row gap-8 items-start">
        
        <!-- Area Editor -->
        <div class="w-full md:w-3/5 flex flex-col items-center">
          
          <div v-if="loading" class="w-full aspect-square bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
            <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
          </div>

          <div v-else ref="editorContainer" class="relative w-full max-w-md aspect-square mx-auto bg-gray-200 rounded-xl overflow-hidden shadow-inner checkerboard"
               :class="{ 'ring-4 ring-blue-500 bg-blue-50': isDragOverCanvas }"
               @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag"
               @touchstart="startDrag" @touchmove="onDrag" @touchend="endDrag"
               @dragover.prevent="isDragOverCanvas = true"
               @dragleave.prevent="isDragOverCanvas = false"
               @drop.prevent="handleCanvasDrop">
            
            <!-- Elemen ini hanya tampilan interaktif (DOM) -->
            <div class="absolute inset-0 z-10 w-full h-full cursor-move" style="touch-action: none;">
               <!-- User Photo -->
               <img v-if="userPhotoData" :src="userPhotoData" 
                    class="absolute select-none pointer-events-none"
                    :style="{ 
                      transform: `translate(${posX}px, ${posY}px) scale(${scale})`,
                      transformOrigin: 'top left',
                      width: `${photoWidth}px`,
                      height: `${photoHeight}px`
                    }"
               >
            </div>

            <!-- Frame Twibbon -->
            <img :src="frameUrl" @load="onFrameLoad" class="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none select-none">
            
            <!-- Hidden Canvas for Export -->
            <canvas ref="exportCanvas" class="hidden"></canvas>
            
            <!-- Overlay Info -->
            <div v-if="!userPhotoData" class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/10 pointer-events-none">
              <div class="bg-white/90 px-4 py-2 rounded-lg shadow-sm text-center">
                <i class="fas fa-image text-gray-400 text-2xl mb-1"></i>
                <p class="text-sm font-medium text-gray-600">Silakan unggah atau tarik (drag) foto Anda kesini</p>
              </div>
            </div>
          </div>
          
          <!-- Controls -->
          <div v-if="userPhotoData" class="w-full max-w-md mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label class="text-sm font-medium text-gray-700 flex justify-between mb-2">
              <span><i class="fas fa-search-plus mr-1"></i> Perbesar/Perkecil</span>
              <span>{{ Math.round(scale * 100) }}%</span>
            </label>
            <input type="range" v-model="scale" min="0.1" max="3" step="0.01" class="w-full accent-blue-600">
            <p class="text-xs text-gray-500 mt-2 text-center"><i class="fas fa-hand-pointer mr-1"></i> Geser foto pada area bingkai untuk menyesuaikan posisi</p>
          </div>
        </div>
        
        <!-- Sidebar Menu -->
        <div class="w-full md:w-2/5 flex flex-col gap-4">
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-4"><i class="fas fa-cog mr-2"></i> Pengaturan</h3>
            
            <label for="upload-photo" 
                   @dragover.prevent="isDragOver = true"
                   @dragleave.prevent="isDragOver = false"
                   @drop.prevent="handlePhotoDrop"
                   :class="['w-full border-2 border-dashed transition font-medium py-3 px-4 rounded-xl text-center cursor-pointer flex flex-col items-center justify-center gap-2 mb-4', isDragOver ? 'border-blue-600 bg-blue-100 text-blue-700' : 'bg-white border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600']">
              <i class="fas fa-upload text-xl"></i>
              <span>{{ userPhotoData ? 'Ganti Foto' : 'Pilih atau Tarik Foto Kesini' }}</span>
              <input id="upload-photo" type="file" class="hidden" accept="image/*" @change="handlePhotoUpload">
            </label>

            <button 
              @click="downloadTwibbon" 
              :disabled="!userPhotoData || isDownloading"
              class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i v-if="isDownloading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-download"></i>
              {{ isDownloading ? 'Memproses...' : 'Unduh Hasil (PNG)' }}
            </button>
          </div>
          
          <div class="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed">
            <h4 class="font-bold mb-1"><i class="fas fa-info-circle mr-1"></i> Tips Penggunaan:</h4>
            <ul class="list-disc pl-5 space-y-1 text-blue-700/80">
              <li>Anda bisa menarik (drag & drop) foto langsung ke area bingkai.</li>
              <li>Gunakan foto dengan pencahayaan terang.</li>
              <li>Gunakan penggeser (slider) untuk mengatur ukuran.</li>
              <li>Sentuh dan geser (drag) foto untuk memposisikan wajah Anda agar pas dengan bingkai.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.checkerboard {
  background-image: 
    linear-gradient(45deg, #e5e7eb 25%, transparent 25%), 
    linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #e5e7eb 75%), 
    linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#app'

const route = useRoute()
const config = useRuntimeConfig()

const loading = ref(true)
const twibbon = ref(null)
const frameUrl = ref('')

const userPhotoData = ref(null)
const exportCanvas = ref(null)
const editorContainer = ref(null)

// Drag and Scale state
const scale = ref(1)
const posX = ref(0)
const posY = ref(0)
const photoWidth = ref(0)
const photoHeight = ref(0)
let frameImgObj = null
let userImgObj = null

const isDownloading = ref(false)

// Interaction state
let isDragging = false
let startX = 0
let startY = 0
let initialPosX = 0
let initialPosY = 0

onMounted(async () => {
  await fetchTwibbon()
})

const getStorageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const baseUrl = config.public.apiBase.replace('/api/v1', '')
  return `${baseUrl}/storage/${path}`
}

const fetchTwibbon = async () => {
  try {
    const { data } = await $fetch(`${config.public.apiBase}/twibbon/${route.params.slug}`)
    twibbon.value = data?.data
    if (twibbon.value) {
      // Proxy or direct URL for CORS if needed, but since it's same domain it's usually fine
      frameUrl.value = getStorageUrl(twibbon.value.file_path)
    }
  } catch (error) {
    console.error(error)
    alert('Twibbon tidak ditemukan')
  } finally {
    loading.value = false
  }
}

const onFrameLoad = (e) => {
  frameImgObj = e.target
}

const isDragOver = ref(false)
const isDragOverCanvas = ref(false)

const handlePhotoDrop = (e) => {
  isDragOver.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const handleCanvasDrop = (e) => {
  isDragOverCanvas.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const processFile = (file) => {
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    userPhotoData.value = event.target.result
    
    // Reset positions and load image to get dimensions
    const img = new Image()
    img.onload = () => {
      userImgObj = img
      photoWidth.value = img.width
      photoHeight.value = img.height
      
      // Auto scale to fit inside view area
      const containerSize = editorContainer.value?.clientWidth || 400 
      const minScale = Math.max(containerSize / img.width, containerSize / img.height)
      scale.value = minScale
      
      // Center image
      posX.value = (containerSize - (img.width * minScale)) / 2
      posY.value = (containerSize - (img.height * minScale)) / 2
    }
    img.src = event.target.result
  }
  reader.readAsDataURL(file)
}

const handlePhotoUpload = (e) => {
  const file = e.target.files[0]
  processFile(file)
}

// Mouse / Touch events for dragging
const getClientCoords = (e) => {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  return { x: e.clientX, y: e.clientY }
}

const startDrag = (e) => {
  if (!userPhotoData.value) return
  isDragging = true
  const coords = getClientCoords(e)
  startX = coords.x
  startY = coords.y
  initialPosX = posX.value
  initialPosY = posY.value
  e.preventDefault()
}

const onDrag = (e) => {
  if (!isDragging) return
  const coords = getClientCoords(e)
  const dx = coords.x - startX
  const dy = coords.y - startY
  posX.value = initialPosX + dx
  posY.value = initialPosY + dy
  e.preventDefault()
}

const endDrag = () => {
  isDragging = false
}

const downloadTwibbon = () => {
  if (!userImgObj || !frameImgObj) return
  isDownloading.value = true

  setTimeout(() => {
    try {
      const canvas = exportCanvas.value
      const ctx = canvas.getContext('2d')
      
      // Gunakan resolusi asli frame untuk kualitas terbaik
      // Wait, we need to load the frame as an Image object securely to draw on canvas
      const bgImg = new Image()
      bgImg.crossOrigin = "Anonymous"
      bgImg.onload = () => {
        canvas.width = bgImg.width
        canvas.height = bgImg.height
        
        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Calculate relative scale between DOM view (max 400px approx) and original image
        // To be accurate, we must find the exact DOM size of the frame container
        // Since container is aspect-square, and background is object-contain
        // Let's assume the frame itself dictates the square ratio or the background size.
        
        // Actually, the simplest way is to scale the user image based on frame dimensions.
        // We know DOM width vs Frame width ratio.
        const domWidth = editorContainer.value?.clientWidth || 400
        const ratio = bgImg.width / domWidth
        
        const finalX = posX.value * ratio
        const finalY = posY.value * ratio
        const finalWidth = photoWidth.value * scale.value * ratio
        const finalHeight = photoHeight.value * scale.value * ratio
        
        // 1. Draw User Photo
        ctx.drawImage(userImgObj, finalX, finalY, finalWidth, finalHeight)
        
        // 2. Draw Frame
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
        
        // 3. Export to PNG
        const dataUrl = canvas.toDataURL('image/png')
        
        // Download Trigger
        const link = document.createElement('a')
        link.download = `Twibbon-${twibbon.value.slug}.png`
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        isDownloading.value = false
      }
      bgImg.onerror = () => {
        alert('Terjadi kesalahan saat memproses gambar frame (CORS/Network error).')
        isDownloading.value = false
      }
      bgImg.src = frameUrl.value

    } catch (e) {
      console.error(e)
      alert('Gagal membuat twibbon.')
      isDownloading.value = false
    }
  }, 100)
}
</script>
