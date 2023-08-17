<template>
  <XtTitle> 图标状态 </XtTitle>
  <XtRadio v-model:data="edit.imgState" :list="imgStateList" text=""></XtRadio>
</template>

<script>
import { imgStateList } from "../hooks/config";

import editMixins from "../hooks/mixins";
export default {
  mixins: [editMixins],
  data() {
    return {
      imgStateList,
    };
  },
};
</script>

<style lang="scss" scoped></style>
