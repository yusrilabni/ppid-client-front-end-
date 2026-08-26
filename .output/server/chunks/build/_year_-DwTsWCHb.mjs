import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
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
  __name: "[[year]]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const yearParam = computed(() => route.params.year);
    const categories = {
      "Informasi Berkala": "1. Informasi Berkala",
      "Informasi Setiap Saat": "2. Informasi Tersedia Setiap Saat",
      "Informasi Serta Merta": "3. Informasi Serta Merta"
    };
    const showNotification = ref(true);
    const fadeOutNotification = ref(false);
    const fetchDip = async ({ queryKey }) => {
      const [_key, year2] = queryKey;
      if (!year2) {
        const res2 = await api.get("/dip");
        if (res2.data.success && res2.data.data.latestYear) {
          router.replace({ name: "dip", params: { year: res2.data.data.latestYear } });
          throw new Error("Redirecting to latest year");
        }
        throw new Error("No data");
      }
      const res = await api.get(`/dip/${year2}`);
      return res.data;
    };
    const { data: response, isLoading, isError } = useQuery({
      queryKey: ["dip-global", yearParam],
      queryFn: fetchDip,
      staleTime: 3e4,
      keepPreviousData: true,
      retry: false
    });
    useGlobalLoader(isLoading);
    const data = computed(() => {
      var _a;
      return (_a = response.value) == null ? void 0 : _a.data;
    });
    const year = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.year) || yearParam.value;
    });
    function getCharIndex(index) {
      return String.fromCharCode(97 + index);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 bg-gray-50 min-h-screen" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="mb-4">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        breadcrumbs: unref(getBreadcrumbs).dip(yearParam.value)
      }, null, _parent));
      _push(`</div>`);
      if (!unref(isLoading) && data.value) {
        _push(`<div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"><div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left"><div><h1 class="text-2xl md:text-3xl font-bold">Daftar Informasi Publik (DIP)</h1><p class="text-blue-100 mt-1 text-lg md:text-xl font-medium">Tahun ${ssrInterpolate(year.value)}</p></div></div><div class="p-4 md:p-8">`);
        if (showNotification.value) {
          _push(`<div class="${ssrRenderClass([{ "opacity-0": fadeOutNotification.value }, "mb-8 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm transition-opacity duration-500"])}"><p class="text-green-800 text-sm md:text-base leading-relaxed"><i class="fas fa-check-circle mr-2 text-green-500"></i> Daftar Informasi Publik (DIP) Tahun ${ssrInterpolate(year.value)} ini telah ditetapkan dan disusun secara otomatis berdasarkan metadata informasi yang tersedia di sistem. </p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-10"><!--[-->`);
        ssrRenderList(categories, (label, key) => {
          _push(`<!--[-->`);
          if (data.value.informasiTahunIni && data.value.informasiTahunIni[key]) {
            _push(`<div class="border-l-4 border-blue-500 pl-4 md:pl-6 py-1"><h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-6">${ssrInterpolate(label)}</h3><div class="space-y-8"><!--[-->`);
            ssrRenderList(data.value.informasiTahunIni[key], (informasiList, jenisDokumen, index) => {
              _push(`<div class="relative"><h4 class="text-base md:text-lg font-bold text-blue-700 mb-4 flex items-start"><span class="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">${ssrInterpolate(getCharIndex(index))}</span> ${ssrInterpolate(jenisDokumen || "Lainnya")}</h4><div class="md:pl-9">`);
              _push(ssrRenderComponent(DipInformasiTable, {
                informasiList,
                unitMap: data.value.unitMap
              }, null, _parent));
              _push(`</div></div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div></div></div>`);
      } else if (!unref(isLoading) && !data.value) {
        _push(`<div class="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100"><div class="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-exclamation-triangle text-orange-400 text-3xl"></i></div><h3 class="text-xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h3><p class="text-gray-500">Daftar Informasi Publik untuk tahun tersebut tidak ditemukan.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "inline-flex items-center mt-6 text-blue-600 font-bold hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fas fa-arrow-left mr-2"${_scopeId}></i> Kembali ke Beranda `);
            } else {
              return [
                createVNode("i", { class: "fas fa-arrow-left mr-2" }),
                createTextVNode(" Kembali ke Beranda ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dip/[[year]].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_year_-DwTsWCHb.mjs.map
