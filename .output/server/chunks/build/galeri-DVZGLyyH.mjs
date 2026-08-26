import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "galeri",
  __ssrInlineRender: true,
  setup(__props) {
    const items = ref([]);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "galeri-page" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, { title: "Galeri PPID" }, null, _parent));
      _push(`<div class="container mx-auto px-4 py-8">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).galeri(),
        class: "mb-6"
      }, null, _parent));
      if (loading.value) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(ssrRenderComponent(_sfc_main$3, {
            key: i,
            class: "h-64 w-full rounded-xl"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"><!--[-->`);
        ssrRenderList(items.value, (item) => {
          _push(`<div class="group relative rounded-xl overflow-hidden shadow-md cursor-pointer aspect-square"><img${ssrRenderAttr("src", unref(getStorageUrl)(item.image))}${ssrRenderAttr("alt", item.title)} class="w-full h-full object-cover transition duration-500 group-hover:scale-110"><div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4"><h3 class="text-white font-bold text-lg">${ssrInterpolate(item.title)}</h3><p class="text-gray-200 text-sm line-clamp-2 mt-1">${ssrInterpolate(item.description)}</p></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/galeri.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=galeri-DVZGLyyH.mjs.map
