<template>
  <Title>
    图标背景
    <template #right>
      <a-switch v-model:checked="_isBackground"></a-switch>
    </template>
  </Title>
  <Color v-if="_isBackground" v-model:color="_backgroundColor"></Color>
</template>

<script>
import Color from "../../../card/components/color/index.vue";
import editConfig from "../hooks/editConfig";
export default {
  mixins: [editConfig],
  components: { Color },
};
</script>

<style lang="scss" scoped></style>
