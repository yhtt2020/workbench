<template>
  <div ref="box" v-element-size="getElementSize" v-if="!customSize">
    <slot></slot>
  </div>
  <slot v-else></slot>
</template>

<script setup>
import { ref, onMounted, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { widthTotGrid, heightToGrid } from "../../ui/hooks/useCardSize";
// import { widthTotGrid, heightToGrid } from "../../ui/hooks/";
import { useFreeLayoutStore } from "../desk/freeLayout/store";
import { useElementSize, vElementSize } from "../../ui/hooks/useElementSize";
const freeLayoutStore = useFreeLayoutStore();
const { isFreeLayout } = storeToRefs(freeLayoutStore);

const props = defineProps({
  customSize: {},
});
const { customSize } = toRefs(props);
const box = ref(null);
const emits = defineEmits(["update:customSize"]);
const getElementSize = (size) => {
  const { width, height } = size;
  console.log('getElementSize :>> ', 123);
  if (width != 0 && height != 0) {
    let size = `${widthTotGrid(width)}x${heightToGrid(height)}`;
    emits("update:customSize", size);
  }
};
</script>

<style lang="scss" scoped></style>
