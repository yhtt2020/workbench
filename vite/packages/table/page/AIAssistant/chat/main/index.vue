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
import { mapWritableState, mapActions } from "pinia";
import { aiStore } from "../../../../store/ai";
import { gpt } from "../../service/api/ai";
import { message } from "ant-design-vue";
export default {
  computed: {
    ...mapWritableState(aiStore, [
      "selectTopicIndex",
      "topicList",
      "chatList",
      "url",
      "key",
      "count",
    ]),
    currentList() {
      if (this.selectTopicIndex == -1) return [];
      return this.chatList[this.selectTopicIndex];
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
      isSearch: true,
      flag: false,
    };
  },
  methods: {
    ...mapActions(aiStore, ["addTopic"]),
    check() {
      if (!this.key || !this.url) {
        message.error("请先配置好信息");
        return true;
      }
      return false;
    },
    async onSearch(serach) {
      if (this.check()) return;
      this.selectTopicIndex == -1;
      if (this.selectTopicIndex == -1) {
        this.addTopic();
      }
      let user = {
        content: serach,
        role: "user",
        time: Date.now(),
        id: Date.now(),
      };
      this.chatList[this.selectTopicIndex].push(user);

      let arr = [];

      this.chatList[this.selectTopicIndex]
        .slice(-1 * this.count)
        .forEach((item) => {
          arr.push({
            role: item.role,
            content: item.content,
          });
        });

      // 获取聊天机器人的回复
      for await (const result of gpt(arr)) {
        if (result.value) {
          message.error(result.value.error.message);
          return;
        }
        if (this.flag) {
          break; // 终止循环
        }
        // 如果返回的结果 ID 与当前对话 ID 相同，则将聊天机器人的回复拼接到当前对话中
        const index = this.chatList[this.selectTopicIndex].findIndex(
          (item) => item.id === result.id
        );

        if (index !== -1) {
          this.chatList[this.selectTopicIndex][
            this.chatList[this.selectTopicIndex].length - 1
          ].content += result.content;
        } else {
          let assistant = {
            content: result.content,
            role: result.role,
            time: Date.now(),
            id: result.id,
          };
          this.chatList[this.selectTopicIndex].push(assistant);
        }
      }
      return;
    },
  },
};
</script>

<style lang="scss" scoped></style>
