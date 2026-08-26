import { ref, watch, nextTick, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQuery } from '@tanstack/vue-query';
import { a as api } from './api-k33KGvo_.mjs';
import { _ as _sfc_main$2 } from './Breadcrumbs-CqGmUqmz.mjs';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
import { a as useRoute } from './server.mjs';
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

const _sfc_main$1 = {
  __name: "PbjQuestionItem",
  __ssrInlineRender: true,
  props: {
    question: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    level: {
      type: Number,
      default: 1
    }
  },
  setup(__props) {
    const formatIndex = (idx, lvl) => {
      if (lvl === 1) {
        return String.fromCharCode(97 + idx) + ".";
      } else {
        return idx + 1 + ").";
      }
    };
    const hasLink = (question) => {
      var _a, _b, _c, _d, _e;
      return !!(((_b = (_a = question.answer) == null ? void 0 : _a.informasi) == null ? void 0 : _b.slug) || ((_c = question.answer) == null ? void 0 : _c.document_url) || ((_e = (_d = question.answer) == null ? void 0 : _d.informasi) == null ? void 0 : _e.url));
    };
    const getLink = (question) => {
      var _a, _b, _c, _d, _e;
      if ((_b = (_a = question.answer) == null ? void 0 : _a.informasi) == null ? void 0 : _b.slug) {
        return `/informasi/${question.answer.informasi.slug}`;
      }
      if ((_c = question.answer) == null ? void 0 : _c.document_url) {
        return question.answer.document_url;
      }
      if ((_e = (_d = question.answer) == null ? void 0 : _d.informasi) == null ? void 0 : _e.url) {
        return question.answer.informasi.url;
      }
      return "#";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PbjQuestionItem = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["border-l-2 md:border-l-4 border-gray-100 pl-4 md:pl-8 py-3 mt-4 transition-all hover:border-blue-100", __props.level > 1 ? "ml-2 md:ml-8" : ""]
      }, _attrs))}><div class="flex items-start"><span class="text-sm md:text-base font-bold text-gray-400 mr-2 md:mr-3 mt-0.5">${ssrInterpolate(formatIndex(__props.index, __props.level))}</span>`);
      if (hasLink(__props.question)) {
        _push(`<a${ssrRenderAttr("href", getLink(__props.question))} class="text-sm md:text-base font-bold text-blue-600 hover:text-blue-800 leading-snug flex-1 transition-colors">${ssrInterpolate(__props.question.question)} <i class="fas fa-external-link-alt ml-2 text-[10px] opacity-50"></i></a>`);
      } else {
        _push(`<p class="text-sm md:text-base font-medium text-gray-700 leading-snug flex-1">${ssrInterpolate(__props.question.question)}</p>`);
      }
      _push(`</div>`);
      if (__props.question.children && __props.question.children.length > 0) {
        _push(`<div class="mt-2"><!--[-->`);
        ssrRenderList(__props.question.children, (child, childIndex) => {
          _push(ssrRenderComponent(_component_PbjQuestionItem, {
            key: child.id,
            question: child,
            index: childIndex,
            level: __props.level + 1
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PbjQuestionItem.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "[year]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const showModal = ref(false);
    const hasReadPanduan = ref(false);
    const scrollProgress = ref(0);
    const modalBody = ref(null);
    const updateProgress = () => {
      if (!modalBody.value) return;
      const el = modalBody.value;
      const scrolled = el.scrollTop;
      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight <= 10) {
        scrollProgress.value = 100;
      } else {
        scrollProgress.value = Math.round(scrolled / totalHeight * 100);
      }
      if (scrollProgress.value >= 95) {
        hasReadPanduan.value = true;
      }
    };
    watch(showModal, async (isOpen) => {
      if (isOpen) {
        await nextTick();
        if (modalBody.value) {
          modalBody.value.scrollTop = 0;
          updateProgress();
        }
      }
    });
    const { data: pbjResponse, isLoading } = useQuery({
      queryKey: computed(() => ["pbj", route.params.year]),
      queryFn: async () => {
        const res = await api.get("/pbj", { params: { year: route.params.year } });
        return res.data;
      },
      enabled: computed(() => !!route.params.year)
    });
    useGlobalLoader(isLoading);
    const questions = computed(() => {
      var _a, _b;
      return ((_b = (_a = pbjResponse.value) == null ? void 0 : _a.data) == null ? void 0 : _b.questions) || [];
    });
    const hasLink = (question) => {
      var _a, _b, _c, _d, _e;
      return !!(((_b = (_a = question.answer) == null ? void 0 : _a.informasi) == null ? void 0 : _b.slug) || ((_c = question.answer) == null ? void 0 : _c.document_url) || ((_e = (_d = question.answer) == null ? void 0 : _d.informasi) == null ? void 0 : _e.url));
    };
    const getLink = (question) => {
      var _a, _b, _c, _d, _e;
      if ((_b = (_a = question.answer) == null ? void 0 : _a.informasi) == null ? void 0 : _b.slug) {
        return `/informasi/${question.answer.informasi.slug}`;
      }
      if ((_c = question.answer) == null ? void 0 : _c.document_url) {
        return question.answer.document_url;
      }
      if ((_e = (_d = question.answer) == null ? void 0 : _d.informasi) == null ? void 0 : _e.url) {
        return question.answer.informasi.url;
      }
      return "#";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto py-6 md:py-8 px-4" }, _attrs))}><div class="max-w-7xl mx-auto"><div class="mb-6">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).pbjDetail(unref(route).params.year)
      }, null, _parent));
      _push(`</div><div class="bg-white rounded-2xl shadow-xl border border-gray-100"><div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8 text-white relative"><div class="flex flex-col md:flex-row md:items-center justify-between gap-6"><div><h1 class="text-2xl md:text-3xl font-extrabold leading-tight">Kuesioner PBJ ${ssrInterpolate(unref(route).params.year)}</h1><p class="text-blue-100 mt-2 text-sm opacity-90">Daftar kelengkapan dokumen pengadaan barang dan jasa.</p></div><button type="button" class="inline-flex items-center justify-center px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white rounded-xl transition-all font-bold text-sm"><i class="fas fa-book-reader mr-2"></i> Panduan Upload </button></div></div><div class="fixed inset-0 z-[100] bg-slate-900/90 flex items-center justify-center p-2 md:p-6 text-left" style="${ssrRenderStyle(showModal.value ? null : { display: "none" })}"><div class="bg-white w-full max-w-5xl max-h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 font-sans relative"><div class="bg-gradient-to-r from-blue-800 to-indigo-900 px-6 py-5 flex-shrink-0 border-b border-white/10 relative overflow-hidden"><div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div><div class="flex items-center justify-between relative z-10"><div class="flex items-center gap-4"><div class="bg-white/10 p-2.5 rounded-xl text-white"><i class="fas fa-file-contract text-xl"></i></div><div><h3 class="text-xl md:text-2xl font-black text-white leading-none uppercase tracking-tight">Panduan Klasifikasi PBJ</h3><p class="text-blue-200 text-[10px] md:text-xs mt-1 font-medium">Informasi standar pelayanan dan publikasi dokumen</p></div></div><button class="text-white/60 hover:text-white transition-all p-2 rounded-xl hover:bg-white/10"><i class="fas fa-times text-2xl"></i></button></div></div><div class="w-full h-1 bg-slate-100 flex-shrink-0"><div class="h-full bg-blue-500 transition-all duration-300 shadow-sm" style="${ssrRenderStyle({ width: `${scrollProgress.value}%` })}"></div></div><div class="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50"><div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"><div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><h4 class="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2"><i class="fas fa-lightbulb text-yellow-400"></i> PRINSIP UTAMA </h4><ul class="space-y-3 text-xs text-slate-700 font-medium"><li class="flex items-start gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors"><i class="fas fa-check-circle text-blue-500 mt-0.5"></i><span>Klasifikasi ditentukan oleh <span class="text-blue-600 font-bold">jenis dokumen</span>, bukan tahun anggaran.</span></li><li class="flex items-start gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors"><i class="fas fa-check-circle text-blue-500 mt-0.5"></i><span><span class="font-bold text-blue-700">Info Berkala</span> tidak pernah berubah menjadi <span class="font-bold text-green-700">Setiap Saat</span>.</span></li><li class="flex items-start gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors"><i class="fas fa-check-circle text-blue-500 mt-0.5"></i><span>Dokumen lama <span class="text-red-600 font-bold">dilarang dihapus</span>, hanya boleh diarsipkan.</span></li></ul></div><div class="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden"><div class="absolute -right-4 -bottom-4 text-red-200/30 rotate-12"><i class="fas fa-exclamation-triangle fa-5x"></i></div><h4 class="text-sm font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2"><i class="fas fa-ban"></i> KESALAHAN FATAL </h4><ul class="space-y-2 text-[11px] text-red-700 font-bold"><li class="flex items-center gap-2"><i class="fas fa-times-circle"></i> Salah masuk menu kategori upload</li><li class="flex items-center gap-2"><i class="fas fa-times-circle"></i> Mengubah klasifikasi tanpa dasar hukum</li><li class="flex items-center gap-2"><i class="fas fa-times-circle"></i> Mengunggah file PDF yang korup/tidak terbaca</li></ul></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="flex flex-col"><div class="flex items-center gap-3 mb-4"><div class="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md"><i class="fas fa-calendar-alt text-sm"></i></div><h4 class="font-black text-slate-800 text-sm uppercase tracking-tight">A. INFORMASI BERKALA</h4></div><div class="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex-1"><p class="text-[10px] font-bold text-blue-600 mb-3 uppercase tracking-widest border-b pb-2 italic">Diumumkan rutin (Menu Berkala)</p><ul class="space-y-2 text-xs text-slate-700"><li class="flex items-center gap-3"><i class="fas fa-caret-right text-blue-400"></i> Rencana Umum Pengadaan (RUP)</li><li class="flex items-center gap-3"><i class="fas fa-caret-right text-blue-400"></i> Link Aplikasi SIRUP LKPP</li><li class="flex items-center gap-3"><i class="fas fa-caret-right text-blue-400"></i> Rekap RUP Tahunan / Semesteran</li><li class="flex items-center gap-3"><i class="fas fa-caret-right text-blue-400"></i> Pengumuman / Rekap Paket PBJ</li></ul></div></div><div class="flex flex-col"><div class="flex items-center gap-3 mb-4"><div class="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center shadow-md"><i class="fas fa-clock text-sm"></i></div><h4 class="font-black text-slate-800 text-sm uppercase tracking-tight">B. INFORMASI SETIAP SAAT</h4></div><div class="bg-white p-5 rounded-2xl border border-green-100 shadow-sm flex-1"><p class="text-[10px] font-bold text-green-600 mb-3 uppercase tracking-widest border-b pb-2 italic">Via Permohonan (Menu Setiap Saat)</p><ul class="space-y-2 text-xs text-slate-700"><li class="flex items-center gap-3"><i class="fas fa-caret-right text-green-400"></i> KAK, HPS, Kontrak, &amp; Addendum</li><li class="flex items-center gap-3"><i class="fas fa-caret-right text-green-400"></i> Dokumen Pemilihan &amp; Kualifikasi</li><li class="flex items-center gap-3"><i class="fas fa-caret-right text-green-400"></i> SPPBJ, SPMK, SPM, SP2D Lengkap</li><li class="flex items-center gap-3"><i class="fas fa-caret-right text-green-400"></i> Laporan Akhir, BAPH, &amp; Jaminan</li></ul></div></div></div><div class="mt-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl"><div class="flex items-start gap-4"><span class="text-xl">\u{1F4DD}</span><div><h5 class="text-xs font-black text-blue-900 uppercase mb-1">Catatan Penting: Sinkronisasi DIP</h5><p class="text-[11px] text-blue-800 leading-relaxed italic"> Pastikan setiap dokumen yang diinput di sini juga tercatat judulnya dalam <strong>Daftar Informasi Publik (DIP)</strong> yang diunggah di menu berkala, guna memudahkan warga mencari referensi dokumen sebelum mengajukan permohonan. </p></div></div></div><div class="mt-12 flex flex-col items-center animate-bounce text-slate-300" style="${ssrRenderStyle(!hasReadPanduan.value ? null : { display: "none" })}"><p class="text-[9px] font-black uppercase tracking-[0.3em] mb-1">Scroll Hingga Bawah</p><i class="fas fa-chevron-down text-lg"></i></div><div class="h-10"></div></div><div class="bg-white p-5 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between flex-shrink-0 relative z-[110]"><div class="flex items-center gap-3"><div class="p-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs"><i class="fas fa-balance-scale"></i></div><div class="flex flex-col"><span class="text-slate-400 text-[10px] font-bold tracking-widest uppercase leading-tight">Standar Kepatuhan</span><span class="text-slate-600 text-[10px] font-medium leading-tight">UU No. 14 Tahun 2008 &amp; Perki 1/2021</span></div></div><div class="flex gap-3 w-full md:w-auto"><button class="flex-1 md:flex-none px-12 py-3 bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-700/20 disabled:opacity-30 text-xs transition-all uppercase tracking-widest"${ssrIncludeBooleanAttr(!hasReadPanduan.value) ? " disabled" : ""}><span>${ssrInterpolate(hasReadPanduan.value ? "SAYA MENGERTI & TUTUP" : `BACA DAHULU (${scrollProgress.value}%)`)}</span></button></div></div></div></div><div class="p-4 md:p-8 relative z-10">`);
      if (unref(isLoading)) {
        _push(`<div class="space-y-6 md:space-y-8"><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div class="p-5 md:p-8 border border-gray-100 rounded-2xl shadow-sm bg-gray-50 animate-pulse h-24"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (questions.value.length > 0) {
        _push(`<div class="space-y-6 md:space-y-8"><!--[-->`);
        ssrRenderList(questions.value, (question, index) => {
          _push(`<div class="p-5 md:p-8 border border-gray-100 rounded-2xl shadow-sm bg-white hover:border-blue-100 transition-colors"><div class="flex items-start"><span class="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center font-bold text-sm md:text-lg mr-4">${ssrInterpolate(index + 1)}</span><div class="flex-1 pt-1">`);
          if (hasLink(question)) {
            _push(`<a${ssrRenderAttr("href", getLink(question))} class="text-base md:text-xl font-bold text-blue-600 hover:text-blue-800 leading-tight block">${ssrInterpolate(question.question)} <i class="fas fa-external-link-alt ml-2 text-xs opacity-50"></i></a>`);
          } else {
            _push(`<h3 class="text-base md:text-xl font-bold text-gray-800 leading-tight">${ssrInterpolate(question.question)}</h3>`);
          }
          _push(`</div></div>`);
          if (question.children && question.children.length > 0) {
            _push(`<div class="mt-6"><!--[-->`);
            ssrRenderList(question.children, (child, childIndex) => {
              _push(ssrRenderComponent(_sfc_main$1, {
                key: child.id,
                question: child,
                index: childIndex,
                level: 1
              }, null, _parent));
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200"><p class="text-gray-500 font-medium">Data kuesioner belum tersedia.</p></div>`);
      }
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pbj/[year].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_year_-DhemQmCh.mjs.map
