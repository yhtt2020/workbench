<template>
  <div class="flex flex-col h-full">
    <!--  工具栏-->
    <div class="mb-2 flex flex-row" v-if="showTopBar && !fullScreen">
      <!-- tabs   -->
      <div class="tabs flex flex-row mb-3 ml-3" v-if="showTabs && displayDesks.length>1">
        <!--      <div @click="setCurrentDeskId('0')" :class="{'tab-active':currentDeskId==='0'}" class="pr-3 home game-tab game-bg">-->
        <!--        <icon class="icon" style="font-size: 22px;" icon="desktop"></icon>-->
        <!--        主桌面-->
        <!--      </div>-->
        <div
          :class="{ 'tab-active': currentDeskId === item.id }"
          @click="setCurrentDeskId(item.id)"
          style="width: 140px"
          class="truncate pr-3 tab s-bg xt-text"
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
          <div
            v-if="currentDeskId === item.id"
            style="border-bottom: 3px solid var(--active-bg)"
          ></div>
        </div>
        <a-tooltip title="全部桌面" placement="bottom">
          <div
            @click="showAll"
            class="btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3"
          >
            <icon
              class="icon"
              style="font-size: 22px"
              icon="paixu-zuoyou"
            ></icon>
          </div>
        </a-tooltip>
      </div>

      <div v-if="showTools">
        <div class="ml-1 flex flex-row">
          <slot name="toolsBefore"></slot>
<!--          <a-tooltip v-if="!editing" title="开始调整桌面" placement="bottom">-->
<!--            <div-->
<!--              @click="startEdit"-->
<!--              class="btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3"-->
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
<!--              class="btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3"-->
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
<!--              class="btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3"-->
<!--            >-->
<!--              <Icon style="font-size: 18px" icon="fullscreen"></Icon>-->
<!--            </div>-->
<!--          </a-tooltip>-->
          <a-tooltip title="菜单" placement="bottom">

            <div class="pl-3">
              <xt-task :modelValue="getStep" @cb="showMenu">
                <RightMenu :menus='$refs.currentDeskRef?.dropdownMenu' model='click'>
                  <div
                    @click="showMenu"
                    class="btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center"
                  >
                    <xt-new-icon size='18' icon="fluent:more-horizontal-16-filled"/>
                  </div>
                </RightMenu>
              </xt-task>

            </div>
          </a-tooltip>
        </div>
      </div>
    </div>
    <div v-if="fullScreen" class="no-drag">
      <div style="position: absolute; right: 10px; top: 10px; z-index: 999">
        <div
          @click="setFullScreen(false)"
          class="btn-bg no-drag pointer w-10 rounded-md flex justify-center items-center ml-3"
        >
          <Icon style="font-size: 18px" icon="quxiaoquanping_huaban"></Icon>
        </div>
      </div>
    </div>
    <div
      style="flex: 1; height: 0"
      v-if="currentDesk && currentDesk?.cards?.length > 0"
    >
      <Desk
        :deskGroupMenu='deskGroupMenu'
        @changeEditing="editing = !editing"
        :global-settings="settings"
        :editing="editing"
        ref="currentDeskRef"
        :currentDesk="currentDesk"
        v-model:settings="currentDesk.settings"
        :key="currentDeskId"

      >
        <!-- 拿菜单数据 -->
        <template #settingsAllAfter>
          <slot name="settingsAll"></slot>
        </template>

        <template #outMenu>
          <a-row class="text-center" style="margin-top: 20px" :gutter="20">
            <xt-task :modelValue="mixTask" to="" @cb="showAddDeskForm">
              <a-col>
                <div @click="showAddDeskForm" class="btn">
                  <Icon style="font-size: 3em" icon="desktop"></Icon>
                  <div><span>添加桌面</span></div>
                </div>
              </a-col>
            </xt-task>

            <a-col>
              <div @click="importDesk" class="btn">
                <Icon style="font-size: 3em" icon="daoru"></Icon>
                <div><span>导入桌面</span></div>
              </div>
            </a-col>
            <a-col>
              <div
                v-if="this.currentDesk.lock"
                class="btn"
                style="opacity: 0.5"
              >
                <Icon style="font-size: 3em" icon="shanchu"></Icon>
                <div><span>删除桌面</span></div>
              </div>
              <div v-else @click="delDesk" class="btn">
                <Icon style="font-size: 3em" icon="shanchu"></Icon>
                <div><span>删除桌面</span></div>
              </div>
            </a-col>
            <a-col>
              <div @click="shareDesk" class="btn">
                <Icon style="font-size: 3em" icon="fenxiang"></Icon>
                <div><span>分享桌面</span></div>
              </div>
            </a-col>
            <a-col>
              <div @click="exportDesk" class="btn">
                <Icon style="font-size: 3em" icon="upload"></Icon>
                <div><span>导出桌面</span></div>
              </div>
            </a-col>
          </a-row>
        </template>
      </Desk>
    </div>
    <template v-else>
      <slot name="empty">
        <div
          class="s-bg rounded-3xl p-4"
          style="width: 80%; height: auto; margin: auto"
        >
          <div class="text-center">
            <div
              class="line-title xt-text"
              style="font-size: 24px; margin-bottom: 10px"
            >
              欢迎使用完全DIY的卡片桌面
            </div>

            <!--            <p style="font-size: 16px">-->
            <!--              <strong class="xt-text"><icon icon="smile" style="font-size: 1.2em"></icon> 您可以通过桌面设置调节卡片到合适的大小</strong>-->
            <!--            </p>-->
            <div class="w-full flex justify-items-center justify-center align-items-center ">
              <xt-button :w="160"
                         style="color: var(--active-text)"
                         @click="moreDesk"
                         class="mr-10 xt-active-bg rounded-full border-none  "
                         key="console"
                         type="primary"
              >
                <icon class="mr-1" icon="shop" style="font-size: 18px"></icon
                >&nbsp;查看桌面市场
              </xt-button>
              <xt-button :w="140"
                         @click="newAddCard"
                         class="mr-10 rounded-full xt-bg-2 border-none"
                         key="console"
              >
                <icon class="mr-1" icon="tianjia2"></icon>&nbsp;DIY添加卡片
              </xt-button>
            </div>
          </div>
          <div class="text-center mt-5 xt-text" style="font-size: 18px">
            推荐桌面
          </div>
          <vue-custom-scrollbar
            :scrollbarSettings="scrollbarSettings"
            class="mt-3"
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
              deskItemStyle="width:385px; height:300px"
            ></DeskMarket>
          </vue-custom-scrollbar>
        </div>
      </slot>
      <span v-show="false">
        <Desk
          ref="currentDeskRef"
          :currentDesk="currentDesk"
          :deskGroupMenu='deskGroupMenu'
          :key="key"
          :editing="editing"
        >
          <template #outMenu>
            <a-row class="text-center" style="margin-top: 20px" :gutter="20">
              <a-col>
                <div @click="showAddDeskForm" class="btn">
          <xt-new-icon  icon='fluent:eye-off-16-regular' size='42' />
                  <div><span>添加桌面</span></div>
                </div>
              </a-col>
              <a-col>
                <div @click="importDesk" class="btn">
          <xt-new-icon  icon='fluent:arrow-download-20-filled' size='42' />

                  <div><span>导入桌面</span></div>
                </div>
              </a-col>
              <a-col>
                <div
                  v-if="this.currentDesk.lock"
                  class="btn"
                  style="opacity: 0.5"
                >
          <xt-new-icon  icon='akar-icons:trash-can' size='42' />

                  <div><span>删除桌面</span></div>
                </div>
                <div v-else @click="delDesk" class="btn">
                  <Icon style="font-size: 3em" icon="shanchu"></Icon>
                  <div><span>删除桌面</span></div>
                </div>
              </a-col>
              <a-col>
                <div @click="shareDesk" class="btn">
          <xt-new-icon  icon='fluent:share-android-24-regular' size='42' />
                  <div><span>分享桌面</span></div>
                </div>
              </a-col>
              <a-col>
                <div @click="exportDesk" class="btn">
          <xt-new-icon  icon='fluent:open-20-filled' size='42' />
                  <div><span>导出桌面</span></div>
                </div>
              </a-col>
            </a-row>
          </template>
        </Desk>
      </span>
    </template>
  </div>

  <a-drawer
    height="220"
    placement="bottom"
    v-model:visible="allDeskListVisible"
  >
    <AllDeskList
      :activeId="currentDeskId"
      :items="deskList"
      @visibleChanged=""
      @valueChanged="
        (event) => {
          setCurrentDeskId(event.id);
          this.allDeskListVisible = false;
        }
      "
    ></AllDeskList>
  </a-drawer>

  <a-drawer
    v-if="addDeskVisible"
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
    <xt-task :modelValue="M03023">
    </xt-task>
    <div v-if="currentAddTab.name === 'market'">

      <!--      <div class="p-2 mt-2 text-lg pb-0">您可以使用其他用户共享给您的分享码直接添加，也可以从桌面市场选择适合的桌面添加。</div>-->
      <!--      <div class="p-2 pt-0">-->
      <!--        <a-input v-model:value="deskCode" spellcheck="false" class="input" placeholder="使用分享码添加"-->
      <!--                 aria-placeholder="font-size: 16px;"/>-->
      <!--        <div class="btn-item xt-active-bg w-full" style=" margin:0;">使用分享码添加</div>-->

      <!--      </div>-->
      <div class="flex justify-between">
        <span class="flex items-center">
          <span class="desk-title mr-2">热门桌面</span>
          <Icon style="font-size: 20px" icon="daohang_remen-xuanzhong"></Icon>
        </span>
        <xt-task :modelValue="M03024" @cb="moreDesk">
          <div class="btn-item" @click="moreDesk" style="width: 160px">
            更多桌面分享
          </div>
        </xt-task>
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

      <xt-task :modelValue="M01023">
      </xt-task>


      <div class="desk-title mt-4">标题</div>
      <a-input
        v-model:value="deskTitle"
        spellcheck="false"
        class="input"
        placeholder="请输入"
        aria-placeholder="font-size: 16px;"
      />
      <xt-task :modelValue="M01024" @cb="doAddDesk">
        <span class="desk-title">初始布局</span>
        <div class="mt-6">
          <HorizontalPanel
            :navList="deskType"
            v-model:selectType="selectDesk"
          ></HorizontalPanel>
        </div>
        <!-- <div @click="doAddDesk" class="btn-item xt-active-bg xt-text">立即添加</div> -->
        <xt-button style="width: 100%;" type="theme" @click="doAddDesk" class="mt-4">立即添加</xt-button>
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
  <ShareDesk
    :deskList="deskList"
    ref="shareDeskRef"
    :deskRef="$refs.currentDeskRef"
    :openDrawer="shareDeskVisible"
    @closeShare="closeShare"
  ></ShareDesk>
  <ExportDesk
    :openModal="exportModal"
    @closeExport="closeExport"
    :layoutSize="layoutSize"
    :desks="deskList"
  ></ExportDesk>

  <div style="z-index: 9999">
    <DeskPreview
      @afterAdded="afterAdded"
      :deskList="deskList"
      :scheme="scheme"
      :showModal="showModal"
      @closePreview="closePreview"
    ></DeskPreview>
  </div>
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
</template>

<script lang="ts">
import Desk from "./Desk.vue";
import {appStore} from "../../store";
import {taskStore} from "../../apps/task/store";
import {mapActions, mapWritableState, mapWritableState} from "pinia";
import GameListDrawer from "../game/GameListDrawer.vue";
import AllDeskList from "./AllDeskList.vue";
import {message, Modal, notification} from "ant-design-vue";
import HorizontalPanel from "../HorizontalPanel.vue";
import ExportDesk from "./ExportDesk.vue";
import {nanoid} from "nanoid";
import Template from "../../../user/pages/Template.vue";

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
import RightMenu from "./RightMenu.vue"
import { useFreeLayoutStore } from "./freeLayout/store";
export default {
  name: "DeskGroup",
  components: {
    RightMenu,
    Emoji,
    VueCustomScrollbar,
    Icon,
    DeskPreview,
    NewAddCard,
    ShareDesk,
    DeskMarket,
    Template,
    ExportDesk,
    HorizontalPanel,
    AllDeskList,
    GameListDrawer,
    Desk,
  },
  emits: ["update:currentDeskId", "showMore"],
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
      deskGroupMenu: [
        {
          id: 3,
          newIcon: "fluent:slide-add-16-regular",
          name: "添加桌面",
          fn: this.showAddDeskForm
        },
        {
          id: 9,
          newIcon: "fluent:more-horizontal-16-filled",
          name: "更多",
            lock:true,
          children: [
            {
              id: 1,
              newIcon: "fluent:arrow-download-20-filled",
              name: "导入桌面",
              fn: this.importDesk
            },
            {
              id: 2,
              newIcon: "fluent:open-20-filled",
              name: "导出桌面",
              fn: this.exportDesk
            },
            {
              id: 3,
              newIcon: "fluent:share-android-24-regular",
              name: "分享桌面",
              fn: this.shareDesk
            },
            {
              id: 5,
              newIcon: "akar-icons:trash-can",
              name: "删除桌面",
              fn: this.delDesk
            }

          ],
        }
      ],
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
      shareDeskVisible: false,
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
    };
  },
  async mounted() {
    if (this.deskList.length > 0) {
      this.currentDesk = this.deskList[0];
    }
    this.deskList.forEach((desk) => {
      if (!desk.id) {
        desk.id = desk.nanoid;
      }
    });

    this.hotDesk.push(this.apiList[0].children[0]);
    this.recommendList = await this.getRecommend({goodType: "desk"});
  },
  computed: {
    ...mapWritableState(deskStore, ["apiList"]),
    ...mapWritableState(appStore, ["fullScreen"]),
    ...mapWritableState(taskStore, ["taskID", "step"]),
    ...mapWritableState(useFreeLayoutStore, [    'freeLayoutData','freeLayoutState']),
    getStep() {
      if ((this.taskID == "M0101" || this.taskID == "M0102" || this.taskID == "M0103" || this.taskID == "M0201" || this.taskID == "M0302") && this.step == 1) {
        return true;
      }
    },
    M01022() {
      return this.taskID == "M0102" && this.step == 2;
    },
    M03022() {
      return this.taskID == "M0302" && this.step == 2;
    },
    mixTask() {
      return this.M01022 || this.M03022
    },
    M01023() {
      return this.taskID == "M0102" && this.step == 3
    },
    M03023() {
      return this.taskID == "M0302" && this.step == 3
    },
    M03024() {
      return this.taskID == "M0302" && this.step == 4
    },
    M01024() {
      return this.taskID == "M0102" && this.step == 4
    },
    // getHomeSize(){
    //   this.$nextTick(() => {
    //     let height = document.getElementById("cardContent")?.offsetHeight;
    //     let width= document.getElementById("cardContent")?.offsetWidth;
    //     const windowHeight = document.documentElement.clientHeight // 高
    //     let windowWidth = document.documentElement.clientWidth // 宽
    //     let size = {
    //       width,
    //       height,
    //       windowHeight,
    //       windowWidth,
    //     }
    //     // console.log(cardsHeight)
    //     console.log(size,'输出')
    //     this.setDeskSize(size)
    //   })
    // },
    currentDesk() {
      let currentDesk = this.deskList.find((desk) => {
        return desk.id === this.currentDeskId;
      });
      this.key = Date.now()
      return currentDesk;
    },

    displayDesks() {
      return [
        ...this.deskList.filter((desk) => {
          return desk.pin;
        }),
        ...this.deskList.filter((desk) => {
          return !desk.pin;
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
    },
  },
  methods: {
    ...mapActions(marketStore, ["getRecommend"]),
    ...mapActions(useFreeLayoutStore,['clearFreeLayout']) ,
    newAddCard() {
      this.$refs.currentDeskRef.newAddCard();
    },
    learn() {
      this.$refs.currentDeskRef.learn();
    },
    closePreview() {
      this.showModal = false;
      //this.getHomeSize()
    },
    hideMarket() {
      this.deskMarketVisible = false;
    },
    afterAdded() {
      this.hideMarket();
    },
    openPreview({scheme, showModal}) {
      this.scheme = scheme;
      this.showModal = showModal;
    },
    shareDesk() {
      this.$refs.shareDeskRef.update();
      this.$refs.shareDeskRef.setSelectVal(this.currentDeskId);
      this.shareDeskVisible = true;
      this.$refs.currentDeskRef.hideMenu();
    },
    closeShare() {
      this.shareDeskVisible = false;
    },
    startEdit() {
      this.key = Date.now();
      this.editing = true;
      this.$refs.currentDeskRef.update();
    },
    stopEdit() {
      this.key = Date.now();
      this.editing = false;
    console.log('11111 :>> ', 11111);
    },
    addCard() {
      this.$refs.currentDeskRef.newAddCard();
    },
    moreDesk() {
      this.panelIndex = 1;
      this.addDeskVisible = false;
      this.deskMarketVisible = true;
    },
    setFullScreen(flag = true) {
      this.$refs.currentDeskRef.stashLayout();
      this.fullScreen = flag;
      this.$nextTick(() => {
        if (flag === false) {
          this.$refs.currentDeskRef.restoreLayout(1);
        } else {
          this.$refs.currentDeskRef.restoreLayout();
        }
      });
    },
    showMenu() {
      this.$refs.currentDeskRef.showMenu();
    },
    showMore() {
      this.$emit("showMore");
    },
    setCurrentDeskId(id) {
      this.$emit("update:currentDeskId", id);
      this.$emit('changeDesk',{id:id})
    },
    showAll() {
      this.allDeskListVisible = true;
    },
    async importDesk() {
      let openPath = await tsbApi.dialog.showOpenDialog({
        title: "选择导入的代码",
        filters: [{name: "desk存档", extensions: ["desk"]}],
      });
      if (!openPath) {
        return;
      }
      let importJsonTxt = require("fs").readFileSync(openPath[0], "utf-8");
      let needImportDesk:any ;

      try {
        needImportDesk = JSON.parse(importJsonTxt);
        const  {desk,  freeLayoutData,  freeLayoutState } =needImportDesk
        let cardsHeight = document.getElementById("cardContent")?.offsetHeight;
         desk.forEach((g) => {
          let oldId= g.id


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
          g.id = window.$models.nanoid.nanoid(8);
  if (freeLayoutState[oldId] ) {
              this.freeLayoutData[g.id] = freeLayoutData[oldId]
              this.freeLayoutState[g.id] =freeLayoutState[oldId]
            }
          this.deskList.unshift(g);
        });
        this.addDeskVisible = false;
        message.success("为您成功导入" + desk.length + "个桌面。");
      } catch (e) {
        console.warn(e);
        message.error("导入失败，请检查代码。");
      }
    },
    showAddDeskForm() {
      if (this.M01022) {
        this.deskTitle = '新桌面'
        this.currentAddTab = {
          "title": "自行添加",
          "name": "custom",
          "state": false
        }
      }


      this.$refs.currentDeskRef.hideMenu();
      this.menuVisible = false;
      this.addDeskVisible = true;
    },
    delDesk() {
      if (this.deskList.length === 1) {
        Modal.info({
          content: "至少保留一个桌面",
          centered: true,
        });
        return;
      } else {
        this.$refs.currentDeskRef.hideMenu();
        Modal.confirm({
          centered: true,
          content: "删除当前桌面？此操作不可还原。",
          onOk: () => {
            this.deskList.splice(
              this.deskList.findIndex((desk) => {
                return desk === this.currentDesk;
              }),
              1
            );
            this.$emit("changeDesk", {id: this.deskList[0].id});
          this.clearFreeLayout(this.currentDeskId)
            // 删除桌面数据
            this.key = Date.now();
            if (this.displayDesks.length === 1) {
              notification.open(
                {
                  message: '提示',
                  description: '当前可用桌面为1个，自动为您隐藏切换桌面菜单。至少有2个桌面的时候才会显示快速切换栏。'
                }
              )
            }
          },
          okText: "删除桌面",
        });
      }
    },
    exportDesk() {
      this.$refs.currentDeskRef.hideMenu();
      this.layoutSize = this.$refs.currentDeskRef.getLayoutSize();
      this.exportModal = true;
    },
    closeExport(val) {
      this.exportModal = val;
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
      let desk = {
        name: this.deskTitle,
        id: nanoid(4),
        icon: "desktop",
        cards: this.cleanMuuriData(deskTemplates[this.selectDesk.name]),
      };

      this.deskList.unshift(desk);
      this.$emit("changeDesk", {id: desk.id});
      this.deskTitle = "";
      this.key = Date.now();
      this.addDeskVisible = false;
    },
    cleanMuuriData(list) {
      list.forEach((li) => {
        li.id = nanoid(8);
        delete li["_$muuri_id"];
      });
      return [...list];
    },
  },
};
</script>

<style scoped lang="scss">
.tabs {
  .tab {
    .icon {
      margin-top: -1px;
      vertical-align: text-top;
    }

    cursor: pointer;

    &.tab-active,
    &:hover {
      opacity: 1;
      font-weight: bold;
    }

    line-height: 38px;
    font-size: 15px;
    min-width: 150px;
    border-radius: 4px;
    margin-right: 10px;
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
</style>
