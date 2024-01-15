<template>
  <div class="flex w-full items-center justify-center mb-3">
    <Reward v-for="item in getReward" v-bind="item" class="mx-1" />
  </div>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { taskStore } from "../store";
import { storeToRefs } from "pinia";

import Reward from "./Reward.vue";

const store = taskStore();
const { currentId, currentTaskList } = storeToRefs(store);
const props = defineProps({
  id: {},
});

const id = computed(() => {
  if (props.id) return props.id;

  return currentId.value;
});

const emits = defineEmits("onReward");

const getReward = computed(() => {
  const result = currentTaskList.value.find((item) => item.name == id.value);
  if (result) {
    let { awardList } = result;
    let arr = [];
    awardList.forEach((item) => {
      if (item.label == "道具") {
        arr.push({
          name: "头像",
          type: "avatarFrame",
          icon: item.data.icon,
        });
      } else if (item.label == "勋章") {
        arr.push({
          type: "medal",
          icon: item.data.icon_lg,
        });
      } else if (item.label == "积分") {
        if (item.data.name == "社区积分") {
          emits("onReward", "communityPoints");
          arr.push({
            type: "communityPoints",
            value: item.origin.value,
          });
        } else if (item.data.name == "经验值") {
          emits("onReward", "experience");
          arr.push({
            type: "experience",
            value: item.origin.value,
          });
        }
      }
    });

    return arr;
  } else {
    return null;
  }
});
</script>

<style lang="scss" scoped></style>
