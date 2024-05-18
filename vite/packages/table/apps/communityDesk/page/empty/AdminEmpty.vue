<!-- 社群管理员的空白桌面 -->
<template>
  <div class="flex items-center justify-center w-full pt-6 pb-3">
    <a-avatar :src="comInfo?.icon" :size="56" shape="square" />
  </div>
  <div
    class="xt-text w-full flex items-center justify-center"
    style="font-size: 30px; font-weight: 400; font-family: '优设标题黑'"
  >
    {{ comInfo?.name }}
  </div>
  <div class="flex w-full items-center justify-center">
    <span class="xt-text-2 font-16 xt-font">
      社群桌面不支持导入win桌面应用和文件图标，仅支持工作台内置应用功能图标和网站链接图标。
    </span>
  </div>
</template>

<script setup>
import { toRefs, ref } from "vue";

const props = defineProps({
  comInfo: {
    type: Object,
    default: () => {},
  },
});
const { comInfo } = toRefs(props);

/**滚动条配置参数**/
const scrollbarSettings = {
  useBothWheelAxes: true,
  swipeEasing: true,
  suppressScrollY: false,
  suppressScrollX: true,
  wheelPropagation: true,
  currentItemId: -1,
};
</script>

<style lang="scss" scoped>
</style>