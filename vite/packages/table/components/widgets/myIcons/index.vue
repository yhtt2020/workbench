<!-- 图标组件入口 -->
<!-- 2023-12-19 该组件数据体和新版本有差异 -->
<template>
  <!-- 图标组件开始 Widget -->
  <!-- <Widget
    :customData="customData"
    :editing="true"
    :customIndex="customIndex"
    :options="options"
    :menuList="menuList"
    ref="homelSlotRef"
    :desk="desk"
  > -->
  <div ref="iconRef" class="box-border icon-box" :style="dragStyle">
    <!-- 可放置区域 -->
    <droppable-area @drop="handleDrop">
      <xt-container
        :header="header"
        v-model:customSize="customData.customSize"
        :customIndex="customIndex"
        :size="customSize"
        :options="options"
        :menuList="menuList"
        ref="homelSlotRef"
        :customData="customData"
        :desk="desk"
      >
        <drag-and-follow
          :isSelect="isSelect"
          :length="this.iconsRefs.length"
          @drag-end="handleDragEnd"
          @drag-start="handleDragStart"
        >
          <!-- 多图标组件 -->
          <!-- <template
            v-if="
              customData.iconList !== undefined &&
              customData.iconList.length > 1
            "
          >
            <div>
              <icons
                v-model:width="customData.size.w"
                v-model:height="customData.size.h"
                :groupTitle="customData.groupTitle"
                :iconList="customData.iconList"
                :zoom="customData.zoom"
                @custom-event="handleCustomEvent"
                @disbandGroup="disbandGroup"
                @updateGroupTitle="updateGroupTitle"
                @deleteIcons="deleteIcons"
                @editIcons="editIcons"
                @dragAddIcon="dragAddIcon"
                @iconsRightClick="handleMenu()"
              ></icons>
            </div>
          </template> -->
          <!-- 单图标组件 -->
          <!-- <template
            v-else-if="
              customData.iconList !== undefined &&
              customData.iconList.length > 0
            "
          > -->
          <icon
            v-if="
                customData.iconList !== undefined &&
                customData.iconList.length > 0
              "
            :newIcon="customData.newIcon"
            v-bind="customData?.iconList[0]"
            @custom-event="handleCustomEvent"
            @openCard="openCard"
          ></icon>
          <!-- </template> -->
        </drag-and-follow>
      </xt-container>
    </droppable-area>
    <!-- 卡片核心 -->
  </div>
  <!-- </Widget> -->
  <!-- 图标组件结束 -->
  <!-- 内容编辑 -->
  <Set
    v-if="settingVisible"
    v-model="settingVisible"
    :index="1000"
    @save="closeSet"
  ></Set>
  <!-- 卡片弹窗 -->
  <ModelCard
    v-if="modelVisible"
    v-model:modelVisible="modelVisible"
    :cardData="cardData"
  />
  <!-- 多图标组件设置 -->
  <!-- <XtDrawer v-model="iconsSetVisible" placement="right">
    <div class="p-4 xt-bg-2 rounded-xl">
      <div class="flex justify-between mb-2">
        <div>放大模式</div>
        <a-switch v-model:checked="customData.zoom.state" />
      </div>
      <div class="text-sm xt-text-2">
        该模式下可以自由拖动文件夹大小，直接点击打开文件夹内的应用或连接。
      </div>
    </div>
  </XtDrawer> -->
</template>
<script>
import {defineAsyncComponent} from "vue";

import {iconValidate} from "../../../apps/appCenter/src/views/developer/hooks/validate.ts";
// components
import Widget from "../../card/Widget.vue";
import icon from "./components/icon.vue";
import DragAndFollow from "./components/DragAndFollow.vue";
import DroppableArea from "./components/DroppableArea.vue";

const Set = defineAsyncComponent(() => import("./set/index.vue"));
const ModelCard = defineAsyncComponent(() =>
  import("../../windowPanel/components/ModelCard.vue")
);
// pinia
import {mapActions, mapWritableState} from "pinia";
import {cardStore} from "../../../store/card.ts";
import {taskStore} from "../../../apps/task/store";

import {myIcons} from "../../../store/myIcons.ts";

import {message} from "ant-design-vue";
import _ from "lodash-es";
import {
  defaultFolderData,
  defaultData,
} from "../../../apps/folder/src/components/options";

import {nanoid} from "nanoid";
import {useFreeLayoutStore} from "../../desk/freeLayout/store";
import {update} from "../../../apps/appCenter/src/views/developer/hooks/update";
import {communityNavStore} from "../../bottomPanel/store/communityNavStore";
import {sizeTransform} from "./set/options";

export default {
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {
      },
    },
    desk: {
      type: Object,
    },
  },
  components: {
    Set,
    Widget,
    icon,
    DragAndFollow,
    DroppableArea,
    ModelCard,
  },
  data() {
    return {
      checked: false,
      index: 0, // 图标数组的下标
      dargFlag: false, // 记录本地拖拽开启状态 用与区别于全局拖拽
      isSelect: false,
      settingVisible: false, // 编辑状态
      iconsSetVisible: false,
      options: {
        custom: true,
        disabledDelete: true,
        disabledNav: true,
        disableEdit: this.isCommunityDesktop(this.desk),
        defaultData: {
          customSize: "1x1",
          _updateFlag: "2461",
        },
      }, // 卡片核心配置
      // 卡片类相关数据
      modelVisible: false, // 卡片弹窗是否可见
      cardData: {}, // 卡片详细数据
    };
  },
  beforeMount() {
    // 是否需要初始化
    let state = false;
    let setData = {};
    if (this.customData.groupTitle == undefined) {
      state = true;
      setData.groupTitle = "分组"; // 初始化分组名称
    }
    if (this.customData.zoom == undefined) {
      state = true;
      setData.zoom = {
        state: true,
        value: "",
      };
    }
    // newIcon false
    if (this.customData.newIcon == false) {
      state = true;
      setData.zoom = {
        state: true,
        value: "",
      };
    }
    if (this.customData.size == undefined) {
      state = true;
      setData.size = {
        w: "280px",
        h: "204px",
      };
    }

    if (state) {
      this.updateCustomData(this.customIndex, setData, this.desk);
    }
  },
  mounted() {
    if (
      this.customData.iconList?.length <= 1 ||
      this.customData.iconList?.length == undefined
    ) {
      return;
    }
    // 是ttapp
    let res = this.customData.iconList[0];
    // 是ttapp
    if (res?.type !== "ttapp") {
      // 校验
      let res = iconValidate(this.customIndex, this.customData.iconList[0]);
      if (!res) return;
    }
    let index = this.desk.cards.findIndex(
      (item) => item.id == this.customIndex
    );
    let list = [];
    this.customData.iconList.forEach((item) => {
      const file = {
        ...defaultData,
        id: nanoid(5),
      };
      file.type = item.open.type;
      file.value = item.open.value;
      file.icon = item.src;
      file.name = item.titleValue;
      file.isName = item.isTitle;
      file.bg = item.backgroundColor;
      file.isBg = item.isBackground;
      file.radius = item.radius;
      file.isRadius = item.isRadius;
      file.iconState = item.imgState;
      file.iconShape = item.imgShape;
      file.size = item.size;
      list.push({
        ...file,
      });
    });
    this.desk.cards[index] = {
      ...this.desk.cards[index],
      name: "folder",
      customData: {
        ...defaultFolderData,
        list,
      },
    };
    this.$bus.emit("reset");
  },
  provide() {
    return {
      customIndex: this.customIndex, // '孙组件数据'
      isDrag: this.isDrag,
    };
  },
  computed: {
    ...mapWritableState(myIcons, [
      "iconOption",
      "isCopy",
      "isPaste",
      "isDrag",
      "iconState",
      "iconList",
      "iconsRefs",
      "iconSelect",
      "edit",
    ]),
    ...mapWritableState(taskStore, ["taskID", "step"]),
    ...mapWritableState(useFreeLayoutStore, ["getCurrentDesk", "isFreeLayout"]),
    // 新版小组件头部设置
    header() {
      return {
        disabled: true,
      };
    },
    m02021() {
      return (
        this.customData.copy === true &&
        this.step == 1 &&
        this.taskID == "M0202"
      );
    },
    m02023() {
      return (
        this.customData.merge === true &&
        this.step == 3 &&
        this.taskID == "M0202"
      );
    },
    m0202() {
      return this.m02021 || this.m02023;
    },
    dragStyle() {
      if (this.isSelect) {
        return {
          opacity: 0.65,
          border: "1px solid var(--active-bg)  !important",
          "border-radius": "12px  !important",
          background: "var(--active-secondary-bg) ",
        };
      } else return {};
    },
    // 右键菜单
    menuList() {
      let menus = [
        {
          icon: "yichu",
          title: "移动",
          fn: () => {
            this.moveIcon();
          },
        },
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            if (this.customData.iconList.length > 1) {
              this.openIconsSet();
            } else {
              this.openEdit();
            }
          },
        },
        {
          newIcon: "akar-icons:trash-can",
          title: "删除",
          color: "#FF4D4F",
          fn: () => {
            this.deleteIcon();
          },
        },
        // {
        //   icon: "guanbi2",
        //   title: "长按框选图标（开发中）",
        //   fn: () => {
        //     this.dragSelection();
        //   },
        // },
      ];
      // 当全局数据长度超过1代表有数据 添加合并操作
      if (this.iconList.length > 0) {
        menus.splice(1, 0, {
          icon: `tianjiakuaijiefangshi`,
          title: "合并",
          fn: () => {
            this.copyIcon();
          },
        });
      }
      if (
        this.customData.iconList !== undefined &&
        this.customData.iconList.length > 1
      ) {
        menus.unshift({
          icon: "zhankai",
          title: "解除分组",
          fn: () => {
            this.disbandGroup();
          },
        });

        // // 查找"设置"菜单项的索引
        // const settingIndex = menus.findIndex((menu) => menu.title === "设置");

        // // 删除"设置"菜单项
        // if (settingIndex !== -1) {
        //   menus.splice(settingIndex, 1);
        // }
      }
      if (this.options.disableEdit) {
        return [];
      } else {
        return menus;
      }
    },
  },
  watch: {

    iconSelect(newV, oldV) {
      // 全局选择被放弃 则恢复状态
      if (this.isSelect && !newV && !this.dargFlag) {
        this.isSelect = false;
      }
    },
    "customData.customSize"(newV, oldV) {
      if (this.edit.size === undefined) {
        this.customData.customSize = "1x1";
      } else {
        this.customData.customSize = sizeTransform[this.edit.size];
      }
    },

    // customData: {
    //   handler(newVal) {
    //     console.log("1x1填充 :>> ", newVal);
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
  methods: {
    ...mapActions(cardStore, ["updateCustomData", "addCard"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),

    openCard() {
      this.cardData = this.customData.iconList[0];
      this.modelVisible = true;
    },
    openIconsSet() {
      this.iconsSetVisible = true;
    },
    openEdit() {
      let icon = this.customData.iconList[this.index];
      this.edit = {};
      Object.keys(this.iconOption).forEach((k) => {
        this.edit[k] = icon[k] !== undefined ? icon[k] : this.iconOption[k];
      });
      this.settingVisible = true;
    },
    // 开启框选
    dragSelection() {
    },
    // ctrl + 点击
    handleCustomEvent(event) {
      console.log(this.customData.iconList[0]);
      this.iconSelect = true;
      this.isSelect = !this.isSelect;
      if (this.isSelect) {
        this.moveIcon();
      } else {
        for (let i = 0; i < this.iconList.length; i++) {
          const {iconIndex} = this.iconList[i];
          if (iconIndex === this.customIndex) {
            this.iconList.splice(i, 1);
          }
        }
        for (let i = 0; i < this.iconsRefs.length; i++) {
          if (this.$refs.homelSlotRef === this.iconsRefs[i]) {
            this.iconsRefs.splice(i, 1);
          }
        }
        if (this.iconList.length == 0) {
          this.isCopy = false;
        }
      }
    },
    // 处于图标组件放置区
    handleDrop() {
      // 拖拽状态下 添加图标组件
      if (this.isDrag) {
        this.copyIcon();
      }
    },
    // 图标组件拖拽开始
    handleDragStart() {
      // 拖拽判断优先级
      // 1、不处于选中状态
      if (!this.isSelect) {
        // 放弃之前的操作 全部清空
        this.iconSelect = false;
        this.iconList = [];
        this.iconsRefs = [];
      }
      this.dargFlag = true;
      this.isDrag = true; // 打开拖拽状态
      this.moveIcon(); // 复制图标组件
    },
    // 图标组件拖拽结束
    handleDragEnd() {
      if (!this.iconSelect) this.isSelect = false;
      this.isDrag = false;
      this.iconList = [];
      this.iconsRefs = [];
      this.dargFlag = false;
    },
    // 删除多图标组件中的单个图标
    deleteIcons(index) {
      this.customData.iconList.splice(index, 1);
    },
    // 编辑多图标组件中的单个图标
    editIcons(index) {
      this.index = index;
      this.edit = this.customData.iconList[index];
      this.settingVisible = true;
      // this.openEdit();
    },
    // 全屏拖拽添加图标
    dragAddIcon(icon) {
      this.addIcon(icon);
    },
    // 添加单图标组件
    addIcon(icon) {
      this.addCard(
        {
          name: "myIcons",
          id: Date.now(),
          customData: {iconList: [{...icon}]},
        },
        this.desk
      );
    },
    // 解除多图标分组
    disbandGroup() {
      // 遍历多图标数组 重新添加到桌面
      for (let i = 0; i < this.customData.iconList.length; i++) {
        // 速度太快会导致ID重复
        setTimeout(() => {
          this.addIcon(this.customData.iconList[i]);
        }, 10);
      }
      this.$refs.homelSlotRef.removeCard(); // 删除原有的多图标组件
      message.success("解除分组成功");
    },
    // 点击移动图标组件
    moveIcon() {
      this.isSelect = true; // 打开选中样式
      let state = false; // 初始化状态
      // 遍历全局数据并拦截重复的数据
      this.iconList.forEach((item) => {
        const {iconIndex} = item;
        if (iconIndex === this.customIndex) state = true;
      });
      if (state) {
        if (this.isDrag == false && this.iconSelect == false)
          message.error("不能复制到同个图标组件上");
        return; // 本次移动被拦截
      }
      this.customData.iconList.forEach((item) => {
        this.iconList.push({
          ...item,
          iconIndex: this.customIndex,
        });
      });
      this.iconsRefs.push(this.$refs.homelSlotRef);
      this.isCopy = true; // 打开复制状态
    },
    // 复制新的图标组件
    copyIcon() {
      this.isSelect = false; // 关闭选中样式
      // if (this.isCopy === false && this.isDrag === false)
      //   return message.error("你还未移动任何图标组件");
      // 遍历全局数组并添加
      this.iconList.forEach((item) => {
        const {iconRef, iconIndex, ...icon} = item;
        // 拦截重复的数据
        if (iconIndex !== undefined && iconIndex === this.customIndex) {
          this.iconState = false; // 关闭该图标状态 本次拖拽锁住无法添加
          return;
        }
        this.customData.iconList.push({...icon});

        // this.$bus.emit("reset");
      });
      let list = [];
      this.customData.iconList.forEach((item) => {
        const file = {
          ...defaultData,
          id: nanoid(5),
        };
        file.type = item.open.type;
        file.value = item.open.value;
        file.icon = item.src;
        file.name = item.titleValue;
        file.isName = item.isTitle;
        file.bg = item.backgroundColor;
        file.isBg = item.isBackground;
        file.radius = item.radius;
        file.isRadius = item.isRadius;
        file.iconState = item.imgState;
        file.iconShape = item.imgShape;
        list.push({
          ...file,
        });
      });
      this.desk.cards = this.desk.cards.map((item) => {
        if (item.id == this.customIndex) {
          item.name = "folder";
          item.customData = {
            ...defaultFolderData,
            list,
          };
        }
        return item;
      });

      // this.desk.cards

      // 遍历图标组件进行删除
      this.iconsRefs.forEach((item) => {
        if (item.customIndex === this.customIndex) return;
        if (item !== undefined) item.removeCard();
      });
      this.isPaste = true; // 打开粘贴状态
      this.isDrag = false;
      this.isCopy = false;
      this.iconsRefs = [];
      this.iconList = [];
    },
    // 删除图标组件
    deleteIcon() {
      this.menuVisible = false;
      if (this.isSelect) {
        for (let i = 0; i < this.iconsRefs.length; i++) {
          this.iconsRefs[i].removeCard();
        }
        this.iconsRefs = [];
        this.iconList = []; // 清空图标列表，防止数据添加到导航栏或者文件夹中
      } else {
        this.$refs.homelSlotRef.removeCard();
      }
    },
    // 更新多图标组件标题
    updateGroupTitle(title) {
      this.customData.groupTitle = title;
    },
    // 右键菜单绑定
    handleMenu() {
      this.menuVisible = true;
    },
    // 适配新版保存图标
    closeSet() {
      if (this.edit.type == 'action') {
        this.edit.value = [...this.edit.actions]
      }
      this.customData.iconList[this.index] = {
        ...this.edit,
        open: {
          type: this.edit.type,
          value: this.edit.value,
          home: this.edit.open.home
        },
      };
      this.customData.customSize = sizeTransform[this.edit.size];
      this.settingVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-box {
  // margin: 0 10px;
  border-radius: 12px;
}
</style>
