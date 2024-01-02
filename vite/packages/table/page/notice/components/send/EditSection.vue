<template>
 <div class="flex w-full h-full">
  <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
   <div style="height: 16px;"></div>
   <a-input class="h-10 xt-bg-t-2 " style="border-radius: 10px;margin-bottom: 16px;" :bordered="false" placeholder="标题"></a-input>
   <a-textarea v-model:value="value" placeholder="摘要（选填）" class="xt-bg-t-2" style="border-radius: 10px;margin-bottom: 16px;" :bordered="false" :rows="4" />
   <MsgMarkdown />
  </XtScrollbar>
 </div>
</template>

<script setup>
import MsgMarkdown from "./MsgMarkdown.vue";


</script>

<style lang="scss" scoped>
:deep(.ant-input){
 color: var(--secondary-text);
 font-size: 1rem;
 &::placeholder{
  color: var(--secondary-text);
 }
}
</style>