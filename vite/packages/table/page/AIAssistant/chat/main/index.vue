<template>
  <View :data="chatList">
    <template #chat>
      <List :chatList="chatList"></List>
    </template>
    <template #text>
      <Text @onSearch="onSearch" :isSearch="isSearch"></Text>
    </template>
  </View>
  <!-- <test></test> -->
</template>
<script>
import test from "./test.vue";
import Text from "./Text.vue";
import List from "./List.vue";
import View from "./View.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
import { gpt } from "../../service/api/ai";
import { message } from "ant-design-vue";
export default {
  computed: {
    ...mapWritableState(aiStore, [
      "selectTopicIndex",
      "topicList",
      "chatObj",
      "url",
      "key",
    ]),
    selectChat() {
      let chat = this.topicList[this.selectTopicIndex];
      let selectChat = this.chatObj[chat.chatId];
      return selectChat;
    },
  },
  watch: {
    async selectTopicIndex(newV) {
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

      return;
      let chat = this.topicList[newV];
      if (this.topicList[newV].chatId == null) {
        chat = {}; // 设置 chat 为空对象或其他默认值
        chat.chatId = Date.now(); // 设置 chat.chatId 为当前时间戳或其他默认值
        this.chatObj[chat.chatId] = []; // 初始化 chatId 对应的数组
      }
      this.chatList = this.chatObj[chat.chatId];
    },
  },
  components: {
    Text,
    List,
    View,
    test,
  },
  data() {
    return {
      markdown: "",
      chatList: [],
      isSearch: true,
    };
  },
  methods: {
    // https://api.closeai-proxy.xyz
    check() {
      if (!this.key || !this.url) {
        message.error("请先配置好信息");
        return true;
      }
      return false;
    },
    async getMdData() {
      let res = await getMd();
      this.markdown = res;
    },
    async onSearch(serach) {
      if (this.check()) return;
      let user = {
        content: serach,
        role: "user",
        time: Date.now(),
        id: Date.now(),
      };
      this.chatList.push(user);
      // 获取聊天机器人的回复
      for await (const result of gpt([
        {
          role: "user",
          content: serach,
        },
      ])) {
        // 如果返回的结果 ID 与当前对话 ID 相同，则将聊天机器人的回复拼接到当前对话中
        const index = this.chatList.findIndex((item) => item.id === result.id);

        if (index !== -1) {
          this.chatList[this.chatList.length - 1].content += result.content;
        } else {
          let assistant = {
            content: result.content,
            role: result.role,
            time: Date.now(),
            id: result.id,
          };
          this.chatList.push(assistant);
        }
      }
      return;
    },
  },
};
</script>

<style lang="scss" scoped></style>
