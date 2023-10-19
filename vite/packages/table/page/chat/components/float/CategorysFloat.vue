<template>
 <div class="flex flex-col">
  <div class="w-full mb-2.5 flex  justify-between items-center">
    <span class=" font-bold text-lg truncate" style="color:var(--primary-text);">{{ categoryList.name }}</span>
    <ChatDropDown @updatePage="updatePage" :no="categoryList.no" :list="floatList" /> 
  </div>

  <div class="font-14 mb-2" style="color:var(--secondary-text);" :style="isDoubleColumn ? { width:'312px' } : {width:'215px'} ">
    {{ categoryList.summary }}
  </div> 
  
  <div class="ml-1 category-14-400 mb-2" style="color:var(--primary-text);">
   社群号：{{ categoryList.no }}
  </div>
  <div>
   <a-row :gutter="10">
    <a-col flex="55px" class="mt-1 text-right">
      <span class="px-2 rounded-full xt-active-bg">0 级</span>
    </a-col>
    <a-col flex="auto" style="padding-top: 3px">
      <a-progress :show-info="false" strokeColor="var(--active-bg)" :percent="10"></a-progress>
    </a-col>

   </a-row>
  </div>

 </div>

 <a-divider style="height: 2px;margin: 12px 0; background-color: var(--divider)"/>


 <template v-if="categoryList?.tree?.length === 0 ">
  <div class="flex items-center h-full justify-center flex-col" v-if="categoryList?.role !== 'member'">
    <div v-for="item in emptyList" class="flex  items-center rounded-lg pointer mb-3 active-button h-10 px-3"
         style="background: var(--secondary-bg);" @click="clickEmptyButton(item)">
      <CommunityIcon :icon="item.icon" style="font-size:1.25rem;"></CommunityIcon>
      <span class="font-16 ml-3" style="color:var(--primary-text);">{{ item.name }}</span>
    </div>
  </div>

  <div v-else  class="flex items-center h-full justify-center">
    <a-empty :image="emptyImage" description="这里还没有内容"></a-empty>
  </div>
 </template>


 <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;" v-else>

  <template v-if="!isDoubleColumn">
    <div class="flex flex-col">
      <div v-for="item in channelList" class="flex items-center px-2  py-2 rounded-lg pointer group-item" :class="{'active-bg': currentID ===item.id}"
        @click.stop="currentItem(item)" @contextmenu.stop.prevent="topChannel($event,item)"
      >
        <template v-if="isWorkGroup(item)">
          <div class="flex items-center">
            <template v-if="item.type === 'group'">
             <communityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
            </template>
            <template v-if="item.type === 'link'">
             <communityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
            </template>
            <template v-if="item.type === 'forum'">
             <communityIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
            </template>
          </div> 
          <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
          <communityIcon  icon="fluent:open-20-filled" class="ml-1 xt-text-2 flip " style="font-size: 24px"
          v-if="item.type === 'link' && item.name !== 'Roadmap' && JSON.parse(item.props)?.openMethod !== 'currentPage'"/>
        </template>
      </div>
    </div>
    <transition name="slide-fade">
      <MenuDropdown v-if="showTopMenu" :item="categoryItem" :position="position"  class="dropdown-menu" :list="listType === 'link' ? channelMenu : [channelMenu[1]]" :id="currentID" :no="categoryList.no"></MenuDropdown>
    </transition>
  </template>

  <template v-else>
    <div class="flex grid grid-cols-2 gap-1">
      <div v-for="item in channelList" class="flex items-center px-3.5 py-2 rounded-lg pointer group-item"  :class="{'active-bg': currentID ===item.id}"  
       @click.stop="currentItem(item)" @contextmenu.stop.prevent="topChannel($event,item)"
      >
        <template v-if="isWorkGroup(item)">
          <div class="flex items-center">
            <template v-if="item.type === 'group'">
             <communityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
            </template>
            <template v-if="item.type === 'link'">
             <communityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
            </template>
            <template v-if="item.type === 'forum'">
             <communityIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
            </template>
          </div> 
          <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
          <communityIcon  icon="fluent:open-20-filled" class="ml-1 xt-text-2 flip " style="font-size: 24px"
          v-if="item.type === 'link' && item.name !== 'Roadmap' && JSON.parse(item.props)?.openMethod !== 'currentPage'"/>
        </template>
      </div>
    </div>

    <transition name="slide-fade">
      <!-- :style="`top: ${position.y}px; left: ${position.x}px`" class="dropdown-menu" -->
      <MenuDropdown v-if="showTopMenu" :item="categoryItem" :position="position"  :list="listType === 'link' ? channelMenu : [channelMenu[1]]" :id="currentID" :no="categoryList.no" ></MenuDropdown>
    </transition>
  </template>


  <div v-for="(item,index) in categoryFilterList" class="my-3" @contextmenu.stop.prevent="topCategory($event,item)">
    <ChatFold :title="item.name" :content="item" :show="true" :no="categoryList.no">
    
      <div class="flex flex-col" v-if="isDoubleColumn === false">
  
       <div v-for="item in item.children" @click.stop.prevent="currentItem(item)" @contextmenu.stop.prevent="topChannel($event,item)" 
        :class="{'active-bg': currentID ===item.id}"
        class="flex items-center rounded-lg p-2 pointer group-item" 
       >
        <template v-if="isWorkGroup(item)">
          <div class="flex items-center">
            <template v-if="item.type === 'group'">
             <communityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
            </template>
            <template v-if="item.type === 'link'">
             <communityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
            </template>
            <template v-if="item.type === 'forum'">
             <communityIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
            </template>
          </div> 
          <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
          <communityIcon  icon="fluent:open-20-filled" class="ml-1 xt-text-2 flip " style="font-size: 24px"
          v-if="item.type === 'link' && item.name !== 'Roadmap' && JSON.parse(item.props)?.openMethod !== 'currentPage' "/>
        </template>
        
       </div>
  
      </div>
  
      <div class="flex grid grid-cols-2 gap-1" v-else>
       <div v-for="(item,index) in item.children" @click.stop.prevent="currentItem(item)" @contextmenu.stop.prevent="topChannel($event,item)"
        :class="{'active-bg':currentID === item.id}" class="flex items-center px-3.5 py-2 rounded-lg pointer group-item"
       >
        <template v-if="isWorkGroup(item)">
        <div class="flex items-center">
          <template v-if="item.type === 'group'">
           <communityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
          </template>
          <template v-if="item.type === 'link'">
           <communityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
          </template>
          <template v-if="item.type === 'forum'">
           <communityIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
          </template>
         </div>
         <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
         
         <communityIcon  icon="fluent:open-20-filled" class="ml-1 xt-text-2 flip " style="font-size: 24px"
         v-if="item.type === 'link' && item.name !== 'Roadmap' && JSON.parse(item.props)?.openMethod !== 'currentPage'"/>
        </template>
       </div>
      </div>
  
    </ChatFold>
  </div>
  
  <transition name="slide-fade">
    <MenuDropdown v-if="categoryShowMenu" :item="categoryItem" :position="position"  :no="categoryList.no" :id="currentID" :list="categoryMenu"></MenuDropdown>
  </transition>

 </vue-custom-scrollbar>

 
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { chatStore } from '../../../../store/chat'
import { communityStore } from '../../store/communityStore'
import { hideDropList,showDropList,memberDropList,memberShowList } from '../../../../js/data/chatList'
import { Icon as CommunityIcon } from '@iconify/vue'
import { categoryMenu, channelMenu } from '../../../../js/data/chatList'

import ChatDropDown from './ChatsDropDown.vue';
import ChatFold from './ChatFolds.vue'
import MenuDropdown from './MenuDropdowns.vue'

export default{
  props:[ 'communityID','float' ],

  components:{
    CommunityIcon,ChatDropDown,ChatFold,MenuDropdown,
  },

  data(){
    return{
      emptyList: [
       { icon:'fluent:people-add-16-regular', name: '邀请其他人', type: 'inviteOther' },
       { icon:'fluent:apps-add-in-20-filled', name: '添加新应用', type: 'addChannel' },
       { icon:'fluent:add-16-filled', name: '添加新分组', type: 'addNewGroup' },
      ],
      currentID:'',
      settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
      emptyImage:'/img/state/null.png',
      position: { x: 0, y: 0 },
      categoryShowMenu:false,
      showTopMenu:false,
      showMenuIndex:-1,    
      categoryMenu,  
      channelMenu,
      listType:'',
      categoryItem:{}
    }
  },

  mounted(){
    document.addEventListener('click', this.hideDropdown);
  },

  computed:{
    ...mapWritableState(communityStore,['categoryList']),
    ...mapWritableState(chatStore,['settings']),
    isDoubleColumn(){
      return this.settings.showDouble
    },
    floatList(){
      if(this.float){
        if(this.communityID.no === 1){
          return memberShowList
        }else{
          if(this.categoryList?.role !== 'member'){
            return showDropList
          }else{
            return memberShowList
          }
        }
      }else{
        if(this.communityID.no === '1'){
          return memberDropList
        }else{
          if(this.categoryList?.value?.role !== 'member'){
            return hideDropList
          }else{
            return memberDropList
          }
        }
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
    clickEmptyButton(item){
      this.$emit('createCategory',item)
    },
    currentItem(item){
      // console.log('排查当前点击::>',item);
      this.currentID = item.id
      this.$emit('clickItem',item)
    },

    // 顶级频道鼠标右键点击
    topChannel(evt,item){
      // console.log('顶级频道::>',item);
     this.listType = item.type
     this.currentID = item.id
     this.categoryItem = item
     this.showTopMenu = true
     this.position = { x: evt.clientX - 50 , y: evt.clientY + 25 };
    },

    // 带有子级的频道的一级目录
    topCategory(evt,item){
     //  console.log('带父级的的频道目录',item.id)
     this.currentID = item.id
     this.categoryItem = item
     this.categoryShowMenu = true
     this.position = { x: evt.clientX - 50 , y: evt.clientY + 10 };
    },


    // 隐藏下拉菜单
    hideDropdown(evt){
      evt.preventDefault();
      this.showTopMenu = false
      this.categoryShowMenu = false
    },

    // 检测群聊是否为好友工作群
    isWorkGroup(item){
      const data = JSON.parse(item.props);
      const list = window.$TUIKit.store.store.TUIGroup.groupList
      const index = list.findIndex((findItem)=>{ return findItem.groupID === data.groupID && findItem.type === data.type })
      return index !== -1
    }


  },

  destroyed() {
    document.removeEventListener('click', this.hideDropdown);
  },
}


</script>

<style lang="scss" scoped>
.active-bg {
 background: var(--active-secondary-bg);
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