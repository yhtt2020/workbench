<script setup lang="ts">
import WujieVue from "wujie-vue3";
import { useTTAppStore } from "../../store";
import {ref} from "vue";
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
//这段代码是修改默认虚拟iframe的地址的，在某种情况下需要指定src
// const attrs=ref({})
// if(location.href.startsWith('tsbapp://')){
//   attrs.value.src='tsbapp://table.com/index.html'
// }
// location.href='tsbapp://table.com/table.html'
//   :attrs="attrs"
</script>
<!--    :attrs="{-->
<!--            src: 'tsbapp://table.com/index.html'-->
<!--          }"-->

<template>
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
        ]
      },
      plugins(),
    ]"
  />
</template>
<style lang="scss" scoped></style>
