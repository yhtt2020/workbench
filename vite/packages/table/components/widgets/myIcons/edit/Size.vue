<template>
  <Title>
    设置组件大小
  </Title>
  <Radio v-model:data="_size" :list="sizeList" text=""></Radio>
</template>

<script>
import Radio from "../../../card/components/radio/index.vue";
import { sizeList } from "./edit";
import editConfig from "../hooks/editConfig";
export default {
  mixins: [editConfig],
  components: { Radio },
  data: {
    sizeList,
  },
};
</script>

<style lang="scss" scoped></style>
