<template>
    <Widget @click="onHistoryMessage" :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk">
        <div class="icon">
            <CalendarOutlined style="width:20px;height:20px;" />
        </div>
        <div class="box-flex">
            <div class="date" :title="this.history.date">{{this.history.date}}</div>
            <div class="title" :title="this.history.title">{{this.history.title}}</div>
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
            options: {
                className: "card small",
                title: "历史上的今天",
                icon: "iconamoon:history-fill",
            },
            history:{
                date:"",
                tetle:""
            },
        };
    },
    async mounted() {
        await this.onHistoryMessage()
    },
    methods:{
        // 获取今天所发生的的事情
        async onHistoryMessage(){
            let getData = await getHistoryInfo("/app/juhe/get");
            this.history = getData;
        },

    }
};
</script>
  
<style lang="scss" scoped>
    .icon{
        width: 20px;
        height: 20px;
        position: relative;
        top: -21px;
        left: 0;
    }
    
    :deep(.anticon svg){
      width: 18px !important;
      height: 18px !important;
    }

    .box-flex{
        display: flex;
        flex-direction: column;
        height: 120px;
        margin-top: -16px;
        width: 240px;
    }
    .date{
        text-align: center;
        font-size: 24px;
        font-family: '优设标题黑';
    }
    .title{
        font-size: 24px;
        font-family: '优设标题黑';
        text-align: center;
        height: 110px;
        white-space: pre-wrap;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    @font-face {
        font-family: "优设标题黑";
        src: url(../../../../../public/优设标题黑.ttf);
    }
</style>
  