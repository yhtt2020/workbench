<!-- 小组件放置层 -->
<template>
  <div ref="container" v-element-size="elementSize">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../desk/freeLayout/store";
import { vElementSize } from "./useElementSize";
// @vueuse
// 初始化操作
const freeLayoutStore = useFreeLayoutStore();

const { getFreeLayoutData, getFreeLayoutState } = storeToRefs(freeLayoutStore);

const elementSize = (size) => {
  // console.log("size :>> ", size);
  emits("update:widgetSize", size);
};
const emits = defineEmits(["widgetSize"]);
const container = ref(null);
</script>

<style lang="scss" scoped>
a {
  color: aqua;
}
</style>
