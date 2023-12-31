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
        <!-- 标题 -->
        <div class="flex items-center">
          <div class="mr-4">
            <xt-new-icon
              icon="fluent:info-12-filled"
              :style="[typeStyle]"
            />
          </div>
          <span>{{ title }}</span>
        </div>
        <!-- 内容 -->
        <div class="xt-text-2 my-4" style="margin-left: 40px; max-width: 316px">
          {{ content }}
        </div>
        <!-- 按钮 -->
        <div class="flex justify-end items-center">
          <xt-button v-if="noText" w="64" h="40" @click="onCancelClick()">
            <span class="xt-text-2">{{ noText }}</span>
          </xt-button>
          <xt-button
            v-if="okText"
            w="64"
            h="40"
            class="ml-3"
            type="theme"
            @click="onConfirmClick()"
            >{{ okText }}
          </xt-button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// confirm 是可以通过方法调用来展示的 需要手动导入组件
import { ref, toRefs, onMounted ,computed} from "vue";
import XtButton from "../../libs/Button/index.vue";
import XtNewIcon from "../../libs/NewIcon/index.vue";
export interface ConfirmProps {
  // 标题
  title?: string | undefined;
  // 描述
  content?: string | undefined;
  // 取消按钮文本
  noText?: string | boolean | undefined;
  // 确定按钮文本
  okText: string | undefined;
  // 动画时长
  duration: string;
  // 确认框层级
  index: string | number;
  // 是否使用遮罩层
  mask?: boolean;
  // 遮罩层层级
  maskIndex?: string | number;
  // 取消按钮事件
  no?: Function;
  // 确定按钮事件
  ok?: Function;
  // 关闭 confirm 的回调
  close?: Function;
  // icon 的样式类型 （默认：link）
  type?: 'error' | 'link' |"success" |"warning"
}


const props = withDefaults(defineProps<ConfirmProps>(), {
  title: "",
  content: "",
  noText: "取消",
  okText: "确定",
  duration: "0.3s",
  index: 1001,
  mask: false,
  maskIndex: 1000,
  no: () => {},
  ok: () => {},
  close: () => {},
  type:"success"
});
const { close, duration, no, ok,type }: any = toRefs(props);
// 控制显示
const isVisible = ref(false);
const show = () => {
  isVisible.value = true;
};
const typeStyle = computed(()=>{

  return { color: `var(--${type.value})  !important`}
})
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
