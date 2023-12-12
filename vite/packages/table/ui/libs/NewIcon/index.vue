<template>
  <div
    class="xt-active xt-base-btn xt-text"
    :style="[boxStyle, boxBgStyle]"
    :class="[bgClass]"
    >
    <myIcon :icon="icon" :style="iconSize"></myIcon>
  </div>
</template>

<script setup>
import { Icon as myIcon } from "@iconify/vue";
import { computed } from "vue";
const props = defineProps({
  icon: {
    type: String,
    default: "majesticons:monitor-line",
  },
  w: {
    default: "48",
  },
  // 图标大小
  size: {
    default: "26",
  },
  radius: {
    default: "12",
  },
  bgClass: {
    // default: "xt-text-2",
    default: "",
  },
  bgStyle: {
    // default: "var(--secondary-bg)",
    default: "",
  },
  color: {
    default: "var(--secondary-text)",
  },
});

const iconSize = computed(() => {
  return {
    width: props.size + "px",
    height: props.size + "px",
  };
});

const boxStyle = computed(() => {
  if (props.bgStyle || props.bgClass) {
    return {
      width: props.w + "px",
      height: props.w + "px",
      "border-radius": props.radius + "px",
      color: props.color,
    };
  } else {
    return {
      width: props.size + "px",
      color: props.color,
    };
  }
});

const boxBgStyle = computed(() => {
  if (props.bgStyle) {
    return {
      background: props.bgStyle,
    };
  }
});
</script>

<style lang="scss" scoped>
a {
  background: var(--secondary-bg);
}
</style>
