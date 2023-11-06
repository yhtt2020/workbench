<template>
  <button
    @click.stop="handleClick"
    :disabled="disabled"
    class="xt-text text-base flex items-center justify-center"
    :class="[buttonStyle]"
    :style="{
      width: block ? '100%' : w + 'px',
      height: h + 'px',
      'border-radius': radius + 'px',
    }"
  >
    <slot name="prefix" v-if="iconPosition == 'prefix'">
      <xt-new-icon v-if="icon" :icon="icon" :size="iconSize" />
    </slot>
    <span class="">
      <slot></slot>
    </span>
    <slot name="postfix" v-if="iconPosition == 'postfix'">
      <xt-new-icon v-if="icon" :icon="icon" :size="iconSize" />
    </slot>
  </button>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { useThrottleFn } from "@vueuse/core";

const props = defineProps({
  // 节流时间
  throttleTime: {
    type: Number || String,
    default: 500,
  },
  // 宽度
  w: {
    type: Number || String,
    default: 120,
  },
  // 高度
  h: {
    type: Number || String,
    default: 48,
  },
  // 圆角
  radius: {
    type: Number || String,
    default: 12,
  },
  /**
   * 按钮类型 default theme error warn link success
   */
  type: {
    type: String,
    default: "default",
  },
  // 图标
  icon: {},
  // 图标位置 prefix postfix
  iconPosition: {
    default: "prefix",
  },
  // 图标大小
  iconSize: {
    type: Number || String,
    default: 24,
  },
  // 禁用状态
  disabled: {
    type: Boolean,
  },
  // 将按钮适合其父宽度
  block: {
    type: Boolean,
  },
  // 另一种风格的按钮
  plain: {
    type: Boolean,
  },
});
const { throttleTime, type, disabled, block, plain } = toRefs(props);

const emits = defineEmits(["click"]);
const handleClick = useThrottleFn(() => {
  emits("click");
}, throttleTime.value);

const buttonStyle = computed(() => {
  return disabled.value
    ? " xt-disabled-btn "
    : ` xt-${type.value}${plain.value ? "-plain" : ""}-btn xt-active `;
});
</script>

<style lang="scss" scoped>
@import "./style.scss";
button {
  cursor: pointer;
  border: none;
  padding: 0;
}
</style>
