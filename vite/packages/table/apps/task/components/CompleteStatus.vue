<template>
  <xt-modal :footer="0" v-model="visible">
    <div class="mb-4 flex justify-center items-center flex-col">
      <xt-ify-icon icon="fluent-emoji:glowing-star" size="100" class="mb-3" />
      <div>{{ types[props.type]?.info }}</div>
    </div>
    <div class="flex justify-between">
      <div></div>
      <xt-button w="80" h="40" type="theme" @click="visible = false" radius="8">{{
        types[props.type]?.button
      }}</xt-button>
    </div>
  </xt-modal>
</template>

<script setup>
import { ref, toRefs } from "vue";
const props = defineProps({
  type: {},
  info: {},
});

const visible = ref(true);

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
</script>

<style lang="scss" scoped></style>
