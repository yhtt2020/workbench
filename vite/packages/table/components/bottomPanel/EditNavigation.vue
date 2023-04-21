<template>
  <transition name="fade">
    <div class="back pointer no-drag" @click="onBack" v-show="!editFlag">
      <Icon icon="xiangzuo" style="height: 24px;width: 24px"></Icon>
      <span>返回</span>
    </div>
  </transition>
  <transition name="fade">
  <div class="content flex flex-col" v-show="!editFlag">
    <span>快捷导航栏</span>
    <span>点击添加更多快捷方式，支持长按拖拽排序，左右滑动查看更多</span>
    <div class="nav-list">
        <div style="height: 73px;overflow: hidden;" class="flex flex-row  items-center pl-2 w-full">
        <div style="overflow: hidden;overflow-x: auto;" id="navList"
             class="flex flex-row items-center  flex-nowrap scroll-content mr-2" ref="content">
        <div v-for="(item,index) in navigationList" class="mr-6" :key="navigationList.name">
          <a-dropdown  :trigger="['contextmenu']">
                <div style="width: 56px;height: 56px;display: flex;justify-content: center;align-items: center;background: rgba(33, 33, 33, 1);border-radius: 12px" v-if="item.type==='systemApp'">
                  <Icon :icon="item.icon" style="width: 32px;height: 32px;color:rgba(255, 255, 255, 0.4);" ></Icon>
                </div>
              <a-avatar :size="40" shape="square" :src="item.icon" v-else></a-avatar>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="deleteEdit(index)">删除</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        </div>
    </div>
      <Icon icon="tianjia" style="width: 56px;height: 56px;color:rgba(255, 255, 255, 0.4);"  class="pointer mr-2" @click="addEdit"></Icon>
      <div style="border-left: 1px solid rgba(255, 255, 255, 0.4);" class="flex justify-center items-center  h-2/3 pointer w-20">
        <Icon icon="appstore-fill" style="width: 48px;height: 48px;"></Icon>
      </div>
    </div>
  </div>
  </transition>
<!--  <div v-show="rubbish" class="absolute bottom-10 h-1/4 w-1/3 left-1/2 -translate-x-1/2 border-dashed rounded-xl " id="navListRubbish">-->
<!--    </div>-->

<!--  <div v-show="rubbish" class="absolute h-1/4 w-1/3 bottom-10 left-1/2 -translate-x-1/2 flex justify-center items-center">-->
<!--    <Icon icon="delete-fill" style="width:18px;height:18px;" class="mr-2"></Icon>-->
<!--    拖到此处删除-->
<!--  </div>-->

  <transition name="fade">
  <Classification :navClassify="navClassify" v-if="editFlag" v-model:show="editFlag" @clickLeftList="clickItem">
    <div v-show="nowClassify!=='localApp'" class="h-full">
      <a-input v-model:value="selectContent" class="no-drag h-10 rounded-xl" placeholder="搜索"  style="background: rgba(42, 42, 42, 0.6);">
        <template #prefix>
          <Icon icon="sousuo" class="text-gray-600"></Icon>
        </template>
      </a-input>
      <vue-custom-scrollbar  key="scrollbar"  :settings="rightScrollbarSettings"
                             class="relative"
                             style="height: calc(100% - 40px);padding: 5px 0">
        <listItem v-for="(item,index) in filterList" :item="item"
                  class=" rounded-xl right-scroll-list" @click="clickRightListItem(item,index)"></listItem>
      </vue-custom-scrollbar>
    </div>
    <div v-show="nowClassify==='localApp'" class="flex flex-col items-start text-zinc-500  h-full">
      <div>1. 点击选择需要添加的应用快捷方式</div>
      <div>2. 拖动应用快捷方式拖放到下方</div>
      <div>3. 支持持批量添加</div>
      <div class="border-dashed w-full h-1/2 mt-2.5 rounded-xl flex flex-row justify-center items-center"  @dragover.prevent="" @drop.prevent="drop">
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
      <div @click="clickRightListItem(dropList)" class="pointer flex justify-center items-center mt-2 w-24 h-12 rounded-xl  " style="background: rgb(42, 42, 42);color: rgba(255, 255, 255, 0.85);">
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
import ScrolX from '../ScrolX.vue'
import Sortable from 'sortablejs';
import navigationData from '../../js/data/tableData'
import Classification from "../comp/Classification.vue";
const {appModel}=window.$models
export default {
  name: "EditNavigation",
  data(){
    return {
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true,
      },
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
      avtiveRightItem:0,
      rubbish:false,
      nowClassify:'systemApp',
      navClassify:[
        ...navigationData.navigationClassify
      ],
      ClassifyData:[
        ...navigationData.coolAppList,...navigationData.systemAppList
        ],
      dropList:[]
    }
  },
  computed:{
    ...mapWritableState(cardStore, ['navigationList','routeParams']),
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
    this.checkScroll()
    let that = this
    window.addEventListener('resize',
      that.checkScroll
    )
    let content = this.$refs.content
    content.addEventListener('wheel',(event) => {
      event.preventDefault();
      content.scrollLeft += event.deltaY
    })
    this.$nextTick(()=>{
      this.rowDrop()
    })
  },
  unmounted() {
    let that = this
      window.removeEventListener('resize', that.checkScroll)
  },
  methods:{
    ...mapActions(cardStore, ['setNavigationList','sortNavigationList','removeNavigationList']),
     rowDrop()  {
       var that = this
       var drop = document.getElementById('navList')
       var dropRubbish = document.getElementById('navListRubbish')
       Sortable.create(drop, {
        group: 'navigation',
        animation: 150,
     onUpdate:function(event){

       var newIndex = event.newIndex,
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
       that.sortNavigationList(event)
     },
         // onChoose: function (/**Event*/evt) {
         //   that.rubbish=true
         // },
         // onUnchoose: function(/**Event*/evt) {
         //    that.rubbish=false
         // },
         // onRemove: function (/**Event*/event) {
         //     that.removeNavigationList(event)
         // },
      });
       // Sortable.create(dropRubbish, {
       //   group: 'navigation',
       //   animation: 150,
       //   onAdd: function (/**Event*/evt) {
       //     let newIndex = evt.newIndex,
       //       oldIndex = evt.oldIndex
       //     let  newItem = dropRubbish.children[newIndex]
       //     dropRubbish.removeChild(newItem)
       //
       //   },
       // });
    },
    checkScroll(){
      this.$nextTick(()=>{
        if(this.$refs.content.offsetHeight-this.$refs.content.clientHeight>0){
          this.$refs.content.style.marginTop='17px'
        }else{
          this.$refs.content.style.marginTop='0px'
        }
      })
    },
    deleteEdit(index){
      this.removeNavigationList(index)
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
       this.avtiveRightItem = 0;
       this.nowClassify = item.name;
    },
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
    addEdit(){
      this.editFlag = true;
    },
    closeAdd(){
      this.editFlag = false;
    },
    clickRightListItem(item,index){
      this.avtiveRightItem = index
      this.editFlag = false;
     if(item instanceof Array){
       for (let i = 0; i < item.length; i++) {
         if(!this.navigationList.find(j => j.name===item[i].name))
         this.setNavigationList(item[i])
       }
       this.dropList=[];
     } else{
       for (let i = 0; i < this.navigationList.length; i++) {
         if(this.navigationList[i].name ===item.name)return
       }
       this.setNavigationList(item)
       this.$nextTick(() => {
         let scrollElem = this.$refs.content;
         scrollElem.scrollTo({ left: scrollElem .scrollWidth, behavior: 'smooth' });
       });
     }


    }
  },
  watch: {
    navigationList : {
      handler(){
        this.checkScroll()
      },
      immediate: true,
      deep:true
    },
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
  margin-left: 24px;
  font-size: 18px;
  font-weight: 400;
  width: 100px;
  height: 48px;
  display: flex;
  justify-content: space-between;
  padding: 0 19px 0 10px;
  align-items: center;
  border-radius: 12px;
  background: rgba(42, 42, 42, 1);
}
.content{
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);

  align-items: center;
  width: 100%;
  >span:nth-child(1){
    font-size: 18px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
  }
  >span:nth-child(2){
    margin-top: 6px;
    font-size: 18px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
  }
  .nav-list{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
    padding-left: 24px;
    min-width: 731px;
    width: 70%;
    height: 80px;
    border-radius: 12px;
    background: rgb(40, 40, 40);
  }
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
          background: rgba(42, 42, 42, 1);
        }
      }

    }
  }
}
.right-scroll-list:hover{
  background:rgb(42, 42, 42)
}
</style>
