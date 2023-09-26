<template>
    <Widget :options="options" :customIndex="customIndex" :desk="desk" >
        <div class="title">本周番茄时间</div>
        <div class="time">4h15m</div>
        <div class="echarts">
            <div class="echarts-col" v-for="(item,index) in yTimer" :key="index" 
            :style="{'height': item/maxTimer*110 + 10 + 'px'}"
            :class="index == today ? 'active-col':''"
            :alt="item"
            ></div>
        </div>
    </Widget>
</template>
  
<script>
    import Widget from "../../../components/card/Widget.vue";
    // import * as echarts from "echarts";
    export default {
        name: "TimerChart",
        components:{
            Widget,
            // echarts,
        },
        props: {
            customIndex: {
                type: Number,
                default: 0
            },
            customData: {
                type: Object,
                default: () => {}
            },
            desk: {
                type: Object,
            }
        },
        data(){
            return {
                options:{
                    className:'card small',
                    title:'TimerChart',
                    icon:'',
                    type:'timer',
                    noTitle:true,
                    background:"#24B284",
                },
                xTimer:["1","2","3","4","5","6","7"],
                yTimer:[1,2,5,3,2,4,0],
                maxTimer:5,
                today:5,
            }
        },
        async mounted() {
        },
        methods: {

        },
    };
</script>
  
  <style scoped lang="scss">

    .title{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(255,255,255,0.60);
        font-weight: 400;
        text-align: center;
    }
    .time{
        font-family: Oswald-SemiBold;
        font-size: 20px;
        color: rgba(255,255,255,0.85);
        text-align: center;
        font-weight: 600;
    }

    .echarts{
        // border: 1px solid #fff;
        margin-top: 6px;
        height: 120px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .echarts .echarts-col{
        background: rgba(255,255,255,0.40);
        border-radius: 10px;
        width: 29px;
        height: 120px;
        cursor: pointer;
        // min-height: 20px;
    }
    .echarts .echarts-col:hover{
        background: rgba(255,255,255,0.85);
    }
    .active-col{
        background: rgba(255,255,255,0.85) !important;
    }
    </style>
  