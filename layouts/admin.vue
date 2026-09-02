<script setup>
import { ref, computed } from 'vue'

import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(true)
const mobileSidebarOpen = ref(false)

const menuItems = computed(() => {
  const items = [
    { name: 'Dashboard', icon: 'fas fa-tachometer-alt', route: 'admin-dashboard' },
  ]
  if (authStore.isSuperAdmin) {
    items.push({ name: 'Twibbon', icon: 'fas fa-camera-retro', route: 'admin-twibbon' })
  }
  return items
})

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside :class="[sidebarOpen ? 'w-64' : 'w-20', 'hidden lg:flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out z-20']">
      <div class="p-4 flex items-center gap-3 border-b border-gray-700">
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <i class="fas fa-shield-alt text-white"></i>
        </div>
        <span v-show="sidebarOpen" class="font-bold text-lg truncate">PPID Admin</span>
      </div>
      <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
        <NuxtLink 
          v-for="item in menuItems" :key="item.route"
          :to="{ name: item.route }"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          active-class="!bg-blue-600 !text-white shadow-lg"
        >
          <i :class="item.icon" class="w-5 text-center"></i>
          <span v-show="sidebarOpen">{{ item.name }}</span>
        </NuxtLink>
      </nav>
      <div class="p-3 border-t border-gray-700">
        <button @click="handleLogout" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all w-full">
          <i class="fas fa-sign-out-alt w-5 text-center"></i>
          <span v-show="sidebarOpen">Keluar</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Sidebar Backdrop -->
    <div v-if="mobileSidebarOpen" class="fixed inset-0 bg-black/50 z-30 lg:hidden" @click="mobileSidebarOpen = false"></div>
    
    <!-- Mobile Sidebar -->
    <aside :class="[mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full', 'fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-transform duration-300 ease-in-out z-40 lg:hidden flex flex-col']">
      <div class="p-4 flex items-center justify-between border-b border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fas fa-shield-alt text-white"></i>
          </div>
          <span class="font-bold text-lg">PPID Admin</span>
        </div>
        <button @click="mobileSidebarOpen = false" class="text-gray-400 hover:text-white">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
        <NuxtLink 
          v-for="item in menuItems" :key="item.route"
          :to="{ name: item.route }"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          active-class="!bg-blue-600 !text-white shadow-lg"
          @click="mobileSidebarOpen = false"
        >
          <i :class="item.icon" class="w-5 text-center"></i>
          <span>{{ item.name }}</span>
        </NuxtLink>
      </nav>
      <div class="p-3 border-t border-gray-700">
        <button @click="handleLogout" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all w-full">
          <i class="fas fa-sign-out-alt w-5 text-center"></i>
          <span>Keluar</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Top Bar -->
      <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <div class="flex items-center gap-4">
          <button @click="sidebarOpen = !sidebarOpen" class="hidden lg:block text-gray-500 hover:text-gray-700">
            <i class="fas fa-bars text-lg"></i>
          </button>
          <button @click="mobileSidebarOpen = true" class="lg:hidden text-gray-500 hover:text-gray-700">
            <i class="fas fa-bars text-lg"></i>
          </button>
          <h1 class="text-lg font-semibold text-gray-800">Admin Panel</h1>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'A' }}
            </div>
            <span class="text-sm font-medium text-gray-700 hidden sm:block">{{ authStore.user?.name || 'Admin' }}</span>
          </div>
        </div>
      </header>
      <!-- Page Content -->
      <main class="flex-1 p-6 overflow-y-auto bg-gray-50">
        <slot />
      </main>
    </div>
  </div>
</template>



