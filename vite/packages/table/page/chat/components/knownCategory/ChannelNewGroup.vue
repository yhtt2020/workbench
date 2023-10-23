<template>
 <div class="flex flex-col" style="padding: 12px; width: 650px; height: 530px;" v-if="isNextShow === false">
   <!-- 顶部关闭 -->
   <div class="top-close" style="margin-bottom: 16px;">
    <div class="flex rounded-lg active-button pointer items-center w-12 h-12 justify-center" style="background: var(--secondary-bg);" @click="backButton">
     <NewGroupIcon icon="fluent:chevron-left-16-filled" style="font-size: 2em;color: var(--secondary-text);"/>
    </div>
    <div class="font-16 flex items-center justify-center" style="color:var(--primary-text);width: 95%;">选择联系人</div>
    <div class="flex rounded-lg active-button pointer items-center w-12 h-12 justify-center"
     style="background: var(--secondary-bg);" @click="closeContact"
    >
     <NewGroupIcon icon="fluent:dismiss-16-filled" style="font-size: 1.75em;color: var(--secondary-text);" />
    </div>
   </div>

   <!-- 中间内容 左侧 右侧 -->
   <div class="flex  justify-between">
     <div class="left-group">
       <div class="font-16" style="color: var(--secondary-text);padding-left: 16px;margin-bottom: 16px;">我的好友</div>
       
       <div class="flex items-center  justify-center" style="color: var(--primary-text);margin-top: 50px;" v-if="friendList.length === 0">
         <a-empty :image="simpleImage" />
       </div>
       
       <vue-custom-scrollbar :settings="settingsScroller" style="height:90%;">
         <div v-for="(item,index) in friendList" :class="{ 'select-bg':isSelected(index) }" class="flex items-center pointer rounded-lg" style="margin-bottom: 8px;padding: 12px;color: var(--primary-text);"  @click="selectUser(item)">
           <a-avatar :size="32" :src="item.profile.avatar"></a-avatar>
           <div class="font-16" style="color: var(--primary-text);margin-left: 16px;">
             {{ item.profile.nick }}
           </div>
         </div>
       </vue-custom-scrollbar>
     </div>

     <a-divider type="vertical" style="height: 430px; border-color: var(--divider)"/>

     <div class="right-group">
       <div style="color: var(--primary-text);margin-bottom: 16px;">已选({{selectList.length}}人)</div>
       
       <vue-custom-scrollbar :settings="settingsScroller" style="height:80%; margin-bottom: 16px;">
         <div v-for="item in selectList" class="flex  justify-between" style="margin-bottom: 8px;padding: 12px;color: var(--primary-text);">
           <div class="flex">
             <a-avatar :size="32" :src="item.profile.avatar"></a-avatar>
             <div class="font-16" style="color: var(--primary-text);margin-left: 16px;">
              {{ item.profile.nick }}
             </div>
           </div>
           <div class="pointer" @click="clearSelect(item)">
             <Icon icon="jinzhi-yin" style="color: var(--secondary-text);width: 20px;height: 20px;"></Icon>
           </div>
         </div>
       </vue-custom-scrollbar>

       <!-- 底部按钮 -->
       <div class="flex justify-end" style="height: 48px;">
        <div class="flex items-center rounded-md pointer font-16 active-button justify-center"  style="width: 100px;color: var(--secondary-text); background: var(--secondary-bg);" @click="closeContact">
         取消
        </div>
        <div class="flex items-center rounded-md pointer font-16 active-button justify-center" style="width: 100px;color: var(--active-text);background: var(--active-bg);margin-left: 12px;" @click="enterNextStep">
         确定
        </div>
       </div>        
     </div>
   </div>

 </div>

 <div v-else class="flex flex-col" style="padding: 12px; width: 650px; height: 530px;">
   <div class="top-close">
     <div class="flex rounded-lg active-button pointer items-center justify-center"
       style="background: var(--secondary-bg);width: 48px;height: 48px;"  @click="goBack"
     >
      <NewGroupIcon icon="fluent:chevron-left-16-filled" style="font-size: 2em;"/>
     </div>
     <div class="font-16 flex items-center justify-center" style="color:var(--primary-text);width: 84%;">创建群聊</div>
     <div class="flex rounded-lg active-button pointer items-center justify-center"
       style="background: var(--secondary-bg);width: 48px;height: 48px;" @click="closeContact"
     >
      <NewGroupIcon icon="fluent:dismiss-16-filled" style="font-size: 1.75em;" />
     </div>
   </div>

   <div class="flex flex-col items-center justify-center" style="height:415px;color: var(--primary-text);position:relative;">
     <div class="flex items-center justify-center pointer" @click="updateGroupAvatar" style="position: relative;">
       <a-avatar shape="square" :size="64" :src="groupTypeData.icon"></a-avatar>
       <div class="flex items-center rounded-full p-3 justify-center"
        style="width:24px;height:24px;position: absolute;bottom:-3px;right:-3px;background: var(--active-bg);border: 2px solid var(--primary-text);"
       >
        <CameraOutlined style="font-size:1em;"/>
       </div>
       <input type="file" id="groupFileID" style="display:none;" @change="getFileInfo($event)">
     </div>
     <div class="flex items-center justify-center font-16"  style="color:var(--secondary-text);margin-top: 12px;"> 推荐图片尺寸：256*256，不能超过4MB </div>

     <a-input :spellcheck="false" v-model:value="groupName" placeholder="群名称" style="margin-top: 16px; text-align: center; width: 320px;color: var(--primary-text); border-radius: 12px; height: 48px;margin-bottom: 16px;" />

     <a-input :spellcheck="false" v-model:value="groupID" placeholder="群ID" style="margin-top: 16px; text-align: center; width: 320px;color: var(--primary-text); border-radius: 12px; height: 48px;" :style="validateChinese !== true ? {marginBottom:'16px'}: {marginBottom:'8px'}"/>
     
     <div class="font-12" v-if="validateChinese" :style="validateChinese === true ? {marginBottom:'16px'}: {marginBottom:'0'}" style="color:var(--error);">群ID不能为中文名称,重新输入群ID</div>
     
     <a-select style="width: 320px; border-radius: 12px; color: var(--secondary-text);"
      :bordered="false" :dropdownStyle="{boxShadow:'none !important',borderRadius:'12px',color:'var(--secondary-text)'}"
      :showArrow="true" v-model:value="public.type"  @change="getGroupType($event)"
     >
       <a-select-option v-for="(item,index) in groupType" :key="index"  :value="item.type">{{item.text}}</a-select-option>
     </a-select>

     <div class="font-14" style="color: var(--secondary-text);width: 320px;margin-top: 16px;">
       {{ groupTypeData.detail }}
     </div>

   </div>

   <div class="flex justify-end">
     <a-button style="width: 100px; border-radius: 8px; height: 44px; background: var(--secondary-bg);color: var(--secondary-text);" @click="goBack">取消</a-button>
     <a-button type="primary" style="width: 100px;height: 44px;margin-left: 16px;border-radius: 8px;" @click="submit">确定</a-button>
   </div>
 </div>
  
</template>

<script>
// import { mapActions,mapWritableState } from 'pinia'
import { reactive,ref,toRefs,computed,onMounted } from 'vue'
import { message } from 'ant-design-vue';
import { CameraOutlined  } from '@ant-design/icons-vue';
import { appStore } from '../../../../store'
import { communityStore } from '../../store/communityStore'
import _ from 'lodash-es'
import { fileUpload } from '../../../../components/card/hooks/imageProcessing'
import { Icon as NewGroupIcon } from '@iconify/vue'
import { channelClass } from '../../../../js/chat/createChannelClass'

export default {
 components:{
  CameraOutlined,NewGroupIcon,
 },

 props:['no','id'],

 setup(props,ctx){
   const server = window.$TUIKit
  
   const store = appStore()
   const community = communityStore()

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
  
      // console.log('是否创建成功',res);

      if(res.code === 0){
        const data = res?.data?.group
        // console.log('获取创建的群数据',data,props.id);
        const option = { type:'group',id:props.id,no:props.no,content:{name:data.name,props:{groupID:data.groupID,avatar:data.avatar}}}
        const result = await channelClass.secondaryChannel(option)

        console.log('查看返回状态',result);

        if(result?.status === 1){
          message.success(`${result?.info}`)
          await community.getCategoryData(props.no)
          ctx.emit('close')
        }

      }
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
}


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
 font-family: PingFangSC-Medium;
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
 font-family: PingFangSC-Regular;
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
 font-family: PingFangSC-Regular;
 font-size: 12px;
 font-weight: 400;
}

.select-bg{
 background: var(--active-secondary-bg) !important;
 border:1px solid var(--active-bg) !important;
}
</style>