<template>
  <div class="relative flex flex-col h-full">
    <!--  工具栏 xt-main-top-util-bar 元素定位类不可删-->
    <xt-mix-menu
      class="w-full h-full"
      :menus="currentMenu"
      ref="mixMenu"
      v-if="currentComRole"
    >
      <!-- 导航栏 -->
      <template #extraMenu>
        <ExtraMenu />
      </template>
      <!-- 桌面数据渲染 -->
      <Desk
        v-if="currentDesk && currentDesk?.cards?.length > 0"
        @changeEditing="editing = !editing"
        :global-settings="settings"
        :editing="editing"
        ref="currentDeskRef"
        :currentDesk="currentDesk"
        v-model:settings="currentDesk.settings"
        :key="currentDeskId"
        :keepAddIcon="keepAddIcon"
        @onArrange="onArrange"
      >
        <!-- 拿菜单数据 -->
        <template #settingsAllAfter>
          <slot name="settingsAll"></slot>
        </template>
      </Desk>
      <!-- 空白桌面 -->
      <template v-else>
        <slot name="empty">
          <div class="flex items-center justify-center w-full h-full">
            <div class="panel-top xt-bg">
              <AdminEmpty :comInfo="currentComInfo" />
              <!-- 添加按钮 -->
              <div
                class="flex justify-center w-full mt-6 justify-items-center align-items-center"
              >
                <xt-button
                  :w="113"
                  :h="40"
                  @click="addIcon"
                  class="ml-3 xt-bg-t-2"
                  key="console"
                  type="primary"
                >
                  <div class="flex">
                    <xt-new-icon
                      class="mr-2"
                      size="20"
                      icon="fluent:add-16-regular"
                    />
                    添加图标
                  </div>
                </xt-button>
                <xt-button
                  :w="113"
                  :h="40"
                  @click="newAddCard"
                  class="ml-3 xt-bg-t-2"
                  key="console"
                  type="primary"
                >
                  <div class="flex">
                    <xt-new-icon
                      class="mr-2"
                      size="20"
                      icon="fluent:collections-add-24-regular"
                    />
                    添加组件
                  </div>
                </xt-button>
                <xt-button
                  :w="113"
                  :h="40"
                  @click="moreDesk"
                  class="ml-3 xt-bg-t-2"
                  key="console"
                  type="primary"
                >
                  <div class="flex">
                    <xt-new-icon
                      class="mr-2"
                      size="20"
                      icon="fluent:building-shop-16-regular"
                    />
                    桌面市场
                  </div>
                </xt-button>
                <xt-button
                  :w="113"
                  :h="40"
                  @click="importDesk"
                  class="ml-3 xt-bg-t-2"
                  key="console"
                  type="primary"
                >
                  <div class="flex">
                    <xt-new-icon
                      class="mr-2"
                      size="20"
                      icon="fluent:arrow-download-20-filled"
                    />
                    导入桌面
                  </div>
                </xt-button>
              </div>
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
                  :closeParent="true"
                  @openPreview="openPreview"
                  deskItemStyle="width:327px; height:290px"
                  :addDesk="false"
                ></DeskMarket>
              </vue-custom-scrollbar>
            </div>
          </div>
        </slot>
        <span v-show="false">
          <Desk
            ref="currentDeskRef"
            :currentDesk="currentDesk"
            :key="key"
            :editing="editing"
          >
          </Desk>
        </span>
      </template>
    </xt-mix-menu>

    <!-- 社群成员空白桌面 -->
    <template v-else>
      <div class="flex items-center justify-center w-full h-full">
        <NonAdminEmpty />
      </div>
    </template>

    <div
      class="flex flex-row xt-main-top-util-bar desk-group-switcher"
      v-if="showTopBar && !fullScreen"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <xt-task id="D0001" no="1" @cb="clickDesk">
        <div class="panel s-bg">
          <!-- 社群头像 -->
          <div
            class="mr-3 flex items-center justify-center"
            style="width: 38px"
          >
            <a-avatar :src="currentComInfo.icon" :size="38" shape="square" />
          </div>
          <!-- 桌面切换 -->
          <div class="flex flex-row tabs" v-if="showTabs">
            <div
              :class="{ 'tab-active': currentDeskId === item.id }"
              @click="setCurrentDeskId(item.id)"
              class="pr-3 truncate tab s-bg xt-text"
              v-for="(item, index) in displayDesks"
            >
              <a-avatar
                v-if="item.iconUrl"
                shape="square"
                class="mr-2 icon"
                :size="22"
                :src="item.iconUrl"
              ></a-avatar>
              <icon
                v-else
                :icon="item.icon || 'desktop'"
                style="font-size: 18px; vertical-align: middle"
                class="mr-2"
              ></icon>
              <span class="">{{ item.name }}</span>
            </div>
          </div>
          <!-- 全屏功能 -->
          <xt-button w="38" h="38" @click="handleDeskFullScreen" hidden="">
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="fluent:full-screen-maximize-16-regular"
                size="20"
                v-if="!windowFullScreen"
              />
              <xt-ify-icon
                icon="fluent:full-screen-minimize-16-regular"
                size="20"
                v-else
              />
            </div>
          </xt-button>
        </div>
        <div class="flex dots item-content">
          <div
            :class="{ active: currentDeskId === item.id }"
            class="dot"
            v-for="(item, index) in displayDesks"
          >
            &nbsp;
          </div>
        </div>
      </xt-task>
      <div v-if="false">
        <div class="flex flex-row ml-1">
          <slot name="toolsBefore"></slot>
          <a-tooltip title="菜单" placement="bottom">
            <div class="pl-3"></div>
          </a-tooltip>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加桌面 弹窗 -->
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
            ></xt-new-icon
            >创建空白桌面
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
            ></xt-new-icon
            >导入桌面文件
          </div>
        </xt-button>
        <xt-button
          :w="145"
          :h="40"
          @click="aiCustom"
          class="ml-3 xt-active-bg"
          key="console"
          type="primary"
        >
          <div class="flex">
            <xt-new-icon
              class="mr-2"
              size="20"
              icon="fluent:bot-24-regular"
            ></xt-new-icon
            >桌面智能定制
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
          @openPreview="openPreview"
          deskItemStyle="width:317px; height:284px;"
        ></DeskMarket>
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
      :activeId="currentDeskId"
      :items="deskList"
      @valueChanged="
        (event) => {
          setCurrentDeskId(event.id);
          this.allDeskListVisible = false;
        }
      "
    ></AllDeskList>
  </a-drawer>

  <!-- 添加桌面抽屉式弹窗 -->
  <a-drawer
    v-if="false"
    v-model:visible="addDeskVisible"
    width="500"
    title="添加桌面"
    @close="shareCode = false"
  >
    <HorizontalPanel
      :nav-list="currentAddMethod"
      v-model:select-type="currentAddTab"
    >
    </HorizontalPanel>
    <div v-if="currentAddTab.name === 'market'">
      <div class="flex justify-between">
        <span class="flex items-center">
          <span class="mr-2 desk-title">热门桌面</span>
          <Icon style="font-size: 20px" icon="daohang_remen-xuanzhong"></Icon>
        </span>
        <div class="btn-item" @click="moreDesk" style="width: 160px">
          更多桌面分享
        </div>
      </div>
      <div>
        <DeskMarket
          :desks="deskList"
          :items="recommendList"
          :closeParent="true"
          @openPreview="openPreview"
          deskItemStyle="width:435px; height:auto;"
        ></DeskMarket>
      </div>
    </div>
    <div v-else>
      <xt-task id="M0102" no="3"></xt-task>
      <div class="mt-4 desk-title">标题</div>
      <a-input
        v-model:value="deskTitle"
        spellcheck="false"
        class="input"
        placeholder="请输入"
        aria-placeholder="font-size: 16px;"
      />
      <xt-task id="M0102" no="4" @cb="doAddDesk">
        <span class="desk-title">初始布局</span>
        <div class="mt-6">
          <HorizontalPanel
            :navList="deskType"
            v-model:selectType="selectDesk"
          ></HorizontalPanel>
        </div>
        <xt-button
          style="width: 100%"
          type="theme"
          @click="doAddDesk"
          class="mt-4"
          >立即添加
        </xt-button>
      </xt-task>
      <div>
        <div @click="importDesk" class="btn-item">导入桌面</div>
      </div>
    </div>
    <template #extra v-if="shareCode"></template>
    <div v-if="!shareCode"></div>
    <div v-else>
      <span class="desk-title">分享码</span>
      <a-input
        v-model:value="deskCode"
        spellcheck="false"
        class="input"
        placeholder="请输入"
        aria-placeholder="font-size: 16px;"
      />
    </div>
  </a-drawer>

  <!-- 分享桌面 -->
  <ShareDesk
    :deskList="deskList"
    ref="shareDeskRef"
    :deskRef="$refs.currentDeskRef"
    :openDrawer="shareDeskVisible"
    @closeShare="closeShare"
  ></ShareDesk>

  <!-- 导出桌面 -->
  <ExportDesk
    :openModal="exportModal"
    @closeExport="closeExport"
    :layoutSize="layoutSize"
    :desks="deskList"
  ></ExportDesk>

  <!-- 预览推荐桌面 -->
  <div style="z-index: 9999">
    <DeskPreview
      @afterAdded="afterAdded"
      :deskList="deskList"
      :scheme="scheme"
      :addDesk="addDesk"
      :showModal="showModal"
      @closePreview="closePreview"
      @closeGroup="closeGroup"
      :communityInfo="currentComInfo"
    ></DeskPreview>
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
    ></NewAddCard>
  </div>

  <!-- 选择文件 -->
  <input style="display: none" ref="fileRef" type="file" />
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { useNavigationStore } from "../../../components/desk/navigationBar/navigationStore";
import { appStore } from "../../../store";
import { taskStore } from "../../task/store";
import { nanoid } from "nanoid";
import { message, Modal, notification } from "ant-design-vue";
import { deskTemplates } from "../../../js/data/deskTemplates";
import { deskStore } from "../../../store/desk";
import { marketStore } from "../../../store/market";
import { completeTask } from "../../task/task";
import { communityNavStore } from "../../../components/bottomPanel/store/communityNavStore";
import { useDeskStore } from "../../../components/desk/store";
import { useFreeLayoutStore } from "../../../components/desk/freeLayout/store";
import { useFloatMenuStore } from "../../../components/desk/floatMenu/store";

import Desk from "../../../components/desk/Desk.vue";
import AllDeskList from "../../../components/desk/AllDeskList.vue";
import ExportDesk from "../../../components/desk/ExportDesk.vue";
import DeskMarket from "../../../page/app/card/DeskMarket.vue";
import ShareDesk from "../../../components/desk/ShareDesk.vue";
import NewAddCard from "../../../page/app/card/NewAddCard.vue";
import DeskPreview from "../../../components/desk/DeskPreview.vue";
import VueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
import NewGuidePage from "../../../page/app/grade/NewGuidePage.vue";
import ExtraMenu from "../../../components/windowPanel/components/ExtraMenu.vue";
import NonAdminEmpty from "./empty/NonAdminEmpty.vue";
import AdminEmpty from "./empty/AdminEmpty.vue";

// import HorizontalPanel from "../HorizontalPanel.vue";
// import Icon from "../Icon.vue";
// import Emoji from "../comp/Emoji.vue";

export default {
  name: "CommunityGroupDesk",
  emits: ["update:currentDeskId", "showMore"],
  components: {
    // Emoji,
    VueCustomScrollbar,
    // Icon,
    DeskPreview,
    NewAddCard,
    ShareDesk,
    DeskMarket,
    ExportDesk,
    // HorizontalPanel,
    AllDeskList,
    Desk,
    NewGuidePage,
    ExtraMenu,
    NonAdminEmpty,
    AdminEmpty,
  },

  props: {
    settings: {
      type: Object,
      default: {},
    },
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
    currentDeskId: {
      type: String,
      default: "0",
    },
  },

  data() {
    return {
      /**桌面组下拉菜单**/
      deskGroupMenu: {
        id: 20,
        newIcon: "fluent:more-horizontal-16-filled",
        name: "更多",
        lock: true,
        children: [
          {
            id: 2,
            newIcon: "fluent:full-screen-maximize-16-filled",
            name: "全屏桌面",
            fn: () => {
              let a = !this.fullScreen;
              this.setFullScreen(a);
            },
          },
          {
            id: 3,
            newIcon: "fluent:arrow-download-20-filled",
            name: "导入桌面",
            fn: this.importDesk,
          },
          {
            id: 4,
            newIcon: "fluent:open-20-filled",
            name: "导出桌面",
            fn: this.exportDesk,
          },
          {
            id: 5,
            newIcon: "fluent:share-android-24-regular",
            name: "分享桌面",
            fn: this.shareDesk,
            disabled: window.$usePlat(),
          },
          {
            id: 9,
            newIcon: "akar-icons:trash-can",
            name: "删除桌面",
            fn: this.delDesk,
            color: "#FF4D4F",
          },
        ],
      },
      /**滚动条配置**/
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
        currentItemId: -1,
      },
      /**当前添加tab类型**/
      currentAddTab: { name: "market" },
      /**唯一key**/
      key: Date.now(),
      /**显示更多桌面**/
      moreDesksVisible: false,
      /**所有桌面**/
      allDeskListVisible: false,
      /**编辑桌面**/
      editing: false,
      /**添加桌面**/
      addDeskVisible: false,
      /**分享桌面**/
      shareDeskVisible: false,
      /**桌面类型**/
      deskType: [
        { title: "日常桌面", name: "daily" },
        { title: "游戏桌面", name: "game" },
        { title: "办公桌面", name: "work" },
        { title: "空白桌面", name: "empty" },
      ],
      /**当前选中桌面**/
      selectDesk: { title: "日常桌面", name: "daily" },
      /**桌面标题**/
      deskTitle: "",
      /**热门桌面**/
      hotDesk: [],
      scheme: {},
      showModal: false,
      deskCode: "",
      shareCode: false,
      /**导出弹窗**/
      exportModal: false,
      /**自由布局**/
      layoutSize: { width: 0, height: 0 },
      /**桌面市场**/
      deskMarketVisible: false,
      /**下标**/
      panelIndex: 0,
      /**当前添加桌面来源**/
      currentAddMethod: [
        { title: "从市场添加", name: "market" },
        { title: "自行添加", name: "custom" },
      ],
      /**推荐桌面**/
      recommendList: [],
      /**保持添加图标**/
      keepAddIcon: false,
    };
  },

  mounted() {
    this.$bus.on("M0104", () => {
      this.currentAddTab.name = "custom";
      this.addDeskVisible = true;
    });
    this.$bus.on("M0203", () => {
      this.addDeskVisible = true;
      this.moreDesk();
    });
    let obj = {
      id: 3,
      newIcon: "fluent:apps-add-in-20-filled",
      name: "添加更多",
      lock: true,
      children: [
        {
          id: 1,
          newIcon: "fluent:slide-add-16-regular",
          name: "添加新桌面",
          fn: this.showAddDeskForm,
        },
      ],
    };
    
    this.addMenu(this.deskGroupMenu);
    this.addMenu(obj);
    if (this.deskList.length > 0) {
      this.currentDesk = this.deskList[0];
    }
    this.deskList.forEach((desk) => {
      if (!desk.id) {
        desk.id = desk.nanoid;
      }
    });
    this.hotDesk.push(this.apiList[0].children[0]);
    this.getRecommend({ goodType: "desk" }).then((rs) => {
      this.recommendList = rs;
    });
  },

  computed: {
    ...mapWritableState(deskStore, ["apiList"]),
    ...mapWritableState(appStore, [
      "fullScreen",
      "showGuide",
      "guideList",
      "windowFullScreen",
    ]),
    ...mapWritableState(taskStore, ["taskID", "step", "taskTmp"]),
    ...mapWritableState(useDeskStore, ["menus"]),
    ...mapWritableState(communityNavStore, ["currentCommunity"]),
    ...mapWritableState(useFreeLayoutStore, [
      "freeLayoutData",
      "freeLayoutState",
      "getFreeLayoutState",
      "isFreeLayout",
    ]),
    ...mapWritableState(useNavigationStore, [
      "targetDesk",
      "selectNav",
      "jumpDesk",
    ]),

    /**当前社群的角色权限**/
    currentComRole() {
      if (this.currentCommunity?.item?.role) {
        return this.currentCommunity?.item?.role !== "member";
      } else {
        return false;
      }
    },
    /**当前社群基本信息**/
    currentComInfo() {
      return this.currentCommunity?.item;
    },
    /**当前桌面数据**/
    currentDesk() {
      console.log('当前桌面数据列表',this.deskList)
      let currentDesk = this.deskList.find((desk) => {
        if (desk.communityNo) {
          return desk.id === this.currentDeskId;
        }
      });
      this.key = Date.now();
      return currentDesk;
    },
    /**点击桌面**/
    clickDesk() {
      this.step = -1;
      this.taskID = this.taskTmp;
      this.taskTmp = "";
    },
    /**桌面置顶**/
    displayDesks() {
      const comNoSome = this.deskList.some((desk) => {
        if (desk.hasOwnProperty("communityNo")) {
          return Number(this.currentComInfo?.no) === Number(desk.communityNo);
        }
      });
      if (comNoSome) {
        return [
          ...this.deskList.filter((desk) => {
            if (desk.communityNo) return desk.pin;
          }),
          ...this.deskList.filter((desk) => {
            if (desk.communityNo) return !desk.pin;
          }),
        ]
          .slice(0, 4)
          .sort((a, b) => {
            if (b.pin) {
              //置顶的桌面排最前面
              return 9999999999999;
            }
            return Number(b.order || 0) - Number(a.order || 0);
          });
      }
    },
    /**获取主页尺寸**/
    getHomeSize() {
      this.$nextTick(() => {
        let height = document.getElementById("cardContent")?.offsetHeight;
        let width = document.getElementById("cardContent")?.offsetWidth;
        const windowHeight = document.documentElement.clientHeight; // 高
        let windowWidth = document.documentElement.clientWidth; // 宽
        let size = {
          width,
          height,
          windowHeight,
          windowWidth,
        };
        this.setDeskSize(size);
      });
    },
    /**当前菜单项**/ 
    currentMenu(){
      if(this.currentComRole){}
      else {}

      console.log('菜单项',this.menus);
      return this.menus;
    }

  },

  watch: {
    /**
     * 添加图标中下拉框桌面切换
     */
    targetDesk() {
      if (this.selectNav === "desktop" && this.targetDesk !== "") {
        this.setCurrentDeskId(this.targetDesk.id);
      }
    },
    /**
     * 设置指定桌面跳转
     */
    jumpDesk() {
      if (this.jumpDesk !== "") {
        this.setCurrentDeskId(this.jumpDesk.id);
        this.jumpDesk = "";
      }
    },
  },

  methods: {
    ...mapActions(marketStore, ["getRecommend"]),
    ...mapActions(useFreeLayoutStore, ["clearFreeLayout"]),
    ...mapActions(useDeskStore, ["addMenu"]),
    ...mapActions(appStore, ["toggleFullScreen"]),

    /**关闭推荐桌面预览**/
    closePreview() {
      this.showModal = false;
    },
    /**开启推荐桌面预览**/
    openPreview({ scheme, showModal, addDesk }) {
      this.scheme = scheme;
      this.showModal = showModal;
      this.addDesk = addDesk;
    },
    /**切换当前桌面**/
    setCurrentDeskId(id) {
      this.$emit("update:currentDeskId", id);
      this.$emit("changeDesk", { id: id });
    },
    /**添加新桌面**/
    showAddDeskForm() {
      this.$refs.currentDeskRef.hideMenu();
      this.addDeskVisible = true;
      this.menuVisible = false;
    },
    /** 添加图标**/
    addIcon() {
      this.$refs.currentDeskRef.newAddIcon();
      this.keepAddIcon = true;
    },
    /**桌面全屏按钮 当前桌面全屏先保留,后期需要再调用这个方法**/
    handleDeskFullScreen() {
      this.toggleFullScreen();
    },
    /**显示所有桌面**/
    showAll() {
      this.allDeskListVisible = true;
    },
    /**删除当前桌面**/
    delDesk() {
      const filterList = this.deskList.filter((desk) => {
        if (desk.communityNo) {
          return desk;
        }
      });
      /**当前桌面的卡片数据进行删除**/
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
                  // isDelete:true,
                  deskId: "",
                  deskName: "",
                });
              }
            });
        }
      });
      window.$ui.confirm("删除当前桌面？此操作不可还原。", "", {
        type: "warning",
        okText: "删除桌面",
        okButtonWidth: "100",
        ok: () => {
          if (filterList.length === 1) {
            /**先创建**/
            this.doAddDesk("空白桌面");
            /**后移除**/
            const index = this.deskList.findIndex((desk) => {
              return desk === this.currentDesk;
            });
            this.deskList.splice(index, 1);
            this.$emit("changeDesk", { id: this.deskList[0].id });
            this.clearFreeLayout(this.currentDeskId);
            // 删除桌面数据
            this.key = Date.now();
          } else {
            const index = this.deskList.findIndex((desk) => {
              return desk === this.currentDesk;
            });
            this.deskList.splice(index, 1);
            this.$emit("changeDesk", { id: this.deskList[0].id });
            this.clearFreeLayout(this.currentDeskId);
            // 删除桌面数据
            this.key = Date.now();
          }
        },
      });
    },
    /**添加桌面**/
    doAddDesk(deskName) {
      if (deskName) {
        this.deskTitle = deskName;
      }
      if (this.deskTitle.trim() === "") {
        message.error("请输入新桌面名称");
        return;
      }
      if (this.deskTitle.length >= 16) {
        message.error("新桌面名称长度不可超过16");
        return;
      }
      let desk = {
        name: this.deskTitle,
        id: `${this.currentComInfo?.no}${nanoid(4)}`,
        icon: "desktop",
        cards: this.cleanMuuriData(deskTemplates[this.selectDesk.name]),
        communityNo: this.currentComInfo?.no,
      };
      if (deskName) {
        desk.cards = [];
      }
      this.deskList.unshift(desk);
      this.$emit("changeDesk", { id: desk.id });
      this.deskTitle = "";
      this.key = Date.now();
      this.addDeskVisible = false;
    },
    /**解决桌面卡片数据重置**/
    cleanMuuriData(list) {
      list.forEach((li) => {
        li.id = nanoid(8);
        delete li["_$muuri_id"];
      });
      return [...list];
    },
    /**关闭分享**/
    closeShare() {
      this.shareDeskVisible = false;
    },
    /**导入桌面**/
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
      let fileRef = this.$refs.fileRef;
      fileRef.click();
      // let that = this;
      fileRef.onchange = function (event) {
        if (this.files.length === 0) return;
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
          that.readConfig(event.target.result);
        };
        // 开始读取文件，读取完成后会触发 onload 事件
        reader.readAsText(file); // 如果是二进制文件，可以使用 reader.readAsArrayBuffer(file) 或者 reader.readAsDataURL(file)
      };
    },
    /**导出桌面**/
    exportDesk() {
      if (this.$useEnv("guest")) {
        window.$ui.confirm("访客模式下无法导出桌面", "", {
          type: "warning",
        });
        return;
      }
      this.$refs.currentDeskRef.hideMenu();
      this.layoutSize = this.$refs.currentDeskRef.getLayoutSize();
      this.exportModal = true;
    },
    /**关闭导出**/
    closeExport(val) {
      this.exportModal = val;
    },
    // 读取文件配置
    async readConfig(file) {
      let needImportDesk;
      needImportDesk = JSON.parse(file);
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
        g.id = `${this.currentComInfo?.no}${nanoid(8)}`;
        g.communityNo = this.currentComInfo?.no;
        // 将导入的便签重新修改时间
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
    },
    /**显示菜单**/
    showMenu() {
      this.$refs.currentDeskRef.showMenu();
    },
    /**显示更多**/
    showMore() {
      this.$emit("showMore");
    },
    /**设置桌面全屏**/
    setFullScreen(flag = true) {
      this.$refs.currentDeskRef.setFullScreen(flag);
    },
    /**分享桌面**/
    shareDesk() {
      this.$refs.shareDeskRef.update();
      this.$refs.shareDeskRef.setSelectVal(this.currentDeskId);
      this.shareDeskVisible = true;
      this.$refs.currentDeskRef.hideMenu();
    },
    /**鼠标移入**/
    handleMouseEnter() {
      this.$bus.emit("stopHide");
    },
    /**鼠标离开**/
    handleMouseLeave() {
      this.$bus.emit("startHide");
    },
    /**更新**/
    update() {
      this.$refs.currentDeskRef.update();
    },
    learn() {
      this.$refs.currentDeskRef.learn();
    },
    /**关闭分组**/
    closeGroup() {
      this.addDeskVisible = false;
    },
    /**隐藏桌面市场**/
    hideMarket() {
      this.deskMarketVisible = false;
    },
    /**更多桌面**/
    moreDesk() {
      this.panelIndex = 1;
      this.addDeskVisible = false;
      this.deskMarketVisible = true;
    },
    /**添加卡片**/
    addCard() {
      this.$refs.currentDeskRef.newAddCard();
    },
    /**开始编辑**/
    startEdit() {
      this.key = Date.now();
      this.editing = true;
      this.$refs.currentDeskRef.update();
    },
    /**停止编辑**/
    stopEdit() {
      this.key = Date.now();
      this.editing = false;
    },
    /**添加新卡片**/
    newAddCard() {
      this.$refs.currentDeskRef.newAddCard();
      this.keepAddIcon = false;
    },
    /**添加后的回调**/
    afterAdded() {
      completeTask("m0203");
      this.hideMarket();
    },
    /**图标整理**/ 
    onArrange() {
      this.guideList = [1];
      this.showGuide = true;
    },
    /**关闭图标整理**/ 
    closeShowGuide() {
      this.showGuide = false;
    },

    // // 智能定制
    // aiCustom() {
    //   this.guideList = [0, 1, 2];
    //   this.showGuide = true;
    //   message.info("开始桌面定制");
    //   this.addDeskVisible = false;
    //   this.doAddDesk("定制桌面");
    // },
    // startTask(e) {
    //   let ref = this.$refs.mixMenu;
    //   ref.custom(e);
    // },
  },
};
</script>

<style scoped lang="scss">
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
.btn-bg {
  background: var(--primary-bg);
  color: var(--primary-text);
  height: 42px;
  line-height: 42px;

  &:hover {
    opacity: 0.8;
  }
}
.tab-bg {
  background: var(--primary-bg);
  color: var(--primary-text);
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
.desk-group-switcher {
  svg {
    display: inline-block;
  }
  min-width: 100px;
  min-height: 20px;
  z-index: 99;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -10px;
  display: flex;
  justify-items: center;
  margin: auto;
  .tabs {
    gap: 10px;
    .tab {
      .icon {
        margin-top: -1px;
        vertical-align: text-top;
      }
      cursor: pointer;
      &.tab-active,
      &:hover {
        opacity: 1;
      }
      &.tab-active {
        background: var(--active-bg);
        color: var(--active-text) !important;
      }
      line-height: 38px;
      font-size: 15px;
      width: 120px;
      border-radius: 8px;

      padding-left: 10px;
      padding-right: 10px;
      text-align: center;
    }
    .more {
      min-width: 80px;
    }
    .home {
      min-width: 90px;
    }
  }
  .dots {
    cursor: pointer;
    padding: 20px;
    gap: 10px;
    padding-bottom: 5px !important;
    .dot {
      background: var(--secondary-bg);
      width: 15px;
      height: 15px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1000px;

      &.active {
        width: 40px;
      }
    }
  }
  &:hover {
    .panel {
      display: flex;
    }

    .dots {
      display: none;
    }
  }
  .panel {
    display: none;
  }
  .dots {
    display: flex;
  }
  .panel {
    padding: 10px;
    border-radius: 12px;
    border: 1px solid var(--divider) !important;
  }
}
</style>
