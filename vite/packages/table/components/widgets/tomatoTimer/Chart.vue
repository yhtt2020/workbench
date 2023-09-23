<template>
    <Widget :options="options" :customIndex="customIndex" :desk="desk">
        <div class="title" @click="onClick">本周番茄时间3</div>
        <div class="time">4h15msda</div>
        <!-- <div class="echarts" id="mychart" :style="myChartStyle"></div> -->

    </Widget>
  </template>
  
<script>
    import Widget from "../../card/Widget.vue";
    // import * as echarts from "echarts";
    export default {
        name: "Chart",
        components:{
            Widget,
            echarts,
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
                    title:'',
                    icon:'',
                    type:'timer',
                    noTitle:true,
                },
                // xData:["1","2","3","4","5","6","7"],
                // yClock:[1,2,5,3,2,4,4],
                // myChartStyle:{
                //     // float:"left",
                //     width:"252px",
                //     height:"90px",
                // },
            }
        },
        async mounted() {
            //  this.initEcharts();
        },
        methods: {
            // initEcharts(){
            //     console.log("开始渲染了");
            //     // 多列柱状图
            //     const mulColumnData = {
            //         xAxis:{
            //             data: this.xData,
            //         },
            //         // 图例属性
            //         legend:{
            //             data:["日期","时间"],
            //         },
            //         // y轴线条
            //         yAxis:{
            //             splitLine:{
            //                 show: true,
            //                 lineStyle: {
            //                     type: 'solid',
            //                     color:'#FCFCFC',//网格颜色
            //                     opacity:"0.3"
            //                 }
            //             }
            //         },
            //         // 内部属性
            //         series:[
            //             {
            //                 type: "bar",
            //                 data:this.yClock,
            //                 name:"时间",
            //                 label:{
            //                     show:true,
            //                     position:"top",
            //                 }
            //             },
            //         ],
                    
            //     }
            //     const myChart = echarts.init(document.getElementById("mychart"))

            //     myChart.setOption(mulColumnData);
            //     window.addEventListener("resize",()=>{
            //         myChart.resize();
            //     })
            // },
            onClick(){
                console.log("nihao")
            }
        },
    };
</script>
  
  <style scoped lang="scss">
    // .echarts{
    //     font-family: Helvetica;
    //     font-size: 12px;
    //     color: rgba(255,255,255,0.85);
    //     text-align: left;
    //     font-weight: 400;
    //     width: 252px;
    //     height: 90px;
    //     border: 1px solid #fff;
    // }
  </style>
  