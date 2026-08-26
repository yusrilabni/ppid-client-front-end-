<template>
  <div class="galeri-page">
    <PageHeader title="Galeri PPID" />
    <div class="container mx-auto px-4 py-8">
      <Breadcrumbs :breadcrumbs="getBreadcrumbs.galeri()" class="mb-6" />
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <LoadingSkeleton v-for="i in 8" :key="i" class="h-64 w-full rounded-xl" />
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="item in items" :key="item.id" class="group relative rounded-xl overflow-hidden shadow-md cursor-pointer aspect-square">
          <img :src="getStorageUrl(item.image)" :alt="item.title" class="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
            <h3 class="text-white font-bold text-lg">{{ item.title }}</h3>
            <p class="text-gray-200 text-sm line-clamp-2 mt-1">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { ref, onMounted } from 'vue'
import api, { getStorageUrl } from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const items = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/galeri')
    items.value = res.data.data.data || res.data.data
  } catch (error) {
    console.error('Error fetching gallery:', error)
  } finally {
    loading.value = false
  }
})
</script>

