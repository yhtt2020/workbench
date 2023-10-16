<template>

    <Widget @click="onHistoryMessage" :customData="customData" :customIndex="customIndex" :menuList="menuList" :options="options" ref="dataSlot" :desk="desk" >
        <div class="top-icon">
            <Icon icon="fluent:arrow-trending-lines-20-filled" />
        </div>
        <Unusual v-if='!this.access_token || !this.baseUrl' title="请完成小组件配置" buttonTitle="立即配置" :back="back" ></Unusual>
        <div v-else class="echarts" id="mychart" :style="myChartStyle"></div>
        <!-- 设置面板 -->
        <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
            <template #extra>
                <div v-show="this.setVisible"  class="xt-active-btn" style="width:64px;height:40px;" @click="changeAccToken(accToken,accUrl)">提交</div>
                <div v-show="!this.setVisible" class="xt-active-btn" style="width:64px;height:40px;" @click="changeCharts(true)">保存</div>
            </template>
            <vue-custom-scrollbar :settings="settings" style="height: 100%;">
                <div v-show="this.setVisible">
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
                <div v-show="!this.setVisible">
                    <div class="txt-content pointer" style="height: 48px;" @click="this.setVisible = !this.setVisible">
                        <div>关联短说社区系统<span>{{ this.access_token && this.baseUrl ? '已关联 >' : '未关联 >'  }}</span></div>
                    </div>
                    <div class="txt-content" style="height: 104px;">
                        <div>设置小组件数据</div>
                        <div>你可以选择一下两种图表：[社区访问数据]、[社区互动数据]；同事支持在此处选择图表的时间范围和平台</div>
                    </div>
                    <p class="ml-1">图表类型</p>
                    <RadioTab :navList="dataType" v-model:selectType="defaultDataType"></RadioTab>
                    <p class="ml-1 mt-3">时间周期</p>
                    <RadioTab :navList="timeType" v-model:selectType="defaultTimeType" ></RadioTab>
                    <div  v-show="this.defaultDataType.name == 'visit'">
                    <!-- <div > -->
                        <p class="ml-1 mt-3">平台类型</p>
                        <RadioTab  :navList="platType"  class="nav-type" 
                        v-model:selectType="defaultPlatType"  ></RadioTab>
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
import RadioTab from "../components/RadioTab.vue"
import * as echarts from "echarts";
import {cardStore} from "../../../../store/card";
import {mapActions, mapState,mapWritableState} from "pinia";
import { shortTalkStore } from '../store'
import { useToast } from "vue-toastification";
import Unusual from '../../Unusual.vue'
const toast = useToast()

export default {
    components:{
        Widget,
        Icon,
        echarts,
        RadioTab,
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
        ...mapWritableState(shortTalkStore, ['access','interact','access_token','baseUrl','setVisible']),
    },
    data() {
        return {
            settings: {
                swipeEasing: true,
                suppressScrollY: false,
                suppressScrollX: true,
                wheelPropagation: false,
            },
            settingVisible: false,
            // 设置中的数组
            dataType: [
                { title: '社区访问数据', name: 'visit' },
                { title: '社区互动数据', name: 'interact' },
            ],
            defaultDataType: { title: '社区访问数据', name: 'visit' },
            timeType: [
                { title: '每日', name: 'day' },
                { title: '每周', name: 'week' },
                { title: '每月', name: 'month' },
            ],
            defaultTimeType: { title: '每日', name: 'day' },
            platType: [
                { title: '全部', name: 'all' },
                { title: 'H5', name: 'h5' },
                { title: 'PC', name: 'pc' },
                { title: '小程序', name: 'xcx' },
                { title: 'APP', name: 'app' },
            ],
            defaultPlatType: { title: '全部', name: 'all' },
            // 设置
            menuList: [
                {
                    icon: 'shezhi1',
                    title: '设置',
                    fn: () => { 
                        this.settingVisible = true; 
                        this.$refs.dataSlot.visible = false 
                        this.setVisible = false
                    }
                },
            ],
            options: {
                className: "card double",
                title: "社区访问数据/每日/全部",
                icon: "iconamoon:history-fill",
                rightIcon:"fluent:open-20-filled",
            },
            // 网格数据
            myChartStyle:{
                float:"left",
                width:"600px",
                height:"400px",
                position:"relative",
                left:"-12px",
                top:"3px"
            },
            // 密钥和地址
            accToken:'',
            accUrl:'',
            
        };
    },
    async mounted() {
        this.accToken = this.access_token
        this.accUrl = this.baseUrl
        this.init()
    },
    methods:{
        ...mapActions(cardStore, ['updateCustomData']),
        ...mapActions(shortTalkStore, ['getChartData','changeAccToken']),
        init(){
            // 初始
            if(!this.customData.defaultDataType){
                this.updateCustomData(this.customIndex,{
                    "defaultDataType": this.defaultDataType,
                    "defaultTimeType": this.defaultTimeType,
                    "defaultPlatType": this.defaultPlatType,
                },this.desk)
            }else{
               this.defaultDataType = this.customData.defaultDataType 
               this.defaultTimeType = this.customData.defaultTimeType 
               this.defaultPlatType = this.customData.defaultPlatType 
            }

            // this.accToken = this.access_token
            // this.accUrl = this.baseUrl

            this.getChartData(this.customData)
            .then(()=>{
                // 添加判断 如果没有获取到数据就停止
                this.changeBarChart()
            })
            
        },
        // 初始化柱状图
        initEcharts(){
            // 多列柱状图
            const mulColumnZZTData = {
                xAxis:{
                    data: this.xData,
                },
                // 图例属性
                legend:{
                    data:this.legend,
                    top:"0%",
                    itemHeight:10,
                    itemWidth:10,
                    x:"left",
                    left:10,
                    textStyle:{
                        color: "rgba(255,255,255,0.85)",
                        fontSize:"12"
                    }
                },
                // y轴线条
                yAxis:{
                    splitLine:{
                        show: true,
                        lineStyle: {
                            type: 'solid',
                            color:'#FCFCFC',//网格颜色
                            opacity:"0.3"
                        }
                    }
                },
                // 内部属性
                series:this.series,
            }
            const myChart = echarts.init(document.getElementById("mychart"))
            // myChart.setOption(mulColumnZZTData);
            myChart.clear()
            myChart.setOption(mulColumnZZTData);
            window.addEventListener("resize",()=>{
                myChart.resize();
            })
        },
        // 修改柱状图数据
        changeBarChart(){
            // 社区访问数据
            if(this.defaultDataType.name == 'visit'){
                // 内部属性
                this.series=[                
                    {
                        type: "bar",
                        data:this.access.visit.series,
                        name:"访问次数",
                        label:{
                            show:true,
                            position:"top",
                            // 修改柱状条上方数据
                            textStyle:{
                                color: "rgba(255,255,255,0.85)",
                                fontSize:10,
                            },
                        },
                        itemStyle:{
                            color: "rgba(91,143,249,0.85)"
                        }
                    },
                    {
                        type: "bar",
                        data:this.access.login.series,
                        name:"访问人数",
                        label:{
                            show:true,
                            position:"top",
                            textStyle:{
                                color: "rgba(255,255,255,0.85)",
                                fontSize:10,
                            },
                        },
                        itemStyle:{
                            color: "rgba(90,216,166,0.85)",
                        },
                    },
                ],
                // 图例
                this.legend=["访问次数","访问人数"]
                
                // x轴
                this.xData = this.interact.post.xAxis
                // y轴
            }else{
                this.series=[                
                    {
                        type: "bar",
                        data:this.interact.post.series,
                        name:"发布",
                        label:{
                            show:true,
                            position:"top",
                            // 修改柱状条上方数据
                            textStyle:{
                                color: "rgba(255,255,255,0.85)",
                                fontSize:10,
                            },
                        },
                        itemStyle:{
                            color: "rgba(91,143,249,0.85)"
                        }
                    },
                    {
                        type: "bar",
                        data:this.interact.support.series,
                        name:"点赞",
                        label:{
                            show:true,
                            position:"top",
                            textStyle:{
                                color: "rgba(255,255,255,0.85)",
                                fontSize:10,
                            },
                        },
                        itemStyle:{
                            color: "rgba(90,216,166,0.85)",
                        },
                    },
                    {
                        type: "bar",
                        data:this.interact.thread.series,
                        name:"评论",
                        label:{
                            show:true,
                            position:"top",
                            textStyle:{
                                color: "rgba(255,255,255,0.85)",
                                fontSize:10,
                            },
                        },
                        itemStyle:{
                            color: "rgba(93,112,146,0.85)",
                        },
                    },
                ],
                // 图例
                this.legend=["发布","点赞","评论"]
                // x轴
                this.xData = this.interact.post.xAxis
            }
            this.initEcharts()
        },
        // 设置保存后修改
        changeCharts(boolean){
            this.options.title = this.defaultDataType.title + "/" +this.defaultTimeType.title + (this.defaultDataType.name == "visit"?"/" + this.defaultPlatType.title : "");
            this.updateCustomData(this.customIndex,{
                "defaultDataType": this.defaultDataType,
                "defaultTimeType": this.defaultTimeType,
                "defaultPlatType": this.defaultPlatType,
            },this.desk)
            if(boolean){
                toast.success("保存成功");
            }
            this.settingVisible=false
            setTimeout(()=>{
                this.init()
            },500)
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
                this.getChartData(this.customData)
                .then(()=>{
                    this.changeCharts()
                })
            }
        },
        'baseUrl':{
            handler(newVal, oldVal){
                this.accUrl = this.baseUrl
                this.getChartData(this.customData)
                .then(()=>{
                    this.changeCharts()
                })
            }
        },
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

    .echarts{
        font-family: Helvetica;
        font-size: 12px;
        color: rgba(255,255,255,0.85);
        text-align: left;
        font-weight: 400;
    }

    .txt-content{
        width: 100%;
        background: #2A2A2A;
        border-radius: 12px;
        padding: 13px 16px;
        color: rgba(255,255,255,0.85);
        font-size: 16px;
        margin-bottom: 16px;
    }
    .txt-content span{
        float: right;
        font-size: 14px;
        color: rgba(255,255,255,0.60);
    }

    .txt-content div:nth-of-type(1){
        color: rgba(255,255,255,0.85);
        margin-bottom: 10px;

    }
    .txt-content div{
        font-size: 14px;
        color: rgba(255,255,255,0.60);
    }

    .nav-type :deep(.nav-box){
        padding: 0 16px;
    }

    
    .text-content{
        width: 100%;
        min-height: 124px;
        background: #2A2A2A;
        border-radius: 12px;
        padding: 10px 16px;
        font-family: PingFangSC-Regular;
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
</style>
  