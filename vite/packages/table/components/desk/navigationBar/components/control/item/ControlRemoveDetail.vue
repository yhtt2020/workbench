<template>
 <template v-if="controlIndex === 'audio'">
  <div  class="rounded-xl flex flex-col items-center justify-center relative" style="height:120px;width: 252px;" v-if="status === 'del'" @click.stop="removeControl">
   <div class="absolute" style="top: 7px;right:-4px;" >
    <xt-button style="width: auto !important;" h="0">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:subtract-circle-16-filled" size="20" :color="'var(--error)'"></xt-new-icon>
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
  </div>

  <div  class="rounded-xl flex flex-col items-center justify-center relative" style="height:120px;width: 252px;" v-else>
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
  </div>
 </template>

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
    style="height: 120px;width: 120px;"  @click.stop="triggerControl" :class="controlStatus.status ? 'xt-theme-bg':'xt-bg'">
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
import { appStore } from '../../../../../../store'
import { controlStore } from '../../../hook/controlStore';
import { setThemeSwitch } from '../../../../../card/hooks/themeSwitch'


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
 }
})


const app = appStore();
const { settings,styles,simple,aided,saving,showWindowController } = storeToRefs(app);
const controls = controlStore();
const { control } = storeToRefs(controls);
const { proxy } = getCurrentInstance()


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
      break;
    // 摇一摇
    case 'shake':
      settings.value.shake.enable != settings.value.shake.enable
      break;
    //游戏模式  后期功能实现后再对接
    case 'game-mode':
      return {status:false};
    default:
      break;
  }
}

// 编辑控制中心的移除
const removeControl = () =>{
  const index = control.value.addList.findIndex((find)=>{ return String(find.id) === String(props.controlIndex) });
  if(control.value.addList.length !== 1){
   control.value.addList.splice(index,1);
   const removeIndex  = control.value.addList.findIndex((find)=>{ return String(find.id) === String(props.controlIndex) });
   if(removeIndex === -1){
    control.value.removeList.push(props.controlItem)
   }
  }
  else {
   evt.preventDefault();
  }
}


</script>

<style lang="scss" scoped>

</style>