<template>
 <template v-if="controlIndex === 'audio'">
  <SystemControlDetail @click="removeControl($event)"/>
 </template>

 <!-- 用户中心信息 -->
 <template v-else-if="isUserLogin && controlIndex === 'user-info'">
  <div  class="rounded-xl xt-bg flex flex-col items-center justify-center relative" style="height:120px;width: 252px;" v-if="status === 'del'" @click.stop="removeControl($event)">
    <div class="absolute" style="top: 7px;right:-4px;" >
      <xt-button style="width: auto !important;" h="0">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:subtract-circle-16-filled" size="20" :color="'var(--error)'"></xt-new-icon>
        </div>
      </xt-button>
    </div>
    <UserInfoDetail :userinfo="userInfo"/>
  </div>

  <div  class="rounded-xl xt-bg flex flex-col items-center justify-center relative" style="height:120px;width: 252px;" v-else>
    <UserInfoDetail :userinfo="userInfo"/>
  </div>
 </template>

 <!-- 其他按钮 -->
 <template v-else>
  <div  class="xt-bg rounded-xl flex flex-col items-center justify-center relative" style="height: 120px;width: 120px;" v-if="status === 'del'" @click.stop="removeControl">
   <div class="absolute" style="top: 7px;right:-4px;" >
    <xt-button style="width: auto !important;" h="0">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:subtract-circle-16-filled" size="20" :color="'var(--error)'"></xt-new-icon>
      </div>
    </xt-button>
   </div>
   <div class="w-14 h-14 flex items-center xt-bg-t-2 justify-center rounded-full mb-3">
    <xt-new-icon :icon="controlItem.icon" size="24"></xt-new-icon>
   </div>
   <span class="xt-text">{{controlItem.name}}</span>
  </div>

  <div v-else class="rounded-xl flex flex-col items-center justify-center relative" 
    style="height: 120px;width: 120px;"  @click.stop="triggerControl($event)" :class="controlStatus.status ? 'xt-theme-bg':'xt-bg'">
    <div class="w-14 h-14 flex items-center xt-bg-t-2 justify-center rounded-full mb-3">
      <xt-new-icon :icon="controlItem.icon" size="24" :color="controlStatus.status ? 'var(--active-text)':'var(--primary-text)'"></xt-new-icon>
    </div>
    <span :class="controlStatus.status ? 'xt-active-text' :'xt-text'">{{controlItem.name}}</span>
  </div>
 </template>
</template>

<script setup>
import { ref,computed,getCurrentInstance  } from 'vue';
import { storeToRefs } from 'pinia';
import { appStore } from '../../../../../../store';
import { controlStore } from '../../../hook/controlStore';
import { setThemeSwitch } from '../../../../../card/hooks/themeSwitch';
import { message,notification } from 'ant-design-vue';
import { useRouter } from 'vue-router';

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
 status:{
  type:String,
  default:'null'
 },
 isClick:{
  type:Boolean,
  default:false,
 }
})

const app = appStore();
const { settings,styles,simple,aided,saving,showWindowController,userInfo } = storeToRefs(app);
const controls = controlStore();
const { control } = storeToRefs(controls);
const { proxy } = getCurrentInstance()
const router = useRouter()

// 通过计算属性来判断控制中心是否开启的状态
const controlStatus = computed(()=>{
  switch (props.controlIndex) {
    // 窗口控制
    case 'window-control':
      return {status:showWindowController.value,};
    // 浅色模式
    case 'light-color-mode':
      return {status:styles.value,} ;
    // 极简模式
    case 'min-mode':
      return {status:simple.value,} ;
    // 节能模式
    case 'energy-save-mode':
      return {status:saving.value,} ;
    // 勿扰模式
    case 'mute-mode':
      return {status:settings.value.noticeEnable,};
    // 辅助模式  
    case 'assist-mode':
      return {status:aided.value,};
    // 摇一摇
    case 'shake':
      return {status:settings.value.shake.enable};
    //游戏模式  后期功能实现后再对接
    case 'game-mode':
      return {status:false};
    default:
      break;
  }
})

// 触发控制中心状态修改
const triggerControl = () =>{
  // console.log('测试',settings.value);
  switch (props.controlIndex) {
    // 窗口控制
    case 'window-control':
      showWindowController.value = !showWindowController.value;
      break;
    // 浅色模式
    case 'light-color-mode':
      styles.value = !styles.value;
      setThemeSwitch(styles.value);
      break;
    // 极简模式
    case 'min-mode':
      simple.value = !simple.value
      break;
    // 节能模式
    case 'energy-save-mode':
      saving.value = !saving.value;
      console.log('测试',proxy);
      // 使用节能模式后，将关闭各种界面动画，同时尽可能清理掉滞留内存中的进程。可能导致打开界面效果折损或者应用切换缓慢。但可以显著降低内存、CPU、GPU占用。
      break;
    // 勿扰模式
    case 'mute-mode':
      settings.value.noticeEnable = !settings.value.noticeEnable
      break;
    // 辅助模式  
    case 'assist-mode':
      aided.value = !aided.value;
      if(!aided.value){
        app.leaveAided();
        message.success('已为您关闭辅助模式')
      }
      else {
        notification.info({
          message:'开启辅助模式后，工作台将无法被聚焦。此时无法输入任何内容，但是也不会因为点击工作台而切换焦点。可防止游戏窗口失焦。或者搭配快捷键使用。'
        })
        app.enterAided();
      }
      break;
    // 摇一摇
    case 'shake':
      settings.value.shake.enable = !settings.value.shake.enable
      if(!settings.value.shake.enable){
        app.enableShake(()=>{
          router.push({
            name:'key'
          })
        })
      }
      else {
        app.disableShake()
      }
      break;
    //游戏模式  后期功能实现后再对接
    case 'game-mode':
      return {status:false};
    default:
      break;
  }
}

// 编辑控制中心的移除
const removeControl = (evt) =>{
  // 阻止拖拽
  if(props.isClick){
    // 保留一个不能删除
    if(control.value.oldList.length !== 1){
      const index = control.value.newList.findIndex((find)=>{ return String(find.id) === String(props.controlIndex) });
      if(index === -1){
       const removeIndex  = control.value.oldList.findIndex((find)=>{ return String(find.id) === String(props.controlIndex) });
       console.log('删除',removeIndex,index);
       control.value.oldList.splice(removeIndex,1);
       control.value.newList.push(props.controlItem)
      }
    }
    else {
     evt.preventDefault();
    }
  }
  else {
   evt.preventDefault();
  }
}

// 判断用户是否登录
const isUserLogin = computed(()=>{
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