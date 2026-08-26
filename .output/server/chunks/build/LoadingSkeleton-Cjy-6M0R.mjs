import { ssrRenderList } from 'vue/server-renderer';
import { useSSRContext } from 'vue';

const _sfc_main = {
  __name: "LoadingSkeleton",
  __ssrInlineRender: true,
  props: {
    type: { type: String, default: "card" },
    // card, text, image, list
    count: { type: Number, default: 1 }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(__props.count, (i) => {
        _push(`<div class="animate-pulse">`);
        if (__props.type === "card") {
          _push(`<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"><div class="h-48 bg-gray-200 w-full"></div><div class="p-5 space-y-4"><div class="h-4 bg-gray-200 rounded w-1/4"></div><div class="h-6 bg-gray-200 rounded w-3/4"></div><div class="space-y-2"><div class="h-3 bg-gray-200 rounded w-full"></div><div class="h-3 bg-gray-200 rounded w-5/6"></div></div><div class="flex justify-between items-center pt-2"><div class="h-8 bg-gray-200 rounded-lg w-24"></div><div class="h-8 w-8 bg-gray-200 rounded-full"></div></div></div></div>`);
        } else if (__props.type === "text") {
          _push(`<div class="space-y-3"><div class="h-4 bg-gray-200 rounded w-3/4"></div><div class="h-4 bg-gray-200 rounded w-full"></div><div class="h-4 bg-gray-200 rounded w-5/6"></div><div class="h-4 bg-gray-200 rounded w-1/2"></div></div>`);
        } else if (__props.type === "image") {
          _push(`<div class="bg-gray-200 rounded-2xl w-full h-full min-h-[200px] flex items-center justify-center"><i class="fas fa-image text-4xl text-gray-300"></i></div>`);
        } else if (__props.type === "list") {
          _push(`<div class="flex items-start gap-4 p-4 border-b border-gray-100 last:border-0"><div class="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0"></div><div class="flex-1 space-y-2 py-1"><div class="h-5 bg-gray-200 rounded w-1/2"></div><div class="h-4 bg-gray-200 rounded w-1/4"></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LoadingSkeleton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=LoadingSkeleton-Cjy-6M0R.mjs.map
