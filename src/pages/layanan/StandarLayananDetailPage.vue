<template>
  <div class="standar-layanan-detail">
    <PageHeader :title="item?.title || 'Standar Layanan'" />
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div v-if="loading" class="space-y-4 bg-white p-8 rounded-xl shadow-sm border">
        <LoadingSkeleton class="h-8 w-1/2 mb-6" />
        <LoadingSkeleton v-for="i in 8" :key="i" class="h-4 w-full" />
      </div>
      <div v-else-if="item" class="bg-white p-8 md:p-12 rounded-xl shadow-sm border">
        <h2 class="text-2xl font-bold text-blue-900 mb-6 pb-4 border-b">{{ item.title }}</h2>
        <div class="prose prose-blue max-w-none text-gray-700" v-html="item.content"></div>
        
        <div v-if="item.file" class="mt-8 pt-6 border-t">
          <a :href="getStorageUrl(item.file)" target="_blank" class="inline-flex items-center px-6 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-600 hover:text-white transition shadow-sm">
            <i class="fas fa-file-pdf mr-3 text-xl"></i> Unduh Dokumen (PDF)
          </a>
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
    const res = await api.get(`/layanan/standar-layanan/${route.params.slug}`)
    item.value = res.data.data
  } catch (error) {
    console.error('Error fetching standar layanan detail:', error)
  } finally {
    loading.value = false
  }
})
</script>
