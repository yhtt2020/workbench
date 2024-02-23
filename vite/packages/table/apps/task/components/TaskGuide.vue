<template>
 <div style="width: 355px;">
  <div class="flex justify-between items-center mb-3 h-full">
   <div class="flex ">
     <xt-ify-icon icon="fluent-emoji:light-bulb" class="mr-1" size="22"></xt-ify-icon>
     <div class="text-base flex items-center font-16">{{ taskName.name }}</div>
   </div>
   <xt-ify-icon
     @click="close()"
     size="30"
     icon="fluent:dismiss-circle-16-filled" class="xt-text-2"
   />
  </div>
  <div class="flex flex-col w-full items-center justify-center mb-3">
    <xt-title class="xt-text-2 mb-3">预计可获得奖励</xt-title>
    <TaskReward :showTip="false"  :showTaskReward="taskGetReward" :isCenter="'items-center justify-center'"/>
  </div>
 
  <div class="flex justify-between mt-3">
    <div></div>
    <div class="flex " >
      <xt-button w="84" h="32" style="border-radius: 8px; margin-right: 8px;" @click="close">稍后再说</xt-button>
      <xt-button type="theme" w="84" h="32" style="border-radius: 8px;" v-if="currentTask.suf === ''" @click="immediatelyView">
        立即查看
      </xt-button>
      <xt-button type="theme" w="84" h="32" style="border-radius: 8px;" v-else-if="currentTask.suf === 'M0201'" @click="startImmediately">
        立即开始
      </xt-button>
    </div>
  </div>
 </div>
</template>

<script setup>
import { ref,computed,getCurrentInstance } from 'vue';
import { storeToRefs } from 'pinia';
import { taskStore } from '../store';
import { getCurrentTaskReward } from '../utils';

import XtIfyIcon from '../../../ui/new/IfyIcon/index.vue';
import XtButton from '../../../ui/libs/Button/index.vue';
import TaskReward from '../page/primary/TaskReward.vue';


const task = taskStore();
const { currentId,temporaryStatus,isTaskDrawer,startList,smallMize,currentTaskList } = storeToRefs(task);

const emits = defineEmits(["close-toast","startTask"]);
const { proxy } = getCurrentInstance();

const close = () =>{
 emits('close-toast');
};

const currentTask = computed(()=>{
  return task.getTask(currentId.value);
});


const taskName = computed(()=>{
  if(currentTask.value.suf === 'M0201'){
    return currentTask.value.showOne;
  }
  else if(currentTask.value.suf === ''){
    return currentTask.value.showPrimary;
  }
})


const taskGetReward = computed(()=>{
  console.log('测试',currentTaskList.value);
  if(currentTask.value.suf === 'M0201'){
    const list = ['M0201','M0202','M0203','M0204'];
    const filterList = {  points:[], experience:[], };
    for(const item of list){
      const res = getCurrentTaskReward(item);
      if(res[0].type === 'communityPoints'){
        filterList.points.push(res[0])
      }
      else {
        filterList.experience.push(res[0]);
      }
    }
    // 求和
    const point = filterList.points.reduce((sum,item)=>{ return sum + item.value},0);
    const experience = filterList.experience.reduce((sum,item)=>{ return sum + item.value},0)
    return {
      experience:{total:point,name:"经验",img:"/img/task/experience.png"},
      points:{total:experience,name:"积分",img:"/img/task/communityPoints.svg"},
    }
  }
  else if(currentTask.value.suf === ''){
    
  }
})

// 立即查看
const immediatelyView = () =>{
  emits('close-toast');
  isTaskDrawer.value = true;
  temporaryStatus.value = true;
}

// 立即开始
const startImmediately = ()=>{
  emits('startTask');
}

</script>

<style lang="scss" scoped>

</style>