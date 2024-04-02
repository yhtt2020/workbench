<script setup lang="ts">
import WujieVue from "wujie-vue3";
import { useTTAppStore } from "../../store";
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
      return iframeWindow;
    },
  };
  return res;
};
</script>

<template>
  <!-- || 'http://localhost:5173/' -->
  <WujieVue
    height="100%"
    ref="wujie"
    :name="name"
    :url="url"
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
