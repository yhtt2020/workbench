<template>
  <div class="relative flex flex-col h-full">
    <!--  工具栏 xt-main-top-util-bar 元素定位类不可删-->
    <xt-mix-menu ref="mixMenu" :menus="menus" class="w-full h-full">
      <!-- 导航栏 -->
      <template #extraMenu>
        <ExtraMenu/>
      </template>
      <Desk
        v-if="currentDesk && currentDesk?.cards?.length > 0"
        :key="currentDeskId"
        ref="currentDeskRef"
        v-model:settings="currentDesk.settings"
        :currentDesk="currentDesk"
        :editing="editing"
        :global-settings="settings"
        :keepAddIcon="keepAddIcon"
        @changeEditing="editing = !editing"
        @onArrange="onArrange"
      >
        <!-- 拿菜单数据 -->
        <template #settingsAllAfter>
          <slot name="settingsAll"></slot>
        </template>
      </Desk>
      <template v-else>
        <slot name="empty">
          <!-- 111 -->
          <div
            class="flex items-center justify-center w-full h-full"
            style="height: 100% !important"
          >
            <div class="panel-top xt-bg" style="">
              <div class="text-center">
                <div class="line-title xt-text" style="">快速搭建你的桌面</div>
                <div class="mt-2 font-16 xt-text-2">
                  你可以将系统桌面或资源管理器中的应用程序快捷方式或文件拖动到桌面，或者选择以下推荐的桌面搭建方式。
                </div>
                <div
                  class="flex justify-center w-full mt-6 justify-items-center align-items-center"
                >
                  <xt-button
                    key="console"
                    :h="40"
                    :w="113"
                    class="ml-3 xt-bg-t-2"
                    type="primary"
                    @click="addIcon"
                  >
                    <div class="flex">
                      <xt-new-icon
                        class="mr-2"
                        icon="fluent:add-16-regular"
                        size="20"
                      ></xt-new-icon>
                      添加图标
                    </div>
                  </xt-button>
                  <xt-button
                    key="console"
                    :h="40"
                    :w="113"
                    class="ml-3 xt-bg-t-2"
                    type="primary"
                    @click="newAddCard"
                  >
                    <div class="flex">
                      <xt-new-icon
                        class="mr-2"
                        icon="fluent:collections-add-24-regular"
                        size="20"
                      ></xt-new-icon>
                      添加组件
                    </div>
                  </xt-button>
                  <xt-button
                    key="console"
                    :h="40"
                    :w="113"
                    class="ml-3 xt-bg-t-2"
                    type="primary"
                    @click="moreDesk"
                  >
                    <div class="flex">
                      <xt-new-icon
                        class="mr-2"
                        icon="fluent:building-shop-16-regular"
                        size="20"
                      ></xt-new-icon>
                      桌面市场
                    </div>
                  </xt-button>
                  <xt-button
                    key="console"
                    :h="40"
                    :w="113"
                    class="ml-3 xt-bg-t-2"
                    type="primary"
                    @click="importDesk"
                  >
                    <div class="flex">
                      <xt-new-icon
                        class="mr-2"
                        icon="fluent:arrow-download-20-filled"
                        size="20"
                      ></xt-new-icon>
                      导入桌面
                    </div>
                  </xt-button>
                  <xt-button
                    key="console"
                    :h="40"
                    :w="113"
                    class="ml-3 xt-active-bg"
                    type="primary"
                    @click="onArrange"
                  >
                    <div class="flex">
                      <xt-new-icon
                        class="mr-2"
                        icon="fluent:app-folder-16-regular"
                        size="20"
                      ></xt-new-icon>
                      图标整理
                    </div>
                  </xt-button>
                  <!-- <xt-button :w="113" :h="40"  @click="newAddCard" class="ml-3 xt-bg-2" key="console" >
                    <icon class="mr-1" icon="tianjia2"></icon>添加组件
                  </xt-button> -->
                </div>
              </div>
              <div class="line-title xt-text" style="margin-top: 20px">
                使用推荐桌面方案
              </div>
              <vue-custom-scrollbar
                :scrollbarSettings="scrollbarSettings"
                class="mt-4"
                style="width: 100%; height: 315px"
              >
                <DeskMarket
                  :addDesk="false"
                  :closeParent="true"
                  :desks="deskList"
                  :items="recommendList"
                  :wrapperStyle="{
                    height: '100%',
                    flexWrap: 'nowrap',
                    overflow: 'visible',
                    width: 'auto',
                  }"
                  deskItemStyle="width:327px; height:290px"
                  @openPreview="openPreview"
                ></DeskMarket>
              </vue-custom-scrollbar>
            </div>
          </div>
        </slot>
        <span v-show="false">
          <Desk
            :key="key"
            ref="currentDeskRef"
            :currentDesk="currentDesk"
            :editing="editing"
          >
          </Desk>
        </span>
      </template>
    </xt-mix-menu>
    <div
      v-if="showTopBar && !fullScreen"
      class="flex flex-row xt-main-top-util-bar desk-group-switcher"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <xt-task id="D0001" no="1" @cb="clickDesk">
        <!-- tabs   -->
        <div class="panel s-bg">
          <div v-if="showTabs" class="flex flex-row tabs">
            <!--      <div @click="setCurrentDeskId('0')" :class="{'tab-active':currentDeskId==='0'}" class="pr-3 home game-tab game-bg">-->
            <!--        <icon class="icon" style="font-size: 22px;" icon="desktop"></icon>-->
            <!--        主桌面-->
            <!--      </div>-->
            <div
              v-for="(item, index) in displayDesks"
              :class="{ 'tab-active': currentDeskId === item.id }"
              class="pr-3 truncate tab s-bg xt-text"
              @click="setCurrentDeskId(item.id)"
            >
              <a-avatar
                v-if="item.iconUrl"
                :size="22"
                :src="item.iconUrl"
                class="mr-2 icon"
                shape="square"
              ></a-avatar>
              <icon
                v-else
                :icon="item.icon || 'desktop'"
                class="mr-2"
                style="font-size: 18px; vertical-align: middle"
              ></icon>
              <span class="">{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="flex dots item-content">
          <div
            v-for="(item, index) in displayDesks"
            :class="{ active: currentDeskId === item.id }"
            class="dot"
          >
            &nbsp;
          </div>
        </div>
      </xt-task>

      <div v-if="false">
        <div class="flex flex-row ml-1">
          <slot name="toolsBefore"></slot>
          <!--          <a-tooltip v-if="!editing" title="开始调整桌面" placement="bottom">-->
          <!--            <div-->
          <!--              @click="startEdit"-->
          <!--              class="flex items-center justify-center w-10 h-10 ml-3 rounded-md btn-bg no-drag pointer"-->
          <!--            >-->
          <!--              <icon-->
          <!--                class="icon"-->
          <!--                style="font-size: 22px"-->
          <!--                icon="line-dragdroptuofang"-->
          <!--              ></icon>-->
          <!--            </div>-->
          <!--          </a-tooltip>-->
          <!--          <a-tooltip v-else title="停止调整桌面" placement="bottom">-->
          <!--            <div-->
          <!--              @click="stopEdit"-->
          <!--              class="flex items-center justify-center w-10 h-10 ml-3 rounded-md btn-bg no-drag pointer"-->
          <!--            >-->
          <!--              <icon-->
          <!--                class="icon"-->
          <!--                style="font-size: 22px; color: red"-->
          <!--                icon="tingzhi"-->
          <!--              ></icon>-->
          <!--            </div>-->
          <!--          </a-tooltip>-->
          <!--          <a-tooltip title="全屏" placement="bottom">-->
          <!--            <div-->
          <!--              @click="setFullScreen"-->
          <!--              class="flex items-center justify-center w-10 h-10 ml-3 rounded-md btn-bg no-drag pointer"-->
          <!--            >-->
          <!--              <Icon style="font-size: 18px" icon="fullscreen"></Icon>-->
          <!--            </div>-->
          <!--          </a-tooltip>-->
          <a-tooltip placement="bottom" title="菜单">
            <div class="pl-3">
              <!--
                <xt-mix-menu
                  :menus="$refs.currentDeskRef?.dropdownMenu"
                  model="all"
                  :stopPropagation="false"
                >
                  <div
                    @click="showMenu"
                    class="flex items-center justify-center w-10 h-10 rounded-md btn-bg no-drag pointer"
                  >
                    <xt-new-icon
                      size="18"
                      icon="fluent:more-horizontal-16-filled"
                    />
                  </div>
                </xt-mix-menu>
          -->
            </div>
          </a-tooltip>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加桌面 弹窗 -->

  <xt-modal
    v-if="addDeskVisible"
    v-model="addDeskVisible"
    :footer="false"
    :header="true"
    :index="100"
    :mask="false"
  >
    <div style="width: 800px; height: 518px">
      <div class="font-semibold text-center font-16 xt-text">添加桌面</div>
      <div class="flex justify-center mt-6">
        <xt-button
          key="console"
          :h="40"
          :w="145"
          class="ml-3 xt-bg-2"
          type="primary"
          @click="doAddDesk('空白桌面')"
        >
          <div class="flex">
            <xt-new-icon
              class="mr-2"
              icon="fluent:desktop-16-regular"
              size="20"
            ></xt-new-icon>
            创建空白桌面
          </div>
        </xt-button>
        <xt-button
          key="console"
          :h="40"
          :w="145"
          class="ml-3 xt-bg-2"
          type="primary"
          @click="importDesk"
        >
          <div class="flex">
            <xt-new-icon
              class="mr-2"
              icon="fluent:arrow-download-20-filled"
              size="20"
            ></xt-new-icon>
            导入桌面文件
          </div>
        </xt-button>
        <xt-button
          key="console"
          :h="40"
          :w="145"
          class="ml-3 xt-active-bg"
          type="primary"
          @click="aiCustom"
        >
          <div class="flex">
            <xt-new-icon
              class="mr-2"
              icon="fluent:bot-24-regular"
              size="20"
            ></xt-new-icon>
            桌面智能定制
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
          :closeParent="true"
          :desks="deskList"
          :items="recommendList"
          deskItemStyle="width:317px; height:284px;"
          @openPreview="openPreview"
        ></DeskMarket>
      </div>
    </div>
  </xt-modal>

  <a-drawer
    v-model:visible="allDeskListVisible"
    height="220"
    placement="bottom"
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
      @visibleChanged=""
    ></AllDeskList>
  </a-drawer>

  <!-- v-if="addDeskVisible" -->
  <a-drawer
    v-if="false"
    v-model:visible="addDeskVisible"
    title="添加桌面"
    width="500"
    @close="shareCode = false"
  >
    <HorizontalPanel
      v-model:select-type="currentAddTab"
      :nav-list="currentAddMethod"
    >
    </HorizontalPanel>
    <div v-if="currentAddTab.name === 'market'">
      <!--      <div class="p-2 pb-0 mt-2 text-lg">您可以使用其他用户共享给您的分享码直接添加，也可以从桌面市场选择适合的桌面添加。</div>-->
      <!--      <div class="p-2 pt-0">-->
      <!--        <a-input v-model:value="deskCode" spellcheck="false" class="input" placeholder="使用分享码添加"-->
      <!--                 aria-placeholder="font-size: 16px;"/>-->
      <!--        <div class="w-full btn-item xt-active-bg" style=" margin:0;">使用分享码添加</div>-->

      <!--      </div>-->
      <div class="flex justify-between">
        <span class="flex items-center">
          <span class="mr-2 desk-title">热门桌面</span>
          <Icon icon="daohang_remen-xuanzhong" style="font-size: 20px"></Icon>
        </span>
        <div class="btn-item" style="width: 160px" @click="moreDesk">
          更多桌面分享
        </div>
      </div>
      <div>
        <DeskMarket
          :closeParent="true"
          :desks="deskList"
          :items="recommendList"
          deskItemStyle="width:435px; height:auto;"
          @openPreview="openPreview"
        ></DeskMarket>
      </div>
    </div>
    <div v-else>
      <div class="mt-4 desk-title">标题</div>
      <a-input
        v-model:value="deskTitle"
        aria-placeholder="font-size: 16px;"
        class="input"
        placeholder="请输入"
        spellcheck="false"
      />
      <span class="desk-title">初始布局</span>
      <div class="mt-6">
        <HorizontalPanel
          v-model:selectType="selectDesk"
          :navList="deskType"
        ></HorizontalPanel>
      </div>
      <!-- <div @click="doAddDesk" class="btn-item xt-active-bg xt-text">立即添加</div> -->
      <xt-button
        class="mt-4"
        style="width: 100%"
        type="theme"
        @click="doAddDesk"
      >立即添加
      </xt-button>

      <div>
        <div class="btn-item" @click="importDesk">导入桌面</div>
      </div>
    </div>
    <template v-if="shareCode" #extra></template>
    <div v-if="!shareCode"></div>
    <div v-else>
      <span class="desk-title">分享码</span>
      <a-input
        v-model:value="deskCode"
        aria-placeholder="font-size: 16px;"
        class="input"
        placeholder="请输入"
        spellcheck="false"
      />
    </div>
  </a-drawer>
  <!-- 分享桌面小组件 -->
  <ShareDesk
    ref="shareDeskRef"
    :deskList="deskList"
    :deskRef="$refs.currentDeskRef"
    @closeShare="closeShare"
  ></ShareDesk>
  <ExportDesk
    :desks="deskList"
    :layoutSize="layoutSize"
    :openModal="exportModal"
    @closeExport="closeExport"
  ></ExportDesk>
  <div style="z-index: 9999">
    <DeskPreview
      :deskList="deskList"
      :scheme="scheme"
      :showModal="showModal"
      @afterAdded="afterAdded"
      @closeGroup="closeGroup"
      @closePreview="closePreview"
    ></DeskPreview>
  </div>
  <div
    v-if="deskMarketVisible"
    class=""
    style="position: fixed; top: 0; right: 0; left: 0; bottom: 0; z-index: 999"
  >
    <NewAddCard
      v-if="deskMarketVisible"
      :desk="currentDesk"
      :deskList="deskList"
      :panelIndex="panelIndex"
      @onClose="hideMarket"
    ></NewAddCard>
  </div>
  <input ref="fileRef" style="display: none" type="file"/>
</template>

<script>
import Desk from "./Desk.vue";
import {useNavigationStore} from "../desk/navigationBar/navigationStore";
import {appStore} from "../../store";
import {taskStore} from "../../apps/task/store";
import {mapActions, mapWritableState} from "pinia";
// import GameListDrawer from "../game/GameListDrawer.vue";
import AllDeskList from "./AllDeskList.vue";
import {message, Modal, notification} from "ant-design-vue";
import HorizontalPanel from "../HorizontalPanel.vue";
import ExportDesk from "./ExportDesk.vue";
import {nanoid} from "nanoid";
// import Template from "../../../user/pages/Template.vue";

import {deskTemplates} from "../../js/data/deskTemplates";
import DeskMarket from "../../page/app/card/DeskMarket.vue";
import {deskStore} from "../../store/desk";
import ShareDesk from "./ShareDesk.vue";
import NewAddCard from "../../page/app/card/NewAddCard.vue";
import DeskPreview from "./DeskPreview.vue";
import {marketStore} from "../../store/market";
import Icon from "../Icon.vue";
import VueCustomScrollbar from "../../../../src/components/vue-scrollbar.vue";
import Emoji from "../comp/Emoji.vue";
import {useFreeLayoutStore} from "./freeLayout/store";
import {useFloatMenuStore} from "./floatMenu/store";
import {useDeskStore} from "./store";
import {completeTask} from "../../apps/task/task";
import NewGuidePage from "../../page/app/grade/NewGuidePage.vue";
import ExtraMenu from "../../components/windowPanel/components/ExtraMenu.vue";
import {localCache} from "../../js/axios/serverCache";
import { EMPTY_DESK } from '../../js/const/default'

export default {
  name: "DeskGroup",
  components: {
    Emoji,
    VueCustomScrollbar,
    Icon,
    DeskPreview,
    NewAddCard,
    ShareDesk,
    DeskMarket,
    // Template,
    ExportDesk,
    HorizontalPanel,
    AllDeskList,
    // GameListDrawer,
    Desk,
    NewGuidePage,
    ExtraMenu,
  },
  emits: ["update:currentDeskId", "showMore",'changeDesk'],
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
          },
          // {
          //   id: 8,
          //   newIcon: this.hide
          //     ? "fluent:eye-16-regular"
          //     : "fluent:eye-off-16-regular",
          //   name: currentHide ? "显示小组件" : "隐藏小组件",
          //   fn: () => {
          //     let currentHide = null;
          //     if (this.isFreeLayout) {
          //       currentHide = this.getFreeLayoutState?.system?.hide;
          //     } else {
          //       currentHide = this.hide;
          //     }
          //     if (this.isFreeLayout) {
          //       this.getFreeLayoutState.system.hide =
          //         !this.getFreeLayoutState?.system?.hide;
          //     } else {
          //       if (this.hide) {
          //         this.showDesk();
          //       } else {
          //         this.hideDesk();
          //       }
          //     }
          //   },
          //   disabled: false,
          // },
          {
            id: 9,
            newIcon: "akar-icons:trash-can",
            name: "删除桌面",
            fn: this.delDesk,
            color: "#FF4D4F",
          },
        ],
      },
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
        currentItemId: -1,
      },
      currentAddTab: {name: "market"},
      key: Date.now(),
      moreDesksVisible: false, //显示更多桌面
      allDeskListVisible: false,
      editing: false, //编辑桌面

      addDeskVisible: false,
      deskType: [
        {title: "日常桌面", name: "daily"},
        {title: "游戏桌面", name: "game"},
        {title: "办公桌面", name: "work"},
        {title: "空白桌面", name: "empty"},
      ],
      selectDesk: {title: "日常桌面", name: "daily"},
      deskTitle: "",
      hotDesk: [],
      scheme: {},
      showModal: false,
      deskCode: "",
      shareCode: false,
      exportModal: false,
      layoutSize: {width: 0, height: 0},
      deskMarketVisible: false, //桌面市场
      panelIndex: 0,
      currentAddMethod: [
        {title: "从市场添加", name: "market"},
        {title: "自行添加", name: "custom"},
      ],
      recommendList: [], //推荐桌面

      keepAddIcon: false, // 保持添加图标
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

    // 过滤出个人桌面数据
    const filterList = this.deskList.filter((desk) => {
      return !desk.hasOwnProperty("communityNo");
    });
    // 从社群桌面切换到个人桌面的操作
    const found = this.deskList.find((desk) => {
      return String(desk.id) === String(this.currentDeskId);
    });
    if (found && found.hasOwnProperty("communityNo")) {
      this.setCurrentDeskId(filterList[0]?.id);
    }

    // 个人桌面正常操作
    if (this.deskList.length > 0) {
      this.currentDesk = this.deskList[0];
    }
    this.deskList.forEach((desk) => {
      if (!desk.id) {
        desk.id = desk.nanoid;
      }
    });

    this.hotDesk.push(this.apiList[0].children[0]);
    let cache=localCache.get('recommendDesks')
    if(cache){
      this.recommendList=cache
    }else{
      this.getRecommend({goodType: "desk"}).then(data => {
        if(data){
          this.recommendList = data
          localCache.set('recommendDesks',data,500)
        }
      })
    }

  },
  computed: {
    ...mapWritableState(deskStore, ["apiList"]),
    ...mapWritableState(appStore, ["fullScreen", "showGuide", "guideList"]),
    ...mapWritableState(taskStore, ["taskID", "step", "taskTmp"]),
    ...mapWritableState(useDeskStore, ["menus"]),

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

    currentDesk() {
      let currentDesk = this.deskList.find((desk) => {
        return desk.id === this.currentDeskId;
      });
      if (currentDesk) {
        this.key = Date.now();
        return currentDesk;
      }
      // 这一步是为了解决,深度监听currentDesk中没有settings导致报错无法进行走下去处理逻辑
      else {
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

    displayDesks() {
      // 这里做桌面列表中是否有社群的桌面,以及处理桌面id不为undefined。
      const filterNewList = this.deskList.filter((desk) => {
        return !desk.hasOwnProperty("communityNo") && desk.id !== undefined;
      });
      const newDeskList = [
        ...filterNewList.filter((desk) => {
          return desk.pin;
        }),
        ...filterNewList.filter((desk) => {
          return !desk.pin;
        }),
      ];
      const sortList = newDeskList.sort((a, b) => {
        if (b.pin) {
          //置顶的桌面排最前面
          return 9999999999999;
        }
        return Number(b.order || 0) - Number(a.order || 0);
      });

      return sortList;
    },
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

    /**监听当前桌面数据的变化**/
    deskList: {
      handler() {
        const filterList = this.deskList.filter((desk) => {
          return !desk.hasOwnProperty("communityNo");
        });
        if (filterList.length > 0) {
          // this.currentDesk = filterList[0];
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
    clickDesk() {
      this.step = -1;
      this.taskID = this.taskTmp;
      this.taskTmp = "";
    },

    closeShowGuide() {
      this.showGuide = false;
    },
    // 图标整理
    onArrange() {
      if (!this.showGuide) {
        this.guideList = [1];
        this.showGuide = true;
      } else {
        message.info("定制过程中无法操作");
      }
    },
    // 智能定制
    aiCustom() {
      if (window.$usePlat()) {
        this.guideList = [0, 2];
      } else {
        this.guideList = [0, 1, 2];
      }
      this.showGuide = true;
      message.info("开始桌面定制");
      this.addDeskVisible = false;
      this.doAddDesk("定制桌面");
    },
    startTask(e) {
      let ref = this.$refs.mixMenu;
      ref.custom(e);
    },
    handleMouseEnter() {
      this.$bus.emit("stopHide");
    },
    handleMouseLeave() {
      this.$bus.emit("startHide");
    },
    update() {
      this.$refs.currentDeskRef.update();
    },
    newAddCard() {
      if (!this.showGuide) {
        this.$refs.currentDeskRef.newAddCard();
      } else {
        message.info("定制过程中无法操作");
      }
      this.keepAddIcon = false;
    },
    learn() {
      this.$refs.currentDeskRef.learn();
    },
    closePreview() {
      this.showModal = false;
      //this.getHomeSize()
    },
    closeGroup() {
      this.addDeskVisible = false;
    },
    hideMarket() {
      this.deskMarketVisible = false;
    },
    afterAdded() {
      // completeTask('m0104')
      completeTask("m0203");
      this.hideMarket();
    },
    openPreview({scheme, showModal, addDesk}) {
      this.scheme = scheme;
      this.showModal = showModal;
      this.addDesk = addDesk;
    },
    shareDesk() {
      if (!this.showGuide) {
        setTimeout(() => {
          this.$refs.shareDeskRef.showShareType();
           this.$refs.shareDeskRef.update();
           this.$refs.shareDeskRef.setSelectVal(this.currentDeskId);
        },500);
      } else {
        message.info("定制过程中无法操作");
      }
    },
    closeShare() {
      this.$refs.shareDeskRef.close()
    },
    startEdit() {
      this.key = Date.now();
      this.editing = true;
      this.$refs.currentDeskRef.update();
    },
    stopEdit() {
      this.key = Date.now();
      this.editing = false;
    },
    addCard() {
      this.$refs.currentDeskRef.newAddCard();
    },
    moreDesk() {
      if (!this.showGuide) {
        this.panelIndex = 1;
        this.addDeskVisible = false;
        this.deskMarketVisible = true;
      } else {
        message.info("定制过程中无法操作");
      }
    },
    setFullScreen(flag = true) {
      this.$refs.currentDeskRef.setFullScreen(flag);
    },
    showMenu() {
      this.$refs.currentDeskRef.showMenu();
    },
    showMore() {
      this.$emit("showMore");
    },
    setCurrentDeskId(id) {
      if (this.showGuide) {
        message.info("定制过程中无法操作");
        return
      }
      this.$emit("update:currentDeskId", id);
      this.$emit("changeDesk", {id: id});
    },
    showAll() {
      this.allDeskListVisible = true;
    },
    async importDesk() {
      // openFile
      let that = this;
      this.$bus.emit("openFile", (file) => {
        console.log("file :>> ", file);
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
    // 读取文件配置
    async readConfig(file) {
      if (!this.showGuide) {
        // let importJsonTxt = require("fs").readFileSync(openPath[0], "utf-8");
        let needImportDesk;
        // console.log("importJsonTxt :>> ", importJsonTxt);

        // try {
        needImportDesk = JSON.parse(file);
        const {desk, freeLayoutData, freeLayoutState} = needImportDesk;
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
          g.id = nanoid(8);
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
        // 1
        // } catch (e) {
        //   console.warn(e);
        //   message.error("导入失败，请检查代码。");
        // }
      } else {
        message.info("定制过程中无法操作");
      }
    },
    showAddDeskForm() {
      if (!this.showGuide) {
        this.menuVisible = false;
        this.addDeskVisible = true;
      } else {
        message.info("定制过程中无法操作");
      }
    },

    exportDesk() {
      if (this.$useEnv("guest")) {
        console.log("访客模式下无法导出桌面");
        window.$ui.confirm("访客模式下无法导出桌面", "", {
          type: "warning",
        });
        return;
      }
      if (!this.showGuide) {
        this.layoutSize = this.$refs.currentDeskRef.getLayoutSize();
        this.exportModal = true;
      } else {
        message.info("定制过程中无法操作");
      }
    },
    closeExport(val) {
      this.exportModal = val;
    },

    // 添加图标
    addIcon() {
      if (!this.showGuide) {
        this.$refs.currentDeskRef.newAddIcon();
        this.keepAddIcon = true;
      } else {
        message.info("定制过程中无法操作");
      }
    },

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
        //初始桌面模式修改为居中垂直
        settings:{
          vDirection:true,
          fitMod:'center',
          enableZoom:true,
          cardMargin:6,
          containerWidth:1200
        }
      };
      if (deskName) {
        desk.cards = this.cleanMuuriData(
          EMPTY_DESK
        );
      }

      this.deskList.unshift(desk);
      this.$emit("changeDesk", {id: desk.id});
      this.deskTitle = "";
      this.key = Date.now();
      this.addDeskVisible = false;
      completeTask("m0104");
      // completeTask('m0203')
    },

    delDesk() {
      // 这一步是为了解决数组中误传桌面id为undefined的数据,需要进行删除操作处理。
      const index = this.deskList.findIndex((desk) => {
        return desk.id === undefined;
      });
      if (index !== -1) {
        this.deskList.splice(index, 1);
      }

      // 定制桌面时需要屏蔽删除功能
      if (!this.showGuide) {
        // 第一次过滤
        const firstList = this.filterPersonalDeskList(this.deskList);
        if (firstList.length === 1) {
          window.$ui.confirm("至少保留一个桌面。", "", {
            noText: null,
            type: "warning",
          });
          return;
        } else {
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
              const index = this.deskList.findIndex((desk) => {
                return desk === this.currentDesk;
              });
              this.deskList.splice(index, 1);
              // 二次过滤
              const secondaryList = this.filterPersonalDeskList(this.deskList);
              this.$emit("changeDesk", {id: secondaryList[0]?.id});
              this.clearFreeLayout(this.currentDeskId);
              // 删除桌面数据
              this.key = Date.now();
              if (this.displayDesks.length === 1) {
                notification.open({
                  message: "提示",
                  description:
                    "当前可用桌面为1个，自动为您隐藏切换桌面菜单。至少有2个桌面的时候才会显示快速切换栏。",
                });
              }
            },
          });
        }
      } else {
        message.info("定制过程中无法操作");
      }
    },

    cleanMuuriData(list) {
      list.forEach((li) => {
        li.id = nanoid(8);
        delete li["_$muuri_id"];
      });
      return [...list];
    },

    // 过滤个人桌面的数据
    filterPersonalDeskList(list) {
      const filterDesk = list.filter((desk) => {
        return !desk.hasOwnProperty("communityNo") && desk.id !== undefined;
      });
      return filterDesk;
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
  margin-top: 54px;
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
