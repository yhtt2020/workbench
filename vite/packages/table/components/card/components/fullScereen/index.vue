<template>
  <div
    class="flex w-full p-2"
    :class="[
      isFull ? 'xt-modal fixed left-0 right-0 top-0 bottom-0 rounded-none' : '',
      boxClass,
    ]"
    style="z-index: 9999999; border: 2px solid red"
  >
    <div>
      <slot name="left"></slot>
    </div>
    <div class="w-full xt-bg">
      <div class="flex flex-col w-full h-full">
        <header class="flex items-center mb-3">
          <div class="w-full">
            <slot name="header"></slot>
          </div>
          <div
            class="ml-4 xt-btn w-12 h-12 cursor-pointer"
            @click="fullClick()"
          >
            <Icon icon="fullscreen" style="font-size: 26px"></Icon>
          </div>
        </header>
        <main class="w-full h-full">
          <slot name="main"></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {},
    boxClass: {
      type: String,
      default: "",
    },
    model: {
      type: String,
    },
  },
  data() {
    return {
      isFull: this.data,
    };
  },
  methods: {
    fullClick() {
      this.isFull = !this.isFull;
      this.$emit("updata:data", this.isFull);
    },
  },
};
</script>

<style lang="scss" scoped></style>
