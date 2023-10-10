<template>
  <div>
    <xt-title m="mb">
      <div class="flex">
        <!-- <MyIcon
          icon="icon-park-outline:left"
          @click="back()"
          style="height: 24px; font-size: 20px"
        /> -->
        <div class="flex items-center">
          <xt-new-icon
            icon="fluent:chevron-left-16-filled"
            @click="back()"
            type="1"
            class="mr-3"
            w="40"
          />
          {{ task.chapter }}
        </div>
      </div>
      <template #right>
        <Progress style="width: 68px; height: 20px" :task="task"
      /></template>
    </xt-title>
    <xt-collapse v-for="data in task.tasks">
      <template #title>
        <xt-text>
          <FlagOutlined
            style="
              margin-right: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              background: #508bfe;
              width: 20px;
              height: 20px;
              border-radius: 10px;
              font-size: 10px;
            "
          />{{ data.title }}
        </xt-text></template
      >

      <xt-title type="text" m="mb">{{ data.info }} </xt-title>
      <xt-button
        v-if="taskState(data)"
        @click="getReceive(data)"
        type="theme"
        style="width: 100%"
        >领取奖励</xt-button
      >
      <xt-button v-else @click="startTak(data)" type="theme" style="width: 100%"
        >开始任务</xt-button
      >
    </xt-collapse>
  </div>
</template>

<script setup>
import { computed, toRefs, ref, reactive } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { Icon as MyIcon } from "@iconify/vue";
import { FlagOutlined } from "@ant-design/icons-vue";

import { storeToRefs } from "pinia";

import Progress from "../../components/progress/index.vue";
import { guide } from "./guide";

import { taskStore } from "../../store";

const store = taskStore();
const router = useRouter();
const { successBranchTask, startBranchTask } = storeToRefs(store);

const props = defineProps({
  task: {
    default: {},
  },
});

const emits = defineEmits(["back"]);
const back = () => {
  console.log("111 :>> ", 111);
  emits("back");
};

// 开始任务
const startTak = (data) => {
  // 1 前置进度校验
  const { id, pre } = data;
  if (pre) {
    // 没完成
    if (!successBranchTask.value.has(pre)) {
      message.info("需要完成前置任务" + pre);
      return;
    }
  }
  // 2 开始跳转指引
  startBranchTask.value.add(id);
  let currentGuide = guide[id];
  console.log("currentGuide :>> ", currentGuide);

  const { type, value } = guide[id];
  if (type == "router") {
    router.push({
      name: value,
    });
  }
  store.isTaskDrawer = false;
  return;
  setTimeout(() => {
    successBranchTask.value.add(id);
  }, 3000);
};
// 任务完成状态
const taskState = (data) => {
  if (successBranchTask.value.has(data.id)) return true;
  return false;
};
/**
 * 布置任务点
 * 定位完成任务函数
 * 判断是否开启任务
 * 执行下一步
 * 抽离为action方法
 */
// 获取奖励
const getReceive = () => {
  message.info("你已完成任务 后续可以一键领取任务奖励");
};
</script>

<style lang="scss" scoped></style>
