<template>
 <div v-if="list.length === 0" class="flex items-center justify-center">
  <EmptyStatus text="从工作台中启动游戏来查看相关攻略"/>
 </div>
 <div v-else class="flex flex-wrap justify-center">
  <div v-for="item in list" class="video-item mr-2.5 mb-2 flex flex-col pointer" @click="openUrl(item.arcurl)">
   <div style="height:105px;" class="pb-1">
    <img :src="`${getVideoCover(item.pic)}`" class="object-cover w-full h-full rounded-lg" alt="">
   </div>

   <div class="container">
    <p class="text-clamp">
     {{ item.title.replace( /<em[^>]*>/g, '').replace(/<\/em>/g, '')}}
    </p>
   </div>
  </div>
 </div>
</template>

<script>
import { mapActions  } from 'pinia'
import browser from '../../../../js/common/browser';
import { gameStrategyStore } from '../../../../store/gameStrategyStore'

import EmptyStatus from '../../../../page/chat/components/empty/EmptyStatus.vue';

export default {
 props:['list'],
 components:{
  EmptyStatus
 },

 methods:{
  ...mapActions(gameStrategyStore,['getVideoCover']),
  openUrl(url) {
   browser.openInTable(url)
  },
 }
}
</script>

<style lang="scss" scoped>
.video-item {
  width: 170px;
}

.text-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: break-spaces;
  overflow: hidden;
  margin: 0 !important;

  font-size: 14px;
  color: var(--primary-text);
  font-weight: 400;
}
</style>