<script setup lang="ts">
import { ref, computed, inject, watch, provide, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { HistoryData } from "./types";
import Scrollbar from "./Scrollbar.vue";
import Item from "./Item.vue";
import { aiStore as useAiStore } from "../../../../../store/ai";
import { open } from "../../utils/open";
import dayjs from "dayjs";
const aiStore: any = useAiStore();
const { recentList, chatList } = storeToRefs(aiStore);
const data: any = inject("data");
const words: any = inject("words");
const ctrlSelectIndex: any = inject("ctrlSelectIndex");
const search = () => {
  let res: any = aiStore.addTopic();
  let historyData: HistoryData = {
    name: res.name,
    source: "/logo/ai.svg",
    value: {
      id: res.id,
    },
    showType: "AI助手",
    openWith: "AI助手",
  };
  data.value.historyList.push(historyData);
  historyData.value.search = words.value;
  open(historyData);
};

const openAi = (item: any) => {
  open(item);
};
const time = (timestamp) => {
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
};
const list = computed(() => {
  let res = recentList.value.map((item) => {
    // 获取最后一个用户对话
    let chat = [...chatList.value[item.id]]
      .reverse()
      .find((item) => item.role === "user");
    let lastChat = chat ? chat.content : "";
    // 获取时间戳
    let timestamp = chat?.time;
    if (!timestamp) {
      timestamp = item.time;
    }
    let lastTime = time(timestamp);

    return {
      ...item,
      icon: item.icon.name,
      text: lastChat,
      type: lastTime,
      showType: "AI助手",
      value: {
        id: item.id,
      },
    };
  });
  console.log("res :>> ", res);
  return res;
});
const currentIndex = computed(() => {
  if (ctrlSelectIndex.value < 0) {
    ctrlSelectIndex.value = list.value.length - 1;
  }
  if (ctrlSelectIndex.value > list.value.length - 1) {
    ctrlSelectIndex.value = 0;
  }
  return ctrlSelectIndex.value % list.value.length;
});
defineExpose({
  search,
});
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <div
      v-if="words"
      @click="search"
      class="w-full p-3 mt-3 h-11 flex rounded-xl cursor-pointer hover:tt-theme-bg-2"
    >
      <xt-mix-icon icon="/logo/ai.svg" type="select" size="24" class="mr-2.5" />
      创建新对话
    </div>
    <div class="flex p-3">
      <div class="text-sm tt-text-2">最近对话</div>
    </div>
    <Scrollbar>
      <Item
        @click="openAi(item)"
        v-for="(item, index) in list"
        :select="index == currentIndex"
        :data="item"
        :index="index"
        :diffIndex="1"
      >
      </Item>
    </Scrollbar>
  </div>
</template>
<style lang="scss" scoped></style>
