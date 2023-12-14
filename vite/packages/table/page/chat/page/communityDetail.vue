<template>
  <a-row class="w-full h-full">
    <a-col  class="flex flex-col h-full  find-left" v-if="isFloat === false" style=" border-right:1px solid var(--divider);">
      <CategoryFloat :float="false" :no="routeData"  @createCategory="clickEmptyButton" />
    </a-col>
    <a-col flex=" 1 1 200px" v-if="currentChannel" class="flex flex-col h-full">
      <CommunityHeader :headerContent="currentChannel"/>
      <div v-if="isChat === 'not'" class="flex items-center justify-center h-full">
        <ValidateModal :data="group"></ValidateModal>
      </div>
      <div style="height: 0;flex:1;position:relative;" v-else>
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
        <Commun v-else-if="currentChannel.type === 'forum'" :forum-id="currentChannel.props.props.id "/>
        <TUIChat v-else-if="currentChannel.type==='group'"></TUIChat>
        <template v-else-if="currentChannel.type==='link'">
          <div v-if="currentChannel.name !== 'Roadmap' && currentChannel.props.openMethod !== 'currentPage'" class="flex items-center justify-center" style="text-align: center;margin-top: 30%">

            <span class="font-16 font-400" style="color:var(--primary-text);">当前频道需要浏览器打开。</span>
            <communityIcon icon="fluent:open-20-filled"  style="font-size: 24px"/>
          </div>

          <iframe ref="iframe" v-else :src="currentChannel.props.url"  class="m-2"  sandbox="allow-same-origin allow-forms allow-scripts"
          style="border: none;background: none;border-radius: 4px;width: calc(100% - 10px);height: calc(100% - 10px)">

          </iframe>
          <div  style="position: absolute;top: -35px;right: 0px">
            <xt-button @click="openLink(currentChannel.props.url)" :w="120" :h="40">浏览器打开</xt-button>
          </div>
        </template>
        <template v-else-if="currentChannel.type === 'communitySet'">
          <CommunitySetting :no="currentChannel.data.no"/>
        </template>
        <a-col v-else flex=" 1 1 200px" class="h-full flex flex-col">
           <!-- 空状态，取文章 -->
          <div class="community-article h-full">
            <Article :artName="artName"></Article>
          </div>
        </a-col>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { communityStore } from '../store/communityStore'
import { chatStore } from '../../../store/chat'
import _ from 'lodash-es'
import articleService from '../../../js/service/articleService'
import browser from '../../../js/common/browser'
import { checkGroupShip } from '../../../js/common/sns'
import { Icon as CommunityIcon } from '@iconify/vue'

import Modal from '../../../components/Modal.vue';
import VueCustomScrollbar from '../../../../../src/components/vue-scrollbar.vue';
import Article from '../../../components/Article.vue';
import CategoryFloat from '../components/float/CategorysFloat.vue';
import Commun from '../Commun.vue';
import CommunitySetting from './setting/index.vue';
import CommunityHeader from '../components/float/CommunityHeader.vue'

export default {
  components:{
    CategoryFloat,Modal,
    VueCustomScrollbar,CommunityIcon,Article,
    Commun,
    CommunitySetting,
    CommunityHeader,
  },

  data(){
    return{
      emptyArticle: {
        title: '',
        content: ''
      },
      type: '',
      addShow: false, // 点击按钮弹窗
      channelList:{},
      currentChannel: {},
      isChat:'yes',
      group:[],
      //文章名称
      artName:'community_after_created_empty',
      routeData:1,
    }
  },

  computed:{
    ...mapWritableState(chatStore,['settings','contactsSet']),
    isFloat(){
      return this.settings.enableHide
    },
  },

  async mounted(){
    const rs = await articleService.getOne('community_after_created_empty')
    this.emptyArticle = rs
    // 监听当前事件触发
    this.$bus.on('clickItem',(item)=>{
      this.currentItem(item);
    })
    this.$bus.on('currentSet',(args)=>{
      this.currentChannel = args
    })
  },

  methods:{
    updateColumn(){},
    ...mapActions(communityStore,['updateMsgStatus','getCommunityTree']),
    // 当前点击
    async currentItem(item){
      // 链接
      if(item.type === 'link' && item.name !== 'Roadmap'){
        const data = item.props
        // 暂时实现通过想天浏览器打开和电脑系统默认的浏览器打开,当前页面助手无法实现
        switch (data.openMethod){
          case 'userSelect':
           browser.openInUserSelect(data.url)
           break;
          case 'systemSelect':
           browser.openInSystem(data.url)
           break;
        }
      }
      // 群聊
      if(item.type === 'group'){
        const changeData = item.props[0] !== undefined ? item.props[0] : item.props;
        const groups = window.$TUIKit.store.store.TUIGroup.groupList
        const index = groups.findIndex((findItem)=>{ return findItem.groupID === changeData.groupID })
        const enableGroup = await checkGroupShip([`${changeData.groupID}`]) // 有没有添加群聊
        this.isChat = enableGroup[0]
        if(groups[index].type === 'Private'){
          const isDisable = groups[index].joinOption === "DisableApply"
          if(enableGroup[0] === 'yes'){
            const name = `GROUP${changeData.groupID}`
            window.TUIKitTUICore.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse) => {
             // 通知 TUIConversation 添加当前会话
             // Notify TUIConversation to toggle the current conversation
             window.TUIKitTUICore.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation)
            })
          }else{
            if(isDisable){
              this.group = groups[index]
            }else{
              message.warn('该群禁止加入')
            }
          }
        }else{
          const res = await window.$chat.searchGroupByID(changeData.groupID)
          const isDisable = res.data.group.joinOption !== 'DisableApply'
          // 判断有没有加入社群, yes表示已经加入, not表示没有加入
          if (enableGroup[0] === 'yes'){
            const name = `GROUP${changeData.groupID}`
            window.TUIKitTUICore.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse) => {
              // 通知 TUIConversation 添加当前会话
              // Notify TUIConversation to toggle the current conversation
              window.TUIKitTUICore.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation)
            })
          }else{
            // isDisable判断群聊是否禁止加入
            if (isDisable) {
             this.group = res.data.group
            } else {
              message.warn('该群禁止加入')
            }
          }
        }
      }
      // 其他
      this.currentChannel = {...item,props:{ ...item.props }};
    },

    clickEmptyButton(item){
      this.type = item.type
      this.addShow = true
    },
    openLink(url){
      browser.openInSystem(url)
     // browser.openInSystem(this.$refs.iframe.contentWindow.location.href) 此次方法跨域
    }
  },

  watch:{
    // 通过监听方式获取社群号
    '$route':{
      handler(to,from){
       this.routeData = to.params.no
      //  this.getCommunityTree(to.params.no)
      },
      immediate:true,
      deep:true,
    }
  }
}
</script>


<style lang="scss" scoped>
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

