<template>
  <div class="TUI-conversation">
    <div class="network" v-if="isNetwork">
      <i class="icon icon-error">!</i>
      <p>️{{ $t('TUIConversation.网络异常，请您检查网络设置') }}</p>
    </div>
    <main class="TUI-conversation-list">
      <TUIConversationList
        :currentID="currentConversationID"
        :data="conversationData"
        @handleItem="handleCurrentConversation"
        :isH5="env.isH5"
        :displayOnlineStatus="displayOnlineStatus"
        :userStatusList="userStatusList"
      />
    </main>
  </div>
</template>
<script>
import { storeToRefs } from 'pinia';
import { defineComponent, reactive, toRefs, computed, watch,defineExpose,onMounted,nextTick } from 'vue';
import TUIConversationList from './components/list';
import { caculateTimeago, isArrayEqual } from '../utils';
import { handleAvatar, handleName, handleShowLastMessage, handleAt } from '../TUIChat/utils/utils';
import {message} from "ant-design-vue";
import { useRouter } from 'vue-router'
import { chatStore } from '../../../../store/chat'

const TUIConversation = defineComponent({
  name: 'TUIConversation',

  components: {
    TUIConversationList,
  },
  props: {
    displayOnlineStatus: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const TUIServer = TUIConversation?.TUIServer;
    const router = useRouter()

    const chat = chatStore()
    const { conversations } = storeToRefs(chat);

    const data = reactive({
      currentConversationID: '',
      conversationData: {
        list: [],
        handleItemAvator: (item) => handleAvatar(item),
        handleItemName: (item) => handleName(item),
        handleShowAt: (item) => handleAt(item),
        handleShowMessage: (item) => handleShowLastMessage(item),
        handleItemTime: (time) => {
          if (time > 0) {
            return caculateTimeago(time * 1000);
          }
          return '';
        },
      },
      userIDList: [],
      netWork: '',
      env: TUIServer?.TUICore?.TUIEnv,
      displayOnlineStatus: false,
      userStatusList: new Map(),
    });

    TUIServer.bind(data);

    TUIConversationList.TUIServer = TUIServer;

    watch(()=>data.conversationData.list,
      (newVal)=>{
        //加上会话对置顶的排序，放置置顶的低于新会话
        data.conversationData.list=data.conversationData.list.sort((a,b)=>{
          let aIndex=a.isPinned?1:0
          let bIndex=b.isPinned?1:0
          return bIndex-aIndex
        })
      });

    watch(
      () => data.currentConversationID,
      (newVal) => {
        ctx.emit('current', newVal);
      },
      {
        deep: true,
      }
    );

    watch(
      () => props.displayOnlineStatus,
      async (newVal, oldVal) => {
        if (newVal === oldVal) return;
        data.displayOnlineStatus = newVal;
        TUIServer.TUICore.TUIServer.TUIContact.handleUserStatus(data.displayOnlineStatus, [...data.userIDList]);
      },
      { immediate: true }
    );

    watch(
      () => [...data.userIDList],
      async (newVal, oldVal) => {
        if (isArrayEqual(newVal, oldVal)) return;
        TUIServer.TUICore.TUIServer.TUIContact.handleUserStatus(data.displayOnlineStatus, [...data.userIDList]);
      },
      {
        deep: true,
      }
    );

    const updateList=()=>{
      TUIServer.TUICore.TUIServer.TUIConversationList.handleConversationListUpdate(data)
    }

    defineExpose({
      updateList
    })

    const isNetwork = computed(() => {
      const disconnected = data.netWork === TUIServer.TUICore.TIM.TYPES.NET_STATE_DISCONNECTED;
      const connecting = data.netWork === TUIServer.TUICore.TIM.TYPES.NET_STATE_CONNECTING;
      return disconnected || connecting;
    });

    const handleCurrentConversation = (value) => {
      TUIServer.handleCurrentConversation(value);
    };

    // 显示右侧聊天详情方法
    const handelConversation = (conversationID) =>{
      window.$TUIKit.TUIServer.TUIConversation.getConversationProfile(conversationID).then((imResponse) => {
        // 通知 TUIConversation 添加当前会话   Notify TUIConversation to toggle the current conversation
        window.$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
      })
    }
   
    // 监听会话列表是否为空
    watch(()=>window.$TUIKit.TUIServer.TUIConversation.store.allConversationList,(newVal)=>{
      if(newVal){
        if(newVal.length === 0){
          message.warn('当前聊天页没有会话列表,会默认自动进入发现页进行聊天会话的创建或者点击左侧栏底部添加按钮创建');
          router.push({name:'chatFind'})
        }
        else {
         const conversationID = conversations.value.conversationID;
         if(conversationID !== ''){
          handelConversation(conversationID);
         }
         else {
          conversations.value.conversationID = newVal[0].conversationID;
         }
        }
      }
    },{deep:true,immediate:true});

    return {
      ...toRefs(data),
      handleCurrentConversation,
      updateList,handelConversation,
      isNetwork,
    };
  },
});
export default TUIConversation;
</script>

<style scoped lang="scss" src="./style/index.scss"></style>
