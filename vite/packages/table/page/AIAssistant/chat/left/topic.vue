<template>
  <xt-menu :menus="menus">
    <div
      class="group cursor-pointer flex items-center text-base relative rounded-xl pl-2 mb-2 mr-3"
      style="width: 212px; height: 72px"
      :class="{ 'xt-active-bg-2': selectTopicIndex === data.id }"
      @click="handleIndex()"
    >
      <Icon :icon="data.icon.name" style="font-size: 17.5px"></Icon>
      <div class="ml-2 flex flex-col">
        <div class="flex justify-between">
          {{ data.name }}
          <div class="xt-text-2 text-xs">
            {{ time }}
          </div>
        </div>
        <div class="truncate xt-text-2 text-sm mt-1" style="width: 160px">
          {{ text }}
        </div>
      </div>
    </div>
  </xt-menu>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { aiStore } from "../../../../store/ai";
import dayjs from "dayjs";
export default {
  data() {
    return {
      menus: [
        {
          icon: "Pushpin",
          label: this.data.top ? "取消置顶" : "置顶",
          callBack: this.handleTop,
        },
        { icon: "shanchu", label: "删除", callBack: this.handleDel },
      ],
    };
  },
  computed: {
    ...mapWritableState(aiStore, ["topicList", "selectTopicIndex", "chatList"]),
    text() {
      return this.getData().content;
    },
    time() {
      const timestamp = this.getData().time; // 假设您已经获取了时间戳
      const formattedDate = dayjs(timestamp).format("MM-DD");
      return formattedDate;
    },
  },
  mounted() {},
  methods: {
    ...mapActions(aiStore, ["delTopic"]),
    getData() {
      let obj = {
        ...this.chatList[this.data.id][this.chatList[this.data.id].length - 1],
      };

      return obj;
    },
    handleTop() {
      let id = this.data.id;
      for (let key in this.topicList) {
        let item = this.topicList[key];

        if (item.id == id) {
          item.top = !item.top;
        }
      }
    },
    handleDel() {
      this.selectTopicIndex = this.data.id;
      this.delTopic();
    },
    handleIndex() {
      this.selectTopicIndex = this.data.id;
    },
  },
  props: {
    data: {},
  },
};
</script>

<style lang="scss" scoped>
.group {
  &:hover .top-item {
    display: block;
  }
}
</style>
