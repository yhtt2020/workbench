<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps({
  type: { type: String },
  label: { type: String },
  key: { type: String },
  rules: { type: Array },
  modelValue: {},
});
const emits = defineEmits(["update:modelValue"]);

const data = ref(props.modelValue);

/**
 * 实现数据双向绑定
 */
watch(
  () => props.modelValue,
  (val) => {
    data.value = val;
  }
);
watch(
  () => data.value,
  (val) => {
    emits("update:modelValue", val);
  }
);
</script>

<template>
  <!-- <template v-if="type == 'input'"> -->

  <a-input v-if="type === 'input'" v-model:value="data" :key="key"/>
  <!-- </template> -->
</template>
<style lang="scss" scoped></style>
