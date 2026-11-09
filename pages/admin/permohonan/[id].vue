<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const loading = ref(true)
const permohonan = ref(null)
const sending = ref(false)

const form = ref({
  message: '',
  response_type: 'jawaban',
  link: '',
  update_status: 'selesai',
  file: null
})

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    form.value.file = file
  }
}

async function fetchDetail() {
  loading.value = true
  try {
    const res = await api.get(`/admin/permohonan/${id}`)
    if (res.data?.success && res.data?.data) {
      permohonan.value = res.data.data
      if (permohonan.value.status_permohonan === 'selesai') {
        form.value.update_status = 'selesai'
      } else if (permohonan.value.status_permohonan === 'diproses') {
        form.value.update_status = 'selesai'
      } else {
        form.value.update_status = 'diproses'
      }
    }
  } catch (err) {
    console.error('Failed to load permohonan detail:', err)
  } finally {
    loading.value = false
  }
}

async function submitResponse() {
  if (!form.value.message.trim()) {
    alert('Pesan tanggapan wajib diisi.')
    return
  }

  sending.value = true
  try {
    const formData = new FormData()
    formData.append('message', form.value.message)
    formData.append('response_type', form.value.response_type)
    if (form.value.link) formData.append('link', form.value.link)
    if (form.value.update_status) formData.append('update_status', form.value.update_status)
    if (form.value.file) formData.append('file', form.value.file)

    const res = await api.post(`/admin/permohonan/${id}/respond`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.data?.success) {
      alert('Tanggapan berhasil disimpan.')
      form.value.message = ''
      form.value.link = ''
      form.value.file = null
      fetchDetail()
    }
  } catch (err) {
    alert('Gagal mengirim tanggapan: ' + (err.response?.data?.message || err.message))
  } finally {
    sending.value = false
  }
}

async function updateDirectStatus(status) {
  if (!confirm(`Ubah status permohonan ini menjadi "${status.toUpperCase()}"?`)) return
  try {
    const res = await api.post(`/admin/permohonan/${id}/status`, { status })
    if (res.data?.success) {
      fetchDetail()
    }
  } catch (err) {
    alert('Gagal mengubah status: ' + (err.response?.data?.message || err.message))
  }
}

const waLink = computed(() => {
  if (!permohonan.value) return ''
  let phone = permohonan.value.nomor_telepon_pemohon || ''
  phone = phone.replace(/[^0-9]/g, '')
  if (phone.startsWith('0')) phone = '62' + phone.slice(1)
  const name = permohonan.value.nama_pemohon || 'Pemohon'
  const code = permohonan.value.unique_code || ''
  const trackingUrl = `https://ppid.sinjaikab.go.id/laporan/permohonan/${code}`
  const text = `Halo Bapak/Ibu *${name}*,\n\nPermohonan Informasi Publik Anda dengan Kode: *#${code}* telah kami tanggapi oleh Admin PPID Sinjai.\n\nSilakan cek detail status dan unduh jawaban melalui tautan resmi berikut:\n${trackingUrl}\n\nTerima kasih,\nPPID Kabupaten Sinjai.`
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
})

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
            <h1 class="text-xl sm:text-2xl font-black text-gray-900">Detail Permohonan Informasi</h1>
            <span v-if="permohonan" class="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-gray-100 text-gray-700">
              #{{ permohonan.unique_code }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-0.5">Kelola data pemohon, rincian informasi, berkas identitas, dan kirim tanggapan</p>
        </div>
      </div>

      <div v-if="permohonan" class="flex items-center gap-2">
        <a
          :href="waLink"
          target="_blank"
          class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
        >
          <i class="fab fa-whatsapp text-sm"></i>
          <span>Hubungi via WhatsApp</span>
        </a>
      </div>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="loading" class="space-y-4">
      <div class="h-64 bg-white rounded-3xl animate-pulse"></div>
      <div class="h-96 bg-white rounded-3xl animate-pulse"></div>
    </div>

    <template v-else-if="permohonan">
      <!-- Main Info Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Kolom Kiri: Profil Pemohon & Identitas -->
        <div class="space-y-6">
          <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-black">
                {{ permohonan.nama_pemohon ? permohonan.nama_pemohon.charAt(0).toUpperCase() : 'P' }}
              </div>
              <div class="min-w-0">
                <h3 class="text-base font-black text-gray-900 truncate">{{ permohonan.nama_pemohon }}</h3>
                <p class="text-xs text-gray-500 font-semibold">{{ permohonan.pekerjaan || 'Masyarakat Umum' }}</p>
                <span class="inline-block px-2 py-0.5 rounded text-[9px] font-bold mt-1" :class="permohonan.privacy_status === 'Anonim' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'">
                  Privasi: {{ permohonan.privacy_status || 'Publik' }}
                </span>
              </div>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">NIK / Nomor Identitas</p>
                <p class="font-bold text-gray-800 mt-0.5">{{ permohonan.nik || '-' }}</p>
              </div>

              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Nomor WhatsApp / Telepon</p>
                <p class="font-bold text-gray-800 mt-0.5">{{ permohonan.nomor_telepon_pemohon || '-' }}</p>
              </div>

              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email</p>
                <p class="font-bold text-gray-800 mt-0.5">{{ permohonan.email_pemohon || '-' }}</p>
              </div>

              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Alamat Lengkap</p>
                <p class="text-gray-700 mt-0.5">{{ permohonan.alamat_pemohon || '-' }}</p>
              </div>

              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tanggal Masuk</p>
                <p class="font-bold text-gray-700 mt-0.5">{{ formatDate(permohonan.created_at) }}</p>
              </div>
            </div>

            <!-- Lampiran KTP / Dokumen Identitas -->
            <div v-if="permohonan.dokumen_ktp" class="pt-4 border-t border-gray-100">
              <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Dokumen Identitas (KTP)</p>
              <a
                :href="`https://ppidkab.sinjaikab.go.id/storage/${permohonan.dokumen_ktp}`"
                target="_blank"
                class="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 flex items-center gap-3 transition group"
              >
                <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                  <i class="fas fa-id-card"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-bold text-gray-800 group-hover:text-blue-600 truncate">Lihat Berkas KTP</p>
                  <p class="text-[10px] text-gray-400">Klik untuk membuka lampiran</p>
                </div>
                <i class="fas fa-external-link-alt text-gray-400 text-xs"></i>
              </a>
            </div>
          </div>

          <!-- Status Permohonan Card -->
          <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
            <h4 class="text-xs font-black uppercase tracking-wider text-gray-700">Tindakan Cepat Status</h4>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="updateDirectStatus('diproses')"
                class="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <i class="fas fa-spinner fa-spin"></i>
                <span>Set Diproses</span>
              </button>
              <button
                @click="updateDirectStatus('selesai')"
                class="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <i class="fas fa-check-circle"></i>
                <span>Set Selesai</span>
              </button>
            </div>
            <button
              @click="updateDirectStatus('ditolak')"
              class="w-full p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <i class="fas fa-ban"></i>
              <span>Tolak Permohonan</span>
            </button>
          </div>
        </div>

        <!-- Kolom Tengah/Kanan: Rincian Kebutuhan & Form Tanggapan -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Rincian Informasi yang Diminta -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black uppercase tracking-wider text-gray-500">Rincian Informasi</span>
              <span
                :class="[
                  permohonan.status_permohonan === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                  permohonan.status_permohonan === 'diproses' ? 'bg-blue-100 text-blue-800' :
                  permohonan.status_permohonan === 'ditolak' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800',
                  'px-3 py-1 rounded-full text-xs font-black uppercase'
                ]"
              >
                Status: {{ permohonan.status_permohonan || 'Menunggu' }}
              </span>
            </div>

            <div>
              <p class="text-xs uppercase font-bold text-gray-400 mb-1">Rincian Informasi yang Dibutuhkan:</p>
              <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-800 leading-relaxed whitespace-pre-line">
                {{ permohonan.detail_informasi }}
              </div>
            </div>

            <div>
              <p class="text-xs uppercase font-bold text-gray-400 mb-1">Tujuan Penggunaan Informasi:</p>
              <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-800 leading-relaxed whitespace-pre-line">
                {{ permohonan.tujuan_penggunaan_informasi || '-' }}
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div class="p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                <span class="text-[10px] uppercase font-bold text-blue-600 block">Cara Memperoleh Informasi</span>
                <span class="font-bold text-gray-800 mt-0.5 block">{{ permohonan.cara_memperoleh_informasi || 'Melihat/Membaca/Mendengarkan' }}</span>
              </div>
              <div class="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <span class="text-[10px] uppercase font-bold text-indigo-600 block">Format Salinan Informasi</span>
                <span class="font-bold text-gray-800 mt-0.5 block">{{ permohonan.cara_mendapatkan_salinan_informasi || 'Elektronik (Softcopy)' }}</span>
              </div>
            </div>
          </div>

          <!-- Riwayat Tanggapan / Timeline Balasan -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h3 class="text-sm font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
              <i class="fas fa-comments text-blue-600"></i>
              <span>Riwayat Tanggapan & Jawaban Admin</span>
            </h3>

            <div v-if="permohonan.responses && permohonan.responses.length > 0" class="space-y-4 pt-2">
              <div
                v-for="resp in permohonan.responses"
                :key="resp.id"
                class="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2"
              >
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="font-black text-gray-900">{{ resp.user?.name || 'Petugas PPID' }}</span>
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-100 text-blue-800">
                      {{ resp.response_type || 'Jawaban' }}
                    </span>
                  </div>
                  <span class="text-[10px] text-gray-400 font-bold">{{ formatDate(resp.created_at) }}</span>
                </div>
                <p class="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{{ resp.message }}</p>
                <div v-if="resp.file_path" class="pt-2">
                  <a
                    :href="`https://ppidkab.sinjaikab.go.id/storage/${resp.file_path}`"
                    target="_blank"
                    class="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 bg-white px-3 py-1.5 rounded-xl border border-gray-200"
                  >
                    <i class="fas fa-paperclip"></i>
                    <span>Unduh Berkas Lampiran Jawaban</span>
                  </a>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-400 text-xs">
              Belum ada tanggapan resmi yang diberikan untuk permohonan ini.
            </div>
          </div>

          <!-- Form Kirim Tanggapan Baru -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <h3 class="text-sm font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
              <i class="fas fa-reply text-teal-600"></i>
              <span>Kirim Jawaban / Tanggapan Resmi</span>
            </h3>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Pesan Tanggapan / Keterangan Jawaban <span class="text-rose-500">*</span></label>
                <textarea
                  v-model="form.message"
                  rows="4"
                  placeholder="Tuliskan jawaban resmi, penjelasan pemenuhan informasi publik, atau alasan jika ditolak..."
                  class="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Tipe Tanggapan</label>
                  <select
                    v-model="form.response_type"
                    class="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="jawaban">Jawaban Permohonan</option>
                    <option value="penolakan">Penolakan Permohonan</option>
                    <option value="klarifikasi">Permintaan Klarifikasi</option>
                    <option value="dokumen">Penyampaian Dokumen</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Perbarui Status Permohonan Menjadi</label>
                  <select
                    v-model="form.update_status"
                    class="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="diproses">Tetap Diproses</option>
                    <option value="selesai">Tandai Selesai</option>
                    <option value="ditolak">Tandai Ditolak</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Lampiran Berkas (PDF / Dokumen)</label>
                <input
                  type="file"
                  @change="onFileChange"
                  class="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div class="pt-2 flex justify-end">
                <button
                  :disabled="sending"
                  @click="submitResponse"
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <i class="fas fa-paper-plane" :class="{ 'fa-spin': sending }"></i>
                  <span>{{ sending ? 'Mengirim Tanggapan...' : 'Kirim & Simpan Tanggapan' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
