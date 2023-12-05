<template>
 <div style="width:500px;" class="flex flex-col justify-between px-3 pt-3 pb-4">
  <ModalTop title="进入社群" @close="closeJoinCom"/>

  <div class="w-full flex flex-col items-center justify-center" style="margin: 0 0 16px 0;">
   <div style="width:452px;" >
    <a-input placeholder="搜索" :spellcheck="false" v-model:value="joinData.searchKeyword" class="h-10" style="border-radius: 10px;" @keyup.enter="searchCommunity" @input="searchCommunity">
     <template #suffix>
       <JoinIcon icon="fluent:search-16-regular" style="font-size: 1.25rem;"/> 
     </template>
    </a-input>
   </div>
  </div>

  <div class="w-full flex flex-col mx-4 mb-6">
    <span v-if="joinData.searchKeyword === ''" class="font-14 font-400 xt-text-2 xt-font">推荐社群</span>
    <span v-else class="font-14 font-400 xt-text-2 xt-font">搜索结果</span>
  </div>
  
  <template v-if="joinData.searchKeyword === ''">
    <RecommendDetail :list=" getCommunity"/>
  </template>

  <template v-else>
    <SearchDetail :list="joinData.searchResult"/>
  </template>
  
 </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, reactive, toRefs, computed,nextTick,watch } from "vue";
import { communityStore } from "../../store/communityStore";
import { message } from "ant-design-vue";
import _ from "lodash-es";
import {Icon as JoinIcon} from '@iconify/vue';

import ModalTop from '../ModalTop.vue';
import SearchDetail from './SearchDetail.vue';
import RecommendDetail from './RecommendDetail.vue';

const com = communityStore();
const { community } = storeToRefs(com);
const emits = defineEmits(["close"]);

const joinData = reactive({
 searchKeyword:'',
 searchResult:[],
});

// 关闭弹窗
const closeJoinCom = () =>{
  emits("close")
}
// 搜索事件
const searchCommunity = async(evt) =>{
  if(joinData.searchKeyword !== ''){
    const result = await com.searchRecommendCommunity(joinData.searchKeyword);
    joinData.searchResult = result;
  }
  else{
    evt.preventDefault();
  }
}
const getCommunity = computed(()=>{
  const data = community.value.communityRecommend;
  const recommendNull = data !== undefined && data.length !== 0;
  if(recommendNull){
    const filterList = [];
    for(const item of data){
      const index = _.findIndex(filterList,function(find){ return find.id === item.id })
      if(index === -1){
        filterList.push(item);
      }
    }
    return filterList;
  }
})

onMounted(()=>{
  nextTick(()=>{
   com.getRecommendCommunityList();
  })
})
</script>

<style lang="scss" scoped>

</style>