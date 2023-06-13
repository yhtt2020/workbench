<template>
    <div>
        <fastNav style="z-index: 9999999999999999999999999;" @returnApp="returnApp" ref="fastNavRef"></fastNav>
        <div class="text-base" style="margin: 12px 0">链接/快捷方式</div>
        <div class="link-box" v-if="_link == ''">
            <div class="xt-bg xt-text xt-hover" @click="_link = 'link'">网页链接</div>
            <div class="xt-bg xt-text xt-hover" @click="fastClick()">快捷方式</div>
            <div class="xt-bg xt-text xt-hover" @click="customClick()">应用导航</div>
        </div>
        <template v-else>
            <a-input v-if="_link === 'link'" @blur="leaveInput()" v-model:value="_linkValue" placeholder="想天浏览器"
                class="xt-bg xt-border input">
                <template #suffix>
                    <div style="border-radius: 50%;padding: 5px;cursor: pointer;"
                        class="xt-bg-2 flex justify-center items-center xt-hover" @click="clear()">
                        <Icon class="icon xt-text  no-drag" icon="guanbi"></Icon>
                    </div>
                </template>
            </a-input>
            <a-input v-else v-model:value="title" placeholder="想天浏览器" class="xt-bg xt-border input" style="border: 0;">
                <template #suffix>
                    <div style="border-radius: 50%;padding: 5px;cursor: pointer;"
                        class="xt-bg-2 flex justify-center items-center xt-hover" @click="clear()">
                        <Icon class="icon xt-text  no-drag" icon="guanbi"></Icon>
                    </div>
                </template>
            </a-input>
        </template>
        <div class="text-base" style="margin: 12px 0">图标名称</div>
        <a-input v-model:value="_titleValue" placeholder="想天浏览器" class="xt-bg xt-border input" />
        <!-- 图标开始 -->
        <div class="text-base" style="margin: 12px 0">图标</div>
        <div class="parent" style="justify-content: start;">
            <div class="image" :style="[backgroundState]">
                <img :src="_src" v-if="_src" :style="radiusState" style="width: 80%;height: 80%;" @error="imgError">
                <div style="border-radius: 50%;padding: 5px;cursor: pointer;"
                    class="xt-modal xt-divider flex justify-center items-center xt-hover clear" @click="this._src = ''">
                    <Icon class="icon xt-text  no-drag" icon="guanbi"></Icon>
                </div>
            </div>
            <div class="img-info">
                <div class="xt-text-2" style="font-size: 16px;">推荐图片尺寸：128*128，不能超过2MB</div>
                <input style="display: none" ref="fileRef" type="file" accept="image/jpg,image/jpeg,image/png" />
                <div @click="upIcon()" class="btn no-drag xt-bg">自定义上传</div>
            </div>
        </div>
        <!-- 图标结束 -->
        <div class="parent">
            <div class="text-base">图标圆角</div>
            <a-switch v-model:checked="_isRadius"></a-switch>
        </div>
        <a-slider v-if="_isRadius" v-model:value="_radius" :max="50" :step="1" class="no-drag" />
        <div class="parent">
            <div class="text-base">图标背景</div>
            <a-switch v-model:checked="_isBackground"></a-switch>
        </div>
        <div v-if="_isBackground" class="item-box">
            <div class="item " :key="item" :style="{ background: backgroundColorList[`${'color' + item}`] }"
                v-for="(item) in 15" @click="backgroundClick(item)" :class="{ active: _backgroundIndex == item }">
            </div>
        </div>
    </div>
</template>

<script>
import fastNav from "./fastNav.vue"
import { validateFile } from '../../card/hooks/innerImgHook'
import { message } from "ant-design-vue";
export default {
    components: { fastNav },
    props: {
        isRadius: { type: Boolean },
        radius: { type: Number },
        isBackground: { type: Boolean },
        backgroundColor: { type: String },
        titleValue: { type: String },
        link: { type: String },
        linkValue: {},
        src: { type: String },
        backgroundIndex: { type: Number },
    },
    data() {
        return {
            _isRadius: this.isRadius,
            _radius: this.radius,
            _isBackground: this.isBackground,
            _backgroundColor: this.backgroundColor,
            _titleValue: this.titleValue,
            _link: this.link,
            _linkValue: this.linkValue,
            _src: this.src,
            _backgroundIndex: this.backgroundIndex,
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
    computed: {
        title() {
            return this._linkValue.name || this._linkValue || "";
        },
        backgroundState() {
            if (this._isBackground) return { background: this._backgroundColor }
            else return { background: 'none' }
        },
        radiusState() {
            if (this._isRadius) return { borderRadius: this._radius + 'px' }
            else return { borderRadius: '0px' }
        },
    },
    methods: {
        imgError() {
            if (this._link === "link") {
                this._src = ''
                this.leaveInput(true)
            }
        },
        leaveInput(flag) {
            // 失去焦点后在调用外部api 减少频繁请求被屏蔽
            if (this._src.length === 0) {
                console.log('flag :>> ', flag);
                if (flag === undefined) this._src = `http://statics.dnspod.cn/proxy_favicon/_/favicon?domain=` + this._linkValue
                else {
                    this._src = `https://www.svlik.com/t/favicon/ico.php?` + this._linkValue
                    console.log('123 :>> ', 123);
                }
            }
        },
        backgroundClick(index) {
            this._backgroundColor = this.backgroundColorList[`${'color' + index}`]
            this._backgroundIndex = index
        },
        clear() {
            this._linkValue = ""
            this._link = ""
        },
        async upIcon() {
            let fileRef = this.$refs.fileRef
            fileRef.click()
            let that = this
            fileRef.onchange = async function (event) {
                if (this.files.length === 0) return
                const file = this.files[0]
                let validate = validateFile(file, 2)
                if (validate !== true) return message.error(validate)
                // that._src = file.path
                that._src = file
                event.target.value = ""
            }
        },
        returnApp(item) {
            if (item instanceof Array) this._linkValue = item[0]
            else this._linkValue = item
            this._link = 'fast'
        },
        save() {
            if (this._src.length == 0) return "未上传图标"
            return {
                isRadius: this._isRadius,
                radius: this._radius,
                isBackground: this._isBackground,
                backgroundColor: this._backgroundColor,
                titleValue: this._titleValue,
                link: this._link,
                linkValue: this._linkValue,
                src: this._src,
                backgroundIndex: this._backgroundIndex
            }
        },
        async customClick() {
            let openPath = await tsbApi.dialog.showOpenDialog({
                title: "选择你的本地应用",
                filters: [{ name: "全部", extensions: ["*"] }],
                properties: ["multiSelections"],
            });
            if (!openPath) return this._link = "";
            else this._linkValue = openPath[0];
            this._link = 'nav'
        },
        fastClick() {
            this.$refs.fastNavRef.showFastNav()
        },
    }
}
</script>

<style lang="scss" scoped>
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

    .img-info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .image {
        position: relative;
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        margin-right: 20px;

        .clear {
            position: absolute;
            top: -10px;
            right: -10px;
        }
    }
}

.item-box {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    margin-left: 2px;

    .item {
        width: 56px;
        height: 56px;
        opacity: 0.65;
        border-radius: 10px;
        cursor: pointer;
        margin: 9px;
    }
}

.link-box {
    display: flex;
    justify-content: space-between;

    div {
        width: 142px;
        height: 48px;
        cursor: pointer;
        border-radius: 12px;
        text-align: center;
        line-height: 48px;
    }
}

.input {
    border-radius: 12px;
    height: 48px;
    border: 0;
}

.icon {
    width: 20px;
    height: 20px;

}

.active {
    border: 2px solid var(--active-bg);
}
</style>