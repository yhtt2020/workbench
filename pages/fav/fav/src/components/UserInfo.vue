<template>
  <div class="user-info">

    <a-row v-if="userInfo.uid">
      <a-col flex="60px">
        <a :href="getComProtocolUrl(config.userSpaceUrl)"><a-avatar :src="userInfo.avatar" :size="50"></a-avatar></a>
      </a-col>
      <a-col flex="auto">
        <div><a :href="getComProtocolUrl(config.userSpaceUrl)" target="_blank" class="nickname">{{ userInfo.nickname }}</a></div>
        <div>
          <a-progress title="剩余空间99%" :percent="99" size="small"/>
        </div>
        <div><span class="logout" @click="logout()">登出</span></div>
      </a-col>
    </a-row>
    <a-row v-else style="text-align: center">
      <div
        style="text-align: center;background: white;padding: 10px;border-radius: 4px;box-shadow: 0 0 4px rgba(124,124,124,0.35)">
        <a-button v-if="isApp" block type="primary" @click="goAppLogin()" size="small" style="margin-bottom: 10px">登录
        </a-button>
        <div style="font-size: 12px;text-align: left;color: #666">登录后即可使用<strong>云端同步</strong>和<strong>团队收藏夹</strong>功能。解锁全新协作模式。

          <a v-if="isApp"
             href="tsb://app/redirect/?package=com.thisky.helper&url=https://www.yuque.com/tswork/browser/gynywc">了解更多</a>
          <a v-else target="_blank" href="https://www.yuque.com/tswork/browser/gynywc">了解更多</a>

        </div>
      </div>

    </a-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import tools from '@/utils/tools'

export default {
  name: 'UserInfo',
  props: {
    msg: String
  },
  data () {
    return {
      isApp: window.isApp
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'config'
    ])
  },
  methods: {
    getComProtocolUrl:tools.getComProtocolUrl,
    logout () {
      this.$store.commit('saveUserInfo', { uid: 0 })
    },
    goAppLogin () {
      //开始循环监听登录事件，直至登录成功。清理掉监听器。
      window.ipc.send('addTab', { url: this.config.loginUrl })
      let timer = setInterval(() => {
        window.ipc.send('getUserInfo')
        if (this.userInfo.uid !== 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user-info {
  margin-bottom: 10px;

}

.nickname {
  color: #333;
  cursor: pointer;
}

.logout {
  font-size: 12px;
  color: #999;
  cursor: pointer;
}
</style>
