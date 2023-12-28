<template>
    <div>

        <Widget :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk">
        <div class="icon-topline">
            <!-- <pushpin-outlined></pushpin-outlined> -->
            <newIcon icon="fluent:clipboard-bullet-list-16-regular" style="font-size: 20px;"/>
        </div>
        <div class="top-col">
            <div class="col-left">
                <span class="relative flex items-center justify-center flex-1 h-full nav-item pointer span-flex"  :class="['item', { action: actionIndex == 1 }]" @click="onChangeTopIndex(1)">
                    <div class="span-icon">
                        <clock-circle-outlined />
                    </div>
                    剪贴板历史</span>
                <span class="relative flex items-center justify-center flex-1 h-full nav-item pointer span-flex"  :class="['item', { action: actionIndex == 2 }]" @click="onChangeTopIndex(2)">
                    <div class="span-icon">
                        <star-outlined />
                    </div>
                    收藏</span>
                </div>
                <div class="col-right">
                    <!-- 菜单 -->
                    <div class="icon-right" @click = "settingVisible = !settingVisible">
                        <appstore-outlined />
                    </div>
                    <div class="icon-right">
                        <search-outlined />
                    </div>
            </div>
        </div>
        <div class="clip-body">
            <div  v-for="(item,index) in clipboardShowList" :key="index">
                 <!-- 文本框 -->
                <div class="col"  v-if="item.type == 'txt'">
                    <div class="icon-sign active-index">
                        <AlignLeftOutlined />
                        文本
                    </div>
                    <span class="type-text">file:///C:/Users/Administrator/Desktop/(23-09-09)%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%B0%8F%E7%BB%84%E4%BB%B6/index.html#p1</span>
                </div>

                <!-- 图片框 -->
                <div class="col" v-if="item.type == 'image'">
                    <div class="icon-sign active-index">
                        <PictureOutlined />
                        图片
                    </div>
                    <img :src="item.imageUrl" alt="">
                </div>

                <!-- 文件框 -->
                <div class="col"  v-if="item.type == 'file'">
                    <div class="icon-sign active-index">
                        <FileOutlined />
                        文件
                    </div>
                    <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;width: 100%" class="">
                        <div class="row-body">
                            <a-row  class="row-col" >
                                <a-col class="pt-2 mr-2 text-left" :span="3">
                                    <file-outlined style="font-size: 24px" />
                                </a-col>
                                <a-col>
                                    <div class="font-bold text-left font-14">
                                        {{ item.title }}
                                    </div>
                                    <div :title="file" class="truncate xt-text-2 font-12">
                                        {{ item.content }}
                                    </div>
                                </a-col>
                            </a-row>
                        </div>
                    </vue-custom-scrollbar>
                </div>

                <!-- 音频框 -->
                <div class="col" v-if="item.type == 'audio'">
                    <div class="icon-sign active-index">
                        <CustomerServiceOutlined />
                        音频
                    </div>
                    <ClipAudio :fileUrl="item.audioUrl" class="flex items-center justify-center"
                    style="width:302px;height:148px;"></ClipAudio>
                </div>

            <!-- 视频框 -->
                <div class="col" v-if="item.type == 'video'">
                    <div class="icon-sign active-index">
                        <VideoCameraOutlined />
                        视频
                    </div>
                    <ClipVideo :videoUrl="item.videoUrl"
                    style="width: 266px;height: 127px;"></ClipVideo>
                </div>
            </div>



        </div>


    </Widget>
    </div>
        <!-- 设置面板 -->
        <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">

        <span v-for="(item, index) in todoList" :key="index"
        :class="selectTodo.id === item.id ? 'active-index':''"
        class="h-12 py-3 mb-4 text-center rounded-lg span-list pointer xt-bg-2"
        @click="onChangeTodo(item.id)">
        <component :is= "item.icon" class="mr-1"/>
        {{ item.title }}</span>

      </vue-custom-scrollbar>
    </a-drawer>
</template>

<script>
import axios from "axios";
import Widget from "../../card/Widget.vue";
import { PushpinOutlined, ClockCircleOutlined, StarOutlined, AppstoreOutlined, SearchOutlined, AlignLeftOutlined, PictureOutlined,FileOutlined,VideoCameraOutlined, CustomerServiceOutlined  } from '@ant-design/icons-vue';

// video组件
import ClipVideo from "./ClipVideo.vue"
// audio组件
import ClipAudio from "./ClipAudio.vue"
// 文件组件
// import VueCustomScrollbar from "../../../../../../../src/components/vue-scrollbar.vue";
import VueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
// 导入剪贴板测试数据
import { fileList, videoList, audioList }  from "../../../js/data/clipboardData"
import {Icon as newIcon} from '@iconify/vue'
export default {
    components:{
        Widget,
        PushpinOutlined,
        ClockCircleOutlined,
        StarOutlined,
        AppstoreOutlined,
        SearchOutlined,
        AlignLeftOutlined,
        PictureOutlined,
        FileOutlined,
        VideoCameraOutlined,
        CustomerServiceOutlined,
        ClipVideo,
        ClipAudio,
        VueCustomScrollbar,
        newIcon

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
            options: {
                className: "card double",
                title: "剪贴板",
                // icon: "shezhi1",
            },
            actionIndex:1,
            // 设置数组参数
            todoList:[
                {
                    title:"全部",
                    icon:"AppstoreOutlined",
                    id:1,
                },
                {
                    title:"文本",
                    icon:"AlignLeftOutlined",
                    id:2,
                },
                {
                    title:"图片",
                    icon:"PictureOutlined",
                    id:3,
                },
                {
                    title:"文件",
                    icon:"FileOutlined",
                    id:4,
                },
                {
                    title:"视频",
                    icon:"VideoCameraOutlined",
                    id:5,
                },
                {
                    title:"音频",
                    icon:"CustomerServiceOutlined",
                    id:6,
                },
            ],
            selectTodo:{
                title:"全部",
                icon:"clock-circle-outlined",
                id:1,
            },
            // 测试数据 全部数据
            clipboardList:[

            ],
            // 渲染到页面的数据
            clipboardShowList:[
                {
                    audioUrl:'https://cdn.pixabay.com/audio/2023/05/02/audio_28440129d6.mp3',
                    type:'audio', capacity:'419B',
                    icon:'erji1',title:'音频',content:''
                },
                {
                    title:'视频',icon:'video',capacity:'4.0MB',
                    videoUrl:'https://up.apps.vip/lively/energy-field-74933.mp4',
                    content:'energy-field-74933.mp4',
                    type:'video'
                },
                {
                    title:'文件',icon:'file',time:'13秒前',capacity:'1.2MB',content:'天天工作台概念图.pdf',picIcon:'pdf',
                    type:'file'
                },
                // {
                //     title:'文本',icon:'file',time:'15秒前',capacity:'1.2MB',content:'天天工作台概念图.pdf',
                //     type:'txt'
                // },
                {
                    title:'图片',icon:'image',time:'17秒前',capacity:'1.2MB',content:'天天工作台概念图.pdf',imageUrl:"//n.sinaimg.cn/games/transform/639/w400h239/20220624/ba99-9f5b6cb9c1cd9eaabec96eaf44a5bf14.jpg",
                    type:'image'
                }

            ]
        };
    },
    async mounted() {

    },
    methods:{
        // 切换组件 剪贴板历史 和 收藏
        onChangeTopIndex(index){
            this.actionIndex = index;
        },
        // 切换设置 剪贴板类型
        onChangeTodo(index){
            this.selectTodo = this.todoList[index-1];
            this.settingVisible = false
        }
    }
};
</script>

<style lang="scss" scoped>

    .icon-topline{
        position: absolute;
        top: 16px;
        left: 20px;
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

    .col-left span {

        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
        text-align: center;
        font-weight: 400;
        // line-height: 44px;
    }

    .span-flex{
        display: flex !important;
        flex-wrap: nowrap;
    }
    .span-icon>span{
        position: relative;
        top: 1px;
        left: -7px
        // float: left;
    }

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
        cursor: pointer;
        margin-left: 12px;
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
    .clip-body>div:nth-of-type(2n){
        margin-left: 12px;

    }

    .clip-body .col{
        width: 266px;
        height: 144px;
        text-align: center;
        border-radius: 12px;
        margin-top: 12px;
        display: flex;
        align-items: center;
        position: relative;
        background: rgba(0,0,0,0.30);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .clip-body .col:nth-of-type(2n){
        margin-left: 12px;
    }

    .active-index {
        background: var(--active-bg) !important;
    }

    .span-list{
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        text-align: center !important;
        display: block;
    }

    // .span-list:hover{
    //     background: var(--active-bg) !important;
    // }

    .col>span{
        display: block;

        font-size: 16px;
        color: rgba(255,255,255,0.85);
        text-align: center;
        font-weight: 400;
        overflow: hidden;
        width: 226px;
        max-height: 88px;
        word-wrap: break-word;
        white-space: pre-wrap;
        display: flex;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        line-height: 22px;
    }

    .col .icon-sign{
        width: 60px;
        height: 28px;
        line-height: 28px;
        border-radius: 6px;
        position: absolute;
        left: 200px;
        top: 7px;
        z-index: 999;
    }
    .col img{
        width:230px;
        max-height:120px;
        // min-height: 50px;

    }


    .row-body{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        height: 100%;
    }

    .row-col{
        width: 230px;
        // border: 1px solid #fff;
        padding: 3px 10px;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 8px;

    }
</style>
