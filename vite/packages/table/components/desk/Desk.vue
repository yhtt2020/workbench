<template>
  <div v-if="fullScreen" class="no-drag">
    <div style="position: absolute; right: 10px; top: 10px; z-index: 999">
      <xt-button @click="setFullScreen(false)" :w="40" :h="40" type="theme">
        <Icon style="font-size: 18px" icon="quxiaoquanping_huaban"></Icon>
      </xt-button>
    </div>
  </div>
  <div
    style="width: calc(100% + 8px); margin: -8px; height: calc(100% + 8px)"
    v-if="currentDesk.cards"
  >
    <div
      style="width: 100%; height: 100%"
      :class="notTrigger ? 'trigger' : ''"
      class="m-auto"
      v-if="currentDesk.cards.length === 0"
    >
      暂无卡片
    </div>
    <FloatMenu
      v-if="editing"
      @add="newAddCard"
      @set="showSetting"
      @hide="showDesk"
      @scrollbarRedirect="freeLayoutScrollbarRedirect"
      @exit="toggleEditing"
      @resetLayout="resetLayout"
      v-model:zoom="globalSettings.cardZoom"
      v-model:aloneZoom="settings.cardZoom"
      :alone="settings.enableZoom"
      :hide="hide"
    />
    <!-- 自由布局滚动 -->
    <FreeLayoutMask v-if="isFreeLayout && $route.path == '/main' && freeLayout">
      <FreeLayoutScrollbar ref="freeLayoutScrollbar" class="flex-1">
        <FreeLayoutCanvas class="home-widgets">
          <FreeLayoutContainer
            :currentDesk="currentDesk"
            :currentID="currentDesk.id"
            :isDrag="editing"
          >
            <template #box="{ data }">
              <component
                :desk="currentDesk"
                :is="data.name"
                :customIndex="data.id"
                :customData="data.customData"
              />
            </template>
          </FreeLayoutContainer>
        </FreeLayoutCanvas>
      </FreeLayoutScrollbar>
    </FreeLayoutMask>
    <vue-custom-scrollbar
      v-show="!isFreeLayout"
      class="no-drag"
      key="scrollbar"
      id="scrollerBar"
      :settings="{
        ...scrollbarSettings,
        suppressScrollY: settings.vDirection ? false : true,
        suppressScrollX: settings.vDirection ? true : false,
      }"
      style="
        position: relative;
        width: calc(100% + 4px);
        height: 100%;
        margin-left: 0;
        padding-left: 4px;
        padding-right: 4px;
        display: flex;
        flex-direction: row;
      "
    >
      <div
        id="cardContent"
        ref="deskContainer"
        style="
          /*display: flex;*/
          /*align-items: center;*/
          /*align-content: center;*/
        "
        :style="{
          // 'flex-direction': settings.vDirection?'row':'column',
          'padding-top': this.usingSettings.marginTop + 'px',
          width: settings.vDirection ? '100%' : 'auto',
          height: settings.vDirection ? 'auto' : '100%',
        }"
        :class="notTrigger ? 'trigger' : ''"
      >
        <vuuri
          v-show="showGrid"
          :key="key"
          v-if="
            (currentDesk.cards.length > 0 && !hide && !isFreeLayout) ||
            !freeLayout
          "
          item-key="id"
          :get-item-margin="
            () => {
              return usingSettings.cardMargin * this.adjustZoom + 'px';
            }
          "
          group-id="grid.id"
          :drag-enabled="editing"
          v-model="currentDesk.cards"
          :style="{
            width: settings.vDirection ? '100%' : 'auto',
            height: settings.vDirection ? 'auto' : '100%',
          }"
          class="grid home-widgets"
          ref="grid"
          :options="muuriOptions"
        >
          <template #item="{ item }">
            <div
              :style="{
                zoom: (
                  (usingSettings.cardZoom * this.adjustZoom) /
                  100
                ).toFixed(2),
              }"
            >
              <component
                :desk="currentDesk"
                :is="item.name"
                :customIndex="item.id"
                :customData="item.customData"
              >
              </component>
            </div>
          </template>
        </vuuri>
        <div
          class="xt-text"
          v-show="!showGrid"
          style="
            text-align: center;
            font-size: 32px;
            margin: auto;
            position: fixed;
            top: 50%;
            transform: translateY(-50%) translateX(-50%);
            left: 50%;
          "
        >
          <loading-outlined />
        </div>
      </div>
    </vue-custom-scrollbar>
  </div>

  <xt-modal
    v-model="settingVisible"
    :footer="0"
    title="桌面设置"
    boxClass="p-4 pb-0"
    :mask="0"
  >
    <template #header-center>
      <XtTab
        v-if="settingVisible"
        style="height: 34px; width: 300px"
        boxClass="p-1 xt-bg-2"
        :boxStyle="{ 'border-radius': '10px' }"
        :itemStyle="{ 'border-radius': '6px' }"
        v-model="currentSettingTab"
        :list="settingsTab"
      ></XtTab>
    </template>
    <div style="height: calc(66vh); width: 500px">
      <!-- 当前桌面设置 -->
      <template v-if="currentSettingTab === 'current' && currentDesk.settings">
        <CurrentDesk :fixedSettings="settings" :currentDesk="currentDesk" />
        <FreeLayoutState
          v-if="$route.path == '/main' && freeLayout"
          @scrollbarRedirect="freeLayoutScrollbarRedirect"
          @scrollbarUpdate="freeLayoutScrollbarUpdate"
          :id="currentDesk.id"
        ></FreeLayoutState>
      </template>
      <!-- 全局桌面设置 -->
      <template v-else>
        <GlobalDesk
          :globalSettings="globalSettings"
          :fixedFloat="settings.enableZoom"
          :freeFloat="isFreeLayout"
        />
        <!-- <template v-if="settings.enableZoom">
          <div class="mb-2" style="color: orangered">
            <icon icon="tishi-xianxing"></icon>
            当前桌面正在使用独立设置，此处设置对当前桌面不起作用。
          </div>
        </template> -->
        <slot name="settingsAllAfter"></slot>
      </template>
    </div>
  </xt-modal>

  <transition name="fade">
    <div
      class="home-blur"
      style="
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 999;
      "
      v-if="addCardVisible"
    >
      <NewAddCard
        @close="hideAddCard"
        @addSuccess="hideAddCard"
        :desk="currentDesk"
        @onBack="
          () => {
            this.addCardVisible = false;
          }
        "
      ></NewAddCard>
    </div>
  </transition>
  <AddIcon @close="iconHide" v-if="iconVisible" :desk="currentDesk"></AddIcon>
  <GalleryModal ref="galleryRef" />
  <!-- 111 -->
  <EditNewNavigation
    v-if="editVisible"
    @setQuick="editVisible = false"
    @addIcon="addIcon"
    :isFolder="true"
  ></EditNewNavigation>
</template>

<script>
// 挂载组件请到下面文件
import componentsMinis from "./components.ts";
import { useNavigationStore } from "./navigationBar/navigationStore";
import { navStore } from "../../store/nav";
import Muuri from "muuri";
import { message } from "ant-design-vue";
import { mapWritableState, mapActions } from "pinia";
import { appStore } from "../../store";
import { cardStore } from "../../store/card";
import { useWidgetStore } from "../card/store";
import { useFreeLayoutStore } from "./freeLayout/store";
import { useFloatMenuStore } from "./floatMenu/store";
import EditNewNavigation from "./navigationBar/EditNewNavigation.vue";
import _ from "lodash-es";
import { registerFolder } from "../../apps/folder/src/hooks/register";
import { LoadingOutlined } from "@ant-design/icons-vue";
import GalleryModal from "../paperModal/GalleryModal.vue";
import { useAddCard, file } from "../../ui/hooks/useAddCard";
import { useDeskStore } from "./set/store";
export default {
  name: "Desk",
  emits: ["changeEditing"],
  mixins: [componentsMinis],
  components: { LoadingOutlined, EditNewNavigation, GalleryModal },
  props: {
    freeLayout: {
      default: true,
    },
    deskGroupMenu: {
      default: () => {
        return [];
      },
    },
    globalSettings: {
      type: Object,
      default: {},
    },
    editing: {
      type: Boolean,
      required: true,
      default: false,
    },
    currentDesk: {
      type: Object,
      required: true,
      default: () => {
        return { cards: [] };
      },
    },
    muuriOptions: {
      type: Object,
      required: false,
      default: () => {
        return {
          // dragStartPredicate: {
          //   distance: 10,
          //   delay: 1000,
          // },
          dragAutoScroll: {},
          layout: {
            // fillGaps: true,
            // horizontal: false,
            alignRight: false,
            alignBottom: false,
            // rounding: true
          },
          targets: [
            {
              element: "#scrollerBar>div",
            },
          ],
          handle: null,
          threshold: 50,
          safeZone: 0.2,
          speed: Muuri.AutoScroller.smoothSpeed(1000, 2000, 2500),
          sortDuringScroll: true,
          smoothStop: false,
          onStart: null,
          onStop: null,
          dragSortPredicate: {
            threshold: 30,
          },
          dragSortHeuristics: {
            sortInterval: 10,
            minDragDistance: 5,
            minBounceBackAngle: Math.PI / 2,
          },
        };
      },
    },
    settings: {
      type: Object,
      required: false,
      default: {
        cardZoom: 100,
        marginTop: 0,
        cardMargin: 5, //卡片间隙
        vDirection: false,
      },
    },
    notTrigger: {
      type: Boolean,
      default: () => false,
    },
  },
  watch: {
    dropdownMenu: {
      handler(newVal) {
        this.menus = newVal;
      },
      deep: true,
      immediate: true,
    },
    loaded: {
      handler() {
        this.$nextTick(() => {
          setTimeout(() => {
            if (!window.showed) {
              window.showed = true;
            }
            this.showGrid = true;
          }, 1000);
        });
      },
    },
    currentDesk(newVal) {
      if (!this.isFreeLayout) {
        newVal.layoutSize = this.getLayoutSize();
        // if (!newVal.settings) {
        //   newVal.settings=
        //     .settings = {
        //     cardZoom: 100,
        //     marginTop: 0,
        //     cardMargin: 5,//卡片间隙
        //     vDirection: false,
        //   }
        // }
        this.muuriOptions.layout.horizontal = !newVal.settings?.vDirection;
      }
    },
    "currentDesk.settings": {
      handler(newVal) {
        if (!this.isFreeLayout) {
          if (!newVal) {
            newVal = {
              cardZoom: 100,
              marginTop: 0,
              cardMargin: 5, //卡片间隙
              vDirection: false,
            };
          }
          this.muuriOptions.layout.horizontal = !newVal.vDirection;
          this.currentDesk.settings = newVal;
          this.update();
        }
      },
      deep: true,
      immediate: true,
    },
    "currentDesk.settings.vDirection": {
      handler(newVal) {
        this.key = Date.now();
      },
      deep: true,
    },
  },
  computed: {
    ...mapWritableState(navStore, ["navigationToggle"]),
    ...mapWritableState(appStore, ["fullScreen"]),
    ...mapWritableState(useWidgetStore, ["rightModel"]),
    // getFreeLayoutState.value.system.hide
    ...mapWritableState(useFreeLayoutStore, [
      "isFreeLayout",
      "getFreeLayoutState",
    ]),
    ...mapWritableState(useFloatMenuStore, ["menus"]),
    ...mapWritableState(useNavigationStore, ["selectNav", "isDesk"]),
    ...mapWritableState(useDeskStore, ["autoOpenEdit"]),
    deskGroupMenus() {
      if (this.deskGroupMenu && this.deskGroupMenu.length > 1) {
        // let arr = _.cloneDeep(this.deskGroupMenu[1].children);
        let arr = [...this.deskGroupMenu[1].children];
        let exists = arr.findIndex((item) => item.id === 4);
        if (exists === -1) {
          arr.push({
            id: 4,
            newIcon: "fluent:circle-off-16-regular",
            name: "清空桌面",
            fn: () => {
              this.clear(this.currentDesk);
            },
          });
        } else {
          arr.splice(exists, 1, {
            id: 4,
            newIcon: "fluent:circle-off-16-regular",
            name: "清空桌面",
            fn: () => {
              this.clear(this.currentDesk);
            },
          });
        }
        arr.sort((a, b) => a.id - b.id);
        let deskGroupMenu = [...this.deskGroupMenu];
        deskGroupMenu[1].children = arr;
        return deskGroupMenu;
      }
      return [];
    },
    navMenu() {
      if (
        !this.navigationToggle[0] &&
        !this.navigationToggle[1] &&
        !this.navigationToggle[2]
      ) {
        return [
          {
            id: 10,
            newIcon: "fluent:eye-16-regular",
            name: "显示底部导航",
            fn: () => {
              this.navigationToggle[2] = true;
            },
          },
        ];
      }
      return [];
    },
    deskMenus() {
      let currentHide = null;
      if (this.isFreeLayout) {
        currentHide = this.getFreeLayoutState?.system?.hide;
      } else {
        currentHide = this.hide;
      }
      return [
        {
          id: 1,
          newIcon: "fluent:add-16-filled",
          name: "添加图标",
          fn: this.newAddIcon,
        },
        {
          id: 2,
          newIcon: "fluent:collections-add-24-regular",
          name: "添加小组件",
          fn: this.newAddCard,
        },
        {
          id: 4,
          newIcon: "fluent:app-folder-16-regular",
          name: "添加文件夹",
          fn: () => {
            registerFolder(this.currentDesk);
          },
        },
        { id: 5, divider: true },
        {
          id: 6,
          newIcon: this.editing
            ? "fluent:record-stop-16-regular"
            : "fluent:window-new-16-regular",
          name: this.editing ? "停止调整" : "调整桌面布局",
          fn: this.toggleEditing,
        },
        {
          id: 7,
          newIcon: "fluent:image-multiple-16-regular",
          name: "更换壁纸",
          fn: () => {
            this.$refs.galleryRef.openGalleryModal();
          },
        },
        {
          id: 8,
          newIcon: "fluent:full-screen-maximize-16-filled",
          name: "全屏桌面",
          fn: () => {
            let a = !this.fullScreen;
            this.setFullScreen(a);
          },
        },
        {
          id: 8,
          newIcon: this.hide
            ? "fluent:eye-16-regular"
            : "fluent:eye-off-16-regular",
          name: currentHide ? "显示小组件" : "隐藏小组件",
          fn: () => {
            if (this.isFreeLayout) {
              this.getFreeLayoutState.system.hide =
                !this.getFreeLayoutState?.system?.hide;
            } else {
              if (this.hide) {
                this.showDesk();
              } else {
                this.hideDesk();
              }
            }
          },
        },
        { id: 9, divider: true },
        {
          id: 9,
          newIcon: "fluent:settings-16-regular",
          name: "桌面设置",
          fn: this.showSetting,
        },
      ];
    },
    dropdownMenu() {
      let arr = [...this.deskGroupMenus, ...this.deskMenus, ...this.navMenu];
      arr.sort((a, b) => a.id - b.id);
      return arr;
    },
    usingSettings() {
      if (this.settings.enableZoom) {
        return this.settings;
      } else {
        return this.globalSettings;
      }
    },
  },
  data() {
    return {
      showGrid: false,
      loaded: false,
      vurriEnable: false,
      freeDeskEdit: false,
      freeDeskState: false,
      stashBound: { width: 0, height: 0, zoom: 0 },
      adjustZoom: 1,
      iconVisible: false,
      settingVisible: false,
      hide: false,
      key: Date.now(),
      menuVisible: false,
      addCardVisible: false,
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true,
        currentItemId: -1,
      },
      settingsTab: [
        { name: "通用设置", value: "all" },
        { name: "当前桌面", value: "current" },
      ],
      currentSettingTab: "all",
      resizeHandler: null,
      editVisible: false,
    };
  },
  beforeMount() {
    window.time = Date.now();
  },
  mounted() {
    this.$bus.on("startAdjust", () => {
      console.log("2222 :>> ", 2222);
      this.toggleEditing()
    });

    if (window.showed) {
      this.showGrid = true;
    }
    this.resizeHandler = () => {
      this.currentDesk.layoutSize = this.getLayoutSize();
    };
    this.getLayoutSize();
    window.addEventListener("resize", this.resizeHandler);
    this.loaded = true;
    this.resetLayout();
  },
  unmounted() {
    if (this.fullScreen) {
      this.fullScreen = false;
    }
    window.removeEventListener("resize", this.resizeHandler);
  },
  methods: {
    ...mapActions(useFreeLayoutStore, ["clearFreeLayoutData"]),
    ...mapActions(cardStore, ["addCard"]),
    resetLayout() {
      this.hide = true;
      setTimeout(() => {
        this.hide = false;
      }, 1);
    },
    freeLayoutScrollbarRedirect() {
      this.$refs.freeLayoutScrollbar.redirect();
    },
    freeLayoutScrollbarUpdate() {
      this.$refs.freeLayoutScrollbar.update();
    },
    learn() {
      browser.openInTable(
        "https://www.bilibili.com/video/BV1Th4y1o7SZ/?vd_source=2b7e342ffb60104849f5db6262bb1e0b"
      );
    },
    update(callback) {
      if (this.$refs.grid) {
        this.$refs.grid.update(callback);
      }
    },
    hideMenu() {
      this.menuVisible = false;
    },
    toggleEditing() {
      if (this.editing) {
        message.info("已关闭拖拽调整");
      } else {
        message.info("您可以直接拖拽图标调整位置");
      }
      this.muuriOptions.layout.horizontal = !this.settings.vDirection;
      this.$emit("changeEditing", this.editing);
      this.menuVisible = false;
      this.key = Date.now();
    },
    showSetting() {
      this.settingVisible = true;
      this.menuVisible = false;
    },
    hideDesk() {
      this.hide = !this.hide;
      this.menuVisible = false;
    },
    iconHide() {
      this.iconVisible = false;
    },

    showDesk() {
      this.hide = !this.hide;
      this.menuVisible = false;
    },
    clear(desk) {
      this.menuVisible = false;
      if (desk) {
        this.$xtConfirm("清空当前桌面的全部卡片？此操作不可还原。", "", {
          okText: "清空卡片",
          okButtonWidth: 100,
          type: "warning",
          ok: () => {
            desk?.cards?.forEach((item) => {
              //移除桌面相关的便签卡片
              if (item.name === "notes") {
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
            desk.cards = [];
            console.log(desk);
            this.menuVisible = false;
            this.clearFreeLayoutData();
          },
        });
      }
    },
    newAddCard() {
      if (this.autoOpenEdit) {
        this.toggleEditing();
      }
      this.addCardVisible = true;
      this.menuVisible = false;
    },
    hideAddCard() {
      this.addCardVisible = false;
    },
    onClose() {
      this.menuVisible = false;
    },
    showMenu() {
      if (!this.notTrigger && this.rightModel !== "follow")
        this.menuVisible = true;
    },
    // 添加图标
    newAddIcon() {
      // this.iconVisible = true;
      // this.menuVisible = false;
      this.editVisible = true;
      this.menuVisible = false;
      this.selectNav = "desktop";
      this.isDesk = true;
      console.log(this.selectNav, "selectNav");
    },
    file,
    useAddCard,
    addIcon(item, index) {
      const file = this.file(item);
      this.useAddCard("myIcons", {
        iconList: [{ ...file }],
        newIcon: true,
      });
      this.editVisible = false;
    },
    /**
     * 暂存布局，与restore结对使用。
     */
    stashLayout() {
      let bound = {
        width: this.$refs.deskContainer.clientWidth,
        height: this.$refs.deskContainer.clientHeight,
      };
      this.stashBound = bound;
    },
    /**
     * 恢复布局
     */
    restoreLayout(rate = 0) {
      if (rate) {
        this.adjustZoom = 1;
        this.update();
        return;
      }
      let bound = {
        width: this.$refs.deskContainer.clientWidth,
        height: this.$refs.deskContainer.clientHeight,
      };
      this.adjustZoom = bound.height / this.stashBound.height;
      this.update();
    },
    /**
     * 获取当前布局的宽高
     * @returns {{width: number, height: number}}
     */
    getLayoutSize() {
      if (!this.isFreeLayout) {
        this.currentDesk.layoutSize = {
          width: this.$refs.deskContainer.clientWidth,
          height: this.$refs.deskContainer.clientHeight,
        };
        if (this.currentDesk?.settings?.preparing) {
          message.loading({
            content: "此桌面为首次使用，正在为您适配您的桌面…",
            key: "preparing",
          });
          this.setFullScreen(true, () => {
            setTimeout(() => {
              this.$nextTick(() => {
                const fullLayoutSize = {
                  width: this.$refs.deskContainer.clientWidth,
                  height: this.$refs.deskContainer.clientHeight,
                };
                const settings = this.currentDesk.settings;
                const oldLayoutSize = this.settings.layoutSize;
                settings.cardZoom = (
                  (settings.cardZoom * fullLayoutSize.height) /
                  oldLayoutSize.height /
                  this.adjustZoom
                ).toFixed();
                settings.cardMargin = (
                  (settings.cardMargin * fullLayoutSize.height) /
                  oldLayoutSize.height /
                  this.adjustZoom
                ).toFixed();
                //todo竖屏界面不一样
                message.success({
                  content: "此桌面为首次使用，已为您适配您的当前窗口。",
                  key: "preparing",
                });
                settings.preparing = false;
                this.setFullScreen(false);
                delete settings.layoutSize;
              });
            }, 1000);
          });
        }
      }
      return this.currentDesk.layoutSize;
    },
    setFullScreen(flag, cb = null) {
      console.log("flag :>> ", flag);
      this.stashLayout();
      this.fullScreen = flag;
      this.$nextTick(() => {
        if (flag === false) {
          this.restoreLayout(1);
        } else {
          this.restoreLayout();
        }
        if (cb) cb();
      });
    },
    getAdjustZoom() {
      return this.adjustZoom;
    },
  },
};
</script>

<style scoped lang="scss">
.grid {
  position: relative;
  //display: inline-block;
  white-space: pre-wrap;
  border-radius: 4px;
  vertical-align: top;
  margin-right: 0px !important;
  margin-left: 4px !important;
  //left: 0;
  //right: 0;
  //height:3000px;
  //max-width: 100%;
}

.trigger {
  pointer-events: none;
}
</style>
<style lang="scss">
.home-widgets {
  .muuri-item {
    padding: 0;
  }

  /**
  .muuri-item {
  }
  */

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
<style scoped lang="scss">
.grid {
  position: relative;
  //display: inline-block;
  //width: 43em;
  border-radius: 4px;
  vertical-align: top;

  margin-left: 10px;
  margin-right: 10px;

  .editing {
    pointer-events: none;
    cursor: move;
  }
}

.editing {
  pointer-events: none;
  cursor: move !important;
}

.btn {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

//@media screen and (min-height: 1020px) and (max-height: 1600px) {
//  #scrollerBar {
//    height: 880px;
//
//    .grid {
//      height: 880px;
//    }
//  }
//}
//
//@media screen and (max-height: 1021px) {
//  #scrollerBar {
//    height: 438px;
//
//    .grid {
//      height: 438px;
//    }
//  }
//}
</style>
