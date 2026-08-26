import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { ref, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './Breadcrumbs-CqGmUqmz.mjs';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
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

const _sfc_main = {
  __name: "survei",
  __ssrInlineRender: true,
  setup(__props) {
    const surveys = ref([]);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "survey-list-page bg-gray-50 min-h-screen pb-12" }, _attrs))}><div class="container mx-auto py-6 md:py-8 px-4"><div class="max-w-7xl mx-auto">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        breadcrumbs: unref(getBreadcrumbs).surveyList(),
        class: "mb-8"
      }, null, _parent));
      _push(`<div class="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100"><div class="p-6 bg-gradient-to-r from-blue-600 to-indigo-600"><h1 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"><i class="fas fa-poll"></i> Laporan Survei Kepuasan Masyarakat </h1><p class="text-blue-100 mt-2">Dinas Komunikasi Informatika dan Persandian Kabupaten Sinjai</p></div><div class="p-6 sm:p-8">`);
      if (loading.value) {
        _push(`<div class="flex justify-center items-center py-12"><i class="fas fa-spinner fa-spin text-blue-600 text-4xl"></i></div>`);
      } else if (surveys.value.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(surveys.value, (survey) => {
          _push(`<div class="border-b border-gray-200 pb-6 mb-6 last:border-0 last:mb-0 last:pb-0"><div class="flex items-center gap-2 mb-2"><h2 class="text-xl md:text-2xl font-bold text-gray-800">${ssrInterpolate(survey.title)}</h2>`);
          if (survey.type === "skm" || !survey.type) {
            _push(`<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase">SKM</span>`);
          } else if (survey.type === "ppid") {
            _push(`<span class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full uppercase">Survei PPID</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="prose max-w-none text-gray-600 mb-6">${ssrInterpolate(survey.description)}</div><div class="flex items-center space-x-4">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/survei/" + survey.slug,
            class: "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition duration-150 ease-in-out"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="fas fa-poll-h mr-2"${_scopeId}></i> Isi Survei Sekarang `);
              } else {
                return [
                  createVNode("i", { class: "fas fa-poll-h mr-2" }),
                  createTextVNode(" Isi Survei Sekarang ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<div class="text-center py-12"><i class="fas fa-clipboard-list text-gray-300 text-6xl mb-4"></i><h3 class="text-xl font-medium text-gray-900">Belum Ada Survei Aktif</h3><p class="text-gray-500 mt-2">Saat ini belum ada survei yang sedang aktif.</p></div>`);
      }
      _push(`<div class="mt-8 pt-8 border-t border-gray-100"><h3 class="text-lg font-semibold text-gray-800 mb-3">Tentang Survei Kepuasan Masyarakat</h3><p class="text-gray-600 text-sm leading-relaxed mb-4"> Survei Kepuasan Masyarakat (SKM) adalah kegiatan pengukuran secara komprehensif tentang tingkat kepuasan masyarakat terhadap kualitas layanan yang diberikan oleh penyelenggara pelayanan publik. </p><p class="text-gray-600 text-sm leading-relaxed"> Tujuannya adalah untuk mengetahui kelemahan atau kekurangan dari masing-masing unsur dalam penyelenggara pelayanan publik dan sebagai bahan penetapan kebijakan yang perlu diambil dan upaya tindak lanjut yang perlu dilakukan demi peningkatan kualitas pelayanan publik. </p></div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/laporan/survei.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=survei-CS1TkCkP.mjs.map
