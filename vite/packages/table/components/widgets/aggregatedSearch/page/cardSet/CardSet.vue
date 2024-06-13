<script setup lang="ts">
import { ref, inject, onMounted, nextTick, computed } from "vue";
import Attribute from "./Attribute.vue";

const data: any = inject("data");
const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
const leftMenu = [
  {
    name: "属性设置",
    icon: "fluent:settings-16-regular",
  },
  {
    name: "小组件外观",
    icon: "fluent:color-24-regular",
  },
];
const menuIndex = ref(0);

const colorList = [
  {
    name: "默认",
    value: "default",
  },
  {
    name: "标题栏",
    value: "header",
  },
  {
    name: "自定义背景色",
    value: "custom",
  },
];
const sizeList = computed(() => {
  return [
    {
      name: data.value.noBorder ? "2x1" : "2x2",
      value: "2",
    },
    {
      name: data.value.noBorder ? "4x1" : "4x2",
      value: "4",
    },
  ];
});
</script>

<template>
  <xt-modal
    :model-value="true"
    @close="close"
    :mask="false"
    boxClass=""
    headerClass="p-4"
  >
    <!-- 导航 -->
    <template #nav>
      <div class="w-[200px] p-3 tt-main-bg h-[634px]">
        <div
          v-for="(item, index) in leftMenu"
          :key="index"
          class="flex items-center p-3 mb-3 cursor-pointer rounded-xl"
          :class="{
            'tt-theme-bg-2': menuIndex === index,
          }"
          @click="menuIndex = index"
        >
          <xt-mix-icon :icon="item.icon" class="mr-3" />
          {{ item.name }}
        </div>
      </div>
    </template>
    <!-- 头部 -->
    <template #header-left>
      <div class="flex items-center">
        <xt-mix-icon :icon="leftMenu[menuIndex].icon" class="mr-3" />
        {{ leftMenu[menuIndex].name }}
      </div>
    </template>
    <xt-scrollbar
      class="w-[468px] h-[570px] overflow-hidden px-4 pb-4"
      :y="true"
    >
      <Attribute v-if="menuIndex === 0" />
      <template v-else>
        <xt-option-box class="">
          <xt-option-info
            title="无边框模式"
            isSwitch
            v-model:switch="data.noBorder"
          />
        </xt-option-box>
        <xt-option-box>
          <xt-option-info title="小组件尺寸" />
          <xt-option-tab
            :list="sizeList"
            v-model="data.currentSize"
            circle
            style="height: 40px"
          />
        </xt-option-box>
        <xt-option-box>
          <xt-option-info title="小组件颜色" />
          <xt-option-tab
            :list="colorList"
            v-model="data.bgMode"
            circle
            style="height: 40px"
          />
          <xt-option-color
            v-model:color="data.bgColor"
            v-if="data.bgMode != 'default'"
          />
        </xt-option-box>
      </template>
    </xt-scrollbar>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
