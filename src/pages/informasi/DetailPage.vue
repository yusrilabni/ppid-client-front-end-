<template>
  <div class="detail-page">
    <PageHeader :title="item?.title || 'Detail Informasi'" />
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div v-if="loading" class="space-y-4">
        <LoadingSkeleton class="h-8 w-3/4" />
        <LoadingSkeleton class="h-4 w-1/4 mb-8" />
        <LoadingSkeleton class="h-64 w-full mb-8" />
        <LoadingSkeleton v-for="i in 5" :key="i" class="h-4 w-full" />
      </div>
      <div v-else-if="item" class="bg-white rounded-lg shadow-sm border p-6 md:p-10">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ item.title }}</h1>
        <div class="flex items-center text-sm text-gray-500 mb-8 space-x-4 border-b pb-4">
          <span><i class="far fa-calendar-alt mr-2"></i>{{ item.created_at }}</span>
          <span><i class="far fa-folder mr-2"></i>{{ item.category?.name }}</span>
        </div>
        
        <div v-if="item.image" class="mb-8 rounded-lg overflow-hidden">
          <img :src="getStorageUrl(item.image)" :alt="item.title" class="w-full h-auto object-cover" />
        </div>
        
        <div class="prose prose-blue max-w-none mb-8" v-html="item.content"></div>
        
        <div v-if="item.files && item.files.length > 0" class="mt-8 pt-8 border-t">
          <h3 class="text-xl font-bold mb-4">Lampiran Dokumen</h3>
          <ul class="space-y-3">
            <li v-for="file in item.files" :key="file.id">
              <a :href="getStorageUrl(file.path)" target="_blank" class="flex items-center p-3 bg-gray-50 rounded hover:bg-blue-50 hover:text-blue-600 transition">
                <i class="fas fa-file-pdf text-red-500 mr-3 text-xl"></i>
                <span class="flex-1 font-medium">{{ file.name }}</span>
                <i class="fas fa-download text-gray-400"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api, { getStorageUrl } from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const route = useRoute()
const item = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/informasi/' + route.params.slug)
    item.value = res.data.data
  } catch (error) {
    console.error('Error fetching detail:', error)
  } finally {
    loading.value = false
  }
})
</script>
