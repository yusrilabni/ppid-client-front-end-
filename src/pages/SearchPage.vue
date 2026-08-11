<template>
  <div class="search-page bg-slate-50 min-h-screen">
    <PageHeader title="Hasil Pencarian" />
    <div class="container mx-auto px-4 py-12">
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Main Content (Informasi & Standar Layanan) -->
        <div class="lg:w-2/3 space-y-12">
          
          <template v-if="informasiResults.length || standarLayananResults.length || orgResults.length">
            <!-- Informasi Publik Section -->
            <section v-if="informasiResults.length > 0">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-black text-gray-800 flex items-center">
                    <i class="fas fa-bullhorn mr-3 text-blue-500"></i> INFORMASI PUBLIK
                </h2>
              </div>
              <div class="space-y-6">
                <div v-for="item in informasiResults" :key="item.id" class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row gap-6 group">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                      <span class="text-blue-500"><i class="fas fa-folder-open mr-1"></i> {{ item.category }}</span>
                      <span>•</span>
                      <span>{{ new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
                    </div>
                    <h3 class="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2 leading-tight">
                      {{ item.title }}
                    </h3>
                    <p class="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {{ item.ringkasan || item.deskripsi }}
                    </p>
                    <div class="flex items-center justify-between mt-auto">
                      <div class="flex items-center text-xs font-bold text-gray-400">
                        <i class="fas fa-building mr-2 text-gray-300"></i>
                        {{ item.organization ? item.organization.singkatan || item.organization.name : 'PPID' }}
                      </div>
                      <router-link :to="`/informasi/detail/${item.slug}`" class="text-blue-600 text-sm font-black flex items-center group-hover:translate-x-2 transition-transform">
                        BACA SELENGKAPNYA <i class="fas fa-arrow-right ml-2"></i>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Standar Layanan Section -->
            <section v-if="standarLayananResults.length > 0" class="pt-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-black text-gray-800 flex items-center">
                    <i class="fas fa-file-alt mr-3 text-green-500"></i> STANDAR LAYANAN
                </h2>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="item in standarLayananResults" :key="item.id" class="bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-green-300 hover:shadow-xl transition-all duration-500 group/sl shadow-sm overflow-hidden relative flex flex-col">
                  <div class="absolute -right-4 -top-4 text-green-50 opacity-0 group-hover/sl:opacity-100 transition-opacity duration-500">
                      <i class="fas fa-folder-open fa-6x"></i>
                  </div>
                  <router-link :to="`/standar-layanan/file/${item.slug}`" class="block relative z-10 h-full flex flex-col">
                      <div class="flex items-center text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">
                          <span class="px-2.5 py-1 bg-green-50 rounded-lg border border-green-100">{{ item.standar_layanan?.title || 'Dokumen' }}</span>
                      </div>
                      <h3 class="text-base font-bold text-gray-900 group-hover/sl:text-green-600 transition-colors mb-6 line-clamp-2 leading-tight flex-1">
                        {{ item.title }}
                      </h3>
                      <div class="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                          <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tahun {{ item.tahun_dokumen }}</span>
                          <div class="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center group-hover/sl:bg-green-600 transition-all shadow-md">
                              <i class="fas fa-external-link-alt text-[10px]"></i>
                          </div>
                      </div>
                  </router-link>
                </div>
              </div>
            </section>
          </template>

          <div v-else-if="searched" class="bg-white py-20 px-6 rounded-[3rem] border-2 border-dashed border-gray-200 text-center shadow-inner">
              <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <i class="fas fa-search-minus text-gray-300 text-4xl"></i>
              </div>
              <h3 class="text-2xl font-black text-gray-800 mb-3">Tidak ada hasil ditemukan</h3>
              <p class="text-gray-500 max-w-md mx-auto leading-relaxed">Kami tidak dapat menemukan hasil yang cocok dengan kata kunci <span class="font-bold text-blue-600">"{{ query }}"</span>. Silakan coba kata kunci yang lebih umum.</p>
              <div class="mt-10">
                  <router-link to="/" class="px-8 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Kembali ke Beranda</router-link>
              </div>
          </div>
        </div>

        <!-- Sidebar (OPD & Help) -->
        <div class="lg:w-1/3 space-y-8">
          
          <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <form @submit.prevent="search" class="relative">
              <input type="text" v-model="query" placeholder="Cari lagi..." 
                class="w-full bg-blue-50 border border-blue-100 rounded-xl py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fas fa-search text-blue-400 text-sm"></i>
              </div>
              <button type="submit" class="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-600 hover:text-blue-700">
                <i class="fas fa-arrow-right"></i>
              </button>
            </form>
          </div>

          <section v-if="orgResults.length > 0">
              <h2 class="text-xl font-black text-gray-800 mb-6 flex items-center uppercase tracking-tight">
                  <i class="fas fa-university mr-3 text-purple-500"></i> Unit / OPD
              </h2>
              <div class="space-y-4">
                  <div v-for="item in orgResults" :key="item.id" class="bg-white p-4 rounded-2xl border border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all duration-500 group/opd shadow-sm">
                      <router-link :to="`/profil/organisasi/${item.slug}`" class="flex items-center">
                          <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mr-4 group-hover/opd:bg-purple-600 group-hover/opd:text-white transition-all shadow-inner shrink-0">
                              <i class="fas fa-building text-base"></i>
                          </div>
                          <div class="flex flex-col min-w-0">
                              <span class="text-xs font-black text-gray-700 group-hover/opd:text-purple-600 transition-colors leading-tight line-clamp-2">{{ item.name }}</span>
                          </div>
                      </router-link>
                  </div>
              </div>
          </section>

          <div class="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                  <i class="fas fa-paper-plane text-[12rem]"></i>
              </div>
              <h3 class="text-2xl font-black mb-4 relative z-10 leading-tight">Belum Menemukan Data?</h3>
              <p class="text-sm text-blue-100/80 mb-8 relative z-10 leading-relaxed font-medium">Anda dapat mengajukan permohonan informasi publik secara resmi jika data yang Anda cari belum tersedia di portal kami.</p>
              <router-link to="/permohonan-informasi" class="block w-full bg-white text-blue-800 text-center text-xs font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl active:scale-95 relative z-10">
                  Ajukan Permohonan
              </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'
import { useLoadingStore } from '@/stores/loading'

const route = useRoute()
const router = useRouter()
const loadingStore = useLoadingStore()
const query = ref(route.query.q || '')

const informasiResults = ref([])
const standarLayananResults = ref([])
const orgResults = ref([])

const searched = ref(false)

const performSearch = async (searchQuery) => {
  if (!searchQuery?.trim()) return
  
  loadingStore.startLoading()
  searched.value = true
  
  try {
    const res = await api.get('/global-search', { params: { q: searchQuery } })
    
    informasiResults.value = res.data?.data?.informasi?.data || []
    standarLayananResults.value = res.data?.data?.standarLayanan || []
    orgResults.value = res.data?.data?.organizations || []
    
  } catch (error) {
    console.error('Error fetching search results:', error)
  } finally {
    loadingStore.stopLoading()
  }
}

const search = () => {
  if (query.value.trim()) {
    router.replace({ query: { q: query.value } })
  }
}

// Watch for route query changes (e.g. when searching from NavBar)
watch(() => route.query.q, (newQ) => {
  if (newQ) {
    query.value = newQ
    performSearch(newQ)
  }
}, { immediate: true })

</script>
