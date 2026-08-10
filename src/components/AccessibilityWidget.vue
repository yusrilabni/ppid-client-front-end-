<script setup>
import { ref } from 'vue'
import { useAccessibilityStore } from '@/stores/accessibility'

const accStore = useAccessibilityStore()
const isOpen = ref(false)

const toggleWidget = () => {
  isOpen.value = !isOpen.value
}

const toggleMasterSound = () => {
  accStore.masterSound = !accStore.masterSound
}

const resetAll = () => {
  accStore.reset()
}
</script>

<template>
  <div class="fixed bottom-6 left-6 z-[99999] flex flex-col items-start gap-4">
    <!-- Master Sound Toggle -->
    <button 
      @click="toggleMasterSound"
      class="w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      :class="accStore.masterSound ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
      :title="accStore.masterSound ? 'Matikan Suara' : 'Nyalakan Suara'"
    >
      <i class="fas" :class="accStore.masterSound ? 'fa-volume-up' : 'fa-volume-mute'"></i>
    </button>

    <!-- Expandable Panel -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-8 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-8 scale-95"
    >
      <div v-if="isOpen" class="bg-white rounded-2xl shadow-2xl w-80 max-h-[70vh] flex flex-col overflow-hidden border border-gray-100">
        <!-- Header -->
        <div class="bg-blue-600 px-4 py-3 flex items-center justify-between text-white">
          <div class="flex items-center gap-2 font-semibold">
            <i class="fas fa-universal-access text-lg"></i>
            <span>Menu Aksesibilitas</span>
          </div>
          <button @click="isOpen = false" class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
          
          <!-- TTS Controls -->
          <div class="grid grid-cols-2 gap-2">
            <button 
              @click="accStore.clickToRead = !accStore.clickToRead"
              class="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all text-xs text-center font-medium"
              :class="accStore.clickToRead ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300 text-gray-600'"
            >
              <i class="fas fa-hand-pointer text-lg"></i>
              <span>Klik untuk Baca</span>
              <i v-if="accStore.clickToRead" class="fas fa-check-circle absolute top-2 right-2 text-blue-500"></i>
            </button>
            <button 
              @click="accStore.hoverToRead = !accStore.hoverToRead"
              class="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all text-xs text-center font-medium relative"
              :class="accStore.hoverToRead ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300 text-gray-600'"
            >
              <i class="fas fa-mouse-pointer text-lg"></i>
              <span>Arahkan Baca</span>
              <i v-if="accStore.hoverToRead" class="fas fa-check-circle absolute top-2 right-2 text-blue-500"></i>
            </button>
          </div>

          <!-- Feature List -->
          <div class="space-y-2">
            <button 
              @click="accStore.cycleContrast()"
              class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"
              :class="accStore.contrast !== 'default' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3" :class="accStore.contrast !== 'default' ? 'text-blue-700' : 'text-gray-700'">
                <i class="fas fa-adjust w-5 text-center"></i>
                <span class="text-sm font-medium">Kontras</span>
              </div>
              <span class="text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-gray-100 uppercase" :class="accStore.contrast !== 'default' ? 'text-blue-600' : 'text-gray-500'">{{ accStore.contrast }}</span>
            </button>

            <button 
              @click="accStore.cycleTextSize()"
              class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"
              :class="accStore.textSize !== 'normal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3" :class="accStore.textSize !== 'normal' ? 'text-blue-700' : 'text-gray-700'">
                <i class="fas fa-text-height w-5 text-center"></i>
                <span class="text-sm font-medium">Ukuran Teks</span>
              </div>
              <span class="text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-gray-100 uppercase" :class="accStore.textSize !== 'normal' ? 'text-blue-600' : 'text-gray-500'">{{ accStore.textSize }}</span>
            </button>
            
            <button 
              @click="accStore.highlightLinks = !accStore.highlightLinks"
              class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all relative"
              :class="accStore.highlightLinks ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3" :class="accStore.highlightLinks ? 'text-blue-700' : 'text-gray-700'">
                <i class="fas fa-link w-5 text-center"></i>
                <span class="text-sm font-medium">Sorot Tautan</span>
              </div>
              <i v-if="accStore.highlightLinks" class="fas fa-check text-blue-500"></i>
            </button>

            <button 
              @click="accStore.textSpacing = !accStore.textSpacing"
              class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all relative"
              :class="accStore.textSpacing ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3" :class="accStore.textSpacing ? 'text-blue-700' : 'text-gray-700'">
                <i class="fas fa-arrows-alt-h w-5 text-center"></i>
                <span class="text-sm font-medium">Jarak Teks</span>
              </div>
              <i v-if="accStore.textSpacing" class="fas fa-check text-blue-500"></i>
            </button>

            <button 
              @click="accStore.hideImages = !accStore.hideImages"
              class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all relative"
              :class="accStore.hideImages ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3" :class="accStore.hideImages ? 'text-blue-700' : 'text-gray-700'">
                <i class="fas fa-image w-5 text-center"></i>
                <span class="text-sm font-medium">Sembunyikan Gambar</span>
              </div>
              <i v-if="accStore.hideImages" class="fas fa-check text-blue-500"></i>
            </button>
            
            <button 
              @click="accStore.cycleDyslexic()"
              class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"
              :class="accStore.dyslexicFont !== 'default' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3" :class="accStore.dyslexicFont !== 'default' ? 'text-blue-700' : 'text-gray-700'">
                <i class="fas fa-font w-5 text-center"></i>
                <span class="text-sm font-medium">Ramah Disleksia</span>
              </div>
              <span class="text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-gray-100 uppercase" :class="accStore.dyslexicFont !== 'default' ? 'text-blue-600' : 'text-gray-500'">{{ accStore.dyslexicFont }}</span>
            </button>

            <button 
              @click="accStore.cycleFocusMode()"
              class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"
              :class="accStore.focusMode !== 'default' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3" :class="accStore.focusMode !== 'default' ? 'text-blue-700' : 'text-gray-700'">
                <i class="fas fa-crosshairs w-5 text-center"></i>
                <span class="text-sm font-medium">Mode Fokus</span>
              </div>
              <span class="text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-gray-100 uppercase" :class="accStore.focusMode !== 'default' ? 'text-blue-600' : 'text-gray-500'">{{ accStore.focusMode }}</span>
            </button>

            <button 
              @click="accStore.keyboardNavigation = !accStore.keyboardNavigation"
              class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all relative"
              :class="accStore.keyboardNavigation ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3" :class="accStore.keyboardNavigation ? 'text-blue-700' : 'text-gray-700'">
                <i class="fas fa-keyboard w-5 text-center"></i>
                <span class="text-sm font-medium">Navigasi Keyboard</span>
              </div>
              <i v-if="accStore.keyboardNavigation" class="fas fa-check text-blue-500"></i>
            </button>
            
            <button 
              @click="accStore.cycleTextAlign()"
              class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"
              :class="accStore.textAlign !== 'default' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3" :class="accStore.textAlign !== 'default' ? 'text-blue-700' : 'text-gray-700'">
                <i class="fas fa-align-left w-5 text-center"></i>
                <span class="text-sm font-medium">Perataan Teks</span>
              </div>
              <span class="text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-gray-100 uppercase" :class="accStore.textAlign !== 'default' ? 'text-blue-600' : 'text-gray-500'">{{ accStore.textAlign }}</span>
            </button>
            
            <button 
              @click="accStore.cycleSaturation()"
              class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"
              :class="accStore.saturation !== 'default' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3" :class="accStore.saturation !== 'default' ? 'text-blue-700' : 'text-gray-700'">
                <i class="fas fa-palette w-5 text-center"></i>
                <span class="text-sm font-medium">Saturasi</span>
              </div>
              <span class="text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-gray-100 uppercase" :class="accStore.saturation !== 'default' ? 'text-blue-600' : 'text-gray-500'">{{ accStore.saturation }}</span>
            </button>

            <button 
              @click="accStore.highlightHeadings = !accStore.highlightHeadings"
              class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all relative"
              :class="accStore.highlightHeadings ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3" :class="accStore.highlightHeadings ? 'text-blue-700' : 'text-gray-700'">
                <i class="fas fa-heading w-5 text-center"></i>
                <span class="text-sm font-medium">Sorot Judul</span>
              </div>
              <i v-if="accStore.highlightHeadings" class="fas fa-check text-blue-500"></i>
            </button>
            
            <button 
              @click="accStore.lineHeight = !accStore.lineHeight"
              class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all relative"
              :class="accStore.lineHeight ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <div class="flex items-center gap-3" :class="accStore.lineHeight ? 'text-blue-700' : 'text-gray-700'">
                <i class="fas fa-ruler-vertical w-5 text-center"></i>
                <span class="text-sm font-medium">Tinggi Baris</span>
              </div>
              <i v-if="accStore.lineHeight" class="fas fa-check text-blue-500"></i>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 border-t border-gray-100 bg-gray-50">
          <button @click="resetAll" class="w-full py-2.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
            <i class="fas fa-undo"></i> Atur Ulang Semua
          </button>
        </div>
      </div>
    </transition>

    <!-- Main Button -->
    <button 
      @click="toggleWidget"
      class="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 group border-2 border-white"
    >
      <i class="fas fa-universal-access text-2xl group-hover:rotate-12 transition-transform"></i>
    </button>
  </div>
</template>
