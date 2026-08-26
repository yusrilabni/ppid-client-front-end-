import { computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQuery } from '@tanstack/vue-query';
import { b as getAssetUrl, a as api } from './api-k33KGvo_.mjs';
import { _ as _sfc_main$1 } from './Breadcrumbs-CqGmUqmz.mjs';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
import { a as useRoute, u as useRouter } from './server.mjs';
import 'axios';
import './nuxt-link-vc3u7b4I.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './loading-DMBVy40S.mjs';
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
    useRouter();
    const slug = computed(() => route.params.slug);
    const sideMenuOpen = ref(false);
    const formatNumber = (num) => {
      if (!num) return "0";
      return new Intl.NumberFormat("id-ID").format(num);
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(date);
    };
    const stripTags = (html) => {
      if (!html) return "";
      return html.replace(/<[^>]*>?/gm, "");
    };
    const getApiUrl = (path) => {
      return getAssetUrl(path.replace(/^\//, ""));
    };
    const fetchFileDetail = async ({ queryKey }) => {
      const [_key, currentSlug] = queryKey;
      const res = await api.get(`/standar-layanan/file/${currentSlug}`);
      return res.data;
    };
    const { data: response, isLoading } = useQuery({
      queryKey: ["standar-layanan-file", slug],
      queryFn: fetchFileDetail,
      staleTime: 3e4,
      retry: false
    });
    useGlobalLoader(isLoading);
    const data = computed(() => {
      var _a;
      return (_a = response.value) == null ? void 0 : _a.data;
    });
    const fileUrl = computed(() => {
      var _a;
      if (!((_a = data.value) == null ? void 0 : _a.subStandarLayanan)) return null;
      const sub = data.value.subStandarLayanan;
      if (sub.file_type === "url") return sub.url;
      if (sub.file) return getAssetUrl(`storage/${sub.file}`);
      return null;
    });
    const fileExtension = computed(() => {
      if (!fileUrl.value) return null;
      const url = fileUrl.value.split("?")[0];
      return url.split(".").pop().toLowerCase();
    });
    const isPdf = computed(() => fileExtension.value === "pdf");
    const isImage = computed(() => ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(fileExtension.value));
    const isOffice = computed(() => ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileExtension.value));
    const isGoogleDrive = computed(() => fileUrl.value && fileUrl.value.includes("drive.google.com"));
    const previewUrl = computed(() => {
      if (!isGoogleDrive.value) return fileUrl.value;
      return fileUrl.value.replace("/view", "/preview");
    });
    const downloadActionUrl = computed(() => {
      var _a;
      if (!((_a = data.value) == null ? void 0 : _a.subStandarLayanan)) return "#";
      const sub = data.value.subStandarLayanan;
      if (sub.file_type === "url") return getApiUrl(`/standar-layanan/visit-url/${sub.id}`);
      return getApiUrl(`/standar-layanan/download/${sub.id}`);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "detail-page bg-gray-50 min-h-screen pb-24 lg:pb-8" }, _attrs))}><div class="container mx-auto py-4 px-4 max-w-7xl">`);
      if (data.value && data.value.subStandarLayanan) {
        _push(`<div><div class="mb-4">`);
        _push(ssrRenderComponent(_sfc_main$1, {
          breadcrumbs: unref(getBreadcrumbs).standarLayananFile((_b = (_a = data.value) == null ? void 0 : _a.standarLayanan) == null ? void 0 : _b.title, (_c = data.value) == null ? void 0 : _c.categoryIcon, (_d = _ctx.fileData) == null ? void 0 : _d.name)
        }, null, _parent));
        _push(`</div><div class="flex flex-col lg:flex-row gap-8"><div class="flex-1 min-w-0"><div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"><div class="bg-gradient-to-br from-blue-600 to-blue-800 p-6 sm:p-10 text-white relative"><div class="relative z-10"><div class="flex items-center gap-2 mb-4"><span class="bg-white/20 backdrop-blur-sm text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest border border-white/20">${ssrInterpolate(((_e = data.value.subStandarLayanan) == null ? void 0 : _e.category) || "Dokumen")}</span>`);
        if (((_g = (_f = data.value.subStandarLayanan) == null ? void 0 : _f.status_tampil) == null ? void 0 : _g.toUpperCase()) === "ARSIP") {
          _push(`<span class="bg-red-500 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest"> ARSIP </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h1 class="text-2xl sm:text-4xl font-black leading-tight">${ssrInterpolate((_h = data.value.subStandarLayanan) == null ? void 0 : _h.title)}</h1></div><div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl text-blue-500"></div></div><div class="p-6 sm:p-10"><div class="lg:hidden flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-8 border border-gray-100"><div class="flex items-center"><div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-3"><i class="fas fa-building text-blue-600 text-xs"></i></div><div class="min-w-0"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Unit Kerja</p><p class="text-xs font-bold text-gray-700 truncate w-32">${ssrInterpolate(((_k = (_j = (_i = data.value.subStandarLayanan) == null ? void 0 : _i.informasi) == null ? void 0 : _j.organization) == null ? void 0 : _k.name) || "PPID Kabupaten Sinjai")}</p></div></div><button class="bg-blue-600 text-white text-[10px] font-bold px-4 py-2 rounded-lg shadow-lg shadow-blue-100"> INFO <i class="fas fa-chevron-right ml-1"></i></button></div>`);
        if ((_m = (_l = data.value.subStandarLayanan) == null ? void 0 : _l.informasi) == null ? void 0 : _m.ringkasan) {
          _push(`<div class="mb-12"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-bold text-gray-900 flex items-center"><span class="w-1 h-6 bg-blue-600 rounded-full mr-3"></span> Ringkasan </h2></div><div class="text-gray-600 leading-relaxed text-base sm:text-lg bg-slate-50 p-6 rounded-3xl border border-slate-100 italic">${(_p = stripTags((_o = (_n = data.value.subStandarLayanan) == null ? void 0 : _n.informasi) == null ? void 0 : _o.ringkasan)) != null ? _p : ""}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mb-6"><h2 class="text-xl font-bold text-gray-900 flex items-center mb-6"><span class="w-1 h-6 bg-orange-600 rounded-full mr-3"></span> Dokumen Lampiran </h2>`);
        if (fileUrl.value) {
          _push(`<!--[--><div class="mb-8">`);
          if (isPdf.value) {
            _push(`<div class="rounded-3xl overflow-hidden border border-gray-100 shadow-2xl bg-gray-100 h-[500px] sm:h-[800px] relative group/preview"><iframe${ssrRenderAttr("src", fileUrl.value + "#toolbar=0")} class="w-full h-full border-0"></iframe><div class="absolute top-4 right-4 opacity-0 group-hover/preview:opacity-100 transition-opacity"><a${ssrRenderAttr("href", fileUrl.value)} target="_blank" class="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg text-xs font-bold text-blue-600 flex items-center"><i class="fas fa-expand mr-2"></i> LAYAR PENUH </a></div></div>`);
          } else if (isImage.value) {
            _push(`<div class="rounded-3xl overflow-hidden border border-gray-100 p-2 sm:p-4 bg-gray-50 flex justify-center shadow-inner"><img${ssrRenderAttr("src", fileUrl.value)} alt="Preview" class="max-w-full h-auto rounded-2xl shadow-2xl border-4 border-white"></div>`);
          } else if (isGoogleDrive.value) {
            _push(`<div class="rounded-3xl overflow-hidden border border-gray-100 shadow-2xl bg-gray-100 h-[500px] sm:h-[800px] relative"><iframe${ssrRenderAttr("src", previewUrl.value)} class="w-full h-full border-0" allow="autoplay"></iframe></div>`);
          } else if (isOffice.value) {
            _push(`<div class="rounded-3xl overflow-hidden border border-gray-100 shadow-2xl bg-gray-100 h-[500px] sm:h-[800px] relative"><iframe${ssrRenderAttr("src", "https://docs.google.com/viewer?url=" + encodeURIComponent(fileUrl.value) + "&embedded=true")} class="w-full h-full border-0"></iframe></div>`);
          } else {
            _push(`<div class="p-10 sm:p-16 bg-gradient-to-br from-gray-50 to-slate-100 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-center"><div class="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200"><i class="fas fa-link text-3xl text-blue-500"></i></div><h3 class="text-xl font-black text-slate-800 mb-2">Pratinjau Tidak Tersedia</h3><p class="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">Dokumen ini merupakan tautan eksternal yang memerlukan akses langsung ke situs penyedia.</p></div>`);
          }
          _push(`</div><div class="mt-8 flex flex-col sm:flex-row gap-4">`);
          if (((_q = data.value.subStandarLayanan) == null ? void 0 : _q.file_type) === "url") {
            _push(`<a${ssrRenderAttr("href", downloadActionUrl.value)} target="_blank" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl text-center shadow-xl shadow-blue-200 transition-all active:scale-95"> BUKA TAUTAN <i class="fas fa-external-link-alt ml-2"></i></a>`);
          } else {
            _push(`<a${ssrRenderAttr("href", downloadActionUrl.value)} target="_blank" download class="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 px-8 rounded-2xl text-center shadow-xl shadow-green-200 transition-all active:scale-95"> UNDUH DOKUMEN <i class="fas fa-download ml-2"></i></a>`);
          }
          _push(`</div><!--]-->`);
        } else {
          _push(`<div class="p-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] text-center"><i class="fas fa-file-excel text-4xl text-gray-300 mb-4"></i><p class="font-bold text-gray-400">Belum ada lampiran tersedia</p></div>`);
        }
        _push(`</div></div></div></div><aside class="hidden lg:block w-80 shrink-0"><div class="sticky top-24 space-y-6"><div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"><h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Metadata Dokumen</h3><div class="space-y-8"><div><div class="flex items-start gap-4"><div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0"><i class="fas fa-building text-blue-600 text-sm"></i></div><div class="min-w-0"><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Unit Kerja</p><p class="text-sm font-bold text-gray-800 leading-tight">${ssrInterpolate(((_t = (_s = (_r = data.value.subStandarLayanan) == null ? void 0 : _r.informasi) == null ? void 0 : _s.organization) == null ? void 0 : _t.name) || "PPID Kabupaten Sinjai")}</p></div></div></div><div><div class="flex items-start gap-4"><div class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0"><i class="fas fa-file-signature text-orange-600 text-sm"></i></div><div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Jenis Dokumen</p><p class="text-sm font-bold text-gray-800 leading-tight">${ssrInterpolate(((_u = data.value.subStandarLayanan) == null ? void 0 : _u.jenis_dokumen) || "Informasi Publik")}</p></div></div></div><div><div class="flex items-start gap-4"><div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0"><i class="fas fa-user-check text-emerald-600 text-sm"></i></div><div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pengunggah</p><p class="text-sm font-bold text-gray-800 leading-tight">${ssrInterpolate(((_x = (_w = (_v = data.value.subStandarLayanan) == null ? void 0 : _v.informasi) == null ? void 0 : _w.user) == null ? void 0 : _x.name) || "Admin PPID")}</p></div></div></div><div><div class="flex items-start gap-4"><div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0"><i class="fas fa-calendar-alt text-purple-600 text-sm"></i></div><div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tanggal</p><p class="text-sm font-bold text-gray-800 leading-tight">${ssrInterpolate(formatDate((_y = data.value.subStandarLayanan) == null ? void 0 : _y.tahun_dokumen))}</p></div></div></div><div class="pt-8 border-t border-gray-50"><div class="grid grid-cols-2 gap-4"><div class="bg-gray-50 rounded-2xl p-4 text-center"><p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Dilihat</p><p class="text-xl font-black text-slate-800">${ssrInterpolate(formatNumber((_z = data.value.subStandarLayanan) == null ? void 0 : _z.views_count))}</p></div><div class="bg-gray-50 rounded-2xl p-4 text-center"><p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Unduh</p><p class="text-xl font-black text-slate-800">${ssrInterpolate(formatNumber((_A = data.value.subStandarLayanan) == null ? void 0 : _A.download_count))}</p></div></div></div><button class="flex items-center justify-center w-full py-4 bg-slate-900 text-white font-bold rounded-2xl text-xs hover:bg-black transition-all"><i class="fas fa-arrow-left mr-2"></i> KEMBALI </button></div></div></div></aside></div></div>`);
      } else if (!unref(isLoading) && (!data.value || !data.value.subStandarLayanan)) {
        _push(`<div class="py-20 text-center"><i class="fas fa-exclamation-triangle text-4xl text-yellow-400 mb-4"></i><h2 class="text-2xl font-bold text-gray-800 mb-2">Dokumen Tidak Ditemukan</h2><p class="text-gray-500">Dokumen standar layanan yang Anda cari tidak tersedia atau telah dihapus.</p><button class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"> Kembali </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-transform active:scale-90 border-4 border-white" style="${ssrRenderStyle(!sideMenuOpen.value ? null : { display: "none" })}"><i class="fas fa-info-circle text-2xl"></i></button><div class="fixed inset-0 z-50 lg:hidden overflow-hidden" style="${ssrRenderStyle(sideMenuOpen.value ? null : { display: "none" })}"><div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" style="${ssrRenderStyle(sideMenuOpen.value ? null : { display: "none" })}"></div><div class="absolute inset-y-0 left-0 max-w-full w-[80%] max-w-xs bg-white shadow-2xl flex flex-col border-r border-gray-100" style="${ssrRenderStyle(sideMenuOpen.value ? null : { display: "none" })}"><div class="p-6 bg-slate-900 text-white flex items-center justify-between"><div><h2 class="text-lg font-black uppercase tracking-tighter">Widget Info</h2><p class="text-[10px] text-slate-400 font-bold">Detail Dokumen PPID</p></div><button aria-label="Tutup Menu" class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"><i class="fas fa-times text-white"></i></button></div><div class="flex-1 overflow-y-auto p-6 space-y-8"><div class="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"><div class="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100"><i class="fas fa-building text-sm"></i></div><div class="min-w-0"><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Unit Kerja</p><p class="text-sm font-bold text-slate-800 leading-tight break-words">${ssrInterpolate(((_D = (_C = (_B = data.value.subStandarLayanan) == null ? void 0 : _B.informasi) == null ? void 0 : _C.organization) == null ? void 0 : _D.name) || "PPID Kabupaten Sinjai")}</p></div></div><div class="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"><div class="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-100"><i class="fas fa-file-signature text-sm"></i></div><div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Jenis Dokumen</p><p class="text-sm font-bold text-slate-800 leading-tight">${ssrInterpolate(((_E = data.value.subStandarLayanan) == null ? void 0 : _E.jenis_dokumen) || "Informasi Publik")}</p></div></div><div class="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"><div class="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-100"><i class="fas fa-user-shield text-sm"></i></div><div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pengunggah</p><p class="text-sm font-bold text-slate-800 leading-tight">${ssrInterpolate(((_H = (_G = (_F = data.value.subStandarLayanan) == null ? void 0 : _F.informasi) == null ? void 0 : _G.user) == null ? void 0 : _H.name) || "Admin PPID")}</p></div></div><div class="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"><div class="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-100"><i class="fas fa-calendar-day text-sm"></i></div><div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tanggal</p><p class="text-sm font-bold text-slate-800 leading-tight">${ssrInterpolate(formatDate((_I = data.value.subStandarLayanan) == null ? void 0 : _I.tahun_dokumen))}</p></div></div><div class="grid grid-cols-2 gap-4"><div class="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100"><p class="text-[10px] font-black text-blue-400 uppercase mb-1">Dilihat</p><p class="text-xl font-black text-blue-700">${ssrInterpolate(formatNumber((_J = data.value.subStandarLayanan) == null ? void 0 : _J.views_count))}</p></div><div class="bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-100"><p class="text-[10px] font-black text-emerald-400 uppercase mb-1">Unduhan</p><p class="text-xl font-black text-emerald-700">${ssrInterpolate(formatNumber((_K = data.value.subStandarLayanan) == null ? void 0 : _K.download_count))}</p></div></div></div><div class="p-6 space-y-3"><button class="w-full py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] tracking-widest shadow-xl"> KEMBALI KE BACAAN </button></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/standar-layanan/file/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-NY55TafM.mjs.map
