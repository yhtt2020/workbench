<template>
    <Widget :customData="customData" :customIndex="customIndex" :options="options" :menuList="menuList" ref="homelSlotRef"
        :desk="desk" style="display: none">
        隐藏不掉 晚点研究
    </Widget>
    <div class="item xt-text xt-hover" ref="itemRef" @click="iconClick()">
        <div class="image" :style="[backgroundState]">
            <img src="https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg" alt=""
                :style="radiusState" style="width: 56px;height: 56px;">
        </div>
        <div class="title"> {{ customData.titleValue }}</div>
    </div>
    <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
        <template #title>
            <div class="text-center">设置</div>
            <div @click="save()">保存</div>
        </template>
        <edit ref="editRef" v-bind="editOption"></edit>
    </a-drawer>
</template>

<script>
import Widget from '../../card/Widget.vue'

import { cardStore } from '../../../store/card.ts'
import { mapActions } from 'pinia'

import { innerImg } from '../../card/hooks/innerImgHook'
import { message } from 'ant-design-vue'
// C:\Users\16110\Desktop\demo1 (2)\browser\vite\packages\table\js\common\browser.ts
// '../../js/common/browser
import browser from "../../../js/common/browser.ts"
import edit from './edit.vue'
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
        edit
    },
    data() {
        return {
            titleValue: "",
            linkValue: "",
            options: {
                className: 'card small',
                // title: '图标组件',
                // icon: 'time-circle',
                type: 'games',
            },
            menuList: [
                {
                    icon: 'shezhi1',
                    title: '设置',
                    fn: () => {
                        this.$refs.homelSlotRef.menuVisible = false
                        this.settingVisible = true
                    }
                }
            ],
            settingVisible: false,
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
        let setData = {}
        // 初始化数据
        if (this.customData.isRadius == undefined) this.customData.isRadius = false
        if (this.customData.radius == undefined) this.customData.radius = 0
        if (this.customData.isBackground == undefined) this.customData.isBackground = false
        if (this.customData.backgroundColor == undefined) setData.backgroundColor = 'linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)'
        if (this.customData.title == undefined) setData.title = ""
        if (this.customData.link == undefined) setData.link = ""
        if (this.customData.linkValue == undefined) setData.linkValue = ""
        if (Object.keys(setData)) this.updateCustomData(this.customIndex, setData, this.desk)
        this.$refs.itemRef.addEventListener("contextmenu", this.handleMenu, { capture: true })
    },
    // 更新数据
    watch: {
        'customData.isRadius': {
            handler(isRadius, oldV) {
                this.updateCustomData(this.customIndex, { isRadius }, this.desk)
            }
        },
        'customData.radius': {
            handler(radius, oldV) {
                this.updateCustomData(this.customIndex, { radius }, this.desk)
            },
        },
        'customData.isBackground': {
            handler(isBackground, oldV) {
                this.updateCustomData(this.customIndex, { isBackground }, this.desk)
            },
        },
        'customData.backgroundColor': {
            handler(backgroundColor, oldV) {
                this.updateCustomData(this.customIndex, { backgroundColor }, this.desk)
            },
        },
        'customData.titleValue': {
            handler(titleValue, oldV) {
                this.updateCustomData(this.customIndex, { titleValue }, this.desk)
            },
        },
        'customData.link': {
            handler(link, oldV) {
                this.updateCustomData(this.customIndex, { link }, this.desk)
                if (link === '') this.customData.linkValue = ''
            },
        },
        'customData.linkValue': {
            handler(linkValue, oldV) {
                this.updateCustomData(this.customIndex, { linkValue }, this.desk)
            },
        },
    },
    computed: {
        // 动态切换是否使用圆角
        radiusState() {
            if (this.customData.isRadius) return { borderRadius: this.customData.radius + 'px' }
            else return { borderRadius: '0px' }
        },
        backgroundState() {
            if (this.customData.isBackground) return { background: this.customData.backgroundColor }
            else return { background: 'none' }
        },
        editOption() {
            return {
                isRadius: this.customData.isRadius,
                radius: this.customData.radius,
                isBackground: this.customData.isBackground,
                backgroundColor: this.customData.backgroundColor,
                titleValue: this.customData.titleValue,
                link: this.customData.link,
                linkValue: this.customData.linkValue,
            }
        }
    },
    methods: {
        ...mapActions(cardStore, ['updateCustomData']),
        async upIcon() {
            let fileRef = this.$refs.fileRef
            fileRef.click()
            let that = this
            fileRef.onchange = async function (event) {
                if (this.files.length === 0) return
                const file = this.files[0]
                let image = await innerImg(file, 1, 0.6)
                event.target.value = ""
            }
        },
        handleMenu(e) {
            e.preventDefault()
            e.stopPropagation()
            this.$refs.homelSlotRef.menuVisible = true
        },
        save() {
            let editOption = this.$refs.editRef.save()
            Object.keys(editOption).forEach((k) => {
                if (k !== undefined) this.customData[k] = editOption[k]
            })
            message.success("保存成功")
            this.settingVisible = false
        },
        iconClick() {
            console.log('this.customData.link :>> ', this.customData.link);
            if (this.customData.link === "link") browser.openInInner(this.customData.linkValue)
            else if (this.customData.link === "fast") { }
            else if (1) { }
            else {
                console.log('1 :>> ', 1);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.item {
    width: 134px;
    height: 96px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    flex-direction: column;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        border-radius: 10px;
    }

    .image {
        height: 65px !important;
        width: 65px !important;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
    }

    .title {
        padding: 0 5px;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
        height: 18px;
        line-height: 18px;
    }
}
</style>