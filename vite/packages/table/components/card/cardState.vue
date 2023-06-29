<template>
    <div class="controller-state" :style="{ width: window.w, height: window.h,background: bg == true ? 'var(--primary-bg)' :'' }" v-if="state !== ''">
        <img :style="{ zoom: `${zoom}%` }"  :src="`/public/img/state/${state}.png`" alt="">
        <div>{{ text[`${state}`] }}</div>
        <template v-if="state !== 'null'">
            <!-- 按钮控制有两种：1、插槽 2、回调 -->
            <slot :row="{}">
                <div class="click no-drag" @click="onClick()">{{ btn[`${state}`] }}</div>
            </slot>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        // 显示的状态
        state: {
            type: String,
            default: "init",
        },
        // 显示的窗口大小 两种方式 1、外部定义宽高 2、传递window对象
        window: {
            type: Object,
            default: () => {
                return {
                    w: "100%",
                    h: "100%"
                }
            }
        },
        // 显示的图片大小
        zoom: {
            type: Number,
            default: 40
        },
        // 显示的文本内容
        text: {
            type: Object,
            default: () => {
                return {
                    init: "请先绑定", // 初始化
                    null: "暂无数据", // 空数据
                    false: "加载失败" // 失败
                }
            }
        },
        // 显示的文本内容
        btn: {
            type: Object,
            default: () => {
                return {
                    init: "绑定", // 初始化
                    false: "刷新" // 失败
                }
            }
        },
        // 是否显示背景
        bg: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onClick() {
            this.$emit("onClick")
        }
    }
}
</script>

<style lang="scss" scoped>
.controller-state {
    // background: var(--active-bg);
    color: var(--primary-text);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    border-radius: 10px;
}
img {
    margin-bottom: 20px;
}
.click {
    margin-top: 20px;
    padding: 13px 26px;
    background: var(--primary-bg);
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        background: var(--active-bg);
    }
}
</style>