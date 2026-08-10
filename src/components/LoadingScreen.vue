<script setup>
import { useLoadingStore } from '@/stores/loading'
import { getStorageUrl } from '@/services/api'
import { computed } from 'vue'

const loadingStore = useLoadingStore()
const isLoading = computed(() => loadingStore.isLoading)
const logoUrl = getStorageUrl('logo/Logo PPID With Caption.png')
</script>

<template>
  <Transition name="fade">
    <div v-if="isLoading" class="fixed inset-0 z-[9999] bg-white bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center">
      <div class="relative flex flex-col items-center">
        <!-- Logo with pulse animation -->
        <img :src="logoUrl" alt="PPID Logo" class="h-24 md:h-32 w-auto mb-8 animate-pulse drop-shadow-md" />
        
        <!-- Animated loading dots -->
        <div class="flex items-center justify-center space-x-3">
          <div class="w-3.5 h-3.5 bg-blue-600 rounded-full animate-bounce"></div>
          <div class="w-3.5 h-3.5 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-3.5 h-3.5 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
        
        <div class="mt-4 text-gray-500 font-medium tracking-widest text-sm uppercase">Memuat...</div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
