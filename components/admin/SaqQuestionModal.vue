<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
        <h3 class="font-bold text-gray-800 text-lg flex items-center gap-2">
          <i :class="isEdit ? 'fas fa-pen-square text-amber-500' : 'fas fa-plus-circle text-blue-600'"></i>
          {{ isEdit ? 'Edit Pertanyaan SAQ' : 'Tambah Pertanyaan SAQ' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Pertanyaan <span class="text-red-500">*</span></label>
          <textarea
            v-model="form.pertanyaan"
            rows="3"
            placeholder="Tulis teks pertanyaan lengkap..."
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Tab <span class="text-red-500">*</span></label>
            <select
              v-model="form.tab"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
            >
              <option value="">— Pilih Tab —</option>
              <option v-for="t in tabs" :key="t.tab" :value="t.tab">{{ t.tab }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Kode</label>
            <input
              v-model="form.kode"
              type="text"
              placeholder="mis. 1.1.1 atau EM-JI-001"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Seksi / Bagian</label>
            <input
              v-model="form.section"
              type="text"
              placeholder="Contoh: A. Layanan Elektronik"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Parent (Kategori Induk)</label>
            <select
              v-model="form.parent_id"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option :value="null">— Tanpa Induk (Langsung di bawah Seksi) —</option>
              <option v-for="p in parents" :key="p.id" :value="p.id">
                {{ p.kode ? p.kode + ' — ' : '' }}{{ truncate(p.pertanyaan, 55) }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Input Type</label>
            <select
              v-model="form.input_type"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
            >
              <option value="dokumen">📄 Dokumen</option>
              <option value="foto">📷 Foto</option>
              <option value="situs">🌐 Situs</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Klasifikasi</label>
            <select
              v-model="form.klasifikasi_otomatis"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">— Pilih —</option>
              <option>Informasi Berkala</option>
              <option>Informasi Serta Merta</option>
              <option>Informasi Setiap Saat</option>
              <option>Informasi Dikecualikan</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Target Upload</label>
            <select
              v-model="form.target_upload"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="ppid">PPID</option>
              <option value="pemkab">Pemkab</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Scope Jawaban</label>
            <select
              v-model="form.scope"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="semua_opd">Semua OPD</option>
              <option value="ppid_utama">Khusus PPID Utama</option>
              <option value="opd_tertentu">OPD Tertentu</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Unit / SKPD Terkait</label>
            <input
              v-model="form.unit_terkait"
              type="text"
              placeholder="mis. Dinas Komunikasi Informatika / Semua OPD"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Petunjuk Dokumen Upload</label>
          <input
            v-model="form.dokumen_upload"
            type="text"
            placeholder="Contoh: Tangkapan layar portal PPID atau dokumen SK (PDF)"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div v-if="formError" class="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <i class="fas fa-exclamation-circle mt-0.5"></i>
          <span>{{ formError }}</span>
        </div>
      </div>

      <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-2 rounded-b-2xl">
        <button @click="$emit('close')" type="button" class="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 font-medium">Batal</button>
        <button
          @click="save"
          :disabled="saving"
          type="button"
          class="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
        >
          <i v-if="saving" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-check"></i>
          {{ isEdit ? 'Simpan Perubahan' : 'Tambah Pertanyaan' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const props = defineProps({
  item: { type: Object, default: null },
  tabs: { type: Array, default: () => [] },
  defaultTab: { type: String, default: '' },
  defaultOpdId: { type: [Number, String], default: null },
})
const emit = defineEmits(['close', 'saved'])

const isEdit = computed(() => !!props.item)
const saving = ref(false)
const formError = ref('')
const parents = ref([])

const form = ref({
  pertanyaan: props.item?.pertanyaan || '',
  tab: props.item?.tab || props.defaultTab || '',
  kode: props.item?.kode || '',
  section: props.item?.section || '',
  klasifikasi_otomatis: props.item?.klasifikasi_otomatis || '',
  input_type: props.item?.input_type || 'dokumen',
  target_upload: props.item?.target_upload || 'ppid',
  scope: props.item?.scope || 'semua_opd',
  unit_terkait: props.item?.unit_terkait || '',
  dokumen_upload: props.item?.dokumen_upload || '',
  parent_id: props.item?.parent_id ?? null,
})

function truncate(text, len) {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '...' : text
}

async function fetchParents() {
  try {
    const res = await api.get('/saq-admin/indicators', { params: { per_page: 'all', type: 'category' } })
    const list = res.data?.data?.data || []
    parents.value = list.filter((i) => i.id !== props.item?.id)
  } catch (e) {
    console.error('Gagal memuat parent:', e)
  }
}

async function save() {
  formError.value = ''
  if (!form.value.pertanyaan.trim()) {
    formError.value = 'Pertanyaan wajib diisi.'
    return
  }
  if (!form.value.tab) {
    formError.value = 'Tab wajib dipilih.'
    return
  }
  saving.value = true
  try {
    const payload = {
      pertanyaan: form.value.pertanyaan.trim(),
      tab: form.value.tab,
      kode: form.value.kode || null,
      section: form.value.section || null,
      klasifikasi_otomatis: form.value.klasifikasi_otomatis || null,
      input_type: form.value.input_type || 'dokumen',
      target_upload: form.value.target_upload || 'ppid',
      scope: form.value.scope || 'semua_opd',
      unit_terkait: form.value.unit_terkait || null,
      dokumen_upload: form.value.dokumen_upload || null,
      parent_id: form.value.parent_id || null,
    }
    if (props.defaultOpdId && !isEdit.value) {
      payload.organization_ids = [Number(props.defaultOpdId)]
    }
    if (isEdit.value) {
      await api.put(`/saq-admin/indicators/${props.item.id}`, payload)
    } else {
      await api.post('/saq-admin/indicators', payload)
    }
    emit('saved')
  } catch (e) {
    formError.value = e.response?.data?.message || 'Gagal menyimpan. Coba lagi.'
  } finally {
    saving.value = false
  }
}

onMounted(fetchParents)
</script>
