<template>
  <div ref="box">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import {useCardSize} from '../../ui/hooks/useAddCard'
import { useFreeLayoutStore } from "../desk/freeLayout/store";
const freeLayoutStore = useFreeLayoutStore();
const { isFreeLayout } = storeToRefs(freeLayoutStore);

const props = defineProps({
  data: {},
});
const box = ref(null);
onMounted(() => {
  if (!isFreeLayout.value) return;

  const { width, height } = box.value.getBoundingClientRect();


  console.log("(width + 12) / 108 :>> ", (240 + 12) / 108);
  console.log("(width + 12) / 108 :>> ",( 420 +12) / (96 + 12));
});


/**
 *
 */
// };
//  编写一个JavaScript函数，该函数接受一个数字作为参数,比如280，并返回 w × 134 + (w - 1) × 12 = 这个数字 的 w 值
</script>

<style lang="scss" scoped></style>
