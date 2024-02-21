<template>
  <div style="width: 355px">
    <div class="flex justify-between items-center mb-3 h-full">
      <div class="text-base flex items-center">
        <xt-ify-icon size="24" icon="fluent-emoji:star" class="mr-2" />
        任务完成！
      </div>

      <xt-ify-icon
        @click="close()"
        size="28"
        icon="fluent:dismiss-circle-16-filled"
      />
    </div>
    <div class="flex flex-col">
      <xt-text class="xt-text-2 font-16 xt-font mb-3">
        已完成「 {{ currentTask?.name }}」任务，{{
          status ? "感谢再次体验" : "点击领取奖励"
        }}。
      </xt-text>
      <ShowReward :id="currentId" />
    </div>
    <div class="flex justify-between">
      <div></div>
      <xt-button type="theme"  h="32"  radius="8" :plain="true" @click="claimReward()" w="120"> 
        {{ butText }}
      </xt-button>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, computed, onMounted, onBeforeMount } from "vue";
import { taskStore } from "../store";
import { storeToRefs } from "pinia";
import XtIfyIcon from "../../../ui/new/IfyIcon/index.vue";
import { getTaskStatus } from "../api";
import { Avatar } from "ant-design-vue";
import { appStore } from "../../../store";

import XtButton from "../../../ui/libs/button/index.vue";
import ShowReward from "./ShowReward.vue";

onBeforeMount(() => {
  taskStatus();
});

const status = ref(0);
const taskStatus = async () => {
  let res = currentTaskList.value.find((item) => item.name == currentId.value);
  status.value = res.done;
};

const store = taskStore();
const app = appStore();
const { taskID, currentTaskList, rewardVisible, currentId, claimRewardsList,isTaskDrawer } =
  storeToRefs(store);

const currentTask = computed(() => {
  return store.getTask(currentId.value);
});

const emits = defineEmits(["close-toast"]);

const close = () => {
  emits("close-toast");
};

const claimReward = () => {
  console.log("游客模式测试");
  emits("close-toast");
  // 游客模式
  if(window.$useEnv('guest')){
    tsbApi.user.login((data) => {
     app.getUserInfo();
     isTaskDrawer.value = true;
     rewardVisible.value = true;
    })
    return;
  }

  // // emits("close-toast");
  // // app.getUserInfo();
  // // // console.log("status.value :>> ", status.value);
  // // if (window.$useEnv('guest')) {
  // //   // 挑灯绿
  // //   return
  // // }
 
  app.getUserInfo();
  // 是否第二次完成
  if (status.value) {
    return;
  }
  // 领取奖励并显示弹窗
  rewardVisible.value = true;
};

// 按钮文字信息
const butText = computed(()=>{
  console.log('登录并领取',window.$useEnv('guest') && status.value == 0);
  if(window.$useEnv('guest') && status.value == 0){
    return '登录并领取'
  }
  else if(status.value != 0){
    return '确定';
  }
  else {
    return '立即领取';
  }
})


</script>

<style lang="scss" scoped></style>
