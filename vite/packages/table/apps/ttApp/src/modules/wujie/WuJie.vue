<script setup lang="ts">
import WujieVue from "wujie-vue3";
import { useTTAppStore } from "../../store";
import { ref, onUnmounted } from "vue";
import browser from "../../../../../js/common/browser";
const ttappStore: any = useTTAppStore();

const props = defineProps({
  name: {
    default: "wujie",
  },
  url: {
    type: String,
  },
});

const { bus, setupApp, preloadApp, destroyApp } = WujieVue;
onUnmounted(() => {
  destroyApp(props.name);
});

const plugins = (iframeWindow: any) => {
  let res = {
    windowPropertyOverride: (iframeWindow) => {
      // 屏蔽子应用parent对象 指向主应用window
      iframeWindow.parent = {};
      // 屏蔽子应用$wujie对象
      iframeWindow.$wujie = {};
      // 代理open方法
      iframeWindow.open = function (url, target, features, replace) {
        console.log("URL:", url);
        console.log("Target:", target);
        console.log("Features:", features);
        console.log("Replace:", replace);
        browser.openInUserSelect(url);
      };
      return iframeWindow;
    },
    // 在子应用所有的css之前
    cssBeforeLoaders: [
      // 强制使子应用body定位是relative
      { content: "body{position: relative !important}" },
    ],
  };
  return res;
};
//这段代码是修改默认虚拟iframe的地址的，在某种情况下需要指定src
const attrs: any = ref({});
if (location.href.startsWith("tsbapp://")) {
  attrs.value.src = "tsbapp://table.com/index.html";
}
</script>

<template>
  <WujieVue
    height="100%"
    width="100%"
    ref="wujie"
    :name="name"
    :url="url"
    :attrs="attrs"
    :plugins="[
      {
        jsBeforeLoaders: [
          {
            // 子应用可以通过 window.tt 访问父应用的 tt 对象
            content: 'window.tt = window.parent.tt',
          },
        ],
      },
      plugins(),
    ]"
  />
</template>
<style lang="scss" scoped></style>
