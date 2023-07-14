<template>
  <div class="xt-active" :style="[customStyle]" :class="[typeClass]">
    <Icon v-if="icon" :icon="icon" :style="iconSize"></Icon>
    <div :class="[icon ? 'ml-2' : '']" :style="textSize">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "XtButton",
  computed: {
    // 自定义宽高
    customStyle() {
      return {
        width: this.w + "px",
        height: this.y + "px",
      };
    },
    textSize() {
      let sizeList = {
        default: {
          fontSize: "16px",
        },
        mini: {
          fontSize: "14px",
        },
        big: {
          fontSize: "18px",
        },
      };
      return sizeList[this.size];
    },
    iconSize() {
      let sizeList = {
        default: {
          fontSize: "18px",
        },
        mini: {
          fontSize: "16px",
        },
        big: {
          fontSize: "20px",
        },
      };
      return sizeList[this.size];
    },
    typeClass() {
      let typeLIst = {
        default: "xt-btn",
        theme: "xt-theme-btn",
        error: "xt-error-btn",
        warn: "xt-warn-btn",
        link: "xt-link-btn",
        success: "xt-success-btn",
      };
      return typeLIst[this.type];
    },
  },
  props: {
    // 有 default theme error warn link success
    type: {
      type: String,
      default: "default",
    },
    icon: {
      type: String,
    },
    text: {},
    // 有 mini default big
    size: {
      type: Number,
      default: "default",
    },
    w: {
      type: Number,
      default: 120,
    },
    y: {
      type: Number,
      default: 48,
    },
  },
};
</script>

<style lang="scss" scoped></style>
