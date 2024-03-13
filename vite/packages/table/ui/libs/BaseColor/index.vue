<template>
  <XtTitle v-if="text">{{ text }}</XtTitle>
  <color-picker :shape="shape" v-model:pureColor="colorData" @pureColorChange="colorClick()" />
</template>

<script>
export default {
  components: {
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
    shape:{
      type:String,
      default:'square'
    }
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
</style>
