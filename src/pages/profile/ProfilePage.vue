<template>
  <div class="py-12 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
      
      <!-- Breadcrumbs -->
      <nav class="flex mb-6 px-4 sm:px-0" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link to="/" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <i class="fas fa-home mr-2"></i> Beranda
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <i class="fas fa-chevron-right text-gray-400 text-xs mx-1"></i>
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">Profile</span>
            </div>
          </li>
        </ol>
      </nav>

      <div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
        <section>
          <header>
            <h2 class="text-lg font-medium text-gray-900">
              Informasi Profil
            </h2>
          </header>

          <!-- Loading State -->
          <div v-if="loading" class="mt-6 flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <form v-else @submit.prevent="updateProfile" class="mt-6 space-y-6">
            
            <!-- Profile Photo Section -->
            <div class="col-span-12 flex flex-col items-center text-center">
              <h3 class="text-lg font-medium text-gray-900">Foto Profil</h3>
              
              <div class="mt-2">
                <template v-if="photoPreview">
                  <img :src="photoPreview" alt="Profile Photo" class="rounded-full h-28 w-28 object-cover border border-gray-200">
                </template>
                <template v-else-if="profileData.profile_photo_url">
                  <img :src="getStorageUrl(profileData.profile_photo_url)" alt="Profile Photo" class="rounded-full h-28 w-28 object-cover border border-gray-200">
                </template>
                <template v-else>
                  <div class="h-28 w-28 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-3xl">
                    {{ userInitials }}
                  </div>
                </template>
              </div>

              <input type="file" class="hidden" ref="photoInput" @change="handlePhotoChange" accept="image/*">

              <button type="button" @click="$refs.photoInput.click()" 
                class="mt-4 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150">
                Pilih Foto Baru
              </button>
              
              <p v-if="errors.photo" class="mt-2 text-sm text-red-600">{{ errors.photo[0] }}</p>
            </div>

            <!-- Display API Data -->
            <div class="mt-8 border-t border-gray-200 pt-8">
              <h3 class="text-lg font-medium text-gray-900">Data Kepegawaian / Identitas</h3>
              
              <div class="mt-4">
                <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  
                  <!-- Column 1 -->
                  <div class="space-y-6">
                    <div>
                      <label class="block font-medium text-sm text-gray-700">NIP / NIK</label>
                      <input v-model="form.nip" type="text" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full">
                      <p v-if="errors.nip" class="mt-2 text-sm text-red-600">{{ errors.nip[0] }}</p>
                      <p class="mt-1 text-xs text-gray-500 italic">*Jika ASN, mohon masukkan NIP.</p>
                    </div>

                    <template v-if="profileData.is_asn">
                      <div v-if="profileData.kepegawaian?.pangkat">
                        <label class="block font-medium text-sm text-gray-700">Pangkat</label>
                        <p class="mt-1 block w-full text-gray-700">{{ profileData.kepegawaian.pangkat }}</p>
                      </div>

                      <div v-if="profileData.kepegawaian?.jabatan && profileData.kepegawaian.jabatan !== '-'">
                        <label class="block font-medium text-sm text-gray-700">Jabatan</label>
                        <p class="mt-1 block w-full text-gray-700">{{ profileData.kepegawaian.jabatan }}</p>
                      </div>

                      <div v-if="profileData.kepegawaian?.unit_bagian && profileData.kepegawaian.unit_bagian !== '-' && !profileData.kepegawaian.unit_bagian.includes('Hubungan Masyarakat')">
                        <label class="block font-medium text-sm text-gray-700">Unit Bagian</label>
                        <p class="mt-1 block w-full text-gray-700">{{ profileData.kepegawaian.unit_bagian }}</p>
                      </div>
                    </template>
                  </div>

                  <!-- Column 2 -->
                  <div class="space-y-6">
                    <template v-if="profileData.is_asn">
                      <div>
                        <label class="block font-medium text-sm text-gray-700">Nama</label>
                        <p class="mt-1 block w-full text-gray-700 font-semibold">{{ profileData.user?.name }}</p>
                      </div>

                      <div v-if="profileData.kepegawaian?.unit_kerja">
                        <label class="block font-medium text-sm text-gray-700">Unit Kerja</label>
                        <p class="mt-1 block w-full text-gray-700">{{ profileData.kepegawaian.unit_kerja }}</p>
                      </div>

                      <div v-if="profileData.kepegawaian?.nomor_hp && profileData.kepegawaian.nomor_hp !== '-'">
                        <label class="block font-medium text-sm text-gray-700">Nomor HP</label>
                        <p class="mt-1 block w-full text-gray-700">{{ profileData.kepegawaian.nomor_hp }}</p>
                      </div>
                    </template>

                    <div>
                      <label class="block font-medium text-sm text-gray-700">Email</label>
                      <template v-if="profileData.is_asn && profileData.user?.email && profileData.user.email !== '-' && !form.email_can_update">
                        <p class="mt-1 block w-full text-gray-700">{{ profileData.user.email }}</p>
                      </template>
                      <template v-else>
                        <input v-model="form.email" type="email" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full" required>
                        <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email[0] }}</p>
                        <p class="mt-2 text-sm text-red-600">Email dapat diperbarui.</p>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Other Editable Information Section -->
            <div class="mt-8 border-t border-gray-200 pt-8">
              <h3 class="text-lg font-medium text-gray-900">Informasi Tambahan</h3>
              <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 mt-4">
                
                <div>
                  <label class="block font-medium text-sm text-gray-700">Facebook</label>
                  <div class="flex items-center mt-1">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md h-10">
                      <i class="fab fa-facebook w-5 h-5 flex items-center justify-center"></i>
                    </span>
                    <input v-model="form.facebook" type="text" placeholder="https://facebook.com/username" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-none rounded-r-md block w-full h-10">
                  </div>
                  <p v-if="errors.facebook" class="mt-2 text-sm text-red-600">{{ errors.facebook[0] }}</p>
                </div>

                <div>
                  <label class="block font-medium text-sm text-gray-700">Instagram</label>
                  <div class="flex items-center mt-1">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md h-10">
                      <i class="fab fa-instagram w-5 h-5 flex items-center justify-center"></i>
                    </span>
                    <input v-model="form.instagram" type="text" placeholder="https://instagram.com/username" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-none rounded-r-md block w-full h-10">
                  </div>
                  <p v-if="errors.instagram" class="mt-2 text-sm text-red-600">{{ errors.instagram[0] }}</p>
                </div>

                <div>
                  <label class="block font-medium text-sm text-gray-700">Tiktok</label>
                  <div class="flex items-center mt-1">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md h-10">
                      <i class="fab fa-tiktok w-5 h-5 flex items-center justify-center"></i>
                    </span>
                    <input v-model="form.tiktok" type="text" placeholder="https://tiktok.com/@username" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-none rounded-r-md block w-full h-10">
                  </div>
                  <p v-if="errors.tiktok" class="mt-2 text-sm text-red-600">{{ errors.tiktok[0] }}</p>
                </div>

                <div>
                  <label class="block font-medium text-sm text-gray-700">LinkedIn</label>
                  <div class="flex items-center mt-1">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md h-10">
                      <i class="fab fa-linkedin w-5 h-5 flex items-center justify-center"></i>
                    </span>
                    <input v-model="form.linkedin" type="text" placeholder="https://linkedin.com/in/username" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-none rounded-r-md block w-full h-10">
                  </div>
                  <p v-if="errors.linkedin" class="mt-2 text-sm text-red-600">{{ errors.linkedin[0] }}</p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4 mt-6">
              <button type="submit" :disabled="saving" class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50">
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                Simpan Perubahan
              </button>

              <transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition ease-in duration-300"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <p v-if="successMessage" class="text-sm text-gray-600">{{ successMessage }}</p>
              </transition>
            </div>

          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api, { getStorageUrl } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const loading = ref(true)
const saving = ref(false)
const profileData = ref({})
const errors = ref({})
const successMessage = ref('')

const form = ref({
  nip: '',
  name: '',
  email: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  linkedin: '',
  photo: null,
  email_can_update: false
})

const photoPreview = ref(null)
const photoInput = ref(null)

const userInitials = computed(() => {
  const name = form.value.name || profileData.value.user?.name || 'User'
  const names = name.split(' ')
  if (names.length >= 2) {
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const fetchProfile = async () => {
  try {
    loading.value = true
    const response = await api.get('/profile')
    if (response.data.success) {
      const data = response.data.data
      profileData.value = data
      
      form.value.nip = data.user.nip || ''
      form.value.name = data.user.name || ''
      form.value.email = data.user.email || ''
      form.value.facebook = data.user.facebook || ''
      form.value.instagram = data.user.instagram || ''
      form.value.tiktok = data.user.tiktok || ''
      form.value.linkedin = data.user.linkedin || ''
      
      // Determine if email can be updated (if it was empty initially, or we allow it)
      form.value.email_can_update = !data.is_asn || !data.user.email || data.user.email === '-'
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
  } finally {
    loading.value = false
  }
}

const handlePhotoChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  form.value.photo = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const updateProfile = async () => {
  try {
    saving.value = true
    errors.value = {}
    
    const formData = new FormData()
    formData.append('nip', form.value.nip)
    // we only allow updating email if email_can_update is true
    if (form.value.email_can_update) {
      formData.append('email', form.value.email)
    }
    // we don't send name if they are ASN because API handles it, but let's just send it
    formData.append('name', form.value.name)
    formData.append('facebook', form.value.facebook)
    formData.append('instagram', form.value.instagram)
    formData.append('tiktok', form.value.tiktok)
    formData.append('linkedin', form.value.linkedin)
    
    if (form.value.photo) {
      formData.append('photo', form.value.photo)
    }

    const response = await api.post('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.success) {
      successMessage.value = 'Tersimpan.'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
      
      // Update auth store user and localStorage
      authStore.user = response.data.data.user
      localStorage.setItem('ppid_user', JSON.stringify(authStore.user))
      
      // Update profile data photo url
      profileData.value.profile_photo_url = response.data.data.profile_photo_url
    }
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      console.error('Error updating profile:', error)
    }
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>
