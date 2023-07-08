<template>
  <Title> 图标显示状态 </Title>
  <Radio v-model:data="_imgState" :list="imgStateList" text=""></Radio>
</template>

<script>
import Radio from "../../../card/components/radio/index.vue";
import { imgStateList } from "./edit";
import editConfig from "../hooks/editConfig";
export default {
  mixins: [editConfig],
  components: { Radio },
  data: {
    imgStateList,
  },
};
</script>

<style lang="scss" scoped></style>
