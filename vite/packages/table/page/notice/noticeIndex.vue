<template>
  <div class="flex h-full">
    <div class="flex flex-col items-center">
      <div v-for="item in messageNotice.session" 
        class="flex pointer items-center rounded-lg flex-col mb-2 justify-center" 
        style="width: 56px;height: 56px;" 
        :class="{'active-bg':selectIndex === item.id}"
        @click="switchSession(item.id)"
      >
        <div class="flex items-center rounded-lg justify-center session-item" v-if="item.icon" style="background: var(--active-bg);">
          <Icon :icon="item.icon" style="font-size: 2em;color: var(--active-text);"></Icon>
        </div>
        <div class="flex items-center rounded-lg justify-center session-item" v-else>
          <img :src="item.url" class="w-full h-full" alt="">
        </div>
      </div>
    </div>
    <a-divider type="vertical" style="height: 100%; background-color:var(--secondary-bg);" />
    <div class="flex flex-col" style="width: 395px;">
      <div class="flex justify-between mb-4">
        <div class="flex items-center " v-if="selectIndex === 0" >
          <Icon icon="xiaoxi1" style="font-size: 1.4em;"></Icon>
          <span class="pl-3 font-500" style="color: var(--primary-text);">全部消息</span>
        </div>
        <div v-else-if="messageNotice.session[selectIndex] !== undefined" class="flex items-center">
          <div style="width: 32px;height: 32px;">
            <img  :src="messageNotice.session[selectIndex].url" class="w-full h-full object-cover" alt="">
          </div>
          <span class="pl-3 font-400" style="color: var(--primary-text);">{{messageNotice.session[selectIndex].alias}}</span>
        </div>
        <div class="flex items-center">
          <div class="w-11 pointer flex items-center justify-center h-11" @click="del">
            <!-- @click="delAllNotification(selectIndex)" -->
            <Icon icon="clear" style="font-size: 1.5em;"></Icon>
          </div>
          <div class="w-11 pointer flex items-center justify-center h-11" @click="setNotificationOnOff(this.noticeEnable = !this.noticeEnable)">
            <Icon icon="notification" style="font-size: 1.5em;color: var(--secondary-text);" v-if="noticeEnable"></Icon>
            <Icon icon="notification-off" style="font-size: 1.5em;color: var(--secondary-text);" v-else></Icon>
          </div>
        </div>
      </div>

      <div class="flex justify-between mb-4" v-if="selectIndex === 0">
        <div class="flex items-center">
          <div class="flex items-center justify-center"  style="width: 32px;height: 32px;">
            <img :src="messageNotice.notice[0].noticeIcon" class="w-full h-full"  alt="">
          </div>
          <span class="pl-2 font-400" style="color: var(--primary-text);">系统</span>
          <div class="font-14 w-6 h-6 rounded-md ml-2 flex items-center justify-center" style="color: var(--active-bg);background: var(--active-secondary-bg);">
            3
          </div>
        </div>
        <noticeDropDown></noticeDropDown>
      </div>

      <template v-if=" messageNotice.notice[selectIndex] !== undefined">
        <NoticeDetail :detailItem="messageNotice.notice[selectIndex].noticeList"></NoticeDetail>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { noticeStore } from '../../store/notice'
import NoticeDetail from './noticeDetail.vue';
import noticeDropDown from '../../components/noticeDropDown.vue';
import { NotificationManager } from '../../js/common/sessionNotice' 

export default {
  components:{
    NoticeDetail,
    noticeDropDown
  },
  computed:{
    ...mapWritableState(noticeStore,['messageNotice','noticeEnable']),
  },
  data(){
    return{
      selectIndex:'',
      isDropdownVisible:false,
    }
  },
  mounted(){
    this.selectIndex = 0
  },
  methods:{
    ...mapActions(noticeStore,['setNotificationOnOff','delAllNotification']),
    switchSession(index){  // 切换会话 
     this.selectIndex = index
     this.noticeDetailList  = this.messageNotice.notice[index]
    },
    openDropDown(){
      this.isDropdownVisible = true
    },
    del(){
      const enable = this.noticeEnable
      const config = {
        title:'社区公告',
        body:'尊敬的用户，由于系统升级，社区App将于明天进行维护，届时您可能暂时无法使用部分功能。给您带来的不便，敬请谅解。',
        time: Date.now(),
        icon:'/icons/logo128.png',
      }
      const urgency = 'critical'
      const notice = new NotificationManager(config,enable,urgency)
      notice.sendNotification()
    }
  }
}
</script>

<style lang="scss" scoped>
.session-item{
  width: 40px;
  height: 40px;
}

.active-bg{
  background: var(--active-secondary-bg);
}

.font-400{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}

.font-500{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 500;
}

.font-14{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}

.active-button{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}

</style>