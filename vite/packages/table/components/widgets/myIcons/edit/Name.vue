<template>
  <Title>
    图标名称
    <template #right>
      <a-switch v-model:checked="_isTitle"></a-switch>
    </template>
  </Title>
  <template v-if="_isTitle">
    <a-input
      v-model:value="_titleValue"
      placeholder="给你的图标组件取个名称吧"
      class="xt-bg-2 xt-border h-12 rounded-xl"
    />
  </template>
</template>

<script>
import editConfig from "../hooks/editConfig";
export default {
  mixins: [editConfig],
};
</script>

<style lang="scss" scoped></style>
