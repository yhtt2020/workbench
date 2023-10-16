<template>
  <!-- 弹窗层 -->
  <div
    v-if="modelValue"
    class="xt-text xt-modal xt-shadow fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl p-3"
    :style="{
      'z-index': boxIndex,
    }"
  >
    <!-- 头部 -->
    <header v-if="isHeader">
      <xt-text>
        <slot name="headerLeft"></slot>
        <template #centet>
          <slot name="header">
            {{ title }}
          </slot>
        </template>
        <template #right>
          <div class="flex items-center">
            <slot name="headerRight"></slot>
            <xt-new-icon
              icon="fluent:dismiss-16-filled"
              bgClass="xt-bg-2"
              @click="colseClick()"
            />
          </div>
        </template>
      </xt-text>
    </header>
    <!-- 主体 -->
    <main class="mt-3">
      <slot>主体默认内容</slot>
    </main>
    <!-- 尾部 -->
    <slot name="footer">
      <footer v-if="isFooter" class="flex justify-center items-center mt-3">
        <xt-button class="mr-3" @click="colseClick()">取消</xt-button>
        <xt-button type="theme" @click="okClick()">确认</xt-button>
      </footer>
    </slot>
  </div>
  <!-- 遮罩层 -->
  <div
    v-if="modelValue"
    @click.stop.self="colseClick()"
    class="xt-mask h-full w-full fixed top-0 left-0 ring-0 bottom-0"
    :style="{
      'z-index': maskIndex,
    }"
  ></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
const props = defineProps({
  // 遮罩层级
  maskIndex: {
    default: 999,
  },
  // 弹窗层级
  boxIndex: {
    default: 1000,
  },
  // 标题
  title: {
    default: "默认标题",
  },
  // 窗口显示状态
  modelValue: {
    default: true,
  },
  // 按esc关闭窗口
  esc: {
    default: false,
  },
  // 快速关闭底部
  isFooter: {
    default: true,
  },
  // 快速关闭头部
  isHeader: {
    default: true,
  },
});
const emits = defineEmits(["close", "ok", "modelValue"]);

// 关闭
const colseClick = () => {
  emits("update:modelValue", false);
  emits("close");
};

// 完成
const okClick = () => {
  emits("update:modelValue", false);
  emits("ok");
};

// esc关闭
const handleEscKeyPressed = (event) => {
  if (props.esc && event.keyCode === 27) {
    colseClick();
  }
};
onMounted(() => {
  window.addEventListener("keydown", handleEscKeyPressed, {
    capture: true,
  });
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleEscKeyPressed, {
    capture: true,
  });
});
</script>

<style lang="scss" scoped></style>
