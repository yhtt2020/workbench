<template>
  <a-row class="w-full h-full">
    <a-col  class="flex flex-col h-full  find-left" v-if="isFloat === false"
      style=" border-right:1px solid var(--divider);"
    >
      <DefaultFloat :communityID="routeData"  :float="false" @updateColumn="updateColumn" @createCategory="clickEmptyButton" @clickItem="currentItem"></DefaultFloat>
    </a-col>
    <a-col flex=" 1 1 200px" class="flex flex-col h-full">
      <div class="flex items-center px-4 mb-0 line-title">
        <div class="flex items-center justify-center">
          <template v-if="currentChannel.type === 'group'">
            <communityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 1.25rem;" />
          </template>
          <template v-if="currentChannel.type === 'link'">
            <communityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 1.25rem;" />
          </template>
          <template v-if="currentChannel.type === 'forum'">
            <communityIcon icon="fluent-emoji-flat:placard" style="font-size: 1.25rem;"/>
          </template>
        </div>
        <span class="ml-2"> {{ currentChannel.name }}</span>
      </div>

      <div v-if="isChat === 'not' && currentChannel.type === 'group' " class="flex items-center justify-center h-full">
        <ValidateModal :data="group"></ValidateModal>
      </div>

      <div style="height: 0;flex:1" v-else>
        <template v-if="!currentChannel.name">
          <div class="flex flex-col items-center justify-center h-full">
            <div style="width:64px;height:64px;" class="rounded-full mb-6">
              <img src="/icons/logo128.png" class="w-full h-full object-cover rounded-full"/>
            </div>
            <span class="font-24-500" style="color:var(--primary-text);">欢迎加入，天天工作台官方社群</span>
            <div class="mt-4 flex justify-center items-center" style="width:362px;">
              <div class="flex items-center">
                <div class="w-2.5 h-2.5 rounded-full mr-2.5" style="background:var(--success);"></div>
                <span>2,874人在线</span>
              </div>
              <div class="flex items-center ml-6">
                <div class="w-2.5 h-2.5 rounded-full mr-2.5" style="background:var(--secondary-text);"></div>
                <span>1,039,485成员</span>
              </div>
            </div>
          </div>
        </template>
        <Commun v-else-if="currentChannel.type === 'forum'" :forum-id="currentChannel.props.id" />
        <TUIChat v-else-if="currentChannel.type==='group'"></TUIChat>
        <template v-else-if="currentChannel.type==='link'">
          <div v-if="currentChannel.props.openMethod==='userSelect'" style="text-align: center;margin-top: 30%">
            当前频道需要浏览器打开。
          </div>
          <iframe v-else :src="currentChannel.props.url" class="m-2" style="border: none;background: none;border-radius: 4px;width: calc(100% - 10px);height: calc(100% - 10px)"></iframe>
        </template>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, computed,onMounted,getCurrentInstance} from 'vue'
import { chatList } from '../../../js/data/chatList'
import ChatFold from '../components/float/ChatFolds.vue'
import Commun from '../Commun.vue'
import { chatStore } from '../../../store/chat'
import browser from '../../../js/common/browser'
import Emoji from '../../../components/comp/Emoji.vue'
import { checkGroupShip } from '../../../js/common/sns'
import Modal from '../../../components/Modal.vue'
import { message } from 'ant-design-vue'
import { Icon as communityIcon } from '@iconify/vue'
import DefaultFloat from '../components/float/DefaultsFloat.vue'
import ValidateModal from '../components/empty/ValidationPrompt.vue';


export default defineComponent({
  components: {
    Emoji,ChatFold, Commun, Modal, ValidateModal,
    DefaultFloat,communityIcon
  },

  setup () {

    const chat = chatStore()
    const { appContext } = getCurrentInstance()
    const globalProperties = appContext.config.globalProperties;

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
      avatarUrl:'/icons/logo28.png',
      routeData:1,
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

    onMounted(()=>{
      const mit = globalProperties.$bus
      mit.on('defaultClickItem',(item)=>{
        currentItem(item)
      })
    })
    return {
      doubleCol, isFloat,
      ...toRefs(data), updatePage,
      currentItem, checkGroupShip,
    }
  }
})
</script>

<style lang="scss" scoped>
.font-500 {
  font-size: 16px;
  font-weight: 500;
}

.font-14 {
  font-size: 14px;
  font-weight: 400;
}

.font-16 {
  font-size: 16px;
  font-weight: 400;
}

.group-item {
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }

  &:hover ,&.active {
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

.font-24-500{
  font-size: 24px;
  font-weight: 500;
}
</style>
