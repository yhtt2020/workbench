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

    <a-input v-model:value="selectContent" class="no-drag" placeholder="搜索" style="
        height: 100%;
        width: 400px;
        border-radius: 12px;
        background: rgba(42, 42, 42, 0.6);
      ">
      <template #prefix>
        <Icon icon="sousuo"></Icon>
      </template>
    </a-input>
  </div>
  <vue-custom-scrollbar key="scrollbar" id="addScroll" :settings="scrollbarSettings"
    style="position:relative;  border-radius: 8px;height: 100vh">
    <CardPreview :desk="desk" :cardType="item" v-for="item in filterList" @addSuccess="onBack"></CardPreview>
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
  props:['desk'],
  emits:['onBack'],
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
          images: ["MyGameSmall", "SteamFriends"],
        },
        {
          name: 'capture',
          cname: '捕获',
          icon: 'audio',
          detail: '捕获',
          images: ['capture', 'CaptureNewCard']
        },
        {
          name: 'Audio',
          cname: '音频工具',
          icon: 'audio',
          detail: '音频工具',
          images: ['audio', 'voice']
        },
        {
          name: 'remote',
          cname: '外部卡片',
          icon: 'game',
          detail: '添加一个链接到外部网页的卡片，可以实现各种自定义功能。',
          images: ['Remote'],
          size: ['1x2']
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
          icon: 'star',
          detail: '完成签到，获得奖励',
          images: ['signIn'],
          size: ['1x2']
        },
        {
          name: 'Film',
          cname: '豆瓣电影',
          icon: 'video',
          detail: '查看最近正在上映的热门电影',
          images: ['singleFilm','manyFilm'],
          size: ['1x2']
        },
        {
          name: 'clocks',
          cname: '时钟',
          icon: 'time-circle',
          detail: '选择合适的时钟组件装点你的桌面',
          images: ['clocks'],
          size: ['1x1']
        },
        {
          name: 'notes',
          cname: '桌面便签',
          icon: 'time-circle',
          detail: '可自由修改内容，调整大小的桌面便签',
          images: ['notes'],
          size: ['1x2']
        },
        {
          name:'news',
          cname:'新闻资讯',
          icon:"time-circle",
          detail:'头条（推荐），国内，娱乐，体育，军事，科技，财经，时尚等新闻信息',
          images:['news'],
          size:['4x4']
        },
        {
          name:'AIaides',
          cname:'AI助手',
          icon:"time-circle",
          detail:'你的专属AI助手,内置数个预设模板供你使用。',
          images:['AIaides'],
          size:['2x2']
        },
        {
          name:'OilPrices',
          cname:'今日油价',
          icon:"time-circle",
          detail:'时刻关注你所在的城市的92号，96号，98号，0号油价',
          images:['OilPrices'],
          size:['2x4']
        },
        {
          name:'yuanCommunity',
          cname:'元社区动态',
          icon:"time-circle",
          detail:'元社区里又发了什么好玩的事情？时刻关注热门和最新动态。',
          images:['yuanCommunity'],
          size:['4x4']
        },
        {
          name:'Courier',
          cname:'我的快递',
          icon:"time-circle",
          detail:"在桌面上时刻关注你的快递动态，支持批量添加快递单号，自定义修改快递名称和图标",
          images:['courier'],
          size:['4x6']
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

  mounted() { },
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
    ...mapActions(cardStore, ["addCard"]),
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
      this.$emit("onBack", false);
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
