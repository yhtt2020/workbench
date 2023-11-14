<template>
 <div class="flex flex-col">
  <div class="w-full mb-2.5 flex  justify-between items-center">
    <span class=" font-bold text-lg truncate" style="color:var(--primary-text);">{{ categoryList.name }}</span>
    <ChatDropDown @updatePage="updatePage" :no="categoryList.no" :list="floatList" /> 
  </div>

  <div class="font-14 mb-2 summary" style="color:var(--secondary-text);" :style="isDoubleColumn ? { width:'336px' } : {width:'215px'} ">
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
  <template  v-if="!isDoubleColumn">
    <div class="flex flex-col">
      <div v-for="item in channelList" :class="{'active-bg': currentID ===item.id}" class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item">
        <xt-menu name="name" :menus="item.type === 'link' ? linkMenus : menus">
          <div class="flex items-center" @click="currentItem(item)">
            <div class="flex items-center">
              <template v-if="item.type === 'group'">
                <CommunityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
              </template>
              <template v-if="item.type === 'link'">
                <CommunityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
              </template>
              <template v-if="item.type === 'forum'">
                <CommunityIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
              </template>
            </div>
            <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
            <CommunityIcon  icon="fluent:open-20-filled" class="ml-1 xt-text-2 flip " style="font-size: 24px"
             v-if="item.type === 'link' && item.name !== 'Roadmap' && JSON.parse(item.props)?.openMethod !== 'currentPage'"/>
          </div>
        </xt-menu>
      </div>
    </div>
  </template>

  <template v-else>
    <div class="flex grid grid-cols-2 gap-1">
      <div v-for="item in channelList" :class="{'active-bg': currentID ===item.id}" class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item">
        <xt-menu name="name" :menus="item.type === 'link' ? linkMenus : menus">
          <div class="flex items-center" @click="currentItem(item)">
            <div class="flex items-center">
              <template v-if="item.type === 'group'">
                <CommunityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
              </template>
              <template v-if="item.type === 'link'">
                <CommunityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
              </template>
              <template v-if="item.type === 'forum'">
                <CommunityIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
              </template>
            </div>
            <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
            <CommunityIcon  icon="fluent:open-20-filled" class="ml-1 xt-text-2 flip " style="font-size: 24px"
             v-if="item.type === 'link' && item.name !== 'Roadmap' && JSON.parse(item.props)?.openMethod !== 'currentPage'"/>
          </div>
        </xt-menu>
      </div>
    </div>
  </template>


  <div v-for="(item,index) in categoryFilterList" class="my-3" >
    <xt-menu name="name" :menus="floatMenu">
      <ChatFold :title="item.name" :content="item" :show="true" :no="categoryList.no">
        <div class="flex flex-col" v-if="isDoubleColumn === false">
          <div v-for="(item,index) in item.children" :class="{'active-bg':currentID === item.id}" class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item">
            <xt-menu name="name" :menus="item.type === 'link' ? linkMenus : menus">
              <div class="flex items-center" @click="currentItem(item)">
                <div class="flex items-center">
                  <template v-if="item.type === 'group'">
                    <CommunityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
                  </template>
                  <template v-if="item.type === 'link'">
                    <CommunityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
                  </template>
                  <template v-if="item.type === 'forum'">
                    <CommunityIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
                  </template>
                </div>
                <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
                <CommunityIcon  icon="fluent:open-20-filled" class="ml-1 xt-text-2 flip " style="font-size: 24px"
                 v-if="item.type === 'link' && item.name !== 'Roadmap' && JSON.parse(item.props)?.openMethod !== 'currentPage'"/>
              </div>
            </xt-menu>
          </div>
        </div>
  
        <div class="flex grid grid-cols-2 gap-1" v-else>
          <div v-for="(item,index) in item.children" :class="{'active-bg':currentID === item.id}" class="flex items-center px-3.5  py-2.5 rounded-lg pointer group-item">
            <xt-menu name="name" :menus="item.type === 'link' ? linkMenus : menus">
              <div class="flex items-center" @click="currentItem(item)">
                <div class="flex items-center">
                  <template v-if="item.type === 'group'">
                    <CommunityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
                  </template>
                  <template v-if="item.type === 'link'">
                    <CommunityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
                  </template>
                  <template v-if="item.type === 'forum'">
                    <CommunityIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
                  </template>
                </div>
                <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
                <CommunityIcon  icon="fluent:open-20-filled" class="ml-1 xt-text-2 flip " style="font-size: 24px"
                 v-if="item.type === 'link' && item.name !== 'Roadmap' && JSON.parse(item.props)?.openMethod !== 'currentPage'"/>
              </div>
            </xt-menu>
          </div>
        </div>
      </ChatFold>  
    </xt-menu>
  </div>
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
      categoryItem:{},
      linkMenus:[
        {
          name:'链接设置',
          newIcon:'fluent:settings-16-regular',
          callBack:()=>{}
        },
        {
          name:'删除应用',
          newIcon:'akar-icons:trash-can',
          color: 'var(--error)',
          callBack:()=>{}
        }
      ],
      menus:[
        {
          name:'删除应用',
          newIcon:'akar-icons:trash-can',
          color: 'var(--error)',
          callBack:()=>{}
        }
      ],
      floatMenu:[
        {
          name:'分组设置',
          newIcon:'fluent:settings-16-regular',
          callBack:()=>{}
        },
        {
          name:'删除分组',
          newIcon:'akar-icons:trash-can',
          color: 'var(--error)',
          callBack:()=>{}
        }
      ]
    }
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

    // 根据类型判断返回右键下拉列表
    // menuList(type){
    //   console.log('查看type',type);
    //   return type === 'link' ? this.linkMenus : this.menus;
    // },


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