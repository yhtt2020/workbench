<template>

    <Widget @click="onHistoryMessage" :sizeList="sizeList" :customData="customData" :customIndex="customIndex" :options="options" ref="cardSlot" :desk="desk"  :menuList="menuList">
        <div class="top-icon">
            <Icon icon="majesticons:monitor-line" />
        </div>
        <div class="dash-board overflow-hidden" style="height: 370px;">
            <Unusual v-if='!this.access_token || !this.baseUrl' title="请完成小组件配置" buttonTitle="立即配置" :back="back" ></Unusual>
            <div v-else class="dash-cell" v-for="(item,index) in targetKeys" :key="index">
                <div class="cell-title">{{ this.mockData[item-1].title }}</div>
                <div class="cell-num" style="font-family: 'Oswald-Medium';">{{ this.mockData[item-1].num == undefined?'-':this.mockData[item-1].num }}</div>
            </div>
        </div>

        <!-- 设置面板 -->
        <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
            <template #extra>
                <div v-show="this.setVisible"  class="xt-active-btn" style="width:64px;height:40px;" @click="changeAccToken(accToken,accUrl)">提交</div>
            </template>
            <vue-custom-scrollbar :settings="settings" style="height: 100%;">
                <div v-show="this.setVisible ">
                    <div class="text-content">
                        <div>关联短说社区系统</div>
                        <div>在使用该功能前，需要关联您的短说社区系统，请在短说管理后台获取系统密钥，填入下方输入框，以及您的管理后台地址，成功完成配置后即可使用。</div>
                        <div>在想天浏览器中打开短说管理后台，可以自动检测获取密钥。</div>
                    </div>
                    <p class="ml-1 mt-1">密钥</p>
                    <a-input style="border-radius: 10px;" v-model:value="this.accToken" placeholder="请输入" class="search pl-1 input-txt"></a-input>
                    <p class="ml-1">管理后台地址</p>
                    <a-input style="border-radius: 10px;" v-model:value="this.accUrl" placeholder="请输入" class="search pl-1 input-txt"></a-input>
                </div>
                <div v-show="!this.setVisible && this.access_token && this.baseUrl">
                    <div class="text-title" @click="this.setVisible = !this.setVisible">
                        关联短说社区系统
                        <span>{{ this.access_token && this.baseUrl ? '已关联 >' : '未关联 >'  }}</span>
                    </div>
                    <div class="text-content">
                        <div>设置小组件数据</div>
                        <div>4*4尺寸的小组件可以选择9个数据，2*4的小组件可以选择六个数据，
                            每个小组件的数据都是独立的，你可以为小组件去不同的名字，自由组合不同的数据维度的小组件看板</div>
                    </div>
                    <p>小组件名称</p>
                    <p>
                        <a-input
                        style="border-radius: 10px;"
                        v-model:value="this.options.title"
                        @change="changeName"
                        maxlength="20"
                        class="search pl-1"></a-input>
                    </p>
                    <!--  穿梭框 -->
                    <p>选择统计数值</p>
                    <div class="transfer" >
                        <a-transfer
                        v-model:target-keys="targetKeys"
                        :data-source="this.mockData"
                        :show-select-all="false"
                        @change="handleChange">
                        <template #render="item">
                            <span class="custom-item" >{{ item.title }}</span>
                        </template>
                        </a-transfer>
                    </div>
                </div>


            </vue-custom-scrollbar>
        </a-drawer>

    </Widget>


</template>

<script>
import axios from "axios";
import Widget from "../../../card/Widget.vue";
import { Icon } from '@iconify/vue';
import { defineComponent, ref, onMounted } from 'vue';
import {cardStore} from "../../../../store/card";
import {mapActions, mapState,mapWritableState} from "pinia";
import { shortTalkStore } from '../store'
import Unusual from '../../Unusual.vue'

export default {
    components:{
        Widget,
        Icon,
        defineComponent,
        Unusual,
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
    computed: {
        ...mapWritableState(shortTalkStore, ['mockData','access_token','baseUrl','setVisible']),
    },
    data() {
        return {
            settings: {
                swipeEasing: true,
                suppressScrollY: false,
                suppressScrollX: true,
                wheelPropagation: false,
            },
            sizeList: [
                {
                title: '2x4',
                height: 2,
                width: 1,
                name: '2x4'
                },
                {
                title: '4x4',
                height: 2,
                width: 2,
                name: '4x4'
                },
            ],
            settingVisible: false,
            // 密钥和地址
            secKey:"",
            secAdd:"",
            menuList: [
                {
                    icon: 'shezhi1',
                    title: '设置',
                    fn: () => {
                        this.settingVisible = true;
                        this.$refs.cardSlot.visible = false
                        this.setVisible = false
                    }
                },
            ],
            options: {
                className: "card",
                title: "社区数据",
                // 左侧图标
                // icon: "iconamoon:history-fill",
                rightIcon:"fluent:open-20-filled",
            },
            targetKeys:[1,2,3,4,5,6,7,8,9],
            // 密钥和地址
            accToken:'',
            accUrl:'',

        };
    },
    mounted() {
        // 初始化
        this.accToken = this.access_token
        this.accUrl = this.baseUrl
        this.init()


    },
    methods:{
        ...mapActions(cardStore, ['updateCustomData']),
        ...mapActions(shortTalkStore, ['getBoardData','changeAccToken']),
        init(){
            // 初始化设置数组
            if(!this.customData.targetKeys){
                this.updateCustomData(this.customIndex,{
                    "targetKeys": [1,2,3,4,5,6,7,8,9],
                },this.desk)
            }else{
                this.targetKeys = this.customData.targetKeys
            }
            // 初始化名称
            if(!this.customData.optionTitle){
                this.updateCustomData(this.customIndex,{
                    "optionTitle": '社区数据',
                },this.desk)
            }else{
                this.options.title = this.customData.optionTitle
            }
            // 初始化获取详细数据
            this.getBoardData()


        },
        // 修改设置的数组
        handleChange(keys, direction, moveKeys){
            this.updateCustomData(this.customIndex,{
                'mockData':this.mockData,
                "targetKeys": keys,
            },this.desk)

        },
        // 修改小组件名称
        changeName(){
            this.updateCustomData(this.customIndex,{
                "optionTitle": this.options.title,
            },this.desk)
        },

        back(){
            this.settingVisible = true
            this.setVisible = true
        }

    },
    watch:{
        // 监听token 跟 url
        'access_token':{
            handler(newVal, oldVal){
            this.accToken = this.access_token
                this.init()
            }
        },
        'baseUrl':{
            handler(newVal, oldVal){
            this.accUrl = this.baseUrl
                this.init()
            }
        }
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
    .dash-board{
        display: flex;
        text-align: center;
        flex-wrap: wrap;
        position: relative;
        top: -3px;
        justify-content: space-between;
        align-content: flex-start;
    }

    .dash-cell{
        width: 32%;
        min-width:120px;
        height: 112px;
        background: rgba(0,0,0,0.30);
        border-radius: 10px;
        margin-top: 12px;
    }

    .dash-cell .cell-title{

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

    .transfer ul{
        border-radius: 10px !important;
    }
    // .transfer .ant-transfer-list{
    //     border-radius: 10px !important;

    //     width: 194px;
    //     height: 656px;
    // }
    // .transfer>div{
    //     border-radius: 10px !important;

    // }

    :deep(.ant-transfer-list){
        border-radius: 3px !important;
        max-height: 564px;
        width: 194px !important;
        height: 656px !important;

    }
    :deep(.ant-btn-icon-only.ant-btn-sm){
        width: 40px;
        height: 40px;
        border-radius: 3px;
        margin-top: 8px;
    }



    .text-content{
        width: 100%;
        min-height: 124px;
        background: #2A2A2A;
        border-radius: 12px;
        padding: 10px 16px;

        font-size: 14px;
        color: rgba(255,255,255,0.60);
        font-weight: 400;
        margin-bottom: 10px;
    }
    .text-content div:nth-of-type(1){
        font-size: 16px;
        color: rgba(255,255,255,0.85);
        margin-bottom: 10px;
    }

    .text-content div{
        margin-bottom: 10px;
    }


    .top-btn{
        width: 64px;
        height: 40px;
        border-radius: 10px;
    }

    .text-title{
        width: 100%;
        font-size: 16px;
        padding: 0 16px;
        height: 48px;
        line-height: 48px;
        color: rgba(255,255,255,0.85);
        background: #2A2A2A;
        border-radius: 12px;
        margin-bottom: 16px;
        cursor: pointer;
    }

    .text-title span{
        font-size: 14px;
        color: rgba(255,255,255,0.60);
        float: right;
    }

    :deep(.ant-drawer-body){
        // padding: 100px !important;
        // font-size: 10px;
    }

    .input-txt{
        height: 40px;
        margin-bottom: 12px;
        background-color: #2A2A2A 100%;
    }

    :deep(.ant-pagination){
        text-align: center !important;
    }


    .ant-transfer-list-content::-webkit-scrollbar-track {
        background-color: #f1f1f1 !important;
    }




    // 滚动条
    :deep(.ant-transfer-list-content){
        flex: 1 1 0%;
        overflow: hidden;
        overflow-y: auto;
    }
    :deep(.ant-transfer-list-content::-webkit-scrollbar){
        width: 5px;
    }
    :deep(.ant-transfer-list-content::-webkit-scrollbar-thumb){
        background: #aaa;
        border-radius: 3px;
    }

    :deep(.ant-transfer-list-content-item){
        height: 48px;
    }

    :deep(.ant-checkbox-wrapper){
        margin-left: 5px;
    }
    :deep(.ant-transfer-list-content-item-text){
        margin-left: 5px;

        font-size: 16px;
        color: rgba(255,255,255,0.85);
    }
</style>
