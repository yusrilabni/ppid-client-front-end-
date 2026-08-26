import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { ref, useSSRContext } from 'vue';

const _sfc_main = {
  __name: "rss",
  __ssrInlineRender: true,
  setup(__props) {
    ref({});
    const organizations = ref([]);
    const open = ref(false);
    const motherTab = ref("card");
    const codeTab = ref("html");
    const showPreview = ref(false);
    const loading = ref(false);
    ref("https://ppidkab.sinjaikab.go.id/rss/generate");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="bg-gray-50 py-12"><div class="container mx-auto px-4 max-w-6xl"><div class="text-center mb-12"><div class="inline-block p-3 bg-orange-100 rounded-2xl mb-4 text-orange-600 shadow-sm"><i class="fas fa-rss text-3xl"></i></div><h1 class="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight uppercase">RSS FEED &amp; INTEGRASI SISTEM</h1><p class="text-lg text-gray-600 max-w-3xl mx-auto">Dokumentasi lengkap penggunaan Feed XML untuk sindikasi konten otomatis ke platform lain.</p></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-8 text-gray-800"><section class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative overflow-hidden text-left"><div class="absolute top-0 right-0 p-4 opacity-5"><i class="fas fa-rss text-9xl"></i></div><h2 class="text-2xl font-bold mb-4 flex items-center text-blue-600"><span class="w-2 h-8 bg-blue-500 rounded-full mr-3"></span> Apa itu RSS Feed? </h2><p class="text-gray-600 text-sm leading-relaxed relative z-10"> RSS (Really Simple Syndication) adalah teknologi standar yang memungkinkan Anda berlangganan konten dari website kami secara otomatis. Setiap kali admin PPID melakukan pembaruan informasi, URL RSS ini akan langsung memperbarui datanya sehingga platform Anda selalu mendapatkan konten terkini tanpa perlu pemantauan manual secara terus-menerus. Ini adalah cara tercepat untuk sinkronisasi data antar website pemerintah dan portal publik. </p></section><section class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-left"><h2 class="text-2xl font-bold mb-6 flex items-center text-green-600"><span class="w-2 h-8 bg-green-500 rounded-full mr-3"></span> Struktur Data Detail </h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="p-4 bg-gray-50 rounded-xl border border-gray-100"><p class="text-blue-600 font-bold font-mono">&lt;title&gt;</p><p class="text-gray-500 mt-1">Judul resmi dokumen atau pengumuman yang ditampilkan pada feed.</p></div><div class="p-4 bg-gray-50 rounded-xl border border-gray-100"><p class="text-blue-600 font-bold font-mono">&lt;organization&gt;</p><p class="text-gray-500 mt-1">Nama Dinas / Instansi pemilik data yang menerbitkan informasi.</p></div><div class="p-4 bg-gray-50 rounded-xl border border-gray-100"><p class="text-blue-600 font-bold font-mono">&lt;status&gt;</p><p class="text-gray-500 mt-1">Kondisi dokumen (BERLAKU / ARSIP) untuk validasi data publik.</p></div><div class="p-4 bg-gray-50 rounded-xl border border-gray-100"><p class="text-blue-600 font-bold font-mono">&lt;category&gt;</p><p class="text-gray-500 mt-1">Klasifikasi data informasi berdasarkan standar PPID Kabupaten Sinjai.</p></div></div></section><section class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-left"><h2 class="text-2xl font-bold mb-6 flex items-center text-orange-600"><span class="w-2 h-8 bg-orange-500 rounded-full mr-3"></span> Kustomisasi URL Feed (Filter) </h2><p class="text-sm text-gray-600 mb-6">Gunakan parameter di bawah ini untuk mendapatkan data yang spesifik melalui URL:</p><div class="bg-gray-900 rounded-2xl p-6 text-[11px] font-mono text-gray-300 space-y-4 border-l-4 border-orange-500 shadow-xl"><div><p class="text-blue-400 font-bold mb-1">// Filter per Instansi (Contoh: Diskominfo)</p><code class="break-all text-white">https://ppidkab.sinjaikab.go.id/rss/generate?unit_id=730714</code></div><div><p class="text-blue-400 font-bold mb-1">// Filter per Tahun (Contoh: 2024)</p><code class="break-all text-white">https://ppidkab.sinjaikab.go.id/rss/generate?year=2024</code></div><div><p class="text-blue-400 font-bold mb-1">// Filter per Jumlah Data (Contoh: Limit 15 Data)</p><code class="break-all text-white">https://ppidkab.sinjaikab.go.id/rss/generate?limit=15</code></div><div><p class="text-blue-400 font-bold mb-1">// Filter per Kategori (Contoh: Informasi Berkala)</p><code class="break-all text-white">https://ppidkab.sinjaikab.go.id/rss/generate?category=Informasi Berkala</code></div><div class="pt-2 border-t border-white/10"><p class="text-orange-400 font-black mb-1 uppercase tracking-widest text-[10px]">// Gabungan 4 Filter (Contoh: Dinkes, Tahun 2024, Limit 5, Kategori Setiap Saat):</p><code class="break-all text-white">https://ppidkab.sinjaikab.go.id/rss/generate?unit_id=730701&amp;year=2024&amp;limit=5&amp;category=Informasi Setiap Saat</code></div></div><div class="mt-6"><button class="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center"><i class="${ssrRenderClass([open.value ? "fa-chevron-up" : "fa-list-ul", "fas"])}"></i><span class="ml-2">${ssrInterpolate(open.value ? "Sembunyikan Daftar ID OPD" : "Lihat Daftar ID OPD Semua Instansi")}</span></button><div class="mt-4 border-t pt-4" style="${ssrRenderStyle(open.value ? null : { display: "none" })}"><div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]"><!--[-->`);
      ssrRenderList(organizations.value, (org) => {
        _push(`<div class="flex justify-between p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all"><span class="text-gray-700 font-medium truncate pr-4">${ssrInterpolate(org.name)}</span><span class="text-blue-600 font-bold font-mono">ID: ${ssrInterpolate(org.unit_id)}</span></div>`);
      });
      _push(`<!--]--></div></div></div></section></div><div class="space-y-8"><section class="bg-blue-600 rounded-[2rem] shadow-lg p-7 text-white relative overflow-hidden group text-left"><i class="fab fa-wordpress absolute -bottom-4 -right-4 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-700"></i><h3 class="text-lg font-black mb-5 uppercase tracking-widest flex items-center border-b border-white/20 pb-3"><i class="fab fa-wordpress mr-3 text-2xl"></i> WordPress </h3><div class="space-y-5 text-[11px] opacity-95 leading-relaxed font-medium"><div class="flex items-start"><span class="bg-white text-blue-600 w-5 h-5 rounded-md flex items-center justify-center mr-3 flex-shrink-0 font-black">1</span><p>Buka Editor Post/Halaman Anda dan aktifkan blok editor terbaru.</p></div><div class="flex items-start"><span class="bg-white text-blue-600 w-5 h-5 rounded-md flex items-center justify-center mr-3 flex-shrink-0 font-black">2</span><p>Klik tombol <strong>(+)</strong> lalu cari blok bernama <strong>&quot;RSS&quot;</strong> di kolom pencarian.</p></div><div class="flex items-start"><span class="bg-white text-blue-600 w-5 h-5 rounded-md flex items-center justify-center mr-3 flex-shrink-0 font-black">3</span><p>Masukkan <strong>URL Feed</strong> yang sudah dikustomisasi ke kolom input RSS WordPress.</p></div><div class="flex items-start"><span class="bg-white text-blue-600 w-5 h-5 rounded-md flex items-center justify-center mr-3 flex-shrink-0 font-black">4</span><p>Klik <strong>&quot;Gunakan URL&quot;</strong> dan tunggu data memuat secara otomatis dari server kami.</p></div><div class="flex items-start"><span class="bg-white text-blue-600 w-5 h-5 rounded-md flex items-center justify-center mr-3 flex-shrink-0 font-black">5</span><p>Atur tata letak pada sidebar pengaturan blok agar sesuai dengan estetika situs Anda.</p></div><div class="bg-black/20 p-4 rounded-xl border border-white/10 mt-3"><p class="font-black mb-2 text-[9px] uppercase tracking-widest text-blue-200">Tips Konfigurasi:</p><ul class="space-y-2 text-[10px]"><li class="flex items-center"><i class="fas fa-check-circle mr-2 text-green-400"></i> Aktifkan opsi &quot;Tampilkan Ringkasan&quot;</li><li class="flex items-center"><i class="fas fa-check-circle mr-2 text-green-400"></i> Aktifkan opsi &quot;Tampilkan Tanggal&quot;</li><li class="flex items-center"><i class="fas fa-check-circle mr-2 text-green-400"></i> Pilih mode List untuk hemat ruang</li></ul></div></div></section><section class="bg-orange-600 rounded-[2rem] shadow-lg p-7 text-white relative overflow-hidden group text-left"><i class="fab fa-google absolute -bottom-4 -right-4 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-700"></i><h3 class="text-lg font-black mb-5 uppercase tracking-widest flex items-center border-b border-white/20 pb-3"><i class="fab fa-google mr-3 text-xl"></i> Blogger </h3><div class="space-y-5 text-[11px] opacity-95 leading-relaxed font-medium"><div class="flex items-start"><span class="bg-white text-orange-600 w-5 h-5 rounded-md flex items-center justify-center mr-3 flex-shrink-0 font-black">1</span><p>Masuk ke dashboard utama dan pilih menu <strong>Tata Letak (Layout)</strong>.</p></div><div class="flex items-start"><span class="bg-white text-orange-600 w-5 h-5 rounded-md flex items-center justify-center mr-3 flex-shrink-0 font-black">2</span><p>Klik link <strong>Tambahkan Gadget</strong> di bagian Sidebar atau Footer blog Anda.</p></div><div class="flex items-start"><span class="bg-white text-orange-600 w-5 h-5 rounded-md flex items-center justify-center mr-3 flex-shrink-0 font-black">3</span><p>Pilih gadget <strong>&quot;Feed&quot;</strong> dari daftar pop-up gadget Blogger yang tersedia.</p></div><div class="flex items-start"><span class="bg-white text-orange-600 w-5 h-5 rounded-md flex items-center justify-center mr-3 flex-shrink-0 font-black">4</span><p>Tempelkan <strong>URL RSS Feed</strong> pilihan Anda, lalu klik &quot;Lanjutkan&quot;.</p></div><div class="flex items-start"><span class="bg-white text-orange-600 w-5 h-5 rounded-md flex items-center justify-center mr-3 flex-shrink-0 font-black">5</span><p>Berikan judul gadget dan simpan untuk melihat hasilnya di halaman publik.</p></div><div class="bg-black/20 p-4 rounded-xl border border-white/10 mt-3"><p class="text-[10px] italic leading-relaxed">Blogger secara otomatis akan memperbarui daftar informasi terbaru setiap kali ada pembaruan di portal PPID, menjaga blog Anda tetap relevan tanpa usaha ekstra.</p></div></div></section></div></div><div class="mt-12"><section class="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 p-8 md:p-14 overflow-hidden text-gray-800 text-left"><div class="mb-10"><h2 class="text-3xl font-black flex items-center mb-6 tracking-tight"><span class="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl flex items-center justify-center mr-5 shadow-xl"><i class="fas fa-magic"></i></span> Contoh Kode Siap Pakai </h2></div><div class="flex space-x-6 mb-10 border-b-2 border-gray-100"><button class="${ssrRenderClass([motherTab.value === "card" ? "text-blue-600 border-b-4 border-blue-600 -mb-[2px]" : "text-gray-400", "pb-4 text-xl font-black uppercase tracking-tighter"])}">Kartu (Grid)</button><button class="${ssrRenderClass([motherTab.value === "list" ? "text-blue-600 border-b-4 border-blue-600 -mb-[2px]" : "text-gray-400", "pb-4 text-xl font-black uppercase tracking-tighter"])}">Daftar (List)</button></div><div class="flex flex-wrap gap-2 mb-10 bg-gray-100 p-1.5 rounded-2xl w-fit"><button class="${ssrRenderClass([codeTab.value === "html" ? "bg-white shadow-sm text-blue-600" : "text-gray-500", "py-3 px-8 rounded-xl text-xs font-black uppercase tracking-widest transition-all"])}">HTML &amp; JS</button><button class="${ssrRenderClass([codeTab.value === "php" ? "bg-white shadow-sm text-blue-600" : "text-gray-500", "py-3 px-8 rounded-xl text-xs font-black uppercase tracking-widest transition-all"])}">PHP Native</button><button class="${ssrRenderClass([codeTab.value === "laravel" ? "bg-white shadow-sm text-blue-600" : "text-gray-500", "py-3 px-8 rounded-xl text-xs font-black uppercase tracking-widest transition-all"])}">Laravel Blade</button></div><div class="bg-gray-900 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col min-h-[550px] border-8 border-gray-800"><div class="p-6 border-b border-white/5 flex items-center justify-between bg-white/5"><div class="flex space-x-2"><div class="w-3 h-3 rounded-full bg-red-500/40"></div><div class="w-3 h-3 rounded-full bg-yellow-500/40"></div><div class="w-3 h-3 rounded-full bg-green-500/40"></div></div><div class="flex space-x-3"><button class="bg-blue-600 hover:bg-blue-700 text-white px-5 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center"><i class="fas fa-copy mr-2"></i> SALIN </button><button class="bg-orange-500 hover:bg-orange-600 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg"${ssrRenderAttr("title", showPreview.value ? "Lihat Kode" : "Live Preview")}><i class="${ssrRenderClass([loading.value ? "fa-spinner fa-spin" : showPreview.value ? "fa-code" : "fa-eye", "fas text-sm"])}"></i></button></div></div><div class="relative flex-grow"><div class="bg-[#fcfcfc] p-8 md:p-14 h-full min-h-[450px] overflow-y-auto text-sans" style="${ssrRenderStyle(showPreview.value ? null : { display: "none" })}"><div id="preview-area" class="w-full"></div></div><div class="p-8 md:p-12 font-mono text-[13px] leading-relaxed text-blue-100/80 overflow-x-auto" style="${ssrRenderStyle(!showPreview.value ? null : { display: "none" })}"><div style="${ssrRenderStyle(motherTab.value === "card" ? null : { display: "none" })}">`);
      if (codeTab.value === "html") {
        _push(`<pre class="whitespace-pre-wrap"><code id="code-card-html">&lt;style&gt;
  .ppid-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; font-family: sans-serif; }
  .ppid-card { background: #fff; border-radius: 20px; padding: 25px; border: 1px solid #eee; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
  .ppid-title { font-weight: 800; color: #1a1a1a; text-decoration: none; font-size: 15px; display: block; margin: 10px 0; }
  @media (max-width: 768px) { .ppid-grid { grid-template-columns: 1fr; } }
&lt;/style&gt;
&lt;div id=&quot;ppid-grid&quot; class=&quot;ppid-grid&quot;&gt;Memuat data...&lt;/div&gt;
&lt;script&gt;
  // TIPS: Ganti nilai &#39;category&#39; untuk filter spesifik: 
  // &#39;Informasi Berkala&#39;, &#39;Informasi Setiap Saat&#39;, &#39;Informasi Serta Merta&#39;, &#39;Informasi Dikecualikan&#39;
  const RSS_URL = &#39;https://ppidkab.sinjaikab.go.id/rss/generate?limit=6&amp;category=Informasi Berkala&#39;;
  
  fetch(RSS_URL).then(res =&gt; res.text()).then(xmlString =&gt; {
    const xml = new DOMParser().parseFromString(xmlString, &quot;text/xml&quot;);
    const items = xml.querySelectorAll(&quot;item&quot;);
    let html = &#39;&#39;;
    items.forEach(el =&gt; {
      html += \`&lt;div class=&quot;ppid-card&quot;&gt;
                 &lt;div style=&quot;display:flex; justify-content:space-between;&quot;&gt;
                   &lt;small style=&quot;color:#0052FF; font-weight:bold;&quot;&gt;\u{1F3DB}\uFE0F \${el.querySelector(&quot;organization&quot;).textContent}&lt;/small&gt;
                   &lt;small style=&quot;color:#666; background:#eee; padding:2px 8px; border-radius:5px;&quot;&gt;\${el.querySelector(&quot;category&quot;).textContent}&lt;/small&gt;
                 &lt;/div&gt;
                 &lt;a href=&quot;\${el.querySelector(&quot;link&quot;).textContent}&quot; target=&quot;_blank&quot; class=&quot;ppid-title&quot;&gt;\${el.querySelector(&quot;title&quot;).textContent}&lt;/a&gt;
                 &lt;small style=&quot;color:#999&quot;&gt;\u{1F4C5} \${new Date(el.querySelector(&quot;pubDate&quot;).textContent).toLocaleDateString(&#39;id-ID&#39;)}&lt;/small&gt;
               &lt;/div&gt;\`;
    });
    document.getElementById(&quot;ppid-grid&quot;).innerHTML = html;
  });
&lt;/script&gt;</code></pre>`);
      } else {
        _push(`<!---->`);
      }
      if (codeTab.value === "php") {
        _push(`<pre class="whitespace-pre-wrap"><code id="code-card-php">&lt;?php
// Ganti &#39;category&#39; untuk filter: &#39;Informasi Berkala&#39;, &#39;Informasi Setiap Saat&#39;, dll.
$url = &quot;https://ppidkab.sinjaikab.go.id/rss/generate?unit_id=730714&amp;limit=6&amp;category=Informasi Berkala&quot;;
$rss = simplexml_load_file($url);
echo &quot;&lt;div style=&#39;display:grid; grid-template-columns:repeat(3, 1fr); gap:20px;&#39;&gt;&quot;;
foreach ($rss-&gt;channel-&gt;item as $info) {
    echo &quot;&lt;div style=&#39;background:#fff; padding:20px; border-radius:15px; border:1px solid #eee;&#39;&gt;
            &lt;div style=&#39;color:#0052FF; font-weight:bold; font-size:10px;&#39;&gt;\u{1F3DB}\uFE0F {$info-&gt;organization}&lt;/div&gt;
            &lt;div style=&#39;background:#eee; padding:2px 8px; border-radius:5px; display:inline-block; font-size:10px;&#39;&gt;\u{1F4C2} {$info-&gt;category}&lt;/div&gt;
            &lt;div style=&#39;margin:10px 0;&#39;&gt;&lt;strong&gt;{$info-&gt;title}&lt;/strong&gt;&lt;/div&gt;
          &lt;/div&gt;&quot;;
}
echo &quot;&lt;/div&gt;&quot;;
?&gt;</code></pre>`);
      } else {
        _push(`<!---->`);
      }
      if (codeTab.value === "laravel") {
        _push(`<pre class="whitespace-pre-wrap"><code id="code-card-laravel">// 1. Controller
$xml = simplexml_load_file(&quot;https://ppidkab.sinjaikab.go.id/rss/generate?limit=6&quot;);
return view(&#39;your_view&#39;, [&#39;feeds&#39; =&gt; $xml-&gt;channel-&gt;item]);

// 2. View (.blade.php)
&lt;div class=&quot;grid grid-cols-3 gap-6&quot;&gt;
    @foreach($feeds as $item)
        &lt;div class=&quot;card&quot;&gt;
            &lt;h4&gt;{{ $item-&gt;title }}&lt;/h4&gt;
            &lt;p&gt;{{ $item-&gt;organization }}&lt;/p&gt;
        &lt;/div&gt;
    @endforeach
&lt;/div&gt;</code></pre>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div style="${ssrRenderStyle(motherTab.value === "list" ? null : { display: "none" })}">`);
      if (codeTab.value === "html") {
        _push(`<pre class="whitespace-pre-wrap"><code id="code-list-html">&lt;div id=&quot;ppid-list&quot; style=&quot;background:#fff; border-radius:15px; border:1px solid #eee; overflow:hidden;&quot;&gt;Memuat...&lt;/div&gt;
&lt;script&gt;
  fetch(&#39;https://ppidkab.sinjaikab.go.id/rss/generate?limit=10&#39;).then(res =&gt; res.text()).then(xml =&gt; {
    const data = new DOMParser().parseFromString(xml, &quot;text/xml&quot;);
    const items = data.querySelectorAll(&quot;item&quot;);
    let html = &#39;&#39;;
    items.forEach((el, index) =&gt; {
      html += \`&lt;div style=&quot;padding:15px 20px; border-bottom:1px solid #f5f5f5; display:flex; align-items:center; justify-content:space-between; font-family:sans-serif;&quot;&gt;
                 &lt;a href=&quot;\${el.querySelector(&quot;link&quot;).textContent}&quot; target=&quot;_blank&quot; style=&quot;text-decoration:none; color:#333; font-weight:700;&quot;&gt;\${el.querySelector(&quot;title&quot;).textContent}&lt;/a&gt;
                 &lt;span style=&quot;font-size:9px; font-weight:bold; padding:2px 10px; border-radius:20px; background:#eee;&quot;&gt;\${el.querySelector(&quot;status&quot;).textContent}&lt;/span&gt;
               &lt;/div&gt;\`;
    });
    document.getElementById(&quot;ppid-list&quot;).innerHTML = html;
  });
&lt;/script&gt;</code></pre>`);
      } else {
        _push(`<!---->`);
      }
      if (codeTab.value === "php") {
        _push(`<pre class="whitespace-pre-wrap"><code id="code-list-php">// PHP List Code...</code></pre>`);
      } else {
        _push(`<!---->`);
      }
      if (codeTab.value === "laravel") {
        _push(`<pre class="whitespace-pre-wrap"><code id="code-list-laravel">// Laravel List Code...</code></pre>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div></section></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/rss.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=rss-DRopFDg5.mjs.map
