<script setup lang="ts">
import { ref, watch, computed, toRefs } from "vue";
const header = {
  title: "聚合搜索",
  showIcon: "/img/appLogo/aggregateSearch.png",
};
const options = {
  defaultData: {
    searchSource: {
      name: "百度",
    },
  },
};
const props = defineProps({
  customIndex: {},
  customData: {
    default: () => {
      return {
        customSize: "4x2",
        name: "",
      };
    },
  },
});
const { customData } = toRefs(props);
const searchSource = [
  {
    id: 1,
    name: "谷歌",
    icon: "google",
    iconType: "",
    searchUrl: "https://www.google.com/search?q=",
    recommendUrl: "https://www.google.com/search?q=",
  },
  {
    id: 5,
    name: "GitHub",
    icon: "github-fill",
    iconType: "",

    searchUrl: "https://github.com/search?q=",
    recommendUrl: "https://api.github.com/search/repositories?q=",
  },
  {
    id: 7,
    name: "微博",
    icon: "weibo",
    iconType: "",

    searchUrl: "https://s.weibo.com/?Refer=",
    recommendUrl: "https://weibo.com/ajax/side/search?q=",
  },
  {
    id: 6,
    name: "Bilibili",
    icon: "bilibili1",
    iconType: "",

    searchUrl: "https://search.bilibili.com/all?keyword=",
    recommendUrl:
      "https://s.search.bilibili.com/main/suggest?func=suggest&term=",
  },
  {
    id: 6,
    name: "工作台",
    icon: "bilibili1",
    iconType: "",

    searchUrl: "https://search.bilibili.com/all?keyword=",
    recommendUrl:
      "https://s.search.bilibili.com/main/suggest?func=suggest&term=",
  },

  {
    id: 2,
    name: "百度",
    icon: "baidu",
    iconType: "",

    searchUrl: "https://www.baidu.com/s?wd=",
    recommendUrl: "https://www.baidu.com/sugrec?prod=pc&wd=",
  },

  {
    id: 3,
    name: "必应",
    icon: "bing",
    searchUrl: "https://www.bing.com/search?q=",
    recommendUrl: "https://api.bing.com/osjson.aspx?query=",
  },
  {
    id: 4,
    name: "知乎",
    icon: "zhihu-square-fill",
    searchUrl: "https://www.zhihu.com/search?type=content&q=",
    recommendUrl: "https://www.zhihu.com/api/v4/search/suggest?q=",
  },

  {
    id: 8,
    name: "优酷",
    icon: "youku",
    searchUrl: "https://so.youku.com/search_video/q_",
    recommendUrl: "https://suggest.video.iqiyi.com/?key=",
  },
  {
    id: 9,
    name: "豆瓣",
    icon: "douban1",
    searchUrl: "https://www.douban.com/search?q=",
    recommendUrl: "https://www.douban.com/j/search_suggest?debug=true&q=",
  },
];
const noBorder = ref(false);
const searchStyle = computed(() => {
  if (!noBorder.value) {
    return {
      "border-radius": "12px",
      height: "100%",
    };
  } else {
    return {
      "border-radius": "10px",
      height: "56px",
      border: "1px solid rgba(255,255,255,0.1)",
      // box-shadow: 0px 0px 3.12px 0px rgba(0,0,0,0.03);
      // box-shadow: 0px 0px 10.23px 0px rgba(0,0,0,0.1);
      // box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);
    };
  }
});

const searchVisible = ref(false);
const switchSearchStatus = () => {
  searchVisible.value = !searchVisible.value;
};
</script>

<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    :options="options"
    customSize="4x2"
    :header="header"
    class="xt-theme-b"
  >
    <div class="w-full h-full flex flex-col">
      <div class="w-full flex-1">
        <div class="w-full tt-theme-bg" :style="searchStyle"></div>
      </div>
      <div class="flex mt-3 justify-between">
        <div
          class="w-[100px] h-12 tt-bg-2-t flex items-center"
          style="border-radius: 10px"
          v-for="item in searchSource.slice(0, 5)"
        >
          <xt-icon :icon="item.icon" />
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>
  </xt-container>
</template>

<style lang="scss" scoped></style>
