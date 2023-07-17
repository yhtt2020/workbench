<template>
  <View :data="chatList">
    <template #chat>
      <List :chatList="chatList"></List>
    </template>
    <template #text>
      <Text @onSearch="onSearch" :isSearch="isSearch"></Text>
    </template>
  </View>
</template>
<script>
import Text from "./Text.vue";
import List from "./List.vue";
import View from "./View.vue";
import { marked } from "marked";
import { getMd } from "../api/test.js";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["selectTopicIndex", "topicList", "chatObj"]),
    selectChat() {
      let chat = this.topicList[this.selectTopicIndex];
      let selectChat = this.chatObj[chat.chatId];
      return selectChat;
    },
  },
  watch: {
    selectTopicIndex(newV) {
      let chat = this.topicList[newV];
      // 这一步去api地址请求

      // 当前是空值 所以去添加
      if (!chat.chatId) {
        // 伪api
        chat.chatId = Date.now();
        this.chatObj[chat.chatId] = [];
      }
      this.chatList = this.chatObj[chat.chatId];
      console.log("object :>> ", this.chatList);
    },
  },
  components: {
    Text,
    List,
    View,
  },
  data() {
    return {
      markdown: "",
      chatList: [],
      isSearch: true,
    };
  },
  methods: {
    async getMdData() {
      let res = await getMd();
      this.markdown = res.data.data;
    },
    async onSearch(serach) {
      let user = {
        content: marked.parse(serach),
        type: "user",
        time: Date.now(),
      };

      this.chatList.push(user);
      this.isSearch = false;
      this.markdown =
        "早上好1早上好1早上好1早上好1早上好1早上好1早上好1早上好1早上好1早上好1早上好1早上好1早上好1早上好1早上好1早上好1";
      // await this.getMdData();

      let gpt = {
        content: "",
        type: "gpt",
        time: Date.now(),
      };

      this.chatList.push(gpt);

      let index = 0;
      let timeId = setInterval(() => {
        if (index >= this.markdown.length) {
          clearInterval(timeId);
          this.isSearch = true;
          return;
        }
        this.chatList[this.chatList.length - 1].content +=
          this.markdown[index++]; // 获取数组最后的对象并逐步添加数据到其 content 属性
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped></style>
