<template>
 <div class="flex w-full h-full">
  <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
   <div class="flex flex-col">
    <span class="xt-font xt-text-2 font-14 font-400 mb-3">发送给</span>
    <div class="flex mb-4">
      <template v-if="msgSetting.targetList.length > 5">
        <div  v-for="item in msgSetting.targetList.slice(0,4)" class="flex items-center pointer justify-center mr-3 h-10 item-bg" >
          <a-avatar :size="20" :src="item.avatar" ></a-avatar>
          <span class="ml-3">{{ item.nick }}</span>
        </div> 
      </template>
      <div v-else  v-for="item in msgSetting.targetList" class="flex items-center pointer justify-center mr-3 h-10 item-bg" >
        <a-avatar :size="20" :src="item.avatar" ></a-avatar>
        <span class="ml-3">{{ item.nick }}</span>
      </div>
      <div v-if="msgSetting.targetList.length > 5" class="xt-bg-2 rounded-lg h-10 pointer flex items-center justify-center" style="width: 41px;">+12</div>
    </div>
   </div>

   <a-input class="h-10 xt-bg-t-2 " v-model:value="msgSetting.title" style="border-radius: 10px;margin-bottom: 16px;border: 1px solid var(--divider) !important;" :bordered="true" placeholder="标题"></a-input>
   <a-textarea v-model:value="msgSetting.summary" placeholder="摘要（选填）" class="xt-bg-t-2" style="border-radius: 10px;margin-bottom: 16px;border: 1px solid var(--divider) !important;" :bordered="true" :rows="4" />
   <MsgMarkdown ref="mkRef" />

   <div class="flex flex-col my-4" v-if="imgCover.cover.length !== 0" >
    <div class="flex items-center justify-between mb-4" style="width: 350px;">
     <span class="xt-font xt-text-2 font-400 font-14">封面（推荐图片比例 16:9）</span>
    </div>
    <div class="flex">
      <viewer :images="imgCover.cover" :options="options">
        <a-row :gutter="[16,16]" id="bingImages">
          <a-col v-for="(img,index) in imgCover.cover" :style="{width:`${imgCover.width}px`,height:`${imgCover.height}px`}">
            <div class="img-hover">
              <img class="image-item  pointer" :src="img.cover" :data-source="img.cover" style="position: relative">
              <div class="absolute " style="top:50%;left:50%;transform: translate(-50% ,-50%);">
                <xt-button style="width: auto !important; opacity: 0;" class="send-img" h="0" @click="removeImg(index)">
                  <div class="flex items-center justify-center">
                    <xt-new-icon icon="fluent:delete-16-regular" size="20" :color="'var(--active-text)'"></xt-new-icon>
                  </div>
                </xt-button>
              </div> 
            </div>
          </a-col>
        </a-row>
      </viewer>
    </div>
   </div>

   <div class="flex flex-col" v-if="msgSetting.attachments.length !== 0">
    <span class="xt-font xt-text-2 font-400 font-14 mb-4">附件</span>
    <AttachmentDetail :list="msgSetting.attachments"/>
   </div>

   <div class="flex flex-col" v-if="msgSetting.urls.length !== 0">
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
import AttachmentDetail from "../detail/AttachmentDetail.vue";

const notice = noticeStore();
const { msgSetting } = storeToRefs(notice);

const mkRef = ref(null);
const options = ref(
  { url: 'data-source', }
)


const delCover = () =>{
 msgSetting.value.cover = '';
}

// 通过计算属性判断图片数据
const imgCover = computed(()=>{
  if(msgSetting.value.cover.length === 1){
    return { cover:msgSetting.value.cover,width:350, };
  }
  else {
    return { cover:msgSetting.value.cover,width:114, };
  }
})

// 删除对应的图片
const removeImg = (index) =>{
  msgSetting.value.cover.splice(index,1)
}


defineExpose({ mkRef });
</script>

<style lang="scss" scoped>
:deep(.ant-input){
 color: var(--primary-text) !important;
 font-size: 1rem;
 &::placeholder{
  color: var(--disable-text) !important;
 }
}

:deep(.ant-image-img){
  border-radius: 8px !important;
}


.img-hover{
  &:hover{
    .send-img{
      opacity: 1 !important;
    }
  }
}

.item-bg{
  border: 1px solid var(--active-bg);
  border-radius: 10px;
  background: var(--active-secondary-bg);
  padding: 10px;
}

</style>