<template>
  <h3 style="margin-bottom: 1em;color:var(--primary-text)">我的社区</h3>
  <div>
    <a-row class="com-actions" :gutter="[20,20]">
      <a-col :span="8">
        <div @click="openUpdateMyInfo">
          <Emoji icon="edit"></Emoji>
          <div class="mt-2">
            修改资料
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div @click="go('https://s.apps.vip/user/points')">
          <Emoji icon="score"></Emoji>
          <div class="mt-2">积分明细</div>
        </div>
      </a-col>
      <a-col :span="8">
        <div @click="go('https://s.apps.vip/user/message')">
          <Emoji icon="message"></Emoji>
          <div class="mt-2">社区消息</div>
        </div>
      </a-col>
      <a-col :span="8">
        <div @click="go('https://s.apps.vip/user/account-info')">
          <Emoji icon="link"></Emoji>
          <div class="mt-2">账号绑定</div>
        </div>
      </a-col>
      <a-col :span="8">
        <div @click="go('https://s.apps.vip/user/passwd')">
          <Emoji icon="key"></Emoji>
          <div class="mt-2">修改密码</div>
        </div>
      </a-col>
      <a-col :span="8">
        <div @click="go('https://s.apps.vip/task')">
          <Emoji icon="task"></Emoji>
          <div class="mt-2">社区任务</div>
        </div>
      </a-col>
    </a-row>
  </div>
  <UpdateMyInfo ref="myInfoRef"></UpdateMyInfo>
</template>

<script>
import {IdcardFilled,GoldFilled,BellFilled,ApiFilled,LockFilled,ScheduleFilled} from '@ant-design/icons-vue'
import browser from '../../js/common/browser'
import UpdateMyInfo from './UpdateMyInfo.vue'
import Emoji from './Emoji.vue'
export default {
  name: 'ComActionPanel',
  components:{
    Emoji,
    IdcardFilled,GoldFilled,BellFilled,ApiFilled,LockFilled,ScheduleFilled,
    UpdateMyInfo
  },
  methods:{
    openUpdateMyInfo(){
      this.$refs.myInfoRef.openMyInfo()
    },
    edit(){
      browser.openInInner("https://s.apps.vip/user/info")
    },
    go(url){
      browser.openInInner(url)
    },
  }
}
</script>

<style scoped lang="scss">
.com-actions {
  & > div {
    cursor: pointer;
    border-radius: 0.2em;
    padding: 0.2em;

    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }

  text-align: center;
  font-size: 1.1em;
}
</style>
