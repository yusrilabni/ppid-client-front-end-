import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { computed, ref, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQuery } from '@tanstack/vue-query';
import { a as api } from './api-CX2AAiTN.mjs';
import { _ as _sfc_main$1 } from './Breadcrumbs-CqGmUqmz.mjs';
import { D as DipInformasiTable } from './DipInformasiTable-e2XUWsIB.mjs';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
import { a as useRoute, u as useRouter } from './server.mjs';
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
    const yearFromQuery = computed(() => route.query.year);
    const categories = {
      "Informasi Berkala": "1. Informasi Berkala",
      "Informasi Setiap Saat": "2. Informasi Tersedia Setiap Saat",
      "Informasi Serta Merta": "3. Informasi Serta Merta"
    };
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const fetchDip = async ({ queryKey }) => {
      const [_key, currentSlug, currentYearQuery] = queryKey;
      const params = currentYearQuery ? { year: currentYearQuery } : {};
      const res = await api.get(`/dipunit/dip/${currentSlug}`, { params });
      return res.data;
    };
    const { data: response, isLoading } = useQuery({
      queryKey: ["dipunit-detail", slug, yearFromQuery],
      queryFn: fetchDip,
      staleTime: 3e4,
      keepPreviousData: true
    });
    useGlobalLoader(isLoading);
    const data = computed(() => {
      var _a;
      return (_a = response.value) == null ? void 0 : _a.data;
    });
    const unitName = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.unitName) || "Memuat...";
    });
    const selectedYear = ref("");
    watch(data, (newData) => {
      if (newData && newData.year) {
        selectedYear.value = newData.year;
      }
    }, { immediate: true });
    const availableYears = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.availableYears) || [];
    });
    const informasiTahunIni = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.informasiTahunIni) || {};
    });
    const isInformasiEmpty = computed(() => {
      return Object.keys(informasiTahunIni.value).length === 0;
    });
    function getCharIndex(index) {
      return String.fromCharCode(97 + index);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 bg-gray-50 min-h-screen pb-24 lg:pb-8" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="mb-6">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        breadcrumbs: unref(getBreadcrumbs).dipUnitDetail(unitName.value)
      }, null, _parent));
      _push(`</div>`);
      if (!unref(isLoading) && data.value) {
        _push(`<div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8"><div class="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 md:p-10 text-white relative overflow-hidden"><div class="absolute top-0 right-0 p-10 opacity-10 transform translate-x-1/4 -translate-y-1/4"><i class="fas fa-building text-[120px]"></i></div><div class="relative z-10"><div class="flex flex-col md:flex-row md:items-end justify-between gap-6"><div><span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">Daftar Informasi Publik Unit</span><h1 class="text-3xl md:text-4xl font-extrabold leading-tight mb-2">${ssrInterpolate(unitName.value)}</h1><p class="text-blue-100 text-lg md:text-xl font-medium opacity-90">Tahun Anggaran ${ssrInterpolate(selectedYear.value)}</p></div><div class="flex flex-col md:flex-row gap-4 items-center"><div class="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 order-1 md:order-2"><div class="flex flex-col gap-2"><label for="year" class="text-xs font-bold uppercase tracking-widest text-blue-100">Pilih Tahun DIP</label><div class="relative"><select id="year" class="appearance-none w-full md:w-40 bg-white text-gray-900 px-4 py-2.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 border-none shadow-sm cursor-pointer pr-10"><!--[-->`);
        ssrRenderList(availableYears.value, (availYear) => {
          _push(`<option${ssrRenderAttr("value", availYear)}${ssrIncludeBooleanAttr(Array.isArray(selectedYear.value) ? ssrLooseContain(selectedYear.value, availYear) : ssrLooseEqual(selectedYear.value, availYear)) ? " selected" : ""}>${ssrInterpolate(availYear)}</option>`);
        });
        _push(`<!--]--></select><div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-blue-600"><i class="fas fa-chevron-down"></i></div></div></div></div></div></div></div></div><div class="p-6 md:p-10">`);
        if (isInformasiEmpty.value) {
          _push(`<div class="text-center py-16"><div class="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-exclamation-triangle text-orange-400 text-3xl"></i></div><h3 class="text-xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h3><p class="text-gray-500">Belum ada Daftar Informasi Publik (DIP) untuk tahun ${ssrInterpolate(selectedYear.value)} pada OPD ini.</p>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/dipunit",
            class: "inline-flex items-center mt-6 text-blue-600 font-bold hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="fas fa-arrow-left mr-2"${_scopeId}></i> Kembali ke Daftar Unit `);
              } else {
                return [
                  createVNode("i", { class: "fas fa-arrow-left mr-2" }),
                  createTextVNode(" Kembali ke Daftar Unit ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="space-y-12"><!--[-->`);
          ssrRenderList(categories, (label, key) => {
            _push(`<!--[-->`);
            if (informasiTahunIni.value[key]) {
              _push(`<div class="relative"><div class="flex items-center gap-4 mb-8"><div class="h-10 w-1.5 bg-blue-600 rounded-full"></div><h3 class="text-2xl font-black text-gray-800 uppercase tracking-tight">${ssrInterpolate(label)}</h3></div><div class="space-y-10 pl-2"><!--[-->`);
              ssrRenderList(informasiTahunIni.value[key], (groupedByUnit, jenisDokumen, jenisIndex) => {
                _push(`<div class="bg-gray-50/50 rounded-3xl p-6 md:p-8 border border-gray-100"><h4 class="text-lg font-bold text-indigo-700 mb-6 flex items-start"><span class="bg-indigo-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black mr-4 flex-shrink-0 shadow-md shadow-indigo-100">${ssrInterpolate(getCharIndex(jenisIndex))}</span><span class="pt-0.5">${ssrInterpolate(jenisDokumen || "Dokumen Lainnya")}</span></h4><div class="space-y-8"><!--[-->`);
                ssrRenderList(groupedByUnit, (informasiList, originUnitName) => {
                  _push(`<div class="relative"><div class="flex items-center mb-4 gap-3"><div class="h-px flex-grow bg-gray-200"></div><span class="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest shadow-sm"><i class="fas fa-university mr-2 text-indigo-400"></i> Unit: ${ssrInterpolate(originUnitName)}</span><div class="h-px flex-grow bg-gray-200"></div></div><div class="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">`);
                  _push(ssrRenderComponent(DipInformasiTable, {
                    informasiList,
                    unitMap: data.value.unitMap
                  }, null, _parent));
                  _push(`</div></div>`);
                });
                _push(`<!--]--></div></div>`);
              });
              _push(`<!--]--></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm px-4"><p><i class="fas fa-info-circle mr-2"></i> Data diperbarui secara otomatis oleh sistem PPID.</p><p>\xA9 ${ssrInterpolate(unref(currentYear))} PPID Kabupaten Sinjai</p></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dipunit/dip/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-Cdk3Lks1.mjs.map
