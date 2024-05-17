<template>
  <!-- <XtTitle titleClass="mt-0 mb-5">名称</XtTitle>
  <XtInput
    style="width: 100%; height: 48px"
    v-model="nameValue"
    placeholder="请输入名称"
  >
  </XtInput> -->
  <!-- <XtTitle>图标</XtTitle>
  <div class="flex flex-wrap">
    <div
      v-for="(item, index) in iconList"
      @click="itemClick(item, index)"
      :class="{ 'xt-theme-b': item.id == selectIndex }"
      class="xt-bg-2 w-10 h-10 rounded-xl m-2 flex justify-center items-center cursor-pointer"
    >
      <Icon :icon="item.name" class="text-xl"></Icon>
    </div>
  </div> -->
  <div class="p-4 mb-4 xt-bg-2 rounded-xl">
    <xt-option-info
      title="图标和名称"
      info="支持自定图标和名称。"
      icon="fluent:arrow-clockwise-16-regular"
      @onIconClick="refreshIcon"
    />
    <xt-option-icon  v-model:icon="iconValue" v-model:input="nameValue" :menus="['emoji']"  :upload="false"/>
  </div>
</template>

<script>
import { iconList } from "./config.ts";
export default {
  data() {
    return {
      selectIndex: this.index,
      iconList,
      iconValue: iconList[0],
      nameValue: this.name,
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
    index: {
      default: 0,
    },
  },
  watch: {
    iconValue: {
      handler(newV) {
        this.$emit("update:icon", newV);
      },
      immediate: true,
    },
    nameValue(newV) {
      this.$emit("update:name", newV);
    },
  },
};
</script>

<style lang="scss" scoped></style>
