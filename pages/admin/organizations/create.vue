<script setup>
definePageMeta({ layout: 'admin' })
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const saving = ref(false)
const errors = ref({})

const form = ref({
  name: '',
  alias: '',
  address: '',
  website: '',
  email: '',
  phone: ''
})

async function submitForm() {
  errors.value = {}
  if (!form.value.name) {
    errors.value.name = 'Nama Badan Publik / Dinas wajib diisi.'
    return
  }

  saving.value = true
  try {
    const res = await api.post('/admin/organizations', form.value)
    if (res.data?.success) {
      router.push('/admin/organizations')
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menyimpan data unit kerja')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-12">
    <!-- Breadcrumb -->
    <div class="flex items-center justify-between">
      <NuxtLink
        to="/admin/organizations"
        class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors uppercase tracking-wider"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Kembali ke Daftar Organisasi</span>
      </NuxtLink>
      <span class="text-xs text-gray-400 font-medium">Tambah Unit Kerja / OPD Baru</span>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-900 p-8 text-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-sky-200">
            <i class="fas fa-building-circle-check text-lg"></i>
          </div>
          <div>
            <h1 class="text-2xl font-black tracking-tight">Tambah Unit OPD / Badan Publik</h1>
            <p class="text-xs text-sky-200/80 mt-0.5">Daftarkan OPD atau Unit Kerja Pelaksana Pelayanan Informasi Publik</p>
          </div>
        </div>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="submitForm" class="p-8 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Nama Lengkap Unit Kerja / Dinas / Badan <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Contoh: Dinas Komunikasi Informatika dan Persandian"
              class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 transition-all duration-200"
              :class="{ 'border-red-400 focus:border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="mt-1 text-xs text-red-500 font-medium">{{ errors.name }}</p>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Singkatan / Alias OPD
            </label>
            <input
              v-model="form.alias"
              type="text"
              placeholder="Contoh: Diskominfo"
              class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 transition-all duration-200"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Website Resmi OPD
            </label>
            <input
              v-model="form.website"
              type="url"
              placeholder="https://diskominfo.sinjaikab.go.id"
              class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 transition-all duration-200"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Email Resmi Unit Kerja
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="diskominfo@sinjaikab.go.id"
              class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 transition-all duration-200"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Nomor Telepon Kantor
            </label>
            <input
              v-model="form.phone"
              type="text"
              placeholder="(0482) xxxxx / 0812xxxx"
              class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 transition-all duration-200"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Alamat Kantor Lengkap
            </label>
            <textarea
              v-model="form.address"
              rows="3"
              placeholder="Contoh: Jl. Persatuan Raya No. 1, Balangnipa, Sinjai Utara, Kab. Sinjai, Sulawesi Selatan 92611"
              class="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 transition-all duration-200 leading-relaxed"
            ></textarea>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <NuxtLink
            to="/admin/organizations"
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
          >
            Batal
          </NuxtLink>

          <button
            type="submit"
            :disabled="saving"
            class="px-8 py-3.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            <span>{{ saving ? 'Menyimpan...' : 'Simpan Unit Kerja' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
