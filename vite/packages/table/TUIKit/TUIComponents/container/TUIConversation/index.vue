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
<script lang="ts">
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
  setup(props: any, ctx: any) {
    const TUIServer: any = TUIConversation?.TUIServer;
    const router = useRouter()

    const store = chatStore()

    const data = reactive({
      currentConversationID: '',
      conversationData: {
        list: [],
        handleItemAvator: (item: any) => handleAvatar(item),
        handleItemName: (item: any) => handleName(item),
        handleShowAt: (item: any) => handleAt(item),
        handleShowMessage: (item: any) => handleShowLastMessage(item),
        handleItemTime: (time: number) => {
          if (time > 0) {
            return caculateTimeago(time * 1000);
          }
          return '';
        },
      },
      userIDList: [],
      netWork: '',
      env: TUIServer.TUICore.TUIEnv,
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
      (newVal: any) => {
        ctx.emit('current', newVal);
      },
      {
        deep: true,
      }
    );

    watch(
      () => props.displayOnlineStatus,
      async (newVal: any, oldVal: any) => {
        if (newVal === oldVal) return;
        data.displayOnlineStatus = newVal;
        TUIServer.TUICore.TUIServer.TUIContact.handleUserStatus(data.displayOnlineStatus, [...data.userIDList]);
      },
      { immediate: true }
    );

    watch(
      () => [...data.userIDList],
      async (newVal: any, oldVal: any) => {
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

    const handleCurrentConversation = (value: any) => {
      TUIServer.handleCurrentConversation(value);
    };
  
    onMounted(()=>{
     // 判断会话列表第一次是否为空
     nextTick(()=>{
      const dataList = (window as any).$TUIKit.TUIServer?.TUIConversation.currentStore?.conversationData
      const dataChat = (window as any).$TUIKit.TUIServer?.TUIChat.currentStore?.conversation
      if(dataList.list.length === 0){
        message.warn('温馨提示,当前聊天页没有对话,进入发现页创建聊天会话或者点击左侧栏底部添加按钮创建')
        router.push({name:'chatFind'})
      }else{
        const conversationName = store.$state.conversations.conversationID;
        // 会话列表有数据,并且有点击的情况下,就默认选中上次点击的会话列表
        if(conversationName && conversationName !== undefined){
          data.currentConversationID = conversationName;
          (window as any).$TUIKit.TUIServer.TUIConversation.getConversationProfile(conversationName).then((imResponse:any) => {
            // 通知 TUIConversation 添加当前会话
            // Notify TUIConversation to toggle the current conversation
            (window as any).$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
          })
        }else{   // 会话列表有数据,用户没有点击的情况下,默认选中会话列表第一个
          const name = dataList.list[0].conversationID
          data.currentConversationID = name;
          (window as any).$TUIKit.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse:any) => {
            // 通知 TUIConversation 添加当前会话
            // Notify TUIConversation to toggle the current conversation
            (window as any).$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
          })
        }
        
       

        // dataChat.conversationID = store.$state.conversations.conversationID
        // console.log('获取当前会话ID',);
      }
     })

    })
    

    return {
      ...toRefs(data),
      handleCurrentConversation,
      updateList,
      isNetwork,
    };
  },
});
export default TUIConversation;
</script>

<style scoped lang="scss" src="./style/index.scss"></style>
