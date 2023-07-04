<template>
  <div class="text-base my-3" v-if="title">{{ title }}颜色</div>
  <div>自定义</div>
  <colorPicker v-model:hex="colorData" />
  <div>系统预设</div>
  <div class="flex flex-wrap">
    <div
      @click="colorData = colorList[`${'color' + i}`]"
      v-for="i in colorLength"
      :style="{ background: colorList[`${'color' + i}`] }"
      style="margin: 9.5px"
      class="w-14 h-14 rounded-xl cursor-pointer"
    ></div>
  </div>
  <div
    v-if="btnText"
    @click="btnClick()"
    class="xt-btn h-12 my-4 px-2"
    style="width: 150px"
  >
    恢复默认主题颜色
  </div>
</template>

<script>
import { colorList } from "./color";
export default {
  data() {
    return {
      colorList,
      colorData: this.color,
    };
  },
  props: {
    color: {
      type: String,
      default: "",
    },
    title: {
      type: String,
    },
    btnText: {
      type: String,
    },
  },
  mounted() {
    if (this.color == "none") this.colorData = "";
    else this.colorData = this.color;
  },
  computed: {
    colorLength() {
      return Object.keys(this.colorList).length;
    },
  },
  watch: {
    colorData(newV) {
      this.$emit("update:color", newV);
    },
  },
  methods: {
    btnClick() {
      this.$emit("onBtnClick", this.color);
    },
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
  border: 0px;
  border-radius: 12px !important;
}
</style>
