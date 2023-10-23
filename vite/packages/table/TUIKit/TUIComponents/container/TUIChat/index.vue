<template>
  <div class="TUIChat" :class="[env.isH5 ? 'TUIChat-H5' : '']" v-if="conversationType === 'chat'">
    <header class="TUIChat-header">
      <i class="icon icon-back" @click="back" v-if="env.isH5"></i>
      <TypingHeader :needTyping="needTyping" :conversation="conversation" :messageList="messageList" ref="typingRef" />
      
      <div class="flex"  v-if="conversation.groupProfile">
        <div class="flex items-center pointer" @click="openNotice">
          <SoundOutlined style="color: var(--secondary-text);font-size: 1.25em;"/>
          <!-- <Icon icon="akar-icons:sound-on" /> -->
        </div>
  
        <div class="flex items-center pointer " style="margin-left:12px;" @click="openGroup">
          <Icon icon="gengduo1" style="color: var(--secondary-text);"></Icon>
        </div>
      </div>
    </header>


    <div class="TUIChat-main">
      <ul class="TUI-message-list" @click="dialogID = ''" ref="messageEle" id="messageEle">
        <p class="message-more" @click="getHistoryMessageList" v-if="!isCompleted">
          {{ $t('TUIChat.查看更多') }}
        </p>
        <li v-for="(item, index) in messages" :key="index" :id="item?.ID" ref="messageAimID">
          <MessageTimestamp :currTime="item?.time" :prevTime="index > 0 ? (messages[index-1]?.time) : 0"></MessageTimestamp>
          <MessageItem
            :message="item"
            :env="env"
            :types="types"
            :displayGroupMessageReadReceipt="needGroupReceipt"
            :displayEmojiReactions="isNeedEmojiReact"
            :messageList="messages"
            @handleEditor="handleEditor"
            @showDialog="showDialog"
            @uploading="handleUploadingImageOrVideo"
            @jumpID="jumpID"
            @resendMessage="resendMessage"
          >
          </MessageItem>
        </li>
        <div class="to-bottom-tip" v-if="needToBottom" @click="scrollToTarget('bottom')">
          <i class="icon icon-bottom-double"></i>
          <div class="to-bottom-tip-cont">
            <span>{{ toBottomTipCont }}</span>
          </div>
        </div>
      </ul>
      <div class="dialog dialog-conversation" v-if="forwardStatus && messageComponents.Forward">
        <component
          :is="'Forward'"
          :list="conversationData.list"
          :message="currentMessage"
          :show="forwardStatus"
          :isH5="env.isH5"
          @update:show="(e: any) => (forwardStatus = e)"
        >
          <template #left="{ data }">
            <img class="avatar" :src="conversationData.handleAvatar(data)" />
            <label class="name">{{ conversationData.handleName(data) }}</label>
          </template>
          <template #right="{ data }">
            <img class="avatar" :src="conversationData.handleAvatar(data)" />
            <label class="name" v-if="!env.isH5">{{ conversationData.handleName(data) }}</label>
          </template>
        </component>
      </div>
      <div class="dialog dialog-conversation">
        <ReadReceiptDialog
          :message="currentMessage"
          :conversation="conversation"
          :show="receiptDialogStatus"
          :isH5="env.isH5"
          @closeDialog="closeDialog"
          ref="readReceiptDialog"
        />
      </div>
      <imagePreviewer
        v-if="showImagePreview"
        :currentImage="currentImagePreview"
        :imageList="imageList"
        @close="showImagePreview = false"
      />
    </div>

    <div class="TUIChat-footer" :class="[isMute && 'disabled', env.isH5 && 'TUIChat-H5-footer']">
      <div class="func" id="func">
        <main class="func-main px-2.5 py-3 flex items-center">
          <component
            v-for="(item, index) in hasPluginComponentList"
            :key="index"
            :isMute="isMute"
            :is="item"
            :isH5="env.isH5"
            :conversation="conversation"
            parentID="func"
            @send="handleSend"
          ></component>
        </main>
      </div>
      <MessageInput
        ref="messageInput"
        :conversation="conversation"
        :memberList="allMemberList"
        :env="env"
        :isGroup="userInfo?.isGroup"
        :replyOrReference="reference"
        :isMute="isMute"
        :muteText="muteText"
        :placeholder="$t('TUIChat.请输入消息')"
        @sendMessage="reportMessageSend"
        @resetReplyOrReference="resetReplyOrReference"
        @onTyping="handleTyping"
      ></MessageInput>
    </div>

    <div v-show="showResend" class="mask" @click="showResend = false">
      <div class="mask-main">
        <header>{{ $t('TUIChat.确认重发该消息？') }}</header>
        <footer>
          <p @click="showResend = false">{{ $t('TUIChat.取消') }}</p>
          <i></i>
          <p @click="submit">{{ $t('TUIChat.确定') }}</p>
        </footer>
      </div>
    </div>
  </div>

  <div class="TUIChat" v-else-if="conversationType === 'system'">
    <header class="TUIChat-header">
      <h1>{{ conversationName }}</h1>
    </header>
    <MessageSystem :data="messages" :types="types" @application="handleApplication" />
  </div>

  <slot v-else-if="slotDefault" />

  <a-drawer placement="right" width="500" title="群管理" v-model:visible="groupVisible" :bodyStyle="{padding:'24px 24px 40px 24px'}">
    <!-- :closable="false" -->
    <!-- <div class="flex items-center" style="margin-bottom:16px;">
      <div class="flex items-center active-button pointer justify-center rounded-lg" style="width: 48px;height: 48px;background: var(--secondary-bg);" @click="groupVisible = false">
        <Icon icon="guanbi" style="color: var(--primary-text);height: 24px;width: 24px;"></Icon>
      </div>
      <div class="flex items-center justify-center font-16" style="color: var(--primary-text);margin-left: 12px;">群管理</div>
    </div> -->
    <Manage v-if="conversation.groupProfile" @close="groupVisible = false" :manageData="conversation" :openGroup="openGroup" :conversation="newManagerList" :memberList="memberList"  @updateName="getManege" />
  </a-drawer>

  <a-drawer placement="right" width="500" :closable="false" v-model:visible="updateVisible">
    <div class="flex items-center" style="margin-bottom:16px;">
      <div class="flex items-center active-button pointer justify-center rounded-lg" style="width: 48px;height: 48px;background: var(--secondary-bg);" @click="updateVisible = false">
        <Icon icon="xiangzuo" style="color: var(--primary-text);height: 24px;width: 24px;"></Icon>
      </div>
      <div class="flex items-center font-16 justify-center" style="color: var(--primary-text);margin-left: 12px;">{{ title }}</div>
    </div>

    <template v-if="index === 1">
      <UpdateGroupName @close="updateVisible = false" :info="info"  :server="GroupServer" @updateGroupInfo="openGroup"></UpdateGroupName>
    </template>

    <template v-if="index === 2">
      <UpdateGroupNotice :noticeInfo="info" @close="updateVisible = false" :server="GroupServer" @updateGroupInfo="openGroup"></UpdateGroupNotice>
    </template>
    
    <template v-if="index === 3">
      <UpdateMemeber :memberInfo="info" @close="updateVisible = false" :server="GroupServer"></UpdateMemeber>
    </template>
    
    <template v-if="index === 4">
      <UpdateGroupManage :groupManageInfo="info" :server="GroupServer" @close="updateVisible = false"></UpdateGroupManage>
    </template>

    <template v-if="index === 5">
      <UpdateJoinGroupWay :updateGroupInfo="info" @close="updateVisible = false" @updateGroupInfo="openGroup"/>
    </template>
    <template v-if="index === 6">
     <UpdateInviteWay :updateInviteInfo="info" @close="updateVisible = false" @updateGroupInfo="openGroup"></UpdateInviteWay>
    </template>
  </a-drawer>


  <teleport to='body' >
    <Modal v-model:visible="inForward" v-if="inForward" :blurFlag="true">
       <ForwardModal :content="currentMessage" @close="inForward =false"></ForwardModal>
    </Modal>
  </teleport>
  

</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  computed,
  nextTick,
  watch,
  useSlots,
  onMounted,
  watchEffect,
} from 'vue';
import { MessageSystem, MessageItem, MessageTimestamp } from './components';
import { onClickOutside } from '@vueuse/core';
import { Manage } from './manage-components';
import { SoundOutlined } from '@ant-design/icons-vue'

import {
  handleAvatar,
  handleName,
  getImgLoad,
  isTypingMessage,
  deepCopy,
  isMessageTip,
  handleReferenceForShow,
} from './utils/utils';

import { getComponents } from './index';

import { useStore } from 'vuex';
import constant from '../constant';
import { handleErrorPrompts } from '../utils';
import Link from '../../../utils/link';
import { Message } from './interface';
import { Conversation } from '../TUIConversation/interface';

import MessageInput from './message-input';
import UpdateGroupName from '../TUIChat/updateMange/updateGroupName.vue'
import UpdateMemeber from '../TUIChat/updateMange/updateGroupMember.vue'
import UpdateGroupManage from './updateMange/updateGroupManage.vue'
import UpdateGroupNotice from './updateMange/updateGroupNotice.vue';
import UpdateJoinGroupWay from './updateMange/updateJoinGroupWay.vue';
import UpdateInviteWay from './updateMange/updateInviteWay.vue'
import Modal from '../../../../components/Modal.vue';
import ForwardModal from './components/forwardModal.vue';
// import { Icon } from '@iconify/vue'
// 

const TUIChat: any = defineComponent({
  name: 'TUIChat',
  components: {
    MessageSystem,MessageTimestamp,Manage,MessageInput,
    MessageItem,UpdateGroupName,UpdateMemeber,UpdateGroupManage,
    UpdateGroupNotice,UpdateJoinGroupWay,UpdateInviteWay,
    Modal,ForwardModal,SoundOutlined
  },
  props: {
    isMsgNeedReadReceipt: {
      type: Boolean,
      default: false,
    },
    isNeedTyping: {
      type: Boolean,
      default: true,
    },
    isNeedEmojiReact: {
      type: Boolean,
      default: true,
    },
  },

  computed:{
    hasPluginComponentList(){   // 这里进行修改的地方,根据设计稿将不同的图标以及交互进行提取
      const requiredElements = ["Image", "Face", "File", "Words", "Call"]
      return this.pluginComponentList.filter((item: string) => requiredElements.includes(item));
    },
  },

  data(){
    return{
      updateVisible:false, // 群组名称编辑控制
      title:'',  // 不同群组模块的标题
      index:'',   // 不同群组模块的标记
      info:'', // 不同群组模块的公告
    }
  },

  methods:{
    getManege(val:any){
      this.title = val.title
      this.index = val.id
      this.info = val.info
      this.updateVisible = true
    },
    // 点击公告打开公告界面
    openNotice(){
      const info = {
        groupID:this.conversation.groupProfile.groupID,
        notification:this.conversation.groupProfile.notification,
        role:this.conversation.groupProfile.selfInfo.role
      }
      this.updateVisible = true
      this.index = 2
      this.info = info
    }
  },

  setup(props) {
    const { TUIServer } = TUIChat;
    const GroupServer = TUIServer?.TUICore?.TUIServer?.TUIGroup;
    const ProfileServer = TUIServer?.TUICore?.TUIServer?.TUIProfile;
    const VuexStore = (TUIServer.TUICore.isOfficial && useStore && useStore()) || {};
    const { t } = (window as any).TUIKitTUICore.config.i18n.useI18n();
    const data = reactive({
      GroupServer:GroupServer,
      messageList: [] as Message[],
      conversation: {} as Conversation,
      groupVisible:false,   // 群组管理信息控制
      text: '',
      atText: '',
      types: TUIServer.TUICore.TIM.TYPES,
      currentMessage: {} as Message,
      dialogID: '',
      forwardStatus: false,
      receiptDialogStatus: false,
      repliesDialogStatus: false,
      showImagePreview: false,
      currentImagePreview: {} as Message,
      isCompleted: false,
      userInfoView: false,
      userInfo: {
        isGroup: false,
        list: [],
      },
      selfInfo: {},
      messageComponents: getComponents('message'),
      isShow: false,
      muteText: '您已被管理员禁言',
      isFirstSend: true,
      isFirstRender: true,
      showGroupMemberList: false,
      reference: {
        message: {} as Message,
        content: '',
        type: 0, // message type
        show: '', // 'reference' or 'reply'
      },
      historyReference: false,
      referenceID: '',
      allMemberList: [],
      env: TUIServer.TUICore.TUIEnv,
      showResend: false,
      resendMessage: {},
      inputBlur: false,
      inputComposition: false,
      inputCompositionCont: '',
      needTyping: props.isNeedTyping,
      needReadReceipt: false,
      peerNeedReceipt: false,
      needToBottom: false,
      toBottomTipCont: '',
      messageInView: [] as Message[],
      readSet: new Set(),
      isUserAction: false,
      scroll: {
        scrollTop: 0,
        scrollHeight: 0,
        scrollTopMin: Infinity,
        scrollTopMax: 0,
      },
      isMsgNeedReadReceipt: false,
      isNeedEmojiReact: false,
      dropDownRef: null,
      typingRef: null,
      newManagerList:{}, // 接收群组管理信息
      memberList:[], // 获取群组成员数据
      inForward:false,// 点击转发功能
      // forWardContent:'',// 接收转发的内容
    });

    const slotDefault = !!useSlots().default;
    // 调用 TUIConversation 模块的 setMessageRead 方法
    // 消息已读
    // Using the setMessageRead method of the TUIConversion module
    const setMessageRead = async (conversationID: string | undefined) => {
      if (!conversationID) return;
      await TUIServer?.TUICore?.TUIServer?.TUIConversation?.setMessageRead(conversationID);
      return;
    };

    const sendMessageReadReceipt = async (messageList: Message[]) => {
      const needReceiptMessageList = messageList.filter(
        (item: Message) => item?.flow === 'in' && item?.needReadReceipt && !data.readSet.has(item?.ID)
      );
      if (needReceiptMessageList.length) {
        await TUIServer?.sendMessageReadReceipt(needReceiptMessageList).then(() => {
          needReceiptMessageList.forEach((item: Message) => data.readSet.add(item?.ID));
        });
      }
      await setMessageRead(data?.conversation?.conversationID);
    };

    const pluginComponentList: any = [];
    Object.keys(getComponents('send')).forEach((name: any) => {
      pluginComponentList.push(name);
    });

    Manage.TUIServer = TUIServer;
    Manage.GroupServer = TUIServer?.TUICore?.TUIServer?.TUIGroup;

    const messageEle = ref();
    const inputEle: any = ref();
    const messageAimID = ref();
    const readReceiptDialog = ref();
    const messageInput = ref();

    TUIServer.bind(data);

    const conversationData = {
      list: [],
      handleAvatar,
      handleName,
    };

    const dialog: any = ref();

    onClickOutside(dialog, () => {
      data.showGroupMemberList = false;
    });

    const conversationType = computed(() => {
      const { conversation } = data;
      if (!conversation?.conversationID) {
        return '';
      }
      if (conversation?.type === TUIServer.TUICore.TIM.TYPES.CONV_SYSTEM) {
        return 'system';
      }
      return 'chat';
    });

    const isMute = computed(() => {
      const { conversation } = data;
      if (conversation?.type === TUIServer.TUICore.TIM.TYPES.CONV_GROUP) {
        const userRole = conversation?.groupProfile?.selfInfo.role;
        const isMember = userRole === TUIServer.TUICore.TIM.TYPES.GRP_MBR_ROLE_MEMBER;
        if (isMember && conversation?.groupProfile?.muteAllMembers) {
          // data.muteText = "管理员开启全员禁言";
          return true;
        }
        const time: number = new Date().getTime();
        if ((data.selfInfo as any)?.muteUntil * 1000 - time > 0) {
          // data.muteText = "您已被管理员禁言";
          return true;
        }
      }
      return false;
    });

    watchEffect(() => {
      data.isMsgNeedReadReceipt = props.isMsgNeedReadReceipt;
      data.needReadReceipt = data.isMsgNeedReadReceipt;
      data.needTyping = props.isNeedTyping;
      data.isNeedEmojiReact = props.isNeedEmojiReact;
    });

    watch(
      () => data?.conversation?.conversationID,
      (newVal: () => string | undefined, oldVal: () => string | undefined) => {
        if (newVal === oldVal) return;
        data.scroll.scrollTop = 0;
        data.scroll.scrollHeight = 0;
        data.scroll.scrollTopMin = Infinity;
        data.scroll.scrollTopMax = 0;
        data.text = '';
        data.atText = '';
        data.reference = {
          message: {} as Message,
          content: '',
          type: 0,
          show: '',
        };
      },
      {
        deep: true,
      }
    );

    watch(isMute, (newVal: any, oldVal: any) => {
      const { conversation } = data;
      if (newVal && conversation?.type === TUIServer.TUICore.TIM.TYPES.CONV_GROUP) {
        const userRole = conversation?.groupProfile?.selfInfo.role;
        const isMember = userRole === TUIServer.TUICore.TIM.TYPES.GRP_MBR_ROLE_MEMBER;
        if (isMember && conversation?.groupProfile?.muteAllMembers) {
          data.muteText = '管理员开启全员禁言';
        }
        const time: number = new Date().getTime();
        if ((data.selfInfo as any)?.muteUntil * 1000 - time > 0) {
          data.muteText = '您已被管理员禁言';
        }
      }
    });

    const conversationName = computed(() => {
      const { conversation } = data;
      return handleName(conversation);
    });

    const messages = computed(() => data.messageList.filter((item: any) => !item.isDeleted && !isTypingMessage(item)));
    const imageList = computed(() =>
      messages?.value?.filter((item: Message) => {
        return !item.isRevoked && item.type === data.types.MSG_IMAGE;
      })
    );

    const needGroupReceipt = computed(() => {
      const { conversation, needReadReceipt } = data;
      if (conversation?.type === TUIServer.TUICore.TIM.TYPES.CONV_C2C || needReadReceipt) {
        return true;
      }
      return false;
    });

    watch(
      messages,
      (newVal: Array<Message>, oldVal: Array<Message>) => {
        nextTick(() => {
          const isTheSameMessage = newVal[newVal.length - 1]?.ID === oldVal[oldVal.length - 1]?.ID;
          if (newVal.length === 0 || isTheSameMessage) {
            return;
          }
          handleScroll();
        });
        if (data.currentMessage) {
          const messageID = data.currentMessage?.ID;
          const message = newVal.find((item: any) => item.ID === messageID);
          if (message) {
            data.currentMessage = deepCopy(message);
          }
        }
        if (data.historyReference) {
          for (let index = 0; index < messages.value.length; index++) {
            if (messages?.value[index]?.ID === data?.referenceID) {
              scrollToTarget('target', messageAimID.value[index]);
              messageAimID.value[index].getElementsByClassName('content')[0].classList.add('reference-content');
            }
          }
          data.historyReference = false;
        }
      },
      { deep: true }
    );

    watch(
      () => data.scroll.scrollTop,
      (newVal: number) => {
        setTimeout(() => {
          // scrolling end
          if (newVal === messageEle?.value?.scrollTop) {
            if (data.scroll.scrollTopMin !== Infinity && data.scroll.scrollTopMax !== 0) {
              sendMessageReadInView('scroll');
            }
            data.scroll.scrollTopMin = Infinity;
            data.scroll.scrollTopMax = 0;
          }
        }, 20);
      },
      { deep: true }
    );

    onMounted(() => {
      watch(
        () => messageEle?.value,
        () => {
          if (messageEle?.value) {
            messageEle.value.addEventListener('scroll', onScrolling);
          }
        },
        {
          deep: true,
        }
      );
    });

    const handleSend = (emoji: any) => {
      messageInput?.value?.addEmoji(emoji);
    };

    const reportMessageSend = async (event: any) => {
      if (data.isFirstSend) {
        data.isFirstSend = false;
      }
      data.reference.show = '';
      TUIServer.TUICore.isOfficial && VuexStore?.commit && VuexStore?.commit('handleTask', 0);
    };

    const handleItem = (item: any) => {
      data.currentMessage = item;
      data.dialogID = item.ID;
    };

    const resendMessage = (message: Message) => {
      if (data.env.isH5) {
        data.showResend = true;
        data.resendMessage = message;
      } else {
        TUIServer.resendMessage(message).catch((error: any) => {
          handleErrorPrompts(error, data.env);
        });
      }
    };

    const forwardMessage = (message: Message) => {   // 转发回调函数
      data.currentMessage = message;
      conversationData.list = TUIServer.TUICore.getStore().TUIConversation.conversationList;
      data.forwardStatus = true;
    };

    const referOrReplyMessage = (message: Message, type: any) => {
      let replyObj = handleReferenceForShow(message);
      data.reference = {
        message,
        content: replyObj?.referenceMessageForShow,
        type: replyObj?.referenceMessageType,
        show: type,
      };
    };

    const submit = () => {
      TUIServer.resendMessage(data.resendMessage)
        .then(() => {
          data.showResend = false;
        })
        .catch((error: any) => {
          handleErrorPrompts(error, data.env);
          data.showResend = false;
        });
    };

    const handleEdit = (item: any) => {
      if (!item?.payload?.text) return;
      messageInput?.value?.reEdit(item?.payload?.text);
    };

    const handleApplication = (options: any) => {
      TUIServer.handleGroupApplication(options);
    };

    const pasting = (e: any) => {
      if (e.clipboardData.files[0]) {
        TUIServer.sendImageMessage(e.clipboardData.files[0]);
      }
    };

    const getHistoryMessageList = async () => {
      await TUIServer.getHistoryMessageList().then(() => {
        scrollToTarget('target', messageEle?.value?.firstElementChild);
      });
    };

    const jumpID = (messageID: string) => {
      data.referenceID = messageID;
      const list: any = [];
      // If the referenced message is in the current messageList, you can jump directly. Otherwise, you need to pull the historical message
      for (let index = 0; index < messages.value.length; index++) {
        list.push(messages?.value[index]?.ID);
        if (list.indexOf(messageID) !== -1 && messages.value[index]?.ID === messageID) {
          scrollToTarget('target', messageAimID.value[index]);
          messageAimID.value[index].getElementsByClassName('content')[0].classList.remove('reference-content');
          nextTick(() => {
            messageAimID.value[index].getElementsByClassName('content')[0].classList.add('reference-content');
          });
        }
      }
      if (list.indexOf(messageID) === -1) {
        TUIServer.getHistoryMessageList().then(() => {
          data.historyReference = true;
        });
      }
    };

    const toggleshowGroupMemberList = () => {
      data.showGroupMemberList = !data.showGroupMemberList;
    };

    const back = () => {
      TUIServer.TUICore.TUIServer.TUIConversation.handleCurrentConversation();
    };

    const openLink = (type: any) => {
      window.open(type.url);
    };

    const handleEditor = (message: Message, type: string) => {
      if (!message || !type) return;
      switch (type) {
        case 'reference':
          referOrReplyMessage(message, type);
          break;
        case 'reply':
          referOrReplyMessage(message, type);
          break;
        case 'reedit':
          if (message?.payload?.text) {
            messageInput?.value?.reEdit(message?.payload?.text);
          }
          break;
        default:
          break;
      }
    };

    const showDialog = async (message: Message, type: string) => {
      if (!message?.ID || !type) return;
      switch (type) {
        case 'receipt':
          if (
            message.conversationType !== TUIServer.TUICore.TIM.TYPES.CONV_GROUP ||
            message.readReceiptInfo?.unreadCount === 0
          ) {
            return;
          }
          data.currentMessage = message;
          data.receiptDialogStatus = true;
          break;
        case 'replies':
          data.currentMessage = message;
          data.repliesDialogStatus = true;
          break;
        case 'forward':   // 显示转发内容的回调函数
          data.inForward = true;
          // console.log('测试转发功能是否有用::>>',message)
          // data.forWardContent = message.payload
          data.currentMessage = message;
          // conversationData.list = TUIServer.TUICore.getStore().TUIConversation.conversationList;
          break;
        case 'previewImage':
          data.showImagePreview = !data.showImagePreview;
          data.currentImagePreview = message;
          break;
        default:
          break;
      }
    };

    const closeDialog = async (type: string) => {
      if (!type) return;
      switch (type) {
        case 'receipt':
          data.currentMessage = {};
          data.receiptDialogStatus = false;
          break;
        case 'replies':
          data.currentMessage = {};
          data.repliesDialogStatus = false;
          break;
        default:
          break;
      }
    };

    const handleScroll = () => {
      if (data.isFirstRender) {
        data.needToBottom = false;
        scrollToTarget('bottom');
        data.isFirstRender = false;
        return;
      }
      if (messageEle.value) {
        const { scrollHeight, scrollTop, clientHeight } = messageEle.value;
        if (
          scrollHeight - (scrollTop + clientHeight) <= clientHeight ||
          messages.value[messages.value.length - 1]?.flow === 'out'
        ) {
          scrollToTarget('bottom');
        } else {
          handleToBottomTip(true);
        }
      }
    };

    const scrollToTarget = (type: string, targetElement?: HTMLElement) => {
      messageEle?.value?.removeEventListener('scroll', onScrolling);
      data.isUserAction = true;
      switch (type) {
        case constant.scrollType.toBottom:
          data.needToBottom = false;
          nextTick(() => {
            if (data?.env?.isH5) {
              handleH5Scroll();
            } else {
              messageEle?.value?.lastElementChild?.scrollIntoView(false);
            }
            getImgLoad(messageEle?.value, 'message-img', async () => {
              if (data?.env?.isH5) {
                handleH5Scroll();
              } else {
                messageEle?.value?.lastElementChild?.scrollIntoView(false);
              }
              messageEle.value.addEventListener('scroll', onScrolling);
              await sendMessageReadInView('page');
            });
          });
          break;
        case constant.scrollType.toTarget:
          nextTick(() => {
            targetElement?.scrollIntoView(false);
            getImgLoad(messageEle?.value, 'message-img', async () => {
              targetElement?.scrollIntoView(false);
              messageEle.value.addEventListener('scroll', onScrolling);
              await sendMessageReadInView('page');
            });
          });

          break;
        default:
          break;
      }
    };

    const handleH5Scroll = () => {
      if (document?.getElementById('app')?.style) {
        (document.getElementById('app') as any).style.marginBottom = ``;
        (document.getElementById('app') as any).style.height = `100%`;
      }
      messageEle.value.scrollTop = messageEle.value.scrollHeight;
    };

    const onScrolling = () => {
      const { scrollHeight, scrollTop, clientHeight } = messageEle.value;
      if (needGroupReceipt.value) {
        data.scroll.scrollHeight = scrollHeight;
        data.scroll.scrollTop = scrollTop;
        data.scroll.scrollTopMin = data.isUserAction
          ? data.scroll.scrollTopMin
          : Math.min(data.scroll.scrollTopMin, data.scroll.scrollTop);
        data.scroll.scrollTopMax = data.isUserAction
          ? data.scroll.scrollTopMax
          : Math.max(data.scroll.scrollTopMax, data.scroll.scrollTop);
      }
      if (scrollHeight - (scrollTop + clientHeight) > clientHeight) {
        handleToBottomTip(true);
      } else {
        handleToBottomTip(false);
      }
      data.isUserAction = false;
    };

    const handleToBottomTip = (needToBottom: boolean) => {
      switch (needToBottom) {
        case true:
          data.needToBottom = true;
          if (data?.conversation?.unreadCount && data?.conversation?.unreadCount > 0) {
            data.toBottomTipCont = `${data?.conversation?.unreadCount} ${t('TUIChat.条新消息')}`;
          } else {
            data.toBottomTipCont = t('TUIChat.回到最新位置');
          }
          break;
        case false:
          data.needToBottom = false;
          break;
        default:
          data.needToBottom = false;
          break;
      }
    };

    const sendMessageReadInView = async (type: string) => {
      if (!needGroupReceipt.value) {
        setMessageRead(data?.conversation?.conversationID);
        return;
      }
      if (data.messageInView.length) data.messageInView = [] as Message[];
      let start = 0;
      let end = 0;
      switch (type) {
        case constant.inViewType.page:
          start = data.scroll.scrollTop;
          end = data.scroll.scrollTop + messageEle?.value?.clientHeight;
          break;
        case constant.inViewType.scroll:
          start = data.scroll.scrollTopMin;
          end = data.scroll.scrollTopMax + messageEle?.value?.clientHeight;
          break;
        default:
          break;
      }
      for (let i = 0; i < messageAimID?.value?.length; i++) {
        if (isInView(type, messageAimID?.value[i], start, end)) {
          const message = messages.value[i];
          data.messageInView.push(message);
        }
      }
      await sendMessageReadReceipt(data.messageInView);
    };

    const isInView = (type: string, dom: HTMLElement, viewStart: number, viewEnd: number) => {
      const containerTop = messageEle.value.getBoundingClientRect().top;
      const containerBottom = messageEle.value.getBoundingClientRect().bottom;
      const { top, bottom } = dom.getBoundingClientRect();
      const { offsetTop, clientHeight } = dom;
      switch (type) {
        case constant.inViewType.page:
          return Math.round(top) >= Math.round(containerTop) && Math.round(bottom) <= Math.round(containerBottom);
        case constant.inViewType.scroll:
          return (
            Math.round(offsetTop) >= Math.round(viewStart) &&
            Math.round(offsetTop + clientHeight) <= Math.round(viewEnd)
          );
        default:
          return false;
      }
    };

    const handleDropDownOpen = (value: any) => {
      if (data.dropDownRef) {
        (data.dropDownRef as any).removeChild((data.dropDownRef as any).children[0]);
      }
      data.dropDownRef = value;
    };

    const handleUploadingImageOrVideo = () => {
      scrollToTarget('bottom');
    };

    const handleImagePreview = (message: any) => {
      data.showImagePreview = !data.showImagePreview;
      data.currentImagePreview = message;
    };

    const resetReplyOrReference = () => {
      data.reference = {
        message: {} as Message,
        content: '',
        type: 0,
        show: '',
      };
    };

    const handleTyping = (inputContentEmpty: boolean, inputBlur: boolean) => {
      (data?.typingRef as any)?.onTyping(inputContentEmpty, inputBlur);
    };

    const openGroup = async () =>{  // 打开右侧抽屉
      data.groupVisible = true
        
      const option = {  
        groupID:data.conversation.groupProfile?.groupID
      }
      const options ={
        groupID:data.conversation.groupProfile?.groupID,  // 群组id
        count: 500,  // 
        offset: 0
      }
      const res = await TUIServer.TUICore?.tim.getGroupProfile(option)  // 获取群组详细资料
      data.newManagerList = res.data.group
      
      const result = await GroupServer.getGroupMemberList(options)
      // 将群组成员进行排序,将群主和管理员放在最前面
      const list = result.data.memberList.sort((a: any,b: any)=>{ 
        if (a.role === 'Owner' && b.role !== 'Owner') {
         return -1; // a 排在 b 前面
        } else if (b.role === 'Owner' && a.role !== 'Owner') {
         return 1; // b 排在 a 前面
        } else if (a.role === 'Admin' && b.role !== 'Admin') {
         return -1; // a 排在 b 前面
        } else if (b.role === 'Admin' && a.role !== 'Admin') {
         return 1; // b 排在 a 前面
        } else {
         return 0; // 保持原有顺序
        }
      })
      data.memberList = list
    }




    return {
      ...toRefs(data),
      conversationType,
      messages,
      messageEle,
      inputEle,
      messageInput,
      messageAimID,
      conversationData,
      conversationName,
      constant,
      reportMessageSend,
      handleTyping,
      handleItem,
      handleEdit,
      handleEditor,
      getHistoryMessageList,
      handleApplication,
      pluginComponentList,
      handleSend,
      closeDialog,
      isMute,
      pasting,
      setMessageRead,
      sendMessageReadReceipt,
      dialog,
      jumpID,
      back,
      slotDefault,
      toggleshowGroupMemberList,
      resendMessage,openGroup,
      submit,
      Link,
      openLink,
      readReceiptDialog,
      scrollToTarget,
      needGroupReceipt,
      handleDropDownOpen,
      isMessageTip,
      showDialog,
      forwardMessage,
      referOrReplyMessage,
      handleUploadingImageOrVideo,
      handleImagePreview,
      imageList,
      resetReplyOrReference,
    };
  },
});
export default TUIChat;
</script>

<style lang="scss" scoped src="./style/index.scss"></style>
<style lang="scss" scoped>
:deep(.TUIChat-header h1){
  color:var(--primary-text) !important;
}

:deep(.TUIChat-footer){
  border-top: 1px solid var(--divider) !important;
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

.font-16{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}
</style>