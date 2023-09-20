<template>
    <vueCustomScrollbar :settings="scrollbarSettings" style="height: 100%,">
        <div class="page-container rounded-xl box-body" style="height: 100%;">
            <div class="flex-box">
                <div class="box-title">{{ this.inviteList.title }}</div>
                <div class="box-list" v-for="item in inviteList.data" :key="item.key">
                  <div class="list-title">
                    {{ item.title }}&nbsp;
                    <a-tooltip placement="top" v-if="item.tooltip !== ''">
                      <template #title>
                        <span>{{ item.tooltip }}</span>
                      </template>
                      <QuestionCircleOutlined />
                    </a-tooltip></div>
                    <div class="list-num">{{ item.num }}</div>
                </div>
            </div>
            <div class="flex-box">
                <div class="box-title">{{ this.incomeList.title }}</div>
                <div class="box-list" v-for="item in incomeList.data" :key="item.key">
                  <div class="list-title">{{ item.title }}</div> 
                  <div class="list-num">{{ item.num }}</div>
                  <!-- <a-statistic" :title="item.title" :value="item.num" style="margin-right: 50px" /> -->
    
                </div>
            </div>
        </div>

  
    </vueCustomScrollbar>
  

  </template>
  
  
  <script>

  import { 
    QuestionCircleOutlined, 
  } from '@ant-design/icons-vue';


  export default {
    name: 'Promotion',
    components: { 
      QuestionCircleOutlined
    },
    computed: {

    },
    data(){
      return {
        inviteList:{
          title:"邀请数据",
          data:[
            {
              title:"邀请总数",
              num:1293,
              tooltip:"",
              key:1,
            },
            {
              title:"激活总数",
              num:600,
              tooltip:"600",
              key:2,
            },
            {
              title:"待激活总数",
              num:693,
              tooltip:"693",
              key:3,
            },
          ]
        },
        incomeList:{
          title:"收益数据",
          data:[
            {
              title:"总收益",
              num:222299.5,
              key:1,
            },
            {
              title:"当日收益",
              num:12.5,
              key:1,
            },
            {
              title:"昨日收益",
              num:23.5,
              key:1,
            },
            {
              title:"下级代理当月总收益",
              num:29.0,
              key:1,
            },
            {
              title:"下级代理当日收益",
              num:13.0,
              key:1,
            },
            {
              title:"下级代理昨日收益",
              num:0.0,
              key:1,
            },
          ]
        }

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

    .flex-box .box-list{
      width: 30%;
      min-width: 240px;
      height: 112px;
      background: rgba(0,0,0,0.30);
      border-radius: 4px;
      padding: 16px 20px;
    }

    .box-title{
      height: 22px;
      line-height: 22px;
      width: 100%;
      font-size: 16px;
      padding-left: 16px;
    }
    
    .flex-box>div{
      margin-top: 24px;
      border-left: 4px solid;
      border-color: var(--active-bg);
    }



  </style>
  