<template>
    <div class="container mx-auto py-6 md:py-8 px-4">
      <div class="max-w-7xl mx-auto">
        
        <div class="mb-6">
          <Breadcrumbs :breadcrumbs="[
              { title: 'Beranda', url: '/', icon: 'fas fa-home' },
              { title: 'Kuesioner PBJ', url: '/pbj', icon: 'fas fa-file-signature' },
              { title: `Tahun ${route.params.year}`, url: `/pbj/${route.params.year}`, icon: 'fas fa-calendar-alt' }
          ]" />
        </div>

        <div class="bg-white rounded-2xl shadow-xl border border-gray-100">
            <!-- Header Section -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8 text-white relative">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 class="text-2xl md:text-3xl font-extrabold leading-tight">Kuesioner PBJ {{ route.params.year }}</h1>
                        <p class="text-blue-100 mt-2 text-sm opacity-90">Daftar kelengkapan dokumen pengadaan barang dan jasa.</p>
                    </div>
                    
                    <!-- Quick Navigation -->
                    <div class="w-full md:w-48 relative" style="z-index: 100;">
                        <div class="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                            <CustomSelect 
                              v-model="selectedYear"
                              :options="yearOptions"
                              :searchable="false"
                              placeholder="Ubah Tahun"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Section -->
            <div class="p-4 md:p-8 relative z-10">
                
                <div v-if="isLoading" class="space-y-6 md:space-y-8">
                    <div v-for="i in 5" :key="i" class="p-5 md:p-8 border border-gray-100 rounded-2xl shadow-sm bg-gray-50 animate-pulse h-24"></div>
                </div>

                <div v-else-if="questions.length > 0" class="space-y-6 md:space-y-8">
                    <div v-for="(question, index) in questions" :key="question.id" class="p-5 md:p-8 border border-gray-100 rounded-2xl shadow-sm bg-white hover:border-blue-100 transition-colors">
                        <div class="flex items-start">
                            <span class="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center font-bold text-sm md:text-lg mr-4">
                                {{ index + 1 }}
                            </span>
                            <div class="flex-1 pt-1">
                                <a v-if="hasLink(question)" :href="getLink(question)" class="text-base md:text-xl font-bold text-blue-600 hover:text-blue-800 leading-tight block">
                                    {{ question.question }}
                                    <i class="fas fa-external-link-alt ml-2 text-xs opacity-50"></i>
                                </a>
                                <h3 v-else class="text-base md:text-xl font-bold text-gray-800 leading-tight">
                                    {{ question.question }}
                                </h3>
                            </div>
                        </div>

                        <div v-if="question.children && question.children.length > 0" class="mt-6">
                            <PbjQuestionItem 
                                v-for="(child, childIndex) in question.children" 
                                :key="child.id" 
                                :question="child"
                                :index="childIndex"
                                :level="1"
                            />
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p class="text-gray-500 font-medium">Data kuesioner belum tersedia.</p>
                </div>

            </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import PbjQuestionItem from '@/components/PbjQuestionItem.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const route = useRoute()
const router = useRouter()
const selectedYear = ref(route.params.year)

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

watch(selectedYear, (newYear, oldYear) => {
    if (newYear && oldYear && newYear !== route.params.year) {
        router.push(`/pbj/${newYear}`)
    }
})

watch(() => route.params.year, (newYear) => {
    if (newYear && newYear !== selectedYear.value) {
        selectedYear.value = newYear
    }
})

const { data: pbjResponse, isLoading } = useQuery({
  queryKey: computed(() => ['pbj', route.params.year]),
  queryFn: async () => {
    const res = await api.get('/pbj', { params: { year: route.params.year } })
    return res.data
  },
  enabled: computed(() => !!route.params.year)
})

useGlobalLoader(isLoading)

const questions = computed(() => pbjResponse.value?.data?.questions || [])

const hasLink = (question) => {
    return !!(question.answer?.informasi?.slug || question.answer?.document_url || question.answer?.informasi?.url)
}

const getLink = (question) => {
    if (question.answer?.informasi?.slug) {
        return `/informasi/${question.answer.informasi.slug}`
    }
    if (question.answer?.document_url) {
        return question.answer.document_url
    }
    if (question.answer?.informasi?.url) {
        return question.answer.informasi.url
    }
    return '#'
}
</script>

<style scoped>
::v-deep(.bg-white\/10 .custom-select-trigger) {
    color: #fff !important; 
    background-color: transparent !important;
    border: none !important;
}
::v-deep(.bg-white\/10 .custom-select-trigger:hover) {
    background-color: rgba(255,255,255,0.1) !important;
}
</style>
