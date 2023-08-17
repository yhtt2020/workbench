<template>
  <View :data="chatList">
    <template #chat>
      <List :chatList="chatList"></List>
    </template>
    <template #text>
      <Text @onSearch="onSearch" :isSearch="isSearch"></Text>
    </template>
  </View>
  <test></test>
</template>
<script>
import test from "./test.vue"
import Text from "./Text.vue";
import List from "./List.vue";
import View from "./View.vue";
import { marked } from "marked";
import { getMd } from "../api/test.js";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
import { gpt3 } from "../../service/api/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["selectTopicIndex", "topicList", "chatObj"]),
    selectChat() {
      let chat = this.topicList[this.selectTopicIndex];
      let selectChat = this.chatObj[chat.chatId];
      return selectChat;
    },
  },
  data() {
    return {
      full: false,
      visible: true,
    };
  },
  watch: {
    selectTopicIndex(newV) {
      if (newV === -1) return;
      let item = this.topicList.find((item) => {
        if (item.id == newV) {
          return item;
        }
      });
      if (!item.chatId) {
        item.chatId = Date.now();
        this.chatObj[item.chatId] = [];
      }
      this.chatList = this.chatObj[item.chatId];
      console.log("object :>> ", this.chatObj[item.chatId]);
      // console.log("item :>> ", item);
      return;
      let chat = this.topicList[newV];
      console.log("chat :>> ", chat);
      if (this.topicList[newV].chatId == null) {
        console.log("123 :>> ", 123);
        chat = {}; // 设置 chat 为空对象或其他默认值
        chat.chatId = Date.now(); // 设置 chat.chatId 为当前时间戳或其他默认值
        this.chatObj[chat.chatId] = []; // 初始化 chatId 对应的数组
      }
      this.chatList = this.chatObj[chat.chatId];
      console.log("chatObj :>> ", this.chatObj);
      console.log("chatId :>> ", chat.chatId);
    },
  },
  components: {
    Text,
    List,
    View,test
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
      this.markdown = res;
    },
    async onSearch(serach) {
      console.log("serach :>> ", serach);
      let user = {
        content: marked.parse(serach),
        role: "user",
        time: Date.now(),
      };

      this.chatList.push(user);
      let { choices } = await gpt3([
        {
          role: "user",
          content: serach,
        },
      ]);

      console.log("object :>> ", choices);
      this.isSearch = false;
      this.markdown = choices[0].content;
      console.log("object :>> ", choices[0].content);
      return;
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
