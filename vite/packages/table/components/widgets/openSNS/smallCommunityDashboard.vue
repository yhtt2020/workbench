<template>

    <Widget @click="onHistoryMessage" :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk" >
        <div class="top-icon">
            <Icon icon="majesticons:monitor-line" />
        </div>
        <div class="dash-board">
            <div class="dash-cell pointer" v-for="(item,index) in dataList" :key="index">
                <div class="cell-title">{{ item.title }}</div>
                <div class="cell-num">{{ item.num }}</div>
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
                title: "社区数据看板 小",
                icon: "iconamoon:history-fill",
            },
            dataList:[
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
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
        top:18px;
    }
    .top-icon svg{
        width:20px;
        height:20px;
    }
    .dash-board{
        display: flex;
        text-align: center;
        flex-wrap: wrap;
        position: relative;
        top: -3px;
        justify-content: space-between;
    }

    .dash-cell{
        width: 120px;
        height: 112px;
        background: rgba(0,0,0,0.30);
        border-radius: 10px;
        margin-top: 12px;
    }

    .dash-cell .cell-title{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255,255,255,0.60);
        font-weight: 400;
        margin-top: 23px;
    }
    .dash-cell .cell-num{
        margin-top: 11px;
        font-family: Oswald-Medium;
        font-size: 24px;
        color: rgba(255,255,255,0.85);
        font-weight: 500;
    }
    </style>
  