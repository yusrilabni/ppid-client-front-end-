<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <div class="bg-blue-600 text-white pt-8 pb-16">
      <div class="container mx-auto px-4 max-w-4xl">
        <NuxtLink to="/admin/twibbon" class="text-blue-200 hover:text-white transition flex items-center gap-2 mb-6">
          <i class="fas fa-arrow-left"></i> Kembali ke Galeri
        </NuxtLink>
        <h1 class="text-3xl font-bold mb-2">{{ twibbon?.judul || 'Memuat...' }}</h1>
        <p class="text-blue-100">Pasang foto terbaik Anda dan bagikan ke media sosial!</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 max-w-4xl -mt-8 pb-24 md:pb-8">
      <div class="bg-white rounded-2xl shadow-xl p-4 md:p-8 flex flex-col md:flex-row gap-8 items-start">
        
        <!-- Area Editor -->
        <div class="w-full md:w-3/5 flex flex-col items-center">
          
          <div v-if="loading" class="w-full aspect-square bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
            <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
          </div>

          <div v-else ref="editorContainer" class="relative w-full max-w-md aspect-square mx-auto bg-gray-200 rounded-xl overflow-hidden shadow-inner checkerboard"
               :class="{ 'ring-4 ring-blue-500 bg-blue-50': isDragOverCanvas }"
               @mousemove="onDrag" @mouseup="endInteraction" @mouseleave="endInteraction"
               @touchmove="onDrag" @touchend="endInteraction"
               @dragover.prevent="isDragOverCanvas = true"
               @dragleave.prevent="isDragOverCanvas = false"
               @drop.prevent="handleCanvasDrop">
            
            <!-- User Photo with Resizer Handles -->
            <div v-if="userPhotoData"
                 class="absolute z-10" 
                 :style="{ 
                   transform: `translate(${posX}px, ${posY}px)`,
                   width: `${imgWidth}px`,
                   height: `${imgHeight}px`,
                   cursor: isDragging ? 'grabbing' : 'grab'
                 }"
                 @mousedown.prevent="startDrag"
                 @touchstart.prevent="startDrag">
                 
               <img :src="userPhotoData" class="w-full h-full object-fill max-w-none pointer-events-none select-none drop-shadow-md">
               
               <!-- 4 Corner Handles (Visible when photo exists) -->
               <div class="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nwse-resize z-30" @mousedown.stop.prevent="startResize($event, 'tl')" @touchstart.stop.prevent="startResize($event, 'tl')"></div>
               <div class="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nesw-resize z-30" @mousedown.stop.prevent="startResize($event, 'tr')" @touchstart.stop.prevent="startResize($event, 'tr')"></div>
               <div class="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nesw-resize z-30" @mousedown.stop.prevent="startResize($event, 'bl')" @touchstart.stop.prevent="startResize($event, 'bl')"></div>
               <div class="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nwse-resize z-30" @mousedown.stop.prevent="startResize($event, 'br')" @touchstart.stop.prevent="startResize($event, 'br')"></div>
            </div>

            <!-- Frame Twibbon (Top layer, pointer events disabled) -->
            <img v-if="frameUrl" :src="frameUrl" @load="onFrameLoad" class="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none select-none drop-shadow-xl">
            
            <!-- Hidden Canvas for Export -->
            <canvas ref="exportCanvas" class="hidden"></canvas>
            
            <!-- Overlay Info -->
            <div v-if="!userPhotoData" class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/10 pointer-events-none">
              <div class="bg-white/90 px-4 py-2 rounded-lg shadow-sm text-center">
                <i class="fas fa-image text-gray-400 text-2xl mb-1"></i>
                <p class="text-sm font-medium text-gray-600">Silakan unggah atau tarik foto kesini</p>
              </div>
            </div>
          </div>
          
          <div v-if="userPhotoData" class="w-full max-w-md mt-4 text-center">
             <p class="text-sm text-gray-500"><i class="fas fa-hand-pointer mr-1"></i> Geser foto atau tarik ujung kotak untuk mengubah ukuran</p>
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
              <li>Tarik (drag) foto Anda tepat ke dalam area bingkai.</li>
              <li>Untuk memperbesar/memperkecil, <b>tarik tombol bulat</b> di sudut foto.</li>
              <li>Sentuh bagian tengah foto untuk menggeser posisinya.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>

    <!-- Sticky Bottom Action Bar for Mobile -->
    <div v-if="userPhotoData" class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden z-50 flex gap-3 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
      <label for="upload-photo-mobile" class="flex-1 bg-blue-50 border border-blue-200 text-blue-700 font-semibold py-3 px-2 rounded-xl text-center cursor-pointer text-sm flex items-center justify-center">
        <i class="fas fa-image mr-1"></i> Ganti
        <input id="upload-photo-mobile" type="file" class="hidden" accept="image/*" @change="handlePhotoUpload">
      </label>
      <button 
        @click="downloadTwibbon" 
        :disabled="isDownloading"
        class="flex-[2] bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
      >
        <i v-if="isDownloading" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-download"></i>
        {{ isDownloading ? 'Tunggu...' : 'Unduh Hasil' }}
      </button>
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
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#app'
import api, { getStorageUrl } from '@/services/api'

const route = useRoute()

const loading = ref(true)
const twibbon = ref(null)
const frameUrl = ref('')

const userPhotoData = ref(null)
const exportCanvas = ref(null)
const editorContainer = ref(null)

// Transform state
const posX = ref(0)
const posY = ref(0)
const imgWidth = ref(0)
const imgHeight = ref(0)
const aspectRatio = ref(1)

let frameImgObj = null
let userImgObj = null

const isDownloading = ref(false)
const isDragOver = ref(false)
const isDragOverCanvas = ref(false)

// Interaction state
let isDragging = false
let isResizing = false
let resizeCorner = ''
let startX = 0
let startY = 0
let initialPosX = 0
let initialPosY = 0
let startImgWidth = 0
let startImgHeight = 0

onMounted(async () => {
  await fetchTwibbon()
})

const fetchTwibbon = async () => {
  try {
    const res = await api.get(`/twibbon/${route.params.slug}`)
    twibbon.value = res.data?.data || res.data
    if (twibbon.value) {
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
    
    const img = new Image()
    img.onload = () => {
      userImgObj = img
      aspectRatio.value = img.width / img.height
      
      const containerSize = editorContainer.value?.clientWidth || 400 
      // Set default scale so it fits nicely
      const defaultWidth = containerSize * 0.8
      imgWidth.value = defaultWidth
      imgHeight.value = defaultWidth / aspectRatio.value
      
      posX.value = (containerSize - imgWidth.value) / 2
      posY.value = (containerSize - imgHeight.value) / 2
    }
    img.src = event.target.result
  }
  reader.readAsDataURL(file)
}

const handlePhotoUpload = (e) => {
  const file = e.target.files[0]
  processFile(file)
}

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
}

const startResize = (e, corner) => {
  if (!userPhotoData.value) return
  isResizing = true
  resizeCorner = corner
  const coords = getClientCoords(e)
  startX = coords.x
  startY = coords.y
  initialPosX = posX.value
  initialPosY = posY.value
  startImgWidth = imgWidth.value
  startImgHeight = imgHeight.value
}

const onDrag = (e) => {
  if (!isDragging && !isResizing) return
  
  const coords = getClientCoords(e)
  const dx = coords.x - startX
  const dy = coords.y - startY
  
  if (isDragging) {
    posX.value = initialPosX + dx
    posY.value = initialPosY + dy
  } 
  else if (isResizing) {
    let newW = startImgWidth
    
    if (resizeCorner === 'br') {
      newW = startImgWidth + dx
    } else if (resizeCorner === 'bl') {
      newW = startImgWidth - dx
    } else if (resizeCorner === 'tr') {
      newW = startImgWidth + dx
    } else if (resizeCorner === 'tl') {
      newW = startImgWidth - dx
    }
    
    // Minimum size
    if (newW < 50) newW = 50
    const newH = newW / aspectRatio.value
    
    // Adjust position so the opposite corner stays anchored
    if (resizeCorner === 'bl' || resizeCorner === 'tl') {
      posX.value = initialPosX + (startImgWidth - newW)
    }
    if (resizeCorner === 'tr' || resizeCorner === 'tl') {
      posY.value = initialPosY + (startImgHeight - newH)
    }
    
    imgWidth.value = newW
    imgHeight.value = newH
  }
}

const endInteraction = () => {
  isDragging = false
  isResizing = false
}

const downloadTwibbon = () => {
  if (!userImgObj || !frameImgObj) return
  isDownloading.value = true

  setTimeout(() => {
    try {
      const canvas = exportCanvas.value
      const ctx = canvas.getContext('2d')
      
      const bgImg = new Image()
      bgImg.crossOrigin = "Anonymous"
      bgImg.onload = () => {
        canvas.width = bgImg.width
        canvas.height = bgImg.height
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        const domWidth = editorContainer.value?.clientWidth || 400
        const ratio = bgImg.width / domWidth
        
        const finalX = posX.value * ratio
        const finalY = posY.value * ratio
        const finalWidth = imgWidth.value * ratio
        const finalHeight = imgHeight.value * ratio
        
        // 1. Draw User Photo
        ctx.drawImage(userImgObj, finalX, finalY, finalWidth, finalHeight)
        
        // 2. Draw Frame
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
        
        // 3. Export
        const dataUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `Twibbon-${twibbon.value.slug}.png`
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        isDownloading.value = false
      }
      bgImg.onerror = () => {
        alert('Terjadi kesalahan saat memproses gambar frame. (CORS/Network error)')
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
