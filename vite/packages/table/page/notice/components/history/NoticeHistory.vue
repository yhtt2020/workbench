<template>
 <div class="px-4 pt-4 w-full flex flex-col h-full" v-if="!tabShow">
  <div class="w-full flex items-center justify-between">
    <div class="flex items-center justify-center">
       <xt-new-icon icon="fluent:clock-16-filled" size="16"></xt-new-icon>
       <span class="xt-font xt-text font-14 font-400 ml-3">历史消息</span>
    </div>

    <xt-tab :list="tabList" v-model="tabValue" class="xt-bg-2 p-1 h-8" style="width: 248px;border-radius: 8px;"></xt-tab>

    <xt-button w="32" h="32" style="border-radius: 8px;" @click="closeModal">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:dismiss-16-filled" size="16"></xt-new-icon>
      </div>
    </xt-button>
  </div>

  <template v-if="tabValue === 'all'">
    <HistoryAll @enter="detail"/>
  </template>

  <template v-else>
    <DraftBoxDetail @edit="editDraftBox"/>
  </template>
 </div>

 <template v-else>
  <NoticeSend :hide="true" v-if="noticeVisible"  @back="tabShow = false;noticeVisible=false"/>
  <HistoryDetail :isFull="isFull" v-else-if="historyVisible" @close="closeModal" @back="tabShow = false;historyVisible = false"/>
 </template>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from 'pinia';
import { noticeStore } from '../../store/noticeStore'

import HistoryAll from "./content/HistoryAll.vue";
import DraftBoxDetail from "./content/DraftBoxDetail.vue";
import NoticeSend from '../send/NoticeSend.vue';
import HistoryDetail from "./content/HistoryDetail.vue";

const emit = defineEmits(['close']);
const props = defineProps({
  isFull:Boolean,
})

const notice  = noticeStore();
const { msgSetting } = storeToRefs(notice);

const tabList  = ref([
  { name:'全部消息',value:'all' },
  { name:'草稿箱', value:'draft'}
])
const tabShow = ref(false);
const tabValue = ref('all')
// 切换草稿箱的界面
const noticeVisible = ref(false);
// 切换历史消息详情界面
const historyVisible = ref(false);


const closeModal = () =>{
 emit('close')
}


// 编辑草稿箱
const editDraftBox = (value) =>{
  tabShow.value = true;
  noticeVisible.value = true;
  const option = {
    ...value,
    attachments:JSON.parse(value.attachments),
    videos:JSON.parse(value.videos),
    targetList:JSON.parse(value.targetList),
    covers:JSON.parse(value.covers),
    urls:JSON.parse(value.urls)
  }
  msgSetting.value = option
}

// 查看详情
const detail = () =>{
  tabShow.value = true;
  historyVisible.value = true
}
</script>

<style lang="scss" scoped>
:deep(.cursor-pointer){
  border-radius: 8px !important;
}
</style>
