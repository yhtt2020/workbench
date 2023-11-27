<!-- 小组件放置层 -->
<template>
  <div ref="container">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../desk/freeLayout/store";

const emits = defineEmits(["widgetSize"]);
const container = ref(null);

onMounted(() => {
  // console.log("onMounted");
  const containerRef = container.value;
  // console.log("containerRef :>> ", containerRef.getBoundingClientRect());
  let obj = {
    width: containerRef.getBoundingClientRect().width,
    height: containerRef.getBoundingClientRect().height,
  };
  emits("update:widgetSize", obj);
});
</script>

<style lang="scss" scoped></style>
