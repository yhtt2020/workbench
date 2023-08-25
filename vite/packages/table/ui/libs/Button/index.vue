<template>
  <div
    class="xt-active xt-base-btn"
    :style="[customStyle]"
    :class="[typeClass]"
  >
    <template v-if="iconPosition == 'prefix'">
      <XtBaseIcon
        v-if="icon"
        :icon="icon"
        :class="[icon ? 'mr-1' : '']"
        :style="iconSize"
      ></XtBaseIcon>
    </template>
    <div :style="textSize">
      <slot>{{ text }}</slot>
    </div>
    <template v-if="iconPosition == 'postfix'">
      <XtBaseIcon
        v-if="icon"
        :icon="icon"
        :class="[icon ? 'ml-1' : '']"
        :style="iconSize"
      ></XtBaseIcon>
    </template>
  </div>
</template>

<script>
import { message } from "ant-design-vue";

export default {
  name: "XtButton",
  props: {
    copy: {
      type: String,
      default: "",
    },
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
    h: {
      type: Number,
      default: 48,
    },
  },
  computed: {
    // 自定义宽高
    customStyle() {
      return {
        width: this.w + "px",
        height: this.h + "px",
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
  methods: {
    copyToClipboard() {
      if (!this.copy) return;
      navigator.clipboard
        .writeText(this.copy)
        .then(() => {
          message.success("已成功复制到剪切板");
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
