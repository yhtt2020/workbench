<template>
  <div class="w-full h-full flex items-center justify-center" v-if="filterList.length === 0">
    <EmptyStatus text="暂时没有消息通知"/>
  </div>
  <div class="w-full h-full  xt-text" v-else>
    <div  v-for="item in filterList" class="mb-3">
      <xt-menu name="name" @contextmenu="revID = item._rev" :menus="menus">
        <div class="w-full h-full  flex flex-col p-4 xt-bg-2 rounded-xl">
          <div class="flex justify-between mb-3">
            <div class="flex">
              <a-avatar :size="24" shape="circle"  :src="item.content.icon"></a-avatar>
              <div class="category-16-400 xt-font xt-text ml-3">
                {{ item.content.title }}
              </div>
            </div>
            <DetailIcon icon="akar-icons:circle-x-fill" class="category-button pointer" style="font-size: 1.25rem;color:var(--secondary-text);" />
          </div>
          <div class="category-16-400 xt-font xt-text mb-2">
            {{ item.content.body }}
          </div> 
          <div class="flex justify-between">
            <div class="">{{formatTime(item.createTime)}}</div>
            <xt-button style="width: 56px;height: 32px;background: var(--active-secondary-bg);color:var(--active-bg);" @click="reviewMessage(item.content.conversationID)">查看</xt-button>
          </div>
        </div>
      </xt-menu>
    </div>
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { formatTime } from '../../util';
import { Icon as DetailIcon } from '@iconify/vue'
import { chatStore } from '../../store/chat'

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
            console.log("删除", this.revID);

          },
          newIcon: "akar-icons:trash-can",
        },
      ],
    };
  },

  computed:{
    filterList(){
      if(this.type === 'system'){
        const systemList = this.list.filter((item)=>{
          if(item.content.type === 'system'){
            return item
          }
        })
        return systemList
      }else{
        const messageList = this.list.filter((item)=>{
          if(item.content.type === 'message'){
            return item
          }
        })
        return messageList
      }
    }
  },

  methods:{
    formatTime,
    ...mapActions(chatStore,['updateConversation']),
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