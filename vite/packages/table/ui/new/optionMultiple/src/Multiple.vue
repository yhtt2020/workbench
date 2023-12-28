<template>
  <a-select
    v-model:value="currentMultiple"
    mode="multiple"
    class="rounded-xl"
    style="width: 100%; padding: 0 !important"
    @change="handleChange"
  >
    <a-select-option class="no-drag" v-for="item in list" :value="item.value"
      >{{ item.name }}
    </a-select-option>
  </a-select>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};
interface multipleProps {
  multiple: any;
  list: any;
}
const props = withDefaults(defineProps<multipleProps>(), {});

const currentMultiple = ref(props.multiple);
const emits = defineEmits(["update:multiple", "cb"]);

watch(currentMultiple, () => {
  emits("update:multiple", currentMultiple.value);
  emits("cb", currentMultiple.value);
});
</script>

<style scoped>
:deep(.ant-select-selection-item) {
  background: var(--secondary-bg) !important;
  background: none;
  width: 96px;
  height: 28px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 8px !important;
}
/* anticon-close */
:deep(.anticon) {
  font-size: 16px;
  color: var(--secondary-text);
}
:deep(.ant-select-selector) {
  padding-bottom: 0 !important;
  background: var(--secondary-transp-bg) !important;
  border-radius: 8px !important;
  min-height: 40px;
}
</style>
