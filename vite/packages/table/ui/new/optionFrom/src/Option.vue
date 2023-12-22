<template>
  <xt-option-info
    v-if="option.type === 'info'"
    v-bind="option"
    v-model:switch="data[option.switchKey]"
    @onIconClick="test()"
  />
  <!-- 输入框组件 得优化 -->
  <xt-option-input
    v-else-if="option.type === 'input'"
    v-bind="option"
    v-model:input="data[option.inputKey]"
  />
  <!-- tab组件 得优化 -->
  <xt-option-tab
    v-else-if="option.type === 'tab'"
    :style="lineSpaceStyle"
    :option="option"
    v-bind="option"
    style="height: 40px"
    circle
    v-model="data[option.tabKey]"
  />
  <!-- 属于颜色选项 -->
  <xt-option-color
    v-bind="option"
    v-else-if="option.type === 'color'"
    v-model:color="data[option.colorKey]"
    v-model:switch="data[option.switchKey]"
    :style="lineSpaceStyle"
  />
  <xt-option-select
    v-bind="option"
    v-else-if="option.type === 'select'"
    v-model:select="data[option.selectKey]"
    :style="lineSpaceStyle"
  />
  <xt-option-multiple
    v-bind="option"
    v-else-if="option.type === 'multiple'"
    v-model:multiple="data[option.multipleKey]"
    :style="lineSpaceStyle"
  />
  <xt-option-slider
    v-bind="option"
    v-else-if="option.type === 'slider'"
    v-model:slider="data[option.sliderKey]"
    :style="lineSpaceStyle"
  />
  <!-- 自定义插槽 -->
  <slot v-else-if="option.type === 'slot'" :name="option.slot"> </slot>
  <div v-if="option?.border" class="tt-divider"></div>
</template>

<script setup lang="ts">
export interface fromProps {
  option?: any;
  data?: any;
}
const props = withDefaults(defineProps<fromProps>(), {
  option: {},
});

const lineSpace = 12;
const lineSpaceStyle = {
  "margin-bottom": lineSpace + "px",
};

const test = () => {
  // emits(option.iconCb);
};
</script>

<style lang="scss" scoped></style>
