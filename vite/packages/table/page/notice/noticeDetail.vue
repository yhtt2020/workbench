<template>
  <div class="w-full h-full flex items-center justify-center" v-if="list.length === 0">
    <EmptyStatus text="暂时没有消息通知"/>
  </div>
  <div class="w-full flex-1 px-3 xt-text" v-else style="height: calc(100% - 63px);">
    <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
     <div  v-for="item in list" class="mb-3">
      <xt-menu name="name" @contextmenu="revID = item" :menus="menus">
        <div class="w-full h-full  flex flex-col p-4 xt-bg-t-2 rounded-xl">
          <div class="flex justify-between mb-3">
            <div class="flex">
              <a-avatar :size="24" shape="circle"  :src="item.content.icon"></a-avatar>
              <div class="font-16 font-400 xt-font xt-text ml-3">
                {{ item.content.title }}
              </div>
            </div>
            <xt-button w="21" h="21"  @click="delSingleHistoryNotice(item)">
              <div class="flex items-center justify-center">
                <DetailIcon icon="akar-icons:circle-x-fill" class="category-button pointer" style="font-size: 1.25rem;color:var(--secondary-text);" />
              </div>
            </xt-button>
          </div>
          <div class="font-16 font-400 xt-font xt-text mb-2">
            {{ item.content.body }}
          </div> 
          <div class="flex justify-between">
            <div class="flex items-center justify-center ">{{formatTime(item.createTime)}}</div>
            <xt-button class="category-button" style="width: 56px;height: 32px;background: var(--active-secondary-bg)!important;color:var(--active-bg);border-radius: 8px !important;" @click="reviewMessage(item.content.conversationID)">查看</xt-button>
          </div>
        </div>
      </xt-menu>
     </div>
     <div style="height: 12px;"></div>
    </vue-custom-scrollbar>
  
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { formatTime } from '../../util';
import { Icon as DetailIcon } from '@iconify/vue'
import { chatStore } from '../../store/chat'
import { noticeStore } from './store/noticeStore'

import EmptyStatus from '../chat/components/empty/EmptyStatus.vue';


export default {
  props: ["list","type"],

  components:{
    DetailIcon,EmptyStatus
  },

  data() {
    return {
      revID: "",
      menus: [
        {
          name: "打开应用",
          callBack: () => {
            
          },
          newIcon: "fluent:open-20-filled",
        },
        {
          name: "删除通知",
          callBack: (item) => {
            // console.log("删除", this.revID);
            this.delSingleHistoryNotice(this.revID)
          },
          newIcon: "akar-icons:trash-can",
        },
      ],
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },

  computed:{
    filterList(){
      // return this.list
      // if(this.type === 'system'){
      //   return this.list
      // }else{
      //   const messageList = this.list.filter((item)=>{
      //     if(item.content.type === 'message'){
      //       return item
      //     }
      //   })
      //   return messageList
      // }
    }
  },

  methods:{
    formatTime,
    ...mapActions(chatStore,['updateConversation']),
    ...mapActions(noticeStore,['delSingleHistoryNotice']),
    reviewMessage(conversationID){
      this.updateConversation(conversationID),
      this.$emit('close')
      this.$router.push({name:'chatMain'});
      window.$TUIKit.TUIServer.TUIConversation.getConversationProfile(conversationID).then((imResponse) => {
        // 通知 TUIConversation 添加当前会话
        // Notify TUIConversation to toggle the current conversation
        window.$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>