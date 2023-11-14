<template>
    <Widget :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk" :env="env">
        <template #left-title-icon>
            <div class="icon"
                style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 4px;top: 14px;">
                <MyIcon icon="fluent:games-16-filled" width="24" height="24" />
                <!-- <newIcon icon="fluent:box-16-regular" class="" style="font-size: 20px;"></newIcon> -->
            </div>
        </template>
        <!-- icon图标<icon icon="shuaxin"></icon> -->
        <!-- <MyIcon icon="fluent:games-16-filled" class="myIcon" /> -->
        <div class="box-border">
            <div ref="refreshButton" @click="refreshNow" class="pointer" style="position: absolute;left: 120px;top: 15px;"><icon icon="shuaxin"></icon></div>
            <div class="card-body"   v-for="(value,index) in gameData.slice(0, 3)" :key="index" @click="jump(value.url)" >
                <div class="left-card">
                    <div class="title-article">{{value.title}}</div>
                    <div class="message-article">{{value.description}}</div>
                    <div class="bottom-article" style="margin-top: 9px;">
                        <div class="time-article">{{value.ctime}}</div>
                        <div class="source-article">{{value.source}}</div>
                    </div>
                </div>
                <div class="right_card">
                    <img class="img-article" :src="value.picUrl" alt="">
                </div>
            </div>
        </div>



    </Widget>
</template>
  
<script>
import axios from "axios";
import Widget from "../../card/Widget.vue";
import {Icon as MyIcon} from '@iconify/vue';
import { message } from 'ant-design-vue'
import {getGameInfo} from "../../../store/gameInfomation"
import browser from '../../../js/common/browser'
export default {
    name:'gameInformation',
    components:{
        Widget,
        MyIcon
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
                title: "电竞资讯",
                // icon: "bianji",
                newIcon: "fluent:games-16-filled",
                type: 'gameInformation'
                // icon: "games-16-filled",
            },
            gameData:[],
            env:{
                web: false,
                mobile: false,
                client: false,
                offline:true
            }
        };
    },
    async mounted() {
        await this.onGetInfo()
    },
    methods:{
        async onGetInfo(){
            let dataList = await getGameInfo("/app/juhe/get");
            this.gameData = dataList;
        },
        jump(url){
            // console.log("https:"+url);
            browser.openInUserSelect("https:" + url)
        },
        refreshNow(){
            this.$refs.refreshButton.classList.add('animate-spin')
            setTimeout(()=>{
                this.$refs.refreshButton.classList.remove('animate-spin')
                message.success({content:'刷新资讯成功',key:'refreshZixun'})
            },500)
            this.onGetInfo()
        }
    }
};
</script>
  
<style lang="scss" scoped>
    .card>svg{
        width: 24px;
        height: 24px;
        position: absolute;
        top: 17px;
    }
    .box{
        overflow: hidden;

    }
    .card-body{
        position: relative;
        width: 544px;
        height: 110px;
        margin-top: 12px;
        margin-right: 14px;
        // border: 1px solid #fff;
        padding: 8px;
    }
    .left-card{
        width: 368px;
    }
    .title-article{
        width:368px;
        height: 20px;
        font-size: 14px;
        color: #fff;
        opacity: 0.85;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 8px;
        cursor: pointer;
    }
    .message-article{
        width:368px;
        height: 40px;
        font-size: 14px;
        color: #fff;
        margin-top: 8p;
        opacity: 0.6;
        white-space: pre-wrap; /* 允许换行 */
        word-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        cursor: pointer;
    }

    .time-article{
        width: 107px;
        height: 17px;
        font-size: 12px;
        opacity: 0.4;
        float: left;
        cursor: pointer;
    }
    
    .source-article{
        font-size: 12px;
        max-width: 100px;
        height: 17px;
        opacity: 0.4;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        float: right;
        cursor: pointer;
    }

    .img-article{
        width: 148px;
        height: 94px;
        position: absolute;
        top: 10px;
        left: 384px;
        cursor: pointer;
        // border: 1px solid #fff;
    }
</style>
  