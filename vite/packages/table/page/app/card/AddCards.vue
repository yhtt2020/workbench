<template>
  <div class="controller">
    <div class="header">
      <div class="left">
        <div class="btn" @click="onBack">
          <Icon icon="xiangzuo" style="height: 24px; width: 24px"></Icon>
        </div>
        <a-input v-model:value="selectContent" class="search" placeholder="搜索">
          <template #prefix>
            <Icon icon="sousuo" style="margin-right: 5px;"></Icon>
          </template>
        </a-input>
      </div>
      <div class="right">添加到

        <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);" @change="getRegion($event)"
          class="w-56 h-auto rounded-lg  text-xs s-item select" size="large" :bordered="false" v-model:value="area">
          <a-select-option v-for="item in region" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
    </div>
    <div class="mian">
      <div class="left">
        <div class="nav" v-for="(item, index) in navList" :key="index">
          {{ item.name }}
        </div>
      </div>
      <div class="right">
        <div class="box" v-for="item in navList[navIndex].children">
          {{ item.name }}
          <div class="left">
            <img class="img2" src="../../../../../public/img/addCard/clock.png" alt="">
          </div>
          <div class="right">
            <div class="add">123</div>
            <!-- <div class="title">{{ item['size'] }}</div> -->
            <div class="text">桌面时钟，支持多种时钟样式选择，一键进入全屏桌搭模式。</div>
            <div class="icon">
              <div class="icon-box">自定义大小</div>
              <div class="icon-box">5种样式</div>
              <div class="icon-box">全屏模式</div>
            </div>
            <div class="data">
              <div class="data-box">999次下载</div>
              <div class="data-box">2023年5月24日更新</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardPreview from './CardPreview.vue'
import { navList } from "./navList"
console.log('nav :>> ', navList);
console.log('nav :>> ', 1111);
export default {
  name: "AddCard",
  components: { CardPreview },
  data() {
    return {
      navIndex: 1,
      navList: [
        { name: "推荐", children: [] },
        {
          name: "工具", children: [
            {
              name: "系统性能监控", info: "同步AIDA64数据，监控你的CPU、GPU、内存、网络等数据。",
              size: ["2*2", "2x4"],
              img: [""]
            }, {
              name: "壁纸", info: "发现新壁纸，浏览我收藏的图片壁纸。",
              size: ["2x2", "2x4"],
              img: ["", ""]
            },
            {
              name: "桌面便签", info: "一个可自由修改内容，调整大小的桌面便签。",
              size: ["自定义大小"],
              img: [""]
            },
            {
              name: "单图标组件", info: "单图标模式小组件，支持自由拖放和分组。",
              size: ["1x1"],
              img: [""]
            }, ,
            {
              name: "天气", info: "查看某地当前的天气状况和未来的天气预报。",
              size: ["2x2"],
              img: [""]
            }, ,
            {
              name: "股票", info: "查看关注的股票报价并跟踪其表现。",
              size: ["2x2", "4x4"],
              img: [""]
            },
            {
              name: "音频", info: "快速调整音量大小，音频设备选择，一键开启静音模式。",
              size: ["2x4"],
              img: [""]
            }
          ]

        },
        {
          name: "效率", children: [{
            name: "时钟", info: "桌面时钟，支持多种时钟样式选择，一键进入全屏桌搭模式。",
            size: ["自定义大小"],
            img: [""]
          },
          {
            name: "番茄钟", info: "快速开启番茄钟时刻，记录每天专注成果。",
            size: ["2x2"],
            img: [""]
          }, {
            name: "待办", info: "同步你的待办助手数据，展现在工作台桌面。",
            size: ["2x2", "2x4"],
            img: [""]
          }, {
            name: "倒数日", info: "记录关于你的纪念日、考试日等重要的日子。",
            size: ["2x2", "2x4"],
            img: [""]
          }, {
            name: "日历", info: "追踪当月日期，查看临近节日和假期。",
            size: ["2x4"],
            img: [""]
          }, {
            name: "闹钟", info: "快速设置闹钟，计时器；在工作台锁屏上同步显示闹钟信息。",
            size: ["2x2"],
            img: [""]
          },]
        },
        { name: "系统", children: [] },
        {
          name: "游戏", children: [
            {
              name: "Steam特惠", info: "今日特惠游戏，快快加入你的购物车和愿望单。",
              size: ["2x4"],
              img: [""]
            }, {
              name: "我的游戏",
              info: "Steam游戏、本地其他游戏库展示，一键快速启动游戏。",
              size: ["2x2", "2x4"],
              img: [""]
            }, {
              name: "Epic喜加一", info: "查看本周Epic免费游戏，下周神秘游戏预告。",
              size: ["2x4"],
              img: [""]
            }, {
              name: "Steam好友", info: "同步展示你的Steam好友在线状态。",
              size: ["2x2"],
              img: [""]
            }
          ]
        },
        {
          name: "娱乐", children: [{
            name: "网易云音乐", info: "基于网易云音乐网页版功能，支持基础播放控制功能。",
            size: ["2x2"],
            img: [""]
          }, {
            name: "木鱼", info: "休闲减压神器，每天敲一敲，积攒功德。",
            size: ["2x2"],
            img: [""]
          }, {
            name: "正在热映", info: "电影荒了？来看看近期正在上映的热门电影。",
            size: ["2x2", "2x4"],
            img: [""]
          }]
        },
        {
          name: "社区", children: [{
            name: "签到", info: "每日签到赢取积分，冲榜大赛即将上线。",
            size: ["2x4"],
            img: [""]
          },
          ]
        },
        {
          name: "创意", children: [{
            name: "自定义图片组件", info: "使用喜爱的图片作为小组件，支持自由设置点击图片的快捷方式。",
            size: ["自定义大小"],
            img: [""]
          }, {
            name: "外部小组件", info: "添加一个链接到外部网页的小组件，可以实现各种自定义功能",
            size: ["自定义大小"],
            img: [""]
          }]
        },
        { name: "施工中", children: [] },
        {
          name: "", info: "",
          size: ["", ""],
          img: [""]
        }
      ]
    };
  },

  mounted() { },
  computed: {

  },
  methods: {
    onBack() {
      this.$emit("setCustom1", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.controller {
  width: 100%;
  height: 40%;
  border: 1px solid;
  box-sizing: border-box;
  padding: 24px;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .left {
      display: flex;

      .btn {
        background: rgba(0, 0, 0, 0.30);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 112px;
        height: 48px;
        margin-right: 20px;
      }

      .search {
        background: rgba(0, 0, 0, 0.30);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        width: 400px;
        height: 48px;
        padding-left: 20px;
        font-size: 18px;
      }

      .select {
        width: 134px;
        height: 48px;
      }
    }


  }

  .mian {
    display: flex;
    box-sizing: border-box;

    .left {
      height: 100%;
      margin-right: 24px;
      border: 1px solid;

      .nav {
        background: rgba(0, 0, 0, 0.30);
        width: 112px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 16px;
        cursor: pointer;
      }
    }

    .right {
      width: 100%;

      .box {
        border: 1px solid red;
        width: 542px;
        height: 184px;
        display: flex;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.30);

        .left {
          margin: 0;
          height: 184px;
          background: rgba(0, 0, 0, 0.30);
          border-radius: 12px 0px 0px 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 240px;

          .img1 {
            height: 120px;
            width: 80px;
          }

          .img2 {
            width: 120px;
            height: 88px;
          }
        }

        .right {
          box-sizing: border-box;
          padding: 10px;
          border: 1px solid;
          position: relative;

          .add {
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.30);
            border-radius: 12px;
            width: 48px;
            height: 48px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .title {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: rgba(255, 255, 255, 0.85);
            font-weight: 500;
            height: 35px;
            line-height: 35px;
          }

          .text {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.60);
            font-weight: 400;
            margin: 2px 0;
            width: 76%;
          }

          .icon {
            margin-bottom: 10px;
            display: flex;
            width: 100%;
            height: 24px;
            margin-top: 10px;

            .icon-box {
              background: rgba(255, 255, 255, 0.40);
              border-radius: 4px;
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: rgba(255, 255, 255, 0.50);
              font-weight: 500;
              padding: 0 10px 0 10px;
              margin-right: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }

          .data {
            display: flex;

            .data-box {
              margin-right: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
