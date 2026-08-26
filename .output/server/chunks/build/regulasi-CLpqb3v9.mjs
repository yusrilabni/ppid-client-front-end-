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
  __name: "regulasi",
  __ssrInlineRender: true,
  setup(__props) {
    const items = ref([]);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "regulasi-page" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, { title: "Regulasi" }, null, _parent));
      _push(`<div class="container mx-auto px-4 py-8">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).regulasi(),
        class: "mb-6"
      }, null, _parent));
      if (loading.value) {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(ssrRenderComponent(_sfc_main$3, {
            key: i,
            class: "h-20 w-full rounded-lg"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="bg-white shadow-md rounded-lg overflow-hidden border"><div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Regulasi</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Tahun</th><th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Aksi</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(items.value, (item, index) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(index + 1)}</td><td class="px-6 py-4"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(item.title)}</div><div class="text-sm text-gray-500">${ssrInterpolate(item.category)}</div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(item.year || "-")}</td><td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">`);
          if (item.file) {
            _push(`<a${ssrRenderAttr("href", unref(getStorageUrl)(item.file))} target="_blank" class="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded inline-flex items-center"><i class="fas fa-download mr-1"></i> Unduh </a>`);
          } else {
            _push(`<span class="text-gray-400 italic">File tidak tersedia</span>`);
          }
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
        if (items.value.length === 0) {
          _push(`<div class="p-8 text-center text-gray-500"> Tidak ada data regulasi. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/regulasi.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=regulasi-CLpqb3v9.mjs.map
