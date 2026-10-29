<template>
  <div class="p-3 lg:p-6 space-y-6">
    <!-- TOP HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 lg:p-6 rounded-3xl shadow-sm border border-gray-100">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 text-lg">
            <i class="fas fa-tasks"></i>
          </div>
          <div>
            <h1 class="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">Manajemen Pertanyaan SAQ</h1>
            <p class="text-xs lg:text-sm text-gray-500 font-medium">
              Kelola pertanyaan e-Monev SAQ tingkat Kabupaten hingga seluruh OPD
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <button
          v-if="selectedOpdId"
          @click="openAttachModal"
          class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 text-xs lg:text-sm font-bold"
        >
          <i class="fas fa-layer-group"></i> Petakan Soal ke OPD Ini
        </button>
        <button
          @click="openAddModal"
          class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 text-xs lg:text-sm font-bold"
        >
          <i class="fas fa-plus"></i> Tambah Pertanyaan
        </button>
        <button
          @click="fetchAllData"
          class="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl transition-colors flex items-center justify-center text-sm"
          title="Muat Ulang Data"
        >
          <i :class="['fas fa-sync-alt', loading ? 'fa-spin' : '']"></i>
        </button>
      </div>
    </div>

    <!-- FILTER & SELEKTOR OPD (DASHBOARD STYLE) -->
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 lg:p-5 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
        <!-- Selektor OPD / Kabupaten -->
        <div class="md:col-span-5">
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
            <i class="fas fa-building text-blue-500 mr-1"></i> Ruang Lingkup OPD
          </label>
          <div class="relative">
            <select
              v-model="selectedOpdId"
              @change="onOpdChange"
              class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs lg:text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer"
            >
              <option value="">⭐ Kabupaten Sinjai (Semua Pertanyaan Master)</option>
              <option v-for="opd in opdsList" :key="opd.id" :value="opd.id">
                {{ opd.name }} {{ opd.saq_indicators_count !== undefined ? `(${opd.saq_indicators_count} Soal)` : '' }}
              </option>
            </select>
          </div>
        </div>

        <!-- Search Input -->
        <div class="md:col-span-4">
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
            <i class="fas fa-search text-gray-400 mr-1"></i> Cari Soal / Kode
          </label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Ketik kode, seksi, atau kata kunci pertanyaan..."
              class="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs lg:text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
            <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              <i class="fas fa-times-circle"></i>
            </button>
          </div>
        </div>

        <!-- Filter Input Type & Duplikat -->
        <div class="md:col-span-3 flex items-center gap-2 pt-4 md:pt-0">
          <div class="flex-1">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
              Tipe Bukti
            </label>
            <select
              v-model="selectedType"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Tipe</option>
              <option value="dokumen">Dokumen</option>
              <option value="foto">Foto</option>
              <option value="situs">Situs</option>
            </select>
          </div>
          <div class="pt-3">
            <button
              type="button"
              @click="toggleSimilarFilter"
              :class="[
                'px-3 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border',
                filterSimilarOnly
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              ]"
              :title="filterSimilarOnly ? 'Tampilkan Semua Soal' : 'Tampilkan Hanya Soal Serupa/Duplikat'"
            >
              <i class="fas fa-clone"></i>
              <span>Serupa</span>
              <span v-if="duplicateGroupsCount" class="px-1.5 py-0.2 rounded-full bg-black/15 text-[10px]">
                {{ duplicateGroupsCount }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- BANNER OPD AKTIF -->
      <div v-if="currentSelectedOpd" class="p-3.5 bg-blue-50/80 border border-blue-100 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-blue-900">
        <div class="flex items-center gap-2">
          <span class="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            <i class="fas fa-check"></i>
          </span>
          <div>
            <span class="font-bold text-gray-900">{{ currentSelectedOpd.name }}</span>
            <span class="text-blue-700 ml-1.5 font-medium">({{ displayedQuestions.length }} pertanyaan terpetakan)</span>
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="text-gray-500">Mode: <strong>Kelola Khusus OPD</strong></span>
          <button @click="resetOpd" class="text-blue-600 hover:text-blue-800 font-bold underline">
            Kembali ke Semua Pertanyaan
          </button>
        </div>
      </div>
    </div>

    <!-- TAB BAR NAVIGATION (SEMUA PERTANYAAN MUNCUL PER TAB) -->
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 overflow-x-auto">
      <div class="flex items-center gap-1.5 min-w-max">
        <button
          @click="activeTabName = ''"
          :class="[
            'px-4 py-2.5 rounded-2xl text-xs lg:text-sm font-bold transition-all flex items-center gap-2',
            activeTabName === ''
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          ]"
        >
          <i class="fas fa-th-large text-xs"></i>
          <span>Semua Tab</span>
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-[10px] font-black',
              activeTabName === '' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            ]"
          >
            {{ questions.length }}
          </span>
        </button>

        <button
          v-for="t in tabsList"
          :key="t.tab"
          @click="activeTabName = t.tab"
          :class="[
            'px-4 py-2.5 rounded-2xl text-xs lg:text-sm font-bold transition-all flex items-center gap-2',
            activeTabName === t.tab
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          ]"
        >
          <span>{{ t.tab }}</span>
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-[10px] font-black',
              activeTabName === t.tab ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
            ]"
          >
            {{ getTabQuestionCount(t.tab) }}
          </span>
        </button>
      </div>
    </div>

    <!-- MAIN CONTENT: PERTANYAAN PER SEKSI / LIST -->
    <div class="space-y-5">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
        <i class="fas fa-circle-notch fa-spin text-3xl mb-3 text-blue-600"></i>
        <p class="text-sm font-semibold text-gray-600">Memuat pertanyaan SAQ...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="bg-white rounded-3xl p-10 text-center border border-red-100 shadow-sm">
        <i class="fas fa-exclamation-triangle text-3xl text-red-500 mb-2"></i>
        <p class="text-sm font-semibold text-red-600">{{ errorMessage }}</p>
        <button @click="fetchAllData" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Coba Lagi
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!groupedSections.length" class="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
        <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400 text-2xl">
          <i class="fas fa-inbox"></i>
        </div>
        <p class="text-sm font-bold text-gray-700">Tidak ada pertanyaan yang cocok</p>
        <p class="text-xs text-gray-400 mt-1">Silakan sesuaikan filter pencarian, tab, atau pilih ruang lingkup OPD lain.</p>
        <button
          v-if="selectedOpdId"
          @click="openAttachModal"
          class="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow"
        >
          <i class="fas fa-plus mr-1"></i> Tambahkan Soal ke OPD Ini
        </button>
      </div>

      <!-- SECTIONS LIST -->
      <div v-else v-for="sec in groupedSections" :key="sec.key" class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- Section Header -->
        <div class="px-5 py-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-extrabold border border-indigo-100">
              <i class="fas fa-folder-open"></i>
            </span>
            <div>
              <h2 class="font-extrabold text-sm lg:text-base text-gray-900 leading-tight">
                {{ sec.sectionName || 'Pertanyaan Langsung' }}
              </h2>
              <span class="text-[11px] font-semibold text-indigo-600">{{ sec.tabName }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold">
              {{ sec.items.length }} Pertanyaan
            </span>
          </div>
        </div>

        <!-- Section Items -->
        <div class="divide-y divide-gray-100">
          <div
            v-for="(item, idx) in sec.items"
            :key="item.id"
            :class="[
              'p-4 lg:p-5 transition-all hover:bg-blue-50/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4',
              item.similar_count > 1 ? 'border-l-4 border-amber-400' : ''
            ]"
          >
            <!-- Kolom Informasi Pertanyaan -->
            <div class="flex-1 min-w-0 space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <!-- Kode Soal -->
                <span class="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold rounded-xl shadow-2xs">
                  {{ item.kode || ('ID #' + item.id) }}
                </span>

                <!-- Urutan (Order) -->
                <span class="text-[11px] text-gray-400 font-semibold" title="Urutan tampil">
                  #{{ item.order || (idx + 1) }}
                </span>

                <!-- Badge Kategori / Parent -->
                <span v-if="item.parent" class="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[10px] font-bold">
                  Induk: {{ item.parent.kode || '' }} {{ truncate(item.parent.pertanyaan, 30) }}
                </span>

                <!-- Badge Input Type -->
                <span
                  :class="[
                    'px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider',
                    item.input_type === 'foto' ? 'bg-amber-100 text-amber-800' :
                    item.input_type === 'situs' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-800'
                  ]"
                >
                  <i :class="item.input_type === 'foto' ? 'fas fa-camera mr-1' : item.input_type === 'situs' ? 'fas fa-globe mr-1' : 'fas fa-file-alt mr-1'"></i>
                  {{ item.input_type || 'dokumen' }}
                </span>

                <!-- Badge Klasifikasi -->
                <span v-if="item.klasifikasi_otomatis" class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-medium">
                  {{ item.klasifikasi_otomatis }}
                </span>

                <!-- Badge Target -->
                <span v-if="item.target_upload" class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-mono">
                  {{ item.target_upload }}
                </span>

                <!-- BADGE PERTANYAAN SERUPA (KLIK BUKA AUDIT MODAL) -->
                <button
                  v-if="item.similar_count > 1"
                  @click="openSimilarModal(item)"
                  class="px-2.5 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all animate-pulse"
                  title="Klik untuk melihat dan mengaudit pertanyaan serupa"
                >
                  <i class="fas fa-exclamation-triangle"></i>
                  <span>{{ item.similar_count }} Pertanyaan Serupa</span>
                </button>
              </div>

              <!-- Teks Pertanyaan -->
              <p class="text-sm font-semibold text-gray-800 leading-relaxed">
                {{ item.pertanyaan }}
              </p>

              <!-- Petunjuk Dokumen / Unit Terkait -->
              <div v-if="item.dokumen_upload || item.unit_terkait" class="flex flex-wrap gap-3 text-xs text-gray-500">
                <span v-if="item.dokumen_upload" class="flex items-center gap-1">
                  <i class="fas fa-info-circle text-blue-500"></i>
                  <span class="italic text-[11px]">{{ truncate(item.dokumen_upload, 80) }}</span>
                </span>
                <span v-if="item.unit_terkait" class="flex items-center gap-1 text-[11px]">
                  <i class="fas fa-tag text-gray-400"></i> {{ item.unit_terkait }}
                </span>
              </div>

              <!-- OPD MAPPING BADGES -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <button
                  @click="openMappingModal(item)"
                  class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Klik untuk mengubah pemetaan OPD"
                >
                  <i class="fas fa-building text-[10px]"></i>
                  <span>{{ item.organizations_count || 0 }} OPD Terpetakan</span>
                  <i class="fas fa-chevron-right text-[9px] opacity-70"></i>
                </button>

                <!-- Status Terpetakan ke OPD Terpilih -->
                <span
                  v-if="selectedOpdId"
                  class="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold flex items-center gap-1"
                >
                  <i class="fas fa-check-circle"></i>
                  <span>Aktif di OPD Ini</span>
                </span>
              </div>
            </div>

            <!-- Kolom Toolbar Aksi Cepat -->
            <div class="flex items-center gap-1.5 shrink-0 self-end lg:self-center pt-2 lg:pt-0">
              <!-- Reorder Up -->
              <button
                @click="moveOrder(item, 'up')"
                :disabled="movingId === item.id"
                title="Geser Urutan Naik"
                class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <i class="fas fa-arrow-up text-xs"></i>
              </button>

              <!-- Reorder Down -->
              <button
                @click="moveOrder(item, 'down')"
                :disabled="movingId === item.id"
                title="Geser Urutan Turun"
                class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <i class="fas fa-arrow-down text-xs"></i>
              </button>

              <!-- Pindahkan (Tab / Seksi / Parent) -->
              <button
                @click="openMoveModal(item)"
                title="Pindahkan ke Tab / Seksi Lain"
                class="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
              >
                <i class="fas fa-exchange-alt text-xs"></i>
              </button>

              <!-- Edit Pertanyaan -->
              <button
                @click="openEditModal(item)"
                title="Edit Pertanyaan"
                class="w-9 h-9 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-colors"
              >
                <i class="fas fa-pen text-xs"></i>
              </button>

              <!-- Mapping OPD -->
              <button
                @click="openMappingModal(item)"
                title="Atur Pemetaan OPD"
                class="w-9 h-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors"
              >
                <i class="fas fa-sitemap text-xs"></i>
              </button>

              <!-- Lepaskan Dari OPD Ini (Hanya Muncul jika memfilter OPD Spesifik) -->
              <button
                v-if="selectedOpdId"
                @click="detachFromCurrentOpd(item)"
                :disabled="detachingId === item.id"
                title="Hapus Pertanyaan dari OPD Ini Saja"
                class="w-9 h-9 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <i v-if="detachingId === item.id" class="fas fa-spinner fa-spin text-xs"></i>
                <i v-else class="fas fa-user-minus text-xs"></i>
              </button>

              <!-- Hapus Master Pertanyaan -->
              <button
                @click="confirmDeleteMaster(item)"
                title="Hapus Pertanyaan dari Database"
                class="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
              >
                <i class="fas fa-trash text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL TAMBAH / EDIT PERTANYAAN -->
    <SaqQuestionModal
      v-if="showQuestionModal"
      :item="editingItem"
      :tabs="tabsList"
      :default-tab="activeTabName"
      :default-opd-id="selectedOpdId"
      @close="showQuestionModal = false"
      @saved="onQuestionSaved"
    />

    <!-- MODAL MAPPING OPD -->
    <SaqOpdPicker
      v-if="showMappingModal"
      :item="mappingItem"
      @close="showMappingModal = false"
      @saved="onMappingSaved"
    />

    <!-- MODAL PINDAH (TAB / SEKSI / PARENT / ORDER) -->
    <SaqMoveModal
      v-if="showMoveModal"
      :item="movingItem"
      :tabs="tabsList"
      :all-questions="questions"
      @close="showMoveModal = false"
      @saved="onMoveSaved"
    />

    <!-- MODAL AUDIT PERTANYAAN SERUPA -->
    <SaqSimilarModal
      v-if="showSimilarModal"
      :item="similarTargetItem"
      @close="showSimilarModal = false"
      @edit="onSimilarEdit"
      @mapping="onSimilarMapping"
      @move="onSimilarMove"
      @deleted="onSimilarDeleted"
    />

    <!-- MODAL PETAKAN SOAL KE OPD INI -->
    <SaqAttachOpdModal
      v-if="showAttachModal && currentSelectedOpd"
      :opd="currentSelectedOpd"
      :tabs="tabsList"
      :currently-mapped-ids="currentlyMappedIds"
      @close="showAttachModal = false"
      @saved="onAttachSaved"
    />

    <!-- MODAL KONFIRMASI HAPUS MASTER -->
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="deleteTarget = null"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">
            <i class="fas fa-trash"></i>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Hapus Pertanyaan Master?</h3>
            <p class="text-xs text-gray-500 font-mono">{{ deleteTarget.kode || ('#' + deleteTarget.id) }}</p>
          </div>
        </div>
        <p class="text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100 line-clamp-3">
          {{ deleteTarget.pertanyaan }}
        </p>
        <div class="flex justify-end gap-2.5">
          <button @click="deleteTarget = null" class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 font-medium">
            Batal
          </button>
          <button
            @click="doDeleteMaster"
            :disabled="deleting"
            class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-red-600/20"
          >
            <i v-if="deleting" class="fas fa-spinner fa-spin"></i>
            <span>Ya, Hapus</span>
          </button>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFIKASI -->
    <div
      v-if="toast"
      :class="[
        'fixed bottom-6 right-6 z-[70] px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold text-white flex items-center gap-2.5 transition-all',
        toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
      ]"
    >
      <i :class="toast.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'"></i>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import SaqQuestionModal from '@/components/admin/SaqQuestionModal.vue'
import SaqOpdPicker from '@/components/admin/SaqOpdPicker.vue'
import SaqMoveModal from '@/components/admin/SaqMoveModal.vue'
import SaqSimilarModal from '@/components/admin/SaqSimilarModal.vue'
import SaqAttachOpdModal from '@/components/admin/SaqAttachOpdModal.vue'

const router = useRouter()
const authStore = useAuthStore()

// Guard Superadmin
if (typeof window !== 'undefined' && !authStore.isSuperAdmin) {
  router.push('/login')
}

// State Data Utama
const questions = ref([])
const tabsList = ref([])
const opdsList = ref([])
const loading = ref(true)
const errorMessage = ref('')
const duplicateGroupsCount = ref(0)

// Filters
const selectedOpdId = ref('')
const activeTabName = ref('')
const searchQuery = ref('')
const selectedType = ref('')
const filterSimilarOnly = ref(false)

// Modals State
const showQuestionModal = ref(false)
const editingItem = ref(null)

const showMappingModal = ref(false)
const mappingItem = ref(null)

const showMoveModal = ref(false)
const movingItem = ref(null)

const showSimilarModal = ref(false)
const similarTargetItem = ref(null)

const showAttachModal = ref(false)

const deleteTarget = ref(null)
const deleting = ref(false)
const movingId = ref(null)
const detachingId = ref(null)
const toast = ref(null)

function showToast(message, type = 'success') {
  toast.value = { message, type }
  setTimeout(() => (toast.value = null), 3500)
}

function truncate(text, len) {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '...' : text
}

const currentSelectedOpd = computed(() => {
  if (!selectedOpdId.value) return null
  return opdsList.value.find((o) => Number(o.id) === Number(selectedOpdId.value)) || null
})

const currentlyMappedIds = computed(() => {
  return questions.value.map((q) => q.id)
})

function getTabQuestionCount(tabName) {
  return questions.value.filter((q) => q.tab === tabName).length
}

// Filtered Questions
const displayedQuestions = computed(() => {
  let list = questions.value

  // Filter Tab
  if (activeTabName.value) {
    list = list.filter((q) => q.tab === activeTabName.value)
  }

  // Filter Input Type
  if (selectedType.value) {
    list = list.filter((q) => q.input_type === selectedType.value)
  }

  // Filter Similar Only
  if (filterSimilarOnly.value) {
    list = list.filter((q) => (q.similar_count || 1) > 1)
  }

  // Filter Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((item) => {
      return (
        (item.pertanyaan || '').toLowerCase().includes(q) ||
        (item.kode || '').toLowerCase().includes(q) ||
        (item.section || '').toLowerCase().includes(q) ||
        (item.unit_terkait || '').toLowerCase().includes(q)
      )
    })
  }

  return list
})

// Mengelompokkan pertanyaan per Seksi untuk tab aktif
const groupedSections = computed(() => {
  const groups = {}
  for (const item of displayedQuestions.value) {
    const secName = item.section || 'Lainnya'
    const key = `${item.tab}___${secName}`
    if (!groups[key]) {
      groups[key] = {
        key,
        tabName: item.tab,
        sectionName: item.section || '',
        items: [],
      }
    }
    groups[key].items.push(item)
  }
  return Object.values(groups)
})

// Toggle Filter Soal Serupa
function toggleSimilarFilter() {
  filterSimilarOnly.value = !filterSimilarOnly.value
}

// Reset filter OPD
function resetOpd() {
  selectedOpdId.value = ''
  fetchAllData()
}

function onOpdChange() {
  fetchAllData()
}

// Fetch Semua Data
async function fetchAllData() {
  loading.value = true
  errorMessage.value = ''
  try {
    const params = { per_page: 'all' }
    if (selectedOpdId.value) {
      params.organization_id = selectedOpdId.value
    }
    const res = await api.get('/saq-admin/indicators', { params })
    const payload = res.data?.data
    questions.value = payload?.data || []
    duplicateGroupsCount.value = res.data?.meta?.duplicate_groups_count || 0
  } catch (e) {
    errorMessage.value = e.response?.data?.message || 'Gagal memuat daftar pertanyaan SAQ.'
  } finally {
    loading.value = false
  }
}

async function fetchTabs() {
  try {
    const res = await api.get('/saq-admin/tabs')
    tabsList.value = res.data?.data || []
  } catch (e) {
    console.error('Gagal memuat tabs:', e)
  }
}

async function fetchOpds() {
  try {
    const res = await api.get('/saq-admin/opds')
    opdsList.value = res.data?.data || []
  } catch (e) {
    console.error('Gagal memuat OPDs:', e)
  }
}

// Tambah / Edit Modal
function openAddModal() {
  editingItem.value = null
  showQuestionModal.value = true
}

function openEditModal(item) {
  editingItem.value = item
  showQuestionModal.value = true
}

function onQuestionSaved() {
  showQuestionModal.value = false
  fetchAllData()
  fetchOpds()
  showToast('Pertanyaan berhasil disimpan.')
}

// Mapping Modal
function openMappingModal(item) {
  mappingItem.value = item
  showMappingModal.value = true
}

function onMappingSaved(count) {
  showMappingModal.value = false
  fetchAllData()
  fetchOpds()
  showToast(`Pemetaan diperbarui (${count} OPD).`)
}

// Move Modal
function openMoveModal(item) {
  movingItem.value = item
  showMoveModal.value = true
}

function onMoveSaved() {
  showMoveModal.value = false
  fetchAllData()
  showToast('Pertanyaan berhasil dipindahkan.')
}

// Quick Reorder Up / Down
async function moveOrder(item, direction) {
  movingId.value = item.id
  try {
    await api.post(`/saq-admin/indicators/${item.id}/move`, { direction })
    await fetchAllData()
    showToast(`Urutan pertanyaan berhasil diubah.`)
  } catch (e) {
    showToast(e.response?.data?.message || 'Gagal mengubah urutan.', 'error')
  } finally {
    movingId.value = null
  }
}

// Attach Questions to OPD Modal
function openAttachModal() {
  showAttachModal.value = true
}

function onAttachSaved(data) {
  showAttachModal.value = false
  fetchAllData()
  fetchOpds()
  showToast(`${data?.attached_count || 'Beberapa'} pertanyaan berhasil ditambahkan ke OPD ini.`)
}

// Similar Questions Modal
function openSimilarModal(item) {
  similarTargetItem.value = item
  showSimilarModal.value = true
}

function onSimilarEdit(sim) {
  showSimilarModal.value = false
  openEditModal(sim)
}

function onSimilarMapping(sim) {
  showSimilarModal.value = false
  openMappingModal(sim)
}

function onSimilarMove(sim) {
  showSimilarModal.value = false
  openMoveModal(sim)
}

function onSimilarDeleted() {
  fetchAllData()
  showToast('Pertanyaan duplikat berhasil dihapus.')
}

// Detach from current OPD
async function detachFromCurrentOpd(item) {
  if (!selectedOpdId.value) return
  const opdName = currentSelectedOpd.value?.name || 'OPD ini'
  if (!confirm(`Lepaskan pertanyaan "${item.kode || ('#' + item.id)}" dari ${opdName}?`)) return

  detachingId.value = item.id
  try {
    await api.delete(`/saq-admin/indicators/${item.id}/opd/${selectedOpdId.value}`)
    await fetchAllData()
    await fetchOpds()
    showToast(`Pertanyaan dilepaskan dari ${opdName}.`)
  } catch (e) {
    showToast(e.response?.data?.message || 'Gagal melepaskan pertanyaan.', 'error')
  } finally {
    detachingId.value = null
  }
}

// Delete Master
function confirmDeleteMaster(item) {
  deleteTarget.value = item
}

async function doDeleteMaster() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`/saq-admin/indicators/${deleteTarget.value.id}`)
    deleteTarget.value = null
    await fetchAllData()
    await fetchOpds()
    showToast('Pertanyaan berhasil dihapus dari sistem.')
  } catch (e) {
    showToast(e.response?.data?.message || 'Gagal menghapus pertanyaan master.', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchTabs()
  fetchOpds()
  fetchAllData()
})
</script>
