<template>
  <div class="flex px-6">
    <div class="flex flex-col" style="width:293px;" >
     <a-input    class="h-11 mb-4"  v-model:value="searchKeyword"  placeholder="搜索" @pressEnter="search" @input="search" style="border-radius: 10px;">
      <template #suffix>
       <DirectlyIcon icon="fluent:search-20-filled" style="font-size: 1.5rem;cursor: pointer;" @click="search"/>
      </template>
     </a-input>

     <template v-if="inviteMode === 'direct'">
      <template v-if="crumbsShow === false">
        <div class="flex my-4" v-if="inviteMode === 'direct'">
          <div class="flex items-center pointer" v-for="item in joinCategory" @click="openCrumbs(item)">
            <div class="flex items-center rounded-lg w-10 h-10 justify-center" :style="{background:`${item.bgColor}`}">
              <DirectlyIcon :icon="item.icon" :style="{color:`${item.iconColor}`}" style="font-size: 1.5rem;"/>
            </div>
            <span class="ml-3 category-16-400" style="color:var(--primary-text);">{{ item.name }}</span>
          </div>
        </div>
  
        <div class="flex items-center justify-between">
         <div class="category-14-400 my-4" style="color: var(--secondary-text);">{{teamTitle}}</div>
         <a-checkbox class="custom-checkbox-font" v-model:checked="settings.isAllSelected" @change="handleSelectAllChange($event)" >全选</a-checkbox>
        </div>
    
        <vue-custom-scrollbar class="flex flex-col" :settings="settingsScroller" style="height:320px;">
         
         <div v-for="(item,index) in teamList" :class="{'select-bg':isSelect(index)}" 
          class="flex rounded-lg items-center pointer mb-2 p-3"
          @click="selectCurrentContact(item)"
         >
         
          <template v-if="item.userInfo">
           <a-avatar :size="32" shape="circle" :src="item.userInfo.avatar"></a-avatar>
           <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.userInfo.nickname }}</span> 
          </template>
          
          <template v-else>
           <a-avatar :size="32" :shape="item.nick ? 'circle' : 'square'" :src="item.avatar"></a-avatar>
           <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.nick ? item.nick : item.name }}</span> 
          </template>
         </div>
        </vue-custom-scrollbar>
      </template>
      
      <FriendCrumb v-else-if="crumbsShow && crumbsType === 'myFriend'" :selectList="selectedList" @currentClick="selectCurrentContact"  @back="crumbsShow = false"/>
      
     </template>

     <template v-else>
      <div class="flex items-center justify-between">
        <div class="category-14-400 my-4" style="color: var(--secondary-text);">{{teamTitle}}</div>
        <a-checkbox class="custom-checkbox-font" v-model:checked="settings.isAllSelected" @change="handleSelectAllChange($event)" >全选</a-checkbox>
      </div>
    
      <vue-custom-scrollbar class="flex flex-col" :settings="settingsScroller" style="height:430px;">
        <div v-for="(item,index) in teamList" :class="{'select-bg':isSelect(index)}" 
         class="flex rounded-lg items-center pointer mb-2 p-3"
         @click="selectCurrentContact(item)"
        >
         
         <template v-if="item.userInfo">
          <a-avatar :size="32" shape="circle" :src="item.userInfo.avatar"></a-avatar>
          <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.userInfo.nickname }}</span> 
         </template>
    
         <template v-else>
          <a-avatar :size="32" :shape="item.nick ? 'circle' : 'square'" :src="item.avatar"></a-avatar>
          <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.nick ? item.nick : item.name }}</span> 
         </template>
        </div>
      </vue-custom-scrollbar>
     </template>
  
  
    </div>
    
    <a-divider type="vertical" style="margin: 0 16px; height: 530px; background-color:var(--divider);" />
  
    <div style="width:293px" class="flex flex-col">
     <div class="mb-4">已选({{ selectedList.length }}个)</div>
  
     <vue-custom-scrollbar class="flex flex-col" :settings="settingsScroller" style="height:440px;">
      <div v-for="item in selectedList"  class="flex rounded-lg items-center justify-between pointer mb-2 p-3">
       <div class="flex items-center" v-if="item.userInfo">
        <a-avatar :size="32" shape="circle" :src="item.userInfo.avatar"></a-avatar>
        <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.userInfo.nickname }}</span>
       </div>
  
       <div class="flex items-center" v-else>
        <a-avatar :size="32" :shape="item.nick ? 'circle' : 'square'" :src="item.avatar"></a-avatar>
        <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.nick ? item.nick : item.name }}</span>
       </div>
  
  
       <div class="flex items-center justify-center category-button" @click="deleteSelected(item)">
        <DirectlyIcon icon="zondicons:minus-solid" style="font-size: 1.29rem;color:var(--secondary-text);" />
       </div>
      </div>
     </vue-custom-scrollbar>
  
     <div class="flex justify-end mt-4">
      <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeButton">取消</XtButton>
      <div class="flex items-center justify-center pointer category-button rounded-lg" style="width: 64px;background: var(--active-bg);">确定</div>
     </div>
  
    </div>
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { appStore } from '../../../../store'
import { Icon as DirectlyIcon } from '@iconify/vue'

import FriendCrumb from '../crumb/FriendCrumb.vue'

export default {
  props:['list','title','no','inviteMode'],

  components:{
    DirectlyIcon,
    FriendCrumb
  },

  data(){
    return {
      searchKeyword:'',
      selectedList:[],
      joinCategory:[
       // { icon:'fluent:people-16-regular',name:'我的组织',type:'myOrganize',bgColor:'var(----active-secondary-bg)',iconColor:'var(--active-bg)' },
       { icon:'fluent:chat-16-regular',name:'我的好友',type:'myFriend',bgColor:'rgba(250,173,20,0.2)',iconColor:'var(--warning)'},
      ],
      teamList:this.list.teamData,
      teamTitle:this.title,


      // 滚动条配置 
      settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },

      crumbsType:'',
      crumbsShow:false,
    }
  },

  computed:{
    ...mapWritableState(appStore,['settings'])

  },

  methods:{
    ...mapActions(appStore,['setAllSelectStatus']),
    // 点击选择当前联系人
    selectCurrentContact(item){
     if(item.userInfo){
      const index = this.selectedList.findIndex((findItem)=>{ return findItem.userInfo.uid === item.userInfo.uid })
      // console.log('判断是否选中',index)
      if(index === -1){
       this.selectedList.push(item)
      }else{
       return;
      }
     }else{
      if(item.groupID){
     const index = this.selectedList.findIndex((listItem)=>{ return String(listItem.groupID) === String(item.groupID) })
     if(index === -1){
      this.selectedList.push(item)
     }
      }else{
     const index = this.selectedList.findIndex((listItem)=>{ return String(listItem.userID) === String(item.userID) })
     if(index === -1){
      this.selectedList.push(item)
     }
      }
     }
    },

    // 清除已经选中的联系人
    deleteSelected(item){
      if(item.userInfo){
        
        const mapList = this.selectedList.map((item)=>{ return item })
        const index = mapList.findIndex((findItem)=>{ 
          return findItem.userInfo.uid === item.userInfo.uid
        })
        mapList.splice(index,1)
        if(!mapList.length > 0){
        //  console.log('取消全选');
         this.setAllSelectStatus(false)
        }
        this.selectedList = mapList
       
      }else{
        const copyList = [...this.selectedList]
        if(item.groupID){ // 群聊
          const index = copyList.findIndex((copy)=>{ 
           return String(copy.groupID) === String(item.groupID) 
          })
          copyList.splice(index,1)
          this.selectedList = copyList
        }else{ // 好友
          const index = copyList.findIndex((copy)=>{ 
           return String(copy.userID) === String(item.userID) 
          })
          copyList.splice(index,1)
          this.selectedList = copyList
        }
       
      }
     


    },

    // 判断有没有选中
    isSelect(index){
     // console.log('查看是否选中',this.selectedList.includes(this.list[index]));
     return this.selectedList.includes(this.teamList[index])
    },

    // 搜索
    search(){
      // 直接邀请的方式
      if(this.searchKeyword !== '' && this.inviteMode === 'direct'){
        const regex = new RegExp(this.searchKeyword,"i")
        this.teamTitle = '我的好友'
        const list = this.list.friendData
        const filterList  = list.filter((item)=>{
          return regex.test(item.userID) || regex.test(item.nick)
        })
        // console.log('获取数据',filterList);
        this.teamList = filterList

      }else{
        this.teamTitle = this.title
        this.teamList = this.list.teamData
      }
      
      // 邀请加入的方式
      if(this.searchKeyword !== '' && this.inviteMode === 'invite'){
       const regex = new RegExp(this.searchKeyword,"i")
       const groupList = window.$TUIKit.store.store.TUIGroup.groupList
       const arrMerge = groupList.concat(this.list.friendData)
       const filterLists = arrMerge.filter((item)=>{
         return regex.test(item.groupID) || regex.test(item.userID) || regex.test(item.nick) || regex.test(item.name)
       })
       this.teamList = filterLists

      }
    },

    // 全选和反选
    handleSelectAllChange(evt){
      // console.log('获取选中状态',evt.target.checked);
      this.setAllSelectStatus(evt.target.checked)
    },

    // 开启面包屑
    openCrumbs(item){
      this.crumbsType = item.type
      this.crumbsShow = true
    }

  },

  watch:{
    'settings.isAllSelected':{
     handler(newVal){
      if(newVal){
       this.selectedList = this.teamList
      }else{
       this.selectedList = []
      }
     },
     deep:true,
     immediate:true,
    }
  }
}
</script>

<style lang="scss" scoped>

:deep(.select-bg){
  border: 1px solid var(--active-bg);
  background: var(--active-secondary-bg) !important;
}

:deep(.custom-checkbox-font){
  color:var(--primary-text);
}
</style>