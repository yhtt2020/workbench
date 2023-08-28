<template>
  <div>

    <Widget :desk="desk" :sizeList="sizeList" :options="options" :customIndex="customIndex" :menuList="menuList"
      ref="cardSlot" :customData="customData">
      <template #left-title>
        <div class="icon"
          style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
          <FileSearchOutlined style="font-size: 20px;" />
        </div>

      </template>
      <div class="top-bar">
        <!-- <div class="left" style="width: 40px; height: 40px; border-radius: 8%;" @click="decrease">
          <span>
            <LeftOutlined />
          </span>
        </div> -->
        <div class="center">
          <div :class="['item', { action: currentIndex == index }]" v-for="(title, index) in showList"
            @click="setCurrentIndex(index)" >
            <span >{{ title.title }}</span>
          </div>
        </div>
        <!-- <div class="right" style="width: 40px; height: 40px; border-radius: 8%;" @click="increase">
          <span>
            <RightOutlined />
          </span>
        </div> -->
      </div>
      <div v-if="pageToggle">
        <div v-if="isLoading">
          <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%" />
        </div>
        <div class="content" v-else>
          <NewsItem v-for="(item, index) in newsItemList" :key="index" :newsMsgList="item" />
        </div>

      </div>
      <DataStatu v-else imgDisplay="/img/test/load-ail.png" :btnToggle="false" textPrompt="暂无数据"></DataStatu>
    </Widget>

    <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
        <div class="primary-title" style="color: var(--primary-text);">新闻类别</div>
        <div class="mt-2 mb-6 secondary-title" style="color: var(--secondary-text);">长按拖拽排序,最多选择七个</div>
        <NewsCardDrawer @setSortedList="setSortedList" :drawerList="aggList"></NewsCardDrawer>
      </vue-custom-scrollbar>

    </a-drawer>
  </div>
</template>

<script>
import Widget from '../../card/Widget.vue';
import NewsItem from './NewsItem.vue';
import { mapWritableState, mapActions } from 'pinia'
import DataStatu from "../DataStatu.vue"
import { newsStore } from '../../../store/news.ts'
import NewsCardDrawer from "./NewsCardDrawer.vue";
import { LeftOutlined, RightOutlined, HolderOutlined, FileSearchOutlined } from '@ant-design/icons-vue'
export default {
  name: "News",
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => { }
    },
    desk: {
      type: Object
    }
  },
  components: {
    Widget,
    NewsItem,
    NewsCardDrawer,
    DataStatu,
    LeftOutlined,
    RightOutlined,
    HolderOutlined,
    FileSearchOutlined
  },
  data() {
    return {
      settingVisible: false,
      sizeList: [
        {
          title: '4x4',
          height: 2,
          width: 2,
          name: '4x4'
        },
        {
          title: '4x6',
          height: 3,
          width: 2,
          name: '4x6'
        },
      ],
      options: {
        className: 'card double',
        title: '新闻资讯',
        icon: '',
        type: 'news'
      },
      menuList: [
        {
          icon: 'shezhi1',
          title: '设置',
          fn: () => { this.settingVisible = true; this.$refs.cardSlot.visible = false }
        },
      ],
      currentIndex: 0,
      // '头条', '国内', '国际', '娱乐', '军事', '体育', '科技'
      titleList: [
        {
          title: '头条',
          tag: 'top',
          // id:0
        },
        {
          title: '国内',
          tag: 'guonei',
          // id:1
        },
        {
          title: '国际',
          tag: 'guoji',
          // id:2
        },
        {
          title: '娱乐',
          tag: 'yule',
          // id:3
        },
        {
          title: '军事',
          tag: 'junshi',
          // id:4
        },
        {
          title: '体育',
          type: 'tiyu',
          // id:5
        },
        {
          title: '科技',
          tag: 'keji',
          // id:6
        },
        {
          title: '财经',
          tag: 'caijing',
          // id:7
        },
        {
          title: '汽车',
          tag: 'qiche',
          // id:8
        },
        {
          title: '游戏',
          tag: 'youxi',
          // id:9
        },
        {
          title: '健康',
          tag: 'jiankang',
          // id:10
        }
      ],
      isLoading: false,
      pageToggle: true,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },
  methods: {
    // decrease() {
    //   this.currentIndex = (this.currentIndex - 1 + this.showList.length) % this.showList.length
    //   // this.getNewsMsg(this.aggList[this.currentIndex].tag,this.copyNum)
    //   console.log(this.newsMsgList[0])
    //   console.log(11111)
    // },
    // increase() {
    //   this.currentIndex = (this.currentIndex + 1) % this.showList.length
    //   // this.getNewsMsg(this.aggList[this.currentIndex].tag,this.copyNum)
    // },
    setCurrentIndex(index) {
      this.currentIndex = index
      this.getNewsData()
    },
    setSortedList(arrList) {
      // 获取拖拽排序后数据
      this.customData.sortList = arrList
    },
    ...mapActions(newsStore, ['getNewsMsg']),
    getNewsData() {
      let tag = this.showList[this.currentIndex].tag
      // let num = this.copyNum
      // console.log(this.getNewsMsg);
      this.getNewsMsg(tag)
      // console.log('getNewsData',res);
    }
  },
  computed: {
    
    aggList() {
      if (this.customData && this.customData.sortList) {
        return this.customData.sortList
      } else {
        return this.titleList
      }
    },
    ...mapWritableState(newsStore, ['newsMsgList']),
    showList() {
      return JSON.parse(JSON.stringify(this.aggList.slice(0, 7)))
    },
    // 判断尺寸大小
    showSize() {
      if (this.customData && this.customData.width && this.customData.height) {
        return { width: this.customData.width, height: this.customData.height }
      }
      return this.sizeList[0]
    },
    // 判断不同高度返回不同个数
    copyNum() {
      return this.showSize.height == 2 ? 6 : 8
    },
    newsItemList() {
      return this.newsMsgList.slice(0, this.copyNum)
    }
  },
  async mounted() {
    this.isLoading = true
    await this.getNewsData()
    setTimeout(() => {
      this.isLoading = false
    })
  }
}
</script>
<style lang='scss' scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  margin-top: 1.8%;

  .left,
  .right {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.30);
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
    background: rgba(0, 0, 0, 0.30);
    display: flex;
    box-sizing: border-box;
    overflow-x: auto;
    white-space: nowrap;
    // scrollbar-width: thin; /* 或者设置为 none */
    // scrollbar-color: rgba(0, 0, 0, 0.5) rgba(0, 0, 0, 0.1); /* 根据需要设置颜色 */

    &::-webkit-scrollbar {
      width: 0;
      // background-color: transparent;
      // opacity: 0;
      display: none;
    }

    .action {
      width: 100%;
      height: 100%;
      background: #508BFE;
      cursor: pointer;
      border-radius: 8px;
      flex: 1;
      align-self: stretch;
      flex-shrink: 0;
      align-self: center;
      padding-top: 0;
      padding-bottom: 0;
      border-left: none;
    }

    .item {
      width: 77px;
      height: 33px;
      margin: 0.6% 0;
      text-align: center;
      line-height: 33px;
      border-radius: 8px;
      flex-shrink: 0;


      span {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
        text-align: center;
        font-weight: 400;
      }

    }
  }

}

.content {
  margin-top: 1.8%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
  
  