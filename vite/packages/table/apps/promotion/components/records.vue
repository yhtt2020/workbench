<template>
    <vueCustomScrollbar  :settings="scrollbarSettings"  style="height: 100%;">
        <div class="flex flex-box" >
            <div class="box-title">推广记录</div>
            <div class="flex" style="width: 100%;justify-content: space-between;">
                <div class="list-box" v-for="(item,index) in cardList">
                    <div class="list-title">{{ item.title }}</div>
                    <div class="list-num">{{ item.num }}</div>
                </div>
            </div>
            <!-- 筛选条件 -->
            <div class="search-box" >
                <input type="text" v-model="search.userId" placeholder="用户昵称、UID" style="width:200px;" class="input ant-input">
                <a-select
                    class="select input rounded-lg  text-xs flex items-center" size="large" :bordered="false"
                    v-model:selValue="selValue"
                    show-search
                    placeholder="用户类型"
                    style="width: 160px"
                    :filter-option="filterOption"
                    @change="handleChange"
                    :options="sortType"
                ></a-select> 
                <input type="text" v-model="search.keyCode" placeholder="口令" class="input ant-input" style="width:200px;">
                <input type="text" v-model="search.promoterId" placeholder="推广员昵称、UID" class="input ant-input" style="width:200px;">
                <input type="text" v-model="search.higherId" placeholder="上级推广员昵称、UID" class="input ant-input" style="width:200px;">
                <a-date-picker class="input ant-input" v-model:value="search.redemptionTime" placeholder="兑换时间" style="width:160px;" />
                <a-select
                    class="input select rounded-lg  text-xs flex items-center " size="large" :bordered="false"
                    v-model:selValue="selValue"
                    show-search
                    placeholder="激活状态"
                    style="width: 160px"
                    :filter-option="filterOption"
                    @change="handleChange"
                    :options="sortType"
                ></a-select> 
                <a-date-picker class="input ant-input" v-model:value="search.activationTime" placeholder="激活时间" style="width:160px;" />
                <div class=" no-drag xt-active-btn input pointer" style="width:64px;" >搜索</div>
                <div class="input flex no-drag pointer" style="width:40px;justify-content:center;align-items:center;">
                  <Icon :icon="icons.arrowCounterclockwise20Filled" />
                </div>
                <div class="flex input" style="align-items:center;font-size:14px;color: rgba(255,255,255,0.60);background:none;">共{{dataNum}}条数据</div>
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
        </div>
    </vueCustomScrollbar>
  </template>
  <script>
  import { Icon } from '@iconify/vue';
  import arrowCounterclockwise20Filled from '@iconify-icons/fluent/arrow-counterclockwise-20-filled';
  export default {
    name: 'Promotion',
    components: { 
        Icon
    },
    computed: {

    },
    data(){
      return {
        dataNum:123,
        icons: {
          arrowCounterclockwise20Filled,
        },
        // 搜索
        search:{
            userId:'',
            userType:'',
            keyCode:'',
            promoterId:'',
            higherId:'',
            redemptionTime:'',
            status:'',
            activationTime:'',
        },

        // 滚动条配置 
        settingsScroller: {  
          useBothWheelAxes: true,
          swipeEasing: true,
          suppressScrollY: false,
          suppressScrollX: true,
          wheelPropagation: true
        },
        // 卡片列表
        cardList:[
            {
                title:"今日推广",
                num:193,
            },
            {
                title:"今日激活",
                num:176,
            },
            {
                title:"总推广",
                num:12984,
            },
            {
                title:"总激活",
                num:10331,
            },
            {
                title:"激活率",
                num:98,
            },
        ],
        
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

    .list-box{
      width: 19%;
      min-width: 140px;
      height: 112px;
      background: rgba(0,0,0,0.30);
      border-radius: 4px;
      padding: 16px 20px;
      margin-top: 24px;
      border-left: 4px solid;
      border-color: var(--active-bg);
      
    }
    .list-title{
      /* margin-top: 16px; */
      font-size: 14px;
      color: rgba(255,255,255,0.60);
    }
    
    .list-num{
      margin-top: 16px;
      font-family: Oswald-Regular;
      font-size: 24px;
      color: rgba(255,255,255,0.85);
    }

    .search-box{
      display: flex;
      flex-wrap: wrap;
      width:100%;
    }
    
    .input{
      margin-top:16px;
      margin-right:12px;    
      background: rgba(0,0,0,0.30);
      border-radius: 10px;
      height:40px !important;
      font-size: 14px;
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

  </style>
  