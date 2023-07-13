<template>
  <Teleport to="body">
    <!-- 遮罩 -->
    <div
      class="h-full w-full xt-mask fixed top-0 left-0"
      style="z-index: 999100"
      @click="close()"
    ></div>
    <!-- 弹窗层 -->
    <div
      class="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20 p-3 xt-modal rounded-xl xt-text"
      style="z-index: 999200; box-shadow: 0px 0px 10px 0px rgb(0 0 0 / 50%)"
    >
      <!-- 头部 -->
      <header
        v-if="headerShow"
        class="flex items-center justify-center h-12 w-full relative text-lg"
      >
        {{ title }}
        <XtIcon
          class="absolute r right-0"
          @click="close()"
          icon="guanbi1"
        ></XtIcon>
      </header>
      <slot></slot>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: "XtPopup",
  methods: {
    close() {
      this.$emit("close");
    },
  },
  props: {
    title: {},
    headerShow: {
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
