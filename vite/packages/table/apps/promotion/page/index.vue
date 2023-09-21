<template>
    <vueCustomScrollbar :settings="scrollbarSettings" style="padding: 15px;white-space: nowrap;height: 100%">
      <div class="page-container rounded-xl xt-bg box-body flex"  style="height: 100%;min-width: 1050px;">
          <div class="left-box">
              <!-- 头像 -->
              <div class="head-user">
                <img src="../../../../../public/img/user.png" alt="" >
                <p>nihao</p>
              </div>
              <!-- 左侧列表 -->
              <div class="nav-list">

                <div class="pointer" v-for="item in dataList"  :class="indexKey == item.key ?'active-list':''" :key="item.key" @click="onChangeList(item.key)">
                  <component :is="item.icon" class="ml-4 mr-4" />
                  {{ item.title }}
                </div>
              </div>
              
            </div>
            <div class="right-box">
              <Dashboard v-if="indexKey == 1"/>
              <Invite  v-if="indexKey == 2"/>
              <Agent  v-if="indexKey == 3"/>
              <Income  v-if="indexKey == 4"/>
              <Explain  v-if="indexKey == 5"/>
            </div>
      </div>

  
    </vueCustomScrollbar>
  

  </template>
  
  <script>

  

  import { 
    FileDoneOutlined, 
    DashboardOutlined,
    GiftOutlined,
    ClusterOutlined,
  } from '@ant-design/icons-vue';
  import Agent from "../components/agent.vue";
  import Dashboard from "../components/dashboard.vue";
  import Explain from "../components/explain.vue";
  import Income from "../components/income.vue";
  import Invite from "../components/invite.vue";

    export default {
      name: 'Promotion',
      components: { 
        FileDoneOutlined,
        DashboardOutlined,
        GiftOutlined,
        ClusterOutlined,
        Agent,
        Dashboard,
        Explain,
        Income,
        Invite,
      },
      computed: {
      //   ...mapState(appStore, ['userInfo','secondaryVisible'])
      },
      data(){
        return {
          indexKey:1,
          dataList:[
            {
              icon:"DashboardOutlined",
              title:"数据总览",
              key:1,
            },
            {
              icon:"FileDoneOutlined",
              title:"我的邀请",
              key:2,
            },
            {
              icon:"ClusterOutlined",
              title:"下级代理收益",
              key:3,
            },
            {
              icon:"GiftOutlined",
              title:"我的收益",
              key:4,
            },
            {
              icon:"FileDoneOutlined",
              title:"推广说明",
              key:5,
            },
          ]

        }
      },
      mounted(){

      },
      watch:{

      },
      methods:{
        onChangeList(key){
          console.log(key);
          this.indexKey = key
        }
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
      min-width: 250px;
      height: 100%;
      /* border: 1px solid #fff; */
      border-right: 1px solid #7C7C7C;
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

    .nav-list>div{
      min-height: 80px;
      font-size: 16px;
      line-height: 80px;
      
    }

    .nav-list div:hover{
      background: rgba(80,139,254,0.20);
    }
    
    .active-list{
      background: rgba(80,139,254,0.20);
    }

    /* .nav-list svg{
      width: 20px;
      height: 20px;
    } */
    .right-box{
      width: 100%;
      height: 100%;
      min-width: 800px;
      /* border: 1px solid #fff; */
    }




    
  </style>
  