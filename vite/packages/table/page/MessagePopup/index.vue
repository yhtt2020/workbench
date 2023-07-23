<template>
  <div class="flex h-full">
   <!-- 消息弹窗 -->
   <div class="flex flex-col items-center w-20">
      <div v-for="item in messageNotice.session" 
        class="flex pointer items-center rounded-lg flex-col  justify-center" 
        style="width: 56px;height: 56px;" :class="{'active-bg':selectIndex === item.id}"
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
   <a-divider type="vertical" style="height: 100%; background-color:var(--divider);" />
   <div class="flex  flex-col">
     <div class="flex flex-none items-center justify-between pl-1" style="width: 395px;">
       <div class="flex items-center ">
         <Icon icon="xiaoxi1" style="font-size: 1.4em;"></Icon>
         <span class="pl-3">全部消息</span>
       </div>
       <div class="flex items-center">
         <div class="w-11 pointer flex items-center justify-center h-11">
           <Icon icon="clear" style="font-size: 1.5em;"></Icon>
         </div>
         <div class="w-11 pointer flex items-center justify-center h-11">
            <Icon icon="moon" style="font-size: 1.5em;"></Icon>
         </div>
       </div>
     </div>
     <div class="flex-grow">
        <NoticeDetail :noticeId="noticeDetailList"></NoticeDetail>
     </div>
   </div>
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { noticeStore } from '../../store/notice'
import NoticeDetail from './NoticeDetail.vue';


export default {
  components:{
    NoticeDetail
  },

  data(){
    return{
      selectIndex:'',
      noticeDetailList:{},
    }
  },

  computed:{
    ...mapWritableState(noticeStore,['messageNotice'])

  },

  mounted(){
    this.selectIndex = 0
    this.noticeDetailList = this.messageNotice.notice[0]
  },

  methods:{
    switchSession(index){  // 切换会话 
     this.selectIndex = index
     this.noticeDetailList  = this.messageNotice.notice[index]
    }
  }
}
</script>

<style lang="scss" scoped>
.session-item{
  width: 36px;
  height: 36px;
}

.active-bg{
  background: var(--active-secondary-bg);
}
</style>