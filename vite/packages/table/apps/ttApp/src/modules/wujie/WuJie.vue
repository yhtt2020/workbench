<script setup lang="ts">
import WujieVue from "wujie-vue3";
import { ref } from "vue";
import { useTTAppStore } from "../../store";
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
  };
  return res;
};

const attrs = ref({});
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
