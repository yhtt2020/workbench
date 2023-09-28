<template>
  <div class="xt-active xt-base-btn" :style="boxStyle">
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
  size: {
    default: "26",
  },
  type: {
    default: "",
  },
  radius: {
    default: "12",
  },
  bg: {
    default: "var(--secondary-bg)",
  },
  color: {
    default: "#000",
  },
});

const iconSize = computed(() => {
  return {
    width: props.size + "px",
    height: props.size + "px",
  };
});

const boxStyle = computed(() => {
  if (props.type) {
    return {
      width: props.w + "px",
      height: props.w + "px",
      "border-radius": props.radius + "px",
      background: props.bg,
      color: props.color,
    };
  } else {
    return {
      width: props.size + "px",
      color: props.color,
    };
  }
});
</script>

<style lang="scss" scoped>
a {
  background: var(--secondary-bg);
}
</style>
