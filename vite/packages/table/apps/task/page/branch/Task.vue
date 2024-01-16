<template>
  <xt-text class="mb-3 flex h-8" v-if="length > 1">
    <xt-new-icon
      icon="fluent:chevron-left-16-filled"
      @click="back()"
      bgClass="xt-bg-2"
      class="mr-3"
      w="40"
    />
    {{ task.chapter }}
    <template #right>
     <div class="flex items-center">
      <Progress style="width: 68px; height: 20px;margin-right: 10px;" :task="task"  />
      <Exit />
     </div>
    </template>
  </xt-text>
  <xt-collapse v-for="data in task.tasks" class="mb-3">
    <template #title>
      <xt-text>
        <xt-new-icon :icon="icon" class="mr-3" size="20" />
        {{ data.name }}
      </xt-text></template
    >
    <xt-title type="text" m="mb">{{ data.info }} </xt-title>
    <ShowReward :id="data.id" />
    <StartTask :task="data" />
  </xt-collapse>
</template>

<script setup>
import { computed, toRefs, ref, reactive } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import Progress from "../../components/progress/index.vue";
import StartTask from "../../components/StartTask.vue";

import { taskStore } from "../../store";
import ShowReward from "../../components/ShowReward.vue";
import Exit from "../../components/Exit.vue";

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
</script>

<style lang="scss" scoped></style>
