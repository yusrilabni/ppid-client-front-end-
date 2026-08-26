import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { ref, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './Breadcrumbs-CqGmUqmz.mjs';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { _ as _sfc_main$1 } from './PageHeader-CUVqtGHn.mjs';
import { _ as _sfc_main$3 } from './LoadingSkeleton-Cjy-6M0R.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const items = ref([]);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "standar-layanan-page" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, { title: "Standar Layanan PPID" }, null, _parent));
      _push(`<div class="container mx-auto px-4 py-8">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).standarLayanan(),
        class: "mb-6"
      }, null, _parent));
      if (loading.value) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(6, (i) => {
          _push(ssrRenderComponent(_sfc_main$3, {
            key: i,
            class: "h-40 w-full rounded-lg"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(items.value, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.id,
            to: `/layanan/standar-layanan/${item.slug}`,
            class: "bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600 hover:shadow-xl transition flex items-start space-x-4 group"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition"${_scopeId}><i class="fas fa-file-alt text-xl"${_scopeId}></i></div><div${_scopeId}><h3 class="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition"${_scopeId}>${ssrInterpolate(item.title)}</h3><p class="text-sm text-gray-500 line-clamp-2"${_scopeId}>${ssrInterpolate(item.description)}</p></div>`);
              } else {
                return [
                  createVNode("div", { class: "w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition" }, [
                    createVNode("i", { class: "fas fa-file-alt text-xl" })
                  ]),
                  createVNode("div", null, [
                    createVNode("h3", { class: "font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition" }, toDisplayString(item.title), 1),
                    createVNode("p", { class: "text-sm text-gray-500 line-clamp-2" }, toDisplayString(item.description), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/standar-layanan/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cd8eNkdL.mjs.map
