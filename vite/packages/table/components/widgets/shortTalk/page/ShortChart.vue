<template>
  <xt-container
    :header="header"
    v-model:customSize="customData.customSize"
    :envLimit="['guest', 'offline']"
    :customData="customData"
    :customIndex="customIndex"
    :menuList="menuList"
    :options="options"
    ref="dataSlot"
    :desk="desk"
    @delete="deleteCard"
  >
    <Unusual
      v-if="!accToken || !accUrl"
      title="请完成小组件配置"
      :disableEdit="options.disableEdit"
      :newIcon="'fluent-emoji:memo'"
      :description="'未读到社区数据'"
      :normalButtonTitle="'立即配置'"
      @back="shortBack"
    />

    <div v-else class="echarts" ref="myChart" :style="myChartStyle"></div>

    <!-- 设置面板 -->
    <a-drawer
      :width="500"
      title="设置"
      v-model:visible="settingVisible"
      placement="right"
    >
      <template #extra>
        <div
          v-show="this.setVisible"
          class="xt-active-btn"
          style="width: 64px; height: 40px"
          @click="submitEcharts(accToken, accUrl)"
        >
          提交
        </div>
        <div
          v-show="!this.setVisible"
          class="xt-active-btn"
          style="width: 64px; height: 40px"
          @click="changeCharts(true)"
        >
          保存
        </div>
      </template>
      <vue-custom-scrollbar :settings="settings" style="height: 100%">
        <CardSettingExplain v-if="communityAuth(desk?.communityNo)" />

        <div v-show="this.setVisible">
          <div class="text-content">
            <div>关联短说社区系统</div>
            <div>
              在使用该功能前，需要关联您的短说社区系统，请在短说管理后台获取系统密钥，填入下方输入框，以及您的管理后台地址，成功完成配置后即可使用。
            </div>
            <div>在想天浏览器中打开短说管理后台，可以自动检测获取密钥。</div>
          </div>
          <p class="mt-1 ml-1">密钥</p>
          <a-input
            spellcheck="false"
            style="border-radius: 10px"
            v-model:value="this.accToken"
            placeholder="请输入"
            class="pl-1 search input-txt"
          ></a-input>
          <p class="mt-2 ml-1">管理后台地址（例如：https://admin.osx.com）</p>
          <a-input
            spellcheck="false"
            style="border-radius: 10px"
            v-model:value="this.accUrl"
            placeholder="请输入"
            class="pl-1 search input-txt"
          ></a-input>
        </div>

        <div v-show="!this.setVisible">
          <div
            class="txt-content pointer"
            style="
              height: 48px;
              color: var(--primary-text);
              background: var(--secondary-bg);
            "
            @click="this.setVisible = !this.setVisible"
          >
            <div>
              关联短说社区系统<span>{{
                this.access_token && this.baseUrl ? "已关联 >" : "未关联 >"
              }}</span>
            </div>
          </div>
          <div
            class="txt-content"
            style="
              height: 104px;
              color: var(--primary-text);
              background: var(--secondary-bg);
            "
          >
            <div>设置小组件数据</div>
            <div>
              你可以选择一下两种图表：[社区访问数据]、[社区互动数据]；同时支持在此处选择图表的时间范围和平台
            </div>
          </div>
          <p class="ml-1">图表类型</p>
          <RadioTab
            :navList="dataType"
            v-model:selectType="defaultDataType"
          ></RadioTab>
          <p class="mt-3 ml-1">时间周期</p>
          <RadioTab
            :navList="timeType"
            v-model:selectType="defaultTimeType"
          ></RadioTab>
          <div v-show="this.defaultDataType.name == 'visit'">
            <p class="mt-3 ml-1">平台类型</p>
            <RadioTab
              :navList="platType"
              class="nav-type"
              v-model:selectType="defaultPlatType"
            ></RadioTab>
          </div>
          <div>
            <p class="mt-3 ml-1">数据更新频率</p>
            <a-select
              ref="select"
              v-model:value="timeVal"
              class="w-full"
              :bordered="false"
              size="large"
              style="
                color: var(--primary-text);
                background: var(--secondary-bg);
                border-radius: 10px;
              "
              dropdownClassName="drop-class"
              :options="timeOption"
              @change="handleChangeTime"
            ></a-select>
          </div>
        </div>
      </vue-custom-scrollbar>
    </a-drawer>
  </xt-container>
</template>

<script>
import axios from "axios";
import Widget from "../../../card/Widget.vue";
import { Icon } from "@iconify/vue";
import RadioTab from "../components/RadioTab.vue";
import * as echarts from "echarts";
import { cardStore } from "../../../../store/card";
import { mapActions, mapState, mapWritableState } from "pinia";
import { shortTalkStore } from "../store";
import { useToast } from "vue-toastification";
import Unusual from "../../Unusual.vue";
import { communityNavStore } from "../../../bottomPanel/store/communityNavStore";
import {
  communityAuth,
  communityMember,
} from "../../../../apps/communityDesk/hooks/deskCreateMethod";
import CardSettingExplain from "../../../CardSettingExplain.vue";
import { saveData } from "../../../../save/saveData";
import { loadData } from "../../../../save/loadData";

const toast = useToast();

export default {
  components: {
    Widget,
    Icon,
    echarts,
    RadioTab,
    Unusual,
    CardSettingExplain,
  },

  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {},
    },
    desk: {
      type: Object,
    },
    editing: {
      type: Boolean,
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },
  emit: ["delete"],
  computed: {
    ...mapWritableState(shortTalkStore, [
      "access",
      "interact",
      "access_token",
      "baseUrl",
      "setVisible",
    ]),
    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
        disableEdit: this.isCommunityDesktop(this.desk),
        cardName: '短说社区图表'
      };
    },
  },
  data() {
    return {
      // 设置定时刷新
      timeOption: [
        {
          value: 600,
          label: "10分钟",
        },
        {
          value: 1800,
          label: "30分钟",
        },
        {
          value: 3600,
          label: "1小时（默认）",
        },
        {
          value: 86400,
          label: "24小时",
        },
      ],
      timeVal: 3600,
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false,
      },
      settingVisible: false,
      // 设置中的数组
      dataType: [
        { title: "社区访问数据", name: "visit" },
        { title: "社区互动数据", name: "interact" },
      ],
      defaultDataType: { title: "社区访问数据", name: "visit" },
      timeType: [
        { title: "每日", name: "day" },
        { title: "每周", name: "week" },
        { title: "每月", name: "month" },
      ],
      defaultTimeType: { title: "每日", name: "day" },
      platType: [
        { title: "全部", name: "all" },
        { title: "H5", name: "h5" },
        { title: "PC", name: "pc" },
        { title: "小程序", name: "xcx" },
        { title: "APP", name: "app" },
      ],
      defaultPlatType: { title: "全部", name: "all" },
      // 设置
      menuList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.dataSlot.visible = false;
            this.setVisible = false;
          },
        },
      ],
      // options: {
      //     className: "card double w-full",
      //     title: "社区访问数据/每日/全部",
      //     icon: "iconamoon:history-fill",
      //     rightIcon:"fluent:open-20-filled",
      // },
      // 网格数据
      myChartStyle: {
        float: "left",
        width: "600px",
        height: "400px",
        position: "relative",
        left: "-12px",
        top: "3px",
      },
      // 密钥和地址
      accToken: "",
      accUrl: "",
      timer: "",
      header: {
        title: "社区访问数据/每日/全部",
        // ifyIcon:'fluent:arrow-trending-lines-20-filled',
        showIcon: "/logo/ShortChart.svg",

        rightIcon: [
          {
            ifyIcon: "fluent:open-20-filled",
          },
        ],
      },
      customSize: "4x4",
    };
  },
  emit: ["delete"],
  async mounted() {

    if(this.communityAuth(this.desk?.communityNo)){
      // 初始化
      this.accToken = this.access_token;
      this.accUrl = this.baseUrl;

      const target = {
        customIndex: 'shortTalk',
        desk: this.desk,
      };
      const tokenData = {
        accToken: this.accToken,
        accUrl: this.accUrl,
      };
      saveData(tokenData, "desk", target);
      this.$bus.emit("updateSync");
    }
    // 初始化
    if (communityMember(this.desk?.communityNo)) {
      const target = {
        customIndex: 'shortTalk',
        desk: this.desk,
      };
      loadData("desk", target).then((rs) => {
        this.accToken = rs?.accToken;
        this.accUrl = rs?.accUrl;
        this.init();
      });
    }else{
      this.accToken = this.access_token;
      this.accUrl = this.baseUrl;
      this.init();
    }
    if (this.customData.time) {
      this.timeVal = this.customData.time;
    } else {
      this.timeVal = 3600;
      this.updateCustomData(
        this.customIndex,
        {
          time: 3600,
        },
        this.desk
      );
    }
    this.timer = setInterval(() => {
      this.init();
    }, this.timeVal * 1000);


    if (this.options.disableEdit) {
      this.menuList = [];
    } else {
      this.menuList = [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.dataSlot.visible = false;
            this.setVisible = false;
          },
        },
      ];
    }
  },
  unmounted() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions(cardStore, ["updateCustomData"]),
    ...mapActions(shortTalkStore, ["getChartData", "changeAccToken"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),
    communityAuth,

    deleteCard() {
      this.$emit("delete");
    },
    // 设置定时刷新
    handleChangeTime(value) {
      this.updateCustomData(
        this.customIndex,
        {
          time: value,
        },
        this.desk
      );
      this.$message.success("修改成功");
      // 修改后重新添加定时器
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.init();
      }, this.timeVal * 1000);
    },
    init() {
      // 初始
      if (!this.customData.defaultDataType) {
        this.updateCustomData(
          this.customIndex,
          {
            defaultDataType: this.defaultDataType,
            defaultTimeType: this.defaultTimeType,
            defaultPlatType: this.defaultPlatType,
            customSize: "4x4",
          },
          this.desk
        );
      } else {
        this.defaultDataType = this.customData.defaultDataType;
        this.defaultTimeType = this.customData.defaultTimeType;
        this.defaultPlatType = this.customData.defaultPlatType;
        this.customData.customSize = "4x4";
      }
      let config = {
        ...this.customData,
        access_token: this.accToken,
        baseUrl: this.accUrl,
      }

      this.getChartData(config).then(() => {
        // 添加判断 如果没有获取到数据就停止
        this.changeBarChart();
      });
    },
    // 初始化柱状图
    initEcharts() {
      // 多列柱状图
      const mulColumnZZTData = {
        xAxis: {
          data: this.xData,
        },
        // 图例属性
        legend: {
          data: this.legend,
          top: "0%",
          itemHeight: 10,
          itemWidth: 10,
          x: "left",
          left: 10,
          textStyle: {
            color: "rgba(255,255,255,0.85)",
            fontSize: "12",
          },
        },
        // y轴线条
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              type: "solid",
              color: "#FCFCFC", //网格颜色
              opacity: "0.3",
            },
          },
        },
        // 内部属性
        series: this.series,
      };
      if (this.$refs.myChart) {
        const myChart = echarts.init(this.$refs.myChart);
        myChart.clear();
        myChart.setOption(mulColumnZZTData);
        window.addEventListener("resize", () => {
          myChart.resize();
        });
      }
    },
    // 修改柱状图数据
    changeBarChart() {
      // 社区访问数据
      if (this.defaultDataType.name == "visit") {
        // 内部属性
        (this.series = [
          {
            type: "bar",
            data: this.access?.visit.series,
            name: "访问次数",
            label: {
              show: true,
              position: "top",
              // 修改柱状条上方数据
              textStyle: {
                color: "rgba(255,255,255,0.85)",
                fontSize: 10,
              },
            },
            itemStyle: {
              color: "rgba(91,143,249,0.85)",
            },
          },
          {
            type: "bar",
            data: this.access?.login.series,
            name: "访问人数",
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "rgba(255,255,255,0.85)",
                fontSize: 10,
              },
            },
            itemStyle: {
              color: "rgba(90,216,166,0.85)",
            },
          },
        ]),
          // 图例
          (this.legend = ["访问次数", "访问人数"]);

        // x轴
        this.xData = this.interact?.post.xAxis;
        // y轴
      } else {
        (this.series = [
          {
            type: "bar",
            data: this.interact?.post.series,
            name: "发布",
            label: {
              show: true,
              position: "top",
              // 修改柱状条上方数据
              textStyle: {
                color: "rgba(255,255,255,0.85)",
                fontSize: 10,
              },
            },
            itemStyle: {
              color: "rgba(91,143,249,0.85)",
            },
          },
          {
            type: "bar",
            data: this.interact?.support.series,
            name: "点赞",
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "rgba(255,255,255,0.85)",
                fontSize: 10,
              },
            },
            itemStyle: {
              color: "rgba(90,216,166,0.85)",
            },
          },
          {
            type: "bar",
            data: this.interact?.thread.series,
            name: "评论",
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "rgba(255,255,255,0.85)",
                fontSize: 10,
              },
            },
            itemStyle: {
              color: "rgba(93,112,146,0.85)",
            },
          },
        ]),
          // 图例
          (this.legend = ["发布", "点赞", "评论"]);
        // x轴
        this.xData = this.interact?.post.xAxis;
      }
      this.initEcharts();
    },
    // 设置保存后修改
    changeCharts(boolean) {
      this.options.title =
        this.defaultDataType.title +
        "/" +
        this.defaultTimeType.title +
        (this.defaultDataType.name == "visit"
          ? "/" + this.defaultPlatType.title
          : "");
      this.updateCustomData(
        this.customIndex,
        {
          defaultDataType: this.defaultDataType,
          defaultTimeType: this.defaultTimeType,
          defaultPlatType: this.defaultPlatType,
        },
        this.desk
      );
      this.$bus.emit('updateSync');
      if (boolean) {
        toast.success("保存成功");
      }
      this.settingVisible = false;
      setTimeout(() => {
        this.init();
      }, 500);
    },
    shortBack() {
      this.settingVisible = true;
    },

    // 社区图表配置项提交
    submitEcharts(accToken,accUrl) {
      if(this.communityAuth(this.desk?.communityNo)){
        const target = {
          customIndex: 'shortTalk',
          desk: this.desk,
        };
        const tokenData = {
          accToken: accToken,
          accUrl: accUrl,
        };
        saveData(tokenData, "desk", target);
        this.$bus.emit("updateSync");
      }
      this.changeAccToken(accToken,accUrl);
    },
  },
  watch: {
    // 监听token 跟 url
    access_token: {
      handler(newVal, oldVal) {
        this.accToken = this.access_token;
        let config = {
          ...this.customData,
          access_token: this.accToken,
          baseUrl: this.accUrl,
        }
        this.getChartData(config).then(() => {
          this.changeCharts();
        });
      },
    },
    baseUrl: {
      handler(newVal, oldVal) {
        this.accUrl = this.baseUrl;
        let config = {
          ...this.customData,
          access_token: this.accToken,
          baseUrl: this.accUrl,
        }
        this.getChartData(config).then(() => {
          this.changeCharts();
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.top-icon {
  position: absolute;
  top: 18px;
}
.top-icon svg {
  width: 20px;
  height: 20px;
}

.echarts {
  font-family: Helvetica;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  text-align: left;
  font-weight: 400;
}

.txt-content {
  width: 100%;
  // background: #2A2A2A;
  border-radius: 12px;
  padding: 13px 16px;
  // color: rgba(255,255,255,0.85);
  font-size: 16px;
  margin-bottom: 16px;
}
.txt-content span {
  float: right;
  font-size: 14px;
  // color: rgba(255,255,255,0.60);
}

.txt-content div:nth-of-type(1) {
  // color: rgba(255,255,255,0.85);
  margin-bottom: 10px;
}
.txt-content div {
  font-size: 14px;
  // color: rgba(255,255,255,0.60);
}

.nav-type :deep(.nav-box) {
  padding: 0 16px;
}

.text-content {
  width: 100%;
  min-height: 124px;
  background: #2a2a2a;
  border-radius: 12px;
  padding: 10px 16px;

  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  margin-bottom: 10px;
}
.text-content div:nth-of-type(1) {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 10px;
}

.text-content div {
  margin-bottom: 10px;
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  border: none;
}
:deep(
    .ant-drawer-header,
    .ant-modal-header,
    .ant-modal-footer,
    .ant-drawer-wrapper-body
  ) {
  color: var(--primary-text);
}
.drop-class {
  background-color: red;
}
</style>
