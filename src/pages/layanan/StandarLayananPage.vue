<template>
  <div class="standar-layanan-page">
    <PageHeader title="Standar Layanan PPID" />
    <div class="container mx-auto px-4 py-8">
      <Breadcrumbs :breadcrumbs="getBreadcrumbs.standarLayanan()" class="mb-6" />
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LoadingSkeleton v-for="i in 6" :key="i" class="h-40 w-full rounded-lg" />
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link 
          v-for="item in items" 
          :key="item.id" 
          :to="`/layanan/standar-layanan/${item.slug}`"
          class="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600 hover:shadow-xl transition flex items-start space-x-4 group"
        >
          <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
            <i class="fas fa-file-alt text-xl"></i>
          </div>
          <div>
            <h3 class="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">{{ item.title }}</h3>
            <p class="text-sm text-gray-500 line-clamp-2">{{ item.description }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { ref, onMounted } from 'vue'
import api from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const items = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/layanan/standar-layanan')
    items.value = res.data.data.data || res.data.data
  } catch (error) {
    console.error('Error fetching standar layanan:', error)
  } finally {
    loading.value = false
  }
})
</script>
