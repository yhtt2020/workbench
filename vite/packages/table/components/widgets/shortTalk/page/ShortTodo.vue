<template>

    <Widget @click="onHistoryMessage" :customData="customData" :customIndex="customIndex" :menuList="menuList" :options="options" ref="dataSlot" :desk="desk">
        <div class="top-icon">
            <Icon icon="akar-icons:check-box" />
        </div>

        <Unusual v-if='!this.access_token || !this.baseUrl' title="请完成小组件配置" buttonTitle="立即配置" :back="back" ></Unusual>
        <div v-else class="dash-board">
            <div class="dash-cell pointer" :class="item.num == 0 || item.num == undefined ? 'green' : item.num < 100 ? 'yellow' : 'red'" v-for="(item, index) in this.todoList" :key="index" @click="jumpUrl(this.admin_url)">
                <div class="cell-title">{{ item.title }}</div>
                <div class="cell-num" style="font-family: 'Oswald-Medium';">{{ item.num == undefined?'-':item.num }}</div>
            </div>
        </div>
        <!-- 设置面板 -->
        <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
            <template #extra>
                <div  class="xt-active-btn" style="width:64px;height:40px;" @click="changeVisible">提交</div>
            </template>
            <vue-custom-scrollbar :settings="settings" style="height: 100%;">
                <div>
                    <div class="text-content">
                        <div>关联短说社区系统</div>
                        <div>在使用该功能前，需要关联您的短说社区系统，请在短说管理后台获取系统密钥，填入下方输入框，以及您的管理后台地址，成功完成配置后即可使用。</div>
                        <div>在想天浏览器中打开短说管理后台，可以自动检测获取密钥。</div>
                    </div>
                    <p class="ml-1 mt-1">密钥</p>
                    <a-input style="border-radius: 10px;" v-model:value="this.accToken" placeholder="请输入" class="search pl-1 input-txt"></a-input>
                    <p class="ml-1 mt-2">管理后台地址</p>
                    <a-input style="border-radius: 10px;" v-model:value="this.accUrl" placeholder="请输入" class="search pl-1 input-txt"></a-input>
                </div>
            </vue-custom-scrollbar>
        </a-drawer>
    </Widget>


</template>

<script>
import axios from "axios";
import Widget from "../../../card/Widget.vue";
import { Icon } from '@iconify/vue';
import {mapActions, mapState,mapWritableState} from "pinia";
import { shortTalkStore } from '../store'
import {cardStore} from "../../../../store/card";
import browser from '../../../../js/common/browser'
import Unusual from '../../Unusual.vue'
export default {
    components:{
        Widget,
        Icon,
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
        ...mapWritableState(shortTalkStore, ['todoList','access_token','baseUrl','admin_url']),
    },
    data() {
        return {
            settings: {
                swipeEasing: true,
                suppressScrollY: false,
                suppressScrollX: true,
                wheelPropagation: false,
            },
            // 标题样式
            options: {
                className: "card",
                title: "社区待办",
                icon: "iconamoon:history-fill",
                rightIcon:"fluent:open-20-filled",
                // icon: "games-16-filled",
            },
            // 设置
            menuList: [
                {
                    icon: 'shezhi1',
                    title: '设置',
                    fn: () => {
                        this.settingVisible = true;
                        this.$refs.dataSlot.visible = false
                    }
                },
            ],
            // 密钥和地址
            accToken:'',
            accUrl:'',
            settingVisible:false,
        };
    },
    mounted() {
        // 初始化
        this.accToken = this.access_token
        this.accUrl = this.baseUrl
        this.getTodoData()
    },
    methods:{
        ...mapActions(cardStore, ['updateCustomData']),
        ...mapActions(shortTalkStore, ['getTodoData','changeAccToken']),
        changeVisible(){
            this.settingVisible = false
            this.changeAccToken(this.accToken,this.accUrl)
        },
        jumpUrl(url){
            browser.openInUserSelect(url)
        },
        back(){
            this.settingVisible = true
        }
    },
    watch:{
        // 监听token 跟 url
        'access_token':{
            handler(newVal, oldVal){
                this.accToken = this.access_token
                this.getTodoData()
            }
        },
        'baseUrl':{
            handler(newVal, oldVal){
                this.accUrl = this.baseUrl
                this.getTodoData()
            }
        },
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
    }

    .dash-cell{
        width: 120px;
        height: 112px;
        border-radius: 10px;
        margin-top: 12px;
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

    .dash-cell .cell-title{
        margin-top: 22px;

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

    .green{
        // opacity: 0.2;
        background-color: rgba( #52C41A, 0.2);
        color: #52C41A;
    }
    .red{
        background-color: rgba( #FF4D4F, 0.2);
        color: #FF4D4F;
    }
    .yellow{
        background-color: rgba( #FAAD14, 0.2);
        color: #FAAD14;
    }
</style>
