<template>
  <div class="" :style="{ zIndex: zIndexValue }">
    <slot></slot>
  </div>
  <template v-if="to == 'body'">
    <Teleport to="body">
      <div
        v-if="modelValue == true"
        class="h-full w-full xt-mask fixed top-0 left-0 ring-0 bottom-0"
        style="z-index: 99990"
        @click.stop.self="close()"
      ></div>
    </Teleport>
  </template>
  <template v-else>
    <div
      v-if="modelValue == true"
      class="h-full w-full xt-mask fixed top-0 left-0 ring-0 bottom-0"
      style="z-index: 99990"
      @click.stop.self="close()"
    ></div>
  </template>
</template>

<script>
export default {
  props: {
    modelValue: {
      default: true,
    },
    to: {
      default: "body",
    },
  },
  computed: {
    zIndexValue() {
      return this.modelValue ? 999999 : null;
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
