<!-- 社群桌面 -->
<template>
  <!-- 管理员桌面 -->
  <template v-if="currentComRole">
    <div class="relative flex flex-col h-full">
      <!--  工具栏 xt-main-top-util-bar 元素定位类不可删-->
      <xt-mix-menu class="w-full h-full" :menus="deskMenu" ref="mixMenu">
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
        <!-- 空状态 -->
        <template v-else>
          <slot name="empty">
            <div class="flex items-center justify-center w-full h-full">
              <div class="panel-top xt-bg">
                <!-- 社群基础信息 -->
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
                    deskItemStyle="width:327px; height:290px"
                    :closeParent="true"
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
              :communityNo="currentComInfo.no"
              :editing="editing"
              :key="key"
              :currentDesk="currentDesk"
            >
            </Desk>
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

  <!-- 成员桌面 -->
  <template v-else>
    <div class="relative flex flex-col h-full">
      <xt-mix-menu class="w-full h-full" :menus="deskMenu" ref="mixMenu">
        <Desk
          ref="currentDeskRef"
          v-if="currentDesk && currentDesk?.cards?.length > 0"
          @changeEditing="editing = !editing"
          :global-settings="settings"
          :editing="editing"
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
        <template v-else>
          <slot name="empty">
            <div class="flex items-center justify-center w-full h-full">
              <NonAdminEmpty />
            </div>
          </slot>

          <span v-show="false">
            <Desk ref="currentDeskRef" />
            <!--  :communityNo="currentComInfo.no"
              :editing="editing"
              :key="key"
              :currentDesk="currentDesk" -->
          </span>
        </template>
      </xt-mix-menu>

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
          :desks="communityDeskList"
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
      :items="communityDeskList"
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
          :desks="communityDeskList"
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

  <!-- 分享桌面 -->
  <ShareDesk
    :deskList="communityDeskList"
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

  <!-- 推荐桌面预览 -->
  <div style="z-index: 10001">
    <DeskPreview
      @afterAdded="afterAdded"
      :deskList="communityDeskList"
      :scheme="scheme"
      :addDesk="addDesk"
      :showModal="showModal"
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
      :deskList="communityDeskList"
      @onClose="hideMarket"
      :desk="currentDesk"
      :panelIndex="panelIndex"
    />
  </div>

  <!-- 文件输入框 -->
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
import menuMinis from "../hooks/communityMenu";
import _ from "lodash-es";
import { communityDeskStore } from "../store/communityDeskStore";

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
      /**隐藏桌面组件参数**/
      comHide: false,
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

    // 获取推荐桌面数据
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
    ...mapWritableState(communityDeskStore,["syncCommunityDesk"]),

    /**当前社群的角色权限**/
    currentComRole() {
      return this.currentCommunity?.item?.role === "owner";
    },

    /**当前社群基本信息**/
    currentComInfo() {
      return this.currentCommunity?.item;
    },

    // 当前社群桌面列表
    communityDeskList() {
      const filterList = _.filter(this.deskList, (desk) => {
        if (desk.communityNo) {
          return Number(this.currentComInfo.no) === Number(desk.communityNo);
        }
      });
      // console.log("当前社群桌面列表", filterList);
      return filterList;
    },

    // 桌面下拉菜单
    deskMenu() {
      /**当前社群具备管理员资格**/
      if (this.currentComRole) {
        return this.communityMenus;
      } else {
        return this.memberMenus;
      }
    },

    // 当前桌面
    currentDesk() {
      // console.log("当前桌面数据列表", this.deskList);
      let currentDesk = this.deskList.find((desk) => {
        if (desk.communityNo) {
          return desk.id === this.currentDeskId;
        }
      });
      this.key = Date.now();
      return currentDesk;
    },

    // 桌面置顶数据
    displayDesks() {
      const deskLists = [
        ...this.communityDeskList.filter((desk) => {
          return desk.pin;
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
      console.log("置顶排序", topArr);
      return topArr;
    },

    // 点击桌面
    clickDesk() {
      this.step = -1;
      this.taskID = this.taskTmp;
      this.taskTmp = "";
    },
  },

  watch: {
    // 监听当前社群变化
    currentComInfo: {
      handler(newVal) {
        // 加载当前社群桌面数据
        this.loadCommunityCloud();

        // 监听社群角色权限
        if (newVal.role === "owner") {
          console.log("管理员",this.syncCommunityDesk);
          // 检测当前列表是否为空
          if(this.communityDeskList.length === 0){
            this.doAddDesk("空白桌面");
          }
        } else {
          console.log("成员",this.syncCommunityDesk);
        }

        
        // 检测桌面是个人桌面还是社群桌面
        const idArr = [
          this.currentDeskId?.slice(0, -4),
          this.currentDeskId?.slice(-4),
        ];
        // 匹配当前桌面id是否与当前社群相关联
        const startWithNum = /^\d/;
        if (!startWithNum.test(this.currentDeskId)) {
          this.setCurrentDeskId(this.communityDeskList[0]?.id);
          return;
        } else {
          if (Number(this.currentComInfo.no) !== Number(idArr[0])) {
            this.setCurrentDeskId(this.communityDeskList[0]?.id);
            return;
          }
          return;
        }

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
      "syncCommunityDesk",
      "loadCommunityDeskAll",
      "loadCommunityDeskDetail",
    ]),

    // 桌面操作
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
    showAddDeskForm() {
      this.$refs.currentDeskRef.hideMenu();
      this.addDeskVisible = true;
      this.menuVisible = false;
    },
    setCurrentDeskId(id) {
      this.$emit("update:currentDeskId", id);
      this.$emit("changeDesk", { id: id });
      this.loadCommunityDeskDetail(id);
    },
    moreDesk() {
      this.panelIndex = 1;
      this.addDeskVisible = false;
      this.deskMarketVisible = true;
    },
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
    closeExport(val) {
      this.exportModal = val;
    },
    closeShare() {
      this.shareDeskVisible = false;
    },
    setFullScreen(flag = true) {
      this.$refs.currentDeskRef.setFullScreen(flag);
    },
    shareDesk() {
      this.$refs.shareDeskRef.update();
      this.$refs.shareDeskRef.setSelectVal(this.currentDeskId);
      this.shareDeskVisible = true;
      this.$refs.currentDeskRef.hideMenu();
    },
    addCard() {
      this.$refs.currentDeskRef.newAddCard();
    },
    newAddCard() {
      this.$refs.currentDeskRef.newAddCard();
      this.keepAddIcon = false;
    },
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

    // 推荐桌面
    openPreview({ scheme, showModal, addDesk }) {
      this.scheme = scheme;
      this.showModal = showModal;
      this.addDesk = addDesk;
    },
    closePreview() {
      this.showModal = false;
    },
    afterAdded() {
      completeTask("m0203");
      this.hideMarket();
    },

    // 分组
    closeGroup() {
      this.addDeskVisible = false;
    },

    // 添加
    addIcon() {
      this.$refs.currentDeskRef.newAddIcon();
      this.keepAddIcon = true;
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

    // 解决桌面卡片数据重置
    cleanMuuriData(list) {
      list.forEach((li) => {
        li.id = nanoid(8);
        delete li["_$muuri_id"];
      });
      return [...list];
    },

    //  更新
    update() {
      this.$refs.currentDeskRef.update();
    },
    learn() {
      this.$refs.currentDeskRef.learn();
    },

    // 鼠标事件
    handleMouseLeave() {
      this.$bus.emit("startHide");
    },
    handleMouseEnter() {
      this.$bus.emit("stopHide");
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

    // 管理员桌面数据同步云端
    syncSaveCommunity() {
      this.setCurrentDeskNo(this.currentComInfo.no);
      this.setCurrentDeskAllList(this.communityDeskList);
      this.setCurrentDeskData(this.currentDesk);
      this.syncCommunityDesk();
    },

    // 桌面全屏按钮 当前桌面全屏先保留,后期需要再调用这个方法
    handleDeskFullScreen() {
      this.toggleFullScreen();
    },

    // 加载社群云端数据
    loadCommunityCloud() {
      this.setCurrentDeskNo(this.currentComInfo.no);
      this.loadCommunityDeskAll();
      this.loadCommunityDeskDetail(this.currentDesk.id);
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