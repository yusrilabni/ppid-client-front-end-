<template>
  <div class="search-page">
    <PageHeader title="Pencarian Informasi" />
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <input 
          v-model="query" 
          @keyup.enter="search"
          type="text" 
          placeholder="Cari informasi..." 
          class="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button @click="search" class="ml-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Cari</button>
      </div>

      <div v-if="loading" class="space-y-4">
        <LoadingSkeleton v-for="i in 3" :key="i" class="h-24 w-full" />
      </div>
      <div v-else-if="results.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in results" :key="item.id" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 class="text-xl font-semibold mb-2 text-blue-800">{{ item.title }}</h3>
          <p class="text-gray-600 mb-4 line-clamp-3">{{ item.description }}</p>
          <router-link :to="`/informasi/${item.slug}`" class="text-blue-600 hover:underline">Baca selengkapnya</router-link>
        </div>
      </div>
      <div v-else-if="searched" class="text-center text-gray-500 py-12">
        Tidak ditemukan informasi dengan kata kunci "{{ query }}"
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const route = useRoute()
const router = useRouter()
const query = ref(route.query.q || '')
const results = ref([])
const loading = ref(false)
const searched = ref(false)

const search = async () => {
  if (!query.value.trim()) return
  
  loading.value = true
  searched.value = true
  router.replace({ query: { q: query.value } })
  
  try {
    const res = await api.get('/informasi', { params: { search: query.value } })
    results.value = res.data.data.data || res.data.data // Adjust based on pagination
  } catch (error) {
    console.error('Error fetching search results:', error)
  } finally {
    loading.value = false
  }
}

if (query.value) {
  search()
}
</script>
