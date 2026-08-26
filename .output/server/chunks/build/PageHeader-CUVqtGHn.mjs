import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { mergeProps, withCtx, openBlock, createBlock, createCommentVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';

const _sfc_main = {
  __name: "PageHeader",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    icon: { type: String, default: "fas fa-file-alt" },
    breadcrumbs: { type: Array, default: () => [] }
    // [{ label: 'Home', to: { name: 'home' } }]
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 lg:py-20 overflow-hidden" }, _attrs))}><div class="absolute inset-0 opacity-10"><svg class="absolute right-0 top-0 h-full w-1/2 transform translate-x-1/3" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="0,100 100,0 100,100" fill="currentColor"></polygon></svg><div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div><div class="absolute bottom-10 right-20 w-48 h-48 bg-blue-400 rounded-full blur-3xl"></div></div><div class="container mx-auto px-4 lg:px-8 relative z-10"><div class="max-w-4xl">`);
      if (__props.breadcrumbs && __props.breadcrumbs.length) {
        _push(`<nav class="flex items-center gap-2 text-sm font-medium text-blue-200 mb-6"><!--[-->`);
        ssrRenderList(__props.breadcrumbs, (crumb, index) => {
          _push(`<!--[-->`);
          if (crumb.to) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: crumb.to,
              class: "hover:text-white transition-colors flex items-center gap-1.5"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (index === 0) {
                    _push2(`<i class="fas fa-home text-xs"${_scopeId}></i>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(` ${ssrInterpolate(crumb.label)}`);
                } else {
                  return [
                    index === 0 ? (openBlock(), createBlock("i", {
                      key: 0,
                      class: "fas fa-home text-xs"
                    })) : createCommentVNode("", true),
                    createTextVNode(" " + toDisplayString(crumb.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<span class="text-white">${ssrInterpolate(crumb.label)}</span>`);
          }
          if (index < __props.breadcrumbs.length - 1) {
            _push(`<i class="fas fa-chevron-right text-[10px] text-blue-400/60"></i>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></nav>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-start gap-6">`);
      if (__props.icon) {
        _push(`<div class="hidden sm:flex w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center flex-shrink-0 shadow-xl"><i class="${ssrRenderClass([__props.icon, "text-3xl text-white"])}"></i></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div><h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">${ssrInterpolate(__props.title)}</h1>`);
      if (__props.subtitle) {
        _push(`<p class="text-lg text-blue-100 max-w-2xl leading-relaxed">${ssrInterpolate(__props.subtitle)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div><div class="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none"><svg class="relative block w-full h-[30px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.5,193,109.1,236.46,101.81,279.7,80.12,321.39,56.44Z" fill="#f9fafb"></path></svg></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PageHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=PageHeader-CUVqtGHn.mjs.map
