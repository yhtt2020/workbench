<script setup lang="ts">
import WujieVue from "wujie-vue3";
import { useTTAppStore } from "../../store";
import { ref, onUnmounted, onMounted, watch } from "vue";
import { EventTargetPlugin, SelectionPlugin } from "wujie-polyfill";

import { useWuJiePlugins } from "./useWuJiePlugins";
const ttappStore: any = useTTAppStore();

const props = defineProps({
  cardContainer: {},
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
const emit = defineEmits(["cardContainer"]);
onMounted(() => {});
const randomName = "" + Date.now();

const { bus, setupApp, preloadApp, destroyApp } = WujieVue;
bus.$on("card-data-change", () => {
  console.log("数据更新 :>> ");
  emit("cardContainer");
});
onUnmounted(() => {
  bus.$clear();
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
    :props="{ cardContainer: cardContainer }"
    :plugins="[
      {
        jsBeforeLoaders: [
          {
            content: `window.Selection = window.parent.Selection`,
          },
        ],
        jsLoader: (code) => {
          return code
            .replace('n.isCollapsed', 'n.baseOffset === n.focusOffset')
            .replace('n.collapsed', 'n.startOffset === n.endOffset');
        },
      },
      EventTargetPlugin(),
      SelectionPlugin(),
      useWuJiePlugins(id, id),
    ]"
  />
</template>
<style lang="scss" scoped></style>
