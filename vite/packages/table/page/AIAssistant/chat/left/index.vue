<template>
  <div class="flex flex-col justify-between h-full xt-br mr-3">
    <div class="xt-scrollbar" style="width: 220px">
      <List></List>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapWritableState } from "pinia";
import Topic from "./topic.vue";
import List from "./List.vue";
import { aiStore } from "../../../../store/ai";
export default {
  components: {
    Topic,
    List,
    CreateTopic: defineAsyncComponent(() => import("./createTopic.vue")),
  },
  data() {
    return {
      createChatVisible: false,
    };
  },
  computed: {
    ...mapWritableState(aiStore, [
      "topicList",
      "todayList",
      "topList",
      "previousList",
    ]),
  },
  async mounted() {
    this.initList();
  },
  watch: {
    topicList: {
      handler(newV) {
        this.initList();
      },
      deep: true,
    },
  },
  methods: {
    initList() {
      this.topList = [];
      this.todayList = [];
      this.previousList = [];
      for (let key in this.topicList) {
        let item = this.topicList[key];
        if (item.top) {
          this.topList.push(item);
        } else if (this.isToday(item.time)) {
          this.todayList.push(item);
        } else {
          this.previousList.push(item);
        }
      }
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
