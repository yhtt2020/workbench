<template>
  <div class="password-header">
    <div class="password-select"
      @click="selectOptions"
      @mouseover="passwordHover"
      @mouseleave="passwordRemove"
    >
      <a-row class="password-select-container">
        <a-col :span="12" class="col-left">
          <component :is="filterIcon"/>
          <span class="password-all">{{ filterText }}</span>
        </a-col>
        <a-col :span="12" class="col-right">
          <SwapOutlined style="font-size: 16px; cursor: pointer" />
        </a-col>
      </a-row>
    </div>
    <div class="password-search">
      <a-input v-model:value="search" placeholder="搜索">
        <template #prefix>
          <search-outlined
            @click="searchClick"
            style="color: rgba(0, 0, 0, 0.45); font-size: 20px; cursor: pointer"
          />
        </template>
      </a-input>
    </div>
    <div class="password-button">
      <PlusOutlined style="font-size: 16px; color:rgba(255, 255, 255, 1) !important;" />
      <span style=" color: rgba(255, 255, 255, 1); padding-left:8px;">新建密码</span>
    </div>
  </div>
  <a-divider style="height: 1px; background-color: rgba(230, 230, 230, 0.1);margin: 0  !important;" />
  <a-layout style="height: calc(100vh - 45px);">
    <a-layout-sider theme="light" style="padding: 20px;border-right: 1px solid rgba(230, 230, 230, 1);">
      <!-- 暂时没有数据先隐藏掉 -->
      <div class="current-container" v-if="filterId==1003">
        <div class="header-container">
          <div class="current-header">
            <span class="current-avatar">
              <img src="https://img.js.design/assets/img/62592c9e1be7d2a75a32e89b.png"/>
            </span>
            <div class="header-content" v-if="totalOpen == false">
              <span>语雀——想天浏览器官方文档</span>
              <span class="current-website">https://www.yuque.com/thisky/ylbh5g</span>
            </div>
            <div class="current-switch">
              <a-switch
                v-model:checked="totalOpen"
                checked-children="全站"
                un-checked-children="关"
              />
              <UpOutlined
                v-if="totalOpen == true"
                style="color: rgba(0, 0, 0, 0.45); padding-left: 4px;"
              />
              <DownOutlined
                v-if="totalOpen == false"
                style="color: rgba(0, 0, 0, 0.45); padding-left: 4px"
              />
            </div>
          </div>
          <div class="current-content" v-if="totalOpen == true">
            <span>语雀——想天浏览器官方文档</span>
            <span class="current-website">https://www.yuque.com/thisky/ylbh5g</span>
          </div>
        </div>
        <div class="current-list-container">
           <div class="current-item" :class="noWebIndex == item.id ? 'active-current-bgcolor':''" v-for="item in currentList" :key="item.id" @click="currentWebSiteClick(item)">
              <span class="current-item-img">
                <img :src="item.url" alt=""/>
              </span>
              <div class="current-item-right">
                <span class="title">{{item.title}}</span>
                <span class="description">{{item.description}}</span>
              </div>
           </div>
        </div>
      </div>
      <a-list item-layout="horizontal" :data-source="passwords" v-else>
        <template #renderItem="{ item,index }">
          <div @mouseover="passwordItemsHover(item)" @mouseleave="passwordItemRemove(item)">
            <a-list-item :class="currentIndex==index ? 'active-list':''" @click="leftDescription(item)">
            <!-- 判断鼠标悬浮时打开并填充按钮显示 -->
            <a-list-item-meta class="is-open-fill" v-if="item.showCopy == true" :description="item.description">
              <template #title>
                <a>{{ item.title }}</a>
              </template>
              <template #avatar>
                <a-avatar :src="item.url" />
              </template>
            </a-list-item-meta>
            <!-- 判断鼠标离开时打开并填充按钮隐藏 -->
            <a-list-item-meta class="no-open-fill" :description="item.description" v-else>
              <template #title>
                <a>{{ item.title }}</a>
              </template>
              <template #avatar>
                <a-avatar :src="item.url" />
              </template>
            </a-list-item-meta>
            <div class="open-fill" v-if="item.showCopy == true" @click="openFillClick">打开并填充</div>
            </a-list-item>
          </div>
        </template>
      </a-list>
    </a-layout-sider>
    <a-layout-content class="password-right-main">
      <!-- 当数据为加载完成时,初始化默认没有搭建时展示页面空状态，暂时先隐藏掉 -->
      <a-empty :image="simpleImage" style="display: none" />
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
  <a-drawer class="filter-list-container" :width="216" placement="left" :visible="sideDrawerVisible">
    <a-list item-layout="horizontal" :data-source="selectMenuList">
      <template #renderItem="{ item }">
        <a-list-item class="drawer-item-list" :class="selectDrawerIndex == item.id ? 'active-drawer':''">
          <component :is="item.icon" style="font-size:16px;padding-right: 12px;color: rgba(0, 0, 0, 0.5) !important;"/>
          <a-list-item-meta @click="selectListItem(item)">
            <template #title>
             <span style=" color: rgba(0, 0, 0, 0.65);">{{ item.text }}</span>
            </template>
          </a-list-item-meta>
          <!-- 下拉菜单列表 -->
          <a-dropdown :trigger="['click']">
            <component :is="item.iconSwap" @click="openMyPassword"/>
            <template #overlay>
              <a-menu class="my-password">
                <a-menu-item  class="my-password-dropdown" :class="myPasswordIndex == items.id ? 'active-drawer':''" v-for="items in item.children" :key="items.id" @click="myPasswordBankClick(items)">
                  <UnlockFilled style="font-size:16px;padding-right:12px;"/>
                  <a>{{items.title}}</a>
                  <CheckOutlined v-if="checkPasswordIndex==items.id" style="padding-left:70px;color: rgba(80, 139, 254, 1);"/>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-list-item>
        <a-divider v-if="item.divider==1" style="height: 1px; background-color: rgba(230, 230, 230, 1);margin: 8px 0 !important;" />
      </template>
      <a-list-item class="drawer-main-application-open" @click="openMainApplication">
        <span class="drawer-main-app-icon">
          <img src="../../../public/img/lock-app.svg" alt="">
        </span>
        <span class="drawer-open-main-text">主应用中打开</span>
      </a-list-item>
    </a-list>
  </a-drawer>
</template>

<script>
import {
  SettingOutlined, LaptopOutlined,
  SmileOutlined,SearchOutlined,
  PlusOutlined,SwapOutlined,
  AppstoreFilled, UnlockFilled,
  StarFilled, TagFilled,
  FolderOpenFilled, LinkOutlined,
  LockFilled,CodeTwoTone,
  UpOutlined,DownOutlined,
  CheckOutlined
} from "@ant-design/icons-vue";
import { appStore } from "../store";
import { mapActions, mapState } from "pinia";
import vueCustomScrollbar from "../../../src/components/vue-scrollbar.vue";
import { message, Modal, Empty } from "ant-design-vue";
let { appModel, devAppModel } = window.$models;
let appId = window.globalArgs["app-id"];
export default {
  name: "Passwords",
  components: {
    SettingOutlined, LaptopOutlined,
    CodeTwoTone, SearchOutlined,
    SmileOutlined,SwapOutlined,
    PlusOutlined,AppstoreFilled,
    UnlockFilled,StarFilled,
    TagFilled,FolderOpenFilled,
    LinkOutlined,LockFilled,
    Empty,UpOutlined,
    DownOutlined,CheckOutlined
  },
  computed: {
    ...mapState(appStore, ['passwordItem']),
  },
  data() {
    return {
      activeNav: ["base"],
      user: {
        user_info: {},
      },
      currentDevApp: [],
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false,
      },
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      // 列表默认下标
      currentIndex: 0,
      checkNick: false,
      passwords: [
        {
          id: 0,
          index: 0,
          title: "禅道账号",
          description: "Francisio_Phillps",
          path: "detail",
          password:'123456',
          url: "../../../public/img/key_black.svg",
          showCopy: false,
          site_1:'zt.xaingtian.ren',
          site_2:'zt.xaingtian.ren'
        },
        {
          id: 1,
          index: 1,
          title: "语雀帐号",
          description: "Isabelle_Fisher",
          path: "detail",
          password:'123456',
          url: "../../../public/img/key_crimson.svg",
          showCopy: false,
          site_1:'zt.xaingtian.ren',
          site_2:'zt.xaingtian.ren'
        },
        {
          id: 2,
          index: 2,
          title: "即时设计帐号",
          description: "Benjamin_Gonzalez",
          path: "detail",
          password:'123456',
          url: "../../../public/img/key_blue.svg",
          showCopy: false,
          site_1:'zt.xaingtian.ren',
          site_2:'zt.xaingtian.ren'
        },
        {
          id: 3,
          index: 3,
          title: "轻流帐号",
          description: "Maurice_Alvarado",
          path: "detail",
          password:'123456',
          url: "../../../public/img/key_black.svg",
          showCopy: false,
          site_1:'zt.xaingtian.ren',
          site_2:'zt.xaingtian.ren'
        },
        {
          id: 4,
          index: 4,
          title: "元社区帐号",
          description: "Derek_Edwards",
          path: "detail",
          password:'123456',
          url: "../../../public/img/key_orange.svg",
          showCopy: false,
          site_1:'zt.xaingtian.ren',
          site_2:'zt.xaingtian.ren'
        },
      ],
      search: "",
      size: "large",
      sideDrawerVisible: false,
      filterText: "所有密码",
      filterIcon:'AppstoreFilled',
      filterId:0,
      // 筛选菜单列表下标
      selectDrawerIndex:1,
      totalOpen: true,
      contextItems: "",
      // 当前网站
      noWebIndex:'',
      currentList: [
        {
          id:1,
          title: "拉娅枫的语雀帐号",
          description: "Francisio_Phillps",
          url: "../../../public/img/key_black.svg",
          password:'123456',
          site_1:'zt.xaingtian.ren',
          showCopy: false,
          site_2:'www.yuque.com'
          
        },
        {
          id:2,
          title: "过英的语雀帐号",
          description: "Isabelle_Fisher",
          url: "../../../public/img/key_crimson.svg",
          password:'123456',
          showCopy: false,
          site_1:'zt.xaingtian.ren',
          site_2:'www.yuque.com'
        },
        {
          id:3,
          title: "汝贵的语雀帐号",
          description: "Benjamin_Gonzalez",
          url: "../../../public/img/key_blue.svg",
          password:'123456',
          showCopy: false,
          site_1:'zt.xaingtian.ren',
          site_2:'www.yuque.com'
        },
      ],
      state:appStore(),
      // 定义筛选菜单列表数据
      selectMenuList:[
           {
             id:1001,
             icon:'UnlockFilled',
             text:'我的密码',
             iconSwap:'SwapOutlined',
             divider:1,
             children:[
              {
                id:1001_1,
                title:'我的密码',
              },
              {
                id:1001_2,
                title:'A密码库',
              },
              {
                id:1001_3,
                title:'B密码库',
              },
              {
                id:1001_4,
                title:'C密码库',
              }
             ]
           },
           {
             id:1002,
             icon:'AppstoreFilled',
             text:'所有密码'
           },
           {
             id:1003,
             text:'当前网站',
             icon:'LinkOutlined',
             divider:1,
           },
           {
             id:1004,
             text:'颜色',
             icon:'StarFilled',
             divider:1,
           },
           {
             id:1005,
             text:'Computer',
             icon:'TagFilled'
           },
           {
             id:1006,
             text:'Email',
             icon:'TagFilled',
             divider:1,
           },
      ],
      // 筛选菜单下拉框
      dropdownVisible:false,
      // 判断主应用打开入口
      openMainEnter:true,
      // 我的密码库筛选下标
      myPasswordIndex:0,
      checkPasswordIndex:0
    }
  },
  async mounted() {},
  methods: {
    // 搜索触发做的事情
    searchClick() {},
    // 开启抽屉式的选项
    selectOptions() {
      this.sideDrawerVisible = true;
    },
    // 左侧列表点击
    leftDescription(v) {
      this.currentIndex = v.id;
      this.$router.push("/" + v.path);
      this.state.$patch({
         passwordItem:v
      })
    },
    // 筛选下拉菜单
    openPasswordSelect(e) {},
    // 筛选列表点击
    getDrawerItem() {
      console.log(11);
    },
    // 当前网站点击
    currentWebSiteClick(v){
      this.noWebIndex = v.id
      this.state.$patch({
         passwordItem:v
      })
    },
    // 鼠标移入
    passwordHover() {
      document.querySelector(".password-select").style =
        "background:rgba(80, 139, 254, 0.1);";
    },
    passwordItemsHover(v) {
      v.showCopy = true;
    },
    // 鼠标移出
    passwordRemove() {
      document.querySelector(".password-select").style =
        "background:rgba(255, 255, 255, 1);";
    },
    passwordItemRemove(v) {
      v.showCopy = false;
    },
    // 打开填充按钮
    openFillClick() {
      console.log("打开填充");
    },
    // 筛选菜单中子项选中
    selectListItem(v){
      this.filterText = v.text
      this.selectDrawerIndex = v.id
      this.filterIcon = v.icon
      this.filterId = v.id
      this.sideDrawerVisible = false
      document.querySelector('.drawer-main-application-open').classList.remove('active-drawer')
    },
    // 我的密码下拉
    openMyPassword(){
       this.dropdownVisible = true
    },
    // 主应用打开跳转到对应的路由地址
    openMainApplication(){
      document.querySelector('.drawer-main-application-open').classList.add('active-drawer')
      this.selectDrawerIndex = ''
      this.sideDrawerVisible = false
    },
    myPasswordBankClick(v){
      this.selectMenuList[0].text = v.title
      this.myPasswordIndex = v.id
      this.checkPasswordIndex = v.id
    }
  },
};
</script>
<style>
body,
html {
  overflow: hidden;
  width: 100% !important;
}
/*其他样式开始*/
.ant-layout-sider {
  max-width: 240px !important;
  padding: 9px 8px !important;
  flex: 0 0 240px !important;
  min-width: 240px !important;
  width: 240px !important;
}
.ant-menu-inline,
.ant-menu-vertical,
.ant-menu-vertical-left {
  border: none;
}
.ant-list-split .ant-list-item {
  border: none;
}
.ant-form-item {
  margin: 0 !important;
}
.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background: rgba(80, 139, 254, 0.2) !important;
  background-color: rgba(80, 139, 254, 0.2) !important;
  color: rgba(0, 0, 0, 0.65) !important;
  border-radius: 6px;
}
.ant-menu-light .ant-menu-item:hover,
.ant-menu-light .ant-menu-item-active,
.ant-menu-light .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
.ant-menu-light .ant-menu-submenu-active,
.ant-menu-light .ant-menu-submenu-title:hover {
  color: rgba(0, 0, 0, 0.65) !important;
}
.ant-menu-item:active,
.ant-menu-submenu-title:active {
  background: rgba(80, 139, 254, 0.2) !important;
  background-color: rgba(80, 139, 254, 0.2) !important;
  color: rgba(0, 0, 0, 0.65) !important;
  border-radius: 6px;
}
.ant-menu-item::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  border-right: none !important;
  transform: scaleY(0.0001);
  opacity: 0;
  transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
    opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
  content: "";
}
.password-computer {
  padding-left: 30px !important;
}
.ant-drawer-body {
  overflow: scroll !important;
}
.ant-drawer-body::-webkit-scrollbar {
  width: 0 !important;
}
.main-open-item {
  padding-left: 20px !important;
}
.ant-empty-description {
  display: none !important;
}
.ant-list-item-meta-avatar {
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
.password-header {
  height: 54px;
  padding: 11px 16px 11px 8px;
  width: 100%;
  display: flex;
  align-items: center;
}
/*下拉选择开始*/
.password-select {
  width: 40.7%;
  border: 1px solid rgba(230, 230, 230, 1);
  border-radius: 4px;
  padding: 6px 8px 5px 8px;
  line-height: 19px;
  user-select: none;
  margin-right: 16px;
  cursor: pointer;
  .password-select-container {
    display: flex;
    align-items: center;
  }
  .password-img img {
    width: 16px;
    height: 16px;
  }
  .password-all {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    line-height: 21px;
    font-weight: 400;
    padding-left: 12px;
  }
  .col-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .col-left-icon {
    cursor: pointer;
    font-size: 16px;
  }
  .col-left {
    width: 80px;
  }
}
/*下拉选择结束*/
/*搜索开始*/
.password-search {
  width: 44.37%;
  margin-right: 16px;
}
/*搜索结束*/

/*新建密码开始*/
.password-button{
   width:18.765%;
   line-height: 32px;
   display: flex;
   justify-content: center;
   align-items: center;
   background: rgba(80, 139, 254, 1);
   border-radius: 4px;
   user-select: none;
   cursor: pointer;
}
/*新建密码结束*/

/*清除边框开始*/
.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
  border-color: rgba(230, 230, 230, 1);
  border-right-width: 1px !important;
  z-index: 1;
}
.ant-input-affix-wrapper:focus,
.ant-input-affix-wrapper-focused {
  border-color: rgba(230, 230, 230, 1);
  box-shadow: none !important;
  border-right-width: 1px !important;
  outline: 0;
}
.ant-input-affix-wrapper:hover {
  border-color: none;
  border-right-width: 1px !important;
}
.ant-input:focus,
.ant-input-focused {
  box-shadow: none !important;
}
.ant-drawer-header-close-only {
  display: none;
}
.ant-drawer-body {
  padding: 8px;
}
/*清除边框结束*/

/*左侧边栏滚动开始*/
.ant-layout-sider {
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
}
.noweb-background {
  background: rgba(80, 139, 254, 0.1);
  border-radius: 6px;
}
.ant-list-item{
   line-height:35px !important;
   position: relative;
   padding:8px 12px  !important;
   &:hover{
    background: rgba(0, 0, 0, 0.04);
   }
}
.open-fill{
  width: 98px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  cursor: pointer;
  user-select: none;
  top: 0;
  right: 0;
  line-height: 53px;
  color: rgba(80, 139, 254, 1);
  background: rgba(80, 139, 254, 0.2);
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
.ant-avatar {
   width: 16px;
   height: 16px;
}
.is-open-fill .ant-list-item-meta-title{
   line-height: 21px !important;
   max-width: 68px !important;
   text-overflow: ellipsis !important;
   white-space: nowrap !important;
   overflow: hidden;
   margin: 0 0 1px 0;
}
.is-open-fill .ant-list-item-meta-description{
   line-height: 15px !important;
   max-width: 68px !important;
   text-overflow: ellipsis !important;
   white-space: nowrap !important;
   overflow: hidden;
}
.no-open-fill .ant-list-item-meta-title{
   line-height: 21px !important;
   margin: 0 0 1px 0;
}
.no-open-fill .ant-list-item-meta-description{
  line-height: 15px !important;
}
/*左侧边栏滚动结束*/

/*右侧盒子样式开始*/
.password-right-main {
  padding: 12px 16px 12px 17px;
  background: rgba(255, 255, 255, 1);
  width: 100%;
}
/*右侧盒子样式结束*/

/*当前网站密码开始*/
.current-container{
  .header-container{
     background: rgba(0, 0, 0, 0.04);
     padding: 7.25px 12px;
     border-radius: 6px;
     margin-bottom: 8px;
    .current-header{
      display: flex;
      align-items: center;
      justify-content: space-between;
     .current-avatar img{
       width: 16px;
       height: 16px;
      }
      .header-content{
       max-width: 102px;
       overflow: hidden;
       white-space: nowrap;
       text-overflow: ellipsis;
      }
    }
    .current-content{
      max-width: 194px;
      padding-top: 8px;
      display: flex;
      flex-wrap: wrap;
       .current-website{
        word-break: break-all;
       }
    }
    .current-switch{
       display: flex;
       align-items: center;
       justify-content: center;
    }
  }
  .current-list-container{
     .current-item{
       padding: 8.5px 12px;
       display: flex;
       cursor: pointer;
       .current-item-img{
        line-height: 21px;
        padding-right: 12px;
        img{
          width: 16px;
          height: 16px;
        }
       }
       
       .current-item-right{
         display: flex;
         width: 100%;
         flex-direction: column;
         .title{
           line-height: 21px;
         }
         .description{
           line-height: 15px;
         }
       }
     }
  }
}
.left-item-list{
   cursor: pointer;
  .now-website-img{
    width: 16px;
    height: 16px;
  }
  &:hover{
    background: none;
  }
}
.active-current-bgcolor{
   background: rgba(80, 139, 254, 0.2);
   border-radius: 6px;
}

/*当前网站密码结束*/

/*筛选列表开始*/
.drawer-item-list{
   line-height: 32px !important;
   padding: 5px  8px !important;
   cursor: pointer;
   .ant-list-item-meta-title{
      margin: 0 !important;
   }
   &:hover{
     background: none ;
   }
}
.active-drawer{
  background: rgba(80, 139, 254, 0.25) !important;
  border-radius: 6px;
}
.ant-dropdown-menu-item{
   width: 192px !important;
}
.my-password{
  min-width: 14px !important;
  left: -178px !important;
  top: 1px !important;
}
.drawer-main-application-open{
  padding: 5px 8px !important;
  line-height: 22px !important;
  display: flex !important;
  cursor: pointer;
  user-select: none;
  justify-content: flex-start !important;
  align-items: center !important;
  &:hover{
     background: none;
  }
  .drawer-main-app-icon{
     display: flex;
     align-items: center;
     img{
       width: 16px;
       height: 16px;
     }
  }
  .drawer-open-main-text{
     padding-left: 12px;
     font-size: 14px;
     color: rgba(0, 0, 0, 0.65);
     font-weight: 400;
  }
}
.my-password-dropdown:hover{
   background: none;
}
/*筛选列表结束*/
</style>