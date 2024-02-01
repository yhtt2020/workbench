<template>
  <xt-modal :footer="0" v-model="rewardVisible" index="9999">
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
      <transition
        name="animate__animated animate__bounce"
        enter-active-class="animate__bounceIn"
        leave-active-class="animate__bounceOut"
      >
        <xt-ify-icon
          v-if="visible"
          icon="fluent-emoji:glowing-star"
          size="100"
          class="mb-3"
        />
      </transition>

      <div>{{ types[props.type]?.info }}</div>
      <ShowReward @onReward="getAudio" />
    </div>
    <div class="flex justify-between">
      <div></div>
      <div class="flex items-center">
        <xt-button
          w="80"
          h="40"
          class="mr-3"
          @click="rewardVisible = false"
          radius="8"
          >{{ types[props.type]?.button }}</xt-button
        >
        <xt-button
          v-if="currentId != 'Z0201'"
          w="80"
          h="40"
          type="theme"
          @click="goTask"
          radius="8"
          >下一个</xt-button
        >
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { ref, toRefs, computed, onMounted } from "vue";
import { taskStore } from "../store";
import { storeToRefs } from "pinia";
import ShowReward from "./ShowReward.vue";
import "animate.css";
import { getReward } from "../task";

const store = taskStore();
const visible = ref(false);
const { taskID, currentTaskList, rewardVisible, currentId, isTaskDrawer } =
  storeToRefs(store);
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

const goTask = () => {
  rewardVisible.value = false;
  isTaskDrawer.value = true;
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
