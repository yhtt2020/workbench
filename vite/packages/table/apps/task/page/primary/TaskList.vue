<template>
  <xt-text class="mb-4 font-medium">
    <xt-button
      ifyIcon="fluent:chevron-left-16-regular"
      w="32"
      h="32"
      radius="8"
      class="mr-3"
      @click="back()"
    />
    {{ task.chapter }} ({{ completedTask }})
  </xt-text>
  <template v-if="getCompletedTasks.length">
    <xt-text type="2" class="mb-4"> {{ task.info }}</xt-text>
    <xt-collapse v-for="data in getCompletedTasks" class="mb-3">
      <template #title>
        <xt-text>
          <xt-new-icon icon="fluent-emoji:star" class="mr-3" size="20" />
          {{ data.name }}
        </xt-text>
      </template>
      <xt-text type="2" class="mb-3">{{ data.intro }}</xt-text>
      <xt-text class="mb-3">任务说明</xt-text>
      <xt-text type="2" class="mb-3">{{ data.description }}</xt-text>
      <ShowReward :id="data.id" />
      <StartTask :task="data" :isFirst="false" />
    </xt-collapse>
  </template>
  <xt-text title="暂无已完成任务" v-else />
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { taskStore } from "../../store.ts";
import StartTask from "../../components/StartTask.vue";
import ShowReward from "../../components/ShowReward.vue";

const sotre = taskStore();
const { completedList } = storeToRefs(sotre);

const props = defineProps({
  task: {},
  completedTask: {},
});

const getCompletedTasks = computed(() => {
  let array = [];
  let count = 0;
  props.task.tasks.forEach((item) => {
    if (completedList.value.includes(item.id)) {
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
