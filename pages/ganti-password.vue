<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div class="text-center mb-6">
          <div class="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-key text-2xl text-amber-600"></i>
          </div>
          <h1 class="text-xl font-bold text-gray-800">Ganti Password</h1>
          <p class="text-sm text-gray-600 mt-2">Anda login menggunakan password sementara. Silakan buat password baru untuk keamanan akun Anda.</p>
        </div>

        <div v-if="error" class="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-sm text-rose-700">
          {{ error }}
        </div>
        <div v-if="success" class="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">
          {{ success }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password Baru *</label>
            <input v-model="form.password" type="password" required minlength="6"
              class="w-full py-3 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 outline-none"
              placeholder="Minimal 6 karakter" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru *</label>
            <input v-model="form.password_confirmation" type="password" required minlength="6"
              class="w-full py-3 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 outline-none"
              placeholder="Ulangi password baru" />
          </div>
          <button type="submit" :disabled="loading"
            class="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 transition-all">
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            Simpan Password Baru
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });

const authStore = useAuthStore();
const router = useRouter();
const api = useApi();

const form = ref({ password: '', password_confirmation: '' });
const loading = ref(false);
const error = ref('');
const success = ref('');

// Jika tidak perlu ganti password, kembali ke beranda
onMounted(() => {
  if (!authStore.user?.must_change_password) {
    router.push('/');
  }
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    if (form.value.password !== form.value.password_confirmation) {
      throw new Error('Konfirmasi password tidak cocok.');
    }
    const res = await api.post('/force-change-password', form.value);
    if (!res.data.success) throw new Error(res.data.message);
    success.value = 'Password berhasil diubah! Mengalihkan...';
    // Update user di store
    authStore.user.must_change_password = false;
    localStorage.setItem('ppid_user', JSON.stringify(authStore.user));
    setTimeout(() => router.push('/'), 1500);
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Gagal mengubah password.';
  } finally {
    loading.value = false;
  }
};
</script>
