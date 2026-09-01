<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs :breadcrumbs="breadcrumbsList" />
      <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">Edit Profil Pejabat</h1>
          <p class="text-sm text-gray-500 mt-2">Perbarui data profil, riwayat karir, dan penghargaan pimpinan daerah.</p>
        </div>
        <button type="button" @click="router.back()" class="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50">
          <i class="fas fa-arrow-left mr-2"></i> Kembali
        </button>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl shadow-sm border border-red-100">{{ error }}</div>

      <div v-else-if="official" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Photo Upload -->
        <div class="bg-gradient-to-b from-blue-50/50 to-white p-10 flex flex-col items-center justify-center border-b border-gray-100">
          <div class="relative group cursor-pointer" @click="triggerPhotoUpload">
            <div class="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
              <img v-if="photoPreview" :src="photoPreview" class="w-full h-full object-cover">
              <img v-else-if="getStorageUrl(official?.photo)" :src="getStorageUrl(official?.photo)" class="w-full h-full object-cover">
              <i v-else class="fas fa-user text-6xl text-gray-300"></i>
            </div>
            <div class="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 border-4 border-white">
              <i class="fas fa-camera text-lg"></i>
            </div>
          </div>
          <p class="text-xs font-bold text-gray-400 mt-6 uppercase tracking-widest text-center">Klik foto untuk memperbarui<br><span class="font-normal normal-case">(Rekomendasi rasio 1:1, Max 2MB)</span></p>
          <input type="file" id="photo_input" accept="image/*" class="hidden" @change="onPhotoSelected">
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
            :class="['px-6 py-5 text-sm font-bold whitespace-nowrap border-b-2 transition-all', activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50/30 shadow-inner' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50']">
            <i :class="tab.icon" class="mr-2"></i> {{ tab.name }}
          </button>
        </div>

        <form @submit.prevent="handleSave" class="p-8">

          <!-- TAB: IDENTITAS -->
          <div v-show="activeTab === 'identitas'" class="space-y-6 animate-fadeIn">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap <span class="text-red-500">*</span></label>
                <input v-model="form.full_name" type="text" required class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Dr. H. Ahmad Fauzi, M.Si">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jabatan Utama <span class="text-red-500">*</span></label>
                <select v-model="form.position_id" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Pilih Jabatan --</option>
                  <option v-for="pos in positions" :key="pos.id" :value="pos.id">{{ pos.name }}</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Jabatan</label>
                <select v-model="form.status_jabatan" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Pilih Status Jabatan --</option>
                  <option v-for="s in statusJabatanOptions" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">NIP</label>
                <input v-model="form.nip" type="text" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500" placeholder="19XXXXXXXXXXXXXX">
              </div>
              <div v-show="showOrganizationField" class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">OPD / Organisasi</label>
                <select v-model="form.organization_id" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Pilih OPD --</option>
                  <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.name }}</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
                <input v-model="form.email" type="email" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500" placeholder="nama@email.com">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mulai Masa Jabatan</label>
                <input v-model="form.start_term" type="date" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Akhir Masa Jabatan</label>
                <input v-model="form.end_term" type="date" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Aktif <span class="text-red-500">*</span></label>
                <div class="flex gap-4">
                  <label v-for="(lbl, val) in statusOptions" :key="val"
                    class="flex-1 flex items-center justify-center px-4 py-3 border rounded-xl cursor-pointer transition-all"
                    :class="form.status === val ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'">
                    <input type="radio" :value="val" v-model="form.status" class="mr-2 text-blue-600">
                    <span class="text-sm font-medium">{{ lbl }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: BIODATA -->
          <div v-show="activeTab === 'biodata'" class="space-y-6 animate-fadeIn">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tempat Lahir</label>
                <input v-model="form.birth_place" type="text" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tanggal Lahir</label>
                <input v-model="form.birth_date" type="date" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Agama</label>
                <select v-model="form.religion" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Pilih Agama --</option>
                  <option v-for="a in agamaOptions" :key="a" :value="a">{{ a }}</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jenis Kelamin</label>
                <select v-model="form.jenis_kelamin" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Pilih --</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Pernikahan</label>
                <select v-model="form.marital_status" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Pilih --</option>
                  <option v-for="m in maritalOptions" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Domisili</label>
                <input v-model="form.home_address" type="text" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Pasangan (Suami/Istri)</label>
                <input v-model="form.spouse_name" type="text" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Biografi Singkat</label>
                <textarea v-model="form.biography" rows="6" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500" placeholder="Tuliskan biografi lengkap pimpinan di sini..."></textarea>
              </div>
            </div>
          </div>

          <!-- TAB: KELUARGA -->
          <div v-show="activeTab === 'keluarga'" class="space-y-6 animate-fadeIn">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-black text-gray-800 tracking-tight">Data Anak</h3>
              <button type="button" @click="addItem('children', { name: '', birth_place: '', birth_date: '' })" class="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase shadow-sm">Tambah Anak</button>
            </div>
            <div v-for="(child, index) in form.children" :key="index" class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm mb-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><label class="text-[9px] font-black text-gray-400 uppercase">Nama Anak</label><input v-model="child.name" type="text" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
                <div><label class="text-[9px] font-black text-gray-400 uppercase">Tempat Lahir</label><input v-model="child.birth_place" type="text" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
                <div><label class="text-[9px] font-black text-gray-400 uppercase">Tanggal Lahir</label><input v-model="child.birth_date" type="date" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
              </div>
              <button type="button" @click="removeItem('children', index)" class="mt-4 text-red-500 text-xs font-bold uppercase"><i class="fas fa-trash-alt mr-1"></i> Hapus</button>
            </div>
          </div>

          <!-- TAB: PENDIDIKAN -->
          <div v-show="activeTab === 'pendidikan'" class="space-y-6 animate-fadeIn">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-black text-gray-800 tracking-tight">Riwayat Pendidikan</h3>
              <button type="button" @click="addItem('educations', { degree: '', institution: '', start_year: '', end_year: '' })" class="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase shadow-sm">Tambah Pendidikan</button>
            </div>
            <div v-for="(edu, index) in form.educations" :key="index" class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm mb-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="md:col-span-2"><label class="text-[9px] font-black text-gray-400 uppercase">Nama Institusi</label><input v-model="edu.institution" type="text" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
                <div><label class="text-[9px] font-black text-gray-400 uppercase">Jenjang</label><input v-model="edu.degree" type="text" placeholder="S1 / S2" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
                <div class="grid grid-cols-2 gap-2">
                  <div><label class="text-[9px] font-black text-gray-400 uppercase">Masuk</label><input v-model="edu.start_year" type="number" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold text-center"></div>
                  <div><label class="text-[9px] font-black text-gray-400 uppercase">Lulus</label><input v-model="edu.end_year" type="number" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold text-center"></div>
                </div>
              </div>
              <button type="button" @click="removeItem('educations', index)" class="mt-4 text-red-500 text-xs font-bold uppercase"><i class="fas fa-trash-alt mr-1"></i> Hapus</button>
            </div>
          </div>

          <!-- TAB: KARIR -->
          <div v-show="activeTab === 'karir'" class="space-y-6 animate-fadeIn">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-black text-gray-800 tracking-tight">Riwayat Karir</h3>
              <button type="button" @click="addItem('career_histories', { title: '', organization_name: '', start_year: '', end_year: '', description: '' })" class="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase shadow-sm">Tambah Karir</button>
            </div>
            <div v-for="(karir, index) in form.career_histories" :key="index" class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm mb-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="md:col-span-2"><label class="text-[9px] font-black text-gray-400 uppercase">Nama Instansi</label><input v-model="karir.organization_name" type="text" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
                <div><label class="text-[9px] font-black text-gray-400 uppercase">Jabatan</label><input v-model="karir.title" type="text" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
                <div class="grid grid-cols-2 gap-2">
                  <div><label class="text-[9px] font-black text-gray-400 uppercase">Mulai</label><input v-model="karir.start_year" type="number" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold text-center"></div>
                  <div><label class="text-[9px] font-black text-gray-400 uppercase">Selesai</label><input v-model="karir.end_year" type="number" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold text-center"></div>
                </div>
              </div>
              <div class="mt-3"><label class="text-[9px] font-black text-gray-400 uppercase">Keterangan Tambahan</label><input v-model="karir.description" type="text" placeholder="Keterangan singkat..." class="w-full mt-1 px-4 py-2 rounded-xl bg-gray-50 border-none text-sm italic text-gray-600"></div>
              <button type="button" @click="removeItem('career_histories', index)" class="mt-4 text-red-500 text-xs font-bold uppercase"><i class="fas fa-trash-alt mr-1"></i> Hapus</button>
            </div>
          </div>

          <!-- TAB: DIKLAT -->
          <div v-show="activeTab === 'diklat'" class="space-y-6 animate-fadeIn">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-black text-gray-800 tracking-tight">Riwayat Diklat</h3>
              <button type="button" @click="addItem('training_histories', { name: '', organizer: '', year: '' })" class="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase shadow-sm">Tambah Diklat</button>
            </div>
            <div v-for="(diklat, index) in form.training_histories" :key="index" class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm mb-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="md:col-span-2"><label class="text-[9px] font-black text-gray-400 uppercase">Nama Diklat</label><input v-model="diklat.name" type="text" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
                <div><label class="text-[9px] font-black text-gray-400 uppercase">Penyelenggara</label><input v-model="diklat.organizer" type="text" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
                <div><label class="text-[9px] font-black text-gray-400 uppercase">Tahun</label><input v-model="diklat.year" type="number" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold text-center"></div>
              </div>
              <button type="button" @click="removeItem('training_histories', index)" class="mt-4 text-red-500 text-xs font-bold uppercase"><i class="fas fa-trash-alt mr-1"></i> Hapus</button>
            </div>
          </div>

          <!-- TAB: ORGANISASI -->
          <div v-show="activeTab === 'organisasi'" class="space-y-6 animate-fadeIn">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-black text-gray-800 tracking-tight">Riwayat Organisasi</h3>
              <button type="button" @click="addItem('organizational_histories', { organization_name: '', position: '', year: '' })" class="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase shadow-sm">Tambah Organisasi</button>
            </div>
            <div v-for="(org, index) in form.organizational_histories" :key="index" class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm mb-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="md:col-span-2"><label class="text-[9px] font-black text-gray-400 uppercase">Nama Organisasi</label><input v-model="org.organization_name" type="text" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
                <div><label class="text-[9px] font-black text-gray-400 uppercase">Jabatan</label><input v-model="org.position" type="text" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
                <div><label class="text-[9px] font-black text-gray-400 uppercase">Tahun</label><input v-model="org.year" type="number" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold text-center"></div>
              </div>
              <button type="button" @click="removeItem('organizational_histories', index)" class="mt-4 text-red-500 text-xs font-bold uppercase"><i class="fas fa-trash-alt mr-1"></i> Hapus</button>
            </div>
          </div>

          <!-- TAB: PENGHARGAAN -->
          <div v-show="activeTab === 'penghargaan'" class="space-y-6 animate-fadeIn">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-black text-gray-800 tracking-tight">Tanda Kehormatan &amp; Penghargaan</h3>
              <button type="button" @click="addItem('awards', { title: '', issuer: '', year: '', description: '' })" class="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase shadow-sm">Tambah Penghargaan</button>
            </div>
            <div v-for="(award, index) in form.awards" :key="index" class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm mb-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="md:col-span-2"><label class="text-[9px] font-black text-gray-400 uppercase">Nama Penghargaan</label><input v-model="award.title" type="text" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
                <div><label class="text-[9px] font-black text-gray-400 uppercase">Instansi Pemberi</label><input v-model="award.issuer" type="text" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold"></div>
                <div><label class="text-[9px] font-black text-gray-400 uppercase">Tahun</label><input v-model="award.year" type="number" class="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border-none font-bold text-center"></div>
              </div>
              <div class="mt-3"><label class="text-[9px] font-black text-gray-400 uppercase">Keterangan Singkat</label><input v-model="award.description" type="text" placeholder="Keterangan singkat..." class="w-full mt-1 px-4 py-2 rounded-xl bg-gray-50 border-none text-sm italic text-gray-600"></div>
              <button type="button" @click="removeItem('awards', index)" class="mt-4 text-red-500 text-xs font-bold uppercase"><i class="fas fa-trash-alt mr-1"></i> Hapus</button>
            </div>
          </div>

          <div class="pt-8 mt-8 border-t border-gray-100 flex justify-end items-center gap-6">
            <button type="button" @click="router.back()" class="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">Batalkan</button>
            <button type="submit" :disabled="saving" class="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-blue-600/20">
              <i v-if="saving" class="fas fa-spinner fa-spin mr-3"></i>
              <i v-else class="fas fa-save mr-3"></i> Simpan Perubahan Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { getBreadcrumbs } from '@/config/breadcrumbs'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug

const breadcrumbsList = computed(() => getBreadcrumbs.editProfilPejabat(official.value?.full_name, official.value?.slug))

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const official = ref(null)
const positions = ref([])
const organizations = ref([])
const photoPreview = ref(null)

const agamaOptions = ['Islam', 'Kristen Protestan', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']
const maritalOptions = ['Belum Menikah', 'Menikah', 'Cerai Hidup', 'Cerai Mati']
const statusJabatanOptions = ['Definitif', 'Penjabat (Pj)', 'Pelaksana Tugas (Plt)', 'Pelaksana Harian (Plh)', 'Pejabat Sementara (Pjs)']
const statusOptions = { active: 'Aktif', inactive: 'Nonaktif', draft: 'Draft' }

const getStorageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `https://ppidkab.sinjaikab.go.id/storage/${path}`
}

const triggerPhotoUpload = () => document.getElementById('photo_input').click()
const onPhotoSelected = (event) => {
  const file = event.target.files[0]
  if (file) photoPreview.value = URL.createObjectURL(file)
}

const showOrganizationField = computed(() => {
  const selectedPos = positions.value.find(p => p.id == form.value.position_id)
  return selectedPos?.name === 'Kepala OPD'
})

const activeTab = ref('identitas')
const tabs = [
  { id: 'identitas', name: 'Identitas', icon: 'fas fa-id-card' },
  { id: 'biodata', name: 'Biodata', icon: 'fas fa-user-circle' },
  { id: 'keluarga', name: 'Keluarga', icon: 'fas fa-users' },
  { id: 'pendidikan', name: 'Pendidikan', icon: 'fas fa-graduation-cap' },
  { id: 'karir', name: 'Karir', icon: 'fas fa-briefcase' },
  { id: 'diklat', name: 'Diklat', icon: 'fas fa-certificate' },
  { id: 'organisasi', name: 'Organisasi', icon: 'fas fa-sitemap' },
  { id: 'penghargaan', name: 'Penghargaan', icon: 'fas fa-award' },
]

const form = ref({
  full_name: '', nip: '', position_id: '', status_jabatan: '', organization_id: '', email: '',
  start_term: '', end_term: '', birth_place: '', birth_date: '',
  religion: '', jenis_kelamin: '', biography: '', status: 'active',
  home_address: '', marital_status: '', spouse_name: '',
  children: [], educations: [], career_histories: [], training_histories: [], organizational_histories: [], awards: []
})

const addItem = (key, template) => form.value[key].push({ ...template })
const removeItem = (key, index) => form.value[key].splice(index, 1)

onMounted(async () => {
  try {
    const res = await api.get(`/profil/pimpinan/${slug}/edit`)
    if (res.data.success) {
      official.value = res.data.official
      positions.value = res.data.positions || []
      organizations.value = res.data.organizations || []
      Object.keys(form.value).forEach(key => {
        if (!Array.isArray(form.value[key]) && official.value[key] !== undefined && official.value[key] !== null) {
          form.value[key] = official.value[key]
        }
      })
      form.value.children = official.value.children || []
      form.value.educations = official.value.educations || []
      form.value.career_histories = official.value.career_histories || []
      form.value.training_histories = official.value.training_histories || []
      form.value.organizational_histories = official.value.organizational_histories || []
      form.value.awards = official.value.awards || []
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal mengambil data pimpinan.'
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  try {
    saving.value = true
    error.value = ''
    const formData = new FormData()
    formData.append('_method', 'POST')
    const skipFields = ['children', 'educations', 'career_histories', 'training_histories', 'organizational_histories', 'awards', 'photo']
    Object.keys(form.value).forEach(key => { if (!skipFields.includes(key)) formData.append(key, form.value[key] || '') })
    const photoInput = document.getElementById('photo_input')
    if (photoInput && photoInput.files[0]) formData.append('photo', photoInput.files[0])
    const arrayFields = ['children', 'educations', 'career_histories', 'training_histories', 'organizational_histories', 'awards']
    arrayFields.forEach(field => {
      form.value[field].forEach((item, index) => {
        Object.keys(item).forEach(key => formData.append(`${field}[${index}][${key}]`, item[key] || ''))
      })
    })
    const res = await api.post(`/profil/pimpinan/${slug}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    if (res.data.success) {
      alert('Data Profil beserta semua riwayat berhasil diperbarui!')
      router.push(`/profil/${official.value.slug}`)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat menyimpan.'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fadeIn { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
