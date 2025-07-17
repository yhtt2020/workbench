<template>
  <div>
    <xt-container
      @leftClick="settingVisible = true"
      v-model:customSize="customData.customSize"
      :desk="desk"
      :header="header"
      :sizeList="sizeList"
      :options="options"
      :customIndex="customIndex"
      :menuList="menuList"
      ref="cardSlot"
      :customData="customData"
      :envLimit="['guest', 'offline']"
      :env="env"
      @delete="deleteCard"
    >
      <div class="top-bar">
        <div class="center">
          <div
            :class="['item', { action: currentIndex == index }]"
            v-for="(title, index) in showList"
            @click="setCurrentIndex(index)"
            :style="{ width: this.showSize.width == 2 ? '81px' : '67px' }"
          >
            <span>{{ title.title }}</span>
          </div>
        </div>
      </div>
      <div v-if="pageToggle">
        <div v-if="isLoading">
          <a-spin
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 25%;
            "
          />
        </div>
        <div class="content" v-else>
          <div
            v-for="(item, index) in newsItemList"
            style="display: flex"
            class="set-type"
          >
            <span class="sort">{{ index + 1 }}</span>
            <div class="item">
              <NewsItem :key="index" :newsMsgList="item" :copyNum="copyNum"/>
            </div>
            <!-- 添加分割线 -->
            <div class="divider" v-show="this.copyNum >= 8">
              <a-divider
                type="vertical"
                orientation="center"
                style="color: var(--divider); width: 1px; height: 100%"
              />
            </div>
          </div>
        </div>
      </div>
      <DataStatu
        v-else
        imgDisplay="/img/test/load-ail.png"
        :btnToggle="false"
        textPrompt="暂无数据"
      ></DataStatu>
    </xt-container>

    <a-drawer
      :width="500"
      title="设置"
      v-model:visible="settingVisible"
      placement="right"
    >
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%">
        <div class="primary-title" style="color: var(--primary-text)">
          新闻类别
        </div>
        <div
          class="mt-2 mb-6 secondary-title"
          style="color: var(--secondary-text)"
        >
          长按拖拽排序,最多选择八个(小尺寸(2x4)只显示前三个)
        </div>
        <NewsCardDrawer
          @setSortedList="setSortedList"
          :drawerList="aggList"
        ></NewsCardDrawer>
      </vue-custom-scrollbar>
    </a-drawer>
  </div>
</template>

<script>
import Widget from "../../card/Widget.vue";
import NewsItem from "./NewsItem.vue";
import {mapWritableState, mapActions} from "pinia";
import DataStatu from "../DataStatu.vue";
import {newsStore} from "../../../store/news.ts";
import NewsCardDrawer from "./NewsCardDrawer.vue";
import {
  LeftOutlined,
  RightOutlined,
  HolderOutlined,
  FileSearchOutlined,
} from "@ant-design/icons-vue";
import {Icon as newIcon} from "@iconify/vue";
import {communityNavStore} from "../../bottomPanel/store/communityNavStore";
import showApi from "../../../js/axios/showApi";

export default {
  name: "News",
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {
      },
    },
    desk: {
      type: Object,
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },
  components: {
    Widget,
    NewsItem,
    NewsCardDrawer,
    DataStatu,
    LeftOutlined,
    RightOutlined,
    HolderOutlined,
    FileSearchOutlined,
    newIcon,
  },
  emit: ["delete"],
  data() {
    return {
      settingVisible: false,
      sizeList: [
        {
          value: "2x4",
          name: "2x4",
        },
        {
          value: "4x4",
          name: "4x4",
        },
        {
          value: "4x6",
          name: "4x6",
        },
      ],
      customSize: "2x4",
      menuList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.cardSlot.visible = false;
          },
        },
      ],
      currentIndex: 0,
      // '头条', '国内', '国际', '娱乐', '军事', '体育', '科技'
      titleList: [],
      isLoading: false,
      pageToggle: true,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      env: {
        web: false,
        mobile: false,
        client: false,
        single: true,
      },
      refreshFlag: false,
    };
  },
  methods: {
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),


    // 卡片自定义删除事件
    deleteCard() {
      this.$emit("delete");
    },
    async setCurrentIndex(index) {
      this.currentIndex = index;
      this.customData.index = this.currentIndex;
      await this.getNewsData();
    },
    setSortedList(arrList) {
      // 获取拖拽排序后数据
      this.customData.sortList = arrList;
    },
    ...mapActions(newsStore, ["getNewsMsg"]),
    async getNewsData() {
      let tag = this.showList[this.currentIndex].tag;
      this.customData.tag = tag;
      // console.log(this.customData.tag)
      let lsRs = await showApi.getNewsList(this.customData.tag);
      if (lsRs.status) {
        console.log(lsRs.data, '分页结果')
        this.customData.newsList = lsRs.data.contentlist.map((item) => {
          return {
            title: item.title,
            author_name: item.source,
            thumbnail_pic_s: item.img,
            url: item.link,
            date: item.pubDate
          }
        })
      }

      // console.log(this.customData.newList);
    },
    async refreshChannel() {
      let newsChannel = await showApi.getNewsChannel()
      let filtered = newsChannel.filter((item) => {
        console.log('循环判断', item.name, ['军事焦点', '体育焦点'].includes(item.name))
        return !['军事焦点', '体育焦点'].includes(item.name)
      })
      this.titleList = filtered.map(item => {
        return {
          title: item.name,
          tag: item.channelId
        }
      })
      console.log(this.titleList)
    },
    async refreshData() {
      this.refreshFlag = true;
      await this.refreshChannel()
      this.getNewsData().then(() => {
        this.refreshFlag = false;
      });
    },
  },
  computed: {

    // 卡片选项
    options() {
      return {
        // 当卡片添加到导航栏时，阻止默认删除事件
        customDel: this.openWay === "nav" ? true : false,
        defaultData: {
          customSize: "2x4",
          _updateFlag: "24531",
        },
        disableEdit: this.isCommunityDesktop(this.desk),
        cardName: '新闻头条'
      };
    },

    aggList() {
      if (this.customData && this.customData.sortList) {
        return this.customData.sortList;
      } else {
        return this.titleList;
      }
    },
    ...mapWritableState(newsStore, ["newsMsgList"]),
    showList() {
      return this.aggList.slice(0, this.copyItem);
    },
    // 判断尺寸大小
    showSize() {
      if (this.customData.customSize) {
        let arr = this.customData.customSize.split("x");
        return {
          width: arr[0],
          height: arr[1],
        };
      } else {
        return {
          width: 2,
          height: 4,
        };
      }
    },
    // 判断不同高度返回不同个数
    copyNum() {
      // return this.showSize.height == 2 ? 6 : 10
      if (this.showSize.width == 2) {
        return 4;
      }
      return this.showSize.height == 4 ? 8 : 12;
    },
    // 判断top-bar需要几个标签
    copyItem() {
      return this.showSize.width == 2 ? 3 : 8;
    },
    // 通过接口返回的数据进行裁切，返回适合页面长度的数据
    newsItemList() {
      if (this.customData && this.customData.newsList?.length) {
        return this.customData.newsList.slice(0, this.copyNum);
      }
      return this.newsMsgList.slice(0, this.copyNum);
    },
    currentTag() {
      if (this.customData && this.customData.index) {
        return this.showList[this.customData.index].title;
      }
      return this.showList[this.currentIndex].title;
    },
    header() {
      return {
        title: "新闻资讯",
        // ifyIcon:'fluent:news-16-regular',
        showIcon: "/logo/news.svg",
        refresh: {
          fn: this.refreshData,
          tip: "刷新",
          state: this.refreshFlag ? true : false,
        },
        leftHover: true,
        leftHoverName: "点击切换",
        leftHoverIcon: "fluent:open-16-regular",
      }
    }
  },
  async mounted() {


    this.isLoading = true;
    await this.refreshChannel()
    await this.getNewsData()
    this.isLoading = false;
    if (this.customData.customSize == undefined) {
      this.customData.customSize = "2x4";
    }

    if (this.options.disableEdit) {
      this.sizeList = [];
      this.menuList = [];
    } else {
      this.menuList = [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.cardSlot.visible = false;
          },
        },
      ];
      this.sizeList = [
        {
          value: "2x4",
          name: "2x4",
        },
        {
          value: "4x4",
          name: "4x4",
        },
        {
          value: "4x6",
          name: "4x6",
        },
      ];
    }
  },
  watch: {
    customSize(newVal, oldVal) {
      this.customData.customSize = newVal;
    },
  },
};
</script>
<style lang='scss' scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  // margin-top: 1.8%;

  .left,
  .right {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;

    span {
      color: #ffffffff;
    }
  }

  .center {
    width: 100%;
    height: 40px;
    padding-left: 3px;
    padding-right: 3px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    box-sizing: border-box;
    overflow-x: auto;
    white-space: nowrap;
    cursor: pointer;

    &::-webkit-scrollbar {
      width: 0;
      display: none;
    }

    .action {
      width: 100%;
      height: 100%;
      background: #508bfe;
      cursor: pointer;
      border-radius: 8px;
      flex: 1;
      align-self: stretch;
      flex-shrink: 0;
      align-self: center;
      padding-top: 0;
      padding-bottom: 0;
      border-left: none;
      border: none;
    }

    .item {
      // width: 67px;
      height: 33px;
      margin: 0.6% 0;
      text-align: center;
      line-height: 33px;
      border-radius: 8px;
      flex-shrink: 0;

      span {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
        text-align: center;
        font-weight: 400;
      }
    }
  }
}

.content {
  margin-top: 1%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // flex-direction: column;
  overflow: hidden;
  position: relative;

  .divider {
    width: 1px;
    height: 100%;
    position: absolute;
    left: 285px;
    right: 286px;
    overflow: hidden;
  }

  .sort {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--mask-bg);
    border-radius: 4px;
    font-size: 16px;
    color: var(--primary-text);
    font-weight: 600;
    margin-right: 8px;
    margin-top: 8px;
  }

  .set-type:nth-of-type(1) > span {
    background: #fe2c46;
    color: rgba(255, 255, 255, 0.85);
  }

  .set-type:nth-of-type(2) > span {
    background: #ff6600;
    color: rgba(255, 255, 255, 0.85);
  }

  .set-type:nth-of-type(3) > span {
    background: #faaa10;
    color: rgba(255, 255, 255, 0.85);
  }

  .active-index {
    background: var(--active-bg) !important;
  }
}
</style>

