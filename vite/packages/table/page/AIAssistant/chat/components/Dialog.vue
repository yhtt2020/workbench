<template>
  <XtTitle titleClass="mt-0 mb-5">名称</XtTitle>
  <XtInput
    style="width: 100%; height: 48px"
    v-model:data="namehValue"
    placeholder="请输入名称"
  >
  </XtInput>
  <XtTitle>图标</XtTitle>
  <div class="flex flex-wrap">
    <div
      v-for="(item, index) in iconList"
      @click="itemClick(item, index)"
      :class="{ 'xt-b': index == selectIndex }"
      class="xt-bg-2 w-10 h-10 rounded-xl m-2 flex justify-center items-center cursor-pointer"
    >
      <Icon :icon="item" class="text-xl"></Icon>
    </div>
  </div>
</template>

<script>
import { iconList } from "./config.ts";
export default {
  data() {
    return {
      selectIndex: null,
      iconList,
      iconValue: "",
      namehValue: this.name,
    };
  },
  methods: {
    itemClick(item, index) {
      this.selectIndex = index;
      this.iconValue = item;
    },
  },
  props: {
    icon: {},
    name: {},
  },
  watch: {
    iconValue(newV) {
      this.$emit("update:icon", newV);
    },
    namehValue(newV) {
      this.$emit("update:name", newV);
    },
  },
};
</script>

<style lang="scss" scoped></style>
