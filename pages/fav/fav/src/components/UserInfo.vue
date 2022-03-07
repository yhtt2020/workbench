<template>
  <div class="user-info">

    <a-row v-if="userInfo.uid">
      <a-col flex="60px" >
        <a-avatar :src="userInfo.avatar" :size="50"></a-avatar>
      </a-col>
      <a-col flex="auto">
        <div ><a :href="userInfo.spaceUrl" target="_blank" class="nickname">{{userInfo.nickname}}</a></div>
        <div><a-progress title="剩余空间100%" :percent="100" size="small" /></div>
        <div><span class="logout" @click="logout()">登出</span></div>
      </a-col>
    </a-row>
    <a-row v-else style="text-align: center">
      <a-button size="small">登录</a-button>
    </a-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'UserInfo',
  props: {
    msg: String
  },
  computed:{
    ...mapState([
      'userInfo'
    ])
  },
  methods:{
    logout(){
      this.$store.commit('saveUserInfo',{uid:0})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user-info{
  margin-bottom: 10px;

}
.nickname{
  color: #333;
  cursor: pointer;
}
.logout{
  font-size: 12px;
  color:#999;
  cursor: pointer;
}
</style>
