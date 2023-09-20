<template>
  <a-row class="w-full h-full">
   <a-col flex=" 0 1 300px" class="find-left h-full flex flex-col px-3"  style=" border-right:1px solid var(--divider);">
    <div class="flex flex-col">
     <div class="flex justify-between items-center w-full mb-2.5">
      <div class="flex  flex-col">
       <span class=" font-bold text-lg truncate" style="color:var(--primary-text);">{{ myCommunityData.name }}</span>
       <span class="font-14" style="color:var(--secondary-text);">一起打磨出闪闪发光的技术宝石！</span>
      </div>
      <ChatDropDown :list="showDropList"/>
     </div>
 
     <div class="font-14" style="color:var(--secondary-text);"></div>
 
    </div>
 
    <a-divider style="height: 1px;margin: 12px 0; background-color: var(--divider)"/>
    
    <div class="flex items-center h-full justify-center flex-col">
      <div v-for="item in emptyList" class="flex  items-center rounded-lg pointer mb-3 active-button h-10 px-3" style="background: var(--secondary-bg);" @click="clickEmptyButton(item)">
         <component :is="item.icon"></component>
         <span class="font-16 ml-3" style="color:var(--primary-text);">{{ item.name }}</span>
      </div>
    </div>
 
 
   </a-col>
 
   <a-col flex=" 1 1 200px" class="h-full flex flex-col">
     <!--  -->
     
   </a-col>
  </a-row>
 
 
 <Modal v-if="addShow" v-model:visible="addShow" :blurFlag="true">
   <CreateNewChannel v-if="type === 'addChannel'" @close="addShow = false"></CreateNewChannel>
   <CreateNewGroup v-if="type === 'addNewGroup' " @close="addShow = false"></CreateNewGroup>
 </Modal>
 
 </template>
 
 <script>
 import { defineComponent, reactive, toRefs,watchEffect} from 'vue'
 import { useRoute,useRouter } from 'vue-router'
 import { showDropList } from '../../../js/data/chatList'
 import { Icon as CommunityIcon } from '@iconify/vue'
 import { UserAddOutlined,PlusOutlined,MenuUnfoldOutlined } from '@ant-design/icons-vue'
 

 import ChatDropDown from '../components/chatDropDown.vue'
 import Modal from '../../../components/Modal.vue'
 import CreateNewChannel from '../components/createNewChannel.vue'
 import CreateNewGroup from '../components/createNewGroup.vue'
 
 export default defineComponent({
  // props:['info'],
  components:{
   UserAddOutlined,PlusOutlined,MenuUnfoldOutlined,
   ChatDropDown,CommunityIcon,Modal,CreateNewChannel,
   CreateNewGroup,
   
  },
 
  setup (props,ctx) {
   const route = useRoute()

   const data = reactive({
     emptyList:[
       { icon:UserAddOutlined,name:'邀请其他人',type:'inviteOther' },
       { icon:PlusOutlined,name:'添加新频道',type:'addChannel'},
       { icon:MenuUnfoldOutlined,name:'添加新分组' ,type:'addNewGroup'},
     ],
     type:'',
     addShow:false, // 点击按钮弹窗
     myCommunityData:{}, // 接收路由参数
   })
 
 
   const clickEmptyButton = (item) =>{
     data.type = item.type
     data.addShow = true
   }
 
    watchEffect(()=>{
      // console.log('排查问题',JSON.parse(route.params.info))
      if(route.params.info !== ''){
        data.myCommunityData = JSON.parse(route.params.info)
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