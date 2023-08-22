<template>
  <div>
    <Widget :desk="desk" :sizeList="sizeList" :options="options" :customIndex="customIndex" :menuList="menuList"
      ref="cardSlot" :customData="customData">
      <div class="topBar">
        <div class="left" style="width: 40px; height: 40px; border-radius: 8%;" @click="decrease">
          <span>
            <LeftOutlined />
          </span>
        </div>
        <div class="center">

          <div :class="['item', { action: currentIndex == index }]" v-for="(title, index) in titleList"
            @click="setCurrentIndex(index)">
            <span>{{ title.title }}</span>
          </div>
        </div>
        <div class="right" style="width: 40px; height: 40px; border-radius: 8%;" @click="increase">
          <span>
            <RightOutlined />
          </span>
        </div>
      </div>
      <div class="content">
        <NewsItem  />
        <NewsItem />
        <NewsItem />
        <NewsItem />
        <NewsItem />
        <NewsItem />
      </div>
    </Widget>

    <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right" style="
        background: #212121 100%; 
        ">
      <!-- <template #title>
        <div class="text-left" style="
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: rgba(255,255,255,0.85);
                font-weight: 500;
                margin-left: 5.9%;
                ">
          设置
        </div>
      </template> -->
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
        <div class="primary-title" style="color: var(--primary-text);">新闻类别</div>
        <div class="mt-2 mb-6 secondary-title" style="color: var(--secondary-text);">长按拖拽排序</div>
        <!-- <NewsCardDrawer @setSortedList="setSortedList" :drawerList="aggList"></NewsCardDrawer> -->
        <DndProvider :backend="HTML5Backend">
          <div class="content-item">
            <div class="item" v-for="title in titleList" style="
                    /* margin: 2.2% 0; */
                    display: flex;
                    width: 452px;
                    height: 48px;
                    position: relative;
                    justify-content: center;
                    margin-top: 2.2%;
                    background: #2A2A2A;
                    border-radius: 12px;">

              <div class="iconText" style="width: 20px ; 
                    height: 20px;
                    position: absolute; 
                    left: 1.5%;  
                    margin:3.2% 0 ;">
                <HolderOutlined style="color: #ffffff;" />
              </div>

              <div class="text" style="font-family: PingFangSC-Regular;
                            font-size: 16px;
                            color: rgba(255,255,255,0.85);
                            text-align: center;
                            font-weight: 400;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            ">
                {{ title }}
              </div>
            </div>
          </div>
        </DndProvider>
      </vue-custom-scrollbar>

    </a-drawer>
  </div>
</template>

<script>
import Widget from '../../card/Widget.vue';
import NewsItem from './NewsItem.vue';
import { mapState } from 'pinia'
import { newsStore ,mapActions} from '../../../store/news.ts'
import NewsCardDrawer from "./NewsCardDrawer.vue";
import { useDrag, useDrop, useDragLayer } from 'vue3-dnd'
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// import _ from 'lodash'
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
        icon: 'chakan',
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
          tag: 'top'
        },
        {
          title: '国内',
          tag: 'guonei'
        },
        {
          title: '国际',
          tag: 'guoji'
        },
        {
          title: '娱乐',
          tag: 'yule'
        },
        {
          title: '军事',
          tag: 'junshi'
        },
        {
          title: '体育',
          type: 'tiyu'
        },
        {
          title: '科技',
          tag: 'keji'
        },
        {
          title: '财经',
          tag: 'caijing'
        },
        {
          title: '汽车',
          tag: 'qiche'
        },
        {
          title: '游戏',
          tag: 'youxi'
        },
        {
          title: '健康',
          tag: 'jiankang'
        }
      ]
    }
  },
  methods: {
    decrease() {
      this.currentIndex = (this.currentIndex - 1 + this.titleList.length) % this.titleList.length
      this.getNewsMsg(this.titleList[this.currentIndex].tag)
    },
    increase() {
      this.currentIndex = (this.currentIndex + 1) % this.titleList.length
      this.getNewsMsg(this.titleList[this.currentIndex].tag)
    },
    setCurrentIndex(index) {
      this.currentIndex = index
    },
    setSortedList(arrList) {
      // 获取拖拽排序后数据
      this.customData.sortList = arrList
    },
  },
  computed: {
    aggList() {
      if (this.customData && this.customData.sortList) {
        return this.customData.sortList
      } else {
        return this.titleList
      }
    },
    ...mapState(newsStore, [
      'NewsMsgList'
    ]),
    ...mapActions(newsStore,['getNewsMsg'])
  }
}
// console.log("categoryList", this.categoryList.length);
</script>
<style lang='scss' scoped>
.topBar {
  display: flex;
  justify-content: space-between;

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
    width: 440px;
    height: 40px;
    border-radius: 8%;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.30);
    display: flex;
    box-sizing: border-box;
    // overflow: auto;
    overflow-x:auto ;

    .action {
      background: #508BFE;
      cursor: pointer;
      border-radius: 8px;
      flex: 1;
      align-self: stretch;

    }

    .item {
      width: 61px;
      height: 33px;
      text-align: center;
      line-height: 33px;
      border-radius: 8px;

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
  margin-top: 1.7%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
  
  