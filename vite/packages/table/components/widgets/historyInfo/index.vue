<template>
    <Widget :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk">
        <Icon icon="iconamoon:history-fill" class="icon1"/>

            <div class="date">{{this.history.date}}</div>
            <div class="title">{{this.history.title}}</div>
            <!-- <div class="date">"159年9月9日"</div>
            <div class="title">"东汉梁冀灭门"</div> -->



    </Widget>
</template>
  
<script>
import axios from "axios";
import Widget from "../../card/Widget.vue";
import { Icon } from '@iconify/vue';
export default {
    components:{
        Widget,
        Icon,
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
                // icon: "bianji",
                // icon: "shezhi1",
                icon: "iconamoon:history-fill",
                // icon: "games-16-filled",
            },
            history:{},
        };
    },
    async mounted() {
        // await this.onTest()
        await this.onHistoryMessage()
    },
    methods:{
        // 获取今天所发生的的事情
        onHistoryMessage(){
            // console.log(123)
            let now = new Date;
            let date = now.getMonth() +1  + '/' + now.getDate()
            axios.get("http://v.juhe.cn/todayOnhistory/queryEvent.php?date=" + date + "&key=290696b4fa0687b6f093d0794fdd71d5").then(res=>{
                this.history = res.data.result[0]
            })
        }
    }
};
</script>
  
<style lang="scss" scoped>
    .icon1{
        width: 24px;
    }
    svg{
        width: 24px;
        height: 24px;
        position: relative;
        top: -23px;
    }
    .date{
        text-align: center;
        font-size: 24px;
        font-family: '优设标题黑';
    }
    .title{
        font-size: 24px;
        margin-top: 12px;
        font-family: '优设标题黑';
        text-align: center;
        // max-width: 212px;
    }
    
    @font-face {
        font-family: "优设标题黑";
        src: url(../../../../../public/优设标题黑.ttf);
    }
</style>
  