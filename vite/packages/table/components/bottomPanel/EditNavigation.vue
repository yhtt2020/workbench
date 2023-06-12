<template>
  <transition name="fade">
    <div class="back pointer no-drag" @click="onBack" v-show="!editFlag">
      <Icon icon="xiangzuo" style="height: 24px;width: 24px"></Icon>
    </div>
  </transition>
  <transition name="fade">
    <div class="box-content" v-show="!editFlag" id="boxContent">
      <div class="box-center">
        <div style="width: 100px;" >
          <div class="side-nav" v-show="leftNav" id="leftBox">
            <div style="width: 73px;overflow: hidden;" class="flex flex-col  items-center w-full">
            <div style="overflow: hidden;" id="sideNavList"
            class="flex flex-col items-center  flex-nowrap scroll-content" ref="sideContent">
              <div v-for="item in sideNavigationList" :key="item.name" style="margin: 20px 0;">
                <a-dropdown  :trigger="['contextmenu']">
                  <div v-if="item.type==='systemApp'" style="display: flex;justify-content: center;align-items: center;margin: 0 auto;border-radius: 12px">
                    <Icon :icon="item.icon" style="width: 40px;height: 40px;color:rgba(255, 255, 255, 0.4);" ></Icon>
                  </div>
                  <a-avatar v-else :size="40" shape="square" :src="item.icon"></a-avatar>
                </a-dropdown>
              </div>
            </div>
          </div>
          <div>
            <Icon icon="tianjia" style="width: 56px;height: 56px;color:rgba(255, 255, 255, 0.4);"  class="pointer" @click="addEdit('left')"></Icon>
          </div>
        </div>
      </div>
      <div class="center-text">
        <div class="con-center" v-show="navText && !promptModal">
          <span class="mt-5">支持长按拖拽排序，滑动查看更多。</span>
          <div class="mt-5"><span >以下功能需要在导航栏上至少各保留一个，以保障功能完整</span></div>
          <span class="mt-2">可快速拖动到侧边栏</span>
          <span class="flex   mb-2">注意：侧边栏图标会自动替换：
            <span class="mr-4 flex justify-center items-center">
              <Icon icon="home" style="width: 30px;height: 30px;color:rgba(255, 255, 255, 0.4);" ></Icon>
              <Icon icon="arrowright" style="width: 20px;height: 20px;"></Icon>
              <Icon icon="shouye1" style="width: 30px;height: 30px;color:rgba(255, 255, 255, 0.4);" ></Icon>
            </span>
            <Icon icon="thunderbolt" style="width: 30px;height: 30px;color:rgba(255, 255, 255, 0.4);" ></Icon>
            <Icon icon="arrowright" style="width: 20px;height: 20px;margin-top: 6px"></Icon>
            <Icon icon="kuaijie1" style="width: 30px;height: 30px;color:rgba(255, 255, 255, 0.4);" ></Icon>
          </span>
          <div class="main-nav" id="mainList">
            <div v-for="item in mainNavList" :key="item.name">
              <div style="width: 100%;height: 100%;opacity: 0.3;" class="flex flex-col justify-center items-center">
                <Icon :icon="item.icon" style="width: 40px;height: 40px;color:rgba(255, 255, 255, 0.4);" ></Icon>
                <span class="mt-2">{{ item.name }}</span>
              </div>
              <div class="add-toggle" v-if="item.addNav">已添加</div>
            </div>
          </div>
        </div>
        <div class="nav-toggle" v-show="navText && !promptModal">
            <div class="left-point">
              <span class="mb-4"><Icon icon="arrowleft"></Icon>左侧</span>
              <div>
                <!-- <a-switch v-model:checked="leftNav" @change="navToggle(sideNavigationList,'left')"/> -->
                <a-switch v-model:checked="leftNav" @change="navToggle('left')"/>
              </div>
            </div>
            <div class="foot-point">
              <span class="mb-4"><Icon icon="arrowdown"></Icon>底部</span>
              <div>
                <a-switch v-model:checked="footNav" @change="navToggle('foot')"/>
              </div>
            </div>
            <div class="right-point">
              <span class="mb-4">右侧<Icon icon="arrowright"></Icon></span>

              <div>
                <a-switch v-model:checked="rightNav" @change="navToggle('right')"/>
              </div>
            </div>
          </div>
        <div class="prompt-modal " v-show="promptModal ">
          <div class="p-5 s-bg flex flex-col justify-center items-center" style="border-radius:16px">
            <div>
              <Icon icon="tishi-xianxing" style="font-size: 16px;color: orange"></Icon>
              <span class="ml-3">提示</span>
            </div>
            <span class="my-5">在导航栏中至少保留一个
              <span v-for="item in delMainItem" :key="item.name">
                「{{ item.name }}」
              </span>
              入口，以保持功能完整性。</span>
            <div class="modal-btn">
              <div class="mr-3 rounded-lg" @click="promptModal = false">好的</div>
              <!-- <div @click="delMainCore">移除</div> -->
            </div>
          </div>
        </div>
        <div class="del-icon" id="delIcon" v-show="!navText && !promptModal">拖到此处删除图标</div>
      </div>
      <div style="width:100px;" class="flex justify-end">
        <div class="side-nav" v-show="rightNav" id="rightBox">
          <div style="width: 73px;overflow: hidden;" class="flex flex-col  items-center w-full">
            <div style="overflow: hidden;" id="rightNavList"
            class="flex flex-col items-center  flex-nowrap scroll-content" ref="rightContent">
              <div v-for="item in rightNavigationList" :key="item.name" class="my-5 width: 56px;height: 56px;">
                <a-dropdown  :trigger="['contextmenu']">
                  <div v-if="item.type==='systemApp'" style="display: flex;justify-content: center;align-items: center;margin: 0 auto;border-radius: 12px">
                    <Icon :icon="item.icon" style="width: 40px;height: 40px;color:rgba(255, 255, 255, 0.4);" ></Icon>
                  </div>
                  <a-avatar v-else :size="40" shape="square" :src="item.icon"></a-avatar>
                </a-dropdown>
              </div>
            </div>
          </div>
          <div>
            <Icon icon="tianjia" style="width: 56px;height: 56px;color:rgba(255, 255, 255, 0.4);"  class="pointer" @click="addEdit('right')"></Icon>
          </div>
        </div>
      </div>
      </div>
      <div class="box-foot" v-show="footNav" id="footBox">
        <div style="height: 73px;overflow: hidden;" class="flex flex-row  items-center pl-2 w-full">
          <div style="overflow: hidden;" id="navList"
             class="flex flex-row items-center  flex-nowrap scroll-content mr-2" ref="content">
            <div v-for="item in footNavigationList" style="margin: 4px 18px" :key="item.name">
              <a-dropdown  :trigger="['contextmenu']">
                    <div style="width: 56px;height: 56px;display: flex;justify-content: center;align-items: center;background: rgba(33, 33, 33, 1);border-radius: 12px" v-if="item.type==='systemApp'">
                      <Icon :icon="item.icon" style="width: 32px;height: 32px;color:rgba(255, 255, 255, 0.4);" ></Icon>
                    </div>
                  <a-avatar :size="40" shape="square" :src="item.icon" v-else></a-avatar>
              </a-dropdown>
            </div>
          </div>
        </div>
        <div>
          <Icon icon="tianjia" style="width: 56px;height: 56px;color:rgba(255, 255, 255, 0.4);position:relative;top:2px;"  class="pointer mr-8" @click="addEdit('foot')"></Icon>
        </div>
        <div style="border-left: 1px solid rgba(255, 255, 255, 0.4);" class="flex justify-center items-center pointer  pl-6 mr-6">
          <Icon icon="appstore-fill" style="width: 48px;height: 48px;"></Icon>
        </div>
      </div>
    </div>
  </transition>

  <transition name="fade">
  <Classification :navClassify="navClassify" v-if="editFlag" v-model:show="editFlag" @clickLeftList="clickItem">
    <div v-show="nowClassify!=='localApp'" class="h-full">
      <a-input v-model:value="selectContent" class="no-drag h-10 rounded-lg" placeholder="搜索"  style="background: rgba(42, 42, 42, 0.6);">
        <template #prefix>
          <Icon icon="sousuo" class="text-gray-600"></Icon>
        </template>
      </a-input>
      <vue-custom-scrollbar  key="scrollbar"  :settings="rightScrollbarSettings"
        class="relative" style="height: calc(100% - 40px);padding: 5px 0">
        <listItem v-for="(item,index) in filterList" :item="item"
        class=" rounded-lg right-scroll-list" @click="clickRightListItem(item,index)"></listItem>
      </vue-custom-scrollbar>
    </div>
    <div v-show="nowClassify==='localApp'" class="flex flex-col items-start text-zinc-500  h-full">
      <div>1. 点击选择需要添加的应用快捷方式</div>
      <div>2. 拖动应用快捷方式拖放到下方</div>
      <div>3. 支持持批量添加</div>
      <div class="border-dashed w-full h-1/2 mt-2.5 rounded-lg flex flex-row justify-center items-center"  @dragover.prevent="" @drop.prevent="drop">
        <Icon icon="tianjia2" style="width:18px;height:18px;" class="mr-2"></Icon>
        添加快捷方式
      </div>
      <ScrolX :height="66">
        <div class="flex flex-row w-full justify-start mt-4 -ml-8 pt-4">
          <div v-for="(item,index) in dropList" class="flex  ml-4">
            {{ item }}
            <a-badge>
              <template #count>
                <Icon icon="guanbi2" style="height: 24px;width: 24px;color: crimson" @click="deleteDropList(index)" class="pointer"></Icon>
              </template>
              <a-avatar :size="40" shape="square" :src="item.icon" >
              </a-avatar>
            </a-badge>
          </div>
        </div>
      </ScrolX>
      <div @click="clickRightListItem(dropList)" class="pointer flex justify-center items-center mt-2 w-24 h-12 rounded-lg  " style="background: rgb(42, 42, 42);color: rgba(255, 255, 255, 0.85);">
        确定添加
      </div>
    </div>
  </Classification>
  </transition>
</template>

<script>
import vuuri from "../vuuriHome/Vuuri.vue";
import listItem from "./listItem.vue";
import {mapActions, mapWritableState} from "pinia";
import {cardStore} from "../../store/card";
import {navStore} from "../../store/nav";
import ScrolX from '../ScrolX.vue'
import Sortable from 'sortablejs';
import navigationData from '../../js/data/tableData'
import Classification from "../comp/Classification.vue";
import { message } from 'ant-design-vue';
const {appModel}=window.$models
export default {
  name: "EditNavigation",
  data(){
    return {
      rightScrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      selectContent:'',
      listData:[],
      editFlag:false,
      activeItem:0,
      activeRightItem:0,
      nowClassify:'systemApp',
      navClassify:[
        ...navigationData.navigationClassify
      ],
      ClassifyData:[
        ...navigationData.coolAppList,...navigationData.systemAppList
        ],
      dropList:[],
      leftNav: false,
      rightNav: false,
      footNav: false,
      promptModal: false,
      selectNav: '',
      navText: true,
      mainNavList: [],
      //主要功能拖动
      darggingCore: false,
      // delMainIndex: -1,
      //删除主要功能数据
      delMainItem: [],
      // delNavType: '',
    }
  },
  computed:{
    ...mapWritableState(cardStore, ['routeParams']),
    ...mapWritableState(navStore, ['mainNavigationList','sideNavigationList','footNavigationList','rightNavigationList','navigationToggle']),
    filterList(){
      return this.ClassifyData.filter(i =>{return i.type === this.nowClassify&&i.name.includes(this.selectContent)})
    }
  },
  components:{
    vuuri,
    ScrolX,
    listItem,
    Classification
  },
  created() {
    this.loadDeskIconApps()
  },
  mounted() {
    this.leftNav = this.navigationToggle[0]
    this.rightNav = this.navigationToggle[1]
    this.footNav = this.navigationToggle[2]
    this.mainNav()
    let boxContent = document.getElementById('boxContent')
    boxContent.addEventListener('ondragover',() => {
      ev.preventDefault()
    })
    boxContent.addEventListener('drop',() => {
      this.darggingCore = false
    })
    this.scrollNav('content','scrollLeft')
    this.scrollNav('sideContent','scrollTop')
    this.scrollNav('rightContent','scrollTop')
    this.$nextTick(()=>{
      this.dragSort('navList',this.sortFootNavigationList,'foot')
      this.dragSort('sideNavList',this.sortSideNavigationList,'left')
      this.dragSort('rightNavList',this.sortRightNavigationList,'right')
      this.mainDrop()
    })
  },
  methods:{
    //导航栏滚动
    scrollNav(refVal,scrollDirection){
      let content = this.$refs[refVal]
        content.addEventListener('wheel',(event) => {
        event.preventDefault();
        content[scrollDirection] += event.deltaY
      });
    },
    //导航栏显示与隐藏
    navToggle(type){
      this.delMainItem = []
      switch (type) {
        case 'left':
          for (const i in this.mainNavList) {
            this.sideNavigationList.forEach(item => {
              //判断当前导航栏是否含有主要功能
              if(item.name === this.mainNavList[i].name){
                //判断其他导航栏是否关闭
                if(this.footNav && this.rightNav){
                  //获取其他两个导航栏的数据
                  let sumNav = this.footNavigationList.concat(this.rightNavigationList)
                  //其他导航栏是否含有此功能
                  if(!sumNav.find(f => f.name === item.name)){
                    this.delMainItem.push(item)
                    this.promptModal = true
                    //其他导航栏没有，则当前导航栏不能关闭
                    this.leftNav = true
                  }
                }else if(this.footNav && !this.rightNav){
                  if(!this.footNavigationList.find(f => f.name === item.name)){
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.leftNav = true
                  }
                }else if(!this.footNav && this.rightNav){
                  if(!this.rightNavigationList.find(f => f.name === item.name)){
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.leftNav = true
                  }
                }else{
                   this.delMainItem.push(item)
                   this.promptModal = true
                   this.leftNav = true
                }
              }
            })
          }
          break;
        case 'foot':
          for (const i in this.mainNavList) {
            this.footNavigationList.forEach(item => {
              if(item.name === this.mainNavList[i].name){
                if(this.leftNav && this.rightNav){
                  let sumNav = this.sideNavigationList.concat(this.rightNavigationList)
                  if(!sumNav.find(f => f.name === item.name)){
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.footNav = true
                  }
                }else if(this.leftNav && !this.rightNav){
                  if(!this.sideNavigationList.find(f => f.name === item.name)){
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.footNav = true
                  }
                }else if(!this.leftNav && this.rightNav){
                  if(!this.rightNavigationList.find(f => f.name === item.name)){
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.footNav = true
                  }
                }else{
                  this.delMainItem.push(item)
                  this.promptModal = true
                  this.footNav = true
                  this.setNavigationToggle(type,true)
                }

              }
            })
          }
          break;
        case 'right':
          for (const i in this.mainNavList) {
            this.rightNavigationList.forEach(item => {
              if(item.name === this.mainNavList[i].name){
                if(this.leftNav && this.footNav){
                  let sumNav = this.sideNavigationList.concat(this.footNavigationList)
                  if(!sumNav.find(f => f.name === item.name)){
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.rightNav = true
                  }
                }else if(this.leftNav && !this.footNav){
                  if(!this.sideNavigationList.find(f => f.name === item.name)){
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.rightNav = true
                  }
                }else if(!this.leftNav && this.footNav){
                  if(!this.footNavigationList.find(f => f.name === item.name)){
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.rightNav = true
                  }
                }else{
                   this.delMainItem.push(item)
                   this.promptModal = true
                  this.rightNav = true
                }
              }
            })
          }
          break;
      }
    },
    ...mapActions(navStore, ['setFootNavigationList','sortFootNavigationList','removeFootNavigationList','setSideNavigationList','sortSideNavigationList','removeSideNavigationList','setRightNavigationList','sortRightNavigationList','removeRightNavigationList','setNavigationToggle']),
    mainNav(addItem,type){
      this.mainNavList = this.mainNavigationList
      let sumNavList = this.sideNavigationList.concat(this.footNavigationList,this.rightNavigationList)
      if(type){
        this.mainNavList.forEach(item => {
          if(item.name === addItem.name){
            if(type === 'add'){
              item.addNav = true
            }else if(type === 'del'){
              item.addNav = false
            }
          }
        })
      }else{
        for (const i in this.mainNavList) {
          let stateNav = sumNavList.some(item => item.name === this.mainNavList[i].name)
          this.mainNavList[i].addNav = stateNav
        }
      }
    },
    //主要功能拖拽
    mainDrop(){
      let that = this
      let main = document.getElementById('mainList')
      Sortable.create(main,{
        sort: false,
        animation: 150,
        removeCloneOnHide: true,
        forceFallback: false,
        onStart(evt) {
          that.darggingCore = true
          that.draggingArea('leftBox',evt.oldIndex,that.sideNavigationList,that.setSideNavigationList)
          that.draggingArea('rightBox',evt.oldIndex,that.rightNavigationList,that.setRightNavigationList)
          that.draggingArea('footBox',evt.oldIndex,that.footNavigationList,that.setFootNavigationList)
        },
      })
    },
    /**添加页面主要功能
     * id 容器id
     * oldIndex 主要功能拖拽过来的索引
     * NavigationList 当前导航栏的数据
     * setNavigationList 当前导航栏排序的方法
     */
    draggingArea(id,oldIndex,NavigationList,setNavigationList){
      let that = this
      let slider = document.getElementById(id)
      slider.ondragover= function (ev) {
        ev.preventDefault()
      }
      slider.ondrop=() =>{
        if(that.darggingCore){
          if(!NavigationList.find(j => j.name === that.mainNavigationList[oldIndex].name)){
            setNavigationList(that.mainNavigationList[oldIndex])
            that.mainNav()
          }else{
            message.info('已添加',1);
          }
        }
      }
    },
    //没有主要功能仍可以删除
    // delMainCore(){
    //   if(this.delNavType === 'delFoot'){
    //     this.removeFootNavigationList(this.delMainIndex)
    //   }else if(this.delNavType === 'delLeft'){
    //     this.removeSideNavigationList(this.delMainIndex)
    //   }else if(this.delNavType === 'delRight'){
    //     this.removeRightNavigationList(this.delMainIndex)
    //   }
    //   this.promptModal = false
    //   this.delMainIndex = -1
    //   this.mainNav(this.delMainItem[0],'del')
    //   this.navText = true
    // },

    /**拖拽排序
     * largeDragId 容器id
     * sortNavigationList 导航排序的方法
     * type 要删除的类型传给删除函数
     */
    dragSort(largeDragId,sortNavigationList,type){
      let that = this
      let drop = document.getElementById(largeDragId)
      Sortable.create(drop, {
        sort: true,
        animation: 150,
        onStart: function(event){
          that.navText = false
          if(!this.navText){
            let delIcon = document.getElementById('delIcon')
            delIcon.ondragover= function (ev) {
              ev.preventDefault()
            }
            delIcon.ondrop=function (ev) {
              that.delAbility(event.oldIndex,type)
            }
          }
        },
        onUpdate:function(event){
          let newIndex = event.newIndex,
            oldIndex = event.oldIndex
          let  newItem = drop.children[newIndex]
          let  oldItem = drop.children[oldIndex]

          // 先删除移动的节点
          drop.removeChild(newItem)
          // 再插入移动的节点到原有节点，还原了移动的操作
          if(newIndex > oldIndex) {
            drop.insertBefore(newItem,oldItem)
          } else {
            drop.insertBefore(newItem,oldItem.nextSibling)
          }
          sortNavigationList(event)
          that.mainNav()
        },
        onEnd: function(event){
          that.navText = true
        }
      });
    },
    delAbility(index,type){
      let oneNav = {};
      let sumList = []
      switch (type) {
        case 'left':
          oneNav = this.sideNavigationList[index]
          //判断另外两个导航栏是否关闭
          if(this.footNav && this.rightNav){
            //获取其他两个导航栏的数据
            sumList = this.footNavigationList.concat(this.rightNavigationList)
          }else if(this.footNav && !this.rightNav){
            sumList = this.footNavigationList
          }else if(!this.footNav && this.rightNav){
            sumList = this.rightNavigationList
          }
          this.delNavigation(sumList,oneNav,index,this.removeSideNavigationList,'delLeft')
          break;
        case 'right':
          oneNav = this.rightNavigationList[index]
          if(this.leftNav && this.footNav){
            sumList = this.footNavigationList.concat(this.sideNavigationList)
          }else if(this.leftNav && !this.footNav){
            sumList = this.sideNavigationList
          }else if(!this.leftNav && this.footNav){
            sumList = this.footNavigationList
          }
          this.delNavigation(sumList,oneNav,index,this.removeRightNavigationList,'delRight')
          break;
        case 'foot':
           oneNav = this.footNavigationList[index]
          if(this.leftNav && this.rightNav){
            sumList = this.sideNavigationList.concat(this.rightNavigationList)
          }else if(this.leftNav && !this.rightNav){
            sumList = this.sideNavigationList
          }else if(!this.leftNav && this.rightNav){
            sumList = this.rightNavigationList
          }
          this.delNavigation(sumList,oneNav,index,this.removeFootNavigationList,'delFoot')
          break;
      }
    },
    /**删除功能的方法
     * sumList 其他导航栏的数据
     * oneNav 需要删除的功能
     * index 当前功能的索引
     * delMethod  store里删除的方法
     * type 删除类型
     */
    delNavigation(sumList,oneNav,index,delMethod,type){
      this.delMainItem = []
      if(!this.mainNavList.find(item => item.name === oneNav.name)){
        delMethod(index)
      }else{
        if(sumList.find(item => item.name === oneNav.name)){
          delMethod(index)
        }else{
          this.promptModal = true
          this.delNavType = type
          this.delMainIndex = index
          this.delMainItem.push(oneNav)
        }
      }
    },
    deleteDropList(index){
      this.dropList.splice(index,1)
    },
    async drop(e){
      let files = e.dataTransfer.files
      let filesArr = []
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          filesArr.push(files[i].path)
        }
      }
      this.dropFiles = await ipc.sendSync('getFilesIcon', { files: JSON.parse(JSON.stringify(filesArr)) })
      this.dropList.push(...this.dropFiles)
    },
    clickItem(item){
       this.activeRightItem = 0;
       this.nowClassify = item.name;
    },
    //获取添加导航的数据
    async loadDeskIconApps () {
     const lightApps=await appModel.getAllApps()
      for (let i = 0; i < lightApps.length; i++) {
        lightApps[i].icon = lightApps[i].logo
        lightApps[i].type = 'lightApp'
      }
      const desktopApps = await ipc.sendSync('getDeskApps')
      for (let i = 0; i < desktopApps.length; i++) {
        desktopApps[i].type = 'tableApp'
      }
    this.ClassifyData.push(...desktopApps,...lightApps)
    },
    onBack(){
      this.$emit('setQuick')
      this.routeParams.url&& setTimeout(()=>{this.$router.push({name: 'app', params: this.routeParams})},400)
    },
    addEdit(val){
      this.selectNav = val
      this.editFlag = true;
      this.nowClassify = 'systemApp'
    },
    closeAdd(){
      this.editFlag = false;
    },
    //添加导航功能
    clickRightListItem(item,index){
      this.activeRightItem = index
      this.editFlag = false;
      if( this.selectNav === 'foot'){
        if(item instanceof Array){
          for (let i = 0; i < item.length; i++) {
            //判断功能是否已添加
            if(!this.footNavigationList.find(j => j.name===item[i].name)){
              this.mainNav(item[i],'add')
              item[i].addNav = true
              this.setFootNavigationList(item[i])
            }else{
              message.info('已添加',1)
            }
          }
          this.dropList=[];
        } else{
          for (let i = 0; i < this.footNavigationList.length; i++) {
            //判断功能是否已添加
            if(this.footNavigationList[i].name ===item.name){
              message.info('已添加',1)
              return
            }
          }
          this.mainNav(item,'add')
          item.addNav = true
          this.setFootNavigationList(item)
          this.$nextTick(() => {
            let scrollElem = this.$refs.content;
            scrollElem.scrollTo({ left: scrollElem .scrollWidth, behavior: 'smooth' });
          });
        }
      }else if(this.selectNav === 'left'){
        if(item instanceof Array){
          for (let i = 0; i < item.length; i++) {
            if(!this.sideNavigationList.find(j => j.name===item[i].name)){
              this.mainNav(item[i],'add')
              item[i].addNav = true
              this.setSideNavigationList(item[i])
            }else{
              message.info('已添加',1)
            }
          }
            this.dropList=[];
          } else{
            for (let i = 0; i < this.sideNavigationList.length; i++) {
              if(this.sideNavigationList[i].name ===item.name){
                message.info('已添加',1)
                return
              }
            }
            this.mainNav(item,'add')
            item.addNav = true
            this.setSideNavigationList(item)
            this.$nextTick(() => {
              let scrollElem = this.$refs.sideContent;
              scrollElem.scrollTo({ top: scrollElem .scrollHeigth, behavior: 'smooth' });
            });
          }
      }else if(this.selectNav === 'right'){
        if(item instanceof Array){
          for (let i = 0; i < item.length; i++) {
            if(!this.rightNavigationList.find(j => j.name===item[i].name)){
              this.mainNav(item[i],'add')
              item[i].addNav = true
              this.setRightNavigationList(item[i])
            }else{
              message.info('已添加',1)
            }
          }
            this.dropList=[];
          } else{
            for (let i = 0; i < this.rightNavigationList.length; i++) {
              if(this.rightNavigationList[i].name ===item.name){
                message.info('已添加',1)
                return
              }
            }
            this.mainNav(item,'add')
            item.addNav = true
            this.setRightNavigationList(item)
          }
      }
    }
  },
  watch: {
    leftNav(newVal){
      this.setNavigationToggle('left',newVal)
    },
    rightNav(newVal){
      this.setNavigationToggle('right',newVal)
    },
    footNav(newVal){
      this.setNavigationToggle('foot',newVal)
    }
  },
}
</script>
<style lang="scss">
.bottom-edit {
  .muuri-item {
    width:56px;

  }

  .muuri-item {
   margin-right: 32px;
  }

}
</style>
<style lang="scss" scoped>
.box-content{
  height: 100%;
  .box-center{
    height: 70%;
    margin:32px 12px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .side-nav{
      border-radius: 12px;
      width: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      border-radius: 12px;
      background: rgb(40, 40, 40);
      max-height: 508px;
      overflow: hidden;
      padding: 24px 0 24px;
    }
    .center-text{
      width: 90%;
      // width: 1056px;
      margin: 0 10px;
      height: 100%;
      display: flex;
      justify-content: center;
      position: relative;
    }
  }
  .box-foot{
    position:absolute;
    bottom: 12px;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    // padding-left: 24px;
    min-width: 827px;
    width: 70%;
    height: 80px;
    border-radius: 12px;
    background: rgb(40, 40, 40);
    box-sizing: border-box;
  }
}
.con-center{
  width: 512px;
  display: flex;
  flex-direction: column;
  >span:nth-child(1),
  >span:nth-child(3){
    display: block;
    font-size: 18px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    font-family: PingFangSC-Medium;
  }
  >span:nth-child(2),
  >span:nth-child(4){
    margin: 8px 0 16px;
    // width: 65%;
    // text-align: center;
    color: rgba(255, 255, 255, 0.6);
    font-family: PingFangSC-Regular;
    font-size: 16px;
  }
}
.main-nav{
  height: 112px;
  padding: 12px;
  background: #212121;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  >div{
    width: 88px;
    height: 88px;
    background: #2A2A2A;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .add-toggle{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
  }
}
.nav-toggle{
  background: red;
  >div{
    display: flex;
    flex-direction: column;
    padding: 24px 44px;
    text-align: center;
    background: #212121;
    border-radius: 12px;
  }
}
.left-point{
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.right-point{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.foot-point{
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.prompt-modal{
  position: relative;
  top: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  // height: 200px;
  width: 380px;
  margin: 0 auto;
  .modal-btn{
    display: flex;
    color: white;
    >div{
      padding: 8px 50px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.30);
    }
  }
}
.del-icon{
  background: black;
  width:100%;
  height: 100%;
  opacity: 0.5;
  background: #2A2A2A;
  border: 1px dashed rgba(255,255,255,0.4);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
}




.grid {
  position: relative;
  display: inline-block;
  height: 56px;
  line-height: 56px;
  border-radius: 4px;
  vertical-align: top;
  left: 0;
  right: 0;
}
.back{
  margin-top: 24px;
  margin-left: 12px;
  width: 80px;
  height: 48px;
  border-radius: 12px;
  background: rgba(42, 42, 42, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-navigation{
  padding: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: calc(100vw - 20%);
  height: calc(100vh - 10%);
  border-radius: 16px;
  background: rgba(33, 33, 33, 1);
  max-width: 800px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  text-align: center;
    >:nth-child(1){
      font-size: 18px;
      color: rgba(255, 255, 255, 0.85);
      margin-top: 8px;
    }
    >:nth-child(2){
      width: 48px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      background:rgb(42, 42, 42);
      border-radius: 12px;
      position: absolute;
      top: 16px;
      right: 16px;
  }
  .add-navigation-content{
    margin-top: 30px;
    width: 100%;
    height: 80%;
    .left-content{
      width: 136px;
      border-right: 1px  rgba(255, 255, 255, 0.1) solid;
      height: 100%;
      >div{
        width: 136px;
        >div{
          width: 120px;
          height: 56px;
          font-size: 16px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          line-height: 56px;
        }
        .active{
          border-radius: 12px;
        }
      }

    }
  }
}
.right-scroll-list:hover{
  background:rgb(42, 42, 42)
}
</style>
