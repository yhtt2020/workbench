<template>
  <h3 style="margin-bottom: 1em;color:var(--primary-text)">我的社区</h3>
  <div>
    <a-row class="com-actions" :gutter="[20,20]">
      <a-col :span="8">
        <!-- @click="go('https://s.apps.vip/user/info')" -->
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

  <Modal v-model:visible="updateInfoVisible"  v-show="updateInfoVisible"  :blurFlag="true">
     <div class="flex flex-col p-3 h-full" style="width: 480px;">
        <div class="w-full flex mb-9">
           <div class="flex items-center update-title justify-center" style="width:95%;">
             我的信息
           </div>
           <div class="w-12 h-12 flex items-center pointer justify-center rounded-lg" style="background: var(--secondary-bg);"
            @click="updateInfoVisible = false"
           >
             <Icon icon="guanbi" style="font-size: 1.45em;"></Icon>
           </div>
        </div>
        <div class="flex items-center justify-center w-full h-full">
          <div class="flex items-center rounded-xl justify-center py-1" style="width: 416px;border: 1px solid var(--divider);">
            <a-input v-model:value="userName" :bordered="false"></a-input>
            <div class="w-10 h-10 flex  justify-center items-center">

            </div>
          </div>
        </div>
     </div>
  </Modal>
</template>

<script>
import {IdcardFilled,GoldFilled,BellFilled,ApiFilled,LockFilled,ScheduleFilled} from '@ant-design/icons-vue'
import browser from '../../js/common/browser'
import Modal from '../Modal.vue'
export default {
  name: 'ComActionPanel',
  components:{
    IdcardFilled,GoldFilled,BellFilled,ApiFilled,LockFilled,ScheduleFilled,
    Modal
  },
  data(){
    return{
      updateInfoVisible:false,
    }
  },
  methods:{
    modifyData(){ // 修改资料
      this.updateInfoVisible = true
    },
    edit(){
      browser.openInInner("https://s.apps.vip/user/info")
    },
    go(url){
      browser.openInInner(url)
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
</style>
