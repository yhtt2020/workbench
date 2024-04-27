<script setup lang="ts">
import NullState from "./components/NullState.vue";
import AppItem from "./components/AppItem.vue";
import { useTTAppStore } from "../../../../ttApp/src/store";
import { storeToRefs } from "pinia";
import Exit from "../../component/exit.vue";
import Install from "./components/Install.vue";
const ttappStore: any = useTTAppStore();
const { ttappList } = storeToRefs(ttappStore);
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between pb-4">
      <div class="flex items-center">
        <xt-ify-icon icon="fluent:code-16-regular" class="mr-2" />
        开发者
      </div>
      <div class="flex items-center"><Install class="mr-3" /><Exit /></div>
    </div>
    <!-- 内容 -->
    <xt-scrollbar v-if="ttappList.length" class="h-full" :x="false" :y="true">
      <xt-option-box>
        <div class="flex flex-col mb-4">
          <div class="flex mb-[5px]">
            <span class="">🎉</span>
            你可以在这里快速导入并测试应用，验证你的应用在工作台内的使用效果。
          </div>
          <div class="tt-text-2 text-sm">
            更新应用需要重新导入完整的应用安装包；上架应用后你可以在「开发者中心」里查看所有应用。需要更多测试和设置功能，请点击右上角进入「开发者中心」）
          </div>
        </div>
      </xt-option-box>
      <AppItem v-for="item in ttappList" :item="item" :key="item.id" />
    </xt-scrollbar>
    <NullState v-else />
  </div>
</template>
<style lang="scss" scoped></style>
