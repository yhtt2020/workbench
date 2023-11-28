<template>
    <vueCustomScrollbar  :settings="settingsScroller"  style="height: 100%;width: 100%;">
        <div v-for="(item,index) in article" :key="index">
            <h2 v-if="showTitle" :class="titleStyle" v-html="item.title"></h2>
            <div :class="contentStyle" v-html="item.content"></div>
        </div>
    </vueCustomScrollbar>
  </template>
  <script>
import articleService from '../js/service/articleService'

  export default {
    name: 'Article',
    props:{
        showTitle:{
          type:Boolean,
          default:true
        },
        artName:{
            type: String,
            // default:''
        },
        artNames:{
            type:Array,
            // default:() => []
        },
        // 自定义样式
        titleStyle:{
            type:String,
        },
        contentStyle:{
            type:String,
        },

    },
    components: {
        // VueCustomScrollbar
    },
    computed: {

    },
    data(){
      return {
        settingsScroller: {
            useBothWheelAxes: true,
            swipeEasing: true,
            suppressScrollY: false,
            suppressScrollX: true,
            wheelPropagation: true
        },
        article:[]
      }
    },
    mounted(){
        this.onMounted()
    },
    watch:{

    },
    methods:{
        async onMounted(){
            if(this.artName){
                const rs = await articleService.getOne(this.artName)
                this.article.push(rs)
            }else if (this.artNames) {
                let rs = await articleService.getMany(this.artNames)
                rs.forEach(e => {
                    this.article.push(e)
                });
            }
        }
    },
  }
  </script>

  <style scoped>
    .box-title{
      height: 22px;
      line-height: 22px;
      width: 100%;
      font-size: 16px;
      padding-left: 16px;
      border-left: 4px solid;
      border-color: var(--active-bg);
      margin-top: 24px;
      margin-left: 16px;
    }

    .box-content{
        margin: 24px 16px;
        padding: 16px 16px 0 16px;
        background: rgba(0,0,0,0.30);
        border-radius: 12px;
        min-width: 600px;
        display: flex;
        flex-wrap: wrap;
        white-space: pre-wrap;
        word-break: break-all;
        font-size: 16px;
    }

  </style>
