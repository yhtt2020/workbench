<template>
  <Title>
    图标圆角
    <template #right>
      <a-switch v-model:checked="edit.isRadius"></a-switch>
    </template>
  </Title>
  <a-slider
    v-if="edit.isRadius"
    v-model:value="edit.radius"
    :max="50"
    :step="1"
    class="no-drag"
  />
</template>

<script>
import editMixins from "../hooks/mixins";
export default {
  mixins: [editMixins],
};
</script>

<style lang="scss" scoped></style>
