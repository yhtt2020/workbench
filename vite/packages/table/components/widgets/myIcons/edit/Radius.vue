<template>
  <div class="flex justify-between items-center my-3">
    <div class="text-base">图标圆角</div>
    <a-switch v-model:checked="_isRadius"></a-switch>
  </div>
  <a-slider
    v-if="_isRadius"
    v-model:value="_radius"
    :max="50"
    :step="1"
    class="no-drag"
  />
</template>

<script>
import editProxy from "../hooks/editProxy";
import editProps from "../hooks/editProps";
import editData from "../hooks/editData";
export default {
  mixins: [editProxy,editProps,editData],
};
</script>

<style lang="scss" scoped></style>
