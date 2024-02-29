<template>
  <div class="w-full h-full flex flex-col">
    <div v-if="currentTask" class="h-full w-full flex flex-col">
      <xt-text class="mb-3 flex h-8">
        <xt-new-icon
          icon="fluent:chevron-left-16-filled"
          @click="back()"
          bgClass="xt-bg-2"
          class="mr-3"
          w="40"
        />
        {{ currentTask.chapter }}
        <template #right>
          <div class="flex items-center">
            <Progress
              style="width: 68px; height: 20px; margin-right: 10px"
              :task="currentTask"
            />
            <Exit />
          </div>
        </template>
      </xt-text>
      <xt-scrollbar class="flex-1 w-full overflow-hidden" :x="false" :y="true">
        <Task
          @back="back()"
          :task="currentTask"
          :icon="icon"
          :length="tasks.length"
        />
      </xt-scrollbar>
    </div>
    <template v-else>
      <div style="" class="flex justify-between items-center mb-3">
        <div style="width: 200px">支线任务</div>
        <div class="flex items-center">
          <div style="width: 68px; margin-right: 10px" v-if="tasks.length <= 1">
            <Progress :task="tasks[0]" style="width: 68px; height: 20px" />
          </div>
          <Exit />
        </div>
      </div>
      <div class="mb-3" style="width: 404px;">
        <template v-if="!$useEnv('guest')">
          <TaskUserInfo :showPointGood="true"/>
        </template>
        <div class="xt-bg-2  rounded-xl p-3">
          <TaskReward :showTaskReward="getZTaskReward" :showTip="true" :isCenter="''"/>
        </div>
      </div>
      <xt-scrollbar
        v-if="tasks.length <= 1"
        class="h-full w-full"
        :x="false"
        :y="true"
      >
        <Task @back="back()" :task="filterTask" :icon="icon" :length="1" />
      </xt-scrollbar>
      <template v-else>
        <xt-scrollbar class="h-full w-full" :x="false" :y="true">
          <xt-menu :menus="menus" v-for="(task, index) in tasks">
            <div
              class="flex flex-col xt-bg-2 rounded-xl mb-3 p-3 cursor-pointer"
              @click="taskClick(task)"
            >
              <xt-title m="">
                <div class="flex items-center">
                  <SerialNumber :id="index + 1" />
                  {{ task.name }}
                </div>
                <template #right
                  ><Progress :task="task" style="width: 68px; height: 20px"
                /></template>
              </xt-title>
              <xt-title type="text" m="mt">
                {{ task.info }}
              </xt-title>
            </div>
          </xt-menu>
        </xt-scrollbar>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive,computed } from "vue";
import { getCurrentTaskReward } from '../../utils';
import { storeToRefs } from 'pinia';
import { appStore } from '../../../../store';
import grade from '../../../../js/common/grade';

import SerialNumber from "../../components/SerialNumber.vue";
import Task from "./Task.vue";
import Progress from "../../components/progress/index.vue";
import Exit from "../../components/Exit.vue";
import TaskUserInfo from "../../components/userinfo/TaskUserInfo.vue";
import TaskReward from "../primary/TaskReward.vue";


const props = defineProps({
  tasks: {},
  icon: {},
});
const app  = appStore();
const { userInfo,lvInfo } = storeToRefs(app);

const menus = reactive([
  {
    label: "固定到左侧",
    callBack: () => {},
  },
]);
const currentTask = ref(null);

const taskClick = (task) => {
  currentTask.value = task;
};

const back = () => {
  currentTask.value = null;
};

const filterTask = computed(()=>{
  const filterRes = props.tasks[0].tasks.filter((item)=>{ return String(item.id) !== 'Z0201' });
  return {tasks:filterRes};
});

// 获取奖励
const getZTaskReward = computed(()=>{
  if(props.tasks.length === 3){
    const chatTaskID = [];
    for(const taskItem of props.tasks){
      for(const childrenItem of taskItem.tasks){
        chatTaskID.push(childrenItem.id);
      }
    };
    const resList = mergeList(chatTaskID);
    return getTotal(resList);
  }
  else {
    const idList = props.tasks[0].tasks.map((item)=>{ return item.id });
    const resList = mergeList(idList);
    return getTotal(resList);
  }
})
// 将奖励数据进行合并
const mergeList = (arr) =>{
  const getRewardList = [];
  for(const id of arr){
    const result = getCurrentTaskReward(id);
    for(const children of result){
      getRewardList.push(children)
    }
  };
  return getRewardList;
};
// 合并计算总数
const getTotal = (list) =>{
  // 合并经验值,并且计算出总经验值
  const expList = list.filter((item)=>{ return item.type === 'experience' }).reduce((sum,item)=>{
    return sum + item.value
  },0);
  // 合并积分值,并且计算出总积分值
  const points = list.filter((item)=>{ return item.type === 'communityPoints' }).reduce((sum,item)=>{
    return sum + item.value
  },0);
  const medal = list.filter((item)=>{ return item.type === 'medal' }).map((item)=>{ return item.data;  });
  console.log('结果',grade.gradeTableGenerate(10),lvInfo.value);
  console.log('结果',userInfo.value);

  return  {
    experience:{total:expList,name:"经验",img:"/img/task/experience.png",},
    points:{total:points,name:"积分",img:"/img/task/communityPoints.svg"},
    medals:{list:medal,name:"勋章"},
    items:{}
  }
}

</script>

<style lang="scss" scoped></style>
