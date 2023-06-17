<template>
    <div ref="iconRef" :style="opacityStyle" style="">

        <!-- 可放置区域 -->
        <droppable-area @drop="handleDrop">
            <!-- 可拖拽元素及跟随容器 -->
            <drag-and-follow @drag-end="handleDragEnd" @drag-start="handleDragStart">
                <!-- 可拖拽的 div 元素 -->
                <template v-if="customData.iconList !== undefined && customData.iconList.length > 1">
                    <icons :groupTitle="customData.groupTitle" :iconList="customData.iconList" @disbandGroup="disbandGroup"
                        @updateGroupTitle="updateGroupTitle" @deleteIcons="deleteIcons" @editIcons="editIcons"></icons>
                </template>
                <template v-else-if="customData.iconList !== undefined && customData.iconList.length > 0">
                    <icon v-bind="customData.iconList[0]" @rightClick="rightClick"></icon>
                </template>
            </drag-and-follow>
        </droppable-area>
        <Widget :customData="customData" :editing="true" :customIndex="customIndex" :options="options" :menuList="menuList"
            ref="homelSlotRef" :desk="desk">
        </Widget>

    </div>
    <!-- 编辑开始 -->
    <a-drawer :width="500" v-if="settingVisible" v-model:visible="settingVisible" placement="right"
        style="z-index: 99999999999;">
        <template #title>
            <div style="display: flex; justify-content: space-between; align-items:center">
                <div style="width: 50%;text-align: right;">设置</div>
                <div style="padding: 10px;border-radius: 5px;cursor: pointer;" class="xt-active-bg" @click="save()">保存</div>
            </div>
        </template>
        <edit ref="editRef" v-bind="customData.iconList[index]"></edit>
    </a-drawer>
    <!-- 编辑结束 -->
</template> 

<script>
// components
import Widget from '../../card/Widget.vue'
import edit from './hooks/edit.vue'
import icon from "./oneIcon/index.vue"
import icons from "./multipleIcons/index.vue"
import DragAndFollow from './hooks/DragAndFollow.vue';
import DroppableArea from './hooks/DroppableArea.vue';
// pinia
import { mapActions, mapWritableState } from 'pinia'
import { cardStore } from '../../../store/card.ts'
import { myIcons } from '../../../store/myIcons.ts'

import { message } from 'ant-design-vue'

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
            type: Object
        }
    },
    components: {
        Widget,
        edit,
        icons,
        icon,
        DragAndFollow,
        DroppableArea
    },
    data() {
        return {
            index: 0,
            opacityStyle: {},
            settingVisible: false,
            options: { hide: true },
            backgroundColorList: {
                color1: 'linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)',
                color2: 'linear-gradient(-45deg, #545454 0%, #51E191 0%, #42CAAB 100%)',
                color3: 'linear-gradient(-45deg, #545454 0%, #CDF97D 0%, #A1E99D 100%)',
                color4: 'linear-gradient(-45deg, #545454 0%, #C0E0FF 0%, #ADC9FF 100%)',
                color5: 'linear-gradient(-45deg, #545454 0%, #89E5FF 0%, #70B3FF 100%)',
                color6: 'linear-gradient(-45deg, #545454 0%, #44D2DE 0%, #558AED 100%)',
                color7: 'linear-gradient(-45deg, #545454 0%, #D9ABE1 0%, #A772FC 100%)',
                color8: 'linear-gradient(-45deg, #545454 0%, #F5BC9A 0%, #D57FE6 100%)',
                color9: 'linear-gradient(-45deg, #545454 0%, #FDE485 0%, #F895AA 100%)',
                color10: 'linear-gradient(-45deg, #BA4348 0%, #A466E9 0%, #BA4244 100%)',
                color11: 'linear-gradient(-45deg, #A93AAE 0%, #DA6891 0%, #C987CC 100%)',
                color12: 'linear-gradient(-45deg, #545454 0%, #DA6991 0%, #A73781 100%)',
                color13: 'linear-gradient(-45deg, #545454 0%, #F1EBF9 0%, #F4CFF6 100%)',
                color14: 'linear-gradient(-45deg, #545454 0%, #F9F8F9 0%, #F2F1F2 100%)',
                color15: 'linear-gradient(-45deg, #252A31 0%, #30373F 0%, #15161A 100%)',
            },
        }
    },
    mounted() {
        // 是否需要初始化 
        if (this.customData.groupTitle == undefined) {
            let setData = {}
            setData.groupTitle = "分组"
            this.updateCustomData(this.customIndex, setData, this.desk)
        }
        this.$refs.iconRef.addEventListener("contextmenu", this.handleMenu, { capture: true })
    },
    beforeDestroy() {
        this.$refs.iconRef.removeEventListener("contextmenu", this.handleMenu, { capture: true })
    },
    computed: {
        ...mapWritableState(myIcons, ['iconOption', 'baseIconOption', 'copyIconOption', 'copyIconIndex', 'iconRef', 'isCopy', 'iconList']),
        menuList() {
            if (this.customData.iconList !== undefined && this.customData.iconList.length > 1) {
                return [
                    {
                        icon: 'zhankai',
                        title: '解除分组',
                        fn: () => { this.disbandGroup() }
                    },
                    {
                        icon: 'shezhi1',
                        title: '放置',
                        fn: () => { this.copyIcon() }
                    },
                ]
            } else {
                return [
                    {
                        icon: 'shezhi1',
                        title: '移动',
                        fn: () => { this.moveIcon() }
                    },
                    {
                        icon: 'shezhi1',
                        title: '放置',
                        fn: () => { this.copyIcon() }
                    },
                    {
                        icon: 'shezhi1',
                        title: '设置',
                        fn: () => {
                            this.$refs.homelSlotRef.menuVisible = false
                            this.index = 0
                            this.settingVisible = true
                        }
                    },
                ]
            }

        },
    },
    methods: {
        ...mapActions(cardStore, ['updateCustomData', 'addCard']),
        // 拖拽结束事件处理方法
        handleDragEnd() {
            this.isCopy = false
            console.log('拖拽结束');
            this.iconList = []
            // 执行你想要的操作
        },
        // 放置区域触发事件处理方法
        handleDrop() {
            if (this.isCopy) {
                console.log('放置区域被触发');
                this.copyIcon()
            }
            // 执行你想要的操作
        },
        // 拖拽开始事件处理方法
        handleDragStart(allowDrop) {
            this.isCopy = allowDrop;
            console.log('拖拽开始');
            this.moveIcon()
        },
        // 删除多图标组件中的单个图标
        deleteIcons(index) {
            this.customData.iconList.splice(index, 1)
            message.success("删除成功")
        },
        // 编辑多图标组件中的单个图标
        editIcons(index) {
            this.index = index
            this.settingVisible = true
        },
        // 解除多图标分组
        disbandGroup() {
            for (let i = 0; i < this.customData.iconList.length; i++) {
                // 速度太快会导致ID重复
                setTimeout(() => {
                    this.addCard({ name: "myIcons", id: Date.now(), customData: { iconList: [{ ...this.customData.iconList[i] }] } }, this.desk)
                }, 10);
            }
            this.$refs.homelSlotRef.doRemoveCard()
            message.success("解除分组成功")
        },
        // 点击移动图标组件
        moveIcon() {
            this.iconList.push({
                ...this.customData.iconList[0],
                iconRef: this.$refs.homelSlotRef,
                iconIndex: this.customIndex
            })
            this.$refs.homelSlotRef.menuVisible = false
            this.isCopy = true
            this.opacityStyle = { opacity: 0.65 }
        },
        // 复制新的图标组件
        copyIcon() {
            if (this.isCopy === false) return message.error("你还未复制任何图标组件")
            this.iconList.forEach((item) => {
                const { iconRef, iconIndex, ...icon } = item;
                if (iconIndex === this.customIndex) return message.error("不能复制到同个图标组件上")
                this.customData.iconList.push({ ...icon })
                iconRef.doRemoveCard()
            })
            this.iconList = []
            this.isCopy = false
            this.$refs.homelSlotRef.menuVisible = false
        },
        // 更新多图标组件标题
        updateGroupTitle(title) {
            this.customData.groupTitle = title
        },
        handleMenu(e) {
            e.preventDefault()
            e.stopPropagation()
            this.$refs.homelSlotRef.menuVisible = true
        },
        // 保存图标
        save() {
            let editOption = this.$refs.editRef.save()
            if (typeof (editOption) === 'string') return message.error(editOption)
            Object.keys(editOption).forEach((k) => this.customData.iconList[this.index][k] = editOption[k])
            message.success("保存成功")
            this.settingVisible = false
        },
    }
}
</script>

<style lang="scss" scoped></style>
