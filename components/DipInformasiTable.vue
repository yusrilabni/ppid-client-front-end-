<template>
  <!-- Mode Kartu / Grid Card View (Desktop & Mobile) -->
  <div v-if="viewMode === 'card'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <template v-if="informasiList && informasiList.length > 0">
          <div v-for="(informasi, index) in informasiList" :key="informasi.id" 
               class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden">
              
              <!-- Top accent decoration line -->
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              <div>
                  <!-- Header: Badge Pejabat & No Urut -->
                  <div class="flex justify-between items-center mb-3">
                      <span :class="getPejabat(informasi) === 'PPID Utama' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'"
                            class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border">
                          <i class="fas fa-shield-alt mr-1"></i>
                          {{ getPejabat(informasi) }}
                      </span>
                      <span class="text-xs font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                          #{{ index + 1 }}
                      </span>
                  </div>

                  <!-- Document Title -->
                  <NuxtLink :to="`/informasi/detail/${informasi.slug || informasi.id}`" 
                            class="block text-base font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2 line-clamp-2">
                      {{ informasi.title }}
                  </NuxtLink>

                  <!-- Description -->
                  <p class="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                      {{ informasi.deskripsi || 'Tidak ada deskripsi singkat untuk dokumen ini.' }}
                  </p>
              </div>

              <!-- Metadata Section -->
              <div class="pt-3 border-t border-gray-100 space-y-2.5 text-xs">
                  <!-- Unit Kerja -->
                  <div class="flex items-center justify-between text-gray-600">
                      <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <i class="fas fa-building text-gray-400 text-xs"></i> Unit
                      </span>
                      <span class="font-semibold text-gray-800 text-right max-w-[60%] truncate" :title="getUnitName(informasi)">
                          {{ getUnitName(informasi) }}
                      </span>
                  </div>

                  <!-- Waktu -->
                  <div class="flex items-center justify-between text-gray-600">
                      <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <i class="fas fa-calendar-alt text-gray-400 text-xs"></i> Waktu
                      </span>
                      <span class="font-semibold text-gray-800">
                          Tahun {{ informasi.tahun }}
                      </span>
                  </div>

                  <!-- Status & Bentuk -->
                  <div class="flex items-center justify-between">
                      <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status & Bentuk</span>
                      <div class="flex items-center gap-1.5">
                          <span v-if="isBerlaku(informasi.status)" class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                              Berlaku
                          </span>
                          <span v-else-if="(informasi.status || '').toUpperCase() === 'ARSIP'" class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Arsip
                          </span>
                          <span :class="['px-2 py-0.5 rounded-md text-[10px] font-bold', getBentukClass(informasi)]">
                              {{ getBentuk(informasi) }}
                          </span>
                      </div>
                  </div>

                  <!-- Action Button -->
                  <div class="pt-2">
                      <NuxtLink :to="`/informasi/detail/${informasi.slug || informasi.id}`" 
                                class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 group/btn">
                          <span>Lihat Detail Informasi</span>
                          <i class="fas fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
                      </NuxtLink>
                  </div>
              </div>

          </div>
      </template>
      <template v-else>
          <div class="col-span-full bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
              <p class="text-xs text-gray-400 italic">Tidak ada data informasi untuk kategori ini.</p>
          </div>
      </template>
  </div>

  <!-- Mode Tabel (Default Desktop) -->
  <div v-else>
      <div class="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                  <tr>
                      <th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">No</th>
                      <th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Judul</th>
                      <th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Deskripsi</th>
                      <th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pejabat Penguasa</th>
                      <th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Penanggung Jawab</th>
                      <th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Waktu</th>
                      <th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Jangka</th>
                      <th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Bentuk</th>
                      <th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                  </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                  <template v-if="informasiList && informasiList.length > 0">
                      <tr v-for="(informasi, index) in informasiList" :key="informasi.id" class="hover:bg-gray-50/80 transition-colors">
                          <td class="px-4 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">{{ index + 1 }}</td>
                          <td class="px-4 py-4 text-xs font-bold text-gray-900 leading-snug">{{ informasi.title }}</td>
                          <td class="px-4 py-4 text-xs text-gray-600 max-w-[200px]">{{ truncate(informasi.deskripsi || 'N/A', 60) }}</td>
                          <td class="px-4 py-4 whitespace-nowrap text-xs text-gray-700">{{ getPejabat(informasi) }}</td>
                          <td class="px-4 py-4 text-xs text-gray-700 font-medium">{{ getUnitName(informasi) }}</td>
                          <td class="px-4 py-4 whitespace-nowrap text-xs text-gray-600 text-center">{{ informasi.tahun }}</td>
                          <td class="px-4 py-4 whitespace-nowrap text-xs text-gray-600 text-center">
                              <span v-if="isBerlaku(informasi.status)" class="text-green-600">Selama Berlaku</span>
                              <span v-else-if="(informasi.status || '').toUpperCase() === 'ARSIP'" class="text-amber-600">Tahun {{ informasi.tahun }}</span>
                              <span v-else>Selama Berlaku</span>
                          </td>
                          <td class="px-4 py-4 whitespace-nowrap text-xs text-gray-600 text-center">
                              <span :class="['px-2 py-0.5 rounded-full', getBentukClass(informasi)]">
                                  {{ getBentuk(informasi) }}
                              </span>
                          </td>
                          <td class="px-4 py-4 whitespace-nowrap text-xs text-center font-medium">
                              <NuxtLink :to="`/informasi/detail/${informasi.slug || informasi.id}`" class="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded transition-colors">
                                  Detail
                              </NuxtLink>
                          </td>
                      </tr>
                  </template>
                  <template v-else>
                      <tr>
                          <td colspan="9" class="text-center py-10 text-gray-400 italic">Data tidak tersedia</td>
                      </tr>
                  </template>
              </tbody>
          </table>
      </div>

      <!-- Mobile Card View (fallback untuk mode tabel di layar kecil) -->
      <div class="md:hidden space-y-4">
          <template v-if="informasiList && informasiList.length > 0">
              <div v-for="(informasi, index) in informasiList" :key="informasi.id" class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div class="flex justify-between items-start mb-3">
                      <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 uppercase">{{ getPejabat(informasi) }}</span>
                      <span class="text-[10px] text-gray-400 font-bold">#{{ index + 1 }}</span>
                  </div>
                  
                  <h5 class="text-sm font-bold text-gray-900 mb-2 leading-tight">{{ informasi.title }}</h5>
                  <p class="text-xs text-gray-500 line-clamp-2 mb-4">{{ informasi.deskripsi || 'N/A' }}</p>
                  
                  <div class="space-y-2 border-t border-gray-50 pt-3">
                      <div class="flex justify-between text-[10px]">
                          <span class="text-gray-400 uppercase font-bold">Unit</span>
                          <span class="text-gray-700 font-medium text-right">{{ getUnitName(informasi) }}</span>
                      </div>
                      <div class="flex justify-between text-[10px]">
                          <span class="text-gray-400 uppercase font-bold">Tahun / Jangka</span>
                          <span class="text-gray-700 font-medium">
                              {{ informasi.tahun }} / 
                              {{ isBerlaku(informasi.status) ? 'Selama Berlaku' : 'Arsip' }}
                          </span>
                      </div>
                      <div class="flex justify-between items-center text-[10px]">
                          <span class="text-gray-400 uppercase font-bold">Bentuk</span>
                          <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold">{{ getBentuk(informasi) }}</span>
                      </div>
                  </div>
                  
                  <div class="mt-4">
                      <NuxtLink :to="`/informasi/detail/${informasi.slug || informasi.id}`" class="block w-full bg-blue-600 text-white text-center text-xs font-bold py-2.5 rounded-lg shadow-sm active:bg-blue-700">
                          Lihat Detail Informasi
                      </NuxtLink>
                  </div>
              </div>
          </template>
          <template v-else>
              <div class="bg-gray-50 rounded-lg p-6 text-center border border-dashed border-gray-300">
                  <p class="text-xs text-gray-500 italic">Tidak ada data informasi untuk kategori ini.</p>
              </div>
          </template>
      </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  informasiList: {
      type: Array,
      required: true
  },
  unitMap: {
      type: Object,
      default: () => ({})
  },
  viewMode: {
      type: String,
      default: 'table'
  }
})

function truncate(str, n) {
  return (str && str.length > n) ? str.slice(0, n-1) + '...' : (str || '');
}

function getUnitName(informasi) {
  const unitId = String(informasi.unit_id).trim()
  return props.unitMap[unitId]?.unit_nama || 'Unit Tidak Terdaftar'
}

function getPejabat(informasi) {
  const unitName = getUnitName(informasi)
  return unitName === 'Dinas Komunikasi Informatika dan Persandian' ? 'PPID Utama' : 'PPID Pelaksana'
}

function getBentuk(informasi) {
  if (informasi.url || informasi.official_id) return 'Soft Copy'
  if (informasi.file) return 'Hard Copy'
  return 'N/A'
}

function getBentukClass(informasi) {
  const bentuk = getBentuk(informasi)
  return bentuk === 'Soft Copy' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-50 text-gray-700 border border-gray-100'
}

function isBerlaku(status) {
  const s = String(status || '').toUpperCase().trim()
  return ['BERLAKU', 'AKTIF'].includes(s)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
