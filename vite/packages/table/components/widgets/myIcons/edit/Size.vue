<template>
  <Radio v-model:data="_size" :list="sizeList" text="设置组件大小"></Radio>
</template>

<script>
import Radio from "../../../card/components/radio/index.vue";
import editProxy from "../hooks/editProxy";
import editProps from "../hooks/editProps";
import editData from "../hooks/editData";
export default {
  mixins: [editProxy,editProps,editData],
  components: { Radio },
  data: {
    sizeList: [
      {
        value: "mini",
        name: "1*1",
      },
      {
        value: "mini1",
        name: "2*1",
      },
      {
        value: "small",
        name: "2*2",
      },
      {
        value: "default",
        name: "2*4",
      },
      {
        value: "long",
        name: "4*2",
      },
      {
        value: "big",
        name: "4*4",
      },
    ],
  },
};
</script>

<style lang="scss" scoped></style>
