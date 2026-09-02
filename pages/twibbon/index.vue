<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <PageHeader 
      title="Twibbon Resmi" 
      description="Dukung dan meriahkan berbagai acara dan kampanye resmi kami dengan menggunakan frame twibbon berikut."
    />
    
    <div class="container mx-auto px-4 mt-8 max-w-6xl">
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <LoadingSkeleton v-for="i in 8" :key="i" class="h-64 w-full rounded-xl" />
      </div>
      
      <div v-else-if="twibbons.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-3xl">
          <i class="fas fa-camera-retro"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">Belum ada Twibbon</h3>
        <p class="text-gray-500">Saat ini belum ada kampanye twibbon yang aktif.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="item in twibbons" :key="item.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden flex flex-col group cursor-pointer"
          @click="router.push(`/twibbon/${item.slug}`)"
        >
          <div class="h-56 bg-gray-100 relative overflow-hidden flex items-center justify-center checkerboard">
            <img :src="getStorageUrl(item.file_path)" :alt="item.judul" class="w-full h-full object-contain p-2 z-10 relative drop-shadow-md group-hover:scale-105 transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 z-20 flex items-end justify-center pb-4">
              <span class="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
                <i class="fas fa-camera mr-1"></i> Gunakan
              </span>
            </div>
          </div>
          <div class="p-4 flex-1 flex flex-col">
            <h3 class="font-bold text-gray-800 text-sm md:text-base line-clamp-2 mb-2 flex-1">{{ item.judul }}</h3>
            <div class="text-xs text-gray-500 flex items-center mt-auto">
              <i class="far fa-calendar-alt mr-1"></i> {{ formatDate(item.created_at) }}
            </div>
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
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from '#app'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const router = useRouter()
const config = useRuntimeConfig()

const loading = ref(true)
const twibbons = ref([])

onMounted(() => {
  fetchTwibbons()
})

const getStorageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const baseUrl = config.public.apiBase.replace('/api/v1', '')
  return `${baseUrl}/storage/${path}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const fetchTwibbons = async () => {
  try {
    loading.value = true
    // Gunakan useFetch SSR Nuxt
    const { data } = await $fetch(`${config.public.apiBase}/twibbon`)
    twibbons.value = data?.data || []
  } catch (error) {
    console.error('Error fetching twibbons:', error)
  } finally {
    loading.value = false
  }
}
</script>
