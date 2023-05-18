<template>
  <div class="top-title drag">
    <a-row :gutter="20">
      <a-col>
        <div class="left-title pointer no-drag" @click="onBack">
          <Icon icon="xiangzuo" style="height: 24px; width: 24px"></Icon>
          <span>返回</span>
        </div>
      </a-col>
      <a-col style="font-size: 1.2em; line-height: 2.5em">
        共 {{ count }} 种卡片
      </a-col>
    </a-row>

    <a-input
      v-model:value="selectContent"
      class="no-drag"
      placeholder="搜索"
      style="
        height: 100%;
        width: 400px;
        border-radius: 12px;
        background: rgba(42, 42, 42, 0.6);
      "
    >
      <template #prefix>
        <Icon icon="sousuo"></Icon>
      </template>
    </a-input>
  </div>
  <vue-custom-scrollbar key="scrollbar" id="addScroll" :settings="scrollbarSettings"
    style="position:relative;  border-radius: 8px;height: 100vh">
    <CardPreview :cardType="item" v-for="item in filterList" @addSuccess="onBack"></CardPreview>
    <div style="height: 650px"></div>
  </vue-custom-scrollbar>
</template>

<script>
import { mapActions } from 'pinia'
import { cardStore } from '../../../store/card'
import CardPreview from './CardPreview.vue'

export default {
  name: "AddCard",
  components: { CardPreview },
  data() {
    return {
      cardList: [
        {
          name: "wallpaper",
          cname: "壁纸",
          icon: "image",
          detail: "发现新壁纸，浏览我收藏的壁纸",
          images: ["middleWallpaper", "smallWallpaper"],
          size: ["2x2"],
        },
        {
          name: "customTimer",
          cname: "日历",
          icon: "rili3",
          detail: "追踪当月日期，查看临近节日",
          images: ["customTimer"],
          size: ["1x2"],
        },
        {
          name: "countdownDay",
          cname: "纪念日",
          icon: "rili2",
          detail: "设置你的纪念日、考试日等等，支持正/倒数",
          images: ["countdownDay", "smallCountdownDay"],
          size: ["1x1"],
        },
        {
          name: "clock",
          cname: "闹钟",
          icon: "naozhong",
          detail: "设置你的闹钟",
          images: ["clock"],
          size: ["1x1"],
        },
        {
          name: "supervisory",
          cname: "性能",
          icon: "xingneng",
          detail: "监控系统状态，查看游戏帧数",
          images: [
            "CPULineChart",
            "CPUFourCard",
            "SmallCPUCard",
            "SmallGPUCard",
          ],
        },
        {
          name: "music",
          cname: "网易云",
          icon: "naozhong",
          detail: "快捷播放，我的喜欢，我的歌单",
          images: ["music"],
          size: ["1x1"],
        },
        {
          name: "timer",
          cname: "番茄钟",
          icon: "naozhong",
          detail: "快速开启番茄钟时刻，记录每天专注成果",
          images: ["timer"],
          size: ["1x1"],
        },
        {
          name: "weather",
          cname: "天气",
          icon: "naozhong",
          detail: "查看某地当前的天气状况和预报",
          images: ["weather"],
          size: ["1x1"],
        },
        {
          name: "fish",
          cname: "木鱼",
          icon: "naozhong",
          detail: "休闲减压神器，积攒功德",
          images: ["fish"],
          size: ["1x1"],
        },
        {
          name: "games",
          cname: "游戏折扣推荐",
          icon: "steam",
          detail: "Steam、Epic折扣推荐",
          images: ["GamesDiscount", "DiscountPercentage", "GameEpic"],
        },
        {
          name: "gameAssis",
          cname: "游戏助手",
          icon: "steam",
          detail: "各种游戏工具",
          images: ["MyGameSmall", "MyGameMiddle", "SteamFriends"],
        },
        {
          name: 'customAssembly',
          cname: '自定义',
          icon: 'image',
          detail: '自定义小组件封面和快捷方式',
          images: ['customAssembly'],
          size: ['2x2']
        },
        {
          name: 'signIn',
          cname: '签到',
          icon: '',
          detail: '完成签到，获得奖励',
          images: ['signIn'],
          size: ['1x1']
        }
      ],
      cardType: {},
      show: false,
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
        currentItemId: -1,
        timer: null,
      },
      selectContent: "",
    };
  },

  mounted() {},
  computed: {
    filterList() {
      return this.cardList.filter((i) => {
        return (
          i.cname.toLowerCase().includes(this.selectContent.toLowerCase()) ||
          i.detail.toLowerCase().includes(this.selectContent.toLowerCase())
        );
      });
    },
    count() {
      let i = 0;
      this.cardList.forEach((c) => {
        i += c.images.length;
      });
      return i;
    },
  },
  methods: {
    ...mapActions(cardStore, ["addCustomComponents"]),
    addAssembly(item) {
      switch (item.name) {
        case "customTimer":
          this.cardType = this.cardList[0];
          break;
        case "countdownDay":
          this.cardType = this.cardList[1];
          break;
        case "clock":
          this.cardType = this.cardList[2];
          break;
        case "supervisory":
          this.cardType = this.cardList[3];
          break;
        case "games":
          this.cardType = this.cardList[8];
          break;
      }
      this.show = true;
    },
    onBack() {
      this.$emit("setCustom", false);
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.lg .ant-modal-body) {
  font-size: 0em;
}

#addScroll {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 16px;
  margin-left: -20px;
}

.top-title {
  display: flex;
  align-items: center;
  margin-top: 24px;
  margin-left: 24px;
  height: 48px;
  width: calc(50vw + 200px);
  justify-content: space-between;

  .left-title {
    font-size: 18px;
    font-weight: 400;
    width: 100px;
    height: 48px;
    display: flex;
    justify-content: space-between;
    padding: 0 19px 0 10px;
    align-items: center;
    border-radius: 12px;
    background: rgba(42, 42, 42, 1);
  }
}

.content {
  display: flex;
  flex-direction: row;
}

.item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input-box {
  height: 2em;
  border-radius: 100px;
  border: 1px solid #c4c4c4;
}
</style>
