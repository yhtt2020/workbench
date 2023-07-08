<template>
  <div class="flex justify-between items-center my-3">
    <div class="text-base">设置图片显示状态</div>
  </div>
  <Radio v-model:data="_imgState" :list="imgStateList" text=""></Radio>
</template>

<script>
import Radio from "../../../card/components/radio/index.vue";
import editProxy from "../hooks/editProxy";
import editProps from "../hooks/editProps";
import editData from "../hooks/editData";
export default {
  mixins: [editProxy, editProps, editData],
  components: { Radio },
  data: {
    imgStateList: [
      {
        value: "cover",
        name: "覆盖",
      },
      {
        value: "fill",
        name: "填充",
      },
      {
        value: "scale-down",
        name: "缩小",
      },
      {
        value: "contain",
        name: "包含",
      },
    ],
  },
};
</script>

<style lang="scss" scoped></style>
