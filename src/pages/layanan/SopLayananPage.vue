<template>
  <div class="sop-layanan-page">
    <PageHeader title="SOP Layanan Informasi Publik" />
    <div class="container mx-auto px-4 py-12 max-w-5xl">
      <div v-if="loading" class="space-y-4">
        <LoadingSkeleton v-for="i in 4" :key="i" class="h-24 w-full rounded-lg" />
      </div>
      <div v-else class="space-y-6">
        <div v-for="(item, index) in items" :key="item.id" class="bg-white rounded-xl shadow-md border-l-4 border-blue-600 overflow-hidden hover:shadow-lg transition">
          <div class="p-6 flex flex-col md:flex-row items-center gap-6">
            <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold">
              {{ index + 1 }}
            </div>
            <div class="flex-1 text-center md:text-left">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ item.title }}</h3>
              <p class="text-gray-600 line-clamp-2">{{ item.description }}</p>
            </div>
            <div class="flex-shrink-0">
              <a v-if="item.file" :href="getStorageUrl(item.file)" target="_blank" class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition">
                <i class="fas fa-download mr-2"></i> Unduh SOP
              </a>
            </div>
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
    const res = await api.get('/layanan/sop')
    items.value = res.data.data.data || res.data.data
  } catch (error) {
    console.error('Error fetching SOP:', error)
  } finally {
    loading.value = false
  }
})
</script>
