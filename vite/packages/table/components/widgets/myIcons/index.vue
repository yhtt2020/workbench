<template>
    <Widget :customData="customData" :customIndex="customIndex" :options="options" :menuList="menuList" ref="homelSlotRef"
        :desk="desk" style="width: 1000px;" class="box">
        <div class="controller">
            <div class="item xt-text">
                <div class="image" :style="[backgroundState]">
                    <img src="https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg" alt=""
                        :style="radiusState" style="width: 56px;height: 56px;">
                </div>
                {{ item }}
            </div>
        </div>
    </Widget>


    <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
        <template #title>
            <div class="text-center">设置</div>
        </template>
        <div class="text-base" style="margin: 12px 0">图标名称</div>
        <a-input v-model:value="nameValue" placeholder="想天浏览器" class="xt-bg xt-border" />
        <div class="text-base" style="margin: 12px 0">图标</div>
        <div class="parent" style=" justify-content: start;">
            <div class="image">
                <img src="" alt="" :style="radiusState" style="width: 100%;height: 100%;background: greenyellow;">

            </div>
            <div>
                <p class="xt-text-2" style="font-size: 16px;">推荐图片尺寸：128*128，不能超过2MB</p>
                <input style="display: none" ref="fileRef" type="file" name="" id="" />
                <div @click="upIcon()" class="btn no-drag xt-bg">自定义上传</div>
            </div>
        </div>
        <div class="parent">
            <div class="text-base">图标圆角</div>
            <a-switch v-model:checked="isRadius"></a-switch>
        </div>
        <a-slider v-if="isRadius" v-model:value="radius" :max="50" :step="1" class="no-drag" />
        <div class="parent">
            <div class="text-base">图标背景</div>
            <a-switch v-model:checked="isBackground"></a-switch>
        </div>
        <div v-if="isBackground" class="item-box">
            <div class="item " :key="item" :style="{ background: backgroundColorList[`${'color' + item}`] }"
                v-for="item  in 15" @click="updateBackground(backgroundColorList[`${'color' + item}`])">
            </div>
        </div>
    </a-drawer>
</template>

<script>
import Widget from '../../card/Widget.vue'

import { cardStore } from '../../../store/card.ts'
import { mapActions } from 'pinia'

import { innerImg } from '../../card/hooks/innerImgHook'
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
    },
    data() {
        return {
            isRadius: true,
            radius: 0,
            isBackground: true,
            backgroundColor: "",
            nameValue: "",
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
        if (this.customData.isRadius == undefined) this.customData.isRadius = true
        if (this.customData.radius == undefined) this.customData.radius = true
        if (this.customData.isBackground == undefined) this.customData.isBackground = true
        if (!this.customData.backgroundColor) setData.backgroundColor = this.backgroundColorList.color1
        if (Object.keys(setData)) this.updateCustomData(this.customIndex, setData, this.desk)
        this.isRadius = this.customData.isRadius
        this.radius = this.customData.radius
        this.isBackground = this.customData.isBackground
        this.backgroundColor = this.customData.backgroundColor
    },
    // 更新数据
    watch: {
        isRadius(newV, oldV) {
            this.updateCustomData(this.customIndex, {
                isRadius: newV,
            }, this.desk)
        },
        radius(newV, oldV) {
            this.updateCustomData(this.customIndex, {
                radius: newV,
            }, this.desk)
        },
        isBackground(newV, oldV) {
            this.updateCustomData(this.customIndex, {
                isBackground: newV,
            }, this.desk)
        },
        nameValue(newV, oldV) {
            console.log('newV :>> ', newV);
        },
    },
    computed: {
        // 动态切换是否使用圆角
        radiusState() {
            if (this.isRadius) return { borderRadius: this.radius + 'px' }
            else return { borderRadius: '0px' }
        },
        backgroundState() {
            if (this.isBackground) return { background: this.backgroundColor }
            else return { background: 'none' }
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
        updateBackground(e) {
            this.updateCustomData(this.customIndex, {
                backgroundColor: e,
            }, this.desk)
            this.backgroundColor = e
        },

    }
}
</script>

<style lang="scss" scoped>
.controller {
    z-index: 99999;
    border: 1px solid red;
    // width: 100%;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: auto;

    &::-webkit-scrollbar {
        display: none;
    }

    .item {
        border: 1px solid;
        width: 134px;
        height: 96px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin: 0 1%;
        margin-bottom: 2%;
        // padding: 1%;
        box-sizing: border-box;

        flex-direction: column;

        .image {
            height: 65px !important;
            width: 65px !important;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
        }
    }
}

.text-base {
    font-weight: 500;
    font-family: PingFangSC-Medium;
}


.parent {
    display: flex;
    justify-content: space-between;
    align-content: center;
    margin: 20px 0;

    .btn {
        cursor: pointer;
        width: 120px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-content: center;
        border-radius: 12px;
    }

    .image {
        width: 100px;
        height: 100px;
        box-sizing: border-box;
        padding: 10px;
    }
}

.item-box {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    margin-left: 2px;
}

.item {
    width: 56px;
    height: 56px;
    opacity: 0.65;
    border-radius: 10px;
    cursor: pointer;
    margin: 9px;
}
</style>