<template>
    <vueCustomScrollbar :settings="scrollbarSettings" style="height: 100%">
      <div class="flex-box" v-for="(item,index) in dataList" :key="key">
        <div class="box-title">{{ item.title }}</div>
        <div class="box-content">{{ item.content }}</div>

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
        dataList:[
          {
            title:"收益说明",
            content:"1.hihasidhaushiosahishpsjpsajp1.hihasidhaushiosahishpsjpsajp1.hihasidhaushiosahishpsjpsajp1.hihasidhaushiosahishpsjpsajp1.hihasidhaushiosahishpsjpsajp1.hihasidhaushiosahishpsjpsajp1.hihasidhaushiosahishpsjpsajp1.hihasidhaushiosahishpsjpsajp1.hihasidhaushiosahishpsjpsajp",
          },
          {
            title:"下级代理说明",
            content:"1.hihasidhaushiosahishpsjpsajp",
          },
          {
            title:"推广说明",
            content:"1.hihasidhaushiosahishpsjpsajp",
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
      /* width: 100%; */
      min-width: 600px;
      display: flex;
      flex-wrap: wrap;
    }

  </style>
  