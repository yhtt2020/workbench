<template>
  <Teleport to="body">
    <div
      v-if="modelValue == true"
      class="h-full w-full xt-mask fixed top-0 left-0 ring-0 bottom-0"
      style="z-index: 90010"
      @click.stop.self="close()"
    ></div>
  </Teleport>
  <div class="" :style="{ zIndex: zIndexValue }"><slot></slot></div>
</template>

<script>
export default {
  props: {
    modelValue: {
      default: true,
    },
  },
  computed: {
    zIndexValue() {
      return this.modelValue ? 999919 : null;
    },
  },
  methods: {
    close() {
      // 在这里处理关闭逻辑
    },
  },
};
</script>

<style lang="scss" scoped></style>
