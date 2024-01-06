<template>
 <div class="flex flex-col flex-1 h-4/5 mt-5">
  <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
    <div v-for="item in allList" class="xt-bg-2 flex pointer justify-between items-center mb-3 rounded-xl px-4 py-3" @click="enterDetail(item)">
      {{ item.content.title }}
    </div>
  </XtScrollbar>
  <!-- 全部消息 -->
 </div>
</template>

<script setup>
import { ref,computed } from 'vue';
import { storeToRefs } from 'pinia';
import { noticeStore } from '../../../store/noticeStore';

const emit = defineEmits(['enter'])

const notice = noticeStore()
const { detailList } = storeToRefs(notice);

const allList = computed(()=>{
  const filterList = detailList.value.filter((item)=>{ return item.type === 'push'  });
  return filterList;
})


// 进入详情
const enterDetail = (value) =>{
  emit('enter',value)
}

</script>

<style lang="scss" scoped>

</style>