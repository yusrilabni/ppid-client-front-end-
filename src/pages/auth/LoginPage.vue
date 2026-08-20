<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md">
      
      <!-- Back to Home -->
      <router-link to="/" class="absolute top-4 left-4 sm:top-8 sm:left-8 text-gray-400 hover:text-blue-600 transition-colors flex items-center text-xs font-bold uppercase tracking-widest">
        <i class="fas fa-arrow-left w-3 h-3 mr-2"></i> Beranda
      </router-link>

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
        
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600 mb-3">Belum punya akun?</p>
          <router-link to="/register" class="block w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors">
            Buat Akun Baru
          </router-link>
        </div>
        
      </div>
      
      <p class="text-center text-xs text-gray-500 mt-8">
        &copy; 2026 PPID - Kabupaten Sinjai
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getAssetUrl } from '@/services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({ email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await authStore.login(form.value)
    if (!res.success) throw new Error(res.message)
    router.push(route.query.redirect || '/admin')
  } catch (err) {
    error.value = err.message || 'Login gagal. Silakan periksa kembali kredensial Anda.'
  } finally {
    loading.value = false
  }
}
</script>
