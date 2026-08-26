import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQuery } from '@tanstack/vue-query';
import { a as api } from './api-k33KGvo_.mjs';
import { _ as _sfc_main$1 } from './Breadcrumbs-CqGmUqmz.mjs';
import { C as CustomSelect } from './CustomSelect-YbAR9Oty.mjs';
import { _ as _sfc_main$2 } from './CustomDate-uaTKdXDJ.mjs';
import { C as CustomInput } from './CustomInput-Dh4cWjwV.mjs';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
import { u as useAuthStore } from './auth-Cu84b-L0.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'axios';
import './loading-DMBVy40S.mjs';

const _sfc_main = {
  __name: "permohonan",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const currentPage = ref(1);
    const sortOptions = [
      { value: "created_at_desc", label: "Terbaru" },
      { value: "created_at_asc", label: "Terlama" },
      { value: "nama_pemohon_asc", label: "Pemohon (A-Z)" },
      { value: "nama_pemohon_desc", label: "Pemohon (Z-A)" }
    ];
    const perPageOptions = [
      { value: "10", label: "10" },
      { value: "20", label: "20" },
      { value: "50", label: "50" }
    ];
    const filters = ref({
      search: "",
      date_from: "",
      date_to: "",
      sort: "created_at_desc",
      per_page: "10"
    });
    const queryParams = computed(() => {
      return {
        page: currentPage.value,
        search: filters.value.search,
        date_from: filters.value.date_from,
        date_to: filters.value.date_to,
        sort: filters.value.sort,
        per_page: filters.value.per_page
      };
    });
    const fetchPermohonan = async ({ queryKey }) => {
      const [_key, params] = queryKey;
      const res = await api.get("/laporan-permohonan", { params });
      return res.data.data;
    };
    const { data, isLoading, refetch } = useQuery({
      queryKey: ["laporan-permohonan", queryParams],
      queryFn: fetchPermohonan,
      keepPreviousData: true
    });
    useGlobalLoader(isLoading);
    const paginationPages = computed(() => {
      if (!data.value) return [];
      const current = data.value.current_page;
      const last = data.value.last_page;
      const delta = 2;
      const range = [];
      for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
        range.push(i);
      }
      return range;
    });
    const formatName = (item) => {
      if (item.privacy_status === "Anonim") {
        return item.nama_pemohon.charAt(0) + "*****";
      }
      return item.nama_pemohon;
    };
    const truncate = (text, length) => {
      if (!text) return "";
      return text.length > length ? text.substring(0, length) + "..." : text;
    };
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit"
      }).format(date);
    };
    const formatStatus = (status) => {
      if (status === "selesai") return "Selesai";
      if (status === "ditolak") return "Ditolak";
      return status;
    };
    const getStatusClass = (status) => {
      if (status === "selesai") return "bg-green-100 text-green-800";
      if (status === "ditolak") return "bg-red-100 text-red-800";
      return "bg-gray-100 text-gray-800";
    };
    const getPrivacyClass = (privacy) => {
      if (privacy === "Publik") return "bg-sky-100 text-sky-800";
      if (privacy === "Anonim") return "bg-slate-100 text-slate-800";
      if (privacy === "Rahasia") return "bg-red-100 text-red-800";
      return "bg-gray-100 text-gray-800";
    };
    const getPrivacyIcon = (privacy) => {
      if (privacy === "Publik") return "fas fa-globe-asia";
      if (privacy === "Anonim") return "fas fa-user-secret";
      if (privacy === "Rahasia") return "fas fa-lock";
      return "fas fa-shield-alt";
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 bg-gray-50 min-h-screen" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        breadcrumbs: unref(getBreadcrumbs).laporanPermohonan(),
        class: "mb-4"
      }, null, _parent));
      _push(`<div class="bg-white rounded-2xl shadow-lg border border-gray-100"><div class="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl flex flex-col md:flex-row justify-between items-center gap-4"><h2 class="text-xl font-bold text-white flex items-center"><i class="fas fa-list-ul mr-3"></i> Daftar Semua Permohonan </h2><div class="flex flex-wrap items-center justify-center gap-2">`);
      if (unref(authStore).isAuthenticated) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "#",
          class: "inline-flex items-center justify-center px-4 py-2 text-xs md:text-sm font-bold rounded-xl bg-yellow-300 text-yellow-900 shadow-md hover:bg-yellow-400 transition-all duration-200"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fas fa-user-check mr-2"${_scopeId}></i> Permohonan Saya `);
            } else {
              return [
                createVNode("i", { class: "fas fa-user-check mr-2" }),
                createTextVNode(" Permohonan Saya ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/permohonan-informasi",
        class: "inline-flex items-center justify-center px-4 py-2 text-xs md:text-sm font-bold rounded-xl bg-white text-blue-600 shadow-md hover:bg-gray-100 transition-all duration-200"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-plus-circle mr-2"${_scopeId}></i> Buat Permohonan `);
          } else {
            return [
              createVNode("i", { class: "fas fa-plus-circle mr-2" }),
              createTextVNode(" Buat Permohonan ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="mt-6 p-4 bg-gray-50 border-y border-gray-100"><form class="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-end"><div class="w-full md:flex-1 md:min-w-[250px]"><label class="block text-xs font-medium text-gray-600 mb-1">Pencarian</label><div class="border border-gray-300 rounded-2xl bg-white">`);
      _push(ssrRenderComponent(CustomInput, {
        modelValue: filters.value.search,
        "onUpdate:modelValue": ($event) => filters.value.search = $event,
        placeholder: "Cari nama, rincian...",
        icon: "fas fa-search"
      }, null, _parent));
      _push(`</div></div><div class="grid grid-cols-2 md:contents gap-3"><div class="md:flex-1 md:min-w-[130px]"><label class="block text-xs font-medium text-gray-600 mb-1">Tgl Awal</label><div class="border border-gray-300 rounded-2xl bg-white">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        modelValue: filters.value.date_from,
        "onUpdate:modelValue": ($event) => filters.value.date_from = $event
      }, null, _parent));
      _push(`</div></div><div class="md:flex-1 md:min-w-[130px]"><label class="block text-xs font-medium text-gray-600 mb-1">Tgl Akhir</label><div class="border border-gray-300 rounded-2xl bg-white">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        modelValue: filters.value.date_to,
        "onUpdate:modelValue": ($event) => filters.value.date_to = $event
      }, null, _parent));
      _push(`</div></div><div class="md:flex-1 md:min-w-[150px]"><label for="sort" class="block text-xs font-medium text-gray-600 mb-1">Urutkan</label><div class="border border-gray-300 rounded-2xl bg-white">`);
      _push(ssrRenderComponent(CustomSelect, {
        modelValue: filters.value.sort,
        "onUpdate:modelValue": ($event) => filters.value.sort = $event,
        options: sortOptions,
        searchable: false
      }, null, _parent));
      _push(`</div></div><div class="md:flex-1 md:min-w-[100px]"><label for="per_page" class="block text-xs font-medium text-gray-600 mb-1">Tampilan</label><div class="border border-gray-300 rounded-2xl bg-white">`);
      _push(ssrRenderComponent(CustomSelect, {
        modelValue: filters.value.per_page,
        "onUpdate:modelValue": ($event) => filters.value.per_page = $event,
        options: perPageOptions,
        searchable: false
      }, null, _parent));
      _push(`</div></div></div><div class="grid grid-cols-2 md:flex gap-2 mb-1"><button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-4 rounded-md transition flex items-center justify-center"><i class="fas fa-search mr-2"></i> Cari </button><button type="button" class="bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-1.5 px-4 rounded-md transition flex items-center justify-center"><i class="fas fa-eraser mr-2"></i> Reset </button></div></form></div>`);
      if (unref(isLoading)) {
        _push(`<div class="p-12 flex justify-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>`);
      } else {
        _push(`<!--[--><div class="hidden md:block overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemohon</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rincian Informasi</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sifat</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(((_a = unref(data)) == null ? void 0 : _a.data) || [], (item, index) => {
          var _a2, _b2;
          _push(`<tr class="hover:bg-gray-50 transition duration-150"><td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${ssrInterpolate((((_a2 = unref(data)) == null ? void 0 : _a2.current_page) - 1) * ((_b2 = unref(data)) == null ? void 0 : _b2.per_page) + index + 1)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">${ssrInterpolate(formatName(item))}</td><td class="px-6 py-4 text-sm text-gray-500">${ssrInterpolate(truncate(item.detail_informasi, 100))}</td><td class="px-6 py-4 whitespace-nowrap text-sm"><span class="${ssrRenderClass([getStatusClass(item.status_permohonan), "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"])}">${ssrInterpolate(formatStatus(item.status_permohonan))}</span></td><td class="px-6 py-4 whitespace-nowrap text-sm text-center"><span class="${ssrRenderClass([getPrivacyClass(item.privacy_status), "px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full"])}"><i class="${ssrRenderClass([getPrivacyIcon(item.privacy_status), "mr-1"])}"></i> ${ssrInterpolate(item.privacy_status)}</span></td><td class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium"><div class="flex items-center space-x-3">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/tracking/${item.unique_code}`,
            class: "text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="fas fa-eye mr-1"${_scopeId}></i> Detail `);
              } else {
                return [
                  createVNode("i", { class: "fas fa-eye mr-1" }),
                  createTextVNode(" Detail ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (!((_c = (_b = unref(data)) == null ? void 0 : _b.data) == null ? void 0 : _c.length)) {
          _push(`<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">Data tidak ditemukan</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div><div class="md:hidden divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(((_d = unref(data)) == null ? void 0 : _d.data) || [], (item, index) => {
          var _a2, _b2;
          _push(`<div class="p-4 bg-white hover:bg-gray-50 transition-colors"><div class="flex justify-between items-start mb-3"><div class="flex items-center"><span class="text-[10px] font-bold text-blue-600 mr-2">#${ssrInterpolate((((_a2 = unref(data)) == null ? void 0 : _a2.current_page) - 1) * ((_b2 = unref(data)) == null ? void 0 : _b2.per_page) + index + 1)}</span><h3 class="text-sm font-bold text-gray-900">${ssrInterpolate(formatName(item))}</h3></div><span class="${ssrRenderClass([getStatusClass(item.status_permohonan), "px-2 py-0.5 text-[9px] font-bold rounded-full uppercase"])}">${ssrInterpolate(formatStatus(item.status_permohonan))}</span></div><p class="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">${ssrInterpolate(item.detail_informasi)}</p><div class="flex items-center justify-between pt-3 border-t border-gray-50"><div class="flex gap-3"><span class="text-[10px] text-gray-500 flex items-center"><i class="${ssrRenderClass([getPrivacyIcon(item.privacy_status), "mr-1"])}"></i> ${ssrInterpolate(item.privacy_status)}</span><span class="text-[10px] text-gray-500 flex items-center"><i class="far fa-calendar-alt mr-1"></i> ${ssrInterpolate(formatDate(item.created_at))}</span></div><div class="flex gap-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/tracking/${item.unique_code}`,
            class: "inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Detail `);
              } else {
                return [
                  createTextVNode(" Detail ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></div>`);
        });
        _push(`<!--]-->`);
        if (!((_f = (_e = unref(data)) == null ? void 0 : _e.data) == null ? void 0 : _f.length)) {
          _push(`<div class="p-8 text-center text-gray-500 text-sm"> Tidak ada permohonan ditemukan </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (((_g = unref(data)) == null ? void 0 : _g.last_page) > 1) {
          _push(`<div class="mt-6 p-4 border-t border-gray-100 flex justify-center"><nav class="flex items-center gap-1"><button${ssrIncludeBooleanAttr(unref(data).current_page === 1) ? " disabled" : ""} class="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-50"> \xAB </button><!--[-->`);
          ssrRenderList(paginationPages.value, (page) => {
            _push(`<button class="${ssrRenderClass(["px-3 py-1 rounded text-sm", unref(data).current_page === page ? "bg-blue-600 text-white font-bold" : "border border-gray-300 hover:bg-gray-50"])}">${ssrInterpolate(page)}</button>`);
          });
          _push(`<!--]--><button${ssrIncludeBooleanAttr(unref(data).current_page === unref(data).last_page) ? " disabled" : ""} class="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-50"> \xBB </button></nav></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/laporan/permohonan.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=permohonan-sb2kXTIh.mjs.map
