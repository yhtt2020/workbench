<template>
  <div class="mr-0 xt-br" style="width: 220px">
    <Search v-if="serachTopic"></Search>
    <template v-else>
      <Top></Top>
      <Today></Today>
    </template>
  </div>
</template>

<script>
import Top from "./top.vue";
import Today from "./today.vue";
import Search from "./Search.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
import { apiList } from "./test.ts";
import _ from "lodash-es";
export default {
  computed: {
    ...mapWritableState(aiStore, [
      "todayList",
      "topList",
      "previousList",
      "serachTopic",
      "topicList",
    ]),
  },
  components: {
    Top,
    Today,
    Search,
  },
  mounted() {
    this.topicList = apiList;
    this.initList();
  },
  watch: {
    topicList: {
      handler(newV) {
        this.initList();
        console.log("123 :>> ", 133323);
      },
      deep: true,
    },
  },
  methods: {
    initList() {
      this.topList = [];
      this.todayList = [];
      this.previousList = [];
      this.topicList.forEach((item) => {
        if (item.top) {
          this.topList.push(item);
        } else if (this.isToday(item.time)) {
          this.todayList.push(item);
        } else {
          this.previousList.push(item);
        }
      });
    },
    isToday(time) {
      const date = new Date(time);
      const today = new Date();
      const day = date.getDate() === today.getDate();
      const month = date.getMonth() === today.getMonth();
      const year = date.getFullYear() === today.getFullYear();
      const isToday = year && month && day;
      return isToday;
    },
  },
};
</script>

<style lang="scss" scoped></style>
