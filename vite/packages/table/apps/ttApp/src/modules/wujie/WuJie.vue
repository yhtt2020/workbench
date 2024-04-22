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
  id: {
    type: String,
    required: true,
  },
  appInfo: {
    type: Object,
    required: true,
  },
});
onMounted(() => {});
const randomName = "" + Date.now();
console.log("randomName :>> ", randomName);
const { bus, setupApp, preloadApp, destroyApp } = WujieVue;
onUnmounted(() => {
  destroyApp(randomName);
});

//这段代码是修改默认虚拟iframe的地址的，在某种情况下需要指定src
const attrs: any = ref({});
if (location.href.startsWith("tsbapp://")) {
  attrs.value.src = "tsbapp://table.com/index.html";
}
</script>

<template>
  <!-- :alive="true" -->

  <WujieVue
    height="100%"
    width="100%"
    ref="wujie"
    :name="randomName"
    :url="url"
    :attrs="attrs"
    :plugins="[
      useWuJiePlugins(id),
    ]"
  />
</template>
<style lang="scss" scoped></style>
