<template>
    <Widget :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk">

        <!-- icon图标<icon icon="shuaxin"></icon> -->
        <MyIcon icon="fluent:games-16-filled" class="myIcon" />
        <div class="box1">
            <div ref="refreshButton" @click="refreshNow" class="pointer" style="position: absolute;left: 120px;top: 15px;"><icon icon="shuaxin"></icon></div>
            <div class="card1"   v-for="(value,index) in this.gameData" :key="index" @click="jump(value.url)" >
                <div class="left_card">
                    <div class="title1">{{value.title}}</div>
                    <div class="message1">{{value.description}}</div>
                    <div class="buttom1" style="margin-top: 9px;">
                        <div class="time1">{{value.ctime}}</div>
                        <div class="name1">{{value.source}}</div>
                    </div>
                </div>
                <div class="right_card">
                    <img class="img1" :src="value.picUrl" alt="">
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
import {sUrl} from "../../../consts"
import {get} from "../../../js/axios/request"
export default {
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
                icon: "",
                // icon: "games-16-filled",
            },
            gameData:[],
        };
    },
    async mounted() {
        await this.onTest()
    },
    methods:{
        onTest(){
            let params = {
                params:{
                    "num":10,
                    "page":1,
                    "rand":1
                }
            }
            let options = {
                "cache":1,
                "ttl":60,
                "key":"fapigx.esports.query"
            }
            get(sUrl("/app/juhe/get?apiName=fapigx.esports.query&options=%7B%22cache%22:1,%22ttl%22:60,%22key%22:%22fapigx.esports.query%22%7D"),params).then(res=>{
                var dataList =[];
                for(let i=0;i<res.data.newslist.length&&i<3;i++){
                    dataList[i] = res.data.newslist[i]
                }
                this.gameData = dataList
            })
        },
        jump(url){
            browser.openInUserSelect(url)
        },
        refreshNow(){
            this.$refs.refreshButton.classList.add('animate-spin')
            setTimeout(()=>{
                this.$refs.refreshButton.classList.remove('animate-spin')
                message.success({content:'刷新资讯成功',key:'refreshZixun'})
            },500)
            this.onTest()
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
    .card1{
        position: relative;
        width: 544px;
        height: 110px;
        margin-top: 12px;
        margin-right: 14px;
        // border: 1px solid #fff;
        padding: 8px;
    }
    .left_card{
        width: 368px;
    }
    .title1{
        width:368px;
        height: 20px;
        font-size: 14px;
        color: #fff;
        opacity: 0.85;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 8px;

    }
    .message1{
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
    }

    .time1{
        width: 107px;
        height: 17px;
        font-size: 12px;
        opacity: 0.4;
        float: left;
    }
    
    .name1{
        font-size: 12px;
        max-width: 100px;
        height: 17px;
        opacity: 0.4;
        
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        float: right;
    }

    .img1{
        width: 148px;
        height: 94px;
        position: absolute;
        top: 10px;
        left: 384px;
        // border: 1px solid #fff;
    }
</style>
  