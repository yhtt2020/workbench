<template>
  <xt-modal :footer="0" v-model="rewardVisible" index="9999" v-if="rewardVisible">
    <div
      class=" flex justify-center items-center flex-col"
      style="width: 500px"
    >
      <audio controls class="hidden" style="" autoplay :volume="0.1">
        <source
          v-if="audio == 'communityPoints'"
          src="./communityPoints.mp3"
          type="audio/mpeg"
        />
        <source v-else src="./experience.mp3" type="audio/mpeg" />
      </audio>
      <div class="mb-3 xt-text xt-font font-16">
        🎉{{ types[props.type]?.info }}
      </div>
      <transition
        name="animate__animated animate__bounce"
        enter-active-class="animate__bounceIn"
        leave-active-class="animate__bounceOut"
      >
        <ShowReward v-if="visible" @onReward="getAudio" />
      </transition>

      <TaskUserInfo :showTaskUser="true" :showPointGood="true"/>
    </div>
    <div class="flex justify-between">
      <div></div>
      <div class="flex items-center">
        <xt-button w="80" h="40" type="theme" @click="goTask" radius="8">
          完成
        </xt-button>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { ref, toRefs, computed, onMounted,getCurrentInstance } from "vue";
import { taskStore } from "../store";
import { storeToRefs } from "pinia";
import ShowReward from "./ShowReward.vue";
import "animate.css";
import { getReward } from "../task";
import { useToast } from 'vue-toastification';

import TaskUserInfo from "./userinfo/TaskUserInfo.vue";
import TaskGuide from "./TaskGuide.vue";

const store = taskStore();
const visible = ref(false);
const { taskID, currentTaskList, rewardVisible, currentId, isTaskDrawer,smallMize,currentCompleteTaskId} = storeToRefs(store);
const { proxy  } = getCurrentInstance();

const props = defineProps({
  type: {
    type: String,
    default: "task",
  },
  info: {},
});

onMounted(async () => {
  setTimeout(() => {
    visible.value = true;
    console.log('第三个定时器',333333);
  }, 10);
  getReward(currentId.value);
});
const currentTask = computed(() => {
  return store.getTask(store.currentId);
});

const types = {
  all: {
    info: "恭喜！你已完成所有「主线任务」，未完待续～",
    button: "完成",
  },
  chapter: {
    info: "恭喜！当前章节任务已完全部完成！",
    button: "下一章",
  },
  task: {
    info: "恭喜！任务已完成，获得以下奖励：",
    button: "完成",
  },
};

// 完成第一章主线任务
const taskFirstGuide = () =>{
  const toast = useToast();
  toast(
    {
      component:TaskGuide,
      listeners:{
         startTask:()=>{
          proxy.$.appContext.app.config.globalProperties.$bus.emit('start');
         }
      }
    },
    {
      position: "top-right",
      icon: false,
      closeOnClick: false,
      closeButton: false,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      timeout: 0,
      toastClassName: "notice-toast",
    }
  )
}

// 完成主线任务最后一个
const taskLastGuide = () =>{
  const toast = useToast();
  toast(
    {
      component:TaskGuide,
    },
    {
      position: "top-right",
      icon: false,
      closeOnClick: false,
      closeButton: false,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      timeout: 0,
      toastClassName: "notice-toast",
    }
  )
}

const goTask = () => {
  // 完成主线第一章所有任务后的预告提示
  if(currentTask.value.suf === 'M0201'){
    rewardVisible.value = false;
    taskFirstGuide()
  }
  // 完成主线所有任务后的预告提示
  else if(currentTask.value.suf === ''){
    rewardVisible.value = false;
    taskLastGuide();
  }
  else {
    rewardVisible.value = false;
    isTaskDrawer.value = true;
    smallMize.value = true;
    currentCompleteTaskId.value = currentId.value;
  }
};

const audio = ref("");
const getAudio = (data) => {
  if (data == "communityPoints") {
    audio.value = "communityPoints";
  } else {
    audio.value = "experience";
  }
};
</script>

<style lang="scss" scoped></style>
