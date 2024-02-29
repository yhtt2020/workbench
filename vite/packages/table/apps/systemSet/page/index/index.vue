<template>
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

      <!-- <xt-scrollbar> -->
      <!-- <div class=" overflow-hidden overflow-y-auto xt-scrollbar"> -->

      <xt-scrollbar class="flex-1 w-full overflow-hidden" :x="false" :y="true">
        <component
          :is="components[setList[activeIndex].component]"
          @switchNav="switchNav"
        />
      </xt-scrollbar>
      <!-- </div> -->
      <!-- </xt-scrollbar> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowReactive } from "vue";
import Common from "../common/Common.vue";
import Theme from "../theme/Theme.vue";
import develop from "../develop/Develop.vue";
import device from "../device/Device.vue";
import key from "../key/Key.vue";
import Screen from "../Screen/Screen.vue";
import barrage from "../barrage/Barrage.vue";

const components = shallowReactive({
  Common,
  Theme,
  develop,
  device,
  key,
  Screen,
  barrage,
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
  emits("close", false);
  console.log("关闭设置");
};
// 选择设置
const activeIndex = ref(0);
const selectSet = (index: number) => {
  activeIndex.value = index;
};

const switchNav = (nav: string) => {
  let res = setList.value.findIndex((item) => item.component === nav)
  selectSet(res);
};
</script>

<style lang="scss" scoped>
.active {
  border-radius: 10px;
  background: var(--primary-bg-2);
}
</style>
