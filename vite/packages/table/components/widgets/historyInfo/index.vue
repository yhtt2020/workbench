<template>
    <Widget @click="onHistoryMessage" :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk">
        <div class="icon">
            <CalendarOutlined style="width:20px;height:20px;" />
        </div>
        <div class="box-flex">
            <div>
                {{this.history.date}}
                <br/>
                {{ this.history.title }}
            </div>
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
        width: 240px;
        position: relative;
        top: -10px;
    }
    .box-flex div{
        text-align: center;
        padding: 0 5px;
        text-align: center;
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-family: '优设标题黑';
        margin-top: -5px;
        white-space: pre-wrap;
    }


    @font-face {
        font-family: "优设标题黑";
        src: url(font/优设标题黑.ttf);
    }
</style>
