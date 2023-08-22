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
        <div class="center" style="width: 440px;height: 40px;border-radius: 8%;">

          <div :class="['item', { action: currentIndex == id}]" v-for="(title, id) in titleList"
            @click="setCurrentIndex(id)">
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
        <NewsItem />
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
      <AggregateSearchDrawer @setSortedList="setSortedList" :drawerList="aggList"></AggregateSearchDrawer>
      </vue-custom-scrollbar>

    </a-drawer>
  </div>
</template>

<script>
import Widget from '../../card/Widget.vue';
import NewsItem from './NewsItem.vue';
import { mapState } from 'pinia'
import { newsStore } from '../../../store/news.ts'
import AggregateSearchFullScreen from "../aggregate/aggregatesearchfullscreen.vue";
import AggregateSearchDrawer from "../aggregate/AggregateSearchDrawer.vue";
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
    AggregateSearchFullScreen,
    AggregateSearchDrawer,
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
        className: 'card',
        title: '新闻资讯',
        icon: 'FileSearchOutlined',
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
          id: 0,
        },
        {
          title: '国内',
          id: 1,
        },
        {
          title: '国际',
          id: 2,
        },
        {
          title: '娱乐',
          id: 3,
        },
        {
          title: '军事',
          id: 4,
        },
        {
          title: '体育',
          id: 5,
        },
        {
          title: '科技',
          id: 6,
        },
    ]
    }
  },
  methods: {
    decrease() {
      this.currentIndex = (this.currentIndex - 1 + this.titleList.length) % this.titleList.length
    },
    increase() {
      this.currentIndex = (this.currentIndex + 1) % this.titleList.length
    },
    setCurrentIndex(index) {
      this.currentIndex = index
    },
    setSortedList(arrList) { // 获取拖拽排序后数据
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
  }
}
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
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.30);
    display: flex;
    box-sizing: border-box;

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
  
  