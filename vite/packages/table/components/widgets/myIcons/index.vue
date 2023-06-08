<template>
    <Widget :customData="customData" :customIndex="customIndex" :options="options" :menuList="menuList" ref="homelSlotRef"
        :desk="desk">
        <div class="controller">
            <div class="item" v-for="item in 13">{{ item }}</div>
        </div>
    </Widget>
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
                className: 'card double',
                title: '图标组件',
                icon: 'time-circle',
                type: 'games',
            },
        }
    },
}
</script>

<style lang="scss" scoped>
.controller {
    border: 1px solid red;
    width: 100%;
    height: 356px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;

    .item {
        width: 18%;
        height: 108px;
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