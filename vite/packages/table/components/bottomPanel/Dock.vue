<template>
  <div
    style="position: absolute; z-index: 500 !important"
    :style="{
      left: `${this.left}px`,
      bottom: `${(navAttribute.navSize / 100) * 100}px`,
    }"
    class="rounded-xl pointer"
    id="folder"
  >
    <Folder
      @clickFile="clickFile"
      @update:layout="updateLayout"
      @update:customSize="updateSize"
      @close="folderVisible = false"
      :customData="customData"
      :customIndex="bottomKey"
      :secondary="true"
      v-if="folderVisible"
      :expand="{ disabled: true }"
      :navBar="{
        resize: false,
        sizeOption: false,
        isDel: true,
        hierarchy: true,
        close: true,
      }"
      :auto="true"
    />
  </div>
  <!-- 快速搜索 底部栏区域 -->
  <transition>
    <div
      v-if="
        hoverIndex > -1 &&
        !skipSort &&
        hoverRealItemId('bottomContent', this.hoverIndex) !== dragItem?.id
      "
      style="
        position: absolute;
        z-index: 99999999999;
        top: -8px;
        left: 50%;
        transform: translateX(-50%) translateY(-100%);
      "
      class="px-10 py-3 rounded-lg s-bg xt-text"
    >
      松开鼠标合并
    </div>
  </transition>
  <div
    id="bottomPanel"
    class="flex flex-row items-center justify-center s-bg h-[80px] max-w-full overflow-hidden xt-bg xt-text-1"
    style="
      margin-right: 10px;
      z-index: 99;
      min-width: 80px;
      border: 1px solid var(--divider);
    "
    :style="{ borderRadius: navAttribute.navRadius + 'px' }"
  >
    <xt-task id="M0104" no="1" :mask="false" class="w-full">
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
              margin-left: 20px;
              margin-right: 20px;
            "
            ref="content"
          >
            <div
              :key="bottomKey"
              style="
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 20px;
              "
              class="w-full"
              id="bottomContent"
            >
              <div
                v-if="copyFootNav.length <= 0"
                style=""
                class="flex items-center justify-center w-[52px] h-[52px]"
                @click="editNavigation(drawerMenus[0])"
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
                    v-if="!(navList.includes(item.event) && isOffline)"
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
                      <Team
                        v-if="item.value === 'commun'"
                        :item="item"
                        :placement="'top'"
                        :x='this.realXY.x'
                        :y="navAttribute.navSize"
                        :visible="this.comVisible"
                      ></Team>
                      <FolderVue
                        v-else-if="item.type === 'folder'"
                        :iconList="item.children"
                        :item="item"
                      ></FolderVue>
                      <template v-else>
                        <Avatar :item="item">
                          <template #control>
                            <div
                              style="
                                background-color: #ff4d4f;
                                border: 2px solid;
                              "
                              v-if="firstNavVisible"
                              class="absolute top-0 flex items-center justify-center flex-shrink-0 w-4 h-4 translate-x-6 rounded-full -translate-y-1/3 pointer"
                            ></div>
                          </template>
                        </Avatar>
                      </template>
                    </Drag>
                  </div>
                </xt-menu>
              </a-tooltip>
            </div>
          </div>
        </div>
      </div>
    </xt-task>
  </div>
</template>

  <script>
import { navStore } from "../../store/nav";
import { useNavBarStore } from "../desk/navigationBar/navBar.ts";
import { useNavigationStore } from "../desk/navigationBar/navigationStore";
import { mapWritableState, mapActions } from "pinia";
import Team from "./Team.vue";
import Sortable from "sortablejs";
import { message } from "ant-design-vue";
import { offlineStore } from "../../js/common/offline";
import {
  moreMenus,
  extraRightMenu,
} from "../../components/desk/navigationBar/index";
import { useMergeFolder } from "../../components/desk/navigationBar/hook/mergeFolder.ts";
import { Notifications } from "../../js/common/sessionNotice";
import EditIcon from "../desk/navigationBar/components/EditIcon/EditIcon.vue";
import { startApp } from "../../ui/hooks/useStartApp";
import _ from "lodash-es";
import Avatar from "../desk/navigationBar/components/Avatar.vue";
import FolderVue from "../desk/navigationBar/components/folder/Folder.vue";
import Folder from "../../apps/folder";
import { defaultFolderData } from "../../apps/folder/src/components/options";
import { nanoid } from "nanoid";
import Drag from "../desk/navigationBar/components/folder/Drag.vue";
import { hoverRealItemId } from "../desk/navigationBar/hook/hoverRealItemId";
import "animate.css";
import { mergeData } from "../../ui/hooks/useDataConversion";
import { useFullscreen } from "@vueuse/core";
import { controlStore } from "../desk/navigationBar/hook/controlStore";

const {
  //是否全屏状态
  isFullscreen,
  //切换全屏
  toggle,
} = useFullscreen();

export default {
  name: "BottomPanel",
  emits: ["getDelIcon", "hiedNavBar", "edit", "control"],
  components: {
    EditIcon,
    Avatar,
    FolderVue,
    Folder,
    Drag,
    Team,
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
      tab: "screen",
      leftNav: false,
      rightNav: false,
      delNav: false,
      drawerMenus: [...extraRightMenu, ...moreMenus],
      componentId: "EditNavigationIcon",
      iconMenus: [
        {
          id: 1,
          newIcon: "fluent:open-16-regular",
          label: "打开",
          callBack: () => {
            this.newOpenApp(this.currentItem);
          },
        },
        {
          id: 2,
          label: "编辑",
          newIcon: "fluent:compose-16-regular",
          callBack: () => {
            this.editNavigation(this.currentItem);
          },
        },
        {
          id: 3,
          label: "删除",
          newIcon: "fluent:delete-16-regular",
          color: "#FF4D4F",
          callBack: () => {
            this.delCurrentIcon(this.currentIndex, this.currentItem);
          },
        },
        {
          id: 5,
          divider: true,
        },
        {
          id: 6,
          label: "添加导航图标",
          newIcon: "fluent:add-16-regular",
          callBack: () => {
            this.editNavigation(this.drawerMenus[0]);
          },
        },
        {
          id: 7,
          label: "导航栏设置",
          newIcon: "fluent:settings-16-regular",
          callBack: () => {
            this.$bus.emit("openSystemSet");
            setTimeout(() => {
              this.$bus.emit("selectSystemNav", 3);
            }, 10);
          },
        },
      ],
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
      parentSize: 0,
      parentHeight: 0,


      comVisible:false
    };
  },
  props: {
    delZone: {
      type: Boolean,
      default: () => false,
    },
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
    ...mapWritableState(offlineStore, ["isOffline", "navList"]),
    ...mapWritableState(useNavigationStore, [
      "editToggle",
      "selectNav",
      "popVisible",
      "currentList",
      "editItem",
      "navAttribute",
      "jumpDesk",
    ]),
    ...mapWritableState(useNavBarStore, ["isEnterDesk"]),
    ...mapWritableState(controlStore, ["firstNavVisible"]),
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
    /**
     * 通过文件夹中数据的多少来自定义大小
     */
    resize() {
      const length = this.folderList.length;
      if (length <= 6) {
        return "2x2";
      } else if (length <= 12 && length > 6) {
        return "3x3";
      } else if (length <= 18 && length > 12) {
        return "4x4";
      } else {
        return "6x4";
      }
    },
    realXY() {
      return {
        x: this.left,
        y: this.parentHeight - (this.navAttribute.navSize / 100) * 100 - 175,
      };
    },
  },
  watch: {
    copyFootNav: {
      handler(newVal, oldVal) {
        // 获取最大可添加图标个数
        const windowWidth = window.innerWidth;
        this.maxItemNum = Math.round((windowWidth - 240) / 72);
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
                    window.innerWidth / (240 + this.copyFootNav.length * 72);
                  this.navAttribute.navSize = width.toFixed(2) * 100;
                  this.noticeFlag = false;
                },
                noText: false,
              }
            );
          }
          if (this.noticeFlag) return;
          const width =
            window.innerWidth / (240 + this.copyFootNav.length * 72);
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
    editToggle() {
      if (this.editToggle) {
        this.enableDrag();
        this.shakeElement = true;
        setTimeout(() => {
          this.shakeElement = false;
        }, 2000);
      } else {
        // this.disableDrag()
      }
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
  },
  methods: {
    ...mapActions(navStore, [
      "fixData",
      "setFootNavigationList",
      "sortFootNavigationList",
      "removeFootNavigationList",
    ]),
    mergeData,
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
      if (item.default.name) return;
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
    editNavigation(item) {
      if (item.component) {
        this.componentId = item.component;
        if (item.component === "EditNewNavigation") {
          this.editToggle = true;
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
    showElement(item, index) {
      this.currentItem = item;
      this.currentIndex = index;
    },
    /**
     * 删除图标判断
     * @param {*} currentIndex 当前删除图标索引
     * @param {*} currentItem 当前删除图标
     */
    delCurrentIcon(currentIndex, currentItem) {
      if (!this.mainNavigationList.find((f) => f.value === currentItem.value)) {
        this.removeFootNavigationList(currentIndex);
        return;
      }
      let arr = [];
      if (this.navigationToggle[0] && this.navigationToggle[1]) {
        arr = this.sideNavigationList.concat(this.rightNavigationList);
      } else if (this.navigationToggle[0] && !this.navigationToggle[1]) {
        arr = this.sideNavigationList;
      } else if (!this.navigationToggle[0] && this.navigationToggle[1]) {
        arr = this.rightNavigationList;
      } else {
        message.info(`导航栏中至少保留一个「${currentItem.name}」`);
        return;
      }
      this.delNavigation(
        arr,
        currentItem,
        currentIndex,
        this.removeFootNavigationList
      );
    },
    /**
     * 打开桌面应用提示
     * @param {*} item 当前图标
     */
    msgNotice(item) {
      if (item.type === "tableApp") {
        message.loading({
          content: `打开「${item.name}」...`,
          key: "tipRun",
        });
      }
    },
    /**
     * 打开应用
     * @param {*} item 图标详细信息
     */
    async newOpenApp(item, e) {
      const { type, value } = item;
      type !== 'folder' ? this.folderVisible = false : ''
      this.resetElementPosition();
      if (value === "control") {
        this.$emit("control", e);
        return;
      }
      console.log('item :>> ', item);
      if (value === "setting") {
          this.$bus.emit("openSystemSet");
        return;
      }
      if(value === 'commun'){
        this.comVisible = ! this.comVisible
        return
      }
      if (type === "folder") {
        this.openFolder(item);
      }
      this.resetElementPosition();
      if (value == "fullscreen" && window.$useEnv()) {
        toggle();
        // console.log('isFullscreen :>> ', isFullscreen);
        return;
      }
      if (window.$useEnvLimit("web", value)) return;

      this.msgNotice(item);
      if (value === "home" && item.home) {
        this.jumpDesk = item.home;
      }
      let rs = await startApp(type, value, this.$router);
      if (!rs) {
        message.error({
          content: `打开「${item.name}」失败`,
          key: "tipRun",
        });
      }
      this.comVisible = false
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
    /**
     * sortable拖拽函数
     */
    enableDrag() {
      // console.log('触发一次重置 ')
      if (this.sortable) {
        // console.log('先清理 ')
        this.sortable.destroy();
      }
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
          let delIcon = document.getElementById("delIcon2");
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
            //将要删除的是否是主要功能
            if (!that.mainNavigationList.find((f) => f.name === oneNav.name)) {
              that.removeFootNavigationList(event.oldIndex);
              console.log("删除成功");
              that.$emit("getDelIcon", false);
              that.hoverIndex = -1;
              return;
            }
            let sumList = [];
            // 判断其他导航栏是否是打开状态，是则获取功能列表
            if (that.leftNav && that.rightNav) {
              sumList = that.sideNavigationList.concat(
                that.rightNavigationList
              );
            } else if (that.leftNav && !that.rightNav) {
              sumList = that.sideNavigationList;
            } else if (!that.leftNav && that.rightNav) {
              sumList = that.rightNavigationList;
            } else {
              message.info(`导航栏中至少保留一个「${oneNav.name}」`);
              // console.log('不可删除')
              return;
            }
            that.delNavigation(
              sumList,
              oneNav,
              event.oldIndex,
              that.removeFootNavigationList
            );
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
          // console.log('onEnd')
          that.$emit("getDelIcon", false);
          that.popVisible = false;
          // 删除
          that.isDelete = true;
          index = null;
          that.isBorder = false;
          isDrag = false;
        },
        onMove: function (event, originalEvent) {
          isDrag = true;
          that.isDelete = false;
          const moveLeft = event.originalEvent.clientX;
          const panelLeft = that.defaultPosition.x;
          const relativePos = (moveLeft - panelLeft) % 72;
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
        onSort: function (event) {
          // console.log('onSort', event)
          // console.log('item', that.copyFootNav[event.newIndex])
        },
        // 触发替换中发生的事件
        onChange(event) {
          // console.log('onChange', event)
          // console.log('item')
        },
        /**
         * 合并文件夹操作
         * @param event
         * @returns {number}
         */
        onUnchoose: function (event) {
          if (
            that.hoverRealItemId("bottomContent", that.hoverIndex) &&
            that.hoverRealItemId("bottomContent", that.hoverIndex) !==
              that.dragItem?.id
          ) {
            //存在目标，且不等于自身，符合合并条件，则执行合并
            const merged = that.useMergeFolder(
              that.copyFootNav,
              that.dragItem,
              that.copyFootNav.find((item) => {
                return (
                  item.id ===
                  that.hoverRealItemId("bottomContent", that.hoverIndex)
                );
              })
            );
            that.copyFootNav.splice(
              that.copyFootNav.findIndex((item) => {
                return (
                  item.id ===
                  that.hoverRealItemId("bottomContent", that.hoverIndex)
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
        (currentLeft - panelLeft) % ((72 * this.navAttribute.navSize) / 100);
      const isGap = !(
        relativePos <= (42 * this.navAttribute.navSize) / 100 &&
        relativePos >= (10 * this.navAttribute.navSize) / 100
      );
      let nIndex = Math.floor(
        (currentLeft - panelLeft + 20) /
          ((72 * this.navAttribute.navSize) / 100)
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
      this.$nextTick(() => {
        this.enableDrag();
        this.skipSort = false;
      });
    },
    hoverRealItemId,
    useMergeFolder,
    delNavigation(sumList, oneNav, index, delMethod) {
      if (!this.mainNavigationList.find((item) => item.name === oneNav.name)) {
        //如果不是必须的
        delMethod(index);
      } else {
        if (sumList.find((item) => item.name === oneNav.name)) {
          //正常移除
          delMethod(index);
        } else {
          //不可移除
          message.info(`导航栏中至少保留一个「${oneNav.name}」`);
        }
      }
    },

    /**
     * 重置元素位置
     */
    resetElementPosition() {
      const draggableSize = this.currentItem.customSize
        ? this.currentItem.customSize.split("x")
        : this.resize.split("x");
      // 视图大小
      let vW = window.innerWidth;
      // 元素坐标
      let posX = Number(this.defaultPosition.x.toFixed(0));
      // 元素大小
      let menuW = draggableSize[0] * 140;
      posX =
        posX > vW - menuW / 2
          ? vW - menuW
          : posX - menuW / 2 < 0
          ? 0
          : posX - menuW / 2;
      this.left = posX;
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
