<template>
  <!-- :style="editVisible ? { height:'689px' }:{ height:'535px' }" -->
  <div class="rounded-xl flex flex-col justify-between control-container pl-4 pt-4" id="controlId" 
   ref="modalRef" style="width: 548px;" 
  >

    <div class="flex items-center justify-between">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:toggle-multiple-16-regular" size="20" class="mr-2"></xt-new-icon>
        <span class="xt-text font-14 xt-font">控制中心</span>
      </div>

      <template v-if="!editVisible">
        <div class="flex items-center justify-center pr-4" >
          <xt-button style="width: auto !important;" h="0" @click="editClick">
           <div class="flex items-center justify-center">
            <xt-new-icon icon="fluent:compose-16-regular" size="20"></xt-new-icon>
           </div>
          </xt-button>
        </div>
      </template>

      <template v-else>
        <div class="flex items-center pr-4">
          <xt-button style="width: auto !important;" h="0" @click="finshEdit">
            <div class="flex items-center justify-center">
              <span class="xt-font xt-theme-text font-14">完成编辑</span>
            </div>
          </xt-button>
        </div>
      </template>
    </div>

    <template v-if="!editVisible">
      <ControlDesk />
    </template>
    <template v-else>
      <EditControlDesk />
    </template>

    <a-divider style="height: 1px;margin: 16px 0;width: 516px;min-width:516px;" />

    <div class="flex items-center justify-center" style="height: 85px;">
      <template v-for="item in bottomButton">
       <a-tooltip placement="top" :title="item.name">
         <xt-button w="54" h="54" style="border-radius: 12px;" class="mr-3 button-item xt-bg-t-2" @click="item.fn">
           <div class="flex items-center justify-center">
            <xt-new-icon :icon="item.newIcon" size="24"></xt-new-icon>
           </div>
         </xt-button>
       </a-tooltip>
      </template>
    </div>

  </div>
</template>

<script setup>
import { ref,computed } from 'vue';
import { useRouter } from 'vue-router';
import { controlStore } from '../../hook/controlStore';
import { appStore } from '../../../../../store';

import ControlDesk from './ControlDesk.vue';
import EditControlDesk from './EditControlDesk.vue';



const router = useRouter()
const emit = defineEmits(['close'])
const props = defineProps({
  full:{
    type:Boolean,
    default:false,
  }
})

const editVisible = ref(false);
const app = appStore()

// 触发编辑
const editClick = () =>{
  editVisible.value = true
}

// 完成编辑
const finshEdit = () =>{
  editVisible.value = false
}

const bottomButton = ref([
  {
    newIcon:'fluent:person-16-filled',name:'用户中心',
    fn:()=>{ 
      router.push({ path: '/my' })
      emit('close') 
    }
  },
  {
    newIcon:'fluent:lock-closed-16-regular',name:'锁屏',
    fn:()=>{ 
      router.push({ path: '/lock' })
      emit('close')
    }
  },
  {
    newIcon:'fluent:full-screen-maximize-16-regular',name:'全屏',
    fn:()=>{
      app.toggleFullScreen();
      // if(props.full){
      //   emit('setFull',false)
      //   tsbApi.window.setFullScreen(false)
      // }
      // else {
      //   emit('setFull',true)
      //   tsbApi.window.setFullScreen(true)
      // }
    }
  },
  {
    newIcon:'fluent:power-20-filled',name:'电源',
    fn:()=>{ 
      router.push({ path: '/power' }) 
      emit('close')
    }
  }, 
  {
    newIcon:'fluent:settings-16-regular',name:'设置',
    fn:()=>{
      router.push({ name: 'setting' });
      emit('close')
    }
  },
  // {
  //   newIcon:'fluent:settings-16-regular',name:'清除测试数据',
  //   fn:()=>{
  //     controlStore().initData();
  //     // router.push({ name: 'setting' });
  //     // emit('close')
  //   }
  // }
])
</script>

<style lang="scss" scoped>
.control-container{
  backdrop-filter: blur(50px);
  background: var(--primary-bg);
}
.button-item{
  &:last-of-type{
    margin-right: 0 !important;
  }
}
</style>