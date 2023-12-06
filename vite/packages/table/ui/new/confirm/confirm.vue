<template>
  <div>
    <!-- 蒙版 -->
    <Transition name="fade">
      <div
        v-if="isVisible && mask"
        @click="onCloseClick"
        class="w-full h-full fixed top-0 left-0 xt-mask"
        :style="{
          'z-index': maskIndex,
        }"
      ></div>
    </Transition>
    <!-- 内容 -->
    <Transition name="up">
      <div
        v-if="isVisible"
        class="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl xt-modal xt-shadow p-4 xt-text text-base"
        style="
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
        "
        :style="{
          'z-index': index,
        }"
      >
        <div class="flex items-center">
          <div class="mr-4">
            <slot name="icon">
              <xt-new-icon
                icon="fluent:info-12-filled"
                style="color: var(--warning) !important"
              />
            </slot>
          </div>

          <span>{{ title }}</span>
        </div>
        <div class="xt-text-2 my-4" style="margin-left: 40px; max-width: 316px">
          {{ content }}
        </div>
        <!-- 按钮 -->

        <div class="flex justify-end items-center">
          <xt-button w="64" h="40" @click="onCancelClick()">
            <span class="xt-text-2">{{ noText }}</span>
          </xt-button>
          <xt-button
            w="64"
            h="40"
            class="ml-3"
            type="theme"
            @click="onConfirmClick()"
            >{{ okText }}</xt-button
          >
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// confirm 是通过方法调用来展示的 需要手动导入组件
import { ref, toRefs, onMounted } from "vue";
import XtButton from "../../libs/Button/index.vue";
import XtNewIcon from "../../libs/NewIcon/index.vue";
const props = defineProps({
  // 标题
  title: {
    type: String,
    default: "",
  },
  // 描述
  content: {
    type: String,
    default: "",
    required: true,
  },
  // 取消按钮文本
  noText: {
    type: String,
    default: "取消",
  },
  // 确定按钮文本
  okText: {
    type: String,
    default: "确定",
  },
  // 取消按钮事件
  no: {
    type: Function,
  },
  // 确定按钮事件
  ok: {
    type: Function,
  },
  // 关闭 confirm 的回调
  close: {
    type: Function,
    default: () => {},
  },
  // 动画时长
  duration: {
    type: String,
    default: "0.5s",
  },
  // 确认框层级
  index: {
    type: String || Number,
    default: 99999,
  },
  // 是否使用遮罩层
  mask: {
    type: Boolean,
    default: false,
  },
  // 遮罩层层级
  maskIndex: {
    type: String || Number,
    default: 99999,
  },
});
const { close, duration, no, ok }: any = toRefs(props);
// 控制显示
const isVisible = ref(false);
const show = () => {
  isVisible.value = true;
};

/**
 * 组件挂载时执行
 * 处理动画（render 渲染函数会直接执行）
 */
onMounted(() => {
  // 显示
  show();
});

/**
 * 关闭事件
 */
const onCloseClick = () => {
  isVisible.value = false;
  // 等待动画完全关闭后触发关闭回调
  setTimeout(() => {
    close.value && close.value();
  }, parseInt(duration.value.replace("0.", "").replace("s", "")) * 100);
};
/**
 * 取消按钮点击事件
 */
const onCancelClick = () => {
  no.value && no.value();
  onCloseClick();
};
/**
 * 确定按钮点击事件
 */
const onConfirmClick = () => {
  ok.value && ok.value();
  onCloseClick();
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all v-bind(duration);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.up-enter-active,
.up-leave-active {
  transition: all v-bind(duration);
}
.up-enter-from,
.up-leave-to {
  opacity: 0;
  transform: translate3D(-50%, 100px, 0);
}
</style>
