import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { watch, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { useQuery } from '@tanstack/vue-query';
import { g as getStorageUrl, a as api } from './api-k33KGvo_.mjs';
import { a as useRoute } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'axios';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = route.params.slug;
    const fetchDokumen = async () => {
      const res = await api.get(`/informasi-pemkab/${slug}`);
      return res.data;
    };
    const getDownloadUrl = (dokumen2) => {
      if (!dokumen2) return "#";
      return `${api.defaults.baseURL.replace("/api/v1", "")}/transparansi/informasi-pemkab/${dokumen2.slug || dokumen2.id}/download`;
    };
    const getEmbedUrl = (path) => {
      if (!path) return "";
      if (path.startsWith("http")) {
        if (path.includes("drive.google.com")) {
          return path.replace(/\/view\?.*$/, "/preview");
        }
        return path;
      }
      return getStorageUrl(path) + "#toolbar=0";
    };
    const { data: dokumen, isLoading, isError } = useQuery({
      queryKey: ["informasi-pemkab", slug],
      queryFn: fetchDokumen,
      retry: false
    });
    const isImage = (path) => {
      if (!path) return false;
      const ext = path.split(".").pop().toLowerCase();
      return ["png", "jpg", "jpeg", "webp", "svg", "gif"].includes(ext);
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    };
    watch(dokumen, (newDoc) => {
      if (newDoc && newDoc.judul) {
        const title = newDoc.judul + " - PPID Kabupaten Sinjai";
        (void 0).title = title;
        let ogTitle = (void 0).querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = title;
        let ogDesc = (void 0).querySelector('meta[property="og:description"]');
        if (ogDesc && newDoc.deskripsi) ogDesc.content = newDoc.deskripsi;
        let imageUrl = "https://ppidkab.sinjaikab.go.id/storage/logo/Lambang_Kabupaten_Sinjai_OG.jpg";
        let ogImage = (void 0).querySelector('meta[property="og:image"]');
        if (!ogImage) {
          ogImage = (void 0).createElement("meta");
          ogImage.setAttribute("property", "og:image");
          (void 0).head.appendChild(ogImage);
        }
        ogImage.content = imageUrl;
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(isLoading)) {
        _push(`<div class="min-h-screen flex items-center justify-center bg-gray-50"><div class="text-center"><i class="fas fa-circle-notch fa-spin text-4xl text-blue-500 mb-4"></i><p class="text-gray-500 font-medium">Memuat dokumen...</p></div></div>`);
      } else if (unref(isError)) {
        _push(`<div class="min-h-screen flex items-center justify-center bg-gray-50"><div class="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4"><i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-6"></i><h2 class="text-2xl font-bold text-gray-800 mb-3">Dokumen Tidak Ditemukan</h2><p class="text-gray-600 mb-8">Maaf, dokumen yang Anda cari tidak tersedia, ditarik, atau terjadi kesalahan pada server.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/transparansi/informasi-pemkab",
          class: "inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fas fa-arrow-left mr-2"${_scopeId}></i> Kembali ke Daftar `);
            } else {
              return [
                createVNode("i", { class: "fas fa-arrow-left mr-2" }),
                createTextVNode(" Kembali ke Daftar ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else if (unref(dokumen)) {
        _push(`<div class="w-full"><div class="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 pt-6 md:pt-10 pb-24 overflow-hidden"><div class="absolute inset-0 opacity-20 bg-[url(&#39;https://www.transparenttextures.com/patterns/cubes.png&#39;)] mix-blend-overlay"></div><div class="container max-w-5xl mx-auto px-4 relative z-10"><div class="flex flex-wrap items-center justify-start gap-y-2 space-x-2 md:space-x-3 text-blue-200 text-xs md:text-sm mb-6 font-medium w-full text-left">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "hover:text-white transition-colors flex items-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fas fa-home mr-1"${_scopeId}></i> Beranda`);
            } else {
              return [
                createVNode("i", { class: "fas fa-home mr-1" }),
                createTextVNode(" Beranda")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<i class="fas fa-chevron-right text-[10px] opacity-50"></i><span class="text-white opacity-80 flex items-center"><i class="fas fa-layer-group mr-1"></i> Transparansi</span><i class="fas fa-chevron-right text-[10px] opacity-50"></i>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/transparansi/informasi-pemkab",
          class: "hover:text-white transition-colors flex items-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fas fa-file-pdf mr-1"${_scopeId}></i> Informasi Pemkab`);
            } else {
              return [
                createVNode("i", { class: "fas fa-file-pdf mr-1" }),
                createTextVNode(" Informasi Pemkab")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<i class="fas fa-chevron-right text-[10px] opacity-50"></i><span class="text-white opacity-90 truncate max-w-[150px] sm:max-w-[200px] md:max-w-md flex items-center"><i class="fas fa-eye mr-1"></i> ${ssrInterpolate(unref(dokumen).judul)}</span></div><h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg leading-tight max-w-4xl">${ssrInterpolate(unref(dokumen).judul)}</h1><div class="flex flex-wrap items-center mt-6 gap-3"><span class="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold border border-white/30 shadow-sm flex items-center"><i class="fas fa-calendar-alt mr-2 opacity-70"></i> ${ssrInterpolate(unref(dokumen).tahun)}</span><span class="bg-blue-700/50 backdrop-blur-sm text-blue-100 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-400/30 shadow-sm flex items-center"><i class="fas fa-folder-open mr-2 opacity-70"></i> ${ssrInterpolate(unref(dokumen).kategori)}</span></div></div><div class="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none transform translate-y-1"><svg class="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,121.22,201.2,110.53Z" class="fill-gray-50"></path></svg></div></div><div class="bg-gray-50 pb-20"><div class="container max-w-5xl mx-auto px-4 -mt-10 relative z-20"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-6">`);
        if (unref(dokumen).deskripsi) {
          _push(`<div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"><div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4"><h2 class="text-xl font-bold text-gray-800 flex items-center"><i class="fas fa-info-circle text-blue-500 mr-2"></i> Deskripsi Dokumen </h2></div><div class="p-6 md:p-8"><div class="prose prose-blue max-w-none text-gray-700 leading-relaxed text-lg"><p>${ssrInterpolate(unref(dokumen).deskripsi)}</p></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"><div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-between items-center"><h2 class="text-xl font-bold text-gray-800 flex items-center"><i class="fas fa-eye text-blue-500 mr-2"></i> Pratinjau Dokumen </h2><span class="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full"><i class="fas fa-chart-line mr-1"></i> ${ssrInterpolate(unref(dokumen).views_count || 0)} Kali Dilihat </span></div><div class="p-0 h-[600px] w-full bg-gray-100">`);
        if (unref(dokumen).file_path) {
          _push(`<!--[-->`);
          if (unref(dokumen).file_path.startsWith("http") && !unref(dokumen).file_path.includes("drive.google.com")) {
            _push(`<div class="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8 text-center"><i class="fas fa-external-link-alt text-6xl text-gray-300 mb-4"></i><h3 class="text-xl font-bold text-gray-700 mb-2">Dokumen Berupa Tautan Eksternal</h3><p class="text-gray-500 mb-6">Tautan ini mengarah ke sumber eksternal dan tidak dapat dipratinjau langsung di sini.</p><a${ssrRenderAttr("href", getDownloadUrl(unref(dokumen)))} target="_blank" class="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition"> Kunjungi Tautan <i class="fas fa-arrow-right ml-2"></i></a></div>`);
          } else if (isImage(unref(dokumen).file_path)) {
            _push(`<div class="w-full h-full flex items-center justify-center p-4 bg-gray-100 overflow-hidden"><img${ssrRenderAttr("src", unref(getStorageUrl)(unref(dokumen).file_path))}${ssrRenderAttr("alt", unref(dokumen).judul)} class="max-w-full max-h-full object-contain rounded-lg shadow-sm"></div>`);
          } else {
            _push(`<iframe${ssrRenderAttr("src", getEmbedUrl(unref(dokumen).file_path))} class="w-full h-full border-0"></iframe>`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<div class="w-full h-full flex items-center justify-center text-gray-400 flex-col"><i class="fas fa-ban text-4xl mb-3"></i><p>File tidak tersedia</p></div>`);
        }
        _push(`</div></div><div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md border border-blue-100 overflow-hidden p-6 md:p-8 relative"><div class="absolute right-0 bottom-0 opacity-5"><i class="fas fa-cloud-download-alt text-9xl -mr-6 -mb-6"></i></div><div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6"><div><h3 class="text-lg font-bold text-gray-800 mb-1">Akses Dokumen</h3><p class="text-sm text-gray-600">Klik tombol di samping untuk melihat atau mengunduh dokumen secara lengkap.</p></div><div class="flex-shrink-0 w-full md:w-auto text-center md:text-right flex flex-col sm:flex-row gap-3">`);
        if (unref(dokumen).file_path) {
          _push(`<a${ssrRenderAttr("href", getDownloadUrl(unref(dokumen)))} target="_blank" class="${ssrRenderClass([unref(dokumen).file_path.startsWith("http") && !unref(dokumen).file_path.includes("drive.google.com") ? "from-blue-600 to-blue-700 shadow-blue-500/30 hover:shadow-blue-600/50" : "from-green-500 to-emerald-600 shadow-green-500/30 hover:shadow-green-600/50", "w-full md:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1"])}"><i class="${ssrRenderClass([unref(dokumen).file_path.startsWith("http") && !unref(dokumen).file_path.includes("drive.google.com") ? "fa-external-link-alt" : "fa-cloud-download-alt", "fas mr-2 text-xl"])}"></i> ${ssrInterpolate(unref(dokumen).file_path.startsWith("http") && !unref(dokumen).file_path.includes("drive.google.com") ? "Buka Tautan Eksternal" : "Unduh Dokumen")}</a>`);
        } else {
          _push(`<span class="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-500 font-bold rounded-xl cursor-not-allowed"><i class="fas fa-ban mr-2"></i> File Tidak Tersedia </span>`);
        }
        _push(`<button class="w-full md:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white border-2 border-blue-500 text-blue-600 font-bold rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-50"><i class="fas fa-share-alt mr-2 text-xl"></i> Bagikan </button></div><p class="mt-4 text-xs text-gray-500 font-semibold md:text-right"><i class="fas fa-eye mr-1"></i> Telah dilihat ${ssrInterpolate(unref(dokumen).views_count || 0)} kali</p></div></div></div><div class="lg:col-span-1 space-y-6">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/transparansi/informasi-pemkab",
          class: "w-full flex items-center justify-center px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all duration-300 shadow-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fas fa-arrow-left mr-2"${_scopeId}></i> Kembali ke Daftar Dokumen `);
            } else {
              return [
                createVNode("i", { class: "fas fa-arrow-left mr-2" }),
                createTextVNode(" Kembali ke Daftar Dokumen ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"><div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4"><h2 class="text-lg font-bold text-gray-800 flex items-center"><i class="fas fa-list-ul text-blue-500 mr-2"></i> Metadata </h2></div><div class="p-6"><ul class="space-y-4"><li class="flex flex-col"><span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Di-upload oleh</span><span class="text-sm font-bold text-gray-800 flex items-start"><i class="fas fa-building mt-1 mr-2 text-blue-500 opacity-80"></i> ${ssrInterpolate(unref(dokumen).organization ? unref(dokumen).organization.name : "Pemerintah Kabupaten")}</span></li><li class="pt-4 border-t border-gray-100 flex flex-col"><span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kategori Utama</span><span class="text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg inline-block w-fit"><i class="fas fa-folder-open mr-1"></i> ${ssrInterpolate(unref(dokumen).kategori)}</span></li><li class="pt-4 border-t border-gray-100 flex flex-col"><span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Jenis Dokumen</span><span class="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg inline-block w-fit">${ssrInterpolate(unref(dokumen).jenis_dokumen)}</span></li>`);
        if (unref(dokumen).informasi) {
          _push(`<li class="pt-4 border-t border-gray-100 flex flex-col"><span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Klasifikasi PPID</span><span class="text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg inline-block w-fit"><i class="fas fa-tag mr-1"></i> ${ssrInterpolate(unref(dokumen).informasi.category)}</span></li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<li class="pt-4 border-t border-gray-100 flex flex-col"><span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sifat Akses</span>`);
        if (unref(dokumen).visibility === "public") {
          _push(`<span class="text-sm font-bold text-green-600 flex items-center"><i class="fas fa-globe mr-1.5"></i> Publik </span>`);
        } else {
          _push(`<span class="text-sm font-bold text-orange-500 flex items-center"><i class="fas fa-lock mr-1.5"></i> Private (Link Terbatas) </span>`);
        }
        _push(`</li><li class="pt-4 border-t border-gray-100 flex flex-col"><span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tahun Dokumen</span><span class="text-sm font-semibold text-gray-700 flex items-center"><i class="fas fa-calendar mr-1.5 text-blue-400"></i> ${ssrInterpolate(unref(dokumen).tahun)}</span></li><li class="pt-4 border-t border-gray-100 flex flex-col"><span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tanggal Dokumen</span><span class="text-sm font-semibold text-gray-700 flex items-center"><i class="fas fa-clock mr-1.5 text-blue-400"></i> ${ssrInterpolate(formatDate(unref(dokumen).published_at || unref(dokumen).created_at))}</span></li></ul></div></div></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/transparansi/informasi-pemkab/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-BB5fY_p0.mjs.map
