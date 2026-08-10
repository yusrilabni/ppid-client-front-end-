import os
import textwrap

base_dir = "C:/laragon/www/PPID/ppid-laravel/production_deployment/ppid_client/src/pages"

pages = {
    "HomePage.vue": """\
<template>
  <div class="home-page bg-gray-50 min-h-screen">
    <!-- Hero Slider -->
    <section class="hero-slider relative h-[600px] overflow-hidden bg-gray-900">
      <div v-if="loading" class="absolute inset-0 z-10 flex items-center justify-center">
        <LoadingSkeleton type="hero" />
      </div>
      <div v-else class="swiper-container h-full">
        <div class="swiper-wrapper h-full">
          <div class="swiper-slide relative h-full flex items-center" v-for="(slide, index) in data.sliders" :key="index">
            <img :src="getStorageUrl(slide.image)" class="absolute inset-0 w-full h-full object-cover opacity-60" alt="Slide Image" />
            <div class="container mx-auto px-6 relative z-10 text-white">
              <h1 class="text-5xl font-bold mb-4 animate-fade-in-up">{{ slide.title }}</h1>
              <p class="text-xl mb-8 animate-fade-in-up delay-100 max-w-2xl">{{ slide.description }}</p>
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all animate-fade-in-up delay-200 shadow-lg">Pelajari Lebih Lanjut</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Cards -->
    <section class="py-16 container mx-auto px-6 relative z-20 -mt-20">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(cat, index) in categories" :key="index" class="bg-white rounded-xl shadow-xl p-6 transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-blue-600">
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-600 text-2xl">
            <i :class="cat.icon"></i>
          </div>
          <h3 class="font-bold text-lg mb-2">{{ cat.title }}</h3>
          <p class="text-gray-600 mb-4 text-sm">{{ cat.desc }}</p>
          <div class="flex justify-between items-center text-sm">
            <span class="font-bold text-blue-600">{{ cat.count || 0 }} Data</span>
            <router-link :to="cat.link" class="text-blue-500 hover:text-blue-700"><i class="fas fa-arrow-right"></i></router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Info -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-6">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Informasi Terbaru</h2>
            <div class="w-20 h-1 bg-blue-600 rounded"></div>
          </div>
          <router-link to="/informasi/berkala" class="text-blue-600 hover:text-blue-800 font-semibold hidden md:block">Lihat Semua <i class="fas fa-chevron-right text-xs ml-1"></i></router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8" v-if="!loading">
          <div v-for="info in data.latest_informasi" :key="info.id" class="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div class="p-6">
              <div class="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-2">{{ info.category }}</div>
              <h3 class="font-bold text-lg mb-3 line-clamp-2 text-gray-800"><router-link :to="'/informasi/' + info.slug" class="hover:text-blue-600">{{ info.title }}</router-link></h3>
              <p class="text-sm text-gray-600 mb-4 line-clamp-3">{{ info.excerpt || info.content }}</p>
              <div class="flex items-center text-xs text-gray-500">
                <i class="far fa-calendar-alt mr-2"></i> {{ new Date(info.created_at).toLocaleDateString('id-ID') }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <LoadingSkeleton v-for="i in 3" :key="i" type="card" />
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-16 bg-gradient-to-r from-blue-700 to-indigo-900 text-white">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div v-for="(stat, idx) in statsData" :key="idx" class="p-4">
            <div class="text-4xl md:text-5xl font-bold mb-2 text-blue-300">{{ stat.value }}</div>
            <div class="text-sm md:text-base font-medium opacity-90">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-2">Galeri Kegiatan</h2>
        <div class="w-20 h-1 bg-blue-600 rounded mx-auto mb-10"></div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" v-if="!loading">
          <div v-for="item in data.gallery" :key="item.id" class="relative group rounded-lg overflow-hidden aspect-square cursor-pointer bg-gray-200">
            <img :src="getStorageUrl(item.image_path)" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" :alt="item.title" />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
              <i class="fas fa-search-plus text-white opacity-0 group-hover:opacity-100 text-3xl transform scale-50 group-hover:scale-100 transition-all duration-300 delay-100"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api, { getStorageUrl } from '@/services/api';
import LoadingSkeleton from '@/components/LoadingSkeleton.vue';

const loading = ref(true);
const data = ref({
  sliders: [],
  latest_informasi: [],
  news: [],
  gallery: [],
  statistics: {},
  contact: {}
});

const categories = ref([
  { title: 'Informasi Berkala', desc: 'Informasi yang diperbarui secara rutin', icon: 'fas fa-sync-alt', link: '/informasi/berkala', count: 0 },
  { title: 'Informasi Setiap Saat', desc: 'Informasi yang tersedia kapan saja', icon: 'fas fa-clock', link: '/informasi/setiap-saat', count: 0 },
  { title: 'Informasi Serta Merta', desc: 'Informasi penting dan mendesak', icon: 'fas fa-bolt', link: '/informasi/serta-merta', count: 0 },
  { title: 'Dikecualikan', desc: 'Informasi yang dirahasiakan / dikecualikan', icon: 'fas fa-lock', link: '/informasi/dikecualikan', count: 0 },
]);

const statsData = ref([
  { label: 'Total Informasi Publik', value: '0' },
  { label: 'Permohonan Informasi', value: '0' },
  { label: 'Respon Survei', value: '0' },
  { label: 'Indeks Kepuasan', value: '0%' }
]);

onMounted(async () => {
  try {
    const res = await api.get('/home');
    data.value = res.data;
    
    // Update stats
    if(res.data.statistics) {
      statsData.value[0].value = res.data.statistics.total_informasi || 0;
      statsData.value[1].value = res.data.statistics.total_permohonan || 0;
      statsData.value[2].value = res.data.statistics.total_survei || 0;
      statsData.value[3].value = (res.data.statistics.satisfaction_rate || 0) + '%';
      
      categories.value[0].count = res.data.statistics.informasi_berkala || 0;
      categories.value[1].count = res.data.statistics.informasi_setiap_saat || 0;
      categories.value[2].count = res.data.statistics.informasi_serta_merta || 0;
      categories.value[3].count = res.data.statistics.informasi_dikecualikan || 0;
    }
  } catch (error) {
    console.error("Error fetching home data", error);
  } finally {
    loading.value = false;
  }
});
</script>
""",
    "SearchPage.vue": """\
<template>
  <div class="search-page min-h-screen bg-gray-50 pt-24 pb-12">
    <PageHeader title="Pencarian Informasi" description="Temukan informasi publik yang Anda butuhkan" />
    
    <div class="container mx-auto px-6 mt-8">
      <!-- Search Box -->
      <div class="max-w-3xl mx-auto mb-12">
        <form @submit.prevent="performSearch" class="relative shadow-lg rounded-full overflow-hidden">
          <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <i class="fas fa-search text-gray-400 text-xl"></i>
          </div>
          <input v-model="searchQuery" type="text" class="w-full pl-14 pr-32 py-5 text-lg border-0 focus:ring-2 focus:ring-blue-500 rounded-full" placeholder="Ketik kata kunci pencarian..." />
          <button type="submit" class="absolute inset-y-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full font-medium transition-colors">Cari</button>
        </form>
      </div>

      <!-- Results -->
      <div v-if="loading" class="space-y-6 max-w-4xl mx-auto">
        <LoadingSkeleton v-for="i in 5" :key="i" type="card" class="h-32" />
      </div>
      
      <div v-else-if="results.length > 0" class="max-w-4xl mx-auto">
        <p class="text-gray-600 mb-6 font-medium">Menemukan {{ total }} hasil untuk "<span class="text-blue-600">{{ searchQuery }}</span>"</p>
        
        <div class="space-y-6">
          <div v-for="item in results" :key="item.id" class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col sm:flex-row gap-6">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wide">{{ item.category }}</span>
                <span class="text-sm text-gray-500"><i class="far fa-calendar-alt mr-1"></i> {{ new Date(item.created_at).toLocaleDateString('id-ID') }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2"><router-link :to="'/informasi/' + item.slug" class="hover:text-blue-600 transition-colors">{{ item.title }}</router-link></h3>
              <p class="text-gray-600 text-sm line-clamp-2">{{ item.excerpt || item.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' }}</p>
            </div>
            <div class="flex items-center sm:items-end sm:justify-end">
              <router-link :to="'/informasi/' + item.slug" class="inline-flex items-center justify-center px-5 py-2.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-200 rounded-lg text-sm font-medium transition-colors">
                Detail <i class="fas fa-arrow-right ml-2 text-xs"></i>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="mt-10 flex justify-center gap-2" v-if="totalPages > 1">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"><i class="fas fa-chevron-left"></i></button>
          <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="['w-10 h-10 rounded-lg flex items-center justify-center font-medium', currentPage === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50']">{{ page }}</button>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-20 max-w-lg mx-auto">
        <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 text-5xl">
          <i class="fas fa-search-minus"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Tidak Ada Hasil</h3>
        <p class="text-gray-600">Maaf, kami tidak dapat menemukan informasi yang cocok dengan kata kunci "{{ searchQuery }}". Silakan coba dengan kata kunci lain.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import PageHeader from '@/components/PageHeader.vue';
import LoadingSkeleton from '@/components/LoadingSkeleton.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const searchQuery = ref(route.query.q || '');
const results = ref([]);
const total = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);

const fetchResults = async (page = 1) => {
  if (!searchQuery.value) return;
  loading.value = true;
  try {
    const res = await api.get('/informasi', { params: { search: searchQuery.value, page } });
    results.value = res.data.data;
    total.value = res.data.total;
    currentPage.value = res.data.current_page;
    totalPages.value = res.data.last_page;
  } catch (error) {
    console.error("Search error", error);
  } finally {
    loading.value = false;
  }
};

const performSearch = () => {
  router.push({ path: '/search', query: { q: searchQuery.value } });
  fetchResults(1);
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchResults(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

watch(() => route.query.q, (newQ) => {
  searchQuery.value = newQ || '';
  if (newQ) fetchResults(1);
});

onMounted(() => {
  if (searchQuery.value) fetchResults(1);
});
</script>
""",
    "informasi/CategoryPage.vue": """\
<template>
  <div class="category-page min-h-screen bg-gray-50 pt-24 pb-12">
    <PageHeader :title="pageTitle" :description="pageDesc" />
    
    <div class="container mx-auto px-6 mt-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <div class="w-full lg:w-1/4">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 class="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Filter Data</h3>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Pencarian</label>
              <input v-model="filters.search" @input="debounceFetch" type="text" class="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Ketik judul..." />
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
              <select v-model="filters.year" @change="fetchData(1)" class="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                <option value="">Semua Tahun</option>
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
            
            <div class="mb-6" v-if="units.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">Unit / OPD</label>
              <select v-model="filters.unit_id" @change="fetchData(1)" class="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                <option value="">Semua Unit</option>
                <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
              </select>
            </div>
            
            <button @click="resetFilters" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors">Reset Filter</button>
          </div>
        </div>
        
        <!-- Content List -->
        <div class="w-full lg:w-3/4">
          <div v-if="loading" class="space-y-4">
            <LoadingSkeleton v-for="i in 5" :key="i" type="card" class="h-32" />
          </div>
          
          <div v-else-if="items.length > 0">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                      <th class="p-4 font-medium border-b border-gray-200 w-16 text-center">No</th>
                      <th class="p-4 font-medium border-b border-gray-200">Judul Informasi</th>
                      <th class="p-4 font-medium border-b border-gray-200 w-32">Tahun</th>
                      <th class="p-4 font-medium border-b border-gray-200 w-32 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="text-sm">
                    <tr v-for="(item, index) in items" :key="item.id" class="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                      <td class="p-4 text-center text-gray-500">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                      <td class="p-4">
                        <router-link :to="'/informasi/' + item.slug" class="font-medium text-gray-800 hover:text-blue-600">{{ item.title }}</router-link>
                        <div class="text-xs text-gray-500 mt-1">{{ item.unit?.name || 'Pemerintah Kabupaten Sinjai' }}</div>
                      </td>
                      <td class="p-4 text-gray-600">{{ item.year || new Date(item.created_at).getFullYear() }}</td>
                      <td class="p-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                          <router-link :to="'/informasi/' + item.slug" class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors tooltip-trigger" title="Detail">
                            <i class="fas fa-info"></i>
                          </router-link>
                          <a v-if="item.file_path" :href="getStorageUrl(item.file_path)" target="_blank" download class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors tooltip-trigger" title="Unduh File">
                            <i class="fas fa-download"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Pagination -->
            <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div class="text-sm text-gray-500">Menampilkan {{ (currentPage - 1) * perPage + 1 }} - {{ Math.min(currentPage * perPage, total) }} dari {{ total }} data</div>
              <div class="flex gap-1" v-if="totalPages > 1">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="w-8 h-8 rounded flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"><i class="fas fa-chevron-left text-xs"></i></button>
                <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="['w-8 h-8 rounded flex items-center justify-center font-medium text-sm', currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50']">{{ page }}</button>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="w-8 h-8 rounded flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"><i class="fas fa-chevron-right text-xs"></i></button>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <i class="far fa-folder-open text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-xl font-bold text-gray-700 mb-2">Data Tidak Ditemukan</h3>
            <p class="text-gray-500">Belum ada informasi yang dipublikasikan pada kategori/filter ini.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import api, { getStorageUrl } from '@/services/api';
import PageHeader from '@/components/PageHeader.vue';
import LoadingSkeleton from '@/components/LoadingSkeleton.vue';

const route = useRoute();
const loading = ref(true);
const categoryParam = ref(route.params.category);

const pageTitle = computed(() => {
  const map = {
    'berkala': 'Informasi Berkala',
    'setiap-saat': 'Informasi Setiap Saat',
    'serta-merta': 'Informasi Serta Merta',
    'dikecualikan': 'Informasi Dikecualikan'
  };
  return map[categoryParam.value] || 'Kategori Informasi';
});

const pageDesc = computed(() => {
  const map = {
    'berkala': 'Informasi yang wajib disediakan dan diumumkan secara berkala',
    'setiap-saat': 'Informasi yang wajib tersedia setiap saat',
    'serta-merta': 'Informasi yang dapat mengancam hajat hidup orang banyak dan ketertiban umum',
    'dikecualikan': 'Informasi yang dikecualikan (rahasia) sesuai ketentuan peraturan perundang-undangan'
  };
  return map[categoryParam.value] || 'Daftar informasi publik berdasarkan kategori';
});

const items = ref([]);
const units = ref([]);
const total = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = ref(10);
const currentYear = new Date().getFullYear();
const years = Array.from({length: 10}, (_, i) => currentYear - i);

const filters = ref({
  search: '',
  year: '',
  unit_id: ''
});

let searchTimeout = null;

const debounceFetch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchData(1), 500);
};

const resetFilters = () => {
  filters.value = { search: '', year: '', unit_id: '' };
  fetchData(1);
};

const fetchUnits = async () => {
  try {
    const res = await api.get('/units');
    units.value = res.data;
  } catch (e) {
    console.error(e);
  }
};

const fetchData = async (page = 1) => {
  loading.value = true;
  try {
    const res = await api.get('/informasi', {
      params: {
        category: categoryParam.value,
        page,
        search: filters.value.search,
        year: filters.value.year,
        unit_id: filters.value.unit_id
      }
    });
    items.value = res.data.data;
    total.value = res.data.total;
    currentPage.value = res.data.current_page;
    totalPages.value = res.data.last_page;
    perPage.value = res.data.per_page;
  } catch (error) {
    console.error("Error fetching category data", error);
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchData(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

watch(() => route.params.category, (newCat) => {
  if (newCat) {
    categoryParam.value = newCat;
    resetFilters();
  }
});

onMounted(() => {
  fetchUnits();
  fetchData(1);
});
</script>
""",
    "informasi/DetailPage.vue": """\
<template>
  <div class="detail-page min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="container mx-auto px-6" v-if="!loading && data">
      <!-- Breadcrumb -->
      <nav class="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link to="/" class="hover:text-blue-600"><i class="fas fa-home mr-2"></i>Beranda</router-link>
          </li>
          <li><div class="flex items-center"><i class="fas fa-chevron-right mx-2 text-xs"></i><router-link :to="'/informasi/' + (data.category?.toLowerCase() || '')" class="hover:text-blue-600 capitalize">{{ data.category?.replace('-', ' ') }}</router-link></div></li>
          <li aria-current="page"><div class="flex items-center"><i class="fas fa-chevron-right mx-2 text-xs"></i><span class="text-gray-400 truncate max-w-[200px]">{{ data.title }}</span></div></li>
        </ol>
      </nav>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Main Content -->
        <div class="w-full lg:w-2/3 xl:w-3/4">
          <article class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <!-- Header Image (Optional) -->
            <div v-if="data.image" class="w-full h-80 bg-gray-200">
              <img :src="getStorageUrl(data.image)" :alt="data.title" class="w-full h-full object-cover" />
            </div>
            
            <div class="p-8">
              <!-- Meta Tags -->
              <div class="flex flex-wrap items-center gap-3 mb-4 text-xs font-medium">
                <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full uppercase tracking-wider">{{ data.category }}</span>
                <span class="text-gray-500 flex items-center"><i class="far fa-calendar-alt mr-1.5"></i> {{ new Date(data.created_at).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'}) }}</span>
                <span class="text-gray-500 flex items-center"><i class="far fa-eye mr-1.5"></i> {{ data.views || 0 }} Kali Dilihat</span>
              </div>
              
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{{ data.title }}</h1>
              
              <!-- Content Body -->
              <div class="prose max-w-none text-gray-700 mb-8" v-html="data.content"></div>
              
              <!-- File Attachment -->
              <div v-if="data.file_path" class="mt-8 p-5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-red-100 text-red-500 rounded-lg flex items-center justify-center text-xl">
                    <i class="far fa-file-pdf"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-800 text-sm md:text-base">Dokumen Lampiran</h4>
                    <p class="text-xs text-gray-500">{{ data.file_name || 'Dokumen.pdf' }}</p>
                  </div>
                </div>
                <button @click="downloadFile" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center">
                  <i class="fas fa-download mr-2"></i> Unduh File
                </button>
              </div>
              
              <!-- Share -->
              <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600">Bagikan Informasi:</span>
                <div class="flex gap-2">
                  <a :href="'https://www.facebook.com/sharer/sharer.php?u=' + currentUrl" target="_blank" class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"><i class="fab fa-facebook-f"></i></a>
                  <a :href="'https://twitter.com/intent/tweet?url=' + currentUrl + '&text=' + data.title" target="_blank" class="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"><i class="fab fa-twitter"></i></a>
                  <a :href="'https://wa.me/?text=' + data.title + ' ' + currentUrl" target="_blank" class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"><i class="fab fa-whatsapp"></i></a>
                </div>
              </div>
            </div>
          </article>
        </div>
        
        <!-- Sidebar -->
        <div class="w-full lg:w-1/3 xl:w-1/4">
          <!-- Unit Info -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6" v-if="data.unit">
            <h3 class="font-bold text-gray-800 mb-4 pb-2 border-b">Dipublikasikan Oleh</h3>
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                <img v-if="data.unit.logo" :src="getStorageUrl(data.unit.logo)" class="w-10 h-10 object-contain" />
                <i v-else class="fas fa-building text-gray-400 text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800 text-sm">{{ data.unit.name }}</h4>
                <p class="text-xs text-gray-500">{{ data.unit.type || 'Organisasi Perangkat Daerah' }}</p>
              </div>
            </div>
            <router-link :to="'/profil/opd/' + data.unit.slug" class="block w-full text-center py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">Profil OPD</router-link>
          </div>

          <!-- Related Info -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 class="font-bold text-gray-800 mb-4 pb-2 border-b">Informasi Terkait</h3>
            <div v-if="relatedData.length > 0" class="space-y-4">
              <div v-for="item in relatedData" :key="item.id" class="group cursor-pointer" @click="$router.push('/informasi/' + item.slug)">
                <h4 class="text-sm font-medium text-gray-800 group-hover:text-blue-600 line-clamp-2 leading-tight mb-1 transition-colors">{{ item.title }}</h4>
                <div class="text-xs text-gray-500"><i class="far fa-calendar-alt mr-1"></i> {{ new Date(item.created_at).toLocaleDateString('id-ID') }}</div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 text-center py-4">Tidak ada informasi terkait</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container mx-auto px-6" v-else-if="loading">
      <LoadingSkeleton type="hero" class="h-96 rounded-2xl mb-8" />
      <div class="grid grid-cols-3 gap-8">
        <div class="col-span-2 space-y-4"><LoadingSkeleton type="card" class="h-32" v-for="i in 3" :key="i" /></div>
        <div class="col-span-1 space-y-4"><LoadingSkeleton type="card" class="h-64" /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import api, { getStorageUrl } from '@/services/api';
import LoadingSkeleton from '@/components/LoadingSkeleton.vue';

const route = useRoute();
const loading = ref(true);
const data = ref(null);
const relatedData = ref([]);
const currentUrl = computed(() => window.location.href);

const fetchDetail = async () => {
  loading.value = true;
  try {
    const slug = route.params.slug;
    const res = await api.get(`/informasi/${slug}`);
    data.value = res.data.data;
    relatedData.value = res.data.related || [];
  } catch (error) {
    console.error("Error fetching detail", error);
  } finally {
    loading.value = false;
  }
};

const downloadFile = async () => {
  if(!data.value.file_path) return;
  // Trigger download via API to count stats, or just open URL
  try {
    await api.post(`/informasi/${data.value.id}/download`);
  } catch (e) {}
  window.open(getStorageUrl(data.value.file_path), '_blank');
};

watch(() => route.params.slug, () => {
  if(route.name === 'InformasiDetail') fetchDetail();
});

onMounted(() => {
  fetchDetail();
});
</script>
""",
    "GaleriPage.vue": """\
<template>
  <div class="galeri-page min-h-screen bg-gray-50 pt-24 pb-12">
    <PageHeader title="Galeri PPID" description="Dokumentasi kegiatan dan pelayanan informasi publik" />
    
    <div class="container mx-auto px-6 mt-8">
      <!-- Filters -->
      <div class="flex justify-center mb-10">
        <div class="inline-flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
          <button @click="filter = 'all'" :class="['px-6 py-2 rounded-md text-sm font-medium transition-all', filter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-blue-600']">Semua</button>
          <button @click="filter = 'photo'" :class="['px-6 py-2 rounded-md text-sm font-medium transition-all', filter === 'photo' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-blue-600']">Foto</button>
          <button @click="filter = 'video'" :class="['px-6 py-2 rounded-md text-sm font-medium transition-all', filter === 'video' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-blue-600']">Video</button>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <LoadingSkeleton v-for="i in 8" :key="i" type="card" class="h-64" />
      </div>

      <div v-else-if="filteredItems.length > 0" class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        <div v-for="item in filteredItems" :key="item.id" @click="openLightbox(item)" class="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer bg-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <img :src="getStorageUrl(item.image_path)" :alt="item.title" class="w-full h-auto object-cover" />
          <div v-if="item.type === 'video'" class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-14 h-14 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
              <i class="fas fa-play text-xl ml-1"></i>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 class="text-white font-bold text-sm leading-tight mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{{ item.title }}</h3>
            <p class="text-gray-300 text-xs transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{{ new Date(item.created_at).toLocaleDateString('id-ID') }}</p>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-20">
        <i class="far fa-images text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-bold text-gray-700">Tidak ada media</h3>
      </div>
      
      <!-- Lightbox Modal -->
      <div v-if="activeItem" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" @click.self="activeItem = null">
        <button @click="activeItem = null" class="absolute top-6 right-6 text-white hover:text-gray-300 text-3xl z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"><i class="fas fa-times"></i></button>
        <div class="max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
          <img v-if="activeItem.type !== 'video'" :src="getStorageUrl(activeItem.image_path)" class="max-w-full max-h-[80vh] object-contain rounded shadow-2xl" />
          <!-- Video iframe placeholder -->
          <iframe v-else-if="activeItem.video_url" :src="activeItem.video_url" class="w-full aspect-video rounded shadow-2xl" frameborder="0" allowfullscreen></iframe>
          <div class="mt-4 text-center">
            <h3 class="text-white font-bold text-xl">{{ activeItem.title }}</h3>
            <p class="text-gray-400 text-sm mt-1">{{ activeItem.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api, { getStorageUrl } from '@/services/api';
import PageHeader from '@/components/PageHeader.vue';
import LoadingSkeleton from '@/components/LoadingSkeleton.vue';

const loading = ref(true);
const items = ref([]);
const filter = ref('all');
const activeItem = ref(null);

const filteredItems = computed(() => {
  if (filter.value === 'all') return items.value;
  return items.value.filter(i => i.type === filter.value || (filter.value === 'photo' && !i.type)); // default to photo
});

const openLightbox = (item) => {
  activeItem.value = item;
};

onMounted(async () => {
  try {
    const res = await api.get('/galeri');
    items.value = res.data;
  } catch (error) {
    console.error("Error fetching gallery", error);
  } finally {
    loading.value = false;
  }
});
</script>
""",
    "profil/ProfilPpidPage.vue": """\
<template>
  <div class="profil-page min-h-screen bg-gray-50 pt-24 pb-12">
    <PageHeader title="Profil PPID" description="Mengenal lebih dekat Pejabat Pengelola Informasi dan Dokumentasi Kabupaten Sinjai" />
    
    <div class="container mx-auto px-6 mt-12">
      <div v-if="loading">
        <LoadingSkeleton type="hero" class="h-64 mb-8" />
        <LoadingSkeleton type="card" class="h-96" />
      </div>
      
      <div v-else class="space-y-12">
        <!-- Visi Misi -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <div class="p-10 lg:p-16 flex flex-col justify-center bg-blue-600 text-white">
              <h2 class="text-3xl font-bold mb-6 flex items-center"><i class="fas fa-eye mr-4 opacity-80"></i> Visi</h2>
              <p class="text-xl leading-relaxed italic">"{{ profile.visi || 'Terwujudnya Pelayanan Informasi Publik yang Transparan, Akuntabel, dan Inovatif untuk Masyarakat Sinjai' }}"</p>
            </div>
            <div class="p-10 lg:p-16 flex flex-col justify-center">
              <h2 class="text-3xl font-bold mb-6 text-gray-800 flex items-center"><i class="fas fa-bullseye mr-4 text-blue-600"></i> Misi</h2>
              <ul class="space-y-4">
                <li v-for="(misi, idx) in misiList" :key="idx" class="flex items-start">
                  <span class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 mr-4 mt-1">{{ idx + 1 }}</span>
                  <p class="text-gray-700 leading-relaxed">{{ misi }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Tugas dan Fungsi -->
        <div class="text-center max-w-3xl mx-auto mb-10">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Tugas & Fungsi PPID</h2>
          <div class="w-20 h-1 bg-blue-600 rounded mx-auto mb-6"></div>
          <p class="text-gray-600">Berdasarkan peraturan yang berlaku, PPID Kabupaten Sinjai memiliki tugas pokok dan fungsi sebagai berikut:</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-6">
              <i class="fas fa-tasks"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-4">Tugas Pokok</h3>
            <div class="prose text-gray-600 text-sm" v-html="profile.tugas"></div>
          </div>
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-6">
              <i class="fas fa-cogs"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-4">Fungsi</h3>
            <div class="prose text-gray-600 text-sm" v-html="profile.fungsi"></div>
          </div>
        </div>

        <!-- Struktur Organisasi -->
        <div v-if="profile.struktur_image" class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Struktur Organisasi</h2>
          <img :src="getStorageUrl(profile.struktur_image)" class="w-full max-w-4xl mx-auto rounded-lg shadow-sm" alt="Struktur Organisasi PPID" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api, { getStorageUrl } from '@/services/api';
import PageHeader from '@/components/PageHeader.vue';
import LoadingSkeleton from '@/components/LoadingSkeleton.vue';

const loading = ref(true);
const profile = ref({
  visi: '',
  misi: '',
  tugas: '',
  fungsi: '',
  struktur_image: ''
});

const misiList = computed(() => {
  if (!profile.value.misi) return [];
  // Assume newline separated or simple string array
  return profile.value.misi.split('\\n').filter(m => m.trim().length > 0);
});

onMounted(async () => {
  try {
    const res = await api.get('/profil');
    profile.value = res.data || {};
  } catch (error) {
    console.error("Error fetching profile", error);
  } finally {
    loading.value = false;
  }
});
</script>
"""
}

for filename, content in pages.items():
    filepath = os.path.join(base_dir, filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Created {len(pages)} base pages")
