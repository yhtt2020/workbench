<template>
  <XtTitle titleClass="mt-0 mb-5">对话名11称</XtTitle>
  <XtInput
    style="width: 100%; height: 48px"
    v-model:data="searchValue"
    placeholder="请输入名称"
  >
  </XtInput>
  <XtTitle>对话名称</XtTitle>
  <div class="flex flex-wrap">
    <div
      v-for="item in iconList"
      class="xt-bg-2 w-10 h-10 rounded-xl m-2 flex justify-center items-center cursor-pointer"
    >
      <Icon :icon="item.icon" class="text-xl"></Icon>
    </div>
  </div>
</template>

<script>
import { iconList } from "./config.ts";
console.log("iconList :>> ", iconList);
export default {
  data() {
    return {
      iconList,
    };
  },
};
</script>

<style lang="scss" scoped></style>
