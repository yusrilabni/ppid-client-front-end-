<template>
  <div class="bg-gray-50 min-h-screen pb-12" @click="deselectAll">
    <div class="bg-blue-600 text-white pt-8 pb-16">
      <div class="container mx-auto px-4 max-w-4xl">
        <NuxtLink to="/admin/twibbon" class="text-blue-200 hover:text-white transition flex items-center gap-2 mb-6" @click.stop>
          <i class="fas fa-arrow-left"></i> Kembali ke Daftar Twibbon
        </NuxtLink>
        <h1 class="text-3xl font-bold mb-2">{{ twibbon?.judul || 'Memuat...' }}</h1>
        <p class="text-blue-100">Pasang foto terbaik Anda dan bagikan ke media sosial!</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 max-w-4xl -mt-8 pb-24 md:pb-8">
      <div class="bg-white rounded-2xl shadow-xl p-4 md:p-8 flex flex-col md:flex-row gap-8 items-start" @click.stop>
        
        <!-- Area Editor -->
        <div class="w-full md:w-3/5 flex flex-col items-center relative">
          
          <div v-if="loading" class="w-full aspect-square bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
            <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
          </div>

          <div v-else ref="editorContainer" class="relative w-full aspect-square mx-auto bg-gray-200 rounded-xl overflow-hidden shadow-inner checkerboard"
               :class="{ 'ring-4 ring-blue-500 bg-blue-50': isDragOverCanvas }"
               @dragover.prevent="isDragOverCanvas = true"
               @dragleave.prevent="isDragOverCanvas = false"
               @drop.prevent="handleCanvasDrop"
               @click="deselectAll">
            
            <!-- Snapping Guides -->
            <div v-if="isSnappedX" class="absolute top-0 bottom-0 left-1/2 w-[1px] bg-blue-500 z-40 pointer-events-none"></div>
            <div v-if="isSnappedY" class="absolute left-0 right-0 top-1/2 h-[1px] bg-blue-500 z-40 pointer-events-none"></div>

            <!-- Photos (Multi-layer) -->
            <div v-for="photo in photos" :key="photo.id"
                 class="absolute"
                 :class="{ 'z-10': selectedPhotoId !== photo.id, 'z-20 ring-2 ring-blue-400 ring-offset-1': selectedPhotoId === photo.id }"
                 :style="{ 
                   transform: `translate(${photo.x}px, ${photo.y}px) rotate(${photo.rotation}deg)`,
                   width: `${photo.width}px`,
                   height: `${photo.height}px`,
                   cursor: photo.isLocked ? 'not-allowed' : (isDragging && selectedPhotoId === photo.id ? 'grabbing' : 'grab'),
                   filter: `blur(${photo.blur}px)`
                 }"
                 @mousedown.prevent.stop="selectPhoto(photo.id, $event)"
                 @touchstart.prevent.stop="selectPhoto(photo.id, $event)">
                 
               <img :src="photo.dataUrl" class="w-full h-full object-fill max-w-none pointer-events-none select-none drop-shadow-md">
               
               <!-- Handles for selected photo ONLY -->
               <template v-if="selectedPhotoId === photo.id && !photo.isLocked">
                 <div class="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nwse-resize z-30" @mousedown.stop.prevent="startResize($event, 'tl')" @touchstart.stop.prevent="startResize($event, 'tl')"></div>
                 <div class="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nesw-resize z-30" @mousedown.stop.prevent="startResize($event, 'tr')" @touchstart.stop.prevent="startResize($event, 'tr')"></div>
                 <div class="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nesw-resize z-30" @mousedown.stop.prevent="startResize($event, 'bl')" @touchstart.stop.prevent="startResize($event, 'bl')"></div>
                 <div class="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nwse-resize z-30" @mousedown.stop.prevent="startResize($event, 'br')" @touchstart.stop.prevent="startResize($event, 'br')"></div>
                 
                 <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-blue-600 shadow-md flex items-center justify-center cursor-ew-resize z-30 text-blue-600" @mousedown.stop.prevent="startRotate" @touchstart.stop.prevent="startRotate">
                   <i class="fas fa-sync-alt text-xs pointer-events-none"></i>
                 </div>
               </template>
            </div>

            <!-- Frame Twibbon (Top layer, pointer events disabled) -->
            <img v-if="frameUrl" :src="frameUrl" @load="onFrameLoad" class="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none select-none drop-shadow-xl" style="z-index: 25;">
            
            <canvas ref="exportCanvas" class="hidden"></canvas>
            
            <div v-if="photos.length === 0" class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/10 pointer-events-none">
              <div class="bg-white/90 px-4 py-2 rounded-lg shadow-sm text-center">
                <i class="fas fa-image text-gray-400 text-2xl mb-1"></i>
                <p class="text-sm font-medium text-gray-600">Silakan unggah atau tarik foto kesini (Maks. 5)</p>
              </div>
            </div>
          </div>
          
          <!-- Floating Toolbar (Appears above the canvas when a photo is selected) -->
          <div v-if="selectedPhoto" class="absolute top-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl px-4 py-2 flex items-center gap-4 z-50 border border-gray-200" @click.stop>
            <button @click="deleteSelected" class="text-red-500 hover:text-red-700" title="Hapus">
              <i class="fas fa-trash"></i>
            </button>
            <button @click="centerSelected" class="text-blue-500 hover:text-blue-700" title="Tengahkan">
              <i class="fas fa-crosshairs"></i>
            </button>
            <button @click="toggleLockSelected" :class="selectedPhoto.isLocked ? 'text-orange-500 hover:text-orange-700' : 'text-gray-500 hover:text-gray-700'" :title="selectedPhoto.isLocked ? 'Buka Kunci' : 'Kunci'">
              <i :class="selectedPhoto.isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i>
            </button>
            <div class="flex items-center gap-2">
              <i class="fas fa-tint text-gray-400 text-xs"></i>
              <input type="range" min="0" max="20" step="0.5" v-model.number="selectedPhoto.blur" class="w-20" title="Efek Blur">
            </div>
          </div>
          
          <div v-if="photos.length > 0" class="w-full mt-4 text-center">
             <p class="text-sm text-gray-500"><i class="fas fa-hand-pointer mr-1"></i> Pilih foto untuk menggeser, mengubah ukuran, atau mengatur filter ({{ photos.length }}/5)</p>
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
                   :class="['w-full border-2 border-dashed transition font-medium py-3 px-4 rounded-xl text-center flex flex-col items-center justify-center gap-2 mb-4', 
                     photos.length >= 5 ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' :
                     (isDragOver ? 'border-blue-600 bg-blue-100 text-blue-700 cursor-pointer' : 'bg-white border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600 cursor-pointer')
                   ]">
              <i class="fas fa-upload text-xl"></i>
              <span>{{ photos.length >= 5 ? 'Batas Maks. 5 Foto' : (photos.length > 0 ? 'Tambah Foto Lain' : 'Pilih atau Tarik Foto Kesini') }}</span>
              <input v-if="photos.length < 5" id="upload-photo" type="file" class="hidden" accept="image/*" @change="handlePhotoUpload">
            </label>

            <button 
              @click="downloadTwibbon" 
              :disabled="photos.length === 0 || isDownloading"
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
              <li>Anda dapat menambah hingga <b>5 foto</b> sekaligus.</li>
              <li>Klik foto untuk memunculkan toolbar (Hapus, Kunci, Blur).</li>
              <li>Tarik tombol bulat di sudut foto yang dipilih untuk resize.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>

    <!-- Sticky Bottom Action Bar for Mobile -->
    <div v-if="photos.length > 0" class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden z-50 flex gap-3 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
      <label for="upload-photo-mobile" class="flex-1 bg-blue-50 border border-blue-200 text-blue-700 font-semibold py-3 px-2 rounded-xl text-center text-sm flex items-center justify-center" :class="{ 'opacity-50 cursor-not-allowed': photos.length >= 5, 'cursor-pointer': photos.length < 5 }">
        <i class="fas fa-plus mr-1"></i> Tambah
        <input v-if="photos.length < 5" id="upload-photo-mobile" type="file" class="hidden" accept="image/*" @change="handlePhotoUpload">
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#app'
import api, { getStorageUrl } from '@/services/api'

const route = useRoute()

const loading = ref(true)
const twibbon = ref(null)
const frameUrl = ref('')

const photos = ref([])
const selectedPhotoId = ref(null)

const selectedPhoto = computed(() => photos.value.find(p => p.id === selectedPhotoId.value) || null)

const exportCanvas = ref(null)
const editorContainer = ref(null)

const isSnappedX = ref(false)
const isSnappedY = ref(false)

let frameImgObj = null

const isDownloading = ref(false)
const isDragOver = ref(false)
const isDragOverCanvas = ref(false)

// Interaction state
let isDragging = false
let isResizing = false
let isPinching = false
let isRotating = false
let resizeCorner = ''
let startX = 0
let startY = 0
let initialPosX = 0
let initialPosY = 0
let startImgWidth = 0
let startImgHeight = 0
let initialDistance = 0
let initialRotation = 0

const handleKeydown = (e) => {
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
    deleteSelected();
  }
}

const addWindowListeners = () => {
  if (process.client) {
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('touchmove', onDrag, { passive: false })
    window.addEventListener('mouseup', endInteraction)
    window.addEventListener('touchend', endInteraction)
  }
}

const removeWindowListeners = () => {
  if (process.client) {
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('touchmove', onDrag)
    window.removeEventListener('mouseup', endInteraction)
    window.removeEventListener('touchend', endInteraction)
  }
}

onMounted(async () => {
  await fetchTwibbon()
  if (process.client) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  removeWindowListeners()
  if (process.client) {
    window.removeEventListener('keydown', handleKeydown)
  }
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
  if (photos.value.length >= 5) {
    alert('Batas maksimal 5 foto telah tercapai.')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    const dataUrl = event.target.result
    
    const img = new Image()
    img.onload = () => {
      const aspectRatio = img.width / img.height
      const containerSize = editorContainer.value?.clientWidth || 400 
      const defaultWidth = containerSize * 0.8
      const width = defaultWidth
      const height = defaultWidth / aspectRatio
      const x = (containerSize - width) / 2
      const y = (containerSize - height) / 2
      
      const newPhoto = {
        id: 'photo_' + Date.now(),
        dataUrl,
        imgObj: img,
        x,
        y,
        width,
        height,
        aspectRatio,
        rotation: 0,
        blur: 0,
        isLocked: false
      }
      
      photos.value.push(newPhoto)
      selectedPhotoId.value = newPhoto.id
    }
    img.src = dataUrl
  }
  reader.readAsDataURL(file)
}

const handlePhotoUpload = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    processFile(e.target.files[0])
    e.target.value = null
  }
}

const deselectAll = () => {
  selectedPhotoId.value = null
}

const selectPhoto = (id, e) => {
  selectedPhotoId.value = id
  const photo = photos.value.find(p => p.id === id)
  if (photo && !photo.isLocked) {
    startDrag(e, photo)
  }
}

const deleteSelected = () => {
  if (selectedPhotoId.value) {
    photos.value = photos.value.filter(p => p.id !== selectedPhotoId.value)
    selectedPhotoId.value = null
  }
}

const centerSelected = () => {
  if (selectedPhoto.value) {
    const containerSize = editorContainer.value?.clientWidth || 400
    selectedPhoto.value.x = (containerSize - selectedPhoto.value.width) / 2
    selectedPhoto.value.y = (containerSize - selectedPhoto.value.height) / 2
  }
}

const toggleLockSelected = () => {
  if (selectedPhoto.value) {
    selectedPhoto.value.isLocked = !selectedPhoto.value.isLocked
  }
}

const getClientCoords = (e) => {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  return { x: e.clientX, y: e.clientY }
}

const getPinchDistance = (e) => {
  if (e.touches && e.touches.length >= 2) {
    return Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
  }
  return 0
}

const startDrag = (e, photo) => {
  if (!photo || photo.isLocked) return
  
  if (e.touches && e.touches.length >= 2) {
    isPinching = true
    initialDistance = getPinchDistance(e)
    initialPosX = photo.x
    initialPosY = photo.y
    startImgWidth = photo.width
    startImgHeight = photo.height
    addWindowListeners()
    return
  }

  isDragging = true
  const coords = getClientCoords(e)
  startX = coords.x
  startY = coords.y
  initialPosX = photo.x
  initialPosY = photo.y
  addWindowListeners()
}

const startResize = (e, corner) => {
  if (!selectedPhoto.value || selectedPhoto.value.isLocked) return
  isResizing = true
  resizeCorner = corner
  const coords = getClientCoords(e)
  startX = coords.x
  startY = coords.y
  initialPosX = selectedPhoto.value.x
  initialPosY = selectedPhoto.value.y
  startImgWidth = selectedPhoto.value.width
  startImgHeight = selectedPhoto.value.height
  addWindowListeners()
}

const startRotate = (e) => {
  if (!selectedPhoto.value || selectedPhoto.value.isLocked) return
  isRotating = true
  const coords = getClientCoords(e)
  startX = coords.x
  startY = coords.y
  initialRotation = selectedPhoto.value.rotation
  addWindowListeners()
}

const onDrag = (e) => {
  const photo = selectedPhoto.value
  if (!photo || photo.isLocked) return

  if (isPinching && e.touches && e.touches.length >= 2) {
    if (e.cancelable) e.preventDefault()
    const currentDistance = getPinchDistance(e)
    const scale = currentDistance / initialDistance
    
    let newW = startImgWidth * scale
    if (newW < 50) newW = 50
    const newH = newW / photo.aspectRatio
    
    const dx = (newW - startImgWidth) / 2
    const dy = (newH - startImgHeight) / 2
    
    photo.width = newW
    photo.height = newH
    photo.x = initialPosX - dx
    photo.y = initialPosY - dy
    return
  }

  if (!isDragging && !isResizing && !isRotating) return
  if (e.cancelable) e.preventDefault()
  
  const coords = getClientCoords(e)
  const dx = coords.x - startX
  const dy = coords.y - startY
  
  if (isDragging) {
    let newX = initialPosX + dx
    let newY = initialPosY + dy
    
    const containerSize = editorContainer.value?.clientWidth || 400
    const centerX = containerSize / 2
    const centerY = containerSize / 2
    
    const imgCenterX = newX + photo.width / 2
    const imgCenterY = newY + photo.height / 2
    
    if (Math.abs(imgCenterX - centerX) < 8) {
      newX = centerX - photo.width / 2
      isSnappedX.value = true
    } else {
      isSnappedX.value = false
    }
    
    if (Math.abs(imgCenterY - centerY) < 8) {
      newY = centerY - photo.height / 2
      isSnappedY.value = true
    } else {
      isSnappedY.value = false
    }
    
    photo.x = newX
    photo.y = newY
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
    
    if (newW < 50) newW = 50
    const newH = newW / photo.aspectRatio
    
    if (resizeCorner === 'bl' || resizeCorner === 'tl') {
      photo.x = initialPosX + (startImgWidth - newW)
    }
    if (resizeCorner === 'tr' || resizeCorner === 'tl') {
      photo.y = initialPosY + (startImgHeight - newH)
    }
    
    photo.width = newW
    photo.height = newH
  }
  else if (isRotating) {
    photo.rotation = initialRotation + dx * 0.5
  }
}

const endInteraction = () => {
  isDragging = false
  isResizing = false
  isPinching = false
  isRotating = false
  isSnappedX.value = false
  isSnappedY.value = false
  removeWindowListeners()
}

const downloadTwibbon = () => {
  if (photos.value.length === 0 || !frameImgObj) return
  isDownloading.value = true

  deselectAll()

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
        
        for (const photo of photos.value) {
          const finalX = photo.x * ratio
          const finalY = photo.y * ratio
          const finalWidth = photo.width * ratio
          const finalHeight = photo.height * ratio
          
          ctx.save()
          
          if (photo.blur > 0) {
            ctx.filter = `blur(${photo.blur * (ratio / 2)}px)`
          }
          
          const imgCenterX = finalX + finalWidth / 2
          const imgCenterY = finalY + finalHeight / 2
          ctx.translate(imgCenterX, imgCenterY)
          
          ctx.rotate((photo.rotation * Math.PI) / 180)
          
          ctx.drawImage(photo.imgObj, -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight)
          
          ctx.restore()
        }
        
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
        
        const dataUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `Twibbon-${twibbon.value.slug}-${Date.now()}.png`
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
      bgImg.src = api.defaults.baseURL + '/twibbon-proxy?path=' + twibbon.value.file_path

    } catch (e) {
      console.error(e)
      alert('Gagal membuat twibbon.')
      isDownloading.value = false
    }
  }, 100)
}
</script>
