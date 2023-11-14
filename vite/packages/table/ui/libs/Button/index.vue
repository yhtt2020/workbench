<template>
  <button @click="handleClick" :disabled="disabled" class="flex items-center justify-center text-base xt-text"
    :class="[buttonStyle]" :style="{
      width: block ? '100%' : w + 'px',
      height: h + 'px',
      'border-radius': radius + 'px',
    }">
    <slot name="prefix" v-if="iconPosition == 'prefix'">
      <xt-new-icon v-if="icon" :icon="icon" :size="iconSize" />
    </slot>
    <span>
      <slot></slot>
    </span>
    <slot name="postfix" v-if="iconPosition == 'postfix'">
      <xt-new-icon v-if="icon" :icon="icon" :size="iconSize" />
    </slot>
  </button>
</template>

<script setup lang="ts">
import { toRefs, computed } from "vue";
import { useThrottleFn } from "@vueuse/core";
import { message } from "ant-design-vue";

interface ButtonProps {
  // 节流时间
  throttleTime?: number;
  // 宽度
  w?: number | string;
  // 高度
  h?: number | string;
  // 圆角
  radius?: number | string;
  /**
   * 按钮类型 default theme error warn link success
   */
  type?: string;
  // 图标
  icon?: any; // 这里不确定图标的具体类型，你可以根据实际需要进行替换
  // 图标位置 prefix postfix
  iconPosition?: string;
  // 图标大小
  iconSize?: number | string;
  // 禁用状态
  disabled?: boolean;
  // 将按钮适合其父宽度
  block?: boolean;
  // 另一种风格的按钮
  plain?: boolean;
  // 需要触发复制的字符串
  copy?: string;
}
const props = withDefaults(defineProps<ButtonProps>(), {
  throttleTime: 500,
  w: 120,
  h: 48,
  radius: 12,
  type: "default",
  iconPosition: "prefix",
  iconSize: 24,
  copy: "",
});
const { throttleTime, type, disabled, block, plain, copy } = toRefs(props);

const emits = defineEmits(["click"]);
const handleClick = useThrottleFn(() => {
  copyToClipboard();
  emits("click");
  console.log(throttleTime.value);

}, throttleTime.value);

const buttonStyle = computed(() => {
  return disabled.value
    ? " xt-disabled-btn "
    : ` xt-${type.value}${plain.value ? "-plain" : ""}-btn xt-active `;
});

function copyToClipboard() {
  if (!copy.value) return;

  if (navigator.clipboard) {
    try {
      navigator.clipboard.writeText(copy.value);
      message.success("已成功复制到剪切板");
    } catch (error) {
      message.error("无法复制文本到剪切板:", error);
    }
  } else {
    if (copyStr(copy.value)) {
      message.success("已成功复制到剪切板");
    } else {
      message.error("复制到剪切板失败");
    }
  }
}

function copyStr(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;

  document.body.appendChild(textarea);

  textarea.select();
  const copySuccessful = document.execCommand("copy");

  document.body.removeChild(textarea);
  return copySuccessful;
}
</script>

<style lang="scss" scoped>
@import "./style.scss";

button {
  cursor: pointer;
  border: none;
  padding: 0;
  background: none;
}
</style>
