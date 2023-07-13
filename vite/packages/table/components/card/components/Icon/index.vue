<template>
  <div :class="typeClass" class="w-12 h-12 xt-active ">
    <Icon :icon="icon" :style="fontSizeStyle"></Icon>
  </div>
</template>

<script>
export default {
  name: "XtIcon",
  computed: {
    fontSizeStyle() {
      return {
        "font-size": this.size + "px",
      };
    },
    typeClass() {
      if (this.type === "default") {
        return "xt-btn";
      } else if (this.type === "active") {
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
  },
};
</script>

<style lang="scss" scoped></style>
