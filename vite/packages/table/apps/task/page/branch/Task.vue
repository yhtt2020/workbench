<template>
  <xt-collapse v-for="(data, index) in task.tasks" class="mb-3" :index="index" v-model="data.isCollapseStatus">
    <template #title>
      <div class="flex justify-between w-full">
        <xt-text>
          <SerialNumber :id="index + 1" />
          <span style="max-width: 280px;">
            {{ data.name }}
          </span>
        </xt-text>
        <div class="flex items-center justify-center">
          <ShowReward v-if="!isCollapse(index,data)" :id="data.id" class="showReward-title"/>
        </div>
      </div>
    </template>
    <xt-title type="text" m="mb">{{ data.info }} </xt-title>
    <ShowReward :id="data.id" />
    <StartTask :task="data" />
  </xt-collapse>
</template>

<script setup>
import { computed, toRefs, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import SerialNumber from "../../components/SerialNumber.vue";

import StartTask from "../../components/StartTask.vue";

import { taskStore } from "../../store";
import ShowReward from "../../components/ShowReward.vue";

const store = taskStore();
const router = useRouter();
const { successBranchTask, startBranchTask } = storeToRefs(store);

const props = defineProps({
  task: {
    default: {},
  },
  icon: {},
  length: {},
});

const emits = defineEmits(["back"]);
const back = () => {
  emits("back");
};

// 根据当前id来判断是否触发当前任务折叠
const isCollapse = (index,data) =>{
  if(data.isCollapseStatus?.index === index){
    if(data.isCollapseStatus?.val === '0'){
      return true;
    }
    else {
      return false
    }
  }
  else {
    return false;
  }
}
</script>

<style lang="scss" scoped>
:deep(.ant-collapse-header){
  padding: 12px 16px 12px 16px !important ;
}
:deep( .showReward-title){
  margin-bottom: 0 !important;
  & .reward-w{
    zoom:0.5;
  }
}
</style>
