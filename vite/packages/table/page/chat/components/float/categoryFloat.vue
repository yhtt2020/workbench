<template>
 <div class="flex flex-col">

  <div class="w-full mb-2.5 flex  justify-between items-center">
    <span class=" font-bold text-lg truncate" style="color:var(--primary-text);">{{ leftList?.name }}</span>
    <ChatDropDown @updatePage="updatePage" :no="communityID.no" :list="floatList"/> 
  </div>

  <div class="font-14 mb-2" style="color:var(--secondary-text);" :style="isDoubleColumn ? { width:'312px' } : {width:'215px'} ">
    {{ leftList?.summary }}
  </div> 
  
  <div class="ml-1 category-14-400 mb-2" style="color:var(--primary-text);">
   社群号：{{ communityID?.no }}
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

 <!-- <template v-if=""></template> -->


 <template v-if="leftList?.tree?.length === 0 ">
  <div class="flex items-center h-full justify-center flex-col" v-if="leftList?.role !== 'member'">
    <div v-for="item in emptyList" class="flex  items-center rounded-lg pointer mb-3 active-button h-10 px-3"
         style="background: var(--secondary-bg);" @click="clickEmptyButton(item)">
      <CommunityIcon :icon="item.icon"></CommunityIcon>
      <span class="font-16 ml-3" style="color:var(--primary-text);">{{ item.name }}</span>
    </div>
  </div>
  
 </template>

 <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;" v-else>
  <div v-for="item in leftList?.tree">
   <ChatFold :title="item.name">
    
    <div class="flex flex-col" v-if="isDoubleColumn === false">

     <div v-for="item in item.children" @click="currentItem(item)" 
      :class="{'active-bg': currentID ===item.id}"
      class="flex items-center rounded-lg p-2 pointer group-item" 
     >
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
      <SelectOutlined class="ml-1 xt-text-2 flip " style="font-size: 14px"
                   v-if="item.type === 'link' && item.name !== 'Roadmap'"/>
     </div>

    </div>

    <div class="flex grid grid-cols-2 gap-1" v-else>

     <div v-for="item in item.children" @click="currentItem(item)"
      :class="{'active-bg':currentID === item.id}" class="flex items-center px-3.5 py-2 rounded-lg pointer group-item"
     >
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
      <SelectOutlined class="ml-1 xt-text-2 flip " style="font-size: 14px" v-if="item.type === 'link' && item.name !== 'Roadmap'"/>
     </div>

    </div>

   </ChatFold>
  </div>
 </vue-custom-scrollbar>


</template>

<script>
import { defineComponent,watchEffect,toRefs,reactive,computed } from 'vue'
import { chatStore } from '../../../../store/chat'
import { communityStore } from '../../store/communityStore'
import { hideDropList,chatList,showDropList,memberDropList,memberShowList } from '../../../../js/data/chatList'
import { Icon as CommunityIcon } from '@iconify/vue'


import ChatDropDown from './chatDropDown.vue';
import ChatFold from './chatFold.vue'

export default defineComponent({
  props:[ 'communityID','float' ],

  components:{
    CommunityIcon,ChatDropDown,ChatFold,
  },

  setup (props,ctx) {
    const chat = chatStore()
    const leftListCategory = communityStore()
    const { communityList } = leftListCategory
    const data = reactive({
      leftList:{},
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
    })

    watchEffect(async ()=>{
      // console.log('获取props参数::>>',typeof props.communityID.no)
      // console.log('获取props参数::>>',props.communityID.no !== '1')

      // console.log('获取数据',chatList[0])

      if(props.communityID?.no !== '1'){

        const tree =  await leftListCategory.getCategoryTreeData(props.communityID.no)
        const communityName = communityList?.find((item)=>{
         return String(item.communityInfo.no) === String(props.communityID.no)
        })
        data.leftList.tree = tree?.data?.treeList
        data.leftList.role = communityName?.role
        data.leftList.name = communityName?.communityInfo?.name

      }else{
        // console.log('获取数据',chatList[0])
        // console.log('判断',props.float)
        data.leftList.name = chatList[0]?.name
        data.leftList.summary = chatList[0]?.summary
        data.leftList.tree = chatList[0]?.channelList
        data.leftList.category = []
        data.leftList.role = ''
        // console.log('排查问题',data.leftList)
      }
    })

    // 判断单双列
    const isDoubleColumn = computed(()=>{
      return chat.settings.showDouble
    })

    // 通过判断获取菜单选择数据
    const floatList = computed(()=>{

      if(props.float){  // 开启悬浮模式

        if(props.communityID.no === 1){
          return memberShowList
        }else{
          // console.log('排查::>>',)
          if(data.leftList?.role !== 'member'){
            return showDropList
          }else{
            return memberShowList
          }
        }

      }else{ // 关闭悬浮模式

        if(props.communityID.no === '1'){
          return memberDropList
        }else{
          if(data.leftList?.role !== 'member'){
            return hideDropList
          }else{
            return memberDropList
          }
        }

      }
    
    })

    // 当社群为空时触发
    const clickEmptyButton = (item) => {
     ctx.emit('createCategory',item)
    }

     // 点击当前
    const currentItem = (item) => {
     data.currentID = item.id
     ctx.emit('clickItem',item)
    }





    return {
     isDoubleColumn,floatList,chatList,
     ...toRefs(data),clickEmptyButton,currentItem,
    }
  }
})
</script>

<style lang="scss" scoped>
.active-bg {
 background: var(--active-secondary-bg);
}
</style>