<template>
  <div class="regulasi-page">
    <PageHeader title="Regulasi" />
    <div class="container mx-auto px-4 py-8">
      <Breadcrumbs :breadcrumbs="getBreadcrumbs.regulasi()" class="mb-6" />
      <div v-if="loading" class="space-y-4">
        <LoadingSkeleton v-for="i in 5" :key="i" class="h-20 w-full rounded-lg" />
      </div>
      <div v-else class="bg-white shadow-md rounded-lg overflow-hidden border">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Regulasi</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Tahun</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ item.title }}</div>
                  <div class="text-sm text-gray-500">{{ item.category }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.year || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <a v-if="item.file" :href="getStorageUrl(item.file)" target="_blank" class="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded inline-flex items-center">
                    <i class="fas fa-download mr-1"></i> Unduh
                  </a>
                  <span v-else class="text-gray-400 italic">File tidak tersedia</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="items.length === 0" class="p-8 text-center text-gray-500">
          Tidak ada data regulasi.
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
    const res = await api.get('/regulasi')
    items.value = res.data.data.data || res.data.data
  } catch (error) {
    console.error('Error fetching regulasi:', error)
  } finally {
    loading.value = false
  }
})
</script>

