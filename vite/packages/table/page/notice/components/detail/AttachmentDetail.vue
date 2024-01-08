<template>
 <div class="flex flex-col">
  <div v-for="(item,index) in list" class="flex items-center justify-between xt-bg-2 rounded-xl p-4 mb-3">
   <div class="flex items-center justify-center">
    <xt-new-icon icon="fluent:document-16-regular" size="20" class="mr-3"></xt-new-icon>
    <span class="xt-font xt-text font-14 font-400">{{ item.title }}</span>
   </div>
   <xt-button style="width: auto !important;" h="0" @click="delAttachment(index)">
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

const props = defineProps({
 list:{
  type:Array,
  default:()=>[]
 }
})

// 删除附件
const delAttachment = (index) => {
 msgSetting.value.attachments.splice(index,1)
}

</script>

<style lang="scss" scoped>

</style>