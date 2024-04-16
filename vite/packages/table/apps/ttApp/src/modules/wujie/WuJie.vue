<script setup lang="ts">
import WujieVue from "wujie-vue3";
import { useTTAppStore } from "../../store";
import { ref, onUnmounted, onMounted } from "vue";

import { useWuJiePlugins } from "./useWuJiePlugins";
const ttappStore: any = useTTAppStore();

const props = defineProps({
  name: {
    default: "wujie",
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});
onMounted(() => {});
const { bus, setupApp, preloadApp, destroyApp } = WujieVue;
onUnmounted(() => {
  destroyApp(props.name);
});

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
    :alive="true"
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
      useWuJiePlugins(name),
    ]"
  />
</template>
<style lang="scss" scoped></style>
