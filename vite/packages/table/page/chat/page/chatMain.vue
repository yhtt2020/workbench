<!-- 聊天页面 -->
<template>
  <div :class="['TUIKit', isH5 && 'TUIKit-h5']">
    <div v-if="!(isH5 && currentConversationID)" class="TUIKit-navbar">
      <div
        v-for="item of navbarList"
        :key="item.id"
        :class="[
          'TUIKit-navbar-item',
          currentNavbar === item.id && 'TUIKit-navbar-item-active',
        ]"
        @click="currentNavbar = item.id"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="TUIKit-main-container">
      <div v-if="currentNavbar === 'conversation'" class="TUIKit-main">
        <div v-if="!(isH5 && currentConversationID)" class="TUIKit-main-aside">
          <TUISearch searchType="global"></TUISearch>
          <TUIConversation
            @handleSwitchConversation="handleSwitch"
          ></TUIConversation>
        </div>
        <div v-if="!isH5 || currentConversationID" class="TUIKit-main-main">
          <TUIChat>
            <h1>欢迎使用腾讯云即时通信IM</h1>
          </TUIChat>
          <TUIGroup :class="isH5 ? 'chat-popup' : 'chat-aside'" />
          <TUISearch
            :class="isH5 ? 'chat-popup' : 'chat-aside'"
            searchType="conversation"
          />
        </div>
        <TUIGroup v-if="isH5 && !currentConversationID" class="chat-popup" />
        <TUIContact displayType="selectFriend" />
      </div>
      <div v-else-if="currentNavbar === 'contact'" class="TUIKit-main">
        <TUIContact
          displayType="contactList"
          @switchConversation="currentNavbar = 'conversation'"
        />
      </div>
      <!-- <TUICallKit class="callkit-container" :allowedMinimized="true" :allowedFullScreen="false" /> -->
    </div>
  </div>
</template>
<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
import {
  TUIStore,
  StoreName,
  TUIConversationService,
} from "@tencentcloud/chat-uikit-engine";
import { isH5 } from "../../../apps/TUIKit/utils/env";
//导入pinia缓存将当前会话进行存储
import { storeToRefs } from "pinia";
import { chatStore } from "../../../store/chat";

const chat = chatStore();
const { conversations } = storeToRefs(chat);

const currentConversationID = ref("");
const currentNavbar = ref("conversation");
const navbarList = [
  {
    id: "conversation",
    label: "会话",
  },
  {
    id: "contact",
    label: "通讯录",
  },
];
const currentConversationList = ref([]);

// 触发当前的群聊会话
const handleSwitch = (data) => {
  //  console.log('查看data',data);
  conversations.value.conversationID = data;
};

TUIStore.watch(StoreName.CONV, {
  currentConversationID: (id) => {
    currentConversationID.value = id;
  },
  currentConversationList: (list) => {
    currentConversationList.value = list;
  },
});

// 监听缓存中的会话ID
watch(
  () => conversations.value.conversationID,
  (value) => {
    if (value) {
      TUIConversationService.switchConversation(value);
    } else {
      // 当前list是获取所有群聊会话列表
      const list = TUIStore?.storeMap?.conversation?.store?.conversationList;
      // 如果缓存中的会话是空的,就从会话列表中获取第一个会话;
      const currentID =  list[0]?.conversationID
      TUIConversationService.switchConversation(currentID);
    }
  },
  { immediate: true }
);
</script>
<style scoped lang="scss">
@import "../../../apps/TUIKit/assets/styles/common.scss";
@import "../../../apps//TUIKit/assets/styles/sample.scss";
</style>













<!-- <template>
 <div class="home-TUIKit-main w-full">
   <div :class="env?.isH5 ? 'conversation-h5' : 'conversation'" v-show="!env?.isH5 || currentModel === 'conversation'">
    <TUIConversation  @current="handleCurrentConversation"/>
    <TUISearch class="search"/>
   </div>

   <div class="chat" v-show="!env?.isH5 || currentModel === 'message'">
    <TUIChat></TUIChat>
     <TUIChat :isNeedEmojiReact="true">
       <h1 style="font-size: 42px;margin: auto;text-align: center;margin-top: 20px">欢迎使用天天工作台</h1>
     </TUIChat>
   </div>

   <Drag :show="showCall" class="callkit-drag-container" domClassName="callkit-drag-container">
     TUICallKit 组件：通话 UI 组件主体
     <TUICallKit :allowedMinimized="true" :allowedFullScreen="false" :beforeCalling="beforeCalling"
                 :afterCalling="afterCalling" :onMinimized="onMinimized" :onMessageSentByMe="onMessageSentByMe"
     />
   </Drag>

   <Drag :show="showCallMini" class="callkit-drag-container-mini" domClassName="callkit-drag-container-mini">
     TUICallKitMini 组件：通话 UI 悬浮窗组件，提供最小化功能
     <TUICallKitMini style="position: static"/>
   </Drag>
 </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted,ref,nextTick} from 'vue';
import {TUIEnv} from '../../../TUIKit/TUIPlugin';
import Drag from '../../../TUIKit/TUIComponents/components/drag';
import {handleErrorPrompts} from '../../../TUIKit/TUIComponents/container/utils';
import TUIContact from "../../../TUIKit/TUIComponents/container/TUIContact/index.vue";
import SecondPanel from "../../../components/SecondPanel.vue";
import {onBeforeRouteUpdate, useRoute,useRouter} from 'vue-router'
import {message} from "ant-design-vue";
import { chatStore } from '../../../store/chat'

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
   const router = useRouter()
   const store = chatStore()
   const TUIServer = (window as any)?.TUIKitTUICore?.TUIServer;
   //const TIM = TUIServer.TUICallKit.TUICore.TIM
   //const tim = TUIServer.TUICallKit.tim

   const handleCurrentConversation = (value: string) => {
    //  console.log('检测::>>',value)
     store.conversations.conversationID = value
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

   const handlerParams=(to=route)=>{
     if(to.params.action==='sendMessage'){
       const {uid} =to.params
       const type= 'C2C'
       const name = `${type}${uid}`;
       (window as any).TUIKitTUICore.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse: any) => {
         // 通知 TUIConversation 添加当前会话
         // Notify TUIConversation to toggle the current conversation
         (window as any).TUIKitTUICore.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);

       });
     }
   }

   onMounted(() => {
     handlerParams()
   })


   onBeforeRouteUpdate((to,from)=>{
     handlerParams(to)
   })


   return {
     router,route,
     ...toRefs(data),
     handleCurrentConversation,
     beforeCalling,
     afterCalling,
     onMinimized,
     onMessageSentByMe,
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
</style> -->
