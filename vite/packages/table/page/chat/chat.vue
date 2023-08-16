<!-- 聊天页面 -->
<template>
  <div class="home-TUIKit-main">
    <div :class="env?.isH5 ? 'conversation-h5' : 'conversation'" v-show="!env?.isH5 || currentModel === 'conversation'">
      <TUIConversation :displayOnlineStatus="true" @current="handleCurrentConversation"/>
      <TUISearch class="search"/>
    </div>

    <div class="chat" v-show="!env?.isH5 || currentModel === 'message'">
      <TUIChat :isMsgNeedReadReceipt="true" :isNeedEmojiReact="true">
        <h1 style="font-size: 42px;margin: auto;text-align: center;margin-top: 20px">欢迎使用想天工作台</h1>
      </TUIChat>
    </div>

    <Drag :show="showCall" class="callkit-drag-container" domClassName="callkit-drag-container">
      <!-- TUICallKit 组件：通话 UI 组件主体 -->
      <TUICallKit :allowedMinimized="true" :allowedFullScreen="false" :beforeCalling="beforeCalling"
                  :afterCalling="afterCalling" :onMinimized="onMinimized" :onMessageSentByMe="onMessageSentByMe"
      />
    </Drag>

    <Drag :show="showCallMini" class="callkit-drag-container-mini" domClassName="callkit-drag-container-mini">
      <!-- TUICallKitMini 组件：通话 UI 悬浮窗组件，提供最小化功能 -->
      <TUICallKitMini style="position: static"/>
    </Drag>
  </div>
</template>


<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted} from 'vue';
import {TUIEnv} from '../../TUIKit/TUIPlugin';
import Drag from '../../TUIKit/TUIComponents/components/drag';
import {handleErrorPrompts} from '../../TUIKit/TUIComponents/container/utils';
import TUIContact from "../../TUIKit/TUIComponents/container/TUIContact/index.vue";
import SecondPanel from "../../components/SecondPanel.vue";
import {onBeforeRouteUpdate, useRoute} from 'vue-router'
import {message} from "ant-design-vue";


export default defineComponent({
  name: 'App',
  components: {
    SecondPanel,
    TUIContact,
    Drag,
  },

  setup() {
    const data = reactive({
      env: TUIEnv(),
      currentModel: 'conversation',
      showCall: false,
      showCallMini: false,
    });
    const route = useRoute()

    const TUIServer = (window as any)?.TUIKitTUICore?.TUIServer;

    const TIM = TUIServer.TUICallKit.TUICore.TIM
    const tim = TUIServer.TUICallKit.tim

    const handleCurrentConversation = (value: string) => {
      data.currentModel = value ? 'message' : 'conversation';
    };
    // beforeCalling：在拨打电话前与收到通话邀请前执行
    const beforeCalling = (type: string, error: any) => {
      if (error) {
        handleErrorPrompts(error, type);
        return;
      }
      data.showCall = true;
    };
    // afterCalling：结束通话后执行
    const afterCalling = () => {
      data.showCall = false;
      data.showCallMini = false;
    };
    // onMinimized：组件切换最小化状态时执行
    const onMinimized = (oldMinimizedStatus: boolean, newMinimizedStatus: boolean) => {
      data.showCall = !newMinimizedStatus;
      data.showCallMini = newMinimizedStatus;
    };
    // onMessageSentByMe：在整个通话过程内发送消息时执行
    const onMessageSentByMe = async (message: any) => {
      TUIServer?.TUIChat?.handleMessageSentByMeToView(message);
      return;
    };


    const listenGroupMessage = () => {  // 监听群组消息
      // tim.on(TIM.EVENT.MESSAGE_RECEIVED, (event: { data: any[]; }) => {
      //   event.data.forEach((message) => {
      //     console.log(message)
      //     const option = {
      //       title:'群组消息',
      //       body:`${message.payload.text}`,
      //       icon:`${message.avatar}`,
      //       level:'low',
      //       time: Date.now()
      //     }
      //     window.$notice.sendNotice(option)
      //   })
      // })
    }

    const handlerParams=()=>{
      if(route.params.action==='sendMessage'){
        const {uid} =route.params
        const type= 'C2C'
        const name = `${type}${uid}`;
        window.TUIKitTUICore.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse: any) => {
          // 通知 TUIConversation 添加当前会话
          // Notify TUIConversation to toggle the current conversation
          window.TUIKitTUICore.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
        });
      }
    }

    onMounted(() => {
      listenGroupMessage()
      console.log(route)
      handlerParams()
    })


    onBeforeRouteUpdate((to,from)=>{
      handlerParams()
    })


    return {
      ...toRefs(data),
      handleCurrentConversation,
      beforeCalling,
      afterCalling,
      onMinimized,
      onMessageSentByMe,
      listenGroupMessage,
    };
  },
});
</script>


<style scoped>
.home-TUIKit-main {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.conversation {
  min-width: 285px;
  flex: 0 0 24%;
  border-right: 1px solid var(--divider);
}

.conversation-h5 {
  flex: 1;
  border-right: 1px solid var(--divider);
}

.chat {
  flex: 1;
  height: 100%;
  position: relative;
}

.callkit-drag-container {
  left: calc(50% - 25rem);
  top: calc(50% - 18rem);
  width: 50rem;
  height: 36rem;
  border-radius: 16px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
}

.callkit-drag-container-mini {
  width: 168px;
  height: 56px;
  right: 10px;
  top: 70px;
}

:deep(.conversation) {
  border-right-color: var(--divider) !important;
}
</style>
