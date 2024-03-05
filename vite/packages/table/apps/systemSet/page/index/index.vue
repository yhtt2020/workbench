<template>
  <xt-modal
    v-model="systemVisible"
    :footer="false"
    boxClass=""
    :mask="0"
    :header="false"
  >
    <div class="flex overflow-hidden rounded-xl" style="height: 70vh">
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
      <div class="p-3 xt-modal h-full flex flex-col" style="width: 520px">
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
        <xt-scrollbar
          class="flex-1 w-full overflow-hidden"
          :x="false"
          :y="true"
        >
          <component
            :is="components[setList[activeIndex].component]"
            @switchNav="switchNav"
          />
        </xt-scrollbar>
      </div>
    </div>
  </xt-modal>
</template>

<script setup lang="ts">
import { ref, shallowReactive, defineAsyncComponent } from "vue";
const Common = defineAsyncComponent(() => import("../common/Common.vue"));
const Theme = defineAsyncComponent(() => import("../theme/Theme.vue"));
const develop = defineAsyncComponent(() => import("../develop/Develop.vue"));
const device = defineAsyncComponent(() => import("../device/Device.vue"));
const key = defineAsyncComponent(() => import("../key/Key.vue"));
const Screen = defineAsyncComponent(() => import("../Screen/Screen.vue"));
const barrage = defineAsyncComponent(() => import("../barrage/Barrage.vue"));
const Desk = defineAsyncComponent(() => import("../desk/Desk.vue"));

import { useGlobalStore } from "../../../global/store";

import { storeToRefs } from "pinia";
const globalStore = useGlobalStore();
const { systemVisible } = storeToRefs(globalStore);
const components = shallowReactive({
  Common,
  Theme,
  develop,
  device,
  key,
  Screen,
  barrage,
  Desk,
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

  { name: "主题外观", icon: "fluent:color-24-regular", component: "Theme" },
  {
    name: "桌面设置",
    icon: "fluent:desktop-16-regular",
    component: "Desk",
  },
  {
    name: "设备设置",
    icon: "fluent:slide-settings-24-regular",
    component: "device",
  },

  {
    name: "分屏设置",
    icon: "fluent:window-multiple-16-filled",
    component: "Screen",
  },
  {
    name: "弹幕设置",
    icon: "fluent:code-text-16-regular",
    component: "barrage",
  },
  { name: "按键设置", icon: "fluent:keyboard-16-regular", component: "key" },
  { name: "开发模式", icon: "fluent:code-16-regular", component: "develop" },
]);

const emits = defineEmits(["close"]);

// 关闭设置
const closeSet = () => {
  // emits("close", false);
  systemVisible.value = false;
  console.log("关闭设置");
};
// 选择设置
const activeIndex = ref(0);
const selectSet = (index: number) => {
  activeIndex.value = index;
};

const switchNav = (nav: string) => {
  let res = setList.value.findIndex((item) => item.component === nav);
  selectSet(res);
};
</script>

<style lang="scss" scoped>
.active {
  border-radius: 10px;
  background: var(--primary-bg-2);
}
</style>
