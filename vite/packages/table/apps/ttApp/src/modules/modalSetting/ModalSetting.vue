<script setup lang="ts">
import { ref, computed, provide } from "vue";

import AppInfo from "./comp/AppInfo.vue";
import Authority from "./comp/Authority.vue";
import Notice from "./comp/Notice.vue";
import Storage from "./comp/Storage.vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
provide("data", props.data);

const settingMenu = [
  {
    name: "应用信息",
    icon: "fluent:info-16-regular",
    fn: () => {},
    comp: AppInfo,
  },
  {
    name: "消息通知",
    icon: "fluent:alert-16-regular",
    fn: () => {},
    comp: Notice,
  },
  {
    name: "数据存储",
    icon: "fluent:hard-drive-16-regular",
    fn: () => {},
    comp: Storage,
  },
  {
    name: "隐私权限",
    icon: "",
    fn: () => {},
    comp: Authority,
  },
];
const currentIndex = ref(0);

const currentItem = computed(() => {
  return settingMenu[currentIndex.value];
});

const emits = defineEmits(["close"]);
const close = () => {
  emits("close");
};
</script>

<template>
  <!-- 设置弹窗 -->
  <div class="w-[700px] h-[634px] flex">
    <div class="w-[200px] tt-main-bg p-3">
      <div
        class="flex items-center h-[44px] rounded-[10px] mb-2 cursor-pointer"
        v-for="(item, index) in settingMenu"
        :class="{
          'tt-theme-bg-2': currentIndex == index,
        }"
        @click="currentIndex = index"
      >
        <xt-mix-icon class="mx-2" :icon="item.icon" /> {{ item.name }}
      </div>
    </div>
    <div class="flex-1 p-4">
      <div class="w-full flex justify-between items-center mb-4">
        <div class="flex items-center">
          <xt-mix-icon :icon="currentItem.icon" class="mr-2" />
          {{ currentItem.name }}
        </div>
        <xt-mix-icon
          icon="fluent:dismiss-16-regular"
          boxSize="32"
          size="16"
          boxR="8"
          @click="close"
        />
      </div>
      <xt-scrollbar :y="true" class="h-full">
        <component :is="currentItem.comp" />
      </xt-scrollbar>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
