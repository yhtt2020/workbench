<template>
  <xt-collapse v-for="(data, index) in task.tasks" class="mb-3">
    <template #title>
      <xt-text>
        <SerialNumber :id="index + 1" />
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
</script>

<style lang="scss" scoped></style>
