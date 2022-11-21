<template>
  <div class="password-header">
   <div class="password-select" @click="selectOptions">
     <a-row class="password-select-container">
       <a-col :span="12" class="col-left">
           <AppstoreFilled class="col-left-icon"/>
           <span class="password-all">{{filterText}}</span>
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
     <a-list item-layout="horizontal" :data-source="passwords" style="display:none;">
       <template #renderItem="{ item }">
         <a-list-item class="left-item-list" :class="currentIndex==item.id ? 'active-list':''" @click="leftDescription(item)">
           <a-list-item-meta :description="item.description">
             <template #avatar>
                <img :src="item.url" alt="">
             </template>
             <template #title>
              {{ item.title }}
              <a href="https://www.antdv.com/"></a>
             </template>
           </a-list-item-meta>
         </a-list-item>
       </template>
     </a-list>
     <div class="current-container" >
      <div class="current-header">
          <span class="current-avatar">
             <img src="https://img.js.design/assets/img/62592c9e1be7d2a75a32e89b.png" alt="">
          </span>
          <div class="current-switch">
            <a-switch v-model:checked="totalOpen" checked-children="全站" un-checked-children="关" />
            <UpOutlined v-if="totalOpen==true" style="color:rgba(0, 0, 0, 0.45);padding-left:4px;"/>
            <DownOutlined v-if="totalOpen==false" style="color:rgba(0, 0, 0, 0.45);padding-left:4px;"/>
          </div>
      </div>
      <div class="current-content" v-if="totalOpen==true">
         <span>语雀——想天浏览器官方文档</span>
          <span class="current-website">https://www.yuque.com/thisky/ylbh5g</span>
      </div>
      <a-list :data-source="currentList">
        <template #renderItem="{ item }">
          <a-list-item class="left-item-list" :class="currentIndex==item.id ? 'active-list':''" @click="currentDescription(item)">
            <a-list-item-meta :description="item.description">
              <template #avatar>
                 <img :src="item.url" alt="">
              </template>
              <template #title>
               {{ item.title }}
               <a href="https://www.antdv.com/"></a>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
     </div>
   </a-layout-sider>
   <a-layout-content class="password-right-main">
    <a-empty :image="simpleImage" style="display:none"/>
    <router-view></router-view>
   </a-layout-content>
 </a-layout>
 <a-drawer class="filter-list-container" :width="216" placement="left" :visible="visible" @close="visible = false">
  <a-menu mode="inline" :data-source="filterPassword">
      <a-menu-item key="my-password" class="menu-password" @click="getDrawerItem($event)">
        <template #icon>
         <UnlockFilled style="font-size:16px;"/>
        </template>
        <span>我的密码</span>
        <SwapOutlined  style="font-size:16px;cursor: pointer;"  @click="openPasswordSelect($event)"/>
      </a-menu-item>
      <a-divider style="height: 1px; background-color:rgba(230, 230, 230, 1)" />
      <a-menu-item key="all-password" @click="getDrawerItem($event)">
        <template #icon>
         <AppstoreFilled style="font-size:16px;"/>
        </template>
        <span>所有密码</span>
      </a-menu-item>
      <a-menu-item key="current-website" >
        <template #icon>
         <LinkOutlined style="font-size:16px;"/>
        </template>
        <span>当前网站</span>
      </a-menu-item>
      <a-divider style="height: 1px; background-color: rgba(230, 230, 230, 1)" />
      <a-menu-item key="password-color">
        <template #icon>
         <StarFilled  style="font-size:16px;"/>
        </template>
        <span>颜色</span>
      </a-menu-item>
      <a-menu-item key="computer">
        <template #icon>
         <TagFilled style="font-size:16px;"/>
        </template>
        <span>Computer</span>
      </a-menu-item>
      <a-divider style="height: 1px; background-color:rgba(230, 230, 230, 1)" />
      <a-menu-item key="email">
        <template #icon>
         <TagFilled style="font-size:16px;"/>
        </template>
        <span>Email</span>
      </a-menu-item>
      <a-divider style="height: 1px; background-color: rgba(230, 230, 230, 1)" />
      <a-sub-menu key="password-demo" style="margin-bottom: 8px;">
        <template #icon>
         <FolderOpenFilled style="font-size:16px;"/>
        </template>
        <template #title>Demo</template>
        <a-menu-item key="password-computer" class="password-computer">
         <template #icon>
           <FolderOpenFilled style="font-size:16px;"/>
         </template>
         <span>Computer</span>
        </a-menu-item>
        <a-menu-item key="password-internet" class="password-computer">
         <template #icon>
           <FolderOpenFilled style="font-size:16px;"/>
         </template>
         <span>Internet</span>
        </a-menu-item>
      </a-sub-menu>
      <a-divider style="height: 1px; background-color: rgba(230, 230, 230, 1)" />
      <a-menu-item key="mian-apply" class="main-open-item">
        <span class="main-open">
          <LockFilled style="font-size:16px;"/>
        </span>
        <span>主应用中打开</span>
      </a-menu-item>
  </a-menu>
</a-drawer>  
</template>

<script>

import { 
 SettingOutlined, LaptopOutlined, 
 SmileOutlined,SearchOutlined,
 PlusOutlined,SwapOutlined,AppstoreFilled,
 UnlockFilled,StarFilled,TagFilled,
 FolderOpenFilled,LinkOutlined,
 LockFilled,CodeTwoTone,
 UpOutlined,DownOutlined
} from '@ant-design/icons-vue'
import { appStore } from '../store'
import { mapState } from 'pinia'
import { Empty } from 'ant-design-vue';
// import vueCustomScrollbar from '../../../src/components/vue-scrollbar.vue'
// vueCustomScrollbar,
// import { message, Modal } from 'ant-design-vue', mapActions
// let { appModel, devAppModel } = window.$models
// let appId = window.globalArgs['app-id']
export default {
 name: 'Passwords',
 components: {
   SettingOutlined, LaptopOutlined, 
   CodeTwoTone,SearchOutlined, 
   SmileOutlined,SwapOutlined,
   PlusOutlined,AppstoreFilled,
   UnlockFilled,StarFilled,
   TagFilled,FolderOpenFilled,
   LinkOutlined,LockFilled,
   Empty,UpOutlined,DownOutlined
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
     simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
     currentIndex:0,
     checkNick: false,
     passwords:[
       {
         id:0,
         title:'禅道账号',
         description:'Francisio_Phillps',
         path:'detail',
         url:'http://localhost:1600/packages/kee/assets/image/key_black.svg'
       },
       {
         id:1,
         title:'语雀帐号',
         description:'Isabelle_Fisher',
         path:'detail',
         url:'http://localhost:1600/packages/kee/assets/image/key_crimson.svg'
       },
       {
         id:2,
         title:'即时设计帐号',
         description:'Benjamin_Gonzalez',
         path:'detail',
         url:'http://localhost:1600/packages/kee/assets/image/key_blue.svg'
       },
       {
         id:3,
         title:'轻流帐号',
         description:'Maurice_Alvarado',
         path:'detail',
         url:'http://localhost:1600/packages/kee/assets/image/key_black.svg'
       },
       {
         id:4,
         title:'元社区帐号',
         description:'Derek_Edwards',
         path:'detail',
         url:'http://localhost:1600/packages/kee/assets/image/key_orange.svg'
       }
     ],
     filterPassword:[
         {
          id:0,
          title: '我的密码',
          icon:'UnlockFilled',
          swipeIcon:'SwapOutlined',
          divider:2
         },
         {
          id:1,
          title: '所有密码',
          icon:'AppstoreFilled',
         },
         {
          id:2,
          title: '当前网站',
          divider:2,
          icon:'LinkOutlined'
         },
         {
          id:3,
          title:'颜色',
          icon:'StarFilled'
         },
         {
          id:4,
          title:'Computer',
          icon:'TagFilled'
         },
         {
          id:5,
          title:'Email',
          icon:'TagFilled',
          divider:2
         },
         {
          id:6,
          title:'Demo',
          divider:2,
          icon:'FolderOpenFilled',
          children:[
             {
              id:6_1,
              title:'Computer'
             },
             {
              id:6_2,
              title:'Internet'
             }
          ]
         },
         {
          id:7,
          title:'主应用中打开',
         }
     ],
     search:'',
     size:'large',
     visible:false,
     filterText:'当前网站',
     totalOpen:true,
     // 当前网站
     currentList:[
        {
           id:1,
           title:'拉娅枫的语雀帐号',
           description:'Francisio_Phillps',
           url:'http://localhost:1600/packages/kee/assets/image/key_black.svg',
        },
        {
           id:2,
           title:'过英的语雀帐号',
           description:'Isabelle_Fisher',
           url:'http://localhost:1600/packages/kee/assets/image/key_crimson.svg'
        },
        {
           id:3,
           title:'汝贵的语雀帐号',
           description:'Benjamin_Gonzalez',
           url:'http://localhost:1600/packages/kee/assets/image/key_blue.svg'
        }
     ]
    //  filterIndex:0
   }
 },

 async mounted () {

 },
 methods: {
   // 搜索触发做的事情
   serachClikc(){
    
   },
   // 开启抽屉式的选项
   selectOptions(){
     this.visible = true
   },
   // 列表点击
   leftDescription(v){
     this.currentIndex = v.id
     this.$router.push('/'+v.path)
   },
   // 筛选下拉菜单
   openPasswordSelect(e){
     
   },
   getDrawerItem(v){
      console.log(v);
   },
   // 当前网站点击
   currentDescription(v){
    this.currentIndex = v.id
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
 padding: 0 8px !important;
 flex: 0 0 240px !important;
 min-width: 240px !important;
 width: 240px !important;
}
.ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left{
 border: none;
}
.ant-list-split .ant-list-item{
  border:none;
}
.ant-form-item{
  margin: 0 !important;
}
.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected{
  background: rgba(80, 139, 254, 0.2) !important;
  background-color:rgba(80, 139, 254, 0.2) !important;
  color: rgba(0, 0, 0, 0.65) !important;
  border-radius: 6px;
}
.ant-menu-light .ant-menu-item:hover, .ant-menu-light .ant-menu-item-active, .ant-menu-light .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open, .ant-menu-light .ant-menu-submenu-active, .ant-menu-light .ant-menu-submenu-title:hover{
 color: rgba(0, 0, 0, 0.65) !important;
}
.ant-menu-item:active, .ant-menu-submenu-title:active{
 background: rgba(80, 139, 254, 0.2) !important;
 background-color:rgba(80, 139, 254, 0.2) !important;
 color: rgba(0, 0, 0, 0.65)  !important;
 border-radius: 6px;
}
.ant-menu-item::after{
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 border-right: none !important;
 transform: scaleY(0.0001);
 opacity: 0;
 transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
 content: '';
}
.password-computer{
  padding-left: 30px !important;
}
.ant-drawer-body{
 overflow:scroll !important; 
}
.ant-drawer-body::-webkit-scrollbar{
  width: 0 !important;
}
.main-open-item{
 padding-left: 20px !important;
}
.ant-empty-description{
  display: none !important;
}
.ant-list-item-meta-avatar{ 
 margin-right: 8px;
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
  cursor: pointer;
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
.ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused {
 border-color: rgba(230, 230, 230, 1);
 box-shadow: none !important;
 border-right-width: 1px !important;
 outline: 0;
}
.ant-input-affix-wrapper:hover {
 border-color: none;
 border-right-width: 1px !important;
}
.ant-input:focus, .ant-input-focused{
  box-shadow: none !important;
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
.active-list{
 background: rgba(80, 139, 254, 0.1);
 border-radius: 6px;
}
.left-item-list{
   padding: 8px 12px;
   img{
      width: 16px;
      height: 16px;
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
.filter-list-item{
   padding: 0 8px 0 8px !important;
}
.ant-list-item-meta-title{
   margin: 0 !important;
   line-height: 32px !important;
}
.ant-divider-horizontal{
   margin: 8px 0 !important;
}
.filter-active{
  background: rgba(80, 139, 254, 0.2);
  border-radius: 6px;
}
.ant-menu-submenu-arrow{
  display: none;
}
/*筛选列表结束*/

/*当前网站密码开始*/
.current-header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  .current-avatar{
    padding-left:12px;
    img{
      width: 16px;
      height: 16px;
    }
  }
  .current-switch{
    display: flex;
    align-items: center; 
  }
}
.current-content{
   max-width:100%;
   padding: 0 12px 0 12px;
   margin: 0 auto;
   span{
     font-size: 14px;
     font-weight: 400;
   }
   .current-website{
    word-break:normal; 
    width:auto; 
    display:block; 
    white-space:pre-wrap;
    word-wrap : break-word ;
    overflow: hidden ;
   }
}
/*当前网站密码结束*/

</style>
