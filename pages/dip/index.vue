<template>
  <div class="py-10 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumbs -->
      <div class="mb-6">
        <Breadcrumbs :breadcrumbs="getBreadcrumbs.dipIndex()" />
      </div>

      <!-- Hero Header Banner -->
      <div class="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
        <!-- Decorative Background Icon -->
        <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none transform rotate-12">
          <i class="fas fa-book-open text-[180px]"></i>
        </div>

        <div class="relative z-10 max-w-3xl">
          <span class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-blue-100 border border-white/20 mb-4">
            <i class="fas fa-file-contract text-blue-200"></i> Dokumen Resmi PPID
          </span>
          <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Daftar Informasi Publik (DIP)
          </h1>
          <p class="text-blue-100 text-base md:text-lg leading-relaxed font-normal">
            Pilih tahun anggaran untuk melihat rincian penetapan dokumen Informasi Berkala, Informasi Setiap Saat, dan Informasi Serta Merta di lingkungan Pemerintah Kabupaten Sinjai.
          </p>
        </div>
      </div>

      <!-- Quick Switch to DIP Unit Banner -->
      <div class="mb-10 bg-white rounded-2xl border border-blue-100 p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0">
            <i class="fas fa-building"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-gray-900">Ingin melihat DIP per OPD / Unit Kerja?</h2>
            <p class="text-xs text-gray-500">Anda juga dapat mengakses DIP khusus masing-masing Dinas, Badan, Kecamatan, dan Desa.</p>
          </div>
        </div>
        <NuxtLink to="/dipunit" class="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 whitespace-nowrap">
          <span>Buka DIP Unit (OPD)</span>
          <i class="fas fa-arrow-right text-xs"></i>
        </NuxtLink>
      </div>

      <!-- Section Title -->
      <div class="flex items-center gap-3 mb-8">
        <div class="h-8 w-1.5 bg-blue-600 rounded-full"></div>
        <h2 class="text-2xl font-black text-gray-900 uppercase tracking-tight">Pilih Tahun Anggaran DIP</h2>
      </div>

      <!-- Grid Cards of DIP Years -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <div
          v-for="item in yearsList"
          :key="item.year"
          class="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between group hover:-translate-y-2 relative overflow-hidden"
        >
          <!-- Top Accent Line -->
          <div :class="item.isLatest ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'" class="absolute top-0 left-0 right-0 h-1.5"></div>

          <div>
            <!-- Card Header: Year Badge & Status -->
            <div class="flex justify-between items-start mb-5">
              <div class="flex items-center gap-2">
                <span :class="item.isLatest ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'" class="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border">
                  Tahun Anggaran
                </span>
                <span v-if="item.isLatest" class="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white shadow-sm shadow-emerald-200">
                  Terbaru
                </span>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-gray-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 transition-colors flex items-center justify-center text-lg">
                <i class="fas fa-calendar-alt"></i>
              </div>
            </div>

            <!-- Big Year Number & Title -->
            <div class="mb-3">
              <div class="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                {{ item.year }}
              </div>
              <h3 class="text-lg font-bold text-gray-800 leading-snug">
                Daftar Informasi Publik (DIP)
              </h3>
            </div>

            <!-- Description -->
            <p class="text-xs text-gray-500 leading-relaxed mb-6">
              {{ item.description }}
            </p>

            <!-- Classification Tags -->
            <div class="flex flex-wrap gap-1.5 mb-6">
              <span class="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-semibold border border-gray-100">
                <i class="fas fa-clock text-blue-500 mr-1"></i> Berkala
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-semibold border border-gray-100">
                <i class="fas fa-check-circle text-green-500 mr-1"></i> Setiap Saat
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-semibold border border-gray-100">
                <i class="fas fa-bolt text-amber-500 mr-1"></i> Serta Merta
              </span>
            </div>
          </div>

          <!-- Bottom Action Button -->
          <NuxtLink
            :to="`/dip/${item.year}`"
            :class="item.isLatest ? 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 shadow-emerald-500/20' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-500/20'"
            class="w-full text-white font-bold py-3 px-5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 group/btn mt-2"
          >
            <span>Buka DIP Tahun {{ item.year }}</span>
            <i class="fas fa-arrow-right text-[11px] group-hover/btn:translate-x-1 transition-transform"></i>
          </NuxtLink>
        </div>
      </div>

      <!-- Legal Info Footer Card -->
      <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl flex-shrink-0">
            <i class="fas fa-scale-balanced"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-900">Dasar Hukum Penetapan DIP</h4>
            <p class="text-xs text-gray-500 mt-0.5">Berdasarkan amanat Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik dan Peraturan Komisi Informasi (Perki).</p>
          </div>
        </div>
        <div class="text-xs text-gray-400 font-medium whitespace-nowrap">
          PPID Kabupaten Sinjai
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getBreadcrumbs } from '@/config/breadcrumbs'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

const currentYear = new Date().getFullYear()

const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020]

const yearsList = years.map((y, idx) => ({
  year: y,
  isLatest: idx === 0,
  description: `Dokumen resmi Daftar Informasi Publik Kabupaten Sinjai yang telah ditetapkan untuk Tahun Anggaran ${y}.`
}))

useHead({
  title: 'Daftar Informasi Publik (DIP) - PPID Kabupaten Sinjai',
  meta: [
    { name: 'description', content: 'Daftar Informasi Publik (DIP) resmi Pemerintah Kabupaten Sinjai per Tahun Anggaran.' },
    { property: 'og:title', content: 'Daftar Informasi Publik (DIP) - PPID Kabupaten Sinjai' },
    { property: 'og:description', content: 'Daftar Informasi Publik (DIP) resmi Pemerintah Kabupaten Sinjai per Tahun Anggaran.' }
  ]
})
</script>
