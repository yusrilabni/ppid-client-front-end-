<template>
  <div class="py-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Breadcrumbs -->
      <Breadcrumbs :breadcrumbs="[
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Tentang OPD', url: '', icon: 'fas fa-building' }
      ]" class="mt-8" />

      <div class="mb-10 text-center">
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Daftar Organisasi & Wilayah Daerah</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Daftar OPD, Kecamatan, Desa, dan Kelurahan yang bertugas di wilayah Kabupaten Sinjai.
        </p>
      </div>

      <template v-if="!loading">
        <div v-if="Object.keys(groupedOrganizations).length === 0" class="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
          <div class="flex flex-col items-center">
            <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <i class="fas fa-building text-gray-300 text-4xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Belum ada OPD yang berpartisipasi</h3>
            <p class="text-gray-500">Saat ini belum ada data organisasi yang mengunggah informasi publik.</p>
          </div>
        </div>

        <div v-else class="space-y-24">
          <section v-for="(data, groupName) in groupedOrganizations" :key="groupName" class="relative">
            <!-- Group Header -->
            <div class="sticky top-20 z-20 mb-10">
              <div class="bg-white/80 backdrop-blur-md border border-gray-100 inline-flex items-center px-8 py-4 rounded-3xl shadow-xl">
                <div :class="{
                  'bg-blue-600 shadow-blue-200': groupName !== 'Kecamatan' && groupName !== 'OPD' && groupName !== 'Wilayah (Desa & Kelurahan)',
                  'bg-indigo-600 shadow-indigo-200': groupName === 'Kecamatan',
                  'bg-emerald-600 shadow-emerald-200': groupName === 'OPD',
                  'bg-orange-600 shadow-orange-200': groupName === 'Wilayah (Desa & Kelurahan)'
                }" class="w-12 h-12 rounded-2xl flex items-center justify-center text-white mr-5 shadow-lg">
                  <i :class="{
                    'fa-building': groupName !== 'Kecamatan' && groupName !== 'OPD' && groupName !== 'Wilayah (Desa & Kelurahan)',
                    'fa-landmark': groupName === 'Kecamatan',
                    'fa-shield-alt': groupName === 'OPD',
                    'fa-map-marked-alt': groupName === 'Wilayah (Desa & Kelurahan)'
                  }" class="fas text-xl"></i>
                </div>
                <div>
                  <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-1">Klasifikasi</span>
                  <h2 class="text-2xl font-black text-gray-900 uppercase tracking-tight">{{ groupName }}</h2>
                </div>
              </div>
            </div>

            <!-- Wilayah (Desa & Kelurahan) Subgroups -->
            <div v-if="groupName === 'Wilayah (Desa & Kelurahan)'" class="space-y-16">
              <div v-for="(organizations, kecName) in data" :key="kecName" class="relative">
                <div class="flex items-center mb-8">
                  <div class="h-px bg-gray-200 flex-grow"></div>
                  <h3 class="mx-6 text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Kecamatan {{ kecName }}</h3>
                  <div class="h-px bg-gray-200 flex-grow"></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                  <div v-for="org in organizations" :key="org.id" class="group h-full bg-white rounded-[2.5rem] shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 relative">
                    <!-- Decorative background -->
                    <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-gray-50 to-white opacity-50"></div>
                    
                    <div class="p-8 pb-8 flex flex-col items-center text-center flex-grow relative z-10">
                        <div class="relative mb-6">
                            <div class="absolute inset-0 bg-blue-600 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                            
                            <img v-if="org.officials && org.officials[0] && org.officials[0].photo" 
                                 :src="getStorageUrl(org.officials[0].photo)"
                                 :alt="org.officials[0].full_name"
                                 class="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105">
                            <div v-else class="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-white shadow-2xl flex items-center justify-center text-gray-300 text-4xl md:text-5xl relative z-10">
                                <i class="fas fa-building"></i>
                            </div>
                        </div>

                        <div class="min-h-[4rem] flex items-center justify-center mb-2">
                            <h3 class="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                {{ org.name }}
                            </h3>
                        </div>

                        <p v-if="org.officials && org.officials[0]" class="text-sm font-bold text-gray-500 mb-4 min-h-[1.25rem]">{{ org.officials[0].full_name }}</p>
                        <div v-else class="mb-4 min-h-[1.25rem]"></div>
                        
                        <div class="flex items-start text-gray-500 font-bold text-[11px] mb-8 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 w-full min-h-[60px]">
                            <i class="fas fa-map-marker-alt mr-3 mt-0.5 text-blue-400"></i>
                            <span class="leading-relaxed text-left line-clamp-2" v-html="org.api_address || 'Alamat belum ditambahkan.'"></span>
                        </div>

                        <div class="mt-auto space-y-3 w-full">
                            <router-link :to="`/profil/tentang-opd/${org.slug}`" class="inline-flex items-center justify-center w-full bg-blue-600 text-white font-black text-xs py-4 rounded-2xl transition-all duration-500 uppercase tracking-widest gap-2 shadow-lg shadow-blue-100 group-hover:shadow-blue-200">
                                <i class="fas fa-sitemap mr-1"></i> Struktur & Website
                            </router-link>

                            <template v-if="authStore.user && (authStore.user.role === 'superadmin' || authStore.user.unit_id == org.remote_id)">
                                <div class="pt-2">
                                    <a :href="`http://ppidkab.sinjaikab.go.id/profil/tentang-opd/${org.id}/manage`" target="_blank" class="inline-flex items-center justify-center w-full bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 font-black text-xs py-4 rounded-2xl transition-all duration-500 uppercase tracking-widest gap-2">
                                        <i class="fas fa-edit"></i> Kelola Profil Unit
                                    </a>
                                </div>
                            </template>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Normal Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              <div v-for="org in data" :key="org.id" class="group h-full bg-white rounded-[2.5rem] shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 relative">
                <!-- Decorative background -->
                <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-gray-50 to-white opacity-50"></div>
                
                <div class="p-8 pb-8 flex flex-col items-center text-center flex-grow relative z-10">
                    <div class="relative mb-6">
                        <div class="absolute inset-0 bg-blue-600 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                        
                        <img v-if="org.officials && org.officials[0] && org.officials[0].photo" 
                             :src="getStorageUrl(org.officials[0].photo)"
                             :alt="org.officials[0].full_name"
                             class="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105">
                        <div v-else class="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-white shadow-2xl flex items-center justify-center text-gray-300 text-4xl md:text-5xl relative z-10">
                            <i class="fas fa-building"></i>
                        </div>
                    </div>

                    <div class="min-h-[4rem] flex items-center justify-center mb-2">
                        <h3 class="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                            {{ org.name }}
                        </h3>
                    </div>

                    <p v-if="org.officials && org.officials[0]" class="text-sm font-bold text-gray-500 mb-4 min-h-[1.25rem]">{{ org.officials[0].full_name }}</p>
                    <div v-else class="mb-4 min-h-[1.25rem]"></div>
                    
                    <div class="flex items-start text-gray-500 font-bold text-[11px] mb-8 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 w-full min-h-[60px]">
                        <i class="fas fa-map-marker-alt mr-3 mt-0.5 text-blue-400"></i>
                        <span class="leading-relaxed text-left line-clamp-2" v-html="org.api_address || 'Alamat belum ditambahkan.'"></span>
                    </div>

                    <div class="mt-auto space-y-3 w-full">
                        <router-link :to="`/profil/tentang-opd/${org.slug}`" class="inline-flex items-center justify-center w-full bg-blue-600 text-white font-black text-xs py-4 rounded-2xl transition-all duration-500 uppercase tracking-widest gap-2 shadow-lg shadow-blue-100 group-hover:shadow-blue-200">
                            <i class="fas fa-sitemap mr-1"></i> Struktur & Website
                        </router-link>

                        <template v-if="authStore.user && (authStore.user.role === 'superadmin' || authStore.user.unit_id == org.remote_id)">
                            <div class="pt-2">
                                <a :href="`http://ppidkab.sinjaikab.go.id/profil/tentang-opd/${org.id}/manage`" target="_blank" class="inline-flex items-center justify-center w-full bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 font-black text-xs py-4 rounded-2xl transition-all duration-500 uppercase tracking-widest gap-2">
                                    <i class="fas fa-edit"></i> Kelola Profil Unit
                                </a>
                            </div>
                        </template>
                    </div>
                </div>
              </div>
            </div>

          </section>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api, { getStorageUrl } from '@/services/api'
import { useGlobalLoader } from '@/composables/useGlobalLoader'
import { useAuthStore } from '@/stores/auth'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

const authStore = useAuthStore()

const groupedOrganizations = ref({})

const { isLoading: queryLoading, data: queryData, isFetching } = useQuery({
  queryKey: ['tentang_opd'],
  queryFn: async () => {
    const res = await api.get('/profil/tentang-opd')
    const data = res.data
    
    // Fallback: If backend hasn't updated to include officials, fetch them manually
    let needsOfficials = false;
    if (data.groupedOrganizations) {
        const firstGroup = Object.values(data.groupedOrganizations)[0];
        if (firstGroup && firstGroup.length > 0 && !firstGroup[0].officials) {
            needsOfficials = true;
        }
    } else if (data.organizations && data.organizations.length > 0 && !data.organizations[0].officials) {
        needsOfficials = true;
    }

    if (needsOfficials) {
        try {
            const [pejabatRes, unitRes] = await Promise.all([
                api.get('/profil/pejabat-daerah').catch(() => null),
                api.get('/profil/unit-lokal').catch(() => null)
            ]);
            
            const allOfficials = [];
            if (pejabatRes?.data?.kepalaOpds) {
                if (pejabatRes.data.kepalaOpds.eselon2) allOfficials.push(...pejabatRes.data.kepalaOpds.eselon2);
                if (pejabatRes.data.kepalaOpds.eselon3) allOfficials.push(...pejabatRes.data.kepalaOpds.eselon3);
            }
            if (unitRes?.data?.groupedData) {
                Object.values(unitRes.data.groupedData).forEach(group => {
                    if (group.officials) allOfficials.push(...group.officials);
                });
            }

            const officialsByOrgId = {};
            allOfficials.forEach(official => {
                if (official.organization_id && official.status === 'active') {
                    officialsByOrgId[official.organization_id] = official;
                }
            });

            const attachOfficials = (orgs) => {
                orgs.forEach(org => {
                    if (officialsByOrgId[org.id]) {
                        org.officials = [officialsByOrgId[org.id]];
                    }
                });
            };

            if (data.groupedOrganizations) {
                Object.values(data.groupedOrganizations).forEach(group => {
                    if (Array.isArray(group)) {
                        attachOfficials(group);
                    } else if (typeof group === 'object') {
                        Object.values(group).forEach(subGroup => attachOfficials(subGroup));
                    }
                });
            }
            if (data.organizations) {
                attachOfficials(data.organizations);
            }
        } catch (e) {
            console.error('Failed to fetch fallback officials:', e);
        }
    }

    return data
  },
  staleTime: 60000
})

const loading = computed(() => queryLoading.value || (isFetching.value && !queryData.value))
useGlobalLoader(loading)

watch(queryData, (newData) => {
  if (newData) {
    if (newData.groupedOrganizations) {
      groupedOrganizations.value = newData.groupedOrganizations
    } else if (newData.organizations && newData.organizations.length > 0) {
      // Fallback frontend grouping in case backend hasn't updated yet
      const grouped = {
        'OPD': [],
        'Kecamatan': [],
        'Wilayah (Desa & Kelurahan)': {}
      }
      
      newData.organizations.forEach(org => {
        if (!org || !org.name) return;
        const name = org.name;
        if (name.toUpperCase().includes('PEMERINTAH DAERAH')) return;
        
        if (name.toLowerCase().includes('dinas') || name.toLowerCase().includes('badan')) {
          grouped['OPD'].push(org);
        } else if (name.toLowerCase().includes('kecamatan')) {
          grouped['Kecamatan'].push(org);
        } else if (name.toLowerCase().includes('desa ') || name.toLowerCase().includes('kelurahan ')) {
          // Try to extract kecamatan from address if possible, otherwise use 'Wilayah Lain'
          let kecKey = 'Wilayah Lain';
          if (org.api_address && org.api_address.toLowerCase().includes('kec.')) {
            const match = org.api_address.match(/Kec\.?\s*([A-Za-z\s]+)/i);
            if (match && match[1]) {
              kecKey = match[1].trim();
            }
          }
          if (!grouped['Wilayah (Desa & Kelurahan)'][kecKey]) {
            grouped['Wilayah (Desa & Kelurahan)'][kecKey] = [];
          }
          grouped['Wilayah (Desa & Kelurahan)'][kecKey].push(org);
        } else {
          grouped['OPD'].push(org);
        }
      });
      
      // Remove empty groups
      if (Object.keys(grouped['Wilayah (Desa & Kelurahan)']).length === 0) {
        delete grouped['Wilayah (Desa & Kelurahan)'];
      }
      if (grouped['Kecamatan'].length === 0) delete grouped['Kecamatan'];
      if (grouped['OPD'].length === 0) delete grouped['OPD'];
      
      groupedOrganizations.value = grouped;
    }
  }
}, { immediate: true })
</script>
