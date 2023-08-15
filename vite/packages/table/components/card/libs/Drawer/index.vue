<template>
  <a-drawer
    v-if="visible"
    :width="500"
    :height="200"
    :placement="placement"
    style="z-index: 99999999"
    v-model:visible="visible"
    @close="close()"
  >
    <slot></slot>
  </a-drawer>
</template>

<script>
export default {
  props: {
    data: {
      default: false,
    },
    placement: {
      default: "bottom",
    },
  },
  data() {
    return {
      visible: this.data,
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit("update:data", false);
    },
  },
  watch: {
    data(newV) {
      this.visible = newV;
    },
  },
};
</script>

<style lang="scss" scoped></style>
