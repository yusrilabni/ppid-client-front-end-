import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { ref, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.id;
    ref(null);
    const pageCurrent = ref(1);
    const pageTotal = ref("--");
    const isLoading = ref(true);
    const loadingText = ref("Menyiapkan Library...");
    const loadingError = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-900 min-h-screen py-12" }, _attrs))}><div class="container mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-col md:flex-row justify-between items-center bg-gray-800 text-white p-4 rounded-t-lg shadow-lg mb-0 border-b border-gray-700"><div class="mb-4 md:mb-0">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/laporan/ppid",
        class: "inline-flex items-center text-gray-300 hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-arrow-left mr-2"${_scopeId}></i> Kembali ke Daftar Laporan `);
          } else {
            return [
              createVNode("i", { class: "fas fa-arrow-left mr-2" }),
              createTextVNode(" Kembali ke Daftar Laporan ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-lg font-semibold mt-1">Preview Laporan PPID</h1></div><div class="flex items-center space-x-4"><button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"><i class="fas fa-chevron-left"></i> Prev </button><span class="text-sm text-gray-400"> Page <span class="text-white font-bold">${ssrInterpolate(pageCurrent.value)}</span> of <span class="text-white font-bold">${ssrInterpolate(pageTotal.value)}</span></span><button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"> Next <i class="fas fa-chevron-right"></i></button></div></div><div class="book-wrapper bg-gray-800 rounded-b-lg shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[600px] lg:min-h-[800px]">`);
      if (isLoading.value) {
        _push(`<div class="text-center z-20 absolute"><svg class="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p class="text-white text-lg font-medium">${ssrInterpolate(loadingText.value)}</p>`);
        if (loadingError.value) {
          _push(`<p class="text-red-400 text-sm mt-2">${ssrInterpolate(loadingError.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([{ "opacity-0": isLoading.value }, "z-10"])}"></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/laporan/ppid/preview/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-LYpCcpJU.mjs.map
