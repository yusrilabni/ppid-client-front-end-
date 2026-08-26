import { reactive, ref, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQuery } from '@tanstack/vue-query';
import { a as api } from './api-k33KGvo_.mjs';
import { _ as _sfc_main$2 } from './Breadcrumbs-CqGmUqmz.mjs';
import { C as CustomInput } from './CustomInput-Dh4cWjwV.mjs';
import { C as CustomSelect } from './CustomSelect-YbAR9Oty.mjs';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "LhkpnCard",
  __ssrInlineRender: true,
  props: {
    item: {
      type: Object,
      required: true
    },
    yearFilter: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const getLhkpnUrl = (lhkpn2) => {
      return `${(void 0).replace("/api/v1", "")}/lhkpn/view/${lhkpn2.id}`;
    };
    const filteredLhkpns = computed(() => {
      if (!props.yearFilter) {
        return props.item.lhkpns;
      }
      return props.item.lhkpns.filter((l) => String(l.report_year) === String(props.yearFilter));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 group" }, _attrs))}><div class="p-8 pb-4 flex flex-col items-center text-center"><div class="relative mb-6"><div class="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>`);
      if (__props.item.photo) {
        _push(`<img class="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl relative z-10"${ssrRenderAttr("src", __props.item.photo)}${ssrRenderAttr("alt", __props.item.full_name)}>`);
      } else {
        _push(`<div class="w-28 h-28 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-white shadow-xl flex items-center justify-center text-gray-300 text-4xl relative z-10"><i class="${ssrRenderClass(__props.item.type === "unit" ? "fas fa-building" : "fas fa-user")}"></i></div>`);
      }
      _push(`</div><h3 class="font-black text-gray-900 text-xl leading-tight mb-2 group-hover:text-blue-600 transition-colors">${ssrInterpolate(__props.item.display_title)}</h3><div class="inline-flex items-center px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-tighter border border-gray-100 mb-4"><i class="fas fa-landmark mr-1.5 text-blue-400"></i> ${ssrInterpolate(__props.item.organization_name)}</div></div><div class="px-6 pb-8 pt-2 mt-auto"><div class="space-y-3"><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center border-b border-gray-50 pb-2 mb-4">Daftar Laporan Tersedia</p>`);
      if (filteredLhkpns.value.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(filteredLhkpns.value, (lhkpn2) => {
          _push(`<a${ssrRenderAttr("href", getLhkpnUrl(lhkpn2))} target="_blank" class="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white px-4 py-3 rounded-2xl transition-all duration-300 border border-blue-100 hover:border-blue-600 group/link"><div class="flex items-center"><i class="fas fa-file-pdf mr-3 text-blue-500 group-hover/link:text-white transition-colors"></i><span class="font-bold text-sm">TAHUN ${ssrInterpolate(lhkpn2.report_year)}</span></div><div class="flex flex-col items-end">`);
          if (lhkpn2.full_name) {
            _push(`<span class="text-[9px] font-medium opacity-70 group-hover/link:text-white line-clamp-1 max-w-[120px]">${ssrInterpolate(lhkpn2.full_name)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<i class="fas fa-external-link-alt text-[10px] opacity-30 group-hover/link:opacity-100"></i></div></a>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<div class="w-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 py-6 rounded-2xl border-2 border-dashed border-gray-100"><i class="fas fa-folder-open mb-2 text-xl opacity-20"></i><span class="font-bold tracking-wide uppercase text-[10px]">Laporan Belum Tersedia</span></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LhkpnCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "lhkpn",
  __ssrInlineRender: true,
  setup(__props) {
    const debounce = (fn, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    };
    const filters = reactive({
      search: "",
      year: ""
    });
    const debouncedSearch = ref("");
    const handleSearch = debounce((val) => {
      debouncedSearch.value = val;
    }, 500);
    watch(() => filters.search, (newVal) => {
      handleSearch(newVal);
    });
    const { data: response, isLoading } = useQuery({
      queryKey: computed(() => ["lhkpn", debouncedSearch.value, filters.year]),
      queryFn: async () => {
        const res = await api.get("/lhkpn", { params: { search: debouncedSearch.value, year: filters.year } });
        return res.data;
      }
    });
    useGlobalLoader(isLoading);
    const items = computed(() => {
      var _a, _b;
      return ((_b = (_a = response.value) == null ? void 0 : _a.data) == null ? void 0 : _b.items) || [];
    });
    const availableYears = computed(() => {
      var _a, _b, _c;
      return ((_c = (_b = (_a = response.value) == null ? void 0 : _a.data) == null ? void 0 : _b.stats) == null ? void 0 : _c.available_years) || [];
    });
    const yearOptions = computed(() => {
      const opts = availableYears.value.map((y) => ({ value: String(y), label: `Tahun ${y}` }));
      opts.unshift({ value: "", label: "Semua Tahun" });
      return opts;
    });
    const pimpinan = computed(() => items.value.filter((i) => i.group === "pimpinan"));
    const eselon2 = computed(() => items.value.filter((i) => i.group === "eselon2"));
    const eselon3 = computed(() => items.value.filter((i) => i.group === "eselon3"));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-50 min-h-screen pb-12" }, _attrs))} data-v-c70075c7><div class="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white pt-12 pb-20 relative overflow-hidden" data-v-c70075c7><div class="absolute inset-0 opacity-10" data-v-c70075c7><svg class="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor" data-v-c70075c7><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse" data-v-c70075c7><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" data-v-c70075c7></path></pattern><rect width="100" height="100" fill="url(#grid)" data-v-c70075c7></rect></svg></div><div class="container mx-auto px-6 relative z-10" data-v-c70075c7><div class="mb-6 lhkpn-breadcrumbs" data-v-c70075c7>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).lhkpn()
      }, null, _parent));
      _push(`</div><div class="mt-8" data-v-c70075c7><h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white" data-v-c70075c7>Laporan Harta Kekayaan (LHKPN)</h1><p class="text-blue-100 text-lg max-w-2xl leading-relaxed" data-v-c70075c7> Transparansi Harta Kekayaan Penyelenggara Negara di Lingkungan Pemerintah Kabupaten Sinjai. </p></div></div></div><div class="container mx-auto px-6 -mt-8 relative z-20" data-v-c70075c7><div class="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 mb-12 flex flex-col md:flex-row gap-4 border border-gray-100" data-v-c70075c7><div class="flex-1 relative" style="${ssrRenderStyle({ "z-index": "100" })}" data-v-c70075c7><label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-4" data-v-c70075c7>Cari Pejabat / Jabatan</label><div class="bg-gray-50/50 rounded-2xl" data-v-c70075c7>`);
      _push(ssrRenderComponent(CustomInput, {
        modelValue: filters.search,
        "onUpdate:modelValue": ($event) => filters.search = $event,
        placeholder: "Ketik nama atau jabatan...",
        icon: "fas fa-search"
      }, null, _parent));
      _push(`</div></div><div class="min-w-[200px] relative" style="${ssrRenderStyle({ "z-index": "90" })}" data-v-c70075c7><label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-4" data-v-c70075c7>Tahun Laporan</label><div class="bg-gray-50/50 rounded-2xl" data-v-c70075c7>`);
      _push(ssrRenderComponent(CustomSelect, {
        modelValue: filters.year,
        "onUpdate:modelValue": ($event) => filters.year = $event,
        options: yearOptions.value,
        searchable: false,
        placeholder: "Semua Tahun"
      }, null, _parent));
      _push(`</div></div></div>`);
      if (unref(isLoading)) {
        _push(`<div class="space-y-12" data-v-c70075c7><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="animate-pulse" data-v-c70075c7><div class="h-8 bg-gray-200 rounded w-1/4 mb-6" data-v-c70075c7></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-v-c70075c7><!--[-->`);
          ssrRenderList(3, (j) => {
            _push(`<div class="bg-white rounded-3xl h-64 border border-gray-100" data-v-c70075c7></div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (items.value.length > 0) {
        _push(`<div class="space-y-16" data-v-c70075c7>`);
        if (pimpinan.value.length > 0) {
          _push(`<section data-v-c70075c7><div class="flex items-center justify-between mb-8" data-v-c70075c7><div class="flex items-center" data-v-c70075c7><div class="w-12 h-12 bg-blue-600 rounded-2xl shadow-lg flex items-center justify-center text-white mr-4" data-v-c70075c7><i class="fas fa-crown text-xl" data-v-c70075c7></i></div><div data-v-c70075c7><h2 class="text-2xl font-black text-gray-900" data-v-c70075c7>LHKPN Pimpinan</h2><p class="text-gray-500 text-sm" data-v-c70075c7>Bupati, Wakil Bupati, dan Sekretaris Daerah</p></div></div><div class="h-px flex-1 bg-gray-200 mx-8 hidden lg:block" data-v-c70075c7></div><span class="px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-full border border-blue-100" data-v-c70075c7>${ssrInterpolate(pimpinan.value.length)} Jabatan </span></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-v-c70075c7><!--[-->`);
          ssrRenderList(pimpinan.value, (item) => {
            _push(ssrRenderComponent(_sfc_main$1, {
              key: item.display_title,
              item,
              "year-filter": filters.year
            }, null, _parent));
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (eselon2.value.length > 0) {
          _push(`<section data-v-c70075c7><div class="flex items-center justify-between mb-8" data-v-c70075c7><div class="flex items-center" data-v-c70075c7><div class="w-12 h-12 bg-green-600 rounded-2xl shadow-lg flex items-center justify-center text-white mr-4" data-v-c70075c7><i class="fas fa-building text-xl" data-v-c70075c7></i></div><div data-v-c70075c7><h2 class="text-2xl font-black text-gray-900" data-v-c70075c7>LHKPN Eselon II</h2><p class="text-gray-500 text-sm" data-v-c70075c7>Asisten, Staf Ahli, dan Pejabat Daerah</p></div></div><div class="h-px flex-1 bg-gray-200 mx-8 hidden lg:block" data-v-c70075c7></div><span class="px-4 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-100" data-v-c70075c7>${ssrInterpolate(eselon2.value.length)} Jabatan </span></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-v-c70075c7><!--[-->`);
          ssrRenderList(eselon2.value, (item) => {
            _push(ssrRenderComponent(_sfc_main$1, {
              key: item.display_title,
              item,
              "year-filter": filters.year
            }, null, _parent));
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (eselon3.value.length > 0) {
          _push(`<section data-v-c70075c7><div class="flex items-center justify-between mb-8" data-v-c70075c7><div class="flex items-center" data-v-c70075c7><div class="w-12 h-12 bg-amber-500 rounded-2xl shadow-lg flex items-center justify-center text-white mr-4" data-v-c70075c7><i class="fas fa-map-marked-alt text-xl" data-v-c70075c7></i></div><div data-v-c70075c7><h2 class="text-2xl font-black text-gray-900" data-v-c70075c7>LHKPN Eselon III</h2><p class="text-gray-500 text-sm" data-v-c70075c7>Para Camat Se-Kabupaten Sinjai</p></div></div><div class="h-px flex-1 bg-gray-200 mx-8 hidden lg:block" data-v-c70075c7></div><span class="px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-bold rounded-full border border-amber-100" data-v-c70075c7>${ssrInterpolate(eselon3.value.length)} Jabatan </span></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-v-c70075c7><!--[-->`);
          ssrRenderList(eselon3.value, (item) => {
            _push(ssrRenderComponent(_sfc_main$1, {
              key: item.display_title,
              item,
              "year-filter": filters.year
            }, null, _parent));
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100" data-v-c70075c7><div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-3xl" data-v-c70075c7><i class="fas fa-search-minus" data-v-c70075c7></i></div><h3 class="text-xl font-bold text-gray-800 mb-2" data-v-c70075c7>Data Tidak Ditemukan</h3><p class="text-gray-500" data-v-c70075c7>Silakan ubah kata kunci pencarian Anda.</p></div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lhkpn.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const lhkpn = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c70075c7"]]);

export { lhkpn as default };
//# sourceMappingURL=lhkpn-Dltjq9oz.mjs.map
