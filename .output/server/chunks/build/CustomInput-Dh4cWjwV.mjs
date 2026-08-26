import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {
  __name: "CustomInput",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: [String, Number],
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    icon: {
      type: String,
      default: ""
    }
  },
  emits: ["update:modelValue"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative w-full" }, _attrs))} data-v-52e87cbf>`);
      if (__props.icon) {
        _push(`<i class="${ssrRenderClass([__props.icon, "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[12px]"])}" data-v-52e87cbf></i>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderAttr("type", __props.type)}${ssrRenderAttr("value", __props.modelValue)}${ssrRenderAttr("placeholder", __props.placeholder)} class="${ssrRenderClass([
        "w-full py-2.5 text-xs bg-transparent focus:outline-none font-bold text-gray-600 rounded-2xl transition-all hover:bg-gray-50/50 focus:bg-white focus:shadow-sm focus:ring-2 focus:ring-blue-500/20 custom-input",
        __props.icon ? "pl-10 pr-4" : "px-4"
      ])}" data-v-52e87cbf></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CustomInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CustomInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-52e87cbf"]]);

export { CustomInput as C };
//# sourceMappingURL=CustomInput-Dh4cWjwV.mjs.map
