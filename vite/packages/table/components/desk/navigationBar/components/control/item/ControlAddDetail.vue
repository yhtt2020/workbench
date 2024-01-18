<template>
  <!-- 音乐播放器和音量调节按钮 -->
 <template v-if="controlIndex === 'audio'">
   <SystemControlDetail class="category-button pointer" @click="addControl($event)" :status="'add'"/>
 </template>

 <!-- 用户中心数据信息模块 -->
 <template v-else-if="isUserInfoNull && controlIndex === 'user-info'">
  <div  class="rounded-xl pointer category-button xt-bg flex items-center justify-center flex-col relative" style="height: 120px;width:252px;"  @click="addControl($event)">
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

 <!-- 控制中心其他按钮 -->
 <template v-else>
  <div  class="xt-bg rounded-xl pointer category-button flex flex-col items-center justify-center relative" style="height: 120px;width: 120px;" @click="addControl($event)">
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
import { controlStore } from '../../../hook/controlStore';

import UserInfoDetail from '../userControl/UserInfoDetail.vue';
import SystemControlDetail from '../systemControl/SystemControlDetail.vue';

const props = defineProps({
 controlIndex:{
  type:String,
 },
 controlItem:{
  type:Object,
  default:()=>{}
 },
})

const app = appStore();
const { userInfo } = storeToRefs(app);
const controls = controlStore();
const { control } = storeToRefs(controls);

const isUserInfoNull = computed(()=>{
  if(!userInfo.value){
    return false
  }
  else {
    return true
  }
})

// 添加设置
const addControl = (evt) =>{
  /**逻辑是先增后减**/ 
  // 添加最新数据
  const addIndex = control.value.oldList.findIndex((find)=>{ return String(find.id) === String(props.controlIndex) });
  if(addIndex === -1){
    control.value.oldList.push(props.controlItem);
    // 删除原先数据
    const removeIndex = control.value.newList.findIndex((find)=>{ return String(find.id) === String(props.controlIndex) });
    control.value.newList.splice(removeIndex,1)
  }
}

</script>

<style lang="scss" scoped>
:deep(.big){
  bottom: 80px !important;
  right:  0 !important;
} 
</style>