<template>
  <Title>
    图标名称
    <template #right>
      <a-switch v-model:checked="edit.isTitle"></a-switch>
    </template>
  </Title>
  <template v-if="edit.isTitle">
    <a-input
      v-model:value="edit.titleValue"
      placeholder="给你的图标组件取个名称吧"
      class="xt-bg-2 xt-border h-12 rounded-xl"
    />
  </template>
</template>

<script>
import editMixins from "../hooks/mixins";
export default {
  mixins: [editMixins],
};
</script>

<style lang="scss" scoped></style>
