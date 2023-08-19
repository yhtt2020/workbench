<template>
  <div
    class="flex justify-between items-center relative"
    :class="[titleClass, typeClass]"
  >
    <div
      class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-lg"
      v-if="title"
    >
      {{ title }}
    </div>
    <div>
      <slot></slot>
    </div>
    <div>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    typeClass() {
      let typeList = {
        default: "xt-text text-base ",
        header: "xt-text text-lg ",
        text: "xt-text-2 text-sm",
      };
      return typeList[this.type] + ` ${this.m + "-" + this.spacing}`;
    },
  },
  props: {
    title: {},
    m: {
      default: "my",
    },
    spacing: {
      type: String,
      default: 3,
    },
    titleClass: {
      default: "",
    },
    type: {
      default: "default",
    },
  },
};
</script>

<style lang="scss" scoped></style>
