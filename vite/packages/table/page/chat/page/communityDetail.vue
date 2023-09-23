<template>
  <a-row class="w-full h-full">
   <a-col flex=" 0 1 300px" class="find-left h-full flex flex-col px-3"  style=" border-right:1px solid var(--divider);">
    <div class="flex flex-col">
     <div class="flex justify-between items-center w-full mb-2.5">
      <div class="flex  flex-col">
       <span class=" font-bold text-lg truncate" style="color:var(--primary-text);">{{ routeData.name }}</span>
       <span class="font-14" style="color:var(--secondary-text);">{{ routeData.summary }}</span>
      </div>
      <ChatDropDown :list="showDropList"/>
     </div>

     <div class="font-14" style="color:var(--secondary-text);"></div>

    </div>

    <a-divider style="height: 1px;margin: 12px 0; background-color: var(--divider)"/>

    <template v-if="channelDetail.length === 0">
      <div class="flex items-center h-full justify-center flex-col">
        <div v-for="item in emptyList" class="flex  items-center rounded-lg pointer mb-3 active-button h-10 px-3" style="background: var(--secondary-bg);" @click="clickEmptyButton(item)">
          <component :is="item.icon"></component>
          <span class="font-16 ml-3" style="color:var(--primary-text);">{{ item.name }}</span>
        </div> 
      </div>
    </template>

    <template v-else>
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
        <div v-for="item in channelDetail">
          <ChatFold :title="item.name">
            <div class="flex items-center px-4 py-3 rounded-lg pointer group-item">

            </div>
          </ChatFold>
        </div>
      </vue-custom-scrollbar>
    </template>


   </a-col>

   <a-col flex=" 1 1 200px" class="h-full flex flex-col">
     <!--  -->

   </a-col>
  </a-row>


 <Modal v-if="addShow" v-model:visible="addShow" :blurFlag="true">
   <CreateNewChannel v-if="type === 'addChannel'" :no="routeData.no" @close="addShow = false"></CreateNewChannel>
   <CreateNewGroup v-if="type === 'addNewGroup' " @close="addShow = false"></CreateNewGroup>
 </Modal>

 </template>

 <script>
 import { defineComponent, reactive, toRefs,watchEffect,computed } from 'vue'
 import { useRoute,useRouter } from 'vue-router'
 import { showDropList } from '../../../js/data/chatList'
 import { Icon as CommunityIcon } from '@iconify/vue'
 import { UserAddOutlined,PlusOutlined,MenuUnfoldOutlined } from '@ant-design/icons-vue'
 import { communityStore } from '../store/communityChannel'
 import _ from 'lodash-es'

 import ChatDropDown from '../components/chatDropDown.vue'
 import Modal from '../../../components/Modal.vue'
 import CreateNewChannel from '../components/createNewChannel.vue'
 import CreateNewGroup from '../components/createNewGroup.vue'
 import ChatFold from '../components/chatFold.vue'
 

 export default defineComponent({
  components:{
   UserAddOutlined,PlusOutlined,MenuUnfoldOutlined,
   ChatDropDown,CommunityIcon,Modal,CreateNewChannel,
   CreateNewGroup,ChatFold,

  },

  setup (props,ctx) {
   const route = useRoute()
   const myCom = communityStore()
   const { communityList } = myCom
   const data = reactive({
     emptyList:[
       { icon:UserAddOutlined,name:'邀请其他人',type:'inviteOther' },
       { icon:PlusOutlined,name:'添加新频道',type:'addChannel'},
       { icon:MenuUnfoldOutlined,name:'添加新分组' ,type:'addNewGroup'},
     ],
     type:'',
     addShow:false, // 点击按钮弹窗
     routeData:{}, // 接收路由参数
     channelDetail:[],
     settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      }
   })


   const clickEmptyButton = (item) =>{
     data.type = item.type
     data.addShow = true
   }
 
   watchEffect(()=>{
    data.routeData = { no:route.params.no }
    if(route.params.no !== ''){
      const communityName = _.find(communityList,function(item){
        return String(item.communityInfo.no) === String(route.params.no)
      })
      if(communityName && communityName.communityInfo){
        data.routeData.name = communityName.communityInfo?.name
        data.routeData.summary = communityName.summary ? "" : communityName.summary
      }

      const option = {
        communityNo:route.params.no,
        cache:1,
      }
      
      myCom.getTreeChannelList(option).then(res=>{
        if(res.data && res.data.treeList){

         const filterNoChildren = _.filter(res.data.treeList,function(item){
           return item.hasOwnProperty('children')
         })

         data.channelDetail = filterNoChildren

        }
      })

      
    }
   })

   return {
     showDropList,
    ...toRefs(data),clickEmptyButton,

   }
  }
 })
 </script>

 <style lang="scss" scoped>
 .font-500 {
   font-family: PingFangSC-Medium;
   font-size: 16px;
   font-weight: 500;
 }

 .font-14 {
   font-family: PingFangSC-Regular;
   font-size: 14px;
   font-weight: 400;
 }

 .font-16 {
   font-family: PingFangSC-Regular;
   font-size: 16px;
   font-weight: 400;
 }

 .group-item {
   &:active {
     filter: brightness(0.8);
     opacity: 0.8;
   }

   &:hover {
     background: var(--active-secondary-bg);
   }
 }

 :deep(.ant-row) {
   display: flex !important;
   flex: row nowrap !important;
 }

 .flip {
   transform: rotateY(180deg)
 }

 .active-button{
   &:active{
     filter: brightness(0.8);
     opacity: 0.8;
   }
   &:hover{
     opacity: 0.8;
   }
 }
 </style>
