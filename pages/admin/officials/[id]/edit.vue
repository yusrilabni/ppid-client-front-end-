<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import FileUploader from '@/components/ui/FileUploader.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const loading = ref(true)
const saving = ref(false)
const organizations = ref([])
const errors = ref({})
const existingPhotoUrl = ref('')

const form = ref({
  name: '',
  position: '',
  nip: '',
  organization_id: '',
  order: 0,
  status: 'active',
  photo: null
})

const statusList = [
  { value: 'active', label: 'Aktif Menjabat', description: 'Tampil di portal publik PPID', icon: 'fas fa-user-check', badge: 'Active' },
  { value: 'inactive', label: 'Purna Tugas / Tidak Aktif', description: 'Disembunyikan dari daftar pimpinan publik', icon: 'fas fa-user-clock', badge: 'Inactive' }
]

const orgOptions = computed(() => {
  return [
    { value: '', label: 'Pemerintah Kabupaten Sinjai (Umum)', description: 'Pimpinan Daerah / Sekretariat Daerah', icon: 'fas fa-landmark' },
    ...organizations.value.map(o => ({
      value: o.id,
      label: o.name,
      description: 'Organisasi Perangkat Daerah',
      icon: 'fas fa-building'
    }))
  ]
})

async function fetchData() {
  loading.value = true
  try {
    const res = await api.get(`/admin/officials/${id}`)
    if (res.data?.success && res.data.data) {
      const d = res.data.data
      organizations.value = res.data.organizations || []

      form.value.name = d.name || ''
      form.value.position = d.position || ''
      form.value.nip = d.nip || ''
      form.value.organization_id = d.organization_id || ''
      form.value.order = d.order || 0
      form.value.status = d.status || 'active'

      if (d.photo) {
        existingPhotoUrl.value = `https://ppidkab.sinjaikab.go.id/storage/${d.photo}`
      }
    }
  } catch (e) {
    alert('Gagal memuat profil pimpinan.')
    router.push('/admin/officials')
  } finally {
    loading.value = false
  }
}

async function submitUpdate() {
  errors.value = {}
  if (!form.value.name) {
    errors.value.name = 'Nama lengkap pejabat wajib diisi.'
    return
  }
  if (!form.value.position) {
    errors.value.position = 'Jabatan resmi wajib diisi.'
    return
  }

  saving.value = true
  const fd = new FormData()
  fd.append('name', form.value.name)
  fd.append('position', form.value.position)
  if (form.value.nip) fd.append('nip', form.value.nip)
  if (form.value.organization_id) fd.append('organization_id', form.value.organization_id)
  fd.append('order', form.value.order || 0)
  fd.append('status', form.value.status)
  if (form.value.photo) fd.append('photo', form.value.photo)

  try {
    const res = await api.post(`/admin/officials/${id}`, fd)
    if (res.data?.success) {
      router.push('/admin/officials')
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal memperbarui profil pimpinan')
  } finally {
    saving.value = false
  }
}

onMounted(() => fetchData())
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-12">
    <!-- Breadcrumb -->
    <div class="flex items-center justify-between">
      <NuxtLink
        to="/admin/officials"
        class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wider"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Kembali ke Daftar Pimpinan</span>
      </NuxtLink>
      <span class="text-xs text-gray-400 font-medium">Halaman Edit Pejabat #{{ id }}</span>
    </div>

    <div v-if="loading" class="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
      <i class="fas fa-circle-notch fa-spin text-3xl text-indigo-600 mb-3"></i>
      <p class="text-sm font-semibold text-gray-600">Memuat profil pejabat...</p>
    </div>

    <!-- Main Card -->
    <div v-else class="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      <!-- Card Header -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 p-8 text-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-200">
            <i class="fas fa-user-pen text-lg"></i>
          </div>
          <div>
            <h1 class="text-2xl font-black tracking-tight">Perbarui Profil Pejabat</h1>
            <p class="text-xs text-indigo-200/80 mt-0.5">Ubah nama, penempatan unit kerja, nomor urut, atau foto pimpinan</p>
          </div>
        </div>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="submitUpdate" class="p-8 space-y-8">
        <!-- Section 1: Identitas Pejabat -->
        <div class="space-y-4">
          <h2 class="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-2 border-b border-gray-100 pb-2">
            <i class="fas fa-address-card"></i> 1. Identitas & Jabatan Resmi
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Nama Lengkap & Gelar <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Contoh: Dra. Hj. Andi Jefrianto Asapa, S.Sos., M.Si."
                class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all duration-200"
                :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-100': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-red-500 font-medium">{{ errors.name }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Jabatan Struktural / Kepala Unit <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.position"
                type="text"
                placeholder="Contoh: Kepala Dinas Komunikasi Informatika dan Persandian"
                class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all duration-200"
                :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-100': errors.position }"
              />
              <p v-if="errors.position" class="mt-1 text-xs text-red-500 font-medium">{{ errors.position }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Nomor Induk Pegawai (NIP)
              </label>
              <input
                v-model="form.nip"
                type="text"
                placeholder="Contoh: 19741215 199803 1 004"
                class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm font-mono outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Penempatan & Urutan -->
        <div class="space-y-4">
          <h2 class="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-2 border-b border-gray-100 pb-2">
            <i class="fas fa-sitemap"></i> 2. Penempatan Organisasi & Tampilan
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Organisasi / OPD
              </label>
              <CustomSelect
                v-model="form.organization_id"
                :options="orgOptions"
                placeholder="Pilih Organisasi"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Nomor Urut Tampilan
              </label>
              <input
                v-model.number="form.order"
                type="number"
                min="0"
                placeholder="0"
                class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all duration-200"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Status Jabatan
              </label>
              <CustomSelect
                v-model="form.status"
                :options="statusList"
                placeholder="Pilih Status"
              />
            </div>
          </div>
        </div>

        <!-- Section 3: Foto Pejabat -->
        <div class="space-y-4">
          <h2 class="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-2 border-b border-gray-100 pb-2">
            <i class="fas fa-camera"></i> 3. Foto Resmi Pejabat
          </h2>

          <FileUploader
            v-model="form.photo"
            :existingUrl="existingPhotoUrl"
            accept="image/*"
            label="Ganti Foto Resmi Pejabat"
            hint="Format: JPG, JPEG, PNG, WEBP (Maksimal 5MB). Biarkan kosong jika tetap menggunakan foto lama."
          />
        </div>

        <!-- Action Footer -->
        <div class="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <NuxtLink
            to="/admin/officials"
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
          >
            Batal
          </NuxtLink>

          <button
            type="submit"
            :disabled="saving"
            class="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-check-double"></i>
            <span>{{ saving ? 'Menyimpan...' : 'Perbarui Profil Pejabat' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
