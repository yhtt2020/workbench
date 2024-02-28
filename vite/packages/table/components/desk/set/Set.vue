<template>
  <div class="flex overflow-hidden rounded-xl">
    <!-- 左侧导航栏 -->
    <div class="flex flex-col p-3 xt-main-bg" style="width: 200px">
      <div
        v-for="(item, index) in setList"
        class="flex items-center mb-3 cursor-pointer"
        style="height: 44px; border-radius: 10px"
        @click="selectSet(index)"
        :class="{ 'xt-theme-bg-2': activeIndex === index }"
      >
        <xt-ify-icon :icon="item.icon" class="mx-3" />
        {{ item.name }}
      </div>
    </div>
    <!-- 右侧功能区 -->
    <div class="p-3 pl-0 xt-modal" style="width: 492px">
      <!-- 头部 -->
      <div class="flex justify-between items-center mb-3">
        <div class="flex items-center">
          <xt-ify-icon :icon="setList[activeIndex].icon" class="mr-3" />
          {{ setList[activeIndex].name }}
        </div>
        <xt-button
          @click="closeSet"
          icon="fluent:dismiss-16-regular"
          w="32"
          h="32"
          radius="8"
          iconSize="16"
        ></xt-button>
      </div>

      <component :is="components[setList[activeIndex].component]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowReactive } from "vue";
import Common from "./Common.vue";
const components = shallowReactive({
  Common,
});
type SetItem = {
  name: string;
  icon: string;
  component: string;
};
const setList = ref<SetItem[]>([
  {
    name: "通用设置",
    icon: "fluent:settings-16-regular",
    component: "Common",
  },

  { name: "主题外观", icon: "fluent:color-24-regular", component: "" },
  { name: "设备设置", icon: "fluent:slide-settings-24-regular", component: "" },
  { name: "分屏设置", icon: "fluent:window-multiple-16-filled", component: "" },
  { name: "弹幕设置", icon: "fluent:code-text-16-regular", component: "" },
  { name: "按键设置", icon: "fluent:keyboard-16-regular", component: "" },
  { name: "开发模式", icon: "fluent:code-16-regular", component: "" },
]);

const emits = defineEmits(["close"]);

// 关闭设置
const closeSet = () => {
  emits("close", false);
  console.log("关闭设置");
};
// 选择设置
const activeIndex = ref(0);
const selectSet = (index: number) => {
  activeIndex.value = index;
};
</script>

<style lang="scss" scoped>
.active {
  border-radius: 10px;
  background: var(--primary-bg-2);
}
</style>
