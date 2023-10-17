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
          <div class="truncate" style="width: 120px">{{ data.name }}</div>
          <div class="xt-text-2 text-xs">
            {{ time }}
          </div>
        </div>
        <div
          class="truncate xt-text-2 text-sm mt-1"
          style="width: 160px; height: 22px"
        >
          {{ text }}
        </div>
      </div>
      <div
        class="absolute"
        :class="{
          triangle: data.top == true,
        }"
      ></div>
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
        // {
        //   newIcon: "fluent-emoji:star",
        //   label: " 新删除",
        //   children: [
        //     {
        //       newIcon: "fluent-emoji:star",
        //       label: " 新删除",
        //       children: "111111111111111111",
        //       callBack: () => {
        //         console.log("1111111 :>> ", 1111111);
        //       },
        //     },
        //   ],
        //   callBack: () => {
        //     console.log("1111111 :>> ", 1111111);
        //   },
        // },
      ],
    };
  },
  computed: {
    ...mapWritableState(aiStore, ["topicList", "selectTopicIndex", "chatList"]),
    text() {
      return this.getData().content || "暂无数据";
    },
    time() {
      let timestamp = this.getData().time; // 假设您已经获取了时间戳
      if (!timestamp) {
        timestamp = this.topicList[this.data.id].time;
      }

      const targetDate = dayjs(timestamp);
      const now = dayjs();
      const diffMinutes = now.diff(targetDate, "minute");

      if (diffMinutes < 3) {
        return "刚刚";
      } else if (diffMinutes < 60) {
        return `${diffMinutes}分钟前`;
      } else if (diffMinutes < 1440) {
        const diffHours = Math.floor(diffMinutes / 60);
        return `${diffHours}小时前`;
      } else if (now.isSame(targetDate, "day")) {
        return `今天 ${targetDate.format("HH:mm")}`;
      } else if (now.subtract(1, "day").isSame(targetDate, "day")) {
        return `昨天 ${targetDate.format("HH:mm")}`;
      } else {
        return targetDate.format("MM-DD");
      }
    },
  },
  mounted() {},
  methods: {
    ...mapActions(aiStore, ["delTopic"]),
    getData() {
      let obj = {
        ...this.chatList[this.data.id][this.chatList[this.data.id].length - 2],
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

.triangle {
  top: -1px;
  right: -4px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid var(--active-bg);
  transform: rotate(45deg);
  border-radius: 20px;
}
</style>
