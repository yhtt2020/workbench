<template>
  <xt-container
    v-model:customSize="customData.customSize"
    :header="header"
    :envLimit="['guest', 'offline']"
    @click="onHistoryMessage"
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
      :disableEdit="options.disableEdit"
      :newIcon="'fluent-emoji:memo'"
      :title="'请完成小组件配置'"
      :description="'未读到社区数据'"
      :normalButtonTitle="'立即配置'"
      @back="todoBack"
    />

    <div v-else class="dash-board">
      <template v-for="(item, index) in this.todoList" :key="index">
        <div
          class="dash-cell pointer"
          :class="item.num == 0 || item.num == undefined ? 'green' : item.num < 100 ? 'yellow' : 'red', index > 1 ? 'mt-3' : ''"
          @click="jumpUrl(item.url)"
        >
          <div class="cell-title">{{ item.title }}</div>
          <div class="cell-num" style="font-family: 'Oswald-Medium'">
            {{ item.num == undefined ? "-" : item.num }}
          </div>
        </div>
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
          class="xt-active-btn"
          style="width: 64px; height: 40px"
          @click="changeVisible"
        >
          提交
        </div>
      </template>
      <vue-custom-scrollbar :settings="settings" style="height: 100%">
        <CardSettingExplain v-if="communityAuth(desk?.communityNo)" />

        <div>
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
      </vue-custom-scrollbar>
    </a-drawer>
  </xt-container>
</template>

<script>
import axios from "axios";
import Widget from "../../../card/Widget.vue";
import { Icon } from "@iconify/vue";
import { mapActions, mapState, mapWritableState } from "pinia";
import { shortTalkStore } from "../store";
import { cardStore } from "../../../../store/card";
import browser from "../../../../js/common/browser";
import Unusual from "../../Unusual.vue";
import { communityNavStore } from "../../../bottomPanel/store/communityNavStore";
import CardSettingExplain from "../../../CardSettingExplain.vue";
import {
  communityAuth,
  communityMember,
} from "../../../../apps/communityDesk/hooks/deskCreateMethod";
import { saveData } from "../../../../save/saveData";
import { loadData } from "../../../../save/loadData";

export default {
  components: {
    Widget,
    Icon,
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
  computed: {
    ...mapWritableState(shortTalkStore, [
      "todoList",
      "access_token",
      "baseUrl",
      "admin_url",
    ]),
    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
        disableEdit: this.isCommunityDesktop(this.desk),
        cardName: '短说社区待办'
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
      // 标题样式
      // 设置
      menuList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.dataSlot.visible = false;
          },
        },
      ],
      // 密钥和地址
      accToken: "",
      accUrl: "",
      settingVisible: false,
      customSize: "2x4",
      header: {
        title: "社区待办",
        showIcon:"/logo/todo.svg",
        rightIcon: [
          {
            ifyIcon: "fluent:open-20-filled",
          },
        ],
      },
    };
  },
  emit: ["delete"],
  mounted() {
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
        this.init()
      });
    }else{
      // 初始化
      this.accToken = this.access_token;
      this.accUrl = this.baseUrl;
      this.init()
    }
    this.customData.customSize = "2x4";

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
          },
        },
      ];
    }
  },
  methods: {
    ...mapActions(cardStore, ["updateCustomData"]),
    ...mapActions(shortTalkStore, ["getTodoData", "changeAccToken"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),
    communityAuth,

    changeVisible() {
      this.settingVisible = false;
      this.changeAccToken(this.accToken, this.accUrl);
      if(this.communityAuth(this.desk?.communityNo)){
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
    },
    jumpUrl(url) {
      browser.openInUserSelect(url);
    },
    todoBack() {
      this.settingVisible = true;
    },
    deleteCard() {
      this.$emit("delete");
    },
    init(){
      let config = {
        access_token: this.accToken,
        baseUrl: this.accUrl,
      }
      this.getTodoData(config);
    }
  },
  watch: {
    // 监听token 跟 url
    access_token: {
      handler(newVal, oldVal) {
        this.accToken = this.access_token;
        this.init()
      },
    },
    baseUrl: {
      handler(newVal, oldVal) {
        this.accUrl = this.baseUrl;
        this.init()
      },
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
}

.dash-cell {
  width: 120px;
  height: 112px;
  border-radius: 10px;
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

.dash-cell .cell-title {
  margin-top: 22px;

  font-size: 16px;
  color: rgba(255, 255, 255, 0.6) !important;
  font-weight: 400;
}
.dash-cell .cell-num {
  margin-top: 11px;
  font-family: Oswald-Medium;
  font-size: 24px;
  font-weight: 500;
}

.green {
  // opacity: 0.2;
  background-color: rgba(#52c41a, 0.2);
  color: #52c41a;
}
.red {
  background-color: rgba(#ff4d4f, 0.2);
  color: #ff4d4f;
}
.yellow {
  background-color: rgba(#faad14, 0.2);
  color: #faad14;
}
</style>
