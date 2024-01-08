<template>
 <div class="flex flex-col">
  <div v-for="(item,index) in list" class="flex items-center justify-between xt-bg-2 rounded-xl p-4 mb-3">
    <div class="flex items-center justify-center">
     <div class="flex mr-4">
      <xt-new-icon icon="tabler:brand-bilibili" size="20" :color="'rgba(0,174,236,0.85)'"></xt-new-icon>
     </div>
     <div style="max-width: 450px;color:rgba(0,174,236,0.85);" class="truncate" >{{ item.title }}</div>
    </div>
    <xt-button style="width: auto !important;" h="0" @click="delBiliLink(index)">
     <div class="flex items-center justify-center link xt-font font-14 font-400">
       删除
     </div>
    </xt-button>
  </div>
 </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { noticeStore  } from '../../store/noticeStore';


const notice = noticeStore();
const { msgSetting } = storeToRefs(notice);

const props  = defineProps({
 list:{
  type:Array,
  default:()=>{}
 }
})

// 删除b站链接
const delBiliLink = (index) =>{
  msgSetting.value.videos.splice(index,1)
}

</script>

<style lang="scss" scoped>

</style>