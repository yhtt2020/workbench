<template>
  <h3 style="margin-bottom: 1em">我的社区</h3>
  <div>
    <a-row :gutter="[20,20]">
      <a-col>
        <a-button @click="go('https://s.apps.vip/user/info')">
          <idcard-filled /> 修改资料
        </a-button>
      </a-col>
      <a-col>
        <a-button @click="go('https://s.apps.vip/user/points')">
          <gold-filled /> 积分明细
        </a-button>
      </a-col>
      <a-col>
        <a-button @click="go('https://s.apps.vip/user/message')">
          <bell-filled /> 社区消息
        </a-button>
      </a-col>
      <a-col>
        <a-button @click="go('https://s.apps.vip/user/account-info')">
          <api-filled /> 账号绑定
        </a-button>
      </a-col>
      <a-col>
        <a-button @click="go('https://s.apps.vip/user/passwd')">
          <lock-filled /> 修改密码
        </a-button>
      </a-col>
      <a-col>
        <a-button @click="go('https://s.apps.vip/task')">
          <schedule-filled />社区任务
        </a-button>
      </a-col>
    </a-row>


  </div>
</template>

<script>
import {IdcardFilled,GoldFilled,BellFilled,ApiFilled,LockFilled,ScheduleFilled} from '@ant-design/icons-vue'
export default {
  name: 'ComActionPanel',
  components:{
    IdcardFilled,GoldFilled,BellFilled,ApiFilled,LockFilled,ScheduleFilled
  },
  methods:{
    edit(){
      ipc.send('addTab',{url:"https://s.apps.vip/user/info"})
    },
    go(url){
      ipc.send('addTab',{url:url})
    }
  }
}
</script>

<style scoped>

</style>
