<template>
  <xt-container
    :header="header"
    v-model:customSize="customData.customSize"
    :envLimit="['guest', 'offline']"
    @click="onHistoryMessage"
    :sizeList="sizeList"
    :customData="customData"
    :customIndex="customIndex"
    :options="options"
    ref="cardSlot"
    :desk="desk"
    :menuList="menuList"
    @delete="deleteCard"
  >
    <!-- <template #left-title>
            <Icon icon='fluent:open-20-filled' class="pointer" width="20" height="20" style="position: relative;top:3px;" />
        </template>
        <div class="top-icon">
            <Icon icon="majesticons:monitor-line" />
        </div> -->
    <div class="overflow-hidden dash-board" style="height: 365px">
      <Unusual
        v-if="!accToken || !accUrl"
        :disableEdit="options.disableEdit"
        :newIcon="'fluent-emoji:chart-increasing'"
        :title="'请完成小组件配置'"
        :normalButtonTitle="'立即配置'"
        :description="'未读到社区数据'"
        @back="settingBack"
      />

      <template v-else>
        <template v-for="(item, index) in targetKeys" :key="index">
          <div class="mt-2 dash-cell">
            <div class="cell-title">{{ this.mockData[item - 1].title }}</div>
            <div class="cell-num" style="font-family: 'Oswald-Medium'">
              {{
                this.mockData[item - 1].num == undefined
                  ? "-"
                  : this.mockData[item - 1].num
              }}
            </div>
          </div>
        </template>
      </template>
    </div>

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
          @click="submitAccToken(accToken, accUrl)"
        >
          提交
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
          <p class="ml-1">管理后台地址（例如：https://admin.osx.com）</p>
          <a-input
            spellcheck="false"
            style="border-radius: 10px"
            v-model:value="this.accUrl"
            placeholder="请输入"
            class="pl-1 search input-txt"
          ></a-input>
        </div>

        <div v-show="!this.setVisible && this.access_token && this.baseUrl">
          <div class="text-title" @click="this.setVisible = !this.setVisible">
            关联短说社区系统
            <span>{{
              this.access_token && this.baseUrl ? "已关联 >" : "未关联 >"
            }}</span>
          </div>
          <div class="text-content">
            <div>设置小组件数据</div>
            <div>
              4*4尺寸的小组件可以选择9个数据，2*4的小组件可以选择六个数据，
              每个小组件的数据都是独立的，你可以为小组件去不同的名字，自由组合不同的数据维度的小组件看板
            </div>
          </div>
          <p>小组件名称</p>
          <p>
            <a-input
              style="border-radius: 10px"
              v-model:value="this.options.title"
              @change="changeName"
              :maxlength="20"
              class="pl-1 search"
            ></a-input>
          </p>
          <!--  穿梭框 -->
          <p>选择统计数值</p>
          <div class="transfer">
            <a-transfer
              v-model:target-keys="targetKeys"
              :data-source="this.mockData"
              :show-select-all="false"
              @change="handleChange"
            >
              <template #render="item">
                <span class="custom-item">{{ item.title }}</span>
              </template>
            </a-transfer>
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
import { defineComponent, ref, onMounted } from "vue";
import { cardStore } from "../../../../store/card";
import { mapActions, mapState, mapWritableState } from "pinia";
import { shortTalkStore } from "../store";
import Unusual from "../../Unusual.vue";
import { communityNavStore } from "../../../bottomPanel/store/communityNavStore";
import {
  communityAuth,
  communityMember,
} from "../../../../apps/communityDesk/hooks/deskCreateMethod";

import CardSettingExplain from "../../../CardSettingExplain.vue";

import { saveData } from "../../../../save/saveData";
import { loadData } from "../../../../save/loadData";

export default {
  components: {
    Widget,
    Icon,
    defineComponent,
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
    menuList: {
      type: Array,
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
      "mockData",
      "access_token",
      "baseUrl",
      "setVisible",
    ]),
    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
        defaultData: {
          customSize: "2x4",
          _updateFlag: "24531",
        },
        disableEdit: this.isCommunityDesktop(this.desk),
        cardName: '短说数据看板'
      };
    },
  },

  data() {
    return {
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false,
      },
      sizeList: [
        {
          value: "2x4",
          name: "2x4",
        },
        {
          value: "4x4",
          name: "4x4",
        },
      ],
      settingVisible: false,
      // 密钥和地址
      secKey: "",
      secAdd: "",
      menuList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.cardSlot.visible = false;
            this.setVisible = false;
          },
        },
      ],
      targetKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      // 密钥和地址
      accToken: "",
      accUrl: "",
      header: {
        title: "社区数据",
        // ifyIcon:'majesticons:monitor-line',
        showIcon: "/logo/shortDashboard.svg",
        rightIcon: [
          {
            ifyIcon: "fluent:open-20-filled",
          },
        ],
      },
    };
  },

  mounted() {
    if (this.customData.customSize === undefined) {
      this.customData.customSize = "2x4";
    }

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


    if (this.options.disableEdit) {
      this.sizeList = [];
      this.menuList = [];
    } else {
      this.sizeList = [
        {
          value: "2x4",
          name: "2x4",
        },
        {
          value: "4x4",
          name: "4x4",
        },
      ];
      this.menuList = [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.cardSlot.visible = false;
            this.setVisible = false;
          },
        },
      ];
    }

    // this.$nextTick(() => {
    //   // hhh
    //   if (communityMember(this.desk?.communityNo)) {
    //     const target = {
    //       customIndex: this.customIndex,
    //       desk: this.desk,
    //     };
    //     loadData("desk", target).then((rs) => {
    //       this.changeAccToken(rs.accToken, rs.accUrl);
    //       this.init();
    //     });
    //   } else {
    //     this.init();
    //   }
    // });
  },

  methods: {
    ...mapActions(cardStore, ["updateCustomData"]),
    ...mapActions(shortTalkStore, ["getBoardData", "changeAccToken"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),
    communityAuth,

    deleteCard() {
      this.$emit("delete");
    },
    init() {
      // 初始化设置数组
      if (!this.customData.targetKeys) {
        this.updateCustomData(
          this.customIndex,
          {
            targetKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
          this.desk
        );
      } else {
        this.targetKeys = this.customData.targetKeys;
      }
      // 初始化名称
      if (!this.customData.optionTitle) {
        this.updateCustomData(
          this.customIndex,
          {
            optionTitle: "社区数据",
          },
          this.desk
        );
      } else {
        this.options.title = this.customData.optionTitle;
      }
      let config = {
        access_token: this.accToken,
        baseUrl: this.accUrl,
      }
      // 初始化获取详细数据
      this.getBoardData(config);
    },
    // 修改设置的数组
    handleChange(keys, direction, moveKeys) {
      this.updateCustomData(
        this.customIndex,
        {
          mockData: this.mockData,
          targetKeys: keys,
        },
        this.desk
      );
    },
    // 修改小组件名称
    changeName() {
      this.updateCustomData(
        this.customIndex,
        {
          optionTitle: this.options.title,
        },
        this.desk
      );
    },

    settingBack() {
      this.settingVisible = true;
      this.setVisible = true;
    },

    // 提交社区数据
    submitAccToken(accToken, accUrl) {
      this.changeAccToken(accToken, accUrl);
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
    },
  },
  watch: {
    // 监听token 跟 url
    access_token: {
      handler(newVal, oldVal) {
        this.accToken = this.access_token;
        this.init();
      },
    },
    baseUrl: {
      handler(newVal, oldVal) {
        this.accUrl = this.baseUrl;
        this.init();
      },
    },
    customSize(newVal, oldVal) {
      this.customData.customSize = newVal;
    },
  },
};
</script>

<style lang="scss" scoped>
.top-icon {
  position: absolute;
  top: 17px;
}
.top-icon svg {
  width: 20px;
  height: 20px;
}
.dash-board {
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  position: relative;
  top: -3px;
  justify-content: space-between;
  align-content: flex-start;
}

.dash-cell {
  width: 32%;
  min-width: 120px;
  height: 112px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  // margin-top: 12px;
}

.dash-cell .cell-title {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  margin-top: 23px;
}
.dash-cell .cell-num {
  margin-top: 11px;
  font-family: Oswald-Medium;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.transfer ul {
  border-radius: 10px !important;
}
// .transfer .ant-transfer-list{
//     border-radius: 10px !important;

//     width: 194px;
//     height: 656px;
// }
// .transfer>div{
//     border-radius: 10px !important;

// }

:deep(.ant-transfer-list) {
  border-radius: 3px !important;
  max-height: 564px;
  width: 194px !important;
  height: 656px !important;
}
:deep(.ant-btn-icon-only.ant-btn-sm) {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  margin-top: 8px;
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

.top-btn {
  width: 64px;
  height: 40px;
  border-radius: 10px;
}

.text-title {
  width: 100%;
  font-size: 16px;
  padding: 0 16px;
  height: 48px;
  line-height: 48px;
  color: rgba(255, 255, 255, 0.85);
  background: #2a2a2a;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
}

.text-title span {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  float: right;
}

// :deep(.ant-drawer-body) {
// padding: 100px !important;
// font-size: 10px;
//}

.input-txt {
  height: 40px;
  margin-bottom: 12px;
  background-color: #2a2a2a 100%;
}

:deep(.ant-pagination) {
  text-align: center !important;
}

.ant-transfer-list-content::-webkit-scrollbar-track {
  background-color: #f1f1f1 !important;
}

// 滚动条
:deep(.ant-transfer-list-content) {
  flex: 1 1 0%;
  overflow: hidden;
  overflow-y: auto;
}
:deep(.ant-transfer-list-content::-webkit-scrollbar) {
  width: 5px;
}
:deep(.ant-transfer-list-content::-webkit-scrollbar-thumb) {
  background: #aaa;
  border-radius: 3px;
}

:deep(.ant-transfer-list-content-item) {
  height: 48px;
}

:deep(.ant-checkbox-wrapper) {
  margin-left: 5px;
}
:deep(.ant-transfer-list-content-item-text) {
  margin-left: 5px;

  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
}
</style>
