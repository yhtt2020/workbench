<template>
    <vueCustomScrollbar  :settings="scrollbarSettings"  style="height: 100%;">
      <div class="flex flex-box" >
            <div class="box-title">推广员管理</div>
            <div class="flex search-box">
              <!-- 单选 -->
              <div class="radio-box flex pointer mt-4 mr-4">
                <div :class="{'xt-active-btn':tableStatus}" @click='tableStatus=true'>推广员</div>
                <div :class="{'xt-active-btn':!tableStatus}" @click='tableStatus=false'>待审核</div>
              </div>
              <!-- 搜索条件 -->
              <input type="text" v-model="search.promoterId" placeholder="推广员昵称、UID" class="input ant-input" style="width:200px;">
              <input type="text" v-model="search.higherId" placeholder="口令" class="input ant-input" style="width:200px;">

              <input v-show="tableStatus" type="text" v-model="search.higherId" placeholder="上级推广员昵称、UID" class="input ant-input" style="width:200px;">
              <a-select
                v-show="tableStatus"
                class="input select rounded-lg  text-xs flex items-center " size="large" :bordered="false"
                v-model:selValue="selValue"
                show-search
                placeholder="代理层级"
                style="width: 160px"
                :filter-option="filterOption"
                @change="handleChange"
                :options="sortType"
              ></a-select> 

              <div class=" no-drag xt-active-btn input pointer" style="width:64px;" >搜索</div>
                <div class="input flex no-drag pointer" style="width:40px;justify-content:center;align-items:center;">
                  <Icon :icon="icons.arrowCounterclockwise20Filled" />
                </div>
                <div class="flex input" style="align-items:center;font-size:14px;color: rgba(255,255,255,0.60);background:none;">共{{dataNum}}条数据</div>

            </div>
            <a-table 
              :dataSource="detailList.data" 
              tableLayout='fixed'
              :pagination="{ pageSize: 5 }"
              :scroll="{ x: 1500 }"
              :columns="detailCol" class="table-box">
              <a-table-column key="tags" title="Tags" data-index="tags">
                <template #default="{ text: tags }">
                </template>
              </a-table-column>
              <template #bodyCell="{ column, record }">              
                <template v-if="column.key === 'action'">
                  <span>
                    <a>推广记录 </a>
                    <a>口令编辑 </a>
                  </span>
                </template>
              </template>
            </a-table>
      </div>
      <div class="fixed inset-0 home-blur xt-mask" style="z-index: 99999;" v-if="promptVisible" >
        <div
        class="xt-modal fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col justify-evenly items-center">
        <!-- 口令编辑 -->
        <Modal blurFlag="false" style="z-index:99999;"  >
          <div class="p-5 xt-modal flex flex-col justify-center items-center" style="width:800px;height:600px;border-radius:12px;border: 1px solid rgba(255,255,255,0.1);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);background: #212121;">
            <div  style="width:100%;height:64px;position:relative;">
              <div class='flex justify-center font-16' style='color: rgba(255,255,255,0.85);'>口令</div>
              <div class="flex justify-center items-center pointer btn-active" style='position:absolute;top:-5px;right:-7px;background: #2A2A2A;border-radius: 10px;width:40px;height:40px;' @click='promptVisible=false'>
                <Icon :icon="icons.dismiss16Filled" />
              </div>
            </div>
            <div class='flex font-16' style='height:22px;width:100%;justify-content: space-between;'>
              <div>推广员：米兰小铁匠</div>
              <div><a>+ 创建口令</a></div>
            </div>
            <a-table 
              :dataSource="keyCodeList" 
              tableLayout='fixed'
              :scroll="{ x: 1500 }"
              :pagination="{ pageSize: 6 }"
              :columns="keyCodeCol" class="table-box">
              <template #bodyCell="{ column, record }">              
                <template v-if="column.key === 'action'">
                  <span>
                    <a>编辑 </a>
                    <a>删除 </a>
                  </span>
                </template>
              </template>
            </a-table>
          </div>
        </Modal>
        <!-- 创建口令 -->
        <!-- <Modal blurFlag="true" style="z-index:99999;"  >
          <div class="p-5 xt-modal flex flex-col justify-center items-center" style="width:500px;height:280px;border-radius:12px;border: 1px solid rgba(255,255,255,0.1);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);background: #212121;">
            <div  style="width:100%;height:64px;position:relative;">
              <div class='flex justify-center font-16' style='color: rgba(255,255,255,0.85);'>驳回</div>
              <div class="flex justify-center items-center pointer btn-active" style='position:absolute;top:-5px;right:-7px;background: #2A2A2A;border-radius: 10px;width:40px;height:40px;' @click='promptVisible=false'>
                <Icon :icon="icons.dismiss16Filled" />
              </div>
            </div>
            456
            <div class='flex font-16' style='color: rgba(255,255,255,0.60);width:100%;justify-content: flex-end;'>
              <div class='no-drag btn-active input pointer flex justify-center items-center' @click='promptVisible=false' style='width:64px;height:40px;background: #2A2A2A;'>取消</div>
              <div class='no-drag xt-active-btn input pointer' style='width:64px;height:40px;'>确定</div>
            </div>
          </div>
        </Modal> -->
        <!-- 代理层级 -->
        <!-- <Modal blurFlag="true" style="z-index:99999;"  >
          <div class="p-5 xt-modal flex flex-col justify-center items-center" style="width:500px;height:280px;border-radius:12px;border: 1px solid rgba(255,255,255,0.1);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);background: #212121;">
            <div  style="width:100%;height:64px;position:relative;">
              <div class='flex justify-center font-16' style='color: rgba(255,255,255,0.85);'>驳回</div>
              <div class="flex justify-center items-center pointer btn-active" style='position:absolute;top:-5px;right:-7px;background: #2A2A2A;border-radius: 10px;width:40px;height:40px;' @click='promptVisible=false'>
                <Icon :icon="icons.dismiss16Filled" />
              </div>
            </div>
            123
            <div class='flex font-16' style='color: rgba(255,255,255,0.60);width:100%;justify-content: flex-end;'>
              <div class='no-drag btn-active input pointer flex justify-center items-center' @click='promptVisible=false' style='width:64px;height:40px;background: #2A2A2A;'>取消</div>
              <div class='no-drag xt-active-btn input pointer' style='width:64px;height:40px;'>确定</div>
            </div>
          </div>
        </Modal> -->
        <!-- 驳回原因 -->
        <!-- <Modal blurFlag="true" style="z-index:99999;"  >
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
        </Modal> -->
      </div>
    </div>

    </vueCustomScrollbar>
  </template>
  <script>
  import { Icon } from '@iconify/vue';
  import {mapActions, mapState,mapWritableState} from "pinia";
  import Modal from '../../../components/Modal.vue'
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
        // 推广员 or 待审核
        tableStatus:true,
        icons: {
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
        settingsScroller: {  
          useBothWheelAxes: true,
          swipeEasing: true,
          suppressScrollY: false,
          suppressScrollX: true,
          wheelPropagation: true
        },
        detailList:{
          title:"提现明细",
          // 搜索条件
          time:"",
          state:"",
          data:[
            {
              user:"jojo",
              keyCode:"jojo666",
              total:"1898.0",
              agentNum:"-",
              agentIncome:"-",
              balance:"916",
              monthIncome:"916",
              dayIncome:"916",
              activationRate:"98%",
              agencyLevel:"二级",
              cooTime:"2023-08-06 18:12",
            },
            {
              user:"jojo",
              keyCode:"jojo777",
              total:"1898.0",
              agentNum:"-",
              agentIncome:"-",
              balance:"916",
              monthIncome:"916",
              dayIncome:"916",
              activationRate:"98%",
              agencyLevel:"二级",
              cooTime:"2023-08-06 18:12",
            },
            {
              user:"jojo",
              keyCode:"jojo888",
              total:"1898.0",
              agentNum:"-",
              agentIncome:"-",
              balance:"916",
              monthIncome:"916",
              dayIncome:"916",
              activationRate:"98%",
              agencyLevel:"二级",
              cooTime:"2023-08-06 18:12",
            },
            {
              user:"jojo",
              keyCode:"jojo999",
              total:"1898.0",
              agentNum:"-",
              agentIncome:"-",
              balance:"916",
              monthIncome:"916",
              dayIncome:"916",
              activationRate:"98%",
              agencyLevel:"二级",
              cooTime:"2023-08-06 18:12",
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
            title:"口令",
            dataIndex:"keyCode",
            key:"keyCode"
          },
          {
            title:"总收益",
            dataIndex:"total",
            key:"total",
            width:80,
          },
          {
            title:"下级代理数",
            dataIndex:"agentNum",
            key:"agentNum",
            width:80,
          },
          {
            title:"下级代理收益",
            dataIndex:"agentIncome",
            key:"agentIncome",
            width:80,
          },
          {
            title:"钱包余额",
            dataIndex:"balance",
            key:"balance"
          },
          {
            title:"当月收益",
            dataIndex:"monthIncome",
            key:"monthIncome"
          },
          {
            title:"当日收益",
            dataIndex:"dayIncome",
            key:"dayIncome"
          },
          {
            title:"总激活率",
            dataIndex:"activationRate",
            key:"activationRate"
          },
          {
            title:"代理层级",
            dataIndex:"agencyLevel",
            key:"agencyLevel"
          },
          {
            title:"合作时间",
            dataIndex:"cooTime",
            key:"cooTime",
            width:180,
          },
          {
            title: '操作',
            key: 'action',
            width:150,
            fixed:'right',
          },
        ],
        keyCodeCol:[
          {
            title:"口令",
            dataIndex:"keyCode",
            key:"keyCode"
          },
          {
            title:"有效期",
            dataIndex:"validity",
            key:"validity",
          },
          {
            title:"推广数",
            dataIndex:"promoNum",
            key:"promoNum",
          },
          {
            title:"激活率",
            dataIndex:"activationRate",
            key:"activationRate",
          },
          {
            title:"操作",
            key:"action",
          },
        ],
        keyCodeList:[
          {
            keyCode:'jojo66',
            validity:'长期',
            promoNum:'773',
            activationRate:'50%',
          },
          {
            keyCode:'jojo66',
            validity:'长期',
            promoNum:'773',
            activationRate:'50%',
          },
          {
            keyCode:'jojo66',
            validity:'长期',
            promoNum:'773',
            activationRate:'50%',
          },
          {
            keyCode:'jojo66',
            validity:'长期',
            promoNum:'773',
            activationRate:'50%',
          },
          {
            keyCode:'jojo66',
            validity:'长期',
            promoNum:'773',
            activationRate:'50%',
          },
          {
            keyCode:'jojo66',
            validity:'长期',
            promoNum:'773',
            activationRate:'50%',
          },
          {
            keyCode:'jojo66',
            validity:'长期',
            promoNum:'773',
            activationRate:'50%',
          },
          {
            keyCode:'jojo66',
            validity:'长期',
            promoNum:'773',
            activationRate:'50%',
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

    .table-box{
      width: 100%;
      background-color: none;
      margin-top: 24px;
      flex:auto;
      min-width:0;
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

    .table-box table{
      min-width:100px !important;
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
  