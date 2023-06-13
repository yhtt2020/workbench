<template>
    <Widget :customData="customData" :customIndex="customIndex" :options="options" :menuList="menuList" ref="homelSlotRef"
        :size="reSize" :desk="desk">
    </Widget>
    <div class="item xt-text xt-hover" ref="itemRef" @click="iconClick()">
        <div class="image" :style="[backgroundState]">
            <img :src="customData.src" alt="" :style="radiusState" style="width: 56px;height: 56px;">
        </div>
        <div class="title"> {{ customData.titleValue }}</div>
    </div>
    <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
        <template #title>
            <div style="display: flex; justify-content: space-between; align-items:center">
                <div style="width: 50%;text-align: right;">设置</div>
                <div style="padding: 10px;border-radius: 5px;cursor: pointer;" class="xt-bg-2" @click="save()">保存</div>
            </div>
        </template>
        <edit ref="editRef" v-bind="editOption"></edit>
    </a-drawer>
</template> 

<script>
import Widget from '../../card/Widget.vue'

import { cardStore } from '../../../store/card.ts'
import { myIcons } from '../../../store/myIcons.ts'
import { mapActions, mapWritableState } from 'pinia'
import { message } from 'ant-design-vue'

import browser from "../../../js/common/browser.ts"
import edit from './edit.vue'
// import api from '../../../src/model/api.js'
// C:\Users\16110\Desktop\demo1 (2)\browser\vite\src\model\api.js
// C:\Users\16110\Desktop\demo1 (2)\browser\vite\packages\table\components\widgets\myIcons\index.vue
import api from '../../../../../src/model/api.js'
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
                hide: true
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
        // 是否需要初始化 
        if (this.customData.init == undefined) {
            let setData = {}
            // pinia获取初始化数据并重置pinia数据
            Object.keys(this.iconOption).forEach((k) => [setData[k], this.iconOption[k]] = [this.iconOption[k], this.baseIconOption[k]])
            this.updateCustomData(this.customIndex, setData, this.desk)
        }
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
        'customData.src': {
            handler(src, oldV) {
                this.updateCustomData(this.customIndex, { src }, this.desk)
            },
        },
        'customData.backgroundIndex': {
            handler(backgroundIndex, oldV) {
                this.updateCustomData(this.customIndex, { backgroundIndex }, this.desk)
            },
        },
    },
    computed: {
        ...mapWritableState(myIcons, ['iconOption', 'baseIconOption']),
        // 动态切换圆角状态
        radiusState() {
            if (this.customData.isRadius) return { borderRadius: this.customData.radius + 'px' }
            else return { borderRadius: '0px' }
        },
        // 动态切换背景状态
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
                src: this.customData.src,
                backgroundIndex: this.customData.backgroundIndex,
            }
        },
        // 动态计算卡片大小
        reSize() {
            return {
                width: 0 + 'px',
                height: 0 + 'px'
            }
        }
    },
    methods: {
        ...mapActions(cardStore, ['updateCustomData']),
        async customUpload(file, insertFn) {
            let url
            var formData = new FormData();
            formData.append("file", file)
            console.log('1 :>> ', formData);
            await api.getCosUpload(formData, (err, data) => {
                console.log('2 :>> ', 2);
                if (!err) {
                    message.error('图片上传失败')
                } else {
                    url = 'http://' + data.data.data
                    // insertFn(url)
                }
            })
            console.log('url :>> ', url);
        },
        handleMenu(e) {
            e.preventDefault()
            e.stopPropagation()
            this.$refs.homelSlotRef.menuVisible = true
        },
        save() {
            let editOption = this.$refs.editRef.save()
            this.customUpload(editOption.src)
            if (typeof (editOption) === 'string') return message.error(editOption)
            Object.keys(editOption).forEach((k) => this.customData[k] = editOption[k])
            message.success("保存成功")
            this.settingVisible = false
        },
        iconClick() {
            if (this.customData.link === "link") browser.openInInner(this.customData.linkValue)
            else if (this.customData.link === "fast" || this.customData.link === "nav") this.openApp()
            else message.error("你还未设置链接/快捷方式")
        },
        openApp() {
            if (typeof this.customData.linkValue === "object" && this.customData.linkValue.type) {
                switch (this.customData.linkValue.type) {
                    case "systemApp":
                        if (this.customData.linkValue.event === "fullscreen") {
                            if (this.full) this.full = false;
                            else this.full = true;
                            tsbApi.window.setFullScreen(!this.full);
                        } else if (this.customData.linkValue.event === "/status") {
                            if (this.$route.path === "/status") this.$router.go(-1);
                            else this.$router.push({ path: "/status" });
                        } else if (this.customData.linkValue.data) {
                            this.$router.push({ name: "app", params: this.customData.linkValue.data });
                        } else this.$router.push({ name: this.customData.linkValue.event });
                        break;
                    case "coolApp":
                        this.$router.push({ name: "app", params: this.customData.linkValue.data });
                        break;
                    case "localApp":
                        require("electron").shell.openPath(this.customData.linkValue.path);
                        break;
                    case "lightApp":
                        ipc.send("executeAppByPackage", { package: this.customData.linkValue.package });
                        break;
                    default:
                        require("electron").shell.openPath(this.customData.linkValue.path);
                }
            } else if (this.customData.linkValue) {
                this.customData.linkValue.path
                    ? require("electron").shell.openPath(this.customData.linkValue.path)
                    : require("electron").shell.openPath(
                        require("path").normalize(this.customData.linkValue)
                    );
            }
        },
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