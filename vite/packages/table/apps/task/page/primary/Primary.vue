<template>
  <!-- <xt-button @click="test()" v-if="settings.enableDev">任务重置</xt-button> -->
  <template v-if="store.taskID">
    <!-- 用户等级信息 -->
    <TaskUserInfo v-if="!$useEnv('guest')" :showPointGood="true"/>
    <!-- 章节进度 -->
    <div class="xt-bg-2 rounded-xl px-4 pt-4 pb-3">
      <xt-text>
        <div class="flex items-center">
          <xt-new-icon icon="fluent-emoji:star" class="mr-3" size="20" />
          {{ chapter.chapter }}
        </div>
        <template #right>
          {{ stage + 0 }} / {{ chapter.tasks.length }}
        </template>
      </xt-text>
      <div class="mt-1 mb-1">
        <a-progress :percent="progress" :show-info="false" />
      </div>
      <TaskReward :showTaskReward="currentTaskReward" :showTip="true" :isCenter="''"></TaskReward>
    </div>
    <xt-title>正在进行</xt-title>
    <div class="xt-bg-2 rounded-xl p-3">
      <xt-text m="">
        <SerialNumber :id=" stage + 1" />
        {{ currentTask.name }}</xt-text
      >
      <xt-title type="text">{{ currentTask.intro }}</xt-title>
      <xt-title m="">任务说明</xt-title>
      <xt-title type="text">{{ currentTask.description }}</xt-title>
      <div class="flex justify-center items-center flex-col">
        <xt-title type="text">完成奖励</xt-title>
        <ShowReward :id="currentTask.id" />
        <StartTask :task="currentTask" class="mt-3"></StartTask>
      </div>
    </div>
    <div style="height: 16px;"></div>
  </template>

  <template v-else>
    <div class="flex flex-col items-center justify-center h-full">
      <xt-new-icon icon="fluent-emoji:glowing-star" class="mb-4" size="56"></xt-new-icon>
      <span class="xt-text-2 font-14 xt-font mb-2">🎉你已经完成所有主线任务！</span>
      <span class="xt-text-2 font-14 xt-font">可以前往「每日任务」或「支线任务」，</span>
      <span class="xt-text-2 font-14 xt-font">完成后可以获得更多奖励。</span>
    </div>
  </template>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import { getAllTask } from "../../api";
import { tasks } from "./Primary";
import { taskStore } from "../../store";
import { ref, reactive, computed, toRefs, onMounted } from "vue";
import { appStore } from '../../../../store';
import { getCurrentTaskReward } from '../../utils';

import StartTask from "../../components/StartTask.vue";
import SerialNumber from "../../components/SerialNumber.vue";
import ShowReward from "../../components/ShowReward.vue";
import TaskUserInfo from '../../components/userinfo/TaskUserInfo.vue';
import TaskReward from './TaskReward.vue';

const store = taskStore();
const app = appStore();
const { settings,userInfo } = storeToRefs(app);


const { list, taskID, currentId, completedList, currentTaskList } = toRefs(store);
/**
 * 首次进入时，处理任务进度
 */
onMounted(async () => {
  store.initTask();
});
/**
 * 处理主线任务
 */
const test = () => {
  store.taskID = "M0101";
  store.currentId = "M0101";
  store.success = false;
  store.step = -1;
};

// 获取当前章节的所有任务
let chapter = computed(() => {
  if (!store.taskID) {
    return "";
  }
  return tasks.find((item) => {
    return item.tasks.find((task) => {
      if (store.taskID == task.id) {
        return task;
      }
    });
  });
});

// 获取当前任务的下标
const stage = computed(() => {
  let index = 0;
  chapter.value.tasks.find((item) => {
    if (store.taskID === item.id) {
      return true;
    }
    index++;
    return false;
  });
  return index;
});

// 获取任务进度
const progress = computed(() => {
  let res = (stage.value / chapter.value.tasks.length) * 100;
  return res;
});

// 获取当前任务
const currentTask = computed(() => {
  return chapter.value.tasks[stage.value];
});

// 获取当前章节的任务所有奖励
const currentTaskReward = computed(()=>{
  const getChapList  =  [];

  for(const item of chapter.value.tasks){
    const list =  getCurrentTaskReward(item.id);
    if(list){
      for(const childrenItem of list){
       getChapList.push(childrenItem)
      }
    }
  }

  // 获取经验值
  const experienceValue = getChapList.filter((item)=>{return item.type === "experience"});
  // 获取积分值
  const communityPointsValue = getChapList.filter((item)=>{return item.type === "communityPoints"});
  // 获取勋章
  let medals=[]
  let items=[]
 getChapList.map((item)=>{
    if(item.type === "medal")  medals.push(
     item.data
    )
   if(item.type === "avatarFrame")  items.push(
     item.data
   )
 });
  // 获取头像框
  // 计算经验值总和
  let experienceTotal = experienceValue.reduce((sum,item)=>{
    return sum + item.value
  },0);
  // 计算积分值总和
  let communityPointsTotal = communityPointsValue.reduce((sum,item)=>{
    return sum + item.value
  },0);
  // let lving =0
  // 等级升级预期
  // if(!$useEnv('guest')){
  //   // if(Math.ceil(experienceTotal / userInfo.value?.grade?.next) > 1){
  //   //   lving  = 1;
  //   // }
  //   // else {
  //   //   lving = Math.ceil(experienceTotal / userInfo.value?.grade?.next);
  //   // }
  // }
  return {
    // lving:lving,
    experience:{total:experienceTotal,name:"经验",img:"/img/task/experience.png"},
    points:{total:communityPointsTotal,name:"积分",img:"/img/task/communityPoints.svg"},
    medals:{list:medals,name:"勋章"},
    items:{list:items,name:"头像"}
  };

})

</script>

<style lang="scss" scoped>
:deep(.ant-progress-inner) {
  height: 12px;
}

:deep(.ant-progress-bg) {
  height: 12px !important;
}
</style>
