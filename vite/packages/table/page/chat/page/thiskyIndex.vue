<template>
  <a-row class="w-full h-full">
    <a-col flex=" 0 1 300px" class="find-left h-full flex flex-col px-3" :style="doubleCol ? { maxWidth:'336px' } :{ maxWidth:'240px'}"  style=" border-right:1px solid var(--divider)">
      <div class="flex flex-col">
        <div class="flex justify-between w-full mb-2.5">
          <span class="font-500" style="color:var(--primary-text);">{{ groupName }}</span>
          <ChatDropDown @updatePage="updatePage"/>
        </div>
        <div class="font-14" style="color:var(--secondary-text);">
          {{ summary }}
        </div>
      </div>
  
      <a-divider style="height: 1px;margin: 12px 0; background-color: var(--divider)" />
  
      
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
        <div v-for="item in list[0].channelList">
          <ChatFold :title="item.name">
            <div class="flex flex-col" v-if="doubleCol === false">
              <div v-for="item in item.children" class="flex items-center py-3 px-4 rounded-lg pointer group-item"
              @click="currentItem(item)"
              >
                <template v-if="item.type === 'group'">
                  <MessageOutlined style="color:var(--warning);font-size: 1.25em;"/>
                </template> 
                <template v-if="item.type === 'link'">
                  <LinkOutlined style="color:var(--active-bg);font-size: 1.25em;"/>
                </template>
                <template v-if="item.type === 'forum'">
                  <AppstoreOutlined style="color:var(--success);font-size: 1.25em;"/>
                 </template>
                <span class="ml-3 font-16" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
              </div>
            </div>
  
            <div class="flex grid grid-cols-2 gap-1" v-else>
              <div v-for="item in item.children"  @click="currentItem(item)" class="flex items-center py-2  rounded-lg pointer group-item">
                <div class="mx-2 flex items-center">
                  <template v-if="item.type === 'group'">
                    <MessageOutlined style="color:var(--warning);font-size: 1.25em;"/>
                  </template> 
                  <template v-if="item.type === 'link'">
                    <LinkOutlined style="color:var(--active-bg);font-size: 1.25em;"/>
                  </template>
                  <template v-if="item.type === 'forum'">
                    <AppstoreOutlined style="color:var(--success);font-size: 1.25em;"/>
                   </template>
                </div>
                <span class="ml-1 font-16" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
              </div>
            </div>
          </ChatFold>
        </div>
      </vue-custom-scrollbar>
    </a-col>
    <a-col flex=" 1 1 200px" class="h-full">
      <template v-if="mainType === ''">
        <div class="flex items-center h-full justify-center">
          <a-empty :image="simpleImage" description="暂无内容"></a-empty>
        </div>
      </template>
      <Community  v-else-if="mainType === 'forum'" />
      <TUIChat v-else></TUIChat>
    </a-col>
  </a-row>

 <!-- <div class="flex w-full h-full">
  <div class="find-left flex flex-col px-3" :style="doubleCol ? { maxWidth:'336px' } :{ maxWidth:'240px'}"  style=" border-right:1px solid var(--divider)">
    <div class="flex flex-col">
      <div class="flex justify-between w-full mb-2.5">
        <span class="font-500" style="color:var(--primary-text);">{{ groupName }}</span>
        <ChatDropDown @updatePage="updatePage"/>
      </div>
      <div class="font-14" style="color:var(--secondary-text);">
        {{ summary }}
      </div>
    </div>

    <a-divider style="height: 1px;margin: 12px 0; background-color: var(--divider)" />

    
    <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
      <div v-for="item in list[0].channelList">
        <ChatFold :title="item.name">
          <div class="flex flex-col" v-if="doubleCol === false">
            <div v-for="item in item.children" class="flex items-center py-3 px-4 rounded-lg pointer group-item"
            @click="currentItem(item)"
            >
              <template v-if="item.type === 'group'">
                <MessageOutlined style="color:var(--warning);font-size: 1.25em;"/>
              </template> 
              <template v-if="item.type === 'link'">
                <LinkOutlined style="color:var(--active-bg);font-size: 1.25em;"/>
              </template>
              <template v-if="item.type === 'forum'">
                <AppstoreOutlined style="color:var(--success);font-size: 1.25em;"/>
               </template>
              <span class="ml-3 font-16" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
            </div>
          </div>

          <div class="flex grid grid-cols-2 gap-1" v-else>
            <div v-for="item in item.children"  @click="currentItem(item)" class="flex items-center py-2  rounded-lg pointer group-item">
              <div class="mx-2 flex items-center">
                <template v-if="item.type === 'group'">
                  <MessageOutlined style="color:var(--warning);font-size: 1.25em;"/>
                </template> 
                <template v-if="item.type === 'link'">
                  <LinkOutlined style="color:var(--active-bg);font-size: 1.25em;"/>
                </template>
                <template v-if="item.type === 'forum'">
                  <AppstoreOutlined style="color:var(--success);font-size: 1.25em;"/>
                 </template>
              </div>
              <span class="ml-1 font-16" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
            </div>
          </div>
        </ChatFold>
      </div>
    </vue-custom-scrollbar>
  </div>

  <div class="find-right">
    <Community  v-if="mainType === 'forum'" />
    <TUIChat v-else></TUIChat>
  </div>
 </div> -->
</template>

<script>
import { defineComponent, reactive, toRefs,ref } from 'vue'
import { chatList } from '../../../js/data/chatList'
import ChatDropDown from '../components/chatDropDown.vue'
import ChatFold from '../components/chatFold.vue'
import { AppstoreOutlined, MessageOutlined,LinkOutlined} from '@ant-design/icons-vue'
import Community from '../Community.vue'
import { chatStore } from '../../../store/chat'
import  browser  from '../../../js/common/browser' 

export default defineComponent({
  components:{
    ChatDropDown,
    ChatFold,Community,
    AppstoreOutlined,MessageOutlined,LinkOutlined
  },

  setup () {

    const chat = chatStore()

    const doubleCol = ref(chat.$state.settings.showDouble)

    const data = reactive({
      list:chatList,
      groupName:chatList[0].name,
      enable:chatList[0].props.enableColumns,
      summary:chatList[0].summary,

      settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
      mainType:'',
      simpleImage: '/public/img/test/load-ail.png',
    })
  
    const updatePage = () =>{
     doubleCol.value = chat.$state.settings.showDouble
    }

    const currentItem = (item) =>{
      // console.log('排查问题',item);
      if(item.type === 'link'){
        // console.log('排查',item.props.url);
        const url = item.props.url !== '' ? item.props.url : ''
        browser.openInUserSelect(url)  // 想天浏览器打开
        // browser.openInSystem(url)
      }

      if(item.type === 'group'){
        const name = `GROUP${item.props.id}`
        data.mainType = 'group'
        console.log('排查::>>',name);
        window.TUIKitTUICore.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse) => {
          console.log('排查111::>>',imResponse);
         // 通知 TUIConversation 添加当前会话
         // Notify TUIConversation to toggle the current conversation
         window.TUIKitTUICore.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
        });
      }

      if(item.type === 'forum'){
        data.mainType = 'forum'
      }

    }



    return {
      doubleCol,
      ...toRefs(data),updatePage,
      currentItem,
    }
  }
})
</script>

<style lang="scss" scoped>
.font-500{
 font-family: PingFangSC-Medium;
 font-size: 16px;
 font-weight: 500;
}

.font-14{
 font-family: PingFangSC-Regular;
 font-size: 14px;
 font-weight: 400;
}

.font-16{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
}

.group-item{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    background: var(--active-secondary-bg);
  }
}

:deep(.ant-row){
  display: flex !important;
  flex:row nowrap !important;
}
</style>