<template>
    <vueCustomScrollbar  :settings="scrollbarSettings"  style="height: 100%;">
      <div class="box-body" style="height: 100%;overflow: auto !important;">
        <Article :artName="artName" :artNames="artNames" :titleStyle="titleStyle" :contentStyle="contentStyle"></Article>
      </div>
    </vueCustomScrollbar>
  </template>
  <script>
  import Article from '../../../components/Article.vue'
  export default {
    name: 'Promotion',
    components: { 
      Article,
    },
    computed: {

    },
    data(){
      return {
        artNames:[
            "promotion_summary",
            "promotion_affilicate",
            "promotion_reward"
        ],
        // 这里存放样式名 需要去文章组件定义样式
        titleStyle:'box-title',
        contentStyle:'box-content',
        // 滚动条配置 
        settingsScroller: {  
          useBothWheelAxes: true,
          swipeEasing: true,
          suppressScrollY: false,
          suppressScrollX: true,
          wheelPropagation: true
        },
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

  </style>
  