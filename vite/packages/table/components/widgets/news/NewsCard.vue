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
          
          <div :class="['item', { action: currentIndex == index }]" v-for="(title,index) in titleList" @click="setCurrentIndex(index)">
            <span>{{ title }}</span>
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

    <a-drawer :width="500" v-model:visible="settingVisible" placement="right" style="
        background: #212121 100%;
        ">
      <template #title>
        <div class="text-left" style="
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: rgba(255,255,255,0.85);
                font-weight: 500;
                margin-left: 5.9%;
                ">
          设置
        </div>
      </template>
      <div class="content">
        <div class="top">
          <div class="text-top" 
          style="font-family: PingFangSC-Medium;
                        font-size: 16px;
                        color: rgba(255,255,255,0.85);
                        font-weight: 500;
                        margin-bottom: 1.1%;
                        margin-top: 11.7%;
                        ">
            新闻类别
          </div>
          <div class="text-bottom" style="
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: rgba(255,255,255,0.60);
                    font-weight: 400;
                    ">
            长按拖拽排序
          </div>
        </div>
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

            <div class="iconText" 
            style="width: 20px ; 
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
      </div>

    </a-drawer>
  </div>
</template>

<script>
import Widget from '../../card/Widget.vue';
import NewsItem from './NewsItem.vue';
// import _ from 'lodash'
import { LeftOutlined, RightOutlined,HolderOutlined } from '@ant-design/icons-vue'
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
    HolderOutlined
  },
  data() {
    return {
      settingVisible: false,
      sizeList: [
        {
          title: '4x4',
          height: 2,
          width: 2,
          name: '2x2'
        },
        {
          title: '4x6',
          height: 3,
          width: 2,
          name: '2x3'
        },
      ],
      options: {
        className: 'card',
        title: '新闻资讯',
        icon: 'xinwen1',
        type: 'news'
      },
      menuList: [
        { icon: 'shezhi1', 
        title: '设置', 
        fn: () => { this.settingVisible = true; this.$refs.cardSlot.visible = false } 
      },
      ],
      currentIndex: 0,
      titleList:['头条','国内','国际','娱乐','军事','体育','科技']
    }
  },
  methods: {
    decrease() {
      if(this.currentIndex < 0) {
        this.currentIndex=this.titleList.length-1
      }else{
        this.currentIndex--
      }
    },
    increase() {
      if(this.currentIndex>this.titleList.length-1){
        this.currentIndex=0
      }else{
        this.currentIndex++
      }
    },
    setCurrentIndex(index) {
      this.currentIndex = index
    }
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

    .action {
      background: #508BFE;
      
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
  
  