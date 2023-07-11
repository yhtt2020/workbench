<template>
  <div
    class="p-3 flex flex-col"
    :class="[
      isFull ? 'xt-modal fixed left-0 right-0 top-0 bottom-0 rounded-none' : '',
      boxClass,
    ]"
    style="z-index: 999; border: 0px solid red; width: 100%; height: 100%"
  >
    <header class="flex items-center mb-3">
      <div class="w-full">
        <slot name="header"></slot>
      </div>
      <div class="ml-4 xt-btn w-12 h-12 cursor-pointer" @click="fullClick()">
        <Icon icon="fullscreen" style="font-size: 26px"></Icon>
      </div>
    </header>
    <main class="w-full h-full">
      <slot name="main"></slot>
    </main>
  </div>
</template>

<script>
export default {
  props: {
    boxClass: {
      type: String,
      default: "xt-bg",
    },
  },
  data() {
    return {
      isFull: false,
    };
  },
  computed: {},
  methods: {
    fullClick() {
      this.isFull = !this.isFull;
    },
  },
};
</script>

<style lang="scss" scoped></style>
