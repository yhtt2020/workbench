<template>
 <div class="flex flex-col flex-1 mt-5" style="height: calc(100% - 160px);">
  <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
    <div v-for="item in allList" class="xt-bg-2 flex pointer justify-between items-center mb-3 rounded-xl px-4 py-3" @click="enterDetail(item)">
      <div class="flex items-center ">
        <span class="xt-font xt-text font-14 font-400 mr-3">
          ID:{{ item.content.id }}
        </span>
        <span class="xt-font xt-text font-14 font-400">
          {{ item.content.title }}
        </span>
      </div>
      <!--  -->
      <div class="xt-font xt-text-2 font-14 font-400">{{ utils.changeTime(item.createTime)}}</div>
    </div>
  </XtScrollbar>
 </div>
</template>

<script setup>
import { ref,computed } from 'vue';
import { storeToRefs } from 'pinia';
import { noticeStore } from '../../../store/noticeStore';
import utils from '../../../libs/utils';

const emit = defineEmits(['enter'])

const notice = noticeStore()
const { detailList,detailItem } = storeToRefs(notice);

const allList = computed(()=>{
  const filterList = detailList.value.filter((item)=>{ return item.type === 'push'  });
  const list = [];
  for(const item of filterList){
    const index = list.findIndex((itemIndex)=>{ return String(itemIndex.content.id) === String(item.content.id) });
    if(index === -1){
     list.push(item)
    }
  }
  return list;
})


// 进入详情
const enterDetail = (value) =>{
  detailItem.value = value
  emit('enter',)
}

</script>

<style lang="scss" scoped>

</style>