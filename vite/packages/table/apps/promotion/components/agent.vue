<template>
    <vueCustomScrollbar :settings="scrollbarSettings" style="height: 100%">
      <div>
        
      </div>
      <div class="flex-box">
        <div class="box-title">{{ this.incomeList.title }}</div>
        <div class="select-box">
          <input type="text" class="ant-input ant-input-borderless search" placeholder="代理名称" v-model="userName">
          <input type="text" class="ant-input ant-input-borderless search" placeholder="代理账号" v-model="userAcc">
          <button class="text-center rounded-lg center pointer sel-btn btn-active " @click="onTest">重置</button>
          <button class="text-center rounded-lg center pointer sel-btn btn-active ">查询</button>
        </div>
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
        userName:"",
        userAcc:"",
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
      onTest(){
        console.log(this.userAcc);
        console.log(this.userName);
      }

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
    /* atd table */
    .table-box :deep(.ant-table-tbody > tr > td){
      background: transparent;
    }
    .table-box :deep(.ant-table-thead > tr > th){
      background: transparent;
      border-bottom: transparent;
    }
    .table-box :deep(.ant-table){
      background: transparent;
    }


    /* select */
    .select-box :deep(.ant-input){
      background: rgba(0,0,0,0.30);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      margin-top: 24px;
    }

    .sel-btn{
      padding: 7px 23px;
      font-size: 14px;
      color: rgba(255,255,255,0.85);
      margin-left: 12px;
      border: none;
      background: rgba(0,0,0,0.30);
    }
    
    .sel-btn:nth-of-type(2){
      background-color: var(--active-bg);
    }
    
    .select-box input{
      /* margin-left: 12px; */
      width: 160px;
      height: 40px;
    }

    .select-box input:nth-of-type(2){

      margin-left: 12px;
    }
    /* .select-box input:nth-of-type(2){
    } */
  </style>
  