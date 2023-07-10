<template>
  <Title> 图标状态 </Title>
  <Radio v-model:data="edit.imgState" :list="imgStateList" text=""></Radio>
</template>

<script>
import Radio from "../../../../card/components/radio/index.vue";
import { imgStateList } from "../hooks/config";

import editMixins from "../hooks/mixins";
export default {
  mixins: [editMixins],
  components: {
    Radio,
  },
  data() {
    return {
      imgStateList,
    };
  },
};
</script>

<style lang="scss" scoped></style>
