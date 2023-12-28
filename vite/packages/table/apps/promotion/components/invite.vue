<template>
    <vueCustomScrollbar :settings="scrollbarSettings">
      <div class="page-container rounded-xl box-body" style="height: 100%;">
          <div class="flex-box">
              <div class="box-title">{{ keyWord.title }}</div>
              <button class="text-center rounded-lg center pointer sel-btn btn-active " @click="showModal">查询</button>
              <a-table
              :dataSource="keyWord.data"
              :pagination="{ pageSize: 3 }"
              :columns="keyWordCol"
              class="table-box"/>
            </div>
            <div class="flex-box">
              <div class="box-title">{{ detailList.title }}</div>
              <a-table
              :pagination="{ pageSize: 5 }"
              :dataSource="detailList.data"
              :columns="detailCol"
              class="table-box"/>
          </div>
      </div>
      <a-modal :visible="visible" title="" @ok="handleOk"
      width="600px"
      height="500px"
      centered
      :closable="false"
      :footer="null"
      class="modal-box"
      style="text-align: center;">
        <div class="modal-box" v-if="modalState != 3">
          <div class="modal-header">
            <div class="left-icon rounded-lg xt-btn no-drag" v-if="modalState == 2" @click="modalState = 1">
              <LeftOutlined />
            </div>
            <span class="header-title">
              推广说明
            </span>
            <div class="right-icon rounded-lg xt-btn no-drag" @click="handleOk">
              <CloseOutlined />
            </div>
          </div>
          <div class="modal-content" v-if="modalState == 1">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex soluta ab enim id numquam laborum error magni adipisci repudiandae culpa, tempore reiciendis itaque, accusamus reprehenderit sit optio inventore quae voluptas.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex soluta ab enim id numquam laborum error magni adipisci repudiandae culpa, tempore reiciendis itaque, accusamus
          </div>
          <div class="modal-content content-box" v-if="modalState == 2">
            <a-textarea
              v-model="passKey"
              placeholder="输入你的口令"
              auto-size
              style="text-align: center;height: 48px;border-radius: 12px;"
              class="ant-input text-input"
            />
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. At alias quos molestiae, laboriosam et quod obcaecati quae quibusdam. Laudantium, debitis? Quibusdam beatae consequatur voluptate! Eos corporis recusandae similique officia enim!
            </p>
            <a-textarea
              v-model="passContent"
              placeholder="请输入"
              :auto-size="{ minRows: 2, maxRows: 5 }"
              class="text-textarea"
            />
          </div>
          <div class="modal-footer">
            <button class="xt-btn btn-active" @click="visible = false">取消</button>
            <button class="btn-active xt-active-btn " @click="modalState++" v-if="modalState == 1">同意</button>
            <button class="btn-active xt-active-btn" @click="onAgree" v-if="modalState == 2">提交</button>
          </div>
        </div>

        <div class="modal-success" v-if="modalState == 3">
          <div>提交成功</div>
          <div>
            谢谢你的申请！我们会尽快审核并与您联系。<br/>
            请关注工作台内的消息动态，我们会通过工作台内的聊天应用与您联系。

          </div>
          <div class="flex" style="justify-content: center;">
            <button class="btn-active rounded-lg" @click="visible = flase">完成</button>
          </div>
        </div>

      </a-modal>

    </vueCustomScrollbar>


  </template>

  <script>

  // import Modal from "./modal.vue"

import { Modal } from 'ant-design-vue'
import { Icon } from '@iconify/vue';
import { LeftOutlined, CloseOutlined } from '@ant-design/icons-vue';



  export default {
    name: 'Promotion',
    components: {
      // Modal
      LeftOutlined,
      CloseOutlined,
    },
    computed: {

    },
    data(){
      return {
        visible:false,
        // 对话框表格 数据绑定
        passKey:"",
        passContent:"",
        // 我的邀请口令 表格渲染数据
        keyWord:{
          // dataSource:{
          title:"我的邀请口令",
          data:[
            {
              index:"1000345",
              keyWord:"天天工作台",
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
            {
              index:"1000348",
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
            {
              user:"nihao3",
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
        ],
        // 对话框渲染数据
        modalState:3,



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
        this.modalState = 1;
      },
      // 控制 对话框 状态
      onAgree(){
        this.modalState = 3
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





    /* modal */
    .modal-box{
      width: 600px;
      height: 452px;
      position: relative;
      top: -24px;
      left: -24px;
      /* border-radius: 10px; */
    }
    .modal-box :deep(.ant-modal-content){
      border-radius: 12px !important;
    }
    .modal-header{

      font-size: 16px;
      color: rgba(255,255,255,0.85);
      font-weight: 500;
      height: 76px;
      line-height: 76px;
    }
    .modal-header>div{
      width: 48px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #2A2A2A;
      border-radius: 12px;
    }
    :deep(.lg .ant-modal-body svg){
      font-size: 24px;
    }
    .modal-header .left-icon{
      position: absolute;
      top: 12px;
      left: 12px;
    }
    .modal-header .right-icon{
      position: absolute;
      top: 12px;
      right: 12px;
    }
    .modal-content{
      width: 552px;
      height: 348px;

      font-size: 16px;
      color: rgba(255,255,255,0.85);
      text-align: justify;
      line-height: 28px;
      font-weight: 400;
      background: #2A2A2A;
      border-radius: 12px;
      padding: 14px 16px;
      margin-left: 24px;
    }


   .modal-footer{
      /* height: 10px; */
      /* border: 1px solid #fff; */

      font-size: 16px;
      color: rgba(255,255,255,0.85);
      text-align: center;
      font-weight: 400;
      display: flex;
      text-align: center;
      justify-content: center;
    }
    .modal-footer button{
      width: 100px;
      height: 44px;
      border-radius: 10px;
      margin-top: 16px;
      border: none;
    }
    .modal-footer button:nth-of-type(2){
      background: var(--active-bg);
      margin-left: 12px;
    }

    .modal-box .content-box{
      background: transparent;
    }

    .text-input{
      height: 48px !important;
      font-size: 16px;
      color: rgba(255,255,255,0.40);
      line-height: 38px;
      margin-bottom: 24px;
    }

    .text-textarea{
      background: #2A2A2A;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 12px;
      height: 178px !important;
    }

    .modal-success{
      height: 239px;
      text-align: center;
      padding: 0 100px;
    }
    .modal-success div:nth-of-type(1){
      font-size: 18px;
      color: rgba(255,255,255,0.85);
      font-weight: 500;
    }
    .modal-success div:nth-of-type(2){
      margin: 30px 0;
      font-size: 16px;
      /* width: 408px; */
      color: rgba(255,255,255,0.60);
      text-align: center;
      font-weight: 400;
      height: 80px;
    }
    .modal-success button{

      width: 120px;
      height: 44px;
      font-size: 16px;
      color: rgba(255,255,255,0.85);
      background-color: var(--active-bg);
    }
    /* // 滚动条 */
    .modal-content::-webkit-scrollbar-track {
      background: rgba(72, 72, 72, 0.85);
    }

    .modal-content{
      flex: 1 1 0%;
      overflow: hidden;
      overflow-y: auto;
    }
    .modal-content::-webkit-scrollbar{
      width: 3px;
    }
    .modal-content::-webkit-scrollbar-thumb{
      background-color: #f1f1f1 !important;
        border-radius: 3px;
    }




  </style>
