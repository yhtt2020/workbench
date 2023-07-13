<template>
  <Title>
    图标背景
    <template #right>
      <a-switch v-model:checked="edit.isBackground"></a-switch>
    </template>
  </Title>
  <Color v-if="edit.isBackground" v-model:color="edit.backgroundColor"></Color>
</template>

<script>
import Color from "../../../../card/components/color/index.vue";
import editMixins from "../hooks/mixins";
export default {
  mixins: [editMixins],
  components: { Color },
};
</script>

<style lang="scss" scoped></style>
