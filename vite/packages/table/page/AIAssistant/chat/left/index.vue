<template>
  <div class="flex flex-col justify-between h-full xt-br mr-3">
    <div class="xt-scrollbar" style="width: 220px">
      <Topic v-for="data in topicList" :data="data"></Topic>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapWritableState } from "pinia";
import Topic from "./topic.vue";
import { aiStore } from "../../../../store/ai";
export default {
  components: {
    Topic,
    CreateTopic: defineAsyncComponent(() => import("./createTopic.vue")),
  },
  data() {
    return {
      createChatVisible: false,
    };
  },
  computed: {
    ...mapWritableState(aiStore, ["topicList"]),
  },
};
</script>

<style lang="scss" scoped></style>
