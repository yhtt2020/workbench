<template>
  <div
    class="w-full h-full flex box-border mb-4 p-1 xt-bg-t-2"
    :style="{
      'border-radius': boxRadius + 'px',
    }"
  >
    <template v-for="(item, index) in list" :key="item.value">
      <div
        @click="tabClick(item.value)"
        class="text-sm flex flex-1 items-center justify-center relative cursor-pointer"
        :class="[currentTab === item.value ? 'active' : '']"
        :style="{
          'border-radius': tabRadius + 'px',
        }"
      >
        <div
          v-if="circle && currentTab === item.value"
          class="circle absolute top-1/2 -translate-y-1/2"
        ></div>
        {{ item.name }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
export interface tabProps {
  option?: any;
  list: any;
  modelValue: any;
  circle: boolean;
  tabRadius: number;
  boxRadius: number;
}
const props = withDefaults(defineProps<tabProps>(), {
  circle: false,
  boxRadius: 10,
  tabRadius: 8,
});

const currentTab = ref(props.modelValue);
const emits = defineEmits(["update:modelValue", "cb"]);

// watch(
//   () => props.modelValue,
//   (newV) => {
//     console.log('123 :>> ', 123);
//     currentTab.value = newV;
//   }
// );
watch(currentTab, () => {
  emits("update:modelValue", currentTab.value);
  emits("cb", currentTab.value);
});

const tabClick = (data: any) => {
  currentTab.value = data;
};
</script>

<style lang="scss" scoped>
.circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  left: 10px;
}

.active {
  background: var(--active-bg);
  color: var(--active-text);
}
</style>
