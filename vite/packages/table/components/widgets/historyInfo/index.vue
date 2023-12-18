<template>
    <Widget :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk"
    :env="env">
        <template #left-title-icon>
            <div class="icon"
                style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 3px;top: 13px;">
                <Icon icon="fluent:clock-12-regular" width="20" height="20" />
            </div>
        </template>
        <template #left-title>
            <Icon @click="onHistoryMessage" class="xt-text refresh pointer" style=" font-size: 18px;vertical-align: sub;" icon="akar-icons:arrow-clockwise" />
            <!-- <div @click="onHistoryMessage">2
            </div> -->
        </template>
        <div class="box-flex">
            <div>{{this.history.date}}</div>
            <div>{{ this.history.title }}</div>
        </div>
    </Widget>
</template>

<script>
import { CalendarOutlined, } from '@ant-design/icons-vue';
import Widget from "../../card/Widget.vue";
import { Icon } from '@iconify/vue';
import {getHistoryInfo} from "../../../store/historyInfo"

export default {
    components:{
        Widget,
        Icon,
        CalendarOutlined,
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
            loading: false,
            options: {
                className: "card small",
                title: "历史上的今天",
                // icon: "iconamoon:history-fill",
                newIcon:'ant-design:calendar-outlined'
            },
            history:{
                date:"",
                tetle:""
            },
            timer:"12",
            env:{
                web: false,
                mobile: false,
                client: false,
                offline:true
            }
        };
    },
    mounted() {
        this.onHistoryMessage()
        // 设置一次性定时器 当天12点过后自动触发事件
        let now = new Date;
        var midnight = new Date();
        midnight.setHours(23, 59, 59, 999); // 设置时间为今天的最后一秒
        var remainingTime = midnight.getTime() - now.getTime(); // 计算剩余时间戳
        this.timer = setTimeout(() => {
            this.onHistoryMessage();
        }, remainingTime);
    },
    // 组件卸载后 清除定时器
    unmounted(){
        clearTimeout(this.timer)
    },
    methods:{
        // 获取今天所发生的的事情
        async onHistoryMessage(){
            if(!this.loading){
                this.loading = true
                await getHistoryInfo("/app/juhe/get").then(res=>{
                    let random = Math.floor(Math.random() * (res.length + 1))
                    this.history = res[random];
                    this.loading = false
                })
            }
        },
    },
};
</script>

<style lang="scss" scoped>
    .icon{
        width: 20px;
        height: 20px;
        position: relative;
        top: -22px;
        left: 0;
    }
    :deep(.anticon svg){
      width: 18px !important;
      height: 18px !important;
    }
    .box-flex{
        display: flex;
        flex-direction: column;
        width: 240px;
        height: 150px;
        position: relative;
        top: 2px;
        font-size: 24px;
        font-family: '优设标题黑';
        text-align: center;
        justify-content: space-evenly;
    }
    .box-flex div{
        padding: 0 5px;
        margin-top: -5px;
        white-space: pre-wrap;
    }
    @font-face {
        font-family: "优设标题黑";
        src: url("../../../../../public/font/优设标题黑.ttf");
    }

    .refresh{
        position: relative;
        top: 3px;
        
    }
</style>
