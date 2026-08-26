import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { mergeProps, withCtx, openBlock, createBlock, createCommentVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = {
  __name: "Breadcrumbs",
  __ssrInlineRender: true,
  props: {
    breadcrumbs: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      default: "light"
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (__props.breadcrumbs && __props.breadcrumbs.length > 0) {
        _push(`<nav${ssrRenderAttrs(mergeProps({
          "aria-label": "Breadcrumb",
          class: "mb-4 overflow-hidden"
        }, _attrs))}><ol class="${ssrRenderClass([__props.theme === "dark" ? "text-gray-200" : "text-gray-500", "flex flex-wrap items-center text-xs md:text-sm font-semibold gap-y-2"])}"><!--[-->`);
        ssrRenderList(__props.breadcrumbs, (breadcrumb, index) => {
          _push(`<!--[-->`);
          if (index !== __props.breadcrumbs.length - 1) {
            _push(`<li class="flex items-center">`);
            if (breadcrumb.url) {
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: breadcrumb.url,
                class: "hover:text-blue-400 transition-all duration-200 flex items-center group whitespace-nowrap"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    if (breadcrumb.icon) {
                      _push2(`<i class="${ssrRenderClass([breadcrumb.icon, "mr-1.5 transition-colors", __props.theme === "dark" ? "text-gray-300 group-hover:text-blue-300" : "text-gray-400 group-hover:text-blue-500"])}"${_scopeId}></i>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`<span class="max-w-[100px] md:max-w-[200px] truncate"${_scopeId}>${ssrInterpolate(breadcrumb.title)}</span>`);
                  } else {
                    return [
                      breadcrumb.icon ? (openBlock(), createBlock("i", {
                        key: 0,
                        class: [breadcrumb.icon, "mr-1.5 transition-colors", __props.theme === "dark" ? "text-gray-300 group-hover:text-blue-300" : "text-gray-400 group-hover:text-blue-500"]
                      }, null, 2)) : createCommentVNode("", true),
                      createVNode("span", { class: "max-w-[100px] md:max-w-[200px] truncate" }, toDisplayString(breadcrumb.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<span class="flex items-center whitespace-nowrap">`);
              if (breadcrumb.icon) {
                _push(`<i class="${ssrRenderClass([breadcrumb.icon, "mr-1.5", __props.theme === "dark" ? "text-gray-300" : "text-gray-400"])}"></i>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<span class="max-w-[100px] md:max-w-[200px] truncate">${ssrInterpolate(breadcrumb.title)}</span></span>`);
            }
            _push(`<span class="${ssrRenderClass([__props.theme === "dark" ? "text-gray-400" : "text-gray-300", "mx-2"])}"><i class="fas fa-chevron-right text-[10px]"></i></span></li>`);
          } else {
            _push(`<li class="${ssrRenderClass([__props.theme === "dark" ? "text-white" : "text-blue-600", "flex items-center min-w-0"])}">`);
            if (breadcrumb.icon) {
              _push(`<i class="${ssrRenderClass([breadcrumb.icon, "mr-1.5 flex-shrink-0"])}"></i>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<span class="truncate font-bold"><span class="hidden md:inline">${ssrInterpolate(breadcrumb.title)}</span><span class="md:hidden">${ssrInterpolate(breadcrumb.title.length > 20 ? breadcrumb.title.substring(0, 20) + "..." : breadcrumb.title)}</span></span></li>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></ol></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Breadcrumbs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Breadcrumbs-CqGmUqmz.mjs.map
