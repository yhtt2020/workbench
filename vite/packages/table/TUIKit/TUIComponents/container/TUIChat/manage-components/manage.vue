<template>
  <div class="flex flex-col" style="height: 92%;">
    <div class="rounded-lg pointer" style="background: var(--secondary-bg);padding: 12px 16px !important;margin-bottom: 16px !important;">
      <div class="flex items-center justify-between" style="margin-bottom: 11px;"  @click="enterUpdateGroupName">
        <span class="font-14" style="color: var(--primary-text);">群信息</span>
        <Icon icon="xiangyou"></Icon>
      </div>
      <div class="flex items-center">
        <a-avatar shape="square" :size="32" :src="conversation.avatar"></a-avatar>
        <span class="pl-3"> {{  conversation.name }}</span>
      </div>
    </div>

    <div class="rounded-lg pointer" style="background: var(--secondary-bg);padding: 14px 16px !important; margin-bottom: 16px !important;">
      <div class="flex items-center justify-between" style="margin-bottom: 11px;"  @click="enterGroupNotice">
        <span class="font-14" style="color: var(--primary-text);">群公告</span>
        <Icon icon="xiangyou"></Icon>
      </div>
      <div>
        {{  conversation.notification === '' ? '暂无群公告' :  conversation.notification }}
      </div>
    </div>

    <div class="rounded-lg pointer" style="background: var(--secondary-bg);padding: 14px 16px !important; margin-bottom: 16px !important;">
      <div class="flex items-center justify-between" style="margin-bottom: 11px;"  @click="enterGroupMemeber">
        <span class="font-14" style="color: var(--primary-text);">群成员</span>
        <div class="flex items-center">
          <span class="font-14" style="color: var(--primary-text);">{{conversation.memberCount}}人</span>
          <Icon icon="xiangyou"></Icon>
        </div>
      </div>
      <div class="flex items-center">
        <template v-if="conversation?.selfInfo?.role !== 'Member'">
          <div v-for="item in memberList.slice(0,6) " class="flex flex-col items-center justify-center" style="margin-right:12px;">
            <!-- conversation?.selfInfo?.role !== 'Member' ?: memberList.slice(0,8) -->
            <a-avatar shape="circle" :size="32" :src="item.avatar"></a-avatar>
            <div class="font-12 truncate" style="max-width:48px;color: var(-primary-text);">{{ item.nick }}</div>
          </div>
        </template>

        <template v-else>
          <div v-for="item in memberList.slice(0,7) " class="flex flex-col items-center justify-center" style="margin-right:10px;">
            <!-- conversation?.selfInfo?.role !== 'Member' ?: memberList.slice(0,8) -->
            <a-avatar shape="circle" :size="32" :src="item.avatar"></a-avatar>
            <div class="font-12 truncate" style="max-width:48px;color: var(-primary-text);">{{ item.nick }}</div>
          </div>
        </template>
        

        <div class="flex" >

          <div v-if="conversation.inviteOption !== 'DisableApply' &&  conversation.type !== 'AVChatRoom' && conversation?.selfInfo?.role !== 'Member'" 
           class="flex items-center justify-center active-button rounded-lg" 
           style="width: 32px; height: 32px; background: rgba(80,139,254,0.2);margin-right:8px;"
            @click="addGroupMember('add')"
          >
           <Icon icon="tianjia3" style="color: var(--success);"></Icon>
          </div>

          <div v-if="conversation?.selfInfo?.role !== 'Member'" class="flex items-center justify-center active-button rounded-lg" style="width: 32px; height: 32px; background: rgba(255,77,79,0.2);" @click="deleteMember('remove')">
            <Icon icon="jinzhi-yin" style="color: var(--error);"></Icon>
          </div>
        </div>
      </div>
    </div>


    
    <div class="rounded-lg pointer" style="background: var(--secondary-bg);padding: 14px 16px !important;margin-bottom: 16px !important;">
      <div class="flex items-center justify-between" style="margin-bottom: 11px;" v-if="conversation?.selfInfo?.role !== 'Member' && conversation.type !== 'AVChatRoom' && conversation.type !== 'Private'"  @click="enterGroupManage">
        <span class="font-14" style="color: var(--primary-text);">群管理</span>
        <Icon icon="xiangyou"></Icon>
      </div>

      <div class="flex items-center justify-between" style="padding: 14px 0;">
        <span class="font-14" style="color: var(--primary-text);">群ID</span>
        <div class="flex">
          <span  class="font-14" style="color: var(--secondary-text);">{{ conversation.groupID }}</span>
          <Icon icon="icon_copy" @click="handleGroupIDCopy"></Icon>
        </div>
      </div>

      <div class="flex items-center justify-between" style="padding: 14px 0;">
        <span class="font-14" style="color: var(--primary-text);">群类型</span>
        <span class="font-14" style="color: var(--secondary-text);">
          {{ typeName[conversation.type] }}
        </span>
      </div>

      <div class="flex items-center justify-between" style="padding: 14px 0;">
        <span class="font-14" style="color: var(--primary-text);">加群方式</span>
        <template v-if=" conversation?.selfInfo?.role !== 'Member' && conversation.type !== 'Private'">
          <div class="flex pointer" @click="updateGroupJoinWay">
            <span class="font-14" style="color: var(--secondary-text);">
              {{ typeName[conversation.joinOption] }}
            </span>
            <div  class="flex items-center" style="margin-left: 12px;">
              <Icon icon="xiangyou"></Icon>
            </div>
          </div>
        </template>
        <div v-else>
          <span class="font-14" style="color: var(--secondary-text);">
            {{ typeName[conversation.joinOption]  }}
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between" style="padding: 14px 0;">
        <span class="font-14" style="color: var(--primary-text);">邀请方式</span>
        <template v-if="conversation?.selfInfo?.role !== 'Member' && conversation.type !== 'AVChatRoom'">
          <div class="flex pointer" @click="updateGroupInviteWay">
            <span class="font-14" style="color: var(--secondary-text);">
              {{ typeName[conversation.inviteOption] }}
            </span>
            <div  class="flex items-center" style="margin-left: 12px;">
              <Icon icon="xiangyou"></Icon>
            </div>
          </div>
        </template>
        <div v-else>
          <span class="font-14" style="color: var(--secondary-text);">
            {{ typeName[conversation.inviteOption] }}
          </span>
        </div>
      </div>
    </div>
     
    <template v-if="conversation?.selfInfo?.role === 'Owner'">
      <div class="flex items-center justify-between" style="padding-bottom: 10px;">
         <div class="flex  rounded-lg pointer  active-button items-center justify-center" 
          style="width: 220px;height: 48px; background: var(--secondary-bg);color:var(--primary-text);"
          @click="changeOwner('change')"
         >
          转让群聊
        </div>
        <div  class="flex  rounded-lg pointer active-button items-center justify-center" 
         style="width: 220px;height: 48px; background: var(--error);color:var(--active-text);"
         @click="dismiss"
        >
          解散群聊
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex items-center justify-center" style="padding-bottom: 10px;">    
        <div class="flex  rounded-lg pointer active-button items-center justify-center" 
          style="width: 220px;height: 48px; background: var(--error);color:var(--active-text);"
          @click="exitGroupChat"
        >
          退出群聊
        </div>
      </div>
       
    </template>

  </div>

 <ChangeModal v-model:visible="isChangeOwner" v-if="isChangeOwner" :blurFlag="true">
    <UserSelect :type="type" :list="type === 'change' ?  memberList : '' " 
    :groupID="conversation.groupID"  @closeUser="close"
    >
    </UserSelect>
 </ChangeModal>

 <!-- type === 'addMember' ? friendList : memberList -->
 
 <ChangeModal v-model:visible="enableVisible" v-if="enableVisible" :blurFlag="true">
   <AddMemeber :type="memeberType" @closeUser="enableVisible = false"
    :list="memeberType === 'remove' ? memberList : friendList" :groupID="conversation.groupID"
    :updateGroup="openGroup"
   >
   </AddMemeber>
 </ChangeModal>
</template>

<script>
import { defineComponent, watchEffect, reactive, toRefs, computed, watch, ref, onMounted } from 'vue';
import useClipboard from 'vue-clipboard3';
import { message,Modal } from 'ant-design-vue'
import ChangeModal from '../../../../../components/Modal.vue';
import UserSelect from '../../../components/userselect/index.vue'
import AddMemeber from '../../../components/userselect/addMemeber.vue'
import _ from 'lodash-es'
import {appStore} from '../../../../../store'

const manage = defineComponent({
  props:['manageData','conversation','memberList','openGroup'],

  components:{ ChangeModal,UserSelect,AddMemeber },

  setup(props,ctx){
    const types = window.$TUIKit.TIM.TYPES
    const { GroupServer } = manage;
    const { t } = window.$TUIKit.config.i18n.useI18n();
    const state = appStore()

    const data = reactive({
      typeName: {
        [types.GRP_WORK]: '好友工作群',
        [types.GRP_PUBLIC]: '陌生人社交群',
        [types.GRP_MEETING]: '临时会议群',
        [types.GRP_AVCHATROOM]: '直播群',
        [types.JOIN_OPTIONS_FREE_ACCESS]: '自由加入',
        [types.JOIN_OPTIONS_NEED_PERMISSION]: '需要验证',
        [types.JOIN_OPTIONS_DISABLE_APPLY]: '禁止加群',
        [types.INVITE_OPTIONS_DISABLE_INVITE]:'禁止邀请',
        [types.INVITE_OPTIONS_FREE_ACCESS]:'自由邀请',
        [types.INVITE_OPTIONS_NEED_PERMISSION]:'需要验证'
      },
      isChangeOwner:false,
      enableVisible:false,
      type:'',  // 转让群聊点击按钮类型
      memeberType:'',
      groupServer:GroupServer,
      friendList:[], // 获取好友数据
    })

    const handleGroupIDCopy = async () => {  // 复制群组id 
      const { toClipboard } = useClipboard();
      const res = await toClipboard(props.conversation.groupID);
      if(res.text !== ""){
        message.success('群聊ID成功复制');
      }
    }

    const enterGroupManage = () =>{  // 进入群管理详情界面  
      ctx.emit('updateName',{title:'群管理',id:4,
       info:{
        groupID:props.conversation.groupID,
        role:props.conversation.selfInfo.role,
        list:props.memberList,
        conversation:props.conversation
       }
      })
    }

    const enterUpdateGroupName = () =>{  // 进入群管理名称编辑界面
      
      ctx.emit('updateName',
        {
         title:'群信息',id:1,
         info:{
          avatar:props.conversation.avatar,
          groupName:props.conversation.name,
          groupID:props.conversation.groupID,
          role:props.conversation.selfInfo.role
         },
        }
      )

    }

    const enterGroupMemeber = () =>{  // 进入群成员管理界面
      ctx.emit('updateName',{title:'群成员',id:3,info:{
        groupID:props.conversation.groupID,
        role:props.conversation.selfInfo.role,
        memberList:props.memberList
      }})
    }

    const enterGroupNotice = () =>{  // 进入群公告界面 
      const info = {
        groupID:props.conversation.groupID,
        notification:props.conversation.notification !== '' ? props.conversation.notification : '',
        role:props.conversation.selfInfo.role
      }

      ctx.emit('updateName',
       {
        title:'群公告',id:2,
        info:info
       }
      )

    }


    const exitGroupChat = () =>{  // 退出群聊 
      Modal.confirm({
        content: '确定退出该群聊吗',
        okText: '确认',
        cancelText: '取消',
        onOk (){
          quit()
          ctx.emit('close')
        }
      })
    }

    const quit = async () =>{
      await GroupServer.TUICore.tim.quitGroup(`${props.conversation.groupID}`)
      manage.TUIServer.store.conversation = {};
    }

 
    const deleteMember = (type) => {  // 删除群组成员 
      if(props.memberList.length > 1){
        data.enableVisible = true
        data.memeberType = type
      }else{
        data.enableVisible =  false
      }
    }

    const dismiss = async () =>{  // 解散群聊 
      Modal.confirm({
        content:'是否确认操作',
        okText:'确认',
        cancelText:'取消',
        onOk () {
          dismissGroup()
          ctx.emit('close')
        }
      })
      
    }

    const dismissGroup = async () =>{
      const res =  await window.$chat.dismissGroup(props.conversation.groupID)
      const result =  await window.$chat.deleteConversation(props.manageData.conversationID)
      if(res.code === 0 && result.code === 0){
        message.success(`${props.conversation.name}已被解散`)
      }
    }

    const changeOwner = (type) =>{  // 转让群聊
      if(props.memberList.length > 1){
        data.isChangeOwner = true
        data.type = type
      }else{
        data.isChangeOwner =  false
      }
      
    }

    const close = () =>{
      data.isChangeOwner = false
      ctx.emit('close')
    }

    const addGroupMember = (type) =>{  // 添加群聊成员
      
      if(props.conversation.inviteOption === 'DisableInvite'){
        if(props.conversation.selfInfo.role !== 'Member'){
          data.enableVisible = false
          message.error('禁止邀请群成员')
        }
      }else{
        data.enableVisible = true
        data.memeberType = type
      }

    }

    const getFriendLists = async () =>{
      const res = await GroupServer.TUICore.tim.getFriendList()
      const list = []
      for(let i=0;i<res.data.length;i++){
        list.push(res.data[i].profile)
      }
      const newList = _.filter(list,function(o){
        if(parseInt(o.userID) !== parseInt(state.$state?.userInfo?.uid)){
          return o
        }
      })
      data.friendList = newList
    }


  


    const updateGroupJoinWay = () =>{  // 修改加群方式
      ctx.emit('updateName',{title:'修改加群方式',id:5,info:{
        groupID:props.conversation.groupID,
        conversation:props.conversation,
        title:`${data.typeName[props.conversation.joinOption]}`
      }})
    }

    const updateGroupInviteWay = () =>{ // 修改群成员邀请
       ctx.emit('updateName',{
        title:'群成员邀请方式',
        id:6,
        info:{
         groupID:props.conversation.groupID,
         conversation:props.conversation,
         title:`${data.typeName[props.conversation.inviteOption]}`
        }
       })
    }

    onMounted(getFriendLists)

    return{
      ...toRefs(data),handleGroupIDCopy,close,
      enterGroupManage,enterUpdateGroupName,enterGroupMemeber,
      enterGroupNotice,exitGroupChat,quit,deleteMember,changeOwner,
      dismiss,addGroupMember,getFriendLists,updateGroupJoinWay,dismissGroup,
      updateGroupInviteWay,
    }
  }


})

export default manage;
</script>



<!-- <script lang="ts">
import { defineComponent, watchEffect, reactive, toRefs, computed, watch, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import Mask from '../../../components/mask/mask.vue';
import Transfer from '../../../components/transfer/index.vue';
import Slider from '../../../components/slider/index.vue';
import ManageName from './manage-name.vue';
import ManageNotification from './manage-notification.vue';
import ManageMember from './manage-member.vue';
import MemeberProfile from './member-profile.vue';
import Dialog from '../../../components/dialog/index.vue';

import Vuex from 'vuex';
import { handleErrorPrompts } from '../../utils';
import useClipboard from 'vue-clipboard3';


const manage = defineComponent({
  props: {
    userInfo: {
      type: Object,
      default: () => ({
        isGroup: false,
        list: [],
      }),
    },
    conversation: {
      type: Object,
      default: () => ({}),
    },
    show: {
      type: Boolean,
      default: () => false,
    },
    isH5: {
      type: Boolean,
      default: () => false,
    },
  },

  components: {
    Mask,
    Transfer,
    Slider,
    ManageName,
    ManageNotification,
    ManageMember,
    MemeberProfile,
    Dialog,
  },
  
  setup(props: any, ctx: any){
    const types: any = manage.TUIServer.TUICore.TIM.TYPES;
    const { GroupServer } = manage;
    const { t } = manage.TUIServer.TUICore.config.i18n.useI18n();

    const TabName = computed(() => {
      let name = '';
      switch (data.currentTab) {
        case 'notification':
          name = '群公告';
          break;
        case 'member':
          name = '群成员';
          break;
        case 'profile':
          name = '群成员';
          break;
        default:
          name = '群管理';
          break;
      }
      return name;
    });

    const data: any = reactive({
      conversation: {},
      userInfo: {
        isGroup: false,
        list: [],
      },
      isShowMuteTimeInput: false,
      editLableName: '',
      mask: false,
      currentTab: '',
      transferType: '',
      isSearch: false,
      isRadio: false,
      transferList: [],
      selectedList: [],
      isMuteTime: false,
      show: false,
      typeName: {
        [types.GRP_WORK]: '好友工作群',
        [types.GRP_PUBLIC]: '陌生人社交群',
        [types.GRP_MEETING]: '临时会议群',
        [types.GRP_AVCHATROOM]: '直播群',
        [types.JOIN_OPTIONS_FREE_ACCESS]: '自由加入',
        [types.JOIN_OPTIONS_NEED_PERMISSION]: '需要验证',
        [types.JOIN_OPTIONS_DISABLE_APPLY]: '禁止加群',
      },
      delDialogShow: false,
      userList: [],
      transferTitle: '',
      member: {
        admin: [],
        member: [],
        muteMember: [],
      },
      currentMember: {},
    });

    const dialog: any = ref();

    watchEffect(() => {
      data.conversation = props.conversation;
      data.userInfo = props.userInfo;
      data.show = props.show;
    });

    const VuexStore = ((window as any)?.TUIKitTUICore?.isOfficial && (Vuex as any)?.useStore()) || {};

    watch(
      () => data.userInfo.list,
      (newValue: any, oldValue: any) => {
        data.member = {
          admin: [],
          member: [],
          muteMember: [],
        };
        newValue.map((item: any) => {
          switch (item?.role) {
            case types.GRP_MBR_ROLE_ADMIN:
              data.member.admin.push(item);
              break;
            case types.GRP_MBR_ROLE_MEMBER:
              data.member.member.push(item);
              break;
            default:
              break;
          }
          return item;
        });
        const time: number = new Date().getTime();
        data.member.muteMember = newValue.filter((item: any) => item?.muteUntil * 1000 - time > 0);
      },
      { deep: true }
    );

    const isDismissGroupAuth = computed(() => {
      const { conversation } = data;
      const userRole = conversation?.groupProfile?.selfInfo.role;
      const groupType = conversation?.groupProfile?.type;

      const isOwner = userRole === types.GRP_MBR_ROLE_OWNER;
      const isWork = groupType === types.GRP_WORK;

      return isOwner && !isWork;
    });

    const isShowAddMember = computed(() => {
      const { conversation } = data;
      const groupType = conversation?.groupProfile?.type;
      const isWork = groupType === types.GRP_WORK;

      if (isWork) {
        return true;
      }
      return false;
    });

    const showUserNum = computed(() => {
      let num = 3;
      if (!isShowAddMember.value) {
        num += 1;
      }
      if ((data.conversation as any).groupProfile.selfInfo.role !== 'Owner') {
        num += 1;
      }
      return num;
    });

    const isAuth = computed(() => {
      const { conversation } = data;
      const userRole = conversation?.groupProfile?.selfInfo.role;

      const isOwner = userRole === types.GRP_MBR_ROLE_OWNER;
      const isAdmin = userRole === types.GRP_MBR_ROLE_ADMIN;

      return isOwner || isAdmin;
    });

    const isAdmin = computed(() => {
      const { conversation } = data;
      const groupType = conversation?.groupProfile?.type;
      const userRole = conversation?.groupProfile?.selfInfo.role;

      const isOwner = userRole === types.GRP_MBR_ROLE_OWNER;
      const isWork = groupType === types.GRP_WORK;
      const isAVChatRoom = groupType === types.GRP_AVCHATROOM;

      if (!isWork && !isAVChatRoom && isOwner) {
        return true;
      }
      return false;
    });

    const isSetMuteTime = computed(() => {
      const { conversation } = data;
      const groupType = conversation?.groupProfile?.type;
      const isWork = groupType === types.GRP_WORK;

      if (isWork || !isAuth.value) {
        return false;
      }
      return true;
    });

    const getMember = (type?: string) => {
      const { conversation } = data;
      const options: any = {
        groupID: conversation?.groupProfile?.groupID,
        count: 100,
        offset: type && type === 'more' ? data.userInfo.list.length : 0,
      };
      GroupServer.getGroupMemberList(options).then((res: any) => {
        if (type && type === 'more') {
          data.userInfo.list = [...data.userInfo.list, ...res.data.memberList];
        } else {
          data.userInfo.list = res.data.memberList;
        }
      });
    };

    const addMember = async (userIDList: any) => {
      const { conversation } = data;
      const options: any = {
        groupID: conversation.groupProfile.groupID,
        userIDList,
      };
      await GroupServer.addGroupMember(options);
      getMember('More');
    };

    const deleteMember = (user: any) => {
      const { conversation } = data;
      const options: any = {
        groupID: conversation.groupProfile.groupID,
        userIDList: [user.userID],
      };
      GroupServer.deleteGroupMember(options);
    };

    const changeOwner = async (userID: any) => {
      const options: any = {
        groupID: data.conversation.groupProfile.groupID,
        newOwnerID: userID,
      };
      const imResponse = await GroupServer.changeGroupOwner(options);
      data.conversation.groupProfile = {};
      data.conversation.groupProfile = imResponse.data.group;
    };

    const quit = async (group: any) => {
      await GroupServer.quitGroup(group.groupID);
      manage.TUIServer.store.conversation = {};
    };

    const dismiss = async (group: any) => {
      await GroupServer.dismissGroup(group.groupID);
      manage.TUIServer.store.conversation = {};
      (window as any)?.TUIKitTUICore?.isOfficial && VuexStore?.commit && VuexStore?.commit('handleTask', 5);
    };

    
    const handleAdmin = async (user: any) => {
      const { conversation } = data;
      let role = '';
      switch (user.role) {
        case types.GRP_MBR_ROLE_ADMIN:
          role = types.GRP_MBR_ROLE_MEMBER;
          break;
        case types.GRP_MBR_ROLE_MEMBER:
          role = types.GRP_MBR_ROLE_ADMIN;
          break;
      }
      const options: any = {
        groupID: conversation.groupProfile.groupID,
        userID: user.userID,
        role,
      };
      await GroupServer.setGroupMemberRole(options);
      getMember();
    };

    const setMemberMuteTime = async (userID: string, type?: string) => {
      const { conversation } = data;
      const options: any = {
        groupID: conversation.groupProfile.groupID,
        userID,
        muteTime: type === 'add' ? 60 * 60 * 24 * 30 : 0,
      };
      await GroupServer.setGroupMemberMuteTime(options);
      if (type === 'add') {
        (window as any)?.TUIKitTUICore?.isOfficial && VuexStore?.commit && VuexStore?.commit('handleTask', 4);
      }
      getMember();
    };

    const kickedOut = async (userIDList: any) => {
      const { conversation } = data;
      const options: any = {
        groupID: conversation.groupProfile.groupID,
        userIDList,
        reason: '',
      };
      await GroupServer.deleteGroupMember(options);
      getMember();
    };

    const edit = (labelName: string) => {
      data.editLableName = labelName;
    };

    const updateProfile = async (params: any) => {
      const { key, value } = params;
      const options: any = {
        groupID: data.conversation.groupProfile.groupID,
        [key]: value,
      };
      const res = await GroupServer.updateGroupProfile(options);
      const { conversation } = manage.TUIServer.store;
      conversation.groupProfile = res.data.group;
      manage.TUIServer.store.conversation = {};
      manage.TUIServer.store.conversation = conversation;
      data.editLableName = '';
    };

    const setTab = (tabName: string) => {
      data.currentTab = tabName;
      data.editLableName = '';
      if (data.currentTab === 'member') {
        data.transferType = 'remove';
      }
      if (!data.currentTab) {
        data.transferType = '';
      }
    };

    const handleSearchMember = async (value: string) => {
      let imResponse: any = {};
      let imMemberResponse: any = {};
      const options: any = {
        groupID: data.conversation.groupProfile.groupID,
        userIDList: [value],
      };
      switch (data.transferType) {
        case 'add':
          try {
            imMemberResponse = await GroupServer.getGroupMemberProfile(options);
            data.transferList = data.transferList.filter((item: any) => item.userID !== imResponse.data[0]?.userID);
            data.transferList = [...data.transferList, ...imResponse.data];
            if (imMemberResponse?.data?.memberList.length > 0) {
              data.transferList = data.transferList.map((item: any) => {
                if (item.userID === imMemberResponse?.data?.memberList[0].userID) {
                  item.isDisabled = true;
                }
                return item;
              });
            }
          } catch (error) {
            const message = t('TUIChat.manage.该用户不存在');
            handleErrorPrompts(message, props);
          }
          break;
        case 'remove':
          try {
            imResponse = await GroupServer.getGroupMemberProfile(options);
            if (imResponse.data.memberList.length === 0) {
              const message = t('TUIChat.manage.该用户不在群组内');
              return handleErrorPrompts(message, props);
            }
            data.transferList = data.transferList.filter(
              (item: any) => item.userID !== imResponse?.data?.memberList[0]?.userID
            );
            data.transferList = [...data.transferList, ...imResponse?.data?.memberList];
          } catch (error) {
            const message = t('TUIChat.manage.该用户不存在');
            handleErrorPrompts(message, props);
          }
          break;
        default:
          break;
      }
    };

    const submit = (userList: any) => {
      if (data.transferType === 'remove') {
        data.userList = userList;
        data.delDialogShow = !data.delDialogShow;
      } else {
        handleManage(userList, data.transferType);
      }
      data.mask = false;
    };

    const friendList = async () => {
      const imResponse = await manage.TUIServer.getFriendList();
      const friendList = imResponse.data.map((item: any) => item?.profile);
      return friendList.filter(
        (item: any) => !data.userInfo.list.some((infoItem: any) => infoItem.userID === item.userID)
      );
    };

    const cancel = () => {
      toggleMask();
    };

    const toggleMask = async (type?: string) => {
      data.selectedList = [];
      switch (type) {
        case 'add':
          data.isRadio = false;
          data.transferList = await friendList();
          data.transferTitle = '添加成员';
          break;
        case 'remove':
          data.isRadio = false;
          data.transferList = data.userInfo.list.filter(
            (item: any) => item.userID !== data.conversation?.groupProfile?.selfInfo.userID
          );
          data.transferTitle = '删除成员';
          break;
        case 'addAdmin':
          data.isRadio = true;
          data.transferList = data.member.member;
          data.transferTitle = '新增管理员';
          break;
        case 'removeAdmin':
          data.isRadio = true;
          data.transferList = data.member.admin;
          data.transferTitle = '移除管理员';
          break;
        case 'changeOwner':
          data.isRadio = true;
          data.transferList = [...data.member.admin, ...data.member.member];
          data.transferTitle = '转让群组';
          break;
        case 'addMute':
          data.isRadio = true;
          data.transferList = data.member.member;
          if (data.conversation.groupProfile.selfInfo.role === 'Owner') {
            data.transferList = [...data.member.admin, ...data.member.member];
          }
          data.transferTitle = '新增禁言用户';
          break;
        case 'removeMute':
          data.isRadio = true;
          data.transferList = data.member.muteMember;
          data.transferTitle = '移除禁言用户';
          break;
        default:
          break;
      }
      data.transferType = type;
      data.mask = !data.mask;
    };

    onClickOutside(dialog, () => {
      data.show = false;
    });

    const toggleShow = () => {
      if (!GroupServer) {
        const message = t('TUIChat.manage.请先注册 TUIGroup 模块');
        return handleErrorPrompts(message, props);
      }
      data.show = !data.show;
      if (!data.show) {
        data.currentTab = '';
      }
      if (data.show) {
        getMember();
      }
    };

    const setAllMuteTime = (value: boolean) => {
      updateProfile({ key: 'muteAllMembers', value });
      (window as any)?.TUIKitTUICore?.isOfficial && VuexStore?.commit && VuexStore?.commit('handleTask', 4);
    };

    const handleManage = (userList: any, type: any) => {
      const userIDList: any = [];
      userList.map((item: any) => {
        userIDList.push(item.userID);
        return item;
      });
      switch (type) {
        case 'add':
          addMember(userIDList);
          break;
        case 'remove':
          kickedOut(userIDList);
          break;
        case 'addAdmin':
          handleAdmin(userList[0]);
          break;
        case 'removeAdmin':
          handleAdmin(userList[0]);
          break;
        case 'changeOwner':
          changeOwner(userIDList[0]);
          break;
        case 'addMute':
          setMemberMuteTime(userIDList[0], 'add');
          break;
        case 'removeMute':
          setMemberMuteTime(userIDList[0], 'remove');
          break;
        default:
          break;
      }
    };

    const handleGroupIDCopy = async () => {
      try {
        const { toClipboard } = useClipboard();
        await toClipboard(data?.conversation?.groupProfile?.groupID);
      } catch (error) {
        handleErrorPrompts(error, data.env);
      }
    };

    const handleMemberProfileShow = (user: any) => {
      data.currentMember = user;
      setTab('profile');
    };

    return{
      ...toRefs(data),isDismissGroupAuth,  isShowAddMember, isSetMuteTime,
      isAdmin,  isAuth,  addMember,deleteMember, changeOwner,   quit, dismiss,
      handleAdmin,setMemberMuteTime,kickedOut, edit,updateProfile,
      setTab, TabName,getMember,handleSearchMember,submit,cancel, toggleMask,
      toggleShow, setAllMuteTime,handleManage,showUserNum,dialog,
      handleGroupIDCopy, handleMemberProfileShow,
    }
  }
  
  
})

export default manage;
</script> -->


<style lang="scss" scoped src="./style/index.scss"></style>
<style lang="scss" scoped>
.font-14{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}

.font-12{
  font-family: PingFangSC-Regular;
  font-size: 12px;
  font-weight: 400;
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

