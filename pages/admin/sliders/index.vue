<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const sliders = ref([])
const loading = ref(false)
const alertMsg = ref('')

async function fetchSliders() {
  loading.value = true
  try {
    const res = await api.get('/admin/sliders')
    if (res.data?.success) {
      sliders.value = res.data.data.data || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function deleteSlider(id, title) {
  if (!confirm(`Hapus permanen slide banner: "${title}"?`)) return
  try {
    await api.delete(`/admin/sliders/${id}`)
    alertMsg.value = `Banner "${title}" berhasil dihapus.`
    fetchSliders()
    setTimeout(() => alertMsg.value = '', 4000)
  } catch (e) {
    alert('Gagal menghapus banner slider.')
  }
}

onMounted(() => fetchSliders())
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-rose-200">
          <i class="fas fa-panorama"></i> Visual & Promosi Portal
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">Sliders & Banner Beranda</h1>
        <p class="text-sm text-rose-200/80 max-w-2xl leading-relaxed">
          Kelola galeri slide gambar interaktif beranda utama portal PPID, judul pengumuman, dan tautan arahan informasi publik.
        </p>
      </div>

      <!-- Action Button to Dedicated Create Page -->
      <NuxtLink
        to="/admin/sliders/create"
        class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
      >
        <i class="fas fa-plus-circle text-base"></i>
        <span>Tambah Banner Baru</span>
      </NuxtLink>
    </div>

    <!-- Alert Message -->
    <div v-if="alertMsg" class="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-sm font-semibold border border-emerald-200 flex items-center justify-between animate-fadeIn">
      <div class="flex items-center gap-2">
        <i class="fas fa-check-circle text-emerald-600"></i>
        <span>{{ alertMsg }}</span>
      </div>
      <button @click="alertMsg = ''" class="text-emerald-600 hover:text-emerald-800"><i class="fas fa-times"></i></button>
    </div>

    <!-- Grid Sliders -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="loading" class="col-span-full py-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
        <i class="fas fa-circle-notch fa-spin text-2xl text-rose-600 mb-2"></i>
        <p class="font-medium text-xs">Memuat galeri banner...</p>
      </div>

      <div v-else-if="sliders.length === 0" class="col-span-full py-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
        <i class="fas fa-images text-3xl text-gray-300 mb-2"></i>
        <p class="font-medium">Belum ada banner slide yang terpasang.</p>
        <p class="text-xs text-gray-400 mt-1">Gunakan tombol "Tambah Banner Baru" untuk mengunggah banner promosi.</p>
      </div>

      <div
        v-for="sl in sliders"
        :key="sl.id"
        class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
      >
        <div class="relative aspect-video overflow-hidden bg-slate-900">
          <img
            :src="`https://ppidkab.sinjaikab.go.id/storage/${sl.image}`"
            :alt="sl.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute top-3 right-3">
            <span
              class="px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md backdrop-blur-md"
              :class="sl.is_active ? 'bg-emerald-500/90 text-white' : 'bg-gray-500/90 text-white'"
            >
              {{ sl.is_active ? 'Aktif' : 'Non-aktif' }}
            </span>
          </div>
          <div class="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-mono">
            Urutan: #{{ sl.order || 0 }}
          </div>
        </div>

        <div class="p-6 flex-1 space-y-2">
          <h3 class="font-bold text-gray-900 text-sm group-hover:text-rose-600 transition-colors line-clamp-1">
            {{ sl.title }}
          </h3>
          <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {{ sl.subtitle || 'Tidak ada subjudul keterangan.' }}
          </p>

          <div v-if="sl.link" class="pt-2">
            <a :href="sl.link" target="_blank" class="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
              <i class="fas fa-link text-[10px]"></i>
              <span class="truncate max-w-[200px]">{{ sl.link }}</span>
            </a>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <NuxtLink
            :to="`/admin/sliders/${sl.id}/edit`"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-gray-200 rounded-xl text-xs font-bold transition-all"
          >
            <i class="fas fa-pen-to-square text-[11px]"></i>
            <span>Edit</span>
          </NuxtLink>
          <button
            @click="deleteSlider(sl.id, sl.title)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border border-gray-200 rounded-xl text-xs font-bold transition-all"
          >
            <i class="fas fa-trash-can text-[11px]"></i>
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
