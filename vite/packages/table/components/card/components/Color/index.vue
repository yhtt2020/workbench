<template>
  <div class="text-base my-3" v-if="title">{{ title }}颜色</div>
  <div>自定义</div>
  <XtBaseColor v-model:data="colorData"></XtBaseColor>

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
  <XtButton v-if="btnText" @click="btnClick()" w="150" class="my-2">
    恢复默认主题颜色
  </XtButton>
</template>

<script>
import { colorList } from "./color";
export default {
  name: "XtColor",

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

<style lang="scss" scoped></style>
