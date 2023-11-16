<template>
 
</template>

<script>
import { defineComponent,ref,reactive,toRefs, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue';
import { CameraOutlined  } from '@ant-design/icons-vue';
import { appStore } from '../../../store'
import _ from 'lodash-es'
import { fileUpload } from '../../../components/card/hooks/imageProcessing'
import { Icon as NewGroupIcon } from '@iconify/vue'

import ChannelClassification from './channelSelect/ChannelClassification.vue';

export default defineComponent({
 components:{
  CameraOutlined,NewGroupIcon,ChannelClassification
 },

 props:['no'],

 setup(props,ctx){
   const server = window.$TUIKit

   const store = appStore()

   const data = reactive({
     friendList:[],  // 好友列表
     selectList:[], // 右侧选中列表
     isNextShow:false, // 是否进入下一步
     simpleImage:'/img/state/null.png', // 空状态图片
     groupName:'', // 接收群名称
     groupID:'', // 接收群ID
     public:{ type: server.TIM.TYPES.GRP_PUBLIC }, // 获取默认的群组类型
     settingsScroller: {  // 滚动条配置
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
     },
     groupType:[   // 不同群组类型
       {
         icon: 'https://web.sdk.qcloud.com/im/assets/images/Public.svg',
         label: '陌生人社交群（Public）',
         text:'陌生人社交群',
         type: server.TIM.TYPES.GRP_PUBLIC,
         detail: '类似 QQ 群，创建后群主可以指定群管理员，用户搜索群 ID 发起加群申请后，需要群主或管理员审批通过才能入群。',
         src: '产品文档',
       },
       {
         icon: 'https://web.sdk.qcloud.com/im/assets/images/Meeting.svg',
         label: '临时会议群（Meeting）',
         text:'临时会议群',
         type: server.TIM.TYPES.GRP_MEETING,
         detail: '创建后可以随意进出，且支持查看入群前消息；适合用于音视频会议场景、在线教育场景等与实时音视频产品结合的场景。',
         src: '产品文档',
       },
       {
         icon: 'https://web.sdk.qcloud.com/im/assets/images/Work.svg',
         label: '好友工作群（Work）',
         text:'好友工作群',
         type: server.TIM.TYPES.GRP_WORK,
         detail: '类似普通微信群，创建后仅支持已在群内的好友邀请加群，且无需被邀请方同意或群主审批。',
         src: '产品文档',
       }
     ],

     classShow:false,
   })

   const groupData = ref({})

   const getFriendList = async () =>{  // 获取好友列表数据
     const res  = await server.tim.getFriendList()
     const list = [];
     for(let i =0; i<res.data.length;i++){
       if(parseInt(res.data[i].userID) !== store.$state.userInfo.uid){
         list.push(res.data[i])
       }
     }
     data.friendList = list
   }

   const selectUser = (item) => {  // 选中用户
     const index = _.findIndex(data.selectList,function(o){ return o.userID === item.userID})
     if(index === -1 ){
       data.selectList.push(item)
     }else{
       return;
     }
   }


   const enterNextStep = () =>{  // 进入下一步
     if(data.selectList.length !== 0 ){
       data.isNextShow = true
     }
   }

   const clearSelect = (item) => { // 清除选中用户
     const index = _.findIndex(data.selectList,function(o){ return o.userID === item.userID})
     data.selectList.splice(index,1)
   }


   const goBack = () => {  // 返回上一步
     data.isNextShow = false
   }

   const getGroupType = (evt) =>{  // 下拉获取选择后的群组类型
     const index = _.find(data.groupType,function(o){ return o.type === evt })
     data.public.type = index.type
   }

   const groupTypeData = computed(()=>{  // 根据计算属性获取群组类型的描述
     const index = _.find(data.groupType,function(o){ return o.type === data.public.type })
     return index
   })


   const closeContact = () => {  // 关闭弹窗
    ctx.emit('close')
   }

   // 通过计算属性判断群ID是否为中文
   const validateChinese = computed(()=>{
     const chineseReg = /^[\u4e00-\u9fa5]+$/;
     return chineseReg.test(data.groupID)
   })


   const submit = async () => {  // 点击创建群聊
     if(validateChinese.value){
       return
     }else{
      const option = {
       type:data.public.type,
       groupID:data.groupID,
       memberList:data.selectList,
       name:data.groupName,
       avatar:groupTypeData.value.icon,
      }

      const res =  await server.tim.createGroup(option)

      console.log('是否创建成功',res);

      if(res.code === 0){
       message.success(`${res.data.group.name}创建成功`)
       groupData.value = [res.data.group]
       data.classShow = true
       // const name = `GROUP${data.groupID}`
       // server.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse) => {
       //   // 通知 TUIConversation 添加当前会话
       //   // Notify TUIConversation to toggle the current conversation
       //   server.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
       // })
      }
      // ctx.emit('close')

     }
   }

   // 点击群聊头像更换
   const updateGroupAvatar = async () =>{
     document.querySelector('#groupFileID').click()
   }

   // 获取上文件的回调函数
   const getFileInfo = async(evt) =>{
    const files = evt.target.files[0]
    const res  = await fileUpload(files)
    groupTypeData.value.icon = res
   }

   // 左侧列表选中状态
   const isSelected = (index) =>{
     return data.selectList.includes(data.friendList[index])
   }

   const backButton = () =>{
    ctx.emit('back')
   }


   onMounted(getFriendList)

   return{
     groupTypeData,validateChinese,groupData,
     ...toRefs(data), getFriendList,selectUser,enterNextStep,closeContact,
     clearSelect,goBack,getGroupType,submit,getFileInfo,updateGroupAvatar,
     isSelected,backButton,
   }
 }
})
</script>

<style lang="scss" scoped>
.top-close{
 width: 100%;
 height: 48px;
 position: relative;
 display: flex;
 justify-content: center;
 align-items: center;
 /**
 >div:nth-of-type(2){
   position: absolute;
   right: 1px;
 }
 **/
}

.font-16{

 font-size: 16px;
 font-weight: 500
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

.font-14{

 font-size: 14px;
 font-weight: 400;
}

.left-group{
 display: flex;
 align-content: center;
 flex-direction: column;
 width: 293px;
 height: 422px;
}
.right-group{
 width: 293px;
 display: flex;
 align-content: center;
 justify-content: space-between;
 flex-direction: column;
 height: 422px;
}

:deep(.ant-select-arrow){
 color: var(--primary-text) !important;
}

.font-12{

 font-size: 12px;
 font-weight: 400;
}

.select-bg{
 background: var(--active-secondary-bg) !important;
 border:1px solid var(--active-bg) !important;
}
</style>
