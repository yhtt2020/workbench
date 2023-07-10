<template>
  <Title> 图标形状 </Title>
  <Radio v-model:data="edit.imgShape" :list="shapeList" text=""></Radio>
</template>

<script>
import Radio from "../../../../card/components/radio/index.vue";
import editMixins from "../hooks/mixins";
import { shapeList } from "../hooks/config";
export default {
  mixins: [editMixins],
  components: {
    Radio,
  },
  data() {
    return {
      shape: "square",
      shapeList,
    };
  },
};
</script>

<style lang="scss" scoped></style>
