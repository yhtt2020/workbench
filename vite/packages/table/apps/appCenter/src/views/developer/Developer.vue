<script setup lang="ts">
import NullState from "./components/NullState.vue";
import AppItem from "./components/AppItem.vue";
import { useTTAppStore } from "../../../../ttApp/src/store";
import { storeToRefs } from "pinia";
import Exit from "../../component/exit.vue";
import Install from "./components/Install.vue";
const ttappStore: any = useTTAppStore();
const { ttappList,  } = storeToRefs(ttappStore);
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between pb-4">
      <div class="flex items-center">
        <xt-ify-icon icon="fluent:code-16-regular" />
        开发者
      </div>
      <div class="flex items-center"><Install class="mr-3" /><Exit /></div>
    </div>
    <!-- 内容 -->
{{
    ttappList.length
 }}
    <xt-scrollbar v-if="ttappList.length" class="h-full" :x="false" :y="true">
      <AppItem v-for="(item,index) in ttappList" :item="item" :key="index" />
    </xt-scrollbar>
    <NullState v-else />
  </div>
</template>
<style lang="scss" scoped></style>
