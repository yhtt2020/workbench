<template>
  <div :style="singDoubleCol ? { width:'336px',height:'150px' } : {width:'240px',height:'130px'} " class="relative">
    <img :src="textUrl" class="w-full h-full object-cover" :class="suspension ? 'rounded-t-xl':''"/>
    <div class="community-name h-11 w-full com-line-bg">
      <div class="m-1.5 px-3 items-center drop-hover rounded-lg flex justify-between h-8">
        <ChatDropDown class="w-full" :enableButton="false"  newIcon="fluent:line-horizontal-3-20-filled" :list="dropMenuList" :title="floatData.name" /> 
      </div>
    </div>
  </div>

  <div :style="suspension ? {height:'450px'}:{}">
    <div class="px-3 h-full flex  flex-col justify-between my-2" :style="singDoubleCol ? { width:'336px' } : {width:'240px'} " >
      <template v-if="singDoubleCol">
        <div class="font-14 summary font-400 mb-3 xt-font xt-text-2 summary-2">{{ floatData.summary }}</div>
        <div class="w-full flex items-center justify-start">
          <div class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mb-2 " :class="suspension ? '' :'xt-bg'" style="width:120px;">
           社群号：{{ floatData.no }}
          </div>
        </div>
        <div>
         <a-row :gutter="10">
          <a-col flex="55px" class="mt-1 text-right">
            <span class="px-2 rounded-full xt-active-bg xt-active-text"> {{ floatData.level }} 级</span>
          </a-col>
          <a-col flex="auto" style="padding-top: 3px">
            <a-progress :show-info="false" strokeColor="var(--active-bg)" :percent="floatData.level"></a-progress>
          </a-col>
         </a-row>
        </div>
      </template>
      <template v-else>
        <div class="flex  items-center" hidden="">
          <div class="font-14 summary font-400 mb-3 xt-font xt-text-2" :class="collapsed ? 'summary-3' :'summary-1'">{{ floatData.summary }}</div>
          <xt-button w="32" h="32" style="background: none !important;" @click="openHideContent">
            <div class="flex items-center justify-center" v-if="collapsed">
              <CommunityIcon icon="fluent:caret-down-16-filled" style="font-size: 1rem;" />
            </div>
            <div class="flex items-center justify-center" v-else>
              <CommunityIcon icon="fluent:caret-up-16-filled" style="font-size: 1rem;" />
            </div>
          </xt-button>
          <div class="flex items-center mt-2">
            <span class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mr-3 " :class="suspension ? '' :'xt-bg'">
              社群号：{{floatData?.no }}
            </span>
            <span class="px-2 rounded-md xt-active-bg xt-active-text"> {{ floatData.level }} 级</span>
          </div>
          <a-progress :show-info="false" strokeColor="var(--active-bg)" v-if="collapsed" :percent="floatData.level"></a-progress>
        </div>
        <div class="flex items-center mt-2">
          <span class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mr-3 " :class="suspension ? '' :'xt-bg'">
            社群号：{{floatData.no }}
          </span>
          <span class="px-2 rounded-md xt-active-bg xt-active-text"> {{ floatData.level }} 级</span>
        </div>
        <a-progress :show-info="false" strokeColor="var(--active-bg)" v-if="collapsed" :percent="floatData.level"></a-progress>
      </template>

      <a-divider style="height: 2px;margin:8px 0;border-top:1px solid var(--divider) !important;"/>
      
      <template v-if="floatData.isEmptyData.length === 0">
        <div class="flex items-center justify-center flex-col" v-if="floatData.role !== 'member'" style="height:450px;">
          <EmptyAdd :no="no"/>
        </div>
        <div v-else  class="flex items-center h-full justify-center" style="height:450px;">
          <a-empty :image="emptyImage" description="这里还没有内容"></a-empty>
        </div>
      </template>
     
      
      <vue-custom-scrollbar :settings="settingsScroller" style="height:60vh;" v-else>
        <template  v-if="singDoubleCol === false && floatData.channelList.length !== 0">
          <div class="flex flex-col" :class="floatData.channelList.length !== 0 ? 'mb-3' : 'm-0'">
            <div v-for="channel in floatData.channelList" :class="{'xt-theme-bg-2': currentID === channel.id}" class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item" @click="currentItem(channel)">
              <MenuDropdown :type="channel.type" :no="no" :item="channel"  @click="currentItem(channel)"/>
            </div>
          </div>
        </template>
        <template v-else-if="floatData.channelList?.length !== 0">
          <div class="flex grid grid-cols-2 gap-1 "  :class="floatData.channelList.length !== 0 ? 'mb-3' : 'm-0'">
            <div v-for="channel in floatData.channelList" :class="{'xt-theme-bg-2': currentID ===channel.id}"  class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item"  @click="currentItem(channel)">
              <MenuDropdown :type="channel.type" :no="no" :item="channel"  @click="currentItem(channel)"/>
            </div>
          </div>
        </template>
        <div v-for="item in floatData.categoryList">
          <ChatFold :title="item.name" :content="item" :show="true" :no="no">
              <div class="flex flex-col" v-if="singDoubleCol === false">
                <div v-for="children in item.children" :class="{'xt-theme-bg-2':currentID === children.id}" class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item" @click="currentItem(children)">
                  <MenuDropdown :type="children.type" :no="no" :item="children"  @click="currentItem(children)"/>
                </div>
              </div>
              <div class="flex grid grid-cols-2 gap-1" v-else>
                <div v-for="children in item.children" :class="{'xt-theme-bg-2':currentID === children.id}"  class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item" @click="currentItem(children)">
                  <MenuDropdown :type="children.type" :no="no" :item="children"  @click="currentItem(children)"/>
                </div>
              </div>
          </ChatFold>
        </div>
      </vue-custom-scrollbar >      
    </div>
  </div>

  <AddNewCategory ref="addCategoryRef" :no="no"/>
  <AddNewGroup ref="addNewRef" :no="no"/> 
  <!-- <AddInvite ref="addInviteRef" :no="no"/> -->
</template>

<script setup>
import { ref,toRefs,watch,computed, reactive,getCurrentInstance,} from 'vue';
import { storeToRefs } from 'pinia';
import { chatStore } from '../../../../store/chat';
import { communityStore } from '../../store/communityStore';
import { Icon as CommunityIcon } from '@iconify/vue';
import { Modal,message } from 'ant-design-vue';
import _ from 'lodash-es';
import { useRoute } from 'vue-router';
import { isEmptyList } from '../../libs/utils'

import ChatDropDown from './Dropdown.vue';
import ChatFold from './ChatFolds.vue';
import MenuDropdown from './MenuDropdowns.vue';
import EmptyAdd from '../empty/EmptyAdd.vue';
import AddNewCategory from '../add/AddNewCategory.vue';
import AddNewGroup from '../add/AddNewGroup.vue';
import AddInvite from '../add/AddInvite.vue';

const com = communityStore();
const chat = chatStore();
const route = useRoute();
const { community } = storeToRefs(com);
const { settings } = storeToRefs(chat);

const props = defineProps({no:String});
const { proxy } = getCurrentInstance();

const addCategoryRef = ref(null);
const addNewRef = ref(null);
// 悬浮模式开启下拉菜单
const topHideMenus = ref([
  // {
  //   newIcon:'fluent:people-add-16-regular',title:'邀请其他人',
  //   callBack:()=>{ this.$refs.addInviteRef.openAddInvite() }
  // },
  {
    newIcon:'fluent:apps-add-in-20-filled',title:'添加新应用',
    callBack:()=>{ addCategoryRef.value.openAddNewCategory() }
  },
  {
    newIcon:'fluent:add-16-filled',title:'添加新分组',
    callBack:()=>{ addNewRef.value.openAddModal() }
  },
  {
    newIcon:'fluent:text-indent-decrease-16-filled',title:'展开边栏',
    callBack:()=>{ chat.setFloatVisible(false) }
  },
  // {
  //   newIcon:'fluent:settings-16-regular',title:'社群设置(开发中)',type:'manage',
  //   callBack:()=>{
  //     this.$mit.emit('currentSet',{type:'communitySet',data:this.data})
  //   }
  // },
  // {icon:'ant-design:team-outlined',title:'成员管理',type:'manage'},
  // {
  //   icon:'fluent:apps-list-detail-24-regular',title:'切换双/单列',
  //   callBack:()=>{ this.setDouble() }
  // },
])
// 悬浮模式关闭下拉菜单
const topShowMenus = ref([
  {
    newIcon:'fluent:apps-add-in-20-filled',title:'添加新应用',
    callBack:()=>{ addCategoryRef.value.openAddNewCategory() }
  },
  {
    newIcon:'fluent:add-16-filled',title:'添加新分组',
    callBack:()=>{addNewRef.value.openAddModal() }
  },
  {
    newIcon:'fluent:text-indent-decrease-16-filled',title:'收起边栏',
    callBack:()=>{ chat.setFloatVisible(true) }
  },
  {
    newIcon:'fluent:apps-list-detail-24-regular',title:'切换双/单列',
    callBack:()=>{ chat.setDouble() }
  },
  // {
  //   newIcon:'fluent:people-add-16-regular',title:'邀请其他人',
  //   callBack:()=>{ this.$refs.addInviteRef.openAddInvite()  }
  // },
  // {
  //   newIcon:'fluent:settings-16-regular',title:'社群设置(开发中)',type:'manage',
  //   callBack:()=>{
  //     this.$mit.emit('currentSet',{type:'communitySet',data:this.data})
  //   },
  // },
  // {icon:'ant-design:team-outlined',title:'成员管理',type:'manage'},
])
// 不是社群管理员情况下的下拉菜单
const adminMenus = ref([
  {
    newIcon:'fluent:text-indent-decrease-16-filled',title:'收起边栏',
    callBack:()=>{ chat.setFloatVisible(true) }
  },
  {
    newIcon:'fluent:apps-list-detail-24-regular',title:'切换双/单列',
    callBack:()=>{ chat.setDouble() }
  },
  {
    newIcon:'fluent:arrow-exit-20-filled',title:'退出社群',
    callBack:()=>{
      // todo 社群退出操作
    }
  }
])
const data = reactive({
  emptyImage:'/img/state/null.png',
  textUrl:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Yzzj-zana-AI6F-jnTG',
  collapsed:false,
  settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
  },
  currentID:'',
  categoryItem:{},
})
// 通过计算属性来判断社群中间部分是单列还是双列
const singDoubleCol = computed(()=>{
  return settings.value.showDouble;
})
// 通过计算属性来判断有没有开启悬浮模式
const suspension = computed(()=>{
  return settings.value.enableHide;
})
// 通过计算属性获取下拉的数据
const dropMenuList = computed(()=>{
  const findInfo = _.find(community.value.communityList,function (find) { return String(find.no) === String(props.no); });
  // 社群是否为创建者
  const isAdmin = findInfo?.role !== 'member';
  // 判断有没有开启悬浮模式
  const isSuspension = suspension.value;
  if(isAdmin){
    if(isSuspension){
      return topHideMenus.value;
    }else{
      return topShowMenus.value;
    }
  }
  else{ return adminMenus.value; };
})
// 当前点击
const currentItem = (item) =>{
  data.currentID  = item.id;
  data.categoryItem = item;
  proxy.$bus.emit('clickItem',item);
}
// 展示单列时所有内容
const openHideContent = () =>{
 data.collapsed = !data.collapsed
}


// 通过计算属性获取数据
const floatData = computed(()=>{
  const no = settings.value.enableHide ? props.no : route.params.no;
  const communityData = { info:{},channelList:[],categoryList:[],list:[] };
  // 通过定义临时缓存来获取社群频道树状数据和基本信息以及社群ID号no
  const infoArr = community.value.communityList;
  if(!isEmptyList(infoArr)) return communityData.info = {} ;
  // 通过no获取社群基本信息
  const findInfo = _.filter(infoArr,function(find){ return String(find.no) === String(no) });
  if(!isEmptyList(findInfo)) return communityData.info = {} ;
  communityData.info = {...findInfo[0]};
  // 获取子级频道
  const treeArr = community.value.communityTree;
  if(!isEmptyList(treeArr)){ communityData.list = []; }
  else { 
    const findTree = _.filter(treeArr,function(find){  if(find){ return String(find.no) === String(no) }  });
    if(isEmptyList(findTree)){
      communityData.list = findTree[0].tree 
      // 获取category和channel数据
      const filterCategory = _.filter(findTree[0].tree,function(item){ return item.role === "category" });
      if(isEmptyList(filterCategory)){ communityData.categoryList = filterCategory }
      const filterChannel = _.filter(findTree[0].tree,function(item){  return item.role === "channel" });
      if(isEmptyList(filterChannel)){ communityData.channelList = filterChannel }
    }
  }
  return {
    isEmptyData:communityData.list.length !== 0 ? communityData.list : [],
    ...communityData.info,
    channelList:isEmptyList(communityData.channelList) ? communityData.channelList : [],
    categoryList:isEmptyList(communityData.categoryList) ? communityData.categoryList :[],
  }
})



const { emptyImage,textUrl,collapsed,settingsScroller,categoryItem,currentID } = toRefs(data);
</script>

<style lang="scss" scoped>
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

 .group-item{
  &:hover{
    background: var(--active-secondary-bg) !important;
  }
 }
</style>