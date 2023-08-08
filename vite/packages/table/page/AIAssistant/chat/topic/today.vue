<template>
  <XtTitle type="text">今天</XtTitle>
  <Topic v-for="data in todayList" :data="data" @top="onTop"></Topic>
  <XtTitle type="text">过去</XtTitle>
  <Topic v-for="data in previousList" :data="data" @top="onTop"></Topic>
</template>

<script>
import Topic from "./topic.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["todayList", "topList", "previousList"]),
  },
  components: { Topic },
  methods: {
    onTop() {
    },
  },
};
</script>

<style lang="scss" scoped></style>
