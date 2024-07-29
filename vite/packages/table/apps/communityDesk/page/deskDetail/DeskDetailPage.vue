<template>
  <div class="relative flex flex-col h-full">
    <xt-mix-menu class="w-full h-full" :menus="deskMenu" ref="mixMenu">
      <!-- 导航栏 -->
      <template #extraMenu>
        <ExtraMenu />
      </template>

      <!-- 桌面组件加载 -->
      <Desk
        v-if="currentDesk && currentDesk?.cards?.length > 0"
        :global-settings="settings"
        :editing="editing"
        ref="currentDeskRef"
        :currentDesk="currentDesk"
        v-model:settings="currentDesk.settings"
        :key="currentDeskId"
        :keepAddIcon="keepAddIcon"
        @changeEditing="
          () => {
            editing = !editing;
            this.editSync();
          }
        "
        @onArrange="onArrange"
        :communityInfo="communityInfo"
      >
        拿菜单数据
        <template #settingsAllAfter>
          <slot name="settingsAll"></slot>
        </template>
      </Desk>

      <!-- 空状态 -->
      <template v-else>
        <!-- 管理员 -->
        <template v-if="deskAuth">
          <slot name="empty">
            <div class="flex items-center justify-center w-full h-full">
              <div class="panel-top xt-bg">
                <!-- 社群基础信息 -->
                <AdminEmpty :comInfo="communityInfo" />

                <!-- 添加按钮 -->
                <DeskAddButton :buttonList="addButtonList" />

                <!-- 标题描述 -->
                <div class="line-title xt-text" style="margin-top: 20px">
                  使用推荐桌面方案
                </div>

                <!-- 推荐桌面 -->
                <vue-custom-scrollbar
                  :scrollbarSettings="scrollbarSettings"
                  class="mt-4"
                  style="width: 100%; height: 315px"
                >
                  <DeskMarket
                    :wrapperStyle="{
                      height: '100%',
                      flexWrap: 'nowrap',
                      overflow: 'visible',
                      width: 'auto',
                    }"
                    :desks="deskList"
                    :items="recommendList"
                    deskItemStyle="width:327px; height:290px"
                    :closeParent="true"
                    :communityInfo="communityInfo"
                    :addDesk="false"
                    @openPreview="openPreview"
                  />
                </vue-custom-scrollbar>
              </div>
            </div>
          </slot>
        </template>

        <template v-else-if="deskMember">
          <slot name="empty">
            <div class="flex items-center justify-center w-full h-full">
              <NoAdminEmpty />
            </div>
          </slot>
        </template>

        <!-- 隐藏的桌面页面 -->
        <span v-show="false">
          <Desk
            v-if="deskAuth"
            ref="currentDeskRef"
            :editing="editing"
            :key="key"
            :currentDesk="currentDesk"
            :communityInfo="communityInfo"
          />
        </span>
      </template>
    </xt-mix-menu>

    <DeskTabUI
      v-if="displayDesks.length > 0"
      :showTopBar="showTopBar"
      :fullScreen="fullScreen"
      :communityInfo="communityInfo"
      :tabList="displayDesks"
      :showTabs="showTabs"
      :currentDeskId="currentDeskId"
      @tabDeskId="setCurrentDeskId"
    />
  </div>

  <!-- 添加桌面弹窗式 -->
  <xt-modal
    v-model="addDeskVisible"
    v-if="addDeskVisible"
    :mask="false"
    :index="100"
    :header="true"
    :footer="false"
  >
    <div style="width: 800px; height: 518px">
      <div class="font-semibold text-center font-16 xt-text">添加桌面</div>
      <div class="flex justify-center mt-6">
        <xt-button
          :w="145"
          :h="40"
          @click="doAddDesk('空白桌面')"
          class="ml-3 xt-bg-2"
          key="console"
          type="primary"
        >
          <div class="flex">
            <xt-new-icon
              class="mr-2"
              size="20"
              icon="fluent:desktop-16-regular"
            />
            创建空白桌面
          </div>
        </xt-button>
        <xt-button
          :w="145"
          :h="40"
          @click="importDesk"
          class="ml-3 xt-bg-2"
          key="console"
          type="primary"
        >
          <div class="flex">
            <xt-new-icon
              class="mr-2"
              size="20"
              icon="fluent:arrow-download-20-filled"
            />
            导入桌面文件
          </div>
        </xt-button>
      </div>

      <div class="mt-6 font-semibold text-center font-16 xt-text">
        推荐桌面方案
      </div>

      <div class="mt-4 text-center font-16 xt-text-2">
        你可以选择以下来自桌面市场的方案。<a @click="moreDesk">更多桌面</a>
      </div>

      <div class="mt-4">
        <DeskMarket
          :desks="deskList"
          :items="recommendList"
          :closeParent="true"
          deskItemStyle="width:317px; height:284px;"
          @openPreview="openPreview"
        />
      </div>
    </div>
  </xt-modal>

  <!-- 所有桌面列表 -->
  <a-drawer
    height="220"
    placement="bottom"
    v-model:visible="allDeskListVisible"
  >
    <AllDeskList
      :items="deskList"
      :activeId="currentDeskId"
      @valueChanged="
        (event) => {
          setCurrentDeskId(event.id);
          this.allDeskListVisible = false;
        }
      "
    />
  </a-drawer>

  <!-- 推荐桌面预览 -->
  <div style="z-index: 10001">
    <DeskPreview
      @afterAdded="afterAdded"
      :deskList="deskList"
      :scheme="scheme"
      :addDesk="addDesk"
      :showModal="showModal"
      :communityInfo="communityInfo"
      @closePreview="closePreview"
      @closeGroup="closeGroup"
    />
  </div>

  <!-- 添加卡片 -->
  <div
    class=""
    style="position: fixed; top: 0; right: 0; left: 0; bottom: 0; z-index: 999"
    v-if="deskMarketVisible"
  >
    <NewAddCard
      v-if="deskMarketVisible"
      :deskList="deskList"
      @onClose="hideMarket"
      :desk="currentDesk"
      :panelIndex="panelIndex"
      :communityInfo="communityInfo"
    />
  </div>

  <!-- 分享桌面 -->
  <ShareDesk
    :deskList="deskList"
    ref="shareDeskRef"
    :deskRef="$refs.currentDeskRef"
    :openDrawer="shareDeskVisible"
    @closeShare="closeShare"
  />

  <!-- 导出桌面 -->
  <ExportDesk
    :openModal="exportModal"
    @closeExport="closeExport"
    :layoutSize="layoutSize"
    :desks="deskList"
  />

  <!-- 文件输入框 -->
  <input style="display: none" ref="fileRef" type="file" />
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import _ from "lodash-es";
import { nanoid } from "nanoid";
import { message, Modal, notification } from "ant-design-vue";

// page文件
import Desk from "../../../../components/desk/Desk.vue";
import ExtraMenu from "../../../../components/windowPanel/components/ExtraMenu.vue";
import AdminEmpty from "../empty/AdminEmpty.vue";
import NoAdminEmpty from "../empty/NonAdminEmpty.vue";
import DeskAddButton from "../../components/DeskAddButton.vue";
import DeskMarket from "../../../../page/app/card/DeskMarket.vue";
import AllDeskList from "../../../../components/desk/AllDeskList.vue";
import DeskTabUI from "./DeskTabUI.vue";
import NewAddCard from "../../../../page/app/card/NewAddCard.vue";
import ShareDesk from "../../../../components/desk/ShareDesk.vue";
import ExportDesk from "../../../../components/desk/ExportDesk.vue";
import DeskPreview from "../../../../components/desk/DeskPreview.vue";
import VueCustomScrollbar from "../../../../../../src/components/vue-scrollbar.vue";
import Icon from "../../../../components/Icon.vue";
import HorizontalPanel from "../../../../components/HorizontalPanel.vue";

// store文件
import { useNavigationStore } from "../../../../components/desk/navigationBar/navigationStore";
import { appStore } from "../../../../store";
import { taskStore } from "../../../task/store";
import { deskStore } from "../../../../store/desk";
import { marketStore } from "../../../../store/market";
import { useDeskStore } from "../../../../components/desk/store";
import { useFreeLayoutStore } from "../../../../components/desk/freeLayout/store";
import { useFloatMenuStore } from "../../../../components/desk/floatMenu/store";
import { communityDeskStore } from "../../store/communityDeskStore";
import { communityNavStore } from "../../../../components/bottomPanel/store/communityNavStore";

// 其他文件
import menuMinis from "../../hooks/communityMenu";
import { completeTask } from "../../../task/task";
import {
  communityAuth,
  isArrayEqual,
  communityMember,
} from "../../hooks/deskCreateMethod";
import { disabledCard } from "../../store/desktopOtherData";

export default {
  name: "DeskDetailPage",

  props: {
    // 桌面设置
    settings: {
      type: Object,
      default: {},
    },
    // 桌面列表
    deskList: {
      type: Array,
      default: [],
    },
    //是否显示tabs
    showTabs: {
      type: Boolean,
      default: true,
    },
    //是否显示顶部栏
    showTopBar: {
      type: Boolean,
      default: true,
    },
    //是否显示工具栏
    showTools: {
      type: Boolean,
      default: true,
    },
    // 当前桌面id
    currentDeskId: {
      type: String,
    },
  },

  components: {
    Desk,
    ExtraMenu,
    AdminEmpty,
    NoAdminEmpty,
    DeskAddButton,
    VueCustomScrollbar,
    Icon,
    HorizontalPanel,
    DeskPreview,
    ExportDesk,
    DeskMarket,
    AllDeskList,
    DeskTabUI,
    NewAddCard,
    ShareDesk,
  },

  mixins: [menuMinis],

  data() {
    return {
      // 滚动条配置
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
        currentItemId: -1,
      },
      // 当前添加tab类型
      currentAddTab: { name: "market" },
      // 隐藏桌面组件参数
      comHide: true,
      // 唯一key
      key: Date.now(),
      // 显示更多桌面
      moreDesksVisible: false,
      // 所有桌面
      allDeskListVisible: false,
      // 编辑桌面
      editing: false,
      // 添加桌面
      addDeskVisible: false,
      // 分享桌面
      shareDeskVisible: false,
      // 桌面类型
      deskType: [
        { title: "日常桌面", name: "daily" },
        { title: "游戏桌面", name: "game" },
        { title: "办公桌面", name: "work" },
        { title: "空白桌面", name: "empty" },
      ],
      // 当前选中桌面
      selectDesk: { title: "日常桌面", name: "daily" },
      // 桌面标题
      deskTitle: "",
      // 热门桌面
      hotDesk: [],
      scheme: {},
      showModal: false,
      deskCode: "",
      shareCode: false,
      // 导出弹窗
      exportModal: false,
      // 自由布局
      layoutSize: { width: 0, height: 0 },
      // 桌面市场
      deskMarketVisible: false,
      panelIndex: 0,
      // 当前添加桌面来源
      currentAddMethod: [
        { title: "从市场添加", name: "market" },
        { title: "自行添加", name: "custom" },
      ],
      // 推荐桌面
      recommendList: [],
      // 保持添加图标
      keepAddIcon: false,
      // 空状态添加按钮列表
      addButtonList: [
        {
          newIcon: "fluent:add-16-filled",
          name: "添加图标",
          fn: this.addIcon,
        },
        {
          newIcon: "fluent:collections-add-24-filled",
          name: "添加组件",
          fn: this.newAddCard,
        },
        {
          newIcon: "fluent:building-shop-16-filled",
          name: "桌面市场",
          fn: this.moreDesk,
        },
        {
          newIcon: "fluent:arrow-download-20-filled",
          name: "导入桌面",
          fn: this.importDesk,
        },
        {
          newIcon: "fluent:add-16-filled",
          name: "添加已有桌面",
          fn: () => {
            this.$bus.emit("openExistDeskListModal");
          },
        },
      ],
      loadingVisible: true,
      // 接收定时器临时变量
      loadTime: null,
      // 是否开启右键菜单弹窗
      showRightMenu: false,
      // 社群桌面禁用的组件
      disabledCard,
      // 用于桌面编辑弹窗关闭时做编比较处理
      // originalCards:[],
    };
  },

  computed: {
    ...mapWritableState(deskStore, ["apiList"]),
    ...mapWritableState(taskStore, ["taskID", "step", "taskTmp"]),
    ...mapWritableState(useDeskStore, ["menus"]),
    ...mapWritableState(useDeskStore, ["menus"]),
    ...mapWritableState(communityNavStore, ["currentCommunity"]),
    ...mapWritableState(appStore, [
      "fullScreen",
      "showGuide",
      "guideList",
      "windowFullScreen",
    ]),
    ...mapWritableState(useFreeLayoutStore, [
      "freeLayoutData",
      "freeLayoutState",
      "getFreeLayoutState",
      "getFreeLayoutData",
      "isFreeLayout",
    ]),
    ...mapWritableState(useNavigationStore, [
      "targetDesk",
      "selectNav",
      "jumpDesk",
    ]),
    ...mapWritableState(communityDeskStore, [
      "loadDeskAll",
      "setting",
      "loadDesk",
    ]),

    // 社群信息
    communityInfo() {
      return this.currentCommunity?.item;
    },

    /**
     * 社群桌面角色
     * deskMember 成员
     * deskAuth 管理员
     * **/
    deskAuth() {
      return this.communityAuth(this.communityInfo?.no);
    },
    deskMember() {
      return this.communityMember(this.communityInfo?.no);
    },

    // 右键下拉菜单
    deskMenu() {
      if (this.deskAuth) return this.communityMenus;
      if (this.deskMember) return this.memberMenus;
    },

    // 过滤出当前社群名下所有桌面的列表
    communityDeskList() {
      // 管理员
      if (this.deskAuth) {
        const filterList = _.filter(this.deskList, (desk) => {
          return desk.hasOwnProperty("communityNo");
        });
        const newArr = _.filter(filterList, (desk) => {
          return Number(this.communityInfo.no) === Number(desk.communityNo);
        });
        return newArr;
      }

      // 成员情况
      else if (this.deskMember) {
        // 做容错处理  根据当前社群编号来获取从云端度后放入本地的所有社群桌面数据
        if (!this.loadDeskAll[this.communityInfo.no]) return [];
        return this.loadDeskAll[this.communityInfo.no];
      }
    },

    // 桌面置顶数据
    displayDesks() {
      const deskLists = [
        ...this.communityDeskList?.filter((desk) => {
          return desk?.pin;
        }),
        ...this.communityDeskList?.filter((desk) => {
          return !desk.pin;
        }),
      ].slice(0, 4);
      const topArr = deskLists.sort((a, b) => {
        if (b.pin) {
          //置顶的桌面排最前面
          return 9999999999999;
        }
        return Number(b.order || 0) - Number(a.order || 0);
      });
      return topArr;
    },

    // 当前桌面
    currentDesk() {
      // 默认桌面初始数据
      const option = {
        cards: [],
        layoutSize: {},
        id: "",
        name: "",
        settings: {
          cardMargin: 0,
          cardZoom: 100,
          marginTop: 0,
          vDirection: false,
        },
      };
      if (this.deskAuth) {
        let deskItem = this.deskList.find((desk) => {
          if (desk.hasOwnProperty("communityNo")) {
            if (Number(this.communityInfo?.no) === Number(desk?.communityNo)) {
              return String(desk.id) === String(this.currentDeskId);
            }
          }
        });
        if (deskItem !== undefined) {
          if (this.communityInfo.role === "member") {
            // 是处理社群成员桌面时获取云端的数据进行自由布局的同步
            if (deskItem?.freeLayoutData && deskItem?.freeLayoutState) {
              this.setFreeLayoutData(deskItem?.id, deskItem?.freeLayoutData);
              this.setFreeLayoutState(deskItem?.id, deskItem?.freeLayoutState);
            }
          }
          this.key = Date.now();
          return deskItem;
        } else {
          return option;
        }
      }

      // 成员情况
      else if (this.deskMember) {
        if(!this.currentDeskId){
          //未设置当前桌面id
          return option
        }
        if (
          !this.loadDesk[this.communityInfo?.no] &&
          !this.currentDeskId &&
          !this.loadDesk[this.communityInfo?.no][this.currentDeskId]
        ){
          return option;
        }
        else {
          return this.loadDesk[this.communityInfo?.no][this.currentDeskId];
        }
      }
    },
  },

  mounted() {
    // 通过事件总线程触发
    this.$bus.on("M0104", () => {
      this.currentAddTab.name = "custom";
      this.addDeskVisible = true;
    });
    this.$bus.on("M0203", () => {
      this.addDeskVisible = true;
      this.moreDesk();
    });
    this.$bus.on("updateSync", () => {
      this.syncSaveCommunity();
    });
    // 获取推荐桌面数据
    this.hotDesk.push(this.apiList[0].children[0]);
    this.getRecommend({ goodType: "desk" }).then((rs) => {
      this.recommendList = rs;
    });
    // 根据桌面id默认显示当前桌面
    if (this.deskList.length > 0) {
      // this.currentDesk = this.deskList[0];
    }
    this.deskList.forEach((desk) => {
      if (!desk.id) {
        desk.id = desk.nanoid;
      }
    });
    // 成员情况下进行云端数据初始化加载
    if (this.deskMember) {
      this.loadCommunityCloud();
      // this.setCurrentDefaultDesk();
    }
    // 默认触发
    // this.setCurrentDefaultDesk();
    // 获取旧的数据
    // this.originalCards = [...this.currentDesk?.cards];
  },

  methods: {
    ...mapActions(marketStore, ["getRecommend"]),
    ...mapActions(useDeskStore, ["addMenu"]),
    ...mapActions(appStore, ["toggleFullScreen"]),
    ...mapActions(useFreeLayoutStore, [
      "clearFreeLayout",
      "setFreeLayoutData",
      "setFreeLayoutState",
    ]),
    ...mapActions(communityDeskStore, [
      "setCommunityDesktopData",
      "uploadCommunityAllDesktop",
      "uploadCommunityCurrentDesktop",
      "downloadCommunityAllDesktop",
      "downloadCommunityCurrentDesktop",
    ]),
    communityAuth,
    isArrayEqual,
    communityMember,

    // 设置桌面id的切换方法
    setCurrentDeskId(id) {
      this.$emit("updateCurrentDesk", id);
    },

    // 点击桌面
    clickDesk() {
      this.step = -1;
      this.taskID = this.taskTmp;
      this.taskTmp = "";
    },

    // 添加新桌面
    doAddDesk(deskName) {
      this.$emit("add", deskName);
      this.key = Date.now();
      this.addDeskVisible = false;
      this.syncSaveCommunity();
    },

    // 删除桌面
    delDesk() {
      // 当前桌面的卡片数据进行删除
      this.currentDesk?.cards?.forEach((item) => {
        //移除桌面相关的便签卡片
        if (item.name === "notes" && !this.$usePlat()) {
          tsbApi.db
            .find({
              selector: {
                _id: "note:" + item.id,
              },
            })
            .then((res) => {
              if (res?.docs.length) {
                tsbApi.db.put({
                  ...res.docs[0],
                  deskId: "",
                  deskName: "",
                });
              }
            });
        }
      });
      window.$ui.confirm("删除当前桌面？此操作不可还原。", "", {
        ok: () => {
          if (this.communityDeskList.length === 1) {
            const index = this.deskList.findIndex((desk) => {
              return String(desk?.id) === String(this.currentDesk?.id);
            });
            this.deskList.splice(index, 1);
            // 默认创建一个空白桌面
            this.doAddDesk("空白桌面");
          } else {
            const index = this.deskList.findIndex((desk) => {
              return String(desk?.id) === String(this.currentDesk?.id);
            });
            // console.log('index',index);
            this.deskList.splice(index, 1);
          }
          this.$emit("updateCurrentDesk", this.communityDeskList[0]?.id);
          this.clearFreeLayout(this.currentDeskId);
          // 删除桌面数据
          this.key = Date.now();
          this.syncSaveCommunity();
        },
        type: "warning",
        okText: "删除桌面",
        okButtonWidth: "100",
      });
    },

    // 编辑操作
    startEdit() {
      this.key = Date.now();
      this.editing = true;
      this.$refs.currentDeskRef.update();
    },
    stopEdit() {
      this.key = Date.now();
      this.editing = false;
    },

    // 数据同步云端
    syncSaveCommunity() {
      setTimeout(() => {
        this.setCommunityDesktopData(
          this.communityInfo.no,
          this.currentDesk,
          this.communityDeskList,
          {
            freeLayoutData: this.getFreeLayoutData,
            freeLayoutState: this.getFreeLayoutState,
          }
        );
        this.uploadCommunityAllDesktop(this.communityInfo.no, 0);
        this.uploadCommunityCurrentDesktop(
          this.communityInfo.no,
          this.currentDesk?.id,
          0
        );
      }, 100);
    },

    // 获取云端同步数据
    loadCommunityCloud() {
      this.downloadCommunityAllDesktop(this.communityInfo.no);
      this.downloadCommunityCurrentDesktop(
        this.communityInfo.no,
        this.currentDesk?.id
      );
    },

    // 设置当前桌面的默认状态
    setCurrentDefaultDesk() {
      this.$nextTick(() => {
        if (this.currentDeskId === undefined) {
          this.setCurrentDeskId(this.communityDeskList[0]?.id);
        }
      });
    },

    //  图标整理
    onArrange() {
      this.guideList = [1];
      this.showGuide = true;
    },
    // 关闭桌面引导
    closeShowGuide() {
      this.showGuide = false;
    },

    //  更新
    update() {
      this.$refs.currentDeskRef.update();
    },
    learn() {
      this.$refs.currentDeskRef.learn();
    },

    // 推荐桌面
    openPreview({ scheme, showModal, addDesk }) {
      this.scheme = scheme;
      this.showModal = showModal;
      this.addDesk = addDesk;
    },
    // 关闭预览
    closePreview() {
      this.showModal = false;
    },

    // 推荐桌面预览的回调函数
    afterAdded() {
      completeTask("m0203");
      this.hideMarket();
    },

    // 关闭分组
    closeGroup() {
      this.addDeskVisible = false;
    },

    // 隐藏桌面市场
    hideMarket() {
      this.deskMarketVisible = false;
    },

    // 添加图标
    addIcon() {
      this.$refs.currentDeskRef.newAddIcon();
      this.keepAddIcon = true;
    },

    // 添加组件
    newAddCard() {
      this.$refs.currentDeskRef.newAddCard();
      this.keepAddIcon = false;
    },

    // 导入桌面
    async importDesk() {
      let that = this;
      this.$bus.emit("openFile", (file) => {
        const reader = new FileReader();
        reader.onload = function (event) {
          that.readConfig(event.target.result);
        };
        reader.readAsText(file);
      });
      return;
      // let fileRef = this.$refs.fileRef;
      // fileRef.click();
      // // let that = this;
      // fileRef.onchange = function (event) {
      //   if (this.files.length === 0) return;
      //   const file = this.files[0];
      //   const reader = new FileReader();
      //   reader.onload = function (event) {
      //     that.readConfig(event.target.result);
      //   };
      //   // 开始读取文件，读取完成后会触发 onload 事件
      //   reader.readAsText(file); // 如果是二进制文件，可以使用 reader.readAsArrayBuffer(file) 或者 reader.readAsDataURL(file)
      // };
    },

    // 读取文件配置
    async readConfig(file) {
      let needImportDesk;

      // 导出桌面数据文件是json结尾的通过JSON.parse(file)转换得到一个字符串类型的数据时,需要使用json转换两次即可
      if (typeof JSON.parse(file) === "string") {
        needImportDesk = JSON.parse(JSON.parse(file));
      }
      // 导出桌面数据文件是desk结尾的通过JSON.parse(file)转换得到一个对象类型的数据时,需要使用json转换一次即可
      else if (typeof JSON.parse(file) === "object") {
        needImportDesk = JSON.parse(file);
      }

      const { desk, freeLayoutData, freeLayoutState } = needImportDesk;
      let cardsHeight = document.getElementById("cardContent")?.offsetHeight;

      desk.forEach((g) => {
        let oldId = g.id;
        //修正一下老版本导出的数据
        if (g.cardsHeight) {
          g.deskHeight = g.cardsHeight;
        }
        if (g.settings.cardZoom) {
          g.settings.zoom = g.settings.cardZoom;
        }
        let cardZoom = (
          (g.settings.zoom * cardsHeight) /
          g.deskHeight
        ).toFixed();
        g.icon = "desktop";
        g.settings.zoom = parseInt(cardZoom);
        g.id = `${this.communityInfo?.no}${nanoid(8)}`;
        g.communityNo = this.communityInfo?.no;

        /**
         * 当前是社群管理员桌面场景的需求
         * -- 需要将本地window图标进行过滤剔除
         * -- 需要将社群桌面中不能使用的组件进行过滤剔除
         *
         * **/
        const newCards = g?.cards?.filter((card) => {
          if (card?.name === "myIcons") {
            const newIconList = _.filter(
              card?.customData?.iconList,
              (iconItem) => {
                return iconItem?.open?.type !== "tableApp";
              }
            );
            // 过滤出本地window图标,后重新更新数据
            if (newIconList.length !== 0) {
              return card;
            }
          } else if (this.disabledCard.includes(card?.name) === false) {
            return card;
          }
        });

        // console.log('查看newCards',newCards);

        // 将卡片数据进行过滤后,重新进行赋值
        g.cards = newCards;

        g?.cards?.forEach((item, index) => {
          //移除桌面相关的便签卡片
          if (item.name === "notes" && !this.$usePlat()) {
            const now = new Date().getTime();
            const obj = {
              ...item,
              id: now,
              _id: "note:" + now,
              createTime: now,
              updateTime: now,
              isDelete: false,
              deskId: g.id,
              deskName: g.name,
            };
            if (!this.$usePlat()) {
              tsbApi.db.put(obj);
            }
            g.cards[index] = obj;
          }
        });

        if (freeLayoutState[oldId]) {
          this.freeLayoutData[g.id] = freeLayoutData[oldId];
          this.freeLayoutState[g.id] = freeLayoutState[oldId];
        }
        this.deskList.unshift(g);
      });

      this.addDeskVisible = false;
      message.success("为您成功导入" + desk.length + "个桌面。");
      this.setCurrentDeskId(needImportDesk.desk[0].id);
      this.syncSaveCommunity();
    },

    // 更多桌面
    moreDesk() {
      this.panelIndex = 1;
      this.addDeskVisible = false;
      this.deskMarketVisible = true;
    },

    // 显示桌面来源的切换
    showAddDeskForm() {
      this.addDeskVisible = true;
      this.menuVisible = false;
      // this.$refs.currentDeskRef?.hideMenu();
    },

    // 桌面导出
    exportDesk() {
      if (this.$useEnv("guest")) {
        window.$ui.confirm("访客模式下无法导出桌面", "", {
          type: "warning",
        });
        return;
      }
      this.layoutSize = this.$refs.currentDeskRef.getLayoutSize();
      this.exportModal = true;
      this.$refs.currentDeskRef?.hideMenu();
    },

    // 关闭桌面导出
    closeExport(val) {
      this.exportModal = val;
    },

    // 设置全屏
    setFullScreen(flag = true) {
      this.$refs.currentDeskRef?.setFullScreen(flag);
    },

    // 分享桌面
    shareDesk() {
      this.$refs.shareDeskRef.update();
      this.$refs.shareDeskRef.setSelectVal(this.currentDeskId);
      this.shareDeskVisible = true;
      this.$refs.currentDeskRef?.hideMenu();
    },

    // 关闭桌面分享
    closeShare() {
      this.shareDeskVisible = false;
    },

    // 添加卡片
    addCard() {
      this.$refs.currentDeskRef?.newAddCard();
    },

    // 显示
    showAll() {
      this.allDeskListVisible = true;
    },
    showMenu() {
      this.$refs.currentDeskRef?.showMenu();
    },
    showMore() {
      this.$emit("showMore");
    },

    // 编辑关闭时进行同步
    editSync() {
      if (!this.editing) {
        const isSync = this.isArrayEqual(
          this.originalCards,
          this.currentDesk?.cards
        );
        if (!isSync) {
          this.syncSaveCommunity();
          // 同步之后重新赋值
          // this.originalCards = [...this.currentDesk?.cards];
        }
      }
    },
  },

  watch: {
    // 监听当前社群变化
    communityInfo: {
      handler(newVal) {
        // 加载数据
        if (this.deskMember) {
          this.loadCommunityCloud();
        }
      },
      immediate: true,
      deep: true,
    },

    // 监听id
    currentDeskId: {
      handler(newVal) {
        console.log("测试", newVal);
        if (newVal === undefined) {
          this.setCurrentDefaultDesk();
        } else {
          // 成员情况下执行
          if (this.deskMember) {
            this.loadCommunityCloud();
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>


<style lang="scss" scoped>
.panel-top {
  width: 1091px;
  height: 628px;
  box-shadow: 0px 0px 3.12px 0px rgba(0, 0, 0, 0.03);
  box-shadow: 0px 0px 10.23px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(7px);
}
.line-title {
  margin-bottom: 0;
  font-family: "优设标题黑";
  font-size: 30px;
  text-align: center;
  font-weight: 400;
}
</style>
