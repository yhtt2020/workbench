<template>
    <vueCustomScrollbar  :settings="scrollbarSettings"  style="height: 100%;">
      <div class="flex flex-box" >
            <div class="box-title">提现管理</div>
            <div class="flex search-box">
              <!-- 单选 -->
              <div class="radio-box flex pointer mt-4 mr-4">
                <div :class="{'xt-active-btn':tableStatus}" @click='tableStatus=true'>推广员</div>
                <div :class="{'xt-active-btn':!tableStatus}" @click='tableStatus=false'>待审核</div>
              </div>
              <!-- 搜索条件 -->
              <input type="text" v-model="search.promoterId" placeholder="推广员昵称、UID" class="input ant-input" style="width:200px;">

              <div class=" no-drag xt-active-btn input pointer" style="width:64px;" @click='test'>搜索</div>
                <div class="input flex no-drag pointer" style="width:40px;justify-content:center;align-items:center;">
                  <Icon :icon="icons.arrowCounterclockwise20Filled" />
                </div>
                <div class="flex input" style="align-items:center;font-size:14px;color: rgba(255,255,255,0.60);background:none;">共{{dataNum}}条数据</div>

            </div>
            <a-table 
              :dataSource="detailList.data" 
              tableLayout='fixed'
              :scroll="{ x: 1500 }"
              :pagination="{ pageSize: 5 }"
              :columns="detailCol" class="table-box">
              <a-table-column key="tags" title="Tags" data-index="tags">
                <template #default="{ text: tags }">
                </template>
              </a-table-column>
              <template #bodyCell="{ column, record }">      
                <!-- <template v-if="column.key === 'comTime' && !tableStatus">
                  {{record.comTime}}
                </template>  -->
                <template v-if="column.key === 'action'">
                  <span>
                    <a>推广记录 </a>
                    <a>通过 </a>
                    <a>驳回 </a>
                  </span>
                </template>
              </template>
            </a-table>
      </div>
      <!-- div class="fixed inset-0 home-blur xt-mask" style="z-index: 99999;" v-if="shareModal" > -->
  <div class="fixed inset-0 home-blur xt-mask" style="z-index: 99999;" v-if="promptVisible" >
    <div
      class="xt-modal fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col justify-evenly items-center">
      <Modal blurFlag="true" style="z-index:99999;"  >
        <div class="p-5 xt-modal flex flex-col justify-center items-center" style="width:500px;height:280px;border-radius:12px;border: 1px solid rgba(255,255,255,0.1);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);background: #212121;">
          <div  style="width:100%;height:64px;position:relative;">
            <div class='flex justify-center font-16' style='color: rgba(255,255,255,0.85);'>驳回</div>
            <div class="flex justify-center items-center pointer btn-active" style='position:absolute;top:-5px;right:-7px;background: #2A2A2A;border-radius: 10px;width:40px;height:40px;' @click='promptVisible=false'>
              <Icon :icon="icons.dismiss16Filled" />
            </div>
          </div>
          <a-textarea
            style='width:452px;height:128px;background: #2A2A2A;border: 1px solid rgba(255,255,255,0.1);border-radius: 10px;padding:9px 15px;'
            v-model="value2"
            placeholder="请输入原因"
          />
          <div class='flex font-16' style='color: rgba(255,255,255,0.60);width:100%;justify-content: flex-end;'>
            <div class='no-drag btn-active input pointer flex justify-center items-center' @click='promptVisible=false' style='width:64px;height:40px;background: #2A2A2A;'>取消</div>
            <div class='no-drag xt-active-btn input pointer' style='width:64px;height:40px;'>确定</div>
          </div>
        </div>
      </Modal>
    </div>
  </div>
    </vueCustomScrollbar>

    
  </template>
  <script>
  import { Icon } from '@iconify/vue';
  import Modal from '../../../components/Modal.vue'
  import arrowCounterclockwise20Filled from '@iconify-icons/fluent/arrow-counterclockwise-20-filled';
  import dismiss16Filled from '@iconify-icons/fluent/dismiss-16-filled';
  export default {
    name: 'Promotion',
    components: { 
      Icon
    },
    computed: {


    },
    data(){
      return {
        
        promptVisible: false,
        tableStatus:true,
        icons: {
          arrowCounterclockwise20Filled,
          dismiss16Filled,
        },
        dataNum:123,
        search:{
          promoterId:"",
          keyCode:"",
          higherId:"",
          agency:"",

        },

        // 滚动条配置 
        // scrollbarSettings: {  
        //   useBothWheelAxes: true,
        //   swipeEasing: true,
        //   suppressScrollY: false,
        //   suppressScrollX: true,
        //   wheelPropagation: true
        // },
        detailList:{
          title:"提现明细",
          // 搜索条件
          time:"",
          state:"",
          data:[
            {
              user:"jojo",
              amount:"100.0",
              commission:"100.0",
              alipay:"15868888688",
              alipayName:"jojo",
              appTime:"2023-08-06 13:12",
              comTime:"2023-08-06 13:12",
              type:"通过",
              remark:"-",
            },
            {
              user:"jojo",
              amount:"100.0",
              commission:"100.0",
              alipay:"15868888688",
              alipayName:"jojo",
              appTime:"2023-08-06 13:12",
              comTime:"2023-08-06 13:12",
              type:"通过",
              remark:"-",
            },
            {
              user:"jojo",
              amount:"100.0",
              commission:"100.0",
              alipay:"15868888688",
              alipayName:"jojo",
              appTime:"2023-08-06 13:12",
              comTime:"2023-08-06 13:12",
              type:"驳回",
              remark:"账号和姓名不匹配",
            },
            {
              user:"jojo",
              amount:"100.0",
              commission:"100.0",
              alipay:"15868888688",
              alipayName:"jojo",
              appTime:"2023-08-06 13:12",
              comTime:"2023-08-06 13:12",
              type:"通过",
              remark:"-",
            },
            {
              user:"jojo",
              amount:"100.0",
              commission:"100.0",
              alipay:"15868888688",
              alipayName:"jojo",
              appTime:"2023-08-06 13:12",
              comTime:"2023-08-06 13:12",
              type:"通过",
              remark:"-",
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
            title:"提现金额",
            dataIndex:"amount",
            key:"amount"
          },
          {
            title:"手续费",
            dataIndex:"commission",
            key:"commission"
          },
          {
            title:"支付宝账号",
            dataIndex:"alipay",
            key:"alipay"
          },
          {
            title:"支付宝名称",
            dataIndex:"alipayName",
            key:"alipayName"
          },
          {
            title:"申请时间",
            dataIndex:"appTime",
            key:"appTime"
          },
          {
            title:"完成时间",
            dataIndex:"comTime",
            key:"comTime",
            // className:!this.tableStatus ? 'tableShow':'tableHidden',
            // colSpan:!this.tableStatus ? 1:0
          },
          {
            title:"类型",
            dataIndex:"type",
            key:"type"
          },
          {
            title:"备注",
            dataIndex:"remark",
            key:"remark"
          },
          {
            title:"操作",
            key:"action",
            fixed:'right',
            // className:'tableHidden',
            // className:this.tableStatus ? 'tableShow':'tableHidden',
            // colSpan:0
            
            // customRender:(value,row,index)=>{
            //   let obj = {
            //     childrem:value,
            //     attrs:{},
            //   };
            //   obj.attrs.colSpan = 0;
            //   return obj;
            // }
            // colSpan:this.tableStatus ? 1:0
          },
        ]
      }
    },
    mounted(){
      
    },
    watch:{


    },
    methods:{
      test(){
        // console.log('表格列表')
        // console.log(this.detailCol)
        // console.log(this.tableStatus)
        
        this.promptVisible = true
        console.log(this.promptVisible)
      },
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


    .radio-box{
      width:300px;
      height:40px;
      text-align:center;
      line-height:40px;
      background: rgba(0,0,0,0.30);
      border-radius: 12px;
    }
    .radio-box>div{
      width:50%;
    }

    /* 控制列表隐藏显示列 */
    .tableHidden{
      display:none;
    }

    .tableShow{
      display:revert;
    }
    /* // 滚动条 */
    .table-box :deep(.ant-table-content){
        flex: 1 1 0%;
        overflow: hidden;
        overflow-y: auto;
    }
    .table-box :deep(.ant-table-content::-webkit-scrollbar){
        /* width: 2px; */
        height: 5px;
    }
    .table-box :deep(.ant-table-content::-webkit-scrollbar-thumb){
        background: #aaa !important;
        border-radius: 3px;
    }
  </style>
  