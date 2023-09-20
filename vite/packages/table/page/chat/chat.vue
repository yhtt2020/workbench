<template>
  <xt-left-menu :list="chatLeftList" :index="index" last="3" end="2">
    <div class="w-full">
      <MyCommunity v-if="currentCom" :info="info"/>
      <router-view v-else></router-view>
    </div>

    <template #communityFloat>
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

        <a-divider style="height: 1px;margin: 12px 0; background-color: var(--divider)"/>

        <div style="height:510px;">
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
            <div v-for="items in community.channelList">
              <ChatFold :title="items.name">
                <div class="flex flex-col">
                  <div v-for="item in items.children" class="flex items-center py-3 px-4 rounded-lg pointer group-item"

                  >
                    <template v-if="item.type === 'group'">
                      <chatIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
                    </template>
                    <template v-if="item.type === 'link'">
                      <chatIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
                    </template>
                    <template v-if="item.type === 'forum'">
                      <chatIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
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
    <Modal v-if="open" v-model:visible="open" :blurFlag="true">
      <AddFriend v-if="addIndex === 'launch'" @close="open = false"></AddFriend>
      <CreateGroup v-if="addIndex === 'addGroup'" @close="open = false" :isH5="env.isH5"/>
      <Transfer v-if="addIndex === 'addFriend'" @close="open = false" :isH5="env.isH5"></Transfer>
      <CreateCommunity v-if="addIndex === 'createCom'" @close="open = false"></CreateCommunity>
      <JoinCommunity v-if="addIndex === 'joinCom'" @close="open = false"></JoinCommunity>
    </Modal>
  </teleport>

</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { TUIEnv } from '../../TUIKit/TUIPlugin'
import Drag from '../../TUIKit/TUIComponents/components/drag'
import TUIContact from '../../TUIKit/TUIComponents/container/TUIContact/index.vue'
import SecondPanel from '../../components/SecondPanel.vue'
import { message } from 'ant-design-vue'
// import Commun from './Commun.vue'
import ChatFind from './page/chatFind.vue'
import ChatMain from './page/chatMain.vue'
import CommunityIndex from './page/communityIndex.vue'
import Modal from '../../components/Modal.vue'
import AddFriend from '../../TUIKit/TUIComponents/components/transfer/addFriend.vue'
import CreateGroup from '../../TUIKit/TUIComponents/container/TUISearch/components/createGroup/index.vue'
import Transfer from '../../TUIKit/TUIComponents/components/transfer/index.vue'
import CreateCommunity from './components/createCommunity.vue'
import _ from 'lodash-es'
import config from './config'
import { appStore } from '../../store'
import { storeToRefs } from 'pinia'
import { chatList, showDropList } from '../../js/data/chatList'
import ChatDropDown from './components/chatDropDown.vue'
import ChatFold from './components/chatFold.vue'
import JoinCommunity from './components/joinCommunity.vue'
import { AppstoreOutlined, MessageOutlined, LinkOutlined } from '@ant-design/icons-vue'
import { myCommunityStore } from './store/myCommunity'
import { localCache } from '../../js/axios/serverCache'
import MyCommunity from './page/myCommunity.vue'
import { Icon as chatIcon } from '@iconify/vue'
import { chatStore } from '../../store/chat'

export default {
  name: 'App',
  components: {
    AppstoreOutlined, MessageOutlined, LinkOutlined,
    SecondPanel,
    TUIContact, chatIcon,
    Drag,
    ChatFind,
    CommunityIndex,
    ChatMain, Modal,
    AddFriend, CreateGroup,
    Transfer,
    ChatDropDown, ChatFold,
    CreateCommunity, JoinCommunity, MyCommunity,
  },

  setup () {
    const myCom = myCommunityStore()
    const router = useRouter()
    const route = useRoute()
    const TUIServer = window.$TUIKit
    const Server = window.$chat
    const chat  = chatStore()

    const data = reactive({
      index: 'chat',
      // type:'chat',
      addIndex: '',
      open: false,
      env: TUIServer.TUIEnv,
      needSearch: !TUIServer.isOfficial,
      TUIServer: Server,
      createConversationType: '',
      community: chatList[0],
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      info: {},
    })

    const selectTab = (item) => {
      data.index = item.type
      router.push(item.route)
    }

    const selectDorpTab = (item) => {
      data.addIndex = item.index
      data.open = true

    }

    const openAddCom = () => {
      data.addIndex = 'createCom'
      data.open = true
    }

    const selectCommunityTab = (item) => {
      // console.log('排查问题::>>',item)
      localCache.set('communityId', item.type)
      data.index = item.type
      data.info = item.info
    }

    const appS = appStore()

    const { userInfo } = appS
    const { myCommunityList } = myCom

    const menuCommunityList = []
    // 遍历将社群进行UI层数据替换
    for (let i = 0; i < myCommunityList.length; i++) {
      if (myCommunityList[i].communityInfo) {
        const item = {
          name: myCommunityList[i].communityInfo.name,
          img: myCommunityList[i].communityInfo.icon,
          type: `community${myCommunityList[i].cno}`,
          // float: 'communityFloat',
          noBg: true,
          callBack: selectCommunityTab,
          info: myCommunityList[i],

          // route:{ name:'defaultCommunity',info:myCommunityList[i]},
        }
        menuCommunityList.push(item)
      } else {
        console.error('该社群不存在')
      }
    }

    const addCom = (item) => {
      data.addIndex = item.index
      data.open = true
      myCom.getRecommendCommunityList()
    }

    const currentCom = computed(() => {
      return data.index === localCache.get('communityId')
    })

    // 判断是否展开悬浮模式
    const isFloat = computed(()=>{
     console.log('排查问题', chat.settings.enableHide)
     return chat.settings.enableHide
    });

    const chatLeftList = ref([
      {
        icon: 'message',
        type: 'chat',
        title: '消息',
        route: {
          name: 'chatMain'
        },
        callBack: selectTab,
      },
      {
        icon: 'team',
        type: 'contact',
        callBack: selectTab,
        route: {
          name: 'contact'
        }
      },
      ...(config.adminUids.includes(userInfo.uid) ? [
        {
          icon: 'diannao',
          type: 'admin',
          title: '管理面板(仅管理员可见)',
          callBack: selectTab,
          route: {
            name: 'chatAdmin'
          }
        }
      ] : []),

      {
        icon: 'zhinanzhen',
        type: 'find',
        callBack: selectTab,
        route: {
          name: 'chatFind'
        }
      },
      // 写社群相关静态内容时临时打开的路由
      {
        icon: '',
        img: '/icons/logo128.png',
        type: 'community',
        float: isFloat === false ? '' : 'communityFloat',
        noBg: true,
        callBack: selectTab,
        route: {
          name: 'defaultCommunity'
        }
      },

      ...menuCommunityList,

      {
        //  icon:'ic:baseline-add',
        icon: 'tianjia2',
        callBack: openAddCom,
      },
      {
        full: true,
      },
      {
        icon: 'tianjia2',
        children: [
          {
            icon: 'message',
            name: '发起群聊',
            index: 'launch',
            callBack: selectDorpTab
          },
          {
            icon: 'team',
            name: '加入群聊',
            index: 'addGroup',
            callBack: selectDorpTab
          },
          {
            icon: 'tianjiachengyuan',
            name: '添加好友',
            index: 'addFriend',
            callBack: selectDorpTab
          },
          {
            icon: 'smile',
            name: '创建社群',
            index: 'createCom',
            callBack: selectDorpTab
          },
          {
            icon: 'team',
            name: '加入社群',
            index: 'joinCom',
            callBack: addCom,
          }
        ]
      },
    ])

    onMounted(() => {
      router.push({ name: 'chatMain' })
    })

    return {
      chatLeftList, route, router, showDropList, newArr: menuCommunityList, currentCom,isFloat,
      ...toRefs(data),
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.xt-br) {
  margin-right: 0px !important;
}

.font-16-500 {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
}

.font-14 {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}


:deep(#tippy-4) {
  z-index: 1000 !important;
  top: 23px !important;
  left: 12px !important;
}

</style>
