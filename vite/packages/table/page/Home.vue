<template>
  <div style="height: 100%">
    <!-- <div style="position:fixed;z-index:9999999999;">
      <div @click="test1">测试isOffline{{isOffline}}</div>
      <div @click="test2">测试isGuest{{isGuest}}</div>
    </div> -->
    <desk-group
      @changeDesk="changeDesk"
      ref="deskGroupRef"
      :settings="settings"
      :desk-list="desks"
      v-model:currentDeskId="this.currentDeskId"
    >
      <template #settingsAll> </template>
    </desk-group>
  </div>
  <!-- 检测到用户头像为默认头像时触发用户中心个人信息修改弹窗 -->
  <div
    class="fixed inset-0 home-guide"
    style="z-index: 999"
    v-if="infoVisible === true"
  >
    <UpdateMyInfo
      v-if="infoVisible === true"
      :updateVisible="true"
    ></UpdateMyInfo>
  </div>
  <teleport to="body">
    <!-- 使用新版的配置导航 -->
    <NewGuidePage
      v-if="showGuide"
      @closeShowGuide="closeShowGuide"
      :deskId="deskId"
    ></NewGuidePage>
    <!-- <NewGuidePage v-if="showGuide" @closeShowGuide="closeShowGuide" :deskId="deskId"></NewGuidePage> -->
    <!-- 右上方的缩放推荐 -->
    <ScalePanel v-if="visibleScale" @closeScale="closeScale"></ScalePanel>
    <!-- <ScalePanel v-if="visibleScale" @closeScale="closeScale" ></ScalePanel> -->
    <!-- 仅限于web的登录提示弹窗 -->
    <WebLogin
      v-if="visibleWeb"
      @closeWebLogin="closeWebLogin"
      @addWebLogin="addWebLogin"
    ></WebLogin>
    <!-- 定制桌面流程 -->
    <GuidePanel
      v-if="visibleGuide"
      @closeGuide="closeGuide"
      @addGuide="addGuide"
    ></GuidePanel>
    <!-- <GuidePanel v-if="visibleGuide" @closeGuide="closeGuide" @addGuide="addGuide"></GuidePanel> -->

    <!-- 全屏遮罩层 -->
    <div
      v-show="visibleScale || visibleGuide || visibleWeb"
      class="fixed top-0 bottom-0 left-0 w-full h-full cursor-not-allowed ring-0"
      style="z-index: 900"
    ></div>
  </teleport>

  <GalleryModal ref="galleryRef" />
</template>

<script>
import { message, Modal } from "ant-design-vue";
import { mapActions, mapWritableState } from "pinia";
import { cardStore } from "../store/card";
import { runExec } from "../js/common/exec";
import { appStore } from "../store";
import { weatherStore } from "../store/weather";

import NewGuidePage from "./app/grade/NewGuidePage.vue";

import DeskGroup from "../components/desk/DeskGroup.vue";
import UpdateMyInfo from "../components/comp/UpdateMyInfo.vue";
import ScalePanel from "./ScalePanel.vue";
import GuidePanel from "./GuidePanel.vue";

import WebLogin from "./WebLogin.vue";
import GalleryModal from "../components/paperModal/PaperApp.vue";
import { taskStore } from "../apps/task/store";
import navigationData from "../js/data/tableData";
import { navStore } from "../store/nav";
import { homeStore } from "../store/home";
import _ from "lodash-es";
import { replaceType } from "../components/desk/navigationBar/hook/replaceType";
// 桌面默认数据
import { defaultFreeLayoutStore } from "./defaultFreeLayout";
import { useFreeLayoutStore } from "../components/desk/freeLayout/store";
import { mergeData } from "../ui/hooks/useDataConversion";
import { usePlat } from "../ui/hooks/usePlat";
import { usePermissionStore } from "../permission/store";
import cache from "../components/card/hooks/cache";
import { isMain } from "../js/common/screenUtils";
import { useUpdateUserInfo } from "../permission/user/useUserPermit";
let steamUser,
  steamSession,
  path,
  https,
  steamFs,
  LoginSession,
  EAuthTokenPlatformType;
if (!usePlat("web")) {
  steamUser = $models.steamUser;
  steamSession = $models.steamSession;
  path = $models.path;
  https = $models.https;
  steamFs = $models.steamFs;
  if (steamUser && steamSession) {
    LoginSession = steamSession.LoginSession;
    EAuthTokenPlatformType = steamSession.EAuthTokenPlatformType;
    var session = new LoginSession(EAuthTokenPlatformType.SteamClient);
    var client = new steamUser({
      enablePicsCache: true,
    });
  }
}

export default {
  name: "Home",
  data() {
    return {
      visibleAdd: false,
      iconVisible: false,
      newDesk: {
        name: "",
        template: "daily",
      },
      hide: false,
      menuVisible: false,
      settingVisible: false,
      addDeskVisible: false,
      editing: false,
      key: Date.now(),
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true,
        currentItemId: -1,
      },
      scrollbar: Date.now(),
      inspectorTimer: null,
      reserveTimer: null,
      custom: false,

      openDesk: false,
      deskType: [
        { title: "日常桌面", name: "daily" },
        { title: "游戏桌面", name: "game" },
        { title: "办公桌面", name: "work" },
        { title: "空白桌面", name: "empty" },
      ],
      selectDesk: { title: "日常桌面", name: "daily" },
      deskTitle: "",
      hotDesk: [],
      scheme: {},
      showModal: false,
      deskCode: "",
      shareCode: false,
      panelIndex: 0,
      cardSettings: {},
      cardDesk: "all",
      cardDeskList: [
        { name: "通用桌面设置", value: "all" },
        { name: "当前桌面设置", value: "current" },
      ],
      cardSwitch: false,
      exportModal: false,
      // 在页面创建的第一次触发，后面就不触发了--替换图标
      hasTriggered: 1,
      // 新建桌面id
      deskId: "",
    };
  },
  components: {
    DeskGroup,
    Modal,
    // Audio,
    NewGuidePage,
    UpdateMyInfo,
    GalleryModal,
    ScalePanel,
    GuidePanel,
    WebLogin,
  },
  computed: {
    ...mapWritableState(navStore, [
      "sideNavigationList",
      "footNavigationList",
      "rightNavigationList",
      "copyFootNav",
      // "init",
      "leftNavInit",
      "rightNavInit",
      "footNavInit",
    ]),
    ...mapWritableState(cardStore, [
      "customComponents",
      "clockEvent",
      "settings",
      "desks",
      "moved",
      "lastHeight",
    ]),
    ...mapWritableState(appStore, [
      "agreeTest",
      "backgroundSettings",
      "backgroundImage",
      "styles",
      "style",
      "fullScreen",
      "infoVisible",
      "searchFullScreen",
      "deskInit",
      "visibleScale",
      "visibleWeb",
      "visibleGuide",
      "showGuide",
      "guideList",
      "userInfo",
      "init",
    ]),

    ...mapWritableState(appStore, {
      appSettings: "settings",
    }),
    ...mapWritableState(taskStore, ["taskID", "step"]),
    ...mapWritableState(homeStore, [
      "currentDeskId",
      "currentDeskIndex",
      "currentInit",
    ]),
    ...mapWritableState(useFreeLayoutStore, [
      "freeLayoutData",
      "freeLayoutState",
    ]),
    ...mapWritableState(defaultFreeLayoutStore, [
      "deskDefault",
      "freeLayoutDataTmp",
      "freeLayoutStateTmp",
    ]),
    ...mapWritableState(usePermissionStore, ["isOffline", "isSingle", "isGuest", "getGuest"]),
    deskGroupRef() {
      return this.$refs.deskGroupRef;
    },
    desksList() {
      return this.desks.map((desk) => {
        return {
          name: desk.nanoid,
          title: desk.name,
        };
      });
    },
    currentDesk() {
      let find = this.desks.find((desk) => {
        return desk.id === this.currentDeskId;
      });
      if (find) {
        find.cards.forEach((e) => {
          if (!e.data) {
            e.data = {};
          }
          if (!e.customData) {
            e.customData = {};
          }
        });
        return find;
      } else {
        this.currentDeskId = this.desks[0].id;
        return this.desks[0];
      }
    },
  },
  async mounted() {
    // 每次进来需要设置工作台目前处于状态
    this.setStatus()

    // 用于桌面初始化 组件
    this.componentInit()

    // 首次客户端引导
    if (!this.init && isMain() && !usePlat('web')) {
      this.$router.replace({ name: "wizard" });
    }

    let n = 0;
    let timer = setInterval(() => {
      if (n > 3) {
        this.leftNavInit = true;
        this.rightNavInit = true;
        this.footNavInit = true;
        clearInterval(timer);
        return;
      }
      this.replaceIcon(this.sideNavigationList, this.leftNavInit);
      this.replaceIcon(this.rightNavigationList, this.rightNavInit);
      this.replaceIcon(this.copyFootNav, this.footNavInit);
      n++;
    }, 2000);

    this.$bus.on("customDesk", () => {
      console.log("定制桌面", this.visibleGuide);
      this.visibleGuide = true;
    });
    if (!this.moved) {
      //最早的修复
      this.desks[0].cards = this.customComponents;
      this.moved = true;
    }
    if (this.currentDeskId === "") {
      this.currentDeskId = this.desks[0].id;
    }
    if (this.desks.length > 0 && !this.currentDeskIndex.name) {
      this.currentDeskIndex = {
        // name: this.desks[0].nanoid,
        name: this.desks[0].id,
        title: this.desks[0].name,
      };
    }
    this.fixData();
    if (this.customComponents.length > 0) {
      if (typeof this.customComponents[0] === "string") {
        this.customComponents = [];
      }
    }
  },
  created() {
    if (this.currentDesk.cards.length) {
      this.currentDesk.cards.forEach((e) => {
        if (!e.data) {
          e.data = {};
        }
        if (!e.customData) {
          e.customData = {};
        }
        if (Object.keys(e.data).length > 0) {
          e.customData = { ...e.customData, ...e.data };
          e.data1 = e.data; //转移备份
          e.data = {}; //修理掉
        }
      });
    }

    this.navigationList = [];
    //this.setAgreeTest(false)
  },
  unmounted() {
    if (this.reserveTimer) {
      clearInterval(this.reserveTimer);
    }
  },
  methods: {
    /**
     * 更新布局，会自动判断布局存在与否
     */
    // updateLayout() {
    //   if (this.$refs.grid) {
    //     this.$refs.grid.update();
    //   }
    // },
    replaceType,
    learn() {
      browser.openInTable(
        "https://www.bilibili.com/video/BV1Th4y1o7SZ/?vd_source=2b7e342ffb60104849f5db6262bb1e0b"
      );
    },

    replaceIcon(navigationList, init) {
      if (!init) {
        navigationData.systemAppList.forEach((item) => {
          navigationList.forEach((i) => {
            if (item.event === i.event) {
              i.type = "systemApp";
              i.icon = item.icon;
              i.name = item.name;
              i.value = item.event;
              i.mode = "app";
            }
          });
        });
      }

      // return this.replaceType(navigationList)
      return navigationList.map((item) => this.mergeData(item));
    },
    mergeData,
    // customEvent() {
    //   this.updateLayout();
    // },
    runExec,
    ...mapActions(cardStore, [
      "getCurrentDesk",
      "addDesk",
      "switchToDesk",
      "removeDesk",
      "getCurrentIndex",
      "setDeskSize",
      "addShareDesk",
    ]),
    ...mapActions(appStore, ["setBackgroundImage"]),
    ...mapActions(weatherStore, ["fixData"]),
    // ...mapActions(deskStore, ["setDeskSize"]),
    ...mapActions(taskStore, ["initTask"]),
    ...mapActions(usePermissionStore, ["setOffline", "setGuest"]),
    initGrids() {
      this.currentDesk.cards = this.cleanMuuriData(deskTemplate["daily"]);
    },

    showAddDeskForm() {
      this.menuVisible = false;
      this.addDeskVisible = true;
    },
    delDesk() {
      this.$refs.deskGroupRef.delDesk();
    },
    changeDesk(p) {
      this.currentDeskId = p.id;
      let found = this.desks.find((desk) => {
        return desk.id === p.id;
      });
      if (found) {
        this.currentDeskIndex = {
          id: found.id,
          title: found.name,
        };
      }
    },

    // 覆写当前工作台状态
    setStatus(){
      this.isOffline = cache.get('isOffline')
      this.isSingle = cache.get('isSingle')
      this.isGuest = cache.get('isGuest')
      // 进行一次重连操作
      useUpdateUserInfo()

      this.replaceIcon(this.sideNavigationList, this.leftNavInit);
      this.replaceIcon(this.rightNavigationList, this.rightNavInit);
      this.replaceIcon(this.copyFootNav, this.footNavInit);
    },

    //
    componentInit(){
      // 判断是否是第一次加载
      if (this.deskInit) {
        this.deskInit = false;
        // 初始化任务
        this.initTask();
        // 初始化桌面
        this.addFreeLayoutDesk();
        if (!usePlat("web")) {
          // 非web端打开缩放提示弹窗
          this.visibleScale = true;
        } else {
          // web端打开功能介绍提示弹窗
          this.visibleWeb = true;
        }
      }
    },

    doAddDesk() {
      if (this.deskTitle.trim() === "") {
        message.error("请输入新桌面名称");
        return;
      }
      if (this.deskTitle.length >= 16) {
        message.error("新桌面名称长度不可超过16");
        return;
      }
      // if (this.newDesk.name.trim() === "") {
      //   message.error("请输入新桌面名称");
      //   return;
      // }
      // if (this.newDesk.name.length >= 16) {
      //   message.error("新桌面名称长度不可超过16");
      //   return;
      // }
      this.addDesk(
        this.deskTitle,
        this.cleanMuuriData(deskTemplate[this.selectDesk.name])
        // this.newDesk.name,
        // this.cleanMuuriData(deskTemplate[this.newDesk.template])
      );
      this.switchToDesk(this.desks.length - 1);
      this.deskTitle = "";
      this.selectDesk = { title: "日常桌面", name: "daily" };
      // this.newDesk = {
      //   name: "",
      //   template: "daily",
      //   data: {},
      // };
      this.key = Date.now();
      this.addDeskVisible = false;
    },
    exportDesk() {
      this.exportModal = true;
      this.getHomeSize();
      this.menuVisible = false;
    },

    clear() {
      this.menuVisible = false;
      let desk = this.getCurrentDesk();
      if (desk) {
        Modal.confirm({
          centered: true,
          content: "清空当前桌面的全部卡片？此操作不可还原。",
          onOk: () => {
            desk.cards = [];
            this.menuVisible = false;
          },
          okText: "清空卡片",
        });
      }
    },

    // 第一次登录默认数据
    addFreeLayoutDesk() {
      if (this.currentInit) {
        // 会有一个清除数据的过程 暂时没找到原因 先用定时器延迟执行
        setTimeout(() => {
          let deskTmp = _.cloneDeep(this.deskDefault[0]);
          let oldId = deskTmp.id;
          let cardZoom = (
            (deskTmp.settings.zoom * 10) /
            deskTmp.deskHeight
          ).toFixed();
          deskTmp.settings.zoom = parseInt(cardZoom);
          deskTmp.id = window.$models.nanoid.nanoid(8);
          if (this.freeLayoutStateTmp[oldId]) {
            this.freeLayoutData[deskTmp.id] = this.freeLayoutDataTmp[oldId];
            this.freeLayoutState[deskTmp.id] = this.freeLayoutStateTmp[oldId];
          }
          this.desks[0] = deskTmp;
          this.currentDeskId = deskTmp.id;
          this.addApptoDesk();
          this.currentInit = false;
        }, 2000);
      }
    },

    // 第一次登录加载桌面应用
    async addApptoDesk() {
      const desktopApps = await ipc.sendSync("getDeskApps");
      let appList = [];
      desktopApps.forEach((i) => {
        if (i.ext == ".exe") {
          appList.push(i);
        }
      });
      let appListHandle = [];
      appList.forEach((item) => {
        const now = new Date().getTime();
        let obj = {
          value: item.path,
          icon: item.icon,
          name: item.name,
          id: now,
          useCount: 0,
          lastUseTime: "",
          mode: "link",
          type: "default",
          iconState: "cover",
          iconShape: "square",
          isName: true,
          bg: "",
          isBg: false,
          radius: 5,
          isRadius: true,
        };
        appListHandle.push(obj);
      });
      this.desks[0].cards.forEach((item, index) => {
        // 直接修改默认数据
        if (item.id == "1702026795921") {
          // 如果一个图标都读取不出来 则将组件换成历史上的今天
          if (appListHandle.length > 1) {
            this.desks[0].cards[index].customData.list = appListHandle;
          } else {
            this.desks[0].cards[index] = {
              name: "historyInfo",
              id: 1702026795921,
              customData: {},
              data: {},
            };
          }
        }
      });
    },
    // 关闭缩放弹窗
    closeScale() {
      this.visibleScale = false;
      this.visibleGuide = true;
    },
    test1(){
      this.setOffline(!this.isOffline)
    },
    test2(){
      this.setGuest(!this.isGuest)
    },
    // 关闭缩放弹窗
    closeWebLogin() {
      this.visibleWeb = false;
      this.visibleGuide = true;
    },
    // 关闭引导弹窗
    closeGuide() {
      this.visibleGuide = false;
    },

    addWebLogin() {
      this.visibleWeb = false;
      this.visibleGuide = true;
    },

    // 触发引导弹窗
    addGuide(deskId) {
      this.deskId = deskId;
      this.showGuide = true;
      this.guideList = [0, 1, 2, 3, 4, 5];
    },
    // 关闭引导弹窗
    closeShowGuide() {
      this.showGuide = false;
    },
  },
  watch: {
    // currentDeskIndex: {
    //   handler() {
    //     this.updateLayout();
    //   },
    // },

    backgroundSettings: {
      handler() {
        document.body.style.setProperty(
          "--backGroundImgBlur",
          this.backgroundSettings.backGroundImgBlur + "px"
        );
        document.body.style.setProperty(
          "--backGroundImgLight",
          this.backgroundSettings.backGroundImgLight
        );
      },
      deep: true,
      immediate: true,
    },
    // "settings.cardMargin": {
    //   handler(newValue) {
    //     this.key = Date.now();
    //     // //$('.muuri-item').css('margin',newValue+'px')
    //     this.updateLayout();
    //   },
    // },
    currentDesk: {
      deep: true,
      handler(val) {
        if (!val.settings) {
          this.cardSettings = this.settings;
          this.cardSwitch = false;
        } else if (val.settings.enableZoom) {
          this.cardSettings = this.currentDesk.settings;
          this.cardSwitch = true;
        } else {
          this.cardSettings = this.settings;
          this.cardSwitch = false;
        }
      },
    },

    beforeUnmount() {
      let cardsHeight = document.getElementById("cardContent")?.offsetHeight;
      this.lastHeight = cardsHeight;
      // console.log("销毁组件",cardsHeight);
    },
  },
};
</script>

<style scoped lang="scss">
:deep(.ant-result-title) {
  color: var(--primary-text);
}

:deep(.ant-result-subtitle) {
  color: var(--secondary-text);
}

.grid {
  position: relative;
  display: inline-block;
  width: 43em;
  border-radius: 4px;
  vertical-align: top;
  left: 0;
  right: 0;
  margin-right: 1em;
}

.btn {
  text-align: center;
}

@media screen and (min-height: 1020px) and (max-height: 1600px) {
  #scrollerBar {
    height: 880px;

    .grid {
      height: 880px;
    }
  }
}

@media screen and (max-height: 1021px) {
  #scrollerBar {
    height: 438px;

    .grid {
      height: 438px;
    }
  }
}

.home-guide {
  background: var(--modal-bg) !important;
}

.desk-title {
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
}

.input {
  width: 452px;
  height: 48px;
  background: var(--secondary-bg);
  border-radius: 12px;
  color: var(--primary-text);
  font-size: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 21px 0 24px;
}

.btn-item {
  height: 48px;
  background: var(--secondary-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 0;
  border-radius: 12px;
  font-size: 16px;
  color: var(--primary-text);
  cursor: pointer;
}
</style>
<style lang="scss">
.home-widgets {
  .muuri-item {
    padding: 0;
  }

  .card {
    position: relative;
    border: 0;
    height: 420px;

    &.small {
      height: 204px;
    }

    &.double {
      width: 572px;
      height: 420px;
    }
  }
}
</style>
<style lang="scss"></style>
