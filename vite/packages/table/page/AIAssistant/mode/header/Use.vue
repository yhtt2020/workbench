<template>
  <div class="flex items-center justify-between">
    <div class="flex justify-center">
      <XtIcon icon="xiangzuo" @click="isMode = true"></XtIcon>
      <div class="flex flex-col ml-2">
        <div class="text-base mb-1">PPT大钢</div>
        <div class="text-sm xt-text-2">
          输入需要生成的PPT关键词或标题，生成完整的PPt大纲
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="xt-active-btn h-12 mr-2" style="width: 120px">使用模板</div>
      <div class="xt-btn h-12 mr-2" style="width: 120px">更新模板</div>
      <XtIcon icon="bianji"></XtIcon>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isMode"]),
  },
};
</script>

<style lang="scss" scoped></style>
