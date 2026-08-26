import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { computed, reactive, ref, watch, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQuery } from '@tanstack/vue-query';
import { u as useAuthStore } from './auth-CdaZwofV.mjs';
import { a as api } from './api-CX2AAiTN.mjs';
import { _ as _sfc_main$1 } from './Breadcrumbs-CqGmUqmz.mjs';
import { C as CustomSelect } from './CustomSelect-YbAR9Oty.mjs';
import { _ as _sfc_main$2 } from './CustomDate-uaTKdXDJ.mjs';
import { C as CustomInput } from './CustomInput-Dh4cWjwV.mjs';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
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
import './loading-DMBVy40S.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "[category]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const authStore = useAuthStore();
    const debounce = (fn, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    };
    const category = computed(() => route.params.category || "");
    const categoryName = computed(() => {
      let name = category.value.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      if (!name.toLowerCase().includes("informasi")) {
        name = "Informasi " + name;
      }
      return name;
    });
    const isAdmin = computed(() => {
      var _a;
      return authStore.isAuthenticated && (authStore.isAdmin || ((_a = authStore.user) == null ? void 0 : _a.unit_id));
    });
    const breadcrumbData = computed(() => {
      let categoryIcon = "fas fa-info-circle";
      if (categoryName.value.includes("Berkala")) categoryIcon = "fas fa-calendar-alt";
      else if (categoryName.value.includes("Setiap Saat")) categoryIcon = "fas fa-clock";
      else if (categoryName.value.includes("Serta Merta")) categoryIcon = "fas fa-exclamation-triangle";
      else if (categoryName.value.includes("Dikecualikan")) categoryIcon = "fas fa-ban";
      return getBreadcrumbs.kategoriInformasi(categoryName.value, categoryIcon);
    });
    const filters = reactive({
      search: "",
      date_from: "",
      date_to: "",
      sort: "created_at_desc",
      per_page: "10",
      unit_id: "",
      filter_unit: "1",
      page: 1
    });
    const units = ref([]);
    const debouncedSearch = ref("");
    const handleSearch = debounce((val) => {
      debouncedSearch.value = val;
      filters.page = 1;
    }, 500);
    watch(() => filters.search, (newVal) => {
      handleSearch(newVal);
    });
    watch([() => filters.date_from, () => filters.date_to, () => filters.sort, () => filters.per_page, () => filters.unit_id, () => filters.filter_unit], () => {
      filters.page = 1;
    });
    const { data: queryData, isFetching, isLoading } = useQuery({
      queryKey: computed(() => ["informasi", category.value, debouncedSearch.value, filters.date_from, filters.date_to, filters.sort, filters.per_page, filters.unit_id, filters.filter_unit, filters.page]),
      queryFn: async () => {
        const params = {
          category: categoryName.value,
          search: debouncedSearch.value,
          date_from: filters.date_from,
          date_to: filters.date_to,
          sort: filters.sort,
          per_page: filters.per_page,
          unit_id: filters.unit_id,
          filter_unit: filters.filter_unit,
          page: filters.page
        };
        const res = await api.get("/informasi", { params });
        return res.data;
      },
      staleTime: 3e4,
      keepPreviousData: true
    });
    useGlobalLoader(isLoading);
    const items = computed(() => {
      var _a, _b;
      return ((_b = (_a = queryData.value) == null ? void 0 : _a.data) == null ? void 0 : _b.data) || [];
    });
    const pagination = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return {
        current_page: ((_b = (_a = queryData.value) == null ? void 0 : _a.data) == null ? void 0 : _b.current_page) || 1,
        last_page: ((_d = (_c = queryData.value) == null ? void 0 : _c.data) == null ? void 0 : _d.last_page) || 1,
        per_page: ((_f = (_e = queryData.value) == null ? void 0 : _e.data) == null ? void 0 : _f.per_page) || 10,
        total: ((_h = (_g = queryData.value) == null ? void 0 : _g.data) == null ? void 0 : _h.total) || 0
      };
    });
    const visiblePages = computed(() => {
      const current = pagination.value.current_page;
      const last = pagination.value.last_page;
      if (last <= 7) {
        return Array.from({ length: last }, (_, i) => i + 1);
      }
      if (current <= 4) {
        return [1, 2, 3, 4, 5, "...", last];
      }
      if (current >= last - 3) {
        return [1, "...", last - 4, last - 3, last - 2, last - 1, last];
      }
      return [1, "...", current - 1, current, current + 1, "...", last];
    });
    const resetFilters = () => {
      filters.search = "";
      filters.date_from = "";
      filters.date_to = "";
      filters.sort = "created_at_desc";
      filters.per_page = "10";
      filters.unit_id = "";
      filters.filter_unit = "1";
      filters.page = 1;
    };
    const formatDate = (dateString) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    };
    const truncateText = (text, length = 80) => {
      if (!text) return "";
      if (text.length <= length) return text;
      return text.substring(0, length) + "...";
    };
    const isStruktur = (content) => {
      return content && content.toString().startsWith("struktur_organisasi_");
    };
    const getDetailLink = (item) => {
      var _a;
      if (item.official) {
        const posSlug = ((_a = item.official.position) == null ? void 0 : _a.slug) || "";
        if (posSlug === "bupati") return "/profil/bupati";
        if (posSlug === "wakil-bupati") return "/profil/wakil-bupati";
        if (posSlug === "sekretaris-daerah") return "/profil/sekretaris-daerah";
        return `/profil/${item.official.slug}`;
      } else if (isStruktur(item.content)) {
        return `/informasi/detail/${item.slug || item.id}`;
      }
      return `/informasi/detail/${item.slug || item.id}`;
    };
    watch(category, () => {
      resetFilters();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 px-4 overflow-x-hidden bg-gray-50 min-h-screen" }, _attrs))}><div class="max-w-7xl mx-auto w-full"><div class="overflow-x-auto mb-4">`);
      _push(ssrRenderComponent(_sfc_main$1, { breadcrumbs: breadcrumbData.value }, null, _parent));
      _push(`</div><div class="mb-8"><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 class="text-3xl font-bold text-gray-800">${ssrInterpolate(categoryName.value)}</h1></div>`);
      if (isAdmin.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/admin/informasi/create?category=${category.value}`,
          class: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fas fa-plus mr-2"${_scopeId}></i> Tambah Informasi `);
            } else {
              return [
                createVNode("i", { class: "fas fa-plus mr-2" }),
                createTextVNode(" Tambah Informasi ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-8 mb-10"><form class="relative"><div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-white mb-6 relative z-50"><div class="flex-1"><label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-4">Pencarian Pintar</label><div class="bg-gray-50/50 rounded-2xl relative z-50">`);
      _push(ssrRenderComponent(CustomInput, {
        modelValue: filters.search,
        "onUpdate:modelValue": ($event) => filters.search = $event,
        placeholder: "Ketik kata kunci...",
        icon: "fas fa-search"
      }, null, _parent));
      _push(`</div></div><div class="grid grid-cols-2 md:grid-cols-4 gap-3 lg:w-auto relative z-50"><div class="min-w-[140px] relative" style="${ssrRenderStyle({ "z-index": "100" })}"><label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-2">Mulai</label><div class="bg-gray-50/50 rounded-2xl">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        modelValue: filters.date_from,
        "onUpdate:modelValue": ($event) => filters.date_from = $event
      }, null, _parent));
      _push(`</div></div><div class="min-w-[140px] relative" style="${ssrRenderStyle({ "z-index": "100" })}"><label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-2">Sampai</label><div class="bg-gray-50/50 rounded-2xl">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        modelValue: filters.date_to,
        "onUpdate:modelValue": ($event) => filters.date_to = $event
      }, null, _parent));
      _push(`</div></div><div class="min-w-[120px] relative" style="${ssrRenderStyle({ "z-index": "100" })}"><label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-2">Urutan</label><div class="bg-gray-50/50 rounded-2xl">`);
      _push(ssrRenderComponent(CustomSelect, {
        modelValue: filters.sort,
        "onUpdate:modelValue": ($event) => filters.sort = $event,
        options: [
          { value: "created_at_desc", label: "Waktu Sistem (Terbaru)" },
          { value: "tanggal_upload_desc", label: "Tgl Dokumen (Terbaru)" },
          { value: "tanggal_upload_asc", label: "Tgl Dokumen (Terlama)" },
          { value: "title_asc", label: "Judul (A-Z)" },
          { value: "title_desc", label: "Judul (Z-A)" }
        ],
        searchable: false
      }, null, _parent));
      _push(`</div></div><div class="min-w-[100px] relative" style="${ssrRenderStyle({ "z-index": "90" })}"><label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-2">Limit</label><div class="bg-gray-50/50 rounded-2xl">`);
      _push(ssrRenderComponent(CustomSelect, {
        modelValue: filters.per_page,
        "onUpdate:modelValue": ($event) => filters.per_page = $event,
        options: [
          { value: "10", label: "10 Baris" },
          { value: "20", label: "20 Baris" },
          { value: "50", label: "50 Baris" }
        ],
        searchable: false
      }, null, _parent));
      _push(`</div></div></div></div><div class="flex flex-col lg:flex-row items-center justify-between gap-6 px-2 relative z-40"><div class="flex flex-wrap items-center gap-4 w-full lg:w-auto">`);
      if (isAdmin.value && !unref(authStore).isSuperAdmin) {
        _push(`<label class="relative flex items-center cursor-pointer group select-none"><input type="checkbox"${ssrIncludeBooleanAttr(ssrLooseEqual(filters.filter_unit, "1")) ? " checked" : ""} class="sr-only peer"><div class="px-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 flex items-center gap-3 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-blue-500 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-blue-200 peer-checked:border-transparent hover:border-blue-300 hover:shadow-md active:scale-95 peer-checked:[&amp;_.icon-box]:bg-emerald-500 peer-checked:[&amp;_.fa-check]:scale-100 peer-checked:[&amp;_.fa-check]:opacity-100 peer-checked:[&amp;_.fa-check]:text-white peer-checked:[&amp;_.fa-building]:scale-0 peer-checked:[&amp;_.fa-building]:opacity-0"><div class="icon-box relative w-5 h-5 flex items-center justify-center rounded-lg bg-gray-100 transition-all duration-300 ring-4 ring-transparent peer-checked:ring-white/10"><i class="fas fa-check absolute text-[10px] opacity-0 scale-0 transition-all duration-300"></i><i class="fas fa-building text-[10px] text-gray-400 transition-all duration-300"></i></div><span class="text-[10px] font-black uppercase tracking-[0.15em]">${ssrInterpolate(filters.filter_unit === "1" ? "Tampilkan Semua Unit" : "Hanya Unit Saya")}</span></div></label>`);
      } else {
        _push(`<div class="flex flex-col md:flex-row items-center gap-4 bg-white/50 backdrop-blur-sm p-2 pr-6 rounded-3xl border border-gray-100 shadow-sm w-full lg:w-auto"><div class="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 flex items-center gap-2 whitespace-nowrap"><i class="fas fa-building"></i> Filter Unit </div><div class="min-w-[280px] w-full md:w-auto relative z-50">`);
        _push(ssrRenderComponent(CustomSelect, {
          modelValue: filters.unit_id,
          "onUpdate:modelValue": ($event) => filters.unit_id = $event,
          options: [{ remote_id: "", name: "Semua Unit Kerja" }, ...units.value],
          labelKey: "name",
          valueKey: "remote_id",
          placeholder: "Cari unit kerja..."
        }, null, _parent));
        _push(`</div></div>`);
      }
      _push(`</div><button type="button" class="px-6 py-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300 flex items-center gap-2 lg:ml-auto group border border-transparent hover:border-red-100 shadow-sm"><i class="fas fa-sync-alt text-[10px] group-hover:rotate-180 transition-transform duration-500"></i><span class="text-[10px] font-black uppercase tracking-widest">Reset Filter</span></button></div></form></div></div><div class="relative min-h-[400px]">`);
      if (unref(isFetching)) {
        _push(`<div class="absolute inset-0 bg-white/40 backdrop-blur-[4px] z-[60] flex items-center justify-center rounded-[3rem]"><div class="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-50 flex flex-col items-center"><div class="relative w-16 h-16"><div class="absolute inset-0 border-4 border-blue-100 rounded-full"></div><div class="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div><span class="mt-6 text-[10px] font-black text-blue-900 uppercase tracking-[0.3em]">Memproses Data...</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-4 bg-white rounded-t-2xl rounded-b-[3rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-gray-50"><div class="hidden md:block overflow-x-auto"><table class="min-w-full divide-y divide-gray-100"><thead><tr class="bg-gradient-to-r from-blue-600 to-blue-800 text-white"><th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">No.</th><th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Dokumen / Judul</th><th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Deskripsi Ringkas</th><th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Unit Kerja</th><th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Tgl Upload</th><th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Aktivitas</th><th class="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em]">Opsi</th></tr></thead><tbody class="divide-y divide-gray-50">`);
      if (items.value.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(items.value, (item, index) => {
          var _a, _b, _c;
          _push(`<tr class="${ssrRenderClass(["hover:bg-blue-50/30 transition-colors", ((_a = item.status) == null ? void 0 : _a.toUpperCase()) === "ARSIP" ? "bg-gray-50/50 opacity-70" : ""])}"><td class="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-400 text-center">${ssrInterpolate((pagination.value.current_page - 1) * pagination.value.per_page + index + 1)}</td><td class="px-6 py-4">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: getDetailLink(item),
            class: "text-sm font-black text-gray-900 hover:text-blue-600 block leading-tight mb-1"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<div class="flex items-center gap-2 mt-1">`);
          if (((_b = item.status) == null ? void 0 : _b.toUpperCase()) === "ARSIP") {
            _push(`<span class="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest">ARSIP</span>`);
          } else if (["BERLAKU", "AKTIF"].includes((_c = item.status) == null ? void 0 : _c.toUpperCase())) {
            _push(`<span class="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest">BERLAKU</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="px-6 py-4 text-xs text-gray-500 leading-relaxed max-w-xs">${ssrInterpolate(truncateText(item.deskripsi, 80))}</td><td class="px-6 py-4"><span class="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-tight inline-block border border-blue-100/50">${ssrInterpolate(item.organization_name || "Unit Tidak Terdaftar")}</span></td><td class="px-6 py-4 whitespace-nowrap"><div class="flex flex-col"><span class="text-xs font-bold text-gray-700">${ssrInterpolate(formatDate(item.tanggal_upload))}</span><span class="text-[9px] text-gray-400 uppercase tracking-widest">Tahun: ${ssrInterpolate(item.tahun || "-")}</span></div></td><td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center gap-4"><div class="flex items-center gap-1.5" title="Dilihat"><i class="fas fa-eye text-indigo-400 text-xs"></i><span class="text-xs font-bold text-gray-600">${ssrInterpolate(item.views_count || 0)}</span></div><div class="flex items-center gap-1.5" title="Diunduh"><i class="fas fa-download text-blue-400 text-xs"></i><span class="text-xs font-bold text-gray-600">${ssrInterpolate(item.download_count || 0)}</span></div></div></td><td class="px-6 py-4 whitespace-nowrap text-center"><div class="flex items-center justify-center gap-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: getDetailLink(item),
            class: "w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm",
            title: "Detail"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="fas fa-eye text-sm"${_scopeId}></i>`);
              } else {
                return [
                  createVNode("i", { class: "fas fa-eye text-sm" })
                ];
              }
            }),
            _: 2
          }, _parent));
          if (!item.official && !isStruktur(item.content) && item.url) {
            _push(`<a${ssrRenderAttr("href", item.url)} target="_blank" class="w-9 h-9 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Buka Link"><i class="fas fa-external-link-alt text-sm"></i></a>`);
          } else {
            _push(`<!---->`);
          }
          if (!item.official && !isStruktur(item.content) && item.file_url) {
            _push(`<a${ssrRenderAttr("href", item.file_url)} target="_blank" download class="w-9 h-9 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Download"><i class="fas fa-download text-sm"></i></a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<tr><td colspan="6" class="px-6 py-20 text-center"><div class="flex flex-col items-center justify-center"><div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300"><i class="fas fa-search-minus text-2xl"></i></div><p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Tidak ada data ditemukan</p></div></td></tr>`);
      }
      _push(`</tbody></table></div><div class="md:hidden p-4 space-y-4">`);
      if (items.value.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(items.value, (item, index) => {
          var _a, _b, _c;
          _push(`<div class="${ssrRenderClass(["bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative overflow-hidden", ((_a = item.status) == null ? void 0 : _a.toUpperCase()) === "ARSIP" ? "bg-gray-50/50 opacity-70" : ""])}">`);
          if (((_b = item.status) == null ? void 0 : _b.toUpperCase()) === "ARSIP") {
            _push(`<div class="absolute top-0 right-0 bg-gray-200 text-gray-600 text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest"> ARSIP </div>`);
          } else if (["BERLAKU", "AKTIF"].includes((_c = item.status) == null ? void 0 : _c.toUpperCase())) {
            _push(`<div class="absolute top-0 right-0 bg-green-100 text-green-700 text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest"> BERLAKU </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mb-3"><span class="inline-block px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest mb-2 border border-blue-100">${ssrInterpolate(item.organization_name || "Unit Tidak Terdaftar")}</span>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: getDetailLink(item),
            class: "block text-sm font-bold text-gray-900 leading-snug line-clamp-2"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<p class="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">${ssrInterpolate(truncateText(item.deskripsi, 100))}</p></div><div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-50"><div class="flex flex-col"><span class="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Tgl Upload</span><span class="text-xs font-bold text-gray-700">${ssrInterpolate(formatDate(item.tanggal_upload))}</span></div><div class="flex items-center gap-3"><div class="flex items-center gap-1"><i class="fas fa-eye text-indigo-400 text-[10px]"></i><span class="text-[10px] font-bold text-gray-600">${ssrInterpolate(item.views_count || 0)}</span></div><div class="flex items-center gap-1"><i class="fas fa-download text-blue-400 text-[10px]"></i><span class="text-[10px] font-bold text-gray-600">${ssrInterpolate(item.download_count || 0)}</span></div></div></div><div class="flex gap-2 mt-4">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: getDetailLink(item),
            class: "flex-1 bg-blue-50 text-blue-600 text-xs font-bold py-2 rounded-xl text-center hover:bg-blue-600 hover:text-white transition-colors"
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
          if (!item.official && !isStruktur(item.content) && item.file_url) {
            _push(`<a${ssrRenderAttr("href", item.file_url)} target="_blank" download class="w-10 flex-shrink-0 bg-green-50 text-green-600 flex items-center justify-center rounded-xl hover:bg-green-600 hover:text-white transition-colors"><i class="fas fa-download text-sm"></i></a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<div class="py-12 text-center"><div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"><i class="fas fa-search-minus text-2xl"></i></div><p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Data kosong</p></div>`);
      }
      _push(`</div></div>`);
      if (pagination.value.last_page > 1) {
        _push(`<div class="mt-8 flex justify-center"><nav class="inline-flex rounded-xl shadow-sm border border-gray-100 bg-white p-1"><button${ssrIncludeBooleanAttr(pagination.value.current_page === 1) ? " disabled" : ""} class="px-4 py-2 text-sm font-bold text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"><i class="fas fa-chevron-left"></i></button><!--[-->`);
        ssrRenderList(visiblePages.value, (page) => {
          _push(`<!--[-->`);
          if (page === "...") {
            _push(`<span class="px-4 py-2 text-sm font-bold text-gray-400">...</span>`);
          } else {
            _push(`<button class="${ssrRenderClass(["px-4 py-2 text-sm font-bold rounded-lg transition-colors", page === pagination.value.current_page ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"])}">${ssrInterpolate(page)}</button>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(pagination.value.current_page === pagination.value.last_page) ? " disabled" : ""} class="px-4 py-2 text-sm font-bold text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"><i class="fas fa-chevron-right"></i></button></nav></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/informasi/[category].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_category_-DNUVnLsd.mjs.map
