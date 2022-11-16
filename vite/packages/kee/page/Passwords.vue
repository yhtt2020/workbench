<template>
   <div class="password-header">
    <div class="password-select" @click="selectOptions">
      <a-row class="password-select-container">
        <a-col :span="12" class="col-left">
            <AppstoreFilled class="col-left-icon"/>
            <span class="password-all">所有密码</span>
        </a-col>
        <a-col  :span="12" class="col-right">
          <SwapOutlined  style="font-size:16px;cursor: pointer;"/>
        </a-col>
      </a-row>
    </div>
    <div class="password-search">
      <a-input v-model:value="search" placeholder="搜索">
        <template #prefix>
          <search-outlined @click="serachClikc" style="color: rgba(0, 0, 0, 0.45);font-size: 20px;cursor: pointer;"/>
        </template>
      </a-input>
    </div>
    <a-button type="primary" class="password-button">
      <template #icon>
        <PlusOutlined style="font-size:16px"/>
      </template>
      新建密码
    </a-button>
   </div>
   <a-layout style="height:calc(100vh - 45px)">
    <a-layout-sider theme="light" style="padding: 20px">
      <a-list item-layout="horizontal" :data-source="passwords">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta  :description="item.description" > 



              <template #title>
                <a href="https://www.antdv.com/">{{ item.title }}</a>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-layout-sider>
    <a-layout-body class="password-right-main">
      <router-view></router-view>
    </a-layout-body>
  </a-layout>
   <a-drawer :width="216" placement="left" :visible="visible" @close="onClose">
      <div class="filter-list-container">
          
      </div>
      <a-tree>
       <template #title="{ title, key }">
        <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
        <template v-else>{{ title }}</template>
        </template>
      </a-tree>
   </a-drawer> 
</template>

<script>
import vueCustomScrollbar from '../../../src/components/vue-scrollbar.vue'
import { 
  SettingOutlined, LaptopOutlined, 
  SmileOutlined,DownOutlined,SearchOutlined,
  PlusOutlined,SwapOutlined,AppstoreFilled 
} from '@ant-design/icons-vue'
import { appStore } from '../store'
import { mapState, mapActions } from 'pinia'
import { CodeTwoTone } from '@ant-design/icons-vue'
import '../assets/font/iconfont.css'
import { message, Modal } from 'ant-design-vue'
let { appModel, devAppModel } = window.$models
let appId = window.globalArgs['app-id']
export default {
  name: 'Passwords',
  components: {
    SettingOutlined, LaptopOutlined, 
    CodeTwoTone, vueCustomScrollbar, 
    SmileOutlined,DownOutlined,
    SearchOutlined, PlusOutlined,
    SwapOutlined,AppstoreFilled
  },
  computed: {
    ...mapState(appStore, [])
  },
  data () {
    return {
      activeNav:['base'],
      user:{
        user_info:{}
      },
      currentDevApp: [],
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false
      },
      checkNick: false,
      passwords:[
        {
          id:0,
          title:'禅道账号',
          description:'Francisio_Phillps',
          // iconURL:require('../assets/image/key_one.svg')
        },
        {
          id:1,
          title:'语雀帐号',
          description:'Isabelle_Fisher',
          // iconURL:require('@/assets/image/key_two.svg')
        },
        {
          id:2,
          title:'即时设计帐号',
          description:'Benjamin_Gonzalez',
          // iconURL:require('../assets/image/key_three.svg')
        },
        {
          id:3,
          title:'轻流帐号',
          description:'Maurice_Alvarado',
          // iconURL:require('../assets/image/key_one.svg')
        },
        {
          id:4,
          title:'元社区帐号',
          description:'Derek_Edwards',
          // iconURL:require('../assets/image/key_four.svg')
        }
      ],
      search:'',
      size:'large',
      visible:false,
    }
  },

  async mounted () {
    //  console.log(appId);
  },
  methods: {
    // 搜索触发做的事情
    serachClikc(){
      //  console.log(this.search);
    },
    // 开启抽屉式的选项
    selectOptions(){
         this.visible = true
    },
    // 关闭抽屉式的选项
    onClose(){
       this.visible = false
    },
    // 列表点击
    passwordListClick(v){
    
    }
  }
}
</script>
<style>
body, html {
  overflow: hidden;
  width: 100% !important
}
/*其他样式开始*/
.ant-layout-sider{
  max-width: 240px !important;
  padding: 20px;
  flex: 0 0 240px !important;
  min-width: 240px !important;
  width: 240px !important;
}
.ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left{
  border: none;
}
.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected{
  background: rgba(80, 139, 254, 0.1);
}
.ant-list-split .ant-list-item{
   border:none;
}
/*其他样式结束*/
</style>
<style lang="scss">
h3 {
  &:before {
    content: "";
    display: inline-block;
    background: #0051ff;
    width: 5px;
    border-radius: 3px;
    height: 16px;
    position: absolute;
    bottom: 8px;
    left: -8px;
  }
}
/*密码分享头部*/
.password-header{
   height: 54px;
   padding: 11px 8px;
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: space-between;
}
/*下拉选择开始*/
.password-select{
   width: 35%;
   border: 1px solid rgba(230, 230, 230, 1);
   border-radius: 4px;
   padding: 6px 8px 5px 8px;
   line-height: 19px;
   user-select: none;
   .password-select-container{
     display: flex;
     align-items: center;
   }
   .password-img img{
      width: 16px;
      height: 16px;
   }
   .password-all{
     color: rgba(0, 0, 0, 0.65);
     font-size: 14px;
     line-height: 21px;
     font-weight: 400;
     padding-left: 12px;
   }
   .col-right{
     display: flex;
     align-items: center;
     justify-content: flex-end;
   }
   .col-left-icon{
     cursor: pointer;
     font-size: 16px;
   }
   .col-left{
     width: 80px;
   }
}
/*下拉选择结束*/
/*搜索开始*/
.password-search{
   width: 35%;
}
/*搜索结束*/

/*新建密码开始*/
.password-button{
   width: 98px;
   line-height: 21px;
   background: rgba(80, 139, 254, 1);
   color: #FFFFFF;
   display: flex;
   align-items: center;
   padding: 6px 10px 5px 10px;
}
/*新建密码结束*/

/*清除边框开始*/
.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
  border-color: rgba(230, 230, 230, 1);
  border-right-width: 1px !important;
  z-index: 1;
}
.ant-input-affix-wrapper-focused, .ant-input-affix-wrapper:focus {
  z-index: 1;
}
.ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused {
  border-color: rgba(0, 0, 0, 0.25);
  box-shadow: 0 0 0 2px rgb(0 0 0 / 5%);
  border-right-width: 1px !important;
  outline: 0;
}
.ant-input-affix-wrapper:hover {
  border-color: rgba(0, 0, 0, 0.25);
  border-right-width: 1px !important;
}
.ant-drawer-header-close-only{
  display: none;
}
.ant-drawer-body{
   padding: 8px;
}
/*清除边框结束*/

/*左侧边栏滚动开始*/
.ant-layout-sider{
     overflow: scroll;
     &::-webkit-scrollbar{
       width: 0 !important;
     }
}
/*左侧边栏滚动结束*/

/*右侧盒子样式开始*/
.password-right-main{
   padding: 12px 16px 12px 17px;
   background: rgba(255, 255, 255, 1);
   width: 100%;
}
/*右侧盒子样式结束*/

/*筛选列表开始*/
.filter-list-container{
   
}
/*筛选列表结束*/

</style>
