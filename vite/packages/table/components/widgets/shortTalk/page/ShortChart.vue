<template>

    <Widget @click="onHistoryMessage" :customData="customData" :customIndex="customIndex" :menuList="menuList" :options="options" ref="dataSlot" :desk="desk" >
        <div class="top-icon">
            <Icon icon="fluent:arrow-trending-lines-20-filled" />
            <div class="echarts" id="mychart" :style="myChartStyle"></div>
        </div>
        <!-- 设置面板 -->
        <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
            <template #extra>
                <a-button class="top-btn" type="primary" @click="setVisible = !setVisible">提交</a-button>
            </template>
            <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
                <div v-show="!setVisible">
                    <div class="text-content">
                        <div>关联短说社区系统</div>
                        <div>在使用该功能前，需要关联您的短说社区系统，请在短说管理后台获取系统密钥，填入下方输入框，以及您的管理后台地址，成功完成配置后即可使用。</div>
                        <div>在想天浏览器中打开短说管理后台，可以自动检测获取密钥。</div>
                    </div>
                    <p class="ml-1 mt-1">密钥</p>
                    <a-input style="border-radius: 10px;" v-model:value="this.secKey" placeholder="请输入" class="search pl-1 input-txt"></a-input>
                    <p class="ml-1 mt-2">管理后台地址</p>
                    <a-input style="border-radius: 10px;" v-model:value="this.secAdd" placeholder="请输入" class="search pl-1 input-txt"></a-input>
                </div>
                <div v-show="setVisible">
                    <div class="txt-content pointer" style="height: 48px;" @click="setVisible = !setVisible">
                        <div>关联短说社区系统<span>已关联 ></span></div>
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

export default {
    components:{
        Widget,
        Icon,
        echarts,
        RadioTab,
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
            settingVisible: false,
            setVisible: true,
            // 密钥和地址
            secKey:"",
            secAdd:"",
            // 设置中的数组
            dataType: [
                { title: '社区访问数据', name: 'visit' },
                { title: '社区互动数据', name: 'inter' },
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
                { title: 'H5', name: 'H5' },
                { title: 'PC', name: 'PC' },
                { title: '小程序', name: '小程序' },
                { title: 'APP', name: 'APP' },
            ],
            defaultPlatType: { title: '全部', name: 'all' },
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
            options: {
                className: "card double",
                title: "社区访问数据/每日/全部",
                // icon: "bianji",
                // icon: "shezhi1",
                icon: "iconamoon:history-fill",
                rightIcon:"fluent:open-20-filled",
                // icon: "games-16-filled",
            },
            // 网格数据

            // xData:["08-02","08-03","08-04","08-05","08-06","08-07","08-08"],
            // yDataFir:[193,283,675,456,856,738,504],
            // yDataSec:[425,394,842,973,776,114,149],
            // yDataThi:[475,123,763,384,235,452,123],
            
            xData:["08-02","08-03","08-04","08-05","08-06"],
            yDataFir:[193,283,675,456,856],
            yDataSec:[425,394,842,973,776],
            yDataThi:[475,123,763,384,235],
            myChartStyle:{
                float:"left",
                width:"600px",
                height:"400px",
                position:"relative",
                left:"-12px",
                top:"3px"
            }
        };
    },
    async mounted() {
        this.initEcharts();
        this.init()
    },
    methods:{
        ...mapActions(cardStore, ['updateCustomData']),
        init(){
            // 初始哈
            if(!this.customData){
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
        },
        initEcharts(){
            // 多列柱状图
            const mulColumnZZTData = {
                xAxis:{
                    data: this.xData,
                },
                // 图例属性
                legend:{
                    data:["访问次数","访问人数"],
                    top:"0%",
                    itemHeight:10,
                    itemWidth:10,
                    x:"left",
                    left:10,
                    textStyle:{
                        color: "rgba(255,255,255,0.85)",
                        fontSoze:"12"
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
                series:[
                    {
                        type: "bar",
                        data:this.yDataFir,
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
                        data:this.yDataSec,
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
                    {
                        type: "bar",
                        data:this.yDataThi,
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
                
            }
            const myChart = echarts.init(document.getElementById("mychart"))

            myChart.setOption(mulColumnZZTData);
            window.addEventListener("resize",()=>{
                myChart.resize();
            })
        },
    },
    watch:{
        "defaultDataType": {
            // handler(newVal, oldVal){
            //     this.options.title = this.defaultDataType.title + "/" +this.defaultTimeType.title + (this.defaultDataType.name == "visit"?"/" + this.defaultPlatType.title : "");
            //     this.updateCustomData(this.customIndex,{
            //         "defaultDataType": this.defaultDataType,
            //     },this.desk)
            // }
        },
        "defaultTimeType":{
            // handler(newVal, oldVal){
            //     this.options.title = this.defaultDataType.title + "/" +this.defaultTimeType.title + (this.defaultDataType.name == "visit"?"/" + this.defaultPlatType.title : "");
            //     this.updateCustomData(this.customIndex,{
            //         "defaultTimeType": this.defaultTimeType,
            //     },this.desk)
            // }
        },
        "defaultPlatType":{
            // handler(newVal, oldVal){
            //     this.options.title = this.defaultDataType.title + "/" +this.defaultTimeType.title + "/" + this.defaultPlatType.title;
            //     this.updateCustomData(this.customIndex,{
            //         "defaultPlatType": this.defaultPlatType,
            //     },this.desk)
            // }
        }
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
  