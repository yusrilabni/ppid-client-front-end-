<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import CustomSelect from '@/components/ui/CustomSelect.vue'

const router = useRouter()
const saving = ref(false)
const errors = ref({})

const organizations = ref([])
const loadingOrgs = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'opd',
  nip: '',
  unit_id: null
})

const roleOptions = [
  { value: 'opd', label: 'Petugas PPID Pelaksana (OPD)', description: 'Kelola permohonan & dokumen unit dinas/badan terkait', icon: 'fas fa-building', badge: 'OPD' },
  { value: 'admin', label: 'Administrator PPID Utama', description: 'Akses penuh verifikasi, permohonan & konten', icon: 'fas fa-user-shield', badge: 'Admin' },
  { value: 'superadmin', label: 'Super Administrator', description: 'Akses seluruh konfigurasi, hak akses & log keamanan', icon: 'fas fa-shield-halved', badge: 'Superadmin' },
  { value: 'user', label: 'Pemohon / Pengguna Publik', description: 'Akun masyarakat pemohon informasi', icon: 'fas fa-user', badge: 'User' }
]

async function fetchOrganizations() {
  loadingOrgs.value = true
  try {
    const res = await api.get('/admin/organizations')
    if (res.data?.success) {
      organizations.value = (res.data.data.data || []).map(org => ({
        value: org.id,
        label: org.name,
        badge: org.alias || 'OPD'
      }))
    }
  } catch (e) {
    console.error('Gagal mengambil daftar organisasi:', e)
  } finally {
    loadingOrgs.value = false
  }
}

async function submitForm() {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Nama lengkap pengguna wajib diisi.'
  if (!form.value.email) errors.value.email = 'Alamat email wajib diisi.'
  if (!form.value.password || form.value.password.length < 6) {
    errors.value.password = 'Kata sandi minimal 6 karakter.'
  }
  if (Object.keys(errors.value).length > 0) return

  saving.value = true
  try {
    const res = await api.post('/admin/users', form.value)
    if (res.data?.success) {
      router.push('/admin/users')
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal mendaftarkan pengguna baru')
  } finally {
    saving.value = false
  }
}

onMounted(() => fetchOrganizations())
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-12">
    <!-- Breadcrumb -->
    <div class="flex items-center justify-between">
      <NuxtLink
        to="/admin/users"
        class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors uppercase tracking-wider"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Kembali ke Daftar Pengguna</span>
      </NuxtLink>
      <span class="text-xs text-gray-400 font-medium">Tambah Akun Pengguna</span>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-8 text-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-purple-200">
            <i class="fas fa-user-plus text-lg"></i>
          </div>
          <div>
            <h1 class="text-2xl font-black tracking-tight">Tambah Pengguna Baru</h1>
            <p class="text-xs text-purple-200/80 mt-0.5">Daftarkan akun administrator baru atau petugas PPID pelaksana unit kerja</p>
          </div>
        </div>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="submitForm" class="p-8 space-y-8">
        <!-- Section 1: Kredensial & Otoritas -->
        <div class="space-y-4">
          <h2 class="text-xs font-black uppercase tracking-wider text-purple-600 flex items-center gap-2 border-b border-gray-100 pb-2">
            <i class="fas fa-id-badge"></i> 1. Otoritas & Peran Sistem
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Hak Akses / Tingkat Otoritas <span class="text-red-500">*</span>
              </label>
              <CustomSelect
                v-model="form.role"
                :options="roleOptions"
                placeholder="Pilih Peran Sistem"
              />
            </div>

            <div v-if="form.role === 'opd'" class="md:col-span-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Unit Perangkat Daerah (OPD) Terkait <span class="text-red-500">*</span>
              </label>
              <CustomSelect
                v-model="form.unit_id"
                :options="organizations"
                placeholder="Pilih Unit OPD Penugasan"
              />
              <p class="text-[11px] text-gray-500 mt-1">Petugas hanya berwenang merespons permohonan yang ditujukan ke OPD ini.</p>
            </div>
          </div>
        </div>

        <!-- Section 2: Data Diri & Login -->
        <div class="space-y-4">
          <h2 class="text-xs font-black uppercase tracking-wider text-purple-600 flex items-center gap-2 border-b border-gray-100 pb-2">
            <i class="fas fa-lock"></i> 2. Identitas & Kredensial Masuk
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Nama Lengkap Pegawai / Admin <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Contoh: Muhammad Yusril, S.Kom."
                class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-50 transition-all duration-200"
                :class="{ 'border-red-400 focus:border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-red-500 font-medium">{{ errors.name }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Nomor Induk Pegawai (NIP)
              </label>
              <input
                v-model="form.nip"
                type="text"
                placeholder="Contoh: 19930815 202203 1 002"
                class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-50 transition-all duration-200"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Alamat Email Resmi <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                placeholder="yusril@sinjaikab.go.id"
                class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-50 transition-all duration-200"
                :class="{ 'border-red-400 focus:border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-xs text-red-500 font-medium">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Kata Sandi Baru <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.password"
                type="password"
                placeholder="Minimal 6 karakter kombinasi"
                class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-50 transition-all duration-200"
                :class="{ 'border-red-400 focus:border-red-500': errors.password }"
              />
              <p v-if="errors.password" class="mt-1 text-xs text-red-500 font-medium">{{ errors.password }}</p>
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <NuxtLink
            to="/admin/users"
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
          >
            Batal
          </NuxtLink>

          <button
            type="submit"
            :disabled="saving"
            class="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            <span>{{ saving ? 'Menyimpan...' : 'Daftarkan Pengguna' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
