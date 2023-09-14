<template>
    <div>

        <Widget :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk">
        <div class="icon-topline">
            <pushpin-outlined></pushpin-outlined>
        </div>
        <div class="top-col">
            <div class="col-left">
                <span class="flex-1 h-full nav-item flex justify-center btn-active items-center relative pointer span-flex"  :class="['item', { action: actionIndex == 1 }]" @click="onChangeTopIndex(1)">
                    <div class="span-icon">
                        <clock-circle-outlined />
                    </div>
                    剪贴板历史</span>
                <span class="flex-1 h-full nav-item flex justify-center btn-active items-center relative pointer span-flex"  :class="['item', { action: actionIndex == 2 }]" @click="onChangeTopIndex(2)">
                    <div class="span-icon">
                        <star-outlined /> 
                    </div>
                    收藏</span>
                </div> 
                <div class="col-right">
                    <div class="icon-right">
                        <appstore-outlined />
                    </div>
                    <div class="icon-right">
                        <search-outlined />
                    </div>
            </div>
        </div>
        <div class="clip-body">
            <div class="col">
                1
            </div>
            <div class="col">
                1
            </div>
            <div class="col">
                1
            </div>
            <div class="col">
                1
            </div>
        </div>


    </Widget>
    </div>
    
</template>
  
<script>
import axios from "axios";
import Widget from "../../card/Widget.vue";
import { PushpinOutlined, ClockCircleOutlined, StarOutlined, AppstoreOutlined, SearchOutlined } from '@ant-design/icons-vue';

// 导入剪贴板测试数据
// import { fileList, videoList, audioList }  from "../../../js/data/chatList"
export default {
    components:{
        Widget,
        PushpinOutlined,
        ClockCircleOutlined,
        StarOutlined,
        AppstoreOutlined,
        SearchOutlined,
        
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
                className: "card double",
                title: "剪贴板",
                // icon: "shezhi1",
            },
            actionIndex:1,
        };
    },
    async mounted() {

    },
    methods:{
        onChangeTopIndex(index){
            this.actionIndex = index;
        }
    }
};
</script>
  
<style lang="scss" scoped>

    .icon-topline{
        position: absolute;
        top: 10px;
        left: 18px;
    }
    .icon-topline span{
        width: 20px !important;
        height: 20px !important;
        // font-size: 20px;
    }
    .top-col{
        display: flex;
        margin-top: 12px;
        width: 100%;
        height: 44px;
        // border: 1px solid #fff;
    }
    .col-left{
        width: 432px;
        height: 100%;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 8px;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.30);
        display: flex;
        // overflow-x: auto;
        white-space: nowrap;
        overflow: hidden;
    }


    .col-left>span {
        text-align: center;
        display: block;
        height: 44px;
        margin: 0.6% 0;
        text-align: center;
        line-height: 44px;
        border-radius: 8px;
        flex-shrink: 0;
      }

    span {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
        text-align: center;
        font-weight: 400;
        line-height: 44px;
    }
    
    .span-flex{
        display: flex !important;
        flex-wrap: nowrap;
    }
    .span-icon>span{
        position: relative;
        top: 3px;
        left: -6px
        // float: left;
    }
    // .col-left span:nth-of-type(1){
    //     line-height: 24px;
    // }

    .action {
        // width: 100%;
        // height: 100%;
        background: #508BFE;
        cursor: pointer;
        border-radius: 8px;
        flex: 1;
        line-height: 33px !important;
        padding: 0.3em 0;
        align-self: center;
    }
    
    .col-right{
        display: flex;
    }

    .col-right .icon-right{
        margin-right: 12px;
        width: 44px;
        height: 44px;
        background: rgba(0,0,0,0.30);
        border-radius: 8px;
        text-align: center;
        line-height: 44px;
    }

    .clip-body{
        flex-wrap: wrap;
        display: flex;
    }
    .clip-body .col{
        width: 266px;
        height: 144px;
        text-align: center;
        line-height: 144px;
        border-radius: 12px;
        border: 1px solid #fff;
        margin-top: 12px;
    }

    .clip-body .col:nth-of-type(2n){
        margin-left: 12px;
    }
</style>
  