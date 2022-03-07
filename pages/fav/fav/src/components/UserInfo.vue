<template>
  <div class="user-info">
    <a-row>
      <a-col flex="60px" >
        <a-avatar :src="userInfo.avatar" :size="50"></a-avatar>
      </a-col>
      <a-col :spa="12">
        <div ><a :href="userInfo.spaceUrl" target="_blank" class="nickname">{{userInfo.nickname}}</a></div>
        <div><a-progress title="剩余空间100%" :percent="100" size="small" /></div>
        <div><span class="logout">登出</span></div>
      </a-col>
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
