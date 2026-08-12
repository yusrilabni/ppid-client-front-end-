<script setup>
import { useAccessibilityStore } from '@/stores/accessibility'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import { onMounted, onUnmounted } from 'vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const accStore = useAccessibilityStore()
const authStore = useAuthStore()
const loadingStore = useLoadingStore()

// Safety net: saat user kembali ke tab, paksa hentikan loading overlay
// Mencegah layar putih yang stuck karena loadingCount tidak pernah kembali ke 0
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    // Beri jeda singkat agar Vue Query sempat settle
    setTimeout(() => {
      loadingStore.forceStop()
    }, 100)
  }
}

onMounted(() => {
  // Restore font size
  document.documentElement.style.fontSize = accStore.fontSize + 'px'
  // Fetch user if token exists
  if (authStore.token) {
    authStore.fetchUser()
  }
  // Prevent stuck loading overlay on tab switch
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <LoadingScreen />
  <router-view />
</template>
