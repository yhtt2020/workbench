<template>
  <Title>
    图标圆角
    <template #right>
      <a-switch v-model:checked="_isRadius"></a-switch>
    </template>
  </Title>
  <a-slider
    v-if="_isRadius"
    v-model:value="_radius"
    :max="50"
    :step="1"
    class="no-drag"
  />
</template>

<script>
import editConfig from "../hooks/editConfig";
export default {
  mixins: [editConfig],
};
</script>

<style lang="scss" scoped></style>
