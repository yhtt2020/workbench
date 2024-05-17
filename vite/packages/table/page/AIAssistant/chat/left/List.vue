<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center">
      <xt-mix-icon icon="fluent:chat-16-regular" class="mr-2" />
      聊天
    </div>
    <xt-base-icon
      @click="add()"
      icon="tianjia2"
      class="mr-3 xt-text"
      style="font-size: 16px"
    ></xt-base-icon>
  </div>
  <template v-if="topList.length">
    <XtTitle type="text">置顶</XtTitle>
    <Topic
      v-for="data in topList.sort((a, b) => {
        return b.time - a.time;
      })"
      :data="data"
      :key="data.id"
    ></Topic>
  </template>
  <template v-if="todayList.length">
    <XtTitle type="text">今天</XtTitle>
    <Topic
      v-for="data in todayList.sort((a, b) => {
        return b.time - a.time;
      })"
      :data="data"
      :key="data.id"
    ></Topic>
  </template>
  <template v-if="previousList.length">
    <XtTitle type="text">过去</XtTitle>
    <Topic
      v-for="data in previousList.sort((a, b) => {
        return b.time - a.time;
      })"
      :data="data"
      :key="data.id"
    ></Topic>
  </template>
</template>

<script>
import Topic from "./topic.vue";
import { mapWritableState, mapActions } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["todayList", "topList", "previousList"]),
  },
  components: { Topic },
  methods: {
    ...mapActions(aiStore, ["addTopic"]),
    add() {
      this.addTopic();
    },
  },
};
</script>

<style lang="scss" scoped></style>
