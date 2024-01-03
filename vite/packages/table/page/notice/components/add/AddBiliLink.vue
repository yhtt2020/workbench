<template>
 <xt-modal v-model="addBiliVisible" title="添加b站视频链接" :scrollbarPadding="{paddingRight:'0px',paddingLeft:'0px'}">
  <div style="width: 500px;" class="flex items-center flex-col justify-center">
   <a-input class="h-10" spellcheck="false" v-model:value="biliLinkValue" style=" min-width: 452px; margin-bottom: 16px;border-radius: 10px;" placeholder="请输入链接地址"></a-input>
  </div>
  <div class="h-10 flex w-full items-center justify-end">
   <xt-button w="64" h="40" class="mr-3" style="border-radius:10px;" @click="addBiliVisible = false">
     <div class="flex items-center justify-center">
       取消
     </div>
   </xt-button>
   <xt-button w="64" h="40" type="theme" style="border-radius:10px;" @click="addBiliVideo">
    <div class="flex items-center justify-center">
     确定
    </div>
   </xt-button>
  </div>
 </xt-modal>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { noticeStore } from '../../store/noticeStore';
import getName from '../../libs/getBiliName';


const notice = noticeStore();
const { msgSetting } = storeToRefs(notice);

const addBiliVisible = ref(false);
const biliLinkValue = ref('');

const openBiliModal = () =>{
 addBiliVisible.value = true;
}

// 添加b站视频
const addBiliVideo = async() =>{
  if(biliLinkValue.value !== ''){
    const isExits = msgSetting.value.videos.includes(biliLinkValue.value);
    if(!isExits){
      const { title } = await getName.getUrlName(biliLinkValue.value);
      const videosObj = {
        title:title,
        url:`${biliLinkValue.value}`
      }
      msgSetting.value.videos.push(videosObj);
      biliLinkValue.value = ''
      addBiliVisible.value = false
    }
  }

} 

defineExpose({ openBiliModal });

</script>

<style lang="scss" scoped>

</style>