<template>
  <a-row class="w-full h-full">
    <a-col  class="flex flex-col h-full px-3 find-left" v-if="isFloat === false"
      style=" border-right:1px solid var(--divider);"
    >
    <!-- :style="doubleCol ? { width:'336px !important' } :{ width:'240px !important'}" -->
    <!-- flex=" 0 1 300px" -->
      
      <CategoryFloat :communityID="routeData" :float="false"  @updateColumn="updateColumn" @createCategory="clickEmptyButton" @clickItem="currentItem"></CategoryFloat>

      
    </a-col>

    <a-col flex=" 1 1 200px" v-if="currentChannel" class="flex flex-col h-full">
      <div class="px-4 mb-0 line-title">
        <span style="vertical-align: text-top">
        <template v-if="currentChannel.type === 'group'">
          <communityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
        </template>
        <template v-if="currentChannel.type === 'link'">
          <communityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
        </template>
          <template v-if="currentChannel.type === 'forum'">
            <communityIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
          </template>
       </span>
        {{ currentChannel.name }}
      </div>

      <div v-if="isChat === 'not'" class="flex items-center justify-center h-full">
        <ValidateModal :data="group"></ValidateModal>
      </div>

      <div style="height: 0;flex:1" v-else>
        <template v-if="!currentChannel.name && channelList.length>0">
          <div class="flex flex-col items-center justify-center h-full">
            <div style="width:64px;height:64px;" class="rounded-full mb-6">
              <img src="/icons/logo128.png" class="w-full h-full object-cover rounded-full"/>
            </div>
            <span class="font-24-500" style="color:var(--primary-text);">欢迎加入，想天工作台官方社群</span>
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
        <Commun v-else-if="currentChannel.type === 'forum'" :forum-id="currentChannel.props.id"/>
        <TUIChat v-else-if="currentChannel.type==='group'"></TUIChat>
        <template v-else-if="currentChannel.type==='link'">
          <div v-if="currentChannel.name !== 'Roadmap'" style="text-align: center;margin-top: 30%">

            当前频道需要浏览器打开。
          </div>

          <iframe v-else :src="JSON.parse(currentChannel.props).url" class="m-2"
                  style="border: none;background: none;border-radius: 4px;width: calc(100% - 10px);height: calc(100% - 10px)"></iframe>

        </template>

        <a-col v-else flex=" 1 1 200px" class="h-full flex flex-col">
           <!-- 空状态，取文章 -->
          <div class="community-article h-full">
            <!-- <vue-custom-scrollbar class="h-full" :settings=" {
              default: {
                useBothWheelAxes: true,
                swipeEasing: true,
                suppressScrollY: false,
                suppressScrollX: true,
                wheelPropagation: true
              }
            }">
              <h2 v-html="emptyArticle.title"></h2>
              <div v-html="emptyArticle.content"></div>
            </vue-custom-scrollbar> -->
            <Article :artName="artName"></Article>
          </div>


        </a-col>

      </div>
    </a-col>

  </a-row>


  <Modal v-if="addShow" v-model:visible="addShow" :blurFlag="true">
    <CreateNewChannel v-if="type === 'addChannel'" :no="routeData.no" @close="addShow = false"></CreateNewChannel>
    <CreateNewGroup v-if="type === 'addNewGroup' " :no="routeData.no" @close="addShow = false"></CreateNewGroup>
  </Modal>

</template>

<script>
import { defineComponent, reactive, toRefs, watchEffect, computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon as CommunityIcon } from '@iconify/vue'
import { SelectOutlined } from '@ant-design/icons-vue'
import { communityStore } from '../store/communityStore'
import { chatStore } from '../../../store/chat'
import _ from 'lodash-es'
import articleService from '../../../js/service/articleService'
import browser from '../../../js/common/browser'
import { checkGroupShip } from '../../../js/common/sns'

import Modal from '../../../components/Modal.vue'
import CreateNewChannel from '../components/createNewChannel.vue'
import CreateNewGroup from '../components/createNewCategory.vue'
import VueCustomScrollbar from '../../../../../src/components/vue-scrollbar.vue'
import Article from '../../../components/Article.vue'
import CategoryFloat from '../components/float/categoryFloat.vue'

export default defineComponent({
  components: {
    SelectOutlined,
    VueCustomScrollbar, CommunityIcon, Modal,CategoryFloat,
    CreateNewChannel,CreateNewGroup,
    //  ChatFold,Article,
  },

  setup (props, ctx) {
    const route = useRoute()
    const myCom = communityStore()
    const chat = chatStore()

    const data = reactive({
      emptyArticle: {
        title: '',
        content: ''
      },
      type: '',
      addShow: false, // 点击按钮弹窗
      routeData: {}, // 接收路由参数
      channelList:{},
      currentChannel: {},
      isChat:'yes',
      group:[],
      //文章名称
      artName:'community_after_created_empty',

    })

    const doubleCol = ref(chat.$state.settings.showDouble)

    const clickEmptyButton = (item) => {
      // console.log('获取数据',item)
      data.type = item.type
      data.addShow = true
    }

    onMounted(async () => {
      console.log('启动')
      const rs = await articleService.getOne('community_after_created_empty')
      data.emptyArticle = rs
      // console.log(rs)
    })

    watchEffect(async () => {
      data.routeData = { no: route.params.no }
    })

    // 选择当前状态
    const currentItem = async (item) => {
      // 点击链接
      if (item.type === 'link' && item.name !== 'Roadmap') {
        const url = JSON.parse(item.props).url
        browser.openInUserSelect(url)
      }

      // 点击群聊
      if(item.type === 'group'){
        const groupId = JSON.parse(item.props).groupID
        const res = await window.$chat.searchGroupByID(groupId)
        const enableGroup = await checkGroupShip([`${groupId}`])
        data.isChat = enableGroup[0]
        const isDisable = res.data.group.joinOption !== 'DisableApply'

        // 判断有没有加入社群, yes表示已经加入, not表示没有加入
        if (enableGroup[0] === 'yes') {

          const name = `GROUP${groupId}`
          window.TUIKitTUICore.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse) => {
            // 通知 TUIConversation 添加当前会话
            // Notify TUIConversation to toggle the current conversation
            window.TUIKitTUICore.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation)
          })

        }else {
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

    const updateColumn = () => {
      doubleCol.value = chat.$state.settings.showDouble
    }

    return {
      isFloat, doubleCol,
      ...toRefs(data), clickEmptyButton, currentItem, updateColumn,
      onMounted
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

.active-button {
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }

  &:hover {
    opacity: 0.8;
  }
}

.active-bg {
  background: var(--active-secondary-bg);
}

</style>
<style lang="scss">
.community-article {
  padding: 20px;
  font-size: 16px;
  line-height: 1.5;

  img {
    border-radius: 8px !important;
  }
}
</style>
