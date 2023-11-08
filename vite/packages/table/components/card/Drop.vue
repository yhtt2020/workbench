<!-- 小组件放置层 -->
<template>
  <div ref="container" v-resize="handleMenuViewport">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../desk/freeLayout/store";
import { reSize as vResize } from "../../ui/components/Menu/useElementResize";
// @vueuse
// 初始化操作
const freeLayoutStore = useFreeLayoutStore();

const { getFreeLayoutData, getFreeLayoutState } = storeToRefs(freeLayoutStore);

const emits = defineEmits(["widgetSize"]);
const container = ref(null);
const widgetSize = ref({
  width: 0,
  height: 0,
});
const handleMenuViewport = (size) => {
  widgetSize.value = size;
};
watch(widgetSize, (val) => {
  emits("update:widgetSize", widgetSize.value);
});
</script>

<style lang="scss" scoped>
a {
  color: aqua;
}
</style>
