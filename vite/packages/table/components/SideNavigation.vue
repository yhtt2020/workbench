<template>
    <transition name="fade">
        <div style="width:80px;" v-show="!editFlag">
          <div class="side-nav" id="leftBox">
            <div style="width: 73px;overflow: hidden;" class="flex flex-col  items-center w-full">
              <div style="overflow: hidden;" id="sideNavList"
              class="flex flex-col items-center  flex-nowrap scroll-content" ref="sideContent">
                <div v-for="item in sideNavigationList" :key="item.name" style="margin: 20px 0;">
                  <div v-if="item.type==='systemApp'" style="display: flex;justify-content: center;align-items: center;margin: 0 auto;border-radius: 12px">
                    <Icon :icon="item.icon" style="width: 40px;height: 40px;color:rgba(255, 255, 255, 0.4);" ></Icon>
                  </div>
                  <a-avatar v-else :size="40" shape="square" :src="item.icon"></a-avatar>
                </div>
              </div>
            </div>
            <div>
              <Icon icon="tianjia" style="width: 56px;height: 56px;color:rgba(255, 255, 255, 0.4);"  class="pointer" @click="addEdit('left')"></Icon>
            </div>
          </div>
        </div>
    </transition>
  
    <transition name="fade">
    <Classification :navClassify="navClassify" v-if="editFlag" v-model:show="editFlag" @clickLeftList="clickItem" @load="addNav">
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
  import listItem from "./bottomPanel/listItem.vue";
  import {mapActions, mapWritableState} from "pinia";
  import {cardStore} from "../store/card";
  import {navStore} from "../store/nav";
  import ScrolX from './ScrolX.vue'
  import Sortable from 'sortablejs';
  import navigationData from '../js/data/tableData'
  import Classification from "./comp/Classification.vue";
  const { appModel } = window.$models
  export default {
    name: "SideNavigation",
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
            editFlag:false,
            activeRightItem:0,
            nowClassify:'systemApp',
            navClassify:[
                ...navigationData.navigationClassify
            ],
            ClassifyData:[
                ...navigationData.coolAppList,...navigationData.systemAppList
                ],
            dropList:[],
        }
    },
    computed:{
      ...mapWritableState(cardStore, ['routeParams']),
      ...mapWritableState(navStore, ['sideNavigationList']),
      filterList(){
        return this.ClassifyData.filter(i =>{return i.type === this.nowClassify&&i.name.includes(this.selectContent)})
      }
    },
    components:{
      ScrolX,
      listItem,
      Classification
    },
    created() {
      this.loadDeskIconApps()
    },
    mounted() {
      let that = this
      this.scrollNav('sideContent','scrollTop')
      this.$nextTick(()=>{
        this.colDrop()
      })
  
    },
    methods:{
        scrollNav(refVal,scrollDirection){
          let content = this.$refs[refVal]
            content.addEventListener('wheel',(event) => {
            event.preventDefault();
            content[scrollDirection] += event.deltaY
          });
        },
      ...mapActions(navStore, ['setSideNavigationList','sortSideNavigationList','removeSideNavigationList']),
      colDrop(){
        let that = this;
        let side = document.getElementById('sideNavList')
        Sortable.create(side, {
          sort: true,
          animation: 150,
          direction: 'horizontal',
          onStart: function(event){
            let delIcon = document.getElementById('delIcon')
            delIcon.ondragover= function (ev) {
             ev.preventDefault()
            }
            delIcon.ondrop=function (ev) {
                that.removeSideNavigationList(event.oldIndex)
                that.navText = true
            }
          },
          onUpdate:function(event){
            let newIndex = event.newIndex,
              oldIndex = event.oldIndex
            let  newItem = side.children[newIndex]
            let  oldItem = side.children[oldIndex]
            // 先删除移动的节点
            side.removeChild(newItem)
            // 再插入移动的节点到原有节点，还原了移动的操作
            if(newIndex > oldIndex) {
              side.insertBefore(newItem,oldItem)
            } else {
              side.insertBefore(newItem,oldItem.nextSibling)
            }
            that.sortSideNavigationList(event)
          },
          onEnd: function(event){
            that.navText = true
          }
        });
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
      async loadDeskIconApps () {
       const lightApps = await appModel.getAllApps()
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
      addEdit(val){
        this.editFlag = true;
      },
      closeAdd(){
        this.editFlag = false;
      },
      clickRightListItem(item,index){
        this.activeRightItem = index
        this.editFlag = false;
        
        if(item instanceof Array){
        for (let i = 0; i < item.length; i++) {
            if(!this.sideNavigationList.find(j => j.name===item[i].name))
            this.setSideNavigationList(item[i])
        }
            this.dropList=[];
        } else{
            for (let i = 0; i < this.sideNavigationList.length; i++) {
            if(this.sideNavigationList[i].name ===item.name)return
            }
            this.setSideNavigationList(item)
            this.$nextTick(() => {
            let scrollElem = this.$refs.sideContent;
            scrollElem.scrollTo({ top: scrollElem.scrollHeigth, behavior: 'smooth' });
            });
        }
      },
    },
  }
  </script>
  <style lang="scss" scoped>
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
            // background: rgba(42, 42, 42, 1);
          }
        }
  
      }
    }
  }
  .right-scroll-list:hover{
    background:rgb(42, 42, 42)
  }
  </style>
  