<template>
  <div class="flex h-full">
    <div class="flex flex-col items-center mr-1" style="position: relative;">
      <div class="left-list flex flex-col">
        <div v-for="(item,index) in appList" class="flex pointer items-center rounded-lg flex-col mb-2 justify-center" 
          style="width: 56px;height: 56px;"  :class="{'active-bg':selectStatus === index}"  @click="clickLeftApp(item,index)"
        >
         <div class="flex items-center rounded-lg justify-center session-item" v-if="item.icon" style="background: var(--active-bg);">
          <Icon :icon="item.icon" style="font-size: 2em;color: var(--active-text);"></Icon>
         </div>
         <div class="flex items-center rounded-lg justify-center session-item" v-else>
          <img :src="item.image" class="w-full h-full" alt="">
         </div> 
        </div>
      </div>
      <div class="notice-setting w-full pointer">
        <a-tooltip placement="right" overlay-class="tooltip-no-border"  title="设置">
          <div class=" flex items-center justify-center h-12" @click="changeSetting">
            <Icon icon="setting" style="font-size:2em;color: var(--secondary-text);"></Icon>
          </div>
        </a-tooltip> 
      </div> 
      <div class="notice-enable w-full pointer">
        <a-tooltip placement="right" overlay-class="tooltip-no-border" title="开关">
          <div class="flex items-center justify-center h-12" @click="setNoticeOnOff(noticeSettings.enable = !noticeSettings.enable)">
            <Icon icon="notification" style="font-size:2em;color: var(--secondary-text);" v-if="noticeSettings.enable"></Icon>
            <Icon icon="notification-off" style="font-size:2em;color: var(--secondary-text);" v-else></Icon>
          </div> 
        </a-tooltip>
      </div>
    </div>

    <a-divider type="vertical" style="height: 100%;"></a-divider>

    <div class="flex flex-col ml-1" style="width: 395px;">
      <template v-if="changeSet">
        <div class="flex flex-col pl-2">
          <span class="font-16 mb-3" style="color:var(--primary-text);">设置</span>
          <div class="flex flex-col mb-3 p-4 rounded-lg" style="width: 395px; background: var(--secondary-bg);">
            <div class="flex justify-between">
              <span class="font-16 mb-2.5" style="color:var(--primary-text);">消息提示音</span>
              <a-switch v-model:checked="promptStatus" @change="changeEnable($event)"></a-switch>
            </div>
            <span class="font-14" style="color:var(--secondary-text)">有新消息接收时，触发提示音</span>
          </div>
        </div>
      </template>

      <template v-else>
        <NoticeRightTop :appType="appType" :appItem="appItem"></NoticeRightTop>
        <!-- <AllMiddleTip v-if="appType === 'all'" :list="appContentList"></AllMiddleTip> -->
        <AllNotice v-if="appType === 'all'"  :list="appContentList"></AllNotice>
        <NoticeDetail v-else :list="otherList"></NoticeDetail>
      </template>

      
    </div>


  </div>
</template>

<script>
import { defineComponent,ref,toRefs,reactive,computed,watch } from 'vue'
import { mapActions,mapWritableState } from 'pinia'
import { noticeStore } from '../../store/notice'
import _ from 'lodash-es'
import NoticeRightTop from '../../components/notice/noticeRightTop.vue'
import AllNotice from '../../components/notice/allNotice.vue'
import AllMiddleTip from '../../components/notice/allMiddleTip.vue'
import NoticeDetail from './noticeDetail.vue' 

export default defineComponent({
  components:{
    NoticeRightTop,
    AllNotice,
    AllMiddleTip,
    NoticeDetail
  },

  computed:{
    ...mapWritableState(noticeStore,['noticeSettings'])
  },

  // mounted(){
  //  this.loadHistoryNotice()
  // },

  methods:{
    ...mapActions(noticeStore,['loadNoticeDB','setNoticeOnOff']),
    async loadHistoryNotice(){
      await this.loadNoticeDB()
    }
  },

  setup(){

    const data = reactive({
      appList:[], // 左侧应用列表图标
      selectStatus:0, // 应用列表选中状态
      appType:'all', // 应用类型,默认全部
      appItem:{}, // 右侧图标
      changeSet:false, // 切换设置
      promptStatus: noticeStore().$state.noticeSettings.enablePlay,  // 提示语开关
      otherList:[], // 应用分类列表
    })
    
    const store = noticeStore()
    data.appList = store.$state.notice.sessionApp

    const appContentList = computed(()=>{   // 通过计算属性获取消息通知历史数据
      return store.$state.notice.messageContent
    })

    const clickLeftApp = (item,index) =>{  // 点击选中 
      data.selectStatus = index,
      data.appType = item.id
      data.appItem = item
      data.changeSet = false
    }

    const changeSetting = () =>{  // 点击左侧底部设置按钮触发显示消息通知语音提示设置页面    
      data.changeSet = !data.changeSet
    }

    const changeEnable = (val) =>{ // 消息通知语音提示开关事件 
      store.setMessagePrompt(val)
    }

    watch(()=>data.appType,(newVal)=>{  // 根据不同应用列表类型进行数据分类
      if(newVal !== 'all'){
        const index =  _.forEach(appContentList.value,function(o){ return o?.doc.appType === newVal })
        data.otherList = index
      }else{
        return;
      }
    })

  

    return{
      appContentList,
      ...toRefs(data),clickLeftApp,changeSetting,
      changeEnable,
    }
  }
})

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


:deep(.ant-empty-image){
  width:64px;
  height: 64px;
}

:deep(.ps__rail-y){
  display: none !important;
}

.notice-setting{
  position: absolute;
  bottom:0;
  left: 0;
}

.left-list{
  height:93%;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc; /* 滚动条颜色 */
    border-radius: 6px; /* 滚动条圆角 */
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #999; /* 悬停时滚动条颜色 */
  }

}

.font-16{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
}

.notice-enable{
  position: absolute;
  bottom:60px;
  left: 0;
}

:deep(.ant-divider-vertical){
  border-left:1px solid var(--divider) !important;
}

.tooltip-no-border .ant-tooltip-inner {
  border: none !important;
}
</style>