<template>
  <View :data="currentList">
    <template #chat>
      <List :chatList="currentList"></List>
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
    currentList() {
      if (this.selectTopicIndex == -1) return [];

      return this.topicList[this.selectTopicIndex].chat;
    },
  },
  components: {
    List,
    View,
    Text,
  },
  data() {
    return {
      markdown: "",
      chatList: [],
      isSearch: true,
    };
  },
  methods: {
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
      console.log("serach :>> ", serach);
      if (this.check()) return;
      if (this.selectTopicIndex == -1) {
        let obj = {
          chat: [],
          icon: {
            name: "message",
            id: 0,
          },
          id: Date.now(),
          time: Date.now(),
          name: "新的对话",
          top: false,
        };
        this.topicList[obj.id] = obj;
        this.selectTopicIndex = obj.id;
      }
      let user = {
        content: serach,
        role: "user",
        time: Date.now(),
        id: Date.now(),
      };
      this.topicList[this.selectTopicIndex].chat.push(user);

      let arr = [];

      this.topicList[this.selectTopicIndex].chat.slice(-2).forEach((item) => {
        arr.push({
          role: item.role,
          content: item.content,
        });
      });
      console.log("arr :>> ", arr);
      // [
      //   {
      //     role: "user",
      //     content: serach,
      //   },
      // ]yb

      // 获取聊天机器人的回复
      for await (const result of gpt(arr)) {
        // 如果返回的结果 ID 与当前对话 ID 相同，则将聊天机器人的回复拼接到当前对话中
        const index = this.topicList[this.selectTopicIndex].chat.findIndex(
          (item) => item.id === result.id
        );

        if (index !== -1) {
         
          this.topicList[this.selectTopicIndex].chat[
            this.topicList[this.selectTopicIndex].chat.length - 1
          ].content += result.content;

          // this.chatList[this.chatList.length - 1].content += result.content;
        } else {
          let assistant = {
            content: result.content,
            role: result.role,
            time: Date.now(),
            id: result.id,
          };
          this.topicList[this.selectTopicIndex].chat.push(assistant);
        }
      }
      return;
    },
  },
};
</script>

<style lang="scss" scoped></style>
