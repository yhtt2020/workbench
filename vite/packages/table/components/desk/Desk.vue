<template>
  <div v-if="fullScreen && noFullScreen" class="no-drag">
    <div style="position: absolute; right: 75px; top: 16px; z-index: 999">
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

    <!--
      communityInfo?.role !== 'member' ? editing : showRightMenu
      这里做社群桌面是否为成员场景的情况
    -->
    <FloatMenu
      v-if="communityInfo?.role !== 'member' ? editing : showRightMenu"
      @addIcon="newAddIcon"
      @addFolder="addFolder"
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
      :communityInfo="communityInfo"
    />

    <!-- 图标拖拽放置区域和桌面大小 -->
    <Drop :classes="getClasses()">
      <!-- 自由布局 -->
      <FreeLayoutScrollbar
        v-if="freeLayout"
        ref="freeLayoutScrollbar"
        class="flex-1"
      >
        <FreeLayoutCanvas
          class="home-widgets"
          v-if="isFreeLayout == true && $route.path == '/' && freeLayout"
        >
          <FreeLayoutContainer
            :currentDesk="currentDesk"
            :currentID="currentDesk.id"
            :isDrag="editing"
          >
            <template #box="{ data }">
              <component
                :desk="currentDesk"
                :is="data?.name"
                :customIndex="data?.id"
                :customData="data?.customData"
                :key="data?.id"
              />
            </template>
          </FreeLayoutContainer>
        </FreeLayoutCanvas>
      </FreeLayoutScrollbar>

      <!-- 默认布局 -->
      <div
        class="h-full"
        style="max-width: 100%; max-height: 100%"
        v-show="!isFreeLayout"
        :style="{ width: getWidth(), height: getHeight() }"
      >
        <vue-custom-scrollbar
          :class="previewFlag ? 'z-50' : ''"
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
            width: 100%;
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
            <!-- 加载状态 -->
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
              <LoadingOutlined />
            </div>
          </div>
        </vue-custom-scrollbar>
      </div>
    </Drop>
  </div>
  <!-- 添加小组件 -->
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
        v-if="addCardVisible"
        :desk="currentDesk"
        @close="hideAddCard"
        @addSuccess="hideAddCard"
        @onBack="
          () => {
            this.addCardVisible = false;
            console.log('返回');
          }
        "
      ></NewAddCard>
    </div>
  </transition>
  <AppCenter v-if="visible" />
  <!-- 添加图标 -->
  <EditNewNavigation
    v-if="editVisible"
    :communityRole="communityInfo?.role ? true : false"
    @setQuick="editVisible = false"
    @addIcon="addIcon"
  ></EditNewNavigation>
</template>

<script>
// 挂载组件请到下面文件
import componentsMinis from "./components.ts";
import { LoadingOutlined } from "@ant-design/icons-vue";
import menuMinis from "./menus.ts";
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
import EditNewNavigation from "./addIcon/EditNewNavigation.vue";
import _ from "lodash-es";
import { registerFolder } from "../../apps/folder/src/hooks/register";
import { useAddCard } from "../../ui/hooks/useAddCard";
import { useDeskStore } from "./store";
import { useFileConversionIcon } from "../../apps/folder/src/hooks/useDataConversion";
import { taskStore } from "../../apps/task/store";
import { DEFAULT } from "../../js/const/default";
import Drop from "./Drop.vue";
import AppCenter from "../../apps/appCenter";
import { useAppCenterStore } from "../../apps/appCenter/src/store";
export default {
  name: "Desk",
  emits: ["changeEditing"],
  mixins: [componentsMinis, menuMinis],
  components: {
    AppCenter,
    EditNewNavigation,
    Drop,
    LoadingOutlined,
  },
  props: {
    keepAddIcon: {
      default: false,
    },
    freeLayout: {
      default: true,
    },
    noFullScreen: {
      default: true,
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
      required: false,
    },
    muuriOptions: {
      type: Object,
      required: false,
      default: () => {
        return {
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
    communityInfo: {
      type: Object,
      required: false,
    },
    // 社群成员桌面下开启右键菜单
    showRightMenu: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  watch: {
    /**
     * 原则上需要监听的数据应该是具体的数据
     * 而不是currentDesk整个对象
     */
    // currentDesk() {
    // },
    adjustLayout(val) {
      if (val) {
        this.toggleEditing();
        this.adjustLayout = false;
      }
    },
    deskMenus: {
      handler(newVal) {
        this.deskMenus.forEach((item) => {
          this.addMenu(item);
        });
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
    deskSize: {
      handler(newVal) {
        if (!this.isFreeLayout) {
          this.currentDesk.layoutSize = this.getLayoutSize();
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
      deep: false,
      immediate: true,
    },
    // 监听ID变化
    "currentDesk.id": {
      handler(newVal) {
        this.key=Date.now()
        this.updateIndependentBg();
        // 同步更新自由布局ID
        this.freeLayoutId = newVal;
        this.$bus.off("startAdjust");
        this.$bus.off("scrollbarUpdate");
        this.$bus.off("redirect");
        let obj = {
          id: 20,
          newIcon: "fluent:more-horizontal-16-filled",
          name: "更多",
          lock: true,
          children: [
            {
              id: 6,
              newIcon: "fluent:circle-off-16-regular",
              name: "清空桌面",
              fn: () => {
                this.clear(this.currentDesk);
              },
            },
          ],
        };
        this.addMenu(obj);
      },
      deep: true,
      immediate: true,
    },
    "currentDesk.settings.bg": {
      handler(newVal) {
        this.updateIndependentBg();
      },
      deep: true,
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
        if (typeof newVal.bg !== "object") {
          this.currentDesk.settings.bg = {
                start: false,
                mode: "img",
                imgValue: DEFAULT.WALLPAPER,
                colorValue: "#508BFE",
              }
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
    ...mapWritableState(appStore, ["fullScreen", "showGuide"]),
    ...mapWritableState(useWidgetStore, ["rightModel"]),
    ...mapWritableState(useFreeLayoutStore, [
      "isFreeLayout",
      "previewFlag",
      "freeLayoutId",
    ]),
    ...mapWritableState(useFloatMenuStore, ["menus"]),
    ...mapWritableState(useNavigationStore, ["selectNav", "isDesk"]),
    ...mapWritableState(useDeskStore, [
      "autoOpenEdit",
      "adjustLayout",
      "deskSize",
    ]),
    ...mapWritableState(useAppCenterStore, ["visible"]),
    // 根据当前桌面配置确定展示的对应桌面设置
    currentDeskEnv() {
      if (this.isFreeLayout || 0) {
        return "current";
      }
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
      stashBound: { width: 0, height: 0, zoom: 0 },
      adjustZoom: 1,
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

      resizeHandler: null,
      editVisible: false,
    };
  },
  mounted() {
    // 自动打开编辑
    this.$bus.on("startAdjust", () => {
      this.toggleEditing();
    });
    this.$bus.on("scrollbarUpdate", () => {
      this.freeLayoutScrollbarUpdate();
    });
    this.$bus.on("setIndependentBg", (val) => {
      if (!val) {
        this.currentDesk.settings.bg.start = false;
        return;
      }
      this.currentDesk.settings.bg.start = true;
      this.currentDesk.settings.bg.mode = "img";
      this.currentDesk.settings.bg.imgValue = val;
    });
    // 社群成员桌面触发位置还原
    this.$bus.on("redirect", () => {
      this.$nextTick(() => {
        this.$refs.freeLayoutScrollbar?.redirect();
      });
    });

    if (window.showed) {
      this.showGrid = true;
    }
    this.loaded = true;
  },
  unmounted() {
    if (this.fullScreen) {
      this.fullScreen = false;
    }
  },
  methods: {
    ...mapActions(useFreeLayoutStore, ["clearFreeLayoutData"]),
    ...mapActions(cardStore, ["addCard"]),
    ...mapActions(useDeskStore, ["addMenu"]),
    // ...mapActions(taskStore, ["initTask"]),
    /**
     * 用于处理独立壁纸
     */
    updateIndependentBg() {
      // 获取设置中独立壁纸对象
      let bg = this.currentDesk.settings?.bg;
      // 当不使用独立壁纸时
      if (!bg || !bg?.start) {
        this.$bus.emit("updateIndependentBg", false);
        return;
      }
      this.$bus.emit("updateIndependentBg", bg);
      return bg.value;
    },
    getClasses() {
      if (this.usingSettings.vDirection) {
        if (this.usingSettings.vDirection === true) {
          return "flex flex-row justify-center";
        } else {
          return "flex flex-column  content-center";
        }
      }
    },
    getWidth() {
      // console.log(this.usingSettings.fixedLayout);
      if (this.usingSettings.fitMod === "full") {
        return "100%";
      } else {
        if (this.usingSettings.vDirection === true) {
          return (
            (this.usingSettings.containerWidth || this.deskSize.width) + "px"
          );
        } else {
          return "100%";
        }
      }
    },
    getHeight() {
      if (this.settings.fitMod === "full") {
        return "100%";
      } else {
        if (this.usingSettings.vDirection === true) {
          return "100%";
        } else {
          return (
            (this.usingSettings.containerHeight || this.deskSize.height) + "px"
          );
        }
      }
    },
    addFolder() {
      if (!this.showGuide) {
        registerFolder(this.currentDesk);
      } else {
        message.info("定制过程中无法操作");
      }
    },
    resetLayout() {
      this.hide = true;
      setTimeout(() => {
        this.hide = false;
      }, 1);
    },
    freeLayoutScrollbarRedirect() {
      if (!this.isFreeLayout) return;
      this.$refs.freeLayoutScrollbar.redirect();
    },
    freeLayoutScrollbarUpdate() {
      if (!this.isFreeLayout) return;
      this.$refs.freeLayoutScrollbar.update();
    },
    update(callback) {
      if (this.$refs.grid) {
        this.$refs.grid.update(callback);
      }
    },
    toggleEditing() {
      if (!this.showGuide) {
        if (this.editing) {
          message.info("已关闭拖拽调整");
        } else {
          message.info("您可以直接拖拽图标调整位置");
        }
        this.muuriOptions.layout.horizontal = !this.settings.vDirection;
        this.$emit("changeEditing", this.editing);
        this.menuVisible = false;
        this.key = Date.now();
      } else {
        message.info("定制过程中无法操作");
      }
    },
    showSetting() {
      this.$bus.emit("openSystemSet");
      setTimeout(() => {
        this.$bus.emit("selectSystemNav", 2);
      }, 100);
    },
    hideDesk() {
      this.hide = !this.hide;
      this.menuVisible = false;
    },
    showDesk() {
      this.hide = !this.hide;
      this.menuVisible = false;
    },
    clear(desk) {
      this.menuVisible = false;
      if (!this.showGuide) {
        if (desk) {
          window.$ui.confirm("清空当前桌面的全部卡片？此操作不可还原。", "", {
            okText: "清空卡片",
            okButtonWidth: 100,
            type: "warning",
            ok: () => {
              desk?.cards?.forEach((item) => {
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
              desk.cards = [];
              this.menuVisible = false;
              this.clearFreeLayoutData();

              if (this.communityInfo?.role === "owner") {
                this.$bus.emit("updateSync");
              }
            },
          });
        }
      } else {
        message.info("定制过程中无法操作");
      }
    },
    newAppCenter() {
      this.visible = true;
    },
    newAddCard() {
      if (!this.showGuide) {
        // if (this.autoOpenEdit) {
        //   this.toggleEditing();
        // }
        this.addCardVisible = true;
        this.menuVisible = false;
      } else {
        message.info("定制过程中无法操作");
      }
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
    arrange() {
      if (!this.showGuide) {
        this.$emit("onArrange");
      } else {
        message.info("定制过程中无法操作");
      }
    },
    // 添加图标
    newAddIcon() {
      if (!this.showGuide) {
        this.editVisible = true;
        this.menuVisible = false;
        this.selectNav = "desktop";
        this.isDesk = true;
      } else {
        message.info("定制过程中无法操作");
      }
    },
    useFileConversionIcon,
    useAddCard,
    addIcon(item, index) {
      const file = this.useFileConversionIcon(item);
      // console.log(file,'<<<<<<<<<<<<')
      this.useAddCard("myIcons", {
        iconList: [{ ...file }],
        newIcon: true,
      });
      // this.editVisible = false;
    },
    /**
     * 暂存布局，与restore结对使用。
     */
    stashLayout() {
      let bound = {
        // width: this.$refs.deskContainer?.clientWidth,
        // height: this.$refs.deskContainer?.clientHeight,
        width: this.deskSize.width,
        height: this.deskSize.height,
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
        // width: this.$refs.deskContainer?.clientWidth,
        // height: this.$refs.deskContainer?.clientHeight,
        width: this.deskSize.width,
        height: this.deskSize.height,
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
          // width: this.$refs.deskContainer?.clientWidth,
          // height: this.$refs.deskContainer?.clientHeight,
          width: this.deskSize.width,
          height: this.deskSize.height,
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
                  // width: this.$refs.deskContainer?.clientWidth,
                  // height: this.$refs.deskContainer?.clientHeight,
                  width: this.deskSize.width,
                  height: this.deskSize.height,
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
  beforeDestroy() {},
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
</style>
