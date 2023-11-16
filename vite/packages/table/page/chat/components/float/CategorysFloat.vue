<template>
 <div class="flex flex-col">
  <div class="w-full mb-2.5 flex  justify-between items-center">
    <span class=" font-bold text-lg truncate" style="color:var(--primary-text);">{{ categoryList.name }}</span>
    <ChatDropDown newIcon="fluent:line-horizontal-3-20-filled" :list="floatList" /> 
  </div>
  <div class="font-14 mb-2 summary font-12 font-400 xt-font xt-text-2"  :style="isDoubleColumn ? { width:'323px' } : {width:'215px'} ">
    {{ categoryList.summary }}
  </div> 
  <div class="ml-1 font-12 font-400 xt-font xt-text-2 mb-2 ">
   社群号：{{ categoryList.no }}
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
 </div>

 <a-divider style="height: 2px;margin: 12px 0 0 0; background-color: var(--divider)"/>

 <template v-if="categoryList?.tree?.length === 0 ">
  <div class="flex items-center h-full justify-center flex-col" v-if="categoryList?.role !== 'member'">
    <EmptyAdd :no="categoryList.no"/>
  </div>

  <div v-else  class="flex items-center h-full justify-center">
    <a-empty :image="emptyImage" description="这里还没有内容"></a-empty>
  </div>
 </template>


 <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;" v-else>
  <template  v-if="!isDoubleColumn">
    <div class="flex flex-col">
      <div v-for="item in channelList" :class="{'active-bg': currentID ===item.id}" class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item">
        <MenuDropdown :type="item.type" :no="communityID" :item="item"  @currentItem="currentItem"/>
      </div>
    </div>
  </template>

  <template v-else>
    <div class="flex grid grid-cols-2 gap-1">
      <div v-for="item in channelList" :class="{'active-bg': currentID ===item.id}" class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item">
        <MenuDropdown :type="item.type" :no="categoryList.no" :item="item" @currentItem="currentItem"/>
      </div>
    </div>
  </template>


  <div v-for="(item,index) in categoryFilterList" class="my-3" >
    <xt-menu name="name" :menus="floatMenu" @contextmenu="revID = item">
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
    </xt-menu>
  </div>
 </vue-custom-scrollbar>

 <AddNewCategory ref="addCategoryRef" :no="categoryList.no"/>
 <AddNewGroup ref="addNewRef" :no="categoryList.no"/>
 <AddInvite ref="addInviteRef" :no="categoryList.no"/>

 <PacketSetting ref="packRef" :no="categoryList.no" :item="categoryItem"/>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { chatStore } from '../../../../store/chat'
import { communityStore } from '../../store/communityStore'
import { Icon as CommunityIcon } from '@iconify/vue'
import { Modal,message } from 'ant-design-vue'

import ChatDropDown from './Dropdown.vue';
import ChatFold from './ChatFolds.vue';
import MenuDropdown from './MenuDropdowns.vue';
import EmptyAdd from '../empty/EmptyAdd.vue';
import AddNewCategory from '../add/AddNewCategory.vue';
import AddNewGroup from '../add/AddNewGroup.vue';
import AddInvite from '../add/AddInvite.vue';
import PacketSetting from '../knownCategory/PacketSettings.vue'


export default{
  props:[ 'communityID','float' ],

  components:{
    CommunityIcon,ChatDropDown,ChatFold,MenuDropdown,EmptyAdd,
    AddNewCategory,AddNewGroup,AddInvite,PacketSetting
  },

  data(){
    return{
      currentID:'',
      emptyImage:'/img/state/null.png',
      showMenuIndex:-1,    
      categoryItem:{},
      revID:'',
      
      settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
      floatMenu:[
        {
          name:'分组设置',
          newIcon:'fluent:settings-16-regular',
          callBack:()=>{
            this.categoryItem = this.revID
            this.$refs.packRef.openSetModal()
          }
        },
        {
          name:'删除分组',
          newIcon:'akar-icons:trash-can',
          color: 'var(--error)',
          callBack:()=>{
            Modal.confirm({
              content:'删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？',
              centered:true,
              onOk: async ()=>{
                const comNo = parseInt(this.categoryList.no)
                // console.log('查看comNo',comNo);
                if(comNo !== NaN && comNo !== undefined){
                  this.removeCategory(this.revID.id,comNo)
                  message.success('删除成功')
                }else{
                  return
                }
              }
            })
          }
        }
      ],
      hideList:[
        {
          icon:'fluent:people-add-16-regular',title:'邀请其他人',
          callBack:()=>{ this.$refs.addInviteRef.openAddInvite() }
        },
        {
          icon:'fluent:apps-add-in-20-filled',title:'添加新应用',
          callBack:()=>{ this.$refs.addCategoryRef.openAddNewCategory() }
        },
        {
          icon:'fluent:add-16-filled',title:'添加新分组',
          callBack:()=>{ this.$refs.addNewRef.openAddModal() }
        },
        {
          icon:'fluent:text-indent-decrease-16-filled',title:'展开边栏',
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
          icon:'fluent:people-add-16-regular',title:'邀请其他人',
          callBack:()=>{ this.$refs.addInviteRef.openAddInvite()  }
        },
        {
          icon:'fluent:apps-add-in-20-filled',title:'添加新应用',
          callBack:()=>{ this.$refs.addCategoryRef.openAddNewCategory() }
        },
        {
          icon:'fluent:add-16-filled',title:'添加新分组',
          callBack:()=>{ this.$refs.addNewRef.openAddModal() }
        },
        // {icon:'',title:'社群管理',type:'manage'},
        // {icon:'ant-design:team-outlined',title:'成员管理',type:'manage'},
        {
          icon:'fluent:text-indent-decrease-16-filled',title:'收起边栏',
          callBack:()=>{ this.setFloatVisible(true) }
        },
        {
          icon:'fluent:apps-list-detail-24-regular',title:'切换双/单列',
          callBack:()=>{ this.setDouble() }
        },
      ]
    }
  },

  computed:{
    ...mapWritableState(communityStore,['categoryList']),
    ...mapWritableState(chatStore,['settings']),
    isDoubleColumn(){
      return this.settings.showDouble
    },
    floatList(){  // 下拉菜单列表
      if(this.settings.enableHide){
        return this.hideList
      }else{
        return this.showList
      }
    },

    channelList(){
      // console.log('获取数据::>>111',this.categoryList.tree.length);
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
    ...mapActions(communityStore,['removeCategory','getCategoryData','getChannelList']),
    ...mapActions(chatStore,['setFloatVisible','setDouble']),
    currentItem(item){
      // console.log('排查当前点击::>',item);
      this.currentID = item.id
      this.categoryItem = item
      this.$mit.emit('clickItem',item)
    },

  },
}


</script>

<style lang="scss" scoped>
.active-bg {
 background: var(--active-secondary-bg);
}
.summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: break-spaces;
  overflow: hidden;
  margin: 0 !important;
  font-size: 14px;
  color: var(--primary-text);
  font-weight: 400;
}
</style>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s, opacity 0.3s; /* 控制菜单的动画时间 */
}

.slide-fade-enter {
  transform: translateY(-20px); /* 菜单初始位置 */
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateY(0); /* 菜单最终位置 */
  opacity: 1;
}

.slide-fade-leave {
  transform: translateY(0); /* 菜单初始位置 */
  opacity: 1;
}

.slide-fade-leave-to {
  transform: translateY(-20px); /* 菜单最终位置 */
  opacity: 0;
}
</style>