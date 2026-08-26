import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-Cu84b-L0.mjs';
import { u as useRouter, a as useRoute } from './server.mjs';
import './api-k33KGvo_.mjs';
import 'axios';
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
  __name: "google-callback",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useRoute();
    useAuthStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col items-center justify-center bg-gray-50" }, _attrs))}><div class="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-sm w-full mx-4"><div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div><h2 class="text-xl font-bold text-gray-800 mb-2">Memvalidasi Google...</h2><p class="text-sm text-gray-500">Mohon tunggu, sedang memverifikasi kode dari Google.</p></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/google-callback.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=google-callback-DHDf7Ye2.mjs.map
