<template>
  <div class="laporan-page">
    <PageHeader title="Laporan PPID" />
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingSkeleton v-for="i in 6" :key="i" class="h-64 w-full rounded-xl" />
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in items" :key="item.id" class="bg-white rounded-xl shadow-md overflow-hidden border flex flex-col group">
          <div class="h-40 bg-blue-100 flex items-center justify-center relative overflow-hidden">
            <i class="fas fa-file-invoice text-6xl text-blue-300 transform group-hover:scale-110 transition duration-300"></i>
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div class="absolute bottom-3 left-4 text-white font-bold">{{ item.year }}</div>
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ item.title }}</h3>
            <p class="text-sm text-gray-600 mb-4 flex-1">{{ item.description }}</p>
            <a v-if="item.file" :href="getStorageUrl(item.file)" target="_blank" class="w-full text-center px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded hover:bg-blue-600 hover:text-white transition">
              <i class="fas fa-download mr-2"></i> Unduh Dokumen
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api, { getStorageUrl } from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const items = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/laporan')
    items.value = res.data.data.data || res.data.data
  } catch (error) {
    console.error('Error fetching laporan:', error)
  } finally {
    loading.value = false
  }
})
</script>
