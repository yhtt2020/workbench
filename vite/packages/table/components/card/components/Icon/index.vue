<template>
  <div :class="typeClass" :style="customStyle" class="xt-active">
    <Icon :icon="icon" :style="fontSizeStyle"></Icon>
  </div>
</template>

<script>
export default {
  name: "XtIcon",
  computed: {
    // 自定义宽高
    customStyle() {
      return {
        width: this.w + "px",
        height: this.h + "px",
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
