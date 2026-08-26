import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './Breadcrumbs-CqGmUqmz.mjs';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { g as getStorageUrl } from './api-k33KGvo_.mjs';
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
  __name: "sop-layanan",
  __ssrInlineRender: true,
  setup(__props) {
    const items = ref([]);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sop-layanan-page" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, { title: "SOP Layanan Informasi Publik" }, null, _parent));
      _push(`<div class="container mx-auto px-4 py-12 max-w-5xl">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).sopLayanan(),
        class: "mb-6"
      }, null, _parent));
      if (loading.value) {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(ssrRenderComponent(_sfc_main$3, {
            key: i,
            class: "h-24 w-full rounded-lg"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="space-y-6"><!--[-->`);
        ssrRenderList(items.value, (item, index) => {
          _push(`<div class="bg-white rounded-xl shadow-md border-l-4 border-blue-600 overflow-hidden hover:shadow-lg transition"><div class="p-6 flex flex-col md:flex-row items-center gap-6"><div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold">${ssrInterpolate(index + 1)}</div><div class="flex-1 text-center md:text-left"><h3 class="text-xl font-bold text-gray-900 mb-2">${ssrInterpolate(item.title)}</h3><p class="text-gray-600 line-clamp-2">${ssrInterpolate(item.description)}</p></div><div class="flex-shrink-0">`);
          if (item.file) {
            _push(`<a${ssrRenderAttr("href", unref(getStorageUrl)(item.file))} target="_blank" class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition"><i class="fas fa-download mr-2"></i> Unduh SOP </a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/sop-layanan.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=sop-layanan-BWyhDnf3.mjs.map
