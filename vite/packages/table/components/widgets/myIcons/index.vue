<template>
    <Widget :customData="customData" :customIndex="customIndex" :options="options" :menuList="menuList" ref="homelSlotRef"
        :desk="desk">
        <div class="controller">
            <div class="item" v-for="item in 13">{{ item }}</div>
        </div>
    </Widget>
    <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
        <template #title>
            <div class="text-center">设置</div>
        </template>
       
        <div class="text-base" style="margin: 12px 0">背景色</div>
        <div class="text-base" style="margin: 12px 0">图标</div>
    </a-drawer>
</template>

<script>
import Widget from '../../card/Widget.vue'
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
                        this.$refs.homelSlotRef.visible = false
                        this.settingVisible = true
                    }
                }
            ],
            settingVisible:false
        }
    },
}
</script>

<style lang="scss" scoped>
.controller {
    border: 1px solid red;
    width: 98%;
    margin: 0 auto;
    margin-top: -23px;
    // height: 356px;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: hidden;

    .item {
        width: 48%;
        height: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1%;
        padding: 1%;
        box-sizing: border-box;
        background: gold;
    }
}
</style>