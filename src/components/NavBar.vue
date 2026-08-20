<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const open = ref(false)
const searchOpen = ref(false)
const activeSubMenu = ref(null)
const searchInput = ref(null)
const searchQuery = ref('')

const toggleMobileMenu = () => {
  open.value = !open.value
  activeSubMenu.value = null
}

const openSearch = () => {
  searchOpen.value = true
  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus()
    }
  })
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value } })
    searchOpen.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'home' })
}

import api, { getStorageUrl } from '@/services/api'

const wordLimit = (str, limit = 3) => {
  if (!str) return ''
  const words = str.split(' ')
  return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '')
}

const currentYear = new Date().getFullYear()

const menus = [
  {
    title: 'Profil',
    url: '#profil',
    icon: 'user',
    children: [
      { title: 'Bupati', url: '/profil/bupati', icon: 'user-tie' },
      { title: 'Wakil Bupati', url: '/profil/wakil-bupati', icon: 'user-tie' },
      { title: 'Sekretaris Daerah', url: '/profil/sekretaris-daerah', icon: 'building' },
      { title: 'Pejabat Daerah', url: '/profil/pejabat-daerah', icon: 'user-tie' },
      { title: 'Unit Lokal', url: '/profil/unit-lokal', icon: 'map-marked-alt' },
      { title: 'PPID', url: '/profil/ppid', icon: 'info-circle' },
      { title: 'Tentang OPD', url: '/profil/tentang-opd', icon: 'building' }
    ]
  },
  {
    title: 'Jenis Informasi',
    url: '#informasi',
    icon: 'folder',
    children: [
      { title: 'Informasi Berkala', url: '/informasi/berkala', icon: 'calendar-alt' },
      { title: 'Informasi Tersedia Setiap Saat', url: '/informasi/setiap-saat', icon: 'clock' },
      { title: 'Informasi Serta Merta', url: '/informasi/serta-merta', icon: 'exclamation-triangle' },
      { title: 'Informasi Dikecualikan', url: '/informasi/dikecualikan', icon: 'ban' }
    ]
  },
  {
    title: 'DIP',
    url: '#',
    icon: 'book',
    children: [
      { title: `DIP ${currentYear}`, url: `/dip/${currentYear}`, icon: 'file-alt' },
      { title: `DIP ${currentYear - 1}`, url: `/dip/${currentYear - 1}`, icon: 'file-alt' },
      { title: `DIP ${currentYear - 2}`, url: `/dip/${currentYear - 2}`, icon: 'file-alt' },
      { title: 'DIP Unit', url: '/dipunit', icon: 'university' }
    ]
  },
  {
    title: 'Standar Layanan',
    url: '#layanan',
    icon: 'clipboard-list',
    children: [
      { title: 'Dasar Hukum', url: '/standar-layanan/dasar-hukum', icon: 'gavel' },
      { title: 'Tugas, Wewenang & Tanggung Jawab', url: '/standar-layanan/tugas-wewenang', icon: 'handshake' },
      { title: 'SOP', url: '/standar-layanan/sop', icon: 'file-alt' },
      { title: 'Maklumat Pelayanan', url: '/standar-layanan/maklumat', icon: 'bullhorn' },
      { title: 'Mekanisme & Biaya', url: '/standar-layanan/mekanisme-biaya', icon: 'money-bill-wave' }
    ]
  },
  {
    title: 'Transparansi',
    url: '#',
    icon: 'chart-bar',
    children: [
      { title: 'Permohonan Informasi', url: '/laporan/permohonan', icon: 'file-signature' },
      { title: 'Survei', url: '/laporan/survei', icon: 'poll' },
      { title: 'Laporan PPID', url: '/laporan/ppid', icon: 'chart-line' },
      { title: 'Informasi Pemkab', url: '/transparansi/informasi-pemkab', icon: 'file-pdf' }
    ]
  },
  { title: 'LHKPN', url: '/lhkpn', icon: 'file-invoice-dollar', children: [] },
  { title: 'PBJ', url: '/pbj', icon: 'shopping-cart', children: [] },
  { title: 'Login', url: '/login', icon: 'sign-in-alt', children: [] }
]
const isActive = (url) => route.path === url || route.path.startsWith(url + '/')
const hasActiveChild = (children) => children.some(child => isActive(child.url))
</script>

<template>
  <nav class="bg-white shadow-lg sticky top-0 z-[999] border-b border-blue-100"
      style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);">
      <div class="w-full">
          <!-- Tinggi navbar tetap sama -->
          <div class="flex justify-between h-16 items-center">
              <!-- Logo Section - Diperbesar dengan transform scale -->
              <div class="flex items-center flex-shrink-0 pl-4 xl:pl-6">
                  <router-link to="/" class="flex-shrink-0 flex items-center group relative">
                      <!-- Logo diperbesar dengan transform scale -->
                      <div class="transform origin-left transition-transform duration-300 group-hover:scale-105">
                          <img class="w-auto h-10 md:h-12 lg:h-14" src="/logo/ppid.webp" alt="PPID" width="160" height="40" />
                      </div>
                  </router-link>
              </div>

              <!-- Menu & Search Container (Desktop) -->
              <div class="hidden xl:flex flex-1 justify-center mx-4 min-w-0">
                  <div class="relative bg-blue-50/50 rounded-2xl border border-blue-100 transition-all duration-500 ease-in-out h-12 flex items-center px-2"
                       :class="searchOpen ? 'w-full max-w-2xl shadow-inner bg-white border-blue-200' : 'w-auto max-w-full'">
                      
                      <!-- Menu List Container -->
                      <div class="flex items-center space-x-1 whitespace-nowrap w-full justify-center transition-all duration-500 ease-in-out"
                           :class="searchOpen ? 'opacity-0 pointer-events-none scale-95 -translate-y-2' : 'opacity-100 scale-100 translate-y-0'">
                          
                          <template v-for="(menu, index) in menus" :key="index">
                              <template v-if="!(menu.title === 'DIP' && (!menu.children || menu.children.length === 0)) && menu.title !== 'Login'">
                                  <router-link v-if="!menu.children || menu.children.length === 0" 
                                      :to="menu.url"
                                      class="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border"
                                      :class="isActive(menu.url) ? 'bg-white text-blue-600 shadow-sm border-blue-200' : 'text-gray-700 hover:bg-white hover:text-blue-600 border-transparent hover:border-blue-200 hover:shadow-sm'">
                                      <i :class="['fas', 'fa-' + (menu.icon || 'circle'), 'mr-2', isActive(menu.url) ? 'text-blue-600' : 'text-blue-500']"></i>
                                      {{ menu.title }}
                                  </router-link>
                                  
                                  <div v-else class="relative flex-shrink-0" @mouseenter="activeSubMenu = index" @mouseleave="activeSubMenu = null">
                                      <button 
                                          class="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border"
                                          :class="(hasActiveChild(menu.children) || activeSubMenu === index) ? 'bg-white text-blue-600 shadow-sm border-blue-200' : 'text-gray-700 hover:bg-white hover:text-blue-600 border-transparent hover:border-blue-200 hover:shadow-sm'">
                                          <i :class="['fas', 'fa-' + (menu.icon || 'folder'), 'mr-2', hasActiveChild(menu.children) ? 'text-blue-600' : 'text-blue-500']"></i>
                                          {{ wordLimit(menu.title) }}
                                          <i class="fas fa-chevron-down h-3 w-3 ml-2 transition-transform duration-300 flex-shrink-0"
                                              :class="{ 'rotate-180': activeSubMenu === index }"></i>
                                      </button>
                                      
                                      <transition
                                          enter-active-class="transition ease-out duration-200"
                                          enter-from-class="opacity-0 translate-y-2"
                                          enter-to-class="opacity-100 translate-y-0"
                                          leave-active-class="transition ease-in duration-150"
                                          leave-from-class="opacity-100 translate-y-0"
                                          leave-to-class="opacity-0 translate-y-2">
                                          <div v-show="activeSubMenu === index"
                                              class="absolute z-[999] mt-2 w-72 rounded-lg shadow-xl bg-white border border-blue-100 min-w-max">
                                              <div class="py-1">
                                                  <router-link v-for="(child, childIndex) in menu.children" :key="childIndex"
                                                      :to="child.url"
                                                      class="flex items-center px-4 py-3 text-sm transition-all duration-200 whitespace-nowrap"
                                                      :class="isActive(child.url) ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'">
                                                      <i :class="['fas', 'fa-' + (child.icon || 'angle-right'), 'mr-3', 'text-xs', isActive(child.url) ? 'text-blue-600' : 'text-blue-400']"></i>
                                                      {{ child.title }}
                                                  </router-link>
                                              </div>
                                          </div>
                                      </transition>
                                  </div>
                              </template>
                          </template>

                          <!-- Desktop Search Trigger (Icon Only) -->
                          <button @click="openSearch" aria-label="Buka Pencarian"
                              class="flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 w-9 h-9 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 ml-2 flex-shrink-0">
                              <i class="fas fa-search text-base"></i>
                          </button>
                      </div>

                      <!-- Search Form Container -->
                      <div class="absolute inset-0 flex items-center px-2 transition-all duration-500 ease-in-out"
                           :class="searchOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'">
                          <form @submit.prevent="handleSearch" class="w-full flex items-center">
                              <div class="relative w-full">
                                  <input type="text" v-model="searchQuery" placeholder="Cari informasi, dokumen, atau OPD..." 
                                      class="w-full bg-transparent border-none py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-0 transition-all"
                                      ref="searchInput"
                                      @keydown.escape="searchOpen = false" />
                                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <i class="fas fa-search text-blue-500 text-lg"></i>
                                  </div>
                                  <button type="button" aria-label="Tutup Pencarian" @click="searchOpen = false" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                                      <i class="fas fa-times-circle text-lg"></i>
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>

              <!-- Login/User Dropdown & Mobile Menu Button -->
              <div class="flex items-center flex-shrink-0 pr-4 xl:pr-6 space-x-2">
                  <template v-if="!authStore.isAuthenticated">
                      <div class="hidden xl:block">
                          <router-link to="/login"
                              class="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                              <i class="fas fa-sign-in-alt mr-2"></i>
                              Login
                          </router-link>
                      </div>
                  </template>

                  <template v-else>
                      <!-- Authenticated User Dropdown -->
                      <div class="hidden xl:relative xl:flex items-center" @mouseenter="activeSubMenu = 'user'" @mouseleave="activeSubMenu = null">
                          <button aria-label="Menu Pengguna" class="flex items-center space-x-2 bg-blue-50 rounded-full p-1 pr-3 hover:bg-blue-100 transition-colors focus:outline-none">
                              <template v-if="authStore.user?.profile_photo_path">
                                  <img class="h-8 w-8 rounded-full object-cover"
                                      :src="getStorageUrl(authStore.user.profile_photo_path)"
                                      :alt="authStore.user.name" width="32" height="32">
                              </template>
                              <template v-else>
                                  <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                      {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                                  </div>
                              </template>
                              <div class="flex flex-col items-start">
                                  <span class="text-gray-700 text-sm font-medium">{{ wordLimit(authStore.user?.name, 3) }}</span>
                                  <span class="text-gray-500 text-xs">{{ authStore.isAdmin ? authStore.user?.nip : authStore.user?.email }}</span>
                              </div>
                              <i class="fas fa-chevron-down text-xs text-gray-500"></i>
                          </button>

                          <transition
                              enter-active-class="transition ease-out duration-200"
                              enter-from-class="opacity-0 scale-95"
                              enter-to-class="opacity-100 scale-100"
                              leave-active-class="transition ease-in duration-150"
                              leave-from-class="opacity-100 scale-100"
                              leave-to-class="opacity-0 scale-95">
                              <div v-show="activeSubMenu === 'user'"
                                  class="absolute top-full right-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[999]">
                                  <div class="py-1">
                                      <div class="px-4 py-2 border-b">
                                          <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
                                          <p class="text-xs text-gray-500">{{ authStore.isAdmin ? authStore.user?.nip : authStore.user?.email }}</p>
                                      </div>
                                      <router-link v-if="authStore.isAdmin" to="/admin/dashboard"
                                          class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                          <i class="fas fa-tachometer-alt w-5 mr-3 text-gray-400"></i>
                                          Admin Dashboard
                                      </router-link>
                                      <router-link to="/profile"
                                          class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                          <i class="fas fa-user-circle w-5 mr-3 text-gray-400"></i> Profile
                                      </router-link>
                                      <div class="border-t border-gray-100"></div>
                                      <button @click="handleLogout"
                                          class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                          <i class="fas fa-sign-out-alt w-5 mr-3 text-red-400"></i> Logout
                                      </button>
                                  </div>
                              </div>
                          </transition>
                      </div>
                  </template>

                  <div class="xl:hidden">
                      <button @click="toggleMobileMenu" aria-label="Toggle Mobile Menu" class="text-gray-700 hover:text-blue-600 focus:outline-none">
                          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path v-if="!open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M4 6h16M4 12h16M4 18h16" />
                              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="open" class="xl:hidden">
          <!-- Mobile Search -->
          <div class="px-4 pt-2 pb-3">
              <form @submit.prevent="handleSearch" class="relative">
                  <input type="text" v-model="searchQuery" placeholder="Cari informasi..." 
                      class="w-full bg-blue-50 border border-blue-100 rounded-xl py-2.5 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <i class="fas fa-search text-blue-400 text-sm"></i>
                  </div>
                  <button type="submit" aria-label="Mulai Pencarian" class="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-700">
                      <i class="fas fa-arrow-right"></i>
                  </button>
              </form>
          </div>
          <div class="pt-2 pb-3 space-y-1 sm:px-3">
              <template v-for="(menu, index) in menus" :key="index">
                  <template v-if="!(menu.title === 'Login' && authStore.isAuthenticated) && !(menu.title === 'DIP' && (!menu.children || menu.children.length === 0))">
                      <router-link v-if="!menu.children || menu.children.length === 0" 
                          :to="menu.url"
                          @click="open = false"
                          class="flex items-center py-2 px-3 text-base font-medium rounded-md"
                          :class="isActive(menu.url) ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'">
                          <i :class="['fas', 'fa-' + (menu.icon || 'circle'), 'w-6', 'mr-2', isActive(menu.url) ? 'text-blue-600' : 'text-blue-500']"></i>
                          <span>{{ wordLimit(menu.title) }}</span>
                      </router-link>
                      
                      <div v-else>
                          <button @click="activeSubMenu === index ? activeSubMenu = null : activeSubMenu = index"
                              class="w-full flex justify-between items-center py-2 px-3 text-base font-medium rounded-md"
                              :class="hasActiveChild(menu.children) ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'">
                              <span class="flex items-center">
                                  <i :class="['fas', 'fa-' + (menu.icon || 'folder'), 'w-6', 'mr-2', hasActiveChild(menu.children) ? 'text-blue-600' : 'text-blue-500']"></i>
                                  {{ menu.title }}
                              </span>
                              <i class="fas fa-chevron-down h-3 w-3 ml-2 transition-transform duration-300"
                                  :class="{ 'rotate-180': activeSubMenu === index }"></i>
                          </button>
                          <div v-show="activeSubMenu === index || hasActiveChild(menu.children)" class="pl-4">
                              <router-link v-for="(child, childIndex) in menu.children" :key="childIndex"
                                  :to="child.url"
                                  @click="open = false"
                                  class="flex items-center py-2 px-3 text-base font-medium rounded-md"
                                  :class="isActive(child.url) ? 'text-blue-700 bg-blue-50/50 font-bold' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'">
                                  <i :class="['fas', 'fa-' + (child.icon || 'angle-right'), 'w-6', 'mr-2', isActive(child.url) ? 'text-blue-600' : 'text-blue-400']"></i>
                                  <span>{{ child.title }}</span>
                              </router-link>
                          </div>
                      </div>
                  </template>
              </template>
          </div>
          <template v-if="authStore.isAuthenticated">
              <div class="pt-4 pb-3 border-t border-gray-200">
                  <div class="flex items-center px-4">
                      <div class="flex-shrink-0">
                          <template v-if="authStore.user?.profile_photo_path">
                              <img class="h-10 w-10 rounded-full object-cover"
                                  :src="getStorageUrl(authStore.user.profile_photo_path)"
                                  :alt="authStore.user.name" width="40" height="40">
                          </template>
                          <template v-else>
                              <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                  {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                              </div>
                          </template>
                      </div>

                      <div class="ml-3">
                          <div class="text-base font-medium text-gray-800">{{ wordLimit(authStore.user?.name, 3) }}</div>
                          <div class="text-sm font-medium text-gray-500">{{ authStore.isAdmin ? authStore.user?.nip : authStore.user?.email }}</div>
                      </div>
                  </div>
                  <div class="mt-3 space-y-1">
                      <router-link to="/profile" @click="open = false"
                          class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                          Profile
                      </router-link>
                      <router-link v-if="authStore.isAdmin" to="/admin/dashboard" @click="open = false"
                          class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                          Admin Dashboard
                      </router-link>
                      <button @click="handleLogout"
                          class="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                          Logout
                      </button>
                  </div>
              </div>
          </template>
      </div>
  </nav>
</template>
