<template>
  <XtTitle> 图标形状 </XtTitle>
  <XtRadio v-model:data="edit.imgShape" :list="shapeList" text="" :space="20"></XtRadio>
</template>

<script>
import editMixins from "../hooks/mixins";
import { shapeList } from "../hooks/config";
export default {
  mixins: [editMixins],
  data() {
    return {
      shape: "square",
      shapeList,
    };
  },
};
</script>

<style lang="scss" scoped></style>
