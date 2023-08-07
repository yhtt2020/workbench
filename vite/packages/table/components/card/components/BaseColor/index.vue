<template>
  <XtTitle v-if="text">{{ text }}</XtTitle>
  <colorPicker v-model:hex="colorData" @click="colorClick()" />
</template>

<script>
import ColorPicker from "colorpicker-v3";
import "colorpicker-v3/style.css";
export default {
  components: {
    ColorPicker,
  },
  data() {
    return {
      colorData: this.data,
    };
  },
  props: {
    data: {
      type: String,
      default: "",
    },
    data: {
      type: String,
      default: "",
    },
  },
  watch: {
    colorData(newV) {
      this.$emit("update:data", newV);
    },
    data(newV) {
      this.colorData = newV;
    },
  },
  methods: {
    colorClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.zs-color-picker-btn) {
  border: none !important;
  background-image: none;
}

:deep(.zs-color-picker-btn .zs-color-picker-btn-color) {
  border: none !important;
}
:deep(.zs-color-picker-panel__visible) {
  z-index: 99999 !important;
}
</style>
