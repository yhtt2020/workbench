<template>
 <div v-if="list.length === 0" class="flex items-center justify-center">
  <EmptyStatus text="从工作台中启动游戏来查看相关攻略"/>
 </div>
 <div v-else class="w-full flex flex-col">
   <div class="flex  items-center p-3 mb-3 category-button rounded-lg pointer xt-bg-2" v-for="item in list" @click="openUrl(item.href)">
    <div class="flex-shrink-0 mr-4 round-dot"></div>
    <div class="inline-block text-more" style="color: var(--primary-text);">{{ item.title }}</div>
    <div class="flex-shrink-0 ml-auto" style="color: var(--secondary-text);">{{ item.date }}</div>
   </div>
 </div>
</template>

<script>
import browser from '../../../../js/common/browser';
import EmptyStatus from '../../../../page/chat/components/empty/EmptyStatus.vue';


export default {
 props:['list'],
 components:{
  EmptyStatus
 },

 methods:{
  openUrl(url){
    browser.openInTable(url)
  }
 }

}
</script>

<style lang="scss" scoped>

</style>