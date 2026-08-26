import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './Breadcrumbs-CqGmUqmz.mjs';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { g as getStorageUrl } from './api-CX2AAiTN.mjs';
import { _ as _sfc_main$1 } from './PageHeader-CUVqtGHn.mjs';
import { _ as _sfc_main$3 } from './LoadingSkeleton-Cjy-6M0R.mjs';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'axios';

const _sfc_main = {
  __name: "maklumat-layanan",
  __ssrInlineRender: true,
  setup(__props) {
    const content = ref(null);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "maklumat-layanan-page" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, { title: "Maklumat Layanan" }, null, _parent));
      _push(`<div class="container mx-auto px-4 py-12 max-w-4xl">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).maklumatLayanan(),
        class: "mb-6"
      }, null, _parent));
      if (loading.value) {
        _push(`<div class="bg-white rounded-2xl shadow-xl p-8 border">`);
        _push(ssrRenderComponent(_sfc_main$3, { class: "h-64 w-full" }, null, _parent));
        _push(`</div>`);
      } else if (content.value) {
        _push(`<div class="bg-white rounded-2xl shadow-xl overflow-hidden border"><div class="bg-blue-900 text-white p-8 text-center relative overflow-hidden"><div class="absolute inset-0 opacity-10 bg-[url(&#39;data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=&#39;)]"></div><i class="fas fa-bullhorn text-5xl mb-4 relative z-10 text-yellow-400"></i><h2 class="text-3xl font-bold uppercase tracking-wider relative z-10">Maklumat Layanan</h2><p class="mt-2 text-blue-100 relative z-10">PPID Kabupaten Sinjai</p></div><div class="p-8 md:p-12"><div class="prose prose-lg prose-blue max-w-none text-center font-serif leading-relaxed text-gray-800">${(_a = content.value.content) != null ? _a : ""}</div>`);
        if (content.value.image) {
          _push(`<div class="mt-10 flex justify-center"><img${ssrRenderAttr("src", unref(getStorageUrl)(content.value.image))} alt="Maklumat Layanan" class="max-w-full h-auto rounded-lg shadow-md border"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/maklumat-layanan.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=maklumat-layanan-Cv4lAWtO.mjs.map
