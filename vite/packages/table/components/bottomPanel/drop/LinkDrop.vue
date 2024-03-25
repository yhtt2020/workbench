<template>
  <!-- 应用模式中的拖拽 -->
  <div
    class="w-full h-full rounded-xl"
    @drop.prevent.stop="handleDrop"
    @dragenter.prevent.stop="handleDragenter"
    @dragover.prevent
    ref="linkDrop"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { getFavicon } from "../../desk/navigationBar/hook/getUrlName";
import { useLinkConversionNav } from "../../../apps/folder/src/hooks/useDataConversion";

const emit = defineEmits(['createApp']);

// 处理drop放置
const handleDrop = async (dragEvent) =>{
  let link = dragEvent.dataTransfer.getData('text/plain');
  if(link && link !== ''){
    const http = link.includes('http');
    const https = link.includes('https');
    if(!http && !https){
      link = 'http://' + link;
      console.log('link',link);
    }else{  
      const linkIcon = await getFavicon(link);
      const target = {name:linkIcon.pageTitle,icon:linkIcon.faviconURL,value:link}; 
      const file = useLinkConversionNav(target);
      emit('createApp',file);
    }
  }
}

// 处理darg进入
const handleDragenter = (dragEvent) =>{
  console.log('进入',dragEvent);
}
</script>

<style lang="scss" scoped>
</style>