<script setup lang="ts">
import { ref, computed, inject, watch, provide, onMounted } from "vue";
import { highLightKeywords } from "../../utils/index";
import { storeToRefs } from "pinia";
import { HistoryData } from "./types";
import Scrollbar from "./Scrollbar.vue";
import Item from "./Item.vue";
import { aiStore as useAiStore } from "../../../../../store/ai";
import { open } from "../../utils/open";
import dayjs from "dayjs";
import _ from "lodash";
const aiStore: any = useAiStore();
const { recentList, chatList } = storeToRefs(aiStore);
const data: any = inject("data");
const words: any = inject("words");
const ctrlSelectIndex: any = inject("ctrlSelectIndex");
const saveSearchSource = inject("saveSearchSource") as Function;
const search = () => {
  if (diff.value && ctrlSelectIndex.value == 0) {
    aiSearch();
  } else {
    let index = ctrlSelectIndex.value - diff.value;
    openAi(list.value[index]);
  }
};
const aiSearch = () => {
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
  saveSearchSource();
  historyData.value.search = words.value;
  open(historyData);
};

watch(
  () => words.value,
  (val) => {
    if (val) {
      ctrlSelectIndex.value = 0;
    }
  },
  {
    immediate: true,
  }
);
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
  if (!recentList.value) {
    return [];
  }
  let res: any = [];

  if (words.value) {
    // 遍历所有数据
    recentList.value.forEach((item) => {
      // 获取对话记录
      let chat = _.cloneDeep(chatList.value[item.id]);

      let chatArr: any = [];
      // 遍历对话记录
      chat.forEach((data) => {
        // containsKeywordRegex
        if (data.content.includes(words.value)) {
          let text = htmlToString(data.content);
          data.content = highLightKeywords(text, words.value);

          chatArr.push(data);
        }
      });
      if (chatArr.length) {
        res.push({
          topic: item,
          chat: chatArr,
        });
      }
    });
  } else {
    res = recentList.value.map((item) => {
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
  }

  return res;
});
const currentIndex = computed(() => {
  let length = list.value.length;
  if (words.value) {
    length += 1;
  }
  if (ctrlSelectIndex.value < 0) {
    ctrlSelectIndex.value = length - 1;
  }
  if (ctrlSelectIndex.value > length - 1) {
    ctrlSelectIndex.value = 0;
  }
  return ctrlSelectIndex.value % length;
});

const diff = computed(() => {
  if (words.value) {
    return 1;
  } else {
    return 0;
  }
});
function htmlToString(htmlStr) {
  return htmlStr.replace(/<\/?.+?\/?>|\r|\n|\s*/g, "");
}
const recordPosition = ({ topic }, chat) => {
  let id = topic.id;
  let chatId = chat.id;
  let res = {
    icon: topic.icon.name,
    showType: "AI助手",
    value: {
      id,
      chatId,
    },
  };
  console.log("res :>> ", res);
  openAi(res);
};
defineExpose({
  search,
});
</script>
<template>
  <div class="flex flex-col h-full w-full">
    <Scrollbar>
      <Item
        v-if="words"
        @click="aiSearch"
        class="mt-3"
        :data="{
          icon: '/logo/ai.svg',
          name: '创建新对话',
        }"
        :select="ctrlSelectIndex == 0"
      >
      </Item>
      <div class="flex p-3">
        <div class="text-sm tt-text-2">最近对话</div>
      </div>

      <template v-for="(item, index) in list">
        <Item
          v-if="!words"
          @click="openAi(item)"
          :select="index + diff == currentIndex"
          :data="item"
        >
        </Item>
        <div class="flex flex-col w-full rounded-xl tt-bg-2 mb-3" v-else>
          <div class="flex items-center h-11 p-3">
            <xt-mix-icon
              :icon="item.topic.icon.name"
              type="select"
              size="24"
              class="mr-2.5"
            />
            {{ item.topic.name }}
          </div>
          <div
            @click="recordPosition(item, chat)"
            class="h-11 truncate flex items-center w-full hover:tt-theme-bg-2 cursor-pointer p-3 rounded-xl"
            v-for="(chat, index) in item.chat"
          >
            <div class="truncate flex-1" v-html="chat.content"></div>
            <div class="ml-2.5 text-xs tt-text-3">
              {{ time(chat.time) }}
            </div>
          </div>
        </div>
      </template>
    </Scrollbar>
  </div>
</template>
<style lang="scss" scoped></style>
