<template>
 <div class="flex flex-col">
  <div v-for="(item,index) in list" class="flex items-center justify-between w-full xt-bg-2 rounded-xl p-4 mb-3">
   <div class="flex items-center justify-center">
     <xt-button w="28" h="28" class="xt-bg-m mr-3" style="border-radius: 8px;">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:link-20-filled" size="20" :color="'var(--active-text)'"></xt-new-icon>
      </div>
     </xt-button>
     <span class="xt-font font-14 font-400 xt-text">{{ item.title }}</span>
   </div>
   <div class="flex items-center justify-start xt-text-3 xt-font font-14 font-400" style="width: 428px;">{{ item.href }}</div>
   <xt-button style="width: auto !important;" h="0" @click="delButtonLink(index)">
    <div class="flex items-center justify-center link xt-font font-14 font-400">删除</div>
   </xt-button>
  </div>
 </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { noticeStore } from '../../store/noticeStore';


const notice = noticeStore();
const { msgSetting } = storeToRefs(notice);

const props = defineProps({
 list:{
  type:Array,
  default:()=>[]
 }
})

// 删除按钮链接
const delButtonLink = (index) =>{
 msgSetting.value.urls.splice(index,1)
}

</script>

<style lang="scss" scoped>

</style>