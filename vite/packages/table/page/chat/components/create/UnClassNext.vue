<template>
 <div class="flex flex-col mb-3 justify-between" style="padding: 12px; width: 650px; height: 530px;" v-if="classShow === false">
  <ModalTop title="发起群聊" back="true" @close="closeCreate" @back="backButton"/>

  <div class="flex items-center flex-col justify-center">
   <div class="flex items-center flex-col justify-center" style="margin-bottom: 28px;">
    <!-- 替换成图标选择器 -->
    <div class="rounded-lg flex pointer items-center justify-center" style="width: 64px;height: 64px; position:relative"  @click="onShowSelect">
    <!--头像 -->
    <div class="overflow-hidden">
     <a-avatar :src="avatarUrl" style="height:64px;width: 64px;border-radius: 0;" :style="{'filter': bgColor?`drop-shadow(#${bgColor} 80px 0)`:'',transform:bgColor?'translateX(-80px)':''}"></a-avatar>
    </div>
    <CreateIcon icon="fluent:camera-16-regular" style="font-size: 1.5rem;width:32px;height:32px;position: absolute;bottom:-12px;right:-6px;border: 2px solid var(--divider);background:var(--active-bg);border-radius: 50%;"/>
    </div>
    <SelectIcon @isIconShow="iconVisible = false" :goodVisible="true" :windowHeight="innerHeight" @getAvatar="getAvatar" v-show="iconVisible" :isCustom="isCustom" :customTitle="customTitle"></SelectIcon>
    <input type="file" id="groupFileID" style="display:none;" @change="getFileInfo($event)">
   </div>

   <a-input spellcheck="false" ref="inputRef" v-model:value="groupName" placeholder="群名称" style="margin-top: 16px; text-align: center; width: 320px;color: var(--primary-text); border-radius: 12px; height: 40px;" />

   <a-input :spellcheck="false"  ref="inputRef" v-model:value="groupID" placeholder="群ID" style="margin-top: 16px; text-align: center; width: 320px;color: var(--primary-text); border-radius: 12px; height: 40px;" :style="validateChinese !== true ? {marginBottom:'16px'}: {marginBottom:'8px'}"/>

   <div class="font-12" v-if="validateChinese" :style="validateChinese === true ? {marginBottom:'16px'}: {marginBottom:'0'}" style="color:var(--error);">群ID不能为中文名称,重新输入群ID</div>

   <a-select style="width: 320px; border-radius: 12px; color: var(--secondary-text);"
   :bordered="false" :dropdownStyle="{boxShadow:'none !important',borderRadius:'12px',color:'var(--secondary-text)'}"
   :showArrow="true" v-model:value="defaultType.type"  @change="getGroupType($event)"
   >
    <a-select-option v-for="(item,index) in groupType" :key="index"  :value="item.type">{{item.text}}</a-select-option>
   </a-select>

   <div class="font-14 font-400 xt-font  xt-text-2" style="width: 320px;margin-top: 16px;">
    {{ groupTypeData.detail }}
   </div>

  </div>

  <div class="flex items-end justify-end ">
    <xt-button w="100" h="40" class="mr-3 category-button" @click="closeCreate">取消</xt-button>
    <xt-button w="100" h="40" type="theme" class="category-button" @click="submit">确定</xt-button>
  </div>
 </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { Icon as CreateIcon } from '@iconify/vue';
import _ from 'lodash-es';
import { message } from 'ant-design-vue';
import { chatStore } from '../../../../store/chat';
import { channelClass } from '../../../../js/chat/createChannelClass'

import SelectIcon from '../../../../../selectIcon/page/index.vue';
import ModalTop from '../../../../page/chat/components/ModalTop.vue';
import ChannelClassification from '../channelSelect/ChannelClassification.vue';

export default {
 props:['list','no','id'],

 components:{
  SelectIcon,CreateIcon,ModalTop,ChannelClassification
 },

 data(){
  return{
   iconVisible:false,
   innerHeight:100,
   groupType:[   // 不同群组类型
    {
     icon: 'https://web.sdk.qcloud.com/im/assets/images/Public.svg',
     label: '陌生人社交群（Public）',
     text:'陌生人社交群',
     type: window.$TUIKit.TIM.TYPES.GRP_PUBLIC,
     detail: '类似 QQ 群，创建后群主可以指定群管理员，用户搜索群 ID 发起加群申请后，需要群主或管理员审批通过才能入群。',
     src: '产品文档',
    },
    {
     icon: 'https://web.sdk.qcloud.com/im/assets/images/Meeting.svg',
     label: '临时会议群（Meeting）',
     text:'临时会议群',
     type: window.$TUIKit.TIM.TYPES.GRP_MEETING,
     detail: '创建后可以随意进出，且支持查看入群前消息；适合用于音视频会议场景、在线教育场景等与实时音视频产品结合的场景。',
     src: '产品文档',
    },
    {
     icon: 'https://web.sdk.qcloud.com/im/assets/images/Work.svg',
     label: '好友工作群（Work）',
     text:'好友工作群',
     type: window.$TUIKit.TIM.TYPES.GRP_WORK,
     detail: '类似普通微信群，创建后仅支持已在群内的好友邀请加群，且无需被邀请方同意或群主审批。',
     src: '产品文档',
    }
   ],
   isCustom:true,
   classShow:false,
   bgColor:'',
   customTitle:'推荐图片尺寸：256*256，不能超过4MB',
   groupName:'',
   groupID:'',
   defaultType:{ type: window.$TUIKit.TIM.TYPES.GRP_PUBLIC }, // 获取默认的群组类型
   avatarUrl:'https://web.sdk.qcloud.com/im/assets/images/Public.svg',
   returnData:{}, // 接收返回的群聊数据
  }
 },

 computed:{
  validateChinese(){
   if(this.groupID !== ''){
    const chineseReg = /^[\u4e00-\u9fa5]+$/;
    return chineseReg.test(this.groupID)
   }else{
    return false
   }
  },
  groupTypeData(){
   if(this.defaultType.type){
    const index = this.groupType.find((item)=>{
      return item.type === this.defaultType.type
    })
    return index
   }   
  },
 },

 mounted(){
  this.$nextTick(()=>{
   this.$refs.inputRef.focus()
  })
 },
 
 methods:{
  ...mapActions(chatStore,['updateConversation']),
  backButton(){
   this.$emit('backButton')
  },
  closeCreate(){
   this.$emit('close')
  },
  onShowSelect(){
   this.iconVisible= !this.iconVisible
   this.innerHeight = window.innerHeight
  },
  getGroupType(evt){
   const index = _.find(this.groupType,function(o){ return o.type === evt })
   this.defaultType.type = evt
   this.avatarUrl = index.icon
  },
  // 获取头像
  getAvatar(avatar){
   if(avatar.indexOf('color=') >= 0){
    let color = avatar.substr(avatar.indexOf('color=') + 7 ,6)
    this.bgColor = color
   }else{
    this.bgColor = ''
   }
   this.avatarUrl = avatar
  },
  // 更换头像
  async updateGroupAvatar(){
    document.querySelector('#groupFileID').click()
  },
  async getFileInfo(evt){
   const files = evt.target.files[0]
   const res  = await fileUpload(files)
   this.avatarUrl = res
  },
  // 创建社群
  async submit(){
   const option = {
    type:this.defaultType.type,
    groupID:this.groupID,
    memberList:this.list,
    name:this.groupName,
    avatar:this.avatarUrl
   };
   if(this.validateChinese){
    message.warning('数据必须填写完整')
    return
   }else{
    const res =  await window.$TUIKit.tim.createGroup(option)
    if(res.code === 0){
     const data = res.data.group;
     const channelOption = {
      type:'group',
      id:this.id !== undefined ? this.id : 0,
      no:this.no,
      content:{
       name:data.name,
       props:{
        ...data,
       },
      }
     };
     channelClass.secondaryChannel(channelOption);
     message.success('创建的群聊关联成功');
     this.closeCreate()
    }
   }
  }
 }
}
</script>

<style lang="scss" scoped>
:deep(.ant-select){
 line-height: 40px !important;
}
:deep(.ant-select .ant-select-selector){
 height: 40px !important;
}
:deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input){
 height: 40px !important;
}

:deep(.ant-select-selection-item){
 line-height: 40px !important;
}


:deep(.ant-input){
 color: var(--secondary-text);
 font-size: 1rem;
 &::placeholder{
  color: var(--secondary-text);
 }
}

:deep(.ant-select-arrow){
  color:var(--secondary-text) !important;
}

.select-icon{
 position: absolute;
 bottom:-12px;
 right:-3px;
 border: 2px solid var(--divider);
}
</style>