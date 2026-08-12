<script setup>
import { useAccessibilityStore } from '@/stores/accessibility'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const accStore = useAccessibilityStore()
const authStore = useAuthStore()

onMounted(() => {
  // Restore font size
  document.documentElement.style.fontSize = accStore.fontSize + 'px'
  // Fetch user if token exists
  if (authStore.token) {
    authStore.fetchUser()
  }
})
</script>

<template>
  <LoadingScreen />
  <router-view />
</template>
