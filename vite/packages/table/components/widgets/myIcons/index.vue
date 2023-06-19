<!-- 图标组件入口 -->
<template>
    <!-- 图标组件开始 -->
    <div ref="iconRef" :style="dragStyle">
        <!-- 可放置区域 -->
        <droppable-area @drop="handleDrop">
            <!-- 多图标组件 -->
            <template v-if="customData.iconList !== undefined && customData.iconList.length > 1
                ">
                <icons :groupTitle="customData.groupTitle" :iconList="customData.iconList" @disbandGroup="disbandGroup"
                    @updateGroupTitle="updateGroupTitle" @deleteIcons="deleteIcons" @editIcons="editIcons"
                    @dragAddIcon="dragAddIcon"></icons>
            </template>
            <!-- 单图标组件 -->
            <template v-else-if="customData.iconList !== undefined && customData.iconList.length > 0
                ">
                <drag-and-follow @drag-end="handleDragEnd" @drag-start="handleDragStart">
                    <icon v-bind="customData.iconList[0]" @rightClick="rightClick"></icon>
                </drag-and-follow>
            </template>
        </droppable-area>
        <!-- 卡片核心 -->
        <Widget :customData="customData" :editing="true" :customIndex="customIndex" :options="options" :menuList="menuList"
            ref="homelSlotRef" :desk="desk">
        </Widget>
    </div>
    <!-- 图标组件结束 -->
    <!-- 编辑开始 -->
    <a-drawer :width="500" v-if="settingVisible" v-model:visible="settingVisible" placement="right"
        style="z-index: 99999999999">
        <template #title>
            <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
                <div style="width: 50%; text-align: right">设置</div>
                <div style="padding: 10px; border-radius: 5px; cursor: pointer" class="xt-active-bg" @click="save()">
                    保存
                </div>
            </div>
        </template>
        <edit ref="editRef" v-bind="customData.iconList[index]"></edit>
    </a-drawer>
    <!-- 编辑结束 -->
</template>

<script>
// components
import Widget from "../../card/Widget.vue";
import edit from "./hooks/edit.vue";
import icon from "./oneIcon/index.vue";
import icons from "./multipleIcons/index.vue";
import DragAndFollow from "./hooks/DragAndFollow.vue";
import DroppableArea from "./hooks/DroppableArea.vue";
// pinia
import { mapActions, mapWritableState } from "pinia";
import { cardStore } from "../../../store/card.ts";
import { myIcons } from "../../../store/myIcons.ts";

import { message } from "ant-design-vue";

export default {
    props: {
        customIndex: {
            type: Number,
            default: 0,
        },
        customData: {
            type: Object,
            default: () => { },
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
    },
    data() {
        return {
            index: 0, // 图标数组的下标
            isDragStyle: false,
            settingVisible: false, // 编辑状态
            options: { hide: true }, // 卡片核心配置
        };
    },
    mounted() {
        // 是否需要初始化
        if (this.customData.groupTitle == undefined) {
            let setData = {};
            setData.groupTitle = "分组"; // 初始化分组名称
            this.updateCustomData(this.customIndex, setData, this.desk);
        }
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
        ]),
        dragStyle() {
            if (this.isDragStyle) {
                return {
                    opacity: 0.65,
                    border: "1px solid var(--active-bg)",
                }
            } else return {}
        },
        // 右键菜单
        menuList() {
            if (
                this.customData.iconList !== undefined &&
                this.customData.iconList.length > 1
            ) {
                return [
                    {
                        icon: "zhankai",
                        title: "解除分组",
                        fn: () => {
                            this.disbandGroup();
                        },
                    },
                    {
                        icon: "shezhi1",
                        title: "放置",
                        fn: () => {
                            this.copyIcon();
                        },
                    },
                ];
            } else {
                return [
                    {
                        icon: "shezhi1",
                        title: "移动",
                        fn: () => {
                            this.moveIcon();
                        },
                    },
                    {
                        icon: "shezhi1",
                        title: "放置",
                        fn: () => {
                            this.copyIcon();
                        },
                    },
                    {
                        icon: "shezhi1",
                        title: "设置",
                        fn: () => {
                            this.$refs.homelSlotRef.menuVisible = false;
                            this.index = 0;
                            this.settingVisible = true;
                        },
                    },
                ];
            }
        },
    },
    methods: {
        ...mapActions(cardStore, ["updateCustomData", "addCard"]),
        // 单图标组件拖拽结束
        handleDragEnd() {
            this.iconList = [];
            this.isDragStyle = false
            this.isDrag = false
        },
        // 处于图标组件放置区
        handleDrop(event) {
            if (this.isDrag) {
                this.copyIcon();
            }
        },
        // 单图标组件拖拽开始
        handleDragStart(event) {
            this.iconList = [];
            this.isDrag = true; // 打开拖拽状态
            this.moveIcon(); // 复制图标组件
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
        // 拖拽添加图标
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
            this.$refs.homelSlotRef.menuVisible = false; // 隐藏控件
            let state = false // 初始化状态
            // 遍历全局数据并拦截重复的数据
            this.iconList.forEach((item) => {
                const { iconRef, iconIndex, ...icon } = item;
                if (iconIndex === this.customIndex) state = true;
            });
            if (state) return // 本次移动被拦截
            // 添加数据
            this.iconList.push({
                ...this.customData.iconList[0],
                iconRef: this.$refs.homelSlotRef,
                iconIndex: this.customIndex,
            });
            this.isCopy = true;  // 打开复制状态
            this.isDragStyle = true  // 打开选中样式
        },
        // 复制新的图标组件
        copyIcon() {
            this.$refs.homelSlotRef.menuVisible = false; // 隐藏控件
            this.isDragStyle = false  // 关闭选中样式
            if (this.isCopy === false && this.isDrag === false)
                return message.error("你还未复制任何图标组件");

            // 遍历全局数组并添加
            this.iconList.forEach((item) => {
                const { iconRef, iconIndex, ...icon } = item;
                // 拦截重复的数据
                if (iconIndex === this.customIndex) {
                    this.iconState = false; // 关闭该图标状态 本次拖拽锁住无法添加
                    if (!this.isDrag) message.error("不能复制到同个图标组件上");
                    return;
                }
                this.customData.iconList.push({ ...icon });
                if (iconRef !== undefined) iconRef.doRemoveCard(); // 删除原图标组件
            });
            this.isPaste = true // 打开粘贴状态
            this.iconList = []; // 清空全局数组
            this.isCopy = false; // 重置拷贝状态
        },
        // 更新多图标组件标题
        updateGroupTitle(title) {
            this.customData.groupTitle = title;
        },
        // 右键菜单绑定
        handleMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            this.$refs.homelSlotRef.menuVisible = true;
        },
        // 保存图标
        save() {
            let editOption = this.$refs.editRef.save(); // 获取编辑组件的最新数据
            if (typeof editOption === "string") return message.error(editOption);
            Object.keys(editOption).forEach(
                (k) => (this.customData.iconList[this.index][k] = editOption[k])
            );
            message.success("保存成功");
            this.settingVisible = false;
        },
    },
};
</script>

<style lang="scss" scoped></style>
