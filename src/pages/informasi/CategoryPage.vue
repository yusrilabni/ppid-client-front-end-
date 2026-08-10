<template>
  <div class="category-page">
    <PageHeader :title="`Informasi ${categoryName}`" />
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingSkeleton v-for="i in 6" :key="i" class="h-48 w-full" />
      </div>
      <div v-else-if="items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in items" :key="item.id" class="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600 hover:shadow-lg transition">
          <h3 class="text-xl font-bold mb-2 text-gray-800">{{ item.title }}</h3>
          <p class="text-sm text-gray-500 mb-4">{{ item.created_at }}</p>
          <router-link :to="`/informasi/${item.slug}`" class="inline-block mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition">
            Lihat Detail
          </router-link>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
        Belum ada informasi dalam kategori ini.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const route = useRoute()
const category = computed(() => route.params.category)
const categoryName = computed(() => category.value.charAt(0).toUpperCase() + category.value.slice(1).replace(/-/g, ' '))
const items = ref([])
const loading = ref(true)

const fetchInformasi = async () => {
  loading.value = true
  try {
    const res = await api.get('/informasi', { params: { category: category.value } })
    items.value = res.data.data.data || res.data.data
  } catch (error) {
    console.error('Error fetching informasi:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchInformasi)
watch(category, fetchInformasi)
</script>
