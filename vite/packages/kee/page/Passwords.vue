<template>
  <div class="password-header">
    <div class="password-select"
      @click="selectOptions"
      @mouseover="passwordHover"
      @mouseleave="passwordRemove"
    >
      <a-row class="password-select-container">
        <a-col :span="12" class="col-left">
          <AppstoreFilled class="col-left-icon" />
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
            @click="serachClikc"
            style="color: rgba(0, 0, 0, 0.45); font-size: 20px; cursor: pointer"
          />
        </template>
      </a-input>
    </div>
    <div class="passsword-button">
      <PlusOutlined style="font-size: 16px; color:rgba(255, 255, 255, 1) !important;" />
      <span style=" color: rgba(255, 255, 255, 1); padding-left:8px;">新建密码</span>
    </div>
  </div>
  <a-divider style="height: 1px; background-color: rgba(230, 230, 230, 0.1);margin: 0  !important;" />
  <a-layout style="height: calc(100vh - 45px);">
    <a-layout-sider theme="light" style="padding: 20px;border-right: 1px solid rgba(230, 230, 230, 1);">
      <a-list item-layout="horizontal" :data-source="passwords">
        <template #renderItem="{ item }">
          <a-list-item :class="currentIndex==item.id ? 'active-list':''"
          @click="leftDescription(item)" @mouseover="passwordItemsHover(item)" @mouseleave="passwordItemRemove(item)">
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
        </template>
      </a-list>
      <!-- 暂时没有数据先隐藏掉 -->
      <div class="current-container" style="display: none">
        <div class="current-header">
          <span class="current-avatar">
            <img
              src="https://img.js.design/assets/img/62592c9e1be7d2a75a32e89b.png"
              alt=""
            />
          </span>
          <div class="current-switch">
            <a-switch
              v-model:checked="totalOpen"
              checked-children="全站"
              un-checked-children="关"
            />
            <UpOutlined
              v-if="totalOpen == true"
              style="color: rgba(0, 0, 0, 0.45); padding-left: 4px"
            />
            <DownOutlined
              v-if="totalOpen == false"
              style="color: rgba(0, 0, 0, 0.45); padding-left: 4px"
            />
          </div>
        </div>
        <div class="current-content" v-if="totalOpen == true">
          <span>语雀——想天浏览器官方文档</span>
          <span class="current-website"
            >https://www.yuque.com/thisky/ylbh5g</span
          >
        </div>
        <a-list :data-source="currentList">
          <template #renderItem="{ item }">
            <a-list-item
              class="left-item-list"
              :class="currentIndex == item.id ? 'active-list' : ''"
              @click="currentDescription(item)"
            >
              <a-list-item-meta :description="item.description">
                <template #avatar>
                  <img :src="item.url" alt="" />
                </template>
                <template #title>
                  <a href="https://www.antdv.com/">{{ item.title }}</a>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-layout-sider>
    <a-layout-content class="password-right-main">
      <!-- 当数据为加载完成时,初始化默认没有搭建时展示页面空状态，暂时先隐藏掉 -->
      <a-empty :image="simpleImage" style="display: none" />
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
  <a-drawer class="filter-list-container" :width="216" placement="left"
    :visible="sideDrawerVisible" 
  >
     
  </a-drawer>
</template>

<script>
import {
  SettingOutlined,
  LaptopOutlined,
  SmileOutlined,
  SearchOutlined,
  PlusOutlined,
  SwapOutlined,
  AppstoreFilled,
  UnlockFilled,
  StarFilled,
  TagFilled,
  FolderOpenFilled,
  LinkOutlined,
  LockFilled,
  CodeTwoTone,
  UpOutlined,
  DownOutlined,
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
    SettingOutlined,
    LaptopOutlined,
    CodeTwoTone,
    SearchOutlined,
    SmileOutlined,
    SwapOutlined,
    PlusOutlined,
    AppstoreFilled,
    UnlockFilled,
    StarFilled,
    TagFilled,
    FolderOpenFilled,
    LinkOutlined,
    LockFilled,
    Empty,
    UpOutlined,
    DownOutlined,
  },
  computed: {
    ...mapState(appStore, []),
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
          url: "http://localhost:1600/packages/kee/assets/image/key_black.svg",
          showCopy: false,
          site:'zt.xaingtian.ren'
        },
        {
          id: 1,
          index: 1,
          title: "语雀帐号",
          description: "Isabelle_Fisher",
          path: "detail",
          password:'123456',
          url: "http://localhost:1600/packages/kee/assets/image/key_crimson.svg",
          showCopy: false,
          site:'zt.xaingtian.ren'
        },
        {
          id: 2,
          index: 2,
          title: "即时设计帐号",
          description: "Benjamin_Gonzalez",
          path: "detail",
          password:'123456',
          url: "http://localhost:1600/packages/kee/assets/image/key_blue.svg",
          showCopy: false,
          site:'zt.xaingtian.ren'
        },
        {
          id: 3,
          index: 3,
          title: "轻流帐号",
          description: "Maurice_Alvarado",
          path: "detail",
          password:'123456',
          url: "http://localhost:1600/packages/kee/assets/image/key_black.svg",
          showCopy: false,
          site:'zt.xaingtian.ren'
        },
        {
          id: 4,
          index: 4,
          title: "元社区帐号",
          description: "Derek_Edwards",
          path: "detail",
          password:'123456',
          url: "http://localhost:1600/packages/kee/assets/image/key_orange.svg",
          showCopy: false,
          site:'zt.xaingtian.ren'
        },
      ],
      search: "",
      size: "large",
      sideDrawerVisible: false,
      filterText: "当前网站",
      totalOpen: true,
      contextItems: "",
      // 当前网站
      currentList: [
        {
          id: 1,
          title: "拉娅枫的语雀帐号",
          description: "Francisio_Phillps",
          url: "http://localhost:1600/packages/kee/assets/image/key_black.svg",
        },
        {
          id: 2,
          title: "过英的语雀帐号",
          description: "Isabelle_Fisher",
          url: "http://localhost:1600/packages/kee/assets/image/key_crimson.svg",
        },
        {
          id: 3,
          title: "汝贵的语雀帐号",
          description: "Benjamin_Gonzalez",
          url: "http://localhost:1600/packages/kee/assets/image/key_blue.svg",
        },
      ],
      state:appStore()
    };
  },

  async mounted() {

  },
  methods: {
    // 搜索触发做的事情
    serachClikc() {},
    // 开启抽屉式的选项
    selectOptions() {
      this.sideDrawerVisible = true;
    },
    // 列表点击
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
    currentDescription(v) {
      this.currentIndex = v.id;
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
.passsword-button{
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
.active-list {
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
.current-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  .current-avatar {
    padding-left: 12px;
    img {
      width: 16px;
      height: 16px;
    }
  }
  .current-switch {
    display: flex;
    align-items: center;
  }
}
.current-content {
  max-width: 100%;
  padding: 0 12px 0 12px;
  margin: 0 auto;
  span {
    font-size: 14px;
    font-weight: 400;
  }
  .current-website {
    word-break: normal;
    width: auto;
    display: block;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
  }
}
/*当前网站密码结束*/

/*筛选列表开始*/

/*筛选列表结束*/
</style>
