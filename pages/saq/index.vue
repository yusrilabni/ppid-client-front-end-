<template>
  <div class="min-h-screen bg-slate-50">
    <!-- HERO -->
    <div class="relative overflow-hidden bg-gradient-to-br from-[#0052FF] via-[#0041CC] to-[#002a86]">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20 blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-cyan-300/30 blur-3xl"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div class="flex items-center gap-3 mb-4">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur">
            <i class="fas fa-clipboard-check"></i> E-Monev Komisi Informasi
          </span>
        </div>
        <h1 class="text-3xl md:text-5xl font-extrabold text-white leading-tight">
          Self Assessment<br class="hidden md:block" /> Questionnaire <span class="text-cyan-300">SAQ</span>
        </h1>
        <p class="mt-4 text-blue-100 max-w-2xl text-sm md:text-base">
          Penilaian mandiri keterbukaan informasi publik per OPD Kabupaten Sinjai — {{ totalPertanyaan }} pertanyaan dalam 5 tab indikator.
        </p>
        <!-- STATS -->
        <div class="mt-8 grid grid-cols-3 gap-3 md:gap-6 max-w-2xl">
          <div class="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
            <div class="text-2xl md:text-4xl font-extrabold text-white"><AnimatedNumber :value="opds.length" /></div>
            <div class="text-[11px] md:text-xs text-blue-200 mt-1">OPD Terdaftar</div>
          </div>
          <div class="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
            <div class="text-2xl md:text-4xl font-extrabold text-white"><AnimatedNumber :value="totalPertanyaan" /></div>
            <div class="text-[11px] md:text-xs text-blue-200 mt-1">Pertanyaan</div>
          </div>
          <div class="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
            <div class="text-2xl md:text-4xl font-extrabold text-white"><AnimatedNumber :value="avgProgress" suffix="%" /></div>
            <div class="text-[11px] md:text-xs text-blue-200 mt-1">Rata-rata Terisi</div>
          </div>
        </div>
      </div>
      <svg class="relative block w-full text-slate-50 -mb-px" viewBox="0 0 1440 60" preserveAspectRatio="none" fill="currentColor"><path d="M0,0 C480,60 960,60 1440,0 L1440,60 L0,60 Z"/></svg>
    </div>

    <!-- SEARCH -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2">
      <div class="relative max-w-xl">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input v-model="search" type="text" placeholder="Cari OPD..."
          class="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 bg-white shadow-sm focus:border-[#0052FF] focus:ring-4 focus:ring-[#0052FF]/10 outline-none transition-all" />
      </div>
    </div>

    <!-- GRID OPD -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="h-56 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 animate-pulse"></div>
      </div>

      <div v-else-if="filtered.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RevealCard v-for="opd in filtered" :key="opd.id">
          <NuxtLink :to="`/saq/${opd.slug}`"
            class="group relative block bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 overflow-hidden hover:shadow-[0_16px_48px_rgba(0,82,255,0.14)] hover:-translate-y-1.5 hover:border-[#0052FF]/30 transition-all duration-300">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0052FF] to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="flex items-start gap-4">
              <!-- Progress ring -->
              <div class="relative w-16 h-16 shrink-0">
                <svg viewBox="0 0 64 64" class="w-16 h-16 -rotate-90">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#eef2ff" stroke-width="7"/>
                  <circle cx="32" cy="32" r="26" fill="none" :stroke="opd.progres.persen === 100 ? '#10b981' : '#0052FF'"
                    stroke-width="7" stroke-linecap="round"
                    :stroke-dasharray="`${(opd.progres.persen / 100) * 163.3} 163.3`"
                    class="transition-all duration-700"/>
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-gray-800">{{ opd.progres.persen }}%</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#0052FF] transition-colors">{{ opd.name }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <p class="text-xs text-gray-500">{{ opd.progres.terisi }}/{{ opd.progres.total }} pertanyaan terisi</p>
                  <span v-if="opd.is_ppid_utama"
                    class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide">PPID Utama</span>
                </div>
              </div>
            </div>
            <!-- Pimpinan -->
            <div v-if="opd.pimpinan?.length" class="mt-4 flex items-center gap-3 bg-slate-50 rounded-2xl p-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#0052FF] to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                <img v-if="opd.pimpinan[0].foto" :src="getStorageUrl(opd.pimpinan[0].foto)" class="w-full h-full object-cover" alt="" />
                <span v-else>{{ (opd.pimpinan[0].nama || '?')[0] }}</span>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-gray-800 truncate">{{ opd.pimpinan[0].nama }}</p>
                <p class="text-[11px] text-gray-500 truncate">{{ opd.pimpinan[0].jabatan || 'Pimpinan' }}</p>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <span class="text-xs font-semibold" :class="opd.progres.persen === 100 ? 'text-emerald-600' : 'text-[#0052FF]'">
                <i :class="opd.progres.persen === 100 ? 'fas fa-check-circle' : 'fas fa-arrow-circle-right'" class="mr-1"></i>
                {{ opd.progres.persen === 100 ? 'Lengkap' : 'Isi SAQ' }}
              </span>
              <i class="fas fa-chevron-right text-gray-300 group-hover:text-[#0052FF] group-hover:translate-x-1 transition-all"></i>
            </div>
          </NuxtLink>
        </RevealCard>
      </div>

      <div v-else class="text-center py-16">
        <i class="fas fa-search text-4xl text-gray-300"></i>
        <p class="mt-4 text-gray-500">Tidak ada OPD yang cocok dengan pencarian.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, h } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api, { getStorageUrl } from '@/services/api'
import { useElementVisibility } from '@vueuse/core'

definePageMeta({ layout: 'default' })
useHead({ title: 'SAQ E-Monev — PPID Kabupaten Sinjai' })
useSeoMeta({
  ogTitle: 'SAQ E-Monev — PPID Kabupaten Sinjai',
  description: 'Self Assessment Questionnaire E-Monev Komisi Informasi untuk OPD Kabupaten Sinjai.',
  ogDescription: 'Self Assessment Questionnaire E-Monev Komisi Informasi untuk OPD Kabupaten Sinjai.',
  ogImage: 'https://ppid.sinjaikab.go.id/logo/ppid_og.jpg',
  ogUrl: 'https://ppid.sinjaikab.go.id/saq',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const search = ref('')

const { data: opdsResponse, isLoading } = useQuery({
  queryKey: ['saq-opds'],
  queryFn: async () => (await api.get('/saq/opds')).data,
  staleTime: 0,
  refetchOnWindowFocus: true,
})

const opds = computed(() => opdsResponse.value?.data || [])
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return opds.value
  return opds.value.filter(o => o.name.toLowerCase().includes(q))
})
const avgProgress = computed(() => {
  if (!opds.value.length) return 0
  return Math.round(opds.value.reduce((s, o) => s + o.progres.persen, 0) / opds.value.length)
})
const totalPertanyaan = ref(154)

// Komponen angka animasi (render function — template string tidak ter-compile di production)
const AnimatedNumber = {
  props: { value: { type: Number, default: 0 }, suffix: { type: String, default: '' } },
  setup(props) {
    const display = ref(0)
    const el = ref(null)
    const visible = useElementVisibility(el)
    let raf = null
    const animate = () => {
      const target = props.value
      const start = performance.now()
      const dur = 1200
      cancelAnimationFrame(raf)
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        display.value = Math.round(target * eased)
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    watch(visible, (v) => { if (v) animate() })
    watch(() => props.value, () => { if (visible.value) animate() })
    onUnmounted(() => cancelAnimationFrame(raf))
    return () => h('span', { ref: el }, `${display.value}${props.suffix}`)
  },
}

// Komponen reveal saat scroll (render function)
const RevealCard = {
  setup(_, { slots }) {
    const el = ref(null)
    const visible = useElementVisibility(el, { threshold: 0.1 })
    return () => h('div', {
      ref: el,
      class: [
        'transition-all duration-700',
        visible.value ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      ],
    }, slots.default ? slots.default() : [])
  },
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
