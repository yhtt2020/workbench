<template>
  <xtMixMenu :menus="mainOption" name="name" class="flex max-w-full">
    <template #extraMenu>
      <ExtraMenu />
    </template>
    <!-- xt-main-bottom-bar 定位类不可删 -->

    <!-- mac版导航栏 -->
    <template v-if="currentNavFormat === 'mac'">
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
      <AutoHide v-model:isLeaveBar="isFootBar" :autoHideNav="this.state">
        <div
          @click.stop
          class="flex flex-row items-center justify-center w-full mb-3 xt-main-bottom-bar bottom-panel"
          id="bottom-bar"
          style="text-align: center; position: relative"
          @contextmenu="showMenu"
          v-show="autoVisible"
          :style="[
            { zoom: `${this.navAttribute.navSize / 100}` },
            this.state ? this.fixedPosition : '',
          ]"
        >
          <!-- 快速搜索 底部 用户栏 -->
          <template v-if="!communityNavVisible">
            <UserBar
              @openControl="openControl"
              :navSize="navAttribute.navRadius"
            ></UserBar>
          </template>

          <!-- 社群导航栏 -->
          <CommunityNav v-else :boxStyle="'border:1px solid var(--divider); backdropFilter: blur(50px);'" />

          <!-- 快速搜索 底部栏区域 -->
          <Drop @createFile="createFile" currentId="bottom">
            <Dock
              v-model:isOpen="folderVisible"
              @edit="edit"
              @control="openControl"
              @getDelIcon="getDelIcon"
              ref="dock"
              @getHoverIndex="getHoverIndex"
            >
            </Dock>
          </Drop>
          <!-- 社群开关开启后,用户头像信息放底部导航栏右侧 -->
          <UserBar
            v-if="communityNavVisible"
            @openControl="openControl"
            :navSize="navAttribute.navRadius"
          />

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
            <TeamNav @close="teamNavVisible = false" @openSet="settingModal" />
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
            <ComNavSearch @close="comSearchVisible = false" />
          </div>
        </div>
      </AutoHide>
    </template>
    <!-- window版导航栏 -->
    <template v-else>
      <AutoHide
        :enter="enter"
        :leave="leave"
        :autoHideNav="this.state"
        v-model:isLeaveBar="isFootBar"
      >
        <div v-show="autoVisible" :style="[this.state ? this.winPosition : '']">
          <Drop
          @createFile="createFile"
          currentId="bottom"
          >
            <WinPanel
              v-model:folderVisible="folderVisible"
              :mainClass="mainClass"
              @edit="edit"
              @getDelIcon="getDelIcon"
              @control="openControl">
            </WinPanel>
          </Drop>
        </div>
      </AutoHide>
    </template>
      <TaskBox v-if="true"></TaskBox>
      <Favorites v-if="true"></Favorites>
    <Common ref="common"></Common>
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
  <AppModal v-if="currentNavFormat === 'mac'"/>

  <!-- 应用模式中设置弹窗 -->
  <Setting ref="modeSetRef" />

  <!-- 桌面、导航、分支数据分类弹窗 -->
  <DeskAppModal ref="deskAppModalRef" />
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
import TaskBox from "../apps/task/page/TaskBox.vue";
import Favorites from "../apps/favorites/page/index.vue";
import navigationData from "../js/data/tableData";

import {
  moreMenus,
  extraRightMenu,
} from "../components/desk/navigationBar/index";
import { useMergeFolder } from "../components/desk/navigationBar/hook/mergeFolder.ts";
import EditNewNavigation from "./desk/addIcon/EditNewNavigation.vue";
import xtMixMenu from "../ui/new/mixMenu/FunMenu.vue";
import EditIcon from "./desk/navigationBar/components/EditIcon/EditIcon.vue";
import _ from "lodash-es";
import { nanoid } from "nanoid";
import Drop from "./desk/navigationBar/components/folder/Drop.vue";
import Common from "./desk/navigationBar/components/Common.vue";
import { useElementSize } from "../ui/new/drag/src/hooks/useElementSize";
import ControlModal from "../apps/control/page/Control.vue";
import { hoverRealItemId } from "./desk/navigationBar/hook/hoverRealItemId";
import AutoHide from "./desk/navigationBar/components/folder/AutoHide.vue";
import { mergeData } from "../ui/hooks/useDataConversion";
import UserBar from "./bottomPanel/UserBar.vue";
import Dock from "./bottomPanel/Dock.vue";
import CommunityNav from "./bottomPanel/community/CommunityNav.vue";
import TeamNav from "./bottomPanel/community/TeamNav.vue";
import AppModal from "./bottomPanel/community/AppModal.vue";
import { controlStore } from "../apps/control/hooks/controlStore";
import WinPanel from "./windowPanel/WinPanel.vue";
import Setting from "./bottomPanel/setting/CommunitySetting.vue";
import ComNavSearch from "./bottomPanel/search/ComNavSearch.vue";
import { chatCommunityStore } from "../apps/chat/store/chatCommunity";
import DeskAppModal from "./bottomPanel/desk/DeskAppList.vue";
import { startApp } from "../ui/hooks/useStartApp";

import { useGlobalStore } from "../apps/global/store";

import mainMin from './windowPanel/hook/mainMenu'
import ExtraMenu from './windowPanel/components/ExtraMenu.vue';

export default {
  name: "BottomPanel",
  emits: ["getDelIcon", "hiedNavBar"],
  mixins: [mainMin],
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
    CommunityNav,
    TeamNav,
    AppModal,
    WinPanel,
    Setting,
    ComNavSearch,
    DeskAppModal,
    ExtraMenu
  },
  data() {
    return {
      canResize:false,//解锁底部导航栏自动调节尺寸
      isFootBar:false,
      fixedPosition:'position:fixed;bottom:0px;z-index:9;',
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
      // 弹窗显示
      noticeFlag: true,
      addIconFlag: false,
      // 弹出框x位置
      left: 0,
      // 控制中心弹窗
      controlVisible: false,
      controlLeft: 100,
      skipSimple: false,
      hoverTabs: false,
      // 删除导航区域显示
      delZone: false,
      // 团队导航
      teamNavVisible: false,
      teamNavLeft: 100,
      // 社群搜索
      comSearchVisible: false,
      comSearchLeft: 100,

      // 文件夹打开状态
      folderVisible: false,

      sortId:'foot',
    };
  },
  props: {
    mainClass: {
      type: String,
      default: () => "",
    },
    enter: {
      type: String,
      default: () => "",
    },
    leave: {
      type: String,
      default: () => "",
    },
    winPosition: {
      type: String,
      default: () => "",
    },
  },
  unmounted() {
    window.removeEventListener("mousemove", this.listenMouse);
  },
  mounted() {
    // setTimeout(()=>{
    //   this.canResize=true
    // },5000)
    // 当自动隐藏时，切换桌面时，关闭自动隐藏
    this.$bus.on("stopHide", () => {
      this.hoverTabs = true;
    });
    // 当自动隐藏时，切换桌面时，关闭自动隐藏
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

    window.addEventListener("mousemove", this.listenMouse);
    // 点击团队导航打开团队组件
    this.$bus.on("openTeamNav", (evt) => {
      console.log("打开团队导航的小组件");
      this.openTeamNav = !this.teamNavVisible;
      this.teamNavVisible = !this.teamNavVisible;
      this.teamNavLeft = evt.clientX - 274 < 0 ? 0 : evt.clientX - 274;
    });
    // 触发社群搜索弹窗
    this.$bus.on("openComSearch", (evt) => {
      this.$bus.emit("closeModal");
      this.teamNavVisible = false;
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
    ...mapWritableState(appStore, [ "settings", "simple"]),
    ...mapWritableState(teamStore, ["team"]),
    ...mapWritableState(navStore, [
      "builtInFeatures",
      "navigationToggle",
      "maxItemNum",
      "init",
      "copyFootNav",
    ]),
    ...mapWritableState(useNavigationStore, [
      "selectNav",
      "bottomToggle",
      "navAttribute",
      "autoHideNav",
      "isLeaveBar",
      "isEdge",
      "bottomInit",
      "communityNavVisible",
      "currentNavFormat",
      "currentNavPosition",
    ]),
    ...mapWritableState(taskStore, ["isTask"]),
    ...mapWritableState(useDeskStore, ["isEnterBar"]),
    ...mapWritableState(controlStore, ["firstNavVisible"]),
    ...mapWritableState(useGlobalStore, ["windowWidth", "windowHeight"]),
    // 判断当前导航栏格式，来确定图标大小
    realSize() {
      return this.currentNavFormat === "mac" ? 72 : 60;
    },

    isMain() {
      return isMain();
    },
    rightMenus() {
      this.mainMenus[4].children = [...this.childrenMenu];
      return this.mainMenus;
    },
    // 自动隐藏状态
    state() {
      return this.autoHideNav.foot.state;
    },
    mainOption() {
      const custom = {
        id: 5,
        name: this.state ? "关闭自动隐藏" : "开启自动隐藏",
        newIcon: "fluent:eye-off-16-regular",
        fn: () => {
          this.autoHideNav.foot.state = !this.autoHideNav.foot.state;
        },
      };
      let arr = [...this.rightMenus, custom];
      return arr.sort((a, b) => a.id - b.id);
    },
    // 自动隐藏
    autoVisible() {
      if (this.state) {
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
    windowWidth:{
      handler(val){
        if(!this.canResize){
          return
        }
        // 当底部导航栏不存在时，不需要缩放
        if(!this.navigationToggle[2]) return
        // 根据当前导航格式计算最大宽度和额外宽度
        let macWidth = this.communityNavVisible ? val - 540 : val - 200;
        let macExtraWidth = this.communityNavVisible ? 540 : 200;
        let maxWidth = this.currentNavFormat === 'mac' ? macWidth : val * 0.6;
        let extraWidth = this.currentNavFormat === 'mac' ? macExtraWidth : val * 0.3;

        this.maxItemNum = Math.floor(maxWidth / this.realSize);
        // 计算导航栏缩放比例
        const scale =
          val/  (extraWidth + this.copyFootNav.length * this.realSize) ;
        //加上原尺寸，防止尺寸缩放丢失
        this.navAttribute.navSize = Math.min(this.navAttribute.navSize ,100, Math.round(scale * 100));
      },
      immediate: true
    },
    // 自动隐藏状态下，鼠标是否在导航栏区域
    isLeaveBar(val) {
      this.isFootBar = val;
    },
    // 删除区域显示
    delZone(val) {
      this.delNav = val;
      this.$emit("getDelIcon", val);
    },
    //
    navigationToggle: {
      immediate: true,
      deep: true,
      handler(val) {
        this.leftNav = val[0];
        this.rightNav = val[1];
      },
    },
    // 极简模式状态以及用户中心和社区以及任务间
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
    // 任务弹窗显示与隐藏与导航栏选择同步
    isTask(newV) {
      this.bottomToggle[2] = newV;
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
    ...mapActions(chatCommunityStore, ["getMyCommunity"]),
    mergeData,
    // 监听鼠标位置
    listenMouse(e) {
      // 导航栏位置不同，判断条件不同
      const tag =
        this.currentNavPosition === "top"
          ? e.y < 50
          : e.y > window.innerHeight - 50;
      if (tag) {
        this.isEdge = true;
      } else {
        setTimeout(() => {
          this.isEdge = false;
        }, 800);
      }
    },
    // 获取当前停留的图标索引
    getHoverIndex(val) {
      this.hoverIndex = val;
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
    editNav(item) {
      if (item.component) {
        this.componentId = item.component;
        if (item.component === "EditNewNavigation") {
          this.selectNav = "foot";
        }
        this.quick = true;
      }
    },
    // 打开图标编辑
    edit(value) {
      this.componentId = value;
      this.quick = true;
    },
    // 更新删除区域状态
    getDelIcon(value) {
      this.delZone = value;
    },
    /**
     * 关闭弹窗
     */
    setQuick() {
      this.quick = false;
    },
    /**
     * 打开应用 -- 简化版
     * @param {*} type 图标类型
     * @param {*} value 打开路径
     * @param {*} item 图标详细信息
     */
    async newOpenApp(item) {
      const { type, value } = item;
      // console.log("item :>> ", type, value);
      let rs = await startApp(type, value, this.$router);
      if (!rs) {
        message.error({
          content: `打开「${item.name}」失败`,
          key: "tipRun",
        });
      }
    },
    // 图标拖入导航栏，创建图标并添加到导航栏
    createFile(item, x) {
      const bottom = document.querySelector("#bottomPanel");
      const rect = bottom.getBoundingClientRect();
      const index = Math.round(
        (x.x - rect.x) / ((this.realSize * this.navAttribute.navSize) / 100)
      );
      console.log(index, x.x, rect.x, rect.width);
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
    useMergeFolder,
    //  点击头像框打开控制中心
    openControl(event) {
      // 触发工作台首次进入小红点,进行关闭
      this.firstNavVisible = false;
      this.controlVisible = !this.controlVisible;
      this.controlLeft = event.clientX - 274 < 0 ? 0 : event.clientX - 274;
    },
    // 开启设置
    settingModal() {
      this.$refs.modeSetRef.openAppSetting();
    },
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
