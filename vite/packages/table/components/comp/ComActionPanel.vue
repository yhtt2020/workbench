<template>
  <h3 style="margin-bottom: 1em;color:var(--primary-text)">我的社区</h3>
  <div>
    <a-row class="com-actions" :gutter="[20,20]">
      <a-col :span="8">
        <div @click="modifyData">
          <idcard-filled />
          <div>
          修改资料
        </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div @click="go('https://s.apps.vip/user/points')">
          <gold-filled />
          <div>积分明细</div>
        </div>
      </a-col>
      <a-col :span="8">
        <div @click="go('https://s.apps.vip/user/message')">
          <bell-filled /> <div>社区消息</div>
        </div>
      </a-col>
      <a-col :span="8">
        <div @click="go('https://s.apps.vip/user/account-info')">
          <api-filled /> <div>账号绑定</div>
        </div>
      </a-col>
      <a-col :span="8">
        <div @click="go('https://s.apps.vip/user/passwd')">
          <lock-filled /> <div>修改密码</div>
        </div>
      </a-col>
      <a-col :span="8">
        <div @click="go('https://s.apps.vip/task')">
          <schedule-filled /><div>社区任务</div>
        </div>
      </a-col>
    </a-row>
  </div>

  <Modal v-model:visible="updateInfoVisible"  v-show="updateInfoVisible"  :blurFlag="true" style="z-index: 5000;">
    <div class="flex flex-col p-3">

     <div class="flex flex-col" style="width: 480px;">
      <!-- 标题和关闭按钮 -->
      <div class="flex justify-between h-12 mb-6">
        <div class="flex items-center update-title justify-center" style="width:95%;">
          我的信息
        </div>
        <div class="w-12 h-12 flex items-center com-button pointer justify-center rounded-lg" 
          style="background: var(--secondary-bg);"
          @click="updateInfoVisible = false"
        >
         <Icon icon="guanbi" style="font-size: 1.45em;"></Icon>
        </div>
      </div> 
      <!-- 修改输入框 -->
      <div class="flex items-center justify-center">
        <div class="flex items-center rounded-xl justify-center h-10 px-3" style="width: 460px;border: 1px solid var(--divider);">
          <a-input v-model:value="nickname" :bordered="false"></a-input>
          <!-- <div>骰子摆放位置</div> -->
        </div>
      </div>
     </div>

     <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop  :settings="settingsScroller" style="height: 410px;">
       <div class="flex items-center mt-6 justify-center flex-col">
        <!-- 头像图片展示 -->
        <div class="flex flex-col w-full justify-between" style="width: 460px;">
          <span class="update-title pb-2">头像</span>
          <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop  :settings="settingsScroller" style="height: 310px;">
            <div class="flex flex-wrap items-center justify-center">

              <div v-for="item in 20" class="mb-3 mr-3 rounded-full pointer" style="width: 72px;height: 72px;">
                <img src="/img/001.png" class="w-full rounded-full h-full object-cover" alt="">
              </div>
            </div>
          </vue-custom-scrollbar>
        </div>

        <!-- 更多消息 -->
        <div class="flex items-center w-full justify-between px-2">
          <span class="update-title">更多信息</span>
          <div>
            <div class="h-12 w-20 flex com-button com-title rounded-xl items-center justify-center pointer " 
            style="background: var(--secondary-bg);color: var(--primary-text);" v-if="moreInfoShow === false"
            @click="infoShowClick" 
           >
             展开
           </div>
            <div class="h-12 w-20 flex com-button com-title rounded-xl items-center justify-center pointer " 
             style="background: var(--secondary-bg);color: var(--primary-text);" v-else   @click="infoShowClick" 
            >
              收起
            </div>
          </div>
        </div>
        <template v-if="moreInfoShow">
          <div class="flex flex-col px-1.5 mb-6" style="width: 460px;">
            <span class="update-title mb-5">个性签名</span>
            <a-textarea v-model:value="areaValue" class="rounded-lg no-scrollbar"  :rows="3" :maxlength="200" style="height: 100px;"/>
          </div>
          <div class="flex flex-col px-1.5 mb-6" style="width: 460px;">
            <span class="update-title mb-5">性别</span>
            <HorizontalPanel :navList="sexList" v-model:selectType="gender"></HorizontalPanel>
          </div>
          <div class="flex items-center justify-center px-1.5" style="width: 460px;">
            <span class="com-title" style="color: var(--secondary-text);">更多个人信息编辑、账号设置等，请前往</span>
            <span class="go-com pl-2 pointer"  @click="go('https://s.apps.vip/user/info')" >元社区</span>
          </div>
        </template>
       </div>
     </vue-custom-scrollbar>

     <!-- 底部按钮 -->
     <div class="flex items-center justify-center mt-6"  style="width: 480px;">
      <a-button type="primary" class="h-48 rounded-xl mr-3"  style="width:120px;color: var(--primary-text);border:none;background: var(--secondary-bg);">
        稍后设置
      </a-button>
      <a-button type="primary" class="h-48 rounded-xl" style="width:120px;color: var(--active-text);">保存</a-button>
     </div>

    </div>
  </Modal>
</template>

<script>
import {IdcardFilled,GoldFilled,BellFilled,ApiFilled,LockFilled,ScheduleFilled} from '@ant-design/icons-vue'
import browser from '../../js/common/browser'
import Modal from '../Modal.vue'
import HorizontalPanel from '../HorizontalPanel.vue'
// import RandomScreening from '../modal/RandomScreening.vue'
export default {
  name: 'ComActionPanel',
  components:{
    IdcardFilled,GoldFilled,BellFilled,ApiFilled,LockFilled,ScheduleFilled,
    HorizontalPanel,
    // RandomScreening,
    Modal
  },
  data(){
    return{
      updateInfoVisible:false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      moreInfoShow:true,
      sexList:[
        {title:'保密',name:'0'},
        {title:'男',name:'1'},
        {title:'女',name:'2'}
      ],
      gender:'',
      areaValue:'测试',
      nickname:'测试'
    }
  },
  mounted(){
     this.gender = this.sexList[0]
  },
  methods:{
    modifyData(){ // 修改资料
      this.updateInfoVisible = true
    },
    infoShowClick(){  // 是否展开和收起按钮回调事件
     this.moreInfoShow = !this.moreInfoShow
    },
    edit(){
      browser.openInInner("https://s.apps.vip/user/info")
    },
    go(url){
      browser.openInInner(url)
    }
  },
  watch:{
    'gender':{
      handler(newVal){
        this.gender = newVal
      }
    }
  }
}
</script>

<style scoped lang="scss">
.com-actions{
  &>div{
    cursor: pointer;
    border-radius: 0.2em;
    padding: 0.2em;
    &:hover{
      background: rgba(0, 0, 0, 0.2);
    }
}

  text-align: center;
  font-size: 1.1em;
}

.update-title{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
}

.com-title{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 400; 
}

.com-button{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}

.no-scrollbar ::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;
}

.go-com{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color:var(--active-bg);
  font-weight: 500;
}

:deep(.nav-item){
  border-radius: 10px !important;
}

:deep(.ps__thumb-y){
  display: none !important;
}
:deep(.ps__rail-y){
  display: none !important;
}
</style>
