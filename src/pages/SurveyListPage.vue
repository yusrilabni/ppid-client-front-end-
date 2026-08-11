<template>
  <div class="survey-list-page bg-gray-50 min-h-screen pb-12">
    <div class="container mx-auto py-6 md:py-8 px-4">
      <div class="max-w-7xl mx-auto">
        
        <!-- Breadcrumbs (Simulation to match design) -->
        <nav class="flex mb-8 text-sm text-gray-500 font-medium">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <router-link to="/" class="inline-flex items-center hover:text-blue-600 transition-colors">
                <i class="fas fa-home mr-2"></i> Beranda
              </router-link>
            </li>
            <li>
              <div class="flex items-center">
                <i class="fas fa-chevron-right text-gray-400 mx-2 text-xs"></i>
                <span class="text-gray-400 flex items-center">
                  <i class="fas fa-poll mr-2"></i> Survei
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div class="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
            <div class="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h1 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    <i class="fas fa-poll"></i>
                    Laporan Survei Kepuasan Masyarakat
                </h1>
                <p class="text-blue-100 mt-2">Dinas Komunikasi Informatika dan Persandian Kabupaten Sinjai</p>
            </div>
            
            <div class="p-6 sm:p-8">
                <template v-if="loading">
                  <div class="flex justify-center items-center py-12">
                    <i class="fas fa-spinner fa-spin text-blue-600 text-4xl"></i>
                  </div>
                </template>
                <template v-else-if="surveys.length > 0">
                    <div v-for="survey in surveys" :key="survey.id" class="border-b border-gray-200 pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
                        <div class="flex items-center gap-2 mb-2">
                            <h2 class="text-xl md:text-2xl font-bold text-gray-800">{{ survey.title }}</h2>
                            <span v-if="survey.type === 'skm' || !survey.type" class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase">SKM</span>
                            <span v-else-if="survey.type === 'ppid'" class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full uppercase">Survei PPID</span>
                        </div>
                        <div class="prose max-w-none text-gray-600 mb-6">
                            {{ survey.description }}
                        </div>
                        
                        <div class="flex items-center space-x-4">
                            <a :href="getAssetUrl('surveys/' + survey.id)" target="_blank" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition duration-150 ease-in-out">
                                <i class="fas fa-poll-h mr-2"></i>
                                Isi Survei Sekarang
                            </a>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="text-center py-12">
                        <i class="fas fa-clipboard-list text-gray-300 text-6xl mb-4"></i>
                        <h3 class="text-xl font-medium text-gray-900">Belum Ada Survei Aktif</h3>
                        <p class="text-gray-500 mt-2">Saat ini belum ada survei yang sedang aktif.</p>
                    </div>
                </template>
                
                <div class="mt-8 pt-8 border-t border-gray-100">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Tentang Survei Kepuasan Masyarakat</h3>
                    <p class="text-gray-600 text-sm leading-relaxed mb-4">
                        Survei Kepuasan Masyarakat (SKM) adalah kegiatan pengukuran secara komprehensif tentang tingkat kepuasan masyarakat terhadap kualitas layanan yang diberikan oleh penyelenggara pelayanan publik.
                    </p>
                    <p class="text-gray-600 text-sm leading-relaxed">
                        Tujuannya adalah untuk mengetahui kelemahan atau kekurangan dari masing-masing unsur dalam penyelenggara pelayanan publik dan sebagai bahan penetapan kebijakan yang perlu diambil dan upaya tindak lanjut yang perlu dilakukan demi peningkatan kualitas pelayanan publik.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api, { getAssetUrl } from '@/services/api'

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
