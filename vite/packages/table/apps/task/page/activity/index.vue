<template>
  <div class="flex flex-col">
    <div class="flex justify-between mb-4">
      <div class="flex items-center">
        <xt-ify-icon icon="fluent-emoji:rainbow" class="mr-3" size="16"></xt-ify-icon>
        <xt-text class="xt-font font-14">活动任务</xt-text>
      </div>
      <Exit />
    </div>
    <div class="w-full flex flex-col">
      <TaskUserInfo />
      <span class="mb-3 xt-font xt-text-2 font-14">任务列表</span>
      <Task :task="activeList" @back="back()"></Task>
    </div>
  </div>

  <!-- <div>
    <div class="p-3 xt-bg-2 rounded-xl">
      <xt-text class="mb-3">
        <xt-new-icon icon="fluent-emoji:rainbow" size="20" class="mr-3" />
        邀请
        <span
          class="flex justify-center items-center ml-2"
          style="
            background: #faad14;
            border-radius: 4px;
            font-size: 12px;
            width: 33px;
            height: 20px;
          "
          >长期</span
        >
        <template #right>
          <div class="text-sm">
            <span class="xt-text-2">已邀请</span>
            <span>???</span>
            <span class="xt-text-2">人</span>
          </div>
        </template>
      </xt-text>
      <xt-text type="2">
        <span>
          邀请新用户注册使用工作台，新用户注册使用并完成「<span class="xt-text"
            >主线第一章</span
          >」任务后，即可获得丰厚奖励。
        </span>
      </xt-text>
      <!-- <xt-button class="mt-3" style="width: 100%" type="theme" @click="go()"
        >前往推广中心</xt-button
      > -->
    </div>
  </div> -->
</template>

<script setup>
import { taskStore } from "../../store.ts";
import { storeToRefs } from "pinia";
import { computed,ref } from "vue";
import { tasks } from './Active';

import Exit from '../../components/Exit.vue';
import TaskUserInfo from "../../components/userinfo/TaskUserInfo.vue";
import Task from '../branch/Task.vue';

const store = taskStore();
const { currentTaskList,currentTask } = storeToRefs(store);
const activeList = ref({tasks:tasks.customDesk});

// 获取定制桌面的奖励
const customDeskReward = computed(()=>{
  // const reward = currentTaskList.value.some(item => item.name === "Z0201");
  // if(reward){
  //   // const findReward = currentTaskList.value.find(item => item.name === "Z0201");
  //   // const rewardList = findReward.awardList.map((item)=>{
  //   //   if(item.origin.type === "score"){
  //   //     return {type:item.origin.type,name:item.label,value:item.origin.value,img:"/img/task/communityPoints.svg"};
  //   //   }
  //   //   else {
  //   //     if(item.origin.type === "medal") return {type:item.origin.type, name:item.label,img:item.data.icon_sm,};
  //   //     if(item.origin.type === "item") return { type:item.origin.type,img:item.data.image,name:item.label };
  //   //   }
  //   // })
  //   // return {
  //   //   list:rewardList,
  //   // }
  //   // console.log("rewardList",rewardList);
  //   // return reward;
  // }
})

const back = ()=>{
  currentTask.value = null;
}


// import { useRouter } from "vue-router";
// import { ref } from "vue";
// const flag = ref(true);
// const router = useRouter();
// const go = () => {
//   router.push({ name: "promotion" });
//   store.isTaskDrawer = false;
// };

// Z0201
</script>

<style lang="scss" scoped></style>
