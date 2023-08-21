<template>
  <div class="flex h-full w-full rounded-xl flex-col">
    <div class="flex h-full">
      <div class="h-full flex flex-col"></div>
      <div class="h-full w-full flex flex-col p-1">
        <Main></Main>
      </div>
    </div>
  </div>
</template>

<script>
import Topic from "./topic/index.vue";
import Main from "./main/index.vue";

import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isFull", "topicList"]),
  },
  components: {
    Topic,
    Main,
  },
  async mounted() {},
};
</script>

<style lang="scss" scoped></style>
