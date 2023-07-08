<template>
  <div class="flex justify-between items-center my-3">
    <div class="text-base">图标背景</div>
    <a-switch v-model:checked="_isBackground"></a-switch>
  </div>
  <Color v-if="_isBackground" v-model:color="_backgroundColor"></Color>
</template>

<script>
import editProxy from "../hooks/editProxy";
import editProps from "../hooks/editProps";
import editData from "../hooks/editData";
import Color from "../../../card/components/color/index.vue";
export default {
  mixins: [editProxy,editProps,editData],
  components: { Color },
};
</script>

<style lang="scss" scoped></style>
