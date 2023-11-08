<template>
  <Teleport to="body">
    <div
      class="free-layout-mask"
      v-if="freeLayoutEnv.updatePosition"
      @click="maskClick()"
    ></div>
  </Teleport>
  <div
    class="w-full h-full relative"
    ref="container"
    :class="{
      'free-layout-container  xt-theme-b': freeLayoutEnv.updatePosition,
    }"
    @click="setPosition($event)"
    @contextmenu="contextmenu($event)"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useFreeLayoutStore } from "./store";

// 初始化操作
const freeLayoutStore = useFreeLayoutStore();
const { freeLayoutEnv, getFreeLayoutState } = storeToRefs(freeLayoutStore);
const container = ref();
function setPosition(event) {
  if (freeLayoutEnv.value.updatePosition) {
    const { left, top } = container.value.getBoundingClientRect();
    const { clientX, offsetY } = event;

    const x = clientX - left + freeLayoutEnv.value.scrollLeft;
    // + top 这里为什么不算top是正确的
    const y = offsetY + freeLayoutEnv.value.scrollTop;
    getFreeLayoutState.value.line.centerLine = {
      x,
      y,
    };

    message.success("修改中心点成功");

    freeLayoutEnv.value.updatePosition = false;
  }
}

function contextmenu(e) {
  if (freeLayoutEnv.value.updatePosition) {
    e.preventDefault();
    e.stopPropagation();
  }
}
function maskClick() {
  message.error("请点击框选区域内修改中心元素");
}
</script>

<style lang="scss" scoped>
.free-layout-container {
  position: relative;
  cursor: pointer;
  z-index: 9999999991111119;
}
.free-layout-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background: rgba(0, 0, 0, 0);
  /* 设置半透明黑色背景，可以根据需要调整 */
  z-index: 9999999999118;
  /* 设置比 .container 的 z-index 更低的值 */
}
.free-layout-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 991119;
  background: var(--mask-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(50px);
  backdrop-filter: blur(28px);
}
</style>
