<template>
 <div class="flex flex-col flex-1 w-full h-4/5">
  <XtScrollbar  :y="true" style="height: 100%;width: 100%;" class="flex flex-col">

     <div class="flex flex-col mb-3">
      <span class="xt-font font-14 font-400 xt-text-3 mb-4">标题</span>
      <div class="xt-font font-14 font-500 xt-text ">{{ detailItem.content.title }}</div>
    </div>

    <div class="flex flex-col mb-3">
      <span class="xt-font font-14 font-400 xt-text-3 mb-4">正文</span>
      <div class="xt-font font-14 font-400 xt-text">{{ detailItem.content.body }}</div>
    </div>


    <div class="flex flex-col mb-3" v-if="JSON.parse(detailItem.content.covers).length !== 0 ">
      <span class="xt-font font-14 font-400 xt-text-3 mb-4">封面</span>
      <viewer :images="imgCovers.cover" :options="options">
        <a-row :gutter="[16,16]" id="bingImages">
          <a-col v-for="(img,index) in imgCovers.cover" :style="{width:`${imgCovers.width}px`,}">
            <div class="w-full h-full xt-bg-2 rounded-lg">
              <img class="image-item w-full h-full object-cover pointer" :src="img.cover" :data-source="img.cover" style="position: relative">
            </div>
          </a-col>
        </a-row>
      </viewer>
    </div>

    <div class="flex flex-col mb-3">
      <span class="xt-font font-14 font-400 xt-text-3 mb-4">附件</span>
      <template v-for="item in mockData">
        <div class="mb-3 rounded-xl px-4 py-3 items-center flex justify-between xt-bg-2">
          <div class="flex">
            <xt-new-icon icon="fluent:document-16-filled" size="20" class="mr-3"></xt-new-icon>
            <span class="xt-font xt-text font-14 font-400">{{ item.title }}</span>
          </div>
          <xt-button style="width:auto !important;" h="0" @click="clickDownload(item)">
            <div class="flex items-center justify-center link">
              点击下载
            </div>
          </xt-button>
        </div>
      </template>
    </div>


    <div class="flex flex-col mb-3" v-if="JSON.parse(detailItem.content.urls).length  !== 0">
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
    </div>

    <div class="flex flex-col ">
      <span class="xt-font font-14 font-400 xt-text-3 mb-4">b站视频</span>
      <template v-for="item in mockBili">
        <div class="mb-3 rounded-xl px-4 pointer py-3 items-center flex  xt-bg-2" @click="previewBiliVideo(item)">
          <xt-new-icon icon="tabler:brand-bilibili" size="20" class="mr-3" :color="'rgba(0,174,236,0.85)'"></xt-new-icon>
          <div style="max-width: 450px;color:rgba(0,174,236,0.85);" class="truncate xt-font font-14" >{{ item.title }}</div>
        </div>
      </template>
    </div>

  </XtScrollbar>
 </div>

  <teleport to='body'>
    <BiliModal ref="biliPlayRef"/>
  </teleport>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import browser from '../../../../../js/common/browser';
import { noticeStore } from '../../../store/noticeStore';


import BiliModal from './BiliModal.vue';

const notice = noticeStore();
const { detailItem } = storeToRefs(notice);


const options = ref(
  { url: 'data-source', }
)
const biliPlayRef = ref(null);


const imgCovers = computed(()=>{
  const imgList = JSON.parse(detailItem.value.content.covers);
  if(imgList.length !== 0){
    if(imgList.length === 1){
      return { cover:imgList,width:350, };
    }
    else {
      return { cover:imgList,width:240, };
    }
  }
})


const mockData = ref([
  {title:'打包.doc',href:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/bVd5-jCpR-o7fL-MTez'}
])

const mockBili = ref([
  { title:'电脑副屏系统想天工作台搭配闪蛇ZB133TF便携屏',url:'https://player.bilibili.com/player.html?bvid=BV1nG411S7kz' },
])

// 打开链接
const openLink = (url) =>{
  browser.openInSystem(url)
}

// 点击下载
const clickDownload = (item) =>{
  const fileUrl = item.href;  // 下载文件的线上路径
  const link = document.createElement('a'); // 创建一个a标签元素
  link.href = fileUrl;
  link.setAttribute('download',`${item.title}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 查看b站视频
const previewBiliVideo = (item) =>{
  biliPlayRef.value.openBiliVideoPlay(item)
}




</script>

<style lang="scss" scoped>

</style>
