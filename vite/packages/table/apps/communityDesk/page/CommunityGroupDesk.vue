<!-- 社群桌面页面 -->
<template>
  <!-- 管理员 -->
  <template v-if="currentComRole">
    <!--  工具栏 xt-main-top-util-bar 元素定位类不可删-->
    <div class="relative flex flex-col h-full" v-if="displayDesks.length !== 0">
      <xt-mix-menu class="w-full h-full" :menus="deskMenu" ref="mixMenu">
        <!-- 导航栏 -->
        <template #extraMenu>
          <ExtraMenu />
        </template>

        <!-- 桌面加载组件 -->
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

        <!-- 空状态 -->
        <template v-else>
          <slot name="empty">
            <div class="flex items-center justify-center w-full h-full">
              <div class="panel-top xt-bg">
                <!-- 社群基础信息 -->
                <AdminEmpty :comInfo="currentComInfo" />

                <!-- 按钮添加 -->
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
                    :communityInfo="currentComInfo"
                    :addDesk="false"
                    @openPreview="openPreview"
                  />
                </vue-custom-scrollbar>
              </div>
            </div>
          </slot>

          <!-- 隐藏的桌面页面 -->
          <span v-show="false">
            <Desk
              ref="currentDeskRef"
              :editing="editing"
              :key="key"
              :currentDesk="currentDesk"
            />
          </span>
        </template>
      </xt-mix-menu>

      <!-- 底部tab切换UI -->
      <div
        class="flex flex-row xt-main-top-util-bar desk-group-switcher"
        v-if="showTopBar && !fullScreen"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <xt-task id="D0001" no="1" @cb="clickDesk">
          <!-- tab切换桌面按钮 -->
          <div class="panel s-bg">
            <div class="flex flex-row tabs" v-if="showTabs">
              <!-- 当前社群桌面头像 -->
              <div
                style="width: 38px; height: 38px"
                class="flex items-center justify-center"
              >
                <a-avatar
                  :src="currentComInfo.icon"
                  :size="38"
                  shape="square"
                />
              </div>
              <!-- 桌面切换列表 -->
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
                />
                <icon
                  v-else
                  :icon="item.icon || 'desktop'"
                  style="font-size: 18px; vertical-align: middle"
                  class="mr-2"
                />
                <span class="xt-text xt-font font-16">{{ item.name }}</span>
              </div>
              <!-- 全屏功能,后期需要再开放 -->
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
  </template>

  <!-- 成员 -->
  <template v-else>
    <div class="relative flex flex-col h-full">
      <xt-mix-menu
        class="w-full h-full"
        :menus="deskMenu"
        ref="mixMenu"
        v-if="displayDesks.length !== 0"
      >
        <Desk
          v-if="currentDesk && currentDesk?.cards?.length > 0"
          :global-settings="settings"
          :editing="false"
          ref="currentDeskRef"
          :currentDesk="currentDesk"
          v-model:settings="currentDesk.settings"
          :key="currentDeskId"
          :keepAddIcon="keepAddIcon"
        >
          <!-- 拿菜单数据 -->
          <template #settingsAllAfter>
            <slot name="settingsAll"></slot>
          </template>
        </Desk>

        <template v-else>
          <slot name="empty">
            <div class="flex items-center justify-center w-full h-full">
              <NonAdminEmpty />
            </div>
          </slot>

          <span v-show="false">
            <Desk
              ref="currentDeskRef"
              :editing="editing"
              :key="key"
              :currentDesk="currentDesk"
            />
          </span>
        </template>
      </xt-mix-menu>

      <!-- 底部tab切换UI -->
      <div
        class="flex flex-row xt-main-top-util-bar desk-group-switcher"
        v-if="showTopBar && !fullScreen"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <xt-task id="D0001" no="1" @cb="clickDesk">
          <!-- tab切换桌面按钮 -->
          <div class="panel s-bg">
            <div class="flex flex-row tabs" v-if="showTabs">
              <!-- 当前社群桌面头像 -->
              <div
                style="width: 38px; height: 38px"
                class="flex items-center justify-center"
              >
                <a-avatar
                  :src="currentComInfo.icon"
                  :size="38"
                  shape="square"
                />
              </div>
              <!-- 桌面切换列表 -->
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
                />
                <icon
                  v-else
                  :icon="item.icon || 'desktop'"
                  style="font-size: 18px; vertical-align: middle"
                  class="mr-2"
                />
                <span class="">{{ item.name }}</span>
              </div>
            </div>
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
  </template>

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
    />

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
        />
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
          />
        </div>
        <xt-button
          style="width: 100%"
          type="theme"
          @click="doAddDesk"
          class="mt-4"
        >
          立即添加
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

  <!-- 推荐桌面预览 -->
  <div style="z-index: 10001">
    <DeskPreview
      @afterAdded="afterAdded"
      :deskList="deskList"
      :scheme="scheme"
      :addDesk="addDesk"
      :showModal="showModal"
      :communityInfo="currentComInfo"
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

  <!-- 社群桌面引导创建 -->
  <CreateDeskModal
    ref="createDeskRef"
    :currentCommunityNo="currentCommunity"
    @createDesk="doAddDesk('空白桌面')"
  />
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import _ from "lodash-es";
import { nanoid } from "nanoid";
import { message, Modal, notification } from "ant-design-vue";

// store文件
import { useNavigationStore } from "../../../components/desk/navigationBar/navigationStore";
import { appStore } from "../../../store";
import { taskStore } from "../../task/store";
import { deskStore } from "../../../store/desk";
import { marketStore } from "../../../store/market";
import { communityNavStore } from "../../../components/bottomPanel/store/communityNavStore";
import { useDeskStore } from "../../../components/desk/store";
import { useFreeLayoutStore } from "../../../components/desk/freeLayout/store";
import { useFloatMenuStore } from "../../../components/desk/floatMenu/store";
import { communityDeskStore } from "../store/communityDeskStore";

// 其他方法文件
import { deskTemplates } from "../../../js/data/deskTemplates";
import { completeTask } from "../../task/task";
import menuMinis from "../hooks/communityMenu";

// page文件
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
import GalleryModal from "../../../components/paperModal/PaperApp.vue";
import Icon from "../../../components/Icon.vue";
import HorizontalPanel from "../../../components/HorizontalPanel.vue";
import CreateDeskModal from "../components/CreateDeskModal.vue";
import DeskAddButton from "../components/DeskAddButton.vue";

export default {
  name: "CommunityGroupDesk",

  emits: ["update:currentDeskId", "showMore"],

  mixins: [menuMinis],

  components: {
    VueCustomScrollbar,
    DeskPreview,
    NewAddCard,
    ShareDesk,
    DeskMarket,
    ExportDesk,
    AllDeskList,
    Desk,
    NewGuidePage,
    ExtraMenu,
    NonAdminEmpty,
    AdminEmpty,
    GalleryModal,
    Icon,
    HorizontalPanel,
    CreateDeskModal,
    DeskAddButton,
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
      comHide: false,
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
          newIcon: "fluent:add-16-regular",
          name: "添加图标",
          fn: this.addIcon,
        },
        {
          newIcon: "fluent:collections-add-24-regular",
          name: "添加组件",
          fn: this.newAddCard,
        },
        {
          newIcon: "fluent:building-shop-16-regular",
          name: "桌面市场",
          fn: this.moreDesk,
        },
        {
          newIcon: "fluent:arrow-download-20-filled",
          name: "导入桌面",
          fn: this.importDesk,
        },
      ],
    };
  },

  computed: {
    ...mapWritableState(appStore, [
      "fullScreen",
      "showGuide",
      "guideList",
      "windowFullScreen",
    ]),
    ...mapWritableState(deskStore, ["apiList"]),
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
    ...mapWritableState(communityDeskStore, ["syncDesk", "setting"]),

    // 桌面下拉菜单
    deskMenu() {
      /**当前社群具备管理员资格**/
      if (this.currentComRole) {
        return this.communityMenus;
      } else {
        return this.memberMenus;
      }
    },

    // 点击桌面
    clickDesk() {
      this.step = -1;
      this.taskID = this.taskTmp;
      this.taskTmp = "";
    },

    // 社群角色权限
    currentComRole() {
      return this.currentCommunity?.item?.role === "owner";
    },

    // 当前社群基本信息
    currentComInfo() {
      return this.currentCommunity?.item;
    },

    // 当前桌面
    currentDesk() {
      let currentDesk = this.deskList.find((desk) => {
        if (desk.communityNo) {
          return desk.id === this.currentDeskId;
        }
      });
      if (currentDesk) {
        this.key = Date.now();
        return currentDesk;
      } else {
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
        return option;
      }
    },

    // 过滤出当前社群名下所有桌面的列表
    communityDeskList() {
      const filterList = _.filter(this.deskList, (desk) => {
        return desk.hasOwnProperty("communityNo");
      });
      const newArr = _.filter(filterList, (desk) => {
        return Number(this.currentComInfo.no) === Number(desk.communityNo);
      });
      return newArr;
    },

    // 桌面置顶数据
    displayDesks() {
      const deskLists = [
        ...this.communityDeskList.filter((desk) => {
          return desk?.pin;
        }),
        ...this.communityDeskList.filter((desk) => {
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

    // 开启社群桌面引导创建弹窗
    this.$bus.on("openCommunityDesk", () => {
      this.$nextTick(() => {
        this.$refs.createDeskRef?.openCommunityDeskModal();
      });
    });

    this.hotDesk.push(this.apiList[0].children[0]);
    // 获取推荐桌面数据
    this.getRecommend({ goodType: "desk" }).then((rs) => {
      this.recommendList = rs;
    });

    // 根据桌面id默认显示当前桌面
    if (this.deskList.length > 0) {
      this.currentDesk = this.deskList[0];
    }
    this.deskList.forEach((desk) => {
      if (!desk.id) {
        desk.id = desk.nanoid;
      }
    });

    // 监听当前桌面的变化
    this.$watch(
      () => this.currentDesk?.cards,
      (newVal, oldVal) => {
        console.log("myComputedProperty changed:", newVal, oldVal);
      }
    );

    this.setCurrentDefaultDesk();
  },

  watch: {
    // 监听当前社群变化
    currentComInfo: {
      handler(newVal) {
        // 默认选中桌面方法
        this.setCurrentDefaultDesk();
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    ...mapActions(marketStore, ["getRecommend"]),
    ...mapActions(useFreeLayoutStore, ["clearFreeLayout"]),
    ...mapActions(useDeskStore, ["addMenu"]),
    ...mapActions(appStore, ["toggleFullScreen"]),
    ...mapActions(communityDeskStore, [
      "setCurrentDeskNo",
      "setCurrentDeskAllList",
      "setCurrentDeskData",
      "saveCommunityDesk",
      "loadCommunityDeskAll",
      "loadCommunityDeskDetail",
      "saveCommunityDeskDetail",
    ]),

    // 根据当前社群编号来加载当前社群桌面云端数据
    loadCommunityCloud() {
      this.setCurrentDeskNo(this.currentComInfo.no);
      this.loadCommunityDeskAll();
      this.loadCommunityDeskDetail();
    },

    // 根据当前社群编号来保存当前社群桌面云端数据
    syncSaveCommunity() {
      this.setCurrentDeskNo(this.currentComInfo.no);
      this.setCurrentDeskAllList(this.communityDeskList);
      this.setCurrentDeskData(this.currentDesk);
      this.saveCommunityDesk();
      this.saveCommunityDeskDetail();
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

    // 创建桌面
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
        id: nanoid(4),
        icon: "desktop",
        cards: this.cleanMuuriData(deskTemplates[this.selectDesk.name]),
        communityNo: this.currentComInfo?.no,
        communityDeskId: `${this.currentComInfo?.no}_${nanoid(4)}`,
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

    // 删除桌面
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
          if (this.communityDeskList.length === 1) {
            const index = this.deskList.findIndex((desk) => {
              return String(desk?.id) === String(this.currentDesk?.id);
            });
            this.deskList.splice(index, 1);
            this.doAddDesk("空白桌面");
            this.$emit("changeDesk", { id: filterList[0].id });
            this.clearFreeLayout(this.currentDeskId);
            // 删除桌面数据
            this.key = Date.now();
          } else {
            const index = this.deskList.findIndex((desk) => {
              return String(desk?.id) === String(this.currentDesk?.id);
            });
            this.deskList.splice(index, 1);
            this.$emit("changeDesk", { id: filterList[0].id });
            this.clearFreeLayout(this.currentDeskId);
            // 删除桌面数据
            this.key = Date.now();
          }
        },
      });
    },

    // 解决桌面卡片数据重置
    cleanMuuriData(list) {
      list.forEach((li) => {
        li.id = nanoid(8);
        delete li["_$muuri_id"];
      });
      return [...list];
    },

    // 鼠标移入移出事件
    handleMouseLeave() {
      this.$bus.emit("startHide");
    },
    handleMouseEnter() {
      this.$bus.emit("stopHide");
    },

    // 设置桌面id的切换方法
    setCurrentDeskId(id) {
      this.$emit("update:currentDeskId", id);
      this.$emit("changeDesk", { id: id });
    },

    // 桌面导出
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

    // 关闭桌面导出
    closeExport(val) {
      this.exportModal = val;
    },

    // 设置全屏
    setFullScreen(flag = true) {
      this.$refs.currentDeskRef.setFullScreen(flag);
    },

    // 分享桌面
    shareDesk() {
      this.$refs.shareDeskRef.update();
      this.$refs.shareDeskRef.setSelectVal(this.currentDeskId);
      this.shareDeskVisible = true;
      this.$refs.currentDeskRef.hideMenu();
    },

    // 关闭桌面分享
    closeShare() {
      this.shareDeskVisible = false;
    },

    // 添加卡片
    addCard() {
      this.$refs.currentDeskRef.newAddCard();
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

    // 更多桌面
    moreDesk() {
      this.panelIndex = 1;
      this.addDeskVisible = false;
      this.deskMarketVisible = true;
    },

    // 显示桌面来源的切换
    showAddDeskForm() {
      this.$refs.currentDeskRef.hideMenu();
      this.addDeskVisible = true;
      this.menuVisible = false;
    },

    // 桌面市场
    hideMarket() {
      this.deskMarketVisible = false;
    },

    // 显示
    showAll() {
      this.allDeskListVisible = true;
    },
    showMenu() {
      this.$refs.currentDeskRef.showMenu();
    },
    showMore() {
      this.$emit("showMore");
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

    //  图标整理
    onArrange() {
      this.guideList = [1];
      this.showGuide = true;
    },
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

    // 添加图标
    addIcon() {
      this.$refs.currentDeskRef.newAddIcon();
      this.keepAddIcon = true;
    },

    // 根据当前桌面id进行判断是否为当前社群的桌面
    setCurrentDefaultDesk() {
      // 过滤出与当前社群相关联的桌面列表
      const filterDeskList = _.filter(this.deskList, (desk) => {
        if (desk.hasOwnProperty("communityNo")) {
          return Number(this.currentComInfo.no) === Number(desk?.communityNo);
        }
      });
      // 检测是不是已经从个人桌面切换到社群桌面的处理逻辑
      const found = _.find(this.deskList, (desk) => {
        return String(this.currentDeskId) === String(desk.id);
      });

      // console.log("found-1", found);
      // console.log("found-2", found && !found?.communityNo);
      // console.log("filterDeskList[0]", filterDeskList[0]);
      // console.log("filterDeskList[0]", filterDeskList[0]?.id);

      if (found && !found?.communityNo) {
        this.setCurrentDeskId(filterDeskList[0]?.id);
      } else {
        if (Number(found?.communityNo) !== Number(this.currentComInfo.no)) {
          this.setCurrentDeskId(filterDeskList[0]?.id);
        }
      }
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
