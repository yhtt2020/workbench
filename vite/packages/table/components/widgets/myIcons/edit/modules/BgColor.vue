<template>
  <Title>
    图标背景
    <template #right>
      <a-switch v-model:checked="edit.isBackground"></a-switch>
    </template>
  </Title>
  <XtColor v-if="edit.isBackground" v-model:color="edit.backgroundColor"></XtColor>
</template>

<script>
import editMixins from "../hooks/mixins";
export default {
  mixins: [editMixins],
};
</script>

<style lang="scss" scoped></style>
