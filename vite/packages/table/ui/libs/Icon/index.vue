<template>
  <div>
    <div
      :class="typeClass"
      :style="customStyle"
      class="xt-active xt-base-btn"
      @click="copyToClipboard()"
    >
      <XtBaseIcon :icon="icon" :style="fontSizeStyle"></XtBaseIcon>
    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
export default {
  name: "XtIcon",
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
  computed: {
    // 自定义宽高
    customStyle() {
      return {
        width: this.w + "px",
        height: this.w + "px",
        // height: this.h + "px",
      };
    },
    fontSizeStyle() {
      return {
        "font-size": this.size + "px ",
      };
    },
    typeClass() {
      if (this.type === "default") {
        return "xt-btn";
      } else if (this.type === "theme") {
        return "xt-active-btn";
      } else {
        return "flex justify-center items-center";
      }
    },
  },
  props: {
    copy: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "default",
    },
    icon: {
      type: String,
    },
    size: {
      type: Number,
      default: 26,
    },
    // 现在只保留w了 h作废 反正是正方形
    w: {
      type: Number,
      default: 48,
    },
    h: {
      type: Number,
      default: 48,
    },
  },
};
</script>

<style lang="scss" scoped></style>
