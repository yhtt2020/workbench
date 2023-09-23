<template>
    <vueCustomScrollbar :settings="scrollbarSettings" style="height: 100%">
      <div class="flex-box">
          <div class="box-title">{{ this.incomeList.title }}</div>
          <div class="box-list" v-for="(item,index) in incomeList.data" :key="index">
              <div class="list-title">{{ item.title }}</div>
              <div class="list-content">{{ item.content }}</div>
              <div class="list-num">{{ item.num }}元
                <!-- <button class="xt-btn list-btn" style="width:80px;height:40px;">提现</button> -->
              </div>
          </div>
      </div>
      <div class="flex-box">
          <div class="box-title">{{ this.detailList.title }}</div>
          <div class="sel-box">
            <a-date-picker v-model:value="time" />
            <a-select v-model="state" placeholder="状态">
              <a-select-option value="完成">完成</a-select-option>
              <a-select-option value="取消">取消</a-select-option>
            </a-select>
          </div>
          <a-table 
          :dataSource="detailList.data" 
          :pagination="{ pageSize: 5 }"
          :columns="detailCol" class="table-box">
            <a-table-column key="tags" title="Tags" data-index="tags">
              <template #default="{ text: tags }">
              </template>
            </a-table-column>
          </a-table>
          <a-modal :visible="visible"
            width="600px" 
            height="500px"
            centered
            :closable="false"
            :footer="null">

                
          </a-modal>

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
        visible:false,
        incomeList:{
          title:"我的钱包",
          data:[
            {
              title:"可体现余额",
              content:"可提现余额为上个月收益（以及之前没提取的收益综合）。",
              num:"1293",
            },
            {
              title:"当月收益 ",
              content:"当月收益为本月1日到今天的收益，不可提现，直到下个月转为上月收益才可提现。",
              num:"71 ",
            },
          ]
        },
        detailList:{
          title:"提现明细",
          // 搜索条件
          time:"",
          state:"",
          data:[
            {
              time:"2018-08-03 20:13",
              amount:"100.0",
              commission:"0.5",
              Alipay:"12354156",
              state:"完成",
              remark:"-"
            },
            {
              time:"2018-08-03 18:13",
              amount:"100.0",
              commission:"0.5",
              Alipay:"12354156",
              state:"取消",
              remark:"账号错误"
            },
            {
              time:"2018-08-03 18:13",
              amount:"100.0",
              commission:"0.5",
              Alipay:"12354156",
              state:"取消",
              remark:"账号错误"
            },
            {
              time:"2018-08-03 18:13",
              amount:"100.0",
              commission:"0.5",
              Alipay:"12354156",
              state:"取消",
              remark:"账号错误"
            },
            {
              time:"2018-08-03 18:13",
              amount:"100.0",
              commission:"0.5",
              Alipay:"12354156",
              state:"取消",
              remark:"账号错误"
            },
            {
              time:"2018-08-03 18:13",
              amount:"100.0",
              commission:"0.5",
              Alipay:"12354156",
              state:"取消",
              remark:"账号错误"
            },
            {
              time:"2018-08-03 18:13",
              amount:"100.0",
              commission:"0.5",
              Alipay:"12354156",
              state:"取消",
              remark:"账号错误"
            },
            {
              time:"2018-08-03 18:13",
              amount:"100.0",
              commission:"0.5",
              Alipay:"12354156",
              state:"取消",
              remark:"账号错误"
            },
            {
              time:"2018-08-03 18:13",
              amount:"100.0",
              commission:"0.5",
              Alipay:"12354156",
              state:"取消",
              remark:"账号错误"
            },
            {
              time:"2018-08-03 18:13",
              amount:"100.0",
              commission:"0.5",
              Alipay:"12354156",
              state:"取消",
              remark:"账号错误"
            },
          ]


        },
        detailCol:[
        {
            title:"提现时间",
            dataIndex:"time",
            key:"time"
          },
          {
            title:"提现金额（元）",
            dataIndex:"amount",
            key:"amount"
          },
          {
            title:"手续费（元）",
            dataIndex:"commission",
            key:"commission"
          },
          {
            title:"支付宝账号",
            dataIndex:"Alipay",
            key:"Alipay"
          },
          {
            title:"状态",
            dataIndex:"state",
            key:"state"
          },
          {
            title:"备注",
            dataIndex:"remark",
            key:"remark"
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
      /* justify-content: space-between; */
      flex-wrap: wrap;
      padding: 0 20px;
    }
    /* .flex-box>div{
      margin-top: 24px;
      border-left: 4px solid;
      border-color: var(--active-bg);
    } */
    .flex-box .box-list{
      width: 40%;
      height: 164px;
      background: rgba(0,0,0,0.30);
      border-radius: 4px;
      padding: 14px 20px;
      margin-top: 24px;
      border-left: 4px solid;
      border-color: var(--active-bg);
    }

    .flex-box .box-list:nth-of-type(3) {
      margin-left: 16px;
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
    
    .list-title{
      font-size: 16px;
      color: rgba(255,255,255,0.85);
    }
    
    .list-content{
      margin-top: 14px;
      font-size: 14px;
      color: rgba(255,255,255,0.60);
      white-space: pre-wrap;
      /* word-break: break-all; */
      /* word-wrap:bread-word; */
    }

    .list-num{
      margin-top: 16px;
      font-size: 24px;
      color: rgba(255,255,255,0.85);
    }

    .list-num .list-btn{
      width: 80px;
      height: 40px;
      font-size: 14px;
      color: rgba(255,255,255,0.85);
      border-radius: 10px;
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

    .green{
      color: #52C41A;
    }

    .select-box input{
      /* margin-left: 12px; */
      width: 160px;
      height: 40px;
    }

    .select-box input:nth-of-type(2){
      margin-left: 12px;
    }
    .select-box :deep(.ant-input){
      background: rgba(0,0,0,0.30);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      margin-top: 24px;
    }

    .sel-box{
      margin-top: 24px;
    }
    .sel-box :deep(.ant-select){
      margin-left: 12px;
      width: 160px;
      /* height: 40px; */
      background: rgba(0,0,0,0.30);
      /* border: 1px solid rgba(255,255,255,0.1); */
      border-radius: 10px;
    }
    .sel-box :deep(.ant-picker){
      width: 160px;
      border-radius: 10px;
      background: rgba(0,0,0,0.30);
    }
    .sel-box :deep(.ant-select-selector){
      border: none;
    }


  </style>
  