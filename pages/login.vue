<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Breadcrumbs at the top -->
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <Breadcrumbs :breadcrumbs="breadcrumbItems" />
    </div>

    <!-- Centered Form -->
    <div class="flex-1 flex items-center justify-center px-4 pb-12">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 relative">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <img :src="getAssetUrl('storage/logo/ppid.webp')" alt="PPID" class="h-20 w-auto mx-auto mb-6" />
          <h1 class="text-2xl font-bold text-gray-800 leading-tight">LOGIN PPID</h1>
          <p class="text-sm text-gray-600 mt-2">Sistem Informasi Pejabat Pengelola Informasi & Dokumentasi</p>
        </div>
        
        <!-- Error Alert -->
        <div v-if="error" class="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3 shadow-sm">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-bold text-rose-800 leading-tight">Terjadi Kesalahan</h4>
            <p class="text-xs text-rose-600 mt-1 leading-relaxed">{{ error }}</p>
          </div>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email / NIP</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <i class="fas fa-user"></i>
              </span>
              <input v-model="form.email" type="text" required autofocus class="w-full py-3 pl-11 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none" placeholder="Masukkan email atau NIP">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <i class="fas fa-lock"></i>
              </span>
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required class="w-full py-3 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none" placeholder="Masukkan kata sandi">
              <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
          </div>
          
          <div class="flex items-center">
            <input type="checkbox" id="remember" class="h-4 w-4 text-blue-600 border-gray-300 rounded">
            <label for="remember" class="ml-2 block text-sm text-gray-700">Ingat saya</label>
          </div>
          
          <button type="submit" :disabled="loading" class="w-full text-white py-3.5 rounded-xl font-medium transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed" style="background: linear-gradient(135deg, #2563eb, #1e40af);">
            <span v-if="loading" class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block align-middle"></span>
            {{ loading ? 'Memproses...' : 'Masuk ke Sistem' }}
          </button>
          
        </form>
        
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Atau lanjutkan dengan</span>
            </div>
          </div>

          <button @click="handleGoogleLogin" type="button" :disabled="loading" class="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5" />
            <span>Login dengan Google</span>
          </button>
        </div>
        
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600 mb-3">Belum punya akun?</p>
          <NuxtLink to="/register" class="block w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors">
            Buat Akun Baru
          </NuxtLink>
        </div>
        
      </div>
      
      <p class="text-center text-xs text-gray-500 mt-8">
        &copy; 2026 PPID - Kabupaten Sinjai
      </p>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { getAssetUrl } from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const breadcrumbItems = computed(() => getBreadcrumbs.loginPage())

const form = ref({ email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

onMounted(() => {
  if (route.query.error === 'not_registered') {
    error.value = 'Email Anda belum terdaftar di sistem. Silakan buat akun terlebih dahulu.'
  } else if (route.query.error === 'auth_failed') {
    error.value = route.query.msg ? decodeURIComponent(route.query.msg) : 'Gagal masuk dengan Google. Silakan coba lagi.'
  } else if (route.query.error === 'invalid_action') {
    error.value = 'Terjadi kesalahan sistem, aksi tidak valid.'
  }
})

const handleGoogleLogin = () => {
  loading.value = true
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://ppidkab.sinjaikab.go.id'
  window.location.href = `${apiUrl}/api/v1/auth/google/redirect?action=login`
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await authStore.login(form.value)
    if (!res.success) throw new Error(res.message)
    router.push(route.query.redirect || '/')
  } catch (err) {
    error.value = err.message || 'Login gagal. Silakan periksa kembali kredensial Anda.'
  } finally {
    loading.value = false
  }
}
</script>

