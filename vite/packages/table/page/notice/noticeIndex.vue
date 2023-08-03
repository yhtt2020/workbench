<template>
  <div class="flex h-full">
    <!-- 左侧列表 -->
    <div class="flex flex-col items-center">
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
        <div v-for="(item,index) in notice.session" class="flex pointer items-center rounded-lg flex-col mb-2 justify-center" 
         style="width: 56px;height: 56px;"  :class="{'active-bg':selectIndex === index}"  @click="switchSession(index)"
        >
          <div class="flex items-center rounded-lg justify-center session-item" v-if="item.icon" style="background: var(--active-bg);">
            <Icon :icon="item.icon" style="font-size: 2em;color: var(--active-text);"></Icon>
          </div>
          <div class="flex items-center rounded-lg justify-center session-item" v-else>
            <img :src="item.url" class="w-full h-full" alt="">
          </div>
        </div>
      </vue-custom-scrollbar>
    </div>

    <!-- 分割线 -->
    <a-divider type="vertical" class="mx-3" style="height: 100%; background-color:var(--divider);"></a-divider>

    <!-- 右侧内容详情 -->
    <div class="flex flex-col" style="width: 395px;">
      <!-- 顶部按钮 -->
      <div class="flex justify-between mb-4">
        <div class="flex items-center " v-if="selectIndex === 0" >
          <Icon icon="xiaoxi1" style="font-size: 1.4em;"></Icon>
          <span class="pl-3 font-500" style="color: var(--primary-text);">全部消息</span>
        </div>
        
        <div v-else-if="notice.session[selectIndex] !== undefined" class="flex items-center">
          <div style="width: 32px;height: 32px;">
            <img  :src="notice.session[selectIndex].url" class="w-full h-full object-cover" alt="">
          </div>
          <span class="pl-3 font-400" style="color: var(--primary-text);">{{notice.session[selectIndex].alias}}</span>
        </div>

        <div class="flex items-center">
          <div class="w-11 pointer flex items-center justify-center h-11" @click="add">
            <Icon icon="tianjia2" style="font-size: 1.5em;"></Icon>
          </div>
          <div class="w-11 pointer flex items-center justify-center h-11" @click="del">
            <Icon icon="clear" style="font-size: 1.5em;"></Icon>
          </div>
          <div class="w-11 pointer flex items-center justify-center h-11" @click="setNoticeOnOff(this.noticeEnable = !this.noticeEnable)">
            <Icon icon="notification" style="font-size: 1.5em;color: var(--secondary-text);" v-if="noticeEnable"></Icon>
            <Icon icon="notification-off" style="font-size: 1.5em;color: var(--secondary-text);" v-else></Icon>
          </div>
        </div>
      </div>

      <!-- 系统默认显示下拉菜单 -->
      <div class="flex justify-between mb-2" v-if="selectIndex === 0 && show === false">
        <div class="flex items-center ">
          <div class="flex items-center justify-center"  style="width: 32px;height: 32px;">
            <img :src="notice.noticeIcon" class="w-full h-full"  alt="">
          </div>
          <span class="pl-2 font-400" style="color: var(--primary-text);">系统</span>
          <div class="font-14 w-6 h-6 rounded-md ml-2 flex items-center justify-center" style="color: var(--active-bg);background: var(--active-secondary-bg);">
            3
          </div>
        </div>
        <NoticeDropDown :select="selectIndex"></NoticeDropDown>
      </div>

      <!-- 数据为空状态 -->
      <div class="flex items-center h-full justify-center" v-if="show === true">
        <a-empty :image="emptyUrl" description="暂无消息通知"></a-empty>
      </div> 

      <!-- 消息通知少于两个时显示的数据 -->
      <div v-if="notice.session.length < 3">  
        <template v-if="notice.message[selectIndex] !== undefined">
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 88%;" v-if="show === false">
            <NoticeDetail :detail-item="notice.message[selectIndex].noticeList" :detail-id="selectIndex"></NoticeDetail>
          </vue-custom-scrollbar>
        </template>
      </div>

       <!-- 消息通知大于两个时显示的数据 -->
      <div v-else>
        <template v-if="notice.message[selectIndex] !== undefined">
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 92vh;" v-if="show === false">
            <div v-if="moreEnable === false">
              <NoticeDetail :detail-item="notice.message[selectIndex].noticeList.slice(0,3)" :detail-id="selectIndex"></NoticeDetail>
              <div class="flex items-center justify-center" >
                <div class="h-11 flex items-center pointer justify-center px-6 font-400 active-button rounded-lg" style="background:var(--secondary-bg);color: var(--primary-text);" @click="showMoreNotice">
                  + {{ notice.message[selectIndex].noticeList.length }} 通知
                </div>
              </div>
            </div>

            <div v-else>
              <NoticeDetail :detail-item="notice.message[selectIndex].noticeList" :detail-id="selectIndex"></NoticeDetail>
            </div>

          </vue-custom-scrollbar>
        </template>
      </div>
    
    </div>
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { noticeStore } from '../../store/notice'
import NoticeDetail from './noticeDetail.vue';
import NoticeDropDown from '../../components/notice/noticeDropDown.vue';
import { Modal } from 'ant-design-vue'
import _ from 'lodash-es'

export default {
  components:{
    NoticeDetail,
    NoticeDropDown
  },

  computed:{
    ...mapWritableState(noticeStore,['notice','noticeEnable','moreEnable']),
    show(){  // 查找列表是否为空
      for(let i=0;i<this.notice.session.length;i++){ 
        if(this.notice.message[i].noticeList.length === 0){
         return true
        }else{
          return false
        }
      }
    }
  },

  data(){
    return{
      settingsScroller: { // 滚动条配置
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      selectIndex:'', // 左侧选中状态
      emptyUrl:'/img/state/null.png', // 空状态
    }
  },

  mounted(){
    this.selectIndex = 0
  },

  methods:{
    ...mapActions(noticeStore,['setNoticeOnOff','deleteAllNotice','setMoreNotice','addNotifications']),
    switchSession(index){  // 切换会话 
     this.selectIndex = index
    },

    del(){  // 一次性清空操作  
      Modal.confirm({
        content:"确定要清理所有消息",
        okText: "删除",
        centered: true,
        onOk: () => {
          this.deleteAllNotice()
        },
      })
    },

    showMoreNotice(){  // 点击显示更多  
      this.setMoreNotice(true)
    },

    add(){  // 模拟消息发送通知触发按钮 后需要删除
      const n = {
        title:'测试123',
        body:'测试消息正文部分，根据业务需要显示具体内容',
        time:Date.now(),
        from:{
          username:'',
          avatarUrl:''
        },
        icon:'/icons/logo128.png',
        imageUrl:'',
        subtitle:'',
        level:'low'
      }
      if(this.noticeEnable){
        window.$notice.sendNotice(n)
        this.addNotifications(this.selectIndex,window.$notice.notifications)
        // console.log('测试::>>',);
      }else{
        this.addNotifications(this.selectIndex,window.$notice.notifications)
      }
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


:deep(.ant-empty-image){
  width:64px;
  height: 64px;
}

:deep(.ps__rail-y){
  display: none !important;
}
</style>