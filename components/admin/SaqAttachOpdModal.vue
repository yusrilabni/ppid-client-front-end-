<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between text-white shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
            <i class="fas fa-plus-circle"></i>
          </div>
          <div>
            <h3 class="font-bold text-base md:text-lg">Petakan Pertanyaan ke OPD</h3>
            <p class="text-xs text-emerald-100 font-medium">{{ opd?.name }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-white/80 hover:text-white transition-colors">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <!-- Filters -->
      <div class="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-2.5 items-center shrink-0">
        <div class="flex-1 min-w-[200px] relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Cari pertanyaan / kode..."
            class="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          />
        </div>
        <select
          v-model="tabFilter"
          class="px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
        >
          <option value="">Semua Tab</option>
          <option v-for="t in tabs" :key="t.tab" :value="t.tab">{{ t.tab }}</option>
        </select>
        <button
          type="button"
          @click="toggleSelectAllFiltered"
          class="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
        >
          {{ isAllFilteredSelected ? 'Batal Pilih Semua' : 'Pilih Semua (' + filteredList.length + ')' }}
        </button>
      </div>

      <!-- Questions List -->
      <div class="p-4 overflow-y-auto space-y-2 flex-1">
        <div v-if="loading" class="py-12 text-center text-gray-400">
          <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
          <p class="text-xs">Memuat daftar pertanyaan...</p>
        </div>

        <div v-else-if="!filteredList.length" class="py-12 text-center text-gray-400 text-xs">
          Tidak ada pertanyaan yang dapat ditambahkan (semua sudah terpetakan atau tidak cocok filter).
        </div>

        <div
          v-else
          v-for="q in filteredList"
          :key="q.id"
          @click="toggleSelect(q.id)"
          :class="[
            'p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3',
            selectedIds.includes(q.id) ? 'bg-emerald-50/70 border-emerald-400 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'
          ]"
        >
          <input
            type="checkbox"
            :checked="selectedIds.includes(q.id)"
            @click.stop="toggleSelect(q.id)"
            class="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
          />
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-1.5 mb-1">
              <span class="px-2 py-0.5 bg-gray-100 text-gray-700 font-mono text-[11px] font-bold rounded">
                {{ q.kode || ('#' + q.id) }}
              </span>
              <span class="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded">
                {{ q.tab }}
              </span>
              <span v-if="q.section" class="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded border border-gray-100">
                {{ q.section }}
              </span>
            </div>
            <p class="text-xs text-gray-800 font-medium leading-relaxed">{{ q.pertanyaan }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
        <p class="text-xs text-gray-600 font-medium">
          <span class="font-bold text-emerald-700">{{ selectedIds.length }}</span> pertanyaan dipilih
        </p>
        <div class="flex items-center gap-2">
          <button
            @click="$emit('close')"
            type="button"
            class="px-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-100 font-medium transition-colors"
          >
            Batal
          </button>
          <button
            @click="submitAttach"
            :disabled="saving || !selectedIds.length"
            type="button"
            class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            <i v-if="saving" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-plus"></i>
            Tambahkan ke OPD
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const props = defineProps({
  opd: { type: Object, required: true },
  tabs: { type: Array, default: () => [] },
  currentlyMappedIds: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'saved'])

const loading = ref(true)
const saving = ref(false)
const allQuestions = ref([])
const search = ref('')
const tabFilter = ref('')
const selectedIds = ref([])

const filteredList = computed(() => {
  const q = search.value.trim().toLowerCase()
  return allQuestions.value.filter(item => {
    // Exclude if already mapped
    if (props.currentlyMappedIds.includes(item.id)) return false
    // Don't show pure category header as a question
    if (item.is_category && !item.pertanyaan) return false
    if (tabFilter.value && item.tab !== tabFilter.value) return false
    if (!q) return true
    return (
      (item.pertanyaan || '').toLowerCase().includes(q) ||
      (item.kode || '').toLowerCase().includes(q) ||
      (item.section || '').toLowerCase().includes(q)
    )
  })
})

const isAllFilteredSelected = computed(() => {
  if (!filteredList.value.length) return false
  return filteredList.value.every(item => selectedIds.value.includes(item.id))
})

function toggleSelect(id) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(x => x !== id)
  } else {
    selectedIds.value.push(id)
  }
}

function toggleSelectAllFiltered() {
  if (isAllFilteredSelected.value) {
    const filteredIds = new Set(filteredList.value.map(x => x.id))
    selectedIds.value = selectedIds.value.filter(id => !filteredIds.has(id))
  } else {
    const current = new Set(selectedIds.value)
    filteredList.value.forEach(x => current.add(x.id))
    selectedIds.value = Array.from(current)
  }
}

async function fetchQuestions() {
  loading.value = true
  try {
    const res = await api.get('/saq-admin/indicators', { params: { per_page: 'all' } })
    allQuestions.value = res.data?.data?.data || []
  } catch (e) {
    console.error('Gagal memuat pertanyaan master:', e)
  } finally {
    loading.value = false
  }
}

async function submitAttach() {
  if (!selectedIds.value.length) return
  saving.value = true
  try {
    const res = await api.post(`/saq-admin/opd/${props.opd.id}/indicators`, {
      indicator_ids: selectedIds.value,
    })
    emit('saved', res.data?.data)
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menambahkan pertanyaan ke OPD.')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchQuestions()
})
</script>
