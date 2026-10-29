<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between text-white shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
            <i class="fas fa-clone"></i>
          </div>
          <div>
            <h3 class="font-bold text-base md:text-lg">Audit Pertanyaan Serupa / Duplikat</h3>
            <p class="text-xs text-amber-100">Ditemukan pertanyaan dengan teks identik di bank soal</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-white/80 hover:text-white transition-colors">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto space-y-6 flex-1">
        <!-- Target Question Box -->
        <div class="bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-mono font-bold">
              Pertanyaan Utama: {{ item?.kode || ('#' + item?.id) }}
            </span>
            <span class="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
              {{ item?.tab }}
            </span>
          </div>
          <p class="text-sm font-semibold text-gray-800 leading-snug">{{ item?.pertanyaan }}</p>
          <div class="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <span v-if="item?.section" class="bg-white px-2 py-0.5 rounded border border-blue-100">
              <i class="fas fa-folder text-blue-500 mr-1"></i> {{ item?.section }}
            </span>
            <span class="bg-white px-2 py-0.5 rounded border border-blue-100">
              <i class="fas fa-building text-green-600 mr-1"></i> {{ item?.organizations_count || 0 }} OPD Terpetakan
            </span>
          </div>
        </div>

        <!-- Similar Questions List -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <i class="fas fa-exclamation-triangle text-amber-500"></i>
              Pertanyaan Serupa Lainnya ({{ similarList.length }})
            </h4>
          </div>

          <div v-if="loading" class="py-8 text-center text-gray-400">
            <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
            <p class="text-xs">Mencari pertanyaan serupa...</p>
          </div>

          <div v-else-if="!similarList.length" class="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center text-gray-500 text-sm">
            <i class="fas fa-check-circle text-emerald-500 text-2xl mb-2 block"></i>
            Tidak ada pertanyaan lain dengan teks yang serupa dengan pertanyaan ini.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="sim in similarList"
              :key="sim.id"
              class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:border-amber-400 hover:shadow-md transition-all"
            >
              <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-mono font-bold">
                    {{ sim.kode || ('#' + sim.id) }}
                  </span>
                  <span class="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">
                    {{ sim.tab }}
                  </span>
                  <span v-if="sim.section" class="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs border border-gray-100">
                    {{ sim.section }}
                  </span>
                </div>
                <span class="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {{ sim.organizations_count }} OPD
                </span>
              </div>

              <p class="text-sm text-gray-800 leading-snug mb-3">{{ sim.pertanyaan }}</p>

              <!-- Mapped OPD List preview -->
              <div v-if="sim.organizations?.length" class="mb-3 flex flex-wrap gap-1.5">
                <span
                  v-for="opd in sim.organizations.slice(0, 5)"
                  :key="opd.id"
                  class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px]"
                >
                  {{ opd.name }}
                </span>
                <span v-if="sim.organizations.length > 5" class="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-[11px] font-semibold">
                  +{{ sim.organizations.length - 5 }} lainnya
                </span>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  @click="$emit('edit', sim)"
                  class="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <i class="fas fa-pen text-[10px]"></i> Edit
                </button>
                <button
                  @click="$emit('mapping', sim)"
                  class="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <i class="fas fa-sitemap text-[10px]"></i> Mapping OPD
                </button>
                <button
                  @click="$emit('move', sim)"
                  class="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <i class="fas fa-exchange-alt text-[10px]"></i> Pindah
                </button>
                <button
                  @click="deleteItem(sim)"
                  :disabled="deletingId === sim.id"
                  class="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                  title="Hapus duplikat ini"
                >
                  <i v-if="deletingId === sim.id" class="fas fa-spinner fa-spin text-[10px]"></i>
                  <i v-else class="fas fa-trash text-[10px]"></i> Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
        <button
          @click="$emit('close')"
          type="button"
          class="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['close', 'edit', 'mapping', 'move', 'deleted'])

const loading = ref(true)
const similarList = ref([])
const deletingId = ref(null)

async function fetchSimilar() {
  loading.value = true
  try {
    const res = await api.get(`/saq-admin/indicators/${props.item.id}/similar`)
    similarList.value = res.data?.data || []
  } catch (e) {
    console.error('Gagal mengambil data serupa:', e)
  } finally {
    loading.value = false
  }
}

async function deleteItem(sim) {
  if (!confirm(`Hapus pertanyaan ${sim.kode || ('#' + sim.id)} ini? Pastikan tidak ada jawaban pada pertanyaan ini.`)) return
  deletingId.value = sim.id
  try {
    await api.delete(`/saq-admin/indicators/${sim.id}`)
    similarList.value = similarList.value.filter(s => s.id !== sim.id)
    emit('deleted', sim.id)
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menghapus pertanyaan.')
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  fetchSimilar()
})
</script>
