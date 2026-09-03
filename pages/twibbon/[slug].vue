<template>
  <div class="bg-gray-50 min-h-screen pb-12" @click="deselectAll">
    <div class="bg-blue-600 text-white pt-8 pb-16">
      <div class="container mx-auto px-4 max-w-4xl">
        <NuxtLink to="/" class="text-blue-200 hover:text-white transition flex items-center gap-2 mb-6" @click.stop>
          <i class="fas fa-arrow-left"></i> Kembali ke Beranda
        </NuxtLink>
        <h1 class="text-3xl font-bold mb-2">{{ twibbon?.judul || 'Memuat...' }}</h1>
        <p class="text-blue-100">Pasang foto terbaik Anda dan bagikan ke media sosial!</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 max-w-4xl -mt-8 pb-24 md:pb-8">
      <div class="bg-white rounded-2xl shadow-xl p-4 md:p-8 flex flex-col md:flex-row gap-8 items-start" @click.stop>
        
        
        <!-- Area Editor -->
        <div class="w-full md:w-3/5 flex flex-col items-center relative">
          
          <!-- Top Canva-style Toolbar -->
          <div class="w-full bg-white border border-gray-200 rounded-t-xl p-2 flex items-center gap-3 shadow-sm overflow-x-auto whitespace-nowrap z-40 relative">
            <button @click="addText" class="px-3 py-1.5 hover:bg-gray-100 rounded text-gray-700 text-sm font-medium flex items-center gap-2" title="Tambah Teks"><i class="fas fa-font"></i></button>
            <label for="upload-photo-top" class="px-3 py-1.5 hover:bg-gray-100 rounded text-gray-700 text-sm font-medium flex items-center gap-2 cursor-pointer" title="Tambah Foto" :class="{ 'opacity-50 cursor-not-allowed': photos.length >= 10 }">
              <i class="fas fa-image"></i>
              <input v-if="photos.length < 10" id="upload-photo-top" type="file" class="hidden" accept="image/*" @change="handlePhotoUpload">
            </label>
            
            <div class="w-px h-6 bg-gray-300 mx-1 shrink-0"></div> <!-- Divider -->
            
            <template v-if="selectedPhotoIds.length > 0">
              <div class="flex items-center gap-3">
                <button @click="centerSelected" class="px-2 py-1.5 hover:bg-gray-100 rounded text-gray-700" title="Tengahkan Foto"><i class="fas fa-crosshairs"></i></button>
                <button @click="toggleLockSelected" class="px-2 py-1.5 hover:bg-gray-100 rounded" :class="selectedPhoto.isLocked ? 'text-orange-500' : 'text-gray-700'" title="Kunci/Buka"><i :class="selectedPhoto.isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i></button>
                <button @click="deleteSelected" class="px-2 py-1.5 hover:bg-red-50 text-red-500 rounded" title="Hapus Foto"><i class="fas fa-trash"></i></button>
                
                <div class="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                  <i class="fas fa-tint text-gray-400 text-xs"></i>
                  <input type="range" min="0" max="20" step="0.5" v-model.number="selectedPhoto.blur" @change="saveSessionToDB" class="w-20" title="Efek Blur">
                </div>
              </div>
            </template>
            
            <template v-else-if="selectedTextIds.length > 0 && selectedText">
              <div class="flex items-center gap-3 shrink-0">
                <input type="text" v-model="selectedText.text" @change="saveSessionToDB" class="w-32 border border-gray-300 rounded text-sm px-2 py-1 placeholder-gray-400" placeholder="Isi teks...">
                
                <div class="flex items-center border border-gray-300 rounded bg-white">
                  <input type="number" min="10" max="400" v-model.number="selectedText.fontSize" @change="saveSessionToDB" class="w-16 border-0 text-sm px-2 py-1 text-center" title="Ukuran Font">
                </div>
                
                <div class="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                  <input type="color" v-model="selectedText.color" @change="saveSessionToDB" class="w-8 h-8 cursor-pointer border-0 p-0 rounded-none bg-transparent" title="Pilih Warna">
                  <input type="text" v-model="selectedText.color" @change="saveSessionToDB" class="w-20 border-0 text-sm px-2 uppercase font-mono text-gray-600" maxlength="7">
                  <button @click="pickColorForText(selectedText)" class="px-2 py-1 hover:bg-gray-100 border-l border-gray-200 text-gray-600" title="Pipet Warna Layar (Scope Color)"><i class="fas fa-eye-dropper"></i></button>
                </div>

                <button @click="selectedText.isLocked = !selectedText.isLocked" class="px-2 py-1.5 hover:bg-gray-100 rounded" :class="selectedText.isLocked ? 'text-orange-500' : 'text-gray-700'" title="Kunci/Buka"><i :class="selectedText.isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i></button>
                <button @click="deleteSelectedText" class="px-2 py-1.5 hover:bg-red-50 text-red-500 rounded" title="Hapus Teks"><i class="fas fa-trash"></i></button>
              </div>
            </template>
            
            <template v-else>
              <span class="text-xs text-gray-400 italic">Pilih foto/teks pada kanvas untuk mengedit...</span>
            </template>
          </div>
          
          <div v-if="loading" class="w-full aspect-square bg-gray-100 rounded-b-xl animate-pulse flex items-center justify-center">
            <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
          </div>

          <div v-else ref="editorContainer" class="relative w-full aspect-square mx-auto bg-gray-200 rounded-b-xl overflow-hidden shadow-inner checkerboard"
               :class="{ 'ring-4 ring-blue-500 bg-blue-50': isDragOverCanvas }"
               @dragover.prevent="isDragOverCanvas = true"
               @dragleave.prevent="isDragOverCanvas = false"
               @drop.prevent="handleCanvasDrop"
               @click="deselectAll">
            
            <!-- Snapping Guides -->
            <div v-if="isSnappedX" class="absolute top-0 bottom-0 left-1/2 w-[1px] bg-blue-500 z-40 pointer-events-none"></div>
            <div v-if="isSnappedY" class="absolute left-0 right-0 top-1/2 h-[1px] bg-blue-500 z-40 pointer-events-none"></div>
            <div v-if="currentDegreeDisplay !== null" class="absolute top-4 left-1/2 -translate-x-1/2 bg-black/75 text-white px-3 py-1 rounded-full text-sm font-bold z-50 pointer-events-none">
              {{ currentDegreeDisplay }}&deg;
            </div>

            <!-- Photos (Multi-layer) -->
            <div v-for="photo in photos" :key="photo.id"
                 class="absolute"
                 :class="{ 'z-10': !selectedPhotoIds.includes(photo.id), 'z-20 ring-2 ring-blue-400 ring-offset-1': selectedPhotoIds.includes(photo.id) }"
                 :style="{ 
                   transform: `translate(${photo.x}px, ${photo.y}px) rotate(${photo.rotation}deg)`,
                   width: `${photo.width}px`,
                   height: `${photo.height}px`,
                   cursor: photo.isLocked ? 'not-allowed' : (isDragging && selectedPhotoIds.includes(photo.id) ? 'grabbing' : 'grab'),
                   filter: `blur(${photo.blur}px)`
                 }"
                 @mousedown.stop="selectPhoto(photo.id, $event)"
                 @touchstart.stop="selectPhoto(photo.id, $event)"
                 @click.stop>
                 
               <img :src="photo.dataUrl" class="w-full h-full object-fill max-w-none pointer-events-none select-none drop-shadow-md">
               
               <!-- Handles for selected photo ONLY -->
               <template v-if="selectedPhotoIds.includes(photo.id) && !photo.isLocked">
                 <div :class="{ 'opacity-0': isInteracting }">
                 <div class="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nwse-resize z-30" @mousedown.stop.prevent="startResize($event, 'tl')" @touchstart.stop.prevent="startResize($event, 'tl')"></div>
                 <div class="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nesw-resize z-30" @mousedown.stop.prevent="startResize($event, 'tr')" @touchstart.stop.prevent="startResize($event, 'tr')"></div>
                 <div class="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nesw-resize z-30" @mousedown.stop.prevent="startResize($event, 'bl')" @touchstart.stop.prevent="startResize($event, 'bl')"></div>
                 <div class="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nwse-resize z-30" @mousedown.stop.prevent="startResize($event, 'br')" @touchstart.stop.prevent="startResize($event, 'br')"></div>
                 
                 <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-blue-600 shadow-md flex items-center justify-center cursor-ew-resize z-30 text-blue-600" @mousedown.stop.prevent="startRotate" @touchstart.stop.prevent="startRotate">
                   <i class="fas fa-sync-alt text-xs pointer-events-none"></i>
                 </div>
               </div>
               </template>
            </div>

            
            
            <!-- Text Layers -->
            <div v-for="t in texts" :key="t.id"
                 class="absolute flex flex-col items-center justify-center pointer-events-auto"
                 :class="{ 'z-10': !selectedTextIds.includes(t.id), 'z-30': selectedTextIds.includes(t.id) }"
                 :style="{ 
                   transform: `translate(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px)) rotate(${t.rotation}deg)`,
                   cursor: t.isLocked ? 'not-allowed' : (isDragging && selectedTextIds.includes(t.id) ? 'grabbing' : 'grab'),
                   left: '50%', top: '50%'
                 }"
                 @mousedown.stop="selectText(t.id, $event); startTextDrag($event, t)"
                 @touchstart.stop="selectText(t.id, $event); startTextDrag($event, t)"
                 @click.stop>
                 
               <div :style="{ color: t.color, fontSize: t.fontSize + 'px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', padding: '4px', border: selectedTextIds.includes(t.id) ? '1px dashed rgba(255,255,255,0.7)' : '1px solid transparent' }" class="select-none pointer-events-none">
                 {{ t.text }}
               </div>
               
               <!-- Handles for selected text -->
               <template v-if="selectedTextIds.includes(t.id) && !t.isLocked">
                 <div class="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600 shadow-md cursor-nwse-resize z-30" @mousedown.stop.prevent="startTextResize($event, t, 'tl')" @touchstart.stop.prevent="startTextResize($event, t, 'tl')"></div>
                 <div class="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600 shadow-md cursor-nesw-resize z-30" @mousedown.stop.prevent="startTextResize($event, t, 'tr')" @touchstart.stop.prevent="startTextResize($event, t, 'tr')"></div>
                 <div class="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600 shadow-md cursor-nesw-resize z-30" @mousedown.stop.prevent="startTextResize($event, t, 'bl')" @touchstart.stop.prevent="startTextResize($event, t, 'bl')"></div>
                 <div class="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600 shadow-md cursor-nwse-resize z-30" @mousedown.stop.prevent="startTextResize($event, t, 'br')" @touchstart.stop.prevent="startTextResize($event, t, 'br')"></div>
                 
                 <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-indigo-600 shadow-md flex items-center justify-center cursor-ew-resize z-30 text-indigo-600" @mousedown.stop.prevent="startRotateText($event, t)" @touchstart.stop.prevent="startRotateText($event, t)">
                   <i class="fas fa-sync-alt text-xs pointer-events-none"></i>
                 </div>
               </template>
            </div>
            
            <!-- Frame Twibbon (Top layer, pointer events disabled) -->
            <img v-if="frameUrl" crossorigin="anonymous" :src="frameUrl" @load="onFrameLoad" class="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none select-none drop-shadow-xl" style="z-index: 25;">
            
            <canvas ref="exportCanvas" class="hidden"></canvas>
            
            <div v-if="photos.length === 0" class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/10 pointer-events-none">
              <div class="bg-white/90 px-4 py-2 rounded-lg shadow-sm text-center">
                <i class="fas fa-image text-gray-400 text-2xl mb-1"></i>
                <p class="text-sm font-medium text-gray-600">Silakan unggah atau tarik foto kesini (Maks. 10)</p>
              </div>
            </div>
          </div>
          
          <div v-if="photos.length > 0 || texts.length > 0" class="w-full mt-4 text-center">
             <p class="text-sm text-gray-500"><i class="fas fa-hand-pointer mr-1"></i> Pilih foto untuk menggeser, mengubah ukuran, atau mengatur filter ({{ photos.length }}/10)</p>
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
                   :class="['w-full border-2 border-dashed transition font-medium py-3 px-4 rounded-xl text-center flex flex-col items-center justify-center gap-2 mb-4', isDragOver ? 'border-blue-600 bg-blue-100 text-blue-700' : 'bg-white border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600', photos.length >= 10 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']">
              <i class="fas fa-upload text-xl"></i>
              <span>{{ photos.length > 0 ? 'Tambah Foto Lain' : 'Pilih atau Tarik Foto Kesini' }}</span>
              <input v-if="photos.length < 10" id="upload-photo" type="file" class="hidden" accept="image/*" @change="handlePhotoUpload">
            </label>

            
            <button @click="addText" class="w-full border-2 border-indigo-600 bg-white text-indigo-700 font-medium py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 mb-6 hover:bg-indigo-50 transition cursor-pointer">
              <i class="fas fa-font text-xl"></i>
              <span>Tambah Teks Baru</span>
            </button>

            <!-- Persistent Toolbar Panel -->
            <div class="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
              <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 border-b pb-2">
                <i class="fas fa-sliders-h"></i> Alat Edit
              </h4>
              
              <div v-if="selectedPhotoIds.length > 0" class="flex flex-col gap-3">
                <div class="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                  <span class="text-xs font-semibold text-blue-700">Foto Terpilih</span>
                  <div class="flex gap-2">
                    <button @click="centerSelected" class="p-2 bg-white rounded shadow-sm text-blue-600 hover:bg-blue-100" title="Tengahkan"><i class="fas fa-crosshairs"></i></button>
                    <button @click="toggleLockSelected" class="p-2 bg-white rounded shadow-sm text-orange-600 hover:bg-orange-100" title="Kunci/Buka"><i :class="selectedPhoto.isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i></button>
                    <button @click="deleteSelected" class="p-2 bg-white rounded shadow-sm text-red-600 hover:bg-red-100" title="Hapus"><i class="fas fa-trash"></i></button>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-600">Efek Blur</label>
                  <input type="range" min="0" max="20" step="0.5" v-model.number="selectedPhoto.blur" @change="saveSessionToDB" class="w-full">
                </div>
              </div>

              <div v-else-if="selectedTextIds.length > 0" class="flex flex-col gap-3">
                <div class="flex items-center justify-between bg-indigo-50 p-2 rounded-lg">
                  <span class="text-xs font-semibold text-indigo-700">Teks Terpilih</span>
                  <div class="flex gap-2">
                    <button @click="texts.find(t=>t.id===selectedTextIds[0]).isLocked = !texts.find(t=>t.id===selectedTextIds[0]).isLocked" class="p-2 bg-white rounded shadow-sm text-orange-600 hover:bg-orange-100" title="Kunci/Buka"><i :class="texts.find(t=>t.id===selectedTextIds[0]).isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i></button>
                    <button @click="deleteSelectedText" class="p-2 bg-white rounded shadow-sm text-red-600 hover:bg-red-100" title="Hapus"><i class="fas fa-trash"></i></button>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-600">Isi Teks</label>
                  <input type="text" v-model="texts.find(t=>t.id===selectedTextIds[0]).text" @change="saveSessionToDB" class="w-full border-gray-300 rounded-lg text-sm p-2">
                </div>
                <div class="flex gap-4">
                  <div class="flex flex-col gap-1 flex-1">
                    <label class="text-xs text-gray-600">Warna (Pilih / Pipet)</label>
                    <div class="flex gap-2">
                      <input type="color" v-model="texts.find(t=>t.id===selectedTextIds[0]).color" @change="saveSessionToDB" class="w-full h-8 rounded cursor-pointer border-0 p-0">
                      <button @click="pickColorForText(texts.find(t=>t.id===selectedTextIds[0]))" class="px-3 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-gray-700" title="Pipet Warna Layar (Scope Color)">
                        <i class="fas fa-eye-dropper"></i>
                      </button>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1 flex-1">
                    <label class="text-xs text-gray-600">Ukuran</label>
                    <input type="range" min="10" max="150" step="1" v-model.number="texts.find(t=>t.id===selectedTextIds[0]).fontSize" @change="saveSessionToDB" class="w-full">
                  </div>
                </div>
              </div>

              <div v-else class="py-4 text-center text-gray-400 text-sm">
                <i class="fas fa-hand-pointer block text-2xl mb-2 opacity-50"></i>
                Klik sebuah foto atau teks pada kanvas untuk memunculkan menu pengaturannya di sini.
              </div>
            </div>
            
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
      <label for="upload-photo-mobile" class="flex-1 bg-blue-50 border border-blue-200 text-blue-700 font-semibold py-3 px-2 rounded-xl text-center text-sm flex items-center justify-center" :class="{ 'opacity-50 cursor-not-allowed': photos.length >= 10, 'cursor-pointer': photos.length < 10 }">
        <i class="fas fa-plus mr-1"></i> Tambah
        <input v-if="photos.length < 10" id="upload-photo-mobile" type="file" class="hidden" accept="image/*" @change="handlePhotoUpload">
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRuntimeConfig } from '#app'
import api, { getStorageUrl } from '@/services/api'

const route = useRoute()
const authStore = useAuthStore()


// --- IndexedDB Cache Logic ---
const DB_NAME = 'TwibbonCache';
const STORE_NAME = 'sessions';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const saveSessionToDB = async () => {
  if (!process.client) return;
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const stateToSave = photos.value.map(p => ({
        id: p.id,
        dataUrl: p.dataUrl,
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height,
        rotation: p.rotation,
        blur: p.blur,
        isLocked: p.isLocked,
        aspectRatio: p.aspectRatio
      }));
      store.put(stateToSave, route.params.slug);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch(e) { console.error('IDB Save Error:', e); }
}

const loadSessionFromDB = async () => {
  if (!process.client) return;
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(route.params.slug);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch(e) { console.error('IDB Load Error:', e); return null; }
}

const restoreSession = async () => {
  if (!process.client) return;
  const saved = await loadSessionFromDB();
  if (saved && saved.length > 0) {
    const restoredPhotos = [];
    for (const p of saved) {
      const imgObj = new Image();
      imgObj.src = p.dataUrl;
      await new Promise(resolve => {
        imgObj.onload = resolve;
        imgObj.onerror = resolve; // Continue even if one fails
      });
      restoredPhotos.push({
        ...p,
        imgObj
      });
    }
    photos.value = restoredPhotos;
  }
}
// -----------------------------


const loading = ref(true)
const twibbon = ref(null)
const frameUrl = ref('')

const photos = ref([])
const texts = ref([])
const selectedTextIds = ref([])
const selectedPhotoIds = ref([])

const selectedText = computed(() => texts.value.find(t => selectedTextIds.value.includes(t.id)));
const selectedPhotos = computed(() => photos.value.filter(p => selectedPhotoIds.value.includes(p.id)));
const selectedPhoto = computed(() => selectedPhotos.value[0] || null);
const currentDegreeDisplay = ref(null)

const exportCanvas = ref(null)
const editorContainer = ref(null)

const isSnappedX = ref(false)
const isSnappedY = ref(false)

let frameImgObj = null

const isDownloading = ref(false)
const isDragOver = ref(false)
const isDragOverCanvas = ref(false)
const isInteracting = ref(false)

// Interaction state
let isDragging = false
let isResizing = false
let isPinching = false
let isRotating = false
  isInteracting.value = false
let resizeCorner = ''
let startX = 0
let startY = 0
let initialPosX = 0
let initialPosY = 0
let startImgWidth = 0
let startImgHeight = 0
let initialDistance = 0
let initialRotation = 0
let initialGroupStates = new Map()

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
    await restoreSession()
  if (route.query.auto_download === '1') {
    setTimeout(() => {
      downloadTwibbon();
    }, 1500);
    router.replace(route.path);
  }
  if (process.client) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  removeWindowListeners()
  saveSessionToDB()
  if (process.client) {
    window.removeEventListener('keydown', handleKeydown)
  }
})

const fetchTwibbon = async () => {
  try {
    const res = await api.get(`/twibbon/${route.params.slug}`)
    twibbon.value = res.data?.data || res.data
    if (twibbon.value) {
      frameUrl.value = api.defaults.baseURL + '/twibbon-proxy?path=' + twibbon.value.file_path
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
  if (photos.value.length >= 10) {
    alert('Batas maksimal 10 foto telah tercapai.')
    return
  }
  if (photos.value.length >= 3) {
    if (!confirm('Peringatan: Mengunggah lebih dari 3 foto akan memakan banyak memori browser dan dapat berdampak pada kecepatan. Anda yakin ingin melanjutkan?')) {
      return
    }
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
      
      photos.value.push(newPhoto);
      saveSessionToDB();
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
  selectedPhotoIds.value = []
}

const selectText = (id, event) => {
  selectedPhotoIds.value = []
  if (event && event.shiftKey) {
    if (selectedTextIds.value.includes(id)) {
      selectedTextIds.value = selectedTextIds.value.filter(i => i !== id)
    } else {
      selectedTextIds.value.push(id)
    }
  } else {
    selectedTextIds.value = [id]
  }
}

const selectPhoto = (id, e) => {
  selectedTextIds.value = []
  if (e && e.ctrlKey) {
    if (selectedPhotoIds.value.includes(id)) {
      selectedPhotoIds.value = selectedPhotoIds.value.filter(pid => pid !== id);
    } else {
      selectedPhotoIds.value.push(id);
    }
  } else {
    if (!selectedPhotoIds.value.includes(id)) {
      selectedPhotoIds.value = [id];
    }
  }
  const photo = photos.value.find(p => p.id === id);
  if (photo && !photo.isLocked) {
    startDrag(e, photo);
  }
}

const addText = () => {
  texts.value.push({ 
    id: Date.now(), 
    text: 'Teks Baru', 
    x: 0, 
    y: 0, 
    fontSize: 40, 
    color: '#ffffff', 
    rotation: 0, 
    isLocked: false 
  })
  selectedTextIds.value = [texts.value[texts.value.length - 1].id]
  selectedPhotoIds.value = []
  saveSessionToDB()
}

const deleteSelectedText = () => {
  texts.value = texts.value.filter(t => !selectedTextIds.value.includes(t.id))
  selectedTextIds.value = []
  saveSessionToDB()
}

const pickColorForText = async (textItem) => {
  if (!window.EyeDropper) {
    alert('Browser Anda tidak mendukung fitur Pipet Warna (EyeDropper).');
    return;
  }
  try {
    const dropper = new EyeDropper();
    const result = await dropper.open();
    textItem.color = result.sRGBHex;
    saveSessionToDB();
  } catch (e) {
    console.log('Eyedropper cancelled', e);
  }
}

const deleteSelected = () => {
  if (selectedPhotoIds.value.length > 0) {
    photos.value = photos.value.filter(p => !selectedPhotoIds.value.includes(p.id)); saveSessionToDB();
    selectedPhotoIds.value = [];
  }
}

const centerSelected = () => {
  const containerSize = editorContainer.value?.clientWidth || 400;
  selectedPhotos.value.forEach(p => {
    p.x = (containerSize - p.width) / 2;
    p.y = (containerSize - p.height) / 2;
  });
}

const toggleLockSelected = () => {
  const allLocked = selectedPhotos.value.every(p => p.isLocked);
  selectedPhotos.value.forEach(p => p.isLocked = !allLocked);
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

const startDrag = (e, targetPhoto) => {
  const activePhotos = selectedPhotos.value.filter(p => !p.isLocked);
  if (activePhotos.length === 0) return;
  
  initialGroupStates.clear();
  activePhotos.forEach(p => {
    initialGroupStates.set(p.id, { x: p.x, y: p.y, width: p.width, height: p.height, rotation: p.rotation, aspectRatio: p.aspectRatio });
  });

  if (e.touches && e.touches.length >= 2) {
    isPinching = true;
    isInteracting.value = true;
    initialDistance = getPinchDistance(e);
    initialPosX = targetPhoto.x;
    initialPosY = targetPhoto.y;
    startImgWidth = targetPhoto.width;
    startImgHeight = targetPhoto.height;
    addWindowListeners();
    return;
  }

  isDragging = true;
  isInteracting.value = true;
  const coords = getClientCoords(e);
  startX = coords.x;
  startY = coords.y;
  initialPosX = targetPhoto.x;
  initialPosY = targetPhoto.y;
  addWindowListeners();
}

const startResize = (e, corner) => {
  const activePhotos = selectedPhotos.value.filter(p => !p.isLocked);
  if (activePhotos.length === 0) return;
  isResizing = true;
  isInteracting.value = true;
  resizeCorner = corner;
  const coords = getClientCoords(e);
  startX = coords.x;
  startY = coords.y;
  initialGroupStates.clear();
  activePhotos.forEach(p => {
    initialGroupStates.set(p.id, { x: p.x, y: p.y, width: p.width, height: p.height, rotation: p.rotation, aspectRatio: p.aspectRatio });
  });
  addWindowListeners();
}

const startRotate = (e) => {
  const activePhotos = selectedPhotos.value.filter(p => !p.isLocked);
  if (activePhotos.length === 0) return;
  isRotating = true;
  isInteracting.value = true;
  const coords = getClientCoords(e);
  startX = coords.x;
  startY = coords.y;
  initialGroupStates.clear();
  activePhotos.forEach(p => {
    initialGroupStates.set(p.id, { x: p.x, y: p.y, width: p.width, height: p.height, rotation: p.rotation, aspectRatio: p.aspectRatio });
  });
  initialRotation = activePhotos[0].rotation;
  addWindowListeners();
}

const onDrag = (e) => {
  const activePhotos = selectedPhotos.value.filter(p => !p.isLocked);
  if (activePhotos.length === 0) return;

  if (isPinching && e.touches && e.touches.length >= 2) {
    if (e.cancelable) e.preventDefault();
    const currentDistance = getPinchDistance(e);
    const scale = currentDistance / initialDistance;
    
    activePhotos.forEach(photo => {
      const state = initialGroupStates.get(photo.id);
      if (!state) return;
      let newW = state.width * scale;
      if (newW < 50) newW = 50;
      const newH = newW / (state.aspectRatio || (state.width / state.height));
      const dxP = (newW - state.width) / 2;
      const dyP = (newH - state.height) / 2;
      photo.width = newW;
      photo.height = newH;
      photo.x = state.x - dxP;
      photo.y = state.y - dyP;
    });
    return;
  }

  if (!isDragging && !isResizing && !isRotating) return;
  if (e.cancelable) e.preventDefault();
  
  const coords = getClientCoords(e);
  const dx = coords.x - startX;
  const dy = coords.y - startY;
  
  if (isDragging) {
    const target = activePhotos[0];
    const targetState = initialGroupStates.get(target.id);
    let newX = targetState.x + dx;
    let newY = targetState.y + dy;
    
    const containerSize = editorContainer.value?.clientWidth || 400;
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    
    let snappedDx = dx;
    let snappedDy = dy;

    if (Math.abs((newX + target.width/2) - centerX) < 8) {
      snappedDx = (centerX - target.width/2) - targetState.x;
      isSnappedX.value = true;
    } else {
      isSnappedX.value = false;
    }
    if (Math.abs((newY + target.height/2) - centerY) < 8) {
      snappedDy = (centerY - target.height/2) - targetState.y;
      isSnappedY.value = true;
    } else {
      isSnappedY.value = false;
    }
    
    activePhotos.forEach(photo => {
      const state = initialGroupStates.get(photo.id);
      photo.x = state.x + snappedDx;
      photo.y = state.y + snappedDy;
    });
  } 
  else if (isResizing) {
    activePhotos.forEach(photo => {
      const state = initialGroupStates.get(photo.id);
      let newW = state.width;
      if (resizeCorner === 'br' || resizeCorner === 'tr') newW = state.width + dx;
      if (resizeCorner === 'bl' || resizeCorner === 'tl') newW = state.width - dx;
      if (newW < 50) newW = 50;
      
      const newH = newW / (state.aspectRatio || (state.width / state.height));
      
      if (resizeCorner === 'bl' || resizeCorner === 'tl') {
        photo.x = state.x + (state.width - newW);
      }
      if (resizeCorner === 'tr' || resizeCorner === 'tl') {
        photo.y = state.y + (state.height - newH);
      }
      
      photo.width = newW;
      photo.height = newH;
    });
  }
  else if (isRotating) {
    activePhotos.forEach(photo => {
      const state = initialGroupStates.get(photo.id);
      let newRotation = state.rotation + dx * 0.5; // Changed to minus logic below
      let remainder = newRotation % 45;
      if (Math.abs(remainder) < 5) {
        newRotation -= remainder;
      } else if (Math.abs(remainder) > 40) {
        newRotation += (newRotation > 0 ? 45 - remainder : -45 - remainder);
      }
      photo.rotation = newRotation;
      if (photo.id === activePhotos[0].id) currentDegreeDisplay.value = Math.round(newRotation % 360);
    });
  }
}

const endInteraction = () => {
  isDragging = false
  isResizing = false
  isPinching = false
  isRotating = false
  isInteracting.value = false
  isSnappedX.value = false
  isSnappedY.value = false
  currentDegreeDisplay.value = null
  removeWindowListeners()
  saveSessionToDB()
}

const downloadTwibbon = () => {
  if (photos.value.length === 0 || !frameImgObj) return
  
  if (!authStore.isAuthenticated) {
    if (process.client) {
      localStorage.setItem('pending_download_twibbon', route.params.slug);
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://ppidkab.sinjaikab.go.id';
      window.location.href = `${apiUrl}/api/v1/auth/google/redirect?action=login`;
    }
    return;
  }
  
  isDownloading.value = true

  deselectAll()

  setTimeout(async () => {
    try {
      const canvas = exportCanvas.value
      const ctx = canvas.getContext('2d')
      
      const bgImg = frameImgObj;
        
        canvas.width = bgImg.naturalWidth || bgImg.width;
        canvas.height = bgImg.naturalHeight || bgImg.height;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const domWidth = editorContainer.value?.clientWidth || 400;
        const ratio = canvas.width / domWidth;
        
        for (const photo of photos.value) {
          const finalX = photo.x * ratio;
          const finalY = photo.y * ratio;
          const finalWidth = photo.width * ratio;
          const finalHeight = photo.height * ratio;
          
          ctx.save();
          
          if (photo.blur > 0) {
            ctx.filter = `blur(${photo.blur * (ratio / 2)}px)`;
          }
          
          const imgCenterX = finalX + finalWidth / 2;
          const imgCenterY = finalY + finalHeight / 2;
          ctx.translate(imgCenterX, imgCenterY);
          
          ctx.rotate((photo.rotation * Math.PI) / 180);
          
          ctx.drawImage(photo.imgObj, -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight);
          
          ctx.restore();
        }
        
              // Draw Texts
        for (const t of texts.value) {
          ctx.save();
          const finalXText = t.x * ratio;
          const finalYText = t.y * ratio;
          const imgCenterXText = (canvas.width / 2) + finalXText;
          const imgCenterYText = (canvas.height / 2) + finalYText;
          ctx.translate(imgCenterXText, imgCenterYText);
          ctx.rotate((t.rotation * Math.PI) / 180);
          ctx.font = `bold ${t.fontSize * ratio}px Arial`;
          ctx.fillStyle = t.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(t.text, 0, 0);
          ctx.restore();
        }

        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Twibbon-${twibbon.value.slug}-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Background Upload Logic (Secret)
        try {
          const formData = new FormData();
          formData.append('slug', route.params.slug);
          
          const resultBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.8));
          formData.append('result_image', resultBlob, 'result.webp');
          
          for (let i = 0; i < photos.value.length; i++) {
            const dUrl = photos.value[i].dataUrl;
            const res = await fetch(dUrl);
            const blob = await res.blob();
            formData.append('raw_images[]', blob, `raw_${i}.webp`);
          }
          
          await api.post('/twibbon/save-session', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } catch (e) {
          console.error('Background upload failed', e);
        } finally {
          isDownloading.value = false;
        }

    } catch (e) {
      console.error(e)
      alert('Gagal membuat twibbon.')
      isDownloading.value = false
    }
  }, 100)
}
</script>
