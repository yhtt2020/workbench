<template>
    <div ref="iconRef" :style="opacityStyle">
        <Widget :customData="customData" :editing="true" :customIndex="customIndex" :options="options" :menuList="menuList"
            ref="homelSlotRef" :size="reSize" :desk="desk">
        </Widget>
        <template v-if="customData.iconList !== undefined && customData.iconList.length > 1">
            <icons :iconList="customData.iconList" @disbandGroup="disbandGroup"></icons>
        </template>
        <template v-else-if="customData.iconList !== undefined && customData.iconList.length > 0">
            <icon v-bind="customData.iconList[0]"></icon>
        </template>
    </div>
    <!-- 编辑开始 -->
    <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
        <template #title>
            <div style="display: flex; justify-content: space-between; align-items:center">
                <div style="width: 50%;text-align: right;">设置</div>
                <div style="padding: 10px;border-radius: 5px;cursor: pointer;" class="xt-active-bg" @click="save()">保存</div>
            </div>
        </template>
        <edit ref="editRef" v-bind="customData.iconList[0]"></edit>
    </a-drawer>
    <!-- 编辑结束 -->
</template> 

<script>
// components
import Widget from '../../card/Widget.vue'
import edit from './edit.vue'
import icon from "./oneIcon/index.vue"
import icons from "./multipleIcons/index.vue"

// pinia
import { mapActions, mapWritableState } from 'pinia'
import { cardStore } from '../../../store/card.ts'
import { myIcons } from '../../../store/myIcons.ts'

import { message } from 'ant-design-vue'
import api from '../../../../../src/model/api.js'
import clickAndDragMixin from "./hooks/clickAndDragMixin.js"
export default {
    mixins: [clickAndDragMixin],
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
        icon
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
        this.$refs.iconRef.addEventListener("contextmenu", this.handleMenu, { capture: true })
    },
    beforeDestroy() {
        this.$refs.iconRef.removeEventListener("contextmenu", this.handleMenu, { capture: true })
    },
    computed: {
        ...mapWritableState(myIcons, ['iconOption', 'baseIconOption', 'copyIconOption', 'copyIconIndex', 'iconRef', 'isCopy']),
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
                        title: '粘贴',
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
                        title: '粘贴',
                        fn: () => { this.copyIcon() }
                    },
                    {
                        icon: 'shezhi1',
                        title: '设置',
                        fn: () => {
                            this.$refs.homelSlotRef.menuVisible = false
                            this.settingVisible = true
                        }
                    },
                ]
            }

        },
    },
    methods: {
        ...mapActions(cardStore, ['updateCustomData', 'addCard']),
        // 解除图标分组
        async disbandGroup() {
            for (let i = 0; i < this.customData.iconList.length; i++) {
                this.addCard({ name: "myIcons", id: Date.now(), customData: { iconList: [{ ...this.customData.iconList[i] }] } }, this.desk)
            }
            this.$refs.homelSlotRef.doRemoveCard()
            message.success("解除分组成功")
        },
        // 点击移动图标组件
        moveIcon() {
            this.$refs.homelSlotRef.menuVisible = false
            Object.keys(this.customData.iconList[0]).forEach((k) => {
                this.copyIconOption[k] = this.customData.iconList[0][k]
            })
            this.copyIconIndex = this.customIndex
            this.iconRef = this.$refs.homelSlotRef
            this.isCopy = true
            this.opacityStyle = { opacity: 0.65 }

        },
        // 复制新的图标组件
        copyIcon() {
            if (this.isCopy === false) return message.error("你还未复制任何图标组件")
            if (this.copyIconIndex === this.customIndex) return message.error("不能复制到同个图标组件上")
            this.customData.iconList.push({ ...this.copyIconOption })
            this.iconRef.doRemoveCard()
            message.success("移动成功")
            this.isCopy = false
            this.$refs.homelSlotRef.menuVisible = false
        },

        handleMenu(e) {
            e.preventDefault()
            e.stopPropagation()
            this.$refs.homelSlotRef.menuVisible = true
        },
        // 保存
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