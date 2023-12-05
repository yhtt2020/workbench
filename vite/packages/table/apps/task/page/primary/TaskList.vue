<template>
  <xt-text class="mb-3 font-medium">
    <xt-new-icon
      icon="fluent:chevron-left-16-filled"
      @click="back()"
      bgClass="xt-bg-2"
      class="mr-3"
      w="40"
    />
    {{ task.chapter }}
    <template #right>
      {{ completedTask }}
    </template>
  </xt-text>
  <template v-if="getCompletedTasks.length">
    <xt-collapse v-for="data in getCompletedTasks">
      <template #title>
        <xt-text>
          <xt-new-icon icon="fluent-emoji:star" class="mr-3" size="20" />
          {{ data.title }}
        </xt-text>
      </template>
      <xt-text type="2" class="mb-3">{{ data.intro }}</xt-text>
      <xt-text class="mb-3">任务说明</xt-text>
      <xt-text type="2">{{ data.description }}</xt-text>
      <div class="flex justify-center items-center flex-col">
        <xt-text type="2" class="my-3 h-4" title="完成奖励" />
        <div class="xt-theme-text mb-3">
          暂无任务奖励，后续完工后，我们会自动补发奖励
        </div>
        <xt-text
          type="2"
          title="当前任务含有操作引导"
          class="mb-3 h-4"
          v-if="data.guide"
        />

        <StartTask :task="data" :isFirst="false" />
      </div>
    </xt-collapse>
  </template>
  <xt-text title="暂无已完成任务" v-else />
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { taskStore } from "../../store.ts";
import StartTask from "./StartTask.vue";

const sotre = taskStore();
const { list } = storeToRefs(sotre);

const props = defineProps({
  task: {},
  completedTask: {},
});

const getCompletedTasks = computed(() => {
  let array = [];
  let count = 0;
  props.task.tasks.forEach((item) => {
    if (list.value.includes(item.id)) {
      array.push(item);
    }
  });

  return array;
});

const emits = defineEmits(["back"]);
const back = () => {
  emits("back");
};
</script>

<style lang="scss" scoped></style>
