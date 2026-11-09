<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const id = route.params.id

const loading = ref(true)
const keberatan = ref(null)
const sending = ref(false)

const form = ref({
  tanggapan_atasan: '',
  status_keberatan: 'selesai',
  berkas_putusan: null
})

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    form.value.berkas_putusan = file
  }
}

async function fetchDetail() {
  loading.value = true
  try {
    const res = await api.get(`/admin/keberatan/${id}`)
    if (res.data?.success && res.data?.data) {
      keberatan.value = res.data.data
      if (keberatan.value.tanggapan_atasan) {
        form.value.tanggapan_atasan = keberatan.value.tanggapan_atasan
      }
      if (keberatan.value.status_keberatan) {
        form.value.status_keberatan = keberatan.value.status_keberatan
      }
    }
  } catch (err) {
    console.error('Failed to load keberatan detail:', err)
  } finally {
    loading.value = false
  }
}

async function submitPutusan() {
  if (!form.value.tanggapan_atasan.trim()) {
    alert('Penjelasan putusan atasan PPID wajib diisi.')
    return
  }

  sending.value = true
  try {
    const formData = new FormData()
    formData.append('tanggapan_atasan', form.value.tanggapan_atasan)
    formData.append('status_keberatan', form.value.status_keberatan)
    if (form.value.berkas_putusan) {
      formData.append('berkas_putusan', form.value.berkas_putusan)
    }

    const res = await api.post(`/admin/keberatan/${id}/respond`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.data?.success) {
      alert('Putusan Atasan PPID berhasil disimpan.')
      fetchDetail()
    }
  } catch (err) {
    alert('Gagal menyimpan putusan: ' + (err.response?.data?.message || err.message))
  } finally {
    sending.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return isNaN(d) ? dateStr : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchDetail()
})
</script>

<template>
  <div class="space-y-6 pb-12 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/admin/permohonan"
          class="w-10 h-10 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center transition shadow-sm"
        >
          <i class="fas fa-arrow-left"></i>
        </NuxtLink>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black text-gray-900">Detail Keberatan Informasi</h1>
            <span v-if="keberatan" class="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-amber-100 text-amber-800">
              #{{ keberatan.unique_code || keberatan.kode_keberatan || id }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-0.5">Penanganan sengketa dan putusan resmi Atasan PPID sesuai UU KIP No. 14 Tahun 2008</p>
        </div>
      </div>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="loading" class="space-y-4">
      <div class="h-64 bg-white rounded-3xl animate-pulse"></div>
      <div class="h-96 bg-white rounded-3xl animate-pulse"></div>
    </div>

    <template v-else-if="keberatan">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Kolom Kiri: Profil Pemohon Keberatan -->
        <div class="space-y-6">
          <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-black">
                <i class="fas fa-scale-balanced"></i>
              </div>
              <div class="min-w-0">
                <h3 class="text-base font-black text-gray-900 truncate">{{ keberatan.nama_pemohon || keberatan.user?.name || 'Pemohon' }}</h3>
                <p class="text-xs text-gray-500 font-semibold">Pengaju Keberatan</p>
              </div>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">NIK / Nomor KTP</p>
                <p class="font-bold text-gray-800 mt-0.5">{{ keberatan.nik || '-' }}</p>
              </div>

              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Telepon / WhatsApp</p>
                <p class="font-bold text-gray-800 mt-0.5">{{ keberatan.nomor_telepon_pemohon || keberatan.telepon || '-' }}</p>
              </div>

              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email</p>
                <p class="font-bold text-gray-800 mt-0.5">{{ keberatan.email_pemohon || keberatan.email || '-' }}</p>
              </div>

              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tanggal Pengajuan</p>
                <p class="font-bold text-gray-700 mt-0.5">{{ formatDate(keberatan.created_at) }}</p>
              </div>

              <div v-if="keberatan.permohonan_id" class="pt-2">
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">ID Permohonan Terkait</p>
                <NuxtLink
                  :to="`/admin/permohonan/${keberatan.permohonan_id}`"
                  class="text-blue-600 hover:text-blue-800 font-black inline-flex items-center gap-1 mt-0.5"
                >
                  <span>Buka Permohonan Induk</span>
                  <i class="fas fa-arrow-right text-[10px]"></i>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Kolom Tengah/Kanan: Alasan Keberatan & Putusan Atasan -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black uppercase tracking-wider text-gray-500">Alasan Pengajuan Keberatan</span>
              <span
                :class="[
                  keberatan.status_keberatan === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                  keberatan.status_keberatan === 'diproses' ? 'bg-amber-100 text-amber-800' :
                  keberatan.status_keberatan === 'ditolak' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-800',
                  'px-3 py-1 rounded-full text-xs font-black uppercase'
                ]"
              >
                Status: {{ keberatan.status_keberatan || 'Pending' }}
              </span>
            </div>

            <div>
              <p class="text-xs uppercase font-bold text-gray-400 mb-1">Kasus Posisi / Alasan Keberatan:</p>
              <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs font-semibold text-gray-800 leading-relaxed whitespace-pre-line">
                {{ keberatan.alasan_keberatan }}
              </div>
            </div>

            <div v-if="keberatan.tanggapan_atasan">
              <p class="text-xs uppercase font-bold text-emerald-600 mb-1">Putusan Atasan PPID Saat Ini:</p>
              <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 leading-relaxed whitespace-pre-line">
                {{ keberatan.tanggapan_atasan }}
              </div>
            </div>
          </div>

          <!-- Form Putusan Atasan PPID -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <h3 class="text-sm font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
              <i class="fas fa-gavel text-amber-600"></i>
              <span>Keputusan / Putusan Atasan PPID</span>
            </h3>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Penjelasan Putusan Resmi <span class="text-rose-500">*</span></label>
                <textarea
                  v-model="form.tanggapan_atasan"
                  rows="5"
                  placeholder="Tuliskan putusan atasan PPID, konsiderans pertimbangan, amar putusan, serta arahan pemenuhan informasi..."
                  class="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Status Putusan</label>
                  <select
                    v-model="form.status_keberatan"
                    class="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="diproses">Dalam Proses Penelaahan</option>
                    <option value="selesai">Keberatan Dikabulkan / Selesai</option>
                    <option value="ditolak">Keberatan Ditolak</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Unggah Surat Putusan (PDF)</label>
                  <input
                    type="file"
                    @change="onFileChange"
                    class="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                </div>
              </div>

              <div class="pt-2 flex justify-end">
                <button
                  :disabled="sending"
                  @click="submitPutusan"
                  class="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-amber-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <i class="fas fa-check-circle" :class="{ 'fa-spin': sending }"></i>
                  <span>{{ sending ? 'Menyimpan Putusan...' : 'Simpan Putusan Atasan PPID' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
