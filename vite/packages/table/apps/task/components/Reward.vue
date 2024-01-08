<template>
  <div
    class="relative overflow-hidden rounded-xl"
    style="
      width: 64px;
      height: 64px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    "
  >
    <div
      class="absolute right-0 top-0 text-xs flex justify-center items-center z-10"
      style="
        background: #508bfe;
        width: 32px;
        height: 20px;
        border-radius: 0px 10px 0px 10px;
      "
    >
      {{ types[type].name }}
    </div>
    <a-avatar
      v-if="type == 'communityPoints' || type == 'medal'"
      shape="square"
      :size="48"
      :src="types[type].icon"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <xt-ify-icon
      v-if="type == 'communityPoints' || type == 'experience'"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :icon="types[type].icon"
      size="48"
    />
    <div class="absolute z-10 bottom-0 text-sm" v-if="info" style="right: 6px">
      {{ info }}
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { taskStore } from "../store";
import { storeToRefs } from "pinia";

const store = taskStore();
const { taskID, currentTaskList } = storeToRefs(store);
console.log("currentTaskList.value :>> ", currentTaskList.value);
const props = defineProps({
  type: {},
  info: {},
  id: {},
});
const { type, id } = toRefs(props);
const types = computed(() => {
  return {
    medal: {
      name: "勋章",
      icon: getTaskMedal.value,
    },
    communityPoints: {
      name: "积分",
      icon: "fluent-emoji:gem-stone",
    },
    experience: {
      name: "经验",
      icon: "fluent-emoji:coin",
    },
    avatarFrame: {
      name: "头像",
      icon: getAvatarFrame.value,
    },
  };
});

const currentId = computed(() => {
  if (id.value) return id.value;
  return taskID.value;
});

const getTask = computed(() => {
  let { awardList } = currentTaskList.value.find(
    (item) => item.name == currentId.value
  );
  return awardList;
});

const getTaskMedal = computed(() => {
  if (type.value != "medal") return "";
  let { data } = getTask.value.find((item) => item.label == "道具");

  console.log("data :>> ", data);
  return data.icon;
});

const getAvatarFrame = computed(() => {
  if (type.value != "avatarFrame") return "";
  let { data } = getTask.value.find((item) => item.label == "勋章");
  console.log("data :>> ", data);
  return data.icon_sm;
});
</script>

<style lang="scss" scoped></style>
