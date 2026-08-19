<template>
<div>





<div class="bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-6xl">
        <!--  Header Section  -->
        <div class="text-center mb-12">
            <div class="inline-block p-3 bg-blue-100 rounded-2xl mb-4">
                <i class="fas fa-plug text-blue-600 text-3xl"></i>
            </div>
            <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Widget Informasi PPID</h1>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">Tampilkan feed data informasi publik secara visual dan interaktif langsung di website Anda.</p>
        </div>

        <!--  Generator Widget  -->
        <section class="bg-white rounded-[3rem] shadow-xl border border-gray-100 p-8 md:p-12 mb-12 relative">
            <div class="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
            
            <div class="relative z-10">
                <h2 class="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <span class="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-200">
                        <i class="fas fa-magic"></i>
                    </span>
                    Kustomisasi Widget Anda
                </h2>

                <div  >
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <!--  Controls  -->
                                                <div class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="transition-all duration-200">
                                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Konten</label>
                                    <CustomSelect v-model="type" :options="[{value: 'latest', label: 'Terbaru'}, {value: 'popular', label: 'Terpopuler'}]" placeholder="Pilih..." />
                                </div>
                                <div class="transition-all duration-200">
                                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Gaya Dasar</label>
                                    <CustomSelect v-model="display" :options="[{value: 'card', label: 'Kartu (Grid)'}, {value: 'list', label: 'Daftar (List)'}]" placeholder="Pilih..." />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="transition-all duration-200">
                                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Kategori Informasi</label>
                                    <CustomSelect v-model="category" :options="[{value: '', label: 'Semua Kategori'}, {value: 'Informasi Berkala', label: 'Informasi Berkala'}, {value: 'Informasi Serta Merta', label: 'Informasi Serta Merta'}, {value: 'Informasi Setiap Saat', label: 'Informasi Setiap Saat'}, {value: 'Informasi Dikecualikan', label: 'Informasi Dikecualikan'}]" placeholder="Pilih..." />
                                </div>
                                <div class="transition-all duration-200">
                                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Jumlah Total Data</label>
                                    <CustomSelect v-model="limit" :options="[{value: 5, label: '5 Data Terakhir'}, {value: 10, label: '10 Data Terakhir'}, {value: 15, label: '15 Data Terakhir'}, {value: 20, label: '20 Data Terakhir'}, {value: 'all', label: 'Semua Data'}]" placeholder="Pilih..." />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6" v-show="display === 'card'">
                                <div class="transition-all duration-200">
                                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Mode Layout</label>
                                    <CustomSelect v-model="mode" :options="[{value: 'slider', label: 'Slider Interaktif'}, {value: 'grid', label: 'Grid Statis'}]" placeholder="Pilih..." />
                                </div>
                                <div class="transition-all duration-200">
                                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Kolom Per Baris</label>
                                    <CustomSelect v-model="columns" :options="[{value: 1, label: '1 Kolom'}, {value: 2, label: '2 Kolom'}, {value: 3, label: '3 Kolom'}, {value: 4, label: '4 Kolom'}]" placeholder="Pilih..." />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div v-show="mode === 'slider' && display === 'card'" class="transition-all duration-200">
                                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Autoplay Slider</label>
                                    <CustomSelect v-model="autoplay" :options="[{value: 'true', label: 'Aktif'}, {value: 'false', label: 'Mati'}]" placeholder="Pilih..." />
                                </div>
                                <div class="transition-all duration-200">
                                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Filter Tahun</label>
                                    <CustomSelect v-model="year" :options="[{value: '', label: 'Semua Tahun'}, {value: '2024', label: '2024'}, {value: '2023', label: '2023'}, {value: '2022', label: '2022'}]" placeholder="Pilih..." />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-6">
                                <div class="transition-all duration-200">
                                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Filter OPD</label>
                                    <CustomSelect v-model="unit_id" :options="[{value: '', label: 'Semua Instansi / OPD'}, ...organizations.map(o => ({value: o.unit_id, label: o.name}))]" :shouldShowSearch="true" placeholder="Pilih..." />
                                </div>
                            </div>

                            <div class="pt-6">
                                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Salin Kode Embed (Relevan untuk WordPress/Blogspot)</label>
                                <div class="relative group">
                                    <textarea id="embedCodeInput" readonly v-model="embedCodeString" class="w-full bg-gray-900 text-blue-400 font-mono text-[10px] p-4 rounded-2xl h-24 border-0 focus:ring-0 resize-none"></textarea>
                                    <button type="button" @click="
                                        const code = '<iframe src=\'' + embedUrl + '&origin=\' + window.location.origin + \'\' width=\'100%\' height=\'' + (limit === 'all' || limit > 10 ? '800' : (display === 'list' ? '450' : '480')) + '\' frameborder=\'0\'></iframe>';
                                        if (navigator.clipboard && navigator.clipboard.writeText) {
                                            navigator.clipboard.writeText(code).then(() => {
                                                alert('Kode berhasil disalin!');
                                            });
                                        } else {
                                            const el = document.getElementById('embedCodeInput');
                                            el.select();
                                            document.execCommand('copy');
                                            alert('Kode disalin!');
                                        }
                                    "
                                        class="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm transition-all">
                                        SALIN KODE
                                    </button>
                                </div>
                                <p class="mt-2 text-[10px] text-gray-400 italic">Catatan: Kode di atas sudah dilengkapi pelacak otomatis agar website Anda terdaftar di laporan statistik kami.</p>
                            </div>
                        </div>

                        <!--  Preview  -->
                        <div class="bg-gray-50 rounded-[2rem] p-4 border-4 border-dashed border-gray-200 flex flex-col min-h-[500px]">
                            <div class="flex justify-between items-center mb-4 px-2">
                                <div class="flex items-center space-x-2">
                                    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Live Preview Widget</span>
                                </div>
                                <div class="flex space-x-1">
                                    <div class="w-2 h-2 rounded-full bg-red-300"></div>
                                    <div class="w-2 h-2 rounded-full bg-yellow-300"></div>
                                    <div class="w-2 h-2 rounded-full bg-green-300"></div>
                                </div>
                            </div>
                            <div class="flex-grow bg-white rounded-2xl shadow-inner overflow-hidden border border-gray-100 relative">
                                <div v-show="refreshKey"  class="absolute inset-0 z-0 bg-gray-50 flex items-center justify-center opacity-50" style="display: none;">
                                    <i class="fas fa-spinner fa-spin text-blue-500 text-2xl"></i>
                                </div>
                                <iframe :key="refreshKey" :src="embedUrl" width="100%" :height="(limit === 'all' || limit > 10) ? '800' : '480'" class="border-0 relative z-10"></iframe>
                            </div>
                            <p class="mt-4 text-[10px] text-gray-400 text-center italic">Widget ini bersifat responsif dan otomatis menyesuaikan lebar kontainer induknya.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!--  DETAIL GUIDE SECTION (WordPress & Custom)  -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <!--  WordPress Detailed Steps  -->
            <div class="lg:col-span-2 space-y-8">
                <section class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i class="fab fa-wordpress text-blue-500 mr-3 text-3xl"></i>
                        Langkah Detail Pemasangan di WordPress
                    </h2>
                    
                    <div class="space-y-8">
                        <div class="flex items-start">
                            <div class="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                            <div>
                                <h4 class="font-bold text-gray-800">Gunakan Block "Custom HTML"</h4>
                                <p class="text-sm text-gray-600 mt-1">Buka editor postingan atau halaman Anda. Klik tombol <strong>(+) Tambah Blok</strong>, cari dan pilih blok bernama <strong>"Custom HTML"</strong>.</p>
                            </div>
                        </div>

                        <div class="flex items-start border-l-4 border-blue-500 pl-6 bg-blue-50 py-4 rounded-r-2xl">
                            <div>
                                <h4 class="font-bold text-blue-800 flex items-center">
                                    <i class="fas fa-arrows-alt-v mr-2"></i> Mengatur Lebar & Tinggi (PENTING)
                                </h4>
                                <div class="mt-3 space-y-3 text-sm text-blue-900/80">
                                    <p><strong>Lebar (Width):</strong> Selalu gunakan <code>width="100%"</code> agar widget otomatis mengikuti lebar sidebar atau konten Anda (Responsive).</p>
                                    <p><strong>Tinggi (Height):</strong> Atur nilai <code>height</code> (misal: 450) agar tidak muncul scrollbar ganda.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!--  BLOGSPOT GUIDE  -->
                <section class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i class="fab fa-google text-orange-500 mr-3 text-3xl"></i>
                        Langkah Pemasangan di Blogspot (Blogger)
                    </h2>
                    
                    <div class="space-y-6">
                        <div class="flex items-start">
                            <div class="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                            <p class="text-sm text-gray-600">Buka Dashboard <strong>Blogger.com</strong> dan pilih menu <strong>Tata Letak (Layout)</strong>.</p>
                        </div>
                        <div class="flex items-start">
                            <div class="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                            <p class="text-sm text-gray-600">Klik <strong>Tambahkan Gadget</strong> di bagian Sidebar atau Footer.</p>
                        </div>
                        <div class="flex items-start">
                            <div class="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                            <p class="text-sm text-gray-600">Pilih jenis gadget <strong>"HTML/JavaScript"</strong>.</p>
                        </div>
                        <div class="flex items-start">
                            <div class="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
                            <p class="text-sm text-gray-600">Beri judul (misal: Info PPID) dan tempelkan <strong>Kode Embed</strong> yang sudah Anda salin di atas.</p>
                        </div>
                    </div>
                </section>

                <section class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-code text-purple-500 mr-2"></i> Integrasi Elementor
                    </h2>
                    <p class="text-sm text-gray-600 mb-4">Jika Anda menggunakan Elementor Page Builder, gunakan widget <strong>"HTML"</strong>. Seret widget tersebut ke kolom yang diinginkan, lalu tempel kode iframe yang sudah Anda salin.</p>
                    <div class="bg-gray-50 p-4 rounded-xl text-xs text-purple-800 font-medium">
                        Tips: Gunakan pengaturan "Margin" atau "Padding" pada kolom Elementor untuk merapikan jarak widget dengan elemen lain.
                    </div>
                </section>
            </div>

            <!--  Sidebar Technical Info  -->
            <div class="space-y-8">
                <section class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-8 text-white">
                    <h3 class="text-lg font-bold mb-4 flex items-center text-blue-400">
                        <i class="fas fa-info-circle mr-2"></i> Tips Teknis
                    </h3>
                    <div class="space-y-6 text-sm opacity-90">
                        <div>
                            <h4 class="font-bold text-white">Auto-Update</h4>
                            <p class="mt-1">Konten di dalam widget ini di-cache selama 5 menit. Perubahan di database kami akan muncul otomatis tanpa perlu ganti kode.</p>
                        </div>
                        <hr class="border-white/10">
                        <div>
                            <h4 class="font-bold text-white">SSL (HTTPS)</h4>
                            <p class="mt-1">Widget kami mendukung HTTPS secara penuh, sehingga aman dipasang di website mana pun tanpa peringatan keamanan.</p>
                        </div>
                        <hr class="border-white/10">
                        <div>
                            <h4 class="font-bold text-white">No-Style Conflict</h4>
                            <p class="mt-1">Karena menggunakan Iframe, CSS website Anda tidak akan merusak tampilan widget, dan CSS widget tidak akan merusak website Anda.</p>
                        </div>
                    </div>
                </section>

                <section class="bg-blue-50 border border-blue-100 rounded-[2.5rem] p-8">
                    <h3 class="text-lg font-bold text-blue-800 mb-4">Bantuan Teknis</h3>
                    <p class="text-sm text-blue-700 leading-relaxed">Jika Anda mengalami kendala saat pemasangan widget pada CMS tertentu, tim IT kami siap membantu integrasi secara gratis.</p>
                    <a href="/#kontak" class="mt-4 inline-flex items-center text-blue-600 font-bold hover:underline">
                        Hubungi Admin <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </section>
            </div>
        </div>

        <!--  Footer Call to Action  -->
        <div class="bg-blue-600 rounded-[3rem] p-12 text-white text-center shadow-2xl shadow-blue-200">
            <h2 class="text-3xl font-extrabold mb-4">Sudah Siap Memasang Widget?</h2>
            <p class="text-lg opacity-80 mb-8 max-w-2xl mx-auto">Tingkatkan transparansi informasi di portal Anda sekarang juga dengan widget resmi dari PPID Kabupaten Sinjai.</p>
            <div class="flex justify-center space-x-4">
                <a href="#embedCode" class="bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-all">Mulai Kustomisasi</a>
            </div>
        </div>
    </div>
</div>


</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import CustomSelect from '@/components/CustomSelect.vue';
import api from '@/services/api';

const profilData = ref({});
const organizations = ref([]);

// State for WidgetPage
const type = ref('latest');
const columns = ref(2);
const autoplay = ref('true');
const year = ref('');
const mode = ref('slider');
const limit = ref(5);
const category = ref('');
const display = ref('card');
const color = ref('#2563eb');
const unit_id = ref('');
const activeDropdown = ref('auto');
const refreshKey = ref(0);
const embedCode = ref('');
const embedCodeString = computed(() => { return `<iframe src="${embedUrl.value}" width="100%" height="${(limit.value === 'all' || limit.value > 10) ? '800' : (display.value === 'list' ? '450' : '480')}" frameborder="0"></iframe>`; });

const embedUrl = computed(() => {
    let url = 'https://ppidkab.sinjaikab.go.id/widgets/embed?type=' + type.value + '&display=' + display.value + '&mode=' + mode.value + '&columns=' + columns.value + '&autoplay=' + autoplay.value + '&limit=' + limit.value;
    if (unit_id.value) url += '&unit_id=' + unit_id.value;
    if (year.value) url += '&year=' + year.value;
    if (category.value) url += '&category=' + encodeURIComponent(category.value);
    url += '&t=' + refreshKey.value;
    return url;
});

watch([type, display, category, mode, columns, autoplay, limit, unit_id, year], () => { forceRefresh(); }, { deep: true });

const forceRefresh = () => {
    refreshKey.value++;
    updateCode();
};

const updateCode = () => {
    // Basic logic
    let url = 'https://ppidkab.sinjaikab.go.id/widgets/embed?mode=' + mode.value;
    if(limit.value) url += '&limit=' + limit.value;
    if(category.value) url += '&category=' + category.value;
    if(display.value) url += '&display=' + display.value;
    if(color.value) url += '&color=' + encodeURIComponent(color.value);
    if(unit_id.value) url += '&unit_id=' + unit_id.value;
    
    embedCode.value = `<iframe src="${url}" width="100%" height="500" frameborder="0"></iframe>`;
};

const copyEmbedCode = () => {
    alert("Kode disalin!");
};


onMounted(async () => {
    try {
        const res = await api.get('/profil');
        if (res.data && res.data.data) {
            profilData.value = res.data.data;
        }
    } catch (e) {
        console.error(e);
    }
    
    try {
        const resUnits = await api.get('/units');
        if (resUnits.data && resUnits.data.data) {
            organizations.value = resUnits.data.data;
        }
    } catch (e) {
        console.error(e);
    }
});
</script>
