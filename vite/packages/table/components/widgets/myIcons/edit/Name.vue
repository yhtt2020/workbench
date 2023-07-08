<template>
  <div class="flex justify-between items-center my-3">
    <div class="text-base">图标名称</div>
    <a-switch v-model:checked="_isTitle"></a-switch>
  </div>
  <template v-if="_isTitle">
    <a-input
      v-model:value="_titleValue"
      placeholder="给你的图标组件取个名称吧"
      class="xt-bg-2 xt-border h-12 rounded-xl"
    />
  </template>
</template>

<script>
import editProxy from "../hooks/editProxy";
import editProps from "../hooks/editProps";
import editData from "../hooks/editData";
export default {
  mixins: [editProxy, editProps, editData],
};
</script>

<style lang="scss" scoped></style>
