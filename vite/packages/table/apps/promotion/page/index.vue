<template>
    <vueCustomScrollbar :settings="scrollbarSettings" style="padding: 15px;white-space: nowrap;height: 100%">
      <div class="page-container rounded-xl xt-bg box-body flex"  style="height: 100%;min-width: 1000px;min-height: 800px;">

        <div class="left-box overflow-hidden overflow-y-auto xt-scrollbar beautiful-sm-scroll">
            <!-- 头像 -->
            <div class="head-user">
              <img :src="this.userInfo.avatar" alt="" >
              <p>{{ this.userInfo.nickname }}</p>
              <div class="xt-active-btn" style="width:84px;height:32px;border-radius:8px;">联系客服</div>
            </div>
            <!-- 左侧列表 -->
            <div class="nav-list">
              <div class="pointer flex nav-col" v-for="item in dataList"  :class="indexKey == item.key ?'active-list':''" :key="item.key" @click="onChangeList(item.key)">
                <Icon class="ml-4" :icon="item.icon" width="20" height="20" />
                <div class="ml-4">{{ item.title }}</div>
                <span v-if="item.isAdmin">管</span>
              </div>
            </div>
        </div>
        <div class="right-box">
          <Dashboard v-if="indexKey == 1"/>
          <Invite  v-if="indexKey == 2"/>
          <Agent  v-if="indexKey == 3"/>
          <Income  v-if="indexKey == 4"/>
          <Explain  v-if="indexKey == 5"/>
          <Records  v-if="indexKey == 6"/>
          <Promoter  v-if="indexKey == 7"/>
          <Withdrawal  v-if="indexKey == 8"/>
        </div>
      </div>
    </vueCustomScrollbar>
  

  </template>
  
  <script>

  

  // import { 
  //   FileDoneOutlined, 
  //   DashboardOutlined,
  //   GiftOutlined,
  //   ClusterOutlined,
  // } from '@ant-design/icons-vue';
  import { Icon } from '@iconify/vue';
  import Agent from "../components/agent.vue";
  import Dashboard from "../components/dashboard.vue";
  import Explain from "../components/explain.vue";
  import Income from "../components/income.vue";
  import Invite from "../components/invite.vue";
  import Promoter from "../components/promoter.vue";
  import Records from "../components/records.vue";
  import Withdrawal from "../components/withdrawal.vue";
  import {mapActions, mapState} from "pinia";
  import { appStore } from '../../../store'
  import VueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";


  import dataPie24Regular from '@iconify-icons/fluent/data-pie-24-regular';
  import peopleAdd16Regular from '@iconify-icons/fluent/people-add-16-regular';
  import arrowTrendingLines20Filled from '@iconify-icons/fluent/arrow-trending-lines-20-filled';
  import gift16Regular from '@iconify-icons/fluent/gift-16-regular';
  import documentBulletListMultiple24Regular from '@iconify-icons/fluent/document-bullet-list-multiple-24-regular';
  import appsListDetail24Regular from '@iconify-icons/fluent/apps-list-detail-24-regular';
  import peopleCommunity16Regular from '@iconify-icons/fluent/people-community-16-regular';
  import money16Regular from '@iconify-icons/fluent/money-16-regular';
  
  const { appModel } = window.$models

    export default {
      name: 'Promotion',
      components: { 
        // FileDoneOutlined,
        // DashboardOutlined,
        // GiftOutlined,
        // ClusterOutlined,
        Agent,
        Dashboard,
        Explain,
        Income,
        Invite,
        Promoter,
        Records,
        Withdrawal,
        Icon,
        VueCustomScrollbar,
      },
      computed: {
      //   ...mapState(appStore, ['userInfo','secondaryVisible'])
      
        ...mapState(appStore, ['userInfo']),
      
      },
      data(){
        return {
          icons: {
            dataPie24Regular,
            peopleAdd16Regular,
            arrowTrendingLines20Filled,
            gift16Regular,
            documentBulletListMultiple24Regular,
            appsListDetail24Regular,
            peopleCommunity16Regular,
            money16Regular,
          },
          scrollbarSettings: {
            useBothWheelAxes: true,
            swipeEasing: true,
            suppressScrollY: false,
            suppressScrollX: true,
            wheelPropagation: true
          },
          indexKey:1,
          dataList:[
            {
              icon:dataPie24Regular,
              title:"数据总览",
              key:1,
              isAdmin:false,
            },
            {
              icon:peopleAdd16Regular,
              title:"我的邀请",
              key:2,
              isAdmin:false,
            },
            {
              icon:arrowTrendingLines20Filled,
              title:"下级代理收益",
              key:3,
              isAdmin:false,
            },
            {
              icon:gift16Regular,
              title:"我的收益",
              key:4,
              isAdmin:false,
            },
            {
              icon:documentBulletListMultiple24Regular,
              title:"推广说明",
              key:5,
              isAdmin:false,
            },
            {
              icon:appsListDetail24Regular,
              title:"推广记录",
              key:6,
              isAdmin:true,
              
            },
            {
              icon:peopleCommunity16Regular,
              title:"推广员管理",
              key:7,
              isAdmin:true,
            },
            {
              icon:money16Regular,
              title:"提现管理",
              key:8,
              isAdmin:true,
            },
          ]

        }
      },
      mounted(){

        this.getUserInfo()
        // this.apps = await appModel.getAll({order:"create_time"})
      },
      watch:{

      },
      methods:{
        onChangeList(key){
          // console.log(key);s
          this.indexKey = key
        },
        ...mapActions(appStore, ['getUserInfo']),
      },
    }
  </script>
  
  <style scoped>

    .box-body{
      background: rgba(26,26,26,0.65);
      box-shadow: 0px 0px 3.12px 0px rgba(0,0,0,0.03);
      box-shadow: 0px 0px 10.23px 0px rgba(0,0,0,0.1);
      box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);
      border-radius: 12px 12px 12px 0px 0px 12px;
    }
    .left-box{
      width: 20%;
      min-width: 200px;
      height: 100%;
      /* border: 1px solid #fff; */
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      /* overflow: auto; */
    }

    /* // 滚动条 */
    :deep(.ant-transfer-list-content){
        flex: 1 1 0%;
        overflow: hidden;
        overflow-y: auto;
    }
    :deep(.ant-transfer-list-content::-webkit-scrollbar){
        width: 5px;
    }
    :deep(.ant-transfer-list-content::-webkit-scrollbar-thumb){
        background: #aaa !important;
        border-radius: 3px;
    }
    
    .left-box .head-user{
      /* border: 1px solid #fff; */
      height: 24%;
      min-height: 250px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      
    }
    
    .head-user img{
      /* border: 1px solid #fff; */
      width: 100px;
      height: 100px;
      border-radius: 50%;
      position: relative;
    }
    .head-user p{
      margin-top: 12px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: rgba(255,255,255,0.85);
      font-weight: 500;
    }
    
    .nav-list{
      width: 100%;
      display: flex;
      flex-direction: column;
    }


    .nav-col{
      height: 56px;
      font-size: 16px;
      display:flex;
      align-items: center;
      position:relative;
    }

    .nav-col span{   
      position: absolute;
      right: 18px;
      background: rgba(80,139,254,0.20);
      border: 1px solid rgba(80,139,254,1);
      border-radius: 4px;
      font-size: 12px;
      color: #508BFE;
      padding:1.5px 4px;
    }

    .nav-list>div:hover{
      background: rgba(80,139,254,0.20);
    }
    
    .active-list{
      background: rgba(80,139,254,0.20);
    }


    .right-box{
      width: 100%;
      height: 100%;
      min-width: 800px;
    }




    
  </style>
  