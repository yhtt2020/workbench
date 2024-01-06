<template>
 <div class="flex flex-col flex-1 w-full h-full">
  <XtScrollbar  :y="true" style="height: 100%;width: 100%;" class="flex flex-col">
   <span class="xt-font font-14 font-400 xt-text-3 mb-4">标题</span>
   <div class="xt-font font-14 font-500 xt-text mb-3">{{ detailItem.content.title }}</div>
   <span class="xt-font font-14 font-400 xt-text-3 mb-4">正文</span>
   <div class="xt-font font-14 font-400 xt-text mb-3">{{ detailItem.content.body }}</div>
   <!-- <span class="xt-font font-14 font-400 xt-text-3 mb-4">附件</span> -->
   <span class="xt-font font-14 font-400 xt-text-3 mb-4">按钮链接</span>
   <template v-for="item in JSON.parse(detailItem.content.urls)">
    <div  class="mb-3 rounded-xl px-4 py-3 items-center flex justify-between xt-bg-2" v-if="item.type === 'link'">
     <div class="flex">
      <xt-button w="28" h="28" style="border-radius: 8px;" class="xt-modal mr-3">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:link-20-filled" size="20" :color="'var(-secondary-text)'"></xt-new-icon>
        </div>
      </xt-button>
      <span class="xt-font xt-text font-14 font-400"> {{ item.title }} </span>
     </div>
     <xt-button style="width: auto !important;" h="0" @click="openLink(item.href)">
       <div class="flex justify-center link items-center">
          点击打开
       </div>
     </xt-button>
    </div>
   </template>
   <!-- <span class="xt-font font-14 font-400 xt-text-3">b站视频</span> -->
  </XtScrollbar>
 </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import browser from '../../../../../js/common/browser';
import { noticeStore } from '../../../store/noticeStore';

const notice = noticeStore();
const { detailItem } = storeToRefs(notice);


// 打开链接
const openLink = (url) =>{
  browser.openInSystem(url)
}




</script>

<style lang="scss" scoped>

</style>