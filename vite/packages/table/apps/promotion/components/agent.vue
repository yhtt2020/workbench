<template>
    <vueCustomScrollbar :settings="scrollbarSettings" style="height: 100%">
      <div>
        
      </div>
      <div class="flex-box">
        <div class="box-title">{{ this.incomeList.title }}</div>
        <a-table :dataSource="incomeList.data" :columns="incomeCol" class="table-box"/>
      </div>
  
    </vueCustomScrollbar>
  

  </template>
  
  <script>

  


  export default {
    name: 'Promotion',
    components: { 

    },
    computed: {

    },
    data(){
      return {
        incomeList:{
          title:"下级代理收益",
          data:[
            {
              belowAgent:"nihoa",
              belowAgentUser:"123456",
              agentLevel:"1级",
              totalIncome:"0.0",
              monthIncome:"0.0",
              dayIncome:"0.0",
            },
            {
              belowAgent:"nihoa",
              belowAgentUser:"1234567",
              agentLevel:"1级",
              totalIncome:"0.0",
              monthIncome:"0.0",
              dayIncome:"0.0",
            },
            {
              belowAgent:"nihoa",
              belowAgentUser:"1234568",
              agentLevel:"1级",
              totalIncome:"0.0",
              monthIncome:"0.0",
              dayIncome:"0.0",
            },
            {
              belowAgent:"nihoa",
              belowAgentUser:"1234596",
              agentLevel:"1级",
              totalIncome:"0.0",
              monthIncome:"0.0",
              dayIncome:"0.0",
            },
          ]
        },
        incomeCol:[
          {
            title:"下级代理",
            dataIndex:"belowAgent",
            key:"belowAgent"
          },
          {
            title:"下级代理账号",
            dataIndex:"belowAgentUser",
            key:"belowAgentUser"
          },
          {
            title:"代理层级",
            dataIndex:"agentLevel",
            key:"agentLevel"
          },
          {
            title:"总收益",
            dataIndex:"totalIncome",
            key:"totalIncome"
          },
          {
            title:"本月收益",
            dataIndex:"monthIncome",
            key:"monthIncome"
          },
          {
            title:"当日收益",
            dataIndex:"dayIncome",
            key:"dayIncome"
          },
        ]

      }
    },
    mounted(){

    },
    watch:{

    },
    methods:{

    },
  }
  </script>
  
  <style scoped>

    .flex-box{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0 20px;
    }


    .box-title{
      height: 22px;
      line-height: 22px;
      width: 100%;
      font-size: 16px;
      padding-left: 16px;
      margin-top: 24px;
      border-left: 4px solid;
      border-color: var(--active-bg);
    }
    .table-box{
      width: 100%;
      background-color: none;
      margin-top: 24px;
    }

  </style>
  