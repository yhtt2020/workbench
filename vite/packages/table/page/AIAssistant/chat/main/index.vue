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
import { message } from "ant-design-vue";
import { getStreamData } from "./api";
export default {
  computed: {
    ...mapWritableState(aiStore, [
      "selectTopicIndex",
      "topicList",
      "chatList",
      "url",
      "key",
      "count",
      "searchState",
    ]),
    currentList() {
      if (this.selectTopicIndex === -1) return [];
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
  mounted() {
    let search = this.$route.params.value;
    if (search) {
      this.addTopic();
      this.onSearch(search);
    }
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
    async onSearch(search) {
      if (this.check()) return;
      this.isSearch = false;
      this.searchState = true;
      //this.selectTopicIndex == -1;
      if (this.selectTopicIndex === -1) {
        this.addTopic();
      }
      console.log(this.selectTopicIndex, "选中的索引", this.chatList);
      let user = {
        content: search,
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
      await this.processGPTResults(arr);
      this.isSearch = true;
      // this.topicList[this.selectTopicIndex].time = Date.now();
      // tsbApi.db.put({
      //   _id: `gpt:${this.selectTopicIndex}`,
      //   content: this.chatList[this.selectTopicIndex],
      //   updateTime: Date.now(),
      // });
      // let res = await tsbApi.db.allDocs([`gpt:${this.selectTopicIndex}`]);
      // console.log("res :>> ", res);
    },
    async processGPTResults(arr) {
      // 获取聊天机器人的回复
      for await (const result of getStreamData(arr)) {
        if (result.value) {
          message.error(result.value.error.message);
          return;
        }
        if (!this.searchState) {
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
    },
  },
};
</script>

<style lang="scss" scoped></style>
