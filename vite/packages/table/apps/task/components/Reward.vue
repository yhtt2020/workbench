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
      v-if="type == 'avatarFrame' || type == 'medal'"
      shape="square"
      :size="56"
      :src="types[type].icon"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <xt-ify-icon
      v-if="type == 'communityPoints' || type == 'experience'"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :icon="types[type].icon"
      size="45"
    />
    <div class="absolute z-10 bottom-0 text-sm" v-if="value" style="right: 6px">
      {{ value }}
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { taskStore } from "../store";
import { storeToRefs } from "pinia";

const props = defineProps({
  type: {},
  value: {},
  icon: {},
});
const { type } = toRefs(props);
const types = computed(() => {
  return {
    medal: {
      name: "勋章",
      icon: props.icon,
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
      icon: props.icon,
    },
  };
});
</script>

<style lang="scss" scoped></style>
