<template>

    <Widget @click="onHistoryMessage" :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk" >
        <div class="top-icon">
            <Icon icon="akar-icons:chat-question" />
        </div>
        <div class="guider-body">
            <div class="guider-cell pointer" v-for="(item,index) in dataList" :key="index">
                <div class="cell-icon">
                    <Icon :icon="item.iconUrl" />
                </div>
                <span style="margin-left: 10px;">{{ item.title }}</span>
            </div>
        </div>

    </Widget>


</template>
  
<script>
import axios from "axios";
import Widget from "../../card/Widget.vue";     
import { Icon } from '@iconify/vue';
export default {
    components:{
        Widget,
        Icon,
    },

    props: {
        customIndex: {
            type: Number,
            default: 0,
        },
        customData: {
            type: Object,
            default: () => { },
        },
        menuList: {
            type: Array,
        },
        desk: {
            type: Object,
        },
        editing: {
            type: Boolean,
        },
    },
    data() {
        return {
            options: {
                className: "card",
                title: "社区助手",
                // icon: "bianji",
                // icon: "shezhi1",
                icon: "iconamoon:history-fill",
                rightIcon:"fluent:open-20-filled",
                // icon: "games-16-filled",
            },
            dataList:[
                {
                    title:"短说社区客服",
                    iconUrl:"akar-icons:chat-question"
                },
                {
                    title:"短说通用版V4版本使用手册sdadsad",
                    iconUrl:"akar-icons:chat-question"
                },
                {
                    title:"短说PC版V2版本使用手册",
                    iconUrl:"akar-icons:chat-question"
                },
                {
                    title:"短说企业版差异部分手册",
                    iconUrl:"akar-icons:chat-question"
                },
                {
                    title:"断手二次开发技术文档",
                    iconUrl:"akar-icons:chat-question"
                },
                {
                    title:"短说企业文化社区解决方案",
                    iconUrl:"akar-icons:chat-question"
                },
            ]
        };
    },
    async mounted() {

    },
    methods:{

    }
};
</script>
  
<style lang="scss" scoped>
    .top-icon{
        position: absolute;
        top:17px;
    }
    .top-icon svg{
        width:20px;
        height:20px;
    }
    .guider-body{
        display: flex;
        flex-direction: column;
        position: relative;
        top: -3px;
    }
    
    .guider-cell{
        margin-top: 12px;
        width: 100%;
        height: 50px;
        line-height: 50px;
        background: rgba(0,0,0,0.30);
        border-radius: 12px;
        display: flex;
        padding: 0 14px;
    }
    
    .guider-cell .cell-icon{
        // margin-left: 14px;
        position: relative;
        top: 3px;
    }
    

    .guider-cell .cell-icon svg{
        width: 16px;
        height: 16px;
    }

    .guider-cell span{
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 400;
    }
</style>
  