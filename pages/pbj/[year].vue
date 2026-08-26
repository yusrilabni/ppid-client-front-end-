<template>
    <div class="container mx-auto py-6 md:py-8 px-4">
      <div class="max-w-7xl mx-auto">
        
        <div class="mb-6">
          <Breadcrumbs :breadcrumbs="getBreadcrumbs.pbjDetail(route.params.year)" />
        </div>

        <div class="bg-white rounded-2xl shadow-xl border border-gray-100">
            <!-- Header Section -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8 text-white relative">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 class="text-2xl md:text-3xl font-extrabold leading-tight">Kuesioner PBJ {{ route.params.year }}</h1>
                        <p class="text-blue-100 mt-2 text-sm opacity-90">Daftar kelengkapan dokumen pengadaan barang dan jasa.</p>
                    </div>
                    <button type="button" @click="showModal = true" class="inline-flex items-center justify-center px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white rounded-xl transition-all font-bold text-sm">
                        <i class="fas fa-book-reader mr-2"></i>
                        Panduan Upload
                    </button>
                </div>
            </div>

            <!-- Modal Panduan PBJ (Premium Design) -->
            <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
            <div v-show="showModal" class="fixed inset-0 z-[100] bg-slate-900/90 flex items-center justify-center p-2 md:p-6 text-left">
                <div class="bg-white w-full max-w-5xl max-h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 font-sans relative">
                    
                    <!-- Header Premium -->
                    <div class="bg-gradient-to-r from-blue-800 to-indigo-900 px-6 py-5 flex-shrink-0 border-b border-white/10 relative overflow-hidden">
                        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                        <div class="flex items-center justify-between relative z-10">
                            <div class="flex items-center gap-4">
                                <div class="bg-white/10 p-2.5 rounded-xl text-white">
                                    <i class="fas fa-file-contract text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="text-xl md:text-2xl font-black text-white leading-none uppercase tracking-tight">Panduan Klasifikasi PBJ</h3>
                                    <p class="text-blue-200 text-[10px] md:text-xs mt-1 font-medium">Informasi standar pelayanan dan publikasi dokumen</p>
                                </div>
                            </div>
                            <button @click="showModal = false" class="text-white/60 hover:text-white transition-all p-2 rounded-xl hover:bg-white/10">
                                <i class="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="w-full h-1 bg-slate-100 flex-shrink-0">
                        <div class="h-full bg-blue-500 transition-all duration-300 shadow-sm" :style="{ width: `${scrollProgress}%` }"></div>
                    </div>

                    <!-- Content Area -->
                    <div class="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50" @scroll="updateProgress" ref="modalBody">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h4 class="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <i class="fas fa-lightbulb text-yellow-400"></i> PRINSIP UTAMA
                                </h4>
                                <ul class="space-y-3 text-xs text-slate-700 font-medium">
                                    <li class="flex items-start gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                        <i class="fas fa-check-circle text-blue-500 mt-0.5"></i>
                                        <span>Klasifikasi ditentukan oleh <span class="text-blue-600 font-bold">jenis dokumen</span>, bukan tahun anggaran.</span>
                                    </li>
                                    <li class="flex items-start gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                        <i class="fas fa-check-circle text-blue-500 mt-0.5"></i>
                                        <span><span class="font-bold text-blue-700">Info Berkala</span> tidak pernah berubah menjadi <span class="font-bold text-green-700">Setiap Saat</span>.</span>
                                    </li>
                                    <li class="flex items-start gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                        <i class="fas fa-check-circle text-blue-500 mt-0.5"></i>
                                        <span>Dokumen lama <span class="text-red-600 font-bold">dilarang dihapus</span>, hanya boleh diarsipkan.</span>
                                    </li>
                                </ul>
                            </div>

                            <div class="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
                                <div class="absolute -right-4 -bottom-4 text-red-200/30 rotate-12"><i class="fas fa-exclamation-triangle fa-5x"></i></div>
                                <h4 class="text-sm font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <i class="fas fa-ban"></i> KESALAHAN FATAL
                                </h4>
                                <ul class="space-y-2 text-[11px] text-red-700 font-bold">
                                    <li class="flex items-center gap-2"><i class="fas fa-times-circle"></i> Salah masuk menu kategori upload</li>
                                    <li class="flex items-center gap-2"><i class="fas fa-times-circle"></i> Mengubah klasifikasi tanpa dasar hukum</li>
                                    <li class="flex items-center gap-2"><i class="fas fa-times-circle"></i> Mengunggah file PDF yang korup/tidak terbaca</li>
                                </ul>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- KATEGORI BERKALA -->
                            <div class="flex flex-col">
                                <div class="flex items-center gap-3 mb-4">
                                    <div class="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md"><i class="fas fa-calendar-alt text-sm"></i></div>
                                    <h4 class="font-black text-slate-800 text-sm uppercase tracking-tight">A. INFORMASI BERKALA</h4>
                                </div>
                                <div class="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex-1">
                                    <p class="text-[10px] font-bold text-blue-600 mb-3 uppercase tracking-widest border-b pb-2 italic">Diumumkan rutin (Menu Berkala)</p>
                                    <ul class="space-y-2 text-xs text-slate-700">
                                        <li class="flex items-center gap-3"><i class="fas fa-caret-right text-blue-400"></i> Rencana Umum Pengadaan (RUP)</li>
                                        <li class="flex items-center gap-3"><i class="fas fa-caret-right text-blue-400"></i> Link Aplikasi SIRUP LKPP</li>
                                        <li class="flex items-center gap-3"><i class="fas fa-caret-right text-blue-400"></i> Rekap RUP Tahunan / Semesteran</li>
                                        <li class="flex items-center gap-3"><i class="fas fa-caret-right text-blue-400"></i> Pengumuman / Rekap Paket PBJ</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- KATEGORI SETIAP SAAT -->
                            <div class="flex flex-col">
                                <div class="flex items-center gap-3 mb-4">
                                    <div class="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center shadow-md"><i class="fas fa-clock text-sm"></i></div>
                                    <h4 class="font-black text-slate-800 text-sm uppercase tracking-tight">B. INFORMASI SETIAP SAAT</h4>
                                </div>
                                <div class="bg-white p-5 rounded-2xl border border-green-100 shadow-sm flex-1">
                                    <p class="text-[10px] font-bold text-green-600 mb-3 uppercase tracking-widest border-b pb-2 italic">Via Permohonan (Menu Setiap Saat)</p>
                                    <ul class="space-y-2 text-xs text-slate-700">
                                        <li class="flex items-center gap-3"><i class="fas fa-caret-right text-green-400"></i> KAK, HPS, Kontrak, & Addendum</li>
                                        <li class="flex items-center gap-3"><i class="fas fa-caret-right text-green-400"></i> Dokumen Pemilihan & Kualifikasi</li>
                                        <li class="flex items-center gap-3"><i class="fas fa-caret-right text-green-400"></i> SPPBJ, SPMK, SPM, SP2D Lengkap</li>
                                        <li class="flex items-center gap-3"><i class="fas fa-caret-right text-green-400"></i> Laporan Akhir, BAPH, & Jaminan</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl">
                            <div class="flex items-start gap-4">
                                <span class="text-xl">📝</span>
                                <div>
                                    <h5 class="text-xs font-black text-blue-900 uppercase mb-1">Catatan Penting: Sinkronisasi DIP</h5>
                                    <p class="text-[11px] text-blue-800 leading-relaxed italic">
                                        Pastikan setiap dokumen yang diinput di sini juga tercatat judulnya dalam <strong>Daftar Informasi Publik (DIP)</strong> yang diunggah di menu berkala, guna memudahkan warga mencari referensi dokumen sebelum mengajukan permohonan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Scroll Indicator -->
                        <div v-show="!hasReadPanduan" class="mt-12 flex flex-col items-center animate-bounce text-slate-300">
                            <p class="text-[9px] font-black uppercase tracking-[0.3em] mb-1">Scroll Hingga Bawah</p>
                            <i class="fas fa-chevron-down text-lg"></i>
                        </div>
                        
                        <div class="h-10"></div>
                    </div>

                    <!-- Footer -->
                    <div class="bg-white p-5 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between flex-shrink-0 relative z-[110]">
                        <div class="flex items-center gap-3">
                            <div class="p-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs">
                                <i class="fas fa-balance-scale"></i>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-slate-400 text-[10px] font-bold tracking-widest uppercase leading-tight">Standar Kepatuhan</span>
                                <span class="text-slate-600 text-[10px] font-medium leading-tight">UU No. 14 Tahun 2008 & Perki 1/2021</span>
                            </div>
                        </div>
                        
                        <div class="flex gap-3 w-full md:w-auto">
                            <button @click="showModal = false" 
                                    class="flex-1 md:flex-none px-12 py-3 bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-700/20 disabled:opacity-30 text-xs transition-all uppercase tracking-widest"
                                    :disabled="!hasReadPanduan">
                                <span>{{ hasReadPanduan ? 'SAYA MENGERTI & TUTUP' : `BACA DAHULU (${scrollProgress}%)` }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </Transition>

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
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { ref, computed, watch, nextTick } from 'vue'

import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import PbjQuestionItem from '@/components/PbjQuestionItem.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const route = useRoute()
const showModal = ref(false)
const hasReadPanduan = ref(false)
const scrollProgress = ref(0)
const modalBody = ref(null)

const updateProgress = () => {
    if (!modalBody.value) return;
    const el = modalBody.value;
    const scrolled = el.scrollTop;
    const totalHeight = el.scrollHeight - el.clientHeight;
    
    if (totalHeight <= 10) {
        scrollProgress.value = 100;
    } else {
        scrollProgress.value = Math.round((scrolled / totalHeight) * 100);
    }
    
    if (scrollProgress.value >= 95) {
        hasReadPanduan.value = true;
    }
}

watch(showModal, async (isOpen) => {
    if (isOpen) {
        await nextTick();
        if (modalBody.value) {
            modalBody.value.scrollTop = 0;
            updateProgress();
        }
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

