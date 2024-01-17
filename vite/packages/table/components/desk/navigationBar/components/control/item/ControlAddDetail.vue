<template>
 <template v-if="controlIndex === 'audio'">
  <!-- <div  class="rounded-xl flex flex-col relative" style="height: 120px;width:252px;" >
    <div class="absolute" style="top: 7px;right:-4px;">
      <xt-button style="width: auto !important;" h="0">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:add-circle-12-filled" size="20" :color="'var(--link)'"></xt-new-icon>
        </div>
      </xt-button>
    </div>
    
    <div class="xt-bg w-full rounded-lg mb-4 flex items-center justify-between" style="padding: 0 22px; height: 54px;">
     <div v-for="item in controlItem.list[0].list">
      <xt-button style="width: auto;" h="0">
        <div class="flex items-center justify-center">
          <xt-new-icon :icon="item.icon" size="24" :color="item.color"></xt-new-icon>
        </div>
      </xt-button>
     </div>
    </div>
    <div class="xt-bg w-full flex items-center justify-between rounded-lg" style="height: 52px;">
      <div class="rounded-tl-lg rounded-bl-lg" style="width:129px;height:52px;background: rgba(255,255,255,0.85);"></div>
      <div class="pr-4">
        <xt-button style="width: auto;" h="0">
          <div class="flex items-center justify-center">
            <xt-new-icon :icon="controlItem.list[1].icon" size="24"></xt-new-icon>
          </div>
        </xt-button>
      </div>
    </div>

  </div> -->
 </template>

 <template v-else-if="isUserInfoNull && controlIndex === 'user-info'">
  <div  class="rounded-xl xt-bg flex items-center justify-center flex-col relative" style="height: 120px;width:252px;" >
    <div class="absolute" style="top: 7px;right:-4px;">
      <xt-button style="width: auto !important;" h="0">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:add-circle-12-filled" size="20" :color="'var(--link)'"></xt-new-icon>
        </div>
      </xt-button>
    </div>
    <UserInfoDetail :userinfo="userInfo"/>
  </div>
 </template>

 <template v-else>
  <div  class="xt-bg rounded-xl flex flex-col items-center justify-center relative" style="height: 120px;width: 120px;" >
   <div class="absolute" style="top: 7px;right:-4px;">
    <xt-button style="width: auto !important;" h="0">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:add-circle-12-filled" size="20" :color="'var(--link)'"></xt-new-icon>
      </div>
    </xt-button>
   </div>
   <div class="w-14 h-14 flex items-center xt-bg-t-2 justify-center rounded-full mb-3">
    <xt-new-icon :icon="controlItem.icon" size="24"></xt-new-icon>
   </div>
   <span class="xt-text">{{controlItem.name}}</span>
  </div>
 </template>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { appStore } from '../../../../../../store';

import UserInfoDetail from '../userControl/UserInfoDetail.vue';

const props = defineProps({
 controlIndex:{
  type:String,
 },
 controlItem:{
  type:Object,
  default:()=>{}
 }
})

const app = appStore();
const { userInfo } = storeToRefs(app);

const isUserInfoNull = computed(()=>{
  if(!userInfo.value){
    return false
  }
  else {
    return true
  }
})

</script>

<style lang="scss" scoped>
:deep(.big){
  bottom: 80px !important;
  right:  0 !important;
} 
</style>