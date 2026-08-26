import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { computed, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQuery } from '@tanstack/vue-query';
import { a as api } from './api-CX2AAiTN.mjs';
import { _ as _sfc_main$2 } from './Breadcrumbs-CqGmUqmz.mjs';
import { _ as _export_sfc } from './server.mjs';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
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
import './loading-DMBVy40S.mjs';

const _sfc_main$1 = {
  __name: "UnitCard",
  __ssrInlineRender: true,
  props: {
    unit: {
      type: Object,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const colors = computed(() => {
      const map = {
        blue: {
          wrapperHoverBorder: "hover:border-blue-100",
          iconBg: "bg-blue-50",
          iconBgHover: "group-hover:bg-blue-600",
          iconText: "text-blue-600",
          btnBg: "bg-blue-600",
          btnBgHover: "hover:bg-blue-700",
          btnShadow: "shadow-blue-100",
          btnShadowHover: "hover:shadow-blue-200"
        },
        indigo: {
          wrapperHoverBorder: "hover:border-indigo-100",
          iconBg: "bg-indigo-50",
          iconBgHover: "group-hover:bg-indigo-600",
          iconText: "text-indigo-600",
          btnBg: "bg-indigo-600",
          btnBgHover: "hover:bg-indigo-700",
          btnShadow: "shadow-indigo-100",
          btnShadowHover: "hover:shadow-indigo-200"
        }
      };
      return map[props.color] || map.blue;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [colors.value.wrapperHoverBorder, "group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full border border-gray-100 transform hover:-translate-y-2"]
      }, _attrs))} data-v-62e62b8d><div class="p-8 flex-grow flex flex-col" data-v-62e62b8d><div class="flex items-center justify-center mb-6" data-v-62e62b8d><div class="${ssrRenderClass([colors.value.iconBg, colors.value.iconBgHover, "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300"])}" data-v-62e62b8d><i class="${ssrRenderClass(["fas", __props.icon, colors.value.iconText, "group-hover:text-white text-3xl transition-colors duration-300"])}" data-v-62e62b8d></i></div></div><h2 class="text-xl font-bold text-gray-800 mb-3 text-center leading-tight" data-v-62e62b8d>${ssrInterpolate(__props.unit.name)}</h2><div class="flex items-start text-gray-500 mb-6 text-center justify-center text-sm" data-v-62e62b8d><i class="fas fa-map-marker-alt text-blue-500 mr-2 mt-0.5" data-v-62e62b8d></i><p class="flex-grow line-clamp-2" data-v-62e62b8d>${(_a = __props.unit.address || "Alamat belum ditambahkan.") != null ? _a : ""}</p></div><div class="mt-auto space-y-3" data-v-62e62b8d>`);
      if (__props.unit.slug) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/dipunit/dip/${__props.unit.slug}`,
          class: [colors.value.btnBg, colors.value.btnBgHover, colors.value.btnShadow, colors.value.btnShadowHover, "inline-flex items-center justify-center text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 w-full shadow-lg"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fas fa-file-alt mr-2" data-v-62e62b8d${_scopeId}></i> Lihat Daftar Informasi Publik `);
            } else {
              return [
                createVNode("i", { class: "fas fa-file-alt mr-2" }),
                createTextVNode(" Lihat Daftar Informasi Publik ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<span class="inline-flex items-center justify-center bg-gray-100 text-gray-400 font-bold py-3 px-6 rounded-xl w-full cursor-not-allowed italic" data-v-62e62b8d> Belum Terdaftar </span>`);
      }
      if (__props.unit.website_url) {
        _push(`<a${ssrRenderAttr("href", __props.unit.website_url)} target="_blank" class="inline-flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 w-full border border-gray-100" data-v-62e62b8d><i class="fas fa-globe mr-2 text-blue-500" data-v-62e62b8d></i> Website Resmi </a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UnitCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const UnitCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-62e62b8d"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { data: response, isLoading } = useQuery({
      queryKey: ["dipunit-list"],
      queryFn: async () => {
        const res = await api.get("/dipunit");
        return res.data;
      },
      staleTime: 3e4,
      keepPreviousData: true
    });
    const data = computed(() => {
      var _a;
      return (_a = response.value) == null ? void 0 : _a.data;
    });
    useGlobalLoader(isLoading);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dip-unit-page bg-gray-50 min-h-screen pb-24 lg:pb-8" }, _attrs))}><div class="container mx-auto py-12 px-4 max-w-7xl">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).dipUnit()
      }, null, _parent));
      _push(`<div class="mb-16 text-center"><h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Daftar Informasi Publik Unit</h1><p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Akses Daftar Informasi Publik (DIP) secara transparan dari seluruh tingkatan unit kerja di Kabupaten Sinjai.</p></div>`);
      if (!unref(isLoading) && data.value) {
        _push(`<div><section class="mb-24"><div class="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6"><div class="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200"><i class="fas fa-building text-2xl"></i></div><div><h2 class="text-3xl font-black text-gray-800 uppercase tracking-tight">Dinas &amp; Badan (OPD)</h2><p class="text-blue-600 font-bold text-sm">Organisasi Perangkat Daerah Pusat</p></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
        ssrRenderList(data.value.opds, (unit) => {
          _push(ssrRenderComponent(UnitCard, {
            key: unit.unit_id,
            unit,
            icon: "fa-building",
            color: "blue"
          }, null, _parent));
        });
        _push(`<!--]--></div></section><section class="mb-24"><div class="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6"><div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200"><i class="fas fa-landmark text-2xl"></i></div><div><h2 class="text-3xl font-black text-gray-800 uppercase tracking-tight">Kantor Kecamatan</h2><p class="text-indigo-600 font-bold text-sm">Pusat Pemerintahan Wilayah Kecamatan</p></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
        ssrRenderList(data.value.kecamatans, (kec) => {
          _push(ssrRenderComponent(UnitCard, {
            key: kec.unit_id,
            unit: kec,
            icon: "fa-landmark",
            color: "indigo"
          }, null, _parent));
        });
        _push(`<!--]--></div></section><section><div class="flex items-center gap-4 mb-12 border-b border-gray-100 pb-6"><div class="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200"><i class="fas fa-map-marked-alt text-2xl"></i></div><div><h2 class="text-3xl font-black text-gray-800 uppercase tracking-tight">Desa &amp; Kelurahan</h2><p class="text-emerald-600 font-bold text-sm">Unit Kerja Tingkat Wilayah Desa/Kelurahan</p></div></div><div class="space-y-20"><!--[-->`);
        ssrRenderList(data.value.villagesByKecamatan, (villages, kecName) => {
          _push(`<div class="relative"><div class="sticky top-20 z-20 mb-8"><div class="bg-white/80 backdrop-blur-md border border-gray-100 inline-flex items-center px-6 py-3 rounded-2xl shadow-lg"><span class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mr-3">Wilayah</span><h3 class="text-xl font-black text-emerald-700 uppercase tracking-tight">Kecamatan ${ssrInterpolate(kecName)}</h3><span class="ml-4 bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full text-[10px] font-black uppercase">${ssrInterpolate(villages.length)} Unit</span></div></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><!--[-->`);
          ssrRenderList(villages, (village) => {
            _push(`<div class="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 flex flex-col justify-between min-h-[180px] relative overflow-hidden transform hover:-translate-y-2"><div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500"><i class="fas fa-map-marker-alt text-8xl"></i></div><div class="relative z-10"><div class="flex justify-between items-start mb-4"><div class="w-12 h-12 bg-gray-50 group-hover:bg-emerald-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-all duration-500 shadow-inner"><i class="fas fa-house-chimney text-xl"></i></div><span class="text-[10px] font-black uppercase tracking-widest bg-gray-100 group-hover:bg-emerald-100 text-gray-500 group-hover:text-emerald-700 px-3 py-1 rounded-full transition-colors duration-500">${ssrInterpolate(village.type)}</span></div><h4 class="text-lg font-black text-gray-800 group-hover:text-emerald-900 transition-colors duration-500 leading-tight mb-4">${ssrInterpolate(village.name)}</h4></div><div class="relative z-10 mt-auto">`);
            if (village.slug) {
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: `/dipunit/dip/${village.slug}`,
                class: "inline-flex items-center justify-center w-full bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white font-black text-xs py-3 rounded-xl transition-all duration-500 uppercase tracking-widest gap-2 shadow-sm group-hover:shadow-emerald-200"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(` BUKA DIP <i class="fas fa-circle-arrow-right text-sm"${_scopeId}></i>`);
                  } else {
                    return [
                      createTextVNode(" BUKA DIP "),
                      createVNode("i", { class: "fas fa-circle-arrow-right text-sm" })
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<div class="flex items-center justify-center w-full bg-gray-50 text-gray-400 font-bold text-[10px] py-3 rounded-xl uppercase tracking-widest border border-dashed border-gray-200"><i class="fas fa-hourglass-start mr-2"></i> Belum Ada Data </div>`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div></section></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dipunit/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C_o_fWwW.mjs.map
