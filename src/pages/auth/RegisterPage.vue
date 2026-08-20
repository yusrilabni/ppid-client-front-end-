<template>
  <div class="register-page min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">Daftar Akun Baru</h2>
      </div>
      <div v-if="error" class="bg-red-50 p-4 rounded-md border border-red-200">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-3">
          <input v-model="form.name" type="text" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Nama Lengkap">
          <input v-model="form.email" type="email" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Alamat Email">
          <input v-model="form.password" type="password" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password">
          <input v-model="form.password_confirmation" type="password" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Konfirmasi Password">
        </div>
        <div>
          <button type="submit" :disabled="loading" class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
             {{ loading ? 'Mendaftar...' : 'Daftar' }}
          </button>
        </div>
      </form>
      <div class="text-center text-sm">
        Sudah punya akun? <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">Masuk di sini</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await authStore.register(form.value)
    if (!res.success) {
      throw new Error(res.message)
    }
    router.push('/admin/dashboard')
  } catch (err) {
    error.value = err.message || 'Registrasi gagal.'
  } finally {
    loading.value = false
  }
}
</script>
