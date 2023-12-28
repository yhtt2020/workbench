<template>
  <xt-modal v-model="visible" full :footer="0" boxClass="px-3 pt-3">
    <template #header-center>
      <xt-tab
        v-model="currentTab"
        :list="TabList"
        style="width: 248px"
        class="xt-bg-t-2 p-1"
        :boxStyle="{ 'border-radius': '10px' }"
        :itemStyle="{ 'border-radius': '6px' }"
      ></xt-tab>
    </template>
    <div style="width: 452px" v-if="currentTab == 'attribute'">
      <xt-option-from :options="attributeOptions" :data="data">
        <template #custom>  </template>
      </xt-option-from>
    </div>
    <div v-else style="width: 452px">
      等待小胡实现111
      <xt-option-from :options="appearanceNameOptions" :data="data" />
      <xt-option-from :options="appearanceOptions" :data="data" />
      <xt-option-from :options="appearanceColorOptions" :data="data" />
    </div>
  </xt-modal>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import {
  attributeOptions,
  appearanceNameOptions,
  appearanceOptions,
  appearanceColorOptions,
} from "./options";

const props = defineProps({
  modelValue: {},
  tab: {
    default: "attribute",
  },
  data: {},
});
const TabList = [
  {
    name: "属性",
    value: "attribute",
  },
  {
    name: "外观",
    value: "appearance",
  },
];
const currentTab = ref(props.tab);
const { modelValue } = toRefs(props);

const visible = ref(modelValue.value);
const emits = defineEmits(["update:modelValue"]);
watch(modelValue, (val) => {
  visible.value = val;
});

watch(visible, (val) => {
  emits("update:modelValue", val);
});


</script>

<style lang="scss" scoped></style>
