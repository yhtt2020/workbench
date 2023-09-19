<template>

    <Widget @click="onHistoryMessage" :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk" >
        <div class="top-icon">
            <Icon icon="akar-icons:check-box" />
        </div>
        <div class="dash-board">
            <div class="dash-cell pointer" :class="item.className" v-for="(item, index) in dataList" :key="index">
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
                title: "社区待办",
                // icon: "bianji",
                // icon: "shezhi1",
                icon: "iconamoon:history-fill",
                // icon: "games-16-filled",
            },
            dataList:[
                {
                    title:"内容审核",
                    num:"123",
                    className:"green-cell"
                },
                {
                    title:"今日注册",
                    num:"123",
                    className:"red-cell"
                },
                {
                    title:"今日发布",
                    num:"123",
                    className:"yellow-cell"
                },
                {
                    title:"今日评论",
                    num:"123",
                    className:"yellow-cell"
                },
                {
                    title:"今日访问",
                    num:"123",
                    className:"yellow-cell"
                },
                {
                    title:"今日访问",
                    num:"123",
                    className:"green-cell"
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
        border-radius: 10px;
        margin-top: 12px;
    }


    .dash-cell .cell-title{
        margin-top: 22px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255,255,255,0.60) !important;
        font-weight: 400;
    }
    .dash-cell .cell-num{
        margin-top: 11px;
        font-family: Oswald-Medium;
        font-size: 24px;
        font-weight: 500;
    }

    .green-cell{
        // opacity: 0.2;
        background-color: rgba( #52C41A, 0.2);
        color: #52C41A;
    }
    .red-cell{
        background-color: rgba( #FF4D4F, 0.2);
        color: #FF4D4F;
    }
    .yellow-cell{
        background-color: rgba( #FAAD14, 0.2);
        color: #FAAD14;
    }
</style>
  