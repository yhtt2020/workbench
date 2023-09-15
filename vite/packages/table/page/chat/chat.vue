<template>
  <xt-left-menu :list="chatLeftList" :index="index" last="3" end="2">
    <div class="w-full">
      <router-view></router-view>
    </div>

    <template #test>
      <div class="flex flex-col p-2 mt-3">
        <div class="flex flex-col">
          <div class="flex justify-between mb-2.5">
            <span class="font-16-500" style="color:var(--primary-text);"> {{ community.name }} </span>
            <ChatDropDown :list="showDropList"/>
          </div>
          <div class="font-14" style="color:var(--secondary-text);">
            {{ community.summary }}
          </div>
        </div>

        <a-divider style="height: 1px;margin: 12px 0; background-color: var(--divider)" />

        <div style="height:510px;">
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
            <div v-for="items in community.channelList">
              <ChatFold :title="items.name">
                <div class="flex flex-col">
                  <div v-for="item in items.children" class="flex items-center py-3 px-4 rounded-lg pointer group-item">
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
              </ChatFold>
            </div>
          </vue-custom-scrollbar>
        </div>

      </div>
    </template>

  </xt-left-menu>

  <teleport to='body'>
     <Modal  v-if="open" v-model:visible="open" :blurFlag="true">
      <AddFriend v-if="addIndex === 'launch'" @close="open = false"></AddFriend>
      <CreateGroup v-if="addIndex === 'addGroup'"  @close="open = false" :isH5="env.isH5" />
      <Transfer v-if="addIndex === 'addFriend'" @close="open = false" :isH5="env.isH5"></Transfer>
      <CreateCommunity v-if="addIndex === 'createCom'" @close="open = false"></CreateCommunity>
      <JoinCommunity v-if="addIndex === 'joinCom'" @close="open = false"></JoinCommunity>
     </Modal>
  </teleport>

</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { TUIEnv } from '../../TUIKit/TUIPlugin';
import Drag from '../../TUIKit/TUIComponents/components/drag';
import TUIContact from "../../TUIKit/TUIComponents/container/TUIContact/index.vue";
import SecondPanel from "../../components/SecondPanel.vue";
import { message } from "ant-design-vue";
// import Commun from './Commun.vue'
import ChatFind from "./page/chatFind.vue"
import ChatMain from './page/chatMain.vue';
import ThiskyIndex from './page/thiskyIndex.vue'
import Modal from '../../components/Modal.vue'
import AddFriend from '../../TUIKit/TUIComponents/components/transfer/addFriend.vue';
import CreateGroup from '../../TUIKit/TUIComponents/container/TUISearch/components/createGroup/index.vue'
import Transfer from '../../TUIKit/TUIComponents/components/transfer/index.vue';
import CreateCommunity from './components/createCommunity.vue'
import config from './config'
import {appStore} from "../../store";
import {storeToRefs} from "pinia";
import { chatList,showDropList } from '../../js/data/chatList'
import ChatDropDown from './components/chatDropDown.vue'
import ChatFold from './components/chatFold.vue'
import JoinCommunity  from './components/joinCommunity.vue'
import { AppstoreOutlined, MessageOutlined,LinkOutlined} from '@ant-design/icons-vue'


export default {
  name: 'App',
  components: {
    AppstoreOutlined, MessageOutlined,LinkOutlined,
    SecondPanel,
    TUIContact,
    Drag,
    ChatFind,
    ThiskyIndex,
    ChatMain,Modal,
    AddFriend,CreateGroup,
    Transfer,
    ChatDropDown,ChatFold,
    CreateCommunity,JoinCommunity,
  },

  setup() {


    const router = useRouter()
    const route = useRoute()
    const TUIServer = window.$TUIKit
    const Server = window.$chat
    const data = reactive({
      index:'chat',
      // type:'chat',
      addIndex:'',
      open:false,
      env: TUIServer.TUIEnv,
      needSearch: !TUIServer.isOfficial,
      TUIServer:Server,
      createConversationType:'',
      community:chatList[0],
      settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
    })

    const selectTab = (item) => {
      data.index = item.type
      router.push(item.route)
    }

    const selectDorpTab = (item) =>{
      data.addIndex = item.index
      data.open = true
    }

    const openAddCom = () =>{
      data.addIndex = 'createCom'
      data.open = true
    }

    const appS=appStore()
    const {userInfo}=appS

    const chatLeftList = ref([
      {
        icon: 'message',
        type: 'chat',
        title:'消息',
        route:{
          name:'chatMain'
        },
        callBack: selectTab,
      },
      {
        icon: 'team',
        type: 'contact',
        callBack: selectTab,
        route:{
          name:'contact'
        }
      },
      ...(config.adminUids.includes(userInfo.uid)?[
        {
          icon: 'diannao',
          type: 'admin',
          title:'管理面板(仅管理员可见)',
          callBack: selectTab,
          route:{
            name:'chatAdmin'
          }
        }
      ]:[]),

      {
        icon: 'zhinanzhen',
        type: 'find',
        callBack: selectTab,
        route:{
          name:'chatFind'
        }
      },
      // 写社群相关静态内容时临时打开的路由
      {
        icon:'',
        img: '/icons/logo128.png',
        type: 'thisky',
        float:"test",
        noBg:true,
        callBack: selectTab,
        route:{
          name:'chatThisky'
        }
      },
      {
       //  icon:'ic:baseline-add',
       icon:'tianjia2',
       callBack:openAddCom,
      },
      {
        full:true,
      },
      {
        icon: 'tianjia2',
        children:[
          {
            icon: 'message',
            name:'发起群聊',
            index:"launch",
            callBack:selectDorpTab
          },
          {
            icon: 'team',
            name:'加入群聊',
            index:"addGroup",
            callBack:selectDorpTab
          },
          {
            icon: 'tianjiachengyuan',
            name:'添加好友',
            index:"addFriend",
            callBack:selectDorpTab
          },
          {
            icon:'smile',
            name:'创建社群',
            index:'createCom',
            callBack:selectDorpTab
          },
          {
            icon:'team',
            name:'加入社群',
            index:"joinCom",
            callBack:selectDorpTab,
          }
        ]
      },
    ])


    onMounted(()=>{
      router.push({name:'chatMain'})
    })

    return {
      chatLeftList,route,router,showDropList,
      ...toRefs(data),
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.xt-br) {
  margin-right: 0px !important;
}

.font-16-500{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500; 
}

.font-14{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}


:deep(#tippy-4){
  z-index:1000 !important;
  top:23px !important;
  left: 12px !important;
}

</style>
