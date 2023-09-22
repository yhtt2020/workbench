<template>
    <vueCustomScrollbar :settings="scrollbarSettings">
      <div class="page-container rounded-xl box-body" style="height: 100%;">
          <div class="flex-box">
              <div class="box-title">{{ keyWord.title }}</div>
              <button class="text-center rounded-lg center pointer sel-btn btn-active " @click="showModal">查询</button>
              <a-table :dataSource="keyWord.data" :columns="keyWordCol" class="table-box"/>
          </div>
          <div class="flex-box">
              <div class="box-title">{{ detailList.title }}</div>
              <a-table :dataSource="detailList.data" :columns="detailCol" class="table-box"/>
          </div>
      </div>
      <a-modal :visible="visible" title="Basic Modal" @ok="handleOk"
      style="height: 500px;width:600px;">
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
      </a-modal>

      <!-- <Modal :visible="visible" /> -->
s
    </vueCustomScrollbar>
  

  </template>
  
  <script>

  // import Modal from "./modal.vue"
  


  export default {
    name: 'Promotion',
    components: { 
      // Modal
    },
    computed: {

    },
    data(){
      return {
        visible:false,
        // 我的邀请口令 表格渲染数据
        keyWord:{
          // dataSource:{
          title:"我的邀请口令",
          data:[
            {
              index:"1000345",
              keyWord:"想天工作台",
              type:"长期",
              state:"生效中",
            },
            {
              index:"1000346",
              keyWord:"副屏小帮手",
              type:"短期（2个月）",
              state:"已失效",
            },
            {
              index:"1000348",
              keyWord:"副屏小帮手",
              type:"短期（2个月）",
              state:"已失效",
            },
          ]
        },
        keyWordCol:[
        // columns:[
          {
            title:"序号",
            dataIndex:"index",
            key:"index"
          },
          {
            title:"口令",
            dataIndex:"keyWord",
            key:"keyWord"
          },
          {
            title:"序号",
            dataIndex:"type",
            key:"type"
          },
          {
            title:"序号",
            dataIndex:"state",
            key:"state"
          },
        ],
        detailList:{
          title:"邀请收益明细",
          data:[
            {
              user:"nihao1",
              account:"123456",
              useTime:"2023-09-20 16:37",
              active:"是",
              activeTime:"2023-09-20 16:37",
            },
            {
              user:"nihao2",
              account:"123456",
              useTime:"2023-09-20 16:37",
              active:"是",
              activeTime:"2023-09-20 16:37",
            },
            {
              user:"nihao3",
              account:"123456",
              useTime:"2023-09-20 16:37",
              active:"是",
              activeTime:"2023-09-20 16:37",
            },
          ]
          
        },
        detailCol:[
          {
            title:"用户",
            dataIndex:"user",
            key:"user"
          },
          {
            title:"账号",
            dataIndex:"account",
            key:"account"
          },
          {
            title:"口令兑换时间",
            dataIndex:"useTime",
            key:"useTime"
          },
          {
            title:"是否激活",
            dataIndex:"active",
            key:"active"
          },
          {
            title:"激活时间",
            dataIndex:"activeTime",
            key:"activeTime"
          },
        ]


      }
    },
    mounted(){

    },
    watch:{

    },
    methods:{
      handleOk(){
        // console.log("触发了");
        this.visible = false;
      },
      showModal(){
        this.visible = true;
      },
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
      border-left: 4px solid;
      border-color: var(--active-bg);
      margin-top: 24px;
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
    .sel-btn{
      padding: 7px 23px;
      font-size: 14px;
      color: rgba(255,255,255,0.85);
      margin-left: 12px;
      border: none;
      background: rgba(0,0,0,0.30);
      background-color: var(--active-bg);
      position: absolute;
      right: 16px;
      top: 16px;
    }
  </style>
  