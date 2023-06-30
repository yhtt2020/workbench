<!-- 图标组件入口 -->
<template>
  <!-- 图标组件开始 -->
  <div ref="iconRef" class="icon-box " :style="dragStyle">
    <!-- 可放置区域 -->
    <droppable-area @drop="handleDrop">
      <drag-and-follow
        :isSelect="isSelect"
        :length="this.iconsRefs.length"
        @drag-end="handleDragEnd"
        @drag-start="handleDragStart"
      >
        <!-- 多图标组件 -->
        <template
          v-if="
            customData.iconList !== undefined && customData.iconList.length > 1
          "
        >
          <div>
            <icons
              :groupTitle="customData.groupTitle"
              :iconList="customData.iconList"
              @custom-event="handleCustomEvent"
              @disbandGroup="disbandGroup"
              @updateGroupTitle="updateGroupTitle"
              @deleteIcons="deleteIcons"
              @editIcons="editIcons"
              @dragAddIcon="dragAddIcon"
            ></icons>
          </div>
        </template>
        <!-- 单图标组件 -->
        <template
          v-else-if="
            customData.iconList !== undefined && customData.iconList.length > 0
          "
        >
          <icon
            v-bind="customData.iconList[0]"
            @rightClick="rightClick"
            @custom-event="handleCustomEvent"
          ></icon>
        </template>
      </drag-and-follow>
    </droppable-area>
    <!-- 卡片核心 -->
    <Widget
      :customData="customData"
      :editing="true"
      :customIndex="customIndex"
      :options="options"
      :menuList="menuList"
      ref="homelSlotRef"
      :desk="desk"
    >
    </Widget>
  </div>
  <!-- 图标组件结束 -->
  <!-- 内容编辑 -->
  <a-drawer
    :width="500"
    v-if="settingVisible"
    v-model:visible="settingVisible"
    placement="right"
    style="z-index: 99999999999"
  >
    <template #title>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div style="width: 50%; text-align: right">设置</div>
        <div
          style="padding: 10px; border-radius: 5px; cursor: pointer"
          class="xt-active-btn"
          @click="save()"
        >
          保存
        </div>
      </div>
    </template>
    <edit
      ref="editRef"
      v-bind="customData.iconList[index]"
    ></edit>
  </a-drawer>
  <!-- 底部导航 -->
  <a-drawer
    v-if="menuVisible"
    :width="500"
    :height="198"
    placement="bottom"
    v-model:visible="menuVisible"
    style="z-index: 99999999"
  >
    <BottomEdit :menuList="menuList"></BottomEdit>
  </a-drawer>
</template>

<script>
// components
import Widget from "../../card/Widget.vue";
import edit from "./components/edit.vue";
import icon from "./components/icon.vue";
import icons from "./icons/index.vue";
import DragAndFollow from "./components/DragAndFollow.vue";
import DroppableArea from "./components/DroppableArea.vue";
import BottomEdit from "./components/bottomEdit.vue";
// pinia
import { mapActions, mapWritableState } from "pinia";
import { cardStore } from "../../../store/card.ts";
import { myIcons } from "../../../store/myIcons.ts";
// import { formatArrayAsFileSize } from './hooks/useFileSize.js';

import { message } from "ant-design-vue";

export default {
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {},
    },
    desk: {
      type: Object,
    },
  },
  components: {
    Widget,
    edit,
    icons,
    icon,
    DragAndFollow,
    DroppableArea,
    BottomEdit,
  },
  data() {
    return {
      menuVisible: false,
      index: 0, // 图标数组的下标
      dargFlag: false, // 记录本地拖拽开启状态 用与区别于全局拖拽
      isSelect: false,
      settingVisible: false, // 编辑状态
      options: { hide: true }, // 卡片核心配置
    };
  },
  mounted() {
    // 绑定右键事件
    this.$refs.iconRef.addEventListener("contextmenu", this.handleMenu, {
      capture: true,
    });
  },
  beforeDestroy() {
    // 取消右键事件
    this.$refs.iconRef.removeEventListener("contextmenu", this.handleMenu, {
      capture: true,
    });
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
    ]),
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
    // 动态计算卡片大小
    reSize() {
      return {
        width:
          (this.customData.width || 1) * this.WIDTH +
          (this.customData.width - 1) * 10 +
          "px",
        height:
          (this.customData.height || 2) * this.HEIGHT +
          (this.customData.height - 1) * 10 +
          "px",
      };
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
            this.menuVisible = false;
            this.index = 0;
            this.settingVisible = true;
          },
        },
        {
          icon: "guanbi2",
          title: "删除",
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

        // 查找"设置"菜单项的索引
        const settingIndex = menus.findIndex((menu) => menu.title === "设置");

        // 删除"设置"菜单项
        if (settingIndex !== -1) {
          menus.splice(settingIndex, 1);
        }
      }
      return menus;
    },
  },
  watch: {
    iconSelect(newV, oldV) {
      // 全局选择被放弃 则恢复状态
      if (this.isSelect && !newV && !this.dargFlag) {
        this.isSelect = false;
      }
    },
  },
  methods: {
    ...mapActions(cardStore, ["updateCustomData", "addCard"]),
    // 开启框选
    dragSelection() {},
    // ctrl + 点击
    handleCustomEvent(event) {
      this.iconSelect = true;
      this.isSelect = !this.isSelect;
      if (this.isSelect) {
        this.moveIcon();
      } else {
        for (let i = 0; i < this.iconList.length; i++) {
          const { iconIndex } = this.iconList[i];
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
      this.settingVisible = true;
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
          customData: { iconList: [{ ...icon }] },
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
      this.$refs.homelSlotRef.doRemoveCard(); // 删除原有的多图标组件
      message.success("解除分组成功");
    },
    // 点击移动图标组件
    moveIcon() {
      this.isSelect = true; // 打开选中样式
      this.isSelect = true; // 打开选中样式
      this.menuVisible = false; // 隐藏控件
      let state = false; // 初始化状态
      // 遍历全局数据并拦截重复的数据
      this.iconList.forEach((item) => {
        const { iconIndex } = item;
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
      this.menuVisible = false; // 隐藏控件
      this.isSelect = false; // 关闭选中样式
      // if (this.isCopy === false && this.isDrag === false)
      //   return message.error("你还未移动任何图标组件");
      // 遍历全局数组并添加
      this.iconList.forEach((item) => {
        const { iconRef, iconIndex, ...icon } = item;
        // 拦截重复的数据
        if (iconIndex !== undefined && iconIndex === this.customIndex) {
          this.iconState = false; // 关闭该图标状态 本次拖拽锁住无法添加
          return;
        }
        this.customData.iconList.push({ ...icon });
      });
      // 遍历图标组件进行删除
      this.iconsRefs.forEach((item) => {
        if (item.customIndex === this.customIndex) return;
        if (item !== undefined) item.doRemoveCard();
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
          this.iconsRefs[i].doRemoveCard();
        }
        this.iconsRefs = [];
      } else {
        this.$refs.homelSlotRef.doRemoveCard();
      }
    },
    // 更新多图标组件标题
    updateGroupTitle(title) {
      this.customData.groupTitle = title;
    },
    // 右键菜单绑定
    handleMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      this.menuVisible = true;
    },
    // 保存图标
    save() {
      let editOption = this.$refs.editRef.save(); // 获取编辑组件的最新数据
      if (typeof editOption === "string") return message.error(editOption);
      console.log("editOption :>> ", editOption);
      Object.keys(editOption).forEach(
        (k) => (this.customData.iconList[this.index][k] = editOption[k])
      );
      message.success("保存成功");
      this.settingVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-box {
  // margin: 0 10px;
}
</style>
