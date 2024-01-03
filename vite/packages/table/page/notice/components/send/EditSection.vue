<template>
 <div class="flex w-full h-full">
  <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
   <a-input class="h-10 xt-bg-t-2 " v-model:value="msgSetting.title" style="border-radius: 10px;margin-bottom: 16px;" :bordered="false" placeholder="标题"></a-input>
   <a-textarea v-model:value="msgSetting.summary" placeholder="摘要（选填）" class="xt-bg-t-2" style="border-radius: 10px;margin-bottom: 16px;" :bordered="false" :rows="4" />
   <MsgMarkdown ref="mkRef" />

   <div class="flex flex-col my-4" v-if="imgCover.cover.length !== 0" >
    <div class="flex items-center justify-between mb-4" style="width: 350px;">
     <span class="xt-font xt-text-2 font-400 font-14">封面</span>
     <xt-button style="width: auto !important;" h="0" type="theme" @click="delCover">
       <div class="flex items-center justify-center link font-400 font-14 xt-font">删除</div>
     </xt-button>
    </div>
    <div class="flex ">
      <div  v-for="img in imgCover.cover" :style="{width:`${imgCover.width}px`,height:`${imgCover.height}px`}" class="mr-2 pointer">
        <img  :src="img.cover" class="w-full h-full object-cover rounded" alt="">
      </div> 
    </div>
   </div>

   <div class="flex flex-col mb-4" v-if="msgSetting.attachments.length !== 0">
    <span class="xt-font xt-text-2 font-400 font-14">附件</span>
   </div>

   <div class="flex flex-col mb-4" v-if="msgSetting.urls.length !== 0">
    <span class="xt-font xt-text-2 font-400 font-14 mb-4">按钮链接</span>
    <ButtonLinkDetail :list="msgSetting.urls"/>
   </div>

   <div class="flex flex-col mb-4" v-if="msgSetting.videos.length !== 0">
    <span class="xt-font xt-text-2 font-400 font-14 mb-3">b站视频链接</span>
    <BiliLinkDetail :list="msgSetting.videos"/>
   </div>
   
  </XtScrollbar>
 </div>
</template>

<script setup>
import { onMounted, ref,nextTick, computed } from "vue";
import { storeToRefs } from 'pinia';
import { noticeStore } from '../../store/noticeStore';

import MsgMarkdown from "./MsgMarkdown.vue";
import ButtonLinkDetail from "../detail/ButtonLinkDetail.vue";
import BiliLinkDetail from "../detail/BiliLinkDetail.vue";

const notice = noticeStore();
const { msgSetting } = storeToRefs(notice);

const mkRef = ref(null);


const delCover = () =>{
 msgSetting.value.cover = '';
}

// 通过计算属性判断图片数据
const imgCover = computed(()=>{
  if(msgSetting.value.cover.length === 1){
    return { cover:msgSetting.value.cover,width:350,height:200 };
  }
  else {
    return { cover:msgSetting.value.cover,width:114,height:72 };
  }
})


defineExpose({ mkRef });
</script>

<style lang="scss" scoped>
:deep(.ant-input){
 color: var(--primary-text);
 font-size: 1rem;
 &::placeholder{
  color: var(--secondary-text);
 }
}
</style>