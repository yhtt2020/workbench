<template>
  <a-select
    style="z-index: 99999999; position: relative"
    v-model:value="data"
    class="no-drag w-full rounded-xl"
    size="large"
    @change="handleChange"
    :dropdownStyle="{
      'z-index': 999999999999,
      backgroundColor: 'var(--secondary-bg)',
      backgroundColor: 'red',
    }"
  >
    <a-select-option class="no-drag" v-for="item in list" :value="item.value"
      >{{ item.name }}
    </a-select-option>
  </a-select>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
const props = defineProps({
  modelValue: {
    default: "默认排序",
  },
  list: {
    default: () => {
      return [
        { value: "默认排序", name: "默认排序" },
        { value: "下载次数", name: "下载次数" },
        { value: "更新时间", name: "更新时间" },
      ];
    },
  },
});

let data = reactive(props.modelValue);
const emits = defineEmits(["update:modelValue",'cb']);

const handleChange = (value) => {
  emits("update:modelValue", value);
  emits("cb", value);
};

watch(
  () => props.modelValue,
  (newV) => {
    // data = newV;
    data = newV;
  }
);
</script>

<style lang="scss" scoped>
:deep(.ant-select-selector) {
  border-radius: 12px !important;
  width: 100% !important;
}
</style>
