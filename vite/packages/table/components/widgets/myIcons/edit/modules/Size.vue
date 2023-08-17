<template>
  <XtTitle> 图标大小 </XtTitle>
  <XtRadio v-model:data="edit.size" :list="sizeList" text=""></XtRadio>
</template>

<script>
import { sizeList } from "../hooks/config";

import editMixins from "../hooks/mixins";
export default {
  mixins: [editMixins],
  data() {
    return { sizeList };
  },
};
</script>

<style lang="scss" scoped></style>
