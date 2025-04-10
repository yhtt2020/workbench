<template>
  <teleport to="body">
    <!-- 应用弹窗 -->
    <FloatApp
      :appPos="position"
      v-if="appsVisible"
      @close="appsVisible = false"
    />
    <!-- 文件夹弹窗 -->
    <FloatFolder
      v-if="folderVisible"
      :folderPos="position"
      :customData="customData"
      :sideKey="bottomKey"
      @close="folderVisible = false"
      @clickFile="clickFile"
      @update:layout="updateLayout"
      @update:customSize="updateSize"
    />
    <!-- 卡片弹窗 -->
    <FloatCard
      v-if="floatCardVisible"
      :cardData="floatCard.cardData"
      :currentComponent="floatCard.value"
      :position="position"
      @close="floatCardVisible = false"
      navId="foot"
      @delete="deleteCard">
    </FloatCard>
    <transition>
    <div
      v-if="
        hoverIndex > -1 &&
        hoverRealItemId('bottomContent', this.hoverIndex) !== dragItem?.id
      "
      style="
        position: absolute;
        z-index: 99999999999;
        left: 50%;
        transform: translateX(-50%) translateY(-100%);
      "
      :style="[mergeTip]"
      class="px-10 py-3 rounded-lg s-bg xt-text"
    >
      松开鼠标合并
    </div>
  </transition>
  </teleport>

  <!-- 快速搜索 底部栏区域 -->
  <div
    id="bottomPanel"
    :class="customClass"
    class="flex flex-row items-center justify-center max-w-full overflow-hidden xt-text"
    style="z-index: 99; min-width: 80px"
    :style="[{ borderRadius: navAttribute.navRadius + 'px' },boxStyle]"
  >
      <div
        style="
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 52px;
          align-items: start;
          flex-wrap: nowrap;
          justify-content: center;
        "
      >
        <div
          style="height: 52px; width: 100%"
          class="flex flex-wrap justify-center"
        >
          <div
            class="w-full scroll-content"
            style="
              flex: 1;
              display: flex;
            "
            :style="[this.currentNavFormat === 'mac' ? { marginLeft:'20px' ,marginRight:'20px' } : '']"
            ref="content"
          >
            <div
              :key="bottomKey"
              style="white-space: nowrap; display: flex; align-items: center"
              :style="{ gap: gap + 'px' }"
              class="w-full"
              id="bottomContent"
            >
              <div
                v-if="copyFootNav.length <= 0"
                style=""
                class="flex items-center justify-center w-[52px] h-[52px]"
                @click="editNav(drawerMenus[0])"
              >
                <xt-new-icon
                  icon="fluent:add-16-regular"
                  size="32"
                  class="xt-text"
                ></xt-new-icon>
              </div>
              <a-tooltip
                v-for="(item, index) in copyFootNav"
                :key="item.id"
                :title="item.name"
                :overlayStyle="{
                  zoom: `${navAttribute.navSize / 100}`,
                }"
                @mouseenter="showElement(item, index)"
              >
                <xt-menu
                  :id="item.id"
                  class="relative flex flex-wrap justify-center w-full overflow-visible"
                  :menus="folderOptions"
                >
                  <div
                    @dragover="onDrag"
                    @dragend="hoverIndex = -1"
                    v-if="!(navList.includes(item.event) && isSingle)"
                    class="flex items-center justify-center pointer"
                    :class="{
                      hover:
                        dragItem &&
                        item.id ===
                          hoverRealItemId('bottomContent', hoverIndex) &&
                        dragItem?.id !==
                          hoverRealItemId('bottomContent', hoverIndex),
                    }"
                    style="
                      white-space: nowrap;
                      display: inline-block;
                      border-radius: 18px;
                    "
                    @click.stop="newOpenApp(item, $event)"
                  >
                    <Drag
                      :data="item"
                      currentId="bottom"
                      @deleteFile="deleteFile"
                    >
                      <NavIcon
                        :item="item"
                        :size="iconSize"
                        :community="community"
                      >
                      </NavIcon>
                    </Drag>
                  </div>
                </xt-menu>
              </a-tooltip>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { navStore } from "../../store/nav";
import { useNavBarStore } from "../desk/navigationBar/navBar.ts";
import { useNavigationStore } from "../desk/navigationBar/navigationStore";
import { controlStore } from "../../apps/control/hooks/controlStore";
import { singleStore } from "../../js/common/single";
import { usePermissionStore } from "../../permission/store";

import { mapWritableState, mapActions } from "pinia";
import Sortable from "sortablejs";
import { message } from "ant-design-vue";
import _ from "lodash-es";
import "animate.css";
import { useFullscreen } from "@vueuse/core";
import { nanoid } from "nanoid";

import {
  moreMenus,
  extraRightMenu,
} from "../../components/desk/navigationBar/index";
import { useMergeFolder } from "../../components/desk/navigationBar/hook/mergeFolder.ts";
import { Notifications } from "../../js/chat/sessionNotice";
import { defaultFolderData } from "../../apps/folder/src/components/options";
import { hoverRealItemId } from "../desk/navigationBar/hook/hoverRealItemId";
import { mergeData } from "../../ui/hooks/useDataConversion";
import { usePosition } from "../windowPanel/hook/usePosition";
import { deleteIcon, checkItems } from '../../components/card/hooks/addCardToNav'

import NavIcon from "../windowPanel/components/NavIcon.vue";
import EditIcon from "../desk/navigationBar/components/EditIcon/EditIcon.vue";
import Drag from "../desk/navigationBar/components/folder/Drag.vue";
import Avatar from "../desk/navigationBar/components/Avatar.vue";
import Team from "./Team.vue";
import FloatCard from "../windowPanel/components/FloatCard.vue";
import FloatFolder from "../windowPanel/components/FloatFolder.vue";
import FloatApp from "../windowPanel/components/appCenter/FloatApp.vue";

import menuMin from "../windowPanel/hook/menu";

const {
  //是否全屏状态
  isFullscreen,
  //切换全屏
  toggle,
} = useFullscreen();

export default {
  name: "BottomPanel",
  emits: ["getDelIcon", "hiedNavBar", "edit", "control", "getHoverIndex", "update:isOpen"],
  mixins: [menuMin],
  components: {
    EditIcon,
    Avatar,
    Drag,
    Team,
    NavIcon,
    FloatCard,
    FloatFolder,
    FloatApp,
  },
  data() {
    return {
      dragItem: null,
      targetItem: null,
      cancelUpdate: false,
      sortable: null,
      bottomKey: Date.now(),
      hoverIndex: -1, //当前选中的项目（排除gap）
      debug: false,
      delNav: false,
      drawerMenus: [...extraRightMenu, ...moreMenus],
      componentId: "EditNavigationIcon",
      currentIndex: null,
      currentItem: null,
      delItemIcon: false,
      notifications: new Notifications(),
      isDelete: true,
      defaultPosition: { x: 0, y: 0 },
      defaultFolderData,
      folderVisible: false,
      folderList: [],
      folderName: "文件夹",
      customData: {},
      folderItem: {},
      folderId: "",
      // 弹窗显示
      noticeFlag: true,
      addIconFlag: false,
      left: 0,
      position:{},
      parentSize: 0,
      parentHeight: 0,

      comVisible: false,
      floatCardVisible:false,
      floatCard:{},
      clickOutside:false,
      sortId:'foot',
      isFirst:true,
    };
  },
  props: {
    delZone: {
      type: Boolean,
      default: () => false,
    },
    // 图标大小
    iconSize: {
      type: Number,
      default: () => 54,
    },
    // 自定义类
    customClass: {
      type: String,
      default: () => "h-[80px] xt-bg border-[var(--divider)] mr-3 s-bg",
    },
    // 图标间距
    gap: {
      type: Number,
      default: () => 20,
    },
    // 文件夹是否打开
    isOpen: {
      type: Boolean,
      default: () => false,
    },
    boxStyle: {
      type: String,
      default: () => "border:1px solid var(--divider)",
    }
  },
  mounted() {
    this.enableDrag();
  },
  computed: {
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
    ]),
    ...mapWritableState(singleStore, ["navList"]),
    ...mapWritableState(usePermissionStore, ["isSingle"]),
    ...mapWritableState(useNavigationStore, [
      "selectNav",
      "popVisible",
      "currentList",
      "editItem",
      "navAttribute",
      "jumpDesk",
      "currentNavPosition",
      "currentNavFormat",
      "communityNavVisible",
      "currentMainH",
    ]),

    ...mapWritableState(useNavBarStore, ["isEnterDesk"]),
    ...mapWritableState(controlStore, ["firstNavVisible"]),
    // 当前图标的大小
    realSize() {
      return this.iconSize + this.gap;
    },
    // 社区图标需要传递的相关参数
    community() {
      return {
        x: this.position.x,
        y: this.position.y,
        placement: "top",
        visible: this.comVisible,
      };
    },
    folderOptions() {
      if (this.currentItem && this.currentItem.type === "folder") {
        const reset = {
          id: 4,
          label: "解散文件夹",
          newIcon: "fluent:circle-off-16-regular",
          callBack: () => {
            this.resetFolder(this.currentItem, this.currentIndex);
          },
        };
        let arr = [...this.iconMenus, reset];
        return arr.sort((a, b) => a.id - b.id);
      }
      return this.iconMenus;
    },
    // 合并提示位置
    mergeTip() {
      if(this.iconSize == '44'){
        if(this.currentNavPosition === 'bottom'){
          return 'bottom:30px'
        }
        return 'top:120px'
      }
      return 'bottom:60px'
    }
  },
  watch: {
    copyFootNav: {
      handler(newVal, oldVal) {
        // 获取最大可添加图标个数
        const windowWidth = window.innerWidth;
        let maxWidth
        let extraWidth
        if(this.currentNavFormat === 'mac'){
          maxWidth = this.communityNavVisible ? windowWidth - 540 : windowWidth - 200
          extraWidth = this.communityNavVisible ? 540 : 200
        } else {
          maxWidth = windowWidth * 0.6
          extraWidth = windowWidth * 0.3
        }
        if (
          this.copyFootNav.length > this.maxItemNum &&
          this.maxItemNum !== null
        ) {
          if (this.noticeFlag && this.addIconFlag) {
            window.$ui.confirm(
              "最多只能添加" + this.maxItemNum + "个",
              "若继续添加将缩小导航栏",
              {
                ok: () => {
                  const width =
                  windowWidth / (extraWidth + this.copyFootNav.length * this.realSize);
                  this.navAttribute.navSize = width.toFixed(2) * 100;
                  this.noticeFlag = false;
                },
                noText: false,
              }
            );
          }
          if (this.noticeFlag) return;
          const width =
          windowWidth / (extraWidth + this.copyFootNav.length * this.realSize);
          this.navAttribute.navSize = width.toFixed(2) * 100;
        }
        this.syncBottomPanel();
      },
      immediate: true,
      deep: true,
    },
    "copyFootNav.length": {
      handler(newVal, oldVal) {
        if (oldVal !== undefined && newVal !== oldVal) {
          this.addIconFlag = true;
        }
      },
    },
    delZone(val) {
      this.delNav = val;
    },
    folderList() {
      this.customData = {
        ...this.defaultFolderData,
        list: this.folderList,
        customSize: this.currentItem.customSize || this.resize,
        name: this.folderName,
        layout: this.currentItem.layout || "rows",
      };
    },
    "customData.list": {
      handler(newV, oldV) {
        // console.log('newV', newV, 'oldV', oldV)
        const list = [...newV];
        this.folderItem.children = list;
      },
      deep: true,
    },
    "customData.name": {
      handler(newV, oldV) {
        this.folderName = newV;
        this.folderItem.name = newV;
        // console.log('newV', newV, 'oldV', oldV)
      },
      deep: true,
    },

    // 获取当前鼠标悬浮的索引
    hoverIndex(val) {
      this.$emit("getHoverIndex", val);
    },

    // 文件夹打开状态
    folderVisible(val) {
      this.$emit("update:isOpen", val);
    },

    // 当导航栏进行缩放后，记录主导航栏高度
    'navAttribute.navSize'(val) {
      this.updateH()
    },
    // 当导航栏模式发生变化后，记录主导航栏高度
    currentNavFormat : {
      handler(val) {
        this.updateH()
      },
      immediate: true,
      deep: true
    },
    // 当导航栏位置发生变化后，记录主导航栏高度
    currentNavPosition : {
      handler(val) {
        this.updateH()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions(navStore, [
      "fixData",
      "setFootNavigationList",
      "sortFootNavigationList",
      "removeFootNavigationList",
    ]),
    mergeData,
    usePosition,
    deleteIcon,
    // 更新主导航栏高度，用于弹窗定位
    updateH() {
      // 计算导航栏尺寸
      const baseSize = this.currentNavFormat === 'mac' ? 80 : 64;
      const size = baseSize * (this.navAttribute.navSize / 100) + 20;

      // 初始化主区域高度
      this.currentMainH = { top: 40, bottom: size };

      // 根据导航位置和开关状态调整高度
      if (this.currentNavPosition === 'top') {
        this.currentMainH.top = this.navigationToggle[2] ? size : 0;
        this.currentMainH.bottom = 0;
      } else {
        if (!this.navigationToggle[2]) {
          this.currentMainH.bottom = 0;
        }
      }
    },
    deleteCard(val){
      this.deleteIcon(this.currentItem,'foot')
    },
    deleteFile(data) {
      const index = this.copyFootNav.findIndex((item) => item.id === data.id);
      this.copyFootNav.splice(index, 1);
      // console.log('删除成功');
      this.$emit("getDelIcon", false);
    },

    /**
     * 点击文件夹子图标
     * @param {*} item
     */
    clickFile(item) {
      this.folderVisible = false;
      this.msgNotice(item);
    },
    closeFolder() {
      this.folderVisible = false;
    },
    editIcon(item) {
      this.componentId = "EditIcon";
      this.editItem = item;
      if (item.default?.name) return;
      item.default = {
        name: item.name,
        icon: item.icon,
        bg: item.bg,
        color: item.color,
      };
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
      } else {
        this.editIcon(item);
      }
      this.$emit("edit", this.componentId);
    },

    /**
     * 打开文件夹
     */
    openFolder(item) {
      // 获取当前的文件夹
      this.folderItem = item;
      this.folderList = item.children.map((i) => ({
        ...i,
        id: nanoid(6),
        default: i.default ? i.default : { name: i.name, icon: i.icon },
      }));
      this.folderName = item.name;
      if (!this.folderVisible) {
        this.folderVisible = true;
      } else if (
        this.folderVisible &&
        this.currentItem.id &&
        this.folderId === this.currentItem.id
      ) {
        this.folderVisible = false;
      } else {
        this.customData = {
          ...this.defaultFolderData,
          list: this.folderList,
          size: this.currentItem.size || this.resize,
          name: this.folderName,
          layout: this.currentItem.layout || "rows",
        };
      }
      this.folderId = item.id;
    },
    /**
     * 更新大小尺寸
     * @param {*} value
     */
    updateSize(value) {
      this.currentItem.customSize = value;
      this.resetElementPosition();
    },
    /**
     * 更新图标排序方式
     * @param {*} value
     */
    updateLayout(value) {
      this.currentItem.layout = value;
    },
    // showElement(item, index) {
    //   this.currentItem = item;
    //   this.currentIndex = index;
    // },
    openCard(item) {
      if(this.floatCard.cardData?.customIndex !== item.cardData?.customIndex && this.floatCard !== undefined) {
        this.floatCard = item
        console.log(this.floatCard)
        this.$nextTick(() => {
          this.floatCardVisible = true
        })
        return
      }
      this.floatCardVisible = !this.floatCardVisible
    },


    /**
     * 解散文件夹和切换文件夹
     * @param {*} item
     * @param {*} index
     */
    resetFolder(item, index) {
      if (item.children.length > 0) {
        if (item.children.length + this.copyFootNav.length > this.maxItemNum) {
          window.$ui.confirm(
            "最多只能添加" + this.maxItemNum + "个",
            "若继续添加将缩小导航栏",
            {
              ok: () => {
                this.copyFootNav.splice(index, 1, ...item.children);
              },
              no: () => {
                return this.copyFootNav;
              },
            }
          );
        } else {
          this.copyFootNav.splice(index, 1, ...item.children);
        }

        if (this.folderId == item.id) {
          this.closeFolder();
        }
      }
    },
    checkItems,
    /**
     * sortable拖拽函数
     */
    enableDrag() {
      // console.log('触发一次重置 ')
      // 暂时隐藏,第一次打开应用时,由于执行多次，导致sortable被卸载,导致原始H5的拖拽失效
      // if (this.sortable) {
      //   console.log('先清理 ')
      //   this.sortable.destroy();
      // }
      let that = this;
      let drop = document.getElementById("bottomContent");
      if (!drop) {
        // console.error('更新底部导航栏失败，元素不存在')
        return;
      }
      let index = null;
      // let isTimer = false
      let isDrag = false;
      this.sortable = Sortable.create(drop, {
        sort: true,
        animation: 150,
        delay: 50,
        delayOnTouchOnly: true,
        // 设置交换区域的阈值
        swapThreshold: 0.4,
        // 反向拖拽
        invertSwap: true,
        //
        onStart: function (event) {
          that.cancelUpdate = false;
          // console.log('onStart')
          that.dragItem = that.copyFootNav[event.oldIndex];
          // console.log('启动拖拽的元素', that.dragItem)
          if (that.popVisible) {
            that.notifications.NoticeToast();
          }

          // 当处于window版导航栏时，删除区域的id获取
          let delIcon
          if(that.currentNavPosition === 'top'){
            delIcon = document.getElementById("delIconTop");
          } else {
            delIcon = document.getElementById("delIcon2");
          }
          that.delItemIcon = true;
          that.$emit("getDelIcon", true);
          that.delNav = true;
          if (that.delNav) {
            delIcon.ondragover = function (ev) {
              ev.preventDefault();
            };
          }
          delIcon.ondrop = function (ev) {
            that.delItemIcon = false;
            that.isEnterDesk = false;
            let oneNav = that.copyFootNav[event.oldIndex];
            // 删除图标
            that.deleteIcon(oneNav,'foot')
            // 更新删除区域状态
            that.$emit("getDelIcon", false);
            // 更新导航栏
            that.hoverIndex = -1;
          };
        },
        onUpdate: _.debounce((event) => {
          if (that.cancelUpdate) {
            //如果执行过合并，这里就不需要刷新顺序了。
            return;
          }
          // console.log('onUpdate')
          //拖拽排序后，更新数据
          // console.log('移动event=', event)
          let cur = this.copyFootNav.splice(event.oldIndex, 1)[0];
          if (!cur) {
            // console.error('移动失败，无法获取到元素')
            return;
          }
          this.copyFootNav.splice(event.newIndex, 0, cur);
          return;
        }, 100),
        onEnd: function (event) {
          console.log('onEnd')
          that.$emit("getDelIcon", false);
          that.popVisible = false;
          // 删除
          that.isDelete = true;
          index = null;
          that.isBorder = false;
          isDrag = false;
          that.isFirst = false
        },
        onMove: function (event, originalEvent) {
          isDrag = true;
          that.isDelete = false;
          const moveLeft = event.originalEvent.clientX;
          const panelLeft = that.defaultPosition.x;
          const relativePos = (moveLeft - panelLeft) % this.realSize;
          const isGap = relativePos <= 20 && relativePos >= 0;
          // console.log('isGap=', isGap, relativePos)
          return true;
        },
        onChoose: function (event) {
          // console.log('onChoose')
          index = event.oldIndex;

          that.defaultPosition = {
            x: event.originalEvent.clientX,
            y: event.originalEvent.clientY,
          };
        },
        /**
         * 合并文件夹操作
         * @param event
         * @returns {number}
         */
        onUnchoose: function (event) {
          const hoverItem = that.hoverRealItemId("bottomContent", that.hoverIndex)
          if (
            hoverItem &&
            hoverItem !==
              that.dragItem?.id
          ) {
            if(that.checkItems(that.copyFootNav,hoverItem,that.dragItem.id)){
              message.error('卡片类图标不能合并为文件夹')
              that.hoverIndex = -1
              return
            }
            //存在目标，且不等于自身，符合合并条件，则执行合并
            const merged = that.useMergeFolder(
              that.copyFootNav,
              that.dragItem,
              that.copyFootNav.find((item) => {
                return (
                  item.id ===
                  hoverItem
                );
              })
            );
            that.copyFootNav.splice(
              that.copyFootNav.findIndex((item) => {
                return (
                  item.id ===
                  hoverItem
                );
              }),
              1,
              merged
            );
            that.copyFootNav = that.copyFootNav.filter((item) => {
              if (!that.dragItem.id) {
                that.dragItem.id = nanoid(6);
              }
              return item.id !== that.dragItem.id;
            });
            //执行合并后，因为更改了数组，已经自动触发了重置数组，所以不需要再执行update，数据也是正确的
            that.cancelUpdate = true;
          }
          that.hoverIndex = -1;
          return;
        },
      });
    },
    /**
     * 自动根据当前位置获取到要合并的位置
     * @param currentLeft
     * @returns {{gap: boolean, index: number}|number}
     */
    getHoverIndex(currentLeft) {
      const panelLeft =
        document.getElementById("bottomContent").getBoundingClientRect().left *
        (this.navAttribute.navSize / 100);
      const relativePos =
        (currentLeft - panelLeft) %
        ((this.realSize * this.navAttribute.navSize) / 100);
      const isGap = !(
        relativePos <=
          ((this.realSize - 30) * this.navAttribute.navSize) / 100 &&
        relativePos >= (10 * this.navAttribute.navSize) / 100
      );
      let nIndex = Math.floor(
        (currentLeft - panelLeft + this.gap) /
          ((this.realSize * this.navAttribute.navSize) / 100)
      );
      if (nIndex > this.copyFootNav.length - 1) {
        //超出
        return 0;
      }
      if (isGap) {
        return {
          gap: true,
          index: nIndex,
        };
      } else {
        return {
          gap: false,
          index: nIndex,
        };
      }
    },
    /**
     * 更新底部导航栏，包括刷新和启动拖拽
     */
    syncBottomPanel() {
      this.bottomKey = Date.now();
      // if(this.sortable){
      //   console.log('update <<< from')
      //   this.sortable.destroy();
      // }
      this.$nextTick(() => {
        // console.log(this.sortable,'<<<<<<<<<<,')
        this.enableDrag();
      });
    },
    hoverRealItemId,
    useMergeFolder,

    /**
     * 重置元素位置
     */
    resetElementPosition(custom = undefined) {
      const draggableSize = (
        this.currentItem?.cardData?.customData?.customSize ||
        this.currentItem?.customSize ||
        this.resize ||
        '1x1').split("x");
      // console.log(draggableSize)
      // 元素坐标
      let pos = {
        x:this.defaultPosition.x,
        y:this.defaultPosition.y
      };
      // 元素大小
      let menu = {
        x:draggableSize[0] * 142,
        y:draggableSize[1] * 105
      };
      // 自定义元素宽高
      if(custom){
        menu = {
          x:custom.x,
          y:custom.y
        }
      }
      this.position = this.usePosition(pos,menu)
    },
    onDrag: function (e) {
      let hoverRs = this.getHoverIndex(e.x);
      if (hoverRs.gap) {
        this.hoverIndex = -1;
      } else {
        this.hoverIndex = hoverRs.index;
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
