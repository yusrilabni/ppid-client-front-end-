<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white pt-12 pb-20 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
            <svg class="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
            </svg>
        </div>
        
        <div class="container mx-auto px-6 relative z-10">
            <div class="mb-6 pbj-breadcrumbs">
                <Breadcrumbs :breadcrumbs="[
                    { title: 'Beranda', url: '/', icon: 'fas fa-home' },
                    { title: 'Pengadaan Barang & Jasa', url: '/pbj', icon: 'fas fa-shopping-cart' },
                ]" />
            </div>

            <div class="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">Informasi PBJ</h1>
                    <p class="text-blue-100 text-lg max-w-2xl leading-relaxed">
                        Transparansi Pengadaan Barang dan Jasa Pemerintah Kabupaten Sinjai.
                    </p>
                </div>
                
                <!-- Year Filter -->
                <div class="w-full md:w-64 relative" style="z-index: 100;">
                  <label class="block text-[10px] font-black text-blue-200 mb-2 uppercase tracking-[0.2em] ml-2">Tahun PBJ</label>
                  <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                    <CustomSelect 
                      v-model="selectedYear"
                      :options="yearOptions"
                      :searchable="false"
                      placeholder="Pilih Tahun"
                    />
                  </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-6 -mt-8 relative z-20">
      
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="space-y-6">
        <div v-for="i in 5" :key="i" class="bg-white rounded-3xl h-24 border border-gray-100 shadow-sm animate-pulse"></div>
      </div>
      
      <!-- Data Sections -->
      <div v-else-if="questions.length > 0" class="bg-white rounded-3xl shadow-xl shadow-blue-900/5 overflow-hidden border border-gray-100">
        <div class="p-8">
            <div class="space-y-8">
                <PbjQuestionItem 
                    v-for="(question, index) in questions" 
                    :key="question.id" 
                    :question="question" 
                    :index="index + 1"
                />
            </div>
        </div>
      </div>

      <!-- No Data -->
      <div v-else class="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-3xl">
          <i class="fas fa-search-minus"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">Data Tidak Ditemukan</h3>
        <p class="text-gray-500">Belum ada data Pengadaan Barang dan Jasa untuk tahun yang dipilih.</p>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import PbjQuestionItem from '@/components/PbjQuestionItem.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const selectedYear = ref('')

const { data: yearsResponse } = useQuery({
  queryKey: ['pbj-years'],
  queryFn: async () => {
    const res = await api.get('/pbj/years')
    return res.data
  }
})

const yearOptions = computed(() => {
  const years = yearsResponse.value?.data || []
  return years.map(y => ({ value: String(y), label: `Tahun ${y}` }))
})

// Auto-select latest year when years are loaded
watch(yearOptions, (newOptions) => {
  if (newOptions.length > 0 && !selectedYear.value) {
    selectedYear.value = newOptions[0].value
  }
}, { immediate: true })

const { data: pbjResponse, isLoading } = useQuery({
  queryKey: computed(() => ['pbj', selectedYear.value]),
  queryFn: async () => {
    const res = await api.get('/pbj', { params: { year: selectedYear.value } })
    return res.data
  },
  enabled: computed(() => !!selectedYear.value) // Only fetch when year is selected
})

useGlobalLoader(isLoading)

const questions = computed(() => pbjResponse.value?.data?.questions || [])
</script>

<style scoped>
::v-deep(.pbj-breadcrumbs a), 
::v-deep(.pbj-breadcrumbs span), 
::v-deep(.pbj-breadcrumbs i) {
    color: rgba(255, 255, 255, 0.9) !important;
}
::v-deep(.pbj-breadcrumbs .breadcrumb-separator) {
    color: rgba(255, 255, 255, 0.4) !important;
}
/* Ensure CustomSelect text is dark inside the white/10 container */
::v-deep(.bg-white\/10 .custom-select-trigger) {
    color: #1f2937 !important; 
    background-color: white !important;
}
</style>
