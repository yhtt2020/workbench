<template>
  <Title> 组件大小 </Title>
  <Radio v-model:data="edit.size" :list="sizeList" text=""></Radio>
</template>

<script>
import Radio from "../../../../card/components/radio/index.vue";
import { sizeList } from "../hooks/config";

import editMixins from "../hooks/mixins";
export default {
  mixins: [editMixins],
  components: {
    Radio,
  },
  data() {
    return { sizeList };
  },
};
</script>

<style lang="scss" scoped></style>
