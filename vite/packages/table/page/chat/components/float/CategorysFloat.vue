<template>
 <div :style="isDoubleColumn ? { width:'336px' } : {width:'240px'} " class="relative">
  <img :src="textUrl" class="w-full h-full object-cover" :class="settings.enableHide ? 'rounded-t-xl':''"/>
  <div class="community-name h-11 w-full" :class="isDoubleColumn ? 'com-line-bg':''">
    <div class="m-1.5 px-3 items-center drop-hover rounded-lg flex justify-between h-8">
      <ChatDropDown class="w-full" newIcon="fluent:line-horizontal-3-20-filled" :title="categoryList.name" :list="floatList" /> 
    </div>
  </div>
 </div>
 <div :style="settings.enableHide ? {height:'450px'}:{}">
  <div class="px-3 h-full flex  flex-col justify-between my-2" :style="isDoubleColumn ? { width:'336px' } : {width:'240px'} " >
    <!-- 双列 -->
    <template v-if="isDoubleColumn">
      <div class="font-14 summary font-400 mb-3 xt-font xt-text-2 summary-2">
        {{ categoryList.summary }}
      </div>
      <div class="w-full flex items-center justify-start">
        <div class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mb-2 " :class="settings.enableHide ? '' :'xt-bg'" style="width:120px;">
          社群号：{{ categoryList.no }}
        </div>
      </div>
      <div>
        <a-row :gutter="10">
         <a-col flex="55px" class="mt-1 text-right">
           <span class="px-2 rounded-full xt-active-bg xt-active-text">0 级</span>
         </a-col>
         <a-col flex="auto" style="padding-top: 3px">
           <a-progress :show-info="false" strokeColor="var(--active-bg)" :percent="10"></a-progress>
         </a-col>
        </a-row>
      </div>
    </template>
    <!-- 单列 -->
    <template v-else>
      <div class="flex  items-center" hidden="">
        <div class="font-14 summary font-400 mb-3 xt-font xt-text-2" :class="collapsed ? 'summary-3' :'summary-1'">
          {{ categoryList.summary }}
        </div>
        <xt-button w="32" h="32" style="background: none !important;" @click="openHideContent">
          <div class="flex items-center justify-center" v-if="collapsed">
            <CommunityIcon icon="fluent:caret-down-16-filled" style="font-size: 1.25rem;" />
          </div>
          <div class="flex items-center justify-center" v-else>
            <CommunityIcon icon="fluent:caret-up-16-filled" style="font-size: 1.25rem;" />
          </div>
        </xt-button>
      </div>
      <a-progress :show-info="false" strokeColor="var(--active-bg)" v-if="collapsed" :percent="10"></a-progress>
      <div class="flex items-center mt-2">
        <span class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mr-3 " :class="settings.enableHide ? '' :'xt-bg'">
          社群号：{{ categoryList.no }}
        </span>
        <span class="px-2 rounded-md xt-active-bg xt-active-text">0 级</span>
      </div>
    </template>
    <a-divider style="height: 2px;margin:8px 0;border-top:1px solid var(--divider) !important;"/>
    <!-- 空状态 -->
    <template v-if="categoryList?.tree?.length === 0 ">
      <div class="flex items-center justify-center flex-col" v-if="categoryList?.role !== 'member'" style="height:450px;">
        <EmptyAdd :no="categoryList.no"/>
      </div>
      <div v-else  class="flex items-center h-full justify-center" style="height:450px;">
        <a-empty :image="emptyImage" description="这里还没有内容"></a-empty>
      </div>
    </template>
    <!-- 内容区域 -->
    <vue-custom-scrollbar :settings="settingsScroller" style="height:60vh;" v-else>
      <template  v-if="!isDoubleColumn">
        <div class="flex flex-col" :class="channelList.length !== 0 ? 'mb-3' : 'm-0'">
          <div v-for="item in channelList" :class="{'active-bg': currentID ===item.id}" class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item">
            <MenuDropdown :type="item.type" :no="communityID" :item="item"  @currentItem="currentItem"/>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex grid grid-cols-2 gap-1 " :class="channelList.length !== 0 ? 'mb-3' : 'm-0'">
          <div v-for="item in channelList" :class="{'active-bg': currentID ===item.id}" class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item">
            <MenuDropdown :type="item.type" :no="categoryList.no" :item="item" @currentItem="currentItem"/>
          </div>
        </div>
      </template>
      <div v-for="(item,index) in categoryFilterList" >
        <ChatFold :title="item.name" :content="item" :show="true" :no="categoryList.no">
          <div class="flex flex-col" v-if="isDoubleColumn === false">
            <div v-for="(item,index) in item.children" :class="{'active-bg':currentID === item.id}" class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item">
              <MenuDropdown :type="item.type" :no="categoryList.no" :item="item" @currentItem="currentItem"/>
            </div>
          </div>
          <div class="flex grid grid-cols-2 gap-1" v-else>
            <div v-for="(item,index) in item.children" :class="{'active-bg':currentID === item.id}" class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item">
              <MenuDropdown :type="item.type" :no="categoryList.no" :item="item" @currentItem="currentItem" />
            </div>
          </div>
        </ChatFold>  
      </div>
    </vue-custom-scrollbar>
  </div>
 </div>
 <AddNewCategory ref="addCategoryRef" :no="categoryList.no"/>
 <AddNewGroup ref="addNewRef" :no="categoryList.no"/>
 <AddInvite ref="addInviteRef" :no="categoryList.no"/>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { chatStore } from '../../../../store/chat';
import { communityStore } from '../../store/communityStore';
import { Icon as CommunityIcon } from '@iconify/vue';
import { Modal,message } from 'ant-design-vue';

import ChatDropDown from './Dropdown.vue';
import ChatFold from './ChatFolds.vue';
import MenuDropdown from './MenuDropdowns.vue';
import EmptyAdd from '../empty/EmptyAdd.vue';
import AddNewCategory from '../add/AddNewCategory.vue';
import AddNewGroup from '../add/AddNewGroup.vue';
import AddInvite from '../add/AddInvite.vue';

export default{
  props:[ 'communityID','float' ],

  components:{
    CommunityIcon,ChatDropDown,ChatFold,MenuDropdown,EmptyAdd,
    AddNewCategory,AddNewGroup,AddInvite,
  },

  data(){
    return{
      currentID:'',
      emptyImage:'/img/state/null.png',
      showMenuIndex:-1,    
      categoryItem:{},
      textUrl:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Yzzj-zana-AI6F-jnTG',
      revID:'',
      settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
      // floatMenu:[
      //   {
      //     name:'分组设置',
      //     newIcon:'fluent:settings-16-regular',
      //     callBack:()=>{
      //       this.$refs.packRef.openSetModal()
      //     }
      //   },
      //   {
      //     name:'删除分组',
      //     newIcon:'akar-icons:trash-can',
      //     color: 'var(--error)',
      //     callBack:()=>{
      //       Modal.confirm({
      //         content:'删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？',
      //         centered:true,
      //         onOk: async ()=>{
      //           const comNo = parseInt(this.categoryList.no)
      //           if(comNo !== NaN && comNo !== undefined){
      //             this.removeCategory(this.revID.id,comNo)
      //             message.success('删除成功')
      //           }else{
      //             return
      //           }
      //         }
      //       })
      //     }
      //   }
      // ],
      hideList:[
        {
          newIcon:'fluent:people-add-16-regular',title:'邀请其他人',
          callBack:()=>{ this.$refs.addInviteRef.openAddInvite() }
        },
        {
          newIcon:'fluent:apps-add-in-20-filled',title:'添加新应用',
          callBack:()=>{ this.$refs.addCategoryRef.openAddNewCategory() }
        },
        {
          newIcon:'fluent:add-16-filled',title:'添加新分组',
          callBack:()=>{ this.$refs.addNewRef.openAddModal() }
        },
        {
          newIcon:'fluent:text-indent-decrease-16-filled',title:'展开边栏',
          callBack:()=>{ this.setFloatVisible(false) }
        },
        // {icon:'',title:'社群管理',type:'manage'},
        // {icon:'ant-design:team-outlined',title:'成员管理',type:'manage'},
        // {
        //   icon:'fluent:apps-list-detail-24-regular',title:'切换双/单列',
        //   callBack:()=>{ this.setDouble() }
        // },
      ],
      showList:[
        {
          newIcon:'fluent:people-add-16-regular',title:'邀请其他人',
          callBack:()=>{ this.$refs.addInviteRef.openAddInvite()  }
        },
        {
          newIcon:'fluent:apps-add-in-20-filled',title:'添加新应用',
          callBack:()=>{ this.$refs.addCategoryRef.openAddNewCategory() }
        },
        {
          newIcon:'fluent:add-16-filled',title:'添加新分组',
          callBack:()=>{ this.$refs.addNewRef.openAddModal() }
        },
        // {icon:'',title:'社群管理',type:'manage'},
        // {icon:'ant-design:team-outlined',title:'成员管理',type:'manage'},
        {
          newIcon:'fluent:text-indent-decrease-16-filled',title:'收起边栏',
          callBack:()=>{ this.setFloatVisible(true) }
        },
        {
          newIcon:'fluent:apps-list-detail-24-regular',title:'切换双/单列',
          callBack:()=>{ this.setDouble() }
        },
      ],
      collapsed:false,
    }
  },

  computed:{
    ...mapWritableState(communityStore,['categoryList']),
    ...mapWritableState(chatStore,['settings']),
    isDoubleColumn(){
      return this.settings.showDouble
    },
    // 下拉菜单列表
    floatList(){  
      if(this.settings.enableHide){
        return this.hideList
      }else{
        return this.showList
      }
    },
    channelList(){
      if(this.categoryList.tree !== undefined){
        const list = this.categoryList.tree.filter((item)=>{
         return item.role !== 'category'
        })
        return list
      }else{
        return []
      }
    },
    categoryFilterList(){
      // console.log('获取数据::>>222',this.categoryList.tree.length);
      if(this.categoryList.tree !== undefined){
        const list = this.categoryList.tree.filter((item)=>{
         return item.role !== 'channel'
        })
        return list
      }else{
        return []
      }
    
    }
  },

  methods:{
    ...mapActions(communityStore,['removeCategory']),
    ...mapActions(chatStore,['setFloatVisible','setDouble']),
    currentItem(item){
      this.currentID = item.id
      this.categoryItem = item
      this.$mit.emit('clickItem',item)
    },
    // 展示单列时所有内容
    openHideContent(){
      this.collapsed = !this.collapsed
    }
  },
}
</script>

<style lang="scss" scoped>
.active-bg {
 background: var(--active-secondary-bg);
}
.summary-2{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: break-spaces;
  overflow: hidden;
  color: var(--primary-text);
  max-width: 312px;
}
.summary-1{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  white-space: break-spaces;
  overflow: hidden;
  margin: 0 !important;
  color: var(--primary-text);
  max-width: 185px;
}
.summary-3{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  white-space: break-spaces;
  overflow: hidden;
  margin: 0 !important;
  color: var(--primary-text);
  max-width: 185px;
}
.community-name{
  position: absolute;
  bottom:0;
}
.com-line-bg{
  background: linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.70) 100%);
}
.drop-hover{
  &:hover{
    background: var(--primary-bg);
  }
}
</style>
