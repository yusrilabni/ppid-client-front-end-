<template>
  <div class="dip-page">
    <PageHeader title="Daftar Informasi Publik (DIP)" />
    <div class="container mx-auto px-4 py-8">
      
      <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div class="flex gap-2">
          <button @click="activeTab = 'Berkala'" :class="activeTab === 'Berkala' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'" class="px-4 py-2 rounded-lg border shadow-sm transition font-medium">Informasi Berkala</button>
          <button @click="activeTab = 'Serta Merta'" :class="activeTab === 'Serta Merta' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'" class="px-4 py-2 rounded-lg border shadow-sm transition font-medium">Serta Merta</button>
          <button @click="activeTab = 'Setiap Saat'" :class="activeTab === 'Setiap Saat' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'" class="px-4 py-2 rounded-lg border shadow-sm transition font-medium">Setiap Saat</button>
        </div>
        
        <div class="relative w-full md:w-64">
          <input v-model="searchQuery" type="text" placeholder="Cari informasi..." class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <div v-if="loading" class="space-y-4">
        <LoadingSkeleton v-for="i in 5" :key="i" class="h-16 w-full rounded-lg" />
      </div>
      <div v-else class="bg-white shadow-md rounded-lg overflow-hidden border">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Informasi</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Penanggung Jawab</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Tahun</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in filteredItems" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ item.title }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ item.description }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ item.penanggung_jawab || 'PPID' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.year || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <a v-if="item.file" :href="getStorageUrl(item.file)" target="_blank" class="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded inline-flex items-center">
                    <i class="fas fa-download"></i>
                  </a>
                  <a v-else-if="item.link" :href="item.link" target="_blank" class="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded inline-flex items-center">
                    <i class="fas fa-external-link-alt"></i>
                  </a>
                  <span v-else class="text-gray-400">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filteredItems.length === 0" class="p-8 text-center text-gray-500">
          Tidak ada data untuk kategori ini.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api, { getStorageUrl } from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const items = ref([])
const loading = ref(true)
const activeTab = ref('Berkala')
const searchQuery = ref('')

const fetchDip = async () => {
  loading.value = true
  try {
    const res = await api.get('/dip')
    // Assuming backend returns all DIP items, we filter in frontend. If paginated, need adjustment.
    items.value = res.data.data.data || res.data.data
  } catch (error) {
    console.error('Error fetching DIP:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDip)

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesTab = item.category === activeTab.value
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchesTab && matchesSearch
  })
})
</script>
