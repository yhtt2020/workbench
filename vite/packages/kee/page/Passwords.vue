<template>
  <div class="password-header" style="-webkit-app-region:drag">
    <div class="password-select" style="-webkit-app-region:none"
      @click="selectOptions"
      @mouseover="passwordHover"
      @mouseleave="passwordRemove"
    >
      <a-row style="-webkit-app-region:none" class="password-select-container">
        <a-col :span="12" class="col-left">
          <component :is="filterInfo.icon"/>
          <span class="password-all">{{ filterInfo.text }}</span>
        </a-col>
        <a-col :span="12" class="col-right">
          <SwapOutlined style="font-size: 16px; cursor: pointer" />
        </a-col>
      </a-row>
    </div>
    <div class="password-search" style="-webkit-app-region:none">
      <a-input v-model:value="searchKey" placeholder="搜索 网址、备注、标题、用户名">
        <template #prefix>
          <search-outlined
            @click="searchClick"
            style="color: rgba(0, 0, 0, 0.45); font-size: 20px; cursor: pointer"
          />
        </template>
      </a-input>
    </div>
    <div class="password-button" style="-webkit-app-region:none">
      <PlusOutlined style="font-size: 16px; color:rgba(255, 255, 255, 1) !important;" />
      <span @click="createPwd" style=" color: rgba(255, 255, 255, 1); padding-left:8px;">新建密码</span>
    </div>
  </div>
  <a-divider style="height: 1px; background-color: rgba(230, 230, 230, 0.1);margin: 0  !important;" />
  <a-layout style="height: calc(100vh - 45px);">
    <a-layout-sider theme="light" style="padding: 20px;border-right: 1px solid rgba(230, 230, 230, 1);">
      <div class="current-container" v-if="filterInfo.type==='tab'">
        <div class="header-container">
          <div class="current-header">
            <span class="current-avatar">
              <img v-if="currentTab.favicon" :src="currentTab.favicon.url"/>
            </span>
            <div class="header-content" >
              <span v-if="contentControlShow == false">{{currentTab.title}}</span>
              <span style="color: grey" v-else>当前页面</span>
            </div>
            <div class="current-switch">
              <a-switch
                v-model:checked="this.siteCard.isRoot"
                checked-children="全站"
                un-checked-children="子站"
              />
               <UpOutlined
                v-if="contentControlShow == false"
                style="color: rgba(0, 0, 0, 0.45); padding-left: 4px;"
                @click="currentContentControl"
              />
              <DownOutlined
                v-else
                style="color: rgba(0, 0, 0, 0.45); padding-left: 4px"
                @click="currentContentControl"
              />
            </div>
          </div>
          <!-- 通过最右侧图标控制内容显示和隐藏 -->
          <div class="current-content" v-if="contentControlShow == true">
            <span>{{ currentTab.title }}</span>
            <span class="current-website">{{ currentTab.url }}</span>
          </div>
        </div>
      </div>
      <vue-custom-scrollbar :settings="settings" style="position:relative;"
      :style="{height:this.listHeight}"
      >
      <a-list item-layout="horizontal" :data-source="state.displayPasswords" >
        <template #renderItem="{ item,index }">
          <div @mouseenter.stop="passwordItemsHover(item)" @mouseleave.stop="passwordItemRemove(item)">
            <a-list-item :class="currentIndex===item.id ? 'active-list':''" @click="leftDescription(item)">
            <!-- 判断鼠标悬浮时打开并填充按钮显示 -->
            <a-list-item-meta :class="{'is-open-fill':item.showTip,'no-open-fill':!item.showTip}" :description="item.username || '无用户名'">
              <template #title>
                <a>{{ item.title || '未命名'}}</a>
              </template>
              <template #avatar>
                <ColorImg :src="item.icon" :width="18" :height="18" :color="this.getColor(item.originData)"></ColorImg>
              </template>
            </a-list-item-meta>
              <a-dropdown :trigger="['hover']">
               <div class="open-fill" v-show="item.showTip" @click.stop="openFillClick(item)">打开并填充</div>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="0">
                      <span @click.stop="openSubTabFillClick(item)">打开小号标签并填充</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-list-item>
          </div>
        </template>
      </a-list>
      </vue-custom-scrollbar>
    </a-layout-sider>
    <a-layout-content class="password-right-main">
      <!-- 当数据为加载完成时,初始化默认没有搭建时展示页面空状态，暂时先隐藏掉 -->
      <a-empty :image="simpleImage" style="display: none" />
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
  <a-drawer class="filter-list-container" :width="216"
     placement="left" v-model:visible="sideDrawerVisible"
     @close="sideDrawerVisible = false"
  >
    <div class="password-filter-container">
      <a-list item-layout="horizontal" :data-source="selectMenuList">
        <template #renderItem="{ item }">
          <a-list-item class="drawer-item-list" :class="selectDrawerIndex == item.id ? 'active-drawer':''" >
            <div class="my-password-drawer"  v-if="item.id == 1001">
              <a-dropdown overlayClassName="select-pwd"  :trigger="['click']" width="200" placement="bottomLeft">
                <span class="ant-dropdown-link" @click.prevent>
                  <component :is="item.icon" style="font-size:16px;padding-right: 12px;color: rgba(0, 0, 0, 0.5) !important;"/>
                  <a-list-item-meta @click="selectMyPassword(item)">
                   <template #title>
                   <span style=" color: rgba(0, 0, 0, 0.65);">{{ item.text }}</span>
                   </template>
                  </a-list-item-meta>
                  <component :is="item.iconSwap"></component>
                </span>
                <template #overlay>
                  <a-menu class="my-password-drawer-dropdown">
                    <a-menu-item   :key="item.id" v-for="item in myDbList" >
                      <router-link :to="{name:'bank',params:{name:item.text,path:item.path}}">
                      <UnlockFilled style="padding-right:12px;"/>
                      <span class="title">{{item.text}}</span>
                      </router-link>
                    </a-menu-item>
                    <a-menu-divider/>
                    <a-menu-item>
                      <router-link :to="{name:'bank'}">
                        <lock-outlined style="font-size:16px;padding-right:12px;"/>
                        <span class="drawer-open-main-text">锁定密码库</span>
                      </router-link>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
            <div class="other-password-drawer" v-else >
              <component :is="item.icon" style="font-size:16px;padding-right: 12px;color: rgba(0, 0, 0, 0.5) !important;"/>
              <a-list-item-meta   @click="selectListItem(item);item.onClick()">
                <template #title>
                 <span style=" color: rgba(0, 0, 0, 0.65);">{{ item.text }}</span>
                </template>
              </a-list-item-meta>
            </div>
          </a-list-item>
          <a-divider v-if="item.divider==1" style="height: 1px; background-color: rgba(230, 230, 230, 1);margin: 8px 0 !important;" />
        </template>
        <a-list-item class="drawer-main-application-open" @click="openMainApplication">
          <span class="drawer-main-app-icon">
            <img src="../../../public/img/lock-app.svg" alt="">
          </span>
          <span class="drawer-open-main-text">主应用中打开</span>
        </a-list-item>
        <a-list-item @click="showImport" style="font-size:14px; color:royalblue;cursor:pointer;" class="other-password-drawer">
          <ApiFilled style="margin-right: 10px;margin-left: -4px" /> 导入内置密码库密码
        </a-list-item>
      </a-list>
    </div>
  </a-drawer>

  <a-modal
    v-model:visible="importVisible"
    title="导入密码"
    width="80%"
    centered
    @ok="doImport"
  >
    <a-steps :current="importStep">
      <a-step>
        <!-- <span slot="title">Finished</span> -->
        <template #title>验证密码库</template>
      </a-step>
      <a-step title="导入密码"   description="" />
      <a-step title="导入完成" description="" />
    </a-steps>
    <div style="padding: 10px">
    <template v-if="importStep===0">
        <p>温馨提示：您可能需要先验证内置密码库的主密码，请点击下一步。</p>
<!--        <p>-->
<!--          <a-input-password v-model:value="importPwd" placeholder="请输入主密码"></a-input-password>-->
<!--        </p>-->

    </template>
    <template v-else-if="importStep===1">
      <p>当前有 <strong style="font-size: 24px">{{innerPasswords.length}}</strong> 条密码可供导入。点击下一步导入。</p>
      <p>
        <a-checkbox v-model:checked="importGroup">导入到单独的密码组</a-checkbox>
      </p>
      <p v-if="importGroup">
        <a-input  v-model:value="importGroupName"></a-input>
      </p>
      <p>
        对已存在的密码采取的操作
        <a-radio-group v-model:value="existAction">
          <a-radio value="jump">跳过</a-radio>
          <a-radio value="push">更新一个版本</a-radio>
        </a-radio-group>
      </p>
      <p>
        <a-checkbox v-model:checked="importDelete">导入后删除成功导入的密码</a-checkbox>
      </p>
    </template>
      <template v-else-if="importStep===2">
        <a-result
          status="success"
          title="导入密码成功。"
          :sub-title="'共为您处理 '+this.importResult.handleCount+' 个密码，其中：'"
        >
          <template #extra>
             新创建：{{importResult.createCount}}<br>
            <template v-if="existAction==='jump'">
              跳过：{{importResult.jumpCount}} <br>
            </template>
            <template v-else>
              更新：{{importResult.pushCount}} <br>
            </template>

          </template>
        </a-result>
      </template>
    </div>
    <template #footer>
      <a-button key="back" @click="this.importVisible=false;this.importStep=0">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="doImportNext()">
        <template v-if="importStep!==2">
          下一步
        </template>
        <template v-else>
          完成
        </template>

      </a-button>
    </template>
  </a-modal>
</template>

<script>
import {
  SettingOutlined, LaptopOutlined,
  SmileOutlined,SearchOutlined,
  PlusOutlined,SwapOutlined,LockOutlined,
  AppstoreFilled, UnlockFilled,
  StarFilled, TagFilled,
  FolderOpenFilled, LinkOutlined,
  LockFilled,CodeTwoTone,
  UpOutlined,DownOutlined,
  CheckOutlined,ApiFilled
} from "@ant-design/icons-vue";
import { appStore } from "../store";
import { mapActions,mapWritableState, mapState } from "pinia";
import vueCustomScrollbar from "../../../src/components/vue-scrollbar.vue";
import { message, Modal, Empty } from "ant-design-vue";
import ColorImg from '../components/ColorImg.vue'
import { getBgColorFromEntry } from '../util'
import _ from 'lodash-es'
let { appModel, devAppModel } = window.$models;
let appId = window.globalArgs["app-id"];
const { passwordModel }=window.$models
export default {
  name: "Passwords",
  components: {
    vueCustomScrollbar,
    SettingOutlined, LaptopOutlined,
    CodeTwoTone, SearchOutlined,
    SmileOutlined,SwapOutlined,LockOutlined,
    PlusOutlined,AppstoreFilled,
    UnlockFilled,StarFilled,
    TagFilled,FolderOpenFilled,
    LinkOutlined,LockFilled,
    Empty,UpOutlined,
    DownOutlined,CheckOutlined,
    ApiFilled,ColorImg
  },
  data() {
    return {
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false
      },


      url:'',//当前标签页的url


      importStep:0,
      importVisible:false,
      importPwd:'',
      innerPasswords:[],
      importDelete:false,//导入后是否删除成功导入的密码
      importGroup:true,//导入到一个单独的密码组
      importGroupName:'',
      existAction:'jump',//密码已经存在的操作，默认跳过,
      importResult:{
        handleCount:0,//处理数量
        jumpCount:0,//跳过数量
        createCount:0,//创建数量
        pushCount:0//推版本数量
      },


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
      checkNick: false,
      size: "large",
      sideDrawerVisible: false,

      // 筛选菜单列表下标
      selectDrawerIndex:1,
      totalOpen: true,
      contextItems: "",
      // 当前网站
      noWebIndex:'',
      state:appStore(),
      // 定义筛选菜单列表数据

      // 筛选菜单下拉框
      dropdownVisible:false,
      // 判断主应用打开入口
      openMainEnter:true,
      // 我的密码库筛选下标
      myPasswordIndex:0,
      checkPasswordIndex:0,
      myPasswordVisible:false,
      // 控制内容信息隐藏和显示
      contentControlShow:false,
    }

  },
  computed: {

    ...mapState(appStore,['displayPasswords']),
    ...mapWritableState(appStore,['passwordItem','dbList','currentTab','tags','filterInfo','siteCard','searchKey','currentIndex']),
    listHeight(){
      let height=''
      if(this.filterInfo.type==='tab'){
        if(this.contentControlShow){
         height=160
        }else{
          height=115
        }
      }else{
        height=70
      }
      return 'calc( 100vh - '+height+'px)'
    },
    displayTags(){
      return this.tags.map((tag,index)=>{
        return {
          id:tag,
          text:tag,
          icon:'TagFilled',
          divider:index===this.tags.length-1
        }
      })
    },
    myDbList(){
      let i=0

      return this.dbList.filter(item=>{
        if(i<=5 && i>0){
          i++
          return true
        }
        i++
      })
    },
    selectMenuList(){

      return [{
        id:1001,
        icon:'UnlockFilled',
        text:this.currentDb?this.currentDb.name:'我的密码',
        iconSwap:'SwapOutlined',
        divider:1,
        children:[]
      },
        {
          id:1002,
          icon:'AppstoreFilled',
          text:'所有密码',
          onClick:()=>{
            this.setFilter('ALL')
          }
        },
        {
          id:1003,
          text:'当前网站',
          icon:'LinkOutlined',
          divider:1,
          onClick:()=>{
            this.setFilter('TAB',{url:this.url})
            console.log('选择当前网站',this.url)
          }
        },
        {
          id:1004,
          text:'颜色',
          icon:'StarFilled',
          divider:1,
          onClick:()=>{
            console.log('选择颜色')
          }
        }
      ].concat(this.displayTags)
    }

  },

  async mounted() {
    this.getTabData()
    //获取到前面5个最近的库
    this.selectMenuList.children=this.dbList.map(item=>{
      return {
        id:item.id,
        title:item.text,
      }
    })
    let params=this.$route.params
    if(params.type==='url'){
      this.url=params.value
      await this.loadCurrentDb()
      this.setFilter('TAB',{url:this.url})
      //todo是路径方式
      await this.getAllPasswords()
      if(this.$route.params.uuid && this.$route.params.target ==='remark' && !window.redirected){
        window.redirected=true
        this.leftDescription(this.displayPasswords.find(pwd=>{
          return pwd.originData.uuid.id===this.$route.params.uuid
        }))
        this.goRemark(this.$route.params)
      }
      // passwordModel.getSiteCredit(this.url, true).then((result) => {
      //   let isFirst=true
      //   result.item.forEach((item) => {
      //     let pwd
      //     // {
      //     //   id: 3,
      //     //     index: 3,
      //     //   title: "轻流帐号",
      //     //   description: "Maurice_Alvarado",
      //     //   path: "detail",
      //     //   password:'123456',
      //     //   url: "http://localhost:1600/packages/kee/assets/image/key_black.svg",
      //     //   showCopy: false,
      //     //   site:'zt.xaingtian.ren'
      //     // },
      //     pwd={
      //       title: item.name || item.username,
      //       password: item.password,
      //       username:item.username,
      //       showCopy:false,
      //
      //       passwordType:'passwordType',
      //       id:item.domain+'_'+item.username,
      //       site: item.domain,
      //       icon:'/kee/key_black.svg'
      //     }
      //     if(isFirst){
      //       this.passwordItem=pwd
      //       this.$router.push({
      //         name:'detail',
      //         params:{
      //           t:Date.now()
      //         }
      //       })
      //       isFirst=false
      //     }
      //     this.passwords.push(pwd)
      //   })
      //
      //
      //
      //   // result.rootItem.forEach((item) => {
      //   //   let pwd = item
      //   //   pwd.passwordSwitch = {
      //   //     hide: true,
      //   //     pwd: item.password
      //   //   }
      //   //   appVue.rootPwds.push(pwd)
      //   // })
      //   console.log(this.$route.params,'参数')
      //   if(this.$route.params.uuid && this.$route.params.target ==='remark'){
      //     console.log('发现是要定向的',this.$route.params)
      //     this.goRemark(this.$route.params)
      //   }
      //
      // })


    }
    else if(params.type==='all'){
      //是直接查看全部的密码
      this.setFilter('ALL')
      this.getAllPasswords()
    }
  },
  methods: {
    createPwd(){
      this.createEntry()
      this.saveDb(result=>{
        message.success('新建密码成功。')
      })
    },
    goRemark(params){
      this.$router.push({name:'remark',params:{uuid:params.uuid}})
    },
    getColor(data){
      return getBgColorFromEntry(data)
    },
    ...mapActions(appStore,['getTabData','importPasswords','getAllPasswords','setFilter','loadCurrentDb','createEntry','saveDb']),
    showImport(){
      this.importVisible=true
    },
    async doImportNext () {
      switch (this.importStep) {
        case 0:
          //todo验证密码
          this.innerPasswords = await ipc.invoke('credentialStoreGetCredentials')
          this.importGroupName= '导入密码_'+ (new Date(Date.now())).toLocaleString()
          console.log(this.innerPasswords)
          this.importStep++
          break;
        case 1:
          //todo 导入密码
          if(this.importGroup){
            if(this.importGroupName===''){
              message.error('请输入新的密码组的名称')
            }
          }
          if(this.doImportPasswords()){
            this.importStep++
          }else{
            message.error('导入遇到意外错误。')
          }
          break;
        case 2:
          this.importVisible = false;
          this.importStep = 0
      }
    },
    doImportPasswords(){
      this.importResult= this.importPasswords(this.innerPasswords,this.importGroup?this.importGroupName:undefined,this.existAction,this.importDelete?'delete':'none')
      return true
    },
    // 搜索触发做的事情
    searchClick() {},
    // 开启抽屉式的选项
    selectOptions() {
      this.sideDrawerVisible = true;
    },
    // 左侧列表点击
    leftDescription(item) {
      this.currentIndex = item.id;
      this.passwordItem=item
      this.$router.push({
        name:'detail',
        params:{
          t:Date.now()
        }
      })
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
    selectMyPassword(v){
      this.filterText = v.text
      this.selectDrawerIndex = v.id
      this.filterIcon = v.icon
      this.filterId = v.id
    },
    // 当前网站点击
    currentDescription(item) {
      this.currentIndex = v.id;
      this.passwordItem=item
      this.$router.push({
        name:'detail'
      })
    },

    // 主应用打开跳转到对应的路由地址
    openMainApplication(){
      document.querySelector('.drawer-main-application-open').classList.add('active-drawer')
      this.selectDrawerIndex = ''
      this.sideDrawerVisible = false
    },
    // 鼠标移入开始
    passwordHover() {
      document.querySelector(".password-select").style =
        "background:rgba(80, 139, 254, 0.1);";
    },
    passwordItemsHover(v) {
      v.showTip = true;
    },
    // 鼠标移入结束
    // 鼠标移出开始
    passwordRemove() {
      document.querySelector(".password-select").style =
        "background:rgba(255, 255, 255, 1);";
    },
    passwordItemRemove(v) {
      v.showTip = false;
    },
    // 鼠标移出结束
    // 筛选列表点击
    getDrawerItem() {

    },
    // 当前网站点击
    currentWebSiteClick(v){
      this.noWebIndex = v.id
      this.state.$patch({
         passwordItem:v
      })
    },
    // 控制当前网站内容的形式和隐藏
    currentContentControl(){
       this.contentControlShow = !this.contentControlShow
    },
    // 打开填充按钮
    openFillClick(item) {
      ipc.send('openTabFill',{password:_.cloneDeep(item)})
    },
    openSubTabFillClick(item){
      ipc.send('openSubTabFillClick',{password:_.cloneDeep(item)})
    }

  }
};
</script>
<style lang="scss">
.full-modal {
.ant-modal {
  max-width: 100%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
}
.ant-modal-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
}
.ant-modal-body {
  flex: 1;
}
}
</style>
<style>

body,
html {
  overflow: hidden;
  width: 100% !important;
}
.select-pwd .ant-dropdown-placement-bottomLeft{
    top: 44px !important;
    left: 8px !important;
    min-width: 200px !important;
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
.ant-drawer-header{
   display: none !important;
}
/*其他样式结束*/
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
  width: 225px;
  min-width: 225px;
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
  flex-grow: 1;
  margin-right: 16px;
}
/*搜索结束*/

/*新建密码开始*/
.password-button{
   width:110px;
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

/*左侧边栏滚动开始*/
.ant-layout-sider {
  overflow: scroll;
  padding: 8px !important;
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
.active-list{
  background: rgba(80, 139, 254, 0.2);
  border-radius: 6px;
}
.ant-list-item-meta-avatar{
  margin-right: 12px !important;
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
      align-items :flex-start;
      justify-content: space-between;
     .current-avatar img{
       width: 16px;
       height: 16px;
       vertical-align: text-bottom;
      }
      .header-content{
       width: 102px;
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
         color: grey;
         font-size: 12px;
         max-width: 200px;
         overflow: hidden;
         display: -webkit-box;
         -webkit-box-orient: vertical;
         -webkit-line-clamp: 2;
         text-overflow: ellipsis;
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
.password-filter-container{
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
    .my-password-drawer,.ant-dropdown-link{
      display: flex;
      align-items: center;
      width: 100%;
    }
    .other-password-drawer{
      display: flex;
      width: 100%;
    }
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

  .my-password-dropdown:hover{
     background: none;
  }
  .my-password-list{
    cursor: pointer;
    padding: 5px 8px;
    .title{
       padding-left: 12px;
    }
  }
}
.checkout{
   color: rgba(80, 139, 254, 1);
   padding-left: 70px;
}
.ant-dropdown-menu-item:nth-of-type(1){

  .checkout{
    color: rgba(80, 139, 254, 1);
    padding-left: 66px !important;
 }
}
/*筛选列表结束*/

</style>
