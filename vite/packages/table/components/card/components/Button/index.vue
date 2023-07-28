<template>
  <div class="xt-active" :style="[customStyle]" :class="[typeClass]">
    <template v-if="iconPosition == 'prefix'">
      <Icon
        v-if="icon"
        :icon="icon"
        :class="[icon ? 'mr-2' : '']"
        :style="iconSize"
      ></Icon>
    </template>
    <div :style="textSize">
      <slot>{{ text }}</slot>
    </div>
    <template v-if="iconPosition == 'postfix'">
      <Icon
        v-if="icon"
        :icon="icon"
        :class="[icon ? 'ml-2' : '']"
        :style="iconSize"
      ></Icon>
    </template>
  </div>
</template>

<script>
export default {
  name: "XtButton",
  props: {
    // 有prefix  postfix
    iconPosition: {
      default: "prefix",
    },
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
};
</script>

<style lang="scss" scoped></style>
