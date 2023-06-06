<template>
    <Widget :customData="customData" :size="reSize" :customIndex="customIndex" :options="options"
        :menuList="formulaBar" ref="homelSlotRef">
        <cardDrag ref="drag" @reSizeInit="reSizeInit">
            <template #="{ row }">
                <textarea spellcheck="false" :style="{ 'backgroundImage': background, color: colors }"
                    class="test box no-drag" placeholder="输入卡片内容" v-model="text" @blur="updateText">
                </textarea>
            </template>
        </cardDrag>
    </Widget>

    <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
        <template #title>
            <div class="text-center">设置</div>
        </template>
        <cardSize @__updateSize="__updateSize" :isActive="isActive"></cardSize>
        <div class="text-base" style="margin: 12px 0">背景色</div>
        <div class="item-box">
            <div class="item " :key="item" :style="{ 'backgroundImage': color[`${'color' + item}`] }" v-for="item  in 15"
                @click="updateBackground(color[`${'color' + item}`])">
            </div>
        </div>

    </a-drawer>
</template>

<script>
import Widget from "../../card/Widget.vue"
import cardSize from "./hooks/cardSize.vue"
import cardSizeHook from "./hooks/cardSizeHook"

import cardDrag from "./hooks/cardDrag.vue"
import cardDragHook from "./hooks/cardDragHook"

export default {
    mixins: [cardDragHook, cardSizeHook],
    props: {
        customIndex: {
            type: Number,
            default: 0
        },
        customData: {
            type: Object,
            default: () => { }
        }
    },
    directives: {
        // reSize,
    },
    data() {
        return {
            options: {
                className: "card",
                title: "桌面便签",
                icon: "bianji",
                type: "games"
            },
            settingVisible: false,
            menuList: [
                {
                    icon: "shezhi1",
                    title: "设置",
                    fn: () => {
                        this.$refs.homelSlotRef.visible = false
                        this.settingVisible = true
                    }
                }
            ],
            color: {
                color1: "linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
                color2: "linear-gradient(-45deg, #545454 0%, #51E191 0%, #42CAAB 100%)",
                color3: "linear-gradient(-45deg, #545454 0%, #CDF97D 0%, #A1E99D 100%)",
                color4: "linear-gradient(-45deg, #545454 0%, #C0E0FF 0%, #ADC9FF 100%)",
                color5: "linear-gradient(-45deg, #545454 0%, #89E5FF 0%, #70B3FF 100%)",
                color6: "linear-gradient(-45deg, #545454 0%, #44D2DE 0%, #558AED 100%)",
                color7: "linear-gradient(-45deg, #545454 0%, #D9ABE1 0%, #A772FC 100%)",
                color8: "linear-gradient(-45deg, #545454 0%, #F5BC9A 0%, #D57FE6 100%)",
                color9: "linear-gradient(-45deg, #545454 0%, #FDE485 0%, #F895AA 100%)",
                color10: "linear-gradient(-45deg, #BA4348 0%, #A466E9 0%, #BA4244 100%)",
                color11: "linear-gradient(-45deg, #A93AAE 0%, #DA6891 0%, #C987CC 100%)",
                color12: "linear-gradient(-45deg, #545454 0%, #DA6991 0%, #A73781 100%)",
                color13: "linear-gradient(-45deg, #545454 0%, #F1EBF9 0%, #F4CFF6 100%)",
                color14: "linear-gradient(-45deg, #545454 0%, #F9F8F9 0%, #F2F1F2 100%)",
                color15: "linear-gradient(-45deg, #252A31 0%, #30373F 0%, #15161A 100%)",
            },
            text: "",
            background: "",
        }
    },
    created() {
        if (!this.customData.background) {
            this.increaseCustomComponents(this.customIndex, {
                background: this.color.color1,
            });
        }
        if (!this.customData.text) {
            this.increaseCustomComponents(this.customIndex, {
                text: "",
            });
        }
        if (!this.customData.color) {
            this.increaseCustomComponents(this.customIndex, {
                colors: "#ffffff",
            });
        }
    },
    mounted() {
        this.text = this.customData.text
        this.background = this.customData.background
        this.colors = this.customData.color
    },
    components: {
        Widget,
        cardSize,
        cardDrag
    },
    methods: {
        updateText() {
            this.increaseCustomComponents(this.customIndex, {
                text: this.text,
            });
        },
        updateBackground(e) {
            this.increaseCustomComponents(this.customIndex, {
                background: e,
            });
            this.background = e
            if (e == "linear-gradient(-45deg, #545454 0%, #F9F8F9 0%, #F2F1F2 100%)") {
                this.increaseCustomComponents(this.customIndex, {
                    color: "#000000",
                });
                this.colors = "#000000"
            } else {
                this.increaseCustomComponents(this.customIndex, {
                    color: "#ffffff",
                });
                this.colors = "#ffffff"
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.test {
    color: var(--color) !important;
}

.box {
    width: 100%;
    height: 100%;
    background-color: rgba(165, 42, 42, 0);
    border: 0px;
    resize: none;
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
    padding: 12px;
    font-size: 16px;
}

.box::-webkit-scrollbar {
    width: 0;
}

.box:focus {
    outline: none;
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

.drag-boxs {
    display: flex;
    margin-top: -24px;
    width: 100%;
    height: 20px;
    justify-content: end;
}
</style>
