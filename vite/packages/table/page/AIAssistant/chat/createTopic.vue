<template>
  <div style="width: 412px" class="p-2 mt-2">
    <a-input
      style="width: 96%; height: 48px"
      class="xt-border rounded-xl xt-bg-2 pl-4  mx-auto ml-2"
      v-model:value="searchValue"
      placeholder="请输入名称"
    >
    </a-input>
    <div class="my-2 text-base ml-2">图标</div>
    <div class="flex flex-wrap">
      <div
        v-for="item in iconList"
        class="xt-bg-2 w-10 h-10 rounded-xl m-2 flex justify-center items-center cursor-pointer"
      >
        <Icon :icon="item.icon" class="text-xl"></Icon>
      </div>
    </div>
    <div class="flex  justify-center mt-1">
      <div class="w-120 h-12 xt-btn mr-3">取消</div>
      <div class="w-120 h-12 xt-active-btn">确认</div>
    </div>
  </div>
</template>

<script>
import { iconList } from "./topic";
export default {
  data() {
    return {
      iconList,
    };
  },
};
</script>

<style lang="scss" scoped></style>
