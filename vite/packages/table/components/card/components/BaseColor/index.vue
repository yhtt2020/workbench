<template>
  <XtTitle v-if="text">{{ text }}</XtTitle>
  <colorPicker v-model:hex="colorData" />
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
    // data(newV) {
    //   this.colorData = newV;
    // },
  },
};
</script>

<style lang="scss" scoped>
:deep(.zs-color-picker-btn) {
  width: 56px !important;
  height: 56px !important;
  margin: 9.5px;
  border: 0;
  background-image: none;
}
:deep(.zs-color-picker-btn .zs-color-picker-btn-color) {
  border: 0px !important;
  border-radius: 12px !important;
}
</style>
