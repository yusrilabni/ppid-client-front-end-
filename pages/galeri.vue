<template>
  <div class="galeri-page bg-gray-50 min-h-screen">
    <div class="container mx-auto py-12 px-4">
      <div class="max-w-7xl mx-auto">
        <Breadcrumbs :breadcrumbs="getBreadcrumbs.galeri()" class="mb-6" />
        
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <LoadingSkeleton v-for="i in 8" :key="i" class="h-80 w-full rounded-xl" />
        </div>
        
        <!-- Gallery Grid -->
        <div v-else-if="items && items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="item in items" :key="item.id" class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col h-full group cursor-pointer">
            
            <!-- Image Wrapper with 4:3 aspect ratio -->
            <div class="relative w-full pb-[75%] bg-gray-100">
              
              <!-- Pinned Indicator -->
              <div v-if="item.is_pinned" class="absolute top-2 left-2 bg-orange-500 text-white rounded-full p-2 z-10 shadow-md" title="Foto di-pin">
                <i class="fas fa-thumbtack text-xs"></i>
              </div>
              
              <!-- Media Content -->
              <a :href="item.type === 'foto' || !item.type ? getStorageUrl(item.image) : item.video"
                 class="absolute inset-0 glightbox cursor-pointer"
                 data-gallery="galeri-ppid"
                 :data-title="item.title"
                 :data-description="item.description || ''"
                 :data-id="item.id"
                 :data-type="item.type === 'foto' || !item.type ? 'image' : 'video'">
                <template v-if="item.type === 'foto' || !item.type">
                  <img :src="getStorageUrl(item.image)" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" @error="(e) => e.target.src = '/placeholder.jpg'" />
                  <div class="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full w-8 h-8 flex items-center justify-center">
                    <i class="fas fa-camera text-sm text-gray-700"></i>
                  </div>
                </template>
                <template v-else>
                  <img v-if="getYoutubeThumbnail(item.video)" :src="getYoutubeThumbnail(item.video)" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                    <i class="fas fa-video text-5xl text-gray-400"></i>
                  </div>
                  <div class="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full w-8 h-8 flex items-center justify-center">
                    <i class="fas fa-play-circle text-sm text-gray-700"></i>
                  </div>
                </template>
              </a>
            </div>
            
            <!-- Bottom Text Section -->
            <div class="p-4 flex-grow flex flex-col cursor-default">
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2" :title="item.title">{{ item.title }}</h3>
              <div v-if="item.category" class="mb-2">
                <span class="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {{ item.category }}
                </span>
              </div>
              <p v-if="item.description" class="text-sm text-gray-600 line-clamp-2 mt-auto">
                {{ item.description }}
              </p>
            </div>
            
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
            <div class="flex flex-col items-center">
                <i class="fas fa-image text-gray-300 text-6xl mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada data galeri</h3>
                <p class="text-gray-500">Belum ada galeri yang ditambahkan.</p>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { ref, onMounted, nextTick } from 'vue'
import api, { getStorageUrl } from '@/services/api'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import 'glightbox/dist/css/glightbox.css'

const items = ref([])
const loading = ref(true)

const getYoutubeThumbnail = (url) => {
  if (!url) return null;
  let videoId = null;
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
      if (parsedUrl.searchParams.has('v')) {
        videoId = parsedUrl.searchParams.get('v');
      } else {
        const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
        videoId = pathParts[pathParts.length - 1];
      }
    }
  } catch (e) {}
  return videoId ? `https://img.youtube.com/vi/${videoId}/default.jpg` : null;
}

onMounted(async () => {
  try {
    const res = await api.get('/galeri')
    // Backend API langsung mengembalikan array, atau kadang dibungkus { data: [...] }
    items.value = res.data.data?.data || res.data.data || res.data || []
  } catch (error) {
    console.error('Error fetching gallery:', error)
  } finally {
    loading.value = false
    await nextTick()
    if (process.client) {
      import('glightbox').then(m => {
        const GLightbox = m.default || m;
        GLightbox({
          selector: '.glightbox',
          touchNavigation: true,
          loop: true,
          autoplayVideos: true
        }).on('slide_after_load', (data) => {
          const { slideNode, slideConfig } = data;
          const trigger = slideConfig.node;
          if (!trigger) return;
          
          const galeriId = trigger.getAttribute('data-id');
          const isFoto = trigger.getAttribute('data-type') === 'image';
          
          if (isFoto && galeriId && slideNode) {
            let innerContainer = slideNode.querySelector('.ginner-container');
            if (innerContainer && !innerContainer.querySelector('.custom-download-btn')) {
              const btn = document.createElement('a');
              btn.href = `${api.defaults.baseURL}/galeri/${galeriId}/download`;
              btn.target = '_blank';
              btn.className = 'custom-download-btn absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-blue-700 font-semibold text-sm flex items-center transition-colors';
              btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Download Asli (JPG)';
              innerContainer.appendChild(btn);
            }
          }
        })
      })
    }
  }
})
</script>
