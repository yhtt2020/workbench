<template>
  <button
    @click="handleClick"
    :disabled="disabled"
    class="flex items-center justify-center text-base xt-text"
    :class="[buttonStyle]"
    :style="{
      width: block ? '100%' : width + 'px',
      height: height + 'px',
      'border-radius': corner + 'px',
    }"
  >
    <slot name="prefix" v-if="iconPosition == 'prefix'">
      <xt-new-icon v-if="icon" :icon="icon" :size="iconSize" />
      <xt-ify-icon v-if="ifyIcon" :icon="ifyIcon" :size="iconSize" />
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
import {toRefs, computed, onMounted, ref} from "vue";
import { useThrottleFn } from "@vueuse/core";
import { message } from "ant-design-vue";

interface ButtonProps {
  // 节流时间
  throttleTime?: number;
  // 宽度
  w?: number | string;
  // 高度
  h?: number | string;
  //快速定义常用尺寸
  size?:'sm'|'md'|'lg',
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
  ifyIcon?: string;
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
}, throttleTime.value);

const buttonStyle = computed(() => {
  return disabled.value
    ? " xt-disabled-btn "
    : ` xt-${type.value}${plain.value ? "-plain" : ""}-btn xt-active `;
});

function copyToClipboard() {
  if (!copy.value) return;
  if (window.$usePlat("client")) {
    require("electron").clipboard.writeText(copy.value);
    message.success("已成功复制到剪切板");
  } else if (navigator.clipboard) {
    navigator.clipboard
      .writeText(copy.value)
      .then(function () {
        message.success("已成功复制到剪切板");
      })
      .catch(function (err) {
        console.error("Could not copy text: ", err);
      });
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
const width=ref('120')
const height=ref('80')
const corner=ref('6')
onMounted(()=>{
  if(props.size){
    switch (props.size) {
      case "lg":
        width.value='120'
        height.value='48'
        corner.value='8'
        break
      case "md":
        width.value='80'
        height.value='40'
        corner.value='6'
        break
      case "sm":
        width.value='60'
        height.value='30'
        corner.value='4'
    }
  }else{
    width.value=String(props.w)
    height.value=String(props.h)
    corner.value=String(props.radius)
  }
})
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
