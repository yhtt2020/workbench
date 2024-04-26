<!-- 社群详情为空的页面 -->
<template>
  <div class="flex flex-col items-center justify-center h-full">
    <div style="width: 64px; height: 64px" class="mb-6 rounded-full">
      <img
        src="/icons/logo128.png"
        class="object-cover w-full h-full rounded-full"
      />
    </div>
    <span class="xt-text xt-font font-24"> 欢迎加入，{{ communityName }}</span>
    <div class="flex items-center justify-center mt-4" style="width: 362px">
      <div class="flex items-center">
        <div
          class="w-2.5 h-2.5 rounded-full mr-2.5"
          style="background: var(--success)"
        ></div>
        <span class="xt-text font-14 xt-font"> 2,874人在线 </span>
      </div>
      <div class="flex items-center ml-6">
        <div
          class="w-2.5 h-2.5 rounded-full mr-2.5"
          style="background: var(--secondary-text)"
        ></div>
        <span class="xt-text font-14 xt-font"> 1,039,485成员 </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs } from "vue"
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../store/chatCommunity";
import _ from "lodash-es";

const chatCommunity = chatCommunityStore();
const { myCommunity } = storeToRefs(chatCommunity);

const props = defineProps({
  no:{
    type:String,
    required:true,
  }
})
const { no } = toRefs(props);


const communityName = computed(()=>{
  if(no.value === 1){
    return '天天工作台官方社群';
  }
  else {
    const index = _.findIndex(myCommunity.value,(item)=>{ return Number(no.value) === Number(item.cno) });
    if(index > -1){
      return myCommunity.value[index]?.communityInfo?.name;
    }
  }
})

</script>

<style lang="scss" scoped>
</style>