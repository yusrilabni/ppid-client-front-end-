<template>
  <div class="maklumat-layanan-page">
    <PageHeader title="Maklumat Layanan" />
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <div v-if="loading" class="bg-white rounded-2xl shadow-xl p-8 border">
        <LoadingSkeleton class="h-64 w-full" />
      </div>
      <div v-else-if="content" class="bg-white rounded-2xl shadow-xl overflow-hidden border">
        <div class="bg-blue-900 text-white p-8 text-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=')]"></div>
          <i class="fas fa-bullhorn text-5xl mb-4 relative z-10 text-yellow-400"></i>
          <h2 class="text-3xl font-bold uppercase tracking-wider relative z-10">Maklumat Layanan</h2>
          <p class="mt-2 text-blue-100 relative z-10">PPID Kabupaten Sinjai</p>
        </div>
        
        <div class="p-8 md:p-12">
          <div class="prose prose-lg prose-blue max-w-none text-center font-serif leading-relaxed text-gray-800" v-html="content.content"></div>
          
          <div v-if="content.image" class="mt-10 flex justify-center">
             <img :src="getStorageUrl(content.image)" alt="Maklumat Layanan" class="max-w-full h-auto rounded-lg shadow-md border" />
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

const content = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/layanan/maklumat')
    content.value = res.data.data
  } catch (error) {
    console.error('Error fetching maklumat:', error)
  } finally {
    loading.value = false
  }
})
</script>
