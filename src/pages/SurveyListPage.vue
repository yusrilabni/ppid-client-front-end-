<template>
  <div class="survey-list-page">
    <PageHeader title="Survei Kepuasan Masyarakat" />
    <div class="container mx-auto px-4 py-12 max-w-5xl">
      <div class="bg-blue-50 border border-blue-100 p-6 rounded-xl mb-8 flex items-start gap-4">
        <i class="fas fa-info-circle text-blue-600 text-2xl mt-1"></i>
        <div>
          <h3 class="text-lg font-bold text-blue-900 mb-1">Partisipasi Anda Sangat Berarti</h3>
          <p class="text-gray-700">Silakan isi survei di bawah ini untuk membantu kami meningkatkan kualitas layanan informasi publik di PPID Kabupaten Sinjai.</p>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoadingSkeleton v-for="i in 4" :key="i" class="h-48 w-full rounded-xl" />
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="survey in surveys" :key="survey.id" class="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold text-gray-800">{{ survey.title }}</h3>
              <span v-if="survey.is_active" class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold uppercase">Aktif</span>
              <span v-else class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-bold uppercase">Tutup</span>
            </div>
            <p class="text-gray-600 mb-6 line-clamp-3">{{ survey.description }}</p>
          </div>
          <div class="flex justify-end border-t pt-4">
            <a 
              :href="survey.link" 
              target="_blank" 
              class="px-4 py-2 rounded-lg font-medium transition"
              :class="survey.is_active ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'"
            >
              {{ survey.is_active ? 'Mulai Survei' : 'Survei Berakhir' }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const surveys = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/surveys')
    surveys.value = res.data.data.data || res.data.data
  } catch (error) {
    console.error('Error fetching surveys:', error)
  } finally {
    loading.value = false
  }
})
</script>
