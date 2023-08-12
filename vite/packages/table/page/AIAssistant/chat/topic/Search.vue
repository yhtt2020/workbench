<template>
  <XtTitle type="text">搜索结果</XtTitle>
  <Topic
    v-for="(data, index) in searchList"
    :data="data"
    :index="index"
    @top="onTop"
  ></Topic>
</template>

<script>
import Topic from "./topic.vue";

import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  components: {
    Topic,
  },
  computed: {
    ...mapWritableState(aiStore, ["serachTopic", "topicList"]),
  },
  watch: {
    serachTopic() {
      this.search();
    },
  },
  mounted() {
    this.search();
  },
  methods: {
    search() {
      this.searchList = [];
      this.topicList.forEach((item) => {
        if (item.name.includes(this.serachTopic)) {
          this.searchList.push(item);
        }
      });
    },
  },
  data() {
    return {
      searchList: [],
    };
  },
};
</script>

<style lang="scss" scoped></style>
