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
        <div class=" flex items-center justify-center h-14 w-14" @click="changeSetting">
          <Icon icon="setting" style="height:24px;width:24px;"></Icon>
        </div>
      </div> 
    </div>

    <a-divider type="vertical" class="mx-3" style="height: 100%; background-color:var(--divider);"></a-divider>

    <div class="flex flex-col" style="width: 395px;">
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
        

      </template>

      
    </div>


  </div>
</template>

<script>
import { defineComponent,onMounted,ref,toRefs,reactive } from 'vue'
import { noticeStore } from '../../store/notice'
import _ from 'lodash-es'
import NoticeRightTop from '../../components/notice/noticeRightTop.vue'

export default defineComponent({
  components:{
    NoticeRightTop
  },

  setup(){
    const data = reactive({
      appList:[], // 左侧应用列表图标
      selectStatus:0, // 应用列表选中状态
      appType:'all', // 应用类型,默认全部
      appItem:{}, // 右侧图标
      changeSet:false, // 切换设置
      promptStatus:'',  // 提示语开关
    })
    
    const store = noticeStore()
    data.appList = store.$state.notice.sessionApp
    data.promptStatus = store.$state.noticeSettings.enablePlay

    const clickLeftApp = (item,index) =>{  // 点击选中
      data.selectStatus = index,
      data.appType = item.id
      data.appItem = item
      data.changeSet = false
    }

    const changeSetting = () =>{
      data.changeSet = !data.changeSet
    }

    const changeEnable = (val) =>{
      store.setMessagePrompt(val)
    }

    return{
      ...toRefs(data),clickLeftApp,changeSetting,
      changeEnable,
    }
  }
})

// import NoticeDetail from './noticeDetail.vue';
// import NoticeDropDown from '../../components/notice/noticeDropDown.vue';
// import { Modal } from 'ant-design-vue'
// 

// export default {
//   components:{
//     NoticeDetail,
//     NoticeDropDown
//   },

//   computed:{
//     ...mapWritableState(noticeStore,['notice','noticeEnable','moreEnable']),
//     show(){  // 查找列表是否为空
//       for(let i=0;i<this.notice.session.length;i++){ 
//         if(this.notice.message[i].noticeList.length === 0){
//          return true
//         }else{
//           return false
//         }
//       }
//     }
//   },

//   data(){
//     return{
//       settingsScroller: { // 滚动条配置
//         useBothWheelAxes: true,
//         swipeEasing: true,
//         suppressScrollY: false,
//         suppressScrollX: true,
//         wheelPropagation: true
//       },
//       selectIndex:'', // 左侧选中状态
//       emptyUrl:'/img/state/null.png', // 空状态
//     }
//   },

//   mounted(){
//     this.selectIndex = 0
//   },

//   methods:{
//     ...mapActions(noticeStore,['setNoticeOnOff','deleteAllNotice','setMoreNotice','addNotifications']),
//     switchSession(index){  // 切换会话 
//      this.selectIndex = index
//     },

//     del(){  // 一次性清空操作  
//       Modal.confirm({
//         content:"确定要清理所有消息",
//         okText: "删除",
//         centered: true,
//         onOk: () => {
//           this.deleteAllNotice()
//         },
//       })
//     },

//     showMoreNotice(){  // 点击显示更多  
//       this.setMoreNotice(true)
//     },

//     add(){  // 模拟消息发送通知触发按钮 后需要删除
//       const n = {
//         title:'测试123',
//         body:'测试消息正文部分，根据业务需要显示具体内容',
//         time:Date.now(),
//         from:{
//           username:'',
//           avatarUrl:''
//         },
//         icon:'/icons/logo128.png',
//         imageUrl:'',
//         subtitle:'',
//         level:'low'
//       }
//       if(this.noticeEnable){
//         window.$notice.sendNotice(n)
//         this.addNotifications(this.selectIndex,window.$notice.notifications)
//         // console.log('测试::>>',);
//       }else{
//         this.addNotifications(this.selectIndex,window.$notice.notifications)
//       }
//     }

    
//   }
// }
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

</style>