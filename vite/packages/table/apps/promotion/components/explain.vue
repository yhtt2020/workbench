<template>
    <vueCustomScrollbar  :settings="scrollbarSettings"  style="height: 100%;">
      <div class="box-body" style="height: 100%;overflow: auto !important;">
        <div class="flex-box" v-for="(item,index) in dataList" :key="key">
          <div class="box-title">{{ item.title }}</div>
          <div class="box-content">{{ item.content }}</div>
        </div>
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
      settingsScroller: {  // 滚动条配置 
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
        dataList:[
          {
            title:"收益说明",
            content:"你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好",
          },
          {
            title:"下级代理说明",
            content:"你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好",
          },
          {
            title:"推广说明",
            content:"你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好",
          },
          {
            title:"推广说明",
            content:"你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好",
          },
          {
            title:"推广说明",
            content:"你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好",
          },
          {
            title:"推广说明",
            content:"你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好",
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
      /* display: flex; */
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0 20px;
      /* text-overflow: ; */
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

    .box-content{
      margin-top: 24px;
      padding: 16px;
      background: rgba(0,0,0,0.30);
      border-radius: 12px;
      min-width: 600px;
      display: flex;
      flex-wrap: wrap;
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 16px;
    }
    

    /* // 滚动条 */
    .ant-transfer-list-content::-webkit-scrollbar-track {
      background-color: #f1f1f1 !important;
    }

    :deep(.ant-transfer-list-content){
        flex: 1 1 0%;
        overflow: hidden;
        overflow-y: auto;
    }
    :deep(.ant-transfer-list-content::-webkit-scrollbar){
        width: 5px;
    }
    :deep(.ant-transfer-list-content::-webkit-scrollbar-thumb){
        background: #aaa;
        border-radius: 3px;
    }


  </style>
  