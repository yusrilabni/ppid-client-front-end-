<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

    <div class="max-w-md w-full relative z-10">
      <div class="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/50">
        <div class="text-center">
          <div class="mx-auto h-20 w-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <i class="fas fa-fingerprint text-4xl text-white"></i>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">Selamat Datang</h2>
          <p class="mt-2 text-sm text-gray-500 font-medium">
            Masuk ke portal PPID Kabupaten Sinjai
          </p>
        </div>
        
        <div v-if="error" class="mt-6 bg-red-50/80 backdrop-blur-sm p-4 rounded-xl border border-red-100 flex items-start">
          <i class="fas fa-exclamation-circle text-red-500 mt-0.5 mr-3"></i>
          <p class="text-sm text-red-700 font-medium">{{ error }}</p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-4">
            <div>
              <label for="email-address" class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fas fa-envelope text-gray-400"></i>
                </div>
                <input v-model="form.email" id="email-address" name="email" type="email" autocomplete="email" required class="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow sm:text-sm bg-white/50 focus:bg-white" placeholder="admin@sinjaikab.go.id">
              </div>
            </div>
            
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fas fa-lock text-gray-400"></i>
                </div>
                <input v-model="form.password" id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow sm:text-sm bg-white/50 focus:bg-white" placeholder="••••••••">
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer">
              <label for="remember-me" class="ml-2 block text-sm text-gray-600 cursor-pointer">
                Ingat saya
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Lupa password?
              </a>
            </div>
          </div>

          <div>
            <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed">
              <span v-if="loading" class="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              {{ loading ? 'Memproses...' : 'Masuk Sekarang' }}
              <i v-if="!loading" class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>
        </form>
        
        <div class="mt-8 text-center text-sm text-gray-600">
          Belum punya akun? 
          <router-link to="/register" class="font-bold text-blue-600 hover:text-indigo-600 transition-colors">Daftar sekarang</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const res = await authStore.login(form.value)
    if (!res.success) throw new Error(res.message)
    const redirectPath = route.query.redirect || '/admin'
    router.push(redirectPath)
  } catch (err) {
    error.value = err.message || 'Login gagal. Silakan periksa kembali email dan password Anda.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
</style>
