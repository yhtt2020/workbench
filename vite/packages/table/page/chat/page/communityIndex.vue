<template>
  <a-row class="w-full h-full">
    <a-col flex=" 0 1 300px" class="flex flex-col h-full px-3 find-left" v-if="isFloat === false"
           :style="doubleCol ? { maxWidth:'336px' } :{ maxWidth:'240px'}"
           style=" border-right:1px solid var(--divider);">
      <div class="flex flex-col">
        <div class="flex justify-between w-full mb-2.5">
          <span class=" font-bold text-lg truncate" style="color:var(--primary-text);">{{ groupName }}</span>
          <ChatDropDown @updatePage="updatePage"  :list="hideDropList"/>
        </div>
        <div class="font-14" style="color:var(--secondary-text);">
          {{ summary }}
        </div>
        <div>
          <a-row :gutter="10">
            <a-col flex="55px" class="mt-1 text-right">
              <span class="px-2 rounded-full xt-active-bg">0 级</span>
            </a-col>
            <a-col  flex="auto" style="padding-top: 3px">
              <a-progress :show-info="false" strokeColor="var(--active-bg)" :percent="10"></a-progress>
            </a-col>

          </a-row>

        </div>
      </div>

      <a-divider style="height: 1px;margin: 12px 0; background-color: var(--divider)"/>


      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
        <div v-for="item in list[0].channelList">
          <ChatFold :title="item.name">
            <div class="flex flex-col" v-if="doubleCol === false">
              <div v-for="item in item.children" class="flex items-center px-4 py-3 rounded-lg pointer group-item"
                   @click="currentItem(item)"
              >
                <template v-if="item.type === 'group'">
                  <MessageOutlined style="color:var(--warning);font-size: 1.25em;"/>
                </template>
                <template v-if="item.type === 'link'">
                  <Emoji icon="link" :size="20"></Emoji>
                  <!-- <LinkOutlined style="color:var(--active-bg);font-size: 1.25em;"/> -->
                </template>
                <template v-if="item.type === 'forum'">
                  <AppstoreOutlined style="color:var(--success);font-size: 1.25em;"/>
                </template>
                <span class="ml-3 font-16" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
                <SelectOutlined class="ml-1 xt-text-2 flip" style="font-size: 14px"
                                v-if="item.props.openMethod==='userSelect'"/>
              </div>
            </div>

            <div class="flex grid grid-cols-2 gap-1" v-else>
              <div v-for="item in item.children" @click="currentItem(item)"
                   class="flex items-center py-2 rounded-lg pointer group-item">
                <div class="flex items-center mx-2">
                  <template v-if="item.type === 'group'">
                    <MessageOutlined style="color:var(--warning);font-size: 1.25em;"/>
                  </template>
                  <template v-if="item.type === 'link'">
                    <Emoji icon="link" :size="20"></Emoji>
                    <!-- <LinkOutlined style="color:var(--active-bg);font-size: 1.25em;"/> -->
                  </template>
                  <template v-if="item.type === 'forum'">
                    <AppstoreOutlined style="color:var(--success);font-size: 1.25em;"/>
                  </template>
                </div>
                <span class="ml-1 font-16" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
                <SelectOutlined class="ml-1 xt-text-2 flip " style="font-size: 14px"
                                v-if="item.props.openMethod==='userSelect'"/>
              </div>
            </div>
          </ChatFold>
        </div>
      </vue-custom-scrollbar>
    </a-col>

    <a-col flex=" 1 1 200px" class="flex flex-col h-full">
      <div class="px-4 mb-0 line-title">
        <span style="vertical-align: text-top">
        <template v-if="currentChannel.type === 'group'">
          <MessageOutlined style="color:var(--warning);font-size: 1.25em;"/>
        </template>
        <template v-if="currentChannel.type === 'link'">
          <!-- <LinkOutlined style="color:var(--active-bg);font-size: 1.25em;"/> -->
          <Emoji icon="link" :size="20"></Emoji>
        </template>
        <template v-if="currentChannel.type === 'forum'">
          <AppstoreOutlined style="color:var(--success);font-size: 1.25em;"/>
        </template>
       </span>
        {{ currentChannel.name }}
      </div>

      <div v-if="isChat === 'not'" class="flex items-center justify-center h-full">
        <ValidateModal :data="group"></ValidateModal>
      </div>

      <div style="height: 0;flex:1" v-else>
        <template v-if="!currentChannel.name">
          <div class="flex items-center justify-center h-full">
            <a-empty :image="simpleImage" description="暂无内容"></a-empty>
          </div>
        </template>
        <Commun v-else-if="currentChannel.type === 'forum'" :forum-id="currentChannel.props.id" />
        <TUIChat v-else-if="currentChannel.type==='group'"></TUIChat>
        <template v-else-if="currentChannel.type==='link'">
          <div v-if="currentChannel.props.openMethod==='userSelect'" style="text-align: center;margin-top: 30%">
            <Emoji icon="link" :size="20"></Emoji>
            当前频道需要浏览器打开。
          </div>
          <iframe v-else :src="currentChannel.props.url" class="m-2"
                  style="border: none;background: none;border-radius: 4px;width: calc(100% - 10px);height: calc(100% - 10px)"></iframe>

        </template>

      </div>


    </a-col>

  </a-row>

</template>

<script>
import { defineComponent, reactive, toRefs, ref, computed } from 'vue'
import { chatList,hideDropList } from '../../../js/data/chatList'
import ChatDropDown from '../components/chatDropDown.vue'
import ChatFold from '../components/chatFold.vue'
import { AppstoreOutlined, MessageOutlined, LinkOutlined,SelectOutlined } from '@ant-design/icons-vue'
import Commun from '../Commun.vue'
import { chatStore } from '../../../store/chat'
import browser from '../../../js/common/browser'
import Emoji from '../../../components/comp/Emoji.vue'
import { checkGroupShip } from '../../../js/common/sns'
import Modal from '../../../components/Modal.vue'
import ValidateModal from '../components/validationPrompts.vue'
import { message } from 'ant-design-vue'


export default defineComponent({
  components: {
    Emoji,
    ChatDropDown,
    ChatFold, Commun, Modal, ValidateModal,
    AppstoreOutlined, MessageOutlined, LinkOutlined,SelectOutlined
  },

  setup () {

    const chat = chatStore()
    // const community = chatAdminStore()

    const doubleCol = ref(chat.$state.settings.showDouble)

    const data = reactive({
      list: chatList,
      groupName: chatList[0].name,
      enable: chatList[0].props.enableColumns,
      summary: chatList[0].summary,

      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      mainType: '',
      currentChannel: {},
      simpleImage: '/public/img/test/load-ail.png',
      showModal: false, // 没有加入社群提示弹窗控制
      group: {}, // 接收传递的社群id
      isChat: 'yes',
    })

    const updatePage = () => {
      doubleCol.value = chat.$state.settings.showDouble
    }

    const currentItem = async (item) => {
      if (item.type === 'link') {
        if (item.props.openMethod === 'userSelect') {
          browser.openInUserSelect(item.props.url)
        }
      }

      if (item.type === 'group') {
        const res = await window.$chat.searchGroupByID(item.props.id)
        const enableGroup = await checkGroupShip([`${item.props.id}`])
        data.isChat = enableGroup[0]
        const isDisable = res.data.group.joinOption !== 'DisableApply'
        // 判断有没有加入社群, yes表示已经加入, not表示没有加入
        if (enableGroup[0] === 'yes') {
          const name = `GROUP${item.props.id}`
          window.TUIKitTUICore.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse) => {
            // 通知 TUIConversation 添加当前会话
            // Notify TUIConversation to toggle the current conversation
            window.TUIKitTUICore.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation)
          })
        } else {
          // isDisable判断群聊是否禁止加入
          if (isDisable) {
            data.group = res.data.group
            // data.showModal = true
          } else {
            message.warn('该群禁止加入')
          }
        }
      }

      data.currentChannel = item
    }

    // 通过计算属性获取是否收起侧边栏
    const isFloat = computed(() => {
      return chat.$state.settings.enableHide
    })

    return {
      doubleCol, isFloat,hideDropList,
      ...toRefs(data), updatePage,
      currentItem, checkGroupShip,
    }
  }
})
</script>

<style lang="scss" scoped>
.font-500 {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
}

.font-14 {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}

.font-16 {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}

.group-item {
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }

  &:hover {
    background: var(--active-secondary-bg);
  }
}

:deep(.ant-row) {
  display: flex !important;
  flex: row nowrap !important;
}

.flip {
  transform: rotateY(180deg)
}
</style>
