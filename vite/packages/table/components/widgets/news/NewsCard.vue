<template>
  <div>

    <Widget :desk="desk" :sizeList="sizeList" :options="options" :customIndex="customIndex" :menuList="menuList"
      ref="cardSlot" :customData="customData">
      <template #left-title-icon>
        <div class="icon"
          style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
          <FileSearchOutlined style="font-size: 20px;" />
        </div>

      </template>
      <div class="top-bar">
        <div class="center">
          <div :class="['item', { action: currentIndex == index }]" v-for="(title, index) in showList"
            @click="setCurrentIndex(index)" :style="{width:this.showSize.width==1?'81px':'67px'}">
            <span >{{ title.title }}</span>
          </div>
        </div>
      </div>
      <div v-if="pageToggle">
        <div v-if="isLoading">
          <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%" />
        </div>
        <div class="content" v-else >
          <div v-for="(item, index) in newsItemList" style="display: flex;" class="set-type">
            <span class="sort">{{ index+1 }}</span>
            <div class="item">
              <NewsItem  :key="index" :newsMsgList="item" :copyNum="copyNum"/>
            </div>
            <!-- 添加分割线 -->
            <div class="divider" v-show="this.copyNum>=8">
              <a-divider type="vertical" orientation="center" style="color: var(--divider); width: 1px; height: 100%;"/>
            </div>

          </div>

        </div>

      </div>
      <DataStatu v-else imgDisplay="/img/test/load-ail.png" :btnToggle="false" textPrompt="暂无数据"></DataStatu>
    </Widget>

    <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
        <div class="primary-title" style="color: var(--primary-text);">新闻类别</div>
        <div class="mt-2 mb-6 secondary-title" style="color: var(--secondary-text);">长按拖拽排序,最多选择八个(小尺寸(2x4)只显示前三个)</div>
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
          title: '2x4',
          height: 2,
          width: 1,
          name: '2x4'
        },
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
        className: 'card ',
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
    setCurrentIndex(index) {
      this.currentIndex = index
      this.customData.index=this.currentIndex
      this.getNewsData()
      this.customData.newsList=this.newsMsgList
      // console.log(this.customData.newsList,'newsList')
      console.log(this.customData,'customData');
    },
    setSortedList(arrList) {
      // 获取拖拽排序后数据
      this.customData.sortList = arrList
    },
    ...mapActions(newsStore, ['getNewsMsg']),
    getNewsData() {
      let tag = this.showList[this.currentIndex].tag
      this.customData.tag=tag
      this.getNewsMsg(this.customData.tag)

      // this.customData.newsList=this.newsMsgList
      // console.log(this.customData.newList);
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
      return this.aggList.slice(0, this.copyItem)
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
      // return this.showSize.height == 2 ? 6 : 10
      if(this.showSize.width==1){
        return 4
      }
      return this.showSize.height==2?8:12

    },
    // 判断top-bar需要几个标签
    copyItem() {
      return this.showSize.width==1?3:8
    },
    // 通过接口返回的数据进行裁切，返回适合页面长度的数据
    newsItemList() {
      if(this.customData && this.customData.newsList?.length){
        // console.log(this.customData.newsList,'newsList');
        if(this.customData.newsList.tag){
          this.customData.newsList=this.customData.newsList.tag
          return []
        }
        return this.customData.newsList.slice(0, this.copyNum)
      }
      return this.newsMsgList.slice(0,this.copyNum)

    },
    currentTag(){
      if(this.customData && this.customData.index){
        return this.showList[this.customData.index].title
      }
      return this.showList[this.currentIndex].title
    }
  },
  async mounted() {
    this.isLoading = true
    await this.getNewsMsg(this.showList[this.currentIndex].tag)
    // await this.getNewsData()
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
    cursor: pointer;

    &::-webkit-scrollbar {
      width: 0;
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

  .divider{
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
  background: #FE2C46;
}

.set-type:nth-of-type(2) > span {
  background: #FF6600;
}

.set-type:nth-of-type(3) > span {
  background: #FAAA10;
}

.active-index{
  background: var(--active-bg) !important;
}
}
</style>

