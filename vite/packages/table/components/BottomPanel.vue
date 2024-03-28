<template>
  <xtMixMenu :menus="mainOption" name="name" class="flex max-w-full">
    <!-- xt-main-bottom-bar 定位类不可删 -->

    <!-- 控制中心弹窗 -->
    <div
      class="absolute"
      v-if="controlVisible"
      style="z-index: 888"
      id="control"
      :style="{
        left: `${controlLeft}px`,
        bottom: `${(navAttribute.navSize / 100) * 100}px`,
      }"
    >
      <ControlModal @close="controlVisible = false"></ControlModal>
    </div>

    <AutoHide>
      <div
        @click.stop
        class="flex flex-row items-center justify-center w-full mb-3 xt-main-bottom-bar bottom-panel"
        id="bottom-bar"
        style="text-align: center; position: relative"
        @contextmenu="showMenu"
        v-show="autoVisible"
        :style="{ zoom: `${this.navAttribute.navSize / 100}` }"
      >
        <!-- 快速搜索 底部 用户栏 -->
        <template v-if="!communityNavVisible">
          <UserBar @openControl="openControl"></UserBar>
        </template>

        <!-- 社群导航栏 -->
        <CommunityNav v-else />

        <!-- 快速搜索 底部栏区域 -->
        <Drop @createFile="createFile" currentId="bottom">
          <Dock
            @edit="edit"
            @control="openControl"
            @getDelIcon="getDelIcon"
            ref="dock"
          >
          </Dock>
        </Drop>
        <keep-alive>
          <TaskBox v-if="true"></TaskBox>
        </keep-alive>
        <keep-alive>
          <Favorites v-if="true"></Favorites>
        </keep-alive>
        <Common ref="common"></Common>

        <!-- 社群开关开启后,用户头像信息放底部导航栏右侧 -->
        <UserNavBar v-if="communityNavVisible" @openControl="openControl" />

        <!-- 团队导航弹窗 -->
        <div
          v-if="teamNavVisible"
          class="absolute tuanduidaohang"
          :style="{
            left: `${teamNavLeft}px`,
            bottom: `${(navAttribute.navSize / 100) * 100}px`,
          }"
          style="z-index: 800"
        >
          <TeamNav @close="teamNavVisible = false" @openSet="settingModal"/>
        </div>

        <!-- 加入的社群搜索 -->
        <div
          v-if="comSearchVisible"
          class="absolute"
          :style="{
            left: `${comSearchLeft}px`,
            bottom: `${(navAttribute.navSize / 100) * 100}px`,
          }"
          style="z-index: 600"
        >
          <ComNavSearch @close="comSearchVisible = false"/>
        </div>
      </div>
    </AutoHide>
  </xtMixMenu>

  <transition name="fade">
    <div
      :style="{ zIndex: componentId === 'navigationSetting' ? 100 : 90 }"
      v-if="quick"
    >
      <component :is="componentId" @setQuick="setQuick"></component>
    </div>
  </transition>

  <!-- 应用模式弹窗 -->
  <AppModal />

  <!-- 应用模式中设置弹窗 -->
  <Setting ref="modeSetRef"/>

  <!-- 桌面、导航、分支数据分类弹窗 -->
  <DeskAppModal  ref="deskAppModalRef" />
</template>

<script>
import { taskStore } from "../apps/task/store";
import { appStore } from "../store";
import { navStore } from "../store/nav";
import { useDeskStore } from "../components/desk/store";
import { useNavigationStore } from "./desk/navigationBar/navigationStore";
import { mapWritableState, mapActions } from "pinia";
import { isMain } from "../js/common/screenUtils";
import TeamTip from "./TeamTip.vue";
import { teamStore } from "../store/team";
import { messageStore } from "../store/message";
import { appsStore } from "../store/apps";
import { screenStore } from "../store/screen";
import TaskBox from "../apps/task/page/TaskBox.vue";
import Favorites from "../apps/favorites/page/index.vue";
import navigationData from "../js/data/tableData";
import { offlineStore } from "../js/common/offline";

import {
  moreMenus,
  extraRightMenu,
} from "../components/desk/navigationBar/index";
import { useMergeFolder } from "../components/desk/navigationBar/hook/mergeFolder.ts";
import EditNewNavigation from "./desk/addIcon/EditNewNavigation.vue";
import { useNavBarStore } from "./desk/navigationBar/navBar";
import xtMixMenu from "../ui/new/mixMenu/FunMenu.vue";
import EditIcon from "./desk/navigationBar/components/EditIcon/EditIcon.vue";
import _ from "lodash-es";
import { nanoid } from "nanoid";
import Drop from "./desk/navigationBar/components/folder/Drop.vue";
import { useWindowSize } from "../ui/new/drag/src/hooks/useWindowSize";
import Common from "./desk/navigationBar/components/Common.vue";
import { useElementSize } from "../ui/new/drag/src/hooks/useElementSize";
import ControlModal from "./desk/navigationBar/components/control/ControlModal.vue";
import { hoverRealItemId } from "./desk/navigationBar/hook/hoverRealItemId";
import AutoHide from "./desk/navigationBar/components/folder/AutoHide.vue";
import { mergeData } from "../ui/hooks/useDataConversion";
import UserBar from "./bottomPanel/UserBar.vue";
import Dock from "./bottomPanel/Dock.vue";
import { useFullscreen } from "@vueuse/core";
import UserNavBar from "./bottomPanel/community/UserNavBar.vue";
import CommunityNav from "./bottomPanel/community/CommunityNav.vue";
import TeamNav from "./bottomPanel/community/TeamNav.vue";
import AppModal from "./bottomPanel/community/AppModal.vue";
import { controlStore } from "./desk/navigationBar/hook/controlStore";
import Setting from "./bottomPanel/setting/CommunitySetting.vue";
import ComNavSearch from "./bottomPanel/search/ComNavSearch.vue";
import { communityStore } from "../page/chat/store/communityStore";
import DeskAppModal from "./bottomPanel/desk/DeskAppList.vue";


// 是否全屏状态 切换全屏
const { isFullscreen, toggle } = useFullscreen();

export default {
  name: "BottomPanel",
  emits: ["getDelIcon", "hiedNavBar"],
  components: {
    Dock,
    TeamTip,
    TaskBox,
    EditNewNavigation,
    xtMixMenu,
    EditIcon,
    Drop,
    Common,
    ControlModal,
    AutoHide,
    Favorites,
    UserBar,
    UserNavBar,
    CommunityNav,
    TeamNav,
    AppModal,
    Setting,
    ComNavSearch,
    DeskAppModal,
  },
  data() {
    return {
      dragItem: null,
      hoverIndex: -1, //当前选中的项目（排除gap）
      debug: false,
      tab: "screen",
      quick: false,
      leftNav: false,
      rightNav: false,
      delNav: false,
      drawerMenus: [...extraRightMenu, ...moreMenus],
      componentId: "EditNavigationIcon",
      mainMenus: [
        {
          id: 1,
          newIcon: "fluent:add-16-regular",
          name: "添加导航图标",
          fn: () => {
            this.editNavigation(this.drawerMenus[0]);
          },
        },
        {
          id: 2,
          name: "导航栏设置",
          newIcon: "fluent:settings-16-regular",
          fn: () => {
            this.$bus.emit("openSystemSet");
            setTimeout(() => {
              this.$bus.emit("selectSystemNav", 3);
            }, 10);
          },
        },
        {
          id: 3,
          name: "关闭当前导航",
          newIcon: "fluent:eye-off-16-regular",
          fn: () => {
            this.$emit("hiedNavBar", "foot");
          },
        },
        {
          id: 4,
          name: "清空当前导航栏",
          newIcon: "fluent:circle-off-16-regular",
          fn: () => {
            this.clearAll();
          },
        },
        {
          id: 8,
          name: "更多",
          newIcon: "fluent:more-horizontal-16-filled",
          children: [],
        },
        {
          divider: true,
          id: 12,
        },
        {
          id: 13,
          type: "systemApp",
          newIcon: "fluent:lock-closed-16-regular",
          name: "锁定屏幕",
          event: "lock",
          fn: () => {
            this.$refs.dock.newOpenApp(this.builtInFeatures[0]);
          },
        },
        {
          id: 14,
          type: "systemApp",
          newIcon: "fluent:settings-16-regular",
          name: "基础设置",
          event: "setting",
          fn: () => {
            this.$refs.dock.newOpenApp(this.builtInFeatures[1]);
          },
        },
        {
          id: 15,
          type: "systemApp",
          newIcon: "fluent:full-screen-maximize-16-filled",
          name: "全屏显示",
          event: "fullscreen",
          fn: () => {
            this.$refs.dock.newOpenApp(this.builtInFeatures[2]);
          },
        },
        {
          id: 16,
          type: "systemApp",
          newIcon: "fluent:slide-settings-24-regular",
          name: "设备设置",
          event: "status",
          fn: () => {
            this.$refs.dock.newOpenApp(this.builtInFeatures[3]);
          },
        },
      ],
      // 弹窗显示
      noticeFlag: true,
      addIconFlag: false,
      left: 0,
      parentSize: 0,
      // 控制中心弹窗
      controlVisible: false,
      controlLeft: 100,
      skipSimple: false,
      parentHeight: 0,
      hoverTabs: false,
      delZone: false,
      // 团队导航
      teamNavVisible: false,
      teamNavLeft: 100,
      // 社群搜索
      comSearchVisible: false,
      comSearchLeft: 100,
    };
  },
  props: {},
  unmounted() {
    window.removeEventListener("mousemove", this.listenMouse);
  },
  mounted() {
    this.$bus.on("stopHide", () => {
      this.hoverTabs = true;
    });
    this.$bus.on("startHide", () => {
      this.hoverTabs = false;
    });
    if (!this.bottomInit) {
      navigationData.systemAppList.forEach((item) => {
        this.copyFootNav.forEach((i) => {
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
    // 图标整体替换格式方法
    this.copyFootNav = this.copyFootNav.map((item) => this.mergeData(item));
    if (window.$useEnv(["guest"])) {
      this.copyFootNav = this.copyFootNav.filter((item) => {
        return item.event != "commun";
      });
    }
    this.bottomInit = true;
    //对id进行强制修复
    this.copyFootNav.forEach((item) => {
      if (!item.id) {
        item.id = nanoid(6);
      }
    });
    this.noticeFlag = true;
    this.useWindowSize((size) => {
      // 获取最大可添加图标个数
      const windowWidth = size.width.value;
      const windowHeight = size.height.value;
      this.parentSize = windowWidth;
      this.parentHeight = windowHeight;
      this.maxItemNum = Math.round((windowWidth - 240) / 72);
      const width = windowWidth / (240 + this.copyFootNav.length * 72);
      this.navAttribute.navSize = width.toFixed(2) * 100;
      this.navAttribute.navSize =
        this.navAttribute.navSize < 100 ? this.navAttribute.navSize : 100;
    }, 200);
    window.addEventListener("mousemove", this.listenMouse);
    // 点击团队导航打开团队组件
    this.$bus.on("openTeamNav", (evt) => {
      console.log('打开团队导航的小组件')
      this.openTeamNav = !this.teamNavVisible;
      this.teamNavVisible=!this.teamNavVisible
      this.teamNavLeft = evt.clientX - 274 < 0 ? 0 : evt.clientX - 274;
    });
    // 触发社群搜索弹窗
    this.$bus.on("openComSearch", (evt) => {
      this.$bus.emit("closeModal");
      this.teamNavVisible=false
      this.comSearchVisible = !this.comSearchVisible;
      this.comSearchLeft = evt.clientX - 274 < 0 ? 0 : evt.clientX - 50;
    });
    // 获取社群列表
    this.getMyCommunity();
    // 开启应用模式
    this.$bus.on("openAppSetting", () => {
      this.$refs.modeSetRef.openAppSetting();
    });
    // 开启桌面、导航、分组数据分类弹窗
    this.$bus.on("openDeskAppModal", () => {
      this.$refs.deskAppModalRef.openDeskApp();
    });
  },
  computed: {
    ...mapWritableState(appStore, ["userInfo", "settings", "lvInfo", "simple"]),
    ...mapWritableState(appsStore, ["runningApps", "runningTableApps"]),
    ...mapWritableState(teamStore, ["team", "teamVisible"]),
    ...mapWritableState(screenStore, ["screens"]),
    ...mapWritableState(navStore, [
      "footNavigationList",
      "builtInFeatures",
      "sideNavigationList",
      "rightNavigationList",
      "mainNavigationList",
      "navigationToggle",
      "maxItemNum",
      "init",
      "copyFootNav",
      "copySideNav",
      "copyRightNav",
    ]),
    ...mapWritableState(offlineStore, ["isOffline", "navList"]),
    ...mapWritableState(useNavigationStore, [
      "editToggle",
      "taskBoxVisible",
      "selectNav",
      "bottomToggle",
      "popVisible",
      "currentList",
      "editItem",
      "navAttribute",
      "iconRadius",
      "jumpDesk",
      "customOpenNav",
      "isLeaveBar",
      "isEdge",
      "bottomInit",
      "communityNavVisible",
    ]),
    ...mapWritableState(taskStore, ["isTask", "isTaskDrawer"]),
    ...mapWritableState(useDeskStore, ["isEnterBar"]),

    ...mapWritableState(useNavBarStore, ["isEnterDesk"]),
    ...mapWritableState(controlStore, ["firstNavVisible"]),

    isMain() {
      return isMain();
    },
    childrenMenu() {
      return [
        {
          id: 1,
          name: this.bottomToggle[0] ? "隐藏用户中心" : "显示用户中心",
          newIcon: "fluent:person-16-regular",
          fn: () => {
            this.bottomToggle[0] = !this.bottomToggle[0];
          },
        },
        {
          id: 2,
          name: this.bottomToggle[1] ? "隐藏社区助手" : "显示社区助手",
          newIcon: "fluent:people-community-16-regular",
          fn: () => {
            this.bottomToggle[1] = !this.bottomToggle[1];
          },
        },
        {
          id: 3,
          name: this.bottomToggle[2] ? "隐藏任务中心" : "显示任务中心",
          newIcon: "fluent:task-list-square-16-regular",
          fn: () => {
            (this.bottomToggle[2] = !this.bottomToggle[2]),
              (this.isTask = !this.isTask);
          },
        },
        {
          id: 4,
          name: this.settings.enableChat ? "隐藏社群沟通" : "显示社群沟通",
          newIcon: "fluent:chat-16-regular",
          fn: () => {
            this.settings.enableChat = !this.settings.enableChat;
          },
        },
      ];
    },
    rightMenus() {
      this.mainMenus[4].children = [...this.childrenMenu];
      return this.mainMenus;
    },
    mainOption() {
      const custom = {
        id: 5,
        name: this.customOpenNav ? "关闭自动隐藏" : "开启自动隐藏",
        newIcon: "fluent:eye-off-16-regular",
        fn: () => {
          this.customOpenNav = !this.customOpenNav;
        },
      };
      let arr = [...this.rightMenus, custom];
      return arr.sort((a, b) => a.id - b.id);
    },

    autoVisible() {
      if (this.customOpenNav) {
        if (this.isEdge || this.hoverTabs) {
          return true;
        }
        if (this.isLeaveBar && !this.controlVisible && !this.folderVisible) {
          return false;
        }
        return true;
      } else {
        return this.navigationToggle[2];
      }
    },
  },
  watch: {
    delZone(val) {
      this.delNav = val;
      this.$emit("getDelIcon", val);
    },
    navigationToggle: {
      immediate: true,
      deep: true,
      handler(val) {
        this.leftNav = val[0];
        this.rightNav = val[1];
      },
    },
    simple(newVal, oldVal) {
      if (newVal && !oldVal) {
        // 当 simple 从关闭变为开启时，关闭所有 bottomToggle
        this.bottomToggle[0] = false;
        this.bottomToggle[1] = false;
        this.bottomToggle[2] = false;
      } else if (!newVal && oldVal) {
        // 当 simple 从开启变为关闭时，开启所有 bottomToggle
        if (this.skipSimple) {
          this.bottomToggle[0] = true;
        } else {
          this.bottomToggle[0] = true;
          this.bottomToggle[1] = true;
          this.bottomToggle[2] = true;
        }
      }
    },
    bottomToggle: {
      deep: true,
      handler(newV, oldV) {
        if (
          (this.bottomToggle[0] &&
            this.bottomToggle[1] &&
            this.bottomToggle[2]) ||
          this.bottomToggle[0]
        ) {
          this.simple = false;
          this.skipSimple = true;
        } else if (
          !this.bottomToggle[0] &&
          !this.bottomToggle[1] &&
          !this.bottomToggle[2]
        ) {
          this.simple = true;
        }
      },
    },
    isTask() {
      if (this.isTask) {
        this.bottomToggle[2] = true;
      } else {
        this.bottomToggle[2] = false;
      }
    },
  },
  methods: {
    useElementSize,
    ...mapActions(teamStore, ["updateMy"]),
    ...mapActions(messageStore, ["getMessageIndex"]),
    ...mapActions(appStore, ["toggleFullScreen", "settings"]),
    ...mapActions(navStore, [
      "fixData",
      "setFootNavigationList",
      "sortFootNavigationList",
      "removeFootNavigationList",
    ]),
    ...mapActions(useNavigationStore, ["toggleEdit", "toggleTaskBox"]),
    ...mapActions(communityStore,['getMyCommunity']),
    mergeData,
    listenMouse(e) {
      if (
        e.x < 50 ||
        e.x > this.parentSize - 50 ||
        e.y > this.parentHeight - 50
      ) {
        this.isEdge = true;
      } else {
        setTimeout(() => {
          this.isEdge = false;
        }, 800);
      }
    },
    /**
     * 清空当前导航栏
     */
    clearAll() {
      this.$bus.emit("clearAll", "foot");
    },
    /**
     * 隐藏导航
     */
    hiedNav(value) {
      this.$emit("hiedNavBar", value);
    },
    /**
     * 打开菜单选项
     * @param {*} item
     */
    editNavigation(item) {
      if (item.component) {
        this.componentId = item.component;
        if (item.component === "EditNewNavigation") {
          this.editToggle = true;
          this.selectNav = "foot";
        }
        this.quick = true;
      }
    },
    edit(value) {
      this.componentId = value;
      this.quick = true;
    },
    getDelIcon(value) {
      this.delZone = value;
    },
    /**
     * 关闭弹窗
     */
    setQuick() {
      this.quick = false;
      this.editToggle = false;
    },
    /**
     * 删除图标判断
     * @param {*} currentIndex 当前删除图标索引
     * @param {*} currentItem 当前删除图标
     */
    delCurrentIcon(currentIndex, currentItem) {
      if (!this.mainNavigationList.find(f => f.value === currentItem.value)) {
        this.removeFootNavigationList(currentIndex)
        return
      }
      let arr = []
      if (this.navigationToggle[0] && this.navigationToggle[1]) {
        arr = this.sideNavigationList.concat(this.rightNavigationList)
      } else if (this.navigationToggle[0] && !this.navigationToggle[1]) {
        arr = this.sideNavigationList
      } else if (!this.navigationToggle[0] && this.navigationToggle[1]) {
        arr = this.rightNavigationList
      } else {
        message.info(`导航栏中至少保留一个「${currentItem.name}」`)
        return
      }
      this.delNavigation(arr, currentItem, currentIndex, this.removeFootNavigationList)
    },
    /**
     * 打开桌面应用提示
     * @param {*} item 当前图标
     */
    msgNotice(item) {
      if (item.type === 'tableApp') {
        message.loading({
          content: `打开「${item.name}」...`
          , key: 'tipRun'
        })
      }
    },
    /**
     * 打开应用
     * @param {*} type 图标类型
     * @param {*} value 打开路径
     * @param {*} item 图标详细信息
     */
    async newOpenApp(type, value, item) {
      type !== 'folder' ? this.folderVisible = false : ''
      this.resetElementPosition()
      if(value === 'control' && !this.controlVisible){
        this.controlVisible = true
        return
      }
      if(value === 'commun'){
        this.comVisible = !this.comVisible
        return
      }
      console.log('item :>> ', item);
      // 新版设置打开方式
      if (value === 'setting') {
          this.$bus.emit("openSystemSet")
      }
      if(type === 'folder'){
        this.openFolder(item)
      }
      if (value == 'fullscreen' && window.$useEnv()) {
        toggle()
        return
      }
      if (window.$useEnvLimit('web',value)) return


      if (item) this.msgNotice(item)
      if (value === 'home' && item.home) {
        this.jumpDesk = item.home
      }
      let rs = await startApp(type, value, this.$router)
      if (!rs) {
        message.error({
          content: `打开「${item.name}」失败`
          , key: 'tipRun'
        })
      }
      this.controlVisible = false;
      this.comVisible = false
    },
    completeEdit() {
      this.toggleEdit()
      this.setQuick()
    },
    disableDrag() {
      // if (this.sortable) {
      document.removeEventListener('click', this.disableDrag)
      // this.sortable.destroy()
      this.sortable = null
    },
    /**
     * 解散文件夹和切换文件夹
     * @param {*} item
     * @param {*} index
     */
    resetFolder(item, index) {
      if (item.children.length > 0) {
        if (item.children.length + this.copyFootNav.length > this.maxItemNum) {
          window.$ui.confirm('最多只能添加' + this.maxItemNum + '个', '若继续添加将缩小导航栏', {
            ok: () => {
              this.copyFootNav.splice(index, 1, ...item.children)
            },
            no: () => {
              return this.copyFootNav
            }
          })
        }else{
          this.copyFootNav.splice(index, 1, ...item.children)
        }
        // this.copyFootNav.splice(index, 1, ...item.children)

        if (this.folderId == item.id) {
          this.closeFolder()
        }

      }
    },
    createFile(item, x) {
      const bottom = document.querySelector("#bottomPanel");
      const rect = bottom.getBoundingClientRect();
      const index = Math.round(
        (x.x - rect.x) / ((72 * this.navAttribute.navSize) / 100)
      );
      this.dragItem = null;
      if (this.copyFootNav[this.hoverIndex]?.type === "folder") {
        const merged = this.useMergeFolder(
          this.copyFootNav,
          item,
          this.copyFootNav.find((i) => {
            return (
              i.id === this.hoverRealItemId("bottomContent", this.hoverIndex)
            );
          })
        );
        this.copyFootNav.splice(
          this.copyFootNav.findIndex((i) => {
            return (
              i.id === this.hoverRealItemId("bottomContent", this.hoverIndex)
            );
          }),
          1,
          merged
        );
        this.copyFootNav = this.copyFootNav.filter((i) => {
          return i.id !== item.id;
        });
      } else {
        this.copyFootNav.splice(index, 0, _.cloneDeep(item));
      }
      // 从外部拖拽元素到导航栏，跳过合并提示
      this.hoverIndex = -1;
    },
    hoverRealItemId,
    useWindowSize,
    useMergeFolder,
    //  点击头像框打开控制中心
    openControl(event) {
      // 触发工作台首次进入小红点,进行关闭
      this.firstNavVisible = false;
      this.controlVisible = !this.controlVisible;
      this.controlLeft = event.clientX - 274 < 0 ? 0 : event.clientX - 274;
    },
    // 开启设置
    settingModal(){
      this.$refs.modeSetRef.openAppSetting();
    }
  },
};
</script>

<style lang="scss" scoped>
.bottom-panel {
  :deep(.icon) {
    fill: var(--primary-text);
  }
}

.common-panel {
  margin-bottom: 0;
}

.icon-bg {
  background-color: var(--secondary-transp-bg);
}

.delete-icon {
  width: 14px;
  height: 14px;
  color: #ff4d4f;
  position: absolute;
  top: 5px;
  right: 5px;
}

.btn {
  text-align: center;
  margin-right: 12px;
  border-radius: 12px;
  width: 110px;
  height: 100px;
  padding-top: 16px;
  line-height: 30px;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.status-text {
  font-size: 1.5em;
  line-height: 3em;
  height: 3em;
  width: 6em;
  text-align: center;
}

.bottom-panel .common-panel {
  padding: 0.2em 0.8em 0.2em 0.8em !important;
}

.scroll-content {
  :last-child {
    margin-right: 0;
  }
}

.hover {
  opacity: 0.5;
}
</style>
