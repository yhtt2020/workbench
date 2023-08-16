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
import { defineComponent, reactive, toRefs, computed, watch,defineExpose } from 'vue';
import TUIConversationList from './components/list';
import { caculateTimeago, isArrayEqual } from '../utils';
import { handleAvatar, handleName, handleShowLastMessage, handleAt } from '../TUIChat/utils/utils';

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
        console.log(data.conversationData.list,'当前会话列表')
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
