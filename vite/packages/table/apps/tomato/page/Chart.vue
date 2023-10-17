<template>
    <Widget :options="options" :customIndex="customIndex" :desk="desk" >
        <div class="title">本周番茄时间</div>
        <div class="time">{{ this.weekTime }}</div>
       
        <div class="echarts">
            <a-tooltip v-for="(item,index) in this.tomatoList" :key="index" placement="top">
                <div class="echarts-col" 
                :style="{'height': (item? item/this.maxTomato*100 : 0) + 10 + 'px'}"
                :class="index == activeIndex ? 'active-col':''"
                @click="onChangeActive(index)" 
                >
                <span v-if="index == activeIndex">{{ item }}</span>
                </div>
                <template #title >{{'星期'+ week[index] + ' : ' + countToday(item)}}</template>
            </a-tooltip>
        </div>
    </Widget>                                     
</template>
  
<script>
    import Widget from "../../../components/card/Widget.vue";  
    import {mapActions, mapState,mapWritableState} from "pinia";
    import { tomatoStore } from '../store'
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
        computed: {
            ...mapWritableState(tomatoStore, ['tomatoList','weekTime','maxTomato']),
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
                activeIndex:0,
                week:['日','一','二','三','四','五','六']
            }
        },
        mounted() {
            this.getTomatoNum();
            this.activeIndex = new Date().getDay()
        },
        methods: {
            ...mapActions(tomatoStore, ['getTomatoNum']),
            onChangeActive(n){
                this.activeIndex = n
            },
            // 计算今日番茄时间
            countToday(num){
                let totalTime = num*25;
                let hour = totalTime / 60
                let min = totalTime % 60
                return Math.trunc(hour) + 'h' + min + 'm'
            },
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
        letter-spacing: 1px;
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
        text-align: center;
    }
    .echarts .echarts-col span{
        position: relative;
        top: -22px;
    }
    .echarts .echarts-col:hover{
        background: rgba(255,255,255,0.85);
    }
    .active-col{
        background: rgba(255,255,255,0.85) !important;
    }
    </style>
  